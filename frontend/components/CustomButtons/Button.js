import { Button } from "@mui/material";
import React from "react";

export default function RegularButton(props) {
  const {
    children,
    ...rest
  } = props;
  return (
    <Button {...rest}>
      {children}
    </Button>
  );
}