import Button from 'components/Button';
import Modal from 'components/Modal';
import * as Yup from "yup";
import SettingsIcon from 'components/SettingsIcon';
import { Box, Typography, FormGroup, Divider, Grid, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import Select from 'components/Select';
import Image from 'next/image';
import { mergePdf } from 'lib/helpers';
import { v1 as uuid } from 'uuid';
import { useAccount } from 'lib/contexts/accountContext';
import Settings from './Settings';

const validationSchema = Yup.object().shape({
  type: Yup.string().required("required")
});

const DocSumoForm = ({ open, close, pdfBlobs, fileUrls }) => {
  const [loading, setLoading] = useState(false);
  const [initialApi, setInitialApi] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [documentList, setDocumentList] = useState(null);
  const [submitResponse, setSubmitResponse] = useState(null);

  const { account } = useAccount();
  const initialValues = {
    type: ''
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

  useEffect(() => {
    if (open) {
        const headers = {
            "X-API-KEY": account.docsumoApiKey,
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
                toast.error("Failed to retrieve Docsumo account, invalid api key");
            })
            .finally(() => {
                setInitialApi(true);
            });
    } else {
        setInitialApi(false);
    }
  }, [open])

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
        "X-API-KEY": account.docsumoApiKey,
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
    <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
        {({ values, errors, touched, handleChange, handleBlur, submitForm, resetForm }) => {
            return (
            <Modal
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
                            loading={loading || !initialApi}
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
                                onClick={documentList ? submitForm : () => {
                                    close();
                                    setSettingsOpen(true);
                                }}
                                variant="contained"
                                autoWidth
                                size="medium"
                                loading={loading || !initialApi}
                                >
                                {documentList ? 'Upload' : 'Go to Settings'}
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
                    {!initialApi ? (
                        <CircularProgress />
                    ): (
                        submitResponse ? (
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
                                    <Grid item xs={12} display='flex' justifyContent='space-between'>
                                        <Typography fontSize='15px'>
                                            Document Id:
                                        </Typography>
                                        <Typography textAlign='end' fontSize='15px'>
                                            {submitResponse?.data?.document?.[0]?.doc_id}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} display='flex' justifyContent='space-between'>
                                        <Typography fontSize='15px'>
                                            User Document Id:
                                        </Typography>
                                        <Typography textAlign='end' fontSize='15px'>
                                            {submitResponse?.data?.document?.[0]?.user_doc_id}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} display='flex' justifyContent='space-between'>
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
                                <Box>
                                    <Typography textAlign='center' fontSize="18px" fontWeight={600}>
                                        Invalid Docsumo Api Key
                                    </Typography>
                                    <Typography textAlign='center' fontWeight={500}>
                                        Navigate to:
                                    </Typography>
                                    <Box display='flex' alignItems='center' justifyContent='center' my={1}>
                                        <SettingsIcon /> 
                                        <Typography sx={{ml: 1}}>
                                            {'>'} Setting {'>'} Docsumo Api Key
                                        </Typography>
                                    </Box>
                                    <Typography textAlign='center'>
                                        Or click on <span style={{fontWeight: 600}}>Go to Settings</span> button
                                    </Typography>
                                </Box>
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
                        )
                    )}
                </Box>
            </Modal>
            );
        }}
        </Formik>
        <Settings
            open={Boolean(settingsOpen)}
            close={()=>setSettingsOpen(false)}
        />
    </>
  );
};

export default DocSumoForm;
