"use strict";

const MAIN_SPECIALS = {
    special1: {
        get show() {
            return player.transcendUpgrades.includes('point3');
        },
        get cost() {
            let cost = D(player.specialBuyables[0]);
            cost = cost.div(10).add(3).pow_base(2).pow10();
            return cost;
        },
        get target() {
            let target = Decimal.max(player.points, 10);
            target = target.log10().log2().sub(3).mul(10);
            return target;
        },
        get effect() {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1)
            }
            let eff = D(player.specialBuyables[0]).add(1);
            eff = eff.factorial();
            return eff;
        }
    }
}

function initHTML_main() {
    toHTMLvar('mainTab');
    toHTMLvar('mainTabButton');
    toHTMLvar('upgradeScalingInterval');
    toHTMLvar('upgradeScalingBoost');
    toHTMLvar('upgradeScalingSpeed');
    toHTMLvar('upgradeScalingBoostExist');
    toHTMLvar('upgradeScalingPC1');
    toHTMLvar('genEffPerMain');
    toHTMLvar('tierMainDesc');
    toHTMLvar('tierEffPerMain');
    toHTMLvar('upgradePC1Desc');
    toHTMLvar('upgradeInSetback');
    toHTMLvar('prestigeChallengeEffs');
    toHTMLvar('hinderanceEffs');
    toHTMLvar('upgradeList');
    toHTMLvar('mainMainTabButton');
    toHTMLvar('specialMainTabButton');
    toHTMLvar('mainMain');
    toHTMLvar('specialMain');

    html['mainTab'].setDisplay(false);

    let txt = ``;
    for (let i = 0; i < player.buyables.length; i++) {
        txt += `
            <div id="upgrade${i}all" style="width: 175px; margin: 2px">
                <button onclick="toggleBuyableAutobuy(${i})" id="upgrade${i}auto" class="whiteText font" style="height: 20px; width: 175px; font-size: 10px; margin: 2px">
                    Autobuyer: <span id="upgrade${i}autoStatus"></span>
                </button>
                <button onclick="buyBuyable(${i})" id="upgrade${i}" class="whiteText font" style="height: 70px; width: 175px; font-size: 10px; margin: 2px">
                    <span id="upgrade${i}amount"></span><br>
                    <br>
                    Effect: <span id="upgrade${i}eff"></span><br>
                    Cost: <span id="upgrade${i}cost"></span>
                </button>
                <div class="flex-vertical" style="margin-left: 4px">
                    <div id="upgrade${i}generators" style="height: 10px; width: 175px; position: relative; margin: 2px">
                        <div id="upgrade${i}generatorProgressBarBase" style="background-color: #008020; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                        <div id="upgrade${i}generatorProgressBar" style="background-color: #00FF40; position: absolute; top: 0; left: 0; height: 100%"></div>
                    </div>
                    <span id="upgrade${i}generatorProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
                </div>
                <div class="flex-vertical" style="margin-left: 4px">
                    <div id="upgrade${i}generatorTiers" style="height: 10px; width: 175px; position: relative; margin: 2px">
                        <div id="upgrade${i}generatorTierProgressBarBase" style="background-color: #805000; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                        <div id="upgrade${i}generatorTierProgressBar" style="background-color: #FFA000; position: absolute; top: 0; left: 0; height: 100%"></div>
                    </div>
                    <span id="upgrade${i}generatorTierProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
                </div>
            </div>
        `;
    }
    html['upgradeList'].setHTML(txt);
    for (let i = 0; i < player.buyables.length; i++) {
        toHTMLvar(`upgrade${i}all`);
        toHTMLvar(`upgrade${i}`);
        toHTMLvar(`upgrade${i}auto`);
        toHTMLvar(`upgrade${i}autoStatus`);
        toHTMLvar(`upgrade${i}amount`);
        toHTMLvar(`upgrade${i}eff`);
        toHTMLvar(`upgrade${i}cost`);
        toHTMLvar(`upgrade${i}generators`);
        toHTMLvar(`upgrade${i}generatorProgressBarBase`);
        toHTMLvar(`upgrade${i}generatorProgressBar`);
        toHTMLvar(`upgrade${i}generatorProgressNumber`);
        toHTMLvar(`upgrade${i}generatorTiers`);
        toHTMLvar(`upgrade${i}generatorTierProgressBarBase`);
        toHTMLvar(`upgrade${i}generatorTierProgressBar`);
        toHTMLvar(`upgrade${i}generatorTierProgressNumber`);
    }

    toHTMLvar(`spBuy1all`);
    toHTMLvar(`spBuy1`);
    toHTMLvar(`spBuy1auto`);
    toHTMLvar(`spBuy1autoStatus`);
    toHTMLvar(`spBuy1amount`);
    toHTMLvar(`spBuy1eff`);
    toHTMLvar(`spBuy1cost`);
}

