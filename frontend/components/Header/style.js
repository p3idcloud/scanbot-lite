import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const Wrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.black.light}`,
  background: '#ffffff',
  padding: '1.2rem 0'
}));
