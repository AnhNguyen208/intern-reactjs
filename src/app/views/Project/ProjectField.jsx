import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function ProjectField () {
  const { setValues } = useFormikContext();
  const { projectStore } = useStore();
  const { currentProject } = projectStore;

  useEffect(() => {
    const {
      id,
      name,
      code,
      description,
      projectStaff,
    } = currentProject;

    setValues({
      id,
      name,
      code,
      description,
      projectStaff,
    });

  }, [currentProject])

  return (
    <>
    </>
  );
}
