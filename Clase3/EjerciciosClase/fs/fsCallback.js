const { Console } = require('console');
const fs = require('fs'); //volvemos a utilizar fs, sin el no podemostrabajar con archivos
fs.writeFile('testCallBack.txt', 'Hello World!', (err) => {
  if (err) return console.log('error al crear el archivo');
  console.log('The file has been saved!');
  fs.readFile('testCallback.txt', 'utf-8', (err, data) => {
    if (err) return console.log('Error al leer el archivo');
    console.log(data);
  });
  fs.appendFile('testCallback.txt', ' - Hola Mundo!', (error) => {
    if (err) return console.log('error al actualizar el archivo');
    fs.readFile('testCallback.txt', 'utf-8', (err, data) => {
      if (err) return console.log('Error al leer el archivo');
      console.log(data);
      fs.unlink('testCallback.txt', (err) => {
        if (err) return console.log('Error al querer eliminar el archivo');
        console.log('The file was removed!');
      });
    });
  });
});
