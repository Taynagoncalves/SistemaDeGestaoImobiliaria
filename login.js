

  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user && pass) {
      localStorage.setItem('usuarioLogado', user);
      window.location.href = 'sistema.html';
    } else {
      alert('Preencha todos os campos!');
    }
  });

