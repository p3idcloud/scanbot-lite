import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import uuid from "uuid";
import { Modal, Box } from "@mui/material";
import CustomLoader from "components/Loader";
import RegularButton from "components/CustomButtons/Button";
import { parseCookies } from "nookies";
import useSWR from "swr";
import { fetchData } from "lib/fetch";

export const ScannerContext = createContext(null);

const headers = { "x-twain-cloud-request-id": uuid.v4() };

export const ScannerProvider = ({
  children,
  requestId,
  sessionId,
  setSessionId,
  setStartCapture,
  setFiles,
  setStatusClaim,
  loadingCapture,
  setLoadingCapture,
}) => {
    const [privetToken, setPrivetToken] = useState(0);
    const [scannerHistory, setScannerHistory] = useState(null);
    const [detailScanner, setDetailScanner] = useState(null);
    const [statusPoll, setStatusPoll] = useState(null);
    const [infoexStatus, setInfoexStatus] = useState(false);
    const [loadingInfoex, setLoadingInfoex] = useState(false);
    const [statusScanner, setStatusScanner] = useState(true);
    const [usedBy, setUsedBy] = useState(null);

    const router = useRouter();
    const { scannerId } = router?.query;

    
    const { data, error, isValidating } = useSWR(
        `${process.env.backendUrl}api/scanners/${scannerId}`,
        fetchData
    );

    useEffect(() => {
        if (data) {
            setDetailScanner(data.scanner ?? null);
        }
    }, [data]);

    useEffect(() => {
        if (data !== "undefined") {
        setStatusPoll(data);
        setPrivetToken(data?.xPrivetToken);
        setFiles(data?.imageUrl);
        }
    }, [data]);
    useEffect(() => {
        if (data?.sessionId?.length > 0) {
        setStartCapture(true);
        }
        if (parseCookies()["sessionId"] && data?.sessionId?.length > 0) {
        setStatusClaim(true);
        }
    });

    function handleInfoex() {
        setLoadingInfoex(true);
        fetchData(`${process.env.backendUrl}api/scanners/${scannerId}/infoex`, {
        headers,
        })
        .then((res) => {
            setPrivetToken(res["x-privet-token"]);
            setStatusScanner(true);
        })
        .catch((err) => {
            if (err?.response?.status === 404) {
            toast.error("Api infoex not found");
            }
            toast.error("Error Infoex");
            setInfoexStatus(true);
            setStatusScanner(false);
        })
        .finally(() => {
            setLoadingInfoex(false);
        });
    }

    const handleRefresh = () => {
        setInfoexStatus(false);
        handleInfoex();
    };

    const handleLoadingInfoex = () => {
        setLoadingInfoex(true);
    };

    useEffect(() => {
        if (data?.sessionId?.length === 0 || !data) {
        handleInfoex();
        }
    }, []);

    useEffect(() => {
        setUsedBy(error?.response?.data?.usedBy?.name || null);
    });

    async function loadScanner(item = null, type = null) {
        try {
        if (type === "delete") {
            return loadScannerHistory();
        }
            loadScannerHistory();
            loadScannerDetail();
        } catch {
            toast.error("Api error something");
        }
    }

    function loadScannerHistory(page = 1) {
        fetchData(`${process.env.backendUrl}api/scanners/history`, {
        headers,
        params: {
            scannerId,
            sort: "-createdAt",
            page,
        },
        })
        .then((res) => {
            setScannerHistory(res ?? null);
        })
        .catch((err) => toast.error("Api error something"));
    }
    function loadScannerDetail() {
        fetchData(`${process.env.backendUrl}api/scanners/${scannerId}?ui=true`)
        .then((res) => {
            setDetailScanner(res.scanner ?? null);
        })
        .catch((err) => toast.error("Api error something"));
    }

    return (
        <ScannerContext.Provider
            value={{
                scannerHistory,
                detailScanner,
                scannerId,
                setScannerHistory,
                requestId,
                privetToken,
                sessionId,
                setSessionId,
                statusPoll,
                setStartCapture,
                loadingCapture,
                setLoadingCapture,
                loadScanner,
                statusScanner,
                setStatusScanner,
                handleRefresh,
                loadScannerHistory,
                usedBy,
            }}
        >
        {children}
        <Modal
            open={loadingInfoex}
        >
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
                <CustomLoader message="Checking Scanner" />
            </Box>
        </Modal>
        <Modal 
            open={infoexStatus}
        >
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
                <Box py={4}>
                    <h3>Scanner Error, Please check the service</h3>
                </Box>
                <Box my={4} display='flex' justifyContent='center'>
                    <RegularButton color="primary" onClick={handleRefresh}>
                        Retry
                    </RegularButton>
                    <RegularButton color="primary" onClick={()=>setInfoexStatus(false)}>
                        OK
                    </RegularButton>
                </Box>
            </Box>
        </Modal>
        </ScannerContext.Provider>
    );
};

export const useScanner = () => {
    const {
        scannerHistory,
        detailScanner,
        scannerId,
        setScannerHistory,
        requestId,
        privetToken,
        sessionId,
        setSessionId,
        statusPoll,
        setStartCapture,
        loadingCapture,
        setLoadingCapture,
        loadScanner,
        statusScanner,
        setStatusScanner,
        handleRefresh,
        loadScannerHistory,
        usedBy,
    } = useContext(ScannerContext);

    return {
        scannerHistory,
        detailScanner,
        scannerId,
        setScannerHistory,
        requestId,
        privetToken,
        sessionId,
        setSessionId,
        statusPoll,
        setStartCapture,
        loadingCapture,
        setLoadingCapture,
        loadScanner,
        statusScanner,
        setStatusScanner,
        handleRefresh,
        loadScannerHistory,
        usedBy,
    };
}
