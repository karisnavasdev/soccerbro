// National teams for Country Cup mode
const COUNTRIES = [
  {
    id: 'arg', name: 'Argentina', flag: '🇦🇷',
    kit: '#75aadb', accent: '#fff', star: 'messi',
    rating: 96, desc: 'World Champions. Messy leads the attack.'
  },
  {
    id: 'por', name: 'Portugal', flag: '🇵🇹',
    kit: '#006600', accent: '#ff0000', star: 'ronaldo',
    rating: 94, desc: 'Rondal\'s rocket-powered nation.'
  },
  {
    id: 'bra', name: 'Brazil', flag: '🇧🇷',
    kit: '#ffdf00', accent: '#009c3b', star: 'neymar',
    rating: 95, desc: 'Samba style. Neybro magic.'
  },
  {
    id: 'fra', name: 'France', flag: '🇫🇷',
    kit: '#0055a4', accent: '#ef4135', star: 'mbappe',
    rating: 94, desc: 'Mbappbro\'s lightning squad.'
  },
  {
    id: 'eng', name: 'England', flag: '🇬🇧',
    kit: '#fff', accent: '#c8102e', star: 'haaland',
    rating: 91, desc: 'Three lions roar on the pitch.'
  },
  {
    id: 'ger', name: 'Germany', flag: '🇩🇪',
    kit: '#fff', accent: '#000', star: 'muller',
    rating: 92, desc: 'Mullbro\'s precision machine.'
  },
  {
    id: 'esp', name: 'Spain', flag: '🇪🇸',
    kit: '#c60b1e', accent: '#ffc400', star: 'neymar',
    rating: 93, desc: 'Tiki-taka passing masters.'
  },
  {
    id: 'ita', name: 'Italy', flag: '🇮🇹',
    kit: '#0066b2', accent: '#fff', star: 'muller',
    rating: 91, desc: 'Defensive wall of champions.'
  },
  {
    id: 'usa', name: 'USA', flag: '🇺🇸',
    kit: '#002868', accent: '#bf0a30', star: 'rapinoe',
    rating: 88, desc: 'Rapinbro stars for the stars.'
  },
  {
    id: 'mex', name: 'Mexico', flag: '🇲🇽',
    kit: '#006847', accent: '#fff', star: 'marta',
    rating: 87, desc: 'Passionate green warriors.'
  },
  {
    id: 'jpn', name: 'Japan', flag: '🇯🇵',
    kit: '#0055a4', accent: '#fff', star: 'mbappe',
    rating: 86, desc: 'Fast and technical samurai.'
  },
  {
    id: 'ned', name: 'Netherlands', flag: '🇳🇱',
    kit: '#ff6600', accent: '#fff', star: 'haaland',
    rating: 90, desc: 'Total football orange army.'
  }
];

function getCountry(id) {
  return COUNTRIES.find(c => c.id === id) || COUNTRIES[0];
}

function getRandomCountry(excludeId) {
  const pool = COUNTRIES.filter(c => c.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

function drawCountryCard(parent, country, selected, onClick) {
  const card = document.createElement('div');
  card.className = 'country-card' + (selected ? ' selected' : '');
  card.innerHTML =
    `<span class="country-flag">${country.flag}</span>` +
    `<span class="country-name">${country.name}</span>` +
    `<span class="country-rating">${country.rating}</span>`;
  card.addEventListener('click', onClick);
  parent.appendChild(card);
  return card;
}
