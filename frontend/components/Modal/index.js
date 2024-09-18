import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import Button from '../Button';
import PropTypes from 'prop-types';
import { RiCloseLine } from 'react-icons/ri';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TitleModal = ({ iconTitle, title, titleType = 'primary' }) => {
  return (
    <>
      <Box
        sx={{
          fontSize: '20px',
          borderBottom: '1px solid #E8E8E8',
          fontWeight: 600,
          padding: titleType === 'primary' ? '24px' : '0 0 1.5rem 0'
        }}
      >
        {typeof title === 'object' ? (
          title
        ) : (
          <Stack spacing={1} direction="row" alignItems="center">
            {iconTitle}
            <Typography fontSize={'20px'} fontWeight={600}>
              {title}
            </Typography>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default function Modal({
  children,
  open,
  onClose,
  maxWidth,
  onCancel,
  onSave,
  action,
  hideCancel,
  hideSave,
  title,
  iconTitle,
  customFooter,
  customBodyFooter,
  saveOptions,
  isClose,
  titleType,
  disableFooter,
  disableOutsideClick,
  disableSpaceContent
}) {
  const handleClose = isClose => {
    if (disableOutsideClick && isClose) {
      return false;
    }
  };

  const contentSpace = disableSpaceContent ? 0 : '1.5rem';

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth={maxWidth || 'sm'}
      onClose={() => handleClose(true)}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
    >
      {isClose && (
        <IconButton onClick={() => handleClose()} sx={{ position: 'absolute', right: 10, top: 10 }}>
          <RiCloseLine />
        </IconButton>
      )}
      {title && titleType === 'primary' && <TitleModal title={title} iconTitle={iconTitle} titleType={titleType} />}

      <Box padding={contentSpace}>
        {title && titleType === 'secondary' && <TitleModal title={title} iconTitle={iconTitle} titleType={titleType} />}
        {children}
      </Box>
      {disableFooter ? (
        <></>
      ) : customFooter ? (
        customFooter
      ) : (
        <DialogActions sx={{ padding: '1rem 2rem', bgcolor: '#F8F8F8' }}>
          {customBodyFooter ? (
            customBodyFooter
          ) : (
            <>
              {!hideCancel && (
                <Button
                  onClick={() => (onCancel ? onCancel() : handleClose())}
                  variant="outlined"
                  color="primaryBlack"
                  autoWidth
                  size="medium"
                >
                  {action?.cancel || 'Cancel'}
                </Button>
              )}
              {!hideSave && (
                <Button
                  onClick={() => (onSave ? onSave() : handleClose())}
                  variant="contained"
                  color="primary"
                  autoWidth
                  size="medium"
                  form={saveOptions?.formId}
                  type={saveOptions?.submitType ? 'submit' : 'button'}
                  loading={saveOptions?.loadingSave}
                  disabled={saveOptions?.disabled}
                >
                  {action?.save || 'Create'}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

Modal.propTypes = {
  open: PropTypes.any,
  disableOutsideClick: PropTypes.bool,
  onClose: PropTypes.func,
  maxWidth: PropTypes.any,
  onCancel: PropTypes.any,
  onSave: PropTypes.any,
  action: PropTypes.any,
  hideCancel: PropTypes.any,
  hideSave: PropTypes.any,
  title: PropTypes.any,
  iconTitle: PropTypes.any,
  customFooter: PropTypes.any,
  customBodyFooter: PropTypes.any,
  titleType: PropTypes.oneOf(['primary', 'secondary']),
  saveOptions: PropTypes.shape({
    formId: PropTypes.string,
    submitType: PropTypes.bool,
    loadingSave: PropTypes.bool
  }),
  disableFooter: PropTypes.bool
};
