import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function FamilyRelationshipField() {
  const { setValues } = useFormikContext();
  const { familyRelationshipStore } = useStore();
  const { currentFamilyRelationship } = familyRelationshipStore;

  useEffect(() => {
    const {
      id,
      name,
      code,
      description,
    } = currentFamilyRelationship;

    setValues({
      id,
      name,
      code,
      description,
    });

  }, [currentFamilyRelationship])

  return (
    <>
    </>
  );
}
