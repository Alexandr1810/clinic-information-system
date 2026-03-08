import { useEffect, useState } from "react";
import api from "../api";

export default function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get("/patients").then((res) => setPatients(res.data));
  }, []);

  return (
    <div>
      <h3>Пациенты</h3>
      {patients.map((p) => (
        <div key={p.id} className="listItem">
          {p.full_name} — {p.phone}
        </div>
      ))}
    </div>
  );
}