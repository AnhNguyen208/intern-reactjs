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
export default observer(function EthnicsModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { ethnicsStore } = useStore();
  const { currentEthnics } = ethnicsStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

  const [title, setTitle] = useState("");

  const ethnics = useFormik({
    initialValues: {
      id: '',
      name: '',
      code: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the ethnics name'),
      code: Yup.string().required('You must fill the ethnics code'),
      description: Yup.string().required('You must fill the ethnics description'),
    }),
    onSubmit: async (values) => {
      if (values.id === undefined || values.id === '') {
        ethnicsStore.createEthnicsAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        ethnicsStore.editEthnicsAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      ethnics.resetForm();
      handleCloseModal();
    }
  });

  useEffect(() => {
    ethnics.resetForm();
    switch (type) {
      case "new":
        setTitle("Add new ethnics");
        break;
      case "edit":
        setTitle("Edit ethnics");
        break;
      default:
        setTitle("Add new ethnics");
    }
    const { id, name, code, description } = currentEthnics;
    ethnics.setValues({
      id, name, code, description
    });
  }, [type, currentEthnics]);

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">{title}</h2>
      <div id="simple-modal-description">
        <form className={classes.modalContent} noValidate autoComplete="off" onSubmit={ethnics.handleSubmit}>
          <InputLabel htmlFor="name">{t('ethnics.name')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="name"
            value={ethnics.values.name}
            onChange={ethnics.handleChange}
          />
          {ethnics.errors.name && ethnics.touched.name &&
            <p>{ethnics.errors.name}</p>
          }

          <InputLabel htmlFor="code">{t('ethnics.code')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="code"
            value={ethnics.values.code}
            onChange={ethnics.handleChange}
          />
          {ethnics.errors.code && ethnics.touched.code &&
            <p>{ethnics.errors.code}</p>
          }

          <InputLabel htmlFor="description">{t('ethnics.description')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="description"
            value={ethnics.values.description}
            onChange={ethnics.handleChange}
          />
          {ethnics.errors.description && ethnics.touched.description &&
            <p>{ethnics.errors.description}</p>
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