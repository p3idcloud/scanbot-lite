import { Stack, TablePagination } from "@mui/material";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CustomTable from "components/Table/Table";
import { useScanner } from "lib/contexts/scannerContext";
import { useEffect, useState } from "react";

// @material-ui/core
import CardFooter from "components/Card/CardFooter";
import CardIcon from "components/Card/CardIcon";
import { Icon } from "@material-ui/core";
import { mutate } from "swr";
import { fetchData } from "lib/fetch";
import { useRouter } from "next/router";
import { generateScanHistoryTableHead, generateScanHistoryDataTable } from "lib/scanHistoryDataTable";
import { useMemo } from "react";
import { useAccount } from "lib/contexts/accountContext";

export default function ScannerHistory() {
    const router = useRouter();

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailHistory, setDetailHistory] = useState(null);

    const rowsPerPage = 5;
    const [pageIndex, setPageIndex] = useState(1);
    const [rowCount, setRowCount] = useState(0);

    const { setAppModalAndOpen } = useAccount();
    const {scannerHistory, loadScannerHistory} = useScanner();
    const tableData = useMemo(() =>
        generateScanHistoryDataTable(
            scannerHistory ?? [], 
            () => {
                // mutate(`${process.env.backendUrl}api/scanners/history?scannerId=${scannerId}&sort=-createdAt&page=1`);
                loadScannerHistory();
                mutate(`${process.env.backendUrl}api/scanners/${scannerId}/analytic`);
            },
            setAppModalAndOpen    
        ), 
        [scannerHistory]
    );
    const { scannerId } = router?.query;


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

    useEffect(() => {
        setRowCount(scannerHistory?.length ?? 0);
    }, [scannerHistory])


    return (
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
                    tableHead={generateScanHistoryTableHead()}
                    tableData={tableData}
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
    )
}