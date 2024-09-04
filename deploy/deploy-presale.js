const hre = require('hardhat');
const {getChainId, network} = hre;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// PROD deployer: 0xc730427FE942AdC930A2197a07b156E12ed47184


const networkConfigs = {
  // Testnet
  'ethSepolia': {
    'priceFeed': process.env.ETHSEPOLIA_COIN_PRICE_FEED || '0x694AA1769357215DE4FAC081bf1f309aDC325306', // ETH/USD chainlink
    'usdcToken': process.env.ETHSEPOLIA_USDC_TOKEN || '',
    'usdtToken': process.env.ETHSEPOLIA_USDT_TOKEN || '',
    'protocolWallet': process.env.ETHSEPOLIA_PROTOCOL_WALLET || '',
  },
  'polygonAmoy': {
    'priceFeed': process.env.POLYGONAMOY_COIN_PRICE_FEED || '0x001382149eBa3441043c1c66972b4772963f5D43', // MATIC/USD chainlink
    'usdcToken': process.env.POLYGONAMOY_USDC_TOKEN || '',
    'usdtToken': process.env.POLYGONAMOY_USDT_TOKEN || '',
    'protocolWallet': process.env.POLYGONAMOY_PROTOCOL_WALLET || '',
  },
  'bscTestnet': {
    'priceFeed': process.env.BSCTESTNET_COIN_PRICE_FEED || '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526', // BNB/USD chainlink
    'usdcToken': process.env.BSCTESTNET_USDC_TOKEN || '',
    'usdtToken': process.env.BSCTESTNET_USDT_TOKEN || '',
    'protocolWallet': process.env.BSCTESTNET_PROTOCOL_WALLET || '',
  },

  // Mainnet
  'ethereum': {
    'priceFeed': process.env.ETHEREUM_COIN_PRICE_FEED || '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    'usdcToken': process.env.ETHEREUM_USDC_TOKEN || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    'usdtToken': process.env.ETHEREUM_USDT_TOKEN || '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'protocolWallet': process.env.ETHEREUM_PROTOCOL_WALLET || '0x254432E7bFA01D7B85Be733465C3b2BFCa96B2c4',
    'operatorWallet': process.env.ETHEREUM_OPERATOR_WALLET || '0x97C043Dc5f0CE53e88308e47Fb86c63FD7Bf4014',
  },
  'bsc': {
    'priceFeed': process.env.BSC_COIN_PRICE_FEED || '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    'usdcToken': process.env.BSC_USDC_TOKEN || '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    'usdtToken': process.env.BSC_USDT_TOKEN || '0x55d398326f99059fF775485246999027B3197955',
    'protocolWallet': process.env.BSC_PROTOCOL_WALLET || '0x298DEd94Ef41d7d2519f5BA17C7828805D894cf8',
    'operatorWallet': process.env.BSC_OPERATOR_WALLET || '0x97C043Dc5f0CE53e88308e47Fb86c63FD7Bf4014',
  },
  'polygon': {
    'priceFeed': process.env.POLYGON_COIN_PRICE_FEED || '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
    'usdcToken': process.env.POLYGON_USDC_TOKEN || '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    'usdtToken': process.env.POLYGON_USDT_TOKEN || '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    'protocolWallet': process.env.POLYGON_PROTOCOL_WALLET || '0x298DEd94Ef41d7d2519f5BA17C7828805D894cf8',
    'operatorWallet': process.env.POLYGON_OPERATOR_WALLET || '0x97C043Dc5f0CE53e88308e47Fb86c63FD7Bf4014',
  },
};

module.exports = async ({getNamedAccounts, deployments}) => {
  console.log("Running deploy presale script");
  console.log("Network name: ", network.name);
  console.log("Network id: ", await getChainId())

  if(networkConfigs[network.name] === undefined) {
    console.log('Don\'t have network config for this network: ' + network.name + '. Skip deploying presale...\n');
    return;
  }

  const coinPriceFeed = networkConfigs[network.name].priceFeed

  const usdtToken = networkConfigs[network.name].usdtToken
  const usdcToken = networkConfigs[network.name].usdcToken

  const protocolWallet = networkConfigs[network.name].protocolWallet
  const admin = networkConfigs[network.name].protocolWallet
  const operator = networkConfigs[network.name].operatorWallet

  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  const args = [
    coinPriceFeed,
    usdcToken,
    usdtToken,
    protocolWallet,
    admin,
    operator
  ]

  let presale
  if (network.name === 'bsc' || network.name === 'bscTestnet') {
    presale = await deploy('PresaleBSC', {
      from: deployer,
      args: args
    })
  } else {
    presale = await deploy('Presale', {
      from: deployer,
      args: args
    })
  }

  console.log("Presale deployed to: ", presale.address)

  await sleep(15000)

  // Verify contract if not Hardhat network
  if (await getChainId() !== '31337') {
    await hre.run(`verify:verify`, {
      address: presale.address,
      constructorArguments: args
    })
  }
};

module.exports.tags = ['Presale'];
