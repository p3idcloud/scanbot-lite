/*
 * Copyright (C) 2016-2024 P3iD Technologies Inc. (http://p3idtech.com)
 * license[at]p3idtech[dot]com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useMemo, useState } from 'react';
import { fetchDataSWR, fetchData, fetchFile } from 'lib/fetch';
import { toast } from "react-toastify";
import { TextWithParagraphs } from 'lib/helpers';
import useSWR, { mutate } from 'swr';
import { Box, Button, Card, Chip, Dialog, DialogContent, DialogTitle, Grid2, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Item } from 'components/Stack/Item';
import { parseCookies } from 'nookies';
import { authConstants } from 'constants/auth';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
}


const OpentextDialog = ({ open, close, pdfUrls, pdfTitle, historyId }) => {
    const { data: opentextData, error: opentextErr, loading: opentextLoading } = useSWR(
        historyId ? `api/opentext/${historyId}` : null,
        fetchDataSWR
      );

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loadingRiskguard, setLoadingRiskguard] = useState(false);
    const [loadingOCR, setLoadingOCR] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(false);
    const [showRiskGuard, setShowRiskguard] = useState(false);
    const [showOCRText, setShowOCRText] = useState(false);
    const [ocrTextData, setOcrTextData] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const toggleTab = (e, newValue) => {
        if (activeTab !== newValue) setActiveTab(newValue);
    };
    const handleShowRiskguard = () => {
        setShowOCRText(false)
        setShowRiskguard(!showRiskGuard)
    }
   
    const resetErrors = () => setError(null);

    const handleSubmitOCR = async () => {
        resetErrors();
        setLoadingOCR(true);

        const data = {
            pdfUrls: pdfUrls,
            pdfTitle: pdfTitle,
            historyId: historyId,
          };

        fetchData(`api/opentext/upload`, {
            method: 'POST',
            data,
        })
            .then((res) => {
                mutate(`api/opentext/${historyId}`)
                toast.success('Success upload to Opentext OCR');
            })
            .catch((err) => {
                console.log(err)
                toast.error("Failed to upload data");
            })
            .finally(() => setLoadingOCR(false));
    }


    const downloadOCR = async (fileType) => {
        var fileURL = opentextData.OcrPDF
        var fileName = `${pdfTitle || 'Scanbot'}.pdf`;
        if (fileType === "text") {
            fileURL = opentextData.OcrText
            fileName = `${pdfTitle || 'Scanbot'}.txt`;
        }

        const response = await fetchFile(`api/storage/${fileURL}`);
        const blob = await response.data;
    
        // Create a temporary container
        const container = document.createElement('div');
    
        // Create an anchor element within the container
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
    
        // Specify the desired file name using the download attribute
        a.download = fileName; // Replace with your desired file name
    
        // Append the anchor to the container
        container.appendChild(a);
    
        // Append the container to the body
        document.body.appendChild(container);
    
        // Trigger a click on the anchor to start the download
        a.click();
    
        // Remove the container from the DOM
        document.body.removeChild(container);
        // window.open(file[page], "_blank");
    }

    const fetchOCRText = async () => {
        try {
            if (ocrTextData === '') {
                var response = await fetchFile(`api/storage/${opentextData.OcrText}`)
                if (response.status !== 200) {
                    throw new Error(`Error fetching file: ${response.statusText}`);
                }
                const fileBlob = await response.data;
    
                const fileString = await blobToString(fileBlob);
                
                setOcrTextData(fileString)
            }
            
            setShowOCRText(true)
            setShowRiskguard(false)
        } catch (error) {
            console.error('Error fetching and converting file:', error);
            return null;
        }
    }

    function blobToString(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          // Read the blob as text
          reader.readAsText(blob);
          
          reader.onload = () => {
            resolve(reader.result); // The file content as a string
          };
      
          reader.onerror = () => {
            reject(new Error('Error reading blob as string'));
          };
        });
      }
      

    const ErrorComponent = useMemo(() => error && (
        <Typography className="mt-2 mb-4" color='error'>{error}</Typography>
    ), [error]);

    const ValidateOpentext = async () => {
        setLoadingRiskguard(true)
        setLoadingOCR(true)
        await fetchData(`/api/opentext/auth`)
        .then((res) => {
            setLoadingRiskguard(false)
            setLoadingOCR(false)
            setStatus(true)
        }).catch(err => {
            setLoadingRiskguard(false)
            setLoadingOCR(false)
            setError(
            <>
            <h2 className="my-2" style={{ fontSize: 18 }}>Invalid Opentext Setup!</h2>
            <p>Go to Account Settings and reconfigure</p>
            </>)
        })
    }

    useEffect(() => {
        ValidateOpentext()
    },[])

    const StatusAPI = useMemo(() => {
        var statusText = 'Loading'  
        var color = 'info'
        if (loadingRiskguard && !status) {
            // LoadingRiskguard
        } else if (!loadingRiskguard && !status) {
            statusText = 'Connection Fail'
            color = 'error'
        } else if (!loadingRiskguard && status) {
            statusText = 'Connection Success'
            color = 'success'
        } else {
            statusText = 'Connection Success'
            color = 'success'
        }

        return (
            <Chip color={color} label={statusText} variant='outlined' />
        )
    },[loadingRiskguard, status])


    const DisplayRiskguardResult = () => {
        if (!showRiskGuard && opentextData?.Riskguard !== null) {
            return ''
        }
        var riskData = opentextData.Riskguard
        var rowData = []
        if (riskData.tme.status.message === "SUCCESS") {
            riskData.tme.result.results.ncategorizer.map((category) => {
                category.knowledgeBase.map((kb) => {
                    kb.categories.category.map((ct) => {
                        rowData.push({
                            item: kb.kbid,
                            confidence: ct.weight || 0,
                            relevance: '',
                            frequency: '',
                            details: ct.name.join(',')
                        });
                    })
                })
            })

            riskData.tme.result.results.nfinder.map((finder) => {
                finder.nfExtract.map(extract => {
                    extract.extractedTerm.map((term) => {
                        rowData.push({
                            item: term.cartridgeID,
                            confidence: term.confidenceScore,
                            relevance: term.relevancyScore,
                            frequency: term.frequency,
                            details: term.nfinderNormalized || term.mainTerm?.value || ''
                        });
                    })
                })
            })
        }

        if (riskData.ia.status.message === "SUCCESS") {
            Object.entries(riskData.ia.result.result).forEach(([key, value]) => {
                rowData.push({
                    item: key,
                    confidence: value,
                    relevance: '',
                    frequency: '',
                    details: ''
                });
            });
        }

        if (riskData.va.status.message === "SUCCESS") {

        }


        function a11yProps(index) {
            return {
              id: `simple-tab-${index}`,
              'aria-controls': `simple-tabpanel-${index}`,
            };
          }
        
        return (
            <div className='mt-5'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={toggleTab} aria-label="opentext result">
                        <Tab label="Table" {...a11yProps(0)}/>
                        <Tab label="RAW (JSON)" {...a11yProps(1)}/>
                    </Tabs>
                </Box>
                <CustomTabPanel value={activeTab} index={0}>
                    <Table className='mt-3'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Confidence</TableCell>
                                <TableCell>Relevance</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                rowData.length > 0 ? (
                                    rowData.map((rd, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{rd.item}</TableCell>
                                            <TableCell>{rd.confidence}</TableCell>
                                            <TableCell>{rd.relevance}</TableCell>
                                            <TableCell>{rd.frequency}</TableCell>
                                            <TableCell>{rd.details}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className='text-center'>No Data</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </CustomTabPanel>
                <CustomTabPanel value={activeTab} index={1}>
                    <Box sx={{width: '100%'}}>
                        <pre>
                        {
                            JSON.stringify(riskData, null, 2)
                        }
                        </pre>
                    </Box>
                </CustomTabPanel>
            </div>
        );
    };

    const DisplayOCRTextResult = () => {
        if (!ocrTextData) {
            return ''
        }
        return (
            <div className="mt-2">
                <div className='border mt-1 bg-gray-100 p-2'>
                    <TextWithParagraphs text={ocrTextData} />
                </div>
            </div>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            sx={{minWidth:'50%'}}
        >
            <DialogTitle id="opentext-dialog-title">
                <Typography sx={{fontWeight: 'bold'}}>
                    Upload to Opentext
                </Typography>
                <Typography>
                Status API: {StatusAPI}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {ErrorComponent}
                <Grid2 container spacing={2}>
                    <Grid2 item xs={4}>
                        <Button variant='outlined' color="primary" onClick={handleSubmitOCR} disabled={loadingOCR}>{(loadingOCR && status) ? 'Uploading to OCR....' : 'Upload to OCR'}</Button>
                    </Grid2>
                    {
                        opentextData && (
                            <>
                                <Grid2 item xs={4}>
                                    <Button variant='outlined' color="info" onClick={fetchOCRText}>Preview Text OCR</Button>
                                </Grid2>
                                {
                                    opentextData.Riskguard && (
                                        <Grid2 item xs={4}>
                                            <Button variant='outlined' color="info" onClick={handleShowRiskguard}>Riskguard Information</Button>
                                        </Grid2>
                                    )
                                }
                                <Grid2 item xs={4}>
                                    <Button variant='outlined' color="secondary" onClick={() => downloadOCR("pdf")}>Download PDF OCR</Button>
                                </Grid2>
                                <Grid2 item xs={4}>
                                    <Button variant='outlined' color="secondary" onClick={() => downloadOCR("text")}>Download Text OCR</Button>
                                </Grid2>
                            </>
                        )
                    }
                </Grid2>
                {
                    showRiskGuard && (
                        <DisplayRiskguardResult />
                    )
                }
                {
                    showOCRText && (
                        <DisplayOCRTextResult />
                    )
                }
            </DialogContent>
        </Dialog>
    );
};

export default OpentextDialog;
