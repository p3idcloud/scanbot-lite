import Image from "next/image";
import { Box, Typography } from "@mui/material";

export default function Step3() {
    return (
        <>
            <Image 
                alt={"Caca"}
                src="/p3id.png"
                width={216}
                height={93}
            />
            <Box textAlign='center'>
                <Typography fontWeight={600} fontSize="20px">
                    Successfully Registered
                </Typography>
            </Box>
        </>
    )
}