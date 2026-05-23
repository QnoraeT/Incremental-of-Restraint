"use strict";

const TIER_ENH_BUYABLES = [
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost.root(2), player.anticap.upgrades.includes(32) ? 0 : 0.02, false).pow(2).pow_base(3).mul(5);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 5)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(5).log(3).root(2), player.anticap.upgrades.includes(32) ? 0 : 0.02, true).pow(2);
            return target;
        },
        eff(bought) {
            let eff = D(bought);
            eff = eff.mul(0.1);
            return eff;
        },
        desc(eff) {
            return `Tier XP Buyable #1's base is increased by +${format(eff, 1)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost.root(2), 0.03, false).pow(3).pow_base(5).mul(40);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 40)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(40).log(5).root(3), 0.03, true).pow(2);
            return target;
        },
        eff(bought) {
            let eff = Decimal.max(player.time2ndInTranscend, 0);
            eff = Decimal.div(eff, 60).add(1).ln().pow_base(1e20);
            eff = eff.pow(bought);
            return eff;
        },
        desc(eff) {
            return `T2 time since transcension boosts tier speed by ×${format(eff, 1)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost, 0.2, false).pow(2).pow_base(10).mul(250);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 250)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(250).log(10).root(2), 0.2, true);
            return target;
        },
        eff(bought) {
            let eff = Decimal.max(player.time2ndInTranscend, 0);
            eff = Decimal.div(eff, 100).add(1).log2().add(1).mul(10).ln().div(1000);
            eff = eff.mul(bought);
            return eff;
        },
        desc(eff) {
            return `T2 time since transcension boosts points by +▲${format(eff, 4)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost.root(2), 0.02, false).pow(2).pow_base(1e5).mul(1e80);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 1e80)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(1e80).log(1e5).root(2), 0.02, true).pow(2);
            return target;
        },
        eff(bought) {
            let eff = D(10);
            eff = eff.pow(bought);
            return eff;
        },
        desc(eff) {
            return `Tier Enhancer gain is increased by ×${format(eff)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost, 0.03, false).pow(2).pow_base(1e20).mul(1e120);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 1e120)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(1e120).log(1e20).root(2), 0.03, true);
            return target;
        },
        eff(bought) {
            let eff = D(0.002);
            eff = eff.mul(bought);
            return eff;
        },
        desc(eff) {
            return `Generator XP gain is increased by +▲${format(eff, 3)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost, 0.1, false).pow_base(2).pow_base(Number.MAX_VALUE);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, Number.MAX_VALUE)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.log(Number.MAX_VALUE).log2(), 0.1, true);
            return target;
        },
        eff(bought) {
            let eff = D(1);
            eff = eff.mul(bought);
            eff = eff.add(1);
            if (player.anticap.upgrades.includes(31)) {
                eff = eff.pow(5);
            }
            return eff;
        },
        desc(eff) {
            return `Prestige generators' gain is multiplied by themselves. Currently: ~^${format(eff, 2)}.`;
        }
    },
]

function initHTML_tierEnhancers() {
    toHTMLvar('tierEnhArea');
    toHTMLvar('tierEnhance');
    toHTMLvar('tierEnhanceReset');
    toHTMLvar('tierEnhAmount');
    toHTMLvar('tierEnhNext');
    toHTMLvar('tierEnhXPEff');
    toHTMLvar('tierEnhGenerate');
    toHTMLvar('tierEnhAuto');
    toHTMLvar('tierEnhUpgList');

    let txt = ``;
    for (let i = 0; i < TIER_ENH_BUYABLES.length; i++) {
        txt += `
            <button onclick="buyTierEnhBuy(${i})" id="tierEnhBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="tierEnhBuy${i}amount"></span><br>
                <span id="tierEnhBuy${i}eff"></span><br><br>
                <span id="tierEnhBuy${i}cost"></span>
            </button>
        `;
    }
    html['tierEnhUpgList'].setHTML(txt);
    for (let i = 0; i < TIER_ENH_BUYABLES.length; i++) {
        toHTMLvar(`tierEnhBuy${i}`);
        toHTMLvar(`tierEnhBuy${i}eff`);
        toHTMLvar(`tierEnhBuy${i}cost`);
        toHTMLvar(`tierEnhBuy${i}amount`);
    }
}

