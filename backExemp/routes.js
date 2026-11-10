import express from "express";
import sql from "./database.js";
const routes = express.Router();
//USUÁRIO
routes.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    const resposta = await sql`select * from cliente where nome = ${user}`;
    if (password == resposta[0].senha) {
      return res.status(200).json(resposta[0]);
    }
    return res.status(401).json("erro ao logar");
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});
routes.get("/usuarios", async (req, res) => {
  const resposta = await sql`select * from cliente`;
  return res.status(200).json(resposta);
});
routes.get("/carros", async (req, res) => {
  const resposta = await sql`select * from veiculo`;
  return res.status(200).json(resposta);
});
routes.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const resposta = await sql`select * from cliente where id_cliente= ${id}`;
  return res.status(200).json(resposta[0]);
});

routes.post("/cadastro", async (req, res) => {
  try {
    const { user, password, cpf, telefone, endereco } = req.body;
    await sql`INSERT INTO cliente(nome, senha, cpf, telefone, endereco)
	VALUES (${user},${password}, ${cpf}, ${telefone}, ${endereco})`;
    return res.status(201).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar usuário",
    });
  }
});
routes.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;
  await sql`delete from usuario where id_user = ${id}`;
  return res.status(200).json("Deletado");
});
routes.put("/editarUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_p } = req.body;
    const resposta = await sql`UPDATE usuario
	SET usuario=${nome_p}	WHERE id_user=${id} RETURNING *;`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

//PRODUTOS
routes.get("/veiculos", async (req, res) => {
  const resposta =
    await sql`select * from veiculo as v join cliente as c on c.id_cliente = v.id_cliente;`;
  return res.status(200).json(resposta);
});
routes.get("/listcarros", async (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = await sql`
       select v.*, c.nome from veiculo as v join cliente as c on c.id_cliente = v.id_cliente
        WHERE modelo ILIKE ${"%" + search + "%"}
      `;
  } else {
    rows = await sql`
       select v.*, c.nome from veiculo as v join cliente as c on c.id_cliente = v.id_cliente;
      `;
  }
  return res.status(200).json(rows);
});
routes.get("/manutencao", async (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = await sql`
       select * from manutencao as m 
       join veiculo as v on m.id_veiculo= v.id_veiculo
        WHERE modelo ILIKE ${"%" + search + "%"}
      `;
  } else {
    rows = await sql`
       select * from manutencao order by id_manutencao;
      `;
  }
  return res.status(200).json(rows);
});

routes.get("/manutencao/:id", async (req, res) => {
  const { id } = req.params;
  const resposta =
    await sql`select * from manutencao where id_manutencao=${id}`;
  return res.status(200).json(resposta[0]);
});

routes.post("/cadVeiculo", async (req, res) => {
  try {
    const { marca, modelo, cor, placa, ano, id_cliente } = req.body;
    await sql`insert into veiculo(marca, modelo, cor, placa, ano,id_cliente) 
      values (${marca}, ${modelo}, ${cor}, ${placa}, ${ano}, ${id_cliente})`;
    return res.status(201).json("Cadastro com sucesso");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar produto",
    });
  }
});
routes.post("/cadManut", async (req, res) => {
  try {
    const {
      descricao_problema,
      tipo_servico,
      valor,
      id_veiculo,
      previsao_saida,
    } = req.body;
    await sql`insert into manutencao(
	previsao_saida, descricao_problema, tipo_servico, valor, id_veiculo)
	VALUES  (${previsao_saida}, ${descricao_problema}, ${tipo_servico}, ${valor}, ${id_veiculo})`;
    return res.status(201).json("Cadastro com sucesso");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar produto",
    });
  }
});

routes.put("/concluir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = new Date();
    await sql`UPDATE manutencao	SET data_saida=${data}, situacao='concluido' WHERE id_manutencao = ${id}`;
    return res.status(200).json("atualizado");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

routes.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      descricao_problema,
      tipo_servico,
      valor,
      previsao_saida,
      situacao,
    } = req.body;
    const resposta =
      await sql`update manutencao set descricao_problema = ${descricao_problema}, 
      tipo_servico=${tipo_servico}, valor=${valor}, previsao_saida=${previsao_saida}, situacao=${situacao} where id_manutencao=${id}`;
    return res.status(201).json("atualizado");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

export default routes;
