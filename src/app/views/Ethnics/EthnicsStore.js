import { pagingEthnicities, getEthnics, createEthnics, editEthnics, deleteEthnics } from './EthnicsService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class EthnicsStore {
  ethnicsList = [];
  currentEthnics = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingEthnicitiesAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingEthnicities(searchObject);
      runInAction(() => {
        this.ethnicsList = data.data.content;
        this.totalElements = data.data.totalElements;
        this.totalPages = data.data.totalPages;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  getEthnicsAsync = async (id) => {
    try {
      const { data } = await getEthnics(id);
      console.log(data);
      runInAction(() => {
        this.currentEthnics = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createEthnicsAsync = async (ethnics) => {
    try {
      const res = await createEthnics(ethnics);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A Ethnics is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new ethnics");
      });
    }
  };

  editEthnicsAsync = async (ethnics) => { 
    try {
      const res = await editEthnics(ethnics);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit ethnics successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing ethnics");
      });
    }
  };

  deleteEthnicsAsync = async (id) => { 
    try {
      const res = await deleteEthnics(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete ethnics successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting ethnics");
      });
    }
  };

  clearCurrentEthnics = () => {
    this.currentEthnics = {};
  }

}
