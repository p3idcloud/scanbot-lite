import { Tabs, Tab, AppBar } from "@mui/material";
import ScannerSetting from "./ScannerSetting";
import ScannerDashboard from "./Dashboard";
import { useState } from "react";

function ScannerDashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e, newValue) => setTabValue(newValue);

  return (
    <>
      <AppBar  position='relative' sx={{mb: 3, bgcolor: 'white'}}>
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant='fullWidth'
          >
              <Tab label="Dashboard" />
              <Tab label="Settings" />
          </Tabs>
      </AppBar>
      {tabValue === 1 && (
        <ScannerSetting />
      )}
      {tabValue === 0 && (
        <ScannerDashboard />
      )}
    </>
  );
}

export default ScannerDashboardPage;
