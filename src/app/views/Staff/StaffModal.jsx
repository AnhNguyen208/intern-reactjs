import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Formik, Field, FieldArray } from 'formik';
import { useStore } from "app/stores";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import StaffField from './StaffField';
import GlobitsSelectInput from 'app/common/form/GlobitsSelectInput';
import GlobitsTextField from 'app/common/form/GlobitsTextField';
import GlobitsDateTimePicker from 'app/common/form/GlobitsDateTimePicker';
import GlobitsAsyncAutocomplete from 'app/common/form/GlobitsAsyncAutocomplete';
import { pagingCountries } from '../Country/CountryService';
import { pagingEthnicities } from '../Ethnics/EthnicsService';
import { pagingReligions } from '../Religion/ReligionService';

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
    width: "100px",
    border: "1px solid",
  },
  cellTable: {
    width: "94.5px",
    height: "30px",
    border: "1px solid",
  },
  select: {
    minWidth: '160px', maxHeight: '40px'
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

export default observer(function StaffModal(props) {
  const { t } = useTranslation();
  const { staffStore } = useStore();
  const { familyRelationshipStore } = useStore();
  const { familyRelationshipList } = familyRelationshipStore;

  const classes = useStyles();
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

  const [title, setTitle] = useState("");
  const genders = [
    { id: 'M', name: 'Nam' },
    { id: 'F', name: 'Nữ' },
    { id: 'U', name: 'Không rõ' },
  ]

  const handleFamilyRelationship = (props, event, index) => {
    // console.log("props1: ", props.values.familyRelationships[index]);
    // console.log("index: ", index);
    // console.log(event.target.value);    
    props.setFieldValue(`familyRelationships[${index}]familyRelationship`, familyRelationshipList[event.target.value]);
    // console.log("props2: ", props.values.familyRelationships[index]);
  }

  const form = (
    <Formik
      initialValues={{
        id: '',
        lastName: '',
        firstName: '',
        displayName: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        permanentResidence: '',
        currentResidence: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        nationality: {},
        ethnics: {},
        religion: {},
        department: {},
        familyRelationships: [],
      }}
      onSubmit={async(values, { resetForm }) => {
        if (values.id === undefined) {
          staffStore.createStaffAsync(values).then(() => {
            console.log("Value submit:  ", values);
            handleUpdateTable();
          });
        } else {
          staffStore.editStaffAsync(values).then(() => {
            console.log("Value submit:  ", values);
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
            <StaffField/>
            <div className={classes.divFormStyles}>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="lastName">Họ</InputLabel>
                  <GlobitsTextField
                    name={"lastName"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="firstName">Tên</InputLabel>
                  <GlobitsTextField
                    name={"firstName"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="displayName">Họ và tên</InputLabel>
                  <GlobitsTextField
                    disabled={{ disabled: true }}
                    name={"lastName"}
                    value={(props.values.lastName ? props.values.lastName : '') + ' ' + (props.values.firstName ? props.values.firstName : '')}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="gender">Giới tính</InputLabel>
                  <GlobitsSelectInput
                    name={"gender"}
                    keyValue={"name"}
                    options={genders}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="birthDate">Ngày sinh</InputLabel>
                  <GlobitsDateTimePicker
                    name={"birthDate"}
                    value={props.values.birthDate}
                    defaultValue={"1997-05-24"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="birthPlace">Nơi sinh</InputLabel>
                  <GlobitsTextField
                    name={"birthPlace"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="permanentResidence">Thường trú</InputLabel>
                  <GlobitsTextField
                    name={"permanentResidence"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="currentResidence">Nơi cơ trú hiện tại</InputLabel>
                  <GlobitsTextField
                    name={"currentResidence"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <GlobitsTextField
                    name={"email"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="phoneNumber">Số điện thoại</InputLabel>
                  <GlobitsTextField
                    name={"phoneNumber"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="idNumber">Số ID</InputLabel>
                  <GlobitsTextField
                    name={"idNumber"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="nationality">Quốc tịch</InputLabel>
                  <GlobitsAsyncAutocomplete
                    name={"nationality"}
                    api={pagingCountries}
                    searchObject={{
                      pageIndex: 1,
                      pageSize: 100,
                    }}
                    label={"Chọn quốc gia"}
                    style={{ minWidth: "150px" }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="ethnics">Dân tộc</InputLabel>
                  <GlobitsAsyncAutocomplete
                    name={"ethnics"}
                    api={pagingEthnicities}
                    searchObject={{
                      pageIndex: 1,
                      pageSize: 100,
                    }}
                    label={"Chọn dân tộc"}
                    style={{ minWidth: "150px" }}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="religion">Tôn giáo</InputLabel>
                  <GlobitsAsyncAutocomplete
                    name={"religion"}
                    api={pagingReligions}
                    searchObject={{
                      pageIndex: 1,
                      pageSize: 100,
                    }}
                    label={"Chọn tôn giáo"}
                    style={{ minWidth: "150px" }}
                  />
                </div>
              </div>
              <h5 style={{ marginTop: "10px"}}>Quan hệ nhân thân</h5>
              <div className={classes.divFormStyles1}>
                <FieldArray name="familyRelationships">
                  {({ insert, remove, push }) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => push({ name: '', email: '' })}
                      >
                        <AddIcon/>Thêm mới nhân thân
                      </Button>
                      <div className={classes.divFormStyles}>
                        <div style={{ display: 'flex' }}>
                          <div className={classes.tableHeader}>Tên</div>
                          <div className={classes.tableHeader}>Công việc</div>
                          <div className={classes.tableHeader}>Ngày sinh</div>
                          <div className={classes.tableHeader}>Quan hệ</div>
                          <div className={classes.tableHeader}>Địa chỉ</div>
                          <div className={classes.tableHeader}>Mô tả</div>
                          <div className={classes.tableHeader}></div>
                        </div>
                        {props.values.familyRelationships &&
                          props.values.familyRelationships.map((familyRelationship, index) => (
                            <div key={index} style={{ display: 'flex' }}>
                              <Field
                                name={`familyRelationships.${index}.fullName`}
                                type="text"
                                className={classes.cellTable}
                              />
                              <Field
                                name={`familyRelationships.${index}.profession`}
                                type="text"
                                className={classes.cellTable}
                              />
                              <Field
                                name={`familyRelationships.${index}.birthDate`}
                                type="date"
                                style={{ width: "97.5px", height: "32px", border: "1px solid", }}
                              />
                              <Field
                                name={`familyRelationships.${index}.familyRelationship`}
                                as="select"
                                style={{ width: "100px", height: "33.6px", border: "1px solid", }}
                                onChange={event => handleFamilyRelationship(props, event, index) }
                                value={props.values.familyRelationships[index].familyRelationship?.name}
                              >
                                <option>Chọn quan hệ</option>
                                {familyRelationshipList.map((item, pos) => {
                                  return (
                                    <option key={pos} value={pos}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>                                
                              <Field
                                name={`familyRelationships.${index}.address`}
                                type="text"
                                className={classes.cellTable}
                              />
                              <Field
                                name={`familyRelationships.${index}.description`}
                                type="text"
                                className={classes.cellTable}
                              />
                              <div
                                style={{ width: "100px", height: "33px", border: "1px solid", }}
                              >
                                <DeleteIcon
                                  onClick={() => remove(index)}
                                />
                              </div>
                            </div>
                            
                          ))}
                      </div>
                    </>
                  )}
                </FieldArray>
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
  )

  useEffect(() => {
    // resetForm();
    switch (type) {
      case "new":
        setTitle("Thêm mới nhân sự");
        break;
      case "edit":
        setTitle("Chỉnh sửa nhân sự");
        break;
      default:
        setTitle("Thêm mới nhân sự");
    }
   
  }, [type]);

  useEffect(() => {
    familyRelationshipStore.pagingFamilyRelationshipAsync(1, 100, "");
  }, []);

  return (
    <>
      <div>
        <Dialog onClose={handleCloseModal} aria-labelledby="customized-dialog-title" open={isShowModal}>
          <DialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
            {title}
          </DialogTitle>
          <DialogContent dividers>
            {form}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

})