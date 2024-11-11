import { useMemo, useState } from "react";
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
    setStartCapture,
    loadingInfoex
  } = useScanner();

  const getStopSession = (callback) => {
    setCloseCloud(() => callback);
  }
  const handleOnClick = () => {
    getStopSession(stopSession);
    if (!statusScanner || statusPoll?.status == "offline") {
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
    fetchData(`api/scanners/${id}/twaindirect/session`, {
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
          mutate(`api/scanners/${scannerId}/analytic`);
          setLoading(false);
        }, 1000)
      });
  };

  const buttonText = useMemo(() => {
    if (statusPoll?.status === "offline") {
      return "Re-start Scanner";
    }
    if (statusClaim && statusPoll?.state !== "noSession") {
      return "Stop Session";
    }
    if (!statusScanner) {
      return "Re-start Scanner";
    }
    return "Start Session";
  }, [statusClaim, statusPoll, statusScanner]);

  return (
    <>
      {
        loadingInfoex ? (
          <Button 
            startIcon={<HiOutlineLightningBolt />} 
            color={'lightBlue'}
            sx={{ width: 'fit-content', fontSize: 13 }}
            loading={loadingInfoex}
            // onClick={handleOnClick}
          >
            Checking Scanner
          </Button>
        ) : (
          <Button 
            startIcon={<HiOutlineLightningBolt />} 
            color={statusClaim && statusPoll?.state !== "noSession" ? 'red' : 'primary'}
            sx={{ width: 'fit-content', fontSize: 13 }}
            loading={loading || statusPoll?.state === "capturing"}
            onClick={handleOnClick}
          >
            {buttonText}
          </Button>
        )
      }
      
      <StartSessionForm 
        open={openSession}
        close={()=>setOpenSession(false)}
      />
    </>
  );
}
