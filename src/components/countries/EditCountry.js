import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';

const EditCountry = (props) => {
  const { show, handleClose, dataCountryEdit, handleUpdateTable, handleEdit } = props;
  const country = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the country name'),
      code: Yup.string().required('You must fill the country code'),
      description: Yup.string().required('You must fill the country description'),
    }),
    onSubmit: values => {
      handleEdit(dataCountryEdit.index, values.name, values.code, values.description);
      toast.success("Update Country success");
      handleClose();
      handleUpdateTable();
      country.resetForm();
    }
  });

  useEffect(() => {
    if (dataCountryEdit && dataCountryEdit.country) {
       const { name, code, description } = dataCountryEdit.country;
      country.setValues({
        name, code, description
      });
    }
  }, [dataCountryEdit])

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit a Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={country.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={country.values.name}
                onChange={country.handleChange}
              />
            </Form.Group>
            {country.errors.name && country.touched.name &&
              <p>{ country.errors.name }</p>
            }

            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={ country.values.code }
                onChange={country.handleChange}
              />
            </Form.Group>
            {country.errors.code && country.touched.code &&
              <p>{ country.errors.code }</p>
            }

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={country.values.description}
                onChange={country.handleChange}
              />
            </Form.Group>
            {country.errors.description && country.touched.description &&
              <p>{ country.errors.description }</p>
            }

            <Button variant="primary" type="submit">
              Confirm
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditCountry;