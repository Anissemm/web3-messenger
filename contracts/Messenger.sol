// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Messenger {
    struct Message {
        address sender;
        address receiver;
        string encryptedContent;
        uint256 timestamp;
    }

    // Событие при отправке сообщения
    event MessageSent(
        address indexed from,
        address indexed to,
        string encryptedContent,
        uint256 timestamp
    );

    // Хранение сообщений
    Message[] public messages;

    // Хранение публичных ключей пользователей
    mapping(address => string) public publicKeys;

    // Событие обновления публичного ключа
    event PublicKeyUpdated(address indexed user, string publicKey);

    // Установка или обновление публичного ключа
    function setPublicKey(string calldata _publicKey) external {
        publicKeys[msg.sender] = _publicKey;
        emit PublicKeyUpdated(msg.sender, _publicKey);
    }

    // Получение публичного ключа пользователя
    function getPublicKey(address _user) external view returns (string memory) {
        return publicKeys[_user];
    }

    // Отправка сообщения
    function sendMessage(
        address _to,
        string calldata _encryptedContent
    ) external {
        messages.push(
            Message({
                sender: msg.sender,
                receiver: _to,
                encryptedContent: _encryptedContent,
                timestamp: block.timestamp
            })
        );
        emit MessageSent(msg.sender, _to, _encryptedContent, block.timestamp);
    }

    // Получение количества сообщений
    function getMessagesCount() external view returns (uint256) {
        return messages.length;
    }

    // Получение сообщения по индексу
    function getMessage(uint256 _index) external view returns (Message memory) {
        require(_index < messages.length, "Index out of bounds");
        return messages[_index];
    }
}
