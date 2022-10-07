import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { parseCookies } from "nookies";
import { useScanner } from "lib/contexts/scannerContext";
import { useRouter } from "next/router";
import { Icon } from "@material-ui/core";
import RegularButton from "components/CustomButtons/Button";
import { fetchData } from "lib/fetch";
import { capitalize } from "lib/helpers";
import ButtonWithLoader from "components/CustomButtons/ButtonWithLoader";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

export default function StartCapture() {
  const {
    statusPoll,
    setStartCapture,
    privetToken,
    requestId,
    setLoadingCapture,
    statusClaim
  } = useScanner();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { scannerId } = router?.query;

  const handleCapture = () => {
    setLoading(true);
    const data = {
      commandId: requestId,
      kind: "twainlocalscanner",
      method: "startCapturing",
      params: {
        sessionId: parseCookies()["sessionId"],
      },
    };
    const headers = {
      "x-twain-cloud-request-id": requestId,
      "x-privet-token": privetToken,
    };
    fetchData(`${process.env.backendUrl}api/scanners/${scannerId}/twaindirect/session`, {
      headers,
      method: "POST",
      data,
    })
      .then((res) => {
        setLoadingCapture(true);
      })
      .catch((err) =>
        toast.error(
          `Api /api/scanners/${scannerId}/twaindirect/session not found`
        )
      )
      .finally(() => setLoading(false));
    setStartCapture(true);
  };
  return (
    <Card>
      <CardHeader color="info">
        <h1>Capture Scan</h1>
      </CardHeader>
      <CardBody>
        <h2>Click the button to start scanning</h2>

        {loading ? (
          <ButtonWithLoader loading={loading} color="primary">
            ...
          </ButtonWithLoader>
        ) : (
          <RegularButton
              color="primary"
              disabled={
                  !statusClaim ||
                  statusPoll?.status === "capturing" ||
                  statusPoll?.state !== "ready"
              }
              onClick={handleCapture}
          >
            <>
            {statusPoll?.state !== "ready" ? (
                <>
                <Box display='flex' alignItems='center' justifyContent='center'>
                    <p>{capitalize(statusPoll?.state ?? '')}</p>
                </Box>
                </>
            ) : (
                <>
                <Icon>print</Icon>
                <p>
                    {statusPoll?.status !== "capturing" && "Start "} Capturing
                </p>
                </>
            )}
            </>
          </RegularButton>
        )}
      </CardBody>
    </Card>
    );
}
