import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Formik, Field, FieldArray } from 'formik';
import { useStore } from "app/stores";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import ProjectField from './ProjectField';
import GlobitsTextField from 'app/common/form/GlobitsTextField';
import ModalComponent from 'app/common/ModalComponent';

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

export default observer(function ProjectModal(props) {
  const { t } = useTranslation();
  const { projectStore } = useStore();
  const { staffStore } = useStore();
  const { staffList } = staffStore;

  const classes = useStyles();
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

  const [title, setTitle] = useState("");

  const handleProjectStaff = (props, event, index) => {
    // console.log("props1: ", props.values.projectStaff[index]);
    // console.log("index: ", index);
    // console.log(event.target.value);    
    props.setFieldValue(`projectStaff[${index}]`, staffList[event.target.value]);
    // console.log("props2: ", props.values.projectStaff[index]);
  }

  const form = (
    <Formik
      initialValues={{
        id: '',
        name: '',
        code: '',
        description: '',
        projectStaff: [],
      }}
      onSubmit={async(values, { resetForm }) => {
        if (values.id === undefined) {
          projectStore.createProjectAsync(values).then(() => {
            console.log("Value submit:  ", values);
            handleUpdateTable();
          });
        } else {
          projectStore.editProjectAsync(values).then(() => {
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
            <ProjectField/>
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
              <h5 style={{ marginTop: "10px"}}>Thành viên dự án</h5>
              <div className={classes.divFormStyles1}>
                <FieldArray name="projectStaff">
                  {({ insert, remove, push }) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => push({
                          staff: {},
                        })}
                      >
                        <AddIcon/>Thêm nhân viên
                      </Button>
                      <div className={classes.divFormStyles}>
                        {props.values.projectStaff &&
                          props.values.projectStaff.map((value, index) => (
                            <div key={index} style={{ display: 'flex' }}>
                              <InputLabel>{`Nhân viên ${index + 1}`}</InputLabel>
                              <Field
                                name={`projectStaff.${index}.staff`}
                                as="select"
                                style={{ width: "200px", height: "30px", border: "1px solid", }}
                                onChange={event => handleProjectStaff(props, event, index) }
                              >
                                <option>Chọn nhân viên</option>
                                {staffList.map((item, pos) => {
                                  if (item.id === value.id) {
                                    return (
                                      <option key={pos} value={pos} selected>
                                        {item.firstName + ' ' + item.lastName}
                                      </option>
                                    );
                                  } else {
                                    return (
                                      <option key={pos} value={pos}>
                                        {item.firstName + ' ' + item.lastName}
                                      </option>
                                    );
                                  }
                                })}
                              </Field>                                
                              <div
                                style={{ width: "100px", height: "30px", border: "1px solid", }}
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
    staffStore.pagingStaffAsync(1, 100, "");
  }, []);

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