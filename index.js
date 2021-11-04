window.addEventListener('load', start);

let formLogin = null;
let inputLogin = null;
let inputSenha = null;
let botaoEntrar = null;
let botaoCadastrar = null;
let divFilters = null;
let inputName = null;
let inputDOB = null;
let inputNat = null;
let inputGender = null;
let botaoConsultar = null;
let token = null;

function start() {
  formLogin = document.querySelector('form');
  inputLogin = document.getElementById('inputLogin');
  inputSenha = document.getElementById('inputSenha');
  botaoEntrar = document.getElementById('formLoginBotao');
  botaoCadastrar = document.getElementById('cadastreSe');
  preventFormSubmit();
  login();
}

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  formLogin.addEventListener('submit', handleFormSubmit);
}

function reload() {
  document.location.reload(true);
}

function login() {
  function formCadastro() {
    const botaoCadastro = botaoEntrar.cloneNode(true);
    botaoCadastro.setAttribute('id', 'formCadastrarBotao');
    botaoCadastro.textContent = 'Cadastrar';
    botaoEntrar.remove();
    formLogin.insertBefore(botaoCadastro, document.querySelector('.separador'));
    botaoCadastro.addEventListener('click', postCadastro);
    document.querySelector('.cadastre-se').innerHTML =
      'Já possui uma conta? <a id="login" href="#">Entrar</a>';
    document.getElementById('login').addEventListener('click', reload);
    clearSuccess();
  }
  document.getElementById('cadastreSe').addEventListener('click', () => {
    !document.getElementById('formCadastrarBotao') && formCadastro();
  });
  botaoEntrar.addEventListener('click', postLogin);
}

function validarCampos() {
  if (!inputLogin.value) {
    showResults(['erro', 'Digite o usuário.']);
    inputLogin.classList.add('erroLogin');
    inputLogin.focus();
    inputSenha.classList.remove('erroLogin');
    return false;
  } else if (!inputSenha.value) {
    showResults(['erro', 'Digite a senha.']);
    inputSenha.classList.add('erroLogin');
    inputSenha.focus();
    inputLogin.classList.remove('erroLogin');
    return false;
  } else {
    inputLogin.classList.remove('erroLogin');
    inputSenha.classList.remove('erroLogin');
    return true;
  }
}

async function postCadastro() {
  if (validarCampos()) {
    try {
      const response = await axios.post('https://reqres.in/api/register', {
        email: inputLogin.value,
        password: inputSenha.value,
      });
      showResults([
        'sucesso',
        `Usuário ${inputLogin.value} cadastrado com sucesso.`,
      ]);
      token = response.data.token;
      randomUser();
      clearSuccess();
    } catch (error) {
      clear();
      showResults(['erro', 'Erro ao cadastrar usuário.']);
      inputLogin.classList.add('erroLogin');
    } finally {
      inputLogin.focus();
    }
  }
}

async function postLogin() {
  if (validarCampos()) {
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        // Login adiquerido pelo site:'eve.holt@reqres.in',
        // Senha adquerida pelo site: 'cityslicka',
        // Somente para validação.
        email: inputLogin.value,
        password: inputSenha.value,
      });
      showResults([
        'sucesso',
        `Usuário ${inputLogin.value} logado com sucesso.`,
      ]);
      token = response.data.token;
      randomUser();
      clearSuccess();
    } catch (error) {
      clear();
      showResults(['erro', 'Usuário e/ou senha incorretos.']);
      inputLogin.classList.add('erroLogin');
    } finally {
      clear();
      inputLogin.focus();
    }
  }
}

function clear() {
  inputLogin.value = '';
  inputSenha.value = '';
  inputLogin.classList.remove('erroLogin');
  inputSenha.classList.remove('erroLogin');
}

function clearSuccess() {
  clear();
  document.querySelector('.separador').remove();
  document.querySelector('.entrar-com-facebook').remove();
  document.querySelector('.esqueceu-senha').remove();
}

function createFiltes() {
  inputName = inputLogin.cloneNode(true);
  inputName.setAttribute('id', 'inputName');
  inputName.placeholder = 'Digite o primeiro nome';
  inputName.classList.add('filter');
  inputName.value = null;

  inputDOB = inputLogin.cloneNode(true);
  inputDOB.setAttribute('id', 'inputDOB');
  inputDOB.placeholder = 'Digite a data de nascimento';
  inputDOB.value = null;
  inputDOB.setAttribute('type', 'date');
  inputDOB.addEventListener('blur', () => {
    inputDOB.setAttribute('type', 'text');
  });
  inputDOB.addEventListener('focus', () => {
    inputDOB.setAttribute('type', 'date');
  });
  inputDOB.classList.add('filter');

  inputNat = document.createElement('select');
  inputNat.setAttribute('id', 'inputNat');
  inputNat.classList.add('filter');
  inputNat.innerHTML = `
  <option value=null>Selecione a nacionalidade</option>
  <option value="AU">AU</option>
  <option value="BR">BR</option>
  <option value="CA">CA</option>
  <option value="CH">CH</option>
  <option value="DE">DE</option>
  <option value="DK">DK</option>
  <option value="ES">ES</option>
  <option value="FI">FI</option>
  <option value="FR">FR</option>
  <option value="GB">GB</option>
  <option value="IE">IE</option>
  <option value="IR">IR</option>
  <option value="NO">NO</option>
  <option value="NL">NL</option>
  <option value="NZ">NZ</option>
  <option value="TR">TR</option>
  <option value="US">US</option>`;

  inputGender = document.createElement('select');
  inputGender.setAttribute('id', 'inputGender');
  inputGender.classList.add('filter');
  inputGender.innerHTML = `
  <option value=null>Selecione o gênero</option>
  <option value="male">Masculino</option>
  <option value="female">Feminino</option>`;

  divFilters = document.createElement('div');
  divFilters.setAttribute('id', 'divFilters');
  divFilters.classList.add('formFilters');

  divFilters.appendChild(inputNat);
  divFilters.appendChild(inputGender);
}

