import { fetchData } from "lib/fetch";
import { constructTwainPayloadTask } from 'lib/task';
import { useState } from "react";
import { toast } from "react-toastify";

import { useDispatch } from 'react-redux';
import { updateDefinition } from 'redux/actions/scannerActions';
import ButtonWithLoader from "components/CustomButtons/ButtonWithLoader";
import { parseCookies } from "nookies";
import { useScanner } from "lib/contexts/scannerContext";

export default function ProfileScanner() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
    const {
    privetToken,
    requestId,
    scannerId,
    profileSelect,
    listScannerSettings
  } = useScanner();
 
  const handleConfig = () => {
    const task = constructTwainPayloadTask(profileSelect.scannerSettings, listScannerSettings);
    setLoading(true)
    const data = {
      commandId: requestId,
      kind: "twainlocalscanner",
      method: "sendTask",
      params: {
        sessionId: parseCookies()["sessionId"],
        task
      },
    };
    const headers = {
      "x-twain-cloud-request-id": requestId,
      "x-privet-token": privetToken,
    };
    fetchData(
      `${process.env.BACKEND_URL}api/scanners/${scannerId}/twaindirect/session`,
      {
        headers,
        method: "POST",
        data,
      }
    )
      .then((res) => {
        toast.success("Successfully");
        dispatch(updateDefinition(profileSelect));
      })
      .catch((err) =>
        toast.error("Save profile error")
      )
      .finally(() => setLoading(false));
  }

  return (
    <div className="pl-2 text-sm">
      <ButtonWithLoader
        loading={loading}
        onClick={handleConfig}
        
      >
        Send Config
      </ButtonWithLoader>
    </div>
  );
}
