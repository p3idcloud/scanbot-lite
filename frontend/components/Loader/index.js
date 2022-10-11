
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";

export default function CustomLoader({...props}) {
    return (
      <>
        <CircularProgress />
        <Image src="/scanner.gif" height={200} width={200} />
        <h3 >
            {props.message}...
        </h3>
      </>
                  
    );
}