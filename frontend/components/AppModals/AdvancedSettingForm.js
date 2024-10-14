import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import { Box, Typography, FormGroup, Divider, Grid2 as Grid } from '@mui/material';
import { useMemo, useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { useScanner } from 'lib/contexts/scannerContext';
import Select from 'components/Select';
// import { scannerSettings } from 'constants/scannerSettings';
import { parseCookies } from 'nookies';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { constructTwainPayloadTask, findTypeOfValue } from 'lib/task';

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
        var configData = {}
        Object.keys(configsData).forEach((key, i) => {
            var [newkey, inputType] = key.split('-')
            // attribute : { type, inputValue, selectValue, object }
            if (inputType === 'select') {
                configData[newkey] = {
                    ...configData[newkey],
                    selectValue: configsData[key],
                    object: configValues[Math.floor(i/2)]?.object,
                    type: findTypeOfValue(configsData[key], configValues[Math.floor(i/2)]?.possibleValues)
                };
            } else {
                configData[newkey] = {
                    ...configData[newkey],
                    inputValue: configsData[key]
                };
            }
        })
        const task = constructTwainPayloadTask(configData);
        // console.log(JSON.stringify(task, null, 2));
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
        fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/scanners/${scannerId}/twaindirect/session`, {
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

    const getInitialValues = () => {
        const initialValues = {};
        if (listScannerSettings) {
            listScannerSettings.forEach(setting => {
                initialValues[setting.attributeName+'-select'] = setting.defaultValue;
                initialValues[setting.attributeName+'-input'] = 0;
            })
        }
        return initialValues;
    }

    const getValidationSchema = () => {
        const values = {};
        if (listScannerSettings) {
            listScannerSettings.forEach(setting => {
                values[setting.attributeName+'-select'] = yup.string().required('Required'),
                values[setting.attributeName+'-input'] = yup.number().typeError("Enter an integer value").nullable(true)
            })
        }
        return yup.object(values);
    }

    const getConfigValues = () => {
        if (listScannerSettings) {
            // console.log(listScannerSettings)
            let configFields = [...listScannerSettings];
            return configFields;
        }
        return [];
    }
    const configValues = useMemo(() => getConfigValues(), [listScannerSettings]);
    

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: getValidationSchema(),
        onSubmit: sendConfig,
        enableReinitialize: true
    });

    const showInputField = (i) => findTypeOfValue(formik.values[configValues[i].attributeName+'-select'], configValues[i]?.possibleValues) !== 'select';
    
    // console.log(formik.values);

    return (
        (<Modal
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
                            console.log(e?.target?.value)
                        }}
                    />
                </FormGroup>
                {configValues.map((data, i) => (
                    <Grid container key={i} my={2} width={1}>
                        <Grid mb={2} size={12}>
                            <Typography 
                                fontSize='14px' 
                                fontWeight={400} 
                                sx={{color: '#747474'}}
                            >
                                {data.labelName}
                            </Typography>
                        </Grid>
                        <Grid
                            pr={{sm: 1.5}}
                            size={{
                                xs: 12,
                                sm: 6
                            }}>
                            <FormGroup>
                                <Select
                                    onChange={formik.handleChange}
                                    id={data.attributeName+'-select'}
                                    name={data.attributeName+'-select'}
                                    aria-invalid={formik.touched[data.attributeName+'-select'] && Boolean(formik.errors[data.attributeName+'-select'])}
                                    lists={data?.possibleValues?.map(item => ({
                                        label: item.label,
                                        description: item.description,
                                        value: item.value
                                    }))}
                                    error={Boolean(formik.errors[data.attributeName+'-select'])}
                                    value={formik.values[data.attributeName+'-select']}
                                />
                                <Typography sx={{color: "red.main"}}>{formik.errors[data.attributeName+'-select']}</Typography>
                            </FormGroup>
                        </Grid>
                        <Grid
                            pl={{sm: 1.5}}
                            size={{
                                xs: 12,
                                sm: 6
                            }}>
                            {showInputField(i) && (
                                <FormGroup>
                                    <InputField
                                        fullWidth
                                        onChange={formik.handleChange}
                                        id={data.attributeName+'-input'}
                                        name={data.attributeName+'-input'}
                                        aria-invalid={formik.touched[data.attributeName+'-input'] && Boolean(formik.errors[data.attributeName+'-input'])}
                                        value={formik.values[data.attributeName+'-input']}
                                        error={Boolean(formik.errors[data.attributeName+'-input'])}
                                    />
                                    <Typography sx={{color: "red.main"}}>{formik.errors[data.attributeName+'-input']}</Typography>
                                </FormGroup>
                                
                            )}
                        </Grid>
                    </Grid>
                ))}
            </Box>
        </Modal>)
    );
};

export default AdvancedSettingForm;
