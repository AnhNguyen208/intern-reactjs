import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import { useTranslation } from "react-i18next";
import SelectParentModal from './SelectParentModal';
import GlobitsTextField from 'app/common/form/GlobitsTextField';
import ModalComponent from 'app/common/ModalComponent';
import DepartmentField from "./DepartmentField";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  divFormStyles: {
    display: 'flex',
    flexDirection: 'column',
    margin: "5px",
    '& button': {
      marginLeft: "-75px",
      background: 'rgb(1,192,200)',
      color: 'rgb(255, 255, 255)',
    },
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
}));

export default observer(function DepartmentModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { departmentStore } = useStore();
  const { departmentList, currentDepartment } = departmentStore;
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

  const [isShowSelectParentModal, setIsShowSelectParentModal] = useState(false);
  const [title, setTitle] = useState("");

  function handleSelectBtn() {
    setIsShowSelectParentModal(true);
  }

  function handleCloseSelectParentModal() {
    setIsShowSelectParentModal(false);
  }

  const form = (
    <Formik
      initialValues={{
        id: '',
        parent: {},
        name: '',
        code: '',
        description: '',
        func: '',
        industryBlock: '',
        foundedNumber: '',
        foundedDate: '',
        displayOrder: '',
      }}
      validationSchema={Yup.object({
        name: Yup.string().required('You must fill the country name'),
        code: Yup.string().required('You must fill the country code'),
        description: Yup.string().required('You must fill the country description'),
      })}
      onSubmit={async (values, { resetForm }) => {
        if (values.id === undefined) {
          departmentStore.createDepartmentAsync(values).then(() => {
            handleUpdateTable();
          });
        } else {
          departmentStore.editDepartmentAsync(values).then(() => {
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
            <DepartmentField />
            <div className={classes.divFormStyles}>
              <div>
                <InputLabel htmlFor="parent">{t('department.parent')}</InputLabel>
                <TextField
                  disabled
                  style={{ width: '420px' }}
                  name={"parent"}
                  variant="outlined"
                  size="small"
                  value={props.values.parent?.name}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSelectBtn}
                >
                  Lựa chọn
                </Button>
                <SelectParentModal
                  isShowSelectParentModal={isShowSelectParentModal}
                  handleCloseSelectParentModal={handleCloseSelectParentModal}
                  department={props}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <InputLabel htmlFor="name">{t('department.name')}</InputLabel>
                  <GlobitsTextField
                    name={"name"}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="code">{t('department.code')}</InputLabel>
                  <GlobitsTextField
                    name={"code"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <InputLabel htmlFor="description">{t('department.description')}</InputLabel>
                  <GlobitsTextField
                    name={"description"}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="func">{t('department.function')}</InputLabel>
                  <GlobitsTextField
                    name={"func"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <InputLabel htmlFor="industryBlock">{t('department.industryBlock')}</InputLabel>
                  <GlobitsTextField
                    name={"industryBlock"}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="foundedNumber">{t('department.foundedNumber')}</InputLabel>
                  <GlobitsTextField
                    name={"foundedNumber"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <InputLabel htmlFor="foundedDate">{t('department.foundedDate')}</InputLabel>
                  <GlobitsTextField
                    name={"foundedDate"}
                    type={"date"}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="displayOrder">{t('department.displayOrder')}</InputLabel>
                  <GlobitsTextField
                    name={"displayOrder"}
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

  useEffect(() => {
    switch (type) {
      case "new":
        setTitle("Thêm mới phòng ban");
        break;
      case "edit":
        setTitle("Chỉnh sửa phòng ban");
        break;
      default:
        setTitle("Thêm mới phòng ban");
    }
  }, [type]);

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