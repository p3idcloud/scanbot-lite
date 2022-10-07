import { createContext, useContext, useEffect, useState } from "react";
import CustomLoader from "components/Loader";
import { Box, Modal } from "@mui/material";

export const AccountContext = createContext({});

export const AccountProvider = ({ children, user }) => {
    const [loading, setLoading] = useState(false);
    const [appModalIsOpen, setAppModal] = useState(false);
    const [appModalChild, setAppModalChild] = useState(null);
    const [scannerList, setScannerList] = useState([]);
    const [scanHistory, setScanHistory] = useState([]);
    const [account, setAccount] = useState(user);

    const setAppModalAndOpen = (modalChild) => {
        setAppModalChild(modalChild);
        setAppModal(true);
    }

    const closeAppModal = () => {
        setAppModal(false);
    }
    
    return (
        <AccountContext.Provider 
            value={{
                account,
                setAccount,
                scannerList,
                setScannerList,
                scanHistory,
                setScanHistory,
                setAppModalAndOpen,
                closeAppModal
            }}
        >
            {loading 
                ? <CustomLoader message='Adding new account' />    
                : children
            }
            <Modal open={appModalIsOpen}>
                <Box
                    display='flex' 
                    sx={{
                        position: 'absolute',
                        boxShadow: 24,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    {appModalChild}
                </Box>
            </Modal>
        </AccountContext.Provider>
  );
};

export const useAccount = () => {
    const {
        account,
        setAccount,
        scannerList,
        setScannerList,
        scanHistory,
        setScanHistory,
        setAppModalAndOpen,
        closeAppModal
    } = useContext(AccountContext);

    return {
        account,
        setAccount,
        scannerList,
        setScannerList,
        scanHistory,
        setScanHistory,
        setAppModalAndOpen,
        closeAppModal
    }
}

export default AccountProvider;
