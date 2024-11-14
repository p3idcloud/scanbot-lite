// import CustomLoader from "components/Loader";
import { ScannerContext, ScannerProvider } from "lib/contexts/scannerContext";
import dynamic from "next/dynamic";
import Header from "components/Header";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { useState } from "react";
import { TbSettings } from "react-icons/tb";
import CustomLoader from "components/Loader";
import Card from "components/Card";
import Link from "next/link";

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
            <Grid container size={8}>
                <Box>
                    <ScannerDetail />
                </Box>
            </Grid>
            <Grid size={4}>
                <Box display='flex' flexDirection='column' alignItems="end">
                    <StartSession />
                    <StateBox />
                </Box>
            </Grid>
        </Grid>
    )

    const titleHeader = (
        <>
            <Link legacyBehavior href='/dashboard'><a style={{color: "#673AB7", textDecoration: 'none'}}>Scanner</a></Link> <span style={{color: '#848484'}}>/ Detail Scanner</span>
        </>
    )
    

    return (
        (<ScannerProvider>
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
                                            display='flex'
                                            flexDirection='row'
                                            justifyContent='space-between'
                                            alignItems='center'
                                            size={12}>
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
                                        <Grid size={12}>
                                            <Card withpadding>
                                                <CustomLoader message="Loading Capture" />
                                            </Card>
                                        </Grid>
                                    )}
                                    {value.startCapture && value.statusClaim && value.files?.length > 0 && (
                                        <Grid size={12}>
                                            <Card withpadding>
                                                <Typography mb={3} fontWeight={600} fontSize='16px'>
                                                    Preview Result
                                                </Typography>
                                                <PdfViewer pdfData={{
                                                    history: value.scannerHistory?.length > 0 && value.scannerHistory[0],
                                                    url: value.files,
                                                    name: 'Scan Preview'
                                                }} />
                                            </Card>
                                        </Grid>
                                    )}

                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 4
                                        }}>
                                        <ScannerReport open={!Boolean(value.statusClaim)}/>
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 8
                                        }}>
                                        <ScannerHistory open={!Boolean(value.statusClaim)}/>
                                    </Grid>
                                </Grid>
                            )}
                        />
                        <AdvancedSettingForm
                            open={advancedSettingOpen}
                            close={()=>setAdvancedSettingOpen(false)}
                        />
                    </>
                )}
            </ScannerContext.Consumer>
        </ScannerProvider>)
    );
}