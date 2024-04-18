import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
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

export default observer(function EthnicsModal(props) {
  const classes = useStyles();

  const { countryStore } = useStore();
  // const { currentEthnics } = countryStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;
  
  const [modalStyle] = useState(getModalStyle);
  const [title, setTitle] = useState("");

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
        countryStore.createEthnicsAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        countryStore.editEthnicsAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      country.resetForm();
      handleCloseModal();
    }
  });

  useEffect(() => { 
    country.resetForm();
    switch(type) {
      case "new":
        setTitle("Add new country");
        break;
      case "edit":
        setTitle("Edit country");
        break;
      default:
        setTitle("Add new country");
    }
    // const { id, name, code, description } = currentEthnics;
    // country.setValues({
    //   id, name, code, description
    // });
  }, [type]);

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
          />
          {country.errors.description && country.touched.description &&
            <p>{ country.errors.description }</p>
          }
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
      
    </div>
  );
    
  return (
    <>
      <Modal
        open={isShowModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
  
})