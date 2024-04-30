import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";

const DepartmentIndex = EgretLoadable({
  loader: () => import("./ProjectIndex"),
});
const ViewComponent = DepartmentIndex;

const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/project",
    exact: true,
    component: ViewComponent,
  },
];

export default Routes;
