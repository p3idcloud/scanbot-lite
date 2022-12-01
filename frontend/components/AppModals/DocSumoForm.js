import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from "yup";
import { Box, Typography, FormGroup, Divider } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import Select from 'components/Select';
import { DOCUMENT_TYPES } from 'constants/documentTypes';
import { convertDocumentTypeToLabel } from 'lib/helpers';
import Image from 'next/image';

const documentList = DOCUMENT_TYPES.map(type => ({
    label: convertDocumentTypeToLabel(type),
    value: type
}))

const validationSchema = Yup.object().shape({
  type: Yup.string().required("required"),
  apikey: Yup.string().required("required"),
});

const DocSumoForm = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);

  const initialValues = {
    type: null,
    apiKey: null,
  };
  

  const handleSubmit = (e) => {
    setLoading(true);
    const data = {
        files: {},
        type: e.type
    };
    const headers = {
      "X-API-KEY": e.apiKey,
    };
    fetchData('https://app.docsumo.com/api/v1/eevee/apikey/upload/', {
      headers,
      method: "POST",
      data,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
            return res.json();
        }
        throw new Error();
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, submitForm }) => {
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
                            }}
                            variant="outlined"
                            color="primaryBlack"
                            autoWidth
                            size="medium"
                        >
                            Cancel
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
                        <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                            Success!
                        </Typography>
                        <Image src='/docsumo.png' width={200} height={200} />
                        <Typography>
                            {JSON.stringify(submitResponse, undefined, 2)}
                        </Typography>
                    </>
                ) : (
                    <Form style={{width: '100%'}}>
                      <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                        Upload to DocSumo
                      </Typography>
                      <Divider sx={{my: 4}}/>
                      <FormGroup sx={{my: 1}}>
                          <Select
                              label="Scan Profile"
                              value={values.type}
                              lists={documentList}
                              onChange={handleChange}
                          />
                          <Typography sx={{color: "red.main"}}>{errors.name}</Typography>
                      </FormGroup>
                      <FormGroup>
                        <InputField
                          label="Api Key"
                          variant="outlined"
                          id="apikey"
                          fullWidth
                          multiline
                          minRows={3}
                          aria-invalid={Boolean(
                              touched.description && errors.description
                            )}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.apikey}
                          placeholder="Api Key"
                        />
                      </FormGroup>
                    </Form>
                )}
            </Box>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default DocSumoForm;
