import InputField from 'components/InputField';
import * as Yup from 'yup';
import { Box, FormControlLabel, FormControl, Typography, Switch, Button } from '@mui/material';
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

const AccountSettingForm = () => {
  const [loading, setLoading] = useState(false);
  const { setAccount, account } = useAccount();
  const { accountId, mobileNumber, enabled2FA } = account || {};

  // Initial form values
  const initialValues = {
    mobileNumber: mobileNumber ?? '',
    enabled2FA: enabled2FA ?? false,
  };

  const handleSubmit = async (values, actions) => {
    setLoading(true);

    const data = {
      mobileNumber: values.mobileNumber,
      enabled2FA: values.enabled2FA,
      docsumoApiKey: values.docsumoApiKey,
    };

    try {
      await fetchData(`${process.env.BACKEND_URL}api/accounts/${accountId ?? ''}`, {
        method: 'PATCH',
        data,
      });
      toast.success('Successfully updated settings');
      // Update the account context
      setAccount((prevAccount) => ({ ...prevAccount, ...data }));
    } catch (error) {
        console.log(error)
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
      actions.resetForm();
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
          <FormControl sx={{ my: 2 }} fullWidth>
            <FormControlLabel
              label="Enable 2FA?"
              control={
                <Switch
                  id="enabled2FA"
                  name="enabled2FA"
                  checked={values.enabled2FA}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              }
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <InputField
              fullWidth
              label="Mobile Number"
              id="mobileNumber"
              name="mobileNumber"
              value={values.mobileNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
          </FormControl>
          <Button variant='contained' type="submit">Update</Button>
        </Form>
      )}
    </Formik>
  );
};

export default AccountSettingForm;