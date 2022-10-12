// import CustomLoader from "components/Loader";
import { ScannerContext, ScannerProvider } from "lib/contexts/scannerContext";
import dynamic from "next/dynamic";
// import ScannerConfig from "./ScannerConfig";
import ScannerHistory from "./ScannerHistory";
// import StartCapture from "./StartCapturing";
// import ScannerStatus from "./ScannerStatus";
// import ScanAnalytics from "./ScanAnalytics";
import Header from "components/Header";
import { Box, Grid, Stack, Typography } from "@mui/material";
import StartSession from "./StartSession";
import ScannerDetail from "./ScannerDetail";
import StateBox from "./StateBox/";
import ScannerReport from "./ScannerReport";
import { useState } from "react";

// const PdfViewer = dynamic(() => import("components/Pdf/PdfViewer"), {
//     ssr: false,
// });

export default function Scanner() {
    const [headerHeight, setHeaderHeight] = useState(0);


    const headerComponent = (
        <Stack 
            direction={{
                xs: "column",
                md: "row"
            }} 
            justifyContent="space-between" 
            spacing={2}
        >
            <ScannerDetail />
            <Box display='flex' flexDirection='column' alignItems="end">
                <StartSession />
                <StateBox />
            </Box>
        </Stack>
    )

    const titleHeader = (
        <Typography sx={{fontWeight: 500}}>
            <span style={{color: "#673AB7"}}>Scanner</span> <span style={{color: '#848484'}}>/ Detail Scanner</span>
        </Typography>
    )
    

    return (
        <ScannerProvider>
            <ScannerContext.Consumer>
                {value => (
                    <>
                        <Header
                            setHeight={setHeaderHeight}
                            titleHeader={titleHeader}
                            component={headerComponent}
                        />
                        <Grid container marginTop={`${headerHeight}px`} spacing={3}>
                            <Grid item xs={12} md={4}>
                                <ScannerReport open={true}/>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <ScannerHistory open={true}/>
                            </Grid>
                        </Grid>
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