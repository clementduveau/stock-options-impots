<script>
	let pricePaid = 80;
	let marketValue = 120;
	let priceSold = 150;
	let discount = 20;
	let numberOfActions = 1;
	let taxRate = 30;

	// Calcul
	const tauxPrelevementsSociaux = (9.2 + 0.5 + 7.5) / 100;
	const PFU = 12.8 / 100;
	const contribSalariale = 10;
	
	$: withPFU = taxRate / 100 > PFU;
	
	// Rabais
	$: rabaisExcedentaireGain = Math.max((discount - (marketValue * 5) / 100) * numberOfActions, 0);
	$: rabaisExcedentaireImpot = rabaisExcedentaireGain * (taxRate / 100);
	$: rabaisExcedentaireSociaux = rabaisExcedentaireGain * tauxPrelevementsSociaux;
	$: rabaisExcedentaireTaxes = rabaisExcedentaireImpot + rabaisExcedentaireSociaux;

	// Levée d'options
	$: leveeOptionGain = Math.max((marketValue - (pricePaid + discount)) * numberOfActions, 0);
	$: leveeOptionImpot = leveeOptionGain * (taxRate / 100);
	$: leveeOptionSociaux =	leveeOptionGain * (tauxPrelevementsSociaux + contribSalariale / 100);
	$: leveeOptionTaxes = leveeOptionImpot + leveeOptionSociaux;

	// Plus value
	$: plusValueGain = Math.max(priceSold - marketValue, 0) * numberOfActions;
	$: plusValueImpot = withPFU	? (plusValueGain * PFU) : (plusValueGain * (taxRate / 100));
	$: plusValueSociaux = plusValueGain * tauxPrelevementsSociaux;
	$: plusValueTaxes = plusValueImpot + plusValueSociaux;

	// Total
	$: totalImpot = rabaisExcedentaireImpot + leveeOptionImpot + plusValueImpot;
	$: totalSociaux =	rabaisExcedentaireSociaux + leveeOptionSociaux + plusValueSociaux;
	$: totalTaxes = totalImpot + totalSociaux;
	$: totalCost = numberOfActions * pricePaid + rabaisExcedentaireImpot + rabaisExcedentaireSociaux + leveeOptionImpot + leveeOptionSociaux;
	$: totalSale = numberOfActions * priceSold;
	$: totalBenefit = totalSale - totalTaxes;

	function format(value) {
		return new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	}
</script>

<h2>Calculateur</h2>
<form class="grid">
	<div>
		<label for="pricePaid">Prix d'achat:</label>
		<input
			type="number"
			bind:value={pricePaid}
			min="0"
			aria-describedby="pricePaidExplained"
			required
		/>
		<small id="pricePaidExplained"
			>Prix payé pour obtenir l'action. Prix de l'option.</small
		>

		<label for="marketValue">Prix de marché:</label>
		<input
			type="number"
			bind:value={marketValue}
			min=0
			aria-describedby="marketValueExplained"
			required
		/>
		<small id="marketValueExplained">Au moment de l'achat.</small>

		<label for="priceSold">Prix de revente:</label>
		<input
			type="number"
			bind:value={priceSold}
			min="0"
			required
		/>
	</div>
	<div>
		<label for="discount">Rabais à l'attribution:</label>
		<input
			type="number"
			bind:value={discount}
			min="{marketValue * 0.2}"
			aria-describedby="discountExplained"
			required
		/>
		<small id="discountExplained">
			En valeur (en €), pas en %. Cela correspond à une remise au moment
			où vous avez reçu les options. Les actions valaient 100€ quand vous
			avez reçu vos options et votre employeur vous donne des options à
			80€, vous avez 20€ de rabais.
		</small>

		<label for="numberOfActions">Nombre d'actions:</label>
		<input
			type="number"
			bind:value={numberOfActions}
			min="0"
			required
		/>

		<label for="taxRate">Taux marginal d'imposition (%):</label>
		<input
			type="number"
			bind:value={taxRate}
			min="0"
			aria-describedby="taxRateExplained"
			required
		/>
		<small id="taxRateExplained">
			Votre dernière tranche d'imposition. Attention, le calculateur ne
			prend pas en compte les changements de tranches.
		</small>
	</div>
</form>
<button onclick="event.preventDefault(); compute();">Calculer</button>
<hr id="resultHr" />
<h2 id="resultTitle">Résultats</h2>
<table class="striped overflow-auto" id="result">
	<thead>
		<tr>
			<td>Titre</td>
			<td>Impôts</td>
			<td>Prélèvements sociaux</td>
			<td>Total</td>
		</tr>
	</thead>
	<tbody>
		<tr id="rabaisExcedentaire">
			<td>Rabais excédentaire</td>
			<td>{format(rabaisExcedentaireImpot)}</td>
			<td>{format(rabaisExcedentaireSociaux)}</td>
			<td>{format(rabaisExcedentaireTaxes)}</td>
		</tr>
		<tr id="leveeOption">
			<td>Levée d'option</td>
			<td id="leveeOptionImpot">{format(leveeOptionImpot)}</td>
			<td id="leveeOptionSociaux">{format(leveeOptionSociaux)}</td>
			<td id="leveeOptionTaxes">{format(leveeOptionTaxes)}</td>
		</tr>
		<tr id="plusValue">
			<td>Plus value</td>
			<td id="plusValueImpot">{format(plusValueImpot)}</td>
			<td id="plusValueSociaux">{format(plusValueSociaux)}</td>
			<td id="plusValueTaxes">{format(plusValueTaxes)}</td>
		</tr>
	</tbody>
	<tfoot>
		<tr id="tax">
			<td>Totaux</td>
			<td id="taxImpot">{format(totalImpot)}</td>
			<td id="totalSociaux">{format(totalSociaux)}</td>
			<td id="totalTaxes">{format(totalTaxes)}</td>
		</tr>
	</tfoot>
</table>
<table class="striped overflow-auto" id="summary">
	<thead>
		<tr>
			<td>Coût total d'acquisition</td>
			<td>Vente total</td>
			<td>Restant après impôts & taxes</td>
			<td>PFU ?</td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td id="totalCost">{format(totalCost)}</td>
			<td id="totalSale">{format(totalSale)}</td>
			<td id="totalBenefit">{format(totalBenefit)}</td>
			<td id="withPFU">{withPFU ? "Oui" : "Non"}</td>
		</tr>
	</tbody>
</table>
