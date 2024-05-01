import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
import ModalComponent from 'app/common/ModalComponent';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    backgroundColor: "rgb(1, 192, 200)",
    position: "sticky",
    "& th": {
      color: "#fff" 
    }
  },
}));

export default observer(function SelectParentModal(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { departmentStore } = useStore();
  const { departmentList } = departmentStore;
  const { isShowSelectParentModal, handleCloseSelectParentModal, department } = props;

  const [keyword, setKeyword] = useState('');
  const [parent, setParent] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  function handleChangePage(event, newPage) {
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

  const form = (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          id="keyword"
          className="text"
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
            <TableRow className={classes.headerStyle}>
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
    </>
  );

  return (
    <>
      <ModalComponent
        handleCloseModal={handleCloseSelectParentModal}
        isShowModal={isShowSelectParentModal}
        title={"Lựa chọn phòng ban"}
        form={form}
      />
    </>
  );

})