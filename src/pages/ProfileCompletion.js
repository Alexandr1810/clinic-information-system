import { useState, useEffect, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ProfileCompletion() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    birth_date: "",
    phone: "",
    address: "",
  });

  const submit = async () => {
    try {
        console.log(form)
      const patient_data = await api.patch("/patients/me", form); // создадим новый endpoint на backend
        console.log(patient_data)
      navigate("/dashboard");
      window.location.reload()
    } catch (err) {
      alert("Ошибка сохранения");
    }
  };

  return (
    <div className="container form"> 
      <h2>Завершите ваш профиль</h2>
      <input
        type="date"
        placeholder="Дата рождения"
        value={form.birth_date}
        onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
      />
      <input
        placeholder="Телефон"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Адрес"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <button onClick={submit}>Сохранить</button>
    </div>
  );
}