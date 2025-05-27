import forge from "node-forge";

// Генерация пары ключей RSA
export function generateKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair(
      { bits: 2048, workers: 2 },
      (err, keypair) => {
        if (err) {
          reject(err);
        } else {
          const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
          const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
          resolve({ publicKey, privateKey });
        }
      }
    );
  });
}

// Шифрование приватного ключа с использованием пароля
export function encryptPrivateKey(
  privateKey: string,
  password: string
): string {
  const cipher = forge.cipher.createCipher(
    "AES-CBC",
    forge.md.sha256.create().update(password).digest().data.slice(0, 16)
  );
  const iv = forge.random.getBytesSync(16);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(privateKey, "utf8"));
  cipher.finish();
  const encrypted = iv + cipher.output.getBytes();
  return forge.util.encode64(encrypted);
}

// Дешифровка приватного ключа с использованием пароля
export function decryptPrivateKey(
  encryptedPrivateKey: string,
  password: string
): string {
  const encryptedBytes = forge.util.decode64(encryptedPrivateKey);
  const iv = encryptedBytes.slice(0, 16);
  const encrypted = encryptedBytes.slice(16);

  const decipher = forge.cipher.createDecipher(
    "AES-CBC",
    forge.md.sha256.create().update(password).digest().data.slice(0, 16)
  );
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(encrypted));
  const result = decipher.finish();

  if (result) {
    return decipher.output.toString("utf8");
  } else {
    throw new Error("Failed to decrypt private key");
  }
}

// Шифрование сообщения публичным ключом получателя
// Функция для шифровки сообщения
export const encryptMessage = (publicKeyPem, message) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(message, "RSA-OAEP", {
    md: forge.md.sha256.create(), // Хэш-функция
    mgf1: {
      md: forge.md.sha1.create(), // MGF1 хэш-функция
    },
  });
  return forge.util.encode64(encrypted);
};

// Функция для дешифровки сообщения
export const decryptMessage = (privateKeyPem, encryptedMessage) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(encryptedMessage);
  const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha1.create(),
    },
  });
  return decrypted;
};
