import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import { useTranslation } from "react-i18next";
import SelectParentModal from './SelectParentModal';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    background: 'rgb(1,192,200)',
    '& h6': {
      color: 'rgb(255, 255, 255) !important',
    }
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'rgb(255, 255, 255)',
  },
});

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
  },
}))(MuiDialogContent);

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

  const department = useFormik({
    initialValues: {
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
    },
    validationSchema: Yup.object({
      name: Yup.string().required('You must fill the department name'),
      code: Yup.string().required('You must fill the department code'),
      description: Yup.string().required('You must fill the department description'),
    }),
    onSubmit: async (values) => {
      if (values.id === undefined) {
        departmentStore.createDepartmentAsync(values).then(() => {
          handleUpdateTable();
        });
      } else {
        departmentStore.editDepartmentAsync(values).then(() => {
          handleUpdateTable();
        });
      }
      department.resetForm();
      handleCloseModal();
    }
  });

  useEffect(() => {
    department.resetForm();
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
    const {
      id,
      parent,
      name,
      code,
      description,
      func,
      industryBlock,
      foundedNumber,
      foundedDate,
      displayOrder
    } = currentDepartment;

    department.setValues({
      id,
      parent,
      name,
      code,
      description,
      func,
      industryBlock,
      foundedNumber,
      foundedDate,
      displayOrder
    });
  }, [type, currentDepartment]);

  return (
    <>
      <div>
        <Dialog onClose={handleCloseModal} aria-labelledby="customized-dialog-title" open={isShowModal}>
          <DialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
            {title}
          </DialogTitle>
          <DialogContent dividers>
            <form noValidate autoComplete="off" onSubmit={department.handleSubmit}>
              <div className={classes.divFormStyles}>
                <div>
                  <InputLabel htmlFor="parent">{t('department.parent')}</InputLabel>
                  <TextField
                    style={{ width: '420px' }}
                    variant="outlined"
                    size="small"
                    id="parent"
                    value={department.values.parent ? department.values.parent.name : ""}
                    onChange={department.handleChange}
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
                    department={department}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <InputLabel htmlFor="name">{t('department.name')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="name"
                      value={department.values.name}
                      onChange={department.handleChange}
                    />
                    {department.errors.name && department.touched.name &&
                      <p>{department.errors.name}</p>
                    }
                  </div>
                  <div>
                    <InputLabel htmlFor="code">{t('department.code')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="code"
                      value={department.values.code}
                      onChange={department.handleChange}
                    />
                    {department.errors.code && department.touched.code &&
                      <p>{department.errors.code}</p>
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <InputLabel htmlFor="description">{t('department.description')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="description"
                      value={department.values.description}
                      onChange={department.handleChange}
                    />
                    {department.errors.description && department.touched.description &&
                      <p>{department.errors.description}</p>
                    }
                  </div>
                  <div>
                    <InputLabel htmlFor="func">{t('department.function')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="func"
                      value={department.values.func}
                      onChange={department.handleChange}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <InputLabel htmlFor="industryBlock">{t('department.industryBlock')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="industryBlock"
                      value={department.values.industryBlock}
                      onChange={department.handleChange}
                    />
                  </div>
                  <div>
                    <InputLabel htmlFor="foundedNumber">{t('department.foundedNumber')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="foundedNumber"
                      value={department.values.foundedNumber}
                      onChange={department.handleChange}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <InputLabel htmlFor="foundedDate">{t('department.foundedDate')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="foundedDate"
                      type="date"
                      defaultValue="2017-05-24"
                      value={department.values.foundedDate}
                      onChange={department.handleChange}
                    />
                  </div>
                  <div>
                    <InputLabel htmlFor="displayOrder">{t('department.displayOrder')}</InputLabel>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="displayOrder"
                      value={department.values.displayOrder}
                      onChange={department.handleChange}
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
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

})