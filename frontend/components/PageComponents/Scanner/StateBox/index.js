import { Grid2 as Grid, Typography } from "@mui/material";
import { useScanner } from "lib/contexts/scannerContext";
import { capitalize } from "lib/helpers";
import StatusIcon from "./StatusIcon";

export default function StateBox() {
    const { statusPoll, usedBy } = useScanner();

    return (
        (<Grid container pt={2} direction='row' justifyContent='flex-end' alignItems='center' spacing={2}>
            <Grid display='flex'>
                <StatusIcon status={statusPoll?.status} />
                <Typography ml={1.5} sx={{color: '#959595'}}>Status : {usedBy ? "Under use" : capitalize(statusPoll?.status) || "Not ready"}</Typography>
            </Grid>
            <Grid display='flex'>
                <StatusIcon status={statusPoll?.state} />
                <Typography ml={1.5} sx={{color: '#959595'}}>State : {capitalize(statusPoll?.state) || "Offline"}</Typography>
            </Grid>
        </Grid>)
    );
}