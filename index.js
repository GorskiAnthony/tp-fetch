// Je fait un querySelector pour récupérer mon canvas
const ctx = document.querySelector("#myChart").getContext("2d");

// Je get les elements dans mon DOM
const FORM = document.querySelector("form");
const SELECT = document.querySelector("select");
const OPTIONS = document.createElement("option");

// Je défini mes variables labels et datas pour mon chart
let labels = [];
let datas = [];
const CRYPTOS = [];

// Permet d'avoir les cryptos les plus populaires
async function getOptionsList() {
	const rates = await fetch(
		"https://api.coingecko.com/api/v3/exchange_rates"
	);
	const dataRates = await rates.json();
	// Je recupère le nom de chaque crypto
	const nameCurrency = Object.keys(dataRates.rates);

	// Je map dessus pour récupérer exclusivement le type crypto
	nameCurrency.map((devise) => {
		if (dataRates.rates[devise].type === "crypto") {
			CRYPTOS.push(dataRates.rates[devise]);
		}
	});

	//!TODO
	// Ici, je tente d'appliquer dans une liste SELECT
	// les 10 premieres cryptos
	//! Ne fonctionne pas encore
	for (let i = 0; i < 10; i++) {
		OPTIONS.value = CRYPTOS[i].name.toLowerCase();
		OPTIONS.text = CRYPTOS[i].name;
		SELECT.append(OPTIONS);
	}
}

// Je défini une function qui permet de récupérer mes données de l'api
async function getData(crypto) {
	const reponse = await fetch(
		`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=eur&days=150`
	);
	const data = await reponse.json();
	display(data.prices, crypto);
}

// ici de traiter mes données pour un affichage correct
function getResult(data) {
	for (let i = 0; i < data.length; i++) {
		let date, day, month, year, fullDate;

		date = new Date(data[i][0]);
		day = date.getDate();
		month = date.getMonth() + 1;
		year = date.getFullYear();
		fullDate = `${day}/${month}/${year}`;

		//je push dans mon tableau chaque élément pour ensuite faire appel dans mon chart
		labels.push(fullDate);
		let money = data[i][1];
		//idem
		datas.push(money.toFixed(2));
	}
}

// Permet d'afficher le chart
function display(data) {
	getResult(data);

	const CONFIG = {
		type: "line",
		data: {
			labels: labels,
			datasets: [
				{
					label: `bitcoin`,
					data: datas,
					backgroundColor: ["rgba(217, 119, 7, 0.5)"],
				},
			],
		},
	};

	const chartLine = new Chart(ctx, CONFIG);
	// Je réinitialise mes tableaux
	labels = [];
	datas = [];
}

// FORM.addEventListener("submit", (event) => {
// 	event.preventDefault();
// 	// À chaque soumission on appel la fonction getData()
// 	getData(SELECT.value);
// });

// appel a ma fonction avec le bitcoin par défaut
//getData(SELECT.value);
getData("bitcoin");

// En attente x)
//getOptionsList();
