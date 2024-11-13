import { Box, Typography } from "@mui/material";
import CardDrawer from "components/CardDrawer";
import { useScanner } from "lib/contexts/scannerContext";
import { fetchData } from "lib/fetch";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function ScannerReport({...props}) {
    const { open } = props;

    const { scannerId, loadScannerHistory } = useScanner();
    
    //analytic
    const [totalScan, setTotalScan] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const { data: dataReport, error: errorReport } = useSWR(
        `api/scanners/${scannerId}/analytic`,
        fetchData, {
            refreshInterval: 5000
        }
    );
    useEffect(() => {
        if (dataReport) {
            loadScannerHistory();
            setTotalScan(dataReport?.totalScan);
            setTotalPage(dataReport?.totalPageScan);
        }
    }, [dataReport]);

    return (
        <CardDrawer cardTitle="Report Scanner" open={open}>
            <Box>
                <Typography sx={{fontWeight: 500, fontColor: '#959595', fontSize: '16px'}}>
                    Total Scans
                </Typography>
                <Typography sx={{fontWeight: 600, fontColor: '#525252', fontSize: '28px'}}>
                    {totalScan} Scan{totalPage !== 1 && 's'} 
                </Typography>
                
                <Typography sx={{fontWeight: 500, fontColor: '#959595', fontSize: '16px'}}>
                    Total pages scanned
                </Typography>
                <Typography sx={{fontWeight: 600, fontColor: '#525252', fontSize: '28px'}}>
                    {totalPage} Page{totalPage !== 1 && 's'}                    
                </Typography>
            </Box>
        </CardDrawer>
    )
}