function updateGame_main() {
    player.timeSinceBuyableBought = Decimal.add(player.timeSinceBuyableBought, Decimal.mul(delta, tmp.timeSpeedTiers[0]));

    checkBuyableActivity();
    checkBuyableAutobuyers();

    tmp.bybBoostInterval = D(100);
    tmp.bybBoostEffect = D(2);
    tmp.bybBoostCost = D(2);

    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(6)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(7)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(8)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(9)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(3);
    }
    if (hasSetbackUpgrade(`g7`)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(SETBACK_UPGRADES[1][6].eff);
    }
    if (player.transcendUpgrades.includes('point1')) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.mul(2);
    }

    if (Decimal.gte(player.hinderanceScore[3], HINDERANCES[3].start)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.mul(HINDERANCES[3].eff);
        tmp.bybBoostCost = D(1.95);
    }

    if (tmp.prestigeChal[1].depth.gt(0)) {
        tmp.bybBoostInterval = tmp.prestigeChal[1].effects.interval;
        tmp.bybBoostEffect = D(1);
    }

    if (tmp.prestigeChal[3].depth.gt(0) && tmp.hinderances[2].depth.lte(0)) {
        tmp.bybBoostInterval = tmp.bybBoostInterval.div(tmp.prestigeChal[3].effects.interval);
        tmp.bybBoostEffect = D(1)
    }

    if (tmp.hinderances[3].depth.gt(0)) {
        tmp.bybBoostInterval = D(1000);
    }

    tmp.pointGen = D(1);
    tmp.factors.points = [];
    tmp.factors.generator = [];
    tmp.factors.tier = [];
    let totalGenLevels = D(0);
    addStatFactor('points', `Base`, ``, 1, 1);
    for (let i = player.buyables.length - 1; i >= 0; i--) {
        if (buyableEnabled(i)) {
            player.buyableInTranscension[i] ||= Decimal.gt(player.buyables[i], 0);

            tmp.buyables[i].tierLevels = tierPointFunc(Decimal.max(player.buyableTierPoints[i], 1), true).max(1).floor();

            tmp.tierEffectBase = D(1.01);
            if (Decimal.gte(player.hinderanceScore[4], HINDERANCES[4].start) && player.transcendInSpecialReq === null) {
                tmp.tierEffectBase = D(1.011);
            }
            tmp.buyables[i].tierEffect = (
                player.transcendInSpecialReq !== 'exp2' 
                    ? tmp.buyables[i].tierLevels 
                    : tmp.buyables[i].tierLevels.neg())
                .pow_base(tmp.tierEffectBase);

            tmp.buyables[i].costSpeed = D(1);
            if (i >= 0 && i <= 3) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.div(ASCENSION_UPGRADES[i + 8].eff);
            }
            if (colorAmountTotal(1).gt(0)) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(tmp.setbackEffects[1][0]);
            }
            tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(tmp.energyEffs[1]);
            if (hasSetbackUpgrade(`g9`)) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(0.75);
            }
            if (hasSetbackUpgrade(`g12`)) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.div(SETBACK_UPGRADES[1][11].eff);
            }
            tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.div(tmp.buyables[i].tierEffect);
            if (player.transcendUpgrades.includes('enhancer1')) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.div(Decimal.max(tmp.buyables[i].genLevels, 1))
            }
            if (player.transcendInSpecialReq === "point4") {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(1000);
            }

            let pow = Decimal.pow(2 + i, 0.1);
            let baseCost;
            if (hasSetbackUpgrade(`g9`)) {
                baseCost = D(1);
            } else {
                baseCost = [D(2), D(20), D(500), D(10000), D(1e6), D(1e9)][i];
            }

            let resource = player.points;
            if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                resource = player.buyables[i - 1];
            }

            tmp.buyables[i].target = D(resource);
            if (hasSetbackUpgrade(`g8`)) {
                tmp.buyables[i].target = tmp.buyables[i].target.mul(tmp.buyables[i].genLevels.sub(1).pow10());
            }

            tmp.buyables[i].target = tmp.buyables[i].target.div(baseCost).max(1).mul(pow.sub(1)).add(1).log(pow).sub(1);
            tmp.buyables[i].target = tmp.buyables[i].target.div(tmp.buyables[i].costSpeed);
            let h = tmp.buyables[i].target.mul(tmp.bybBoostCost.sub(1)).div(tmp.bybBoostInterval).add(1).log(tmp.bybBoostCost).floor();
            tmp.buyables[i].target = tmp.buyables[i].target.add(tmp.bybBoostInterval.div(tmp.bybBoostCost.sub(1))).div(tmp.bybBoostCost.pow(h)).add(h.sub(tmp.bybBoostCost.sub(1).recip()).mul(tmp.bybBoostInterval));
            checkNaN(tmp.buyables[i].target, `NaN detected while attempting to calculate target of Buyable #${i + 1}`);

            // auto-upgrade
            if (player.buyableAuto[i]) {
                player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], buyableAutobSpeed(i).mul(delta)).min(tmp.buyables[i].target).max(player.buyableAutobought[i]);
                let bought = player.buyables[i];
                player.buyables[i] = player.buyableAutobought[i].add(0.99999999).floor().max(player.buyables[i]);
                bought = Decimal.sub(bought, player.buyables[i]);
                if (bought.lt(0)) {
                    // why only the first buy? the earlier purchases get increasingly negligible
                    // ee15 as a limit because at some point, cost may equal points and do some weird crap
                    player.timeSinceBuyableBought = D(0);
                    if (!player.transcendUpgrades.includes('prest3')) {
                        if (Decimal.lt(player.points, 'ee15')) {
                            player.points = Decimal.sub(player.points, tmp.buyables[i].cost).max(0);
                        }
                    }
                }
            }

            tmp.buyables[i].cost = D(player.buyables[i]);
            let x = tmp.buyables[i].cost.div(tmp.bybBoostInterval).floor();
            let m = tmp.buyables[i].cost.sub(x.mul(tmp.bybBoostInterval));
            tmp.buyables[i].cost = m.mul(tmp.bybBoostCost.pow(x)).add(tmp.bybBoostCost.pow(x).sub(1).div(tmp.bybBoostCost.sub(1)).mul(tmp.bybBoostInterval));
            tmp.buyables[i].cost = tmp.buyables[i].cost.mul(tmp.buyables[i].costSpeed);
            tmp.buyables[i].cost = Decimal.add(tmp.buyables[i].cost, 1).pow_base(pow).sub(1).div(pow.sub(1)).mul(baseCost);

            // an exception to the "mul always first then pow" cuz i want to make the effect clear
            if (hasSetbackUpgrade(`g8`)) {
                tmp.buyables[i].cost = tmp.buyables[i].cost.div(tmp.buyables[i].genLevels.sub(1).pow10());
            }
            checkNaN(tmp.buyables[i].cost, `NaN detected while attempting to calculate cost of Buyable #${i + 1}`);

            tmp.buyables[i].canBuy = Decimal.gte(resource, tmp.buyables[i].cost);

            tmp.buyables[i].effective = D(player.buyables[i]);

            if (player.prestigeChallengeCompleted.includes(2)) {
                if (tmp.prestigeUpgEffs[3].gt(0)) {
                    for (let j = i + 1; j < player.buyables.length; j++) {
                        tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[j].effective.mul(tmp.prestigeUpgEffs[3]));
                    }
                } else {
                    if (i !== player.buyables.length - 1) {
                        tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[i + 1].effective);
                    }
                }
            } else {
                if (i !== player.buyables.length - 1) {
                    tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[i + 1].effective.mul(tmp.prestigeUpgEffs[3]));
                }
            }

            // tiers
            let upgGen = D(0);
            if (Decimal.gte(tmp.generatorFeatures.genEnhBuyables[2].eff, 1) || player.transcendInSpecialReq === 'exp2') {
                upgGen = Decimal.div(player.buyables[i], 1000).add(1).pow(
                    player.transcendInSpecialReq !== 'exp2' 
                        ? tmp.generatorFeatures.genEnhBuyables[2].eff 
                        : D(1)
                    ).sub(1);
                if (i === 0) {
                    addStatFactor('tier', `Base`, `(1+${format(player.buyables[i])}/${format(1e3)})<sup>${player.transcendInSpecialReq !== 'exp2' 
                        ? format(tmp.generatorFeatures.genEnhBuyables[2].eff) 
                        : format(1)}</sup>`, null, upgGen)
                }
                if (player.transcendInSpecialReq !== 'exp2') {
                    if (hasSetbackUpgrade('c10')) {
                        upgGen = upgGen.mul(SETBACK_UPGRADES[3][9].eff);
                        if (i === 0) {
                            addStatFactor('tier', `Cyan S. Upgrade 10`, `×`, SETBACK_UPGRADES[3][9].eff, upgGen)
                        }
                    }
                    if (player.transcendUpgrades.includes('gen2')) {
                        upgGen = upgGen.mul(tmp.buyables[i].genLevels.mul(0.001).add(1));
                        if (i === 0) {
                            addStatFactor('tier', `Trans. Upg. "Tier Level Interest"`, `×`, tmp.buyables[i].genLevels.mul(0.001).add(1), upgGen)
                        }
                    }

                    if (tmp.hinderances[4].depth.gt(0)) {
                        upgGen = upgGen.pow(tmp.hinderances[4].effects.resource);
                        if (i === 0) {
                            addStatFactor('tier', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, upgGen);
                        }
                    }

                    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
                        upgGen = upgGen.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
                        if (i === 0) {
                            addStatFactor('tier', `PRC2`, `(to exp.) ^`, tmp.prestigeRepeatChal[1].effects.exponent, upgGen);
                        }
                    }

                    if (player.cheats.dilate) {
                        upgGen = cheatDilateBoost(upgGen);
                        if (i === 0) {
                            addStatFactor('tier', `Cheats`, `...`, null, upgGen);
                        }
                    }

                    upgGen = upgGen.mul(tmp.timeSpeedTiers[0]);
                    if (tmp.timeSpeedTiers[0].neq(1) && i === 0) {
                        addStatFactor('tier', `Tier 1 Time Speed`, `×`, tmp.timeSpeedTiers[0], upgGen)
                    }
                } else {
                    upgGen = upgGen.mul(1000);
                    if (i === 0) {
                        addStatFactor('tier', `exp2 restriction`, `×`, 1000, upgGen)
                    }
                    upgGen = upgGen.div(Decimal.pow(10, tmp.generatorFeatures.genEnhBuyables[2].eff));
                    if (i === 0) {
                        addStatFactor('tier', `exp2: Gen. Enh. B. #3`, `/`, Decimal.pow(10, tmp.generatorFeatures.genEnhBuyables[2].eff), upgGen)
                    }
                }

                tmp.tierSpeed = upgGen;
            }
            player.buyableTierPoints[i] = Decimal.add(player.buyableTierPoints[i], upgGen.mul(delta));

            // generators
            upgGen = D(0);
            if (player.prestigeChallengeCompleted.includes(0) || tmp.prestigeChal[10].depth.gt(0)) {
                upgGen = D(player.buyables[i]);
                upgGen = upgGen.mul(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostEffect));
                if (i === 0) {
                    addStatFactor('generator', `Base`, `${format(player.buyables[i])}*${format(tmp.bybBoostEffect, 2)}<sup>⌊${format(player.buyables[i])}/${format(tmp.bybBoostInterval)}⌋</sup>`, null, upgGen);
                }
                if (tmp.prestigeChal[10].depth.lte(0)) {
                    if (player.transcendUpgrades.includes('ascend3')) {
                        upgGen = upgGen.pow(tmp.transEffs[3][2]);
                        if (i === 0) {
                            addStatFactor('generator', `Trans. Upg. "Generator Ascensions"`, `^`, tmp.transEffs[3][2], upgGen);
                        }
                    }
                    if (Decimal.gt(player.ascendUpgrades[1], 0)) {
                        upgGen = upgGen.mul(tmp.ascendBuyables[1].eff);
                        if (i === 0) {
                            addStatFactor('generator', `Ascension Buyable 2`, `×`, tmp.ascendBuyables[1].eff, upgGen);
                        }
                    }
                    if (player.prestigeChallengeCompleted.includes(12)) {
                        let eff = tmp.buyables[i].effect;
                        if (player.prestigeChallenge === 2) {
                            upgGen = upgGen.add(eff);
                        } else {
                            upgGen = upgGen.mul(eff);
                        }

                        if (i === 0) {
                            addStatFactor('generator', `PC13 Reward`, player.prestigeChallenge === 2 ? '+' : '×', eff, upgGen);
                        }
                    }
                    if (Decimal.gt(player.generatorFeatures.enhancerBuyables[1], 0)) {
                        upgGen = upgGen.mul(tmp.generatorFeatures.genEnhBuyables[1].eff);
                        if (i === 0) {
                            addStatFactor('generator', `Gen. Enh. Buyable 2`, `×`, tmp.generatorFeatures.genEnhBuyables[1].eff, upgGen);
                        }
                    }
                    if (hasPrestigeUpgrade(10)) {
                        upgGen = upgGen.pow(tmp.prestigeUpgEffs[10]);
                        if (i === 0) {
                            addStatFactor('generator', `Prestige Upgrade 10`, `^`, tmp.prestigeUpgEffs[10], upgGen);
                        }
                    }
                    if (hasPrestigeUpgrade(11)) {
                        upgGen = upgGen.pow(tmp.prestigeUpgEffs[11]);
                        if (i === 0) {
                            addStatFactor('generator', `Prestige Upgrade 11`, `^`, tmp.prestigeUpgEffs[11], upgGen);
                        }
                    }
                    if (Decimal.gt(player.generatorFeatures.xp, 0)) {
                        upgGen = upgGen.pow(tmp.generatorFeatures.xpEffGenerators);
                        if (i === 0) {
                            addStatFactor('generator', `Generator XP Effect`, `^`, tmp.generatorFeatures.xpEffGenerators, upgGen);
                        }
                    }
                    if (tmp.prestigeChal[11].depth.gt(0)) {
                        upgGen = upgGen.pow(tmp.prestigeChal[11].effects.root);
                        if (i === 0) {
                            addStatFactor('generator', `PC12`, `^`, tmp.prestigeChal[11].effects.root, upgGen);
                        }
                    }
                    if (player.prestigeChallengeCompleted.includes(11)) {
                        let eff = D(1.2);
                        if (player.prestigeChallengeCompleted.includes(17)) {
                            eff = D(1.25);
                        }
                        upgGen = upgGen.pow(eff)
                        if (i === 0) {
                            addStatFactor('generator', `PC12 Reward`, `^`, eff, upgGen);
                        }
                    }
                    if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
                        upgGen = upgGen.pow(Decimal.pow(1.02, Decimal.max(player.prestigeEssence, 1).log10()));
                        if (i === 0) {
                            addStatFactor('generator', `H1 Reward`, `^1.02<sup>log<sub>10</sub>(${format(player.prestigeEssence)})</sup> → ^`, Decimal.pow(1.02, Decimal.max(player.prestigeEssence, 1).log10()), upgGen);
                        }
                    }
                    if (player.transcendUpgrades.includes('gen2')) {
                        upgGen = upgGen.pow(tmp.buyables[i].tierLevels.mul(0.0001).add(1))
                        if (i === 0) {
                            addStatFactor('generator', `Trans. Upg. "Tier Level Interest"`, `^`, tmp.buyables[i].tierLevels.mul(0.0001).add(1), upgGen)
                        }
                    }
                    if (tmp.repliRankBuyables[3].eff.neq(1)) {
                        upgGen = upgGen.pow(tmp.repliRankBuyables[3].eff)
                        if (i === 0) {
                            addStatFactor('generator', `RepliRank Buyable #4`, `^`, tmp.repliRankBuyables[3].eff, upgGen)
                        }
                    }

                    if (hasPrestigeUpgrade(16)) {
                        upgGen = upgGen.max(1).log10().add(1).pow(tmp.prestigeUpgEffs[16]).sub(1).pow10();
                        if (i === 0) {
                            addStatFactor('generator', `Prestige Upgrade 17`, `(to exp.) ^`, tmp.prestigeUpgEffs[16], upgGen);
                        }
                    }

                    if (tmp.prestigeChal[12].depth.gt(0)) {
                        // i have to cache this cuz slogs/tetrates are super slow
                        // also put linear because we are almost never going to use fractional depths for challenges >_>
                        let prevValue = upgGen;
                        upgGen = upgGen.iteratedlog(10, tmp.prestigeChal[12].effects.log, true);
                        if (Decimal.isNaN(upgGen)) {
                            upgGen = D(0);
                        }
                        if (i === 0) {
                            addStatFactor('generator', `PC13`, `log${tmp.prestigeChal[12].effects.log.neq(1) ? '<sup>' + format(tmp.prestigeChal[12].effects.log, 2) + '</sup>' : ''}<sub>10</sub>(${format(prevValue.sub(1))})`, null, upgGen)
                        }
                        upgGen = upgGen.mul(tmp.buyables[i].effect);
                        if (i === 0) {
                            addStatFactor('generator', `PC13`, `×`, tmp.buyables[i].effect, upgGen);
                        }
                    }

                    if (tmp.hinderances[4].depth.gt(0)) {
                        upgGen = upgGen.pow(tmp.hinderances[4].effects.resource);
                        if (i === 0) {
                            addStatFactor('generator', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, upgGen);
                        }
                    }

                    if (player.transcendInSpecialReq === "enhancer1") {
                        let boost = Decimal.max(upgGen, 10).log10().log10().add(1)
                        upgGen = Decimal.max(player.generatorFeatures.xp, 1)
                        if (i === 0) {
                            addStatFactor('generator', `enhancer1 restriction`, ``, Decimal.max(player.generatorFeatures.xp, 0), upgGen)
                        }

                        upgGen = upgGen.pow(boost)
                        if (i === 0) {
                            addStatFactor('generator', `enhancer1 restriction`, `^`, boost, upgGen)
                        }
                    }

                    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
                        upgGen = upgGen.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
                        if (i === 0) {
                            addStatFactor('generator', `PRC2`, `(to exp.) ^`, tmp.prestigeRepeatChal[1].effects.exponent, upgGen);
                        }
                    }

                    if (player.cheats.dilate) {
                        upgGen = cheatDilateBoost(upgGen) 
                        if (i === 0) {
                            addStatFactor('generator', `Cheats`, `...`, null, upgGen)
                        }
                    }

                    upgGen = upgGen.mul(tmp.timeSpeedTiers[0]);
                    if (tmp.timeSpeedTiers[0].neq(1) && i === 0) {
                        addStatFactor('generator', `Tier 1 Time Speed`, `×`, tmp.timeSpeedTiers[0], upgGen);
                    }

                    tmp.generatorSpeed = upgGen
                }
            }

            if (tmp.hinderances[1].depth.gt(0)) {
                player.buyablePoints[i] = Decimal.max(player.buyablePoints[i], 0).add(1).log10().add(1).root(tmp.hinderances[1].effects.decay).sub(1).pow10().sub(1).add(upgGen.mul(delta)).add(1).log10().add(1).pow(tmp.hinderances[1].effects.decay).sub(1).pow10().sub(1);
            } else {
                player.buyablePoints[i] = Decimal.add(player.buyablePoints[i], upgGen.mul(delta));
            }

            tmp.buyables[i].genLevels = genPointFunc(Decimal.max(player.buyablePoints[i], 1), true, i).max(1).floor();
            totalGenLevels = totalGenLevels.add(tmp.buyables[i].genLevels);

            if (tmp.prestigeChal[12].depth.gt(0)) {
                tmp.buyables[i].genEffect = tmp.buyables[i].genLevels.sub(1).pow_base(Decimal.div(1, hasPrestigeUpgrade(12) ? tmp.prestigeUpgEffs[12] : 10).add(1))
            } else {
                tmp.buyables[i].genEffect = tmp.buyables[i].genLevels.sub(1).div(hasPrestigeUpgrade(12) ? tmp.prestigeUpgEffs[12] : 10).add(1);
            }

            if (tmp.prestigeChal[10].depth.gt(0)) {
                tmp.buyables[i].genEffect = Decimal.sub(2, tmp.buyables[i].genEffect).max(0);
            }

            if (player.transcendUpgrades.includes('point4')) {
                tmp.buyables[i].genEffect = tmp.buyables[i].genEffect.max(0).add(1).log10().add(1).pow(1.4).sub(1).pow10().sub(1);
            }

            tmp.buyables[i].effectBase = [D(1.0), D(0.5), D(0.25), D(0.1), D(0.05), D(0.01)][i];
            if (tmp.prestigeChal[3].depth.gt(0) && i < player.buyables.length - 1) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.add(tmp.buyables[i+1].effect);
            }
            if (player.transcendUpgrades.includes('prest4') && i < player.buyables.length - 1) {
                if (player.prestigeChallenge === 2) {
                    tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.add(tmp.buyables[i+1].effect);
                } else {
                    tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.mul(tmp.buyables[i+1].effect);
                }
            }

            if (hasPrestigeUpgrade(5)) {
                if (i === 3) {
                    tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.add(tmp.prestigeUpgEffs[5]);
                }
            }

            if (hasPrestigeUpgrade(8)) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.mul(tmp.prestigeUpgEffs[8]);
            }

            if (tmp.prestigeChal[0].depth.gt(0)) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.div(tmp.prestigeChal[0].effects.effectBase);
            }
            tmp.buyables[i].effect = tmp.buyables[i].effective.mul(tmp.buyables[i].effectBase).add(1);
            if (tmp.prestigeChal[12].depth.lte(0)) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.mul(tmp.buyables[i].genEffect);
            }

            if (tmp.prestigeChal[3].depth.gt(0) && i !== 0) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.sub(1);
            }

            tmp.buyables[i].effect = tmp.buyables[i].effect.mul(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostEffect));
            if (Decimal.lt(i, player.ascendUpgrades[2])) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.pow(tmp.ascendBuyables[2].eff);
            }

            if (tmp.prestigeChal[12].depth.gt(0)) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.add(1).layeradd10(tmp.prestigeChal[12].effects.log.neg());
                if (Decimal.isNaN(tmp.buyables[i].effect)) {
                    tmp.buyables[i].effect = D(1);
                }
            }
            if (tmp.hinderances[0].depth.gt(0) && Decimal.sqrt(player.buyables[i]).neq(Decimal.sqrt(player.buyables[i]).round())) {
                tmp.buyables[i].effect = D(1);
            }

            if ((tmp.prestigeChal[3].depth.lte(0) || i === 0) && tmp.prestigeChal[12].depth.lte(0)) {
                if (tmp.prestigeChal[2].depth.lte(0)) {
                    tmp.pointGen = tmp.pointGen.mul(tmp.buyables[i].effect);
                } else {
                    tmp.pointGen = tmp.pointGen.add(tmp.buyables[i].effect);
                }

                addStatFactor('points', `Buyable ${i+1}`, `×`, tmp.buyables[i].effect, tmp.pointGen);
            }

            if (tmp.prestigeChal[12].depth.gt(0)) {
                tmp.pointGen = tmp.pointGen.mul(tmp.buyables[i].genEffect);

                addStatFactor('points', `Buyable ${i+1}: PC12`, `×`, tmp.buyables[i].genEffect, tmp.pointGen);
            }
        } else {
            tmp.buyables[i].effective = D(0);
        }
    }
    player.bestTotalGenLvs = Decimal.max(player.bestTotalGenLvs, totalGenLevels);

    if (true) {
        if (tmp.hinderances[3].depth.gt(0)) {
            tmp.pointGen = tmp.pointGen.pow(5);
            addStatFactor('points', `Hinderance 4`, `^`, 5, tmp.pointGen);
        }
        if (Decimal.gt(player.specialBuyables[0])) {
            tmp.pointGen = tmp.pointGen.mul(MAIN_SPECIALS.special1.effect);
            addStatFactor('points', `"Buyable 7"`, `×`, MAIN_SPECIALS.special1.effect, tmp.pointGen);
        }
        if (hasPrestigeUpgrade(0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[0]);
            addStatFactor('points', `Prestige Upgrade 1`, `×`, tmp.prestigeUpgEffs[0], tmp.pointGen);
        }
        if (hasPrestigeUpgrade(1)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[1]);
            addStatFactor('points', `Prestige Upgrade 2`, `×`, tmp.prestigeUpgEffs[1], tmp.pointGen);
        }
        if (hasPrestigeUpgrade(2) || hasSetbackUpgrade('b4')) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[2]);
            addStatFactor('points', `Prestige Upgrade 3`, `×`, tmp.prestigeUpgEffs[2], tmp.pointGen);
        }
        if (hasPrestigeUpgrade(4)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[4]);
            addStatFactor('points', `Prestige Upgrade 5`, `×`, tmp.prestigeUpgEffs[4], tmp.pointGen);
        }
        if (hasPrestigeUpgrade(6)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[6]);
            addStatFactor('points', `Prestige Upgrade 7`, `×`, tmp.prestigeUpgEffs[6], tmp.pointGen);
        }
        if (hasPrestigeUpgrade(7)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[7]);
            addStatFactor('points', `Prestige Upgrade 8`, `×`, tmp.prestigeUpgEffs[7], tmp.pointGen);
        }
        if (player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')) {
            tmp.pointGen = tmp.pointGen.mul(tmp.prestigePointEffect);
            addStatFactor('points', `PC3 Reward`, `×`, tmp.prestigePointEffect, tmp.pointGen);
        }
        if (Decimal.gt(player.ascendUpgrades[0], 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.ascendBuyables[0].eff);
            addStatFactor('points', `Ascension Buyable 1`, `×`, tmp.ascendBuyables[0].eff, tmp.pointGen);
        }
        if (Decimal.gt(player.setbackEnergy[0], 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.energyEffs[0]);
            addStatFactor('points', `Red Energy`, `×`, tmp.energyEffs[0], tmp.pointGen);
        }

        for (let i = 0; i < 5; i++) {
            if (hasSetbackUpgrade(`r${i+1}`)) {
                tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[0][i].eff);
                addStatFactor('points', `Red S. Upgrade ${i+1}`, `×`, SETBACK_UPGRADES[0][i].eff, tmp.pointGen);
            }
            if (hasSetbackUpgrade(`g${i+1}`)) {
                tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[1][i].eff);
                addStatFactor('points', `Green S. Upgrade ${i+1}`, `×`, SETBACK_UPGRADES[1][i].eff, tmp.pointGen);
            }
        }

        if (hasSetbackUpgrade(`r7`)) {
            tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[0][6].eff);
            addStatFactor('points', `Red S. Upgrade 7`, `×`, SETBACK_UPGRADES[0][6].eff, tmp.pointGen);
        }
        if (hasSetbackUpgrade(`r8`)) {
            tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[0][7].eff);
            addStatFactor('points', `Red S. Upgrade 8`, `×`, SETBACK_UPGRADES[0][7].eff, tmp.pointGen);
        }
        if (Decimal.gt(player.prestigeEssence, 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.peEffect);
            addStatFactor('points', `Prestige Essence`, `×`, tmp.peEffect, tmp.pointGen);
        }
        if (Decimal.gt(player.generatorFeatures.buyable[1], 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.generatorFeatures.genXPBuyables[1].eff);
            addStatFactor('points', `Generator XP Buyable #2`, `×`, tmp.generatorFeatures.genXPBuyables[1].eff, tmp.pointGen);
        }
        if (Decimal.gt(player.generatorFeatures.enhancerBuyables[4], 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.generatorFeatures.genEnhBuyables[4].eff);
            addStatFactor('points', `Generator Enh. Buyable #5`, `×`, tmp.generatorFeatures.genEnhBuyables[4].eff, tmp.pointGen);
        }
        if (Decimal.gte(player.hinderanceScore[2], HINDERANCES[2].start)) {
            tmp.pointGen = tmp.pointGen.mul(HINDERANCES[2].eff);
            addStatFactor('points', `Hinderance 3 PB`, `×`, HINDERANCES[2].eff, tmp.pointGen);
        }
        if (Decimal.gt(player.transcendPointTotal, 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.transcendEffect);
            addStatFactor('points', `Transcension Points`, `×`, tmp.transcendEffect, tmp.pointGen);
        }
        if (Decimal.gt(player.transcendResetCount, 0)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.transcendResetEffect);
            addStatFactor('points', `Transcend Resets`, `×`, tmp.transcendResetEffect, tmp.pointGen);
        }
        if (player.transcendUpgrades.includes('base')) {
            tmp.pointGen = tmp.pointGen.mul(tmp.transEffs[0][0][0]);
            addStatFactor('points', `Trans. Upg. "Patience"`, `×`, tmp.transEffs[0][0][0], tmp.pointGen);
        }
        if (player.transcendUpgrades.includes('point2')) {
            tmp.pointGen = tmp.pointGen.mul(tmp.transEffs[2][0]);
            addStatFactor('points', `Trans. Upg. "Extra Synergy"`, `×`, tmp.transEffs[2][0], tmp.pointGen);
        }
        if (player.transcendUpgrades.includes('gen1')) {
            tmp.pointGen = tmp.pointGen.mul(tmp.transEffs[5][0]);
            addStatFactor('points', `Trans. Upg. "Extra Synergy II"`, `×`, tmp.transEffs[5][0], tmp.pointGen);
        }
        if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
            tmp.pointGen = tmp.pointGen.mul(tmp.replicatorEff)
            addStatFactor('points', `Replicator Effect"`, `×`, tmp.replicatorEff, tmp.pointGen);
        }

        // exp boosts
        if (hasPrestigeUpgrade(9)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.prestigeUpgEffs[9]);
            addStatFactor('points', `Prestige Upgrade 10`, `^`, tmp.prestigeUpgEffs[9], tmp.pointGen);
        }
        if (hasPrestigeUpgrade(11)) {
            let eff = tmp.prestigeUpgEffs[11];

            if (tmp.hinderances[3].depth.gt(0)) {
                eff = eff.pow(tmp.hinderances[3].effects.pts);
            }
            tmp.pointGen = tmp.pointGen.pow(eff);
            addStatFactor('points', `Prestige Upgrade 12`, `^`, eff, tmp.pointGen);
        }
        if (player.prestigeChallengeCompleted.includes(11)) {
            let eff = D(1.025);

            if (tmp.hinderances[3].depth.gt(0)) {
                eff = eff.pow(tmp.hinderances[3].effects.pts);
            }
            tmp.pointGen = tmp.pointGen.pow(eff);
            addStatFactor('points', `PC12 Reward`, `^`, eff, tmp.pointGen);
        }
        if (Decimal.gt(player.generatorFeatures.xp, 0)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.generatorFeatures.xpEffPoints);
            addStatFactor('points', `Generator XP 2nd Eff.`, `^`, tmp.generatorFeatures.xpEffPoints, tmp.pointGen);
        }
        if (player.transcendUpgrades.includes('base')) {
            tmp.pointGen = tmp.pointGen.pow(tmp.transEffs[0][0][1]);
            addStatFactor('points', `Trans. Upg. "Patience"`, `^`, tmp.transEffs[0][0][1], tmp.pointGen);
        }
        if (player.transcendUpgrades.includes('exp2')) {
            tmp.pointGen = tmp.pointGen.pow(tmp.transEffs[6][1]);
            addStatFactor('points', `Trans. Upg. "Point Enhancers"`, `^`, tmp.transEffs[6][1], tmp.pointGen);
        }
        if (player.transcendUpgrades.includes('point5')) {
            tmp.pointGen = tmp.pointGen.pow(tmp.transEffs[10][2]);
            addStatFactor('points', `Trans. Upg. "Running Out of Names"`, `^`, tmp.transEffs[10][2], tmp.pointGen);
        }

        // exp^2 boosts
        if (hasPrestigeUpgrade(15)) {
            tmp.pointGen = tmp.pointGen.add(1).log10().add(1).pow(tmp.prestigeUpgEffs[15]).sub(1).pow10().sub(1);
            addStatFactor('points', `Prestige Upgrade 16`, `(to exp.) ^`, tmp.prestigeUpgEffs[15], tmp.pointGen);
        }

        // reductions
        if (tmp.prestigeChal[11].depth.gt(0)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.prestigeChal[11].effects.root);
            addStatFactor('points', `PC12`, `^`, tmp.prestigeChal[11].effects.root, tmp.pointGen);
        }
        if (colorAmountTotal(0).gt(0)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.setbackEffects[0][0]);
            addStatFactor('points', `Setback Red Effect`, `^`, tmp.setbackEffects[0][0], tmp.pointGen);
        }
        if (tmp.hinderances[0].depth.gt(0)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.hinderances[0].effects.dartEffect);
            addStatFactor('points', `Hinderance 1`, `^`, tmp.hinderances[0].effects.dartEffect, tmp.pointGen);
        }
        if (tmp.hinderances[3].depth.gt(0)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.hinderances[3].effects.pts);
            addStatFactor('points', `Hinderance 4`, `^`, tmp.hinderances[3].effects.pts, tmp.pointGen);
        }
        if (tmp.hinderances[4].depth.gt(0)) {
            tmp.pointGen = tmp.pointGen.pow(tmp.hinderances[4].effects.resource);
            addStatFactor('points', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.pointGen);
        }

        if (player.transcendInSpecialReq === "point5") {
            let nerf = new Decimal(0)

            nerf = nerf.add(tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.genLevels), tmp.buyables[0]).max(1).log10())
            nerf = nerf.add(tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.tierLevels), tmp.buyables[0]).max(1).log10())
            nerf = nerf.pow_base(0.9).pow_base(0.25)

            tmp.pointGen = tmp.pointGen.max(1).log10().add(1).pow(nerf).sub(1).pow10();
            addStatFactor('points', `point5 restriction`, `(to exp.) ^`, nerf, tmp.pointGen);
        }

        if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
            tmp.pointGen = tmp.pointGen.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
            addStatFactor('points', `PRC2`, `(to exp.) ^`, tmp.prestigeRepeatChal[1].effects.exponent, tmp.pointGen);
        }
    }
    if (player.cheats.dilate) {
        tmp.pointGen = cheatDilateBoost(tmp.pointGen);
        addStatFactor('points', `Cheats`, `...`, null, tmp.pointGen);
    }
    tmp.pointGen = tmp.pointGen.mul(tmp.timeSpeedTiers[0])
    if (tmp.timeSpeedTiers[0].neq(1)) {
        addStatFactor('points', `Tier 1 Time Speed`, `×`, tmp.timeSpeedTiers[0], tmp.pointGen);
    }

    let old = player.points
    let oldpps = tmp.pointGen
    if (tmp.hinderances[1].depth.gt(0)) {
        player.points = Decimal.max(player.points, 0).add(1).log10().add(1).root(tmp.hinderances[1].effects.decay).sub(1).pow10().add(tmp.pointGen.mul(delta)).log10().add(1).pow(tmp.hinderances[1].effects.decay).sub(1).pow10().sub(1)
        tmp.pointGen = Decimal.sub(player.points, old).div(delta);
        addStatFactor('points', `H2`, `/`, oldpps.div(tmp.pointGen), tmp.pointGen);
    } else {
        player.points = Decimal.add(player.points, tmp.pointGen.mul(delta));
    }

    player.bestPointsInPrestige = Decimal.max(player.points, player.bestPointsInPrestige);
    if (player.prestigeChallenge === null) {
        player.bestPointsInAscend = Decimal.max(player.points, player.bestPointsInAscend);
    }
    if (player.currentHinderance === null) {
        player.bestPointsInTranscend = Decimal.max(player.points, player.bestPointsInTranscend);
    }
}

