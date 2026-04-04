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
                addStatFactor(showFactor, `SH Softcap @${format(data.start)}`, `(to exp.) ^`, data.effPow, result);
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
                addStatFactor(showFactor, `SH Softcap @${format(data.start)}`, `log(x)^${format(data.effPow, 3)}`, data.effPow, result);
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
        for (let i = 0; i < tmp.anticap.softcaps[varUsed].length; i++) {
            result = getAnticapSCValue(result, varUsed, i, inverse, showFactor);
        }
    } else {
        for (let i = tmp.anticap.softcaps[varUsed].length - 1; i >= 0; i--) {
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
                { start: D('e1200'), pow: D(1) },
                { start: D("ee5"), pow: D(1) },
                { start: D("ee7"), pow: D(1) }
            ];
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
    }
}

function initHTML_anticap() {
    toHTMLvar('anticapTransTabButton');
    toHTMLvar('AnticapTransTab');

    toHTMLvar('anticapToggle');

    toHTMLvar('anticapPower');
    toHTMLvar('anticapPowerGain');
    toHTMLvar('anticapPowerEffect');

    toHTMLvar('anticapEnergy');
    toHTMLvar('anticapEnergyExp');
    toHTMLvar('anticapEnergyEffect1');
    toHTMLvar('anticapEnergyEffect2');
    toHTMLvar('anticapEnergyEffect3');
    toHTMLvar('anticapEnergyEffect4');
    toHTMLvar('anticapEnergyEffect5');
}

