"use strict";

const BUYABLE_TYPES = ["basic", "special", "genXP", "genEnh", "tierXP", "tierEnh", "prestige", "prestigeFluid", "ascend", "setbackDim", "setbackPrio", "anticap"];

class Buyable {
    constructor(category, superType, type, id, enabledFunc, showFunc, autobuyFunc, reqFunc, costFunc, targetFunc, effectFunc, descFunc) {
        /*
        category:
        0 = pre-prestige
        100 = pre-ascension
        150 = pre-setback
        167 = pre-gen-enhancers
        200 = pre-transcension
        225 = pre-tier-enhancers
        250 = pre-anticap
        275 = post-anticap
        */
        this.category = category;
        this.superID = superType;
        this.type = type;
        this.id = id;
        // if it's enabled/disabled (disabled means cannot buy, has no effect)
        this.enabledFunc = enabledFunc;
        // if it's visible
        this.showFunc = showFunc;
        // determines auto buyer speed
        this.autoFunc = autobuyFunc;
        // reqFunc: needs something else in order to be buyable...
        this.reqFunc = reqFunc;

        this.costFunc = costFunc;
        this.targetFunc = targetFunc;
        this.effectFunc = effectFunc;
        this.descFunc = descFunc;
        this.reset();
    }

    reset() {
        this.enabled = false;
        this.shown = false;

        // req satisfied
        this.req = false;

        this.autoSpd = D(0);
        this.cost = D(Infinity);
        this.effect = D(0);
        this.target = D(0);
        this.desc = "";
        this.canBuy = false;
        this.safeguard = false; // set to true when bought, will ignore >1 click in one frame
    }

    shitInTheFan(check, error) {
        if (check === null) {
            throw new Error(`[BUYABLE Category ${this.category} Type ${this.type} ID ${this.id}]: ${error}`);
        }
        checkNaN(check, `[BUYABLE Category ${this.category} Type ${this.type} ID ${this.id}]: ${error}`);
    }

    disableSafeguard() {
        this.safeguard = false;
    }

    updateEnabled() {
        this.enabled = this.enabledFunc();
    }

    updateShown() {
        this.shown = this.showFunc();
    }

    updateAutobuyer() {
        this.autoSpd = this.autoFunc();
    }

    updateReq() {
        this.req = this.reqFunc();
    }

    updateCostAndBuyability(bought, resource) {
        if (!this.enabled) {
            this.cost = D(Infinity);
            this.canBuy = false;
            return;
        }
        this.cost = this.costFunc(bought);
        this.cost = this.cost.ceil();
        this.canBuy = this.req && Decimal.gte(resource, this.cost);

        this.shitInTheFan(this.cost, `Cost returned NaN.`);
    }

    updateTarget(resource) {
        if (!this.enabled) {
            this.target = D(0);
            return;
        }
        this.target = this.targetFunc(resource);
        this.shitInTheFan(this.target, `Target returned NaN.`);
    }

    updateEffect(bought) {
        let effBought = this.enabled ? D(effBought).floor() : D(0);
        this.effect = this.effectFunc(effBought);
        this.shitInTheFan(this.effect, `Effect returned NaN.`);
    }
    
    updateDesc(effects, nextEffs) {
        this.desc = this.descFunc(effects, nextEffs);
    }
    
    // null = return it
    // non-null = set it to value
    useResource(value = null) {
        // wish i didn't have to use a big switch statement :c
        switch (this.type) {
            case "basic":
            case "special":
                if (value === null) {
                    return player.points;
                } else {
                    player.points = value;
                }
                break;
            case "genXP":
                if (value === null) {
                    return player.generatorFeatures.xp;
                } else {
                    player.generatorFeatures.xp = value;
                }
                break;
            case "genEnh":
                if (value === null) {
                    return player.generatorFeatures.enhancer;
                } else {
                    player.generatorFeatures.enhancer = value;
                }
                break;
            case "tierXP":
                if (value === null) {
                    return player.tierFeatures.xp;
                } else {
                    player.tierFeatures.xp = value;
                }
                break;
            case "tierEnh":
                if (value === null) {
                    return player.tierFeatures.enhancer;
                } else {
                    player.tierFeatures.enhancer = value;
                }
                break;
            case "prestige":
                if (value === null) {
                    return Decimal.sub(player.prestige, tmp.prestigePointsUsed);
                } else {
                    // nothing, handled via tmp.prestigePointsUsed
                }
                break;
            case "prestigeFluid":
                if (value === null) {
                    return Decimal.sub(player.prestigeFluid, tmp.pfUsed)
                } else {
                    // nothing, handled via tmp.pfUsed
                }
                break;
            case "ascend":
                if (value === null) {
                    return player.ascendGems;
                } else {
                    player.ascendGems = value;
                }
                break;
            case "setbackDim":
            case "setbackPrio":
                if (value === null) {
                    return player.setbackEnergy[this.superID];
                } else {
                    player.setbackEnergy[this.superID] = value;
                }
                break;
            case "anticap":
                if (value === null) {
                    return player.anticap.energy;
                } else {
                    player.anticap.energy = value;
                }
                break;
            default:
                this.shitInTheFan(null, `Invalid type (${this.type}) used while trying to get/set resource`);
        }
    }

