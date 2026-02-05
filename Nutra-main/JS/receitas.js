// ---------------------------
// ELEMENTOS DO DOM
// ---------------------------
const modal = document.querySelector('.modal_adicionar_receita');
const btnAdicionarReceita = document.querySelector('#btn_adicionar_receita');
const btnFecharModal = document.querySelector('#fechar_modal');
const formulario = document.querySelector('#formulario_receita');
const containerDeCards = document.getElementById('cards_receitas');
const tituloEditando = document.querySelector('#titulo_adicionar_receita');
const tituloReceita = document.querySelector('#titulo_receita');
const categoriaReceita = document.querySelector('#categoria_receita');
const dataReceita = document.querySelector('#data_receita');
const filtroDeCategoria = document.querySelector('#filtro_categoria');
const filtroDePesquisa = document.querySelector('#pesquisa');
const containerDeOrdenacao = document.querySelector('.ordenacao');
const botoesDeOrdenacao = document.querySelectorAll('.ordenacao button');

const API_URL = 'http://localhost:3000/receitas';

// ---------------------------
// VARIÁVEIS GLOBAIS
// ---------------------------
let idEditando = null;
let ordemAtual = null;

// ---------------------------
// ABRIR MODAL
// ---------------------------
btnAdicionarReceita.addEventListener('click', () => {
	tituloEditando.textContent = 'Adicionar Receita';

	tituloReceita.value = '';
	categoriaReceita.value = '';

	const hoje = new Date();
	const ano = hoje.getFullYear();
	const mes = String(hoje.getMonth() + 1).padStart(2, '0');
	const dia = String(hoje.getDate()).padStart(2, '0');
	dataReceita.value = `${ano}-${mes}-${dia}`;

	idEditando = null;
	modal.classList.add('ativo');
	document.body.classList.add('modal_aberto');
});

// ---------------------------
// FECHAR MODAL
// ---------------------------
btnFecharModal.addEventListener('click', () => {
	modal.classList.remove('ativo');
	document.body.classList.remove('modal_aberto');
});

// ---------------------------
// VALIDAÇÃO
// ---------------------------
function validarReceita(titulo, valorData, categoria) {
	if (titulo.length >= 100) return true;
	if (!categoria) return true;

	const dataAtual = new Date();
	dataAtual.setHours(0, 0, 0, 0);

	const [ano, mes, dia] = valorData.split('-');
	const dataReceitaCard = new Date(ano, mes - 1, dia);

	return dataReceitaCard < dataAtual;
}

