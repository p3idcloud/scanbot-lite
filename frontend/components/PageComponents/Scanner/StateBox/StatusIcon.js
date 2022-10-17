import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function StatusIcon(props) {
    const { status } = props;

    const [borderWidth, setBorderWidth] = useState(5);
    const [size, setSize] = useState(24);
    const [decrease, setDecrease] = useState(true);

    const decreaseBorder = () => {
      setBorderWidth(borderWidth-0.02)
      setSize(size-0.04);
    };
    const increaseBorder = () => {
      setBorderWidth(borderWidth+0.02)
      setSize(size+0.04);
    };

    const animate = () => {
      if (borderWidth > 1 && decrease) {
        decreaseBorder();
      } else if (borderWidth <= 1 && decrease) {
        setDecrease(false);
      }
      if (borderWidth < 5 && !decrease) {
        increaseBorder();
      } else if (borderWidth >= 5 && !decrease) {
        setDecrease(true);
      }
    }

    useEffect(() => {
      setTimeout(() => animate(), 1);
    },[decrease, borderWidth])

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
        display='flex' 
        justifyContent='center' 
        alignItems='center'
        width="24px"
        height="24px"
      >
        <Box 
            sx={{
                width:`${Math.round(size * 100)/100}px`, 
                height:`${Math.round(size * 100)/100}px`, 
                borderStyle: "solid",
                borderWidth: `${Math.round(borderWidth * 100)/100}px`, 
                borderRadius: "12px",
                borderColor: getBorderColor(), 
                bgcolor: getBgColor()
            }}
        />
      </Box>
    )
}