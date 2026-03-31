"use strict";

const GEN_ENH_BUYABLES = [
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.totalEnh, 0);
        },
        cost(bought) {
            let cost = D(bought);
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(2);
            return cost.floor();
        },
        target(resource) {
            let target = D(resource).ceil();
            target = target.max(1).log(2).mul(0.02).add(1).log(1.02);
            return target;
        },
        eff(bought) {
            if (colorAmountTotal(3).gt(0) || player.transcendInSpecialReq === "ascend5") {
                return D(0);
            }
            let eff = D(0.1);
            eff = eff.mul(bought);
            return eff;
        },
        get desc() {
            return `Generator Buyable 1's effect base is boosted by +${format(tmp.generatorFeatures.genEnhBuyables[0].eff, 2)}.`;
        }
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.totalEnh, 0);
        },
        cost(bought) {
            let cost = D(bought);
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(3).mul(5);
            return cost.floor();
        },
        target(resource) {
            let target = D(resource).ceil();
            target = target.div(5).max(1).log(3).mul(0.02).add(1).log(1.02);
            return target;
        },
        eff(bought) {
            if (colorAmountTotal(3).gt(0) || player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let eff = Decimal.max(player.timeInAscend, 0)
            if (hasSetbackUpgrade('c9')) {
                eff = eff.mul(2).add(30);
            }
            eff = Decimal.div(eff, 30).add(1).ln().pow_base(1e20);
            eff = eff.pow(bought);
            return eff;
        },
        get desc() {
            return `Time since ascension boosts generators by ×${format(tmp.generatorFeatures.genEnhBuyables[1].eff, 1)}.`;
        }
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.totalEnh, 0);
        },
        cost(bought) {
            let cost = D(bought);
            cost = cost.pow_base(2).add(1).pow10();
            return cost.floor();
        },
        target(resource) {
            let target = D(resource).ceil();
            target = target.max(100).log10().sub(1).log(2);
            return target;
        },
        eff(bought) {
            if (colorAmountTotal(3).gt(0) || player.transcendInSpecialReq === "ascend5") {
                return D(0);
            }
            let eff = D(1);
            eff = eff.mul(bought);
            return eff;
        },
        get desc() {
            if (player.transcendInSpecialReq === "exp2") {
                return `Slow down tier gain significantly.`;
            }
            return `Unlock Tiers (like generators) that slows down buyable costs. Tier gain speeds up with more purchases.`;
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3');
        },
        // TODO: make scale something else that doesn't fuck up at very low scaling due to floating point (<0.000000001)
        cost(bought) {
            let scale = D(0.03);
            if (hasSetbackUpgrade('c13')) {
                scale = scale.div(1000);
            }

            let cost = D(bought);
            cost = cost.pow_base(scale.add(1)).sub(1).div(scale).pow_base(3).mul(2500);
            return cost.floor();
        },
        target(resource) {
            let scale = D(0.03);
            if (hasSetbackUpgrade('c13')) {
                scale = scale.div(1000);
            }

            let target = D(resource).ceil();
            target = target.div(1000).max(1).log(3).mul(scale).add(1).log(scale.add(1));
            return target;
        },
        eff(bought) {
            if (colorAmountTotal(3).gt(0)) {
                return D(1);
            }
            let eff = D(2);
            eff = eff.pow(bought);
            return eff;
        },
        get desc() {
            return `Enhancer gain is multiplied by ×${format(tmp.generatorFeatures.genEnhBuyables[3].eff)}.`;
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3')
        },
        cost(bought) {
            let cost = D(bought);
            cost = cost.pow_base(1.01).sub(1).div(0.01).pow_base(1e25).mul(1e100);
            return cost.floor();
        },
        target(resource) {
            let target = D(resource).ceil();
            target = target.div(1e100).max(1).log(1e25).mul(0.01).add(1).log(1.01);
            return target;
        },
        eff(bought) {
            if (colorAmountTotal(3).gt(0)) {
                return D(1);
            }
            let eff = player.buyableTierPoints.reduce((accumulator, current) => Decimal.mul(accumulator, Decimal.max(current, 0).add(1)), player.buyableTierPoints[0]).max(1);
            eff = eff.pow(bought);
            return eff;
        },
        get desc() {
            return `Tier points boost point gain by ×${format(tmp.generatorFeatures.genEnhBuyables[4].eff, 2)}.`;
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3');
        },
        cost(bought) {
            let cost = D(bought);
            cost = cost.pow_base(3).pow_base(Number.MAX_VALUE);
            return cost.floor();
        },
        target(resource) {
            let target = D(resource).ceil();
            target = target.max(1).log(Number.MAX_VALUE).max(1).log(3);
            return target;
        },
        eff(bought) {
            if (colorAmountTotal(3).gt(0)) {
                return D(0);
            }
            let eff = D(1);
            eff = eff.mul(bought);
            return eff;
        },
        get desc() {
            return `Unlock advancements. Advancement effect increases per this buyable bought.`;
        }
    }
]

