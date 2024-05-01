import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";

const DepartmentIndex = EgretLoadable({
  loader: () => import("./TimeSheetIndex"),
});
const ViewComponent = DepartmentIndex;

const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/timeSheet",
    exact: true,
    component: ViewComponent,
  },
];

export default Routes;
