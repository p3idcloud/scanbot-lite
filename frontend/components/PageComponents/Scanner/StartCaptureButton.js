import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useScanner } from "lib/contexts/scannerContext";
import { fetchData } from "lib/fetch";
import { capitalize } from "lib/helpers";
import Button from "components/Button";
import { RiLoaderLine, RiPrinterLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function StartCaptureButton() {
    const {
        scannerId,
        statusPoll,
        setStartCapture,
        privetToken,
        requestId,
        setLoadingCapture,
        statusClaim
    } = useScanner();

    const [loading, setLoading] = useState(false);
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
        fetchData(`api/scanners/${scannerId}/twaindirect/session`, {
            headers,
            method: "POST",
            data,
        })
        .then((res) => {
            setLoadingCapture(true);
        })
        .catch((err) => toast.error('Twaindirect session not found'))
        .finally(() => setLoading(false));
        setStartCapture(true);
    };

    const getDisabled = () => {
        return !statusClaim ||
        statusPoll?.status === "capturing" ||
        statusPoll?.state !== "ready";
    }

    return (
        <Button 
            loading={loading || getDisabled()} 
            autoWidth
            size="medium"
            color={getDisabled() ? "black" : "green"}
            onClick={handleCapture}
            startIcon={statusPoll?.status !== "capturing" ? (
                <RiPrinterLine size={16}/>
            ) : (
                <RiLoaderLine size={16}/>
            )}
        >
            {statusPoll?.state !== "ready" ? (
                capitalize(statusPoll?.state ?? '')
            ) : (
                `${statusPoll?.status !== "capturing" && "Start "} Capturing`
            )}
        </Button>
    );
}
