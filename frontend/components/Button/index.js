//
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

import { ButtonWrapper, ContentWrapper, LoadingWrapper } from './style';
import { Box } from '@mui/material';

const Button = ({ children, variant, text, loading, startIcon, autoWidth, onClick, size, type, ...props }) => {
  const buttonVariant = () => {
    if (variant === 'light') {
      return {
        variant: 'contained',
        color: 'light'
      };
    }
    if (variant === 'selected') {
      return {
        variant: 'contained',
        color: 'selected'
      };
    }
    if (variant === 'unSelected') {
      return {
        variant: 'contained',
        color: 'unSelected'
      };
    }
    if (variant === 'outlined') {
      return {
        variant: 'outlined',
        color: 'outlined'
      };
    }
    return {
      variant: 'contained',
      color: 'primary'
    };
  };

  return (
    <ButtonWrapper
      variant={buttonVariant().variant}
      disableElevation
      color={buttonVariant().color}
      startIcon={loading ? '' : startIcon}
      disabled={loading}
      autowidth={autoWidth ? 'true' : null}
      onClick={onClick}
      size={size}
      type={type}
      {...props}
    >
      {loading && (
        <LoadingWrapper>
          <CircularProgress size={16} color="primary" />
        </LoadingWrapper>
      )}
      <ContentWrapper>
        {text && <Box>{text}</Box>}
        {!text && children}
      </ContentWrapper>
    </ButtonWrapper>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['contained', 'light', 'outlined', 'selected', 'unSelected']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'input']),
  text: PropTypes.string,
  loading: PropTypes.bool,
  startIcon: PropTypes.element,
  prefixIcon: PropTypes.element,
  suffixIcon: PropTypes.element,
  onClick: PropTypes.func,
  autoWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
  color: PropTypes.oneOf([
    'primary',
    'light',
    'lightChip',
    'selected',
    'unSelected',
    'black',
    'primaryBlack',
    'outlined',
    'orange',
    'blue',
    'white',
    'lightBlue',
    'red',
    'redDark',
    'green',
    'semiRed',
    'semiYellow',
    'semiGreen',
    'purpleActive',
    'purpleInactive'
  ])
};

Button.defaultProps = {
  variant: 'contained',
  size: 'large',
  type: 'button'
};

export default Button;
