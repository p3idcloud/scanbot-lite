import Button from 'components/Button';
import Modal from 'components/Modal';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AccountSettingForm from 'components/Form/AccountSettingForm';
import DocsumoForm from 'components/Form/DocsumoForm';
import OpentextForm from 'components/Form/OpentextForm';
import C2PAForm from 'components/Form/C2PAForm';
import BarleaForm from 'components/Form/BarleaForm';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings = ({ open, close, ...rest }) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        </>
      }
    >
      <Box display="flex" padding={1} flexDirection="column" width={1} minHeight="300px">
        <Typography fontWeight={600} fontSize="20px" lineHeight="28px" textAlign="center">
          Settings
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', alignItems: 'left' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label='setting-tab'>
            <Tab label="Account" {...a11yProps(0)} />
            <Tab label="Plugin" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <AccountSettingForm />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <DocsumoForm />
          <OpentextForm />
          <BarleaForm />
          <C2PAForm />
        </CustomTabPanel>
      </Box>
    </Modal>
  );
};

export default Settings;
