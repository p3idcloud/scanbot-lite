import { Icon } from "@mui/core";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import { useScanner } from "lib/contexts/scannerContext";
import StartSession from "./StartSession";
import StateBox from "./StateBox";

import { makeStyles } from "@mui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";

export default function ScannerStatus() {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    const { setCloseCloud } = useScanner();
    return (
        <Card>
            <CardHeader  stats icon>
                <CardIcon >
                    <Icon>cloud_queue</Icon>
                </CardIcon>
                <h3 className={classes.cardCategory}>Scanner status</h3>
            </CardHeader>
            <CardBody>
                <StateBox />
                <StartSession
                    getStopSession={(callback) => {
                        setCloseCloud(() => callback);
                    }}
                />
            </CardBody>
        </Card>
    )
}