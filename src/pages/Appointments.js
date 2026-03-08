import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../AuthContext";

export default function Appointments() {
  const { role } = useContext(AuthContext); // получаем роль
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadAppointments();
    if (role === "patient") loadDoctors();
  }, [role]);

  const loadAppointments = async () => {
    const res = await api.get("/appointments");
    setAppointments(res.data);
  };

  const loadDoctors = async () => {
    const res = await api.get("/doctors");
    setDoctors(res.data);
  };

  const createAppointment = async () => {
    if (!doctorId || !date) {
      alert("Select doctor and date");
      return;
    }

    await api.post("/appointments", {
      doctor_id: doctorId,
      appointment_date: date,
    });

    setDoctorId("");
    setDate("");
    loadAppointments();
  };

  return (
    <div>
      <h3>Ваши приемы</h3>

      {/* Показываем форму только для пациента */}
      {role === "patient" && (
        <div className="appointmentsForm">
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            <option value="">Выберите врача</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name} — {d.specialization}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={createAppointment}>Добавить</button>
        </div>
      )}

      <hr />

      {appointments.map((a) => (
        <div key={a.id} className="appointmentItem">
          {a.doctor_name} - {a.patient_name} - {new Date(a.appointment_date).toLocaleString()}

          {role === "doctor" && (
            <select
              value={a.status}
              onChange={async (e) => {
                const newStatus = e.target.value;
                await api.patch(`/appointments/${a.id}/status`, { status: newStatus });
                const res = await api.get("/appointments");
                setAppointments(res.data);
              }}
            >
              <option value="scheduled">Запланирован</option>
              <option value="completed">Завершён</option>
              <option value="cancelled">Отменён</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}