import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { Badge, Button, Grid, ListItem, ListSubheader, Menu, MenuItem, Typography } from '@mui/material';

export const Header = styled(Grid)({
  padding: '12px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #DBDBDB'
});
export const useStyles = makeStyles({
  wrapper: {
    display: 'flex'
  },
  space: {
    padding: '0 20px'
  }
});
export const Logo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});
export const NavbarMenu = styled(Logo)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 20px'
});
export const GridWrapper = styled(NavbarMenu)({
  display: 'flex'
});
export const NotificationWrapper = styled(NavbarMenu)({
  position: 'relative',
  padding: 0
});
export const DotNotification = styled('div')({
  position: 'absolute',
  background: '#F7AC03',
  width: 16,
  height: 16,
  borderRadius: 99,
  border: 'solid 3px #ffffff',
  top: -5,
  right: -3
});
export const AccountWrapper = styled(NavbarMenu)({
  display: 'block',
  textAlign: 'right'
});
export const AvatarWrapper = styled(NotificationWrapper)({});
export const SettingsWrapper = styled(NotificationWrapper)({ 
  cursor: 'pointer',
  paddingLeft: '20px'
});
export const sxAvatar = { background: '#05908F', width: 36, height: 36, padding: 3 };

export const LogoutButton = styled(Button)(() => ({
  width: '100%',
  textTransform: 'uppercase',
  fontSize: 14
}));

export const ListItemWrapper = styled(ListItem)(() => ({
  padding: '0 1rem'
}));

export const ListSubHeader = styled(ListSubheader)({
  background: '#f8f4fd',
  marginBottom: '1rem',
  padding: 0
});

export const ListContainerMobile = styled('li')({
  padding: 0,
  '& > ul': {
    padding: 0,
    paddingBottom: 70,
    '& li': {
      // padding: 0
    }
  }
});
export const MenuItemHeader = styled(MenuItem)({
  fontSize: 14,
  color: '#959595',
  fontWeight: 600,
  padding: '16px 20px'
});
export const MenuHeader = styled(Menu)(() => ({
  '& .MuiPaper-root': {
    minWidth: 196,
    marginTop: 10,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      background: '#ffffff',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0
    }
  }
}));

const EllipsisText = styled(Typography)({
  maxWidth: 200,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

export const TitleAccount = styled(EllipsisText)({
  fontWeight: 600,
  fontSize: 14
});
export const SubTitleAccount = styled(EllipsisText)({
  fontSize: 14,
  color: '#B7B7B7'
});

export const StyledBadge = styled(Badge)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    top: '32%',
    right: '32%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}));
