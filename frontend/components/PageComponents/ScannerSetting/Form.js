import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { fetchData } from 'lib/fetch';
import { toast } from 'react-toastify';
import { FormGroup, Grid, FilledInput, InputLabel, Tab, Tabs, Box } from '@mui/material';
import Button from 'components/Button';

const arrForm = [
  { title: 'Id', name: 'id' },
  { title: 'Label name', name: 'labelName' },
  { title: 'Description', name: 'description' },
  { title: 'Default value', name: 'defaultValue' },
  { title: 'Value Type', name: 'valueType' },
  { title: 'Object', name: 'object' },
  { title: 'Vendor', name: 'vendor' }
];


const initialPossibleValues = [
        {
          label: "",
          description: "",
          value: "",
        }
      ]

const apiUrl = `${process.env.backendUrl}api/scannersetting`;

export default function ScannerSettingForm({ data, mutate, tab }) {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const initialValues = {
    id: data?.id || "",
    labelName: data?.labelName || "",
    description: data?.description || "",
    currentValue: data?.currentValue || "",
    object: data?.object || "",
    defaultValue: data?.defaultValue || "",
    valueType: data?.valueType || "",
    policyType: data?.policyType || "",
    vendor: data?.vendor || "",
    possibleValues: data?.possibleValues || initialPossibleValues,
  };

  const handleSubmit = (e, { resetForm }) => {
    setLoading(true);
    const dataValue = e;
    // const possibleValues = dataValue.possibleValues;
    // const resultPossibleValues = Remove(possibleValues, (item) => isEmpty(item));
    // dataValue.possibleValues = resultPossibleValues;
    const url =
      tab === -1
        ? `${process.env.backendUrl}api/scannersetting`
        : `${process.env.backendUrl}api/scannersetting/${initialValues.id}`;
    const method = tab === -1 ? "POST" : "PATCH";
    fetchData(url, {
      method: method,
      data: dataValue,
    })
      .then((res) => {
        mutate(apiUrl);
        toast.success("Successfully Updated!");
        if (tab === -1) {
          resetForm();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data || "Failed");
      })
      .finally(() => setLoading(false));
  };

  const handleRemove = (id) => {
    fetchData(`${process.env.backendUrl}api/scannersetting/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        mutate(apiUrl);
        toast.success("Successfully Deleted!");
      })
      .catch((err) => {
        toast.error(err?.response?.data || "Failed");
      })
      .finally(() => setLoading(false));
  };

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  }

  return (
    <>
        <Box direction='flex' flexDirection="row" justifyContent="space-between">
            <Tabs value={tabValue} onChange={handleTabChange} sx={{width: 350}}>
                <Tab label="Config Description" />
                <Tab label="Possible Values" />
            </Tabs>
            
            <Button type="submit" autoWidth>
                {tab === -1 ? "Create" : "Update"}
            </Button>
        </Box>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, handleChange, handleBlur, setFieldValue }) => {
            return (
                <Form>
                    <Grid container width={600}>
                        <Grid item xs={12}>
                        {tabValue === 1 && (
                            <>
                                <FieldArray name="possibleValues">
                                {({ insert, remove, push }) => {
                                    return (
                                    <div>
                                        {values.possibleValues.length > 0 &&
                                        values.possibleValues.map((_, index) => {

                                            return (
                                            <Grid container key={index}>
                                                <Grid item>
                                                <FormGroup>
                                                    <InputLabel>
                                                        Label
                                                    </InputLabel>
                                                    <FilledInput
                                                        id={`possibleValues.${index}.label`}
                                                        aria-invalid={false}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            data?.possibleValues?.[index]?.label ||
                                                            values.possibleValues[index]?.label || ""
                                                        }
                                                        placeholder={"Please input label"}
                                                    />
                                                </FormGroup>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormGroup>
                                                        <InputLabel>
                                                            Value
                                                        </InputLabel>
                                                        <FilledInput
                                                            id={`possibleValues.${index}.value`}
                                                            aria-invalid={false}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={
                                                                data?.possibleValues?.[index]?.value ||
                                                                values.possibleValues[index]?.value || ""
                                                            }
                                                            placeholder={"Please input value"}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormGroup>
                                                        <InputLabel>
                                                            Description
                                                        </InputLabel>
                                                        <FilledInput
                                                            id={`possibleValues.${index}.description`}
                                                            aria-invalid={false}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={
                                                                data?.possibleValues?.[index]?.description ||
                                                                values.possibleValues[index]?.description || ""
                                                            }
                                                            placeholder={"Please input description"}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button onClick={() => remove(index)}>
                                                        Remove
                                                    </Button>
                                                    {values.possibleValues.length ===
                                                        index + 1 && (
                                                        <Button
                                                            onClick={() =>
                                                                push({ label: "", value: "" })
                                                            }
                                                        >
                                                            Add another
                                                        </Button>
                                                    )}
                                                </Grid>
                                            </Grid>
                                            );
                                        })}
                                    </div>
                                    );
                                }}
                                </FieldArray>
                                <Grid item>
                                    {tab !== 0 && (
                                    <Button onClick={() => handleRemove(values.id)}>
                                        Delete
                                    </Button>
                                    )}
                                </Grid>
                            </>
                        )}

                        {tabValue === 0 && (
                            <>
                            {arrForm.map((item, index) => {
                                return (
                                <FormGroup key={index}>
                                    <InputLabel>
                                    {item.title}
                                    </InputLabel>
                                    <FilledInput
                                        id={item.name}
                                        aria-invalid={false}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values[item.name]}
                                        placeholder={`Please input ${item.title}`}
                                    />
                                </FormGroup>
                                );
                            })}
                            </>
                        )}
                        </Grid>
                    </Grid>
                </Form>
                );
            }}
        </Formik>
    </>
  );
}