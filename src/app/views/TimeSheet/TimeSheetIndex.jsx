import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { useFormik } from 'formik';
import TimeSheetModal from './TimeSheetModal';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GlobitsConfirmationDialog from "../../common/GlobitsConfirmationDialog";
import GlobitsPagination from "../../common/GlobitsPagination";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "25% 70%",
    gridGap: "10px",
  },
  contentIndex: {
    padding: "10px",
    '& h5': {
      color: 'rgb(255, 255, 255) !important',
      paddingTop: "5px",
    }
  },
  headerStyle: {
    backgroundColor: "rgb(1, 192, 200)",
    position: "sticky",
    "& th": {
      color: "#fff"
    }
  },
}));

export default observer(function TimeSheetIndex() {
  const { timeSheetStore, projectStore } = useStore();
  const { timeSheetList, currentTimeSheet } = timeSheetStore;
  const { projectList, currentProject } = projectStore;

  const classes = useStyles();
  const [isShowModal, setIsShowModal] = useState(false);
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);

  const search = useFormik({
    initialValues: {
      keyword: "",
    },
    onSubmit: (values) => {
      timeSheetStore.pagingTimeSheetAsync(page, rowsPerPage, values.keyword);
      setPage(1);
    }
  });

  function handleChangePage(event, newPage) {
    setPage(newPage);
  };

  function handleCloseModal() {
    setIsShowModal(false);
  }

  function handleAddBtn() {
    timeSheetStore.clearCurrentTimeSheet();
    setIsShowModal(true);
    setType("new");
  }

  function handleEditBtn({ id }) {
    timeSheetStore.getTimeSheetAsync(id);
    setIsShowModal(true);
    setType("edit");
  }

  function handleDeleteBtn({ id }) {
    timeSheetStore.getTimeSheetAsync(id);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleAgreeBtn() {
    timeSheetStore.deleteTimeSheetAsync(currentTimeSheet.id).then(() => {
      handleUpdateTable();
    });
    setOpenDialog(false);
  }

  function handleUpdateTable() {
    page === 1 ? timeSheetStore.pagingTimeSheetAsync(page, rowsPerPage, search.values.keyword) : setPage(1);
  }

  function handleProjectSelected(project) {
    projectStore.setCurrentProject(project);
  }

  useEffect(() => {
    timeSheetStore.pagingTimeSheetAsync(page, rowsPerPage, currentProject.id);
    projectStore.pagingProjectAsync(1, 100, search.values.keyword);
  }, [page, rowsPerPage, currentProject]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.contentIndex} style={{ textAlign: "center" }}>
          <div style={{ background: "rgb(1, 192, 200)", height: "25px" }}>
            <h5>Danh sách dự án</h5>
          </div>
          <Button
            color="secondary"
            onClick={() => timeSheetStore.pagingTimeSheetAsync(page, rowsPerPage)}
          >
            Tất cả
          </Button>
          <form onSubmit={search.handleSubmit}>
            <TextField
              id="keyword"
              className="text"
              variant="outlined"
              placeholder="Nhập từ khóa"
              size="small"
              onChange={search.handleChange}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: "blue" }} />
            </IconButton>
          </form>
          <div>
            {projectList.map((value, index) => {
              return (
                <MenuItem
                  key={value.id}
                  value={value.id}
                  alignItems="center"
                  onClick={() => handleProjectSelected(value)}
                  selected={value.id === currentProject.id ? true : false}
                >
                  {value.name}
                </MenuItem>
              )
            })}
          </div>
          <Button
            variant="outlined"
            onClick={handleAddBtn}
            style={{ marginBottom: "10px" }}
          >
            Thêm thời gian biểu
          </Button>
        </div>
        <div className={classes.contentIndex}>
          <div className="w-100 overflow-auto">
            <Table style={{ whiteSpace: "pre" }}>
              <TableHead>
                <TableRow className={classes.headerStyle}>
                  <TableCell className="px-0" align='center'>Hành động</TableCell>
                  <TableCell className="px-0" align='center'>Công việc</TableCell>
                  <TableCell className="px-0" align='center'>Thời gian</TableCell>
                  <TableCell className="px-0" align='center'>Mức độ ưu tiên</TableCell>
                  <TableCell className="px-0" align='center'>Người thực hiện</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSheetList.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-0" align='center'>
                      <EditIcon color='primary' onClick={ () => handleEditBtn(value) } />
                      <DeleteIcon color='secondary' onClick={ () => handleDeleteBtn(value) } />
                    </TableCell>
                    <TableCell className="px-0 capitalize" align="center">
                      {value.description}
                    </TableCell>
                    <TableCell className="px-0 capitalize" align="center">
                      Thời gian bắt đầu: {(new Date(value.startTime)).toLocaleString()}
                      <br/>
                      Thời gian kết thúc: {(new Date(value.endTime)).toLocaleString()}

                    </TableCell>
                    <TableCell className="px-0 capitalize" align="center">
                      {value.priority}
                    </TableCell>
                    <TableCell className="px-0 capitalize" align="center">
                      <ul>
                      {value.timeSheetStaff?.map((item, index) => {
                        return (
                          <li>{item.lastName + " " + item.firstName}</li>
                        );
                        }) }
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <GlobitsPagination
              totalPages={timeSheetStore.totalPages}
              handleChangePage={handleChangePage}
              setRowsPerPage={setRowsPerPage}
              pageSize={rowsPerPage}
              pageSizeOption={[10, 25, 50, 100]}
              totalElements={timeSheetStore.totalElements}
              page={page}
            />
          </div>
        </div>
      </div>


      <GlobitsConfirmationDialog
        open={openDialog}
        onConfirmDialogClose={handleCloseDialog}
        text={"This action can't be undone! Do you want to delete this TimeSheet?"}
        title={"Delete TimeSheet"}
        agree={"Agree"}
        cancel={"Cancel"}
        onYesClick={handleAgreeBtn}
      />
      <TimeSheetModal
        isShowModal={isShowModal}
        type={type}
        handleCloseModal={handleCloseModal}
        handleUpdateTable={handleUpdateTable}
      />
    </>
  )
});