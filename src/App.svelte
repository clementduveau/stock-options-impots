<script>
	import { calculateTaxes } from "./taxCalculation.js";

	let formData = {
		pricePaid: 80,
		marketValue: 120,
		priceSold: 150,
		discount: 20,
		numberOfActions: 1,
		taxRate: 30,
	};

	function handleFormSubmit() {}

	$: taxes = calculateTaxes(formData);

	function format(value) {
		return new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	}

	const formFields = [
		{
			id: "pricePaid",
			label: "Prix d'exercice",
			description: "Prix payé pour obtenir l'action. Prix de l'option.",
		},
		{
			id: "discount",
			label: "Rabais à l'attribution",
			description:
				"En valeur (en €), pas en %. Cela correspond à une remise au moment où vous avez reçu les options. Les actions valaient 100€ quand vous avez reçu vos options et votre employeur vous donne des options à 80€, vous avez 20€ de rabais.",
		},
		{
			id: "marketValue",
			label: "Prix de marché",
			description: "Au moment de l'achat.",
		},
		{ id: "priceSold", label: "Prix de revente" },
		{ id: "numberOfActions", label: "Nombre d'actions" },
		{
			id: "taxRate",
			label: "Taux marginal d'imposition (%)",
			description:
				"Votre dernière tranche d'imposition. Attention, le calculateur ne prend pas en compte les changements de tranches.",
		},
	];

	const taxResults = [
		{
			title: "Rabais excédentaire",
			impot: "rabaisExcedentaireImpot",
			sociaux: "rabaisExcedentaireSociaux",
			total: "rabaisExcedentaireTaxes",
		},
		{
			title: "Levée d'option",
			impot: "leveeOptionImpot",
			sociaux: "leveeOptionSociaux",
			total: "leveeOptionTaxes",
		},
		{
			title: "Plus value",
			impot: "plusValueImpot",
			sociaux: "plusValueSociaux",
			total: "plusValueTaxes",
		},
		{
			title: "Totaux",
			impot: "totalImpot",
			sociaux: "totalSociaux",
			total: "totalTaxes",
		},
	];
</script>

<h2>Calculateur</h2>
<form on:submit|preventDefault={handleFormSubmit}>
	{#each Array(Math.ceil(formFields.length / 3)) as _, rowIndex}
		<div class="grid">
			{#each formFields.slice(rowIndex * 3, rowIndex * 3 + 3) as field}
				<div>
					<label for={field.id}>{field.label}</label>
					<input
						type="number"
						id={field.id}
						bind:value={formData[field.id]}
						min="0"
						required
					/>
					{#if field.description}
						<small>{field.description}</small>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</form>

<hr />
<h2>Résultats</h2>

<table class="striped overflow-auto">
	<thead>
		<tr>
			<th>Titre</th>
			<th>Impôts</th>
			<th>Prélèvements sociaux</th>
			<th>Total</th>
		</tr>
	</thead>
	<tbody>
		{#each taxResults as row}
			<tr>
				<td>{row.title}</td>
				<td>{format(taxes[row.impot])}</td>
				<td>{format(taxes[row.sociaux])}</td>
				<td>{format(taxes[row.total])}</td>
			</tr>
		{/each}
	</tbody>
</table>

<table class="striped overflow-auto">
	<thead>
		<tr>
			<th>Coût total d'acquisition</th>
			<th>Vente total</th>
			<th>Restant après impôts & taxes</th>
			<th>PFU ?</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>{format(taxes.totalCost)}</td>
			<td>{format(taxes.totalSale)}</td>
			<td>{format(taxes.totalBenefit)}</td>
			<td>{taxes.withPFU ? "Oui" : "Non"}</td>
		</tr>
	</tbody>
</table>
