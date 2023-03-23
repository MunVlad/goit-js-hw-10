import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


searchInput.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry() {
  const name = searchInput.value.trim();
  if (!name.trim()) {
    clearInput();
    return}
  fetchCountries(name).then(countries => {
    clearInput();
    inputCheck(countries);
  }).catch(() => {
      Notify.failure("Oops, there is no country with that name");
  clearInput(); })
  
};

function renderCountriesList(countries) {
  return countries.map(({name, flags}) => {
    return `<li class='country-list__item'>
    <img class="country-list__flag" src="${flags.svg}" alt="${name.official}" width = 30px height = 30px>
    <h2 class="country-list__name">${name.official}</h2></li>`
  }).join('')
};
  
function renderCountriesInfo(countries) {
  return countries.map(({capital, population, languages})=>{
return `<ul class='country-list-info'>
<li class='country-list-info__item'>Capital: ${capital}</li>
<li class='country-list-info__item'>Population: ${population}</li>
<li class='country-list-info__item'>Languages: ${Object.values(languages).join(', ')}</li>
</ul>`
  }).join('')
};

function inputCheck(countries) {
  if (countries.length === 1) {
    countryList.insertAdjacentHTML('beforeend', renderCountriesList(countries));
    countryInfo.insertAdjacentHTML('beforeend', renderCountriesInfo(countries));
  } else if (countries.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
  } else if (countries.length >= 2 && countries.length <= 10) {
    countryList.insertAdjacentHTML('beforeend', renderCountriesList(countries));
  }
};
function clearInput() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};



