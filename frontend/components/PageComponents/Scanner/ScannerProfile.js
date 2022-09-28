import { Icon } from "@material-ui/core";
import { Box, Paper, Stack } from "@mui/material";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useScanner } from "lib/contexts/scannerContext";
import StateBox from "./StateBox";

import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";

export default function ScannerProfile() {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    const { detailScanner } = useScanner();
    return (
        <GridContainer>
            <GridItem xs={12} sm={7}>
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
            </GridItem>
            <GridItem xs={12} sm={5}>
                <Card>
                    <CardHeader color="info" stats icon>
                        <CardIcon color="info">
                            <Icon>cloud_queue</Icon>
                        </CardIcon>
                        <h3 className={classes.cardCategory}>Scanner status</h3>
                    </CardHeader>
                    <CardBody>
                        <StateBox />
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    )
}