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
  - Chain ID: 31337
  - Остальные поля можно оставить пустыми.
  - Сохраните сеть.
- Импортируйте один из аккаунтов, предоставленных локальной сетью Hardhat, используя приватные ключи из терминала, где запущен npx hardhat node.
- ![alt text](https://raw.githubusercontent.com/anissemm/web3-messenger/a2ebef51c9d2ca6a068533500625c79c292a716f/assets/Screenshot_2025-05-26_at_9.26.52_PM.png)
