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
    opentext_url: Yup.string().required('Opentext URL is Required'),
    tenant_id: Yup.string().required('Tenant ID is Required'),
    client_id: Yup.string().required('Client ID is Required'),
    client_secret: Yup.string().required('Client Secret is Required'),
  })
});

const OpentextForm = () => {
  const { data: pluginData, error: pluginErr } = useSWR(
    `api/plugin/OPENTEXT`,
    fetchDataSWR
  );
  const [loading, setLoading] = useState(false);
  // Initial form values
  const initialValues = {
    name: "OPENTEXT",
    data: {
      opentext_url:  pluginData?.data.opentext_url || '',
      tenant_id: pluginData?.data.tenant_id ||'',
      client_id: pluginData?.data.client_id ||'',
      client_secret:pluginData?.data.client_secret ||'',
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await fetchData(`api/plugin`, {
        method: 'PATCH',
        data: values,
      });
      toast.success('Successfully updated Opentext');
    } catch (error) {
      toast.error('Failed to update Opentext');
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const handleTestConnection = async (values) => {
    try {
      const response = await fetchData(`api/opentext/verify`, {
        method: 'POST',
        data: values.data,
      });
      
      toast.success('Opentext connection success');
    } catch (error) {
      toast.error('Opentext connection failed');
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleBlur, handleChange, values, errors }) => (
        <Form style={{ width: '100%' }}>
          <Divider>Opentext</Divider>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Opentext URL"
                fullWidth id="opentext_url"
                name='data.opentext_url'
                value={values.data.opentext_url}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Opentext URL" 
                error={Boolean(errors.data?.opentext_url)}
                helperText={errors.data?.opentext_url && errors.data?.opentext_url}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                  label="Tenant ID"
                  fullWidth id="tenant_id"
                  name='data.tenant_id'
                  value={values.data.tenant_id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Tenant ID" 
                  error={Boolean(errors.data?.tenant_id)}
                  helperText={errors.data?.tenant_id && errors.data?.tenant_id}
                  type="password"
              />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
                label="Client ID"
                fullWidth id="client_id"
                name='data.client_id'
                value={values.data.client_id}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Client ID" 
                error={Boolean(errors.data?.client_id)}
                helperText={errors.data?.client_id && errors.data?.client_id}
                type="password"
              />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
              label="Client Secret"
              fullWidth id="client_secret"
              name='data.client_secret'
              value={values.data.client_secret}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Client Secret" 
              error={Boolean(errors.data?.client_secret)}
              helperText={errors.data?.client_secret && errors.data?.client_secret}
              type="password"
            />
          </FormControl>
          <Button variant='contained' type="submit">Update</Button>
          <Button variant='contained'
            sx={{ml: 2}} 
            onClick={() => handleTestConnection(values)}
          >
            Test Connection
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default OpentextForm;