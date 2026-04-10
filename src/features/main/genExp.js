"use strict";

const GEN_XP_BUYABLES = [
    {
        show: true,
        cost(bought) {
            let scale = D(0.004);
            if (hasSetbackUpgrade('c7')) {
                scale = scale.div(2);
            }
            if (player.transcendUpgrades.includes("exp4")) {
                scale = scale.div(100);
            }
            
            let cost = D(bought);
            if (hasSetbackUpgrade('c11')) {
                cost = cost.div(SETBACK_UPGRADES[3][10].eff);
            }
            cost = increasingExpCostScaling(cost, scale).pow_base(3);
            return cost.floor();
        },
        target(resource) {
            let scale = D(0.004);
            if (hasSetbackUpgrade('c7')) {
                scale = scale.div(2);
            }
            if (player.transcendUpgrades.includes("exp4")) {
                scale = scale.div(100);
            }

            let target = D(resource).ceil();
            target = increasingExpCostScaling(target.max(1).log(3), scale, true);
            if (hasSetbackUpgrade('c11')) {
                target = target.mul(SETBACK_UPGRADES[3][10].eff);
            }
            return target;
        },
        eff(bought) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }

            let eff = D(2);
            eff = eff.add(tmp.generatorFeatures.genEnhBuyables[0].eff);
            eff = eff.pow(bought);
            return eff;
        },
        get desc() {
            return `Generator XP gain is increased by ×${format(tmp.generatorFeatures.genXPBuyables[0].eff)}.`;
        }
    },
    {
        show: true,
        cost(bought) {
            let cost = D(bought);
            if (hasSetbackUpgrade('c11')) {
                cost = cost.div(SETBACK_UPGRADES[3][10].eff);
            }

            cost = increasingExpCostScaling(cost, 0.007).pow_base(20).mul(250);
            return cost.floor();
        },
        target(resource) {
            let target = D(resource).ceil();
            target = increasingExpCostScaling(target.div(250).max(1).log(20), 0.007, true);
            if (hasSetbackUpgrade('c11')) {
                target = target.mul(SETBACK_UPGRADES[3][10].eff);
            }
            return target;
        },
        eff(bought) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }

            let eff = D(0);
            for (let i = 0; i < player.buyables.length; i++) {
                eff = eff.add(Decimal.max(player.buyablePoints[i], 0).add(1).log10());
            }

            eff = eff.div(1000).add(1).pow(bought);
            return eff;
        },
        get desc() {
            return `Total generator points boost point gain by ×${format(tmp.generatorFeatures.genXPBuyables[1].eff, 2)}.`;
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3');
        },
        cost(bought) {
            let cost = D(bought);
            if (hasSetbackUpgrade('c11')) {
                cost = cost.div(SETBACK_UPGRADES[3][10].eff)
            }
            cost = increasingExpCostScaling(cost, 0.02).pow_base(1e25).mul(1e100);
            return cost;
        },
        target(resource) {
            let target = D(resource).ceil();
            target = increasingExpCostScaling(target.div(1e100).max(1).log(1e25), 0.02, true);
            if (hasSetbackUpgrade('c11')) {
                target = target.mul(SETBACK_UPGRADES[3][10].eff);
            }
            return target;
        },
        eff(bought) {
            if (hasSetbackUpgrade('c14') && player.transcendInSpecialReq === "ascend5") {
                return D(0);
            }

            let eff = D(0.001);
            eff = eff.mul(bought);
            return eff;
        },
        get desc() {
            return `XP's effect to generator speed's multiplier is increased by +×${format(tmp.generatorFeatures.genXPBuyables[2].eff, 3)}.`;
        }
    }
]



function initHTML_genXP() {
    toHTMLvar('generatorMainTabButton')
    toHTMLvar('generatorMain')

    toHTMLvar('genMainArea')
    toHTMLvar('genXP')
    toHTMLvar('genLvTotal')
    toHTMLvar('genLvTotalBest')
    toHTMLvar('genXPGain')
    toHTMLvar('genXPSpdEff')
    toHTMLvar('genXPPtsEff')
    toHTMLvar('genXPAuto')
    toHTMLvar('genXPUpgList')

    let txt = ``;
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        txt += `
            <button onclick="buyGenXPBuy(${i})" id="genXPBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="genXPBuy${i}amount"></span><br>
                <span id="genXPBuy${i}eff"></span><br><br>
                <span id="genXPBuy${i}cost"></span>
            </button>
        `;
    }
    html['genXPUpgList'].setHTML(txt);
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        toHTMLvar(`genXPBuy${i}`);
        toHTMLvar(`genXPBuy${i}eff`);
        toHTMLvar(`genXPBuy${i}cost`);
        toHTMLvar(`genXPBuy${i}amount`);
    }
}

