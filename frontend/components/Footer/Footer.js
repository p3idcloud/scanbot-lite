/*eslint-disable*/
import React from "react";
// @mui/core components
import { makeStyles } from "@mui/core/styles";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/footerStyle.js";

export default function Footer(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://github.com/p3idcloud"
              target="_blank"
              className={classes.a}
            >
              Open Source Scanbot
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
