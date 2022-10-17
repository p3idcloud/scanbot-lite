import { Stack, Box, IconButton, Tooltip } from "@mui/material";
import { useScanner } from "lib/contexts/scannerContext";
import { useEffect, useState } from "react";

import { mutate } from "swr";
import { fetchData } from "lib/fetch";
import { useMemo } from "react";
import CardDrawer from "components/CardDrawer";
import Table from "components/Table";
import { RiDeleteBin4Line, RiFilePdfLine } from "react-icons/ri";
import DeleteConfirmation from "components/AppModals/DeleteConfirmation";
import { toast } from "react-toastify";
import ScanPdfView from "components/AppModals/ScanPdfView";

export default function ScannerHistory({...props}) {
    const { open } = props;
    const {
        scannerId, 
        scannerHistory, 
        scanHistoryRowCount, 
        loadScannerHistory, 
        scanHistoryPageIndex, 
        setScanHistoryPageIndex
    } = useScanner();
    
    const rowsPerPage = 5;
    const [loadingPageIndex, setLoadingPageIndex] = useState(true);

    const [deleteHistory, setDeleteHistory] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDeleteScanner = () => {
        setLoadingDelete(true);
        fetchData(
            `${process.env.backendUrl}api/scanners/history/${deleteHistory.id}`, 
            { method: "DELETE" }
        ).then(res => {
            setLoadingDelete(false);
            loadScannerHistory(scanHistoryPageIndex, rowsPerPage);
            mutate(`${process.env.backendUrl}api/scanners/${scannerId}/analytic`);
            setDeleteHistory(null);
        }).catch(err => {
            setLoadingDelete(false);
            toast.error('Failed to delete history');
        })
    }

    const [historyPdf, setHistoryPdf] = useState(null);

    const getPdf = (id, name) => {
        fetchData(`${process.env.backendUrl}api/scanners/history/${id}`)
        .then(data => {
            setHistoryPdf({
                url: data?.url,
                name: name
            });
        })
        .catch(err => toast.error('Failed to fetch pdf'));
    }

    const tableData = useMemo(() =>
        scannerHistory?.map((history) => [
            history.name,
            history.description,
            history.startDate,
            history.status,
            history.pageCount,
            <Box display='flex'>
                <Tooltip title="View Pdf">
                    <IconButton 
                        disabled={history.status !== "Completed"}
                        color="primary" 
                        onClick={()=>getPdf(history.id, history.name)}
                    >
                        <RiFilePdfLine size={20} />
                    </IconButton>
                </Tooltip>

                <Tooltip 
                    title="Delete" 
                    componentsProps={{
                        tooltip: {
                            sx: {
                                borderColor: "#FFA0A0 !important",
                                color: "#FFA0A0 !important"
                            }
                        }
                    }}
                >
                    <IconButton color="red" onClick={()=>setDeleteHistory(history)}>
                        <RiDeleteBin4Line size={20} />
                    </IconButton>
                </Tooltip>
            </Box>
        ]),
        [scannerHistory]
    );

    const handlePageIndexChange = (e, newIndex) => {
        setScanHistoryPageIndex(newIndex + 1);
        setLoadingPageIndex(true);
    }

    useEffect(() => {
        if (loadingPageIndex) {
            setLoadingPageIndex(false);
        }
    }, [scannerHistory])
    
    useEffect(() => {
        loadScannerHistory(scanHistoryPageIndex, rowsPerPage);
    }, [scanHistoryPageIndex])

    return (
        <>
            <CardDrawer cardTitle="Scan History" open={open}>
                <Box>
                    <Table 
                        rowCount={scanHistoryRowCount}
                        rowsPerPage={rowsPerPage}
                        pageIndex={scanHistoryPageIndex}
                        loading={loadingPageIndex}
                        handlePageIndexChange={handlePageIndexChange}
                        tableHead={["Name", "Description", "Start Date", "Status", "Pages", "Action"]}
                        tableData={tableData}
                    />
                </Box>
            </CardDrawer>
            <DeleteConfirmation
                open={Boolean(deleteHistory)}
                title="Delete History"
                subTitle={`Are you sure you want to delete ${deleteHistory?.name}?`}
                loading={loadingDelete}
                onDelete={handleDeleteScanner}
                onClose={()=>setDeleteHistory(false)}
            />
            <ScanPdfView
                open={Boolean(historyPdf)}
                onClose={()=>setHistoryPdf(null)}
                name={historyPdf?.name}
                files={historyPdf?.url}
            />
        </>
    )
}