/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Web3 from "web3";
import { getMessages, listenForNewMessages } from "../utils/contract.ts";
import { decryptMessage } from "../utils/crypto.ts";

interface InboxProps {
  privateKey: string;
}

interface Message {
  sender: string;
  encryptedContent: string;
  timestamp: number;
}

const Inbox: React.FC<InboxProps> = ({ privateKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Подключение к Ethereum через MetaMask
    if (!(window as any).ethereum) {
      alert("MetaMask не установлен");
      return;
    }
    const web3 = new Web3((window as any).ethereum);

    // Загрузка существующих сообщений
    const loadMessages = async () => {
      const temp = await getMessages(web3);
      const msgs = temp ? temp : [];

      // Фильтрация сообщений, предназначенных для текущего пользователя
      const accounts = await web3.eth.getAccounts();
      const currentUser = accounts[0];
      const filteredMsgs = (msgs as any).filter(
        (msg) => msg.receiver.toLowerCase() === currentUser.toLowerCase()
      );
      setMessages(filteredMsgs);
    };

    loadMessages();

    // Подписка на новые сообщения
    listenForNewMessages(web3, (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });
  }, []);

  const handleDecrypt = (encryptedContent: string) => {
    try {
      console.log("Inbox: ", encryptedContent);
      const decrypted = decryptMessage(privateKey, encryptedContent);
      return decrypted;
    } catch (error) {
      console.error(error);
      return "Не удалось расшифровать сообщение";
    }
  };

  return (
    <div>
      <h2>Входящие Сообщения</h2>
      {messages.length === 0 ? (
        <p>Нет сообщений</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <p>
                <strong>От:</strong> {msg.sender}
              </p>
              <p>
                <strong>Сообщение:</strong>{" "}
                {handleDecrypt(msg.encryptedContent)}
              </p>
              <p>
                <em>
                  Время: {new Date(msg.timestamp * 1000).toLocaleString()}
                </em>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
