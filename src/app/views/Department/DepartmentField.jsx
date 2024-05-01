import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function FamilyRelationshipField() {
  const { setValues } = useFormikContext();
  const { departmentStore } = useStore();
  const { currentDepartment } = departmentStore;

  useEffect(() => {
    const {
      id,
      parent,
      name,
      code,
      description,
      func,
      industryBlock,
      foundedNumber,
      foundedDate,
      displayOrder
    } = currentDepartment;

    setValues({
      id,
      parent,
      name,
      code,
      description,
      func,
      industryBlock,
      foundedNumber,
      foundedDate,
      displayOrder
    });

  }, [currentDepartment])

  return (
    <>
    </>
  );
}
