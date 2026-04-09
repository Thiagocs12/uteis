// cypress/support/e2e.js
import './commands' // Agora, apenas importa o commands.js que orquestra tudo

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