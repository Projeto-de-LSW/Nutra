const loginCadastro = document.querySelector(".menu #logincadastro")
const usuario = localStorage.getItem('usuarioLogado')

if(usuario != null) {
    loginCadastro.style.display = 'none'
}