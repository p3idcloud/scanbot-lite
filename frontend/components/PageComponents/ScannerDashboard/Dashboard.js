import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
// @mui/core components
import { makeStyles } from "@mui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { fetchData } from "lib/fetch";
import { generateScannerDataTable, generateScannerTableHead } from "lib/scannerDataTable";
import { useAccount } from "lib/contexts/accountContext";
import CardFooter from "components/Card/CardFooter";
import { TablePagination } from "@mui/material";
import { generateScanHistoryDataTable, generateScanHistoryTableHead } from "lib/scanHistoryDataTable";
import { useMemo } from "react";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

function ScannerDashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { scannerList, setScannerList, scanHistory, setScanHistory } = useAccount();

  const rowsPerPage = 5;
  const { setAppModalAndOpen } = useAccount();
  const [rowCount, setRowCount] = useState(0);
  const [historyRowCount, setHistoryRowCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [historyPageIndex, setHistoryPageIndex] = useState(1);
  const scannerTableData = useMemo(() => 
    generateScannerDataTable(scannerList ?? [], () => {
      mutate(`${process.env.backendUrl}api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`)
    }), 
    [scannerList]
  );
  const historyTableData = useMemo(() =>
    generateScanHistoryDataTable(
      scanHistory ?? [], 
      () => {
        mutate(`${process.env.backendUrl}api/scanners/history?page=${historyPageIndex}&limit=${rowsPerPage}&sort=-createdAt`)
      },
      setAppModalAndOpen
    ),
    [scanHistory]
  );

  const handlePageIndexChange = (e, newIndex) => setPageIndex(newIndex+1);
  const handleHistoryPageIndexChange = (e, newIndex) => setHistoryPageIndex(newIndex+1);

  const { data, error, isValidating } = useSWR(
    `${process.env.backendUrl}api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`,
    fetchData,
    {
      refreshInterval: 5000
    }
  );
  const scanHistoryData = useSWR(
    `${process.env.backendUrl}api/scanners/history?page=${historyPageIndex}&limit=${rowsPerPage}&sort=-createdAt`,
    fetchData,
    {
      refreshInterval: 5000
    }
  ).data;

  useEffect(() => {
    if (data) {
      setScannerList(data?.data ?? []);
      setRowCount(data?.dataCount ?? 0);
    }
  }, [data]);
  useEffect(() => {
    if (scanHistoryData) {
      setScanHistory(scanHistoryData?.data ?? []);
      setHistoryRowCount(scanHistoryData?.dataCount ?? 0);
    }
  }, [scanHistoryData])
  return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader >
              <h4 className={classes.cardTitleWhite}>Scanner List</h4>
              <p className={classes.cardCategoryWhite}>
                list of connected scanners
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeader
                tableHead={generateScannerTableHead()}
                tableData={scannerTableData}
              />
            </CardBody>
            <CardFooter>
                <TablePagination
                    component="div"
                    count={rowCount}
                    page={pageIndex-1}
                    onPageChange={handlePageIndexChange}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
                />
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain >
              <h4 className={classes.cardTitleWhite}>
                Scan History
              </h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeader
                tableHead={generateScanHistoryTableHead()}
                tableData={historyTableData}
              />
            </CardBody>
            <CardFooter>
                <TablePagination
                    component="div"
                    count={historyRowCount}
                    page={historyPageIndex-1}
                    onPageChange={handleHistoryPageIndexChange}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[]}
                />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
  );
}

export default ScannerDashboard;