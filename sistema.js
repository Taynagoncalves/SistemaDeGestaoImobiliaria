let clientes = [];
let imoveis = [];
let vendas = [];
let alugueis = [];
let inventario = []; 

function salvarDados() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
  localStorage.setItem('imoveis', JSON.stringify(imoveis));
  localStorage.setItem('vendas', JSON.stringify(vendas));
  localStorage.setItem('alugueis', JSON.stringify(alugueis));
  localStorage.setItem('inventario', JSON.stringify(inventario));
}

function carregarDados() {
  clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  imoveis = JSON.parse(localStorage.getItem('imoveis')) || [];
  vendas = JSON.parse(localStorage.getItem('vendas')) || [];
  alugueis = JSON.parse(localStorage.getItem('alugueis')) || [];
  inventario = JSON.parse(localStorage.getItem('inventario')) || [];
}

carregarDados();

const navButtons = document.querySelectorAll('.nav-button');
const sections = {
  clientesSection: document.getElementById('clientesSection'),
  imoveisSection: document.getElementById('imoveisSection'),
  vendasSection: document.getElementById('vendasSection'),
  alugueisSection: document.getElementById('alugueisSection')
};

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(sections).forEach(sec => sec.style.display = 'none');
    const target = btn.getAttribute('data-target');
    sections[target].style.display = 'block';
  });
});

// Clientes
const clienteForm = document.getElementById('clienteForm');
const listaClientes = document.getElementById('listaClientes');

clienteForm.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nomeCliente').value.trim();
  const telefone = document.getElementById('telefoneCliente').value.trim();
  if (!nome || !telefone) return alert('Preencha todos os campos.');

  if (clientes.some(c => c.nome.toLowerCase() === nome.toLowerCase() && c.telefone === telefone)) {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Cliente já cadastrado com esse nome e telefone.',
      confirmButtonColor: 'red'
    });
    return;
  }

  clientes.push({ nome, telefone });
  salvarDados();
  clienteForm.reset();
  renderClientes();
  atualizarSelectClientes();

  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Cliente cadastrado com sucesso.',
    confirmButtonColor: '#3085d6'
  });
});

function renderClientes() {
  listaClientes.innerHTML = '';
  if (clientes.length === 0) {
    listaClientes.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
    return;
  }

  clientes.forEach((c, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Nome:</strong> ${c.nome}</p>
      <p><strong>Telefone:</strong> ${c.telefone}</p>
      <div id="listaClientes" class="cards-container">
        <button class="botao-acao botao-editar" onclick="editarCliente(${index})">Editar</button>
        <button class="botao-acao botao-excluir" onclick="excluirCliente(${index})">Excluir</button>
      </div>
    `;
    listaClientes.appendChild(card);
  });
}

function excluirCliente(index) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Deseja realmente excluir este cliente?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, excluir!'
  }).then((result) => {
    if (result.isConfirmed) {
      clientes.splice(index, 1);
      salvarDados();
      renderClientes();
      atualizarSelectClientes();
      Swal.fire('Excluído!', 'Cliente removido com sucesso.', 'success');
    }
  });
}
function excluirVenda(id) {
  const index = vendas.findIndex(v => v.id === id);
  if (index === -1) return;

  Swal.fire({
    title: 'Excluir Venda?',
    text: 'Essa venda será movida para o inventário.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    confirmButtonColor: '#d33'
  }).then(result => {
    if (result.isConfirmed) {
      const vendaRemovida = vendas.splice(index, 1)[0];
      inventario.push({ tipo: 'Venda', ...vendaRemovida });
      salvarDados();
      renderVendas();
      renderInventario(); 
      Swal.fire('Movido!', 'Registro de venda enviado para o inventário.', 'success');
    }
  });
}


function excluirAluguel(id) {
  const index = alugueis.findIndex(a => a.id === id);
  if (index === -1) return;

  Swal.fire({
    title: 'Excluir Aluguel?',
    text: 'Esse aluguel será movido para o inventário.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    confirmButtonColor: '#d33'
  }).then(result => {
    if (result.isConfirmed) {
      const aluguelRemovido = alugueis.splice(index, 1)[0];
      inventario.push({ tipo: 'Aluguel', ...aluguelRemovido });
      salvarDados();
      renderAlugueis();
      renderInventario(); 
      Swal.fire('Movido!', 'Registro de aluguel enviado para o inventário.', 'success');
    }
  });
}

function renderInventario() {
  const lista = document.getElementById('listaInventario');
  lista.innerHTML = '';
  if (inventario.length === 0) {
    lista.innerHTML = '<p>Nenhuma transação registrada no inventário.</p>';
    return;
  }

  inventario.forEach(reg => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Tipo:</strong> ${reg.tipo}</p>
      <p><strong>Descrição:</strong> ${reg.descricao}</p>
      <p><strong>Valor:</strong> R$ ${reg.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
      <p><strong>Cliente:</strong> ${reg.cliente}</p>
      <p><strong>Telefone:</strong> ${reg.telefone}</p>
      <p><strong>Data:</strong> ${reg.data}</p>
    `;
    lista.appendChild(card);
  });
}

