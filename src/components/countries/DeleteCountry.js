import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

const DeleteCountry = (props) => {
  const { show, handleClose, dataCountryDelete, handleUpdateTable, handleDelete } = props;

  const handleDeleteCountry = async () => {
    handleDelete(dataCountryDelete.index);
    handleClose(true);
    toast.success("Delete Country success");
    handleUpdateTable();
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete a Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            This action can't be undone!
            Do you want to delete this Country? 
            {dataCountryDelete && dataCountryDelete.country && dataCountryDelete.country.name ? <b>{dataCountryDelete.country.name}</b>  : ""}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDeleteCountry()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteCountry;