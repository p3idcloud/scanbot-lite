import { createContext, useContext, useState } from "react";

export const RegisterContext = createContext({});

export const RegisterProvider = ({...props}) => {
    const { children } = props;
    //  Step 1: Authorize user to log in if not yet
    //  Step 2: User is authorized, now claiming scanner (processing)
    //  Step 3: Scanner is claimed and registered to account
    const [step, setStep] = useState(0);
    const [scannerData, setScannerData] = useState(null);
    const [error, setError] = useState(null);
    
    return (
        <RegisterContext.Provider
            value={{
                step,
                setStep,
                scannerData,
                setScannerData,
                error,
                setError
            }}
        >
            {children}
        </RegisterContext.Provider>
    )
}

export const useRegister = () => {
    const { 
        step, 
        setStep, 
        scannerData, 
        setScannerData,
        error,
        setError
    } = useContext(RegisterContext);

    return {
        step,
        setStep,
        scannerData,
        setScannerData,
        error,
        setError
    }
}