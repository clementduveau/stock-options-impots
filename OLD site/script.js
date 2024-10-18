function compute() {
    var validationErrors = 0;
    const marketValue = validate('marketValue');
    const pricePaid = validate('pricePaid');
    const priceSold = validate('priceSold');
    const discount = validate('discount');
    const numberOfActions = validate('numberOfActions');
    const taxRate = validate('taxRate') / 100;
    if (validationErrors > 0) { return; }

    const tauxPrelevementsSociaux = (9.2 + 0.5 + 7.5) / 100
    const PFU = 12.8 / 100;

    // Rabais
    var rabaisExcedentaireTotal = Math.max((discount - (marketValue * 5 / 100)) * numberOfActions, 0);
    var rabaisExcedentaireImpot = rabaisExcedentaireTotal * taxRate;
    var rabaisExcedentaireSociaux = rabaisExcedentaireTotal * tauxPrelevementsSociaux;
    var rabaisExcedentaireTaxes = rabaisExcedentaireImpot + rabaisExcedentaireSociaux;

    display(rabaisExcedentaireImpot, 'rabaisExcedentaireImpot');
    display(rabaisExcedentaireSociaux, 'rabaisExcedentaireSociaux');
    display(rabaisExcedentaireTaxes, 'rabaisExcedentaireTaxes');

    // Levée d'options
    var leveeOptionTotal = Math.max((marketValue - (pricePaid + discount)) * numberOfActions, 0);
    var leveeOptionImpot = leveeOptionTotal * taxRate;
    var leveeOptionSociaux = leveeOptionTotal * (tauxPrelevementsSociaux + 10 / 100)
    var leveeOptionTaxes = leveeOptionImpot + leveeOptionSociaux;

    display(leveeOptionImpot, 'leveeOptionImpot');
    display(leveeOptionSociaux, 'leveeOptionSociaux');
    display(leveeOptionTaxes, 'leveeOptionTaxes');

    // Plus value
    var withPFU = (taxRate > PFU);

    var plusValueTotal = Math.max((priceSold - marketValue), 0) * numberOfActions;
    var plusValueImpot = withPFU ? plusValueTotal * PFU : plusValueTotal * taxRate;
    var plusValueSociaux = plusValueTotal * tauxPrelevementsSociaux
    var plusValueTaxes = plusValueImpot + plusValueSociaux;

    display(plusValueImpot, 'plusValueImpot');
    display(plusValueSociaux, 'plusValueSociaux');
    display(plusValueTaxes, 'plusValueTaxes');

    // Total
    var taxImpot = rabaisExcedentaireImpot + leveeOptionImpot + plusValueImpot;
    var taxSociaux = rabaisExcedentaireSociaux + leveeOptionSociaux + plusValueSociaux;
    var taxTaxes = taxImpot + taxSociaux
    var totalCost = (numberOfActions * pricePaid) + rabaisExcedentaireImpot + rabaisExcedentaireSociaux + leveeOptionImpot + leveeOptionSociaux
    var totalSale = (numberOfActions * priceSold)
    var totalBenefit = totalSale - taxTaxes

    display(taxImpot, 'taxImpot');
    display(taxSociaux, 'taxSociaux');
    display(taxTaxes, 'taxTaxes');
    display(totalCost, 'totalCost');
    display(totalSale, 'totalSale');
    display(totalBenefit, 'totalBenefit');
    document.getElementById("withPFU").innerText = (withPFU ? 'Oui' : 'Non');

    document.getElementById('resultHr').removeAttribute('hidden');
    document.getElementById('resultTitle').removeAttribute('hidden');
    document.getElementById('result').removeAttribute('hidden');
    document.getElementById('summary').removeAttribute('hidden');
}

function format(value){
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return formatter.format(value);
}

function display(value, key) {
    document.getElementById(key).innerText = format(value);
}

function validate(key) {
    const element = document.getElementById(key);
    const value = element.value;

    element.removeAttribute('aria-invalid');

    if (value < 0 || value === '') {
        element.setAttribute('aria-invalid', true);
        validationErrors++;
        return;
    }

    return Number(value);
}