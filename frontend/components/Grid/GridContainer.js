import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @mui/core components
import { makeStyles } from "@mui/core/styles";
import Grid from "@mui/core/Grid";

const styles = {
  grid: {
    margin: "0 -15px !important",
    width: "unset",
  },
};

export default function GridContainer(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { children, ...rest } = props;
  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node,
};
