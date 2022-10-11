import { Button } from "@mui/material";
import React, { forwardRef } from "react";

function TooltipButton(props, ref) {
  return (
    <span>
        <Button {...props} />
    </span>
  );
}

export default forwardRef(TooltipButton);