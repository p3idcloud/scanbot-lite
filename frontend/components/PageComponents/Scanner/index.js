import CustomLoader from "components/Loader";
import { ScannerContext, ScannerProvider } from "lib/contexts/scannerContext";
import dynamic from "next/dynamic";
import ScannerConfig from "./ScannerConfig";
import ScannerHistory from "./ScannerHistory";
import ScannerProfile from "./ScannerProfile";
import StartCapture from "./StartCapturing";
import ScannerStatus from "./ScannerStatus";
import ScanAnalytics from "./ScanAnalytics";
import Header from "components/Header";
import { Grid, Stack } from "@mui/material";
import StartSession from "./StartSession";

const PdfViewer = dynamic(() => import("components/Pdf/PdfViewer"), {
    ssr: false,
});

export default function Scanner() {
    const headerComponent = (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <StartSession />
                </Stack>
            </Grid>
        </Grid>
    )
    

    return (
        <ScannerProvider>
            <ScannerContext.Consumer>
                {value => (
                    <>
                        <Header 
                            titleHeader={
                                <>
                                    <span color="#673AB7">Scanner</span> / Detail Scanner
                                </>
                            }
                            component={headerComponent}
                        />
                        {/* {value.statusClaim && (
                            <GridContainer>
                                <GridItem xs={12} sm={5}>
                                    <ScannerStatus />
                                </GridItem>

                                <GridItem xs={12} sm={7}>
                                    <StartCapture />
                                </GridItem>
                            </GridContainer>
                        )}

                        <GridContainer>
                            <GridItem xs={12} xl={7}>
                                {value.statusClaim && (
                                    <Card>
                                        <CardHeader color='info'>
                                            <h2>Scanner Config</h2>
                                        </CardHeader>
                                        <CardBody>
                                            <ScannerConfig />
                                        </CardBody>
                                    </Card>
                                )}
                            </GridItem>
                            <GridItem xs={12} xl={5}>
                                {value.loadingCapture && !value.files?.length && (
                                    <CustomLoader message="Loading Capture" />
                                )}
                                {value.startCapture && value.statusClaim && value.files?.length > 0 && (
                                    <PdfViewer files={value.files} newScan />
                                )}
                            </GridItem>
                        </GridContainer>
                        
                        {!value.statusClaim && (
                            <>
                                <GridContainer>
                                    <GridItem xs={12} sm={5}>
                                        <ScannerStatus />
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>
                                        <ScannerProfile />
                                    </GridItem>
                                </GridContainer>

                                <GridContainer>
                                    <GridItem xs={12} lg={5}>
                                        <ScanAnalytics />
                                    </GridItem>

                                    <GridItem xs={12} lg={7}>
                                        <ScannerHistory />
                                    </GridItem>
                                </GridContainer>
                            </>
                        )} */}

                    </>
                )}
            </ScannerContext.Consumer>
        </ScannerProvider>
    )
}