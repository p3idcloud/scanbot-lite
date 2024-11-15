import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select as SelectMUI, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const placeholderHelper = 'mui-component-select';

const Select = ({ value, onChange = () => null, lists, label, helperText, control, error, disabled = false, onChangeValue = () => null, ...props }) => {
  const [itemValue, setItemValue] = useState(value || '');

  useEffect(() => {
    setItemValue(value);
  }, [value]);

  useEffect(() => {
    const emptyValue = lists?.find(item => itemValue === item?.value);
    if (itemValue && !emptyValue) {
      setItemValue('');
    }
  }, [itemValue, lists]);

  const handleChangeValue = item => {
    onChangeValue(item);
  };
  return (
    <FormControl fullWidth error={Boolean(error)} disabled={disabled}>
      {label && <InputLabel id="select-label-input">{label}</InputLabel>}

      <SelectMUI
        labelId="select-label"
        id="-select-helper"
        value={itemValue || (!label ? placeholderHelper : '')}
        label={label}
        onChange={e => {
          if (e?.target?.value !== placeholderHelper) {
            setItemValue(e?.target?.value);
            onChange(e);
          }
        }}
        {...props}
        {...control}
      >
        {!label && (
          <MenuItem value={placeholderHelper} sx={{ display: 'none' }}>
            Choose here
          </MenuItem>
        )}

        {lists?.map((item, index) => {
          return (
            <MenuItem
              key={index}
              value={item?.value}
              sx={{ padding: 2, fontSize: 14 }}
              onClick={() => handleChangeValue(item)}
            >
              {item.description ? (
                <Tooltip title={item.description} placement="left" sx={{margin: -2, padding: 2}}>
                  <Box width={1} height={1}>{item?.label}</Box>
                </Tooltip>
              ) : (
                item?.label
              )}
            </MenuItem>
          );
        })}
      </SelectMUI>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

Select.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  lists: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.any, value: PropTypes.any })),
  onChangeValue: PropTypes.func,
  label: PropTypes.any,
  error: PropTypes.bool,
  disabled: PropTypes.bool
};


export default Select;
