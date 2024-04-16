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
import { useFormik } from 'formik';
import { pagingCountries } from './CountryService';
import CountryModal from './CountryModal';

const useStyles = makeStyles((theme) => ({
    contentIndex: {
        padding: "10px",
    },
    table: {
        border: "1px solid #ddd",
        minWidth: 650,
        borderCollapse: "collapse",
        overflowX : "auto",
    },
    cell: {
        border: "1px solid #ddd",
        textAlign: "center",
    },
    cellButton: {
        margin: "3px",
    },
}));

export default function CountryIndex() {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [type, setType] = useState("");
    const [idCountry, setIdCountry] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(100);

    const search = useFormik({
        initialValues: {
            keyword: "",
        },
        onSubmit: async (values) => {
            let searchObject = {
                pageIndex: page + 1,
                pageSize: rowsPerPage,
                keyword: values.keyword,
            }
            let countries = [];
            let data = await pagingCountries(searchObject);
            data.data.content.map((country) => {
                countries.push(country);
            });
            setRows(countries);
            setTotal(data.data.totalElements);
        }
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function handleClose() {
        setIdCountry("")
        setIsShowModal(false);
    }

    function handleAddBtn() {
        setIsShowModal(true);
        setType("new");
        setIdCountry("");
    }

    function handleDetailBtn({ id }) {
        setIsShowModal(true);
        setType("detail");
        setIdCountry(id);
    }

    function handleUpdateTable() {
        page === 0 ? loadCountries() : setPage(0); 
    }

    useEffect(() => {
        loadCountries();
    }, [page, rowsPerPage]);

    async function loadCountries() {
        let searchObject = {
            pageIndex: page + 1,
            pageSize: rowsPerPage,
            keyword: search.values.keyword,
        }
        let data = await pagingCountries(searchObject);
        let countries = [];
        data.data.content.map((country) => {
            countries.push(country);
        });
        setRows(countries);
        setTotal(data.data.totalElements);
    }

    return (
        <>
            <div className={classes.contentIndex}>
                <Box display="flex">
                    <Box flexGrow={1}>
                        <h2>Country</h2>
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            onClick={handleAddBtn}
                        >
                            Add new country
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
                    {rows.map((row, index) => (
                        <TableRow key={row.id} >
                            <TableCell className={classes.cell}>{index + 1}</TableCell>
                            <TableCell className={classes.cell}>{row.name}</TableCell>
                            <TableCell className={classes.cell}>{row.code}</TableCell>
                            <TableCell className={classes.cell}>{row.description}</TableCell>
                            <TableCell className={classes.cell}>
                                <Button
                                    className={classes.cellButton}
                                    variant="contained"
                                    onClick={() => handleDetailBtn(row)}
                                >
                                    Detail
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <CountryModal
                isShowModal={isShowModal}
                type={type}
                idCountry={idCountry}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
        </>
    )
}