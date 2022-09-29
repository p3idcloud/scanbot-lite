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
  statusClaim,
  setStatusClaim,
  loadingCapture,
  setLoadingCapture,
  closeCloud,
  setCloseCloud
}) => {
    const [privetToken, setPrivetToken] = useState(0);
    const [scannerSettings, setScannerSettings] = useState([]);
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
        `${process.env.backendUrl}api/scanners/${scannerId}?ui=true`,
        fetchData
    );
    const scannerStateData = useSWR(
        `${process.env.backendUrl}api/scanners/state/${scannerId}`,
        fetchData,
        {
            refreshInterval: 1000
        }
    ).data;
    const scannerSettingsData = useSWR(
        `${process.env.backendUrl}api/scannersetting`,
        fetchData
    ).data;

    useEffect(() => {
        if (data) {
            setDetailScanner(data.scanner ?? null);
        }
    }, [data]);
    useEffect(() => {
        if (scannerSettingsData) {
            setScannerSettings(scannerSettingsData.data ?? []);
        }
    },[scannerSettingsData])
    useEffect(() => {
        if (scannerStateData) {
            setStatusPoll(scannerStateData);
            setPrivetToken(scannerStateData?.xPrivetToken);
            setFiles(scannerStateData?.imageUrl);
        }
    }, [scannerStateData]);
    useEffect(() => {
        if (scannerStateData?.sessionId?.length > 0) {
            setStartCapture(true);
        }
        if (parseCookies()["sessionId"] && scannerStateData?.sessionId?.length > 0) {
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

    function loadScannerHistory(page = 1, rowsPerPage = 5, setRowCount = (_) => {}) {
        fetchData(`${process.env.backendUrl}api/scanners/history`, {
        headers,
        params: {
            scannerId,
            limit: rowsPerPage,
            sort: "-createdAt",
            page,
        },
        })
        .then((res) => {
            setScannerHistory(res.data ?? null);
            setRowCount(res?.dataCount ?? 0);
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
                files,
                setFiles,
                statusClaim,
                setStatusClaim,
                closeCloud,
                setCloseCloud
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
                <Box py={4} px={1}>
                    <h3>Scanner Error, Please check the service</h3>
                </Box>
                <Box my={4} display='flex' justifyContent='center'>
                    <RegularButton color="info" onClick={handleRefresh}>
                        Retry
                    </RegularButton>
                    <div style={{padding: 5}}/>
                    <RegularButton color="info" onClick={()=>setInfoexStatus(false)}>
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
        files,
        setFiles,
        statusClaim,
        setStatusClaim,
        closeCloud,
        setCloseCloud
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
        files,
        setFiles,
        statusClaim,
        setStatusClaim,
        closeCloud,
        setCloseCloud
    };
}
