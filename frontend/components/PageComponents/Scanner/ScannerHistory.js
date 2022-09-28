import { Box } from "@mui/material";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CustomTable from "components/Table/Table";
import { useScanner } from "lib/contexts/scannerContext";
import { useEffect, useState } from "react";

export default function ScannerHistory() {
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailHistory, setDetailHistory] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const {scannerHistory, loadScannerHistory} = useScanner();

    const getDetailHistory = (id) => {
        fetchData(`${process.env.backendUrl}api/scanners/history/${id}`)
          .then((res) => setDetailHistory(res))
          .catch((err) => console.log(err));
    };
    
    const handleDetailHistory = (row) => {
        if (!detailOpen) {
          getDetailHistory(row.id);
        }
        setDetailOpen(!detailOpen);
    };

    useEffect(() => {
        loadScannerHistory(pageIndex);
    }, [pageIndex]);

    return (
        <Card>
            <CardHeader color="primary">
                <h2>Scan History</h2>
            </CardHeader>
            <CardBody>
                <CustomTable
                    tableHead={["Name", "Description", "Start Date", "Status", "Pages", ""]}
                    tableData={[]} // scannerHistory?.data
                />
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <h3>Total Scans</h3>
                    <p>0</p>
                </Box>
            </CardBody>
        </Card>
    )
}