function updateGame_tierEnhancers() {
    let resource;
    for (let i = 0; i < TIER_ENH_BUYABLES.length; i++) {
        tmp.tierFeatures.enhancerBuyables[i].show = TIER_ENH_BUYABLES[i].enabled();

        let cost = Decimal.floor(player.tierFeatures.enhancerBuyables[i]);
        tmp.tierFeatures.enhancerBuyables[i].cost = TIER_ENH_BUYABLES[i].cost(cost);

        resource = player.tierFeatures.enhancer;
        tmp.tierFeatures.enhancerBuyables[i].target = TIER_ENH_BUYABLES[i].target(resource);

        if (player.tierEnhAuto && tmp.tierFeatures.enhancerBuyables[i].show) {
            let bought = D(player.tierFeatures.enhancerBuyables[i]);

            let buying = tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer.mul(tmp.timeSpeedTiers[1]) : D(Infinity);
            player.tierFeatures.enhancerBuyables[i] = Decimal.add(tmp.tierFeatures.enhancerBuyables[i].target, 0.99999999).max(player.tierFeatures.enhancerBuyables[i]).min(Decimal.add(player.tierFeatures.enhancerBuyables[i], buying.mul(delta)));

            // assume Decimal and not DecimalSource due to the prior lines changing it
            if (Decimal.gt(player.tierFeatures.enhancerBuyables[i].floor(), bought.floor())) {
                player.tierFeatures.enhancer = Decimal.sub(player.tierFeatures.enhancer, tmp.tierFeatures.enhancerBuyables[i].cost).max(0); // idk why this is causing ascendGems to go negative so i put a max 0 here
            }
        }

        tmp.tierFeatures.enhancerBuyables[i].eff = TIER_ENH_BUYABLES[i].eff(tmp.prestigeRepeatChal[5].depth.gt(0)
            ? D(0)
            : Decimal.floor(player.tierFeatures.enhancerBuyables[i]));
        tmp.tierFeatures.enhancerBuyables[i].canBuy = Decimal.gte(resource, tmp.tierFeatures.enhancerBuyables[i].cost);
        tmp.tierFeatures.enhancerBuyables[i].desc = TIER_ENH_BUYABLES[i].desc(tmp.tierFeatures.enhancerBuyables[i].eff);
    }

    tmp.factors.tierEnh = [];

    tmp.tierFeatures.enhancerGain = Decimal.gte(player.tierFeatures.xp, 1e100) ? Decimal.div(player.tierFeatures.xp, 1e100).pow(0.015) : D(0);
    addStatFactor('tierEnh', `Base`, `(${format(player.tierFeatures.xp)}/${format(1e100)})<sup>0.015</sup>`, null, tmp.tierFeatures.enhancerGain);
    if (Decimal.gt(player.tierFeatures.enhancerBuyables[3], 0)) {
        tmp.tierFeatures.enhancerGain = tmp.tierFeatures.enhancerGain.mul(tmp.tierFeatures.enhancerBuyables[3].eff);
        addStatFactor('tierEnh', `Tier Enh. Buyable #4`, `×`, tmp.tierFeatures.enhancerBuyables[3].eff.add(1), tmp.tierFeatures.enhancerGain);
    }
    
    tmp.tierFeatures.enhancerGain = cheatDilateBoost(tmp.tierFeatures.enhancerGain).floor();

    if (player.tierEnhGenerate && Decimal.gte(player.cheats.bullshit.pointExtr, 7)) {
        player.tierFeatures.enhancer = Decimal.add(player.tierFeatures.enhancer, tmp.tierFeatures.enhancerGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[1]));
        player.tierFeatures.totalEnh = Decimal.add(player.tierFeatures.totalEnh, tmp.tierFeatures.enhancerGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[1]));
    }

    if (colorAmountTotal(3).gt(0) || (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.tierFeatures.enhanceCount, 1))) {
        tmp.tierFeatures.enhancerNext = D(Infinity);
    } else {
        tmp.tierFeatures.enhancerNext = tmp.tierFeatures.enhancerGain.add(1);
        tmp.tierFeatures.enhancerNext = cheatDilateBoost(tmp.tierFeatures.enhancerNext, true);

        if (Decimal.gt(player.tierFeatures.enhancerBuyables[3], 0)) {
            tmp.tierFeatures.enhancerNext = tmp.tierFeatures.enhancerNext.div(tmp.tierFeatures.enhancerBuyables[3].eff);
        }
        tmp.tierFeatures.enhancerNext = tmp.tierFeatures.enhancerNext.root(0.015).mul(1e100);
    }

    let decay = D(100);
    tmp.tierFeatures.enhancerEff = passiveLogSlowdown(Decimal.max(player.tierFeatures.totalEnh, 0).add(1), decay, false).pow(12);
}

