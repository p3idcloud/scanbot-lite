import { Box, Tooltip } from "@mui/material";
import RegularButton from "components/CustomButtons/Button";
import TooltipButton from "components/CustomButtons/TooltipButton";

export const generateScanHistoryTableHead = () => {
    return ["Name", "Description", "Start Date", "Status", "Pages", ""];
}

export const generateScanHistoryDataTable = (scanHistory) => {
    return scanHistory.map((history, index) => {
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
                            .then(res => scanHistory.splice(index, 1))
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