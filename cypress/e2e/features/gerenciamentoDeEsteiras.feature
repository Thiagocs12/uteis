# language: pt

Funcionalidade: Gerenciamento de esteiras e suas Dependências

  Como um engenheiro de automação
  Eu quero copiar dados de esteiras e suas dependências de Produção para Homologação
  Para garantir que o ambiente de Homologação tenha dados consistentes para testes

  Cenário: Copiar e Sincronizar um Produto e suas Dependências
    Dado que o ID do produto principal a ser copiado é "*"
    E que a entidade principal é "MC_MOP_VINCULO_ESTEIRA"
    Quando os dados da entidade principal são copiados de Produção