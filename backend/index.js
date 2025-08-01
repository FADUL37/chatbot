const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const porta = process.env.PORT || 3001;

const pastaOperadoras = path.join(__dirname, "operadoras");

app.use(cors());
app.use(express.json());

function separarParagrafos(texto) {
  return texto.split(/\n\s*\n/);
}

function normalizarNome(nome) {
  return nome.toLowerCase().replace(/[\s_\-\.]/g, "");
}

app.post("/consulta", async (req, res) => {
  try {
    const textoConsulta = req.body.texto;
    if (!textoConsulta || !textoConsulta.trim()) {
      return res.json({ resposta: "Por favor, envie um texto para consulta." });
    }

    const textoMinusculo = textoConsulta.toLowerCase().trim();
    const partes = textoMinusculo.split(/\s+/);

    const arquivos = await fs.promises.readdir(pastaOperadoras);

    function encontrarArquivoOperadora(nomeOperadora) {
      const nomeNormalizado = normalizarNome(nomeOperadora);
      for (const arquivo of arquivos) {
        const arquivoNormalizado = normalizarNome(arquivo);
        if (arquivoNormalizado.includes(nomeNormalizado)) {
          return arquivo;
        }
      }
      return null;
    }

    if (partes.length === 1) {
      const arquivoOperadora = encontrarArquivoOperadora(partes[0]);
      if (!arquivoOperadora) {
        return res.json({
          resposta: `Arquivo da operadora '${partes[0]}' não encontrado.`,
        });
      }
      const conteudo = await fs.promises.readFile(
        path.join(pastaOperadoras, arquivoOperadora),
        "utf8"
      );
      return res.json({ resposta: conteudo });
    }

    if (partes.length >= 2) {
      const palavra = partes[0];
      const operadora = partes.slice(1).join(" ");
      const arquivoOperadora = encontrarArquivoOperadora(operadora);
      if (!arquivoOperadora) {
        return res.json({
          resposta: `Arquivo da operadora '${operadora}' não encontrado.`,
        });
      }
      const conteudo = await fs.promises.readFile(
        path.join(pastaOperadoras, arquivoOperadora),
        "utf8"
      );

      const paragrafos = separarParagrafos(conteudo);
      const resultados = paragrafos.filter((p) =>
        p.toLowerCase().includes(palavra.toLowerCase())
      );

      if (resultados.length === 0) {
        return res.json({
          resposta: `Nenhum resultado encontrado para '${palavra}' na operadora '${operadora}'.`,
        });
      }

      return res.json({ resposta: resultados.join("\n\n") });
    }

    return res.json({ resposta: "Consulta não compreendida." });
  } catch (error) {
    console.error("Erro na rota /consulta:", error);
    return res.status(500).json({ resposta: "Erro interno no servidor." });
  }
});

app.listen(porta, () => {
  console.log(`Backend rodando na porta ${porta}`);
});
