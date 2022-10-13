import { Box, Typography } from "@mui/material";
import CustomLoader from "components/Loader";
import { authConstants } from "constants/auth";
import { useRegister } from "lib/contexts/registerContext";
import { fetchData } from "lib/fetch";
import { destroyCookie, parseCookies } from "nookies";
import { useEffect } from "react";

export default function Step2() {
    const { setStep, setScannerData, error, setError } = useRegister();

    const claimScanner = (registrationToken) => {
        if (!registrationToken) {
            // redirect user to step 1
            setStep(1);
            return;
        }
        // Claim scanner
        fetchData(`${process.env.backendUrl}api/claim`, {
            method: "POST",
            data: { registrationToken: registrationToken },
        })
            .then(async (data) => {
                setScannerData(data);
                setStep(3);
                // console.log(data);
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.message);
            })

        destroyCookie({}, authConstants.REGISTRATION_TOKEN);
        destroyCookie({}, authConstants.CALLBACK_URL);
        destroyCookie({}, authConstants.SESSION_TOKEN);
        destroyCookie({}, authConstants.CSRF_TOKEN);
    }
    
    useEffect(() => {
        const registrationToken = parseCookies()[authConstants.REGISTRATION_TOKEN];
        if (registrationToken) {
            claimScanner(registrationToken);
        }
    }, [])

    if (error) {
        return (
            <Box textAlign='center'>
                <Typography fontWeight={600} fontSize="20px">
                    Scanner Registration
                </Typography>

                <Typography fontWeight={400} fontSize="16px" sx={{color: "#A767FF"}}>
                    There was an error: {error}
                </Typography>
            </Box>
        )
    }

    return (
        <CustomLoader message="Processing" />
    )
}