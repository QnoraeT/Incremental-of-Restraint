"use strict";
const PRESTIGE_FLUID = {
    gain(essence) {
        return Decimal.max(essence, 1).log10().div(10).sub(2).max(0);
    },
    next(fluid) {
        return Decimal.add(fluid, 1).add(2).mul(10).pow10();
    },
    effect(fluid) {
        return Decimal.max(fluid, 0).add(1);
    },
    costArr: [
        D(1),   D(1),   D(1),
        D(1),   D(1),   D(1),
        D(1),   D(1),   D(1),
        D(2),   D(2),   D(2), 
        D(4),   D(12),  D(1), 
        D(20),  D(20),  D(20)
    ],
    buyEff(bought) {
        return Decimal.max(bought, 0).mul(0.1).add(1);
    },
    buyCost(i, bought) {
        if (Decimal.lt(bought, 0)) {
            return D(0);
        }
        return this.costArr[i].mul(Decimal.pow(2, bought).sub(1).pow10());
    },
    buyTarget(i, resource) {
        if (Decimal.lt(resource, this.costArr[i])) {
            return D(0);
        }
        return Decimal.log2(resource).add(1).log10().div(this.costArr[i]);
    }
}

function initHTML_prestigeFluid() {
    toHTMLvar('prestigeFluidTab');
    toHTMLvar('prestigeFluidTabButton');

    toHTMLvar('prestigeFluidAmount');
    toHTMLvar('prestigeFluidNext');

    toHTMLvar('prestigeFluidDisp');
    toHTMLvar('prestigeFluid');
    toHTMLvar('prestigeFluidEffect');
    toHTMLvar('prestigeFluidEffectNext');
    toHTMLvar('prestigeFluidUpgList');
    
    let txt = ``;
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        txt += `
            <button onclick="buyPrestigeFluidUpg(${i})" id="prestigeFluidUpg${i}" class="whiteText font" style="height: 80px; width: 190px; font-size: 9px; margin: 2px">
                <b><span id="prestigeFluidUpg${i}amount"></span></b><br><br>
                <span id="prestigeFluidUpg${i}eff"></span><br>
                <span id="prestigeFluidUpg${i}cost"></span>
            </button>
        `;
    }
    html['prestigeFluidUpgList'].setHTML(txt);
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        toHTMLvar(`prestigeFluidUpg${i}`);
        toHTMLvar(`prestigeFluidUpg${i}amount`);
        toHTMLvar(`prestigeFluidUpg${i}eff`);
        toHTMLvar(`prestigeFluidUpg${i}cost`);
    }
}

function updateGame_prestigeFluid() {
    // i have to do three stages here due to cost -> used -> target stuff, but overall shouldn't be that much of a hassle
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        tmp.pfUpgData[i].cost = PRESTIGE_FLUID.buyCost(i, player.prestigeFluidUpgs[i]);
        tmp.pfUpgData[i].priorCost = PRESTIGE_FLUID.buyCost(i, Decimal.sub(player.prestigeFluidUpgs[i], 1));
        tmp.pfUpgData[i].effect = PRESTIGE_FLUID.buyEff(player.prestigeFluidUpgs[i]);
        tmp.pfUpgData[i].effectNext = PRESTIGE_FLUID.buyEff(Decimal.add(player.prestigeFluidUpgs[i], 1));
    }

    tmp.pfUsed = D(0);
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        tmp.pfUsed = tmp.pfUsed.add(tmp.pfUpgData[i].priorCost);
    }

    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        let resource;
        if (tmp.hinderances[4].depth.gt(0) && i != 0) {
            resource = player.prestigeFluidUpgs[i - 1];
        } else {
            resource = Decimal.sub(player.prestigeFluid, tmp.pfUsed);
        }
        tmp.pfUpgData[i].canBuy = Decimal.gte(resource, tmp.pfUpgData[i].cost);
        tmp.pfUpgData[i].target = PRESTIGE_FLUID.buyTarget(i, resource);
    }

    tmp.pfGain = PRESTIGE_FLUID.gain(player.prestigeEssence).sub(player.prestigeFluid).floor().max(0);
    tmp.pfNext = PRESTIGE_FLUID.next(Decimal.add(player.prestigeFluid, tmp.pfGain));

    tmp.pfEffect = PRESTIGE_FLUID.effect(player.prestigeFluid);
    tmp.pfEffectNext = PRESTIGE_FLUID.effect(Decimal.add(player.prestigeFluid, tmp.pfGain));
}

