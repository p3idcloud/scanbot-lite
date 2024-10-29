import { Box, Typography } from "@mui/material";
import Button from "components/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import { authConstants } from "constants/auth";

export default function Step1() {
    const router = useRouter();

    const onClick = () => {
        router.push(`/api/auth/signin?${authConstants.REGISTRATION_TOKEN}=${router.query[authConstants.REGISTRATION_TOKEN]}`);
    } 

    return (
        <>
            <Image 
                alt={"p3id"}
                src="/p3id.png"
                width={216}
                height={93}
            />
            <Box textAlign='center'>
                <Typography fontWeight={600} fontSize="20px">
                    Scanner Registration
                </Typography>

                <Typography fontWeight={400} fontSize="16px" sx={{color: "#A767FF"}}>
                    You are about to claim an ownership for a scanner.
                    Confirm your identity using the button below:
                </Typography>
            </Box>
            <Button onClick={onClick}>
                Sign in with SSO
            </Button>
        </>
    )
}