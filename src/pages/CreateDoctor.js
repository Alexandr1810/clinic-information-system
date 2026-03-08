import { useState } from "react";
import api from "../api";

export default function CreateDoctor() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    specialization: "",
  });

  const submit = async () => {
    try {
      await api.post("/doctors", form);
      alert("Doctor created");
      setForm({ full_name: "", email: "", password: "", specialization: "" });
      window.location.reload()
    } catch (err) {
      alert("Ошибка создания врача");
    }
  };

  return (
    <div>
      <h2>Добавить врача</h2>
      <input
        placeholder="Полное имя"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="Специализация"
        value={form.specialization}
        onChange={(e) => setForm({ ...form, specialization: e.target.value })}
      />
      <button onClick={submit}>Добавить</button>
    </div>
  );
}