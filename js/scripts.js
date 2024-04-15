// VARIÁVEIS
const modal = document.querySelector('.modal-container');
const tableBody = document.querySelector('tbody');
const modalNome = document.querySelector('#modalNome');
const modalIdade = document.querySelector('#modalIdade');
const modalGenero = document.querySelector('#modalGenero');
const modalCep = document.querySelector('#modalCep');
const modalRua = document.querySelector('#modalRua');
const modalBairro = document.querySelector('#modalBairro');
const modalCidade = document.querySelector('#modalCidade');
const modalEstado = document.querySelector('#modalEstado');
const saveButton = document.querySelector('#saveButton');
let itens;
let id;

//SISTEMÁTICA ENVOLVENDO O MODAL, CASO TENHA INDEX, IRÁ RETORNAR OS DADOS DA LINHA NO QUAL PERTECE
function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = (e) => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    modalNome.value = itens[index].nome;
    modalIdade.value = itens[index].idade;
    modalGenero.value = itens[index].genero;
    modalCep.value = itens[index].cep;
    modalRua.value = itens[index].rua;
    modalBairro.value = itens[index].bairro;
    modalCidade.value = itens[index].cidade;
    modalEstado.value = itens[index].estado;
    id = index;
  } else {
    modalNome.value = '';
    modalIdade.value = '';
    modalGenero.value = '';
    modalCep.value = '';
    modalRua.value = '';
    modalBairro.value = '';
    modalCidade.value = '';
    modalEstado.value = '';
  }
}

// PERMITE EDITAR O ITEM PELO MODAL
function editItem(index) {
  openModal(true, index);
}

//OPÇÃO DE DELEÇÃO DO ITEM
function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

//INSERT DENTRO DA TR, COM BASE NOS DADOS INSERIDOS NO MODAL
function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.idade} anos</td>
    <td>${item.genero}</td>
    <td>${item.cep}</td>
    <td>${item.rua}</td>
    <td>${item.bairro}</td>
    <td>${item.cidade}</td>
    <td>${item.estado}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tableBody.appendChild(tr);
}

saveButton.onclick = (e) => {
  if (
    modalNome.value == '' ||
    modalIdade.value == '' ||
    modalGenero.value == '' ||
    modalCep.value == '' ||
    modalRua.value == '' ||
    modalBairro.value == '' ||
    modalCidade.value == '' ||
    modalEstado.value == ''
  ) {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = modalNome.value;
    itens[id].idade = modalIdade.value;
    itens[id].genero = modalGenero.value;
    itens[id].cep = modalCep.value;
    itens[id].rua = modalRua.value;
    itens[id].bairro = modalBairro.value;
    itens[id].cidade = modalCidade.value;
    itens[id].estado = modalEstado.value;
  } else {
    itens.push({
      nome: modalNome.value,
      idade: modalIdade.value,
      genero: modalGenero.value,
      cep: modalCep.value,
      rua: modalRua.value,
      bairro: modalBairro.value,
      cidade: modalCidade.value,
      estado: modalEstado.value,
    });
  }

  setItensBD();

  modal.classList.remove('active');
  loadItens();
  id = undefined;
};

//FAZ O CARREGAMENTO DO QUE EXISTE DENTRO DO LOCAL STORAGE
function loadItens() {
  itens = getItensBD();
  tableBody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

//REQUISIÇÕES PARA COM O LOCAL STORAGE (GET E POST)
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

loadItens();

//API DE CEP
function limpa_formulário_cep() {
  //Limpa valores do formulário de cep.
  modalRua.value = '';
  modalBairro.value = '';
  modalCidade.value = '';
  modalEstado.value = '';
}

function meu_callback(conteudo) {
  if (!('erro' in conteudo)) {
    //Atualiza os campos com os valores.
    modalRua.value = conteudo.logradouro;
    modalBairro.value = conteudo.bairro;
    modalCidade.value = conteudo.localidade;
    modalEstado.value = conteudo.uf;
  } //end if.
  else {
    //CEP não Encontrado.
    limpa_formulário_cep();
    alert('CEP não encontrado.');
  }
}

function pesquisacep(valor) {
  //Nova variável "cep" somente com dígitos.
  var cep = valor.replace(/\D/g, '');

  //Verifica se campo cep possui valor informado.
  if (cep != '') {
    //Expressão regular para validar o CEP.
    var validacep = /^[0-9]{8}$/;

    //Valida o formato do CEP.
    if (validacep.test(cep)) {
      //Preenche os campos com "..." enquanto consulta webservice.
      modalRua.value = '...';
      modalBairro.value = '...';
      modalCidade.value = '...';
      modalEstado.value = '...';

      //Cria um elemento javascript.
      var script = document.createElement('script');

      //Sincroniza com o callback.
      script.src =
        'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

      //Insere script no documento e carrega o conteúdo.
      document.body.appendChild(script);
    } //end if.
    else {
      //cep é inválido.
      limpa_formulário_cep();
      alert('Formato de CEP inválido.');
    }
  } //end if.
  else {
    //cep sem valor, limpa formulário.
    limpa_formulário_cep();
  }
}

//VALIDAR CAMPOS DO FORM
function validaNumber() {
  let str = modalCep.value;
  str = str.replace(/\D/g, '');
  modalCep.value = str;
}
