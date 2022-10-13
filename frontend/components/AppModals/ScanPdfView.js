import { Box, Typography } from "@mui/material";
import Button from "components/Button";
import Modal from "components/Modal";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { RiCloseFill } from "react-icons/ri";

const PdfViewer = dynamic(() => import("components/Pdf/PdfViewer"), {
    ssr: false,
});

export default function ScanPdfView({open, onClose, name, files}) {

    return (
        <Modal
            open={open}
            onClose={onClose}
            maxWidth={"md"}
            sx={{zIndex: 501}}
            customBodyFooter={
                <>
                    <Button
                        startIcon={<RiCloseFill size={20} />}
                        onClick={()=> onClose()
                        }
                        variant="outlined"
                        color="primaryBlack"
                        autoWidth
                        size="medium"
                    >
                        Close
                    </Button>
                </>
            }
        >
            <Box>
                <Typography fontWeight={600} fontSize={18} mt={1} mb={3}>
                    Pdf result for {name}
                </Typography>
                <PdfViewer 
                    files={files} 
                    newScan={false}
                />
            </Box>
        </Modal>
    );
}