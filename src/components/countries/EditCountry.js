import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';

const EditCountry = (props) => {
  const { show, handleClose, dataCountryEdit, handleUpdateTable, handleEdit } = props;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const handleEditCountry = async () => {
    handleEdit(dataCountryEdit.index, name, code, description);
    handleUpdateTable();
    setName("");
    setCode("");
    setDescription("");
    handleClose();
    toast.success("Update Country success");
  }

  useEffect(() => {
    if (show) {
      setName(dataCountryEdit.country.name);
      setCode(dataCountryEdit.country.code);
      setDescription(dataCountryEdit.country.description);
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEditCountry()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditCountry;