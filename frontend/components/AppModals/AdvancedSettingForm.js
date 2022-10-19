import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import { Box, Typography, FormGroup, Divider, Grid, Tooltip, IconButton } from '@mui/material';
import { useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { useScanner } from 'lib/contexts/scannerContext';
import Select from 'components/Select';
import { scannerSettings } from 'constants/scannerSettings';
import { parseCookies } from 'nookies';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    pixelFormatAttr: yup.string(),
    pixelFormatVal: yup.number().typeError("Enter an integer value").nullable(true),
    resolutionAttr: yup.string(),
    resolutionVal: yup.number().typeError("Enter an integer value").required("Required").nullable(true),
    numberOfSheetsAttr: yup.string(),
    numberOfSheetsVal: yup.number().typeError("Enter an integer value").nullable(true),
});

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

    const sendConfig = (configsData) => {
        setLoading(true);
        const task = { 
            actions: [{ 
                action: 'configure', 
                streams: [{ 
                    sources: [{ pixelFormats: configsData}] 
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
        fetchData(`${process.env.backendUrl}api/scanners/${scannerId}/twaindirect/session`, {
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

    const formik = useFormik({
        initialValues: {
            pixelFormatAttr: `any`,
            pixelFormatVal: null,
            resolutionAttr: `int`,
            resolutionVal: 400,
            numberOfSheetsAttr: `maximum`,
            numberOfSheetsVal: null,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            sendConfig({
                pixelFormat: values.pixelFormatAttr,
                attributes: [
                    {
                        attribute: 'numberOfSheets',
                        values: [{ value: values.numberOfSheetsAttr === `maximum` ? values.numberOfSheetsAttr : parseInt(values.numberOfSheetsVal, 10) }]
                    },
                    {
                        attribute: 'resolution',
                        values: values.resolutionAttr !== `int` ? [{ value: parseInt(values.resolutionVal, 10) }, { value: values.resolutionAttr }] : [{ value: parseInt(values.resolutionVal, 10) }]
                    }
                ]
            });
        },
      });
    
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
                onClick={formik.handleSubmit}
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
                            console.log(e?.target?.value) // TODO how to handle the profile?
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
                                {data.label}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} pr={{sm: 1.5}}>
                            <FormGroup>
                                <Select
                                    onChange={formik.handleChange}
                                    id={data.name+"Attr"}
                                    name={data.name+"Attr"}
                                    aria-invalid={formik.touched[data.name+"Attr"] && Boolean(formik.errors[data.name+"Attr"])}
                                    lists={data.values.map(item => ({
                                        label: item.value,
                                        description: item.description,
                                        value: item.value
                                    }))}
                                    value={formik.values[data.name+"Attr"]}
                                />
                                <Typography color="red">{formik.errors[data.name+"Attr"]}</Typography>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} pl={{sm: 1.5}}>
                            <InputField
                                fullWidth
                                id={data.name+"Val"}
                                name={data.name+"Val"}
                                aria-invalid={formik.touched[data.name+"Val"] && Boolean(formik.errors[data.name+"Val"])}
                                placeholder={data.placeholder}
                                value={formik.values[data.name+"Val"]}
                                onChange={formik.handleChange}
                            />
                            <Typography color="red">{formik.errors[data.name+"Val"]}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Box>
        </Modal>
    );
};

export default AdvancedSettingForm;
