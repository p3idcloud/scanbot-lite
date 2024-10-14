import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from "yup";
import { Box, Typography, FormGroup, Divider, Grid2 as Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { useMemo, useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import Select from 'components/Select';
import Image from 'next/image';
import { mergePdf } from 'lib/helpers';
import { v1 as uuid } from 'uuid';
import { useAccount } from 'lib/contexts/accountContext';

const validationSchema = Yup.object().shape({
  type: Yup.string().required("required"),
  apiKey: Yup.string().required("required"),
});

const DocSumoForm = ({ open, close, pdfBlobs, fileUrls }) => {
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState(null);
  const [submitResponse, setSubmitResponse] = useState(null);

  const { account } = useAccount();
  const initialValues = {
    type: '',
    apiKey: account?.docsumoApiKey ?? null,
  };

  const selectDocumentList = useMemo(() => {
    if (documentList) {
        return documentList.map(document => ({
            label: document.title,
            value: document.value
        }))
    } 
    return null;
  }, [documentList]);
  
  const handleApiKeySubmit = (value) => {
    setLoading(true);
    const headers = {
        "X-API-KEY": value.apiKey,
    };
    fetch('https://app.docsumo.com/api/v1/eevee/apikey/limit/ ', {
        headers,
        method: "GET"
    })
        .then((res) => {
        if (res.status === 200) {
            return res.json();
        }
        throw new Error();
        })
        .then((res) => {
        setDocumentList(res?.data?.document_types);
        toast.success("Found Docsumo account");
        })
        .catch(() => {
        toast.error("Failed to retrieve Docsumo account");
        })
        .finally(() => {
        setLoading(false);
        });
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    if (!fileUrls && !pdfBlobs) {
        toast.error("Failed to upload document!");
        setLoading(false);
        return false;
    }
    var pdfBlobList;
    if (!pdfBlobs && fileUrls) {
        // Then we need to convert it to blobs first
        pdfBlobList = await Promise.all(fileUrls.map(url => {
            return fetch(url)
                .then((res) => res.blob())
                .then((data) => data)
                .catch(err => {
                    toast.error("Failed to merge documents");
                    setLoading(false);
                    return false;
                })
        }))
    }

    const [mergedPdf, error] = await mergePdf(pdfBlobs || pdfBlobList);
    if (error)  {
        toast.error("Failed to merge documents");
        setLoading(false);
        return false;
    }
    const headers = {
        "X-API-KEY": e.apiKey,
    };
    const documentId = uuid();
    let formData = new FormData();
    formData.append("files", mergedPdf, `${documentId}.pdf`);
    formData.append("type", e.type);
    formData.append("user_doc_id", documentId);
    fetchData('https://app.docsumo.com/api/v1/eevee/apikey/upload/', {
        headers,
        method: "POST",
        data: formData,
    })
        .then((res) => {
          console.log(res);
          setSubmitResponse(res);
          toast.success("Uploaded document to docsumo!");
        })
        .catch(() => {
          toast.error("Failed to upload document!");
        })
        .finally(() => {
          setLoading(false);
        });
  };
  
  return (
      (<Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
          {({ values, errors, touched, handleChange, handleBlur, submitForm, resetForm }) => {
            return (
                (<Modal
                  open={open}
                  customBodyFooter={
                      submitResponse ? (
                          <Button
                              onClick={() => {
                                  resetForm();
                                  close();
                                  setSubmitResponse(null);
                                  setDocumentList(null);
                              }}
                              variant="contained"
                              autoWidth
                              size="medium"
                              loading={loading}
                          >
                              Done
                          </Button>
                      ) : (
                          <>
                              <Button
                                  onClick={() => {
                                      resetForm();
                                      close();
                                      setDocumentList(null);
                                  }}
                                  variant="outlined"
                                  color="primaryBlack"
                                  autoWidth
                                  size="medium"
                              >
                                  Cancel
                              </Button>
                              <Button
                                  onClick={documentList ? submitForm : () => handleApiKeySubmit(values)}
                                  variant="contained"
                                  autoWidth
                                  size="medium"
                                  loading={loading}
                                  >
                                  Submit
                              </Button>
                          </>
                      )
                  }
                >
                    <Box
                      display='flex'
                      padding={4}
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      width={1}
                    >
                        {submitResponse ? (
                            <>
                                <Box display='flex' alignItems='center'>
                                    <Image src='/docsumo.png' width={200} height={200} />
                                    <Typography fontWeight={700} fontSize="32px" lineHeight='28px' sx={{color: '#4D61FC'}}>
                                        Upload Success!
                                    </Typography>
                                </Box>
                                <Divider sx={{my: 4, width: 1}}/>
                                <Typography fontWeight={700} fontSize="20px" lineHeight='28px' sx={{color: '#4D61FC'}} mb={2}>
                                    Submission Details
                                </Typography>
                                <Grid container>
                                    <Grid display='flex' justifyContent='space-between' size={12}>
                                        <Typography fontSize='15px'>
                                            Document Id:
                                        </Typography>
                                        <Typography textAlign='end' fontSize='15px'>
                                            {submitResponse?.data?.document?.[0]?.doc_id}
                                        </Typography>
                                    </Grid>
                                    <Grid display='flex' justifyContent='space-between' size={12}>
                                        <Typography fontSize='15px'>
                                            User Document Id:
                                        </Typography>
                                        <Typography textAlign='end' fontSize='15px'>
                                            {submitResponse?.data?.document?.[0]?.user_doc_id}
                                        </Typography>
                                    </Grid>
                                    <Grid display='flex' justifyContent='space-between' size={12}>
                                        <Typography fontSize='15px'>
                                            File Name:
                                        </Typography>
                                        <Typography textAlign='end' fontSize='15px'>
                                            {submitResponse?.data?.document?.[0]?.title}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography mt={2}>
                                    <a href={submitResponse?.data?.document?.[0]?.review_url} target="_blank" style={{
                                        color: '#4D61FC',
                                        fontWeight: 700,
                                        textDecoration: 'none'
                                    }}>
                                        Click Here
                                    </a> to review your submission
                                </Typography>
                            </>
                        ) : (
                            <Form style={{width: '100%'}}>
                              <Typography fontWeight={600} fontSize="20px" lineHeight='28px' sx={{color: '#4D61FC'}}>
                                Upload to DocSumo
                              </Typography>
                              <Divider sx={{my: 4}}/>
                              {!documentList ? (
                                <FormGroup>
                                    <InputField
                                    label="Api Key"
                                    variant="outlined"
                                    id="apiKey"
                                    fullWidth
                                    aria-invalid={Boolean(
                                        touched.description && errors.description
                                        )}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.apiKey}
                                    placeholder="Api Key"
                                    />
                                </FormGroup>
                              ) : (
                                <FormGroup sx={{my: 1}}>
                                    <Select
                                        label="Document Type"
                                        value={values.type}
                                        lists={selectDocumentList}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="type"
                                        aria-invalid={Boolean(
                                          touched.type && errors.type
                                        )}
                                    />
                                    <Typography sx={{color: "red.main"}}>Select a document type</Typography>
                                </FormGroup>
                              )}
                            </Form>
                        )}
                    </Box>
                </Modal>)
            );
          }}
      </Formik>)
  );
};

export default DocSumoForm;
