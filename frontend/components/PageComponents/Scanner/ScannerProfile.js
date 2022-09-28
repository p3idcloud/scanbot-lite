import { Box, Paper, Stack } from "@mui/material";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useScanner } from "lib/contexts/scannerContext";
import StateBox from "./StateBox";


export default function ScannerProfile() {
    const { detailScanner } = useScanner();
    return (
        <GridContainer>
            <GridItem xs={12} lg={6}>
                <Card style={{backgroundColor: '#e5e5e5'}}>
                    <CardHeader profile color="primary">
                        <h1>Scanner Profile</h1>
                    </CardHeader>
                    <CardBody>
                        <Box
                            component={Paper}
                            p={2}
                            display="flex"
                            flexDirection="column"
                            elevation={2}
                        >
                            <Stack 
                                direction="row" 
                                justifyContent="space-between" 
                                alignItems='center'
                            >
                                <h4 style={{textAlign: 'start'}}>Name:</h4>
                                <h5 style={{textAlign: 'end'}}>{detailScanner?.name}</h5>
                            </Stack>
                            <Stack 
                                direction="row" 
                                justifyContent="space-between" 
                                alignItems='center'
                            >
                                <h4 style={{textAlign: 'start'}}>Model:</h4>
                                <h5 style={{textAlign: 'end'}}>{detailScanner?.model}</h5>
                            </Stack>
                            <Stack 
                                direction="row" 
                                justifyContent="space-between" 
                                alignItems='center'
                            >
                                <h4 style={{textAlign: 'start'}}>Description:</h4>
                                <h5 style={{textAlign: 'end'}}>{detailScanner?.description}</h5>
                            </Stack>
                        </Box>
                    </CardBody>
                </Card>
            </GridItem>
            <GridItem xs={12} lg={6}>
                <StateBox />
            </GridItem>
        </GridContainer>
    )
}