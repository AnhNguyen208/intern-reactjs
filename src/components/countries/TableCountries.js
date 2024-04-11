import { useEffect, useState } from "react";
import { CountryData } from "../../CountryData";
import Table from 'react-bootstrap/Table';
import AddNewCountry from "./AddNewCountry";
import EditCountry from "./EditCountry";
import DeleteCountry from "./DeleteCountry"; 

const TableCountries = () => {
  const [listCountry, setListCountry] = useState([]);

  const [isShowModalAddNewCountry, setIsShowModalAddNewCountry] = useState(false);
  
  const [isShowModalEditCountry, setIsShowModalEditCountry] = useState(false);
  const [dataCountryEdit, setDataCountryEdit] = useState({});
  
  const [isShowModalDeleteCountry, setIsShowModalDeleteCountry] = useState(false);
  const [dataCountryDelete, setDataCountryDelete] = useState({});

  const handleClose = () => {
    setIsShowModalAddNewCountry(false);
    setIsShowModalEditCountry(false);
    setIsShowModalDeleteCountry(false);
  }

  const handleAddNew = (name, code, description) => {
    let country = {
      name, code, description
    };
    setListCountry([...listCountry, country]);
  }

  const handleEdit = (indexEdit, name, code, description) => {
    let country = {
      name, code, description
    };
    const newList = [];
    listCountry.forEach((item, index) => {
      if (indexEdit === index) {
        newList.push(country);
      } else {
        newList.push(item);
      }    
    })

    setListCountry(newList);
  }

  const handleDelete = (indexDelete) => {
    const newList = [];
    listCountry.forEach((item, index) => {
      if (indexDelete !== index) {
        newList.push(item);
      }
    })
    console.log("new list ", newList);

    setListCountry(newList);
  }

  const handleUpdateTable = () => {
    // setPage(1);
    // setSortBy("asc");
    // setSortField("Countryname");
  }

  const handleEditBtn = (index, country) => {
    setDataCountryEdit({index, country});
    setIsShowModalEditCountry(true);
  }

  const handleDeleteBtn = (index, country) => {
    setDataCountryDelete({index, country});
    setIsShowModalDeleteCountry(true);
  } 

  useEffect(() => {
    setListCountry(CountryData);
  }, []);

  return (
    <>
      <div className="col my-3 d-sm-flex flex-column">
        <div className="my-3 d-sm-flex justify-content-between">
          <span><b>List Country: </b></span>
          <div>
            <button
              className="btn btn-success"
              onClick={() => setIsShowModalAddNewCountry(true)}
            >
              <i className="fa-solid fa-circle-plus"></i> Add new Country
            </button>
          </div>
        </div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listCountry && listCountry.length > 0 && 
              
              listCountry.map((item, index) => {
                return (
                  <tr key={`Country-${index}`}>
                    <td>{ index + 1 }</td>
                    <td>{ item.name }</td>
                    <td>{ item.code }</td>
                    <td>{ item.description }</td>
                    <td>
                      <button
                        className="btn btn-warning mx-3"
                        onClick={() =>  handleEditBtn(index, item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteBtn(index, item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
      </div>
    
      <AddNewCountry
        show={isShowModalAddNewCountry}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
        handleAddNew={handleAddNew}
      />
      <EditCountry
        show={isShowModalEditCountry}
        dataCountryEdit={dataCountryEdit}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
        handleEdit={handleEdit}
      />
      <DeleteCountry
        show={isShowModalDeleteCountry}
        handleClose={handleClose}
        dataCountryDelete={dataCountryDelete}
        handleUpdateTable={handleUpdateTable}
        handleDelete={handleDelete}
      />
      
    </>
  );
}
export default TableCountries;