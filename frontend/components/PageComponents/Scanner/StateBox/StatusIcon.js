import { Box } from "@mui/material";

export default function StatusIcon(props) {
    const { status } = props;

    const getBorderColor = () => {
        if (
            [
              "Scanner Offline / Undetected",
              "error",
              "draining",
              "closed"
            ].includes(status)
          ) {
            return "#FFA0A0";
          }
          if (["active", "ready", "capturing", "noSession"].includes(status)) {
            return "#A3F7B3";
          }
          return "#FFF0A0";
    }

    const getBgColor = () => {
        if (
            [
              "Scanner Offline / Undetected",
              "error",
              "draining",
              "closed"
            ].includes(status)
          ) {
            return "#FF5858";
          }
          if (["active", "ready", "capturing", "noSession"].includes(status)) {
            return "#02841B";
          }
        return "#F7AC03";
    }

    return (
        <Box 
            sx={{
                width:"24px", 
                height:"24px", 
                borderStyle: "solid",
                borderWidth: "5px", 
                borderRadius: "12px",
                borderColor: getBorderColor(), 
                bgcolor: getBgColor()
            }}
        />
    )
}