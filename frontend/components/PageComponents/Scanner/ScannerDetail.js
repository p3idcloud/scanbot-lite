import { Box, Grid, Stack, Typography } from "@mui/material"
import { useScanner } from "lib/contexts/scannerContext"
import Image from "next/image";

export default function ScannerDetail() {
    const { detailScanner } = useScanner();

    return (
        <Grid item container spacing={2}>
            <Grid item xs={12} display='flex' justifyContent="space-between">
                <Stack direction='row' spacing={2}>
                    <Box display='flex' alignItems='center'>
                        <Image src="/Vectorscanner.png" layout="fixed" width={43} height={32} />
                    </Box>
                    <Box maxWidth={1}>
                        <Typography noWrap sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '24px', color: '#190D29' }}>
                            {detailScanner?.name}
                        </Typography>
                        <Typography noWrap sx={{ fontWeight: 400, fontSize: '16px', lineHeight: '19px', color: '#747474' }}>
                            Model: {detailScanner?.model}
                        </Typography>
                </Box>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Typography noWrap sx={{ fontWeight: 400, fontSize: '16px', lineHeight: '19px', color: '#190D29' }}>
                    {detailScanner?.description}
                </Typography>
            </Grid>
        </Grid>
    )
}