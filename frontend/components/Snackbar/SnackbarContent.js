import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// @mui/core components
import { makeStyles } from "@mui/core/styles";
import Snack from "@mui/core/SnackbarContent";
import IconButton from "@mui/core/IconButton";
// @mui/icons
import Close from "@mui/icons/Close";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/snackbarContentStyle.js";

export default function SnackbarContent(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { message, color, close, icon } = props;
  var action = [];
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined,
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  return (
    <Snack
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      classes={{
        root: classes.root + " " + classes[color],
        message: classes.message
      }}
      action={action}
    />
  );
}

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.object
};
