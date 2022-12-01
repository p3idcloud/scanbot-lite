import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import PropTypes from "prop-types";
import { Box, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Card from "components/Card";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AiOutlineCompress } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import { RiFile3Line, RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { toast } from "react-toastify";
import DocSumoForm from "components/AppModals/DocSumoForm";
import { mergePdf } from "lib/helpers";
import Image from "next/image";

const dummyFile = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
];

export default function PdfViewer({ files, pdfBlobs }) {
  const [file, setFile] = useState(files || dummyFile);
  const [page, setPage] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [minHeight, setMinHeight] = useState(null);
  const [width, setWidth] = useState(400);
  const pdfDocRef = useRef(null);
  const [uploadDocsumoOpen, setUploadDocsumo] = useState(false);

  useEffect(() => {
    setFile(files || []);
    if (!files) {
      setPage(0);
    }
  }, [files]);

  // ref
  useEffect(() => {
    if (pdfDocRef?.current?.clientHeight) {
      setMinHeight(pdfDocRef?.current?.clientHeight);
    }
    if (pdfDocRef?.current?.clientWidth) {
      setWidth(pdfDocRef?.current?.clientWidth);
    }
  }, [pdfDocRef?.current?.clientHeight, pdfDocRef?.current?.clientWidth]);
  function onFileChange(type) {
    if (type === "next" && page + 1 < file.length) {
      setPage((page) => page + 1);
    }
    if (type === "prev" && page !== 0) {
      setPage((page) => page - 1);
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const handlePage = (index) => setPage(index);
  const handleDownload = () => {
    window.open(file[page], "_blank");
  };

  const handleDownloadAll = async () => {
    var pdfBlobList;
    if (!pdfBlobs) {
        // Then we need to convert it to blobs first
        pdfBlobList = await Promise.all(files.map(url => {
          return fetch(url)
              .then((res) => res.blob())
              .then((data) => data)
              .catch(err => {
                  toast.error("Failed to merge documents");
                  setLoading(false);
                  return false;
              })
        }))
    }
    const [mergedPdf, error] = await mergePdf(pdfBlobs || pdfBlobList);
    if (error) {
      toast.error("Failed to merge documents");
      return;
    }
    const url = URL.createObjectURL(mergedPdf);
    window.open(url, "_blank");
  }

  return (
    <>
      <Card withpadding background='#F8F8FA'>
        <Grid direction="column" container alignItems='center'>
            <Grid item display='flex' flexDirection='column' alignItems='center'>
            <TransformWrapper wheel={{ disabled: true }}>
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
              <>
                <Stack direction='row' alignItems='center' justifyContent='center' spacing={1} pb={3} sx={{flexWrap: 'wrap'}}>
                  <>
                    <Tooltip title="Zoom in">
                      <IconButton
                        sx={{
                          borderRadius: 0, 
                          bgcolor: '#DBDBDB', 
                          p: 0.5,
                          color: "#000000"
                        }}
                        onClick={() => zoomIn()}
                      >
                        <RiZoomInLine size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Zoom out">
                      <IconButton
                        sx={{
                          borderRadius: 0, 
                          bgcolor: '#DBDBDB', 
                          p: 0.5,
                          color: "#000000"
                        }}
                        onClick={() => zoomOut()}
                      >
                        <RiZoomOutLine size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset">
                      <IconButton
                        sx={{
                          borderRadius: 0, 
                          bgcolor: '#DBDBDB', 
                          p: 0.5,
                          color: "#000000"
                        }}
                        onClick={() => resetTransform()}
                      >
                        <GrPowerReset size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Center">
                      <IconButton
                        sx={{
                          borderRadius: 0, 
                          bgcolor: '#DBDBDB', 
                          p: 0.5,
                          color: "#000000"
                        }}
                        onClick={() => centerView()}
                      >
                        <AiOutlineCompress size={20} />
                      </IconButton>
                    </Tooltip>
                    {file.length !== 0 && (
                      <>
                        {file.length !== 1 && (
                          <>
                            <Tooltip title="Prev page">
                              <IconButton
                                sx={{
                                  borderRadius: 0, 
                                  bgcolor: '#DBDBDB', 
                                  p: 0.5,
                                  color: "#000000"
                                }}
                                onClick={() => onFileChange("prev")}
                              >
                                <FiChevronLeft size={20} />
                              </IconButton>
                            </Tooltip>
                            <Typography sx={{fontSize: '14px', fontWeight: 600}}>
                              {page + 1}
                            </Typography>
                          </>
                        )}
                        {file.length > 1 && (
                          <Tooltip title="Next page">
                            <IconButton
                              sx={{
                                borderRadius: 0, 
                                bgcolor: '#DBDBDB', 
                                p: 0.5,
                                color: "#000000"
                              }}
                              onClick={() => onFileChange("next")}
                            >
                              <FiChevronRight size={20} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Box
                          sx={{
                            borderRadius: 0, 
                            bgcolor: '#DBDBDB', 
                            py: 0.5,
                            px: 1,
                            color: "#000000"
                          }}
                        >
                          <Typography sx={{fontSize: '14px', fontWeight: 600}}>
                            Total: {file.length}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                  <IconButton
                    sx={{
                      borderRadius: 0, 
                      bgcolor: '#DBDBDB', 
                      py: 0.5,
                      px: 1,
                      color: "#000000"
                    }}
                    onClick={handleDownload}
                  >
                    <Typography sx={{fontSize: '14px', fontWeight: 600}}>
                      Download
                    </Typography>
                  </IconButton>
                  <IconButton
                    sx={{
                      borderRadius: 0, 
                      bgcolor: '#DBDBDB', 
                      py: 0.5,
                      px: 1,
                      color: "#000000"
                    }}
                    onClick={handleDownloadAll}
                  >
                    <Typography sx={{fontSize: '14px', fontWeight: 600}}>
                      Download All
                    </Typography>
                  </IconButton>
                  <IconButton
                    sx={{
                      borderRadius: 0, 
                      bgcolor: '#4D61FC', 
                      py: 0.5,
                      px: 1,
                      color: "#000000",
                      '&:hover' : {
                        bgcolor: '#6397FC'
                      } 
                    }}
                    onClick={() => setUploadDocsumo(true)}
                  >
                    <Image src="/docsumo.png" height={20} width={20} style={{borderRadius: 3}}/>
                    <Typography ml={1} sx={{fontSize: '14px', fontWeight: 600, color: 'white !important'}}>
                      Upload To Docsumo
                    </Typography>
                  </IconButton>
                </Stack>
                {file.length !== 0 && (
                  <div style={{ minHeight: minHeight }}>
                  <TransformComponent>
                    <Document
                      className="pdf-doc"
                      file={file?.[page]}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={() => (
                        <Box
                          display='flex'
                          flexDirection="column"
                          justifyContent='center'
                          alignItems='center'
                          width={width}
                          sx={{ height: minHeight || 200 }}
                        >
                          <RiFile3Line size={200} style={{color: '#EDEDED'}}/>
                        </Box>
                      )}
                    >
                      <div ref={pdfDocRef}>
                        <Page
                          pageNumber={1}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      </div>
                    </Document>
                  </TransformComponent>
                </div>
                )}
              </>
            )}
          </TransformWrapper>
        </Grid>
        </Grid>
      </Card>
      <DocSumoForm 
        open={uploadDocsumoOpen} 
        close={() => setUploadDocsumo(false)} 
        pdfBlobs={pdfBlobs}
        fileUrls={files}
      />
    </>
  );
}

PdfViewer.propTypes = {
  files: PropTypes.array,
};
