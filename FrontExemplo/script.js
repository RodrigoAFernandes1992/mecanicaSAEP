const descricao_problema = document.querySelector("#descricao_problema");
const valor = document.querySelector("#valor");
const tipo_servico = document.querySelector("#tipo_servico");
const id_fabric = document.querySelector("#id_fabric");
const previsao_saida = document.querySelector("#previsao_saida");
const vazia = document.querySelector('#vazia')
const corpo = document.querySelector("tbody");
const procuraveicu = document.querySelector('#usuarios')
const procuramanu = document.querySelector('#manutencoes')
const api = "http://localhost:3000";
const form = document.querySelector("form");
const id_cliente = localStorage.getItem("id");
let prods = [];
window.addEventListener("load", async () => {
  if (!id_cliente) window.location.replace("./login.html");

  const respostalistacarros = await fetch(`${api}/listcarros`);
  const listcarros = await respostalistacarros.json();
  listcarros.forEach((element)=>{
    const card = document.createElement('div');
    card.classList='card';
    card.innerHTML=`
    <h1>${element.modelo}</h1>
    <p>${element.nome}</p>
    `
    vazia.appendChild(card);
  })
  const resposta = await fetch(`${api}/manutencao`);
  prods = await resposta.json();
  const respo = await fetch(`${api}/veiculos`);
  const listaveic = await respo.json();
  listaveic.forEach((prod) => {
    id_fabric.innerHTML += `
      <option value="${prod.id_veiculo}">${prod.modelo}</option>
      `;
  });
  renderizar(prods);
});

function renderizar(prods) {
  prods.forEach((element) => {
    if (element.situacao.toLowerCase() == "concluido") {
      corpo.innerHTML += `
                 <tr id="linha${element.id_manutencao}" style="background-color: rgba(0, 255, 0, 0.384);">
                  <td>${element.id_manutencao}</td>
                  <td>${element.data_ent.slice(0, 10)}</td>  
                  <td>${element.data_saida.slice(0, 10)}</td>
                  <td>${element.previsao_saida.slice(0, 10)}</td>
                  <td>${element.situacao}</td>
                  <td>${element.descricao_problema}</td>
                  <td>${element.tipo_servico}</td>
                  <td>R$${element.valor}</td>
                  <td>${element.id_veiculo}</td>
                  <td>
                  <button onclick='editar(${element.id_manutencao})'>✏️</button>
                  <button onclick="concluir(${element.id_manutencao})">✅</button>
                  </td>
              </tr>`;
    } else if (element.situacao.toLowerCase() == "em manutenção") {
      corpo.innerHTML += `
                 <tr id="linha${element.id_manutencao}" style="background-color: rgba(255, 242, 0, 0.38);">
                  <td>${element.id_manutencao}</td>
                  <td>${element.data_ent.slice(0, 10)}</td>  
                  <td>${element.data_saida}</td>
                  <td>${element.previsao_saida.slice(0, 10)}</td>
                  <td>${element.situacao}</td>
                  <td>${element.descricao_problema}</td>
                  <td>${element.tipo_servico}</td>
                  <td>R$${element.valor}</td>
                  <td>${element.id_veiculo}</td>
                  <td>
                  <button onclick='editar(${element.id_manutencao})'>✏️</button>
                  <button onclick="concluir(${element.id_manutencao})">✅</button>
                  </td>
              </tr>`;
    } else {
      corpo.innerHTML += `
                 <tr id="linha${element.id_manutencao}">
                  <td>${element.id_manutencao}</td>
                  <td>${element.data_ent.slice(0, 10)}</td>
                  <td>${element.data_saida}</td>
                  <td>${element.previsao_saida.slice(0, 10)}</td>
                  <td>${element.situacao}</td>
                  <td>${element.descricao_problema}</td>
                  <td>${element.tipo_servico}</td>
                  <td>R$${element.valor}</td>
                  <td>${element.id_veiculo}</td>
                  <td>
                  <button onclick='editar(${element.id_manutencao})'>✏️</button>
                  <button onclick="concluir(${element.id_manutencao})">✅</button>
                  </td>
              </tr>`;
    }
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    descricao_problema: descricao_problema.value,
    tipo_servico: tipo_servico.value,
    valor: valor.value,
    id_veiculo: id_fabric.value,
    previsao_saida: previsao_saida.value,
  };
  console.log(dados);
  const resposta = await fetch(`${api}/cadManut`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (resposta.status == 201) {
    alert("cadastrado com sucesso");
    window.location.reload();
  }
});

async function concluir(id) {
  const resposta = await fetch(`http://localhost:3000/concluir/${id}`, {
    method: "PUT",
  });
  if (resposta.status == 200) {
    alert("CONCLUIDO");
    return window.location.reload();
  }
  return alert("erro ao deletar");
}

async function editar(id) {
  const produto = await fetch(`${api}/manutencao/${id}`);
  const prod = await produto.json();
  const datas = {
    descricao_problema:prompt('descreva o problema', prod.descricao_problema),
    tipo_servico:prompt('troque o tipo do serviço', prod.tipo_servico),
    valor:prompt('Qual novo valor',prod.valor),
    previsao_saida:prompt('Qual a data prevista para entrega',prod.previsao_saida.slice(0,10)),
    situacao:prompt('Qual status',prod.situacao),
  };
  const resposta = await fetch(`${api}/editar/${id}`, {
    method: "put",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(datas),
  });
  resposta.status == 201 ? window.location.reload() : alert("erro ao editar");
}

function sair() {
  localStorage.clear();
  window.location.reload();
}

procuraveicu.addEventListener('input', async (element)=>{
  let data = element.target.value;
  const resposta= await fetch(`${api}/listcarros?search=${data}`)
  const list =  await resposta.json();
  vazia.innerHTML='';
   list.forEach((element)=>{
    const card = document.createElement('div');
    card.classList='card';
    card.innerHTML=`
    <h1>${element.modelo}</h1>
    <p>${element.nome}</p>
    `
    vazia.appendChild(card);
  })
})
procuramanu.addEventListener('input', async (element)=>{
  let data = element.target.value;
  const resposta= await fetch(`${api}/manutencao?search=${data}`)
  const list =  await resposta.json();
  corpo.innerHTML='';
  renderizar(list);  
})
