import { Box, Container, Typography } from "@mui/material";

import Card from "components/Card";
import Footer from "components/Footer/Footer";
import TitleLogo from "components/TitleLogo";
import { useRegister } from "lib/contexts/registerContext";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import { useAccount } from "lib/contexts/accountContext";
import { useEffect, useState } from "react";
import { fetchData } from "lib/fetch";

export default function Register() {
    const { account } = useAccount();
    const { setStep, step } = useRegister();

    const VerifyAccount = async () => {
        const apiURL = `api/auth/verify`
        const { verified } = await fetchData(apiURL, {
            method: 'POST',
        });
        return verified
    }

    useEffect(() => {
        if (account === undefined) {
            setStep(1)
            return
        }
        var isVerified = VerifyAccount();
        if (!isVerified) {
            setStep(1)
        } else if (isVerified && step !== 3) {
            setStep(2)
        }
    },[account])

    const StepComponent = () => {
        switch(step) {
            case 1:
                return <Step1 />;
            case 2:
                return <Step2 />;
            case 3:
                return <Step3 />;
            default:
                return <div />;
        }
    }

    return (
        <Container>
            <Box 
                height={'100vh'} 
                width={1} 
                display='flex'
                flexDirection='column'
                alignItems='center' 
                justifyContent='center'
            >
                <Card withpadding>
                    <Box 
                        display='flex'
                        width={1}
                        flexDirection='column'
                        alignItems='center' 
                        justifyContent='center'
                        gap={3}
                    >
                        <TitleLogo />
                        <StepComponent />
                        <Footer />
                    </Box>
                </Card>
            </Box>
        </Container>
    );
}