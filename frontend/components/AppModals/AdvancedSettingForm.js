import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import { Box, Typography, FormGroup, Divider, Grid } from '@mui/material';
import { useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { useScanner } from 'lib/contexts/scannerContext';
import Select from 'components/Select';
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

    const sendConfig = () => {
        setLoading(true);
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

    const getConfigValues = () => {
        if (listScannerSettings) {
            let configFields = [...listScannerSettings];
            configFields.forEach((config) => {
            let tag = "input";
            console.log(config);
            const possibleValues = config.possibleValues.map((pv) => pv.value);
            let tagValue = possibleValues[0];
            config.currentValue = [
                {
                    id: profile.value,
                    text: profile.value,
                    tagValue,
                    tag,
                },
            ];
            });
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
            <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                Advanced Settings
            </Typography>
            <Divider sx={{my: 4}}/>
            <FormGroup sx={{my: 2}}>
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
            {getConfigValues().map((data, i) => (
                <Grid container key={i} p={0} m={0}>
                    <Grid item xs={12} sm={6}>
                        {data?.currentValue ? (
                            <>
                                <Typography 
                                    fontSize='14px' 
                                    fontWeight={400} 
                                    sx={{color: '#747474'}}
                                >
                                    {data.labelName}
                                </Typography>
                                <FormGroup sx={{my: 2}}>
                                    <Select
                                        onChange={(e) =>
                                            handleChangeTag(e.target.value, i)
                                        }
                                        value={data.possibleValues[0].value}
                                    >
                                        {data.possibleValues.map((pv) => (
                                        <MenuItem value={pv.value}>
                                            {pv.value}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <InputField
                                    fullWidth
                                    value={data?.currentValue}
                                    onChange={(e) =>
                                        setConfigValue(e.target.value, i)
                                }
                                />
                            </>
                        ) : null}
                    </Grid>
                </Grid>
            ))}
            </Box>
        </Modal>
    );
};

export default AdvancedSettingForm;
