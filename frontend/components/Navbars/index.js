import {
  AccountWrapper,
  Header,
  Logo,
  // useStyles,
  AvatarWrapper,
  SettingsWrapper,
  sxAvatar,
  MenuHeader,
  SubTitleAccount,
  TitleAccount,
  LogoutButton
} from './style';
import { Avatar, Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import { getInitialName } from 'lib/helpers';
import { useAccount } from 'lib/contexts/accountContext';
import TitleLogo from 'components/TitleLogo';
import SettingsIcon from 'components/SettingsIcon';
import Logout from 'components/AppModals/Logout';
import Settings from 'components/AppModals/Settings';
import Link from 'next/link';

const HeaderMain = () => {
  const refLeftNav = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { account } = useAccount();

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<>
    <Box sx={{ position: 'sticky', width: '100%', zIndex: 500, top: 0 }}>
      <Header container>
        <Grid ref={refLeftNav} justifyContent="start" display="flex" size={7}>
          <Logo>
            <Link legacyBehavior href="/dashboard">
              <a style={{ textDecoration: 'none' }}>
                <TitleLogo />
              </a>
            </Link>
          </Logo>
        </Grid>
        <Grid display="flex" justifyContent="end" size={5}>
          <AccountWrapper>
            <TitleAccount>{account?.firstName + ' ' + account?.lastName}</TitleAccount>
            <SubTitleAccount>{account?.email}</SubTitleAccount>
          </AccountWrapper>
          <AvatarWrapper id="avatar-profile-header">
            <Avatar sx={sxAvatar}>{getInitialName(account?.firstName + ' ' + account?.lastName)}</Avatar>
          </AvatarWrapper>
          <SettingsWrapper>
            <IconButton onClick={handleClick}>
              <SettingsIcon />
            </IconButton>
          </SettingsWrapper>
          <MenuHeader
            id="header-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <LogoutButton onClick={() => {
              setAnchorEl(null);
              setSettingsOpen(true)
            }}
            >
              Settings
            </LogoutButton>
            <LogoutButton onClick={() => {
              setAnchorEl(null);
              setLogoutOpen(true);
            }}
            >
              Log out
            </LogoutButton>
          </MenuHeader>
        </Grid>
      </Header>
    </Box>
    <Logout
      open={logoutOpen}
      close={() => setLogoutOpen(false)}
    />
    <Settings
      open={Boolean(settingsOpen)}
      close={()=>setSettingsOpen(false)}
    />
  </>);
};

export default HeaderMain;
