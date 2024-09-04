const {execSync} = require('child_process');
const dotenvExtended = require('dotenv-extended');
const path = require('path');
const fs = require('fs');

const networks = ['ethSepolia', 'polygonAmoy', 'bscTestnet'];

async function deployToNetwork(network) {
  console.log(`Deploying to ${network}...`);

  console.log('Using env file: ', `../.env.${network}`);

  const envFilePath = path.resolve(__dirname, `../.env.${network}`);
  if (fs.existsSync(envFilePath)) {
    dotenvExtended.load({
      path: path.resolve(__dirname, '../.env'),
      defaults: envFilePath,
      overrideProcessEnv: true
    });
  } else {
    console.log(`Env file for ${network} does not exist. Skipping...`);
  }

  try {
    execSync(`npx hardhat deploy --network ${network}`, {stdio: 'inherit'});
    console.log(`Successfully deployed to ${network}`);
  } catch (error) {
    console.error(`Failed to deploy to ${network}:`, error);
  }
}

async function main() {
  for (const network of networks) {
    await deployToNetwork(network);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
