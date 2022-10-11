import { useEffect, useId, useMemo, useState } from 'react';
import { PropTypes } from 'prop-types';
import Button from 'src/components/Button';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';
import { IconButton } from '@mui/material';
import { RiAlignLeft } from 'react-icons/ri';
import { MenuHeader } from '../style';

const NavHeader = ({ lists, defaultKey }) => {
  const [selected, setSelected] = useState(defaultKey || '');
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const id = useId();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const selectedMemo = useMemo(() => {
    const active = lists?.filter(item => router?.pathname?.includes(item?.link));
    return active?.[0]?.label || selected;
    // eslint-disable-next-line
  }, [router?.pathname, selected]);

  useEffect(() => {
    if (router.pathname.includes('/app/')) {
      setSelected('Home');
    }
  }, [router]);

  return (
    <>
      {lists.map((item, index) => {
        const title = item?.title || item?.label;
        if (index < 4) {
          return (
            <Link key={id + index} to={item?.link || '/'} shallow>
              <Button onClick={() => setSelected(title)} variant={selectedMemo === title ? 'selected' : 'unSelected'}>
                {title || '-'}
              </Button>
            </Link>
          );
        }
      })}
      {lists.length > 4 && (
        <>
          <IconButton onClick={handleClick}>
            <RiAlignLeft />
          </IconButton>
          <MenuHeader
            id="header-menu-nav"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            {lists.map((item, index) => {
              const title = item?.title || item?.label;
              if (index > 3) {
                return (
                  <Link key={id + index} to={item?.link || '/'} shallow>
                    <Button
                      onClick={() => setSelected(title)}
                      variant={[selected, selectedMemo].includes(title) ? 'selected' : 'unSelected'}
                    >
                      {title || '-'}
                    </Button>
                  </Link>
                );
              }
            })}
          </MenuHeader>
        </>
      )}
    </>
  );
};

NavHeader.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.any),
  defaultKey: PropTypes.string
};

export default NavHeader;
