//import fs from 'fs/promises';
const fs = require('fs/promises');
//import path from 'path';
const path = require('path');

async function read() {
  const datos = await fs.readFile(path.resolve() + '/file.txt', 'utf-8');
  console.log(datos);
}

read();
