const criarCONTA = document.getElementById('criar');

criarCONTA.addEventListener('click', function() {
    window.location.href = '/Pages/cadastro.html';
});

function fazerLogin() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  let lista = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = lista.find(u => u.email === email && u.senha === senha);
  
  if (usuarioEncontrado) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    window.location.href = '../index.html';
  } else {
    localStorage.removeItem("usuarioLogado");
    alert("Email ou senha incorretos!");
  }
}

document.getElementById("entrar").addEventListener("click", function(event) {
  event.preventDefault();
  fazerLogin();
});