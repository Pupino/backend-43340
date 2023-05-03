//modulo nativo de node, sólo hay q importarlo
//tambien se suele usar import
const fs = require('fs'); //require: import de node
//verificar si está bien importado
//console.log(fs);
fs.writeFileSync('test.txt', 'hello world - '); //si no existe lo crea

if (fs.existsSync('test.txt')) {
  //si existe el archivo
  const contenidoInicial = fs.readFileSync('test.txt', 'utf-8'); //en que formato quiero levantar el archivo, juego de caracteres, estandar de codification de caracters
  console.log('Contenido del archivo:');
  console.log(contenidoInicial);
  //agregar al archivo contenoido
  fs.appendFileSync(
    'test.txt',
    new Date().toLocaleString('es-AR') + ' - Hola Mundo!'
  );
  const contenidoUpdeteado = fs.readFileSync('test.txt', 'utf-8');
  console.log('Contenido del archivo con agregado:');
  console.log(contenidoUpdeteado);
  fs.unlinkSync('test.txt'); //se elimina
} else {
  //lo creo
  fs.writeFileSync('test.txt', 'hello world - '); //si no existe lo crea
}
