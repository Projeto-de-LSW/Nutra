const modal = document.querySelector(".modal_adicionar_receita")
const btn_adicionar_receita = document.querySelector("#btn_adicionar_receita")
const btn_fechar_modal = document.querySelector("#fechar_modal")
const btn_salvar_receita = document.querySelector(".botao_salvar")
const formulario = document.querySelector("#formulario_receita")
const container_de_cards = document.getElementById("cards_receitas");

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

  //validação dos dados
  if(validar_receita(document.querySelector("#titulo_receita").value,data: document.querySelector("#data_receita").value)){
    alert("Coloque datas em 2025 ou titulos menores!")
  }
  
  //Calcula o ID da receita
  const lista_receitas = JSON.parse(localStorage.getItem("receitas")) || []
  let id_proximo

  if(lista_receitas && lista_receitas.length > 0) {
    id_proximo = lista_receitas[lista_receitas.length - 1].id + 1
  } else {
    id_proximo = 1
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

  //reseta o formulario e renderiza
  formulario.reset()
  renderizarReceitas()

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

function validar_receita (titulo, valor_data) {
  //true significa erro e false passou
  if(titulo.length > 50) {
    return true
  }

  const data = valor_data.split('-')
  if(data[0] < 2025) {
    return true
  }
  return false
}

function cria_card(receita) {
  const card = document.createElement("div")
  card.classList.add("card_receita")
  card.innerHTML = `<h3>${receita.titulo}</h3><p>Categoria: ${receita.categoria}</p><p>Data: ${receita.data}</p><p>Curtidas: <span class="curtidas">${receita.curtidas}</span></p><button class="curtir">Curtir</button>`

  let curtidasUsuario = JSON.parse(localStorage.getItem("curtidasUsuario")) || []
  
  card.querySelector(".curtir").addEventListener("click", () => {
    if (!curtidasUsuario.includes(receita.id)) {
      receita.curtidas++
      curtidasUsuario.push(receita.id)
      localStorage.setItem("curtidasUsuario", JSON.stringify(curtidasUsuario))
  
      const lista_receitas = JSON.parse(localStorage.getItem("receitas")) || []
      const index = lista_receitas.findIndex(receita_olhando => receita_olhando.id === receita.id)
      if (index !== -1) {
        lista_receitas[index] = receita
        salvarReceitas(lista_receitas)
      }
  
      renderizarReceitas()
    } else {
      alert("você já curtiu seu batata doce.")
    }
  });

  return card;
}

function renderizarReceitas() {
  container_de_cards.innerHTML = ""
  let lista_receitas = JSON.parse(localStorage.getItem("receitas"))

  if (!lista_receitas || lista_receitas.length === 0) {
    lista_receitas = [...receitas]
    localStorage.setItem("receitas", JSON.stringify(lista_receitas))
  }

  lista_receitas.forEach(r => {
    container_de_cards.appendChild(cria_card(r))
  });
}

// Renderiza ao carregar a página
renderizarReceitas()
