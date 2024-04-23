import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import FamilyRelationshipModal from '../FamilyRelationship/FamilyRelationshipModal';
import { observer } from "mobx-react";
import { useStore } from "app/stores";

const useStyles = makeStyles((theme) => ({
  contentIndex: {
    padding: "10px",
  },
  table: {
    border: "1px solid #ddd",
    minWidth: 650,
    borderCollapse: "collapse",
    overflowX: "auto",
  },
  cell: {
    border: "1px solid #ddd",
    textAlign: "center",
  },
  cellButton: {
    margin: "3px",
  },
}));

export default observer(function FamilyRelationshipIndex() {
  const { familyRelationshipStore } = useStore();
  const { familyRelationshipList, currentFamilyRelationship } = familyRelationshipStore;

  const classes = useStyles();
  const [isShowModal, setIsShowModal] = useState(false);
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);


  const search = useFormik({
    initialValues: {
      keyword: "",
    },
    onSubmit: (values) => {
      familyRelationshipStore.pagingFamilyRelationshipAsync(page, rowsPerPage, values.keyword);
      setPage(0);
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleCloseModal() {
    setIsShowModal(false);
  }

  function handleAddBtn() {
    familyRelationshipStore.clearCurrentFamilyRelationship();
    setIsShowModal(true);
    setType("new");
  }

  function handleEditBtn({ id }) {
    familyRelationshipStore.getFamilyRelationshipAsync(id);
    setIsShowModal(true);
    setType("edit");
  }

  function handleDeleteBtn({ id }) {
    familyRelationshipStore.getFamilyRelationshipAsync(id);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleAgreeBtn() {
    familyRelationshipStore.deleteFamilyRelationshipAsync(currentFamilyRelationship.id).then(() => {
      handleUpdateTable();
    });
    setOpenDialog(false);
  }

  function handleUpdateTable() {
    page === 0 ? familyRelationshipStore.pagingFamilyRelationshipAsync(page, rowsPerPage, search.values.keyword) : setPage(0);
  }

  useEffect(() => {
    familyRelationshipStore.pagingFamilyRelationshipAsync(page, rowsPerPage, search.values.keyword);
  }, [page, rowsPerPage]);

  return (
    <>
      <div className={classes.contentIndex}>
        <Box display="flex">
          <Box flexGrow={1}>
            <h2>FamilyRelationship</h2>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddBtn}
            >
              Add new familyRelationship
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
      <TableContainer className={classes.contentIndex} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>ID</TableCell>
              <TableCell className={classes.cell}>Name</TableCell>
              <TableCell className={classes.cell}>Code</TableCell>
              <TableCell className={classes.cell}>Description</TableCell>
              <TableCell className={classes.cell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {familyRelationshipList.map((row, index) => (
              <TableRow key={row.id} >
                <TableCell className={classes.cell}>{rowsPerPage * (page) + index + 1}</TableCell>
                <TableCell className={classes.cell}>{row.name}</TableCell>
                <TableCell className={classes.cell}>{row.code}</TableCell>
                <TableCell className={classes.cell}>{row.description}</TableCell>
                <TableCell className={classes.cell}>
                  <Button
                    className={classes.cellButton}
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditBtn(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    className={classes.cellButton}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteBtn(row)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete familyRelationship"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action can't be undone!
            Do you want to delete this FamilyRelationship?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Disagree
          </Button>
          <Button onClick={handleAgreeBtn} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <TablePagination
        component="div"
        count={familyRelationshipStore.totalFamilyRelationship}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <FamilyRelationshipModal
        isShowModal={isShowModal}
        type={type}
        handleCloseModal={handleCloseModal}
        handleUpdateTable={handleUpdateTable}
      />
    </>
  )
});