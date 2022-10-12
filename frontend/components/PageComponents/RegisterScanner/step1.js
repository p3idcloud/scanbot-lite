import Button from "components/Button";
import Image from "next/image";
import Router from "next/router";

export default function Step1() {
    const onClick = () => {
        Router.push('/api/auth/login/saml');
    } 

    return (
        <>
            <Image 
                src="/logo.png" 
                width={200}
                height={200}
            />
            <h1>Scanner Registration</h1>
            <p>
                You are about to claim an ownership for a scanner.
                Confirm your identity using the button below:
            </p>
            <Button onClick={onClick}>
                Sign in with SSO
            </Button>
        </>
    )
}