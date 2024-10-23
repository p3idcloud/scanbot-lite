import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from "yup";
import { Box, Typography, FormGroup, FormHelperText, Divider } from '@mui/material';
import { Formik, Form } from 'formik';
import * as uuid from "uuid";
import { useState } from 'react';
import { generateHistoryName } from "lib/helpers";
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { useScanner } from 'lib/contexts/scannerContext';
import { setCookie } from 'nookies';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("required"),
});

const StartSessionForm = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const { 
    privetToken, 
    scannerId,
    setSessionId,
    setStatusClaim,
    loadScannerHistory
  } = useScanner();

  const initialValues = {
    name: generateHistoryName(),
    description: "",
  };
  
  const handleSaveForm = () => {
    setStatusClaim(true);
  };

  const handleSubmit = (e, {resetForm}) => {
    setLoading(true);
    const commandId = uuid.v4();
    const data = {
      commandId: commandId,
      kind: "twainlocalscanner",
      name: e.name,
      description: e.description,
      method: "createSession",
    };
    const headers = {
      "x-twain-cloud-request-id": commandId,
      "x-privet-token": privetToken,
    };
    fetchData(`${process.env.BACKEND_URL}api/scanners/${scannerId}/twaindirect/session`, {
      headers,
      method: "POST",
      data,
    })
      .then((res) => {
        setSessionId(res?.results?.session?.sessionId);
        setCookie({},"sessionId", res?.results?.session?.sessionId);
        toast.success("Session Ready, Start capturing to scan document");
        handleSaveForm();
      })
      .then(() => {
        loadScannerHistory();
      })
      .catch((err) => {
        if (err?.results?.code === "busy") {
          toast.error("Scanner is busy, please try again later");
        } else {
          toast.error("Scanner offline, please check your scanner");
        }
      })
      .finally(() => {
        setLoading(false);
        resetForm();
        close();
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
              <>
                <Button
                  onClick={() => {
                    close();
                  }}
                  variant="outlined"
                  color="primaryBlack"
                  autoWidth
                  size="medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitForm}
                  variant="contained"
                  autoWidth
                  size="medium"
                  loading={loading}
                >
                  Start
                </Button>
              </>
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
              <Form style={{width: '100%'}}>
                <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                  Start Session
                </Typography>
                <Divider sx={{my: 4}}/>
                <FormGroup sx={{my: 1}}>
                    <InputField
                      label="Name"
                      fullWidth
                      id='name'
                      defaultValue={initialValues.name}
                      aria-invalid={Boolean(touched.name && errors.name)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Name"
                      error={Boolean(errors.name)}
                    />
                    <Typography sx={{color: "red.main"}}>{errors.name}</Typography>
                </FormGroup>
                <FormGroup>
                  <InputField
                    label="Description"
                    variant="outlined"
                    id="description"
                    fullWidth
                    multiline
                    minRows={3}
                    aria-invalid={Boolean(
                        touched.description && errors.description
                      )}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    placeholder="Description"
                  />
                </FormGroup>
              </Form>
            </Box>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default StartSessionForm;
