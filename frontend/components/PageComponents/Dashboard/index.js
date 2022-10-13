import React, { useEffect, useState } from "react";
import { Container, Grid, TablePagination, Typography } from "@mui/material";
import { useAccount } from "lib/contexts/accountContext";
import useSWR from "swr";
import { fetchData } from "lib/fetch";
import ScannerListContainer from "./ScannerListContainer";
import Card from "components/Card";

function Dashboard() {
  const { scannerList, setScannerList } = useAccount();

  const rowsPerPage = 6;
  const [rowCount, setRowCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const handlePageIndexChange = (e, newIndex) => setPageIndex(newIndex+1);

  const { data, error, isValidating } = useSWR(
    `${process.env.backendUrl}api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`,
    fetchData,
    {
      refreshInterval: 5000
    }
  );

  useEffect(() => {
    if (data) {
      setScannerList(data?.data ?? []);
      setRowCount(data?.dataCount ?? 0);
    }
  }, [data, pageIndex]);

  return (
    <Container>
      <Grid container sx={{ padding: '30px 0' }} spacing={2}>
        <Grid item xs={12} display="flex" alignItems="center">
            <Typography sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '24px', color: '#190D29' }}>
              Scanner List
            </Typography>
        </Grid>
          
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '19px', color: '#190D29' }}>
            List of connected scanners
          </Typography>
        </Grid>

        {scannerList?.length === 0 && (
          <Grid item xs={12} container display="flex" alignItems="center" justifyContent="center">
            <Card withpadding>
              <Typography 
                textAlign='center'
                mb={2}
                sx={{ 
                  fontWeight: 500, 
                  fontSize: '20px', 
                  lineHeight: '24px', 
                  color: '#190D29' 
                }}
              >
                You have no scanners set up
              </Typography>

              <Typography 
                textAlign='center'
                sx={{ 
                  fontWeight: 500, 
                  fontSize: '16px', 
                  lineHeight: '19px', 
                  color: '#190D29' 
                }}
              >
                connect a scanner
              </Typography>
            </Card>
          </Grid>
        )}

        {scannerList?.map((scanner) => (
          <Grid item xs={12} md={6}>
            <ScannerListContainer 
              {...scanner} 
              setPageIndex={setPageIndex} 
              pageIndex={pageIndex} 
              rowsPerPage={rowsPerPage} 
            />
          </Grid>
        ))}

        {scannerList.length > 0 && (
          <Grid item xs={12}>
            <TablePagination
                component="div"
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                count={rowCount}
                page={pageIndex-1}
                onPageChange={handlePageIndexChange}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;