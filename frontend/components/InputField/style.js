import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';

export const InputFieldStyle = styled(TextField)(({ fullwidth }) => {
  return {
    width: fullwidth ? '100%' : 'auto',
    '& .MuiInputBase-root': {
      borderRadius: 8
    },
    '& .Mui-disabled': {
      cursor: 'not-allowed'
    },
    '& input': {
      padding: '12px 28px 12px 12px',
      height: 'auto',
      fontSize: 14
    },
    '& .MuiInputLabel-root': {
      height: 'auto',
      fontSize: 14,
      transform: 'translate(12px, 14px) scale(1)'
    },
    '& .MuiInputLabel-shrink ': {
      height: 'auto',
      fontSize: 14,
      transform: 'translate(14px, -9px) scale(0.9)'
    }
  };
});
export const InputFieldContainer = styled('div')({
  position: 'relative',
  width: '100%'
});
export const SuffixContainer = styled('div')({
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)'
});
export const SuffixWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px'
});
