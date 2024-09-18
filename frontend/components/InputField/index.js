//
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import IconButton from '@mui/material/IconButton';
import { InputFieldStyle, InputFieldContainer } from './style';
import { InputAdornment } from '@mui/material';

const Component = ({ suffixIcon, password, type, error = false, helperText = null, prefixIcon, fullWidth = false, ...props }, ref) => {
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordType, setPasswordType] = useState('password');

  const handleClickShowPassword = () => {
    setHasPassword(!hasPassword);
    if (passwordType === 'text') {
      setPasswordType('password');
    } else {
      setPasswordType('text');
    }
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const checkPasswordIcon = hasPassword ? <RiEyeLine /> : <RiEyeCloseLine />;
  return (
    <InputFieldContainer>
      <InputFieldStyle
        ref={ref}
        type={password ? passwordType : type || 'text'}
        error={error}
        fullwidth={fullWidth ? 'true' : null}
        helperText={helperText}
        InputProps={{
          startAdornment: prefixIcon ? <InputAdornment position="start">{prefixIcon}</InputAdornment> : undefined,
          endAdornment: password ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {checkPasswordIcon}
              </IconButton>
            </InputAdornment>
          ) : suffixIcon ? (
            <InputAdornment position="end">{suffixIcon}</InputAdornment>
          ) : undefined
        }}
        {...props}
      />
    </InputFieldContainer>
  );
};

const InputField = forwardRef(Component);

Component.propTypes = {
  suffixIcon: PropTypes.any,
  prefixIcon: PropTypes.any,
  password: PropTypes.any,
  type: PropTypes.any,
  error: PropTypes.bool,
  helperText: PropTypes.any,
  fullWidth: PropTypes.bool
};

export default InputField;
