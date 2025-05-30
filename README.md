# Web3 Messenger

## Запуск проекта


```bash
npm run install
```

```bash
npm start
```

Откройте браузер и перейдите по адресу, указанному в терминале (обычно http://localhost:5173).

## Подключение MetaMask
- Установите расширение MetaMask в вашем браузере, если оно еще не установлено.
- Создайте новый аккаунт или используйте существующий.
- Подключите MetaMask к локальной сети Hardhat:
  - Откройте MetaMask.
  - Нажмите на текущую сеть (например, "Ethereum Mainnet") и выберите "Добавить сеть".
  - Введите следующие параметры:
  - Название сети: Hardhat Localhost
  - RPC URL: http://localhost:8545
  - ID блокчейна: 31337
  - Символ валюты: ETH
  - Остальные поля можно оставить пустыми.
  - Сохраните сеть.
  - ![alt text](https://raw.githubusercontent.com/anissemm/web3-messenger/6148c6c1496eac9ca138072ecc1e5b5fb156a568/assets/asset4.png)

- Импортируйте один из аккаунтов, предоставленных локальной сетью Hardhat, используя приватные ключи из терминала, где запущен npx hardhat node.

![alt text](https://raw.githubusercontent.com/anissemm/web3-messenger/8f413732070e79dc50c146927b445a6d1dac5cf0/assets/asset22.png)

Импорт ключа в MetaMask(Private key)
![alt text](https://raw.githubusercontent.com/anissemm/web3-messenger/6148c6c1496eac9ca138072ecc1e5b5fb156a568/assets/asset3.png)