import { styled } from '@mui/system';

import { Paper } from '@mui/material';

export const CardContainer = styled('div')({
  position: 'relative'
});

export const CardWrapper = styled(Paper)(props => ({
  borderRadius: 8,
  width: '100%',
  height: '100%',
  border: props.noborder ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  boxSizing: 'border-box',
  padding: props.withpadding ? 20 : 'auto',
  opacity: props.disabledcard ? '0.5' : '1',
  boxShadow: props.shadow ? 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' : 'inherit',
  '&:hover': {
    boxShadow: props.hover ? '0px 3px 16px rgba(0, 0, 0, 0.12)' : 'auto',
    cursor: props.hover ? 'pointer' : 'auto',
    background: props.bghover
  }
}));

export const DotStatusWrapper = styled('div')({
  position: 'absolute',
  right: 20,
  top: 20
});
export const DotParent = styled('div')({
  position: 'relative',
  width: 24,
  height: 24,
  borderRadius: 999
});
export const DotChild = styled('div')({
  position: 'absolute',
  width: 14,
  height: 14,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 999
});
