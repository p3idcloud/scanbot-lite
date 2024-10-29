import { Form, Formik } from 'formik';
import { fetchData } from 'lib/fetch';
import { toast } from 'react-toastify';
import { Grid2 as Grid } from '@mui/material';
import ConfigDescription from './ConfigDescription';
import * as Yup from "yup";
import PossibleValues from './PossibleValues';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
    id: Yup.string().required("required"),
    labelName: Yup.string().required("required"),
    attributeName: Yup.string().required("required"),
    description: Yup.string().required("required"),
    defaultValue: Yup.string().required("required"),
    // currentValue: Yup.string().required("required"),
    valueType: Yup.string().required("required"),
    object: Yup.string().required("required"),
    vendor: Yup.string().required("required")
});


const initialPossibleValues = []

export default function ScannerSettingForm({ data, mutate, tab }) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    id: data?.id || "",
    labelName: data?.labelName || "",
    attributeName: data?.attributeName || "",
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
    // console.log(dataValue);
    const url =
      tab === -1
        ? `api/scannersetting`
        : `api/scannersetting/${initialValues.id}`;
    const method = tab === -1 ? "POST" : "PATCH";
    fetchData(url, {
      method: method,
      data: {
        currentValue: dataValue.defaultValue,
        ...dataValue
      },
    })
      .then((res) => {
        mutate(`api/scannersetting`)
          .then(() => {
            setLoading(false);
            toast.success("Successfully Updated!");
            if (tab === -1) {
              resetForm();
            }
          }, () => {
            setLoading(false);
            toast.error("Failed to delete");
            if (tab === -1) {
              resetForm();
            }
          });
      })
  };

  return (<>
    <Formik 
        initialValues={initialValues} 
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
    >
        <Form style={{width: '100%'}}>
            <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,
                    md: 5
                  }}>
                    <ConfigDescription loading={loading} tab={tab} />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    md: 7
                  }}>
                    <PossibleValues data={data} tab={tab} />
                </Grid>
            </Grid>
        </Form>
    </Formik>
  </>);
}