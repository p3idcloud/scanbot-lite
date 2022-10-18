import { Stack } from "@mui/material";
import Image from "next/image";
import { Title } from "./style";

export default function TitleLogo({...props}) {
    return (
        <Stack direction="row" spacing={2} alignItems="center" {...props}>
            <Image 
                src="/logo.png"
                width={30}
                height={40}
            />
            <Title>SCANBOT LITE</Title>
        </Stack>
    )
}