// import CustomLoader from "components/Loader";
import { ScannerContext, ScannerProvider } from "lib/contexts/scannerContext";
import dynamic from "next/dynamic";
// import ScannerConfig from "./ScannerConfig";
// import ScannerStatus from "./ScannerStatus";
// import ScanAnalytics from "./ScanAnalytics";
import Header from "components/Header";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { TbSettings } from "react-icons/tb";
import CustomLoader from "components/Loader";
import Card from "components/Card";

const AdvancedSettingForm = dynamic(() => import("components/AppModals/AdvancedSettingForm"), {ssr: false});
const StateBox = dynamic(() => import("./StateBox/"), {ssr: false});
const StartSession = dynamic(() => import("./StartSession"), {ssr: false});
const ScannerDetail = dynamic(() => import("./ScannerDetail"), {ssr: false});
const ScannerReport = dynamic(() => import("./ScannerReport"), {ssr: false});
const StartCaptureButton = dynamic(() => import("./StartCaptureButton"), {ssr: false});
const ScannerHistory = dynamic(() => import("./ScannerHistory"), {ssr: false});
const PdfViewer = dynamic(() => import("components/Pdf/PdfViewer"), {ssr: false});

export default function Scanner() {
    const [advancedSettingOpen, setAdvancedSettingOpen] = useState(false);
    
    const headerComponent = (
        <Grid 
            direction={{
                xs: "column",
                md: "row"
            }}
            container
            maxWidth="lg"
            justifyContent="space-between"
        >
            <Grid item xs={8} container>
                <Box>
                    <ScannerDetail />
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box display='flex' flexDirection='column' alignItems="end">
                    <StartSession />
                    <StateBox />
                </Box>
            </Grid>
        </Grid>
    )

    const titleHeader = (
        <>
            <span style={{color: "#673AB7"}}>Scanner</span> <span style={{color: '#848484'}}>/ Detail Scanner</span>
        </>
    )
    

    return (
        <ScannerProvider>
            <ScannerContext.Consumer>
                {value => (
                    <>
                        <Header
                            titleHeader={titleHeader}
                            component={headerComponent}
                            children={(
                                <Grid container spacing={3} mt={0}>
                                    {value.statusClaim && (
                                        <Grid 
                                            item 
                                            xs={12} 
                                            display='flex'
                                            flexDirection='row'
                                            justifyContent='space-between' 
                                            alignItems='center'
                                        >
                                            <StartCaptureButton />
                                            <Box 
                                                onClick={()=>setAdvancedSettingOpen(true)} 
                                                display='flex' 
                                                alignItems='center'
                                                sx={{
                                                    '&:hover': {
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                            >
                                                <TbSettings size={22} style={{marginRight: 10}} />
                                                <Typography fontWeight={600} fontSize='16px'>
                                                    Advanced Setting
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    
                                    
                                    {value.loadingCapture && !value.files?.length && (
                                        <Grid item xs={12}>
                                            <Card withpadding>
                                                <CustomLoader message="Loading Capture" />
                                            </Card>
                                        </Grid>
                                    )}
                                    {value.startCapture && value.statusClaim && value.files?.length > 0 && (
                                        <Grid item xs={12}>
                                            <Card withpadding>
                                                <Typography mb={3} fontWeight={600} fontSize='16px'>
                                                    Preview Result
                                                </Typography>
                                                <PdfViewer files={value.files} newScan />
                                            </Card>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} md={4}>
                                        <ScannerReport open={!Boolean(value.statusClaim)}/>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <ScannerHistory open={!Boolean(value.statusClaim)}/>
                                    </Grid>
                                </Grid>
                            )}
                        />
                        <AdvancedSettingForm
                            open={advancedSettingOpen}
                            close={()=>setAdvancedSettingOpen(false)}
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