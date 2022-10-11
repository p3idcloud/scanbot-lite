import { Box, Typography } from "@mui/material";
import CardDrawer from "components/CardDrawer";
import { fetchData } from "lib/fetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function ScannerReport({...props}) {
    const { open } = props;
    
    const router = useRouter();
    const { scannerId } = router?.query;
    
    //analytic
    const [totalScan, setTotalScan] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const { data: dataReport, error: errorReport } = useSWR(
        `${process.env.backendUrl}api/scanners/${scannerId}/analytic`,
        fetchData
    );
    useEffect(() => {
        if (dataReport) {
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