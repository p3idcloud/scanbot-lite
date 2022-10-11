import { Box, Grid, Card } from "@mui/material";
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

    const handleStatusBoxShadow = (status) => {
        if (
            [
              "Scanner Offline / Undetected",
              "error",
              "draining",
              "closed"
            ].includes(status)
          ) {
            return "0 4px 20px 0 " +
                  '#F01E2C23' +
                  ", 0 7px 10px -5px " +
                  '#F01E2C66' +
                  " !important";
          }
          if (["active", "ready", "capturing", "noSession"].includes(status)) {
            return "0 4px 20px 0 " +
                  '#1FD65523' +
                  ", 0 7px 10px -5px " +
                  '#1FD65566' +
                  " !important";
          }
        return "0 4px 20px 0 " +
              '#FCAE1E23' +
              ", 0 7px 10px -5px " +
              '#FCAE1E66' +
              " !important";
    }

    return (
        <Grid container p={3} alignItems='center' spacing={2}>
            <Grid container item xs={6} sm={12} direction="row" justifyContent="center"  spacing={2}>
                <Grid 
                    item xs={12} sm={6}  
                    display='flex' alignItems='center'
                >
                    <h3 >Status{" "}</h3>
                </Grid>
                <Grid 
                    item xs={12} sm={6} 
                    justifyContent='end' display='flex' alignItems='center'
                >
                    <Box 
                        component={Card}
                        textAlign='center'
                        sx={{
                            backgroundColor: handleStatus(statusPoll?.status),
                            p: 1,
                            boxShadow: handleStatusBoxShadow(statusPoll?.status)
                        }}
                    >
                        <h6 style={{margin: 0}}>{usedBy ? "used by " + usedBy : statusPoll?.status || "Not ready"}</h6>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item xs={6} sm={12} direction="row" justifyContent="center"  spacing={2}>
                <Grid 
                    item xs={12} sm={6}  
                    display='flex' alignItems='center'
                >
                    <h3>State{" "}</h3>
                </Grid>
                <Grid 
                    item xs={12} sm={6}  
                    display='flex' alignItems='center' justifyContent='end'
                >
                    <Box 
                        component={Card}
                        textAlign='center'
                        sx={{
                            backgroundColor: handleStatus(statusPoll?.state),
                            p: 1,
                            boxShadow: handleStatusBoxShadow(statusPoll?.state)
                        }}
                    >
                        <h6 style={{margin: 0}}>{statusPoll?.state || "Offline"}</h6>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}