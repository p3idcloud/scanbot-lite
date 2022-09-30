import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { fetchData } from 'lib/fetch';
import { toast } from 'react-toastify';
import GridContainer from 'components/Grid/GridContainer';
import RegularButton from 'components/CustomButtons/Button';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { FormGroup } from '@mui/material';
import { FilledInput, InputLabel } from '@material-ui/core';

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
        toast.success("Successfull Updated!");
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
        toast.success("Successfull Deleted!");
      })
      .catch((err) => {
        toast.error(err?.response?.data || "Failed");
      })
      .finally(() => setLoading(false));
  };
  return (
    <Card>
        <CardHeader color='primary'>
            <h1>{tab === -1 ? "Create" : "Update"}</h1>
        </CardHeader>
        <CardBody>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, handleChange, handleBlur, setFieldValue }) => {
                return (
                    <Form className="">
                    <GridContainer>
                        <GridItem xs={12} lg={6}>
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
                        </GridItem>
                        <GridItem xs={12} lg={6}>
                            <h4>Possible Values</h4>
                            <FieldArray name="possibleValues">
                            {({ insert, remove, push }) => {
                                return (
                                <div>
                                    {values.possibleValues.length > 0 &&
                                    values.possibleValues.map((_, index) => {

                                        return (
                                        <GridContainer key={index}>
                                            <GridItem xs={12}>
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
                                            </GridItem>
                                            <GridItem xs={12}>
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
                                            </GridItem>
                                            <GridItem xs={12}>
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
                                            </GridItem>
                                            <GridItem xs={12}>
                                                <RegularButton
                                                    color="info"
                                                    onClick={() => remove(index)}
                                                >
                                                    Remove
                                                </RegularButton>
                                                {values.possibleValues.length ===
                                                    index + 1 && (
                                                    <RegularButton
                                                        color="info"
                                                        onClick={() =>
                                                            push({ label: "", value: "" })
                                                        }
                                                    >
                                                        Add another
                                                    </RegularButton>
                                                )}
                                            </GridItem>
                                        </GridContainer>
                                        );
                                    })}
                                </div>
                                );
                            }}
                            </FieldArray>
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem>
                            {tab !== 0 && (
                            <RegularButton
                                onClick={() => handleRemove(values.id)}
                                color='info'
                            >
                                Delete
                            </RegularButton>
                            )}
                            <RegularButton
                                type="submit"
                                color='info'
                            >
                                {tab === -1 ? "Create" : "Update"}
                            </RegularButton>
                        </GridItem>
                    </GridContainer>
                </Form>
                );
                }}
            </Formik>
        </CardBody>
    </Card>
  );
}
