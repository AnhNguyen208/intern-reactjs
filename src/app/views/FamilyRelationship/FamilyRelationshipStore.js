import { pagingFamilyRelationship, getFamilyRelationship, createFamilyRelationship, editFamilyRelationship, deleteFamilyRelationship } from './FamilyRelationshipService';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
export default class FamilyRelationshipStore {
  familyRelationshipList = [];
  currentFamilyRelationship = {};
  status = 'initial';
  totalElements = 0;
  totalPages = 0;  

  constructor() {
    makeAutoObservable(this);
  }

  pagingFamilyRelationshipAsync = async (page, rowsPerPage, keyword) => {
    try {
      let searchObject = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyword: keyword,
      }
      let data = await pagingFamilyRelationship(searchObject);
      runInAction(() => {
        this.familyRelationshipList = data.data.content;
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

  getFamilyRelationshipAsync = async (id) => {
    try {
      const { data } = await getFamilyRelationship(id);
      runInAction(() => {
        this.currentFamilyRelationship = data;
        this.status = 'success';
      });
    } catch {
      runInAction(() => {
        this.status = "error";
      });
    }
  };

  createFamilyRelationshipAsync = async (familyRelationship) => {
    try {
      const res = await createFamilyRelationship(familyRelationship);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("A FamilyRelationship is created succeed!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when creating new familyRelationship");
      });
    }
  };

  editFamilyRelationshipAsync = async (familyRelationship) => { 
    try {
      const res = await editFamilyRelationship(familyRelationship);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Edit familyRelationship successfully!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when editing familyRelationship");
      });
    }
  };

  deleteFamilyRelationshipAsync = async (id) => { 
    try {
      const res = await deleteFamilyRelationship(id);
      if (res.status === 200) {
        runInAction(() => {
          this.status = "success";
          toast.success("Delete familyRelationship successfully!!!");
        })
      } 
    } catch (error) {
      runInAction(() => {
        this.status = "error";
        toast.error("Error when deleting familyRelationship");
      });
    }
  };

  clearCurrentFamilyRelationship = () => {
    this.currentFamilyRelationship = {};
  }

}