function updateGame_anticap() {
    if (player.anticap.active || true) {
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

    tmp.anticap.powerGain = Decimal.gte(player.anticap.bestPoints, 1e100) ? inverseFact(Decimal.max(player.anticap.bestPoints, 1).log(1e100)).sub(1).pow_base(2).sub(1).pow10().floor() : D(0);
    tmp.anticap.powerGain = tmp.anticap.powerGain.sub(player.anticap.power);

    tmp.anticap.powerNext = tmp.anticap.powerGain.add(player.anticap.power).add(1);
    tmp.anticap.powerNext = tmp.anticap.powerNext.log10().add(1).log2().add(1).factorial().pow_base(1e100);

    tmp.anticap.energyExp = D(1);

    tmp.anticap.energyGain = Decimal.max(player.anticap.power, 0);
    let prev = Decimal.max(player.anticap.energy, 0);
    player.anticap.energy = Decimal.root(player.anticap.energy, tmp.anticap.energyExp).add(tmp.anticap.energyGain.mul(delta).mul(tmp.timeSpeedTiers[1])).pow(tmp.anticap.energyExp);
    tmp.anticap.energyGain = Decimal.sub(player.anticap.energy, prev).div(delta);

    tmp.anticap.energyEffs[0] = Decimal.gte(player.anticap.energy, 1)
        ? Decimal.max(player.anticap.energy, 10).log10().log10().mul(0.1).mul(Decimal.max(player.anticap.power, 1).log10().add(1).log10().mul(0.25).add(1)).add(1)
        : D(1);

    tmp.anticap.energyEffs[1] = Decimal.gte(player.anticap.energy, 1e3)
        ? Decimal.max(player.anticap.energy, 1e3).log10().log(3).log10().mul(0.1).mul(Decimal.max(player.anticap.power, 1e3).log10().log(3).log10().mul(0.5).add(1)).add(1).recip()
        : D(1);

    tmp.anticap.energyEffs[2] = Decimal.gte(player.anticap.energy, 1e10)
        ? Decimal.max(player.anticap.energy, 1e10).log10().log10().log10().mul(10).mul(Decimal.max(player.anticap.power, 1e10).log10().log10().log10().add(1))
        : D(0);

    tmp.anticap.energyEffs[3] = Decimal.gte(player.anticap.energy, 1e33)
        ? Decimal.max(player.anticap.energy, 1e33).log10().div(33).mul(Decimal.max(player.anticap.power, 1e33).log10().div(33))
        : D(1);

    tmp.anticap.energyEffs[4] = Decimal.gte(player.anticap.energy, 1e100)
        ? Decimal.max(player.anticap.energy, 1e100).div(1e100).root(10).pow(Decimal.max(player.anticap.power, 1e100).log(1e100).ln().add(1))
        : D(1);
}

function updateHTML_anticap() {
    html['AnticapTransTab'].setDisplay(player.transcendUpgrades.includes('anticap1'));

    if (tmp.tab === 4) {
        html['AnticapTransTab'].setDisplay(tmp.transTab === 2);

        if (tmp.transTab === 2) {
            html['anticapPower'].setTxt(format(player.anticap.power));
            html['anticapPowerGain'].setTxt(tmp.anticap.powerGain.gt(0) 
                ? tmp.anticap.powerGain.gt(100) 
                    ? `+${format(tmp.anticap.powerGain)}`
                    : `+${format(tmp.anticap.powerGain)}, next at ${format(tmp.anticap.powerNext)}`
                : `Reach ${format(tmp.anticap.powerNext)} points in Softcap Hell`);
            html['anticapPowerEffect'].setTxt(`Producing ${format(tmp.anticap.energyGain)} energy per second`);

            html['anticapEnergy'].setTxt(format(player.anticap.energy));
            html['anticapEnergyExp'].setTxt(format(tmp.anticap.energyExp, 2));
            html['anticapEnergyEffect1'].setTxt(`Boost point gain by ^${format(tmp.anticap.energyEffs[0], 3)}`);
            html['anticapEnergyEffect2'].setTxt(Decimal.gte(player.anticap.energy, 1e3)
                ? `Decrease generator and tier scaling by ^${format(tmp.anticap.energyEffs[1], 4)}`
                : `Reach 1,000 energy to unlock a new effect.`);
            html['anticapEnergyEffect3'].setTxt(Decimal.gte(player.anticap.energy, 1e10)
                ? `Add ${format(tmp.anticap.energyEffs[2], 3)} free levels to PB1-15, and enable them`
                : Decimal.gte(player.anticap.energy, 1e3)
                    ? `Reach 10.000 B energy to unlock a new effect`
                    : ``);
            html['anticapEnergyEffect4'].setTxt(Decimal.gte(player.anticap.energy, 1e33)
                ? `Weaken Gen. Enh. and Trans. Pts. effects' slowdowns by ${format(tmp.anticap.energyEffs[3], 2)}×`
                : Decimal.gte(player.anticap.energy, 1e10)
                    ? `Reach 1.000 Dc energy to unlock a new effect`
                    : ``);
            html['anticapEnergyEffect5'].setTxt(Decimal.gte(player.anticap.energy, 1e100)
                ? `Multiply T1 time speed by ${format(tmp.anticap.energyEffs[4], 2)}×`
                : Decimal.gte(player.anticap.energy, 1e33)
                    ? `Reach 1.000e100 energy to unlock a new effect`
                    : ``);

            html['anticapToggle'].changeStyle('background-color', player.anticap.active ? '#40404080' : '#20202080');
            html['anticapToggle'].changeStyle('border', '3px solid ' + (player.anticap.active ? '#ffffff' : '#404040'));
        }
    }
}
/*
    player.anticap = {
        active: false,
        savedTotalTP: null,
        savedTranscensionTimes: null,
        bestPoints: D(0),
        power: D(0),
        energy: D(0),
        buyables: [D(0), D(0), D(0), D(0), D(0)],
        upgrades: []
    }
*/
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

        doTranscendReset(true);
        player.anticap.active = true;
        return;
    } else {
        player.anticap.power = Decimal.add(player.anticap.power, tmp.anticap.powerGain);

        player.transcendPoints = player.anticap.savedTotalTP;
        player.transcendPointTotal = player.anticap.savedTotalTP;
        player.transcendResetCount = player.anticap.savedTranscensionTimes;

        player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !UNSAFE_UPGRADES.includes(value) });
        player.transcendUpgrades.push(...UNSAFE_UPGRADES);
    }

    doTranscendReset(true);
    player.anticap.active = false;
}