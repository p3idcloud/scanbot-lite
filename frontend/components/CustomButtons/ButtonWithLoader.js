import React from "react";
import { LoadingButton } from "@mui/lab";


export default function ButtonWithLoader(props) {
  return (
    <LoadingButton {...props}
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