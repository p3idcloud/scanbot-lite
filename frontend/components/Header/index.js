import { Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { HeaderWrapper, Wrapper } from './style';

const Header = ({ titleHeader, component, children }) => {
  return (
    <Wrapper>
      <HeaderWrapper style={{backgroundColor: '#ffffff'}}>
        <Container>
          <Typography fontSize="1.1em" fontWeight="500" marginBottom={2}>
            {titleHeader}
          </Typography>
          {component}
        </Container>
      </HeaderWrapper>
      <Container maxWidth="lg">
        {children}
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
