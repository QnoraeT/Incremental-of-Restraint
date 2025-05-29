"use strict";

function initHTML_stats() {
    toHTMLvar('statTab')
    toHTMLvar('statTabButton')
    toHTMLvar('buyableStatTabButton')
    toHTMLvar('factorStatTabButton')

    toHTMLvar('buyableStat')
    toHTMLvar('factorsStat')

    toHTMLvar('pointFactors')
    toHTMLvar('prestigeFactors')
    toHTMLvar('generatorFactors')
    toHTMLvar('ascendFactors')
    toHTMLvar('prestigeEssenceFactors')
    toHTMLvar('tier1timeFactors')
    toHTMLvar('transcendFactors')

    html['statTab'].setDisplay(false)
    html['buyableStat'].setDisplay(false)
    html['factorsStat'].setDisplay(false)
    toHTMLvar('statUpgradeList')
    let txt = ``
    for (let i = 0; i < player.buyables.length; i++) {
        txt += `
            <div id="statUpgrade${i}all" style="width: 175px; margin: 2px">
                <button id="statUpgrade${i}auto" class="whiteText font" style="background-color: #80808080; border: 3px solid #ffffff; height: 20px; width: 175px; font-size: 10px; margin: 2px">
                    Autobuyer Speed: <span id="statUpgrade${i}autoStatus"></span>/s
                </button>
                <button id="statUpgrade${i}" class="whiteText font" style="background-color: #80808080; border: 3px solid #ffffff; height: 70px; width: 175px; font-size: 10px; margin: 2px">
                    Effect Base: +<span id="statUpgrade${i}eff"></span><br>
                    Cost Growth: <span id="statUpgrade${i}cost"></span>.
                </button>
                <div class="flex-vertical">
                    <span id="statUpgrade${i}generatorProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
                    <span id="statUpgrade${i}generatorTierProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
                </div>
            </div>
        `
    }
    html['statUpgradeList'].setHTML(txt)
    for (let i = 0; i < player.buyables.length; i++) {
        toHTMLvar(`statUpgrade${i}all`)
        toHTMLvar(`statUpgrade${i}`)
        toHTMLvar(`statUpgrade${i}auto`)
        toHTMLvar(`statUpgrade${i}autoStatus`)
        toHTMLvar(`statUpgrade${i}eff`)
        toHTMLvar(`statUpgrade${i}cost`)
        toHTMLvar(`statUpgrade${i}generatorProgressNumber`)
        toHTMLvar(`statUpgrade${i}generatorTierProgressNumber`)
    }
}

function updateGame_stats() {

}

