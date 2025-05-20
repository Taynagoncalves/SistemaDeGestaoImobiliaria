
document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('registerUser').value;
    const pass = document.getElementById('registerPass').value;
  
    let users = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (users.find(u => u.user === user)) {
      alert('Usuário já existe!');
      return;
    }
  
    users.push({ user, pass });
    localStorage.setItem('usuarios', JSON.stringify(users));
    alert('Cadastro realizado com sucesso!');
    e.target.reset();
  });
  
  // Login
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
  
    const users = JSON.parse(localStorage.getItem('usuarios')) || [];
    const found = users.find(u => u.user === user && u.pass === pass);
  
    if (found) {
      alert('Login bem-sucedido!');
      window.location.href = "sistema.html";
    } else {
      alert('Usuário ou senha inválidos!');
    }
  });
  