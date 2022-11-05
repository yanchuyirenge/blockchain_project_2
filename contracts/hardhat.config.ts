import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // Solidity compiler version
  solidity: "0.8.9",
  networks: {
    ganache: {
      // Change the url according to your ganache configuration
      url: 'HTTP://127.0.0.1:8545',
      // Change these accounts private keys according to your ganache configuration.
      accounts: [
        '479387f2f66b16cc410b4080517da6d24663e21da5c3169803854cf666dd5810',
        '253d3ccfcd6d8c1599adbd30c7e7fd64470d9a1c6c5d3ad8f65f03bc5c07a98f',
      ]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
