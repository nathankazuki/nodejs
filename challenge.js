const axios = require('axios');
const express = require('express');
const hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
	return text;
});

hbs.registerHelper('links', (link) => {
	return link
});

hbs.registerHelper('linkName', (name) => {
	return name
});

app.get('/', (request, response) => {
	response.render('main.hbs', {
		title: 'Main Menu',
		link1: '/info',
		link2: '/currency',
		name1: 'About Me',
		name2: 'Currencry Converter'
	});
});

app.get('/info', (request, response) => {
	response.render('about.hbs', {
	title: 'About Page',
	year: new Date().getFullYear(),
	link1: '/',
	link2: '/currency',
	name1: 'Main Menu',
	name2: 'Currencry Converter',
	welcome: 'Hello!'
	});
});

app.get('/currency', (request, response) => {
	convertCurrency('CAD', 'USD', 20).then((message) => {
		response.render('currency.hbs', {
			title: 'Currency Page',
			year: new Date().getFullYear(),
			link1: '/',
			link2: '/info',
			name1: 'Main Menu',
			name2: 'About Me',
			welcome: message
		});
	}).catch((error) => {
		response.send('Error: Cannot open page');
	});
});

const getExchange = async (baseCurrency, newCurrency) => {
	const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`);
	const desired = 1 / response.data.rates[baseCurrency];
	const rate = desired * response.data.rates[newCurrency];
	return rate;
};

const getCountries = async (currency) => {
	const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currency}`);
	return response.data.map((country) => country.name);
};

const convertCurrency = async (baseCurrency, newCurrency, amount) => {
	if (isNaN(amount)) {
		return "Amount must be a number."
	}
	const rate = await getExchange(baseCurrency, newCurrency);
	const country = await getCountries(newCurrency);
	const total = (rate * amount).toFixed(2);
	return `${amount} ${baseCurrency} is worth ${total} ${newCurrency}. You can spend it in the following countries: ${country}`
};

app.listen(8080, () => {
	console.log('Server is up on port 8080');
});