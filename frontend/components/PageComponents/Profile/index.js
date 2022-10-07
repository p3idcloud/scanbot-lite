import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardIcon from "components/Card/CardIcon";

import { Card as MuiCard } from "@mui/material";
import { Icon } from "@material-ui/core";
import { destroyCookie } from "nookies";
import { Router } from "next/router";
import { useAccount } from "lib/contexts/accountContext";
import Info from "components/Typography/Info";

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

function UserProfile() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { account } = useAccount();

  const handleLogout = () => {
    destroyCookie({}, authConstants.SESSION_TOKEN);
    destroyCookie({}, authConstants.CSRF_TOKEN);
    destroyCookie({}, authConstants.CALLBACK_URL);
    destroyCookie({}, authConstants.REGISTRATION_TOKEN);
    Router.push("/api/auth/logout/saml");
  }
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="info" stats>
            <CardIcon color="primary">
              <Icon>account_circle</Icon>
            </CardIcon>
            <h4 className={classes.cardTitleWhite}>Profile</h4>
            <p className={classes.cardCategoryWhite}>Your profile data</p>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={6}>
                <MuiCard sx={{px: 2, my: 2, backgroundColor: '#e7e7e7 !important'}} elevation={3}>
                  <Info>
                    <h4 style={{fontWeight: 'bold'}}>User id</h4>
                  </Info>
                  <strong><h4>{account?.accountId}</h4></strong>
                </MuiCard>
              </GridItem>

              <GridItem xs={6}>
                <MuiCard sx={{px: 2, my: 2, backgroundColor: '#e7e7e7 !important'}} elevation={3}>
                  <Info>
                    <h4 style={{fontWeight: 'bold'}}>Username</h4>
                  </Info>
                  <strong><h4>{account?.username}</h4></strong>
                </MuiCard>
              </GridItem>
              
              <GridItem xs={12} md={6}>
                <MuiCard sx={{px: 2, my: 2, backgroundColor: '#e7e7e7 !important'}} elevation={3}>
                  <Info>
                    <h4 style={{fontWeight: 'bold'}}>First name</h4>
                  </Info>
                  <strong><h4>{account?.firstName}</h4></strong>
                </MuiCard>
              </GridItem>
              
              <GridItem xs={12} md={6}>
                <MuiCard sx={{px: 2, my: 2, backgroundColor: '#e7e7e7 !important'}} elevation={3}>
                  <Info>
                    <h4 style={{fontWeight: 'bold'}}>Last name</h4>
                  </Info>
                  <strong><h4>{account?.lastName}</h4></strong>
                </MuiCard>
              </GridItem>

              
              <GridItem xs={12}>
                <MuiCard sx={{px: 2, my: 2, backgroundColor: '#e7e7e7 !important'}} elevation={3}>
                  <Info>
                    <h4 style={{fontWeight: 'bold'}}>Email</h4>
                  </Info>
                  <strong><h4>{account?.email}</h4></strong>
                </MuiCard>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter stats>
            <Button color="info" onClick={handleLogout}>Logout</Button>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default UserProfile;
