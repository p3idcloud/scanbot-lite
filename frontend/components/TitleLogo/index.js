import { Stack } from "@mui/material";
import Image from "next/image";
import { Title } from "./style";

export default function TitleLogo() {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Image 
                alt={"Logo"}
                src="/logo.png"
                width={30}
                height={40}
            />
            <Title>SCANBOT LITE</Title>
        </Stack>
    )
}