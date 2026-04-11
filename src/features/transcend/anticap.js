"use strict";

function getAnticapSCValue(num, varUsed, scaleNum, inverse = false, showFactor = null) {
    const data = tmp.anticap.softcaps[varUsed][scaleNum];
    if (Decimal.lt(num, data.start)) {
        return num;
    }

    let result;
    switch (scaleNum) {
        case 2:
        case 1:
        case 0:
            result = inverse
                ? Decimal.div(num, data.start).root(data.effPow).mul(data.start)
                : Decimal.div(num, data.start).pow(data.effPow).mul(data.start);
            if (!(inverse || showFactor === null)) {
                addStatFactor(showFactor, `SH Softcap @${format(data.start)}`, `^`, data.effPow, result);
            }
            return result;
        case 3:
            result = inverse
                ? Decimal.log(num, data.start).root(data.effPow).pow_base(data.start)
                : Decimal.log(num, data.start).pow(data.effPow).pow_base(data.start);
            if (!(inverse || showFactor === null)) {
                addStatFactor(showFactor, `SH Softcap @${format(data.start)}`, `▲`, data.effPow, result);
            }
            return result;
        case 4:
            // double checks for floating point because really high effPow messes with floating point (.div(BIG).add(1) loses precision)
            // even if so, a 1e-7 or lower result, results in a negligible decrease because ln(x) = 1+x for small enough x
            if (Decimal.log(num, data.start).ln().div(data.effPow).lt(1e-7)) {
                result = num;
            } else {
                result = inverse
                    ? Decimal.log(num, data.start).root(data.effPow).sub(1).mul(data.effPow).exp().pow_base(data.start)
                    : Decimal.log(num, data.start).ln().div(data.effPow).add(1).pow(data.effPow).pow_base(data.start);
            }

            if (!(inverse || showFactor === null)) {
                addStatFactor(showFactor, `SH Softcap @${format(data.start)}`, `log(x)^`, data.effPow, result);
            }
            return result;
        default:
            throw new Error(`Anticap softcap #${i+1} doesn't exist! (Valid range is #1-5)`)
    }
}

function getAnticapScalValue(num, varUsed, scaleNum, inverse = false) {
    const data = tmp.anticap.scalings[varUsed][scaleNum];
    if (Decimal.lt(num, data.start)) {
        return num;
    }

    switch (scaleNum) {
        case 2:
        case 1:
        case 0:
            return inverse
                ? Decimal.div(num, data.start).root(data.effPow).mul(data.start)
                : Decimal.div(num, data.start).pow(data.effPow).mul(data.start);
        case 3:
            return inverse
                ? Decimal.log(num, data.start).root(data.effPow).pow_base(data.start)
                : Decimal.log(num, data.start).pow(data.effPow).pow_base(data.start);
        case 4:
            // double checks for floating point because really high effPow messes with floating point (.div(BIG).add(1) loses precision)
            // even if so, a 1e-7 or lower result, results in a negligible decrease because ln(x) = 1+x for small enough x
            if (Decimal.log(num, data.start).ln().div(data.effPow).lt(1e-7)) {
                return num;
            } else {
                return inverse
                    ? Decimal.log(num, data.start).ln().div(data.effPow).add(1).pow(data.effPow).pow_base(data.start)
                    : Decimal.log(num, data.start).root(data.effPow).sub(1).mul(data.effPow).exp().pow_base(data.start);
            }
        default:
            throw new Error(`Anticap scaling #${i+1} doesn't exist! (Valid range is #1-5)`)
    }
}

function anticapSoftcap(num, varUsed, showFactor, inverse) {
    let result = D(num);

    if (inverse) {
        for (let i = tmp.anticap.softcaps[varUsed].length - 1; i >= 0; i--) {
            result = getAnticapSCValue(result, varUsed, i, inverse, showFactor);
        }
    } else {
        for (let i = 0; i < tmp.anticap.softcaps[varUsed].length; i++) {
            result = getAnticapSCValue(result, varUsed, i, inverse, showFactor);
        }
    }

    return result;
}

function anticapScaling(num, varUsed, inverse) {
    let result = D(num);

    if (inverse) {
        for (let i = 0; i < tmp.anticap.scalings[varUsed].length; i++) {
            result = getAnticapScalValue(result, varUsed, i, inverse);
        }
    } else {
        for (let i = tmp.anticap.scalings[varUsed].length - 1; i >= 0; i--) {
            result = getAnticapScalValue(result, varUsed, i, inverse);
        }
    }

    return result;
}

