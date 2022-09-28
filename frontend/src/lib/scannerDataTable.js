import Button from "components/CustomButtons/Button.js";
import Router from "next/router";

export const generateScannerTableHead = () => {
    return ["id", "Name", "Model", "Description", ""];
}

export const generateScannerDataTable = (scannerData) => {
    return scannerData.map((data, index) => {
        return [
            index,
            data.name,
            data.model,
            data.description,
            <Button 
                color="info"
                onClick={() => {
                    Router.push(`/scanners/${data.id}`)
                }}
            >
                Select
            </Button>
        ]
    });
}