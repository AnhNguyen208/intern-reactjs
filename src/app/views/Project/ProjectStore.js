import { pagingProject, getProject, createProject, editProject, deleteProject } from './ProjectService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';

export default class ProjectStore {
  projectList = [];
  currentProject = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingProjectAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingProject(searchObject);
      runInAction(() => {
        this.projectList = data.data.content;
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

  getProjectAsync = async (id) => {
    try {
      const { data } = await getProject(id);
      runInAction(() => {
        this.currentProject = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createProjectAsync = async (project) => {
    try {
      const res = await createProject(project);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A Project is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new project");
      });
    }
  };

  editProjectAsync = async (project) => { 
    try {
      const res = await editProject(project);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit project successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing project");
      });
    }
  };

  deleteProjectAsync = async (id) => { 
    try {
      const res = await deleteProject(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete project successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting project");
      });
    }
  };

  clearCurrentProject = () => {
    this.currentProject = {};
  }
}
