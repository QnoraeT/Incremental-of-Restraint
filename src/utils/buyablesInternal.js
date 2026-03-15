"use strict";

class Buyable {
    constructor(id, locations, enabledFunc, costFunc, targetFunc, effectFunc, specialFunc) {
        // locations
        /* 
            const TEST_BUY_LOCATIONS = () => { return {
                resource: player.points,
                playerBuyableArea: player.testBuyables,
                tmpBuyableArea: tmp.testBuyables
            } };
        */
        this.id = id;
        this.location = locations;
        this.enabledFormulae = enabledFunc;
        this.costFormulae = costFunc;
        this.canBuy = false;
        this.targetFormulae = targetFunc;
        this.effectFormulae = effectFunc;
        this.specialFormulae = specialFunc;
    }

    // returns DecimalSource
    get amount() {
        return this.location().playerBuyableArea[this.id];
    }
    
    getAmountOfOthers(id) {
        return this.location().playerBuyableArea[id];
    }

    get enabled() {
        return this.enabledFormulae();
    }

    get cost() {
        let bought = this.amount;
        this.canBuy = Decimal.gte(this.location().resource, this.internalCost);
        return this.costFormulae(bought);
    }

    get target() {
        let resource = this.location().resource;
        return this.targetFormulae(resource);
    }

    get effect() {
        let bought = this.amount;
        return this.effectFormulae(bought);
    }

    special(...arg) {
        return this.specialFormulae(...arg);
    }
}

// in gameHandle.js
function test() {
    player.testResource = new Decimal(5.5981e263);
    player.testBuyables = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
    tmp.testBuyables = [];
    for (let i = 0; i < player.testBuyables.length; i++) {
        tmp.testBuyables[i] = {
            cost: D(Infinity),
            target: D(0),
            eff: D(0),
            canBuy: false,
            enabled: false,
            special: {}
        }
    }
}

function updateAllBuyablesIntoTmp(locationFunc) {
    
}


/*
tmp.testBuyables[0].enabled = TEST_BUYABLES[0].enabled
tmp.testBuyables[0].cost = TEST_BUYABLES[0].cost
tmp.testBuyables[0].canBuy = TEST_BUYABLES[0].canBuy
tmp.testBuyables[0].target = TEST_BUYABLES[0].target
tmp.testBuyables[0].effect = TEST_BUYABLES[0].effect
// example: generators
tmp.testBuyables[0].special = TEST_BUYABLES[0].special(player.buyablePoints[0])
*/

const TEST_BUY_LOCATIONS = () => { return {
    resource: player.points,
    playerBuyableArea: player.testBuyables,
    tmpBuyableArea: tmp.testBuyables
} };

const TEST_BUYABLES = [
    new Buyable(0, TEST_BUY_LOCATIONS, 
        () => {
            return true;
        },
        (bought) => {
            return smoothExp(bought, 1.04, false).pow_base(2).mul(100)
        },
        (resource) => {
            if (Decimal.lt(resource, 100)) {
                return new Decimal(0)
            }
            return smoothExp(Decimal.div(resource, 100).log(2), 1.04, true)
        },
        (bought) => {
            let pow = new Decimal(2)
            pow = pow.mul(tmp.testBuyables[1].effect)
            return Decimal.add(bought, 1).pow(pow)
        },
        (genAmt) => {
            return inverseFact(genAmt).floor()
        }
    ),
    new Buyable(1, TEST_BUY_LOCATIONS, 
        () => {
            return true;
        },
        (bought) => {
            return smoothExp(bought, 1.05, false).pow_base(5).mul(2500)
        },
        (resource) => {
            if (Decimal.lt(resource, 2500)) {
                return new Decimal(0)
            }
            return smoothExp(Decimal.div(resource, 2500).log(5), 1.05, true)
        },
        (bought) => {
            return Decimal.pow(1.1, bought)
        }
    ),
    new Buyable(2, TEST_BUY_LOCATIONS, 
        () => {
            return true;
        },
        (bought) => {
            return Decimal.pow(10, bought).mul(4e7)
        },
        (resource) => {
            if (Decimal.lt(resource, 4e7)) {
                return new Decimal(0)
            }
            return Decimal.div(resource, 4e7).log10()
        },
        (bought) => {
            return Decimal.add(bought, 1)
        }
    ),
    new Buyable(3, TEST_BUY_LOCATIONS, 
        () => {
            return true;
        },
        (bought) => {
            return Decimal.pow(2, bought).pow_base(1e5).mul(1e15)
        },
        (resource) => {
            if (Decimal.lt(resource, 1e15)) {
                return new Decimal(0)
            }
            return Decimal.div(resource, 1e15).log(1e5).log(2)
        },
        (bought) => {
            return Decimal.pow(10000, bought)
        }
    )
]