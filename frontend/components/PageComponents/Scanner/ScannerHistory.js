import { PaginationItem, Stack, TablePagination } from "@mui/material";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomTable from "components/Table/Table";
import { useScanner } from "lib/contexts/scannerContext";
import { useEffect, useState } from "react";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import CardFooter from "components/Card/CardFooter";
import CardIcon from "components/Card/CardIcon";
import { Icon } from "@material-ui/core";

export default function ScannerHistory() {
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailHistory, setDetailHistory] = useState(null);

    const rowsPerPage = 5;
    const [pageIndex, setPageIndex] = useState(1);
    const [rowCount, setRowCount] = useState(0);

    const {scannerHistory, loadScannerHistory} = useScanner();

    const useStyles = makeStyles(styles);
    const classes = useStyles();

    const getDetailHistory = (id) => {
        fetchData(`${process.env.backendUrl}api/scanners/history/${id}`)
          .then((res) => setDetailHistory(res.data))
          .catch((err) => console.log(err));
    };

    const handlePageIndexChange = (e, newIndex) => setPageIndex(newIndex);
    
    const handleDetailHistory = (row) => {
        if (!detailOpen) {
          getDetailHistory(row.id);
        }
        setDetailOpen(!detailOpen);
    };

    useEffect(() => {
        loadScannerHistory(pageIndex, rowsPerPage, rowCount);
    }, [pageIndex]);

    return (
        <GridContainer>
            <GridItem xs={12} md={7}>
                <Card>
                    <CardHeader stats color="info">
                        <CardIcon color="primary">
                            <Stack direction="row" alignItems="center">
                                <Icon>history</Icon>
                            </Stack>
                        </CardIcon>
                        <h2>Scan History</h2>
                    </CardHeader>
                    <CardBody>
                        <CustomTable
                            tableHead={["Name", "Description", "Start Date", "Status", "Pages", ""]}
                            tableData={[]} // scannerHistory
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
            <GridItem xs={12} md={5}>
                <Card>
                    <CardHeader color="info" stats icon>
                        <CardIcon color="info">
                            <Icon>file_copy</Icon>
                        </CardIcon>
                        <h3 className={classes.cardCategory}>Total Scans</h3>
                        <h1 className={classes.cardTitle}>0 <small>scans</small></h1>
                        <h1 className={classes.cardTitle}>0 <small>pages</small></h1>
                    </CardHeader>
                </Card>
            </GridItem>
        </GridContainer>
    )
}