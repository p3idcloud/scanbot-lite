import React, { useEffect, useState } from "react";
import { Box, Container, Grid2 as Grid, TablePagination, Typography } from "@mui/material";
import { useAccount } from "lib/contexts/accountContext";
import useSWR from "swr";
import { fetchData } from "lib/fetch";
import ScannerListContainer from "./ScannerListContainer";
import Card from "components/Card";
import CustomLoader from "components/Loader";
import { TbSettings } from "react-icons/tb";
import Link from "next/link";

function Dashboard() {
  const { scannerList, setScannerList } = useAccount();

  const rowsPerPage = 6;
  const [rowCount, setRowCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const handlePageIndexChange = (e, newIndex) => setPageIndex(newIndex+1);
  const { data, error, isValidating } = useSWR(
    `api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`,
    fetchData
  );
  useEffect(() => {
    if (data) {
      setScannerList(data?.data ?? []);
      setRowCount(data?.dataCount ?? 0);
    }
  }, [data, pageIndex]);

  return (
    (<Container>
      <Grid container sx={{ padding: '30px 0' }} spacing={2}>
        <Grid
          display="flex"
          alignItems="center"
          size={{
            xs: 12,
            sm: 6
          }}>
          <Box>
            <Typography mb={2} sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '24px', color: '#190D29' }}>
              Scanner List
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '19px', color: '#190D29' }}>
              List of connected scanners
            </Typography>
          </Box>
        </Grid>

        <Grid
          display="flex"
          alignItems="center"
          justifyContent='end'
          size={{
            xs: 12,
            sm: 6
          }}>
          <Link legacyBehavior href="/setting">
              <Box 
                component="a" 
                display='flex' 
                alignItems='center'
                sx={{
                    '&:hover': {
                        cursor: 'pointer'
                    }
                }}
              >
                <TbSettings size={22} style={{marginRight: 10}} />
                <Typography fontWeight={600} fontSize='16px'>
                    Global Setting
                </Typography>
              </Box>
          </Link>
        </Grid>

        {scannerList?.length === 0 && data && (
          <Grid
            container
            display="flex"
            alignItems="center"
            justifyContent="center"
            size={12}>
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

        {data ? (
          scannerList?.map((scanner, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              md: 6
            }}>
            <ScannerListContainer 
              {...scanner} 
              setPageIndex={setPageIndex} 
              pageIndex={pageIndex} 
              rowsPerPage={rowsPerPage} 
            />
          </Grid>
        ))) : (
          <Grid size={12}>
            <CustomLoader message="Loading scanners" />
          </Grid>
        )}

        {scannerList.length > 0 && (
          <Grid size={12}>
            <TablePagination
                component="div"
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                count={rowCount}
                page={pageIndex-1}
                onPageChange={handlePageIndexChange}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                showFirstButton
                showLastButton
            />
          </Grid>
        )}
      </Grid>
    </Container>)
  );
}

export default Dashboard;