function editarCliente(index) {
  const cliente = clientes[index];
  Swal.fire({
    title: 'Editar Cliente',
    html: `
      <input id="swalNome" class="swal2-input" placeholder="Nome" value="${cliente.nome}">
      <input id="swalTelefone" class="swal2-input" placeholder="Telefone" value="${cliente.telefone}">
    `,
    focusConfirm: false,
    preConfirm: () => {
      const novoNome = document.getElementById('swalNome').value.trim();
      const novoTelefone = document.getElementById('swalTelefone').value.trim();

      if (!novoNome || !novoTelefone) {
        Swal.showValidationMessage('Preencha todos os campos');
        return false;
      }
      Swal.fire('Editado!', 'Cliente Atualizado.', 'success');

      clientes[index] = { nome: novoNome, telefone: novoTelefone };
      salvarDados();
      renderClientes();
      atualizarSelectClientes();
    }
  });
}

const fotoImovelInput = document.getElementById('fotoImovel');
const imovelPreview = document.getElementById('imovelPreview');

fotoImovelInput.addEventListener('change', () => {
  const file = fotoImovelInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      imovelPreview.src = e.target.result;
      imovelPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    imovelPreview.src = '';
    imovelPreview.style.display = 'none';
  }
});

const imovelForm = document.getElementById('imovelForm');
const listaImoveis = document.getElementById('listaImoveis');
const vendaImovelSelect = document.getElementById('vendaImovelSelect');
const aluguelImovelSelect = document.getElementById('aluguelImovelSelect');
const clienteImovelSelect = document.getElementById('clienteImovel');
const telefoneImovelInput = document.getElementById('telefoneImovel');

