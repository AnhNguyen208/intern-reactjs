import { pagingDepartments, getDepartment, createDepartment, editDepartment, deleteDepartment } from './DepartmentService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class DepartmentStore {
  departmentList = [];
  currentDepartment = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingDepartmentsAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingDepartments(searchObject);
      runInAction(() => {
        this.departmentList = data.data.content;
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

  getDepartmentAsync = async (id) => {
    try {
      const { data } = await getDepartment(id);
      runInAction(() => {
        this.currentDepartment = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createDepartmentAsync = async (department) => {
    try {
      const res = await createDepartment(department);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A Department is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new department");
      });
    }
  };

  editDepartmentAsync = async (department) => { 
    try {
      const res = await editDepartment(department);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit department successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing department");
      });
    }
  };

  deleteDepartmentAsync = async (id) => { 
    try {
      const res = await deleteDepartment(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete department successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting department");
      });
    }
  };

  clearCurrentDepartment = () => {
    this.currentDepartment = {};
  }
}
