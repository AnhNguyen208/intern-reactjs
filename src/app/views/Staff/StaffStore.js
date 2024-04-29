import { pagingStaff, pagingAllStaff, getStaff, createStaff, editStaff, deleteStaff } from './StaffService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class StaffStore {
  staffList = [];
  currentStaff = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingStaffAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingStaff(searchObject);
      runInAction(() => {
        this.staffList = data.data.content;
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

  getStaffAsync = async (id) => {
    try {
      const { data } = await getStaff(id);
      runInAction(() => {
        this.currentStaff = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createStaffAsync = async (staff) => {
    try {
      const res = await createStaff(staff);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A Staff is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new staff");
      });
    }
  };

  editStaffAsync = async (staff) => { 
    try {
      const res = await editStaff(staff);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit staff successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing staff");
      });
    }
  };

  deleteStaffAsync = async (id) => { 
    try {
      const res = await deleteStaff(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete staff successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting staff");
      });
    }
  };

  clearCurrentStaff = () => {
    this.currentStaff = {};
  }
}
