import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    await api.post("/auth/register", form);
    navigate("/login");
  };

  return (
    <div className="container form">
      <h2>Зарегистрироваться</h2>
      <input placeholder="Полное имя"
        onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
      <input placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Пароль"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={submit}>Зарегистрироваться</button>
    </div>
  );
}