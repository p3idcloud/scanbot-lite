import { Paper } from "@mui/material";

const { styled } = require("@mui/styles");

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
}));