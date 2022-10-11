import Button from 'components/Button';
import Modal from 'components/Modal';
import { Avatar, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { RiDeleteBin6Line } from 'react-icons/ri';

const DeleteConfirmation = ({ open, onClose, onDelete, loading, title, subTitle }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      customBodyFooter={
        <>
          <Button
            onClick={() => {
              onClose(false);
            }}
            variant="outlined"
            color="primaryBlack"
            autoWidth
            size="medium"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDelete();
            }}
            variant="contained"
            autoWidth
            size="medium"
            loading={loading}
          >
            Start
          </Button>
        </>
      }
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={3} padding={4}>
        <Avatar sx={{ bgcolor: '#DC3545', width: 56, height: 56 }}>
          <RiDeleteBin6Line size={30} />
        </Avatar>
        <Box>
          <Typography fontWeight={600} fontSize={18}>
            {title || 'Delete?'}
          </Typography>
          <Typography fontSize={14} color="black.main" paddingTop={0.5}>
            {subTitle || 'Do you really want to delete? This process cannot be undone.'}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

DeleteConfirmation.defaultProps = {
  open: false,
  loading: false,
  data: null,
  onClose: () => null,
  onDelete: () => null
};
DeleteConfirmation.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.any,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func
};

export default DeleteConfirmation;
