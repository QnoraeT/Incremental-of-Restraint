"use strict";

const REPLIRANK_DATA = {
    gain(rank) {
        if (Decimal.eq(rank, 0)) { return D(0); }
        let gain = D(rank);
        gain = gain.factorial();
        return gain;
    },
    cost(rank) {
        let cost = D(rank);
        cost = cost.pow(2).pow_base(2).mul(2);
        return cost;
    },
    target(resource) {
        let target = D(resource);
        target = target.div(2).max(1).log(2).root(2);
        return target;
    },
    buyables: [
        {
            // shouldn't inflate because replicators scale exponentially but gradually slowdown via log,
            // after a point, i believe replicators scale linearly/polynomially at some point so this shouldn't inflate hopefully
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.add(1).pow_base(2);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.max(1).log(2).sub(1);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1);
                eff = eff.mul(Decimal.pow(2, bought));
                return eff;
            },
            desc(bought) {
                return `Increase replicator speed by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(3).mul(20);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(20).max(1).log(3);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1);
                return eff;
            },
            desc(bought) {
                return `Increase rank point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.01).sub(1).div(0.01).pow_base(16).mul(100);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(100).max(1).log(16).mul(0.01).add(1).log(1.01);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Setback multipliers are increased by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(20).mul(400);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(400).max(1).log(20).mul(0.02).add(1).log(1.02);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Increase generator speed by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        }
    ]
}

const REPLITIER_DATA = {
    gain(tier) {
        if (Decimal.eq(tier, 0)) { return D(0); }
        let gain = D(tier);
        gain = gain.pow(2).pow10();
        return gain;
    },
    cost(tier) {
        let cost = D(tier);
        cost = linearAdd(cost, 5, 1, false).add(25);
        return cost;
    },
    target(resource) {
        if (Decimal.lt(resource, 25)) {
            return D(0);
        }
        let target = D(resource);
        target = linearAdd(target.sub(25), 5, 1, true);
        return target;
    },
    buyables: [
        {
            // shouldn't inflate because replicators scale exponentially but gradually slowdown via log,
            // after a point, i believe replicators scale linearly/polynomially at some point so this shouldn't inflate hopefully
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.add(1).pow_base(2);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.max(1).log(2).sub(1);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1).pow(2);
                eff = eff.mul(Decimal.pow(5, bought));
                return eff;
            },
            desc(bought) {
                return `Increase replicator speed by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(3).mul(20);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(20).max(1).log(3);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1).pow(2);
                eff = eff.mul(Decimal.pow(2, bought));
                return eff;
            },
            desc(bought) {
                return `Increase rank point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(4).mul(50);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(50).max(1).log(4);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1).pow(2);
                return eff;
            },
            desc(bought) {
                return `Increase tier point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.01).sub(1).div(0.01).pow_base(40).mul(200);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(200).max(1).log(40).mul(0.01).add(1).log(1.01);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.05);
                return eff;
            },
            desc(bought) {
                return `Ascension gem gain is increased by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(100).mul(1e3);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1e3).max(1).log(100).mul(0.02).add(1).log(1.02);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Increase prestige point gain by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        }
    ]
}

const REPLITETR_DATA = {
    gain(tier) {
        if (Decimal.eq(tier, 0)) { return D(0); }
        let gain = D(tier);
        gain = gain.pow(2).pow10();
        return gain;
    },
    cost(tier) {
        let cost = D(tier);
        cost = linearAdd(cost, 4, 1, false).add(12);
        return cost;
    },
    target(resource) {
        if (Decimal.lt(resource, 12)) {
            return D(0);
        }
        let target = D(resource);
        target = linearAdd(target.sub(12), 4, 1, true);
        return target;
    },
    buyables: [
        {
            // shouldn't inflate because replicators scale exponentially but gradually slowdown via log,
            // after a point, i believe replicators scale linearly/polynomially at some point so this shouldn't inflate hopefully
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(2).mul(1000);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1000).max(1).log(2);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1).pow(4);
                eff = eff.mul(Decimal.pow(bought, 1.25).pow_base(10));
                return eff;
            },
            desc(bought) {
                return `Increase replicator speed by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(3).mul(1000);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1000).max(1).log(3);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(5);
                return eff;
            },
            desc(bought) {
                return `Increase rank point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(4).mul(1000);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1000).max(1).log(4);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(2);
                return eff;
            },
            desc(bought) {
                return `Increase tier point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(5).mul(1000);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1000).max(1).log(5);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1).pow(3);
                return eff;
            },
            desc(bought) {
                return `Increase tetr point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.01).sub(1).div(0.01).pow_base(40).mul(1e3);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1e3).max(1).log(40).mul(0.01).add(1).log(1.01);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Tier point gain is increased by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(100).mul(1e5);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(1e5).max(1).log(100).mul(0.02).add(1).log(1.02);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Increase prestige essence gain by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        }
    ]
}

