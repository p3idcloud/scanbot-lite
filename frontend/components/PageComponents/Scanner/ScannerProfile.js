import { Icon } from "@material-ui/core";
import { Box, Paper, Stack } from "@mui/material";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import { useScanner } from "lib/contexts/scannerContext";


export default function ScannerProfile() {
    const { detailScanner } = useScanner();
    return (
        <Card>
            <CardHeader stats color="info" >
                <CardIcon color="primary">
                    <Stack direction="row" alignItems='center'>
                        <Icon>adf_scanner</Icon>
                        <h2>Scanner Profile</h2>
                    </Stack>
                </CardIcon>
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
    )
}