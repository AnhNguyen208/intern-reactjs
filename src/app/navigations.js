import ConstantList from "./appConfig";

export const navigations = [
  {
    name: "navigation.dashboard",
    icon: "home",
    path: ConstantList.ROOT_PATH + "dashboard",
    isVisible: true,
  },
  {
    name: "navigation.directory",
    icon: "dashboard",
    isVisible: true,
    children: [
      {
        name: "navigation.country",
        path: ConstantList.ROOT_PATH + "category/country",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "navigation.ethnics",
        path: ConstantList.ROOT_PATH + "category/ethnics",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "navigation.religion",
        path: ConstantList.ROOT_PATH + "category/religion",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "Quan hệ thân nhân",
        path: ConstantList.ROOT_PATH + "category/familyRelationship",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "navigation.department",
        path: ConstantList.ROOT_PATH + "category/department",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "navigation.staff",
        path: ConstantList.ROOT_PATH + "category/staff",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "Dự án",
        path: ConstantList.ROOT_PATH + "category/project",
        icon: "remove",
        isVisible: true,
      },
      {
        name: "Thời gian biểu",
        path: ConstantList.ROOT_PATH + "category/timeSheet",
        icon: "remove",
        isVisible: true,
      },
    ],
  },
  
];