imovelForm.addEventListener('submit', e => {
  e.preventDefault();

  const file = fotoImovelInput.files[0];
  if (!file) return alert('Selecione uma foto para o imóvel.');

  const descricao = document.getElementById('descricaoImovel').value.trim();
  const valor = parseFloat(document.getElementById('valorImovel').value);
  const tipo = document.getElementById('tipoImovel').value;
  const nomeCliente = clienteImovelSelect.value.trim();
  const telefoneCliente = telefoneImovelInput.value.trim();

  if (!descricao || !valor || !tipo || !nomeCliente || !telefoneCliente) {
    return alert('Preencha todos os campos corretamente.');
  }

  const clienteExistente = clientes.find(c =>
    c.nome.toLowerCase() === nomeCliente.toLowerCase() &&
    c.telefone === telefoneCliente
  );

  if (!clienteExistente) {
    Swal.fire({
      icon: 'warning',
      title: 'Cliente não encontrado!',
      text: 'Por favor, cadastre o cliente antes de adicionar um imóvel.',
      confirmButtonColor: 'orange'
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const fotoDataUrl = e.target.result;
    const imovel = {
      id: Date.now(),
      foto: fotoDataUrl,
      descricao,
      valor,
      tipo,
      nomeCliente,
      telefoneCliente,
      vendido: false,
      alugado: false
    };
    imoveis.push(imovel);
    salvarDados();
    imovelForm.reset();
    imovelPreview.style.display = 'none';
    renderImoveis();
    atualizarSelects();
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Imóvel cadastrado com sucesso.',
      confirmButtonColor: '#3085d6'
    });
  };
  reader.readAsDataURL(file);
});
function renderImoveis() {
  listaImoveis.innerHTML = '';
  if(imoveis.length === 0) {
    listaImoveis.innerHTML = '<p>Nenhum imóvel cadastrado ainda.</p>';
    return;
  }
  imoveis.forEach(imovel => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${imovel.foto}" alt="Foto imóvel" />
      <p><strong>Descrição:</strong> ${imovel.descricao}</p>
      <p><strong>Valor:</strong> R$ ${imovel.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
      <p><strong>Tipo:</strong> ${imovel.tipo}</p>
      <p><strong>Cliente:</strong> ${imovel.nomeCliente}</p>
      <p><strong>Telefone:</strong> ${imovel.telefoneCliente}</p>
      <p><strong>Status:</strong> ${imovel.vendido ? 'Vendido' : imovel.alugado ? 'Alugado' : 'Disponível'}</p>
      <button class="botao-acao botao-editar" onclick="editarImovel(${imovel.id})">Editar</button>
      <button class="botao-acao botao-excluir" onclick="excluirImovel(${imovel.id})">Excluir</button>
    `;
    listaImoveis.appendChild(card);
  });
}

function excluirImovel(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Deseja realmente excluir este imóvel?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, excluir!'
  }).then((result) => {
    if (result.isConfirmed) {
      imoveis = imoveis.filter(im => im.id !== id);
      salvarDados();
      renderImoveis();
      atualizarSelects();
      Swal.fire('Excluído!', 'Imóvel removido com sucesso.', 'success');
    }
  });
}
function editarImovel(id) {
  const imovel = imoveis.find(im => im.id === id);
  if (!imovel) return;

  Swal.fire({
    title: 'Editar Imóvel',
    html: `
      <input id="editDescricao" class="swal2-input" placeholder="Descrição" value="${imovel.descricao}">
      <input id="editValor" class="swal2-input" type="number" placeholder="Valor" value="${imovel.valor}">
      <select id="editTipo" class="swal2-input">
        <option value="Venda" ${imovel.tipo === 'Venda' ? 'selected' : ''}>Venda</option>
        <option value="Aluguel" ${imovel.tipo === 'Aluguel' ? 'selected' : ''}>Aluguel</option>
      </select>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const descricao = document.getElementById('editDescricao').value.trim();
      const valor = parseFloat(document.getElementById('editValor').value);
      const tipo = document.getElementById('editTipo').value;

      if (!descricao || isNaN(valor) || valor <= 0 || !tipo) {
        Swal.showValidationMessage('Preencha todos os campos corretamente.');
        return false;
      }

      imovel.descricao = descricao;
      imovel.valor = valor;
      imovel.tipo = tipo;

      salvarDados();
      renderImoveis();
      atualizarSelects();

      Swal.fire('Editado!', 'Imóvel atualizado com sucesso.', 'success');
    }
  });
}


function atualizarSelects() {
  vendaImovelSelect.innerHTML = '<option value="" disabled selected>Selecione um imóvel disponível para venda</option>';
  imoveis.filter(im => im.tipo === 'Venda' && !im.vendido).forEach(im => {
    const option = document.createElement('option');
    option.value = im.id;
    option.textContent = `${im.descricao} - R$ ${im.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    vendaImovelSelect.appendChild(option);
  });

  aluguelImovelSelect.innerHTML = '<option value="" disabled selected>Selecione um imóvel disponível para aluguel</option>';
  imoveis.filter(im => im.tipo === 'Aluguel' && !im.alugado).forEach(im => {
    const option = document.createElement('option');
    option.value = im.id;
    option.textContent = `${im.descricao} - R$ ${im.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    aluguelImovelSelect.appendChild(option);
  });
}


function atualizarSelectClientes() {
  clienteImovelSelect.innerHTML = '<option value="">Selecione um cliente</option>';
  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.nome;
    option.textContent = cliente.nome;
    clienteImovelSelect.appendChild(option);
  });
}

