import { styled } from '@mui/system';
import Button from '@mui/material/Button';

export const ButtonWrapper = styled(Button)(props => ({
  borderRadius: 8,
  width: props.autowidth ? 'auto' : '100%',
  textTransform: 'initial',
  // padding: '12px 24px',
  fontWeight: 'bold'
  // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  // color: "blue"
}));

export const ContentWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& span': {
    padding: '0px 5px'
  }
});
export const LoadingWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  padding: '0 5px',
  opacity: '.5'
});
