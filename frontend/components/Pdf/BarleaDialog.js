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

import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap";
import { Form, Formik } from "formik";
import Fade from "react-reveal/Fade";
import { fetchData } from "@/lib/fetch";
import { capitalize, processPdf } from "@/lib/helpers";

import style from "scss/scanners.module.scss";

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
const BarleaDialog = ({close, pdfUrls, detailHistory, formFields, formTitle, apiRoute, accountSettingConfigured}) => {
    const [loading, setLoading] = useState();

    const validationSchemaShape = {};
    const initialValues = {};
    formFields = formFields.filter(field => (!field.id && !field.policyName && !field.policyDesc))
    formFields.forEach(field => {
        switch (field.type) {
            case 'email':
                initialValues[field.name] = "";
                validationSchemaShape[field.name] = Yup.string().email().required("required");
                break;
            case 'boolean':
                initialValues[field.name] = false;
                validationSchemaShape[field.name] = Yup.boolean().required("required");
                break;
            case 'number':
                initialValues[field.name] = null;
                validationSchemaShape[field.name] = Yup.number().required("required");
                break;
            case 'string':
            case 'password':
            default:
                initialValues[field.name] = "";
                validationSchemaShape[field.name] = Yup.string().required("required");
                break;
        }
    })
    const validationSchema = Yup.object().shape(validationSchemaShape);

    const handleSubmit = async (e) => {
        setLoading(true);

        // Fetch PDF files as blobs
        const pdfBlobList = await Promise.all(pdfUrls.map(url => {
            return fetch(url)
                .then((res) => res.blob())
                .then((data) => data)
                .catch(err => {
                    toast.error("Failed to merge documents");
                    return null;
                });
        }));

        try {
            // Process the PDF to ensure metadata is cleaned
            const processedPdfBlob = await processPdf(pdfBlobList);

            // Prepare form data for uploading
            const formData = new FormData();
            formFields.forEach(field => {
                formData.append(field.name, e[field.name]);
            });
            formData.append('pdfBlob', processedPdfBlob, 'upload.pdf');
            formData.append('detailHistory', JSON.stringify(detailHistory));

            // Send the form data to the API
            fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}api${apiRoute}`, {
                method: "POST",
                data: formData
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
        <>
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <h5 className={style["h5-bold"]}>
                                    {formTitle}
                                </h5>
                            </CardHeader>
                            <CardBody>
                                {(accountSettingConfigured ?? []).length !== 0 ? (
                                    <Row>
                                        <Col>
                                            <h3 className={style["h5-bold"]}>
                                                Policy incorrectly set up
                                            </h3>
                                            <h3 className={style["h6-bold"]}>
                                                Navigate to Settings -{'>'} Account Setting and fill in the following:
                                            </h3>
                                            <ul>
                                                {accountSettingConfigured.map(incorrectSetting => (
                                                    <li key={incorrectSetting}>{incorrectSetting}</li>
                                                ))}
                                            </ul>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={(e) => handleSubmit(e)}
                                    >
                                        {({
                                              values,
                                              errors,
                                              touched,
                                              handleChange,
                                              handleBlur,
                                              isSubmitting,
                                          }) => (
                                            <Form className="theme-form">
                                                <Row>
                                                    {formFields.map((field, index) => (
                                                        <Col sm="12" key={index}>
                                                            <FormGroup>
                                                                {field.inputType !== 'checkbox' && (
                                                                    <Label className="col-form-label pt-0">
                                                                        {capitalize(field.name)}
                                                                    </Label>
                                                                )}
                                                                <Input
                                                                    type={field.inputType ?? 'text'}
                                                                    className={field.inputType === 'checkbox' ? "form-check-input ml-2" : "form-control"}
                                                                    id={field.name}
                                                                    invalid={Boolean(
                                                                        touched[field.name] && errors[field.name]
                                                                    )}
                                                                    style={field.inputType === 'checkbox' ? {
                                                                        width: 20,
                                                                        height: 20
                                                                    } : {}}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values[field.name]}
                                                                    placeholder={field.placeHolder}
                                                                >
                                                                    {field.inputType === 'select' ? (
                                                                        <>
                                                                            <option></option>
                                                                            {(field.selectOptions ?? []).map(option => (
                                                                                <option label={option.label} key={option.value}>
                                                                                    {option.value}
                                                                                </option>
                                                                            ))}
                                                                        </>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </Input>
                                                                {field.inputType === 'checkbox' && (
                                                                    <Label className="form-check-label ml-5 my-1">
                                                                        {capitalize(field.name)}
                                                                    </Label>
                                                                )}
                                                                <FormFeedback invalid>
                                                                    <Fade bottom duration={200} collapse>
                                                                        {errors[field.name]}
                                                                    </Fade>
                                                                </FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    ))}
                                                    <Col xl="12">
                                                        <div className={style["action-create"]}>
                                                            <Button
                                                                onClick={close}
                                                                color="primary"
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                disabled={Boolean(loading && errors)}
                                                                color="primary"
                                                            >
                                                                {loading && errors && (
                                                                    <Spinner size="sm" color="light"/>
                                                                )}{" "}
                                                                Upload
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        )}
                                    </Formik>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default BarleaDialog;
