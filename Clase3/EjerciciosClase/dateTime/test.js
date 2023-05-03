const fs = require('fs');
fs.writeFile('dateTime.txt', new Date().toLocaleString('es-AR'), (err) => {
  if (err) return console.log('Error on file creation');
  console.log('File successfully created!');
  fs.readFile('dateTime.txt', 'utf-8', (err, data) => {
    if (err) return console.log('Error reading the file');
    console.log(data);
  });
});
