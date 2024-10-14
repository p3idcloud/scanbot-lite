import { Grid2 as Grid, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import DeleteConfirmation from "components/AppModals/DeleteConfirmation";
import Button from "components/Button";
import Card from "components/Card";
import Table from "components/Table";
import { FieldArray, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { RiDeleteBin4Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import ScannerConfigValueForm from "components/AppModals/ScannerConfigValueForm";


export default function PossibleValues({data})  {
    const { values, getFieldProps } = useFormikContext();
    
    const tableHeaders = ['Label', 'Value', 'Description', 'Input Type', 'Action'];
    const rowsPerPage = 10;
    const [pageIndex, setPageIndex] = useState(1);
    const [deleteValue, setDeleteValue] = useState(null);
    const [openScannerValueForm, setOpenScannerValueForm] = useState(false);
    const [editValue, setEditValue] = useState(null)

    const handlePageIndexChange = (e, newIndex) => {
        setPageIndex(newIndex + 1);
    }

    const handleEditClick = (index) => {
        setEditValue({
            index: index,
            value: getFieldProps()?.value?.possibleValues?.[index]?.value,
            description: getFieldProps()?.value?.possibleValues?.[index]?.description,
            label: getFieldProps()?.value?.possibleValues?.[index]?.label,
            type: getFieldProps()?.value?.possibleValues?.[index]?.type
        });
        setOpenScannerValueForm(true);
    }

    const tableData = useMemo(() => (
        getFieldProps()?.value?.possibleValues?.map((possibleValue, index) => [
            possibleValue.label,
            possibleValue.value,
            possibleValue.description,
            possibleValue.type,
            <Stack direction='row' spacing={1}>
                <Tooltip title="Edit" sx={{p: 0}}>
                    <IconButton color="primary" onClick={() => handleEditClick(index)}>
                        <MdOutlineEdit size={20}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" 
                    componentsProps={{
                        tooltip: {
                            sx: {
                                borderColor: "#FFA0A0 !important",
                                color: "#FFA0A0 !important"
                            }
                        }
                    }}
                    sx={{p: 0}}
                >
                    <IconButton 
                        color="red" 
                        onClick={() => setDeleteValue({
                            index: index,
                            value: data?.possibleValues?.[index]?.value || 
                                values.possibleValues[index]?.value,
                            description: data?.possibleValues?.[index]?.description || 
                                values.possibleValues[index]?.description,
                            label: data?.possibleValues?.[index]?.label || 
                                values.possibleValues[index]?.label,
                            type: data?.possibleValues?.[index]?.type || 
                            values.possibleValues[index]?.type,
                        })}
                    >
                        <RiDeleteBin4Line size={20} />
                    </IconButton>
                </Tooltip>
            </Stack>
        ])
    ), [getFieldProps().value])
    return (
        (<Card withpadding>
            <FieldArray name="possibleValues">
            {({ remove, push, replace, form }) => {
                return (<>
                    <Grid container direction='row' justifyContent='space-between'>
                        <Grid>
                            <Typography sx={{mb: 4, fontWeight:600, fontSize: '16px', fontColor: '#0D0D0D'}}>
                                Possible Values
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button
                                size="small"
                                color="orange"
                                startIcon={<AiOutlinePlus />}
                                onClick={() => setOpenScannerValueForm(true)}
                            >
                                Create New Value
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container mt={1}>
                        <Table
                            rowCount={values.possibleValues.length}
                            rowsPerPage={rowsPerPage}
                            pageIndex={pageIndex}
                            handlePageIndexChange={handlePageIndexChange}
                            tableHead={tableHeaders}
                            tableData={tableData}
                        />
                    </Grid>
                    <DeleteConfirmation 
                        open={Boolean(deleteValue)}
                        title="Delete Possible Value"
                        subTitle={`Are you sure you want to delete '${deleteValue?.label}' ?`}
                        onDelete={() => {
                            remove(deleteValue?.index);
                            setDeleteValue(null);
                        }}
                        onClose={()=>setDeleteValue(null)}
                    />
                    <ScannerConfigValueForm
                        open={openScannerValueForm}
                        close={() => {
                            setEditValue(null);
                            setOpenScannerValueForm(false);
                        }}
                        index={editValue?.index ?? 0}
                        label={editValue?.label ?? ''}
                        value={editValue?.value ?? ''}
                        type={editValue?.type ?? ''}
                        description={editValue?.description ?? ''}
                        newValue={!Boolean(editValue)}
                        push={push}
                        replace={replace}
                    />
                </>);
                }}
            </FieldArray>
        </Card>)
    );
}