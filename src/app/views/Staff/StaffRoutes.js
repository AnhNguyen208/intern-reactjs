import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";

const DepartmentIndex = EgretLoadable({
  loader: () => import("./StaffIndex"),
});
const ViewComponent = DepartmentIndex;

const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/staff",
    exact: true,
    component: ViewComponent,
  },
];

export default Routes;