// ---------------------------
// CURTIR RECEITA
// ---------------------------
async function curtirReceita(id) {
	try {
		// Pega a receita
		const res = await fetch(`${API_URL}/${id}`);
		if (!res.ok) throw new Error('Receita não encontrada');
		const receita = await res.json();

		// Verifica se já curtiu
		if (receita.curtido) {
			alert('Você já curtiu esta receita!');
			return;
		}

		// Atualiza curtidas e marca como curtido
		const updateRes = await fetch(`${API_URL}/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				curtidas: (receita.curtidas || 0) + 1,
				curtido: true,
			}),
		});

		if (!updateRes.ok) throw new Error('Não foi possível atualizar curtidas');
		alert('Curtiu Receita!');
		renderizarReceitas();
	} catch (err) {
		console.error(err);
	}
}

// ---------------------------
// EXCLUIR RECEITA
// ---------------------------
async function excluirReceita(id) {
	try {
		const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
		if (!res.ok) throw new Error('Não foi possível excluir');

		alert('Receita excluída!');
		renderizarReceitas();
	} catch (err) {
		console.error(err);
		alert('Erro ao excluir receita');
	}
}

// ---------------------------
// RENDERIZAR RECEITAS
// ---------------------------
async function renderizarReceitas() {
	try {
		const res = await fetch(API_URL);
		if (!res.ok) throw new Error('Falha ao carregar receitas');

		let receitasFiltradas = await res.json();

		// FILTRO POR CATEGORIA
		if (filtroDeCategoria.value) {
			receitasFiltradas = receitasFiltradas.filter(
				(r) => r.categoria === filtroDeCategoria.value
			);
		}

		// FILTRO POR PESQUISA
		if (filtroDePesquisa.value) {
			const pesquisa = filtroDePesquisa.value.toLowerCase();
			receitasFiltradas = receitasFiltradas.filter((r) =>
				r.titulo.toLowerCase().includes(pesquisa)
			);
		}

		// ORDENACAO
		if (ordemAtual) {
			if (ordemAtual === 'data') {
				receitasFiltradas.sort((a, b) => new Date(a.data) - new Date(b.data));
			} else if (ordemAtual === 'nome') {
				receitasFiltradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
			} else if (ordemAtual === 'curtidas') {
				receitasFiltradas.sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0));
			}
		}

		containerDeCards.innerHTML = '';

		receitasFiltradas.forEach((receita) => {
			const card = document.createElement('div');
			card.className = 'card_receita';
			card.dataset.id = receita.id;

			card.innerHTML = `
        <h3>${receita.titulo}</h3>
        <p>Categoria: ${receita.categoria}</p>
        <p>Data: ${receita.data}</p>
        <p>Curtidas: <span class="curtidas">${receita.curtidas || 0}</span></p>
        <div class="botoes">
          <button class="curtir" data-id="${receita.id}">Curtir</button>
          <button class="excluir" data-id="${receita.id}">Excluir</button>
          <button class="editar" data-id="${receita.id}">Editar</button>
        </div>
      `;

			containerDeCards.appendChild(card);
		});

		// EVENTOS DOS BOTOES
		document
			.querySelectorAll('.curtir')
			.forEach((btn) =>
				btn.addEventListener('click', () => curtirReceita(btn.dataset.id))
			);

		document
			.querySelectorAll('.excluir')
			.forEach((btn) =>
				btn.addEventListener('click', () => excluirReceita(btn.dataset.id))
			);

		document
			.querySelectorAll('.editar')
			.forEach((btn) =>
				btn.addEventListener('click', () => editarReceita(btn.dataset.id))
			);
	} catch (error) {
		console.error('Erro ao renderizar receitas:', error);
	}
}

// ---------------------------
// FORMULÁRIO SUBMIT
// ---------------------------
formulario.addEventListener('submit', async (event) => {
	event.preventDefault();

	if (
		validarReceita(tituloReceita.value, dataReceita.value, categoriaReceita.value)
	) {
		alert(
			'Coloque uma data maior ou igual a de hoje, títulos menores e escolha uma categoria!'
		);
		return;
	}

	try {
		let receitaDados = {
			titulo: tituloReceita.value.trim(),
			categoria: categoriaReceita.value,
			data: dataReceita.value,
			curtidas: 0,
		};

		if (idEditando) {
			// Mantém curtidas e curtido ao editar
			const res = await fetch(`${API_URL}/${idEditando}`);
			const receitaAtual = await res.json();
			receitaDados.curtidas = receitaAtual.curtidas || 0;
			receitaDados.curtido = receitaAtual.curtido || false; // <-- preserva a flag

			await fetch(`${API_URL}/${idEditando}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(receitaDados),
			});

			idEditando = null;
		} else {
			await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(receitaDados),
			});
			alert('Receita cadastrada com sucesso!');
		}

		formulario.reset();
		modal.classList.remove('ativo');
		document.body.classList.remove('modal_aberto');
		renderizarReceitas();
	} catch (err) {
		console.error(err);
		alert('Erro ao salvar receita');
	}
});

// ---------------------------
// EDITAR RECEITA
// ---------------------------
async function editarReceita(id) {
	try {
		const response = await fetch(`${API_URL}/${id}`);
		const receita = await response.json();
		if (!receita) return;

		tituloEditando.textContent = 'Editando...';
		tituloReceita.value = receita.titulo;
		categoriaReceita.value = receita.categoria;
		dataReceita.value = receita.data;

		idEditando = id;
		modal.classList.add('ativo');
		document.body.classList.add('modal_aberto');
	} catch (error) {
		console.error('Erro ao buscar receita para editar:', error);
	}
}

// ---------------------------
// FILTROS E ORDENAÇÃO
// ---------------------------
filtroDeCategoria.addEventListener('change', renderizarReceitas);
filtroDePesquisa.addEventListener('input', renderizarReceitas);

containerDeOrdenacao.addEventListener('click', (event) => {
	const botao = event.target;
	if (botao.tagName !== 'BUTTON') return;

	if (botao.classList.contains('ativo')) {
		botao.classList.remove('ativo');
		ordemAtual = null;
		renderizarReceitas();
		return;
	}

	botoesDeOrdenacao.forEach((b) => b.classList.remove('ativo'));
	botao.classList.add('ativo');
	ordemAtual = botao.dataset.ordem;

	renderizarReceitas();
});

// ---------------------------
// INICIALIZAÇÃO
// ---------------------------
renderizarReceitas();
