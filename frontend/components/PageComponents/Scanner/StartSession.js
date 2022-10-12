import { useState } from "react";
import { Form, Formik } from "formik";
import { fetchData } from "lib/fetch";
import uuid from "uuid";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { useScanner } from "lib/contexts/scannerContext";
import { Box, FilledInput, FormGroup, FormHelperText, InputLabel, Modal } from "@mui/material";
import RegularButton from "components/CustomButtons/Button";
import ButtonWithLoader from "components/CustomButtons/ButtonWithLoader";
import { mutate } from "swr";
import Button from "components/Button";
import { HiOutlineLightningBolt } from 'react-icons/hi';

const StartSessionForm = dynamic(() => import("components/AppModals/StartSessionForm"), {
  ssr: false
})
import dynamic from "next/dynamic";


export default function StartSession() {
  const [openSession, setOpenSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    scannerId,
    setScannerHistory,
    requestId,
    privetToken,
    setSessionId,
    sessionId,
    setLoadingCapture,
    loadScannerHistory,
    statusClaim,
    setStatusClaim,
    statusScanner,
    handleRefresh,
    statusPoll,
    resetStatusClaimStates,
    setCloseCloud
  } = useScanner();

  const getStopSession = (callback) => {
    setCloseCloud(() => callback);
  }
  const handleStartSession = () => {
    getStopSession(stopSession);
    if (!statusScanner) {
      return handleRefresh();
    }
    if (statusClaim && statusPoll?.state !== "noSession") {
      return stopSession(scannerId);
    }
    return handleOpenForm();
  };
  const handleOpenForm = () => {
    if (!loading) {
      setOpenSession(!openSession);
    }
  };

  const stopSession = (id) => {
    const session_id = parseCookies()["sessionId"];

    const commandId = uuid.v4();
    const headers = {
      "x-twain-cloud-request-id": commandId,
      "x-privet-token": privetToken,
    };
    const data = {
      commandId: commandId,
      kind: "twainlocalscanner",
      method: "closeSession",
      params: {
        sessionId: session_id,
      },
    };
    fetchData(`${process.env.backendUrl}api/scanners/${id}/twaindirect/session`, {
      headers,
      method: "POST",
      data,
    })
      .catch((err) => setStatusClaim(false))
      .finally(() => {
        destroyCookie({}, "sessionId");
        setLoadingCapture(false);
        setStatusClaim(false);
        resetStatusClaimStates();
        setTimeout(() => {
          loadScannerHistory();
          mutate(`${process.env.backendUrl}api/scanners/${scannerId}/analytic`);
        }, 1000)
      });
  };

  return (
    <>
      <Button 
        startIcon={<HiOutlineLightningBolt />} 
        color={statusClaim && statusPoll?.state !== "noSession" ? 'red' : 'primary'}
        sx={{ width: 'fit-content', fontSize: 13 }} 
        onClick={handleStartSession}
      >
        {statusClaim && statusPoll?.state !== "noSession"
                  ? "Stop Session"
                  : !statusScanner
                  ? "Re-start Scanner"
                  : "Start Session"
        }
      </Button>
      <StartSessionForm 
        open={openSession}
      />
    </>
  )

  return (
    <>
      <Modal open={openHistory}>
        <Box
          display='flex' 
          sx={{
              position: 'absolute',
              boxShadow: 24,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
          }}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => {
              return (
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
                  <div>
                    <ButtonWithLoader
                      loading={loading}
                      color='info'
                      type="submit"
                    >
                      Start
                    </ButtonWithLoader>
                    {!loading && (
                      <RegularButton
                        type="reset"
                        color='info'
                        onClick={handleOpenForm}
                        style={{marginLeft: 5}}
                      >
                        Cancel
                      </RegularButton>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
}
