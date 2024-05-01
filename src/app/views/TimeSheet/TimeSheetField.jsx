import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function TimeSheetField(props) {
  const { project } = props;
  const { setValues, setFieldValue } = useFormikContext();
  const { timeSheetStore, projectStore } = useStore();
  const { currentTimeSheet } = timeSheetStore;

  useEffect(() => {
    const {
      id,
      project,
      timeSheetStaff,
      workingDate,
      startTime,
      endTime,
      priority,
      description,
      details,
    } = currentTimeSheet;

    setValues({
      id,
      project,
      timeSheetStaff,
      workingDate,
      startTime,
      endTime,
      priority,
      description,
      details,
    });
  }, [currentTimeSheet]);

  useEffect(() => {
    projectStore.setCurrentProject(project);
    setFieldValue("project", project);
    setFieldValue("timeSheetStaff", project.projectStaff);
  }, [project]);

  return (
    <>
    </>
  );
}
