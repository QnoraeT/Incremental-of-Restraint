"use strict";

const GEN_ADV_UPGRADES = [
    {
        show: true,
        cost: D(1),
        desc: "Add the cyan setback, which affects generator XP and Enhancers."
    },
    {
        show: true,
        cost: D(1),
        desc: "Add a new resource called 'replicators.'"
    }
]

function initHTML_genAdvances() {
    toHTMLvar('genAdvAuto');

    toHTMLvar('genAdvArea');
    toHTMLvar('genAdvance');
    toHTMLvar('generatorAdvance');
    toHTMLvar('advAmount');
    toHTMLvar('advNext');
    toHTMLvar('genAdvEff');
    toHTMLvar('genAdvUpgList');

    let txt = ``;
    for (let i = 0; i < GEN_ADV_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyGenAdvBuy(${i})" id="genAdvBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="genAdvBuy${i}amount"></span><br>
                <span id="genAdvBuy${i}eff"></span><br><br>
                <span id="genAdvBuy${i}cost"></span>
            </button>
        `;
    }
    html['genAdvUpgList'].setHTML(txt);
    for (let i = 0; i < GEN_ADV_UPGRADES.length; i++) {
        toHTMLvar(`genAdvBuy${i}`);
        toHTMLvar(`genAdvBuy${i}eff`);
        toHTMLvar(`genAdvBuy${i}cost`);
        toHTMLvar(`genAdvBuy${i}amount`);
    }
}

function updateGame_genAdvances() {
    tmp.generatorFeatures.advanceGain = Decimal.gte(player.generatorFeatures.totalEnh, Number.MAX_VALUE) && Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) 
        ? inverseFact(Decimal.max(player.generatorFeatures.totalEnh, 1).log(Number.MAX_VALUE))
        : D(0);
    tmp.generatorFeatures.advanceGain = cheatDilateBoost(tmp.generatorFeatures.advanceGain).floor();
    tmp.generatorFeatures.advanceGain = tmp.generatorFeatures.advanceGain.sub(player.generatorFeatures.totalAdv).max(0);

    if (player.genAdvAuto) {
        player.generatorFeatures.advance = Decimal.add(player.generatorFeatures.advance, tmp.generatorFeatures.advanceGain);
        player.generatorFeatures.totalAdv = Decimal.add(player.generatorFeatures.totalAdv, tmp.generatorFeatures.advanceGain);
    }

    if (Decimal.lte(player.generatorFeatures.enhancerBuyables[5], 0)) {
        tmp.generatorFeatures.advanceNext = D(Infinity);
    } else {
        tmp.generatorFeatures.advanceNext = tmp.generatorFeatures.advanceGain.add(1).add(player.generatorFeatures.totalAdv);
        tmp.generatorFeatures.advanceNext = cheatDilateBoost(tmp.generatorFeatures.advanceNext, true);
        tmp.generatorFeatures.advanceNext = tmp.generatorFeatures.advanceNext.factorial().pow_base(Number.MAX_VALUE);
    }

    tmp.generatorFeatures.advanceEff = Decimal.gte(player.cheats.bullshit.pointExtr, 5)
        ? (player.transcendUpgrades.includes('exp3')
            ? Decimal.max(player.generatorFeatures.totalAdv, 0).mul(Decimal.max(player.generatorFeatures.enhancerBuyables[5], 1)).add(1).log10().add(1)
            : D(1))
        : (player.transcendUpgrades.includes('exp3')
            ? Decimal.max(player.generatorFeatures.totalAdv, 0).mul(Decimal.max(player.generatorFeatures.enhancerBuyables[5], 1)).add(1)
            : D(1));
}

function updateHTML_genAdvances() {
    let canBuy;
    if (tmp.mainTab === 1) {
        html['genAdvAuto'].setDisplay((Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0)) && Decimal.gte(player.cheats.bullshit.pointExtr, 5));
        if ((Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0)) && Decimal.gte(player.cheats.bullshit.pointExtr, 5)) {
            html[`genAdvAuto`].changeStyle('background-color', player.genAdvAuto ? '#00808080' : '#80000080');
            html[`genAdvAuto`].changeStyle('border', `3px solid #${player.genAdvAuto ? '00ffff' : 'ff0000'}`);
            html[`genAdvAuto`].setTxt(player.genAdvAuto ? 'Generate: All Possible' : 'Generate: Off');
        }

        html['generatorAdvance'].setDisplay(Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0));
        html['generatorAdvance'].changeStyle('cursor', Decimal.gt(tmp.generatorFeatures.advanceGain, 0) ? 'pointer' : 'not-allowed');

        html['genAdvArea'].setDisplay(Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0));
        if (Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0)) {
            html['genAdvance'].setTxt(format(player.generatorFeatures.advance));
            html['genAdvEff'].setTxt(Decimal.gte(player.cheats.bullshit.pointExtr, 5)
                ? `${format(tmp.generatorFeatures.advanceEff, 3)} to OoM`
                : format(tmp.generatorFeatures.advanceEff, 2));
            html['advAmount'].setTxt(format(tmp.generatorFeatures.advanceGain));

            let show = Decimal.lt(tmp.generatorFeatures.advanceGain, 100);
            html['advNext'].setDisplay(show);
            if (show) {
                html['advNext'].setTxt(`Next advance at ${format(tmp.generatorFeatures.advanceNext)} generator enhancers.`);
            }

            for (let i = 0; i < GEN_ADV_UPGRADES.length; i++) {
                html[`genAdvBuy${i}`].setDisplay(GEN_ADV_UPGRADES[i].show);
                if (GEN_ADV_UPGRADES[i].show) {
                    canBuy = Decimal.gte(player.generatorFeatures.advance, GEN_ADV_UPGRADES[i].cost);
                    html[`genAdvBuy${i}eff`].setTxt(GEN_ADV_UPGRADES[i].desc);
                    html[`genAdvBuy${i}cost`].setTxt(`Cost: ${format(GEN_ADV_UPGRADES[i].cost)} advances`);
                    html[`genAdvBuy${i}amount`].setTxt(`Gen. Advance #${i+1}`);

                    html[`genAdvBuy${i}`].changeStyle('background-color', player.generatorFeatures.advanceUpgsChosen.includes(i) ? '#00FFFF80' : (canBuy ? '#00C0C080' : '#00404080'));
                    html[`genAdvBuy${i}`].changeStyle('border', `3px solid ${player.generatorFeatures.advanceUpgsChosen.includes(i) ? '#80FFFF' : (canBuy ? '#00FFFF' : '#008080')}`);
                    html[`genAdvBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed');
                }
            }
        }
    }
}


function doGenAdvReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.generatorFeatures.advanceGain.lte(0)) {
            return;
        }
    }

    if (!transcendResetWOGainPrompt()) {
        return;
    }
    
    player.generatorFeatures.advance = Decimal.add(player.generatorFeatures.advance, tmp.generatorFeatures.advanceGain);
    player.generatorFeatures.totalAdv = Decimal.add(player.generatorFeatures.totalAdv, tmp.generatorFeatures.advanceGain);

    doTranscendReset(true);
}

function buyGenAdvBuy(i) {
    if (player.generatorFeatures.advanceUpgsChosen.includes(i)) {
        if (!transcendResetWOGainPrompt()) {
            return;
        }
        
        player.generatorFeatures.advanceUpgsChosen.splice(player.generatorFeatures.advanceUpgsChosen.indexOf(i), 1);
        player.generatorFeatures.advance = Decimal.add(player.generatorFeatures.advance, GEN_ADV_UPGRADES[i].cost);
    } else {
        if (Decimal.lt(player.generatorFeatures.advance, GEN_ADV_UPGRADES[i].cost)) {
            return;
        }

        if (!transcendResetWOGainPrompt()) {
            return;
        }

        player.generatorFeatures.advance = Decimal.sub(player.generatorFeatures.advance, GEN_ADV_UPGRADES[i].cost);
        player.generatorFeatures.advanceUpgsChosen.push(i);
    }
    doTranscendReset(true);
}