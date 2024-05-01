import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { useFormik } from 'formik';
import EthnicsModal from './EthnicsModal';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import GlobitsTabble from "../../common/GlobitsTable";
import GlobitsConfirmationDialog from "../../common/GlobitsConfirmationDialog";

const useStyles = makeStyles((theme) => ({
  contentIndex: {
    padding: "10px",
  },
}));

export default observer(function EthnicsIndex() {
  const { ethnicsStore } = useStore();
  const { ethnicsList, currentEthnics } = ethnicsStore;

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
      ethnicsStore.pagingEthnicitiesAsync(page, rowsPerPage, values.keyword);
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
    ethnicsStore.clearCurrentEthnics();
    setIsShowModal(true);
    setType("new");
  }

  function handleEditBtn({ id }) {
    ethnicsStore.getEthnicsAsync(id);
    setIsShowModal(true);
    setType("edit");
  }

  function handleDeleteBtn({ id }) {
    ethnicsStore.getEthnicsAsync(id);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleAgreeBtn() {
    ethnicsStore.deleteEthnicsAsync(currentEthnics.id).then(() => {
      handleUpdateTable();
    });
    setOpenDialog(false);
  }

  function handleUpdateTable() {
    page === 1 ? ethnicsStore.pagingEthnicitiesAsync(page, rowsPerPage, search.values.keyword) : setPage(1);
  }

  useEffect(() => {
    ethnicsStore.pagingEthnicitiesAsync(page, rowsPerPage, search.values.keyword);
  }, [page, rowsPerPage]);

  const columns = [
    { title: "Name", field: "name", align: "center" },
    { title: "Code", field: "code", align: "center" },
    { title: "Description", field: "description", align: "center" },
  ];

  return (
    <>
      <div className={classes.contentIndex}>
        <Box display="flex">
          <Box flexGrow={1}>
            <h2>Ethnics</h2>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddBtn}
            >
              Add new ethnics
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
          data={ethnicsList}
          columns={columns}
          totalPages={ethnicsStore.totalPages}
          handleChangePage={handleChangePage}
          setRowsPerPage={setRowsPerPage}
          pageSize={rowsPerPage}
          pageSizeOption={[10, 25, 50, 100]}
          totalElements={ethnicsStore.totalElements}
          page={page}
          handleEditBtn={handleEditBtn}
          handleDeleteBtn={handleDeleteBtn}
        />
      </div>

      <GlobitsConfirmationDialog
        open={openDialog}
        onConfirmDialogClose={handleCloseDialog}
        text={"This action can't be undone! Do you want to delete this Ethnics?"}
        title={"Delete Ethnics"}
        agree={"Agree"}
        cancel={"Cancel"}
        onYesClick={handleAgreeBtn}
      />
      <EthnicsModal
        isShowModal={isShowModal}
        type={type}
        handleCloseModal={handleCloseModal}
        handleUpdateTable={handleUpdateTable}
      />
    </>
  )
});