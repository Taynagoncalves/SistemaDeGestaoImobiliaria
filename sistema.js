const imoveis = [];
const clientes = [];
const historico = [];

const formImovel = document.getElementById('formImovel');
const formCliente = document.getElementById('formCliente');
const formOperacao = document.getElementById('formOperacao');

const clienteSelect = document.getElementById('clienteSelect');
const imovelSelect = document.getElementById('imovelSelect');
const historicoOperacoes = document.getElementById('historicoOperacoes');

// Cadastrar imóvel
formImovel.addEventListener('submit', e => {
  e.preventDefault();
  const descricao = document.getElementById('descricaoImovel').value;
  const tipo = document.getElementById('tipoImovel').value;
  const preco = parseFloat(document.getElementById('precoImovel').value);

  const imovel = { id: Date.now(), descricao, tipo, preco, disponivel: true };
  imoveis.push(imovel);
  atualizarImoveis();
  formImovel.reset();
});

// Cadastrar cliente
formCliente.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nomeCliente').value;
  const email = document.getElementById('emailCliente').value;

  const cliente = { id: Date.now(), nome, email };
  clientes.push(cliente);
  atualizarClientes();
  formCliente.reset();
});

// Fazer operação (venda ou aluguel)
formOperacao.addEventListener('submit', e => {
  e.preventDefault();
  const clienteId = Number(clienteSelect.value);
  const imovelId = Number(imovelSelect.value);
  const tipoOperacao = document.getElementById('tipoOperacao').value;

  const cliente = clientes.find(c => c.id === clienteId);
  const imovel = imoveis.find(i => i.id === imovelId);

  if (cliente && imovel && imovel.disponivel) {
    imovel.disponivel = false;

    const operacao = {
      cliente: cliente.nome,
      imovel: imovel.descricao,
      tipo: tipoOperacao,
      data: new Date().toLocaleString()
    };

    historico.push(operacao);
    mostrarHistorico();
    atualizarImoveis();
    alert(`Imóvel ${tipoOperacao.toLowerCase()} com sucesso!`);
  }
});

// Atualizar selects
function atualizarClientes() {
  clienteSelect.innerHTML = clientes.map(c =>
    `<option value="${c.id}">${c.nome}</option>`
  ).join('');
}

function atualizarImoveis() {
  imovelSelect.innerHTML = imoveis
    .filter(i => i.disponivel)
    .map(i =>
      `<option value="${i.id}">${i.descricao} - R$${i.preco.toFixed(2)}</option>`
    ).join('');
}

function mostrarHistorico() {
  historicoOperacoes.innerHTML = historico.map(h =>
    `<li>${h.tipo} - ${h.imovel} para ${h.cliente} em ${h.data}</li>`
  ).join('');
}
