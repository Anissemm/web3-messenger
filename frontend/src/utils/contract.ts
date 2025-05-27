/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from "web3";
import MessengerABI from "../../../artifacts/contracts/Messenger.sol/Messenger.json"; // Убедитесь, что ABI сгенерирован и находится здесь

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "";

if (!contractAddress) {
  throw new Error("Адрес контракта не найден в .env файле");
}

// Функция для получения экземпляра контракта
const getContract = (web3: Web3) => {
  return new web3.eth.Contract(MessengerABI.abi, contractAddress);
};

// Сохранение публичного ключа в смарт-контракте
export const savePublicKeyToContract = async (
  web3: Web3,
  publicKey: string,
  userAddress: string
) => {
  const contract = getContract(web3);
  await contract.methods.setPublicKey(publicKey).send({ from: userAddress });
};

// Получение публичного ключа пользователя
export const getPublicKeyFromContract = async (
  web3: Web3,
  userAddress: string
): Promise<any> => {
  const contract = getContract(web3);
  const publicKey = await contract.methods.getPublicKey(userAddress).call();
  return publicKey;
};

// Отправка зашифрованного сообщения
export const sendEncryptedMessage = async (
  web3: Web3,
  to: string,
  encryptedContent: string,
  from: string
) => {
  const contract = getContract(web3);
  await contract.methods.sendMessage(to, encryptedContent).send({ from: from });
};

// Получение всех сообщений
export const getMessages = async (web3: Web3): Promise<any[] | undefined> => {
  const contract = getContract(web3);
  const count = await contract.methods.getMessagesCount().call();
  const messages = [];
  try {
    if (typeof count === "number") {
      for (let i = 0; i < count; i++) {
        const msg = await contract.methods.getMessage(i).call();
        messages.push({
          sender: msg.sender,
          receiver: msg.receiver,
          encryptedContent: msg.encryptedContent,
          timestamp: parseInt(msg.timestamp),
        });
      }
      return messages;
    }
    throw new Error("count is not a number");
  } catch (err: any) {
    console.log(err);
    return;
  }
};

// Подписка на новые сообщения
export const listenForNewMessages = (
  web3: Web3,
  callback: (msg: any) => void
) => {
  const contract = getContract(web3);
  contract.events
    .MessageSent({
      fromBlock: "latest",
    })
    .on("data", (event: any) => {
      const { from, to, encryptedContent, timestamp } = event.returnValues;
      callback({
        sender: from,
        receiver: to,
        encryptedContent,
        timestamp: parseInt(timestamp),
      });
    });
};