function updateHTML_prestigeFluid() {
    if (tmp.tab === 0 && tmp.mainTab === 0) {
        if (player.prestigeChallenge === null) {
            html['prestigeFluidAmount'].setDisplay(hasSetbackUpgrade(`b6`));
            html['prestigeFluidNext'].setDisplay(hasSetbackUpgrade(`b6`) && Decimal.lt(tmp.pfGain, 100));
            if (hasSetbackUpgrade(`b6`)) {
                html['prestigeFluidAmount'].setTxt(`, and ${format(tmp.pfGain)} prestige fluid`);
                html['prestigeFluidNext'].setTxt(`Next fluid at ${format(tmp.pfNext)} PE.`);
            }
        }
    }

    if (tmp.tab === 1) {
        html['prestigeFluidTab'].setDisplay(tmp.prestigeTab === 2);
        html['prestigeFluidTabButton'].setDisplay(hasSetbackUpgrade('b6'));

        html['prestigeFluidDisp'].setDisplay(hasSetbackUpgrade(`b6`));
        if (hasSetbackUpgrade(`b6`)) {
            html['prestigeFluid'].setTxt(format(Decimal.sub(player.prestigeFluid, tmp.pfUsed)));
            html['prestigeFluidEffect'].setTxt(`Boosting prestige essence effect by ^${format(tmp.pfEffect, 2)}`);

            html['prestigeFluidEffectNext'].setTxt(`×${format(tmp.pfEffectNext.div(tmp.pfEffect), 2)} upon next reset`);
        }

        if (tmp.prestigeTab === 2) {
            for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
                let show = true;
                if (i >= 9 && i <= 11) {
                    show = Decimal.gt(player.ascendUpgrades[12], 0);
                }
                if (i >= 12 && i <= 14) {
                    show = Decimal.gt(player.ascendUpgrades[12], 1);
                }
                if (i >= 15 && i <= 17) {
                    show = Decimal.gt(player.ascendUpgrades[12], 2);
                }
                html[`prestigeFluidUpg${i}`].setDisplay(show);
                if (show) {
                    html[`prestigeFluidUpg${i}eff`].setTxt(`Raising PB${i+1}'s effect to the ^${format(tmp.pfUpgData[i].effect, 2)} → ^${format(tmp.pfUpgData[i].effectNext, 2)}.`);
                    html[`prestigeFluidUpg${i}cost`].setTxt(tmp.hinderances[4].depth.gt(0) && i != 0
                                ? `Cost: ${format(tmp.pfUpgData[i].cost)} PFB${i}`
                                : `Cost: ${format(tmp.pfUpgData[i].cost)} prestige fluid`);

                    html[`prestigeFluidUpg${i}amount`].setTxt(`PFB${i+1}: ×${format(player.prestigeFluidUpgs[i])}`);

                    html[`prestigeFluidUpg${i}`].changeStyle('background-color',
                            (tmp.pfUpgData[i].canBuy
                                ? '#10208080'
                                : '#20104080'));
                    html[`prestigeFluidUpg${i}`].changeStyle('border', `3px solid ${
                            (tmp.pfUpgData[i].canBuy
                                ? '#2040ff'
                                : '#402080')}`);
                    html[`prestigeFluidUpg${i}`].changeStyle('cursor', tmp.pfUpgData[i].canBuy
                            ? 'pointer'
                            : 'not-allowed');
                }
            }
        }
    }
}

function buyPrestigeFluidUpg(i) {
    if (!tmp.pfUpgData[i].canBuy) {
        return;
    }

    let resource;
    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
        resource = player.prestigeFluidUpgs[i - 1];
    } else {
        resource = player.prestigeFluid;
    }
    if (shiftDown) {
        player.prestigeFluidUpgs[i] = tmp.pfUpgData[i].target.max(player.prestigeFluidUpgs[i]).ceil();
    } else {
        player.prestigeFluidUpgs[i] = Decimal.add(player.prestigeFluidUpgs[i], 1);
    }
}

function respecPrestigeFluidUpgs() {
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        player.prestigeFluidUpgs[i] = D(0);
    }
    doPrestigeReset(true);
}