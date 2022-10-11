import { Icon } from "@mui/core";
import { Box, Tooltip } from "@mui/material";
import Button from "components/CustomButtons/Button.js";
import TooltipButton from "components/CustomButtons/TooltipButton";
import Router from "next/router";
import { toast } from "react-toastify";
import { fetchData } from "./fetch";

export const generateScannerTableHead = () => {
    return ["no", "Name", "Model", "Description", ""];
}

export const generateScannerDataTable = (scannerData, mutate = () => {}) => {
    if (!scannerData) return [];
    return scannerData.map((data, index) => {
        return [
            index+1,
            data.name,
            data.model,
            data.description,
            <Box display='flex'>
                <Button 
                    
                    onClick={() => {
                        Router.push(`/scanners/${data.id}`)
                    }}
                >
                    Detail
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
                                mutate();
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