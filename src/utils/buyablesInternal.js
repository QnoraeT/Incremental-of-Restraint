"use strict";

class Buyable {
    constructor(id, locations, enabledFunc, costFunc, targetFunc, effectFunc) {
        // locations
        /* 
        () => {
            resource: player.points,
            playerBuyableArea: player.buyables
            tmpBuyableArea: tmp.buyables
        }
        */
        this.id = id;
        this.location = locations;
        this.enabledFormulae = enabledFunc;
        this.costFormulae = costFunc;
        this.canBuy = false;
        this.targetFormulae = targetFunc;
        this.effectFormulae = effectFunc;

        this.internalCost = D(Infinity);
        this.internalTarget = D(-1);
        this.internalEffect = D(0);
        this.internalEnabled = false;

        this.costCached = false;
        this.targetCached = false;
        this.effectCached = false;
        this.enabledCached = false;
    }

    // returns DecimalSource
    get amount() {
        return this.location().playerBuyableArea[this.id];
    }
    
    getAmountOfOthers(id) {
        return this.location().playerBuyableArea[id];
    }

    invalidateCache() {
        this.costCached = false;
        this.targetCached = false;
        this.effectCached = false;
        this.enabledCached = false;
    }

    get enabled() {
        if (!this.enabledCached) {
            this.internalEnabled = this.enabledFormulae();
            this.enabledCached = true;
        }
        return this.internalEnabled;
    }

    get cost() {
        if (!this.costCached) {
            bought = this.amount;
            this.internalCost = this.costFormulae(bought);
            this.canBuy = Decimal.gte(this.location().resource, this.internalCost);
            this.costCached = true;
        }
        return this.internalCost;
    }

    get target() {
        if (!this.targetCached) {
            resource = this.location().resource;
            this.internalTarget = this.targetCached(resource);
            this.targetCached = true;
        }
        return this.internalTarget;
    }

    get effect() {
        if (!this.effectCached) {
            bought = this.amount;
            this.internalEffect = this.effectFormulae(bought);
            this.effectCached = true;
        }
        return this.internalEffect;
    }
}

function test() {
    player.testResource = new Decimal(5.5981e263);
    player.testBuyables = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
    tmp.testBuyables = [];
}


const TEST_BUY_LOCATIONS = () => { return {
    resource: player.testResource,
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
            return Decimal.add(bought, 1).pow(2)
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