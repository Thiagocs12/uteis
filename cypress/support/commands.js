// cypress/support/commands.js

// Importa os helpers que são usados pelos comandos
import './db_helpers';
import './json_helpers';
import './object_helpers';

// Importa e registra os comandos de banco de dados
import './db_commands';

// Importa e registra os comandos de manipulação de JSON
import './json_commands';

// Importa e registra os comandos de API
import './api_commands';

// Este arquivo agora apenas importa outros comandos e helpers.
// Não deve conter implementações diretas de comandos Cypress.