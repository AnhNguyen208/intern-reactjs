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
export default observer(function ReligionModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { religionStore } = useStore();
  const { currentReligion } = religionStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

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
    switch (type) {
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
    <div className={classes.paper}>
      <h2 id="simple-modal-title">{title}</h2>
      <div id="simple-modal-description">
        <form className={classes.modalContent} noValidate autoComplete="off" onSubmit={religion.handleSubmit}>
          <InputLabel htmlFor="name">{t('religion.name')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="name"
            value={religion.values.name}
            onChange={religion.handleChange}
          />
          {religion.errors.name && religion.touched.name &&
            <p>{religion.errors.name}</p>
          }

          <InputLabel htmlFor="code">{t('religion.code')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="code"
            value={religion.values.code}
            onChange={religion.handleChange}
          />
          {religion.errors.code && religion.touched.code &&
            <p>{religion.errors.code}</p>
          }

          <InputLabel htmlFor="description">{t('religion.description')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="description"
            value={religion.values.description}
            onChange={religion.handleChange}
          />
          {religion.errors.description && religion.touched.description &&
            <p>{religion.errors.description}</p>
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