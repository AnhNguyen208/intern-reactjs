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
export default observer(function CountryModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { countryStore } = useStore();
  const { currentCountry } = countryStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

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
        countryStore.createCountryAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        countryStore.editCountryAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      country.resetForm();
      handleCloseModal();
    }
  });

  useEffect(() => {
    country.resetForm();
    switch (type) {
      case "new":
        setTitle("Add new country");
        break;
      case "edit":
        setTitle("Edit country");
        break;
      default:
        setTitle("Add new country");
    }
    const { id, name, code, description } = currentCountry;
    country.setValues({
      id, name, code, description
    });
  }, [type, currentCountry]);

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">{title}</h2>
      <div id="simple-modal-description">
        <form className={classes.modalContent} noValidate autoComplete="off" onSubmit={country.handleSubmit}>
          <InputLabel htmlFor="name">{t('country.name')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="name"
            value={country.values.name}
            onChange={country.handleChange}
          />
          {country.errors.name && country.touched.name &&
            <p>{country.errors.name}</p>
          }

          <InputLabel htmlFor="code">{t('country.code')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="code"
            value={country.values.code}
            onChange={country.handleChange}
          />
          {country.errors.code && country.touched.code &&
            <p>{country.errors.code}</p>
          }

          <InputLabel htmlFor="description">{t('country.description')}</InputLabel>
          <TextField
            className={classes.inputStyle}
            variant="outlined"
            size="small"
            id="description"
            value={country.values.description}
            onChange={country.handleChange}
          />
          {country.errors.description && country.touched.description &&
            <p>{country.errors.description}</p>
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