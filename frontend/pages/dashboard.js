import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// layout for this page
import Admin from "layouts/Admin.js";
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

function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { scannerList, setScannerList } = useAccount();

  const rowsPerPage = 5;
  const [pageIndex, setPageIndex] = useState(1);
  
  const handlePageIndexChange = (e, newIndex) => setPageIndex(newIndex);

  const { data, error, isValidating } = useSWR(
    `${process.env.backendUrl}api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`,
    fetchData
  );

  useEffect(() => {
    if (data) {
      const dataScanner = data?.data?.map((item) => {
        return item;
      });
      setScannerList(dataScanner);
    }
  }, [data]);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Scanner List</h4>
            <p className={classes.cardCategoryWhite}>
              list of connected scanners
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeadercolor="info"
              tableHead={generateScannerTableHead()}
              tableData={generateScannerDataTable(scannerList)}
            />
          </CardBody>
          <CardFooter>
              <TablePagination
                  component="div"
                  count={0}
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
          <CardHeader plain color="info">
            <h4 className={classes.cardTitleWhite}>
              Scan History
            </h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeadercolor="info"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park",
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten",
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"],
              ]}
            />
          </CardBody>
          <CardFooter>
              <TablePagination
                  component="div"
                  count={0}
                  page={pageIndex-1}
                  onPageChange={handlePageIndexChange}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
              />
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
