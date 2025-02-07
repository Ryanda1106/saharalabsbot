const fs = require('fs');
const path = require('path');

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

function loadModulesFromDir(dir) {
  const modules = {};
  
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (fs.lstatSync(fullPath).isFile() && file.endsWith('.js')) {
      const moduleName = toCamelCase(path.basename(file, '.js'));
      modules[moduleName] = require(fullPath);
    }
  });
  
  return modules;
}
const testnetChains = loadModulesFromDir(path.join(__dirname, 'testnet'));
const mainnetChains = loadModulesFromDir(path.join(__dirname, 'mainnet'));
const utilsChains = loadModulesFromDir(path.join(__dirname, 'utils'));
module.exports = {
  testnet: testnetChains,
  mainnet: mainnetChains,
  utils: utilsChains,
};
