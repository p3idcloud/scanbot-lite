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
import { Avatar, Box, Grid, IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import { getInitialName } from 'lib/helpers';
import { useAccount } from 'lib/contexts/accountContext';
import TitleLogo from 'components/TitleLogo';
import SettingsIcon from 'components/SettingsIcon';
import Logout from 'components/AppModals/Logout';
import TwoFASettings from 'components/AppModals/TwoFASettings';
import Link from 'next/link';

const HeaderMain = () => {
  const refLeftNav = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [twoFASettingsOpen, setTwoFASettingsOpen] = useState(false);
  const { account } = useAccount();

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ position: 'sticky', width: '100%', zIndex: 500, top: 0 }}>
        <Header container>
          <Grid item xs={7} ref={refLeftNav} justifyContent="start" display="flex">
            <Logo>
              <Link legacyBehavior href="/dashboard">
                <a style={{ textDecoration: 'none' }}>
                  <TitleLogo />
                </a>
              </Link>
            </Logo>
          </Grid>
          <Grid item xs={5} display="flex" justifyContent="end">
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
                setTwoFASettingsOpen(true)
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
      <TwoFASettings
        open={Boolean(twoFASettingsOpen)}
        close={()=>setTwoFASettingsOpen(false)}
        {...account}
      />
    </>
  );
};

export default HeaderMain;
