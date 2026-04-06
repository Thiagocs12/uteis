# language: pt

Funcionalidade: Gerenciamento de Produtos e suas Dependências

  Como um engenheiro de automação
  Eu quero copiar dados de produtos e suas dependências de Produção para Homologação
  Para garantir que o ambiente de Homologação tenha dados consistentes para testes

  Cenário: Copiar e Sincronizar um Produto e suas Dependências
    Dado que o ID do produto principal a ser copiado é "*"
    E que a entidade principal é "MC_CAD_PRODUTO"
    Quando os dados da entidade principal são copiados de Produção
    E as dependências do produto são copiadas de Produção
    E os IDs de Homologação são pesquisados e atualizados nos arquivos JSON para entidades de nível primário
    E as tabelas de nível de dependência 1 são processadas
    E as tabelas de nível de dependência 2 são processadas
    E as tabelas de nível de dependência 3 são processadas
    E as tabelas de nível de dependência 4 são processadas
    E as tabelas de nível de dependência 5 são processadas
    Então todos os dados do produto e suas dependências devem estar sincronizados em Homologação
