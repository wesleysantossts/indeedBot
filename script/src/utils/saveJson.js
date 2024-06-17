import fs from "fs";
import path from "path";

class SaveJson {
  static async save(newData, filename) {
    const pathFormat = path.resolve("data", `${filename}.json`)
    if (fs.existsSync(pathFormat)) {
      fs.readFile(pathFormat, "utf8", (err, data) => {
        if (err) {
          console.error("Erro ao ler o arquivo:", err);
          return;
        }

        const existingData = JSON.parse(data);
        existingData.push(newData);

        fs.writeFile(pathFormat, JSON.stringify(existingData, null, 2), "utf8", (err) => {
          if (err) {
            console.error("Erro ao atualizar o arquivo:", err);
            return;
          }
          console.log("Novo objeto adicionado com sucesso!");
        });
      });
    } else {
      fs.writeFile(pathFormat, JSON.stringify([newData], null, 2), "utf8", (err) => {
        if (err) {
          console.error("Erro ao criar o arquivo:", err);
          return;
        }
        console.log("Arquivo criado com sucesso!");
      });
    }
  }
}

export default SaveJson;