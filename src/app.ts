require('dotenv').config()
const Web3 = require('web3')
const ethers = require('ethers')

// wallet init
const web3 = new Web3(process.env.RPC_URL)
const wallet = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY)

const provider = new ethers.providers.Web3Provider(web3.currentProvider)

const gasPrice = 30000000000
const gasLimit = 5000000

// smart contract ABIs
const EGG_ABI = [{ "inputs": [{ "internalType": "contract Eggs", "name": "eggs", "type": "address" }, { "internalType": "contract IERC20", "name": "oil_", "type": "address" }, { "internalType": "address", "name": "oilRewardAddress_", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "claimer", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bool", "name": "newActiveStatus", "type": "bool" }, { "indexed": true, "internalType": "address", "name": "caller", "type": "address" }], "name": "ContractActivityChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "eggs", "outputs": [{ "internalType": "contract Eggs", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }], "name": "getEggRewardSpeed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256", "name": "rarity", "type": "uint256" }], "name": "getLevelSpeed", "outputs": [{ "internalType": "uint256", "name": "speed", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "isContractActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "levelSpeeds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "maxSpeedCoeff", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "oil", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "oilRewardAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "rewardPeriodCoeffs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "rewardPeriodLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256", "name": "rarity", "type": "uint256" }, { "internalType": "uint256", "name": "oilPerDay", "type": "uint256" }], "name": "setLevelSpeed", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256[]", "name": "speeds", "type": "uint256[]" }], "name": "setLevelSpeedsAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "maxSpeedCoeff_", "type": "uint256" }], "name": "setMaxSpeedCoeff", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "coeffs", "type": "uint256[]" }], "name": "setRewardPeriodCoeffs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lengthSeconds", "type": "uint256" }], "name": "setRewardPeriodLength", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "oilRewardAddress_", "type": "address" }], "name": "setOilRewardAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "isContractActive_", "type": "bool" }], "name": "setContractActive", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "eggIds", "type": "uint256[]" }], "name": "claimBulk", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }], "name": "claimFromHatchery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }], "name": "collectFromUpgrader", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "calculateEggReward", "outputs": [{ "internalType": "uint256", "name": "payout", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }]
const EGG_COLOR_ABI = [{ "inputs": [{ "internalType": "contract Eggs", "name": "eggs", "type": "address" }, { "internalType": "contract IERC20", "name": "oil_", "type": "address" }, { "internalType": "address", "name": "oilRewardAddress_", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "claimer", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claimed", "type": "event", "signature": "0xd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bool", "name": "newActiveStatus", "type": "bool" }, { "indexed": true, "internalType": "address", "name": "caller", "type": "address" }], "name": "ContractActivityChanged", "type": "event", "signature": "0x7d610b791786cdd8b09fe894330e336d11b072d48614613e4c4545f1ac3e6824" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event", "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0" }, { "inputs": [], "name": "eggs", "outputs": [{ "internalType": "contract Eggs", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xe33f76cf" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }], "name": "getEggRewardSpeed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x16623f70" }, { "inputs": [{ "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256", "name": "rarity", "type": "uint256" }], "name": "getLevelSpeed", "outputs": [{ "internalType": "uint256", "name": "speed", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x757edb46" }, { "inputs": [], "name": "isContractActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x8f5949f9" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "levelSpeeds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x285158f0" }, { "inputs": [], "name": "maxSpeedCoeff", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x47a7ce8b" }, { "inputs": [], "name": "oil", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x556fe775" }, { "inputs": [], "name": "oilRewardAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xd131c171" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x8da5cb5b" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x715018a6" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "rewardPeriodCoeffs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xdfd18329" }, { "inputs": [], "name": "rewardPeriodLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xc3d1aeea" }, { "inputs": [{ "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256", "name": "rarity", "type": "uint256" }, { "internalType": "uint256", "name": "oilPerDay", "type": "uint256" }], "name": "setLevelSpeed", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x3b7d0e9f" }, { "inputs": [{ "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256[]", "name": "speeds", "type": "uint256[]" }], "name": "setLevelSpeedsAll", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xcc8ca261" }, { "inputs": [{ "internalType": "uint256", "name": "maxSpeedCoeff_", "type": "uint256" }], "name": "setMaxSpeedCoeff", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x1d74777d" }, { "inputs": [{ "internalType": "uint256[]", "name": "coeffs", "type": "uint256[]" }], "name": "setRewardPeriodCoeffs", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x3ff5d1a3" }, { "inputs": [{ "internalType": "uint256", "name": "lengthSeconds", "type": "uint256" }], "name": "setRewardPeriodLength", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xc157e13a" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }, { "inputs": [{ "internalType": "address", "name": "oilRewardAddress_", "type": "address" }], "name": "setOilRewardAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xd5ad0f10" }, { "inputs": [{ "internalType": "bool", "name": "_isContractActive", "type": "bool" }], "name": "setContractActive", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x970388b5" }, { "inputs": [{ "internalType": "uint256", "name": "eggId1", "type": "uint256" }, { "internalType": "uint256", "name": "eggId2", "type": "uint256" }, { "internalType": "uint256", "name": "eggId3", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xefa9a9be" }, { "inputs": [{ "internalType": "uint256", "name": "eggId1", "type": "uint256" }, { "internalType": "uint256", "name": "eggId2", "type": "uint256" }, { "internalType": "uint256", "name": "eggId3", "type": "uint256" }], "name": "claimAll", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xacd471c4" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }], "name": "collectFromUpgrader", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x91e45593" }, { "inputs": [{ "internalType": "uint256", "name": "eggId", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "calculateEggReward", "outputs": [{ "internalType": "uint256", "name": "payout", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xed17ce3c" }]
const EGG_UTIL_ABI = [{ "inputs": [{ "internalType": "contract Eggs", "name": "eggs_", "type": "address" }, { "internalType": "contract EggProfit", "name": "eggProfit_", "type": "address" }, { "internalType": "contract EggColorProfit", "name": "eggColorProfit_", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event", "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0" }, { "inputs": [], "name": "eggColorProfit", "outputs": [{ "internalType": "contract EggColorProfit", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x91a45e69" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "eggDetailsOf", "outputs": [{ "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "rarities", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "colors", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "levels", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "oilLevels", "type": "uint256[]" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x7e33b3e5" }, { "inputs": [], "name": "eggProfit", "outputs": [{ "internalType": "contract EggProfit", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xad6f5104" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "eggRewardsOf", "outputs": [{ "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "rewards", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "colorRewards", "type": "uint256[]" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x4d6203df" }, { "inputs": [], "name": "eggs", "outputs": [{ "internalType": "contract Eggs", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xe33f76cf" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "eggsOf", "outputs": [{ "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x6c2c8052" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x8da5cb5b" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x715018a6" }, { "inputs": [{ "internalType": "contract EggColorProfit", "name": "eggColorProfit_", "type": "address" }], "name": "setEggColorProfit", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x4ac23358" }, { "inputs": [{ "internalType": "contract EggProfit", "name": "eggProfit_", "type": "address" }], "name": "setEggProfit", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x345af9ba" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }]
const OIL_ABI = [{ "inputs": [{ "internalType": "address", "name": "team", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event", "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event", "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event", "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xdd62ed3e" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function", "signature": "0x095ea7b3" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x70a08231" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "burners", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x03d41e0e" }, { "inputs": [], "name": "canHoldersBurn", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x4be6f135" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x313ce567" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function", "signature": "0xa457c2d7" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function", "signature": "0x39509351" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "minters", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xf46eccc4" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x06fdde03" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x8da5cb5b" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x715018a6" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x95d89b41" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x18160ddd" }, { "inputs": [], "name": "totalSupplyLimit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xbac21a22" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function", "signature": "0xa9059cbb" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function", "signature": "0x23b872dd" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }, { "inputs": [{ "internalType": "address", "name": "spenderContract", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xcae9ca51" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x40c10f19" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x42966c68" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x9dc29fac" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x79cc6790" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bool", "name": "canMint", "type": "bool" }], "name": "setMinter", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0xcf456ae7" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bool", "name": "canBurn", "type": "bool" }], "name": "setBurner", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x0d895ee1" }, { "inputs": [{ "internalType": "bool", "name": "canBurn", "type": "bool" }], "name": "setCanHoldersBurn", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x62306148" }]

// smart contract addresses
const EGG_CONTRACT = "0xD5783390271D543b91BD72470e087FaFF6626eAB"
const EGG_COLOR_CONTRACT = "0x43bBb4948E8c28A3F6aFc0280864b0996270ADbc"
const EGG_UTIL_CONTRACT = "0xBC6aD24914F347346091E9DF238B6EC1b847557c"
const OIL_CONTRACT = "0x1449Ab6C24Dcf3DbC1971021f465af1B81F48F07"

// smart contract objects
const eggContract = new web3.eth.Contract(EGG_ABI, EGG_CONTRACT)
const eggColorContract = new web3.eth.Contract(EGG_COLOR_ABI, EGG_COLOR_CONTRACT)
const eggsUtilsContract = new web3.eth.Contract(EGG_UTIL_ABI, EGG_UTIL_CONTRACT)
const oilContract = new web3.eth.Contract(OIL_ABI, OIL_CONTRACT)

// egg params
enum EggColor {
    blue = 'blue',
    purple = 'purple',
    yellow = 'yellow',
}

enum EggRarity {
    common = 'common',
    rare = 'rare',
    epic = 'epic',
    legendary = 'legendary'
}

interface Egg {
    id: number;
    name: string;
    image: string;
    color: EggColor;
    priority: number;
    rarity: EggRarity;
    level: number;
    oilSpent: number;
    mainRewardToClaim: number;
    colorRewardToClaim: number;
}

const EGG_RARITY_WEIGHT = {
    [EggRarity.common]: 1,
    [EggRarity.rare]: 2,
    [EggRarity.epic]: 3,
    [EggRarity.legendary]: 4
};

const AMOUNT_OF_EGGS_PER_BUNDLE = 3;
const COLORS_PER_BUNDLE = [EggColor.blue, EggColor.purple, EggColor.yellow];

var groupEggs
var groupIndex = -1

async function getAllEggTokens() {
   
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const [details, rewards] = await Promise.all([
        eggsUtilsContract.methods.eggDetailsOf(wallet.address, 0, 0).call(),
        eggsUtilsContract.methods.eggRewardsOf(wallet.address, 0, 0, currentTimestamp).call()
    ]);

    const cards = buildEggCards(details, rewards);
    return cards.sort((a, b) => a.id - b.id);
};

const buildEggCards = (details: any, rewards: any): Egg[] => {
    const eggs: Egg[] = [];

    for (let i = 0; i < details.ids.length; i++) {
        const cardId = details.ids[i];
        const color = getEggColor(details.colors[i]);
        const rarity = getEggRarity(details.rarities[i]);
        const level = details.levels[i];
        const oilLevel = Number(Web3.utils.fromWei(details.oilLevels[i]));
        const priority = getEggPriority(color);

        const mainRewardToClaim = Number(Web3.utils.fromWei(rewards.rewards[i]));
        const colorRewardToClaim = Number(Web3.utils.fromWei(rewards.colorRewards[i]));

        eggs.push({
            id: cardId,
            name: 'Egg#' + cardId,
            color,
            rarity,
            priority,
            image: null, //`/eggs/egg-${rarity}-${color}-${['a', 'b', 'c'][cardId % 3]}.png`,
            level: level,
            oilSpent: oilLevel,
            mainRewardToClaim,
            colorRewardToClaim
        });
    }

    return eggs;
};

const getEggPriority = (eggColor: string) => {
    const data: { [key: string]: number } = {
        blue: 0,
        purple: 1,
        yellow: 2
    };
    return data[eggColor];
};

const getEggColor = (eggColor: string): EggColor => {
    if (eggColor === '0') {
        return EggColor.blue;
    } else if (eggColor === '1') {
        return EggColor.purple;
    } else if (eggColor === '2') {
        return EggColor.yellow;
    }

    throw Error('Cannot parse egg color');
};

const getEggRarity = (eggRarity: string): EggRarity => {
    if (eggRarity === '0') {
        return EggRarity.common;
    } else if (eggRarity === '1') {
        return EggRarity.rare;
    } else if (eggRarity === '2') {
        return EggRarity.epic;
    } else if (eggRarity === '3') {
        return EggRarity.legendary;
    }

    throw Error('Cannot parse whitelist type');
};

const groupEggsIntoBundles = (eggs: Egg[]): Egg[][] => {
    if (!eggs) return [];

    const eggsByRarityMap = new Map<EggRarity, Egg[]>();

    eggs.forEach(egg => {
        if (eggsByRarityMap.has(egg.rarity)) {
            eggsByRarityMap.set(egg.rarity, [...eggsByRarityMap.get(egg.rarity)!, egg]);
        } else {
            eggsByRarityMap.set(egg.rarity, [egg]);
        }
    });

    const groups: Egg[][] = [];

    eggsByRarityMap.forEach((eggsByRarity, rarity) => {
        eggsByRarity.forEach(egg => {
            const groupToAdd = groups.find(group => {
                if (group[0].rarity !== rarity || group.length === AMOUNT_OF_EGGS_PER_BUNDLE) return false;
                const currentColors: EggColor[] = group.map(egg => egg.color);
                if (currentColors.includes(egg.color)) return false;

                // TODO: add color reward condition
                return group;
            });
            if (groupToAdd) {
                groupToAdd.push(egg);
            } else {
                groups.push([egg]);
            }
        });
    });

    // sorting to show bundles with the high rarity first
    return groups.sort((group1, group2) => EGG_RARITY_WEIGHT[group2[0].rarity] - EGG_RARITY_WEIGHT[group1[0].rarity]);
};

async function checkBalanceAndClaimOil() {

    await checkBalance();
    claimAll();
}

async function checkBalance() {
    let oneBalance = await provider.getBalance(wallet.address);
    oneBalance = Number.parseFloat(web3.utils.fromWei(oneBalance.toString(), 'ether'))
    console.log(/*'\x1b[41m%s\x1b[0m',*/ `Balance: ${oneBalance.toFixed(2)} ONE`);

    let oilBalance = Number(Web3.utils.fromWei(await oilContract.methods.balanceOf(wallet.address).call()));
    
    console.log(`Balance: ${oilBalance.toFixed(2)} OIL`);
    console.log(``);
}

async function claimAll() {

    try {
        let eggs = await getAllEggTokens()

        if (eggs.length == 0) {
            console.log(`You need eggs to claim oil.`)
        }
        else {
            console.log(`You have ${eggs.length} eggs.`)
            // populate egg groups
            groupEggs = groupEggsIntoBundles(eggs)

            tryClaimOilInGroup()
        }

    } catch (e) {
        console.log(`error : ${e}`)
    }
}

async function tryClaimOilInGroup() {

    await new Promise(resolve => setTimeout(resolve, 2000));
    groupIndex++

    if (groupIndex < groupEggs.length) {
        // egg group reward calculations
        const group = groupEggs[groupIndex]

        var eggsIDs = new Array()
        let eggsString = " "
        let mainOilRewards = 0
        let colorOilRewards = group[0].colorRewardToClaim
        for (const index in group) {
            mainOilRewards += Number(group[index].mainRewardToClaim)

            if (colorOilRewards > group[index].colorRewardToClaim) {
                colorOilRewards = group[index].colorRewardToClaim
            }
            
            eggsString += `#${group[index].id} `
            eggsIDs.push(group[index].id)
        }

        if (group.length < 3) {
            // no color bonus
            console.log(`Claiming ${group[0].rarity} group [${eggsString}] with ${mainOilRewards.toFixed(2)} OIL`)

            await claimBulk(eggsIDs)
        } else {
            // with color bonus
            console.log(`Claiming ${group[0].rarity} group [${eggsString}] with ${(mainOilRewards + colorOilRewards * 3).toFixed(2)} OIL`)

            await claimColor(group[0].id, group[1].id, group[2].id)
        }

    } else {
        checkBalance()
    }
}

async function claimBulk(eggIDs) {
    
    // send the transaction
    const transaction = await eggContract.methods.claimBulk(eggIDs).send({
        from: wallet.address,
        gas: gasLimit,
        gasPrice: gasPrice
    }).once('receipt', function (receipt) {
        var status = receipt.events.Claimed
        if (typeof status !== 'undefined' && status) {
            var claimedValue = web3.utils.fromWei(status.returnValues[1], 'ether')
            console.log(`Claimed: ${Number(claimedValue).toFixed(2)} OIL`)
        }

        tryClaimOilInGroup()
    }).once('error', function (error) {
        console.error(error)

        tryClaimOilInGroup()
    })
}

async function claimColor(eggID1, eggID2, eggID3) {
    
    // send the transaction
    const transaction = await eggColorContract.methods.claimAll(eggID1, eggID2, eggID3).send({
        from: wallet.address,
        gas: gasLimit,
        gasPrice: gasPrice
    }).once('receipt', function (receipt) {

        var totalOil = Number(0)
        var status = receipt.events.Claimed
        if (typeof status !== 'undefined' && status) {
            if (Array.isArray(status)) {
                for (const index in status) {
                    if (status[index].address == EGG_COLOR_CONTRACT) {
                        totalOil += Number(web3.utils.fromWei(status[index].returnValues.amount, 'ether')) * 3
                    }
                    else {
                        totalOil += Number(web3.utils.fromWei(status[index].returnValues.amount, 'ether'))
                    }
                }
            } 

            console.log(`Claimed: ${totalOil.toFixed(2)} OIL`)
        }

        tryClaimOilInGroup()
    }).once('error', function (error) {
        console.error(error)

        tryClaimOilInGroup()
    })
}

checkBalanceAndClaimOil();

// initial addys
/*
aggregator: "0xdCD81FbbD6c4572A69a534D8b8152c562dA8AbEF"
aggregatorEth: "0xbaf7C8149D586055ed02c286367A41E0aDA96b7C"
colorProfit: "0x6476d00767a97341a9EE954D7b603647e9D0cdd8"
eggLevelUpgradeProcessor: "0x9b1459c78B47e026b3ad23989cbfe8dD28E1e03C"
eggs: "0xeE7fA9bad1aEba2C04Ed39ec52b1f05E42cf93a4"
eggsUtils: "0x37EF402C555EB0a81F15aE3B9cD43EaC320f5e3b"
itemSeller: "0x4AF69bC1b4695ce7bB382F91373EBB2C067E658f"
oil: "0x1449Ab6C24Dcf3DbC1971021f465af1B81F48F07"
profit: "0xD5783390271D543b91BD72470e087FaFF6626eAB"
seller: "0xb3F82B7813C805d47eDfd53e3F45636107d1B3b6"
stardust: "0x0C2868befB66144a82eB7a48383082E28f8E34fb"
whitelist: "0xe03bff4e54f0ad8d6855385d139004f291eed59c"
*/

// changes on 05/04/2022, around 14:00 utc (update egg levels to 30)
/*
aggregator: "0xdCD81FbbD6c4572A69a534D8b8152c562dA8AbEF"
aggregatorEth: "0xbaf7C8149D586055ed02c286367A41E0aDA96b7C"
colorProfit: "0x43bBb4948E8c28A3F6aFc0280864b0996270ADbc"                   *new
eggLevelUpgradeProcessor: "0x9b1459c78B47e026b3ad23989cbfe8dD28E1e03C"
eggs: "0xeE7fA9bad1aEba2C04Ed39ec52b1f05E42cf93a4"
eggsUtils: "0xBC6aD24914F347346091E9DF238B6EC1b847557c"                     *new
itemSeller: "0x4AF69bC1b4695ce7bB382F91373EBB2C067E658f"
oil: "0x1449Ab6C24Dcf3DbC1971021f465af1B81F48F07"
profit: "0xD5783390271D543b91BD72470e087FaFF6626eAB"
seller: "0xb3F82B7813C805d47eDfd53e3F45636107d1B3b6"
stardust: "0x0C2868befB66144a82eB7a48383082E28f8E34fb"
whitelist: "0xe03bff4e54f0ad8d6855385d139004f291eed59c"
*/