import Button from 'components/Button';
import Modal from 'components/Modal';
import InputField from 'components/InputField';
import * as Yup from "yup";
import { Box, Typography, Divider, FormControl } from '@mui/material';
import { Formik, Form } from 'formik';
import { useMemo } from 'react';
import Select from 'components/Select';

const types = [
  {
    label: 'String',
    value: 'string',
    description: 'Only selected string value is needed to construct action'
  },
  {
    label: 'Integer',
    value: 'integer',
    description: 'Only an integer value is needed to construct action'
  }
]

const validationSchema = Yup.object().shape({
  label: Yup.string().required("Required"),
  value: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  type: Yup.string().required("Required")
});

const ScannerConfigValueForm = ({ open, close, ...rest }) => {
  const { index, label, value, type, description, newValue, push, replace } = rest;

  const initialValues = useMemo(() => {
    return {
      label: !newValue ? label : "",
      value: !newValue ? value : "",
      description: !newValue ? description : "",
      type: !newValue ? type : ""
    };
  }, [label, value, description, type]);

  const handleSubmit = (e) => {
    if (newValue) {
      push(e);
    } else {
      replace(index, e);
    }
    close();
    return true;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, submitForm, resetForm }) => {
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
                  onClick={() => {
                    submitForm().then(() => resetForm());
                  }}
                  variant="contained"
                  autoWidth
                  size="medium"
                >
                  {newValue ? 'Save' : 'Update'}
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
              <Form style={{ width: '100%' }}>
                <Typography fontWeight={600} fontSize="20px" lineHeight='28px'>
                  {newValue ? 'Create' : 'Update'} Value
                </Typography>
                <Divider sx={{ my: 4 }} />
                <FormControl sx={{ my: 2 }} fullWidth>
                  <InputField
                    label="Label"
                    fullWidth
                    id='label'
                    value={values.label}
                    aria-invalid={Boolean(touched.label && errors.label)}
                    error={Boolean(errors.label)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Label"
                  />
                  <Typography sx={{ color: "red.main" }}>{errors.label}</Typography>
                </FormControl>
                <FormControl sx={{ my: 2 }} fullWidth>
                  <InputField
                    label="Value"
                    fullWidth
                    id='value'
                    value={values.value}
                    aria-invalid={Boolean(touched.value && errors.value)}
                    error={Boolean(errors.value)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Value"
                  />
                  <Typography sx={{ color: "red.main" }}>{errors.value}</Typography>
                </FormControl>
                <FormControl sx={{ my: 2 }} fullWidth>
                  <InputField
                    label="Description"
                    id="description"
                    error={Boolean(errors.description)}
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
                  <Typography sx={{ color: "red.main" }}>{errors.value}</Typography>
                </FormControl>
                <FormControl sx={{ my: 2 }} fullWidth>
                  <Select
                    label="Input type"
                    error={Boolean(
                      touched.type && errors.type
                    )}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.type}
                    lists={types}
                    name="type"
                    aria-invalid={Boolean(
                      touched.type && errors.type
                    )}
                  />
                  <Typography sx={{ color: "red.main" }}>{errors.type}</Typography>
                </FormControl>
              </Form>
            </Box>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default ScannerConfigValueForm;
