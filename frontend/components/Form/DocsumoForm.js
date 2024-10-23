import InputField from 'components/InputField';
import * as Yup from 'yup';
import { Box, FormControlLabel, FormControl, Typography, Switch, Divider, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchData, fetchDataSWR } from 'lib/fetch';
import { useAccount } from 'lib/contexts/accountContext';
import useSWR from 'swr';

// Validation schema
const validationSchema = Yup.object({
  data: Yup.object().shape({
    apikey: Yup.string().required('Apikey is Required'),
  }),
});

const DocsumoForm = () => {
  const { data: pluginData, error: pluginErr } = useSWR(
      `${process.env.BACKEND_URL}api/plugin/DOCSUMO`,
      fetchDataSWR
  );

  const [loading, setLoading] = useState(false);

  // Initial form values
  const initialValues = {
    name: "DOCSUMO",
    data: {
        apikey: pluginData?.data.apikey || ''
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await fetchData(`${process.env.BACKEND_URL}api/plugin`, {
        method: 'PATCH',
        data: values,
      });
      toast.success('Successfully updated settings');
    } catch (error) {
      console.log(error)
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleBlur, handleChange, values, errors }) => (
        <Form style={{ width: '100%' }}>
          <Divider>Docsumo</Divider>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Api Key"
                fullWidth id="apikey"
                name='data.apikey'
                value={values.data.apikey}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Api Key" 
                error={Boolean(errors.data?.apikey)}
                helperText={errors.data?.apikey && errors.data?.apikey}
            />
            {}
          </FormControl>
          <Button variant='contained' type="submit">Update</Button>
        </Form>
      )}
    </Formik>
  );
};

export default DocsumoForm;