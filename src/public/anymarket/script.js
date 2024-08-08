document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const tabelaResponse = document.getElementById('tabelaResponse');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.innerHTML = '<p>Carregando...</p>';
  loadingIndicator.style.display = 'none'; // Inicialmente oculto

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Exibir o indicador de "loading" e limpar a tela
    tabelaResponse.innerHTML = '';
    tabelaResponse.appendChild(loadingIndicator);
    loadingIndicator.style.display = 'block'; // Mostrar o indicador de "loading"

    // Aplicar a classe de animação de piscar
    loadingIndicator.classList.add('blink');

    // Crie um objeto FormData para enviar o arquivo
    const formData = new FormData(form);

    // Faça uma requisição AJAX para enviar o arquivo
    fetch('/upload-xls-any', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Processar a resposta e criar a tabela
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        // Crie o cabeçalho da tabela com base nas chaves do JSON
        const thead = document.createElement('thead');
        const thRow = document.createElement('tr');

        for (const key in data[0]) {
          if (data[0].hasOwnProperty(key)) {
            const th = document.createElement('th');
            th.textContent = key;
            thRow.appendChild(th);
          }
        }

        thead.appendChild(thRow);
        table.appendChild(thead);

        // Crie o corpo da tabela com base nos dados do JSON
        const tbody = document.createElement('tbody');

        data.forEach((item) => {
          const tr = document.createElement('tr');
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              const td = document.createElement('td');
              td.textContent = item[key];
              tr.appendChild(td);
            }
          }
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        // Limpe qualquer conteúdo anterior da div e adicione a nova tabela
        tabelaResponse.innerHTML = '';
        tabelaResponse.appendChild(table);

        // Ocultar o indicador de "loading" quando a resposta for recebida
        loadingIndicator.style.display = 'none';
        // Remover a classe de animação
        loadingIndicator.classList.remove('blink');
      })
      .catch((error) => {
        console.error('Erro:', error);
        tabelaResponse.innerHTML = '<p>Ocorreu um erro ao processar a requisição.</p>';
        // Ocultar o indicador de "loading" em caso de erro
        loadingIndicator.style.display = 'none';
        // Remover a classe de animação em caso de erro
        loadingIndicator.classList.remove('blink');
      });
  });
});
