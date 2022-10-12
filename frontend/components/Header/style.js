import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const Wrapper = styled(Box)(() => ({
  left: 0,
  width: '100%'
}));
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  width: '100%',
  padding: '1.2rem 0',
  border: `1px solid ${theme.palette.black.light}`,
}));
