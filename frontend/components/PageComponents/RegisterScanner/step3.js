import Image from "next/image";
import { Box, Typography } from "@mui/material";

export default function Step3() {
    return (
        <>
            <Image 
                src="/caca.jpeg" 
                width={200}
                height={200}
            />
            <Box textAlign='center'>
                <Typography fontWeight={600} fontSize="20px">
                    Successfully Registered
                </Typography>
            </Box>
        </>
    )
}