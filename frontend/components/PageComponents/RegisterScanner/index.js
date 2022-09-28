import { Box, Container } from "@mui/material";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
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
        <Box 
            height={'100vh'} 
            width={1} 
            display='flex'
            flexDirection='column'
            alignItems='center' 
            justifyContent='center'
        >
            <Container>
                <Card profile>
                    <CardHeader color="info">
                        <h2>Scanbot</h2>
                    </CardHeader>
                    <StepComponent />
                </Card>
            </Container>
        </Box>
    );
}