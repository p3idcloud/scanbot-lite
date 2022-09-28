import { ScannerProvider } from "lib/contexts/scannerContext";
import Head from "next/head";
import { useState } from "react";
import uuid from "uuid";
import ScannerHistory from "./ScannerHistory";
import ScannerProfile from "./ScannerProfile";

export default function Scanner() {
    const [loading, setLoading] = useState({
        configProfile: false,
        startSession: false,
        startCapturing: false,
    });
    const [profileSelect, setProfileSelect] = useState(null);
    const [listProfileScanner, setListProfileScanner] = useState([]);
    const [listScannerSettings, setListScannerSettings] = useState([]);
    const [openScanProfile, setOpenScanProfile] = useState(false);
    const [openSaveProfile, setSaveProfile] = useState(false);
    const [statusClaim, setStatusClaim] = useState(false);
    const [startCapture, setStartCapture] = useState(false);
    const [successUpload, setSuccessUpload] = useState(false);
    const [requestId, setRequestId] = useState(uuid.v4());
    const [sessionId, setSessionId] = useState(0);
    const [files, setFiles] = useState([]);
    const [loadingCapture, setLoadingCapture] = useState(false);

    return (
        <ScannerProvider
            requestId={requestId}
            sessionId={sessionId}
            setSessionId={setSessionId}
            setStartCapture={setStartCapture}
            setFiles={setFiles}
            setStatusClaim={setStatusClaim}
            loadingCapture={loadingCapture}
            setLoadingCapture={setLoadingCapture}
        >
            <Head>
                <title>Scanner Detail</title>
            </Head>
            <ScannerProfile />
            <ScannerHistory />
        </ScannerProvider>
    )
}