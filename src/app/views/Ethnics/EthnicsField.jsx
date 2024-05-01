import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function EthnicsField() {
  const { setValues } = useFormikContext();
  const { ethnicsStore } = useStore();
  const { currentEthnics } = ethnicsStore;

  useEffect(() => {
    const {
      id,
      name,
      code,
      description,
    } = currentEthnics;

    setValues({
      id,
      name,
      code,
      description,
    });

  }, [currentEthnics])

  return (
    <>
    </>
  );
}
