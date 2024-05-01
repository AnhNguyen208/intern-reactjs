import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function CountryField() {
  const { setValues } = useFormikContext();
  const { countryStore } = useStore();
  const { currentCountry } = countryStore;

  useEffect(() => {
    const {
      id,
      name,
      code,
      description,
    } = currentCountry;

    setValues({
      id,
      name,
      code,
      description,
    });

  }, [currentCountry])

  return (
    <>
    </>
  );
}
