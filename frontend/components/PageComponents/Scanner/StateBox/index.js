import { Grid, Typography } from "@mui/material";
import { useScanner } from "lib/contexts/scannerContext";
import StatusIcon from "./StatusIcon";

export default function StateBox() {
    const { statusPoll, usedBy } = useScanner();

    return (
        <Grid container pt={2} direction='row' justifyContent='flex-end' alignItems='center' spacing={2}>
            <Grid item display='flex'>
                <StatusIcon status={statusPoll?.status} />
                <Typography ml={1.5} sx={{color: '#959595'}}>Status : {usedBy ? "Under use" : statusPoll?.status || "Not ready"}</Typography>
            </Grid>
            <Grid item display='flex'>
                <StatusIcon status={statusPoll?.state} />
                <Typography ml={1.5} sx={{color: '#959595'}}>State : {statusPoll?.state || "Offline"}</Typography>
            </Grid>
        </Grid>
    )
}