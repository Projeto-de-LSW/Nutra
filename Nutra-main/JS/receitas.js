//Aqui estão os botões e caixas
const modal = document.querySelector(".modal_adicionar_receita")
const btn_adicionar_receita = document.querySelector("#btn_adicionar_receita")
const btn_fechar_modal = document.querySelector("#fechar_modal")
const btn_salvar_receita = document.querySelector(".botao_salvar")
const formulario = document.querySelector("#formulario_receita")
const container_de_cards = document.getElementById("cards_receitas");
const titulo_editando = document.querySelector("#titulo_adicionar_receita")
const titulo_receita = document.querySelector("#titulo_receita")
const categoria_receita = document.querySelector("#categoria_receita")
const data_receita = document.querySelector("#data_receita")
const filtro_de_categoria = document.querySelector("#filtro_categoria")
const filtro_de_pesquisa = document.querySelector("#pesquisa")
const container_de_ordenacao = document.querySelector(".ordenacao")
const botoes_de_ordenacao = document.querySelectorAll(".ordenacao button")

//variaveis globais
let id_editando = null
let ordem_atual = null

//Aqui ele abre o modal quando clica
btn_adicionar_receita.addEventListener("click", () => {
  titulo_editando.textContent = "Adicionar Receita"

  //apenas para deixar o data do formulario já preenchido com a data de hoje
  const hoje = new Date();
  const ano_atual = hoje.getFullYear();
  const mes_atual = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia_atual = String(hoje.getDate()).padStart(2, '0');
  data_receita.value = `${ano_atual}-${mes_atual}-${dia_atual}`;

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
  if(validar_receita(titulo_receita.value, data_receita.value, categoria_receita.value)){
    alert("Coloque uma data maior ou igual a de hoje, titulos menores e escolha uma categoria!")
    return
  }
  //pega a lista de receitas do localStorage
  const lista_receitas = JSON.parse(localStorage.getItem("receitas")) || []

  //Se estiver editando é essa parte aqui
  if (id_editando !== null) {
    const indice = lista_receitas.findIndex(receita => receita.id === id_editando)

    //Só pra garantir se a receita existe mesmo né
    if (indice !== -1) {
      lista_receitas[indice].titulo = titulo_receita.value.trim()
      lista_receitas[indice].categoria = categoria_receita.value
      lista_receitas[indice].data = data_receita.value
    }

    id_editando = null
  } else {
    //Calcula o ID da receita se não estiver editando
    let id_proximo

    if(lista_receitas && lista_receitas.length > 0) {
      id_proximo = lista_receitas[lista_receitas.length - 1].id + 1
    } else {
      id_proximo = 1
    }

    //Adiciona os dados na receita
    const receita = {
      id: id_proximo,
      titulo: titulo_receita.value.trim(),
      categoria: categoria_receita.value,
      data: data_receita.value,
      curtidas: 0
    }
    
    //adiciona receita
    lista_receitas.push(receita)
    if (id_editando == null) {
      setTimeout(() => {
        alert("Receita Cadastrada com Sucesso!")
      }, 0);
    }
  }
  salvarReceitas(lista_receitas)

  //reseta o formulario e renderiza
  formulario.reset()
  renderizar_receitas()

  //fechar modal
  modal.classList.remove("ativo")
  document.body.classList.remove("modal_aberto")
});

container_de_cards.addEventListener("click", (event) => {
  const botao = event.target;

  if (botao.classList.contains("curtir")) {
    const card = botao.closest(".card_receita")
    const id = Number(card.dataset.id)

    curtir_receita(id)
  }

  if (botao.classList.contains("excluir")) {
    const card = botao.closest(".card_receita")
    const id = Number(card.dataset.id)

    excluir_receita(id)
  }

  if (botao.classList.contains("editar")) {
    const card = botao.closest(".card_receita")
    const id = Number(card.dataset.id)

    editar_receita(id)
  }
});

filtro_de_categoria.addEventListener("change", () => {
  renderizar_receitas()
})

filtro_de_pesquisa.addEventListener("input", () => {
  renderizar_receitas()
})

container_de_ordenacao.addEventListener("click", (event) => {
  const botao = event.target
  if (botao.tagName !== "BUTTON") return

  //aqui é só se o cara clicar de novo ele parar de ser ativo a ordenação
  if (botao.classList.contains("ativo")) {
    botao.classList.remove("ativo")
    ordem_atual = null
    renderizar_receitas()
    return
  }

  //tiro de todos o ativo de adiciona somente no botão clicado
  botoes_de_ordenacao.forEach(botao => botao.classList.remove("ativo"))
  botao.classList.add("ativo")
  ordem_atual = botao.dataset.ordem

  renderizar_receitas()
})

