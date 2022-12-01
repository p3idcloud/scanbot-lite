import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from 'yup';
import { Box, FormControlLabel, FormControl, Divider, Typography, Switch } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchData } from 'lib/fetch';
import { useAccount } from 'lib/contexts/accountContext';

const validationSchema = Yup.object().shape({
  mobileNumber: Yup.string(),
  enabled2FA: Yup.boolean(),
  docsumoApiKey: Yup.string()
});

const Settings = ({ open, close, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const { setAccount, account } = useAccount();
  const { accountId, mobileNumber, enabled2FA, docsumoApiKey } = account;
  const initialValues = {
    mobileNumber: mobileNumber ?? '',
    enabled2FA: enabled2FA ?? false,
    docsumoApiKey: docsumoApiKey ?? ''
  };

  const handleSubmit = (e, {resetForm}) => {
    setLoading(true);
    const data = {
      mobileNumber: e.mobileNumber,
      enabled2FA: e.enabled2FA,
      docsumoApiKey: e.docsumoApiKey
    };
    // console.log(data);
    fetchData(`${process.env.backendUrl}api/accounts/${accountId ?? ''}`, {
      method: 'PATCH',
      data,
    })
      .then((res) => {
        setLoading(false);
        toast.success('Successfully updated settings');
        close();
      })
      .catch((err) => {
        setLoading(false);
        toast.error('Failed to update settings');
      })
      .finally(() => {
        resetForm();
        setAccount(account => ({
              ...account,
              ...data
        }));
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ handleBlur, handleChange, submitForm, values }) => {
        return (
          <Modal
            open={open}
            customBodyFooter={
              <>
                <Button
                  onClick={() => {
                    close();
                  }}
                  variant="outlined"
                  color="primaryBlack"
                  autoWidth
                  size="medium"
                >
                  Cancel
                </Button>
                <Button onClick={submitForm} variant="contained" autoWidth size="medium" loading={loading}>
                  Update
                </Button>
              </>
            }
          >
            <Box display="flex" padding={4} flexDirection="column" justifyContent="center" alignItems="center" width={1}>
              <Form style={{ width: '100%' }}>
                <Typography fontWeight={600} fontSize="20px" lineHeight="28px">
                  Authentication Settings
                </Typography>
                <Divider sx={{ my: 4 }} />
                <FormControl sx={{ my: 2 }} fullWidth>
                  <FormControlLabel label="Enable 2FA?" control={<Switch id="enabled2FA" onBlur={handleBlur} onChange={handleChange} />} />
                </FormControl>
                <FormControl sx={{ my: 2 }} fullWidth>
                  <InputField label="Mobile Number" fullWidth id="mobileNumber" name='mobileNumber' defaultValue={values.mobileNumber} onBlur={handleBlur} onChange={handleChange} placeholder="Mobile Number" />
                </FormControl>
                <FormControl sx={{ my: 2 }} fullWidth>
                  <Typography fontWeight={700} color='#4D61FC' mb={2}>Docsumo API</Typography>
                  <InputField label="Api Key" fullWidth id="apikey" name='docsumoApiKey' value={values.docsumoApiKey} onBlur={handleBlur} onChange={handleChange} placeholder="Api Key" />
                </FormControl>
              </Form>
            </Box>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default Settings;
