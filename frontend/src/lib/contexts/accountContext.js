import { createContext, useContext, useEffect, useState } from "react";
import CustomLoader from "components/Loader";

export const AccountContext = createContext({});

export const AccountProvider = ({ children, user }) => {
    const [loading, setLoading] = useState(false);
    const [scannerList, setScannerList] = useState([]);
    const [account, setAccount] = useState(user);

    return (
        <AccountContext.Provider 
            value={{
                account,
                setAccount,
                scannerList,
                setScannerList
            }}
        >
            {loading 
                ? <CustomLoader message='Adding new account' />    
                : children
            }
        </AccountContext.Provider>
  );
};

export const useAccount = () => {
    const {
        account,
        setAccount,
        scannerList,
        setScannerList
    } = useContext(AccountContext);

    return {
        account,
        setAccount,
        scannerList,
        setScannerList
    }
}

export default AccountProvider;
