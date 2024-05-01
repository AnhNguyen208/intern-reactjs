import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CountryModal from './CountryModal';
import { observer } from "mobx-react";
import { useStore } from "app/stores";
import { useTranslation } from "react-i18next";
import GlobitsTabble from "../../common/GlobitsTable";
import GlobitsConfirmationDialog from "../../common/GlobitsConfirmationDialog";
import GlobitsSearchInput from 'app/common/GlobitsSearchInput';

const useStyles = makeStyles((theme) => ({
    contentIndex: {
        padding: "10px",
    },
}));

export default observer(function CountryIndex() {
    const { t } = useTranslation();
    const { countryStore } = useStore();
    const { countryList, currentCountry } = countryStore;

    const classes = useStyles();
    const [isShowModal, setIsShowModal] = useState(false);
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);

    function handleChangePage(event, newPage) {
        setPage(newPage);
    };

    function handleCloseModal() {
        setIsShowModal(false);
    }

    function handleAddBtn() {
        countryStore.clearCurrentCountry();
        setIsShowModal(true);
        setType("new");
    }

    function handleEditBtn({ id }) {
        countryStore.getCountryAsync(id);
        setIsShowModal(true);
        setType("edit");
    }

    function handleDeleteBtn({ id }) {
        countryStore.getCountryAsync(id);
        setOpenDialog(true);
    }

    function handleCloseDialog() {
        setOpenDialog(false);
    }

    function handleAgreeBtn() {
        countryStore.deleteCountryAsync(currentCountry.id).then(() => {
            handleUpdateTable();
        });
        setOpenDialog(false);
    }

    function handleUpdateTable() {
        page === 1 ? countryStore.pagingCountriesAsync(page, rowsPerPage, "") : setPage(1);
    }

    function handleSearch({ keyword }) {
        countryStore.pagingCountriesAsync(page, rowsPerPage, keyword);
        setPage(1);
    }

    useEffect(() => {
        countryStore.pagingCountriesAsync(page, rowsPerPage, "");
    }, [page, rowsPerPage]);

    const columns = [
        { title: t('country.name'), field: "name", align : "center" },
        { title: t('country.code'), field: "code", align: "center" },
        { title: t('country.description'), field: "description", align: "center" },
    ];

    return (
        <>
            <div className={classes.contentIndex}>
                <Box display="flex">
                    <Box flexGrow={1}>
                        <h2>{ t('country.title') }</h2>
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            onClick={handleAddBtn}
                        >
                            Thêm quốc gia mới
                        </Button>
                    </Box>
                </Box>
            </div>
            <div className={classes.contentIndex}>
                <GlobitsSearchInput
                    search={handleSearch}
                />
            </div>
            <div className={classes.contentIndex}>
                <GlobitsTabble
                    data={countryList}
                    columns={columns}
                    totalPages={countryStore.totalPages}
                    handleChangePage={handleChangePage}
                    setRowsPerPage={setRowsPerPage}
                    pageSize={rowsPerPage}
                    pageSizeOption={[10, 25, 50, 100]}
                    totalElements={countryStore.totalElements}
                    page={page}
                    handleEditBtn={handleEditBtn}
                    handleDeleteBtn={handleDeleteBtn}
                />
            </div>

            <GlobitsConfirmationDialog
                open={openDialog}
                onConfirmDialogClose={handleCloseDialog}
                text={"This action can't be undone! Do you want to delete this Country?"}
                title={"Delete Country"}
                agree={"Agree"}
                cancel={"Cancel"}
                onYesClick={handleAgreeBtn}
            />
            <CountryModal
                isShowModal={isShowModal}
                type={type}
                handleCloseModal={handleCloseModal}
                handleUpdateTable={handleUpdateTable}
            />
        </>
    )
});