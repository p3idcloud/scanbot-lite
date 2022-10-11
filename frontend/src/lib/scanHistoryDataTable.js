import { Icon } from "@mui/core";
import { Box, Tooltip } from "@mui/material";
import RegularButton from "components/CustomButtons/Button";
import TooltipButton from "components/CustomButtons/TooltipButton";
import { fetchData } from "./fetch";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const ScanPdfView = dynamic(() => import("components/AppModals/ScanPdfView"), {
    ssr: false,
});

export const generateScanHistoryTableHead = () => {
    return ["Name", "Description", "Start Date", "Status", "Pages", ""];
}

export const generateScanHistoryDataTable = (scanHistory, mutate = () => {}, openModal) => {
    if (!(Array.isArray(scanHistory))) return [];
    return scanHistory?.map((history, index) => {
        return [
            history.name,
            history.description,
            history.startDate,
            history.status,
            history.pageCount,
            <Box display='flex'>
                <RegularButton
                    disabled={history.status === "In Progress"}
                    
                    onClick={async()=>{
                        fetchData(`${process.env.backendUrl}api/scanners/history/${history.id}`)
                            .then(data => {
                                openModal(<ScanPdfView files={data?.url} />);
                            })
                            .catch(err => toast.error('Failed to fetch pdf'));
                    }}
                >
                    View Pdf
                </RegularButton>
                <Tooltip title="Delete">
                    <TooltipButton
                        color="danger"
                        onClick={() => {
                            fetchData(
                                `${process.env.backendUrl}api/scanners/history/${history.id}`, 
                                {
                                    method: "DELETE"
                                }
                            )
                            .then(res => {
                                mutate();
                            })
                            .catch(err => toast.error('Failed to delete history'))
                        }}
                    >
                        <Icon>delete</Icon>
                    </TooltipButton>
                </Tooltip>
            </Box>
        ]
    })
}