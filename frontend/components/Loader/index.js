
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "components/Card";
import Image from "next/image";

export default function CustomLoader({...props}) {
  const { overlay } = props;

  const LoaderComponent = (
    <Box p={3} position='relative'>
      <Box display='flex' justifyContent='center'>
        <CircularProgress 
          size={200}
          sx={{position: 'relative', top: 0, color: '#6F36BC'}} 
        />
        <div style={{position: 'absolute', top: 50}}>
          <Image 
            src={"/logo.png"} 
            width={108} 
            height={152}
          />
        </div>
      </Box>
      <Typography textAlign='center' mt={3} sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '24px', color: '#190D29' }}>
          {props.message}...
      </Typography>
    </Box>
  )

  if (overlay) {
    return (
      <Box
        width={1} 
        height='100vh'
        display='flex' 
        alignItems='center' 
        justifyContent='center'
        position='absolute'
        zIndex={9999}
        top={0}
        left={0}
        bgcolor='rgba(0, 0, 0, 0.5);'
      >
        <Card withpadding="20px">
          {LoaderComponent}
        </Card>
      </Box>         
    );
  }

  return LoaderComponent;
}