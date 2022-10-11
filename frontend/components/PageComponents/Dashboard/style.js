import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { Button, Menu, MenuItem } from '@mui/material';

export const Wrapper = styled('section')({
    padding: '2.3rem 0'
});
export const useStyles = makeStyles({
  wrapper: {
    display: 'flex'
  },
  space: {
    padding: '0 20px'
  }
});
export const ButtonWrapper = styled(Button)(() => ({
  width: '100%',
  paddingLeft: '8px !important',
  paddingTop: '5px !important',
  paddingBottom: '5px !important',
  textAlign: 'start',
  justifyContent: 'flex-start !important',
  fontSize: 14
}));
export const RemoveButtonWrapper = styled(ButtonWrapper)(() => ({
  color: 'red !important',
}));
export const MenuHeader = styled(Menu)(() => ({
  '& .MuiPaper-root': {
    width: 125,
    marginTop: 60
  }
}));