//salvar receita no localStorage
function salvarReceitas (receitas) {
  if(receitas !== null) {
      localStorage.setItem("receitas",JSON.stringify(receitas))
  }
}
//salvar os ids das curtidas
function salvarCurtidas (curtidas) {
  if(curtidas !== null) {
      localStorage.setItem("curtidas",JSON.stringify(curtidas))
  }
}
//valida a receita
function validar_receita (titulo, valor_data,categoria) {
  //true significa erro e false passou
  if(titulo.length >= 100) {
    return true
  }

  if(!categoria) {
    return true
  }

  //pega a data atual e a do card
  const data_atual = new Date()
  data_atual.setHours(0,0,0,0)
  //aqui ele pega o mes 12 mas o date só vai até 11 kkkk
  const [ano, mes, dia] = valor_data.split('-')
  const data_do_card = new Date(ano, mes-1, dia)

  if(data_do_card < data_atual) {
    return true
  }
  return false
}
//cria um novo card com a receita
function cria_card(receita) {
  const card = document.createElement("div")

  card.classList.add("card_receita")
  //colocar um id no card
  card.dataset.id = receita.id

  card.innerHTML = `<h3>${receita.titulo}</h3><p>Categoria: ${receita.categoria}</p><p>Data: ${receita.data}</p><p>Curtidas: <span class="curtidas">${receita.curtidas}</span></p><div class="botoes"><button class="curtir">Curtir</button><button class="excluir">Excluir</button><button class="editar">Editar</button></div>`

  return card;
}
//renderiza as receitas no html
function renderizar_receitas() {
  container_de_cards.innerHTML = ""

  let lista_receitas = JSON.parse(localStorage.getItem("receitas")) || []
  const categoria_selecionada = filtro_de_categoria.value
  const conteudo_do_filtro_de_pesquisa = filtro_de_pesquisa.value.toLowerCase()

  //Esse daqui é o filtro por categoria
  if (categoria_selecionada !== "") {
    lista_receitas = lista_receitas.filter(
      receita => receita.categoria === categoria_selecionada
    )
  }
  //Esse daqui é o filtro de pesquisa
  if (conteudo_do_filtro_de_pesquisa !== "") {
    lista_receitas = lista_receitas.filter(
      receita => receita.titulo.toLowerCase().includes(conteudo_do_filtro_de_pesquisa)
    )
  }

  //Esse daqui é o filtro por ranking
  if (ordem_atual === "nome") {
    lista_receitas.sort((a, b) =>
      a.titulo.localeCompare(b.titulo)
    )
  }

  if (ordem_atual === "data") {
    lista_receitas.sort((a, b) =>
      new Date(a.data) - new Date(b.data)
    )
  }

  if (ordem_atual === "curtidas") {
    lista_receitas.sort((a, b) => b.curtidas - a.curtidas)
  }

  lista_receitas.forEach(receita => {
    container_de_cards.appendChild(cria_card(receita))
  });
}
//exclui uma receita no localStorage e renderiza
function excluir_receita(id) {
  const receitas = JSON.parse(localStorage.getItem("receitas"))
  const receitas_menos_uma = receitas.filter(receita => receita.id !== id)
  const curtidas = JSON.parse(localStorage.getItem("curtidas")) || []
  const curtidas_menos_uma = curtidas.filter(id_curtida => id_curtida != id)

  salvarCurtidas(curtidas_menos_uma)
  salvarReceitas(receitas_menos_uma)
  renderizar_receitas()
  alert("Receita Excluida!")
}
//curti uma receita no localStorage e cria as curtidas e renderiza
function curtir_receita(id) {
  const receitas = JSON.parse(localStorage.getItem("receitas"))
  const curtidas = JSON.parse(localStorage.getItem("curtidas")) || []

  if(curtidas.includes(id)) {
    alert("Você já curtiu essa receita!")
    return
  } else {
    const receita = receitas.find(receita => receita.id === id)
    //verificar se receita existe
    if(receita) {
      receita.curtidas++
    }
  }

  curtidas.push(id)
  salvarCurtidas(curtidas)
  salvarReceitas(receitas)
  renderizar_receitas()
}
//edita a receita no localStorage e renderiza
function editar_receita(id) {
  const receitas = JSON.parse(localStorage.getItem("receitas"))
  const receita = receitas.find(receita => receita.id == id)

  //Garantir que a receita pegou mesmo
  if(!receita) {
    return
  }

  titulo_editando.textContent = "Editando..."
  document.querySelector("#titulo_receita").value = receita.titulo
  document.querySelector("#categoria_receita").value = receita.categoria
  document.querySelector("#data_receita").value = receita.data

  id_editando = id
  //abre o modal
  modal.classList.add("ativo")
  document.body.classList.add("modal_aberto")
}

//renderiza ao carregar a página
renderizar_receitas()
