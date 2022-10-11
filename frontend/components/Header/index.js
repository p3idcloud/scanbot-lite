import { Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Wrapper } from './style';

const Header = ({ titleHeader, component }) => {
  return (
    <Wrapper>
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
};
export default Header;
