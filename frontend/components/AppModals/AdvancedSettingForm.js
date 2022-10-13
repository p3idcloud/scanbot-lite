import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from "yup";
import { Box, Typography, FormGroup, FormHelperText, Divider } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { mutate } from 'swr';
import { useScanner } from 'lib/contexts/scannerContext';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  model: Yup.string().required("required")
});

const AdvancedSettingForm = ({ open, close }) => {
    const [loading, setLoading] = useState(false);
    
    const { 
        listProfileScanner,
        profileSelect,
        setProfileSelect,
        setListScannerSettings,
        formSetting,
        setFormSetting,
        setSaveProfile,
        isChange,
        setIsChange,
        listScannerSettings,
    } = useScanner();

    const initialValues = {
        name: "",
        model: "",
        description: ""
    };

    const handleSubmit = (e) => {
        setLoading(true);
        const data = {
            name: e.name,
            model: e.model,
            description: e.description
        }
        fetchData(`${process.env.backendUrl}api/scanners/${id ?? ''}`, {
        method: "PATCH",
        data,
        })
        .then((res) => {
        })
        .catch(() => {
            toast.error("Failed to save setting");
        })
        .finally(() => {
            setLoading(false);
            close();
        });
    };
    
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
        {({ values, errors, touched, handleChange, handleBlur, submitForm }) => {
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
                    onClick={submitForm}
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
                <Form style={{width: '100%'}}>
                    <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                        Advanced Settings
                    </Typography>
                    <Divider sx={{my: 4}}/>
                    <FormGroup sx={{my: 2}}>
                    <InputField
                        label="Name"
                        fullWidth
                        id='name'
                        defaultValue={initialValues.name}
                        aria-invalid={Boolean(touched.name && errors.name)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Name"
                    />
                        <Typography color="red">{errors.name}</Typography>
                    </FormGroup>
                    <FormGroup sx={{my: 2}}>
                    <InputField
                        label="Model"
                        fullWidth
                        id='model'
                        defaultValue={initialValues.model}
                        aria-invalid={Boolean(touched.model && errors.model)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Model"
                    />
                        <Typography color="red">{errors.model}</Typography>
                    </FormGroup>
                    <FormGroup sx={{my: 2}}>
                    <InputField
                        label="Description"
                        variant="outlined"
                        id="description"
                        fullWidth
                        multiline
                        minRows={3}
                        aria-invalid={Boolean(
                            touched.description && errors.description
                        )}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        placeholder="Description"
                    />
                    </FormGroup>
                </Form>
                </Box>
            </Modal>
            );
        }}
        </Formik>
    );
};

export default AdvancedSettingForm;
