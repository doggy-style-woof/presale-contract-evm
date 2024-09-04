require('@nomicfoundation/hardhat-verify');
require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-contract-sizer');
require('hardhat-dependency-compiler');
require('hardhat-deploy');
require('hardhat-gas-reporter');
require('hardhat-tracer');
require('dotenv').config();

module.exports = {
  tracer: {
    enableAllOpcodes: true,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000_000,
          },
          viaIR: true,
        },
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  contractSizer: {
    runOnCompile: true,
    unit: "B",
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'MATIC',
    noColors: false
  },
  dependencyCompiler: {
    paths: [
      '@1inch/solidity-utils/contracts/mocks/TokenCustomDecimalsMock.sol',
      '@1inch/solidity-utils/contracts/mocks/TokenMock.sol'
    ],
  },
  etherscan: {
    apiKey: {
      mainnet: `${process.env.ETHERSCAN_API_KEY}` || '',
      ethereum: `${process.env.ETHERSCAN_API_KEY}` || '',
      sepolia: `${process.env.ETHERSCAN_API_KEY}` || '',
      polygon: `${process.env.POLYGONSCAN_API_KEY}` || '',
      polygonAmoy: `${process.env.POLYGONSCAN_API_KEY}` || '',
      bsc: `${process.env.BSCSCAN_API_KEY}` || '',
      bscTestnet: `${process.env.BSCSCAN_API_KEY}` || '',
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        },
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io"
        }
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockGasLimit: 30000000,
      gasPrice: 70_000_000_000,
      mining: {
        auto: true,
        interval: 5000
      }
    },
    ethereum: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.RPC_ETH_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_DEPLOYER}`]
    },
    ethSepolia: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${process.env.RPC_ETH_SEPOLIA_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_DEPLOYER}`]
    },
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.RPC_POLYGON_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_DEPLOYER}`]
    },
    polygonAmoy: {
      chainId: 80002,
      url: `https://polygon-amoy.infura.io/v3/${process.env.RPC_POLYGON_AMOY_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_DEPLOYER}`],
    },
    bsc: {
      chainId: 56,
      url: `https://bsc-mainnet.infura.io/v3/${process.env.RPC_BSC_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_DEPLOYER}`]
    },
    bscTestnet: {
      chaindId: 97,
      url: `https://bsc-testnet.infura.io/v3/${process.env.RPC_BSC_TESTNET_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_DEPLOYER}`]
    },
  },
};
