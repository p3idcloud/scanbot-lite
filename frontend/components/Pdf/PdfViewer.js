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

const dummyFile = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
];

export default function PdfViewer({ files }) {
  const [file, setFile] = useState(files || dummyFile);
  const [page, setPage] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [minHeight, setMinHeight] = useState(null);
  const [width, setWidth] = useState(400);
  const pdfDocRef = useRef(null);

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

  return (
    <Card withpadding background='#F8F8FA'>
      <Grid direction="column" container alignItems='center'>
          <Grid item>
          <TransformWrapper wheel={{ disabled: true }}>
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <Stack direction='row' alignItems='center' justifyContent='center' spacing={1} pb={3}>
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
  );
}

PdfViewer.propTypes = {
  files: PropTypes.array,
};
