import { Box, FormGroup, Typography, Grid2 as Grid } from "@mui/material";
import DeleteConfirmation from "components/AppModals/DeleteConfirmation";
import Button from "components/Button";
import Card from "components/Card";
import InputField from "components/InputField";
import { useFormikContext } from "formik";
import { fetchData } from "lib/fetch";
import { useState } from "react";
import { RiDeleteBin4Line, RiSaveLine } from 'react-icons/ri';
import { toast } from "react-toastify";
import { mutate } from "swr";

const arrForm = [
    { title: 'ID', name: 'id' },
    { title: 'Label name', name: 'labelName' },
    { title: 'Attribute value', name: 'attributeName', helperText: 'Enter a unique identifier if not an attribute (avoid \`-\`s)'},
    { title: 'Description', name: 'description' },
    { title: 'Default value', name: 'defaultValue' },
    { title: 'Value Type', name: 'valueType' },
    { title: 'Object', name: 'object' },
    { title: 'Vendor', name: 'vendor' }
];

export default function ConfigDescription({ tab, loading }) {
    const { touched, values, errors, handleBlur, handleChange, handleSubmit } = useFormikContext();
    const [deleteConfigOpen, setDeleteConfigOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleRemove = (id) => {
        setLoadingDelete(true);
        fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/scannersetting/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            mutate(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/scannersetting`)
                .then(() => {
                    toast.success("Successfully Deleted!");
                    setLoadingDelete(false);
                }, () => {
                    toast.error("Failed to delete");
                    setLoadingDelete(false);
                });
          });
    };

    return (<>
        <DeleteConfirmation
            open={deleteConfigOpen}
            title="Delete Config"
            subTitle={`Are you sure you want to delete ${values?.labelName}? This process cannot be undone.`}
            onDelete={() => {
                handleRemove(values.id);
                setDeleteConfigOpen(false);
            }}
            onClose={() => {
                setDeleteConfigOpen(false);
            }}
            loading={loadingDelete}
        />
        <Card withpadding>
            <Typography sx={{mb: 4, fontWeight:600, fontSize: '16px', fontColor: '#0D0D0D'}}>
                Config Description
            </Typography>

            <Grid container spacing={3}>
                {arrForm.map((item, index) => {
                    return (
                        (<Grid key={index} size={(index !== 4 && index !== 5) ? 12 : 6}>
                            <FormGroup>
                                <InputField
                                    fullWidth
                                    helperText={item.helperText}
                                    id={item.name}
                                    minRows={2}
                                    multiline={item.name === 'description' || item.name === 'object'}
                                    label={item.title}
                                    aria-invalid={Boolean(touched[item.name] && errors[item.name])}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values[item.name]}
                                    error={Boolean(errors[item.name])}
                                />
                            </FormGroup>
                        </Grid>)
                    );
                })}    
            </Grid>

            

            <Box 
                display='flex' 
                justifyContent={tab !== -1 ? 'space-between' : 'end'} 
                mt={3}
            >
                {tab !== -1 && (
                    <Button
                        color="red"
                        autoWidth
                        loading={loadingDelete}
                        startIcon={<RiDeleteBin4Line />}
                        onClick={()=>setDeleteConfigOpen(true)}
                    >
                        Delete
                    </Button>   
                )}
                <Button
                    autoWidth
                    loading={loading}
                    startIcon={<RiSaveLine />}
                    onClick={handleSubmit}
                >
                    {tab === -1 ? 'Create': 'Save'}
                </Button>
            </Box>
        </Card>
    </>);
}