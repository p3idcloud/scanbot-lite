/*
 * Copyright (C) 2016-2024 P3iD Technologies Inc. (http://p3idtech.com)
 * license[at]p3idtech[dot]com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "lib/fetch"; 
import { processPdf } from "lib/helpers";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

/**
 * BarleaDialog
 * @param close function to close modal
 * @param pdfUrls list of pdf urls
 * @param detailHistory detail of file scanned
 * @param formFields a list of object [formField] specifying fields to be rendered, example format below
 * @param formTitle title of the form
 * @param apiRoute the route for the api post request, starting after /api with a trailing '/'. ex: /workflow-plugins/test
 * @param accountSettingConfigured list of account policies that have not yet been filled
 * @returns {JSX.Element}
 * @constructor
 *
 * formField:
 * {
 *     id:              id of default policy
 *     policyName:      labelName of policy
 *     policyDesc:      description of policy
 *     name:            name of field
 *     type:            yup validation type - 'email', 'number', 'string', 'password', 'boolean', defaults to 'string'
 *     inputType:       'select', 'text' or 'checkbox' as follows on https://www.w3schools.com/html/html_form_input_types.asp
 *     placeHolder:     placeholder for inputType 'input'
 *     selectOptions:   list of select values for inputType 'select' in the form of { label, value }
 * }
 */
const BarleaDialog = ({open, close, pdfUrls, pdfTitle, historyId}) => {
    const [loading, setLoading] = useState();
    const handleClose = () => {
        close();
    };

    const handleSubmit = async (e) => {
        setLoading(true);

        // Fetch PDF files as blobs
        // const pdfBlobList = await Promise.all(pdfUrls.map(url => {
        //     return fetch(url)
        //         .then((res) => res.blob())
        //         .then((data) => data)
        //         .catch(err => {
        //             toast.error("Failed to merge documents");
        //             return null;
        //         });
        // }));

        try {
            // Process the PDF to ensure metadata is cleaned
            // const processedPdfBlob = await processPdf(pdfBlobList);

            // Prepare form data for uploading
            // const formData = new FormData();
            // formFields.forEach(field => {
            //     formData.append(field.name, e[field.name]);
            // });
            // formData.append('pdfBlob', processedPdfBlob, 'upload.pdf');
            // formData.append('historyId', historyId);

            // Send the form data to the API
            const data = {
                pdfUrls: pdfUrls,
                pdfTitle: pdfTitle,
                historyId: historyId,
            };

              
            fetchData(`api/barlea/upload`, {
                method: "POST",
                data
            })
                .then(res => {
                    setTimeout(close, 500);
                    toast.success(res.successMessage || 'Success in upload');
                })
                .catch(err => {
                    toast.error("Failed to send pdf");
                })
                .finally(() => setLoading(false));

        } catch (error) {
            toast.error("Failed to process PDF for upload");
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            sx={{minWidth:'50%'}}
        >
            <DialogTitle id="barlea-dialog-title">
                <Typography sx={{fontWeight: 'bold'}}>
                    {pdfTitle}
                </Typography>
            </DialogTitle>
            <DialogContent>
                Upload this PDF to the Barlea plugin
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    onClick={handleSubmit}
                    loading={loading}
                    variant="contained"
                >
                    Upload
                </LoadingButton>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BarleaDialog;