function updateHTML_main() {
    let txt = ``;
    html['mainTab'].setDisplay(tmp.tab === 0)
    if (tmp.tab === 0) {
        html['mainMainTabButton'].setDisplay(hasSetbackUpgrade(`r10`) || player.transcendUpgrades.includes('point3'));
        html['specialMainTabButton'].setDisplay(player.transcendUpgrades.includes('point3'));
        html['mainMain'].setDisplay(tmp.mainTab === 0);
        html['specialMain'].setDisplay(tmp.mainTab === 2);

        if (tmp.mainTab === 0) {
            txt = ``;
            if (tmp.prestigeChal[11].depth.gt(0)) {
                txt = `PC12 Effect: ^${format(tmp.prestigeChal[11].effects.root, 6)}, (${formatTime(player.timeSinceBuyableBought, 1)} / 10.0ms)`;
            }
            html['prestigeChallengeEffs'].setHTML(txt);
            txt = ``;
            if (tmp.hinderances[0].depth.gt(0)) {
                txt = `H1 Effect: ${format(player.darts)} darts (+${format(tmp.hinderances[0].effects.dartGain)}), ^${format(tmp.hinderances[0].effects.dartEffect, 3)}`;
            }
            html['hinderanceEffs'].setHTML(txt);

            html['upgradeScalingInterval'].setTxt(format(tmp.bybBoostInterval));
            html['upgradeScalingSpeed'].setTxt(format(tmp.bybBoostCost, 2));
            html['upgradeScalingBoost'].setTxt(format(tmp.bybBoostEffect, 2));
            html['upgradeScalingBoostExist'].setDisplay(Decimal.gt(tmp.bybBoostEffect, 1));
            html['upgradeScalingPC1'].setTxt(player.prestigeChallengeCompleted.includes(0) ? ' and generation' : '');
            html['upgradeInSetback'].setTxt(player.inSetback ? `Ascend to complete a setback or exit early in the Setback tab!` : '');
            html['upgradePC1Desc'].setDisplay(player.prestigeChallengeCompleted.includes(0));
            if (player.prestigeChallengeCompleted.includes(0)) {
                html['genEffPerMain'].setTxt(
                    player.prestigeChallenge === null
                        ? `+${format(Decimal.recip(hasPrestigeUpgrade(12) ? tmp.prestigeUpgEffs[12] : 10), 2)}×`
                        : `${format(Decimal.recip(hasPrestigeUpgrade(12) ? tmp.prestigeUpgEffs[12] : 10), 2)}×`
                );
            }

            html['tierMainDesc'].setDisplay(Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1) || player.transcendInSpecialReq === 'exp2');
            if (Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1) || player.transcendInSpecialReq === 'exp2') {
                html['tierEffPerMain'].setHTML(
                    player.transcendInSpecialReq !== 'exp2'
                        ? `slows down the cost scaling of the basic buyable by <b>/${format(tmp.tierEffectBase, 3)}</b>`
                        : `speeds up the cost scaling of the basic buyable by <b>${format(tmp.tierEffectBase, 3)}×</b>`
                );
            }

            for (let i = 0; i < player.buyables.length; i++) {
                if (buyableEnabled(i) && (i === 0 || (player.buyableInTranscension[i - 1] || Decimal.gte(player.transcendResetCount, 1)))) {
                    html[`upgrade${i}`].setDisplay(true);
                    html[`upgrade${i}all`].setDisplay(true);
                    html[`upgrade${i}generators`].setDisplay(player.prestigeChallengeCompleted.includes(0));
                    html[`upgrade${i}generatorProgressNumber`].setDisplay(player.prestigeChallengeCompleted.includes(0));
                    html[`upgrade${i}generatorTiers`].setDisplay(Decimal.gte(tmp.generatorFeatures.genEnhBuyables[2].eff, 1) || player.transcendInSpecialReq === 'exp2');
                    html[`upgrade${i}generatorTierProgressNumber`].setDisplay(Decimal.gte(tmp.generatorFeatures.genEnhBuyables[2].eff, 1) || player.transcendInSpecialReq === 'exp2');

                    if (player.prestigeChallengeCompleted.includes(0)) {
                        if (tmp.buyables[i].genLevels.gte(20)) {
                            if (tmp.buyables[i].genLevels.gte(100)) {
                                html[`upgrade${i}generatorProgressNumber`].setTxt(`Level ${format(tmp.buyables[i].genLevels)}`);
                            } else {
                                html[`upgrade${i}generatorProgressNumber`].setTxt(`${format(player.buyablePoints[i])}, Level ${format(tmp.buyables[i].genLevels)}`);
                            }
                            html[`upgrade${i}generatorProgressBar`].changeStyle('width', `${player.buyablePoints[i].div(genPointFunc(tmp.buyables[i].genLevels, false, i)).max(1).log(genPointFunc(tmp.buyables[i].genLevels.add(1), false, i).div(genPointFunc(tmp.buyables[i].genLevels, false, i))).min(1).mul(100).toNumber()}%`);
                        } else {
                            html[`upgrade${i}generatorProgressNumber`].setTxt(`${format(player.buyablePoints[i])}/${format(genPointFunc(tmp.buyables[i].genLevels.add(1), false, i))}, Level ${format(tmp.buyables[i].genLevels)}`);
                            html[`upgrade${i}generatorProgressBar`].changeStyle('width', `${Decimal.div(player.buyablePoints[i], genPointFunc(tmp.buyables[i].genLevels.add(1), false, i)).min(1).mul(100).toNumber()}%`);
                        }
                    }
                    if (Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1) || player.transcendInSpecialReq === 'exp2') {
                        if (tmp.buyables[i].tierLevels.gte(100)) {
                            html[`upgrade${i}generatorTierProgressNumber`].setTxt(`Tier ${format(tmp.buyables[i].tierLevels)}`)
                            html[`upgrade${i}generatorTierProgressBar`].changeStyle('width', `${Decimal.div(player.buyableTierPoints[i], tierPointFunc(tmp.buyables[i].tierLevels, false)).max(1).log(tierPointFunc(tmp.buyables[i].tierLevels.add(1), false).div(tierPointFunc(tmp.buyables[i].tierLevels, false))).min(1).mul(100).toNumber()}%`);
                        } else {
                            html[`upgrade${i}generatorTierProgressNumber`].setTxt(`${format(Decimal.sub(player.buyableTierPoints[i], tierPointFunc(tmp.buyables[i].tierLevels, false)).max(0), 2)}/${format(tierPointFunc(tmp.buyables[i].tierLevels.add(1), false).sub(tierPointFunc(tmp.buyables[i].tierLevels, false)), 2)}, Tier ${format(tmp.buyables[i].tierLevels)}`);
                            html[`upgrade${i}generatorTierProgressBar`].changeStyle('width', `${Decimal.sub(player.buyableTierPoints[i], tierPointFunc(tmp.buyables[i].tierLevels, false)).max(0).div(tierPointFunc(tmp.buyables[i].tierLevels.add(1), false).sub(tierPointFunc(tmp.buyables[i].tierLevels, false))).min(1).mul(100).toNumber()}%`);
                        }
                    }

                    html[`upgrade${i}amount`].setTxt(`${Decimal.gt(tmp.buyables[i].effective, 9999) ? 'B. ' : 'Buyable'} ${i + 1} ×${format(player.buyables[i])}${tmp.hinderances[0].depth.gt(0) ? (Decimal.sqrt(player.buyables[i]).eq(Decimal.sqrt(player.buyables[i]).round()) ? '=' : '≠') + format(Decimal.sqrt(player.buyables[i]).ceil().pow(2)) : ''}${tmp.buyables[i].effective.eq(player.buyables[i]) ? '' : ' (' + format(tmp.buyables[i].effective) + ')'}`);

                    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                        html[`upgrade${i}cost`].setTxt(`${format(tmp.buyables[i].cost)} Buyable ${i}`);
                    } else {
                        html[`upgrade${i}cost`].setTxt(`${format(tmp.buyables[i].cost)} points`);
                    }
                    
                    if (tmp.prestigeChal[3].depth.lte(0) || i === 0) {
                        if (tmp.prestigeChal[12].depth.gt(0)) {
                            html[`upgrade${i}eff`].setTxt(`×${format(tmp.buyables[i].effect, 2)} generator speed`);
                        } else {
                            if (player.prestigeChallengeCompleted.includes(12)) {
                                if (player.transcendUpgrades.includes('prest4') && i !== 0) {
                                    html[`upgrade${i}eff`].setTxt(`${player.prestigeChallenge === 2 ? '+' : '×'}${format(tmp.buyables[i].effect, 2)} point, gen. spd., and ${Decimal.gt(tmp.buyables[i].effective, 9999) ? 'B. ' : 'Buyable'} ${i} base`);
                                } else {
                                    html[`upgrade${i}eff`].setTxt(`${player.prestigeChallenge === 2 ? '+' : '×'}${format(tmp.buyables[i].effect, 2)} point and gen. speed`);
                                }
                            } else {
                                html[`upgrade${i}eff`].setTxt(`${player.prestigeChallenge === 2 ? '+' : '×'}${format(tmp.buyables[i].effect, 2)} point gain`);
                            }
                        }
                    } else {
                        html[`upgrade${i}eff`].setTxt(`+${format(tmp.buyables[i].effect, 2)} Buyable ${i} base`);
                    }

                    html[`upgrade${i}`].changeStyle('background-color', tmp.buyables[i].canBuy ? '#00400080' : '#40000080');
                    html[`upgrade${i}`].changeStyle('border', `3px solid ${tmp.buyables[i].canBuy ? '#00ff00' : '#ff0000'}`);
                    html[`upgrade${i}`].changeStyle('cursor', tmp.buyables[i].canBuy ? 'pointer' : 'not-allowed');

                    html[`upgrade${i}auto`].setDisplay(buyableAutobSpeed(i).gt(0))
                    if (buyableAutobSpeed(i).gt(0)) {
                        html[`upgrade${i}autoStatus`].setTxt(player.buyableAuto[i] ? 'On' : 'Off');
                        html[`upgrade${i}auto`].changeStyle('background-color', player.buyableAuto[i] ? '#00400080' : '#40000080');
                        html[`upgrade${i}auto`].changeStyle('border', `3px solid ${player.buyableAuto[i] ? '#00ff00' : '#ff0000'}`);
                    }
                } else {
                    html[`upgrade${i}`].setDisplay(false);
                    html[`upgrade${i}all`].setDisplay(false);
                }
            }
        }
        if (tmp.mainTab === 2) {
            if (player.transcendUpgrades.includes('point3')) {
                html[`spBuy1`].setDisplay(true);
                html[`spBuy1all`].setDisplay(true);

                html[`spBuy1amount`].setTxt(`${format(player.specialBuyables[0])}`);
                html[`spBuy1cost`].setTxt(`${format(MAIN_SPECIALS.special1.cost)}`);
                html[`spBuy1eff`].setTxt(`×${format(MAIN_SPECIALS.special1.effect, 2)} point gain`);

                html[`spBuy1`].changeStyle('background-color', Decimal.gte(player.points, MAIN_SPECIALS.special1.cost) ? '#00400080' : '#40000080');
                html[`spBuy1`].changeStyle('border', `3px solid ${Decimal.gte(player.points, MAIN_SPECIALS.special1.cost) ? '#00ff00' : '#ff0000'}`);
                html[`spBuy1`].changeStyle('cursor', Decimal.gte(player.points, MAIN_SPECIALS.special1.cost) ? 'pointer' : 'not-allowed');

                html[`spBuy1auto`].setDisplay(false)
                // if (false) {
                //     html[`spBuy1autoStatus`].setTxt(player.buyableAuto[i] ? 'On' : 'Off')
                //     html[`spBuy1auto`].changeStyle('background-color', player.buyableAuto[i] ? '#00400080' : '#40000080')
                //     html[`spBuy1auto`].changeStyle('border', `3px solid ${player.buyableAuto[i] ? '#00ff00' : '#ff0000'}`)
                // }
            } else {
                html[`spBuy1`].setDisplay(false);
                html[`spBuy1all`].setDisplay(false);
            }
        }
    }
}

