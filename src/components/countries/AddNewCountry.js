import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddNewCountry = (props) => {
  const { show, handleClose, handleUpdateTable, handleAddNew } = props;
  const country = useFormik({
    initialValues: {
      name: '',
      code: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the country name'),
      code: Yup.string().required('You must fill the country code'),
      description: Yup.string().required('You must fill the country description'),
    }),
    onSubmit: values => {
      handleAddNew(values.name, values.code, values.description);
      toast.success("A Country is created succeed!");
      handleClose();
      handleUpdateTable();
      country.resetForm();
    }
  });

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new Country</Modal.Title>
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
                value={country.values.code}
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
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddNewCountry;