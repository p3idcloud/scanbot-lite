import Button from 'components/Button';
import Modal from 'components/Modal';
import { Avatar, Box, Typography } from '@mui/material';
import { FiLogOut } from 'react-icons/fi';
import { useAccount } from 'lib/contexts/accountContext';

const Logout = ({ open, close }) => {
    const { handleLogout } = useAccount();

    return (
        <Modal
            open={open}
            onClose={close}
            customBodyFooter={
            <>
                <Button
                    onClick={() => {
                        close();
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
                        handleLogout();
                    }}
                    variant="contained"
                    color="redDark"
                    autoWidth
                    size="medium"
                >
                    Logout
                </Button>
            </>
            }
        >
            <Box display="flex" alignItems="center" justifyContent="center" gap={3} padding={4}>
                <Avatar sx={{ bgcolor: '#DC3545', width: 56, height: 56 }}>
                    <FiLogOut size={30} />
                </Avatar>
                <Box>
                    <Typography fontWeight={600} fontSize={18}>
                        {'Log out?'}
                    </Typography>
                    <Typography fontSize={14} color="black.main" paddingTop={0.5}>
                        {'Do you want to log out?'}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default Logout;
