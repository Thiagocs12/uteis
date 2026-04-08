import './commands'
import './db_helpers'
import './json_helpers'
import './object_helpers'
import './utils'

Cypress.on('uncaught:exception', (err) => {

  const errosParaIgnorar = [
    'Cannot read properties of undefined (reading \'content\')',
    'Request failed with status code 400',
    'Request failed with status code 404',
    'Request failed with status code 406',
    'Request failed with status code 500',
    'Request failed with status code 502',
    'Network Error',
    'null',
    'Script error'
  ];

  const deveIgnorar = errosParaIgnorar.some(mensagem => err.message.includes(mensagem));

  if (deveIgnorar) {
    Cypress.log({
      name: 'uncaught:exception',
      message: `Erro de aplicação suprimido: ${err.message}`,
      consoleProps: () => ({ error: err }),
    });
    return false;
  }

  return true;
});