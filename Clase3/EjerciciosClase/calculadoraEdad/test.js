//using moment
const moment = require('moment');
const nacimiento = moment('20/09/1980 00:35:00', 'DD/MM/YYYY HH:mm:ss').format(
  'DD/MM/YYYY HH:mm:ss'
);
console.log('nacimiento: ' + nacimiento);
