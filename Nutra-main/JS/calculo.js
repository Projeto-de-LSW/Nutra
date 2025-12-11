document.addEventListener('DOMContentLoaded', function() {
  const alturaInput = document.getElementById('altura');
  const pesoInput = document.getElementById('peso');
  const btn = document.getElementById('calcular-imc');
  const resultadoDiv = document.getElementById('imc-resultado');

  function classificaIMC(imc) {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau I';
    if (imc < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  }

  btn.addEventListener('click', function() {
    const altura = alturaInput.value.replace(',', '.').trim();
    const peso = pesoInput.value.replace(',', '.').trim();

    if (!altura || !peso) {
      resultadoDiv.style.display = 'block';
      resultadoDiv.style.color = '#d32f2f';
      resultadoDiv.textContent = 'Por favor, preencha ambos os campos.';
      return;
    }
    if (isNaN(altura) || isNaN(peso)) {
      resultadoDiv.style.display = 'block';
      resultadoDiv.style.color = '#d32f2f';
      resultadoDiv.textContent = 'Digite apenas números válidos.';
      return;
    }
    const alturaNum = parseFloat(altura) / 100;
    const pesoNum = parseFloat(peso);
    if (alturaNum <= 0 || pesoNum <= 0) {
      resultadoDiv.style.display = 'block';
      resultadoDiv.style.color = '#d32f2f';
      resultadoDiv.textContent = 'Valores devem ser maiores que zero.';
      return;
    }
    const imc = pesoNum / (alturaNum * alturaNum);
    const classificacao = classificaIMC(imc);
    resultadoDiv.style.display = 'block';
    resultadoDiv.style.color = '#222';
    resultadoDiv.innerHTML = `Seu IMC é <strong>${imc.toFixed(1)}</strong> — <span style="color:#0077cc;font-weight:bold">${classificacao}</span>`;
  });
});