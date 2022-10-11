import { Grid, Typography } from "@mui/material";
import { useScanner } from "lib/contexts/scannerContext";
import StatusIcon from "./StatusIcon";

export default function StateBox() {
    const { statusPoll, usedBy } = useScanner();

    return (
        <Grid container pt={2} direction='row' justifyContent='flex-end' alignItems='center' spacing={2}>
            <Grid item>
                <StatusIcon status={statusPoll?.status} />
            </Grid>
            <Grid item>
                <Typography sx={{color: '#959595'}}>Status : {usedBy ? "Under use" : statusPoll?.status || "Not ready"}</Typography>
            </Grid>
            <Grid item>
                <StatusIcon status={statusPoll?.state} />
            </Grid>
            <Grid item>
                <Typography sx={{color: '#959595'}}>State : {statusPoll?.state || "Offline"}</Typography>
            </Grid>
        </Grid>
    )
}