function checkBuyableActivity() {
    for (let i = 0; i < player.buyables.length; i++) {
        tmp.basicBuyableEnabled[i] = true;
        if (tmp.prestigeChal[5].depth.gt(0) || tmp.prestigeChal[6].depth.gt(0) || tmp.prestigeChal[7].depth.gt(0) || tmp.prestigeChal[8].depth.gt(0) || tmp.prestigeChal[9].depth.gt(0)) {
            if (tmp.prestigeChal[i + 5].depth.gt(0)) {
                tmp.basicBuyableEnabled[i] = false;
            }
        }
        if (i === 4 && !player.prestigeChallengeCompleted.includes(1)) {
            tmp.basicBuyableEnabled[i] = false;
        }
        if (i === 5) {
            if (!hasSetbackUpgrade(`g10`)) {
                tmp.basicBuyableEnabled[i] = false;
            }
        }

        if (player.transcendInSpecialReq === "ascend5") {
            if (i <= 2) {
                tmp.basicBuyableEnabled[i] = false;
            }
        }

        // what's the point of this?
        tmp.basicBuyableEnabled[i] &&= true;
    }
}

function checkBuyableAutobuyers() {
    for (let i = 0; i < player.buyables.length; i++) {
        tmp.basicBuyableAutobData[i] = D(-1);
        if (i >= 0 && i <= 3) {
            tmp.basicBuyableAutobData[i] = D(Decimal.gt(player.ascendUpgrades[i + 4], 0) ? 0 : -1);
        }
        if (i === 4 && hasSetbackUpgrade(`g10`)) {
            tmp.basicBuyableAutobData[i] = D(0);
        }
        if (i === 5 && Decimal.gt(player.ascendUpgrades[15], 0)) {
            tmp.basicBuyableAutobData[i] = D(0);
        }

        if (hasTranscendMilestone(1) && i >= 0 && i <= 5) {
            tmp.basicBuyableAutobData[i] = D(0);
        }

        if (player.cheats.autobuyUnlock) {
            tmp.basicBuyableAutobData[i] = D(0);
        }

        if (tmp.basicBuyableAutobData[i].eq(0)) {
            if (i < 4) {
                tmp.basicBuyableAutobData[i] = ASCENSION_UPGRADES[i + 4].eff;
            }

            if (i === 4) {
                tmp.basicBuyableAutobData[i] = D(10)
                tmp.basicBuyableAutobData[i] = tmp.basicBuyableAutobData[i].mul(tmp.ascendBuyables[14].eff);
            }

            if (i === 5) {
                tmp.basicBuyableAutobData[i] = tmp.ascendBuyables[15].eff;
            }

            if (hasTranscendMilestone(1)) {
                tmp.basicBuyableAutobData[i] = tmp.basicBuyableAutobData[i].max(5);
            }

            tmp.basicBuyableAutobData[i] = tmp.basicBuyableAutobData[i].mul(tmp.timeSpeedTiers[0]);

            if (player.cheats.autobuyBulk) {
                tmp.basicBuyableAutobData[i] = D(Infinity);
            }
        } else {
            tmp.basicBuyableAutobData[i] = D(0)
        }
    }
}
function toggleBuyableAutobuy(i) {
    player.buyableAuto[i] = !player.buyableAuto[i]
}