function initHTML_replicators() {
    toHTMLvar('replicatorMainTabButton');
    toHTMLvar('replicatorMain');

    toHTMLvar('replicatorDisp');
    toHTMLvar('replicatorBestDisp');
    toHTMLvar('replicatorEffectDisp');
    toHTMLvar('replicatorTrueSpeed');
    toHTMLvar('replicatorTrueSpeed2');

    toHTMLvar('replicatorStrengthDisp1');
    toHTMLvar('replicatorStrengthDisp2');
    toHTMLvar('replicatorStrengthEffect');

    toHTMLvar('rankPointDisp');
    toHTMLvar('rankPointGenDisp');
    toHTMLvar('rankPointEffDisp');
    toHTMLvar('rankPointShow');
    toHTMLvar('rankPointBuyList');
    toHTMLvar('repliRankUpgsAll');
    toHTMLvar('repliRankAll');
    toHTMLvar('repliRank');
    toHTMLvar('repliRankAmount');
    toHTMLvar('repliRankEff');
    toHTMLvar('repliRankCost');

    toHTMLvar('repliRankBuyAuto');

    let txt = ``;
    for (let i = 0; i < player.replirankBuyables.length; i++) {
        txt += `
            <div id="repliRankBuy${i}all" style="width: 175px; margin: 2px">
                <button onclick="buyRepliRankBuy(${i})" id="repliRankBuy${i}" class="whiteText font" style="height: 85px; width: 175px; font-size: 10px; margin: 2px">
                    <span id="repliRankBuy${i}amount"></span><br>
                    <br>
                    <span id="repliRankBuy${i}eff"></span><br>
                    Cost: <span id="repliRankBuy${i}cost"></span>
                </button>
            </div>
        `;
    }
    html['rankPointBuyList'].setHTML(txt);
    for (let i = 0; i < player.replirankBuyables.length; i++) {
        toHTMLvar(`repliRankBuy${i}all`);
        toHTMLvar(`repliRankBuy${i}`);
        toHTMLvar(`repliRankBuy${i}amount`);
        toHTMLvar(`repliRankBuy${i}eff`);
        toHTMLvar(`repliRankBuy${i}cost`);
    }

    toHTMLvar('tierPointDisp');
    toHTMLvar('tierPointGenDisp');
    toHTMLvar('tierPointEffectDisp');
    toHTMLvar('tierPointEffect2Disp');
    toHTMLvar('tierPointShow');
    toHTMLvar('tierPointBuyList');
    toHTMLvar('repliTierUpgsAll')
    toHTMLvar('repliTierAll');
    toHTMLvar('repliTier');
    toHTMLvar('repliTierAmount');
    toHTMLvar('repliTierEff');
    toHTMLvar('repliTierCost');

    toHTMLvar('repliTierBuyAuto');

    txt = ``;
    for (let i = 0; i < player.replitierBuyables.length; i++) {
        txt += `
            <div id="repliTierBuy${i}all" style="width: 175px; margin: 2px">
                <button onclick="buyRepliTierBuy(${i})" id="repliTierBuy${i}" class="whiteText font" style="height: 85px; width: 175px; font-size: 10px; margin: 2px">
                    <span id="repliTierBuy${i}amount"></span><br>
                    <br>
                    <span id="repliTierBuy${i}eff"></span><br>
                    Cost: <span id="repliTierBuy${i}cost"></span>
                </button>
            </div>
        `;
    }
    html['tierPointBuyList'].setHTML(txt);
    for (let i = 0; i < player.replitierBuyables.length; i++) {
        toHTMLvar(`repliTierBuy${i}all`);
        toHTMLvar(`repliTierBuy${i}`);
        toHTMLvar(`repliTierBuy${i}amount`);
        toHTMLvar(`repliTierBuy${i}eff`);
        toHTMLvar(`repliTierBuy${i}cost`);
    }

    toHTMLvar('tetrPointDisp');
    toHTMLvar('tetrPointGenDisp');
    toHTMLvar('tetrPointEffectDisp');
    toHTMLvar('tetrPointEffect2Disp');
    toHTMLvar('tetrPointShow');
    toHTMLvar('tetrPointBuyList');
    toHTMLvar('repliTetrUpgsAll')
    toHTMLvar('repliTetrAll');
    toHTMLvar('repliTetr');
    toHTMLvar('repliTetrAmount');
    toHTMLvar('repliTetrEff');
    toHTMLvar('repliTetrCost');

    txt = ``;
    for (let i = 0; i < player.replitetrBuyables.length; i++) {
        txt += `
            <div id="repliTetrBuy${i}all" style="width: 175px; margin: 2px">
                <button onclick="buyRepliTetrBuy(${i})" id="repliTetrBuy${i}" class="whiteText font" style="height: 85px; width: 175px; font-size: 10px; margin: 2px">
                    <span id="repliTetrBuy${i}amount"></span><br>
                    <br>
                    <span id="repliTetrBuy${i}eff"></span><br>
                    Cost: <span id="repliTetrBuy${i}cost"></span>
                </button>
            </div>
        `;
    }
    html['tetrPointBuyList'].setHTML(txt);
    for (let i = 0; i < player.replitetrBuyables.length; i++) {
        toHTMLvar(`repliTetrBuy${i}all`);
        toHTMLvar(`repliTetrBuy${i}`);
        toHTMLvar(`repliTetrBuy${i}amount`);
        toHTMLvar(`repliTetrBuy${i}eff`);
        toHTMLvar(`repliTetrBuy${i}cost`);
    }
}

