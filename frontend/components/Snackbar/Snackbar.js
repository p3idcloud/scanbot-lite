import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @mui/core components
import { makeStyles } from "@mui/core/styles";
import Snack from "@mui/core/Snackbar";
import IconButton from "@mui/core/IconButton";
// @mui/icons
import Close from "@mui/icons/Close";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/snackbarContentStyle.js";

export default function Snackbar(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { message, color, close, icon, place, open } = props;
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
        onClick={() => props.closeNotification()}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  return (
    <Snack
      anchorOrigin={{
        vertical: place.indexOf("t") === -1 ? "bottom" : "top",
        horizontal:
          place.indexOf("l") !== -1
            ? "left"
            : place.indexOf("c") !== -1
            ? "center"
            : "right",
      }}
      open={open}
      message={
        <div>
          {icon !== undefined ? <props.icon className={classes.icon} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      action={action}
      ContentProps={{
        classes: {
          root: classes.root + " " + classes[color],
          message: classes.message,
        },
      }}
    />
  );
}

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.object,
  place: PropTypes.oneOf(["tl", "tr", "tc", "br", "bl", "bc"]),
  open: PropTypes.bool,
  closeNotification: PropTypes.func,
};