function buyBuyable(i) {
    if (!tmp.buyables[i].canBuy) {
        return;
    }
    
    player.timeSinceBuyableBought = D(0)
    if (shiftDown) {
        if (!player.transcendUpgrades.includes('prest3')) {
            player.points = Decimal.sub(player.points, tmp.buyables[i].cost)
        }
        player.buyables[i] = Decimal.max(player.buyables[i], tmp.buyables[i].target.ceil())
        player.buyableAutobought[i] = Decimal.max(player.buyableAutobought[i], tmp.buyables[i].target.ceil())
    } else {
        if (tmp.hinderances[0].depth.gt(0)) {
            player.buyables[i] = Decimal.add(player.buyables[i], 1).sqrt().ceil().pow(2).round()
            if (!player.transcendUpgrades.includes('prest3')) {
                player.points = Decimal.sub(player.points, tmp.buyables[i].cost)
            }
            player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1).sqrt().ceil().pow(2).round()
        } else {
            if (!player.transcendUpgrades.includes('prest3')) {
                player.points = Decimal.sub(player.points, tmp.buyables[i].cost)
            }
            player.buyables[i] = Decimal.add(player.buyables[i], 1)
            player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1)
        }
    }
    updateGame_main()
}

function buySpecialBuyable(i) {
    switch (i) {
        case 0:
            if (Decimal.lt(player.points, MAIN_SPECIALS.special1.cost)) {
                return;
            }
            if (shiftDown) {
                player.timeSinceBuyableBought = D(0)
                player.points = Decimal.sub(player.points, MAIN_SPECIALS.special1.cost)
                player.specialBuyables[i] = Decimal.max(player.specialBuyables[i],  MAIN_SPECIALS.special1.target.ceil())
                // player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1)
            } else {
                player.timeSinceBuyableBought = D(0)
                player.points = Decimal.sub(player.points, MAIN_SPECIALS.special1.cost)
                player.specialBuyables[i] = Decimal.add(player.specialBuyables[i], 1)
                // player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1)
            }
            break
        case 1:
            if (Decimal.lt(player.points, MAIN_SPECIALS.b1_2.cost)) {
                return;
            }
            if (shiftDown) {
                player.timeSinceBuyableBought = D(0)
                player.points = Decimal.sub(player.points, MAIN_SPECIALS.b1_2.cost)
                player.specialBuyables[i] = Decimal.max(player.specialBuyables[i],  MAIN_SPECIALS.b1_2.target.ceil())
                // player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1)
            } else {
                player.timeSinceBuyableBought = D(0)
                player.points = Decimal.sub(player.points, MAIN_SPECIALS.b1_2.cost)
                player.specialBuyables[i] = Decimal.add(player.specialBuyables[i], 1)
                // player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1)
            }
            break
        default:
            throw new Error(`${i} is not a special buyable`)
    }
}

