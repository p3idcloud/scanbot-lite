import Image from "next/image";
import { useRegister } from "lib/contexts/registerContext";

export default function Step3() {
    const { scannerData } = useRegister();

    return (
        <>
            <Image 
                src="/logo.png" 
                width={200}
                height={200}
            />
            <h1>Successfully Registered</h1>
            <p>
                {scannerData?.description}
            </p>
        </>
    )
}