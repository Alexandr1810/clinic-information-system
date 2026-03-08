import { useEffect, useState } from "react";
import api from "../api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get("/doctors").then((res) => setDoctors(res.data));
  }, []);

  return (
    <div>
      <h3>Врачи</h3>
      {doctors.map((d) => (
        <div key={d.id} className="listItem">
          {d.full_name} — {d.specialization}
        </div>
      ))}
    </div>
  );
}