const ANTICAP = {
    // CASE 4  should be "logarithmic^pow", as in if arrPow[4] = 0.5, then "logarithmic^2" !
    softcapBasePow: [D(0.5), D(0.25), D(0.1), D(0.75), D(2)],
    scalingBasePow: [D(2), D(3), D(6), D(1.5), D(2)],
    softcaps: {
        points() {
            const arr = [
                { start: D(1e18), pow: D(1) },
                { start: D(Number.MAX_VALUE), pow: D(1) },
                { start: D('ee4'), pow: D(1) },
                { start: D("ee7"), pow: D(1) },
                { start: D("ee10"), pow: D(1) }
            ];
            if (tmp.anticap.upgrades[2].eff != null && player.anticap.upgrades.includes(2)) {
                arr[0].pow = arr[0].pow.div(tmp.anticap.upgrades[2].eff.sc1);
                arr[1].start = arr[1].start.mul(tmp.anticap.upgrades[2].eff.sc2);
            }
            if (tmp.anticap.upgrades[14].eff != null && player.anticap.upgrades.includes(14)) {
                arr[1].pow = arr[1].pow.div(tmp.anticap.upgrades[14].eff);
            }
            return arr;
        },
        prestigePts() {
            const arr = [
                { start: D(25), pow: D(1) },
                { start: D(400), pow: D(1) },
                { start: D(25000), pow: D(1) },
                { start: D(1e6), pow: D(1) },
                { start: D(1e12), pow: D(1) }
            ];
            if (player.anticap.upgrades.includes(6)) {
                arr[0].pow = arr[0].pow.mul(0.5);
            }
            if (tmp.anticap.upgrades[14].eff != null && player.anticap.upgrades.includes(14)) {
                arr[1].pow = arr[1].pow.div(tmp.anticap.upgrades[14].eff);
            }
            return arr;
        },
        prestigeEssence() {
            const arr = [
                { start: D(400), pow: D(1) },
                { start: D(2e5), pow: D(1) },
                { start: D(1e8), pow: D(1) },
                { start: D(1e20), pow: D(1) },
                { start: D(1e50), pow: D(1) }
            ];
            return arr;
        },
        ascendPoints() {
            const arr = [
                { start: D(1e40), pow: D(1) },
                { start: D(1e200), pow: D(1) },
                { start: D("ee3"), pow: D(1) },
                { start: D("ee5"), pow: D(1) },
                { start: D("ee7"), pow: D(1) }
            ];
            return arr;
        },
        quarkDimMult() {
            const arr = [
                { start: D(1e10), pow: D(1) },
                { start: D(1e100), pow: D(1) },
                { start: D(Number.MAX_VALUE), pow: D(1) },
                { start: D("ee5"), pow: D(1) },
                { start: D("ee7"), pow: D(1) }
            ];
            return arr;
        },
        genXP() {
            const arr = [
                { start: D(1e33), pow: D(1) },
                { start: D(1e303), pow: D(1) },
                { start: D('e2e3'), pow: D(1) },
                { start: D("ee5"), pow: D(1) },
                { start: D("ee7"), pow: D(1) }
            ];
            return arr;
        },
        genEnh() {
            const arr = [
                { start: D(1e10), pow: D(1) },
                { start: D(1e100), pow: D(1) },
                { start: D(Number.MAX_VALUE), pow: D(1) },
                { start: D("ee5"), pow: D(1) },
                { start: D("ee7"), pow: D(1) }
            ];
            return arr;
        },
        transcendPoints() {
            const arr = [
                { start: D(1e10), pow: D(1) },
                { start: D(Number.MAX_VALUE), pow: D(1) },
                { start: D("ee4"), pow: D(1) },
                { start: D("ee6"), pow: D(1) },
                { start: D("ee10"), pow: D(1) }
            ];
            return arr;
        },
        t1timeSpeed() {
            const arr = [
                { start: D(1e10), pow: D(1) },
                { start: D(1e40), pow: D(1) },
                { start: D(1e120), pow: D(1) },
                { start: D("e500"), pow: D(1) },
                { start: D("e20000"), pow: D(1) }
            ];
            return arr;
        }
    },
    scalings: {
        basicBuyables() {
            const arr = [
                { start: D(10), pow: D(1) },
                { start: D(100), pow: D(1) },
                { start: D(1000), pow: D(1) },
                { start: D(1e5), pow: D(1) },
                { start: D(1e10), pow: D(1) }
            ];
            return arr;
        },
        genLevels() {
            const arr = [
                { start: D(1000), pow: D(1) },
                { start: D(1e8), pow: D(1) },
                { start: D(1e20), pow: D(1) },
                { start: D(1e60), pow: D(1) },
                { start: D(1e200), pow: D(1) }
            ];
            return arr;
        },
        tierLevels() {
            const arr = [
                { start: D(100), pow: D(1) },
                { start: D(1000), pow: D(1) },
                { start: D(1e5), pow: D(1) },
                { start: D(1e12), pow: D(1) },
                { start: D(1e25), pow: D(1) }
            ];
            return arr;
        },
        ascendBuyables() {
            const arr = [
                { start: D(40), pow: D(1) },
                { start: D(200), pow: D(1) },
                { start: D(1000), pow: D(1) },
                { start: D(1e5), pow: D(1) },
                { start: D(1e10), pow: D(1) }
            ];
            return arr;
        },
        setbackDims() {
            const arr = [
                { start: D(40), pow: D(1) },
                { start: D(200), pow: D(1) },
                { start: D(1000), pow: D(1) },
                { start: D(1e5), pow: D(1) },
                { start: D(1e10), pow: D(1) }
            ];
            return arr;
        },
        genXPBuyables() {
            const arr = [
                { start: D(10), pow: D(1) },
                { start: D(100), pow: D(1) },
                { start: D(1000), pow: D(1) },
                { start: D(1e5), pow: D(1) },
                { start: D(1e10), pow: D(1) }
            ];
            return arr;
        },
        genEnhBuyables() {
            const arr = [
                { start: D(10), pow: D(1) },
                { start: D(100), pow: D(1) },
                { start: D(1000), pow: D(1) },
                { start: D(1e5), pow: D(1) },
                { start: D(1e10), pow: D(1) }
            ];
            return arr;
        }
    },
    buyables: [
        {
            enabled() { return true; },
            cost(bought) {
                return Decimal.pow(4, bought).mul(100);
            },
            target(resource) {
                if (Decimal.lt(resource, 100)) {
                    return D(0);
                }
                return Decimal.div(resource, 100).log(4);
            },
            eff(bought) {
                return Decimal.pow(2, bought);
            },
            desc(eff, effNext) {
                return `Doubles anticap energy gain. ×${format(eff, 1)} → ×${format(effNext, 1)}`;
            }
        },
        {
            enabled() { return true; },
            cost(bought) {
                return Decimal.pow(20, bought).mul(250);
            },
            target(resource) {
                if (Decimal.lt(resource, 250)) {
                    return D(0);
                }
                return Decimal.div(resource, 250).log(20);
            },
            eff(bought) {
                return Decimal.pow(1000, bought);
            },
            desc(eff, effNext) {
                return `Increase point gain in Softcap Hell. ×${format(eff)} → ×${format(effNext)}`;
            }
        },
        {
            enabled() { return true; },
            cost(bought) {
                return Decimal.pow(100, bought).mul(1000);
            },
            target(resource) {
                if (Decimal.lt(resource, 1000)) {
                    return D(0);
                }
                return Decimal.div(resource, 1000).log(100);
            },
            eff(bought) {
                return Decimal.mul(0.01, bought);
            },
            desc(eff, effNext) {
                return `Add to anticap energy's exponent. +${format(eff, 2)} → +${format(effNext, 2)}`;
            }
        },
        {
            enabled() { return true; },
            cost(bought) {
                return Decimal.pow(2, bought).pow10().mul(10000);
            },
            target(resource) {
                if (Decimal.lt(resource, 10000)) {
                    return D(0);
                }
                return Decimal.div(resource, 10000).log10().log2();
            },
            eff(bought) {
                return Decimal.mul(0.01, bought);
            },
            desc(eff, effNext) {
                return `Anticap energy's effects are better. +${format(eff.mul(100), 1)}% → +${format(effNext.mul(100), 1)}%`;
            }
        },
        {
            enabled() { return true; },
            cost(bought) {
                return smoothExp(bought, 1.02).pow_base(1000).mul(1e10);
            },
            target(resource) {
                if (Decimal.lt(resource, 1e10)) {
                    return D(0);
                }
                return smoothExp(Decimal.div(resource, 1e10).log(1000), 1.02, true);
            },
            eff(bought) {
                return Decimal.mul(0.01, bought);
            },
            desc(eff, effNext) {
                return `Outside any challenge, generator effect to buyables are increased. +▲${format(eff, 2)} → +▲${format(effNext, 2)}`;
            }
        }
    ],
    upgrades: [
        {
            cost: D(1e3),
            desc(eff) {
                return `Start transcensions with transcend upgrade "base" already bought.`;
            },
            eff() {
                return null;
            },
            onBought() {
                const SAFE_UPGRADES = ["base"];

                player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !SAFE_UPGRADES.includes(value) });
                player.transcendUpgrades.push(...SAFE_UPGRADES);
            }
        },
        {
            cost: D(1e6),
            desc(eff) {
                return `Ascension Buyables #9-12's basic buyable requirement is skipped and they no longer have a cap.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(3e7),
            desc(eff) {
                return `Ascension gems weaken point's 1st softcap and delay point's 2nd softcap. Currently: -${formatPerc(eff.sc1, 3)}, ${format(eff.sc2, 2)}×`;
            },
            eff() {
                return { sc1: Decimal.max(player.ascendGems, 1e10).log10().log10(), sc2: Decimal.max(player.ascendGems, 0).add(1) };
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e10),
            desc(eff) {
                return `Ascension Buyable #1 is improved. Effect is reduced, but cost scaling is drastically slowed down.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(5e11),
            desc(eff) {
                return `Start transcensions with transcend upgrades "point1", "prest1", and "ascend1" already bought.`;
            },
            eff() {
                return null;
            },
            onBought() {
                const SAFE_UPGRADES = ["point1", "prest1", "ascend1"];

                player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !SAFE_UPGRADES.includes(value) });
                player.transcendUpgrades.push(...SAFE_UPGRADES);
            }
        },
        {
            cost: D(1e13),
            desc(eff) {
                return `All transcension upgrades before and at hinderance1 no longer have an additional requirement.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e15),
            desc(eff) {
                return `The first prestige point softcap is 50% weaker. Points past e1,000,000 multiply prestige points. Currently: ${format(eff, 2)}×`;
            },
            eff() {
                return Decimal.gte(player.bestPointsInTranscend, 'ee6') ? Decimal.log(player.bestPointsInTranscend, 'ee6').log2().add(1).pow(2) : D(1);
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e17),
            desc(eff) {
                return `Ascension requires /10,000 less points. This boosts ascension point gain (by ~^1.267) and makes setbacks easier.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(2e19),
            desc(eff) {
                return `Basic Buyable automators now have instant speed. A.Buyables #5-8 and #15-16 now boost basic buyables at a reduced rate.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e21),
            desc(eff) {
                return `Total setback priorities bought increase the multiplier per setback dimension bought by +^0.01. Currently: ^${format(eff, 3)}`;
            },
            eff() {
                return player.bestSetbackPriority.reduce((accumulator, current) => { return Decimal.add(accumulator, current) }).mul(0.01).add(1);
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e24),
            desc(eff) {
                return `Prestige Fluid is no longer reset on transcension resets. Transcension Milestones 5 & 11 are automatically active.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e28),
            desc(eff) {
                return `Red-Cyan autobuyers are unlocked at min. 20/s. Keep Cyan upgrades #1-10. Trans. Milestone 15 is upgraded to (10, 10, 10, 10).`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e31),
            desc(eff) {
                return `Transcension Points' multiplier is drastically improved. (^4.00, then ▲1.25)`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e35),
            desc(eff) {
                return `Start transcensions with transcend upgrades "point2", "prest2", and "ascend2" already bought.`;
            },
            eff() {
                return null;
            },
            onBought() {
                const SAFE_UPGRADES = ["point2", "prest2", "ascend2"];

                player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !SAFE_UPGRADES.includes(value) });
                player.transcendUpgrades.push(...SAFE_UPGRADES);
            }
        },
        {
            cost: D(1e37),
            desc(eff) {
                return `Points and Prestige Points' second softcap are weaker based on transcension resets. Currently: -${formatPerc(eff, 3)}`;
            },
            eff() {
                return Decimal.max(player.transcendResetCount, 0).div(5).sqrt().add(1);
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e40),
            desc(eff) {
                return `Tier 2 Time speed is 3× faster.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e44),
            desc(eff) {
                return `[unimp.] Prestige buyable cap is increased by +10.0. Prestige Essence also affects Ascension Gem gain.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e48),
            desc(eff) {
                return `[unimp.] Transcension Points and Transcension Resets (if eligible) are automatically generated at a rate of 1% per second, using T2 time speed.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e52),
            desc(eff) {
                return `[unimp.] Prestige points boost prestige essence gain at a reduced rate. Currently: ${format(eff, 2)}×`;
            },
            eff() {
                return Decimal.max(player.prestige, 0).add(1).root(6);
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e56),
            desc(eff) {
                return `[unimp.] All trans. upgrades before and at hinderance2 no longer have a requirement. Start with 1,000 TP upon a trans. chal. reset.`;
            },
            eff() {
                return null;
            },
            onBought() {
                return null;
            }
        },
        {
            cost: D(1e60),
            desc(eff) {
                return `[unimp.] Generator Advances raise Generator Enhancer and Generator XP gain. Currently: ^${format(eff, 3)}`;
            },
            eff() {
                return Decimal.max(player.generatorFeatures.totalAdv, 0).mul(0.03).add(1);
            },
            onBought() {
                return null;
            }
        },
    ]
}

function initHTML_anticap() {
    toHTMLvar('anticapTransTabButton');
    toHTMLvar('AnticapTransTab');

    toHTMLvar('anticapToggle');

    toHTMLvar('anticapPower');
    toHTMLvar('anticapPowerGain');
    toHTMLvar('anticapPowerEffect');
    toHTMLvar('anticapPowerEffectNext');

    toHTMLvar('anticapEnergy');
    toHTMLvar('anticapEnergyExp');
    toHTMLvar('anticapEnergyEffect1');
    toHTMLvar('anticapEnergyEffect2');
    toHTMLvar('anticapEnergyEffect3');
    toHTMLvar('anticapEnergyEffect4');
    toHTMLvar('anticapEnergyEffect5');

    toHTMLvar('anticapBuyableScaling');
    toHTMLvar('anticapBuyableList');
    let txt = ``;
    for (let i = 0; i < player.anticap.buyables.length; i++) {
        txt += `
            <div id="anticapBuy${i}all" style="width: 190px; margin: 2px">
                <button onclick="buyAnticapBuy(${i})" id="anticapBuy${i}" class="whiteText font" style="height: 90px; width: 190px; font-size: 10px; margin: 2px">
                    <span id="anticapBuy${i}amount"></span><br>
                    <br>
                    <span id="anticapBuy${i}eff"></span><br>
                    Cost: <span id="anticapBuy${i}cost"></span>
                </button>
            </div>
        `;
    }
    html['anticapBuyableList'].setHTML(txt);
    for (let i = 0; i < player.anticap.buyables.length; i++) {
        toHTMLvar(`anticapBuy${i}all`);
        toHTMLvar(`anticapBuy${i}`);
        toHTMLvar(`anticapBuy${i}amount`);
        toHTMLvar(`anticapBuy${i}eff`);
        toHTMLvar(`anticapBuy${i}cost`);
    }

    toHTMLvar('anticapUpgradeList');
    txt = ``;
    for (let i = 0; i < ANTICAP.upgrades.length; i++) {
        txt += `
            <div id="anticapUpgCate${i}" class="flex-vertical" style="margin-top: -3px; margin-left: -3px; height: 100%; min-width: 215px; border: 3px dashed #80808080; justify-content: center;">
                <button id="anticapUpg${i}" onclick="buyAnticapUpg(${i})" class="whiteText font" style="margin: 4px; cursor: pointer; height: 100px; width: 200px; font-size: 10px;">
                    Anticap Upgrade #${i+1}<br>
                    <br>
                    <span id="anticapUpg${i}eff"></span><br>
                    Cost: <span id="anticapUpg${i}cost"></span>
                </button>
            </div>
        `;
    }
    html['anticapUpgradeList'].setHTML(txt);

    for (let i = 0; i < ANTICAP.upgrades.length; i++) {
        toHTMLvar(`anticapUpg${i}`);
        toHTMLvar(`anticapUpgCate${i}`);
        toHTMLvar(`anticapUpg${i}eff`);
        toHTMLvar(`anticapUpg${i}cost`);
    }
}

function updateGame_anticap() {
    // has to be here because this influences softcap/scaling behavior
    for (let i = 0; i < ANTICAP.upgrades.length; i++) {
        tmp.anticap.upgrades[i].eff = ANTICAP.upgrades[i].eff();
        tmp.anticap.upgrades[i].desc = ANTICAP.upgrades[i].desc(tmp.anticap.upgrades[i].eff);
    }

    if (player.anticap.active) {
        for (let index in ANTICAP.softcaps) {
            tmp.anticap.softcaps[index] = ANTICAP.softcaps[index]();
            for (let i = 0; i < tmp.anticap.softcaps[index].length; i++) {
                tmp.anticap.softcaps[index][i].effPow = i === 4 
                    ? tmp.anticap.softcaps[index][i].pow.recip() 
                    : ANTICAP.softcapBasePow[i].pow(tmp.anticap.softcaps[index][i].pow);
            }
        }

        for (let index in ANTICAP.scalings) {
            tmp.anticap.scalings[index] = ANTICAP.scalings[index]();
            for (let i = 0; i < tmp.anticap.scalings[index].length; i++) {
                tmp.anticap.scalings[index][i].effPow = i === 4 
                    ? tmp.anticap.scalings[index][i].pow.recip() 
                    : ANTICAP.scalingBasePow[i].pow(tmp.anticap.scalings[index][i].pow);
            }
        }
    }
}

function updateGame_anticapResources() {
    tmp.anticap.buyableScaling = D(1);
    for (let i = 0; i < ANTICAP.buyables.length; i++) {
        let cost = Decimal.floor(player.anticap.buyables[i]);
        cost = smoothExp(cost.div(tmp.anticap.buyableScaling), 1.01, false).mul(tmp.anticap.buyableScaling);
        tmp.anticap.buyables[i].cost = ANTICAP.buyables[i].cost(cost);

        let resource = D(player.anticap.energy);

        tmp.anticap.buyables[i].canBuy = Decimal.gte(resource, tmp.anticap.buyables[i].cost);

        let target = ANTICAP.buyables[i].target(resource);
        target = smoothExp(target.div(tmp.anticap.buyableScaling), 1.01, true).mul(tmp.anticap.buyableScaling);
        tmp.anticap.buyables[i].target = target;

        let eff = Decimal.floor(player.anticap.buyables[i]);
        let effPlus1 = eff.add(1);

        tmp.anticap.buyables[i].eff = ANTICAP.buyables[i].eff(ANTICAP.buyables[i].enabled() ? eff : 0);

        tmp.anticap.buyables[i].desc = ANTICAP.buyables[i].desc(tmp.anticap.buyables[i].eff, ANTICAP.buyables[i].eff(effPlus1))
    }

    tmp.anticap.powerGain = Decimal.gte(player.anticap.bestPoints, 1e100) ? inverseFact(Decimal.max(player.anticap.bestPoints, 1).log(1e100)).sub(1).pow_base(2).sub(1).pow10().floor() : D(0);
    tmp.anticap.powerGain = cheatDilateBoost(tmp.anticap.powerGain);
    tmp.anticap.powerGain = tmp.anticap.powerGain.sub(player.anticap.power).max(0);

    tmp.anticap.powerNext = tmp.anticap.powerGain.add(player.anticap.power).add(1);
    tmp.anticap.powerNext = cheatDilateBoost(tmp.anticap.powerNext, true);
    tmp.anticap.powerNext = tmp.anticap.powerNext.log10().add(1).log2().add(1).factorial().pow_base(1e100);

    tmp.anticap.energyExp = D(1);
    tmp.anticap.energyExp = tmp.anticap.energyExp.add(tmp.anticap.buyables[2].eff);

    tmp.anticap.energyGain = getAnticapEnergyGain(player.anticap.power);

    player.anticap.energy = Decimal.add(player.anticap.energy, tmp.anticap.energyGain.mul(delta));
    if (player.anticap.active) {
        tmp.anticap.energyGainNext = getAnticapEnergyGain(Decimal.add(player.anticap.power, tmp.anticap.powerGain));
    }
    
    player.anticap.bestEnergy = Decimal.max(player.anticap.bestEnergy, player.anticap.energy);

    for (let i = 0; i < tmp.anticap.energyEffs.length; i++) {
        tmp.anticap.energyEffs[i] = getAnticapEnergyEffects(i, player.anticap.power);
        if (player.anticap.active) {
            tmp.anticap.energyEffsNext[i] = getAnticapEnergyEffects(i, Decimal.add(player.anticap.power, tmp.anticap.powerGain));            
        }
    }
}

function getAnticapEnergyGain(power) {
    let gain = Decimal.max(power, 0);
    gain = gain.mul(tmp.anticap.buyables[0].eff);
    gain = cheatDilateBoost(gain);

    let prev = Decimal.max(player.anticap.energy, 0);
    let newEnergy = Decimal.root(player.anticap.energy, tmp.anticap.energyExp).add(gain.mul(delta).mul(tmp.timeSpeedTiers[1])).pow(tmp.anticap.energyExp);
    gain = Decimal.ln(newEnergy).sub(prev.ln()).eq_tolerance(0)
        ? gain.pow(tmp.anticap.energyExp)
        : Decimal.sub(newEnergy, prev).div(delta);
    return gain;
}

function getAnticapEnergyEffects(i, power) {
    let energyStrength = D(1);
    energyStrength = energyStrength.add(tmp.anticap.buyables[3].eff);

    let eff;
    switch (i) {
        case 0:
            eff = Decimal.gte(player.anticap.bestEnergy, 1)
                ? Decimal.max(player.anticap.bestEnergy, 10).log10().log10().mul(0.1).mul(Decimal.max(power, 1).log10().add(1).log10().mul(0.25).add(1)).mul(energyStrength).add(1)
                : D(1);
            break;
        case 1:
            eff = Decimal.gte(player.anticap.bestEnergy, 1e3)
                ? Decimal.max(player.anticap.bestEnergy, 1e3).log10().log(3).log10().mul(0.1).mul(Decimal.max(power, 1e3).log10().log(3).log10().mul(0.5).add(1)).mul(energyStrength).add(1).recip()
                : D(1);
            break;
        case 2:
            eff = Decimal.gte(player.anticap.bestEnergy, 1e10)
                ? Decimal.max(player.anticap.bestEnergy, 1e10).log10().log10().log10().mul(2).mul(Decimal.max(power, 1e10).log10().log10().log10().add(1)).mul(energyStrength)
                : D(0);
            break;
        case 3:
            eff = Decimal.gte(player.anticap.bestEnergy, 1e33)
                ? Decimal.max(player.anticap.bestEnergy, 1e33).log10().div(33).mul(Decimal.max(power, 1e33).log10().div(33)).sub(1).mul(10).add(1).pow(energyStrength)
                : D(1);
            break;
        case 4:
            eff = Decimal.gte(player.anticap.bestEnergy, 1e100)
                ? powLogSlowDown(Decimal.max(player.anticap.bestEnergy, 1e100).div(1e100).log10().add(1).pow(0.5), 100).sub(1).pow10().pow(Decimal.max(power, 1e100).log(1e100).ln().add(1)).pow(energyStrength)
                : D(1);
            break;
        default:
            throw new Error(`effect ${i} of anticap energy doesn't exist`)
    }
    return eff;
}

