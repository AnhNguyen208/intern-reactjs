
import { pagingCountries, getCountry, createCountry, editCountry, deleteCountry } from './CountryService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class CountryStore {
  countryList = [];
  currentCountry = {};
  status = 'initial';
  totalCountries = 0;
  constructor() {
    makeAutoObservable(this);
  }

  pagingCountriesAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingCountries(searchObject);
      runInAction(() => {
        this.countryList = data.data.content;
        this.totalCountries = data.data.totalElements;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  getCountryAsync = async (id) => {
    try {
      const { data } = await getCountry(id);
      runInAction(() => {
        this.currentCountry = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createCountryAsync = async (country) => {
    try {
      const res = await createCountry(country);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A Country is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new country");
      });
    }
  };

  editCountryAsync = async (country) => { 
    try {
      const res = await editCountry(country);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit country successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing new country");
      });
    }
  };

  deleteCountryAsync = async (id) => { 
    try {
      const res = await deleteCountry(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete country successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting new country");
      });
    }
  };

  clearCurrentCountry = () => {
    this.currentCountry = {};
  }
}