import { Icon } from "@material-ui/core";
import { Box, Tooltip } from "@mui/material";
import RegularButton from "components/CustomButtons/Button";
import TooltipButton from "components/CustomButtons/TooltipButton";
import { fetchData } from "./fetch";

export const generateScanHistoryTableHead = () => {
    return ["Name", "Description", "Start Date", "Status", "Pages", ""];
}

export const generateScanHistoryDataTable = (scanHistory, setScanHistory = (_) => {}) => {
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
                    color="info"
                    onClick={()=>{console.log('View Pdf')}}
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
                            .then(res => setScanHistory(scanHistory.splice(index, 1)))
                            // .catch(err => toast.error('Failed to delete history'))
                        }}
                    >
                        <Icon>delete</Icon>
                    </TooltipButton>
                </Tooltip>
            </Box>
        ]
    })
}