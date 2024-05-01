import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { useFormik } from 'formik';
import StaffModal from './StaffModal';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import { useTranslation } from "react-i18next";
import GlobitsTabble from "../../common/GlobitsTable";
import GlobitsConfirmationDialog from "../../common/GlobitsConfirmationDialog";

const useStyles = makeStyles((theme) => ({
  contentIndex: {
    padding: "10px",
  },
}));

export default observer(function StaffIndex() {
  const { staffStore } = useStore();
  const { staffList, currentStaff } = staffStore;
  const { t } = useTranslation();

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
      staffStore.pagingStaffAsync(page, rowsPerPage, values.keyword);
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
    staffStore.clearCurrentStaff();
    setIsShowModal(true);
    setType("new");
  }

  function handleEditBtn({ id }) {
    staffStore.getStaffAsync(id);
    setIsShowModal(true);
    setType("edit");
  }

  function handleDeleteBtn({ id }) {
    staffStore.getStaffAsync(id);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleAgreeBtn() {
    staffStore.deleteStaffAsync(currentStaff.id).then(() => {
      handleUpdateTable();
    });
    setOpenDialog(false);
  }

  function handleUpdateTable() {
    page === 1 ? staffStore.pagingStaffAsync(page, rowsPerPage, search.values.keyword) : setPage(1);
  }

  useEffect(() => {
    staffStore.pagingStaffAsync(page, rowsPerPage, search.values.keyword);
  }, [page, rowsPerPage]);

  const columns = [
    { title: "Tên", field: "firstName", align: "center" },
    { title: "Họ", field: "lastName", align: "center" },
  ];

  return (
    <>
      <div className={classes.contentIndex}>
        <Box display="flex">
          <Box flexGrow={1}>
            <h2>{t('staff.title')}</h2>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddBtn}
            >
              Add new staff
            </Button>
          </Box>
        </Box>
      </div>
      <div className={classes.contentIndex}>
        <form onSubmit={search.handleSubmit}>
          <TextField
            id="keyword"
            className="text"
            label="Enter keyword"
            variant="outlined"
            placeholder="Search..."
            size="small"
            onChange={search.handleChange}
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "blue" }} />
          </IconButton>
        </form>
      </div>
      <div className={classes.contentIndex}>
        <GlobitsTabble
          data={staffList}
          columns={columns}
          totalPages={staffStore.totalPages}
          handleChangePage={handleChangePage}
          setRowsPerPage={setRowsPerPage}
          pageSize={rowsPerPage}
          pageSizeOption={[10, 25, 50, 100]}
          totalElements={staffStore.totalElements}
          page={page}
          handleEditBtn={handleEditBtn}
          handleDeleteBtn={handleDeleteBtn}
        />
      </div>

      <GlobitsConfirmationDialog
        open={openDialog}
        onConfirmDialogClose={handleCloseDialog}
        text={"This action can't be undone! Do you want to delete this Staff?"}
        title={"Delete Staff"}
        agree={"Agree"}
        cancel={"Cancel"}
        onYesClick={handleAgreeBtn}
      />
      <StaffModal
        isShowModal={isShowModal}
        type={type}
        handleCloseModal={handleCloseModal}
        handleUpdateTable={handleUpdateTable}
      />
    </>
  )
});