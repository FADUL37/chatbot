const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const porta = process.env.PORT || 3001;

const pastaOperadoras = path.join(__dirname, 'operadoras');

app.use(cors());
app.use(express.json());

// Divide o texto em parágrafos por uma ou mais linhas em branco
function separarParagrafos(texto) {
  return texto.split(/\n\s*\n/);
}

// Normaliza texto: minúsculo, remove acentos e caracteres especiais
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, '') // remove caracteres não alfanuméricos exceto espaço
    .trim();
}

app.post('/consulta', async (req, res) => {
  try {
    const textoConsulta = req.body.texto;
    if (!textoConsulta || !textoConsulta.trim()) {
      return res.json({ resposta: "Por favor, envie um texto para consulta." });
    }

    // Normaliza e separa palavras da consulta
    const textoNormalizado = normalizarTexto(textoConsulta);
    const palavrasConsulta = textoNormalizado
      .split(/\s+/)
      .filter(p => p);

    if (palavrasConsulta.length === 0) {
      return res.json({ resposta: "Por favor, envie uma consulta com palavras relevantes." });
    }

    const arquivos = await fs.promises.readdir(pastaOperadoras);

    // Procura a primeira palavra que corresponda a um arquivo de operadora
    let operadoraEncontrada = null;
    let indiceOperadora = -1;
    for (let i = 0; i < palavrasConsulta.length; i++) {
      const palavra = palavrasConsulta[i];
      const arquivoMatch = arquivos.find(arq =>
        normalizarTexto(arq).includes(palavra)
      );
      if (arquivoMatch) {
        operadoraEncontrada = arquivoMatch;
        indiceOperadora = i;
        break;
      }
    }

    if (!operadoraEncontrada) {
      return res.json({ resposta: `Nenhuma operadora encontrada na consulta.` });
    }

    // Lê conteúdo do arquivo da operadora
    const conteudo = await fs.promises.readFile(path.join(pastaOperadoras, operadoraEncontrada), 'utf8');
    const paragrafos = separarParagrafos(conteudo);

    // Palavras para busca (excluindo a operadora)
    const palavrasBusca = palavrasConsulta.filter((_, idx) => idx !== indiceOperadora);

    // Se não houver palavras-chave, retorna todo conteúdo da operadora
    if (palavrasBusca.length === 0) {
      return res.json({ resposta: conteudo });
    }

    // Filtra parágrafos que contenham todas as palavras-chave (AND)
    const resultados = paragrafos.filter(paragrafo => {
      const textoParaBuscar = normalizarTexto(paragrafo);
      return palavrasBusca.every(palavra => textoParaBuscar.includes(palavra));
    });

    if (resultados.length === 0) {
      return res.json({ resposta: `Nenhum resultado encontrado para '${palavrasBusca.join(" ")}' na operadora.` });
    }

    return res.json({ resposta: resultados.join('\n\n') });

  } catch (error) {
    console.error('Erro na rota /consulta:', error);
    return res.status(500).json({ resposta: "Erro interno no servidor." });
  }
});

app.listen(porta, () => {
  console.log(`Backend rodando na porta ${porta}`);
});
