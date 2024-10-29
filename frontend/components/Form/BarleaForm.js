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
    endpoint: Yup.string().required('Endpoint is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    source_id: Yup.string().required('Source ID is required'),
    subject_id: Yup.string().required('Subject ID is required')
  })
});

const BarleaForm = () => {
  const { data: pluginData, error: pluginErr } = useSWR(
    `api/plugin/BARLEA`,
    fetchDataSWR
);
  const [loading, setLoading] = useState(false);
  // Initial form values
  const initialValues = {
    name: "BARLEA",
    data: {
      endpoint: pluginData?.data.endpoint || '',
      username: pluginData?.data.username || '',
      password: pluginData?.data.password || '',
      source_id: pluginData?.data.source_id || '',
      subject_id: pluginData?.data.subject_id || ''
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);

    try {
      await fetchData(`api/plugin`, {
        method: 'PATCH',
        data: values,
      });
      toast.success('Successfully updated settings');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
      resetForm();
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
          <Divider>Barlea</Divider>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Endpoint"
                fullWidth id="endpoint"
                name='data.endpoint'
                value={values.data?.endpoint}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Endpoint" 
                error={Boolean(errors.data?.endpoint)}
                helperText={errors.data?.endpoint && errors.data?.endpoint}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Username"
                fullWidth id="username"
                name='data.username'
                value={values.data?.username}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Username" 
                error={Boolean(errors.data?.username)}
                helperText={errors.data?.username && errors.data?.username}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Password"
                fullWidth id="password"
                name='data.password'
                value={values.data?.password}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Password" 
                error={Boolean(errors.data?.password)}
                helperText={errors.data?.password && errors.data?.password}
                type="password"
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Source ID"
                fullWidth id="source_id"
                name='data.source_id'
                value={values.data?.source_id}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Source ID" 
                error={Boolean(errors.data?.source_id)}
                helperText={errors.data?.source_id && errors.data?.source_id}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Subject ID"
                fullWidth id="subject_id"
                name='data.subject_id'
                value={values.data?.subject_id}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Subject ID" 
                error={Boolean(errors.data?.subject_id)}
                helperText={errors.data?.subject_id && errors.data?.subject_id}
            />
          </FormControl>
          <Button variant='contained' type="submit">Update</Button>
        </Form>
      )}
    </Formik>
  );
};

export default BarleaForm;