function updateHTML_anticap() {
    html['anticapTransTabButton'].setDisplay(player.transcendUpgrades.includes('anticap1'));

    if (tmp.tab === 4) {
        html['AnticapTransTab'].setDisplay(tmp.transTab === 2);

        if (tmp.transTab === 2) {
            let isGaining = player.anticap.active && Decimal.gt(tmp.anticap.powerGain, 0);

            html['anticapPower'].setTxt(format(player.anticap.power));
            html['anticapPowerGain'].setTxt(tmp.anticap.powerGain.gt(0) 
                ? tmp.anticap.powerGain.gt(100) 
                    ? `+${format(tmp.anticap.powerGain)}`
                    : `+${format(tmp.anticap.powerGain)}, next at ${format(tmp.anticap.powerNext)}`
                : `Reach ${format(tmp.anticap.powerNext)} points in Softcap Hell`);
            html['anticapPowerEffect'].setTxt(`Producing ${format(tmp.anticap.energyGain)} energy per second`);
            html['anticapPowerEffectNext'].setTxt(isGaining
                ? `Will produce ${format(tmp.anticap.energyGainNext)} energy per second`
                : '');

            html['anticapEnergy'].setTxt(format(player.anticap.energy));
            html['anticapEnergyExp'].setTxt(format(tmp.anticap.energyExp, 2));

            html['anticapEnergyEffect1'].setTxt(`Boost point gain by ^${format(tmp.anticap.energyEffs[0], 3)} ${isGaining ? '→ ^' + format(tmp.anticap.energyEffsNext[0], 3) : ''}`);

            html['anticapEnergyEffect2'].setTxt(Decimal.gte(player.anticap.energy, 1e3)
                ? `Decrease generator and tier scaling by ^${format(tmp.anticap.energyEffs[1], 4)} ${isGaining ? '→ ^' + format(tmp.anticap.energyEffsNext[1], 4) : ''}`
                : `Reach 1,000 energy to unlock a new effect.`);

            html['anticapEnergyEffect3'].setTxt(Decimal.gte(player.anticap.energy, 1e10)
                ? `Add ${format(tmp.anticap.energyEffs[2], 3)} ${isGaining ? '→ ' + format(tmp.anticap.energyEffsNext[2], 3) : ''} free levels to PB1-15, and enable them`
                : Decimal.gte(player.anticap.energy, 1e3)
                    ? `Reach 10.000 B energy to unlock a new effect`
                    : ``);

            html['anticapEnergyEffect4'].setTxt(Decimal.gte(player.anticap.energy, 1e33)
                ? `Weaken Gen. Enh. and Trans. Pts. effects' slowdowns by ${format(tmp.anticap.energyEffs[3], 2)}× ${isGaining ? '→ ' + format(tmp.anticap.energyEffsNext[3], 2) + '×' : ''}`
                : Decimal.gte(player.anticap.energy, 1e10)
                    ? `Reach 1.000 Dc energy to unlock a new effect`
                    : ``);

            html['anticapEnergyEffect5'].setTxt(Decimal.gte(player.anticap.energy, 1e100)
                ? `Multiply T1 time speed by ${format(tmp.anticap.energyEffs[4], 2)}× ${isGaining ? '→ ' + format(tmp.anticap.energyEffsNext[4], 2) + '×' : ''}`
                : Decimal.gte(player.anticap.energy, 1e33)
                    ? `Reach 1.000e100 energy to unlock a new effect`
                    : ``);

            html['anticapToggle'].changeStyle('background-color', player.anticap.active ? '#40404080' : '#20202080');
            html['anticapToggle'].changeStyle('border', '3px solid ' + (player.anticap.active ? '#ffffff' : '#404040'));

            for (let i = 0; i < ANTICAP.buyables.length; i++) {
                html[`anticapBuy${i}`].setDisplay(ANTICAP.buyables[i].enabled());
                if (ANTICAP.buyables[i].enabled()) {
                    let canBuy = tmp.anticap.buyables[i].canBuy;
                    html[`anticapBuy${i}eff`].setTxt(tmp.anticap.buyables[i].desc);
                    html[`anticapBuy${i}cost`].setTxt(`${format(tmp.anticap.buyables[i].cost)} anticap energy`);
                    html[`anticapBuy${i}amount`].setTxt(`Anticap Buyable #${i+1}: ×${format(player.anticap.buyables[i])}`);

                    html[`anticapBuy${i}`].changeStyle('background-color', canBuy ? '#40404080' : '#20202080');
                    html[`anticapBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFFFFF' : '#808080'}`);
                    html[`anticapBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
                }
            }

            for (let i = 0; i < ANTICAP.upgrades.length; i++) {
                html[`anticapUpgCate${i}`].setDisplay(i <= 2 || player.anticap.upgrades.includes(i - 3));
                if (i <= 2 || player.anticap.upgrades.includes(i - 3)) {

                    html[`anticapUpg${i}eff`].setTxt(tmp.anticap.upgrades[i].desc);
                    html[`anticapUpg${i}cost`].setTxt(`${format(ANTICAP.upgrades[i].cost)} anticap energy`);

                    html[`anticapUpg${i}`].changeStyle('background-color', player.anticap.upgrades.includes(i)
                        ? '#80808080'
                        : Decimal.gte(player.anticap.energy, ANTICAP.upgrades[i].cost) ? '#40404080' : '#20202080');
                    html[`anticapUpg${i}`].changeStyle('border', `3px solid ${player.anticap.upgrades.includes(i)
                        ? '#FFFFFF'
                        : Decimal.gte(player.anticap.energy, ANTICAP.upgrades[i].cost) ? '#C0C0C0' : '#808080'}`);
                    html[`anticapUpg${i}`].changeStyle('cursor', Decimal.gte(player.anticap.energy, ANTICAP.upgrades[i].cost) && !player.anticap.upgrades.includes(i) ? 'pointer' : 'not-allowed');
                }
            }
        }
    }
}

function toggleAnticap() {
    const UNSAFE_UPGRADES = ["base", "point1", "prest1", "ascend1", "point2", "prest2", "ascend2", "point3", "prest3", "ascend3", "hinderance1", "gen1", "exp1", "ascend4", "gen2", "exp2", "prest4", "gen3", "exp3", "point4", "hinderance2", "setback1", "enhancer1", "ascend5", "prest5", "point5", "gen4"];

    // idc if theres a TP exploit here that allows you to spam this to gain marginal amounts of TP
    if (!player.anticap.active) {
        player.anticap.savedTotalTP = player.transcendPointTotal;
        player.anticap.savedTranscensionTimes = player.transcendResetCount;

        player.transcendPoints = D(0);
        player.transcendPointTotal = D(0);
        player.transcendResetCount = D(0);
        player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !UNSAFE_UPGRADES.includes(value) });

        player.specialBuyables[0] = D(0);
        doTranscendReset(true);

        player.anticap.active = true;
        updateGame_anticap();
        return;
    } else {
        player.anticap.power = Decimal.add(player.anticap.power, tmp.anticap.powerGain);

        player.transcendPoints = player.anticap.savedTotalTP;
        player.transcendPointTotal = player.anticap.savedTotalTP;
        player.transcendResetCount = player.anticap.savedTranscensionTimes;

        player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !UNSAFE_UPGRADES.includes(value) });
        player.transcendUpgrades.push(...UNSAFE_UPGRADES);
    }

    player.specialBuyables[0] = D(0);
    doTranscendReset(true);

    player.anticap.bestPoints = D(0);
    player.anticap.active = false;
    updateGame_anticap();
}

function buyAnticapBuy(i) {
    if (!tmp.anticap.buyables[i].canBuy) {
        return;
    }
    
    if (shiftDown) {
        player.anticap.energy = Decimal.sub(player.anticap.energy, tmp.anticap.buyables[i].cost);
        player.anticap.buyables[i] = Decimal.max(player.anticap.buyables[i], tmp.anticap.buyables[i].target.floor().add(1));
    } else {
        player.anticap.energy = Decimal.sub(player.anticap.energy, tmp.anticap.buyables[i].cost);
        player.anticap.buyables[i] = Decimal.add(player.anticap.buyables[i], 1);
    }
    updateGame_anticap();
}

function buyAnticapUpg(i) {
    if (Decimal.lt(player.anticap.energy, ANTICAP.upgrades[i].cost) || player.anticap.upgrades.includes(i)) {
        return;
    }

    player.anticap.energy = Decimal.sub(player.anticap.energy, ANTICAP.upgrades[i].cost);
    player.anticap.upgrades.push(i);
    ANTICAP.upgrades[i].onBought();
}