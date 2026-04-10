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
    toHTMLvar('rankPointShow');
    toHTMLvar('rankPointBuyList');
    toHTMLvar('repliRankUpgsAll');
    toHTMLvar('repliRankAll');
    toHTMLvar('repliRank');
    toHTMLvar('repliRankAmount');
    toHTMLvar('repliRankEff');
    toHTMLvar('repliRankCost');

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
}

function updateGame_replicators() {
    tmp.replicatorEff = D(1);

    if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
        for (let i = REPLITIER_DATA.buyables.length - 1; i >= 0; i--) {
            let resource = player.replitierPoints;
            tmp.repliTierBuyables[i].target = REPLITIER_DATA.buyables[i].target(resource);
            
            let bought = player.replitierBuyables[i];
            tmp.repliTierBuyables[i].cost = REPLITIER_DATA.buyables[i].cost(bought);
            tmp.repliTierBuyables[i].eff = REPLITIER_DATA.buyables[i].eff(player.anticap.active ? D(0) : bought);
            tmp.repliTierBuyables[i].canBuy = Decimal.gte(resource, tmp.repliTierBuyables[i].cost);
        }

        let resource = player.replicators;
        tmp.repliTierTarget = REPLITIER_DATA.target(resource);

        let bought = player.replitier;
        tmp.repliTierReq = REPLITIER_DATA.cost(bought);
        tmp.repliTierEffect = REPLITIER_DATA.gain(bought);

        tmp.repliTierPointGen = D(0);
        tmp.repliTierPointGen = tmp.repliTierEffect;
        tmp.repliTierPointGen = tmp.repliTierPointGen.mul(tmp.repliTierBuyables[2].eff);
        if (player.cheats.dilate) {
            tmp.repliTierPointGen = cheatDilateBoost(tmp.repliTierPointGen);
        }
        if (player.anticap.active) {
            tmp.repliTierPointGen = D(0);
        }

        player.replitierPoints = Decimal.add(player.replitierPoints, tmp.repliTierPointGen.mul(delta));
        if (player.anticap.active) {
            tmp.repliTierPointEff = D(0);
            tmp.repliTierPointEff2 = D(1);
        } else {
            tmp.repliTierPointEff = Decimal.max(player.replitierPoints, 1).log10().div(100).add(1).ln().mul(100).mul(10);
            tmp.repliTierPointEff2 = Decimal.max(player.replitierPoints, 0).add(1);
        }

        for (let i = REPLIRANK_DATA.buyables.length - 1; i >= 0; i--) {
            let resource = player.replirankPoints;
            tmp.repliRankBuyables[i].target = REPLIRANK_DATA.buyables[i].target(resource);
            
            let bought = player.replirankBuyables[i];
            tmp.repliRankBuyables[i].cost = REPLIRANK_DATA.buyables[i].cost(bought);
            tmp.repliRankBuyables[i].eff = REPLIRANK_DATA.buyables[i].eff(player.anticap.active ? D(0) : bought);
            tmp.repliRankBuyables[i].canBuy = Decimal.gte(resource, tmp.repliRankBuyables[i].cost);
        }

        resource = player.replicators;
        tmp.repliRankTarget = REPLIRANK_DATA.target(resource);

        bought = player.replirank;
        tmp.repliRankReq = REPLIRANK_DATA.cost(bought);
        tmp.repliRankEffect = REPLIRANK_DATA.gain(bought);

        tmp.repliRankPointGen = D(0);
        tmp.repliRankPointGen = tmp.repliRankEffect;
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliRankBuyables[1].eff);
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliTierPointEff2);
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliTierBuyables[1].eff);

        if (player.cheats.dilate) {
            tmp.repliRankPointGen = cheatDilateBoost(tmp.repliRankPointGen);
        }
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.timeSpeedTiers[1]);

        if (player.anticap.active) {
            tmp.repliRankPointGen = D(0);
        }

        player.replirankPoints = Decimal.add(player.replirankPoints, tmp.repliRankPointGen.mul(delta));

        tmp.replicatorSpd = D(1); // ! player.replicators can be placed in this even with trilate and no runaway inflation as long as no .pow10()
        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliRankBuyables[0].eff);
        tmp.replicatorSpd = tmp.replicatorSpd.mul(Decimal.pow(20, player.replitier));
        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliTierBuyables[0].eff);
        if (player.transcendUpgrades.includes("repli1")) {
            tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.transEffs[12][1]);
        }

        if (player.cheats.dilate) {
            tmp.replicatorSpd = cheatDilateBoost(tmp.replicatorSpd);
        }

        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.timeSpeedTiers[1]);

        tmp.replicatorSpd = tmp.replicatorSpd.div(60).add(1); // adjusted to "per minute"
        if (player.anticap.active) {
            tmp.replicatorSpd = D(1);
        }

        tmp.replicatorStrength = D(100); // ! player.replicators CANNOT be placed in this without .log10() without runaway inflation
        tmp.replicatorStrength = tmp.replicatorStrength.add(tmp.repliTierPointEff);

        tmp.replicatorTrueSpdDisp2 = player.replicators;
        player.replicators = Decimal.max(player.replicators, 1).root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).exp().mul(tmp.replicatorSpd.pow(delta)).ln().div(tmp.replicatorStrength).add(1).pow(tmp.replicatorStrength);
        tmp.replicatorTrueSpdDisp2 = player.replicators.div(tmp.replicatorTrueSpdDisp2).root(delta); // replicators get auto turned into a decimal before this
        tmp.replicatorTrueSpdDisp1 = tmp.replicatorTrueSpdDisp2.eq(1) ? D(Infinity) : Decimal.log(2, tmp.replicatorTrueSpdDisp2);

        player.bestReplicators = Decimal.max(player.bestReplicators, player.replicators);

        if (player.anticap.active) {
            tmp.replicatorEff = D(1);
        } else {
            tmp.replicatorEff = Decimal.max(player.replirank, 0).mul(0.05).add(1);
            tmp.replicatorEff = Decimal.max(player.bestReplicators, 1).floor().pow(10).pow(tmp.replicatorEff);
        }
    }
}

