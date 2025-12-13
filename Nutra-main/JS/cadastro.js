function cadastrarUsuario(event) {
  if (event) event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmar-senha").value;

  if (!nome || !email || !senha || !confirmar) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmar) {
    alert("As senhas não coincidem.");
    return;
  }

  let lista = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existe = lista.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existe) {
    alert("E-mail já cadastrado!");
    return;
  }

  const usuario = { nome, email, senha };
  lista.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(lista));

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("cadastroForm");
  if (form) {
    form.addEventListener("submit", cadastrarUsuario);
  } else {
    const btn = document.getElementById("btnCadastrar");
    if (btn) btn.addEventListener("click", cadastrarUsuario);
  }
});
