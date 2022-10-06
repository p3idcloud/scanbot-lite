import { Icon } from "@material-ui/core";
import { Box, Tooltip } from "@mui/material";
import Button from "components/CustomButtons/Button.js";
import TooltipButton from "components/CustomButtons/TooltipButton";
import Router from "next/router";
import { toast } from "react-toastify";
import { fetchData } from "./fetch";

export const generateScannerTableHead = () => {
    return ["id", "Name", "Model", "Description", ""];
}

export const generateScannerDataTable = (scannerData, setScannerData = (_) => {}) => {
    if (!scannerData) return [];
    return scannerData.map((data, index) => {
        return [
            index,
            data.name,
            data.model,
            data.description,
            <Box display='flex'>
                <Button 
                    color="info"
                    onClick={() => {
                        Router.push(`/scanners/${data.id}`)
                    }}
                >
                    Select
                </Button>
                <Tooltip title="Delete">
                    <TooltipButton
                        color="danger"
                        onClick={() => {
                            fetchData(
                                `${process.env.backendUrl}api/scanners/${data.id}`, 
                                {
                                    method: "DELETE"
                                }
                            )
                            .then(res => {
                                scannerData.splice(index, 1);
                                setScannerData(scannerData);
                            })
                            .catch(err => toast.error('Failed to delete scanner'))
                        }}
                    >
                        <Icon>delete</Icon>
                    </TooltipButton>
                </Tooltip>
            </Box>
        ]
    });
}