function updateHTML_stats() {
    html['statTab'].setDisplay(tmp.tab === -1)

    if (tmp.tab === -1) {
        html['buyableStat'].setDisplay(tmp.statTab === 0)
        html['factorsStat'].setDisplay(tmp.statTab === 1)
        if (tmp.statTab === 0) {
            for (let i = 0; i < player.buyables.length; i++) {
                if (buyableEnabled(i)) {
                    html[`statUpgrade${i}`].setDisplay(true)
                    html[`statUpgrade${i}all`].setDisplay(true)
                    html[`statUpgrade${i}generatorProgressNumber`].setDisplay(player.prestigeChallengeCompleted.includes(0))
                    html[`statUpgrade${i}generatorTierProgressNumber`].setDisplay(Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1))

                    if (player.prestigeChallengeCompleted.includes(0)) {
                        html[`statUpgrade${i}generatorProgressNumber`].setTxt(`Level ${format(tmp.buyables[i].genLevels)}, ×${format(tmp.buyables[i].genEffect, 2)}`)
                    }
                    if (Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1)) {
                        html[`statUpgrade${i}generatorTierProgressNumber`].setTxt(`Tier ${format(tmp.buyables[i].tierLevels)}, /${format(tmp.buyables[i].tierEffect, 3)}`)
                    }

                    html[`statUpgrade${i}cost`].setTxt(`${format(i+2)}× per ${format(tmp.buyables[i].costSpeed.recip().mul(10))} purchases, speed up by ${format(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostCost))}×`)
                    html[`statUpgrade${i}eff`].setTxt(`×${format(tmp.buyables[i].effectBase, 3)}`)

                    html[`statUpgrade${i}auto`].setDisplay(buyableAutoEnabledAndSpeed(i).enabled)
                    if (buyableAutoEnabledAndSpeed(i).enabled) {
                        html[`statUpgrade${i}autoStatus`].setTxt(format(buyableAutoEnabledAndSpeed(i).speed, 1))
                    }
                } else {
                    html[`statUpgrade${i}`].setDisplay(false)
                    html[`statUpgrade${i}all`].setDisplay(false)
                }
            }
        }
        if (tmp.statTab === 1) {
            let txt = `<b style="font-size: 14px">Point Gain</b>`
            for (let i = 0; i < tmp.pointFactors.length; i++) {
                txt += `<li>${tmp.pointFactors[i]}</li>`
            }
            txt += `<b style="font-size: 14px">Final: ${format(tmp.pointGen)}/s</b>`
            html['pointFactors'].setHTML(txt)

            txt = `<b style="font-size: 14px">Prestige Point Gain</b>`
            for (let i = 0; i < tmp.prestigeFactors.length; i++) {
                txt += `<li>${tmp.prestigeFactors[i]}</li>`
            }
            txt += `<b style="font-size: 14px">Final: ${format(tmp.prestigeAmount)}</b>`
            html['prestigeFactors'].setHTML(txt)

            html['generatorFactors'].setDisplay(player.prestigeChallengeCompleted.includes(0))
            if (player.prestigeChallengeCompleted.includes(0)) {
                txt = `<b style="font-size: 14px">Generator Speed</b>`
                for (let i = 0; i < tmp.generatorFactors.length; i++) {
                    txt += `<li>${tmp.generatorFactors[i]}</li>`
                }
                txt += `<b style="font-size: 14px">Final: ${format(tmp.generatorSpeed)}</b>`
                html['generatorFactors'].setHTML(txt)
            }

            html['ascendFactors'].setDisplay(Decimal.gte(player.bestPointsInAscend, tmp.ascendReq.div(1e3)) || Decimal.gt(player.ascend, 0))
            if (Decimal.gte(player.bestPointsInAscend, tmp.ascendReq.div(1e3)) || Decimal.gt(player.ascend, 0)) {
                txt = `<b style="font-size: 14px">Ascend Point Gain</b>`
                for (let i = 0; i < tmp.ascendFactors.length; i++) {
                    txt += `<li>${tmp.ascendFactors[i]}</li>`
                }
                txt += `<b style="font-size: 14px">Final: ${format(tmp.ascendAmount)}</b>`
                html['ascendFactors'].setHTML(txt)
            }

            html['prestigeEssenceFactors'].setDisplay(player.setbackUpgrades.includes('b1'))
            if (player.setbackUpgrades.includes('b1')) {
                txt = `<b style="font-size: 14px">P. Essence Gain</b>`
                for (let i = 0; i < tmp.prestigeEssenceFactors.length; i++) {
                    txt += `<li>${tmp.prestigeEssenceFactors[i]}</li>`
                }
                txt += `<b style="font-size: 14px">Final: ${format(tmp.peGain)}</b>`
                html['prestigeEssenceFactors'].setHTML(txt)
            }

            html['tier1timeFactors'].setDisplay(Decimal.gte(player.ascendUpgrades[13], 3))
            if (Decimal.gte(player.ascendUpgrades[13], 3)) {
                txt = `<b style="font-size: 14px">Tier 1 Time Speed</b>`
                for (let i = 0; i < tmp.timeFactors[0].length; i++) {
                    txt += `<li>${tmp.timeFactors[0][i]}</li>`
                }
                txt += `<b style="font-size: 14px">Final: ${format(tmp.timeSpeedTiers[0])}</b>`
                html['tier1timeFactors'].setHTML(txt)
            }

            html['transcendFactors'].setDisplay(Decimal.gte(player.transcendResetCount, 1))
            if (Decimal.gte(player.transcendResetCount, 1)) {
                txt = `<b style="font-size: 14px">Transcension Points</b>`
                for (let i = 0; i < tmp.transcendFactors.length; i++) {
                    txt += `<li>${tmp.transcendFactors[i]}</li>`
                }
                txt += `<b style="font-size: 14px">Final: ${format(tmp.transcendAmount)}</b>`
                html['transcendFactors'].setHTML(txt)
            }
        }
    }
}