function genPointFunc(xp, inv, genID = 0) {
    let eff;
    if (inv) {
        if (tmp.prestigeChal[12].depth.gt(0)) {
            eff = Decimal.max(xp, 0).div(100).mul(0.05).add(1).log(1.05);
        } else {
            eff = inverseFact(xp);
        }
        if (player.transcendInSpecialReq === "point4") {
            eff = eff.div(1000);
        }
        if (colorAmountTotal(1).gt(0)) {
            eff = eff.div(tmp.setbackEffects[1][0]);
        }
        if (hasSetbackUpgrade('c12')) {
            eff = eff.mul(Decimal.max(tmp.buyables[genID].tierLevels, 1).log10().mul(0.02).add(1))
        }
        if (hasSetbackUpgrade('g11')) {
            eff = eff.div(SETBACK_UPGRADES[1][10].eff);
        }
        if (genID === 4 && hasSetbackUpgrade('c5')) {
            eff = eff.div(0.9667);
        }
        if (genID === 3 && hasSetbackUpgrade('c4')) {
            eff = eff.div(0.96);
        }
        if (genID === 2 && hasSetbackUpgrade('c3')) {
            eff = eff.div(0.95);
        }
        if (genID === 1 && hasSetbackUpgrade('c2')) {
            eff = eff.div(0.925);
        }
        if (genID === 0 && hasSetbackUpgrade('c1')) {
            eff = eff.div(0.9);
        }
    } else {
        eff = xp;
        if (genID === 0 && hasSetbackUpgrade('c1')) {
            eff = eff.mul(0.9);
        }
        if (genID === 1 && hasSetbackUpgrade('c2')) {
            eff = eff.mul(0.925);
        }
        if (genID === 2 && hasSetbackUpgrade('c3')) {
            eff = eff.mul(0.95);
        }
        if (genID === 3 && hasSetbackUpgrade('c4')) {
            eff = eff.mul(0.96);
        }
        if (genID === 4 && hasSetbackUpgrade('c5')) {
            eff = eff.mul(0.9667);
        }
        if (hasSetbackUpgrade('g11')) {
            eff = eff.mul(SETBACK_UPGRADES[1][10].eff);
        }
        if (hasSetbackUpgrade('c12')) {
            eff = eff.div(Decimal.max(tmp.buyables[genID].tierLevels, 1).log10().mul(0.02).add(1))
        }
        if (colorAmountTotal(1).gt(0)) {
            eff = eff.mul(tmp.setbackEffects[1][0]);
        }
        if (player.transcendInSpecialReq === "point4") {
            eff = eff.mul(1000);
        }
        if (tmp.prestigeChal[12].depth.gt(0)) {
            eff = Decimal.pow(1.05, eff).sub(1).div(0.05).mul(100);
        } else {
            eff = Decimal.factorial(eff);
        }
    }
    return eff;
}

function tierPointFunc(xp, inv) {
    let eff;
    if (inv) {
        eff = Decimal.add(xp, 1).mul(0.01).add(1).log(1.01);
    } else {
        eff = Decimal.pow(1.01, xp).sub(1).div(0.01).sub(1).max(0);
    }
    return eff;
}

function buyableEnabled(id) {
    return tmp.basicBuyableEnabled[id];
}

function buyableAutobSpeed(id) {
    return tmp.basicBuyableAutobData[id];
}