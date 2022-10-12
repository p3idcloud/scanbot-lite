import Admin from "layouts/Admin.js";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("components/PageComponents/Scanner", {ssr: false}));

const ScannerPage = () => <Scanner />

ScannerPage.layout = Admin;

export default ScannerPage;