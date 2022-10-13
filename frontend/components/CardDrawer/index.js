import { IconButton, Typography, Stack, Box, Collapse } from "@mui/material";
import Card from "components/Card";
import { useState } from "react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";

export default function CardDrawer({...props}) {
    const { children, cardTitle, open } = props;
    const [isOpened, setOpened] = useState(open ?? false);

    return (
        <Card withpadding>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{fontWeight:600, fontSize: '16px', fontColor: '#0D0D0D'}}>
                    {cardTitle}
                </Typography>
                <IconButton onClick={()=>setOpened(!isOpened)}>
                    {isOpened ? (
                        <RiSubtractLine size={16} color="#190D29"/>
                    ) : (
                        <RiAddLine size={16} color="#190D29"/>
                    )}
                </IconButton>
            </Stack>
            <Collapse in={isOpened}>
                <Box mt={3}>
                    {children}
                </Box>
            </Collapse>
        </Card>
    )
}