function updateGame_genXP() {
    let resource;
    if (hasSetbackUpgrade(`r10`)) {
        for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
            let cost = Decimal.floor(player.generatorFeatures.buyable[i])
            if (player.anticap.active) {
                cost = anticapScaling(cost, "genXPBuyables", false);
            }
            tmp.generatorFeatures.genXPBuyables[i].cost = GEN_XP_BUYABLES[i].cost(cost);

            if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                resource = player.generatorFeatures.buyable[i - 1];
            } else {
                resource = player.generatorFeatures.xp;
            }
            tmp.generatorFeatures.genXPBuyables[i].target = GEN_XP_BUYABLES[i].target(resource);
            if (player.anticap.active) {
                tmp.generatorFeatures.genXPBuyables[i].target = anticapScaling(tmp.generatorFeatures.genXPBuyables[i].target, "genXPBuyables", true);
            }

            if ((player.genXPAuto && hasTranscendMilestone(10)) && GEN_XP_BUYABLES[i].show) {
                let bought = D(player.generatorFeatures.buyable[i]);
                // do not use timespeed changes here because the only time this "buying" var is used is in PRC3, which already disabled T1 time speed from doing anything
                let buying = tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer : D(Infinity);
                player.generatorFeatures.buyable[i] = Decimal.add(tmp.generatorFeatures.genXPBuyables[i].target, 0.99999999).max(player.generatorFeatures.buyable[i]).min(Decimal.add(player.generatorFeatures.buyable[i], buying.mul(delta)));
                
                // assume Decimal and not DecimalSource due to the prior lines changing it
                if (Decimal.gt(player.generatorFeatures.buyable[i].floor(), bought.floor())) {
                    player.generatorFeatures.xp = Decimal.sub(player.generatorFeatures.xp, tmp.generatorFeatures.genXPBuyables[i].cost).max(0); // idk why this is causing xp to go negative so i put a max 0 here
                }
            }

            tmp.generatorFeatures.genXPBuyables[i].eff = GEN_XP_BUYABLES[i].eff(Decimal.floor(player.generatorFeatures.buyable[i]));
            tmp.generatorFeatures.genXPBuyables[i].canBuy = Decimal.gte(resource, tmp.generatorFeatures.genXPBuyables[i].cost);
        }

        tmp.factors.genXP = [];

        let total = D(0);
        if (hasTranscendMilestone(13)) {
            total = D(player.bestTotalGenLvs);
        } else {
            total = tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.genLevels), tmp.buyables[0]);
        }
        total = total.div(200);
        addStatFactor('genXP', `Base`, `${format(total.mul(200))}/${format(200)}`, null, total);

        let totalGain = total;
        if (player.transcendUpgrades.includes('exp1')) {
            totalGain = totalGain.mul(4/3);
            addStatFactor('genXP', `Trans. Upg. "Expert Efficiency"`, `×`, 4/3, totalGain);
        }
        if (player.inSetback) {
            totalGain = totalGain.div(tmp.setbackEffects[3][0]);
            addStatFactor('points', `Setback Cyan Effect`, `/`, tmp.setbackEffects[3][0], totalGain);
        }

        tmp.generatorFeatures.gain = totalGain.mul(totalGain.pow10()).div(1e6)
        addStatFactor('genXP', `Final Base`, `(${format(totalGain)}×10<sup>${format(totalGain)}</sup>)/${format(1e6)}`, null, tmp.generatorFeatures.gain);

        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.generatorFeatures.genXPBuyables[0].eff);
        addStatFactor('genXP', `Generator XP Buyable #1`, `×`, tmp.generatorFeatures.genXPBuyables[0].eff, tmp.generatorFeatures.gain);

        if (tmp.generatorFeatures.enhancerEff.neq(1)) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.generatorFeatures.enhancerEff);
            addStatFactor('genXP', `Gen. Enhancer Effect`, `×`, tmp.generatorFeatures.enhancerEff, tmp.generatorFeatures.gain);
        }
        
        if (tmp.setbackTotalStacks.length === 0) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.energyEffs[3]);
            addStatFactor('genXP', `Cyan Energy`, `×`, tmp.energyEffs[3], tmp.generatorFeatures.gain);
        }

        if (hasSetbackUpgrade('r11')) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(SETBACK_UPGRADES[0][10].eff);
            addStatFactor('genXP', `Red S. Upgrade 11`, `×`, SETBACK_UPGRADES[0][10].eff, tmp.generatorFeatures.gain);
        }

        // challenges/nerfs
        if (tmp.hinderances[4].depth.gt(0)) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.pow(tmp.hinderances[4].effects.resource);
            addStatFactor('genXP', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.generatorFeatures.gain);
        }

        if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
            addStatFactor('genXP', `PRC2`, `▲`, tmp.prestigeRepeatChal[1].effects.exponent, tmp.generatorFeatures.gain);
        }

        if (player.anticap.active) {
            tmp.generatorFeatures.gain = anticapSoftcap(tmp.generatorFeatures.gain, "genXP", "genXP", false);
        }

        if (player.cheats.dilate) {
            tmp.generatorFeatures.gain = cheatDilateBoost(tmp.generatorFeatures.gain);
            addStatFactor('genXP', `Cheats`, `...`, null, tmp.generatorFeatures.gain);
        }

        if (tmp.timeSpeedTiers[0].neq(1)) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.timeSpeedTiers[0]);
            addStatFactor('genXP', `Tier 1 Time Speed`, `×`, tmp.timeSpeedTiers[0], tmp.generatorFeatures.gain)
        }
        
        player.generatorFeatures.xp = Decimal.add(player.generatorFeatures.xp, tmp.generatorFeatures.gain.mul(delta));

        tmp.generatorFeatures.xpEffGenerators = D(0.05);
        tmp.generatorFeatures.xpEffGenerators = tmp.generatorFeatures.xpEffGenerators.add(tmp.generatorFeatures.genXPBuyables[2].eff);
        tmp.generatorFeatures.xpEffGenerators = player.generatorFeatures.xp.add(1).log10().mul(tmp.generatorFeatures.xpEffGenerators).add(1).ln().add(1);
        if (player.transcendInSpecialReq === "exp4") {
            tmp.generatorFeatures.xpEffGenerators = D(1);
        }

        // outside of any challenge
        if (hasSetbackUpgrade('c8') && !tmp.inAnyChallenge) {
            tmp.generatorFeatures.xpEffPoints = D(0.055);
        } else {
            tmp.generatorFeatures.xpEffPoints = D(0.05);
        }
        // total has already been used before, it should not be used again
        if (hasSetbackUpgrade('r12')) {
            total = Decimal.max(total, player.buyablePoints.reduce((accumulator, current) => Decimal.mul(accumulator, Decimal.max(current, 1)), player.buyablePoints[0]).max(1).log10())
        }
        tmp.generatorFeatures.xpEffPoints = player.generatorFeatures.xp.add(1).log10().add(1).log10().mul(total.max(1).log2()).mul(tmp.generatorFeatures.xpEffPoints).add(1);
        if (tmp.hinderances[3].depth.gt(0)) {
            tmp.generatorFeatures.xpEffPoints = tmp.generatorFeatures.xpEffPoints.pow(tmp.hinderances[3].effects.pts);
        }
        if (player.transcendInSpecialReq === "exp4") {
            tmp.generatorFeatures.xpEffPoints = D(1);
        }
    }
}

