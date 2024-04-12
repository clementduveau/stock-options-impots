function compute() {
    var validationErrors = 0;
    const marketValue = validate('marketValue');
    const pricePaid = validate('pricePaid');
    const discount = validate('discount');
    const numberOfActions = validate('numberOfActions');
    const taxRate = validate('taxRate') / 100;
    if (validationErrors > 0){return;}

    // Rabais
    var rabaisExcedentaireTotal = Math.max((discount - (marketValue * 5 / 100)) * numberOfActions, 0);
    var rabaisExcedentaireImpot = rabaisExcedentaireTotal * taxRate;
    var rabaisExcedentaireSociaux = rabaisExcedentaireTotal * (9.2 + 0.5) / 100;
    var rabaisExcedentaireTaxes = rabaisExcedentaireImpot + rabaisExcedentaireSociaux;

    display(rabaisExcedentaireTotal, 'rabaisExcedentaireTotal');
    display(rabaisExcedentaireImpot, 'rabaisExcedentaireImpot');
    display(rabaisExcedentaireSociaux, 'rabaisExcedentaireSociaux');
    display(rabaisExcedentaireTaxes, 'rabaisExcedentaireTaxes');
    document.getElementById('rabaisExcedentaire').removeAttribute('hidden');

    // Levée d'options
    var leveeOptionTotal = (marketValue - pricePaid) * numberOfActions;
    var leveeOptionImpot = leveeOptionTotal * taxRate;
    var leveeOptionSociaux = leveeOptionTotal * (9.2 + 0.5 + 10) / 100
    var leveeOptionTaxes = leveeOptionImpot + leveeOptionSociaux;

    display(leveeOptionTotal, 'leveeOptionTotal');
    display(leveeOptionImpot, 'leveeOptionImpot');
    display(leveeOptionSociaux, 'leveeOptionSociaux');
    display(leveeOptionTaxes, 'leveeOptionTaxes');
    document.getElementById('leveeOption').removeAttribute('hidden');

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

    return value;
}