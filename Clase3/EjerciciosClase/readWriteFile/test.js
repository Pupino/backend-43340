const fs = require('fs/promises');
//const { parse } = require('path');
//const { stringify } = require('querystring');
const readFile = async () => {
  //read package.json file, retrieve as string
  let respuesta = await fs.readFile('package.json').catch((error) => {
    console.error();
    error;
  });
  //respuesta = stringify(respuesta); //convert json to string
  console.log(`File content: ${respuesta}`);
  let objRta = JSON.parse(respuesta);
  let stats = await fs.stat('package.json');
  let fileSizeInBytes = stats.size;
  let info = {
    contenidoStr: respuesta,
    contenidoObj: objRta,
    size: fileSizeInBytes,
  };
  info = JSON.stringify(info);
  console.log(`info variable: ${info}`);
  await fs.writeFile('info.json', info).catch((error) => {
    console.log(`Error on writting file info.json: ${error}`);
  });
};

readFile();
