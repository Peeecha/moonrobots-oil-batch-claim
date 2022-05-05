var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
const Web3 = require('web3');
const ethers = require('ethers');
// wallet init
const web3 = new Web3(process.env.RPC_URL);
const wallet = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const gasPrice = 30000000000;
const gasLimit = 5000000;
// smart contract ABIs
const EGG_ABI = require('./abi/egg.json');
const EGG_COLOR_ABI = require('./abi/egg_color.json');
const EGG_UTIL_ABI = require('./abi/egg_util.json');
const OIL_ABI = require('./abi/oil.json');
// smart contract addresses
const EGG_CONTRACT = "0xD5783390271D543b91BD72470e087FaFF6626eAB";
const EGG_COLOR_CONTRACT = "0x43bBb4948E8c28A3F6aFc0280864b0996270ADbc";
const EGG_UTIL_CONTRACT = "0xBC6aD24914F347346091E9DF238B6EC1b847557c";
const OIL_CONTRACT = "0x1449Ab6C24Dcf3DbC1971021f465af1B81F48F07";
// smart contract objects
const eggContract = new web3.eth.Contract(EGG_ABI, EGG_CONTRACT);
const eggColorContract = new web3.eth.Contract(EGG_COLOR_ABI, EGG_COLOR_CONTRACT);
const eggsUtilsContract = new web3.eth.Contract(EGG_UTIL_ABI, EGG_UTIL_CONTRACT);
const oilContract = new web3.eth.Contract(OIL_ABI, OIL_CONTRACT);
// egg params
var EggColor;
(function (EggColor) {
    EggColor["blue"] = "blue";
    EggColor["purple"] = "purple";
    EggColor["yellow"] = "yellow";
})(EggColor || (EggColor = {}));
var EggRarity;
(function (EggRarity) {
    EggRarity["common"] = "common";
    EggRarity["rare"] = "rare";
    EggRarity["epic"] = "epic";
    EggRarity["legendary"] = "legendary";
})(EggRarity || (EggRarity = {}));
const EGG_RARITY_WEIGHT = {
    [EggRarity.common]: 1,
    [EggRarity.rare]: 2,
    [EggRarity.epic]: 3,
    [EggRarity.legendary]: 4
};
const AMOUNT_OF_EGGS_PER_BUNDLE = 3;
const COLORS_PER_BUNDLE = [EggColor.blue, EggColor.purple, EggColor.yellow];
var groupEggs;
var groupIndex = -1;
function getAllEggTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const [details, rewards] = yield Promise.all([
            eggsUtilsContract.methods.eggDetailsOf(wallet.address, 0, 0).call(),
            eggsUtilsContract.methods.eggRewardsOf(wallet.address, 0, 0, currentTimestamp).call()
        ]);
        const cards = buildEggCards(details, rewards);
        return cards.sort((a, b) => a.id - b.id);
    });
}
;
const buildEggCards = (details, rewards) => {
    const eggs = [];
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
            image: null,
            level: level,
            oilSpent: oilLevel,
            mainRewardToClaim,
            colorRewardToClaim
        });
    }
    return eggs;
};
const getEggPriority = (eggColor) => {
    const data = {
        blue: 0,
        purple: 1,
        yellow: 2
    };
    return data[eggColor];
};
const getEggColor = (eggColor) => {
    if (eggColor === '0') {
        return EggColor.blue;
    }
    else if (eggColor === '1') {
        return EggColor.purple;
    }
    else if (eggColor === '2') {
        return EggColor.yellow;
    }
    throw Error('Cannot parse egg color');
};
const getEggRarity = (eggRarity) => {
    if (eggRarity === '0') {
        return EggRarity.common;
    }
    else if (eggRarity === '1') {
        return EggRarity.rare;
    }
    else if (eggRarity === '2') {
        return EggRarity.epic;
    }
    else if (eggRarity === '3') {
        return EggRarity.legendary;
    }
    throw Error('Cannot parse whitelist type');
};
const groupEggsIntoBundles = (eggs) => {
    if (!eggs)
        return [];
    const eggsByRarityMap = new Map();
    eggs.forEach(egg => {
        if (eggsByRarityMap.has(egg.rarity)) {
            eggsByRarityMap.set(egg.rarity, [...eggsByRarityMap.get(egg.rarity), egg]);
        }
        else {
            eggsByRarityMap.set(egg.rarity, [egg]);
        }
    });
    const groups = [];
    eggsByRarityMap.forEach((eggsByRarity, rarity) => {
        eggsByRarity.forEach(egg => {
            const groupToAdd = groups.find(group => {
                if (group[0].rarity !== rarity || group.length === AMOUNT_OF_EGGS_PER_BUNDLE)
                    return false;
                const currentColors = group.map(egg => egg.color);
                if (currentColors.includes(egg.color))
                    return false;
                // TODO: add color reward condition
                return group;
            });
            if (groupToAdd) {
                groupToAdd.push(egg);
            }
            else {
                groups.push([egg]);
            }
        });
    });
    // sorting to show bundles with the high rarity first
    return groups.sort((group1, group2) => EGG_RARITY_WEIGHT[group2[0].rarity] - EGG_RARITY_WEIGHT[group1[0].rarity]);
};
function checkBalanceAndClaimOil() {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkBalance();
        claimAll();
    });
}
function checkBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        let oneBalance = yield provider.getBalance(wallet.address);
        oneBalance = Number.parseFloat(web3.utils.fromWei(oneBalance.toString(), 'ether'));
        console.log(/*'\x1b[41m%s\x1b[0m',*/ `Balance: ${oneBalance.toFixed(2)} ONE`);
        let oilBalance = Number(Web3.utils.fromWei(yield oilContract.methods.balanceOf(wallet.address).call()));
        console.log(`Balance: ${oilBalance.toFixed(2)} OIL`);
        console.log(``);
    });
}
function claimAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let eggs = yield getAllEggTokens();
            if (eggs.length == 0) {
                console.log(`You need eggs to claim oil.`);
            }
            else {
                console.log(`You have ${eggs.length} eggs.`);
                // populate egg groups
                groupEggs = groupEggsIntoBundles(eggs);
                tryClaimOilInGroup();
            }
        }
        catch (e) {
            console.log(`error : ${e}`);
        }
    });
}
function tryClaimOilInGroup() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 2000));
        groupIndex++;
        if (groupIndex < groupEggs.length) {
            // egg group reward calculations
            const group = groupEggs[groupIndex];
            var eggsIDs = new Array();
            let eggsString = " ";
            let mainOilRewards = 0;
            let colorOilRewards = group[0].colorRewardToClaim;
            for (const index in group) {
                mainOilRewards += Number(group[index].mainRewardToClaim);
                if (colorOilRewards > group[index].colorRewardToClaim) {
                    colorOilRewards = group[index].colorRewardToClaim;
                }
                eggsString += `#${group[index].id} `;
                eggsIDs.push(group[index].id);
            }
            if (group.length < 3) {
                // no color bonus
                console.log(`Claiming ${group[0].rarity} group [${eggsString}] with ${mainOilRewards.toFixed(2)} OIL`);
                yield claimBulk(eggsIDs);
            }
            else {
                // with color bonus
                console.log(`Claiming ${group[0].rarity} group [${eggsString}] with ${(mainOilRewards + colorOilRewards * 3).toFixed(2)} OIL`);
                yield claimColor(group[0].id, group[1].id, group[2].id);
            }
        }
        else {
            checkBalance();
        }
    });
}
function claimBulk(eggIDs) {
    return __awaiter(this, void 0, void 0, function* () {
        // send the transaction
        const transaction = yield eggContract.methods.claimBulk(eggIDs).send({
            from: wallet.address,
            gas: gasLimit,
            gasPrice: gasPrice
        }).once('receipt', function (receipt) {
            var status = receipt.events.Claimed;
            if (typeof status !== 'undefined' && status) {
                var claimedValue = web3.utils.fromWei(status.returnValues[1], 'ether');
                console.log(`Claimed: ${Number(claimedValue).toFixed(2)} OIL`);
            }
            tryClaimOilInGroup();
        }).once('error', function (error) {
            console.error(error);
            tryClaimOilInGroup();
        });
    });
}
function claimColor(eggID1, eggID2, eggID3) {
    return __awaiter(this, void 0, void 0, function* () {
        // send the transaction
        const transaction = yield eggColorContract.methods.claimAll(eggID1, eggID2, eggID3).send({
            from: wallet.address,
            gas: gasLimit,
            gasPrice: gasPrice
        }).once('receipt', function (receipt) {
            var totalOil = Number(0);
            var status = receipt.events.Claimed;
            if (typeof status !== 'undefined' && status) {
                if (Array.isArray(status)) {
                    for (const index in status) {
                        if (status[index].address == EGG_COLOR_CONTRACT) {
                            totalOil += Number(web3.utils.fromWei(status[index].returnValues.amount, 'ether')) * 3;
                        }
                        else {
                            totalOil += Number(web3.utils.fromWei(status[index].returnValues.amount, 'ether'));
                        }
                    }
                }
                console.log(`Claimed: ${totalOil.toFixed(2)} OIL`);
            }
            tryClaimOilInGroup();
        }).once('error', function (error) {
            console.error(error);
            tryClaimOilInGroup();
        });
    });
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
//# sourceMappingURL=app.js.map