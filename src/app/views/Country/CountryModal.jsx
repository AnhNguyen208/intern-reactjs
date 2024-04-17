import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { observer } from "mobx-react";
import { useStore } from "app/stores";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
        margin: theme.spacing(1),
    },
  },
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  inputStyle: {
    width: 400,  
  },
}));

export default observer(function CountryModal(props) {
  const { countryStore } = useStore();
  const { currentCountry } = countryStore;
  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const { isShowModal, type, handleClose, handleUpdateTable } = props;
  
  const [title, setTitle] = useState("");
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [disable, setDisable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const country = useFormik({
    initialValues: {
      id: '',
      name: '',
      code: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the country name'),
      code: Yup.string().required('You must fill the country code'),
      description: Yup.string().required('You must fill the country description'),
    }),
    onSubmit: async (values) => {
      if (values.id === undefined) {
        countryStore.createCountryAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        countryStore.editCountryAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      country.resetForm();
      handleClose();
    }
  });

  function handleEditBtn() {
    setDisable(false);
    setShowEditBtn(false);
    setShowDeleteBtn(false);
    setShowSubmitBtn(true);
  }

  function handleDeleteBtn() {
    setOpenDialog(true)
  }

  function handleCloseDialog () {
    setOpenDialog(false);
  };

  async function handleAgreeBtn() {
    countryStore.deleteCountryAsync(country.values.id).then(() => {
      handleUpdateTable();
    });
    country.resetForm();
    handleUpdateTable();
    setOpenDialog(false);
    handleClose();
  }
  
  useEffect(() => { 
    country.resetForm();
    switch(type) {
      case "new":
        setTitle("Add new country");
        setShowEditBtn(false);
        setShowDeleteBtn(false);
        setShowSubmitBtn(true);
        setDisable(false);
        break;
      case "detail":
        setTitle("Detail country");
        setShowEditBtn(true);
        setShowDeleteBtn(true);
        setShowSubmitBtn(false);
        setDisable(true);
        break;
      default:
        setTitle("Add new country");
        setShowEditBtn(false);
        setShowDeleteBtn(false);
        setShowSubmitBtn(true);
        setDisable(false);
    }
    const { id, name, code, description } = currentCountry;
    country.setValues({
      id, name, code, description
    });
  }, [type, currentCountry]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">{ title }</h2>
      <div id="simple-modal-description">
        <form className={classes.root} noValidate autoComplete="off" onSubmit={country.handleSubmit}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            className={classes.inputStyle}
            id="name"
            label="Name"
            value={country.values.name}
            onChange={country.handleChange}
            disabled={disable}
          />
          {country.errors.name && country.touched.name &&
            <p>{ country.errors.name }</p>
          }

          <InputLabel htmlFor="code">Code</InputLabel>
          <Input
            className={classes.inputStyle}
            id="code"
            label="Code"
            value={country.values.code}
            onChange={country.handleChange}
            disabled={disable}
          />
          {country.errors.code && country.touched.code &&
            <p>{ country.errors.code }</p>
          }

          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            className={classes.inputStyle}
            id="description"
            label="Description"
            value={country.values.description}
            onChange={country.handleChange}
            disabled={disable}
          />
          {country.errors.description && country.touched.description &&
            <p>{ country.errors.description }</p>
          }

          {showEditBtn && 
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditBtn}
            >
                Edit
            </Button>
          }
          {showDeleteBtn &&  
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteBtn}
            >
              Delete
            </Button>
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Delete country"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This action can't be undone!
                  Do you want to delete this Country?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Disagree
                </Button>
                <Button onClick={handleAgreeBtn} color="primary" autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </>  
            
          }
          {showSubmitBtn &&
            <Button
            variant="contained"
            color="primary"
            type="submit"
            >
              Submit
            </Button>
          }
        </form>
      </div>
      
    </div>
  );
    
  return (
    <>
      <Modal
        open={isShowModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
  
})