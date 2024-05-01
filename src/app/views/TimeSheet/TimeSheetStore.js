import { pagingTimeSheet, getTimeSheet, createTimeSheet, editTimeSheet, deleteTimeSheet } from './TimeSheetService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class TimeSheetStore {
  timeSheetList = [];
  currentTimeSheet = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingTimeSheetAsync = async (page, rowsPerPage, projectId) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        projectId: projectId,
      }
      let data = await pagingTimeSheet(searchObject);
      runInAction(() => {
        this.timeSheetList = data.data.content;
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

  getTimeSheetAsync = async (id) => {
    try {
      const { data } = await getTimeSheet(id);
      runInAction(() => {
        this.currentTimeSheet = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createTimeSheetAsync = async (timeSheet) => {
    try {
      const res = await createTimeSheet(timeSheet);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A TimeSheet is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new timeSheet");
      });
    }
  };

  editTimeSheetAsync = async (timeSheet) => { 
    try {
      const res = await editTimeSheet(timeSheet);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit timeSheet successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing timeSheet");
      });
    }
  };

  deleteTimeSheetAsync = async (id) => { 
    try {
      const res = await deleteTimeSheet(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete timeSheet successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting timeSheet");
      });
    }
  };

  clearCurrentTimeSheet = () => {
    this.currentTimeSheet = {};
  }
}
