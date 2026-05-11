import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que possuo uma lista de ids de esteiras que preciso finalizar de esteira de {string}", (tipoEsteira) => {
    ids = [
    ];
    env = 'hml'
    tipoEsteiraAtual = tipoEsteira
    idComite = 394
    idAnalista = 27
    parecer = 'TESTE AUTOMAÇÂO'
    cy.log(`Tipo de esteira: ${tipoEsteira}`);

    cnpjs = [
      '07003293000100',
      '05255986000164',
      '88961974000182',
      '75444430000100',
      '94517158000187',
      '08327161000104',
      '07810032000100',
      '02857584000141',
      '95112694000165',
      '92980333000142',
      '30182622000149',
      '31607546000139',
      '36906058000146',
      '01588286000130',
      '90952052000150',
      '88397435000162',
      '93415198000155',
      '48474838000143',
      '02602536000102',
      '33889834000230',
      '07868543000174',
      '90314758000197',
      '05430646000122',
      '02180351000157',
      '06009289000196',
      '18893863000109',
      '06051394000193',
      '04571885000130',
      '90608084000133',
      '26524880000199',
      '05014186000151',
      '07312248000137',
      '91215046000183',
      '83056804000130',
      '93899359000123',
      '82982075000180',
      '17678286000161',
      '05262518000117',
      '48896217000158',
      '88611264000122',
      '12400169000118',
      '36503186000149',
      '09166926000126',
      '09309990000119',
      '24476692000107',
      '21522363000167',
      '17040906000132',
      '80996861000100',
      '61276226000104',
      '87252938000187'
    ]
    cnpjs.forEach((cnpj) => {
      cy.criarPocEAvancar(cnpj)
    });
    cy.pause()
});

When("realizo o avanco da etapa {string}", (etapa) => {
  ids.forEach((id) => {
    cy.log(`Avançando esteira ${id} da etapa: ${etapa}`);
    cy.avancarEtapa(tipoEsteiraAtual, id, etapa, env, idComite, idAnalista, parecer);
    cy.wait(3000)
  });
});

Then("realizo as seguintes {string}", (validacoes) => {
});

When("consulto o status das esteiras", () => {
});

Then("Todas devem estar finalizadas", () => {
});