function initHTML_genEnhancers() {
    toHTMLvar('genEnhArea');
    toHTMLvar('genEnhance');
    toHTMLvar('generatorEnhance');
    toHTMLvar('enhAmount');
    toHTMLvar('enhNext');
    toHTMLvar('genEnhXPEff');
    toHTMLvar('genEnhDispEff2');
    toHTMLvar('genEnhXPEff2');
    toHTMLvar('genEnhGenerate');
    toHTMLvar('genEnhAuto');
    toHTMLvar('genEnhUpgList');

    let txt = ``;
    for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
        txt += `
            <button onclick="buyGenEnhBuy(${i})" id="genEnhBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="genEnhBuy${i}amount"></span><br>
                <span id="genEnhBuy${i}eff"></span><br><br>
                <span id="genEnhBuy${i}cost"></span>
            </button>
        `;
    }
    html['genEnhUpgList'].setHTML(txt);
    for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
        toHTMLvar(`genEnhBuy${i}`);
        toHTMLvar(`genEnhBuy${i}eff`);
        toHTMLvar(`genEnhBuy${i}cost`);
        toHTMLvar(`genEnhBuy${i}amount`);
    }
}

function updateGame_genEnhancers() {
    let resource;
    for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
        tmp.generatorFeatures.genEnhBuyables[i].cost = GEN_ENH_BUYABLES[i].cost(Decimal.floor(player.generatorFeatures.enhancerBuyables[i]));

        if (tmp.hinderances[4].depth.gt(0) && i != 0) {
            resource = player.generatorFeatures.enhancerBuyables[i - 1];
        } else {
            resource = player.generatorFeatures.enhancer;
        }
        tmp.generatorFeatures.genEnhBuyables[i].target = GEN_ENH_BUYABLES[i].target(resource);

        if (player.genEnhAuto && GEN_ENH_BUYABLES[i].show) {
            let bought = D(player.generatorFeatures.enhancerBuyables[i]);
            // do not use timespeed changes here because the only time this "buying" var is used is in PRC3, which already disabled T1 time speed from doing anything
            let buying = tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer : D(Infinity);
            player.generatorFeatures.enhancerBuyables[i] = Decimal.add(tmp.generatorFeatures.genEnhBuyables[i].target, 0.99999999).max(player.generatorFeatures.enhancerBuyables[i]).min(Decimal.add(player.generatorFeatures.enhancerBuyables[i], buying.mul(delta)));

            // assume Decimal and not DecimalSource due to the prior lines changing it
            if (Decimal.gt(player.generatorFeatures.enhancerBuyables[i].floor(), bought.floor())) {
                player.generatorFeatures.enhancer = Decimal.sub(player.generatorFeatures.enhancer, tmp.generatorFeatures.genEnhBuyables[i].cost).max(0); // idk why this is causing ascendGems to go negative so i put a max 0 here
            }
        }

        tmp.generatorFeatures.genEnhBuyables[i].eff = GEN_ENH_BUYABLES[i].eff(Decimal.floor(player.generatorFeatures.enhancerBuyables[i]));
        tmp.generatorFeatures.genEnhBuyables[i].canBuy = Decimal.gte(resource, tmp.generatorFeatures.genEnhBuyables[i].cost);
    }

    tmp.factors.genEnh = [];

    tmp.generatorFeatures.enhancerGain = Decimal.gte(player.generatorFeatures.xp, 1e33) && colorAmountTotal(3).lte(0) ? Decimal.div(player.generatorFeatures.xp, 1e33).pow(0.02) : D(0);
    addStatFactor('genEnh', `Base`, `(${format(player.generatorFeatures.xp)}/${format(1e33)})<sup>0.02</sup>`, null, tmp.generatorFeatures.enhancerGain);

    if (tmp.generatorFeatures.genEnhBuyables[3].eff.neq(1)) {
        tmp.generatorFeatures.enhancerGain = tmp.generatorFeatures.enhancerGain.mul(tmp.generatorFeatures.genEnhBuyables[3].eff);
        addStatFactor('genEnh', `Generator Enh. Buyable #4`, `×`, tmp.generatorFeatures.genEnhBuyables[3].eff, tmp.generatorFeatures.enhancerGain);
    }

    if (Decimal.gte(player.prestigeChallengeRepCompleted[3], 1)) {
        tmp.generatorFeatures.enhancerGain = tmp.generatorFeatures.enhancerGain.mul(tmp.prestigeRepeatChal[3].rewardEffs.mult);
        addStatFactor('genEnh', `PRC4 Reward`, `×`, tmp.prestigeRepeatChal[3].rewardEffs.mult, tmp.generatorFeatures.enhancerGain);
    }

    // exp boosts
    if (tmp.prestigeRepeatChal[2].depth.lte(0)) {
        if (player.transcendUpgrades.includes('enhancer1')) {
            tmp.generatorFeatures.enhancerGain = tmp.generatorFeatures.enhancerGain.pow(tmp.transEffs[9][1]);
            addStatFactor('genEnh', `Trans. Upg. "Enhancer Efficiency"`, `^`, tmp.transEffs[9][1], tmp.generatorFeatures.enhancerGain);
        }
    }

    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.generatorFeatures.enhancerGain = tmp.generatorFeatures.enhancerGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('genEnh', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.generatorFeatures.enhancerGain);
    }

    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
        tmp.generatorFeatures.enhancerGain = tmp.generatorFeatures.enhancerGain.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
        addStatFactor('genEnh', `PRC2`, `(to exp.) ^`, tmp.prestigeRepeatChal[1].effects.exponent, tmp.generatorFeatures.enhancerGain);
    }

    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.generatorFeatures.enhanceCount, 1)) {
        tmp.generatorFeatures.enhancerGain = new Decimal(0);
        addStatFactor('genEnh', `Advantageous 'Challenge'`, `...`, null, tmp.generatorFeatures.enhancerGain);
    }

    tmp.generatorFeatures.enhancerGain = cheatDilateBoost(tmp.generatorFeatures.enhancerGain).floor();

    if (colorAmountTotal(3).gt(0) || (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.generatorFeatures.enhanceCount, 1))) {
        tmp.generatorFeatures.enhancerNext = D(Infinity);
    } else {
        tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerGain.add(1);
        tmp.generatorFeatures.enhancerNext = cheatDilateBoost(tmp.generatorFeatures.enhancerNext, true);
        if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
            tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.add(1).log10().add(1).root(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
        }
        if (tmp.hinderances[4].depth.gt(0)) {
            tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.root(tmp.hinderances[4].effects.resource);
        }
        if (tmp.prestigeRepeatChal[2].depth.lte(0)) {
            if (player.transcendUpgrades.includes('enhancer1')) {
                tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.root(tmp.transEffs[9][1]);
            }
        }
        if (Decimal.gte(player.prestigeChallengeRepCompleted[3], 1)) {
            tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.div(tmp.prestigeRepeatChal[3].rewardEffs.mult);
        }
        tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.div(tmp.generatorFeatures.genEnhBuyables[3].eff);
        tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.root(0.02).mul(1e33);
    }

    if (player.genEnhGenerate && player.transcendInSpecialReq !== "prest4") {
        player.generatorFeatures.enhancer = Decimal.add(player.generatorFeatures.enhancer, tmp.generatorFeatures.enhancerGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[0]));
        player.generatorFeatures.totalEnh = Decimal.add(player.generatorFeatures.totalEnh, tmp.generatorFeatures.enhancerGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[0]));
    }

    let decay = D(10);
    if (hasSetbackUpgrade(`r13`)) {
        decay = decay.mul(100);
    }
    tmp.generatorFeatures.enhancerEff = Decimal.max(player.generatorFeatures.totalEnh, 1).log10().div(decay).add(1).ln().mul(decay.mul(5)).pow10();
    if (colorAmountTotal(3).gt(0)) {
        tmp.generatorFeatures.enhancerEff = D(1);
    }
}

