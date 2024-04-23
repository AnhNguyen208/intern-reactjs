import { pagingReligions, getReligion, createReligion, editReligion, deleteReligion } from './ReligionService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class ReligionStore {
  religionList = [];
  currentReligion = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingReligionsAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingReligions(searchObject);
      runInAction(() => {
        this.religionList = data.data.content;
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

  getReligionAsync = async (id) => {
    try {
      const { data } = await getReligion(id);
      runInAction(() => {
        this.currentReligion = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createReligionAsync = async (religion) => {
    try {
      const res = await createReligion(religion);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A religion is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new religion");
      });
    }
  };

  editReligionAsync = async (religion) => { 
    try {
      const res = await editReligion(religion);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit religion successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing religion");
      });
    }
  };

  deleteReligionAsync = async (id) => { 
    try {
      const res = await deleteReligion(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete religion successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting religion");
      });
    }
  };

  clearCurrentReligion = () => {
    this.currentReligion = {};
  }
}