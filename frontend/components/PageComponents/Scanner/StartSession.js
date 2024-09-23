import { useState } from "react";
import { fetchData } from "lib/fetch";
import * as uuid from "uuid";
import { destroyCookie, parseCookies } from "nookies";

import { useScanner } from "lib/contexts/scannerContext";
import { mutate } from "swr";
import Button from "components/Button";
import { HiOutlineLightningBolt } from 'react-icons/hi';
import dynamic from "next/dynamic";


const StartSessionForm = dynamic(() => import("components/AppModals/StartSessionForm"), {
  ssr: false
})

export default function StartSession() {
  const [openSession, setOpenSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    scannerId,
    privetToken,
    setLoadingCapture,
    loadScannerHistory,
    statusClaim,
    setStatusClaim,
    statusScanner,
    handleRefresh,
    statusPoll,
    resetStatusClaimStates,
    setCloseCloud,
    setStartCapture
  } = useScanner();

  const getStopSession = (callback) => {
    setCloseCloud(() => callback);
  }
  const handleOnClick = () => {
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
    setLoading(true);
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
    fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/scanners/${id}/twaindirect/session`, {
      headers,
      method: "POST",
      data,
    })
      .finally(() => {
        destroyCookie({}, "sessionId");
        setLoadingCapture(false);
        setStartCapture(false);
        setStatusClaim(false);
        resetStatusClaimStates();
        setTimeout(() => {
          loadScannerHistory();
          mutate(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/scanners/${scannerId}/analytic`);
          setLoading(false);
        }, 1000)
      });
  };

  return (
    <>
      <Button 
        startIcon={<HiOutlineLightningBolt />} 
        color={statusClaim && statusPoll?.state !== "noSession" ? 'red' : 'primary'}
        sx={{ width: 'fit-content', fontSize: 13 }}
        loading={loading || statusPoll?.state === "capturing"}
        onClick={handleOnClick}
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
        close={()=>setOpenSession(false)}
      />
    </>
  );
}
