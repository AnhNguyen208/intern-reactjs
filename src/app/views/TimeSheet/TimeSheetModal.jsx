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
import TimeSheetField from './TimeSheetField';
import GlobitsSelectInput from 'app/common/form/GlobitsSelectInput';
import GlobitsTextField from 'app/common/form/GlobitsTextField';
import GlobitsDateTimePicker from 'app/common/form/GlobitsDateTimePicker';
import GlobitsAsyncAutocomplete from 'app/common/form/GlobitsAsyncAutocomplete';
import { pagingProject } from '../Project/ProjectService';
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

export default observer(function TimeSheetModal(props) {
  const { t } = useTranslation();
  const { projectStore, timeSheetStore } = useStore();
  const { currentProject } = projectStore;

  const classes = useStyles();
  const { isShowModal, type, handleCloseModal, handleUpdateTable } = props;

  const [title, setTitle] = useState("");

  const priority = [
    { id: 1, name: 'Thấp' },
    { id: 2, name: 'Trung bình' },
    { id: 3, name: 'Cao' },
    { id: 4, name: 'Cấp bách' }
  ];

  const handleEmployee = (props, event, index) => {
    props.setFieldValue(`details[${index}]employee`, currentProject.projectStaff[event.target.value]);
  }

  const form = (
    <Formik
      initialValues={{
        id: '',
        project: {},
        timeSheetStaff: [],
        workingDate: '',
        startTime: '',
        endTime: '',
        priority: 1,
        description: '',
        details: [],
      }}
      onSubmit={async (values, { resetForm }) => {
        if (values.id === undefined) {
          timeSheetStore.createTimeSheetAsync(values).then(() => {
            console.log("Value submit:  ", values);
            handleUpdateTable();
          });
        } else {
          timeSheetStore.editTimeSheetAsync(values).then(() => {
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
            <TimeSheetField
              project={props.values.project}
            />
            <div className={classes.divFormStyles}>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="project">Dự án</InputLabel>
                  <GlobitsAsyncAutocomplete
                    name={"project"}
                    api={pagingProject}
                    searchObject={{
                      pageIndex: 1,
                      pageSize: 100,
                    }}
                    style={{ minWidth: "200px" }}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="workingDate">Ngày làm việc</InputLabel>
                  <GlobitsDateTimePicker
                    name={"workingDate"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="startTime">Giờ bắt đầu</InputLabel>
                  <GlobitsTextField
                    name={"startTime"}
                    type={"datetime-local"}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="endTime">Giờ kết thúc</InputLabel>
                  <GlobitsTextField
                    name={"endTime"}
                    type={"datetime-local"}
                  />
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.margin}>
                  <InputLabel htmlFor="priority">Độ ưu tiên</InputLabel>
                  <GlobitsSelectInput
                    name={"priority"}
                    keyValue={"id"}
                    options={priority}
                  />
                </div>
                <div className={classes.margin}>
                  <InputLabel htmlFor="description">Mô tả</InputLabel>
                  <GlobitsTextField
                    name={"description"}
                  />
                </div>
              </div>
              <h5 style={{ marginTop: "10px"}}>Chi tiết công việc</h5>
              <div className={classes.divFormStyles1}>
                <FieldArray name="details">
                  {({ insert, remove, push }) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => push({
                          workingItemTitle: '',
                          employee: {},
                        })}
                      >
                        <AddIcon/>Thêm mới
                      </Button>
                      <div className={classes.divFormStyles}>
                        <div style={{ display: 'flex' }}>
                          <div className={classes.tableHeader}>Tiêu đề đầu viện chi tiết</div>
                          <div className={classes.tableHeader}>Nhân viên thực hiện</div>
                          <div className={classes.tableHeader}></div>
                        </div>
                        {props.values.details &&
                          props.values.details.map((value, index) => (
                            <div key={index} style={{ display: 'flex' }}>
                              <Field
                                name={`details.${index}.workingItemTitle`}
                                type="text"
                                className={classes.cellTable}
                              />
                              <select
                                id={`details.${index}.employee`}
                                name={`details.${index}.employee`}
                                style={{ width: "200px", height: "33.6px", border: "1px solid", }}
                                onChange={event => handleEmployee(props, event, index)}
                              >
                                {props.values.timeSheetStaff.map((item, pos) => {
                                  if (value.employee !== null && value.employee.id === item.id) {
                                    return (
                                      <option key={pos} value={pos} selected>
                                        {item.lastName + " " + item.firstName}
                                      </option>
                                    );
                                  } else {
                                    return (
                                      <option key={pos} value={pos}>
                                        {item.name}
                                      </option>
                                    );
                                  }
                                })}
                              </select>
                              <div
                                style={{ width: "200px", height: "33px", border: "1px solid", }}
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