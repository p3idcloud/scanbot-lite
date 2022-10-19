import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import { Box, Typography, FormGroup, Divider, Grid, Tooltip, IconButton } from '@mui/material';
import { useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { useScanner } from 'lib/contexts/scannerContext';
import Select from 'components/Select';
import { RiAddCircleLine } from 'react-icons/ri';
import { scannerSettings } from 'constants/scannerSettings';
import { parseCookies } from 'nookies';

const AdvancedSettingForm = ({ open, close }) => {
    const [loading, setLoading] = useState(false);
    
    const {
        setListScannerSettings,
        formSetting,
        requestId,
        scannerId,
        privetToken,
        setFormSetting,
        isChange,
        setIsChange,
        listScannerSettings,
    } = useScanner();

    const sendConfig = (e) => {
        setLoading(true);
        const task = { 
            actions: [{ 
                action: 'configure', 
                streams: [{ 
                    sources: [{ 
                        pixelFormats: [{
                            pixelFormat: e.pixelFormat, // get value for pixelFormat
                            attributes: [
                                { attribute: 'numberOfSheets', values: [{ value: e.numberOfSheets }] }, // get value for numberOfSheets
                                { attribute: 'resolution', values: [{ value: e.resolution }] }, // get value for resolution
                            ]
                        }] 
                    }] 
                }] 
            }] 
        };
        const data = {
            commandId: requestId,
            kind: 'twainlocalscanner',
            method: 'sendTask',
            params : {
                sessionId: parseCookies({})["sessionId"],
                task,
            }
        }
        const headers = {
            "x-twain-cloud-request-id": requestId,
            "x-privet-token": privetToken,
        }
        fetchData(`/api/scanners/${scannerId}/twaindirect/session`, {
            headers,
            method: "POST",
            data,
        })
        .then((res) => {
            toast.success("Successfully saved setting for session")
        })
        .catch(() => {
            toast.error("Failed to save setting for session");
        })
        .finally(() => {
            setLoading(false);
            close();
        });
    };

    const getConfigValues = () => {
        if (listScannerSettings) {
            let configFields = [...listScannerSettings];
            configFields.forEach((config) => {
                let tag = "input";
                // const possibleValues = config.possibleValues.map((pv) => pv.value);
                // let tagValue = possibleValues[0];
                config.currentValue = {
                    selectValue: config.possibleValues[0].value,
                    inputValue: config.defaultValue
                    // type: config.possibleValues[0].,
                };
            });
            // console.log(configFields)
            return configFields;
        }
        return [];
    }
    
    return (
        <Modal
            open={open}
            customBodyFooter={
            <>
                <Button
                onClick={() => {
                    close();
                }}
                variant="outlined"
                color="primaryBlack"
                autoWidth
                size="medium"
                >
                Cancel
                </Button>
                <Button
                onClick={sendConfig}
                    variant="contained"
                    autoWidth
                    size="medium"
                    loading={loading}
                >
                Save
                </Button>
            </>
            }
        >
            <Box
                display='flex'
                padding={4}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width={1}
            >
                <Typography fontWeight={600} fontSize="20px" lineHeight='28px' width={1}>
                    Advanced Settings
                </Typography>
                <Divider sx={{my: 4, width: 1}}/>
                <FormGroup sx={{my: 2, width: 1}}>
                    <Select
                        label="Scan Profile"
                        value={"Default"}
                        lists={[{
                            label: "Default",
                            value: "Default"
                        }]}
                        onChange={e => {
                            console.log(e?.target?.value)
                        }}
                    />
                </FormGroup>
                {scannerSettings.map((data, i) => (
                    <Grid container key={i} my={2} width={1}>
                        <Grid item xs={12} mb={2}>
                            <Typography 
                                fontSize='14px' 
                                fontWeight={400} 
                                sx={{color: '#747474'}}
                            >
                                {data.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} pr={{sm: 1.5}}>
                            <FormGroup>
                                <Select
                                    onChange={(e) =>
                                        handleChangeTag(e.target.value, i)
                                    }
                                    lists={data.values.map(possibleValue => ({
                                        label: possibleValue.value,
                                        description: possibleValue.description,
                                        value: possibleValue.value
                                    }))}
                                    value={data.defaultValue}
                                />
                            </FormGroup>
                        </Grid>
                        {data.hasInt && (
                        <Grid item xs={12} sm={6} pl={{sm: 1.5}}>
                            <InputField
                                fullWidth
                                placeholder={data.placeholder}
                                value={data.defaultInt}
                                onChange={(e) =>
                                    setConfigValue(e.target.value, i)
                                }
                            />
                        </Grid>
                        )}
                    </Grid>
                ))}
            </Box>
        </Modal>
    );
};

export default AdvancedSettingForm;
