import Button from 'components/Button';
import Modal from 'components/Modal';
import * as Yup from "yup";
import { Avatar, Box, Typography, FormGroup, InputLabel, FilledInput, FormHelperText } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { generateHistoryName } from "lib/helpers";
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("required"),
});

const StartSessionForm = ({ open }) => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: generateHistoryName(),
    description: "",
  };
  
  const handleSaveForm = () => {
    setStatusClaim(true);
    handleOpenForm();
  };

  const handleSubmit = (e) => {
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
    fetchData(`${process.env.backendUrl}api/scanners/${scannerId}/twaindirect/session`, {
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
        fetchData(`${process.env.backendUrl}api/scanners/history`, {
          headers,
          params: {
            scannerId,
            sort: "-createdAt",
            page: 1,
          },
        })
          .then((res) => setScannerHistory(res?.data ?? []))
          .catch((err) => {});
      })
      .catch(() => {
        toast.error("Scanner offline, please check your scanner");
      })
      .finally(() => setLoading(false));
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => {
        return (
          <Modal
            open={open}
            customBodyFooter={
              <>
                <Button
                  onClick={() => {
                    onClose(false);
                  }}
                  variant="outlined"
                  color="primaryBlack"
                  autoWidth
                  size="medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
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
              >
                <Form>
                  <div>
                    <h3>
                      Start Session
                    </h3>
                    <FormGroup>
                      <InputLabel><h4>Name</h4></InputLabel>
                      <FilledInput
                          id='name'
                          defaultValue={initialValues.name}
                          aria-invalid={Boolean(touched.name && errors.name)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Name"
                      />
                      <FormHelperText>
                          <p>{errors.description}</p>
                      </FormHelperText>
                    </FormGroup>
                    <FormGroup>
                      <InputLabel><h4>Description</h4></InputLabel>
                      <FilledInput
                          id="description"
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
                      <FormHelperText>
                          <p>{errors.description}</p>
                      </FormHelperText>
                    </FormGroup>
                  </div>
                </Form>
              </Box>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default StartSessionForm;