clienteImovelSelect.addEventListener('change', () => {
  const nomeSelecionado = clienteImovelSelect.value;
  const cliente = clientes.find(c => c.nome === nomeSelecionado);
  telefoneImovelInput.value = cliente ? cliente.telefone : '';
});

// Vendas
const vendaForm = document.getElementById('vendaForm');
const listaVendas = document.getElementById('listaVendas');

vendaForm.addEventListener('submit', e => {
  e.preventDefault();
  const imovelId = parseInt(vendaImovelSelect.value);
  const imovel = imoveis.find(im => im.id === imovelId);
  if (!imovel || imovel.vendido) return alert('Imóvel inválido.');

  imovel.vendido = true;
  vendas.push({
    id: Date.now(),
    imovelId,
    descricao: imovel.descricao,
    valor: imovel.valor,
    cliente: imovel.nomeCliente,
    telefone: imovel.telefoneCliente,
    data: new Date().toLocaleDateString()
  });

  salvarDados();
  renderVendas();
  atualizarSelects();
  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Venda registrada com sucesso.',
    confirmButtonColor: '#3085d6'
  });
  vendaForm.reset();
});

function renderVendas() {
  listaVendas.innerHTML = '';
  if (vendas.length === 0) {
    listaVendas.innerHTML = '<p>Nenhuma venda registrada ainda.</p>';
    return;
  }
  vendas.forEach(venda => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Descrição:</strong> ${venda.descricao}</p>
      <p><strong>Valor:</strong> R$ ${venda.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
      <p><strong>Cliente:</strong> ${venda.cliente}</p>
      <p><strong>Telefone:</strong> ${venda.telefone}</p>
      <p><strong>Data da Venda:</strong> ${venda.data}</p>
      <button class="botao-acao botao-excluir" onclick="excluirVenda(${venda.id})">Excluir Registro</button>
    `;
    listaVendas.appendChild(card);
  });
}


const aluguelForm = document.getElementById('aluguelForm');
const listaAlugueis = document.getElementById('listaAlugueis');

aluguelForm.addEventListener('submit', e => {
  e.preventDefault();
  const imovelId = parseInt(aluguelImovelSelect.value);
  const imovel = imoveis.find(im => im.id === imovelId);
  if (!imovel || imovel.alugado) return alert('Imóvel inválido.');

  imovel.alugado = true;
  alugueis.push({
    id: Date.now(),
    imovelId,
    descricao: imovel.descricao,
    valor: imovel.valor,
    cliente: imovel.nomeCliente,
    telefone: imovel.telefoneCliente,
    data: new Date().toLocaleDateString()
  });

  salvarDados();
  renderAlugueis();
  atualizarSelects();
  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Aluguel registrado com sucesso.',
    confirmButtonColor: '#3085d6'
  });
  aluguelForm.reset();
});

function renderAlugueis() {
  listaAlugueis.innerHTML = '';
  if (alugueis.length === 0) {
    listaAlugueis.innerHTML = '<p>Nenhum aluguel registrado ainda.</p>';
    return;
  }
  alugueis.forEach(aluguel => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Descrição:</strong> ${aluguel.descricao}</p>
      <p><strong>Valor:</strong> R$ ${aluguel.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
      <p><strong>Cliente:</strong> ${aluguel.cliente}</p>
      <p><strong>Telefone:</strong> ${aluguel.telefone}</p>
      <p><strong>Data do Aluguel:</strong> ${aluguel.data}</p>
      <button class="botao-acao botao-excluir" onclick="excluirAluguel(${aluguel.id})">Excluir Registro</button>
    `;
    listaAlugueis.appendChild(card);
  });
}
renderClientes();
renderImoveis();
renderVendas();
renderAlugueis();
renderInventario(); 
atualizarSelects();

