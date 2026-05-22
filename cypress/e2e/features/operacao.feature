# language: pt

@atual
Funcionalidade: Adicionar e finalizar esteiras de operação

  Como um engenheiro de automação
  Desejo avançar as etapas de uma esteira até o final
  Para que possa fazer isso em lote quando necessário

  Contexto: Criação da operação
    Dado que possuo acesso aos ambientes necessarios
    E que possuo uma lista arquivos para subir esteiras de operação
    Quando crio a operação

  Esquema do Cenário: Avançar esteira até o fim
    Dado que possuo uma operação no backoffice
    Quando realizo o avanco da etapa "<etapa>"
    Então realizo as seguintes "<validacoes>"

    Exemplos:
      | tipoEsteira | etapa              | validacoes         |
    #  | operacao    | Distribuição       | Distribuição       |
    #  | operacao    | Analise de Crédito | Analise de Crédito |
    #  | operacao    | Comitê de Crédito  | Comitê de Crédito  |

  Esquema do Cenário: Verificar se as esteiras foram finalizadas
    Dado que possuo uma lista de ids de esteiras que preciso finalizar de esteira de "<tipoEsteira>"
    Quando consulto o status das esteiras
    Então Todas devem estar finalizadas
    
    Exemplos:
      | tipoEsteira |
      | operacao    |
