const fs = require('fs');
//async function because we're working with promeses
const operacionesAsincronas = async () => {
  //write a file
  await fs.promises
    .writeFile('test.txt', 'hi from promesess!')
    .catch((error) => console.error(`Error on writeFile: ${error}`));
  //using promises module we no need handle callback
  //read file
  let resultado = await fs.promises
    .readFile('test.txt', 'utf-8')
    .catch((error) => console.error(`Error on readFile: ${error}`));
  console.log(resultado);

  //update file
  await fs.promises
    .appendFile('test.txt', ' Adding more data!')
    .catch((error) => console.error(`Error on appendFile: ${error}`));

  //read file again
  resultado = await fs.promises
    .readFile('test.txt', 'utf-8')
    .catch((error) => console.error(`Error on readFile: ${error}`));
  console.log(resultado);

  //finally we delete the file
  await fs.promises
    .unlink('test.txt')
    .catch((error) => console.error(`Error on unlink: ${error}`));
};

operacionesAsincronas();
