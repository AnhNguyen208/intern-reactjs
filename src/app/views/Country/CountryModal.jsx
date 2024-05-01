import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import {Formik } from 'formik';
import * as Yup from 'yup';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import ModalComponent from 'app/common/ModalComponent';
import GlobitsTextField from 'app/common/form/GlobitsTextField';
import CountryField from './CountryField';

const useStyles = makeStyles((theme) => ({
  divFormStyles: {
    display: 'flex',
    flexDirection: 'column',
    margin: "5px",
    '& label': {
      marginTop: '10px',
      marginBottom: "5px",
    },
  },
  divFormStyles1: {
    marginTop: "15px",
    marginLeft: '5px',
    '& button': {
      background: 'rgb(1,192,200)',
      color: 'rgb(255, 255, 255)',
    },
  },
  margin: {
    marginLeft: '10px',
    marginRight: '10px'
  },
  tableHeader: {
    padding: "10px",
    width: "200px",
    border: "1px solid",
  },
  cellTable: {
    width: "194.5px",
    height: "30px",
    border: "1px solid",
  },
  select: {
    minWidth: '160px', maxHeight: '40px'
  },
}));

export default observer(function CountryModal(props) {
  const { countryStore } = useStore();
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;
  
  const classes = useStyles();
  const [title, setTitle] = useState("");

  useEffect(() => {
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
  }, [type]);

  const form = (
    <Formik
      initialValues={{
        id: '',
        name: '',
        code: '',
        description: '',
      }}
      validationSchema= {Yup.object({
        name: Yup.string().required('You must fill the country name'),
        code: Yup.string().required('You must fill the country code'),
        description: Yup.string().required('You must fill the country description'),
      })}
      onSubmit={async (values, { resetForm }) => {
        if (values.id === undefined) {
          countryStore.createCountryAsync(values).then(() => {
            handleUpdateTable();
          });
        } else {
          countryStore.editCountryAsync(values).then(() => {
            handleUpdateTable();
          });
        }
        resetForm();
        handleCloseModal();
      }}
    >
      {props => (
        <>
          <form noValidate autoComplete="off" onSubmit={props.handleSubmit}>
            <CountryField />
            <div className={classes.divFormStyles}>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="name">Tên</InputLabel>
                  <GlobitsTextField
                    name={"name"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="code">Mã</InputLabel>
                  <GlobitsTextField
                    name={"code"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="description">Mô tả</InputLabel>
                  <GlobitsTextField
                    name={"description"}
                  />
                </div>
              </div>
            </div>
            <div className={classes.divFormStyles1}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Xác nhận
              </Button>
            </div>
          </form>
        </>
      )}
    </Formik>
  );

  return (
    <>
      <ModalComponent
        handleCloseModal={handleCloseModal}
        isShowModal={isShowModal}
        title={title}
        form={form}
      />
    </>
  );

})