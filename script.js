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

function format(value) {
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

function contact() {
    const form = document.getElementById('contact')

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    };

    const formData = new FormData(form);
    const url = 'https://n8n.duveau.eu/webhook-test/notify'; // Replace this with your actual endpoint URL

    fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            openModal("Votre message a bien été envoyé");
        })
        .catch((error) => {
            openModal("Votre message n'a pas été reçu. Contactez moi directement sur clement@duveau.eu");
        });
}



// Modal
let visibleModal = null;

function openModal(message) {
    const animationDuration = 400; // ms
    const modal = document.getElementById('modal');
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.getElementById('modal-msg').innerText = message;

    const { documentElement: html } = document;

    if (scrollbarWidth) {
        html.style.setProperty('--pico-scrollbar-width', `${scrollbarWidth}px`);
    }
    html.classList.add('modal-is-open', 'modal-is-opening');
    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove('modal-is-opening');
    }, animationDuration);
    modal.showModal();
}

// Toggle modal
const toggleModal = (event) => {
    event.preventDefault();
    if (!modal) return;
    modal && (modal.open ? closeModal(modal) : openModal(modal));
};

// Close modal
const closeModal = (modal) => {
    visibleModal = null;
    const { documentElement: html } = document;
    html.classList.add('modal-is-closing');
    setTimeout(() => {
        html.classList.remove('modal-is-closing', 'modal-is-open');
        html.style.removeProperty('--pico-scrollbar-width');
        modal.close();
    }, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
    if (visibleModal === null) return;
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    !isClickInside && closeModal(visibleModal);
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visibleModal) {
        closeModal(visibleModal);
    }
});

// Is scrollbar visible
const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height;
};