function updateHTML_genXP() {
    html['generatorMainTabButton'].setDisplay(hasSetbackUpgrade(`r10`))
    html['generatorMain'].setDisplay(tmp.mainTab === 1)

    if (tmp.mainTab === 1) {
        html['genXPAuto'].setDisplay(hasTranscendMilestone(10))
        if (hasTranscendMilestone(10)) {
            html[`genXPAuto`].changeStyle('background-color', player.genXPAuto ? '#80400080' : '#80000080')
            html[`genXPAuto`].changeStyle('border', `3px solid #${player.genXPAuto ? 'ff8000' : 'ff0000'}`)
            html[`genXPAuto`].setTxt(player.genXPAuto ? `Auto: ${format(tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer : D(Infinity))}/s` : 'Auto: Off')
        }

        html['genXP'].setTxt(format(player.generatorFeatures.xp, 2))
        html['genXPGain'].setTxt(format(tmp.generatorFeatures.gain, 2))
        html['genXPSpdEff'].setTxt(format(tmp.generatorFeatures.xpEffGenerators, 3))
        html['genXPPtsEff'].setTxt(format(tmp.generatorFeatures.xpEffPoints, 3))
        html['genLvTotal'].setTxt(format(tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.genLevels), tmp.buyables[0])))
        html['genLvTotalBest'].setTxt(format(player.bestTotalGenLvs))

        let canBuy
        for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
            html[`genXPBuy${i}`].setDisplay(GEN_XP_BUYABLES[i].show)
            if (GEN_XP_BUYABLES[i].show) {
                canBuy = tmp.generatorFeatures.genXPBuyables[i].canBuy
                html[`genXPBuy${i}eff`].setTxt(GEN_XP_BUYABLES[i].desc)
                if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                    html[`genXPBuy${i}cost`].setTxt(`Cost: ${format(tmp.generatorFeatures.genXPBuyables[i].cost)} Gen. XP B. ${i}`)
                } else {
                    html[`genXPBuy${i}cost`].setTxt(`Cost: ${format(tmp.generatorFeatures.genXPBuyables[i].cost)} generator experience`)
                }
                
                html[`genXPBuy${i}amount`].setTxt(`Gen. XP Buyable #${i+1}: ×${format(player.generatorFeatures.buyable[i])}`)

                html[`genXPBuy${i}`].changeStyle('background-color', canBuy ? '#C0780080' : '#40280080')
                html[`genXPBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFA000' : '#805000'}`)
                html[`genXPBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed')
            }
        }
    }
}

function buyGenXPBuy(i) {
    if (!tmp.generatorFeatures.genXPBuyables[i].canBuy) {
        return;
    }
    player.generatorFeatures.xp = Decimal.sub(player.generatorFeatures.xp, GEN_XP_BUYABLES[i].cost)
    if (shiftDown) {
        player.generatorFeatures.buyable[i] = Decimal.max(player.generatorFeatures.buyable[i], tmp.generatorFeatures.genXPBuyables[i].target.ceil())
    } else {
        player.generatorFeatures.buyable[i] = Decimal.add(player.generatorFeatures.buyable[i], 1)
    }
}