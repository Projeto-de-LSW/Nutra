const receitas =  [
 { id: 1, titulo: 'Salada Detox', categoria: 'Perda de Gordura', data: '2025-05-01', curtidas: 0 },
 { id: 2, titulo: 'Frango com Batata Doce', categoria: 'Ganho de Massa', data: '2025-06-10',curtidas: 2}
]

const modal = document.querySelector(".modal_adicionar_receita")
const btn_adicionar_receita = document.querySelector("#btn_adicionar_receita")
const btn_fechar_modal = document.querySelector("#fechar_modal")
const btn_salvar_receita = document.querySelector(".botao_salvar")
const formulario = document.querySelector("#formulario_receita")

//Aqui ele abre o modal quando clica
btn_adicionar_receita.addEventListener("click", () => {
  modal.classList.add("ativo")
  document.body.classList.add("modal_aberto")
});

//Aqui ele fecha o modal quando clica
btn_fechar_modal.addEventListener("click", () => {
  modal.classList.remove("ativo")
  document.body.classList.remove("modal_aberto")
});

formulario.addEventListener("submit", (event) => {
  event.preventDefault()

  //Calcula o ID da receita
  const lista_receitas = JSON.parse(localStorage.getItem("receitas")) || [...receitas]
  let id_proximo

  if(lista_receitas !== null) {
    id_proximo = lista_receitas.length + 1
  }
  const receita = {
    id: id_proximo,
    titulo: document.querySelector("#titulo_receita").value.trim(),
    categoria: document.querySelector("#categoria_receita").value,
    data: document.querySelector("#data_receita").value,
    curtidas: 0
  }
  
  //adiciona receita
  lista_receitas.push(receita)
  salvarReceitas(lista_receitas)
  //reseta o formulario
  formulario.reset()

  //fechar modal
  modal.classList.remove("ativo")
  document.body.classList.remove("modal_aberto")
});

//salvar receita no localStorage
function salvarReceitas (receitas) {
  if(receitas !== null) {
      localStorage.setItem("receitas",JSON.stringify(receitas))
  }
}

//renderiza as receitas como cards no HTML

