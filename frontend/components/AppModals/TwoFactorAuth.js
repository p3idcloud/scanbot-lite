import { useState, useEffect } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { parseCookies, setCookie } from 'nookies';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const TwoFactorAuth = ({ mobileNumber }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataAuth, setDataAuth] = useState(null);

  const cookies = parseCookies();

  const callbackResultIvalt = (error, response, data) => {
    if (error) {
      if (data?.poll <= 30) {
        const api = window.ivalt;
        setTimeout(() => {
          api.biometricResultRequest(mobileNumber, (err, _, res) =>
            callbackResultIvalt(err, res, {
              mobile: mobileNumber,
              poll: data?.poll + 1,
            })
          );
        }, 1000);
      } else {
        if (!dataAuth || dataAuth?.logout) {
          setLoading(false);
          setDataAuth({ ...dataAuth, logout: true });
        }
      }
    } else {
      const dataUser = response?.text && JSON.parse(response?.text);
      const objectData = {
        name: dataUser?.data?.details?.name || '-',
        mobile: dataUser?.data?.details?.mobile || '-',
        address: dataUser?.data?.details?.address || '-',
      };
      setDataAuth(objectData);
      setCookie(null, 'ivalt-cookies', 'valid', { expires: 7 });
      setTimeout(() => setOpen(false), 2000);
      toast.success('Auth successfully');
      setLoading(false);
    }
  };

  const callbackIvalt = (error) => {
    if (error) {
      console.error(error)
      setLoading(false);
      toast.error(`${error?.response?.body?.error?.detail || 'Error Auth'}. Please try again`);
    } else {
      const api = window.ivalt;
      api.biometricResultRequest(mobileNumber || 0, (error, _, response) =>
        callbackResultIvalt(error, response, {
          mobile: mobileNumber,
          poll: 1,
        })
      );
    }
  };

  const handleSubmit = (data) => {
    setDataAuth(null);
    setLoading(true);
    const api = window.ivalt;
    api.biometricAuthRequest(data?.number || 0, callbackIvalt);
  };

  useEffect(() => {
    const getIvaltCookies = cookies['ivalt-cookies'];
    if (!getIvaltCookies) {
      setOpen(true);
    }
  }, [mobileNumber]);

  return (
    <Modal
      open={open}
      customBodyFooter={
        <>
          <Button variant="outlined" color="primaryBlack" autoWidth size="medium">
            Logout
          </Button>
          <Button onClick={() => handleSubmit({ number: mobileNumber })} variant="contained" autoWidth size="medium" loading={loading}>
            {loading ? 'Verifying...' : 'Verify iValt 2FA'}
          </Button>
        </>
      }
    >
      <Typography fontSize={14} color="black.main" paddingTop={0.5}>
        Please continue the verification process with your iValt account!
      </Typography>
    </Modal>
  );
};

export default TwoFactorAuth;