function updateGame_replicators() {
    let disabled = player.anticap.active && !player.anticap.upgrades.includes(21);
    tmp.replicatorEff = D(1);

    if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
        for (let i = REPLITETR_DATA.buyables.length - 1; i >= 0; i--) {
            let resource = player.replitetrPoints;
            tmp.repliTetrBuyables[i].target = REPLITETR_DATA.buyables[i].target(resource);
            
            let bought = player.replitetrBuyables[i];
            tmp.repliTetrBuyables[i].cost = REPLITETR_DATA.buyables[i].cost(bought);
            tmp.repliTetrBuyables[i].eff = REPLITETR_DATA.buyables[i].eff(disabled ? D(0) : bought);
            tmp.repliTetrBuyables[i].canBuy = Decimal.gte(resource, tmp.repliTetrBuyables[i].cost);
        }

        let resource = player.replitier;
        tmp.repliTetrTarget = REPLITETR_DATA.target(resource);

        let bought = player.replitetr;
        tmp.repliTetrReq = REPLITETR_DATA.cost(bought);

        tmp.repliTetrReqRepliNext = REPLIRANK_DATA.cost(REPLITIER_DATA.cost(tmp.repliTetrReq.sub(1)));

        tmp.repliTetrEffect = REPLITETR_DATA.gain(bought);

        tmp.repliTetrPointGen = D(0);
        tmp.repliTetrPointGen = tmp.repliTetrEffect;
        tmp.repliTetrPointGen = tmp.repliTetrPointGen.mul(tmp.repliTetrBuyables[3].eff);
        tmp.repliTetrPointGen = tmp.repliTetrPointGen.pow(tmp.hinderancePtsEff[5]);

        if (player.cheats.dilate) {
            tmp.repliTetrPointGen = cheatDilateBoost(tmp.repliTetrPointGen);
        }
        tmp.repliTetrPointGen = tmp.repliTetrPointGen.mul(tmp.timeSpeedTiers[1]);
        if (disabled) {
            tmp.repliTetrPointGen = D(0);
        }
        checkNaN(tmp.repliTetrPointGen, "NaN detected on replitetr point gain calculation");

        player.replitetrPoints = Decimal.add(player.replitetrPoints, tmp.repliTetrPointGen.mul(delta));
        if (disabled) {
            tmp.repliTetrPointEff = D(1);
            tmp.repliTetrPointEff2 = D(1);
        } else {
            tmp.repliTetrPointEff = Decimal.max(player.replitetrPoints, 0).add(1).log10().add(1).log10().mul(0.1).add(1).ln().add(1);
            tmp.repliTetrPointEff2 = Decimal.max(player.replitetrPoints, 0).add(1);
            if (Decimal.gte(player.hinderanceScore[5], HINDERANCES[5].start)) {
                tmp.repliTetrPointEff2 = tmp.repliTetrPointEff2.pow(2);
            }
            if (hasHinderanceMilestone(5, 0)) {
                tmp.repliTetrPointEff2 = tmp.repliTetrPointEff2.pow(1.5);
            }
            if (hasHinderanceMilestone(5, 1)) {
                tmp.repliTetrPointEff = tmp.repliTetrPointEff.pow(2);
                tmp.repliTetrPointEff2 = tmp.repliTetrPointEff2.pow(2);
            }
        }

        for (let i = REPLITIER_DATA.buyables.length - 1; i >= 0; i--) {
            let resource = player.replitierPoints;
            tmp.repliTierBuyables[i].target = REPLITIER_DATA.buyables[i].target(resource);

            if (player.repliTierBuyAuto) {
                let bought = D(player.replitierBuyables[i]);
                let buying = tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer.mul(tmp.timeSpeedTiers[1]) : D(Infinity);
                player.replitierBuyables[i] = Decimal.add(tmp.repliTierBuyables[i].target, 0.99999999).max(player.replitierBuyables[i]).min(Decimal.add(player.replitierBuyables[i], buying.mul(delta)));
                
                // assume Decimal and not DecimalSource due to the prior lines changing it
                if (Decimal.gt(player.replitierBuyables[i].floor(), bought.floor())) {
                    player.replitierPoints = Decimal.sub(player.replitierPoints, tmp.repliTierBuyables[i].cost).max(0); // idk why this is causing xp to go negative so i put a max 0 here
                }
            }
            
            let bought = player.replitierBuyables[i];
            tmp.repliTierBuyables[i].cost = REPLITIER_DATA.buyables[i].cost(Decimal.floor(bought));
            tmp.repliTierBuyables[i].eff = REPLITIER_DATA.buyables[i].eff(disabled ? D(0) : Decimal.floor(bought));
            tmp.repliTierBuyables[i].canBuy = Decimal.gte(resource, tmp.repliTierBuyables[i].cost);
        }

        resource = player.replirank;
        tmp.repliTierTarget = REPLITIER_DATA.target(resource);

        bought = player.replitier;
        tmp.repliTierReq = REPLITIER_DATA.cost(bought);

        tmp.repliTierNext = Decimal.gt(player.replitetrPoints, 0)
            ? tmp.repliTierTarget.floor().add(1).max(bought)
            : Decimal.add(bought, 1);
        tmp.repliTierReqNext = REPLITIER_DATA.cost(tmp.repliTierNext);
        tmp.repliTierReqRepliNext = REPLIRANK_DATA.cost(tmp.repliTierReqNext.sub(1));

        tmp.repliTierEffect = REPLITIER_DATA.gain(bought);

        tmp.repliTierPointGen = D(0);
        tmp.repliTierPointGen = tmp.repliTierEffect;
        tmp.repliTierPointGen = tmp.repliTierPointGen.mul(tmp.repliTierBuyables[2].eff);
        tmp.repliTierPointGen = tmp.repliTierPointGen.mul(tmp.repliTetrBuyables[2].eff);
        tmp.repliTierPointGen = tmp.repliTierPointGen.mul(tmp.repliTetrPointEff2);
        tmp.repliTierPointGen = tmp.repliTierPointGen.pow(tmp.hinderancePtsEff[5]);

        if (player.cheats.dilate) {
            tmp.repliTierPointGen = cheatDilateBoost(tmp.repliTierPointGen);
        }
        tmp.repliTierPointGen = tmp.repliTierPointGen.mul(tmp.timeSpeedTiers[1]);
        if (disabled) {
            tmp.repliTierPointGen = D(0);
        }
        checkNaN(tmp.repliTierPointGen, "NaN detected on replitier point gain calculation");

        player.replitierPoints = Decimal.add(player.replitierPoints, tmp.repliTierPointGen.mul(delta));
        if (disabled) {
            tmp.repliTierPointEff = D(0);
            tmp.repliTierPointEff2 = D(1);
        } else {
            tmp.repliTierPointEff = Decimal.max(player.replitierPoints, 1).log10().div(100).add(1).ln().mul(100).mul(10);
            tmp.repliTierPointEff2 = Decimal.max(player.replitierPoints, 0).add(1);
            if (Decimal.gte(player.hinderanceScore[5], HINDERANCES[5].start)) {
                tmp.repliTierPointEff2 = tmp.repliTierPointEff2.pow(2);
            }
            if (hasHinderanceMilestone(5, 0)) {
                tmp.repliTierPointEff2 = tmp.repliTierPointEff2.pow(1.5);
            }
        }

        for (let i = REPLIRANK_DATA.buyables.length - 1; i >= 0; i--) {
            let resource = player.replirankPoints;
            tmp.repliRankBuyables[i].target = REPLIRANK_DATA.buyables[i].target(resource);

            if (player.repliRankBuyAuto) {
                let bought = D(player.replirankBuyables[i]);
                let buying = tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer.mul(tmp.timeSpeedTiers[1]) : D(Infinity);
                player.replirankBuyables[i] = Decimal.add(tmp.repliRankBuyables[i].target, 0.99999999).max(player.replirankBuyables[i]).min(Decimal.add(player.replirankBuyables[i], buying.mul(delta)));
                
                // assume Decimal and not DecimalSource due to the prior lines changing it
                if (Decimal.gt(player.replirankBuyables[i].floor(), bought.floor())) {
                    player.replirankPoints = Decimal.sub(player.replirankPoints, tmp.repliRankBuyables[i].cost).max(0); // idk why this is causing xp to go negative so i put a max 0 here
                }
            }
            
            let bought = player.replirankBuyables[i];
            tmp.repliRankBuyables[i].cost = REPLIRANK_DATA.buyables[i].cost(Decimal.floor(bought));
            tmp.repliRankBuyables[i].eff = REPLIRANK_DATA.buyables[i].eff(disabled ? D(0) : Decimal.floor(bought));
            tmp.repliRankBuyables[i].canBuy = Decimal.gte(resource, tmp.repliRankBuyables[i].cost);
        }

        resource = player.replicators;
        tmp.repliRankTarget = REPLIRANK_DATA.target(resource);
        if (Decimal.gt(player.replitetrPoints, 0)) {
            player.replirank = Decimal.max(player.replirank, tmp.repliRankTarget.floor().add(1));
        }

        bought = player.replirank;
        tmp.repliRankReq = REPLIRANK_DATA.cost(bought);

        tmp.repliRankNext = Decimal.gt(player.replitierPoints, 0)
            ? tmp.repliRankTarget.floor().add(1).max(bought)
            : Decimal.add(bought, 1);
        tmp.repliRankReqNext = REPLIRANK_DATA.cost(tmp.repliRankNext);

        tmp.repliRankEffect = REPLIRANK_DATA.gain(bought);

        tmp.repliRankPointGen = D(0);
        tmp.repliRankPointGen = tmp.repliRankEffect;
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliRankBuyables[1].eff);
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliTierBuyables[1].eff);
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliTetrBuyables[1].eff);
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliTierPointEff2);
        tmp.repliRankPointGen = tmp.repliRankPointGen.pow(Decimal.mul(player.replitetr, 0.1).add(1));
        tmp.repliRankPointGen = tmp.repliRankPointGen.pow(tmp.hinderancePtsEff[5]);

        if (player.cheats.dilate) {
            tmp.repliRankPointGen = cheatDilateBoost(tmp.repliRankPointGen);
        }
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.timeSpeedTiers[1]);
        
        if (disabled) {
            tmp.repliRankPointGen = D(0);
        }
        checkNaN(tmp.repliRankPointGen, "NaN detected on replirank point gain calculation");
        
        player.replirankPoints = Decimal.add(player.replirankPoints, tmp.repliRankPointGen.mul(delta));
        
        if (player.transcendUpgrades.includes('repli2')) {
            tmp.repliRankPointEff = Decimal.add(player.replirankPoints, 1);
            if (Decimal.gte(player.hinderanceScore[5], HINDERANCES[5].start)) {
                tmp.repliRankPointEff = tmp.repliRankPointEff.pow(2);
            }
            if (hasHinderanceMilestone(5, 0)) {
                tmp.repliRankPointEff = tmp.repliRankPointEff.pow(1.5);
            }
        }
        
        tmp.replicatorSpd = D(1); // ! player.replicators can be placed in this even with trilate and no runaway inflation as long as no .pow10()
        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliRankBuyables[0].eff);
        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliTierBuyables[0].eff);
        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliTetrBuyables[0].eff);
        if (player.transcendUpgrades.includes("repli1")) {
            tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.transEffs[12][1]);
        }
        if (player.transcendUpgrades.includes('repli2')) {
            tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliRankPointEff);
        }
        if (player.transcendUpgrades.includes('repli2')) {
            tmp.replicatorSpd = tmp.replicatorSpd.pow(2);
        }
        if (hasHinderanceMilestone(5, 2)) {
            tmp.replicatorSpd = tmp.replicatorSpd.pow(tmp.hinderancePtsEff[5]);
        }
        if (tmp.hinderances[5].depth.gt(0)) {
            tmp.replicatorSpd = tmp.replicatorSpd.max(1).log10().add(1).pow(tmp.hinderances[5].effects.repliSpd).sub(1).pow10();
        }
        
        if (player.cheats.dilate) {
            tmp.replicatorSpd = cheatDilateBoost(tmp.replicatorSpd);
        }
        
        tmp.replicatorSpd = tmp.replicatorSpd.div(60).add(1); // adjusted to "per minute"
        if (disabled) {
            tmp.replicatorSpd = D(1);
        }
        checkNaN(tmp.replicatorSpd, "NaN detected on replicator speed calculation");
        
        tmp.replicatorStrength = D(100); // ! player.replicators CANNOT be placed in this without .log10() without runaway inflation
        tmp.replicatorStrength = tmp.replicatorStrength.add(tmp.repliTierPointEff);
        tmp.replicatorStrength = tmp.replicatorStrength.add(Decimal.mul(25, player.replitier));
        if (player.anticap.upgrades.includes(21)) {
            tmp.replicatorStrength = tmp.replicatorStrength.add(tmp.anticap.upgrades[21].eff);
        }
        tmp.replicatorStrength = tmp.replicatorStrength.mul(tmp.repliTetrPointEff);
        if (player.anticap.upgrades.includes(34)) {
            tmp.replicatorStrength = tmp.replicatorStrength.mul(1.25);
        }
        if (player.anticap.upgrades.includes(35)) {
            tmp.replicatorStrength = tmp.replicatorStrength.mul(tmp.anticap.upgrades[35].eff.repli);
        }
        if (Decimal.gte(player.hinderanceScore[5], HINDERANCES[5].start)) {
            tmp.replicatorStrength = tmp.replicatorStrength.mul(HINDERANCES[5].eff);
        }
        if (tmp.hinderances[5].depth.gt(0)) {
            tmp.replicatorStrength = tmp.replicatorStrength.div(tmp.hinderances[5].effects.repliStr);
        }
        checkNaN(tmp.replicatorStrength, "NaN detected on replicator strength calculation");

        tmp.replicatorTrueSpdDisp2 = player.replicators;
        player.replicators = Decimal.max(player.replicators, 1).root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).exp().mul(tmp.replicatorSpd.pow(tmp.timeSpeedTiers[1].mul(delta))).ln().div(tmp.replicatorStrength).add(1).pow(tmp.replicatorStrength);
        tmp.replicatorTrueSpdDisp2 = player.replicators.div(tmp.replicatorTrueSpdDisp2).root(delta); // replicators get auto turned into a decimal before this
        tmp.replicatorTrueSpdDisp1 = tmp.replicatorTrueSpdDisp2.eq(1) ? D(Infinity) : Decimal.log(2, tmp.replicatorTrueSpdDisp2);

        player.bestReplicators = Decimal.max(player.bestReplicators, player.replicators);
        if (player.anticap.upgrades.includes(34)) {
            player.bestReplicators = player.bestReplicators.mul(Decimal.gte(player.cheats.bullshit.pointExtr, 10)
                ? tmp.replicatorSpd.pow(tmp.timeSpeedTiers[1].mul(delta))
                : tmp.replicatorTrueSpdDisp2.pow(delta));
        }

        if (disabled) {
            tmp.replicatorEff = D(1);
        } else {
            tmp.replicatorEff = Decimal.max(player.replirank, 0).mul(0.05).add(1);
            tmp.replicatorEff = player.transcendUpgrades.includes('repli3')
                ? Decimal.max(player.bestReplicators, 1).floor().log10().root(1.5).mul(tmp.replicatorEff)
                : Decimal.max(player.bestReplicators, 1).floor().pow(10).pow(tmp.replicatorEff);
        }
    }
}

