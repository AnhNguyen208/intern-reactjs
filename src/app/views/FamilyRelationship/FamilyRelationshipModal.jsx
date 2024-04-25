import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    top: "50%",
    left: "50%",
    width: 500,
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  inputStyle: {
    width: 400,
  },
  modalContent: {
    backgroundColor: "#fefefe",
    margin: "10% auto",
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));
export default observer(function FamilyRelationshipModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { familyRelationshipStore } = useStore();
  const { currentFamilyRelationship } = familyRelationshipStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

  const [title, setTitle] = useState("");

  const familyRelationship = useFormik({
    initialValues: {
      id: '',
      name: '',
      code: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the familyRelationship name'),
      code: Yup.string().required('You must fill the familyRelationship code'),
      description: Yup.string().required('You must fill the familyRelationship description'),
    }),
    onSubmit: async (values) => {
      if (values.id === undefined || values.id === '') {
        familyRelationshipStore.createFamilyRelationshipAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        familyRelationshipStore.editFamilyRelationshipAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      familyRelationship.resetForm();
      handleCloseModal();
    }
  });

  useEffect(() => {
    familyRelationship.resetForm();
    switch (type) {
      case "new":
        setTitle("Add new familyRelationship");
        break;
      case "edit":
        setTitle("Edit familyRelationship");
        break;
      default:
        setTitle("Add new familyRelationship");
    }
    const { id, name, code, description } = currentFamilyRelationship;
    familyRelationship.setValues({
      id, name, code, description
    });
  }, [type, currentFamilyRelationship]);

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">{title}</h2>
      <div id="simple-modal-description">
        <form className={classes.modalContent} noValidate autoComplete="off" onSubmit={familyRelationship.handleSubmit}>
          <InputLabel htmlFor="name">{t('name')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="name"
            value={familyRelationship.values.name}
            onChange={familyRelationship.handleChange}
          />
          {familyRelationship.errors.name && familyRelationship.touched.name &&
            <p>{familyRelationship.errors.name}</p>
          }

          <InputLabel htmlFor="code">{t('code')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="code"
            value={familyRelationship.values.code}
            onChange={familyRelationship.handleChange}
          />
          {familyRelationship.errors.code && familyRelationship.touched.code &&
            <p>{familyRelationship.errors.code}</p>
          }

          <InputLabel htmlFor="description">{t('description')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="description"
            value={familyRelationship.values.description}
            onChange={familyRelationship.handleChange}
          />
          {familyRelationship.errors.description && familyRelationship.touched.description &&
            <p>{familyRelationship.errors.description}</p>
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