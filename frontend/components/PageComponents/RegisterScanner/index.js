import { Box, Container, Typography } from "@mui/material";

import Card from "components/Card";
import Footer from "components/Footer/Footer";
import TitleLogo from "components/TitleLogo";
import { useRegister } from "lib/contexts/registerContext";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

export default function Register() {
    const { step } = useRegister();

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