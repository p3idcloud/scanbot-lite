/*eslint-disable*/
import { Box } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <footer>
      <Box display='flex' alignItems='center' justifyContent='center' width={1}>
        <p>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://github.com/p3idcloud"
              target="_blank"
            >
              Scanbot Lite
            </a>
          </span>
        </p>
      </Box>
    </footer>
  );
}
