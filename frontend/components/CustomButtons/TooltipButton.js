import React, { forwardRef } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import styles from "assets/jss/nextjs-material-dashboard/components/buttonStyle.js";

function TooltipButton(props, ref) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const {
    color,
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  });
  const { onMouseOver, onMouseLeave } = rest;
  return (
    <span onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} >
        <Button {...rest} classes={{ ...muiClasses, root: btnClasses }} ref={ref}>
            {children}
        </Button>
    </span>
  );
}

export default forwardRef(TooltipButton);