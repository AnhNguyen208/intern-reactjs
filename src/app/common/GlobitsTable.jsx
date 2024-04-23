import React from "react";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core";
import GlobitsPagination from "./GlobitsPagination";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  globitsTableWraper: {
    // maxHeight: "400px",
    // overflowY: "auto",
  },
}));

export default function GlobitsTable(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    data,
    columns,
    totalPages,
    handleChangePage,
    setRowsPerPage,
    pageSize,
    pageSizeOption,
    totalElements,
    page,
    selection,
    handleSelectList,
  } = props;

  return (
    <div className={classes.globitsTableWraper}>
      <MaterialTable
        data={data}
        columns={columns}
        parentChildData={(row, rows) => {
          var list = rows.find((a) => a.id === row.parentId);
          return list;
        }}
        options={{
          selection: selection ? true : false,
          actionsColumnIndex: -1,
          paging: false,
          search: false,
          toolbar: false,
          maxBodyHeight: "100vh",
          headerStyle: {
            backgroundColor: "#01579b",
            color: "#fff",
            position: "sticky",
          },
          rowStyle: (rowData, index) => ({
            backgroundColor: index % 2 === 1 ? "rgb(237, 245, 251)" : "#FFF",
          }),
        }}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit',
            iconProps: {
              color: "primary",
            },
            onClick: (event, rowData) => props.handleEditBtn(rowData)
          },
          {
            icon: 'delete',
            tooltip: 'Delete',
            iconProps: {
              color: "error",
            },
            onClick: (event, rowData) => props.handleDeleteBtn(rowData)
          },
          {
            icon: 'add',
            tooltip: 'Add User',
            isFreeAction: true,
            onClick: (event) => alert("You want to add a new row")
          }
        ]}
        onSelectionChange={(rows) => {
          handleSelectList(rows);
        }}
        localization={{
          body: {
            emptyDataSourceMessage: `${t("general.emptyDataMessageTable")}`,
          },
        }}
      />
      <GlobitsPagination
        totalPages={totalPages}
        handleChangePage={handleChangePage}
        setRowsPerPage={setRowsPerPage}
        pageSize={pageSize}
        pageSizeOption={pageSizeOption}
        totalElements={totalElements}
        page={page}
      />
    </div>
  );
}