function updateHTML_replicators() {
    let canBuy;
    html['replicatorMainTabButton'].setDisplay(player.generatorFeatures.advanceUpgsChosen.includes(1));
    html['replicatorMain'].setDisplay(tmp.mainTab === 3);

    if (tmp.mainTab === 3) {
        html['replicatorDisp'].setTxt(format(player.replicators));
        html['replicatorBestDisp'].setTxt(`${format(player.bestReplicators)} best replicators`);
        html['replicatorEffectDisp'].setTxt(`×${format(tmp.replicatorEff)} point gain`);
        html['replicatorTrueSpeed'].setTxt(formatTime(tmp.replicatorTrueSpdDisp1, 2));
        html['replicatorTrueSpeed2'].setTxt(format(tmp.replicatorTrueSpdDisp2, 2));

        html['replicatorStrengthDisp1'].setTxt(format(tmp.replicatorStrength, 1));
        html['replicatorStrengthDisp2'].setTxt(format(tmp.replicatorStrength, 1));
        html['replicatorStrengthEffect'].setTxt(format(Decimal.max(player.replicators, 1).log10().div(tmp.replicatorStrength).pow10(), 2));

        html['rankPointDisp'].setTxt(format(player.replirankPoints));
        html['rankPointGenDisp'].setTxt(`${format(tmp.repliRankPointGen)}/s`);

        canBuy = Decimal.gte(player.replicators, tmp.repliRankReq);
        html[`repliRankEff`].setTxt(`${format(REPLIRANK_DATA.gain(player.replirank))}/s → ${format(REPLIRANK_DATA.gain(Decimal.add(player.replirank, 1)))}/s`);
        html[`repliRankCost`].setTxt(shiftDown && !canBuy
            ? `~${formatTime(tmp.repliRankReq.root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln()).sub(Decimal.root(player.replicators, tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).div(tmp.replicatorSpd.ln())), 2)}`
            : `${format(tmp.repliRankReq)} replicators`);
        html[`repliRankAmount`].setTxt(`${format(player.replirank)} → ${format(Decimal.add(player.replirank, 1))}`);

        html[`repliRank`].changeStyle('background-color', canBuy ? '#800040' : '#40002080');
        html[`repliRank`].changeStyle('border', `3px solid ${canBuy ? '#FF0080' : '#800040'}`);
        html[`repliRank`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
        
        for (let i = 0; i < REPLIRANK_DATA.buyables.length; i++) {
            html[`repliRankBuy${i}`].setDisplay(REPLIRANK_DATA.buyables[i].enabled());
            if (REPLIRANK_DATA.buyables[i].enabled()) {
                canBuy = tmp.repliRankBuyables[i].canBuy;
                html[`repliRankBuy${i}eff`].setTxt(REPLIRANK_DATA.buyables[i].desc(player.replirankBuyables[i]));
                html[`repliRankBuy${i}cost`].setTxt(`${format(tmp.repliRankBuyables[i].cost)} rank points`);
                html[`repliRankBuy${i}amount`].setTxt(`RepliRank Buyable #${i+1}: ×${format(player.replirankBuyables[i])}`);

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
            html[`repliTierEff`].setTxt(`${format(REPLITIER_DATA.gain(player.replitier))}/s → ${format(REPLITIER_DATA.gain(Decimal.add(player.replitier, 1)))}/s`);
            html[`repliTierCost`].setTxt(`RepliRank ${format(tmp.repliTierReq)}`);
            html[`repliTierAmount`].setTxt(`${format(player.replitier)} → ${format(Decimal.add(player.replitier, 1))}`);

            html[`repliTier`].changeStyle('background-color', canBuy ? '#800060' : '#40003080');
            html[`repliTier`].changeStyle('border', `3px solid ${canBuy ? '#FF00C0' : '#800060'}`);
            html[`repliTier`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
            
            for (let i = 0; i < REPLITIER_DATA.buyables.length; i++) {
                html[`repliTierBuy${i}`].setDisplay(REPLITIER_DATA.buyables[i].enabled());
                if (REPLITIER_DATA.buyables[i].enabled()) {
                    canBuy = tmp.repliTierBuyables[i].canBuy;
                    html[`repliTierBuy${i}eff`].setTxt(REPLITIER_DATA.buyables[i].desc(player.replitierBuyables[i]));
                    html[`repliTierBuy${i}cost`].setTxt(`${format(tmp.repliTierBuyables[i].cost)} tier points`);
                    html[`repliTierBuy${i}amount`].setTxt(`RepliTier Buyable #${i+1}: ×${format(player.replitierBuyables[i])}`);

                    html[`repliTierBuy${i}`].changeStyle('background-color', canBuy ? '#80006080' : '#40003080');
                    html[`repliTierBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FF00C0' : '#800060'}`);
                    html[`repliTierBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
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

        player.replirank = Decimal.add(player.replirank, 1);
    }

    player.replicators = D(1);
}

function repliTierReset(force = false) {
    if (!force) {
        if (Decimal.lt(player.replirank, tmp.repliTierReq)) {
            return;
        }

        player.replitier = Decimal.add(player.replitier, 1);
    }

    player.replirank = D(0);
    player.replirankPoints = D(0);
    for (let i = 0; i < player.replirankBuyables.length; i++) {
        player.replirankBuyables[i] = D(0);
    }
    repliRankReset(true);
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