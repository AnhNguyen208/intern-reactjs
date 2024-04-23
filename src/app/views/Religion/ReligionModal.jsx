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

export default observer(function ReligionModal(props) {
  const classes = useStyles();

  const { religionStore } = useStore();
  const { currentReligion } = religionStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;
  
  const [modalStyle] = useState(getModalStyle);
  const [title, setTitle] = useState("");

  const religion = useFormik({
    initialValues: {
      id: '',
      name: '',
      code: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the religion name'),
      code: Yup.string().required('You must fill the religion code'),
      description: Yup.string().required('You must fill the religion description'),
    }),
    onSubmit: async (values) => {
      if (values.id === undefined || values.id === '') {
        religionStore.createReligionAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        religionStore.editReligionAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      religion.resetForm();
      handleCloseModal();
    }
  });

  useEffect(() => { 
    religion.resetForm();
    switch(type) {
      case "new":
        setTitle("Add new religion");
        break;
      case "edit":
        setTitle("Edit religion");
        break;
      default:
        setTitle("Add new religion");
    }
    const { id, name, code, description } = currentReligion;
    religion.setValues({
      id, name, code, description
    });
  }, [type, currentReligion]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">{ title }</h2>
      <div id="simple-modal-description">
        <form className={classes.root} noValidate autoComplete="off" onSubmit={religion.handleSubmit}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            className={classes.inputStyle}
            id="name"
            label="Name"
            value={religion.values.name}
            onChange={religion.handleChange}
          />
          {religion.errors.name && religion.touched.name &&
            <p>{ religion.errors.name }</p>
          }

          <InputLabel htmlFor="code">Code</InputLabel>
          <Input
            className={classes.inputStyle}
            id="code"
            label="Code"
            value={religion.values.code}
            onChange={religion.handleChange}
          />
          {religion.errors.code && religion.touched.code &&
            <p>{ religion.errors.code }</p>
          }

          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            className={classes.inputStyle}
            id="description"
            label="Description"
            value={religion.values.description}
            onChange={religion.handleChange}
          />
          {religion.errors.description && religion.touched.description &&
            <p>{ religion.errors.description }</p>
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