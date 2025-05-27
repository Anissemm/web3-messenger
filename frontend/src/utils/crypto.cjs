"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
var node_forge_1 = require("node-forge");
// Генерация пары ключей RSA
export function generateKeyPair() {
  return new Promise(function (resolve, reject) {
    node_forge_1.default.pki.rsa.generateKeyPair(
      { bits: 2048, workers: 2 },
      function (err, keypair) {
        if (err) {
          reject(err);
        } else {
          var publicKey = node_forge_1.default.pki.publicKeyToPem(
            keypair.publicKey
          );
          var privateKey = node_forge_1.default.pki.privateKeyToPem(
            keypair.privateKey
          );
          resolve({ publicKey: publicKey, privateKey: privateKey });
        }
      }
    );
  });
}
// export function generateKeyPair(): Promise<{
//   publicKey: string;
//   privateKey: string;
// }> {
//   return new Promise((resolve, reject) => {
//     try {
//       const keys = quickEncrypt.generate(2048);
//       resolve({ privateKey: keys.private, publicKey: keys.public });
//     } catch (err) {
//       reject(err);
//     }
//   });
// }
// Шифрование приватного ключа с использованием пароля
export function encryptPrivateKey(privateKey, password) {
  var cipher = node_forge_1.default.cipher.createCipher(
    "AES-CBC",
    node_forge_1.default.md.sha256
      .create()
      .update(password)
      .digest()
      .data.slice(0, 16)
  );
  var iv = node_forge_1.default.random.getBytesSync(16);
  cipher.start({ iv: iv });
  cipher.update(node_forge_1.default.util.createBuffer(privateKey, "utf8"));
  cipher.finish();
  var encrypted = iv + cipher.output.getBytes();
  return node_forge_1.default.util.encode64(encrypted);
}
// Дешифровка приватного ключа с использованием пароля
export function decryptPrivateKey(encryptedPrivateKey, password) {
  var encryptedBytes = node_forge_1.default.util.decode64(encryptedPrivateKey);
  var iv = encryptedBytes.slice(0, 16);
  var encrypted = encryptedBytes.slice(16);
  var decipher = node_forge_1.default.cipher.createDecipher(
    "AES-CBC",
    node_forge_1.default.md.sha256
      .create()
      .update(password)
      .digest()
      .data.slice(0, 16)
  );
  decipher.start({ iv: iv });
  decipher.update(node_forge_1.default.util.createBuffer(encrypted));
  var result = decipher.finish();
  if (result) {
    return decipher.output.toString("utf8");
  } else {
    throw new Error("Failed to decrypt private key");
  }
}
// Шифрование сообщения публичным ключом получателя
// Функция для шифровки сообщения
var encryptMessage = function (publicKeyPem, message) {
  var publicKey = node_forge_1.default.pki.publicKeyFromPem(publicKeyPem);
  var encrypted = publicKey.encrypt(message, "RSA-OAEP", {
    md: node_forge_1.default.md.sha256.create(), // Хэш-функция
    mgf1: {
      md: node_forge_1.default.md.sha1.create(), // MGF1 хэш-функция
    },
  });
  return node_forge_1.default.util.encode64(encrypted);
};
// Функция для дешифровки сообщения
var decryptMessage = function (privateKeyPem, encryptedMessage) {
  var privateKey = node_forge_1.default.pki.privateKeyFromPem(privateKeyPem);
  var encryptedBytes = node_forge_1.default.util.decode64(encryptedMessage);
  var decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: node_forge_1.default.md.sha256.create(),
    mgf1: {
      md: node_forge_1.default.md.sha1.create(),
    },
  });
  return decrypted;
};
// export async function encryptPrivateKey(
//   privateKey: string,
//   password: string
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     try {
//       const key = scryptSync(password, "10", 32);
//       const ivPosition = {
//         start: 17,
//         end: 17 + 32,
//       };
//       const iv = Buffer.from(
//         privateKey.slice(ivPosition.start, ivPosition.end),
//         "hex"
//       );
//       const part1: string = privateKey.slice(0, ivPosition.start);
//       const part2: string = privateKey.slice(ivPosition.end);
//       const encryptedText = `${part1}${part2}`;
//       const decipher = createDecipheriv("aes-256-cbc", key, iv);
//       let decrypted = decipher.update(encryptedText, "hex", "utf8");
//       decrypted += decipher.final("utf8");
//       resolve(decrypted);
//     } catch (err) {
//       reject(err);
//     }
//   });
// }
// export async function generateKeyPair(): Promise<{
//   publicKey: string;
//   privateKey: string;
// }> {
//   return await new Promise((resolve, reject) => {
//     try {
//       const { publicKey, privateKey } = generateKeyPairSync("rsa", {
//         modulusLength: 4096,
//         publicKeyEncoding: {
//           type: "spki",
//           format: "pem",
//         },
//         privateKeyEncoding: {
//           type: "pkcs8",
//           format: "pem",
//           cipher: "aes-256-cbc",
//         },
//       });
//       resolve({
//         publicKey,
//         privateKey,
//       });
//     } catch (err) {
//       reject(err);
//     }
//   });
// }
// Шифрование сообщения публичным ключом получателя
// export function encryptMessage(publicKey: string, message: string): string {
//   return quickEncrypt.encrypt(message, publicKey);
// }
// // Расшифровка сообщения приватным ключом
// export function decryptMessage(
//   privateKey: string,
//   encryptedMessage: string
// ): string {
//   return quickEncrypt.decrypt(encryptedMessage, privateKey);
// }
new Promise(function (resolve) {
  var keypair = generateKeyPair();
  console.log(keypair);
  resolve(keypair);
}).then(function (keypair) {
  var hash = encryptPrivateKey(keypair.privateKey, "12345");
  console.log("encrypted: ", hash);
  var decPv = decryptPrivateKey(hash, "12345");
  console.log("decrypted Pv: ", decPv);
  var encryptedMsg = encryptMessage(keypair.publicKey, "Hello!");
  console.log("encrypted message: ", encryptedMsg);
  var decryptedMsg = decryptMessage(decPv, encryptedMsg);
  console.log("decripted messsage: ", decryptedMsg);
});
