import { makeStyles } from "@material-ui/core/styles";

import Button from "components/CustomButtons/Button";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";

import Image from "next/image";
import Router from "next/router";

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
};

export default function Step1() {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    
    const onClick = () => {
        Router.push('/api/auth/login/saml');
    } 

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
                <h1 className={classes.cardCategory}>Scanner Registration</h1>
                <p className={classes.description}>
                    You are about to claim an ownership for a scanner.
                    Confirm your identity using the button below:
                </p>
                <Button color="info" onClick={onClick}>
                    Sign in with SSO
                </Button>
            </CardBody>
        </>
    )
}