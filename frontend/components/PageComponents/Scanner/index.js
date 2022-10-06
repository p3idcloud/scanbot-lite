import CustomLoader from "components/Loader";
import { ScannerProvider } from "lib/contexts/scannerContext";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import uuid from "uuid";
import ScannerConfig from "./ScannerConfig";
import ScannerHistory from "./ScannerHistory";
import ScannerProfile from "./ScannerProfile";
import StartCapture from "./StartCapturing";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

const PdfViewer = dynamic(() => import("components/Pdf/PdfViewer"), {
    ssr: false,
  });

export default function Scanner() {
    const [loading, setLoading] = useState({
        configProfile: false,
        startSession: false,
        startCapturing: false,
    });

    const [statusClaim, setStatusClaim] = useState(false);
    const [startCapture, setStartCapture] = useState(false);
    const [successUpload, setSuccessUpload] = useState(false);
    const [closeCloud, setCloseCloud] = useState(() => {});
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
            files={files}
            setFiles={setFiles}
            statusClaim={statusClaim}
            setStatusClaim={setStatusClaim}
            loadingCapture={loadingCapture}
            setLoadingCapture={setLoadingCapture}
            closeCloud={closeCloud}
            setCloseCloud={setCloseCloud}
        >
            <GridContainer>
                <GridItem xs={12} xl={7}>
                    {statusClaim && (
                        <Card>
                            <CardHeader color='info'>
                                <h2>Scanner Config</h2>
                            </CardHeader>
                            <CardBody>
                                <ScannerConfig />
                                <StartCapture />
                            </CardBody>
                        </Card>
                    )}
                </GridItem>
                <GridItem xs={12} xl={5}>
                    {loadingCapture && !files?.length && (
                        <CustomLoader message="Loading Capture" />
                    )}
                    {startCapture && statusClaim && files?.length > 0 && (
                        <PdfViewer files={files} />
                    )}
                </GridItem>
            </GridContainer>
            <ScannerProfile />
            <ScannerHistory />
        </ScannerProvider>
    )
}