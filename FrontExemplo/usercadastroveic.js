const marca = document.querySelector("#marca");
const modelo = document.querySelector("#modelo");
const cor = document.querySelector("#cor");
const placa = document.querySelector("#placa");
const ano = document.querySelector("#ano");
const id_cliente = localStorage.getItem("id");
const nome = localStorage.getItem("nome");
console.log(id_cliente);
const formulario = document.querySelector("form");
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    marca: marca.value,
    modelo: modelo.value,
    cor: cor.value,
    placa: placa.value,
    ano: ano.value,
    id_cliente: id_cliente,
  };
  const resposta = await fetch("http://localhost:3000/cadVeiculo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dados),
  });
  if(resposta.status==201){
    alert('Carro cadastrado com sucesso');
    return window.location.reload();
  }
  alert('Carro não cadastrado')
});

window.addEventListener('load', ()=>{
    !id_cliente? window.location.replace('./login.html'):alert(`Seja bem vindo(a) ${nome}`);
})

function sair(){
    localStorage.clear();
    window.location.reload();
}