export function calculateTaxes(formData) {
	const { pricePaid, marketValue, priceSold, discount, numberOfActions, taxRate } = formData;
  
	// Constants
	const tauxPrelevementsSociaux = (9.2 + 0.5 + 7.5) / 100;
	const PFU = 12.8 / 100;
	const contribSalariale = 10;
  
	// Calculations
	const withPFU = taxRate / 100 > PFU;
  
	// Rabais
	// Prix de marché lors de l'attrib = discount + pricePaid. 5% exonéré
	const rabaisExcedentaireGain = Math.max(
		(discount - (5/100 * (discount + pricePaid))) * numberOfActions,
		0
	);
	const rabaisExcedentaireImpot = rabaisExcedentaireGain * (taxRate / 100);
	const rabaisExcedentaireSociaux = rabaisExcedentaireGain * tauxPrelevementsSociaux;
	const rabaisExcedentaireTaxes = rabaisExcedentaireImpot + rabaisExcedentaireSociaux;
  
	// Levée d'options
	const leveeOptionGain = Math.max((marketValue - (pricePaid + discount)) * numberOfActions, 0);
	const leveeOptionImpot = leveeOptionGain * (taxRate / 100);
	const leveeOptionSociaux = leveeOptionGain * (tauxPrelevementsSociaux + contribSalariale / 100);
	const leveeOptionTaxes = leveeOptionImpot + leveeOptionSociaux;
  
	// Plus value
	const plusValueGain = Math.max(priceSold - marketValue, 0) * numberOfActions;
	const plusValueImpot = withPFU ? (plusValueGain * PFU) : (plusValueGain * (taxRate / 100));
	const plusValueSociaux = plusValueGain * tauxPrelevementsSociaux;
	const plusValueTaxes = plusValueImpot + plusValueSociaux;
  
	// Total
	const totalImpot = rabaisExcedentaireImpot + leveeOptionImpot + plusValueImpot;
	const totalSociaux = rabaisExcedentaireSociaux + leveeOptionSociaux + plusValueSociaux;
	const totalTaxes = totalImpot + totalSociaux;
	const totalCost = numberOfActions * pricePaid + totalTaxes;
	const totalSale = numberOfActions * priceSold;
	const totalBenefit = totalSale - totalTaxes;
  
	return {
	  withPFU,
	  rabaisExcedentaireImpot,
	  rabaisExcedentaireSociaux,
	  rabaisExcedentaireTaxes,
	  leveeOptionImpot,
	  leveeOptionSociaux,
	  leveeOptionTaxes,
	  plusValueImpot,
	  plusValueSociaux,
	  plusValueTaxes,
	  totalImpot,
	  totalSociaux,
	  totalTaxes,
	  totalCost,
	  totalSale,
	  totalBenefit
	};
  }