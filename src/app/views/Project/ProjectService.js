import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/project";
const API_PATH_CORE = ConstantList.API_ENPOINT + "/api/project";

export const pagingProject = (searchObject) => {
  var url = API_PATH + "/search-by-page";
  return axios.post(url, searchObject);
};

export const getProject = (id) => {
  let url = API_PATH + "/" + id;
  return axios.get(url);
};

export const createProject= (obj) => {
  let url = API_PATH;
  return axios.post(url, obj);
};

export const editProject = (obj) => {
  let url = API_PATH + "/" + obj.id;
  return axios.put(url, obj);
};

export const deleteProject = (id) => {
  let url = API_PATH + "/" + id;
  return axios.delete(url);
};