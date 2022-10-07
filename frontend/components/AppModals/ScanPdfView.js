import RegularButton from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useAccount } from "lib/contexts/accountContext";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("components/Pdf/PdfViewer"), {
    ssr: false,
});
const CustomLoader = dynamic(() => import("components/Loader"), {
    ssr: false
})

export default function ScanPdfView({files}) {
    const { closeAppModal } = useAccount();

    if (!files) {
        return <CustomLoader />
    }

    console.log(files);

    return (
        <GridContainer style={{maxWidth: '500px'}}>
            <GridItem xs={12}>
                <PdfViewer files={files} />
            </GridItem>

            <GridItem xs={12}>
                <RegularButton color='info' onClick={() => closeAppModal()}>
                    Close
                </RegularButton>
            </GridItem>
        </GridContainer>
    )
}