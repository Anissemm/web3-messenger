/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import SendMessage from "./components/SendMessage";
import Inbox from "./components/Inbox";
import { decryptMessage } from "./utils/crypto";

const App: React.FC = () => {
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        try {
          // Запрос доступа к аккаунту
          const accounts = (await window.ethereum.request({
            method: "eth_requestAccounts",
          })) as string[];
          const temp = accounts[0];
          setAccount(temp);

          // Подписка на событие смены аккаунта
          window.ethereum.on("accountsChanged", function (accounts) {
            console.log(accounts);
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              // Дополнительные действия при смене аккаунта
              console.log("Аккаунт изменён на:", accounts[0]);
            }
          });
        } catch (error) {
          console.error("Ошибка при подключении к MetaMask:", error);
        }
      } else {
        alert("Пожалуйста, установите MetaMask!");
      }
    };

    loadAccount();
    // Очистка обработчика при размонтировании компонента
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <div style={{ margin: 20 }}>
      <h1>Web3 Messenger</h1>
      <h2>Ваш Аккаунт: {account ? account : "Не подключен"}</h2>
      {!privateKey ? (
        <>
          <Register />
          <Login setPrivateKey={setPrivateKey} />
        </>
      ) : (
        <>
          <SendMessage privateKey={privateKey} />
          <Inbox privateKey={privateKey} />
        </>
      )}
    </div>
  );
};

export default App;
