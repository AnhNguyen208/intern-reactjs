import { useFormikContext } from "formik";
import { useStore } from "app/stores";
import { useEffect } from "react";

export default function StaffField () {
  const { setValues } = useFormikContext();
  const { staffStore } = useStore();
  const { currentStaff } = staffStore;

  useEffect(() => {
    const {
      id,
      lastName,
      firstName,
      displayName,
      gender,
      birthDate,
      birthPlace,
      permanentResidence,
      currentResidence,
      email,
      phoneNumber,
      idNumber,
      nationality,
      ethnics,
      religion,
      department,
      familyRelationships,
    } = currentStaff;

    setValues({
      id,
      lastName,
      firstName,
      displayName,
      gender,
      birthDate,
      birthPlace,
      permanentResidence,
      currentResidence,
      email,
      phoneNumber,
      idNumber,
      nationality,
      ethnics,
      religion,
      department,
      familyRelationships,
    });

  }, [currentStaff])

  return (
    <>
    </>
  );
}
