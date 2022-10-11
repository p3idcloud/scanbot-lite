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
            <></>
        ]
    });
}