import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from "yup";
import { Box, Typography, FormControl, Divider } from '@mui/material';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { toast } from "react-toastify";
import { fetchData } from 'lib/fetch';
import { mutate } from 'swr';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  model: Yup.string().required("required")
});

const EditDetailScannerForm = ({ open, close, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const { id, name, model, description, pageIndex, rowsPerPage } = rest;

  const initialValues = {
    name: name ?? "",
    model: model ?? "",
    description: description ?? ""
  };

  const handleSubmit = (e) => {
    setLoading(true);
    const data = {
        name: e.name,
        model: e.model,
        description: e.description
    }
    fetchData(`${process.env.BACKEND_URL}api/scanners/${id ?? ''}`, {
      method: "PATCH",
      data,
    })
      .then((res) => {
        mutate(`${process.env.BACKEND_URL}api/scanners?page=${pageIndex}&limit=${rowsPerPage}&sort=-lastActive`)
          .then(() => {
            setLoading(false);
            toast.success("Successfully updated scanner");
            close();
          }, () => {
            setLoading(false);
            toast.error("Failed to update scanner");
          });
      })
  };
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, submitForm }) => {
        return (
          <Modal
            open={open}
            customBodyFooter={
              <>
                <Button
                  onClick={() => {
                    close();
                  }}
                  variant="outlined"
                  color="primaryBlack"
                  autoWidth
                  size="medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitForm}
                  variant="contained"
                  autoWidth
                  size="medium"
                  loading={loading}
                >
                  Update
                </Button>
              </>
            }
          >
            <Box
              display='flex'
              padding={4}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width={1}
            >
              <Form style={{width: '100%'}}>
                <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                  Edit Scanner Detail
                </Typography>
                <Divider sx={{my: 4}}/>
                <FormControl sx={{my: 2}} fullWidth>
                  <InputField
                    label="Name"
                    fullWidth
                    id='name'
                    defaultValue={initialValues.name}
                    aria-invalid={Boolean(touched.name && errors.name)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.name)}
                    placeholder="Name"
                  />
                  <Typography sx={{color: "red.main"}}>{errors.name}</Typography>
                </FormControl>
                <FormControl sx={{my: 2}} fullWidth>
                  <InputField
                    label="Model"
                    fullWidth
                    id='model'
                    defaultValue={initialValues.model}
                    aria-invalid={Boolean(touched.model && errors.model)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.model)}
                    placeholder="Model"
                  />
                      <Typography sx={{color: "red.main"}}>{errors.model}</Typography>
                </FormControl>
                <FormControl sx={{my: 2}} fullWidth>
                  <InputField
                    label="Description"
                    variant="outlined"
                    id="description"
                    fullWidth
                    multiline
                    minRows={3}
                    aria-invalid={Boolean(
                        touched.description && errors.description
                      )}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    placeholder="Description"
                  />
                </FormControl>
              </Form>
            </Box>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default EditDetailScannerForm;