function randomUser() {
  createFiltes();
  botaoConsultar = botaoEntrar.cloneNode(true);
  botaoConsultar.setAttribute('id', 'formConsultarBotao');
  botaoConsultar.textContent = 'Consultar';
  botaoEntrar.remove();
  formLogin.insertBefore(botaoConsultar, inputSenha);
  inputSenha.remove();
  inputLogin.remove();
  document.querySelector('.cadastre-se').innerHTML =
    'Deseja finalizar a sessão? <a id="logout" href="#">Sair</a>';
  document.getElementById('logout').addEventListener('click', reload);
  botaoConsultar.addEventListener('click', getUser);
  formLogin.insertBefore(divFilters, botaoConsultar);
}

function filterResults(results) {
  let dataForm = null;
  if (inputDOB.value) {
    const data = new Date(inputDOB.value);
    dataForm =
      //prettier-ignore
      (data.getDate() + 1) +
      '/' +
      (data.getMonth() + 1) +
      '/' +
      data.getFullYear();
  }
  if (inputName.value && inputDOB.value) {
    const filtered = results.filter((res) => {
      const dataRes = formatData(res.dob.date);
      return inputName.value === res.name.first && dataRes === dataForm;
    });
    !filtered.length && filtered.push('Nenhum resultado encontrado.');
    showResults(filtered);
  } else if (inputName.value || inputDOB.value) {
    const filtered = results.filter((res) => {
      const dataRes = formatData(res.dob.date);
      return inputName.value === res.name.first || dataRes === dataForm;
    });
    !filtered.length && filtered.push('Nenhum resultado encontrado.');
    showResults(filtered);
  } else {
    showResults(results);
  }
}

function filterUsers(results) {
  const botaoFiltrar = botaoConsultar.cloneNode(true);
  botaoFiltrar.setAttribute('id', 'formFiltrarBotao');
  botaoFiltrar.textContent = 'Filtrar';
  botaoFiltrar.addEventListener('click', () => filterResults(results));
  formLogin.insertBefore(botaoFiltrar, botaoConsultar);
  botaoConsultar.remove();
  divFilters.appendChild(inputName);
  divFilters.appendChild(inputDOB);
  inputGender.remove();
  inputNat.remove();
}

async function getUser() {
  let results = [];
  try {
    const response = await axios.get('https://randomuser.me/api/', {
      params: {
        results: 20,
        nat: inputNat.value ? inputNat.value : null,
        gender: inputGender.value ? inputGender.value : null,
      },
    });
    response.data.results &&
      response.data.results.forEach((pessoa) => {
        results.push(pessoa);
      });
    filterUsers(results);
  } catch (error) {
    results.push('Desculpe, não foi possível realizar essa ação.');
  } finally {
    showResults(results);
  }
}

function formatData(dateISO) {
  const data = new Date(dateISO);
  return (
    data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear()
  );
}

function showResults(results) {
  const imgSmartphone = document.querySelector('.smartphone-demonstracao img');
  const smartphone = document.querySelector('.smartphone-demonstracao');
  const layout = document.createElement('h1');
  layout.classList.add('smartphone-result');
  const result = document.createElement('h1');
  result.classList.add('smartphone-result-text');
  document.querySelector('.smartphone-demonstracao h1') &&
    document.querySelector('.smartphone-demonstracao h1').remove();
  imgSmartphone && imgSmartphone.remove();
  Array.isArray(results) && results[0] !== 'erro' && results[0] !== 'sucesso'
    ? results.forEach((res, i) => {
        i === 0 && (result.innerHTML = 'Resultados');
        const li = document.createElement('li');
        if (res.name) {
          const dataFormatada = formatData(res.dob.date);
          li.innerHTML = `
          ${res.name.first} ${res.name.last}
          <p class="text-result">Nacionalidade: ${res.nat}</p>
          <p class="text-result">Data de Nascimento: ${dataFormatada}</p>
          <p class="text-result">Telefone: ${res.phone}</p>`;
          li.style.listStyleImage = `url('${res.picture.thumbnail}')`;
        } else {
          li.innerHTML = res;
        }
        result.appendChild(li);
      })
    : alert(result, results);
  layout.appendChild(result);
  smartphone.appendChild(layout);
}

function alert(result, messages) {
  if (messages[0] === 'erro') {
    result.innerHTML = 'Algo deu errado!';
    const li = document.createElement('li');
    result.classList.add('error');
    li.innerHTML = messages[1];
    result.appendChild(li);
  } else {
    result.innerHTML = 'Sucesso!';
    const li = document.createElement('li');
    result.classList.add('success');
    li.innerHTML = messages[1];
    result.appendChild(li);
  }
}
