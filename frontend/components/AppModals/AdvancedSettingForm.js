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

const AdvancedSettingForm = ({ open, close }) => {
    const [loading, setLoading] = useState(false);
    
    const {
        setListScannerSettings,
        formSetting,
        setFormSetting,
        isChange,
        setIsChange,
        listScannerSettings,
    } = useScanner();

    const sendConfig = (e) => {
        const data = {
            commandId: '0192f284-6914-4c12-aa46-9c6554ae3219', // generate uuidv4 ?
            kind: 'twainlocalscanner',
            method: 'sendTask',
            params: {
                sessionId: '2f948fed-b8c7-4a73-9d26-6f7fd5d57276', // get from ctx / cookie ?
                task: { actions: [{ action: 'configure', streams: [{ sources: [{ pixelFormats: [
                    {
                        pixelFormat: e.pixelFormat, // get value for pixelFormat
                        attributes: [
                            { attribute: 'numberOfSheets', values: [{ value: e.numberOfSheets }] }, // get value for numberOfSheets
                            { attribute: 'resolution', values: [{ value: e.resolution }] }, // get value for resolution
                        ]
                    }
                ] }] }] }] },
            },
        };
        // setLoading(true);
        // fetchData(`${process.env.backendUrl}api/scanners/${id ?? ''}`, {
        // method: "PATCH",
        // data,
        // })
        // .then((res) => {
        // })
        // .catch(() => {
        //     toast.error("Failed to save setting");
        // })
        // .finally(() => {
        //     setLoading(false);
        //     close();
        // });
    };

     /* const getConfigValues = () => {
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
    } */
    
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
                
                <Grid container>
                    <Grid item xs={12}>
                        <Tooltip title="Add Config">
                            <IconButton>
                                <RiAddCircleLine size={20} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default AdvancedSettingForm;
