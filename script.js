function compute() {
    var validationErrors = 0;
    const marketValue = validate('marketValue');
    const pricePaid = validate('pricePaid');
    const priceSold = validate('priceSold');
    const discount = validate('discount');
    const numberOfActions = validate('numberOfActions');
    const taxRate = validate('taxRate') / 100;
    if (validationErrors > 0){return;}

    const tauxPrelevementsSociaux = (9.2 + 0.5 + 7.5)/100
    const PFU = 12.8 / 100;

    // Rabais
    var rabaisExcedentaireTotal = Math.max((discount - (marketValue * 5 / 100)) * numberOfActions, 0);
    var rabaisExcedentaireImpot = rabaisExcedentaireTotal * taxRate;
    var rabaisExcedentaireSociaux = rabaisExcedentaireTotal * tauxPrelevementsSociaux;
    var rabaisExcedentaireTaxes = rabaisExcedentaireImpot + rabaisExcedentaireSociaux;

    display(rabaisExcedentaireTotal, 'rabaisExcedentaireTotal');
    display(rabaisExcedentaireImpot, 'rabaisExcedentaireImpot');
    display(rabaisExcedentaireSociaux, 'rabaisExcedentaireSociaux');
    display(rabaisExcedentaireTaxes, 'rabaisExcedentaireTaxes');
    document.getElementById('rabaisExcedentaire').removeAttribute('hidden');

    // Levée d'options
    var leveeOptionTotal = Math.max((marketValue - (pricePaid + discount)) * numberOfActions, 0);
    var leveeOptionImpot = leveeOptionTotal * taxRate;
    var leveeOptionSociaux = leveeOptionTotal * (tauxPrelevementsSociaux + 10 / 100)
    var leveeOptionTaxes = leveeOptionImpot + leveeOptionSociaux;

    display(leveeOptionTotal, 'leveeOptionTotal');
    display(leveeOptionImpot, 'leveeOptionImpot');
    display(leveeOptionSociaux, 'leveeOptionSociaux');
    display(leveeOptionTaxes, 'leveeOptionTaxes');
    document.getElementById('leveeOption').removeAttribute('hidden');

    // Plus value
    var plusValueTotal = Math.max((priceSold - marketValue), 0) * numberOfActions;
    var plusValueImpot = Math.min(plusValueTotal * PFU, plusValueTotal * taxRate);
    var plusValueSociaux = plusValueTotal * tauxPrelevementsSociaux
    var plusValueTaxes = plusValueImpot + plusValueSociaux;

    display(plusValueTotal, 'plusValueTotal');
    display(plusValueImpot, 'plusValueImpot');
    display(plusValueSociaux, 'plusValueSociaux');
    display(plusValueTaxes, 'plusValueTaxes');
    document.getElementById('plusValue').removeAttribute('hidden');

    // Total
    var taxImpot = rabaisExcedentaireImpot + leveeOptionImpot;
    var taxSociaux = rabaisExcedentaireSociaux + leveeOptionSociaux;
    var taxTaxes = taxImpot + taxSociaux

    display(taxImpot, 'taxImpot');
    display(taxSociaux, 'taxSociaux');
    display(taxTaxes, 'taxTaxes');


    document.getElementById('resultHr').removeAttribute('hidden');
    document.getElementById('resultTitle').removeAttribute('hidden');
    document.getElementById('result').removeAttribute('hidden');
}

function display(value, key) {
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    });

    document.getElementById(key).innerText = formatter.format(value);
}

function validate(key) {
    const element = document.getElementById(key);
    const value = element.value;

    element.removeAttribute('aria-invalid');

    if(value < 0 || value === ''){
        element.setAttribute('aria-invalid', true);
        validationErrors++;
        return;
    }

    return Number(value);
}