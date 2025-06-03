// Dados
let clientes = [];
let imoveis = [];
let vendas = [];
let alugueis = [];

// LocalStorage
function salvarDados() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
  localStorage.setItem('imoveis', JSON.stringify(imoveis));
  localStorage.setItem('vendas', JSON.stringify(vendas));
  localStorage.setItem('alugueis', JSON.stringify(alugueis));
}

function carregarDados() {
  clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  imoveis = JSON.parse(localStorage.getItem('imoveis')) || [];
  vendas = JSON.parse(localStorage.getItem('vendas')) || [];
  alugueis = JSON.parse(localStorage.getItem('alugueis')) || [];
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

const clienteForm = document.getElementById('clienteForm');
const listaClientes = document.getElementById('listaClientes');

clienteForm.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nomeCliente').value.trim();
  const telefone = document.getElementById('telefoneCliente').value.trim();
  if (!nome || !telefone) return alert('Preencha todos os campos.');

  if(clientes.some(c => c.nome.toLowerCase() === nome.toLowerCase() && c.telefone === telefone)) {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Cliente já cadastrado com esse nome e telefone. Por favor, verifique os dados.',
      confirmButtonColor: 'red'
    })
    return;
  }

  clientes.push({ nome, telefone });
  salvarDados();
  clienteForm.reset();
  renderClientes();
  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Cliente cadastrado com sucesso.',
    confirmButtonColor: '#3085d6'
  });
  

});

function renderClientes() {
  listaClientes.innerHTML = '';
  if(clientes.length === 0) {
    listaClientes.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
    return;
  }
  clientes.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Nome:</strong> ${c.nome}</p>
      <p><strong>Telefone:</strong> ${c.telefone}</p>
    `;
    listaClientes.appendChild(card);
  });
}

const fotoImovelInput = document.getElementById('fotoImovel');
const imovelPreview = document.getElementById('imovelPreview');

fotoImovelInput.addEventListener('change', () => {
  const file = fotoImovelInput.files[0];
  if(file) {
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

imovelForm.addEventListener('submit', e => {
  e.preventDefault();

  const file = fotoImovelInput.files[0];
  if(!file) return alert('Selecione uma foto para o imóvel.');

  const descricao = document.getElementById('descricaoImovel').value.trim();
  const valor = parseFloat(document.getElementById('valorImovel').value);
  const tipo = document.getElementById('tipoImovel').value;
  const nomeCliente = document.getElementById('clienteImovel').value.trim();
  const telefoneCliente = document.getElementById('telefoneImovel').value.trim();

  if(!descricao || !valor || !tipo || !nomeCliente || !telefoneCliente) {
    return alert('Preencha todos os campos corretamente.');
  }

  const clienteExistente = clientes.find(c =>
    c.nome.toLowerCase() === nomeCliente.toLowerCase() &&
    c.telefone === telefoneCliente
  );
  if(!clienteExistente) {
    Swal.fire({
      icon: 'warning',
      title: 'Cliente não encontrado!',
      text: 'Por favor, cadastre o cliente antes de adicionar um imóvel.',
      confirmButtonColor: 'orange'
    })
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
    `;
    listaImoveis.appendChild(card);
  });
}

function atualizarSelects() {
  vendaImovelSelect.innerHTML = '<option value="" disabled selected>Selecione um imóvel disponível para venda</option>';
  imoveis.filter(im => im.tipo === 'Venda' && !im.vendido).forEach(im => {
    const option = document.createElement('option');
    option.value = im.id;
    option.textContent = `${im.descricao} - R$ ${im.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    vendaImovelSelect.appendChild(option);
  });

  aluguelImovelSelect.innerHTML = '<option value="" disabled selected>Selecione um imóvel disponível para aluguel</option>';
  imoveis.filter(im => im.tipo === 'Aluguel' && !im.alugado).forEach(im => {
    const option = document.createElement('option');
    option.value = im.id;
    option.textContent = `${im.descricao} - R$ ${im.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    aluguelImovelSelect.appendChild(option);
  });
}

const vendaForm = document.getElementById('vendaForm');
const listaVendas = document.getElementById('listaVendas');

vendaForm.addEventListener('submit', e => {
  e.preventDefault();
  const imovelId = parseInt(vendaImovelSelect.value);
  if(!imovelId) return alert('Selecione um imóvel para venda.');

  const imovel = imoveis.find(im => im.id === imovelId);
  if(!imovel) return alert('Imóvel não encontrado.');
  if(imovel.vendido) return alert('Esse imóvel já foi vendido.');

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
  if(vendas.length === 0) {
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
    `;
    listaVendas.appendChild(card);
  });
}

const aluguelForm = document.getElementById('aluguelForm');
const listaAlugueis = document.getElementById('listaAlugueis');

aluguelForm.addEventListener('submit', e => {
  e.preventDefault();
  const imovelId = parseInt(aluguelImovelSelect.value);
  if(!imovelId) return alert('Selecione um imóvel para aluguel.');

  const imovel = imoveis.find(im => im.id === imovelId);
  if(!imovel) return alert('Imóvel não encontrado.');
  if(imovel.alugado) return alert('Esse imóvel já está alugado.');

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
    text: 'Aluguel Registrado com sucesso.',
    confirmButtonColor: '#3085d6'
  });
  aluguelForm.reset();
});

function renderAlugueis() {
  listaAlugueis.innerHTML = '';
  if(alugueis.length === 0) {
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
    `;
    listaAlugueis.appendChild(card);
  });
}


renderClientes();
renderImoveis();
renderVendas();
renderAlugueis();
atualizarSelects();