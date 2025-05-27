/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Web3 from "web3";
import {
  getPublicKeyFromContract,
  sendEncryptedMessage,
} from "../utils/contract.ts";
import { encryptMessage } from "../utils/crypto.ts";

interface SendMessageProps {
  privateKey: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ privateKey }) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!recipient || !message) {
      alert("Введите адрес получателя и сообщение");
      return;
    }

    try {
      // Подключение к Ethereum через MetaMask
      if (!(window as any).ethereum) {
        alert("MetaMask не установлен");
        return;
      }
      const web3 = new Web3((window as any).ethereum);
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const senderAddress = accounts[0];

      // Получение публичного ключа получателя из смарт-контракта
      const recipientPublicKey = await getPublicKeyFromContract(
        web3,
        recipient
      );

      console.log("recipient public key: ", recipientPublicKey);

      if (!recipientPublicKey) {
        alert("Публичный ключ получателя не найден");
        return;
      }

      // Шифрование сообщения публичным ключом получателя
      const encryptedMessage = encryptMessage(recipientPublicKey, message);

      // Отправка зашифрованного сообщения через смарт-контракт
      console.log("send: ", encryptedMessage);
      await sendEncryptedMessage(
        web3,
        recipient,
        encryptedMessage,
        senderAddress
      );

      alert("Сообщение отправлено");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке сообщения");
    }
  };

  return (
    <div>
      <h2>Отправить Сообщение</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          style={{ padding: 10 }}
          type="text"
          placeholder="Адрес получателя"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <textarea
          style={{ padding: 20 }}
          placeholder="Ваше сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
};

export default SendMessage;
