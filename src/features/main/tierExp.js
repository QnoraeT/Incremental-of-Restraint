"use strict";

const TIER_XP_BUYABLES = [
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost.root(2), 0.02, false).pow(2).pow_base(5).mul(10);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 10)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(10).log(5).root(2), 0.02, true).pow(2);
            return target;
        },
        eff(bought) {
            let eff = D(2);
            eff = eff.add(tmp.tierFeatures.enhancerBuyables[0].eff);
            eff = eff.pow(bought);
            return eff;
        },
        desc(eff) {
            return `Tier XP gain is increased by ×${format(eff)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost.root(2), 0.02, false).pow(3).pow_base(1e2).mul(1e8);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 1e8)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(1e8).log(1e2).root(3), 0.02, true).pow(2);
            return target;
        },
        eff(bought) {
            let total = tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.tierLevels), tmp.buyables[0]);

            let eff = D(bought);
            eff = eff.mul(total.max(1e6).log(1e6).sub(1));
            return eff;
        },
        desc(eff) {
            return `Total tier levels raise Gen. XP gain by +^${format(eff, 3)}.`;
        }
    },
    {
        enabled() { return true; },
        cost(bought) {
            let cost = D(bought);
            cost = increasingExpCostScaling(cost.root(2), 0.05, false).pow(4).pow_base(1e5).mul(1e20);
            return cost;
        },
        target(resource) {
            if (Decimal.lt(resource, 1e20)) {
                return D(0);
            }
            let target = D(resource);
            target = increasingExpCostScaling(target.div(1e20).log(1e5).root(4), 0.05, true).pow(2);
            return target;
        },
        eff(bought) {
            let eff = D(bought);
            eff = eff.mul(4);
            return eff;
        },
        desc(eff) {
            return `Increase basic buyable interval by +${format(eff)} purchases. Mult per interval is increased by ^${format(eff.div(100).add(1), 2)}.`;
        }
    },
]

function initHTML_tierXP() {
    toHTMLvar('tierMainTabButton');
    toHTMLvar('tierMain');

    toHTMLvar('tierMainArea');
    toHTMLvar('tierXP');
    toHTMLvar('tierLvTotal');
    toHTMLvar('tierLvTotalBest');
    toHTMLvar('tierXPGain');
    toHTMLvar('tierXPSpdEff');
    toHTMLvar('tierXPPtsEff');
    toHTMLvar('tierXPAuto');
    toHTMLvar('tierXPUpgList');

    let txt = ``;
    for (let i = 0; i < TIER_XP_BUYABLES.length; i++) {
        txt += `
            <button onclick="buyTierXPBuy(${i})" id="tierXPBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="tierXPBuy${i}amount"></span><br>
                <span id="tierXPBuy${i}eff"></span><br><br>
                <span id="tierXPBuy${i}cost"></span>
            </button>
        `;
    }
    html['tierXPUpgList'].setHTML(txt);
    for (let i = 0; i < TIER_XP_BUYABLES.length; i++) {
        toHTMLvar(`tierXPBuy${i}`);
        toHTMLvar(`tierXPBuy${i}eff`);
        toHTMLvar(`tierXPBuy${i}cost`);
        toHTMLvar(`tierXPBuy${i}amount`);
    }
}

function updateGame_tierXP() {
    let resource;
    if (hasSetbackUpgrade(`r15`)) {
        for (let i = 0; i < TIER_XP_BUYABLES.length; i++) {
            tmp.tierFeatures.xpBuy[i].show = TIER_XP_BUYABLES[i].enabled();

            let cost = Decimal.floor(player.tierFeatures.buyable[i])
            tmp.tierFeatures.xpBuy[i].cost = TIER_XP_BUYABLES[i].cost(cost);

            resource = player.tierFeatures.xp;
            tmp.tierFeatures.xpBuy[i].target = TIER_XP_BUYABLES[i].target(resource);

            if (player.tierXPAuto && tmp.tierFeatures.xpBuy[i].show) {
                let bought = D(player.tierFeatures.buyable[i]);

                let buying = tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer.mul(tmp.timeSpeedTiers[1]) : D(Infinity);
                player.tierFeatures.buyable[i] = Decimal.add(tmp.tierFeatures.xpBuy[i].target, 0.99999999).max(player.tierFeatures.buyable[i]).min(Decimal.add(player.tierFeatures.buyable[i], buying.mul(delta)));
                
                // assume Decimal and not DecimalSource due to the prior lines changing it
                if (Decimal.gt(player.tierFeatures.buyable[i].floor(), bought.floor())) {
                    player.tierFeatures.xp = Decimal.sub(player.tierFeatures.xp, tmp.tierFeatures.xpBuy[i].cost).max(0); // idk why this is causing xp to go negative so i put a max 0 here
                }
            }

            tmp.tierFeatures.xpBuy[i].eff = TIER_XP_BUYABLES[i].eff(tmp.tierFeatures.xpBuy[i].show && tmp.prestigeRepeatChal[5].depth.lte(0)
                ? Decimal.floor(player.tierFeatures.buyable[i])
                : D(0));
            tmp.tierFeatures.xpBuy[i].canBuy = Decimal.gte(resource, tmp.tierFeatures.xpBuy[i].cost);
            tmp.tierFeatures.xpBuy[i].desc = TIER_XP_BUYABLES[i].desc(tmp.tierFeatures.xpBuy[i].eff);
        }

        tmp.factors.tierXP = [];

        let total = D(0);
        total = tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.tierLevels), tmp.buyables[0]);
        total = total.div(1e5);
        addStatFactor('tierXP', `Base`, `${format(total.mul(1e5))}/${format(1e5)}`, null, total);

        let totalGain = total;

        tmp.tierFeatures.gain = totalGain.mul(totalGain.pow10()).div(1e6);
        addStatFactor('tierXP', `Final Base`, `(${format(totalGain)}×10<sup>${format(totalGain)}</sup>)/${format(1e6)}`, null, tmp.tierFeatures.gain);

        tmp.tierFeatures.gain = tmp.tierFeatures.gain.mul(tmp.tierFeatures.xpBuy[0].eff);
        addStatFactor('tierXP', `Tier XP Buy. #1`, `×`, tmp.tierFeatures.xpBuy[0].eff, tmp.tierFeatures.gain);

        if (tmp.tierFeatures.enhancerEff.neq(1)) {
            tmp.tierFeatures.gain = tmp.tierFeatures.gain.mul(tmp.tierFeatures.enhancerEff);
            addStatFactor('tierXP', `Tier Enhancer Effect`, `×`, tmp.tierFeatures.enhancerEff, tmp.tierFeatures.gain);
        }

        if (player.cheats.dilate) {
            tmp.tierFeatures.gain = cheatDilateBoost(tmp.tierFeatures.gain);
            addStatFactor('tierXP', `Cheats`, `...`, null, tmp.tierFeatures.gain);
        }

        if (tmp.timeSpeedTiers[1].neq(1)) {
            tmp.tierFeatures.gain = tmp.tierFeatures.gain.mul(tmp.timeSpeedTiers[1]);
            addStatFactor('tierXP', `Tier 2 Time Speed`, `×`, tmp.timeSpeedTiers[1], tmp.tierFeatures.gain)
        }
        
        player.tierFeatures.xp = Decimal.add(player.tierFeatures.xp, tmp.tierFeatures.gain.mul(delta));

        tmp.tierFeatures.xpEffTiers = D(0.005);
        tmp.tierFeatures.xpEffTiers = Decimal.add(player.tierFeatures.xp, 1).log10().mul(tmp.tierFeatures.xpEffTiers).add(1).ln().add(1);
        if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
            tmp.tierFeatures.xpEffTiers = D(1);
        }

        tmp.tierFeatures.xpEffPoints = D(0.04);
        tmp.tierFeatures.xpEffPoints = Decimal.add(player.tierFeatures.xp, 1).log10().add(1).log10().mul(total.max(1).log2()).mul(tmp.tierFeatures.xpEffPoints).add(1);
        if (tmp.hinderances[3].depth.gt(0)) {
            tmp.tierFeatures.xpEffPoints = tmp.tierFeatures.xpEffPoints.pow(tmp.hinderances[3].effects.pts);
        }
        if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
            tmp.tierFeatures.xpEffPoints = D(1);
        }
    }
}