    // same as useResource
    useBought(idUsed = this.id, value = null) {
        // wish i didn't have to use a big switch statement :c
        switch (this.type) {
            case "basic":
                if (value === null) {
                    return player.buyables[idUsed];
                } else {
                    player.buyables[idUsed] = value;
                }
                break;
            case "special":
                if (value === null) {
                    return player.specialBuyables[idUsed];
                } else {
                    player.specialBuyables[idUsed] = value;
                }
                break;
            case "genXP":
                if (value === null) {
                    return player.generatorFeatures.buyable[idUsed];
                } else {
                    player.generatorFeatures.buyable[idUsed] = value;
                }
                break;
            case "genEnh":
                if (value === null) {
                    return player.generatorFeatures.enhancerBuyables[idUsed];
                } else {
                    player.generatorFeatures.enhancerBuyables[idUsed] = value;
                }
                break;
            case "tierXP":
                if (value === null) {
                    return player.tierFeatures.buyable[idUsed];
                } else {
                    player.tierFeatures.buyable[idUsed] = value;
                }
                break;
            case "tierEnh":
                if (value === null) {
                    return player.tierFeatures.enhancerBuyables[idUsed];
                } else {
                    player.tierFeatures.enhancerBuyables[idUsed] = value;
                }
                break;
            case "prestige":
                if (value === null) {
                    return player.prestigeUpgrades[idUsed];
                } else {
                    player.prestigeUpgrades[idUsed] = value;
                }
                break;
            case "prestigeFluid":
                if (value === null) {
                    return player.prestigeFluidUpgs[idUsed];
                } else {
                    player.prestigeFluidUpgs[idUsed] = value;
                }
                break;
            case "ascend":
                if (value === null) {
                    return player.ascendUpgrades[idUsed];
                } else {
                    player.ascendUpgrades[idUsed] = value;
                }
                break;
            case "setbackDim":
                if (value === null) {
                    return player.quarkDimsBought[this.superID][idUsed];
                } else {
                    player.quarkDimsBought[this.superID][idUsed] = value;
                }
                break;
            case "setbackPrio":
                if (value === null) {
                    return player.setbackPriority[idUsed];
                } else {
                    player.setbackPriority[idUsed] = value;
                }
                break;
            case "anticap":
                if (value === null) {
                    return player.anticap.buyables[idUsed];
                } else {
                    player.anticap.buyables[idUsed] = value;
                }
                break;
            default:
                this.shitInTheFan(null, `Invalid type (${this.type}) used while trying to get/set bought amount`);
        }
    }
    
    calcBuy(resource, currBoughtAmount, bulkAmount, iterations = 10) {
        if (this.safeguard || !this.canBuy) {
            return { 
                newBought: currBoughtAmount,
                newResource: resource
            }
        }
        
        let bulk = bulkAmount;

        let bought = currBoughtAmount;
        let remainingResource = resource;

        // if cost scales too quickly, do not do iterations lol
        if (this.costFunc(bought).div(Decimal.sub(this.costFunc(bought), 1)).gte(1e12)) {
            iterations = 1;
        }

        if (this.targetFunc(remainingResource).lt(1e12) && Decimal.lt(remainingResource, 'ee12')) {
            // might fail because of decimals, hope it doesn't, otherwise i'm in for a world of pain
            let currentBought = this.targetFunc(remainingResource).min(Decimal.add(bought, bulk)).sub(iterations - 1).max(bought);
            let currCost = this.costFunc(currentBought);
            
            for (let i = 0; i < iterations; i++) {
                if (Decimal.lt(remainingResource, currCost) || Decimal.lte(bulk, 0)) {
                    break;
                }

                remainingResource = Decimal.sub(remainingResource, currCost);
                currentBought = currentBought.add(1);
                bulk = Decimal.sub(bulk, 1);
                bought = currentBought;
                currCost = this.costFunc(currentBought);
            }
        } else {
            bought = this.targetFunc(remainingResource).min(Decimal.add(bought, bulk)).add(1).max(bought);
        }

        return {
            newBought: bought,
            newResource: remainingResource
        };
    }

    buy(click, delta) {
        if (this.autoSpd.lte(0) && !click) {
            return;
        }

        let resourceUsed = this.useResource();
        if (this.category < 200) {
            if (tmp.hinderances[4].depth.gt(0) && this.id != 0) {
                resourceUsed = this.useBought(this.id - 1);
            }
        }
        let boughtUsed = this.useBought();
        
        let returned = this.calcBuy(resourceUsed, boughtUsed, 
            click 
            ? (shiftDown ? Infinity : 1)
            : this.autoSpd.mul(delta));

        this.useBought(this.id, returned.newBought);
        this.useResource(returned.newResource);
        if (this.category < 200) {
            if (tmp.hinderances[4].depth.gt(0) && this.id != 0) {
                this.useBought(this.id - 1, returned.newResource);
            }
        }
        this.safeguard = true;
    }
}

class BuyableList {
    constructor(type, buyables) {
        this.type = type
        this.buyables = buyables;
    }

    resetAll() {
        for (let i = 0; i < this.buyables.length; i++) {
            this.buyables[i].reset();
        }
    }

    updateAllInList(delta) {
        for (let i = this.buyables.length - 1; i >= 0; i--) {
            this.buyables[i].disableSafeguard();
            this.buyables[i].updateEnabled();
            this.buyables[i].updateShown();
            
            this.buyables[i].updateReq();

            this.buyables[i].updateAutobuyer();
            
            let bought = this.buyables[i].useBought();
            let resource = this.buyables[i].useResource();

            this.buyables[i].updateTarget(resource);
            this.buyables[i].buy(false, delta);
            
            this.buyables[i].updateCostAndBuyability(bought, resource);
            this.buyables[i].updateEffect(bought);
            this.buyables[i].updateDesc(bought);
        }
    }
}