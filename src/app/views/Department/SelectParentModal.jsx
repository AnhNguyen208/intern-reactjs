import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  TableRow,
  Radio,
  Button,
} from "@material-ui/core";
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import { useTranslation } from "react-i18next";
import GlobitsPagination from "../../common/GlobitsPagination";

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
    flexDirection: 'column',
    // flexWrap: "wrap",
  },
}))(MuiDialogContent);

export default observer(function SelectParentModal(props) {
  const { t } = useTranslation();

  const { departmentStore } = useStore();
  const { departmentList } = departmentStore;
  const { isShowSelectParentModal, handleCloseSelectParentModal, department } = props;

  const [keyword, setKeyword] = useState('');
  const [parent, setParent] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleParentSelected = () => {
    department.setValues({ parent });
    setParent({});
    handleCloseSelectParentModal();
  }

  useEffect(() => {
    departmentStore.pagingDepartmentsAsync(page, rowsPerPage, keyword);
  }, [isShowSelectParentModal]);

  return (
    <>
      <div>
        <Dialog onClose={handleCloseSelectParentModal} aria-labelledby="customized-dialog-title" open={isShowSelectParentModal}>
          <DialogTitle id="customized-dialog-title" onClose={handleCloseSelectParentModal}>
            Lựa Chọn Phòng Ban
          </DialogTitle>
          <DialogContent dividers>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TextField
                id="keyword"
                className="text"
                label="Enter keyword"
                variant="outlined"
                placeholder="Search..."
                size="small"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "blue" }} />
              </IconButton>
            </div>

            <div className="w-100 overflow-auto">
              <Table style={{ whiteSpace: "pre" }}>
                <TableHead>
                  <TableRow>
                    <TableCell className="px-0" align='center'>Chọn</TableCell>
                    <TableCell className="px-0" align='center'>{t('department.name')}</TableCell>
                    <TableCell className="px-0" align='center'>{t('department.code')}</TableCell>
                    <TableCell className="px-0" align='center'>{t('department.description')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentList.map((department, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-0" align='center'>
                        <Radio
                          checked={department === parent}
                          onChange={() => setParent(department)}
                        />
                      </TableCell>
                      <TableCell className="px-0 capitalize" align="center">
                        {department.name}
                      </TableCell>
                      <TableCell className="px-0 capitalize" align="center">
                        {department.code}
                      </TableCell>
                      <TableCell className="px-0 capitalize" align="center">
                        {department.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <GlobitsPagination
                totalPages={departmentStore.totalPages}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                pageSize={rowsPerPage}
                pageSizeOption={[10, 25, 50, 100]}
                totalElements={departmentStore.totalElements}
                page={page}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="secondary"
                style={{ margin: '5px' }}
                onClick={handleCloseSelectParentModal}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: '5px' }}
                onClick={handleParentSelected}
              >
                Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

})