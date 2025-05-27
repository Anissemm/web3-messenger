import hardhat from "hardhat";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import chalk from "chalk";

dotenv.config();

async function main() {
  const Messenger = await hardhat.ethers.getContractFactory("Messenger");
  const messenger = await Messenger.deploy();

  const envPath = path.resolve(
    fileURLToPath(import.meta.url),
    "../../frontend/.env"
  );

  console.log(envPath);
  let envConfig = {};
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, { encoding: "utf8" });
    envFile.split(/\r?\n/).forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envConfig[key] = value;
      }
    });
  }

  // Обновляем или добавляем переменную REACT_APP_CONTRACT_ADDRESS
  envConfig.VITE_CONTRACT_ADDRESS = messenger.target;
  console.log(
    "Адрес контракта: ",
    chalk.bgGreenBright(envConfig.VITE_CONTRACT_ADDRESS)
  );

  const newEnv = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(envPath, newEnv, { encoding: "utf8" });

  console.log(".env файл фронтенда обновлён с адресом контракта.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ошибка при деплое:", error);
    process.exit(1);
  });
