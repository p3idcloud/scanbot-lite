import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import PropTypes from "prop-types";
import { 
    ChevronLeft, 
    ChevronRight, 
    ZoomInOutlined, 
    ZoomOutOutlined, 
    HighlightOffRounded,
    CalendarViewWeek 
} from "@mui/icons-material";
import { Grid, IconButton } from "@material-ui/core";
import RegularButton from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { Box } from "@mui/material";
import Image from "next/image";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const dummyFile = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
];

export default function PdfViewer({ files, thumbnail }) {
  const [file, setFile] = useState(files || dummyFile);
  const [page, setPage] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [minHeight, setMinHeight] = useState(null);
  const pdfDocRef = useRef(null);

  useEffect(() => {
    setFile(files || []);
  }, [files?.length]);

  // ref
  useEffect(() => {
    if (
      pdfDocRef?.current?.clientHeight &&
      pdfDocRef?.current?.clientHeight > 200
    ) {
      setMinHeight(pdfDocRef?.current?.clientHeight);
    }
  }, [pdfDocRef?.current?.clientHeight]);

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
    <div>
      <Card>
        <CardBody>
          <div>
            <Grid direction="column" container>
                <Grid item>
                <TransformWrapper wheel={{ disabled: true }}>
                {({ zoomIn, zoomOut, resetTransform, centerView }) => (
                  <>
                    <div className="flex px-4 space-x-2 pb-2 items-center justify-center">
                      {!thumbnail && (
                        <>
                          <IconButton
                            onClick={() => zoomIn()}
                          >
                            <ZoomInOutlined className="w-5" />
                          </IconButton>
                          <IconButton
                            onClick={() => zoomOut()}
                          >
                            <ZoomOutOutlined className="w-5" />
                          </IconButton>
                          <IconButton
                            onClick={() => resetTransform()}
                          >
                            <HighlightOffRounded className="w-5" />
                          </IconButton>
                          <IconButton
                            onClick={() => centerView()}
                          >
                            <CalendarViewWeek className="w-5" />
                          </IconButton>
                          {file.length !== 0 && !thumbnail && (
                            <>
                              {file.length !== 1 && (
                                <>
                                  <IconButton
                                    className="p-2 bg-gray-200"
                                    onClick={() => onFileChange("prev")}
                                  >
                                    <ChevronLeft className="w-5" />
                                  </IconButton>
                                  <span>{page + 1}</span>
                                </>
                              )}
                              {file.length > 1 && (
                                <IconButton
                                  className="p-2 bg-gray-200"
                                  onClick={() => onFileChange("next")}
                                >
                                  <ChevronRight className="w-5" />
                                </IconButton>
                              )}
                              <RegularButton color="info" disabled>
                                Total: {file.length}
                              </RegularButton>
                            </>
                          )}
                        </>
                      )}
                      <RegularButton
                        onClick={handleDownload}
                        color='info'
                      >
                        Download
                      </RegularButton>
                    </div>
                    <div
                      className="pdf-document_view flex justify-center w-full bg-gray-300"
                      style={{ minHeight: minHeight }}
                    >
                      <TransformComponent>
                        <Document
                          className="pdf-doc"
                          file={file[page]}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={() => (
                            <Box
                              display='flex'
                              justifyContent='center'
                              alignItems='center'
                              width={1}
                              sx={{ height: minHeight || 200 }}
                            >
                              <Image src={"/logo.png"} width={200} height={200} />
                              <h3>Please Wait...</h3>
                            </Box>
                          )}
                        >
                          <div ref={pdfDocRef}>
                            <Page
                              pageNumber={1}
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                              className="space-y-4 !w-full h-auto"
                            />
                          </div>
                        </Document>
                      </TransformComponent>
                    </div>
                  </>
                )}
              </TransformWrapper>
            </Grid>
            <Grid item>
                {thumbnail && (
                <div className="flex flex-wrap py-4 justify-center items-center">
                    {file.length > 1 && (
                    <>
                        <IconButton
                        className={`p-2 bg-gray-200 ${
                            page === 0 ? "invisible" : "visible"
                        }`}
                        onClick={() => onFileChange("prev")}
                        >
                        <ChevronLeft />
                        </IconButton>
                        <span className="px-4">
                        Page {page + 1}/{file.length}
                        </span>
                    </>
                    )}
                    {file.length > 1 && (
                    <IconButton
                        className={`p-2 bg-gray-200 ${
                        file.length === page + 1 ? "invisible" : "visible"
                        }`}
                        onClick={() => onFileChange("next")}
                    >
                        <ChevronRight />
                    </IconButton>
                    )}
                </div>
                )} 
                </Grid>
            </Grid>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

PdfViewer.propTypes = {
  files: PropTypes.array,
};