function updateHTML_replicators() {
    let canBuy, next;
    html['replicatorMainTabButton'].setDisplay(player.generatorFeatures.advanceUpgsChosen.includes(1));
    html['replicatorMain'].setDisplay(tmp.mainTab === 3);

    if (tmp.mainTab === 3) {
        html['repliRankBuyAuto'].setDisplay(Decimal.gte(player.cheats.bullshit.pointExtr, 3));
        if (Decimal.gte(player.cheats.bullshit.pointExtr, 3)) {
            html[`repliRankBuyAuto`].changeStyle('background-color', player.repliRankBuyAuto ? '#80004080' : '#80000080');
            html[`repliRankBuyAuto`].changeStyle('border', `3px solid #${player.repliRankBuyAuto ? 'ff0080' : 'ff0000'}`);
            html[`repliRankBuyAuto`].setTxt(player.repliRankBuyAuto ? `Auto: ${format(tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer : D(Infinity))}/s` : 'Auto: Off');
        }

        html['repliTierBuyAuto'].setDisplay(Decimal.gte(player.cheats.bullshit.pointExtr, 3));
        if (Decimal.gte(player.cheats.bullshit.pointExtr, 3)) {
            html[`repliTierBuyAuto`].changeStyle('background-color', player.repliTierBuyAuto ? '#80006080' : '#80000080');
            html[`repliTierBuyAuto`].changeStyle('border', `3px solid #${player.repliTierBuyAuto ? 'ff00c0' : 'ff0000'}`);
            html[`repliTierBuyAuto`].setTxt(player.repliTierBuyAuto ? `Auto: ${format(tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer : D(Infinity))}/s` : 'Auto: Off');
        }

        html['replicatorDisp'].setTxt(format(player.replicators));
        html['replicatorBestDisp'].setTxt(`${format(player.bestReplicators)} best replicators`);
        html['replicatorEffectDisp'].setTxt(`${player.transcendUpgrades.includes('repli3') ? '^' : '×'}${format(tmp.replicatorEff)} point gain`);
        html['replicatorTrueSpeed'].setTxt(formatTime(tmp.replicatorTrueSpdDisp1, 2));
        html['replicatorTrueSpeed2'].setTxt(format(tmp.replicatorTrueSpdDisp2, 2));

        html['replicatorStrengthDisp1'].setTxt(format(tmp.replicatorStrength, 1));
        html['replicatorStrengthDisp2'].setTxt(format(tmp.replicatorStrength, 1));
        html['replicatorStrengthEffect'].setTxt(format(Decimal.max(player.replicators, 1).log10().div(tmp.replicatorStrength).pow10(), 2));

        html['rankPointDisp'].setTxt(format(player.replirankPoints));
        html['rankPointGenDisp'].setTxt(`${format(tmp.repliRankPointGen)}/s`);
        html['rankPointEffDisp'].setTxt(player.transcendUpgrades.includes('repli2') 
            ? `Increases replicator speed by ${format(tmp.repliRankPointEff)}×`
            : '');

        canBuy = Decimal.gte(player.replicators, tmp.repliRankReq);
        next = Decimal.gt(player.replitierPoints, 0)
            ? tmp.repliRankTarget.floor().add(1).max(Decimal.add(player.replirank, 1))
            : Decimal.add(player.replirank, 1);

        html[`repliRankEff`].setTxt(`${format(REPLIRANK_DATA.gain(player.replirank))}/s → ${format(REPLIRANK_DATA.gain(next))}/s`);
        html[`repliRankCost`].setTxt(shiftDown 
            ? (canBuy && Decimal.lte(player.replitierPoints, 0)
                ? 'You can replirank up! :3'
                : `~${formatTime(tmp.repliRankReqNext.root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln()).sub(Decimal.root(player.replicators, tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln())).div(tmp.timeSpeedTiers[1]), 2)}`)
            : `${format(canBuy ? tmp.repliRankReqNext : tmp.repliRankReq)} replicators`);
        html[`repliRankAmount`].setTxt(`${format(player.replirank)} → ${format(next)}`);

        html[`repliRank`].changeStyle('background-color', canBuy ? '#800040' : '#40002080');
        html[`repliRank`].changeStyle('border', `3px solid ${canBuy ? '#FF0080' : '#800040'}`);
        html[`repliRank`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
        
        for (let i = 0; i < REPLIRANK_DATA.buyables.length; i++) {
            html[`repliRankBuy${i}`].setDisplay(REPLIRANK_DATA.buyables[i].enabled());
            if (REPLIRANK_DATA.buyables[i].enabled()) {
                canBuy = tmp.repliRankBuyables[i].canBuy;
                html[`repliRankBuy${i}eff`].setTxt(REPLIRANK_DATA.buyables[i].desc(Decimal.floor(player.replirankBuyables[i])));
                html[`repliRankBuy${i}cost`].setTxt(`${format(tmp.repliRankBuyables[i].cost)} rank points`);
                html[`repliRankBuy${i}amount`].setTxt(`RepliRank Buyable #${i+1}: ×${format(Decimal.floor(player.replirankBuyables[i]))}`);

                html[`repliRankBuy${i}`].changeStyle('background-color', canBuy ? '#80004080' : '#40002080');
                html[`repliRankBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FF0080' : '#800040'}`);
                html[`repliRankBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
            }
        }

        html['tierPointShow'].setFlexDisplay(player.transcendUpgrades.includes("repli1"));
        html['repliTierUpgsAll'].setDisplay(player.transcendUpgrades.includes("repli1"));
        if (player.transcendUpgrades.includes("repli1")) {
            html['tierPointDisp'].setTxt(format(player.replitierPoints));
            html['tierPointGenDisp'].setTxt(`${format(tmp.repliTierPointGen)}/s`);
            html['tierPointEffectDisp'].setTxt(`+${format(tmp.repliTierPointEff, 1)} replicator strength`);
            html['tierPointEffect2Disp'].setTxt(`×${format(tmp.repliTierPointEff2)} rank points`);

            canBuy = Decimal.gte(player.replirank, tmp.repliTierReq);
            next = Decimal.gt(player.replitetrPoints, 0)
                ? tmp.repliTierTarget.floor().add(1).max(Decimal.add(player.replitier, 1))
                : Decimal.add(player.replitier, 1);

            html[`repliTierEff`].setTxt(`${format(REPLITIER_DATA.gain(player.replitier))}/s → ${format(REPLITIER_DATA.gain(next))}/s`);
            html[`repliTierCost`].setTxt(shiftDown
                ? (canBuy && Decimal.lte(player.replitetrPoints, 0)
                    ? 'You can replitier up! :3'
                    : `~${formatTime(tmp.repliTierReqRepliNext.root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln()).sub(Decimal.root(player.replicators, tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln())).div(tmp.timeSpeedTiers[1]), 2)}`)
                : `RepliRank ${format(canBuy ? tmp.repliTierReqNext : tmp.repliTierReq)}`);
            html[`repliTierAmount`].setTxt(`${format(player.replitier)} → ${format(next)}`);

            html[`repliTier`].changeStyle('background-color', canBuy ? '#800060' : '#40003080');
            html[`repliTier`].changeStyle('border', `3px solid ${canBuy ? '#FF00C0' : '#800060'}`);
            html[`repliTier`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
            
            for (let i = 0; i < REPLITIER_DATA.buyables.length; i++) {
                html[`repliTierBuy${i}`].setDisplay(REPLITIER_DATA.buyables[i].enabled());
                if (REPLITIER_DATA.buyables[i].enabled()) {
                    canBuy = tmp.repliTierBuyables[i].canBuy;
                    html[`repliTierBuy${i}eff`].setTxt(REPLITIER_DATA.buyables[i].desc(Decimal.floor(player.replitierBuyables[i])));
                    html[`repliTierBuy${i}cost`].setTxt(`${format(tmp.repliTierBuyables[i].cost)} tier points`);
                    html[`repliTierBuy${i}amount`].setTxt(`RepliTier Buyable #${i+1}: ×${format(Decimal.floor(player.replitierBuyables[i]))}`);

                    html[`repliTierBuy${i}`].changeStyle('background-color', canBuy ? '#80006080' : '#40003080');
                    html[`repliTierBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FF00C0' : '#800060'}`);
                    html[`repliTierBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
                }
            }
        }

        html['tetrPointShow'].setFlexDisplay(player.transcendUpgrades.includes("repli3"));
        html['repliTetrUpgsAll'].setDisplay(player.transcendUpgrades.includes("repli3"));
        if (player.transcendUpgrades.includes("repli3")) {
            html['tetrPointDisp'].setTxt(format(player.replitetrPoints));
            html['tetrPointGenDisp'].setTxt(`${format(tmp.repliTetrPointGen)}/s`);
            html['tetrPointEffectDisp'].setTxt(`×${format(tmp.repliTetrPointEff, 3)} replicator strength`);
            html['tetrPointEffect2Disp'].setTxt(`×${format(tmp.repliTetrPointEff2)} tier points`);

            canBuy = Decimal.gte(player.replitier, tmp.repliTetrReq);
            html[`repliTetrEff`].setTxt(`${format(REPLITETR_DATA.gain(player.replitetr))}/s → ${format(REPLITETR_DATA.gain(Decimal.add(player.replitetr, 1)))}/s`);
            html[`repliTetrCost`].setTxt(shiftDown
                ? (canBuy && false
                    ? 'You can replitetr up! :3'
                    :  `~${formatTime(tmp.repliTetrReqRepliNext.root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln()).sub(Decimal.root(player.replicators, tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln())).div(tmp.timeSpeedTiers[1]), 2)}`)
                : `Replitier ${format(tmp.repliTetrReq)}`);
            html[`repliTetrAmount`].setTxt(`${format(player.replitetr)} → ${format(Decimal.add(player.replitetr, 1))}`);

            html[`repliTetr`].changeStyle('background-color', canBuy ? '#800080' : '#40004080');
            html[`repliTetr`].changeStyle('border', `3px solid ${canBuy ? '#FF00FF' : '#800080'}`);
            html[`repliTetr`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
            
            for (let i = 0; i < REPLITETR_DATA.buyables.length; i++) {
                html[`repliTetrBuy${i}`].setDisplay(REPLITETR_DATA.buyables[i].enabled());
                if (REPLITETR_DATA.buyables[i].enabled()) {
                    canBuy = tmp.repliTetrBuyables[i].canBuy;
                    html[`repliTetrBuy${i}eff`].setTxt(REPLITETR_DATA.buyables[i].desc(player.replitetrBuyables[i]));
                    html[`repliTetrBuy${i}cost`].setTxt(`${format(tmp.repliTetrBuyables[i].cost)} tetr points`);
                    html[`repliTetrBuy${i}amount`].setTxt(`RepliTetr Buyable #${i+1}: ×${format(player.replitetrBuyables[i])}`);

                    html[`repliTetrBuy${i}`].changeStyle('background-color', canBuy ? '#80008080' : '#40004080');
                    html[`repliTetrBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FF00FF' : '#800080'}`);
                    html[`repliTetrBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
                }
            }
        }
    }
}

function repliRankReset(force = false) {
    if (!force) {
        if (Decimal.lt(player.replicators, tmp.repliRankReq)) {
            return;
        }

        if (Decimal.gt(player.replitierPoints, 0)) {
            player.replirank = Decimal.max(player.replirank, tmp.repliRankTarget.floor().add(1));
        } else {
            player.replirank = Decimal.add(player.replirank, 1);
        }
    }

    if (Decimal.lt(player.cheats.bullshit.pointExtr, 10)) {
        player.replicators = D(1);
    }
}

function repliTierReset(force = false) {
    if (!force) {
        if (Decimal.lt(player.replirank, tmp.repliTierReq)) {
            return;
        }

        if (Decimal.gt(player.replitetrPoints, 0)) {
            player.replitier = Decimal.max(player.replitier, tmp.repliTierTarget.floor().add(1));
        } else {
            player.replitier = Decimal.add(player.replitier, 1);
        }
    }

    player.replirank = D(0);
    player.replirankPoints = D(0);
    // only reset repliprog-based buyables, not buyables that effect outside progression
    // gets annoying having to recover them :c
    // ids 2 and 3 are outside prog
    for (let i = 0; i < 2; i++) {
        player.replirankBuyables[i] = D(0);
    }
    repliRankReset(true);
}

function repliTetrReset(force = false) {
    if (!force) {
        if (Decimal.lt(player.replitier, tmp.repliTetrReq)) {
            return;
        }

        player.replitetr = Decimal.add(player.replitetr, 1);
    }

    player.replitier = D(0);
    player.replitierPoints = D(0);
    for (let i = 0; i < 3; i++) {
        player.replitierBuyables[i] = D(0);
    }
    repliTierReset(true);
}

function buyRepliRankBuy(i) {
    if (!tmp.repliRankBuyables[i].canBuy) {
        return;
    }
    
    if (shiftDown) {
        player.replirankPoints = Decimal.sub(player.replirankPoints, tmp.repliRankBuyables[i].cost);
        player.replirankBuyables[i] = Decimal.max(player.replirankBuyables[i], tmp.repliRankBuyables[i].target.floor().add(1));
    } else {
        player.replirankPoints = Decimal.sub(player.replirankPoints, tmp.repliRankBuyables[i].cost);
        player.replirankBuyables[i] = Decimal.add(player.replirankBuyables[i], 1);
    }
    updateGame_replicators();
}

function buyRepliTierBuy(i) {
    if (!tmp.repliTierBuyables[i].canBuy) {
        return;
    }
    
    if (shiftDown) {
        player.replitierPoints = Decimal.sub(player.replitierPoints, tmp.repliTierBuyables[i].cost);
        player.replitierBuyables[i] = Decimal.max(player.replitierBuyables[i], tmp.repliTierBuyables[i].target.floor().add(1));
    } else {
        player.replitierPoints = Decimal.sub(player.replitierPoints, tmp.repliTierBuyables[i].cost);
        player.replitierBuyables[i] = Decimal.add(player.replitierBuyables[i], 1);
    }
    updateGame_replicators();
}

function buyRepliTetrBuy(i) {
    if (!tmp.repliTetrBuyables[i].canBuy) {
        return;
    }
    
    if (shiftDown) {
        player.replitetrPoints = Decimal.sub(player.replitetrPoints, tmp.repliTetrBuyables[i].cost);
        player.replitetrBuyables[i] = Decimal.max(player.replitetrBuyables[i], tmp.repliTetrBuyables[i].target.floor().add(1));
    } else {
        player.replitetrPoints = Decimal.sub(player.replitetrPoints, tmp.repliTetrBuyables[i].cost);
        player.replitetrBuyables[i] = Decimal.add(player.replitetrBuyables[i], 1);
    }
    updateGame_replicators();
}