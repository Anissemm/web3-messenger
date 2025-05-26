// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Messenger - Простой контракт для обмена сообщениями
contract Messenger {
    uint256 public messageCount = 0;

    struct Message {
        uint256 id;
        address sender;
        string content;
        uint256 timestamp;
    }

    mapping(uint256 => Message) public messages;

    event MessageSent(
        uint256 id,
        address indexed sender,
        string content,
        uint256 timestamp
    );

    /// @notice Отправка нового сообщения
    /// @param _content Текст сообщения
    function sendMessage(string memory _content) public {
        messageCount += 1;
        messages[messageCount] = Message(
            messageCount,
            msg.sender,
            _content,
            block.timestamp
        );
        emit MessageSent(messageCount, msg.sender, _content, block.timestamp);
    }

    /// @notice Получение всех сообщений
    /// @return Array всех сообщений
    function getAllMessages() public view returns (Message[] memory) {
        Message[] memory allMessages = new Message[](messageCount);
        for (uint256 i = 1; i <= messageCount; i++) {
            allMessages[i - 1] = messages[i];
        }
        return allMessages;
    }
}
