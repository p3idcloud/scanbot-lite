import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as uuid from "uuid";
import { Modal, Box, Typography } from "@mui/material";
import CustomLoader from "components/Loader";
import { parseCookies } from "nookies";
import useSWR from "swr";
import { fetchData } from "lib/fetch";
import Card from "components/Card";
import Button from "components/Button";

export const ScannerContext = createContext(null);

const headers = { "x-twain-cloud-request-id": uuid.v4() };

export const ScannerProvider = ({children}) => {
    const [privetToken, setPrivetToken] = useState(0);
    const [scannerSettings, setScannerSettings] = useState([]);
    const [scannerHistory, setScannerHistory] = useState([]);
    const [scanHistoryRowCount, setScanHistoryRowCount] = useState(0);
    const [detailScanner, setDetailScanner] = useState(null);
    const [statusPoll, setStatusPoll] = useState(null);
    const [infoexStatus, setInfoexStatus] = useState(false);
    const [loadingInfoex, setLoadingInfoex] = useState(false);
    const [statusScanner, setStatusScanner] = useState(true);
    const [usedBy, setUsedBy] = useState(null);
    const [listScannerSettings, setListScannerSettings] = useState([]);
    const [openScanProfile, setOpenScanProfile] = useState(false);
    const [formSetting, setFormSetting] = useState({});
    const [isChange, setIsChange] = useState(false);    
    const [statusClaim, setStatusClaim] = useState(false);
    const [startCapture, setStartCapture] = useState(false);
    const [closeCloud, setCloseCloud] = useState(() => {});
    const [requestId, setRequestId] = useState(uuid.v4());
    const [sessionId, setSessionId] = useState(0);
    const [files, setFiles] = useState([]);
    const [loadingCapture, setLoadingCapture] = useState(false);
    const [scanHistoryPageIndex, setScanHistoryPageIndex] = useState(1);

    const router = useRouter();
    const { scannerId } = router.query;
    
    const { data, error, isValidating } = useSWR(
        scannerId ? `api/scanners/${scannerId}?ui=true` : null,
        fetchData
    );
    const scannerStateData = useSWR(
        scannerId ? `api/scanners/state/${scannerId}` : null,
        fetchData,
        {
            refreshInterval: 5000
        }
    ).data;
    const scannerSettingsData = useSWR(
        `api/scannersetting`,
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
            setListScannerSettings(scannerSettingsData.data ?? []);
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
        fetchData(`api/scanners/${scannerId}/infoex`, {
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
        if (data?.sessionId?.length === 0 || !data && scannerId != undefined) {
            handleInfoex();
        }
    }, [scannerId]);

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

    function loadScannerHistory(page = 1, rowsPerPage = 5) {
        if (page !== scanHistoryPageIndex) {
            setScanHistoryPageIndex(page);
        }
        fetchData(`api/scanners/history`, {
            headers,
            params: {
                scannerId,
                limit: rowsPerPage,
                sort: "-createdAt",
                page,
            },
        })
        .then((res) => {
            setScannerHistory(res?.data ?? []);
            setScanHistoryRowCount(res?.dataCount ?? 0);
        })
        .catch((err) => {
            toast.error("Api error something")
        });
    }
    function loadScannerDetail() {
        fetchData(`api/scanners/${scannerId}?ui=true`)
        .then((res) => {
            setDetailScanner(res.scanner ?? null);
        })
        .catch((err) => toast.error("Api error something"));
    }
    function resetStatusClaimStates() {
        setFiles([]);
    }

    return (
        <ScannerContext.Provider
            value={{
                scanHistoryRowCount,
                scannerSettings,
                setScannerSettings,
                scannerHistory,
                detailScanner,
                scannerId,
                setScannerHistory,
                requestId,
                privetToken,
                sessionId,
                setSessionId,
                statusPoll,
                startCapture,
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
                setCloseCloud,
                listScannerSettings,
                setListScannerSettings,
                openScanProfile,
                setOpenScanProfile,
                formSetting,
                setFormSetting,
                isChange,
                setIsChange,
                resetStatusClaimStates,
                scanHistoryPageIndex,
                setScanHistoryPageIndex,
                loadingInfoex
            }}
        >
        {children}
        {/* <Modal open={loadingInfoex}>
            <Box 
                display='flex' 
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
            >
                <Card withpadding>
                    <CustomLoader message="Checking Scanner" />
                </Card>
            </Box>
        </Modal> */}
        <Modal open={infoexStatus}>
            <Box 
                display='flex' 
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
            >
                <Card withpadding>
                    <Box mt={4} px={1}>
                        <Typography textAlign='center' fontWeight={600} fontSize="20px">
                            Scanner Error, Please check the service
                        </Typography>
                    </Box>
                    <Box my={4} display='flex' justifyContent='center' alignItems='center'>
                        <Button size="small" autoWidth onClick={handleRefresh}>
                            Retry
                        </Button>
                        <div style={{padding: 5}}/>
                        <Button size="small" autoWidth onClick={()=>setInfoexStatus(false)}>
                            Ok
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Modal>
        </ScannerContext.Provider>
    );
};

export const useScanner = () => {
    const {
        scanHistoryRowCount,
        scannerSettings,
        setScannerSettings,
        scannerHistory,
        detailScanner,
        scannerId,
        setScannerHistory,
        requestId,
        privetToken,
        sessionId,
        setSessionId,
        statusPoll,
        startCapture,
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
        setCloseCloud,
        listScannerSettings,
        setListScannerSettings,
        openScanProfile,
        setOpenScanProfile,
        formSetting,
        setFormSetting,
        isChange,
        setIsChange,
        resetStatusClaimStates,
        scanHistoryPageIndex,
        setScanHistoryPageIndex,
        loadingInfoex,
    } = useContext(ScannerContext);

    return {
        scanHistoryRowCount,
        scannerSettings,
        setScannerSettings,
        scannerHistory,
        detailScanner,
        scannerId,
        setScannerHistory,
        requestId,
        privetToken,
        sessionId,
        setSessionId,
        statusPoll,
        startCapture,
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
        setCloseCloud,
        listScannerSettings,
        setListScannerSettings,
        openScanProfile,
        setOpenScanProfile,
        formSetting,
        setFormSetting,
        isChange,
        setIsChange,
        resetStatusClaimStates,
        scanHistoryPageIndex,
        setScanHistoryPageIndex,
        loadingInfoex,
    };
}