function updateHTML_tierXP() {
    html['tierMainTabButton'].setDisplay(hasSetbackUpgrade(`r15`))
    html['tierMain'].setDisplay(tmp.mainTab === 4)

    if (tmp.mainTab === 4) {
        html['tierXPAuto'].setDisplay(Decimal.gte(player.cheats.bullshit.pointExtr, 6));
        if (Decimal.gte(player.cheats.bullshit.pointExtr, 6)) {
            html[`tierXPAuto`].changeStyle('background-color', player.tierXPAuto ? '#80400080' : '#80000080');
            html[`tierXPAuto`].changeStyle('border', `3px solid #${player.tierXPAuto ? 'ff8000' : 'ff0000'}`);
            html[`tierXPAuto`].setTxt(player.tierXPAuto ? `Auto: ${format(tmp.prestigeRepeatChal[2].depth.gt(0) ? tmp.prestigeRepeatChal[2].effects.autobuyer.mul(tmp.timeSpeedTiers[1]) : D(Infinity))}/s` : 'Auto: Off');
        }

        html['tierXP'].setTxt(format(player.tierFeatures.xp, 2));
        html['tierXPGain'].setTxt(format(tmp.tierFeatures.gain, 2));
        html['tierXPSpdEff'].setTxt(format(tmp.tierFeatures.xpEffTiers, 3));
        html['tierXPPtsEff'].setTxt(format(tmp.tierFeatures.xpEffPoints, 3));
        html['tierLvTotal'].setTxt(format(tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.tierLevels), tmp.buyables[0])));
        // html['tierLvTotalBest'].setTxt(format(player.bestTotalTierLvs));

        let canBuy;
        for (let i = 0; i < TIER_XP_BUYABLES.length; i++) {
            html[`tierXPBuy${i}`].setDisplay(tmp.tierFeatures.xpBuy[i].show);
            if (tmp.tierFeatures.xpBuy[i].show) {
                canBuy = tmp.tierFeatures.xpBuy[i].canBuy;
                html[`tierXPBuy${i}eff`].setTxt(tmp.tierFeatures.xpBuy[i].desc);
                html[`tierXPBuy${i}cost`].setTxt(`Cost: ${format(tmp.tierFeatures.xpBuy[i].cost)} tier experience`);
                html[`tierXPBuy${i}amount`].setTxt(`Tier XP Buyable #${i+1}: ×${format(Decimal.floor(player.tierFeatures.buyable[i]))}`);

                html[`tierXPBuy${i}`].changeStyle('background-color', canBuy ? '#C0780080' : '#40280080');
                html[`tierXPBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFB000' : '#805800'}`);
                html[`tierXPBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
            }
        }
    }
}

function buyTierXPBuy(i) {
    if (!tmp.tierFeatures.xpBuy[i].canBuy) {
        return;
    }
    player.tierFeatures.xp = Decimal.sub(player.tierFeatures.xp, tmp.tierFeatures.xpBuy[i].cost);
    if (shiftDown) {
        player.tierFeatures.buyable[i] = Decimal.max(player.tierFeatures.buyable[i], tmp.tierFeatures.xpBuy[i].target.ceil());
    } else {
        player.tierFeatures.buyable[i] = Decimal.add(player.tierFeatures.buyable[i], 1);
    }
}