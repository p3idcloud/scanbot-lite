import { makeStyles } from "@material-ui/core/styles";

import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";

import Image from "next/image";
import { useRegister } from "lib/contexts/registerContext";

const styles = {
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
    },
}

export default function Step3() {
    const { scannerData } = useRegister();
    const useStyles = makeStyles(styles);
    const classes = useStyles();

    return (
        <>
            <CardAvatar>
                <Image 
                    src="/logo.png" 
                    width={200}
                    height={200}
                />
            </CardAvatar>
            <CardBody profile>
                <h1 className={classes.cardCategory}>Successfully Registered</h1>
                <p className={classes.description}>
                    {scannerData?.description}
                </p>
            </CardBody>
        </>
    )
}