function updateHTML_tierEnhancers() {
    let canBuy;
    if (tmp.mainTab === 4) {
        html['tierEnhGenerate'].setDisplay(Decimal.gte(player.cheats.bullshit.pointExtr, 7));
        if (Decimal.gte(player.cheats.bullshit.pointExtr, 7)) {
            html[`tierEnhGenerate`].changeStyle('background-color', player.tierEnhGenerate ? '#80800080' : '#80000080');
            html[`tierEnhGenerate`].changeStyle('border', `3px solid #${player.tierEnhGenerate ? 'ffff00' : 'ff0000'}`);
            html[`tierEnhGenerate`].setTxt(player.tierEnhGenerate ? 'Generate: 1%/s' : 'Generate: Off');
        }
        html['tierEnhAuto'].setDisplay(Decimal.gte(player.cheats.bullshit.pointExtr, 8));
        if (Decimal.gte(player.cheats.bullshit.pointExtr, 8)) {
            html[`tierEnhAuto`].changeStyle('background-color', player.tierEnhAuto ? '#80800080' : '#80000080');
            html[`tierEnhAuto`].changeStyle('border', `3px solid #${player.tierEnhAuto ? 'ffff00' : 'ff0000'}`);
            html[`tierEnhAuto`].setTxt(player.tierEnhAuto ? `Auto: ${format(tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer.mul(tmp.timeSpeedTiers[1]) : D(Infinity))}/s` : 'Auto: Off');
        }

        html['tierEnhAmount'].setTxt(format(tmp.tierFeatures.enhancerGain));
        let show = Decimal.lt(tmp.tierFeatures.enhancerGain, 100)
        html['tierEnhNext'].setDisplay(show);
        if (show) {
            html['tierEnhNext'].setTxt(`Next enhancer at ${format(tmp.tierFeatures.enhancerNext)} tier XP.`);
        }

        html['tierEnhanceReset'].changeStyle('cursor', Decimal.gt(tmp.tierFeatures.enhancerGain, 0) ? 'pointer' : 'not-allowed');

        html['tierEnhArea'].setDisplay(Decimal.gt(player.tierFeatures.totalEnh, 0));
        if (Decimal.gt(player.tierFeatures.totalEnh, 0)) {
            html['tierEnhance'].setTxt(format(player.tierFeatures.enhancer));
            html['tierEnhXPEff'].setTxt(format(tmp.tierFeatures.enhancerEff, 2));

            for (let i = 0; i < TIER_ENH_BUYABLES.length; i++) {
                html[`tierEnhBuy${i}`].setDisplay(tmp.tierFeatures.enhancerBuyables[i].show);
                if (tmp.tierFeatures.enhancerBuyables[i].show) {
                    canBuy = tmp.tierFeatures.enhancerBuyables[i].canBuy;
                    html[`tierEnhBuy${i}eff`].setTxt(tmp.tierFeatures.enhancerBuyables[i].desc);
                    html[`tierEnhBuy${i}cost`].setTxt(`Cost: ${format(tmp.tierFeatures.enhancerBuyables[i].cost)} enhancers`);
                    html[`tierEnhBuy${i}amount`].setTxt(`Tier. Enh. Buyable #${i+1}: ×${format(Decimal.floor(player.tierFeatures.enhancerBuyables[i]))}`);

                    html[`tierEnhBuy${i}`].changeStyle('background-color', canBuy ? '#80800080' : '#40400080');
                    html[`tierEnhBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFFF00' : '#808000'}`);
                    html[`tierEnhBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
                }
            }
        }
    }
}

function doTierEnhReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.tierFeatures.enhancerGain.lte(0)) {
            return;
        }

        if (!transcendResetWOGainPrompt()) {
            return;
        }

        player.tierFeatures.enhancer = Decimal.add(player.tierFeatures.enhancer, tmp.tierFeatures.enhancerGain);
        player.tierFeatures.totalEnh = Decimal.add(player.tierFeatures.totalEnh, tmp.tierFeatures.enhancerGain);
        player.tierFeatures.enhanceCount = Decimal.add(player.tierFeatures.enhanceCount, 1);
    }

    player.tierFeatures.xp = D(0);
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        player.tierFeatures.buyable[i] = D(0);
    }
    tmp.tierFeatures.gain = D(0);
    doTranscendReset(true);
    updateGame_tierXP();
}

function buyTierEnhBuy(i) {
    if (!tmp.tierFeatures.enhancerBuyables[i].canBuy) {
        return;
    }
    player.tierFeatures.enhancer = Decimal.sub(player.tierFeatures.enhancer, tmp.tierFeatures.enhancerBuyables[i].cost);
    if (shiftDown) {
        player.tierFeatures.enhancerBuyables[i] = Decimal.max(player.tierFeatures.enhancerBuyables[i], tmp.tierFeatures.enhancerBuyables[i].target.ceil());
    } else {
        player.tierFeatures.enhancerBuyables[i] = Decimal.add(player.tierFeatures.enhancerBuyables[i], 1);
    }
}