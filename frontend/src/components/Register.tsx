/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { generateKeyPair, encryptPrivateKey } from "../utils/crypto";
import { savePublicKeyToContract } from "../utils/contract";
import Web3 from "web3";

const Register: React.FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!password) {
      alert("Введите пароль");
      return;
    }

    try {
      setLoading(true);
      console.log("Генерация пары ключей...");
      const { publicKey, privateKey } = await generateKeyPair();

      console.log("Подключение к Ethereum через MetaMask...");
      if (!(window as any).ethereum) {
        alert("MetaMask не установлен");
        setLoading(false);
        return;
      }
      const web3 = new Web3((window as any).ethereum);
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      console.log("Аккаунт:", userAddress);

      console.log("Сохранение публичного ключа в смарт-контракте...");
      await savePublicKeyToContract(web3, publicKey, userAddress);
      console.log("Публичный ключ успешно сохранён.");

      console.log("Шифрование приватного ключа...");
      const encryptedPrivateKey = encryptPrivateKey(privateKey, password);
      localStorage.setItem("privateKey", encryptedPrivateKey);
      console.log("Приватный ключ зашифрован и сохранён.");

      alert("Регистрация успешна!");
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      if (error.message) {
        alert(`Ошибка: ${error.message}`);
      } else {
        alert("Произошла неизвестная ошибка при регистрации.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          style={{ padding: 10 }}
          type="password"
          placeholder="Введите пароль для шифрования ключа"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
};

export default Register;
