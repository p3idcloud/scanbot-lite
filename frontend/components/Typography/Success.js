import React from "react";
import PropTypes from "prop-types";
// @mui/core components
import { makeStyles } from "@mui/core/styles";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/typographyStyle.js";

export default function Success(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { children } = props;
  return (
    <div className={classes.defaultFontStyle + " " + classes.successText}>
      {children}
    </div>
  );
}

Success.propTypes = {
  children: PropTypes.node,
};
