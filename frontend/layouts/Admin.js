import React from "react";
import { AppBar, Container } from "@mui/material";
import { Wrapper } from "./style";

export default function Admin({ children }) {
  // styles
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <>
      <AppBar />
      <Wrapper>
        <Container maxWidth="lg">
          {children}
        </Container>
      </>
      <Footer />
    </>
  );
}
