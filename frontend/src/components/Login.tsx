import React, { useState } from "react";
import { decryptPrivateKey } from "../utils/crypto.ts";

interface LoginProps {
  setPrivateKey: (key: string) => void;
}

const Login: React.FC<LoginProps> = ({ setPrivateKey }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!password) {
      alert("Введите пароль");
      return;
    }

    try {
      const encryptedPrivateKey = localStorage.getItem("privateKey");
      if (!encryptedPrivateKey) {
        alert("Приватный ключ не найден. Пожалуйста, зарегистрируйтесь.");
        return;
      }

      const privateKey = decryptPrivateKey(encryptedPrivateKey, password);
      setPrivateKey(privateKey);
      alert("Вход выполнен успешно!");
    } catch (error) {
      console.error(error);
      alert("Неверный пароль или ошибка дешифровки");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          style={{ padding: 10 }}
          type="password"
          placeholder="Введите пароль для дешифровки ключа"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Войти</button>
      </div>
    </div>
  );
};

export default Login;
