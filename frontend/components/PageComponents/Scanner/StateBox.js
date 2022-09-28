import { Box, Grid, Card, Stack } from "@mui/material";
import { useScanner } from "lib/contexts/scannerContext";

export default function StateBox({status, state}) {
    const { statusPoll, usedBy } = useScanner();

    const handleStatus = (status) => {
        if (
            [
              "Scanner Offline / Undetected",
              "error",
              "draining",
              "closed"
            ].includes(status)
          ) {
            return "#F01E2C !important";
          }
          if (["active", "ready", "capturing", "noSession"].includes(status)) {
            return "#1FD655  !important";
          }
          return "#FCAE1E  !important";
    }

    return (
        <Grid component={Card} p={3} minHeight={0.85} alignItems='center'>
            <Grid item xs={6} lg={12}>
                <Stack direction='row' justifyContent="center" py={2} spacing={2}>
                    <h3>Status{" "}</h3>
                    <Box 
                        component={Card}
                        sx={{
                            backgroundColor: handleStatus(statusPoll?.status),
                            p: 1
                        }}
                    >
                        <p>{usedBy ? "used by " + usedBy : statusPoll?.status || "Not ready"}</p>
                    </Box>
                </Stack>
            </Grid>
            <Grid item xs={6} lg={12}>
                <Stack direction="row" justifyContent="center" py={2} spacing={2}>
                    <h3>State{" "}</h3>
                    <Box 
                        component={Card}
                        sx={{
                            backgroundColor: handleStatus(statusPoll?.state),
                            p: 1,
                        }}
                    >
                        <p>{statusPoll?.state || "Offline"}</p>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    )
}