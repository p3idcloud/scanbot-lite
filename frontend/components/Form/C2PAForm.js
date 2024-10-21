import InputField from 'components/InputField';
import * as Yup from 'yup';
import { Box, FormControlLabel, FormControl, Typography, Switch, Divider } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchData } from 'lib/fetch';
import { useAccount } from 'lib/contexts/accountContext';

// Validation schema
const validationSchema = Yup.object({
  mobileNumber: Yup.string().nullable(),
  enabled2FA: Yup.boolean(),
});

const C2PAForm = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const { setAccount, account } = useAccount();
  const { accountId, mobileNumber, enabled2FA, docsumoApiKey } = account || {};

  // Initial form values
  const initialValues = {
    mobileNumber: mobileNumber ?? '',
    enabled2FA: enabled2FA ?? false,
    docsumoApiKey: docsumoApiKey ?? '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);

    const data = {
      mobileNumber: values.mobileNumber,
      enabled2FA: values.enabled2FA,
      docsumoApiKey: values.docsumoApiKey,
    };

    try {
      await fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/accounts/${accountId ?? ''}`, {
        method: 'PATCH',
        data,
      });
      toast.success('Successfully updated settings');
      close();

      // Update the account context
      setAccount((prevAccount) => ({ ...prevAccount, ...data }));
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
      {({ handleBlur, handleChange, values }) => (
        <Form style={{ width: '100%' }}>
          <Divider>C2PA</Divider>
          <Typography>C2PA is Enabled for this Account</Typography>
        </Form>
      )}
    </Formik>
  );
};

export default C2PAForm;