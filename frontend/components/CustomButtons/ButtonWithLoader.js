import React from "react";
import { LoadingButton } from "@mui/lab";
// nodejs library that concatenates classes
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/nextjs-material-dashboard/components/buttonStyle.js";


export default function ButtonWithLoader(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { color } = props;
  const btnClasses = classNames({
    [classes[color]]: color,
  });
  return (
    <LoadingButton {...props} classes= {{ root: btnClasses }} 
      sx={{
        color: 'white !important', 
        padding: '12px 30px !important', 
        margin: '0.3125rem 1px !important',
        lineHeight: '1.43 !important',
        fontWeight: '400 !important', 
        fontSize: '12px !important'
      }} />
  );
}