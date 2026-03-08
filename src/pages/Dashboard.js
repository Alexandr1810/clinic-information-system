import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import Patients from "./Patients";
import CreateDoctor from "./CreateDoctor";
import ProfileCompletion from "./ProfileCompletion";
import api from "../api";

export default function Dashboard() {
  const { role, logout } = useContext(AuthContext);
  const [profileCompleted, setProfileCompleted] = useState(true);

  useEffect(() => {
    if (role === "patient") {
      api.get("/patients/me").then((res) => {
        const { birth_date, phone, address } = res.data;
        if (!birth_date || !phone || !address) setProfileCompleted(false);
      });
    }
  }, [role]);

  if (role === "patient" && !profileCompleted) {
    return <ProfileCompletion />;
  }

  return (
    <div className="container dashboard">
      <h2>Дашборд</h2>
      <button onClick={logout}>Выйти</button>

      {role === "patient" && (
        <>
          <Doctors />
          <Appointments />
        </>
      )}

      {role === "doctor" && (
        <>
          <Appointments />
          <Patients />
        </>
      )}

      {role === "admin" && (
        <>
          <CreateDoctor />
          <Doctors />
          <Patients />
          <Appointments />
        </>
      )}
    </div>
  );
}