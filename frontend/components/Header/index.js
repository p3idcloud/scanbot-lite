import { Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Wrapper } from './style';

const Header = ({ titleHeader, component, setHeight }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const height = ref?.current?.clientHeight;
    if (height) {
        setHeight(height);
    }
},[ref?.current?.clientHeight]);

  return (
    <Wrapper ref={ref}>
      <Container>
        <Typography fontSize="1.1em" fontWeight="500" marginBottom={2}>
          {titleHeader}
        </Typography>
        {component}
      </Container>
    </Wrapper>
  );
};

Header.propTypes = {
  titleHeader: PropTypes.any,
  component: PropTypes.any,
  setHeight: PropTypes.any
};
export default Header;
