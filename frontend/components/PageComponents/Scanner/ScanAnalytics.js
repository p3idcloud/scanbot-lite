import { Icon } from "@material-ui/core";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import { fetchData } from "lib/fetch";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";

export default function ScanAnalytics() {
    const useStyles = makeStyles(styles);
    const classes = useStyles();

    const router = useRouter();
    const { scannerId } = router?.query;
    
    //analytic
    const [totalScan, setTotalScan] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const { data: dataReport, error: errorReport } = useSWR(
        `${process.env.backendUrl}api/scanners/${scannerId}/analytic`,
        fetchData
    );
    useEffect(() => {
        if (dataReport) {
          setTotalScan(dataReport?.totalScan);
          setTotalPage(dataReport?.totalPageScan);
        }
    }, [dataReport]);

    return (
        <Card>
            <CardHeader color="info" stats icon>
                <CardIcon color="info">
                    <Icon>file_copy</Icon>
                </CardIcon>
                <h3 className={classes.cardCategory}>Total Scans</h3>
                <h1 className={classes.cardTitle}>{totalScan} <small>scans</small></h1>
                <h1 className={classes.cardTitle}>{totalPage} <small>pages</small></h1>
            </CardHeader>
        </Card>
    )
}