import { useState, useEffect, useRef, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import PropTypes from "prop-types";
import { Box, Grid2 as Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
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
import OpentextDialog from "./OpentextDialog";
import { fetchData } from "lib/fetch";
import BarleaDialog from "./BarleaDialog";

const dummyFile = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
];

export default function PdfViewer({ pdfData }) {
  const [file, setFile] = useState(files || dummyFile);
  const [page, setPage] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [minHeight, setMinHeight] = useState(null);
  const [width, setWidth] = useState(400);
  const pdfDocRef = useRef(null);
  const [uploadDocsumoOpen, setUploadDocsumo] = useState(false);
  const [opentextDialog, setOpentextDialog] = useState(false);
  const [barleaDialog, setBarleaDialog] = useState(false);


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


  const handleDownloadC2PA = async () => {
    console.log(pdfData.url[page],page)
    let pdfUrl = '';
    if (pdfData.rawUrl !== undefined) {
      pdfUrl = pdfData.rawUrl[page];
    } else {
      pdfUrl = pdfData.url[page];
    }
    console.log(pdfUrl)
    // remove leading url
    var pdfStorageSplit = pdfUrl.split('storage/')[1];
    // remove query
    let pdfQuerySplit = '';
    if (pdfStorageSplit == undefined) {
      var lastSegment = getLastSegments(pdfUrl)
      pdfQuerySplit = lastSegment.split('?')[0];
    } else {
      pdfQuerySplit = pdfStorageSplit.split('?')[0];
    }

    let data = {
      uri: pdfQuerySplit,
      pdfTitle: pdfData.name
    }

    const blob = await fetchData(`/api/c2pa`, {
      method: "POST",
      responseType: 'blob',
      data
    });

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${data.pdfTitle || 'Scanbot'}.png`; // Specify the desired file name

    // Append the anchor to the document body
    document.body.appendChild(a);

    // Trigger a click on the anchor to initiate the download
    a.click();

    // Remove the anchor from the document body
    document.body.removeChild(a);
  };

  const getLastSegments = (url) => {
    // Split the URL by "/"
    const urlParts = url.split("/");
    
    // Find the index of the last occurrence of the part to start from
    const lastIndex = urlParts.length - 4; // second last part (the last UUID)
    
    // Join the parts from the lastIndex to the end without leading "/"
    return urlParts.slice(lastIndex).join("/");
}

  const files = useMemo(() => {
    return pdfData?.url || dummyFile
  },[pdfData])
  const pdfBlobs = useMemo(() => {
    return pdfData?.pdfBlobs
  },[pdfData])
  const title = useMemo(() => {
    return pdfData?.name
  },[pdfData])
  const historyId = useMemo(() => {
    return pdfData?.history?.id
  },[pdfData])


  useEffect(() => {
    setFile(files || []);
    if (!files) {
      setPage(0);
    }
  }, [files, pdfData]);

  // ref
  useEffect(() => {
    if (pdfDocRef?.current?.clientHeight) {
      setMinHeight(pdfDocRef?.current?.clientHeight);
    }
    if (pdfDocRef?.current?.clientWidth) {
      setWidth(pdfDocRef?.current?.clientWidth);
    }
  }, [pdfDocRef?.current?.clientHeight, pdfDocRef?.current?.clientWidth]);
  return (<>
    <Card withpadding background='#F8F8FA'>
      <Grid direction="column" container alignItems='center'>
          <Grid display='flex' flexDirection='column' alignItems='center'>
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
                  onClick={() => setOpentextDialog(true)}
                >
                  <Typography ml={1} sx={{fontSize: '14px', fontWeight: 600, color: 'white !important'}}>
                    Opentext
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
                  onClick={handleDownloadC2PA}
                >
                  <Typography ml={1} sx={{fontSize: '14px', fontWeight: 600, color: 'white !important'}}>
                    Download C2PA
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
                  onClick={() => setBarleaDialog(true)}
                >
                  <Typography ml={1} sx={{fontSize: '14px', fontWeight: 600, color: 'white !important'}}>
                    Upload Barlea
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
    <OpentextDialog 
      open={opentextDialog} 
      close={() => setOpentextDialog(false)} 
      pdfBlobs={pdfBlobs}
      pdfUrls={pdfData?.rawUrl || []}
      historyId={historyId}
      pdfTitle={title}
    />
    <BarleaDialog 
      open={barleaDialog} 
      close={() => setBarleaDialog(false)} 
      pdfBlobs={pdfBlobs}
      pdfUrls={pdfData?.rawUrl || []}
      historyId={historyId}
      pdfTitle={title}
    />
  </>);
}

PdfViewer.propTypes = {
  files: PropTypes.array,
  title: PropTypes.string,
  detailHistory: PropTypes.object,
};
