import { useState } from "react";
import { Form, Formik } from "formik";
import { fetchData } from "lib/fetch";
import { toast } from "react-toastify";
import uuid from "uuid";
import * as Yup from "yup";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { generateHistoryName } from "lib/helpers";

import { useScanner } from "lib/contexts/scannerContext";
import { Box, FilledInput, FormGroup, FormHelperText, InputLabel, Modal } from "@mui/material";
import RegularButton from "components/CustomButtons/Button";
import ButtonWithLoader from "components/CustomButtons/ButtonWithLoader";
import { mutate } from "swr";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("required"),
});

export default function StartSession({
  getStopSession,
}) {
  const [openHistory, setOpenHistory] = useState(false);
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
    usedBy,
    resetStatusClaimStates
  } = useScanner();

  let initialValues = {
    name: generateHistoryName(),
    description: "",
  };
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
      setOpenHistory(!openHistory);
    }
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

  // const handleStatus = () => {
  //   const statusState = statusPoll?.state?.toLowerCase();
  //   const status = statusPoll?.status?.toLowerCase();
  //   if (
  //     statusState === 'ready' ||
  //     (status == "paperjam" && statusState == "capturing") ||
  //     (status == "nomedia" && statusState == "capturing")
  //   ) {
  //     return true;
  //   }

  //   return false;
  // };
  return (
    <>
      <div>
        {usedBy ? (
          <RegularButton
            disabled={true}
          >
            <strong>In Use</strong>
          </RegularButton>
        ) : (
          <RegularButton
            color={statusClaim && statusPoll?.state !== "noSession" ? 'primary' : 'info'}
            onClick={handleStartSession}
          >
            <strong>
              {statusClaim && statusPoll?.state !== "noSession"
                ? "Stop Session"
                : !statusScanner
                ? "Re-start Scanner"
                : "Start Session"}
            </strong>
          </RegularButton>
        )}
      </div>
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
