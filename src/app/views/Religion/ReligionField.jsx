import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function ReligionField() {
  const { setValues } = useFormikContext();
  const { religionStore } = useStore();
  const { currentReligion } = religionStore;

  useEffect(() => {
    const {
      id,
      name,
      code,
      description,
    } = currentReligion;

    setValues({
      id,
      name,
      code,
      description,
    });

  }, [currentReligion])

  return (
    <>
    </>
  );
}