function updateHTML_genEnhancers() {
    let canBuy;
    if (tmp.mainTab === 1) {
        html['genEnhGenerate'].setDisplay(hasTranscendMilestone(13) && colorAmountTotal(3).lte(0))
        if (hasTranscendMilestone(13) && colorAmountTotal(3).lte(0)) {
            html[`genEnhGenerate`].changeStyle('background-color', player.genEnhGenerate ? '#80800080' : '#80000080')
            html[`genEnhGenerate`].changeStyle('border', `3px solid #${player.genEnhGenerate ? 'ffff00' : 'ff0000'}`)
            html[`genEnhGenerate`].setTxt(player.genEnhGenerate ? 'Generate: 1%/s' : 'Generate: Off')
        }
        html['genEnhAuto'].setDisplay(hasTranscendMilestone(14) && colorAmountTotal(3).lte(0))
        if (hasTranscendMilestone(14) && colorAmountTotal(3).lte(0)) {
            html[`genEnhAuto`].changeStyle('background-color', player.genEnhAuto ? '#80800080' : '#80000080')
            html[`genEnhAuto`].changeStyle('border', `3px solid #${player.genEnhAuto ? 'ffff00' : 'ff0000'}`)
            html[`genEnhAuto`].setTxt(player.genEnhAuto ? `Auto: ${format(tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer : D(Infinity))}/s` : 'Auto: Off')
        }

        html['enhAmount'].setTxt(format(tmp.generatorFeatures.enhancerGain))
        let show = Decimal.lt(tmp.generatorFeatures.enhancerGain, 100)
        html['enhNext'].setDisplay(show)
        if (show) {
            html['enhNext'].setTxt(`Next enhancer at ${format(tmp.generatorFeatures.enhancerNext)} generator XP.`);
        }

        html['generatorEnhance'].changeStyle('cursor', Decimal.gt(tmp.generatorFeatures.enhancerGain, 0) ? 'pointer' : 'not-allowed');

        html['genEnhArea'].setDisplay(Decimal.gt(player.generatorFeatures.totalEnh, 0) && colorAmountTotal(3).lte(0));
        if (Decimal.gt(player.generatorFeatures.totalEnh, 0) && colorAmountTotal(3).lte(0)) {
            html['genEnhance'].setTxt(format(player.generatorFeatures.enhancer));
            html['genEnhXPEff'].setTxt(format(tmp.generatorFeatures.enhancerEff, 2));

            html['genEnhDispEff2'].setDisplay(player.transcendUpgrades.includes('exp2'));
            if (player.transcendUpgrades.includes('exp2')) {
                html['genEnhXPEff2'].setTxt(format(tmp.transEffs[6][1], 3));
            }

            for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
                html[`genEnhBuy${i}`].setDisplay(GEN_ENH_BUYABLES[i].show);
                if (GEN_ENH_BUYABLES[i].show) {
                    canBuy = tmp.generatorFeatures.genEnhBuyables[i].canBuy;
                    html[`genEnhBuy${i}eff`].setTxt(GEN_ENH_BUYABLES[i].desc);
                    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                        html[`genEnhBuy${i}cost`].setTxt(`Cost: ${format(tmp.generatorFeatures.genEnhBuyables[i].cost)} Gen. Enh. B. ${i}`);
                    } else {
                        html[`genEnhBuy${i}cost`].setTxt(`Cost: ${format(tmp.generatorFeatures.genEnhBuyables[i].cost)} enhancers`);
                    }
                    html[`genEnhBuy${i}amount`].setTxt(`Gen. Enh. Buyable #${i+1}: ×${format(player.generatorFeatures.enhancerBuyables[i])}`);

                    html[`genEnhBuy${i}`].changeStyle('background-color', canBuy ? '#C0C00080' : '#40400080');
                    html[`genEnhBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFFF00' : '#808000'}`);
                    html[`genEnhBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
                }
            }
        }
    }
}

function doGenEnhReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.generatorFeatures.enhancerGain.lte(0)) {
            return;
        }

        player.generatorFeatures.enhancer = Decimal.add(player.generatorFeatures.enhancer, tmp.generatorFeatures.enhancerGain);
        player.generatorFeatures.totalEnh = Decimal.add(player.generatorFeatures.totalEnh, tmp.generatorFeatures.enhancerGain);
        player.generatorFeatures.enhanceCount = Decimal.add(player.generatorFeatures.enhanceCount, 1);
    }

    player.generatorFeatures.xp = D(0);
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        player.generatorFeatures.buyable[i] = D(0);
    }
    tmp.generatorFeatures.gain = D(0);
    if (!hasTranscendMilestone(2)) {
        doAscendReset(true);
    }
    updateGame_genXP();
}

function buyGenEnhBuy(i) {
    if (!tmp.generatorFeatures.genEnhBuyables[i].canBuy) {
        return;
    }

    if (tmp.hinderances[4].depth.lte(0) || i != 0) {
        player.generatorFeatures.enhancer = Decimal.sub(player.generatorFeatures.enhancer, GEN_ENH_BUYABLES[i].cost);
    }
    
    if (shiftDown) {
        player.generatorFeatures.enhancerBuyables[i] = Decimal.max(player.generatorFeatures.enhancerBuyables[i], tmp.generatorFeatures.genEnhBuyables[i].target.ceil());
    } else {
        player.generatorFeatures.enhancerBuyables[i] = Decimal.add(player.generatorFeatures.enhancerBuyables[i], 1);
    }
}