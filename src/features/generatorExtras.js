"use strict";
const GEN_XP_BUYABLES = [
    {
        show: true,
        get cost() {
            let cost = D(player.generatorFeatures.buyable[0])
            cost = cost.pow_base(1.004).sub(1).div(0.004).pow_base(3)
            return cost
        },
        get target() {
            let target = D(player.generatorFeatures.xp)
            target = target.max(1).log(3).mul(0.004).add(1).log(1.004)
            return target
        },
        get eff() {
            let eff = D(2)
            eff = eff.add(tmp.generatorFeatures.genEnhBuyables[0].eff)
            eff = eff.pow(player.generatorFeatures.buyable[0])
            return eff
        },
        get desc() {
            return `Generator XP gain is increased by ×${format(tmp.generatorFeatures.genXPBuyables[0].eff)}.`
        }
    },
    {
        show: true,
        get cost() {
            let cost = D(player.generatorFeatures.buyable[1])
            cost = cost.pow_base(1.007).sub(1).div(0.007).pow_base(20).mul(250)
            return cost
        },
        get target() {
            let target = D(player.generatorFeatures.xp)
            target = target.div(250).max(1).log(20).mul(0.007).add(1).log(1.007)
            return target
        },
        get eff() {
            let eff = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                eff = eff.add(Decimal.add(player.buyablePoints[i], 1).log10())
            }
            eff = eff.add(1).log10().add(1).pow(player.generatorFeatures.buyable[1])
            return eff
        },
        get desc() {
            return `Total generators boost point gain by ×${format(tmp.generatorFeatures.genXPBuyables[1].eff, 2)}.`
        }
    },
    
]

const GEN_ENH_BUYABLES = [
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.enhancer, 0)
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[0])
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(2)
            return cost
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer)
            target = target.max(1).log(2).mul(0.02).add(1).log(1.02)
            return target
        },
        get eff() {
            let eff = D(0.2)
            eff = eff.mul(player.generatorFeatures.enhancerBuyables[0])
            return eff
        },
        get desc() {
            return `Generator Buyable 1's effect base is boosted by +${format(tmp.generatorFeatures.genEnhBuyables[0].eff, 1)}.`
        }
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.enhancer, 0)
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[1])
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(3).mul(5)
            return cost
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer)
            target = target.div(5).max(1).log(3).mul(0.02).add(1).log(1.02)
            return target
        },
        get eff() {
            let eff = Decimal.div(player.timeInAscend, 60).add(1).ln().pow_base(1e6)
            eff = eff.pow(player.generatorFeatures.enhancerBuyables[1])
            return eff
        },
        get desc() {
            return `Time since ascension boosts generators by ×${format(tmp.generatorFeatures.genEnhBuyables[1].eff, 1)}.`
        }
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.enhancer, 0)
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[2])
            cost = cost.pow10().pow10()
            return cost
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer)
            target = target.max(10).log10().log10()
            return target
        },
        get eff() {
            let eff = D(1)
            eff = eff.mul(player.generatorFeatures.enhancerBuyables[2])
            return eff
        },
        get desc() {
            return `Unlock Generator Tiers (a second bar under each buyable) that slows down buyable costs. Tier gain speeds up with more purchases.`
        }
    },
]

function initHTML_generatorExtras() {
    toHTMLvar('generatorMainTabButton')
    toHTMLvar('generatorMain')
    toHTMLvar('genXP')
    toHTMLvar('genXPGain')
    toHTMLvar('genXPSpdEff')
    toHTMLvar('genXPPtsEff')
    toHTMLvar('generatorEnhance')
    toHTMLvar('enhAmount')
    toHTMLvar('enhNext')
    toHTMLvar('genXPUpgList')
    toHTMLvar('genEnhUpgList')
    toHTMLvar('genEnhXPEff')
    toHTMLvar('genEnhance')
    toHTMLvar('genMainArea')
    toHTMLvar('genEnhArea')

    let txt = ``
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        txt += `
            <button onclick="buyGenXPBuy(${i})" id="genXPBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="genXPBuy${i}amount"></span><br>
                <span id="genXPBuy${i}eff"></span><br><br>
                <span id="genXPBuy${i}cost"></span>
            </button>
        `
    }
    html['genXPUpgList'].setHTML(txt)
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        toHTMLvar(`genXPBuy${i}`)
        toHTMLvar(`genXPBuy${i}eff`)
        toHTMLvar(`genXPBuy${i}cost`)
        toHTMLvar(`genXPBuy${i}amount`)
    }

    txt = ``
    for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
        txt += `
            <button onclick="buyGenEnhBuy(${i})" id="genEnhBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="genEnhBuy${i}amount"></span><br>
                <span id="genEnhBuy${i}eff"></span><br><br>
                <span id="genEnhBuy${i}cost"></span>
            </button>
        `
    }
    html['genEnhUpgList'].setHTML(txt)
    for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
        toHTMLvar(`genEnhBuy${i}`)
        toHTMLvar(`genEnhBuy${i}eff`)
        toHTMLvar(`genEnhBuy${i}cost`)
        toHTMLvar(`genEnhBuy${i}amount`)
    }
}

function updateGame_generatorExtras() {
    if (player.setbackUpgrades.includes(`r10`)) {
        let total = D(0)
        for (let i = 0; i < player.buyables.length; i++) {
            total = total.add(tmp.buyables[i].genLevels)
        }
        total = total.div(200)
        tmp.generatorFeatures.gain = total.mul(total.pow10())
        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(GEN_XP_BUYABLES[0].eff)
        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.generatorFeatures.enhancerEff)

        tmp.generatorFeatures.gain = cheatDilateBoost(tmp.generatorFeatures.gain)
        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.timeSpeedTiers[0])

        player.generatorFeatures.xp = Decimal.add(player.generatorFeatures.xp, tmp.generatorFeatures.gain.mul(delta))

        tmp.generatorFeatures.xpEffGenerators = player.generatorFeatures.xp.add(1).log10().mul(0.1).add(1).ln().add(1)
        tmp.generatorFeatures.xpEffPoints = player.generatorFeatures.xp.add(1).log10().add(1).log10().mul(total.max(1).log2()).mul(0.05).add(1)

        tmp.generatorFeatures.enhancerGain = Decimal.gte(player.generatorFeatures.xp, 1e33) ? Decimal.div(player.generatorFeatures.xp, 1e33).log(1e3).pow_base(2) : D(0)
        tmp.generatorFeatures.enhancerGain = cheatDilateBoost(tmp.generatorFeatures.enhancerGain).floor()

        tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerGain.add(1)
        tmp.generatorFeatures.enhancerNext = cheatDilateBoost(tmp.generatorFeatures.enhancerNext, true)
        tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.log(2).pow_base(1e3).mul(1e33)
        
        tmp.generatorFeatures.enhancerEff = Decimal.add(player.generatorFeatures.enhancer, 1).log10().div(10).add(1).ln().mul(40).pow10()

        for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
            tmp.generatorFeatures.genEnhBuyables[i].eff = GEN_ENH_BUYABLES[i].eff
            tmp.generatorFeatures.genEnhBuyables[i].cost = GEN_ENH_BUYABLES[i].cost
            tmp.generatorFeatures.genEnhBuyables[i].target = GEN_ENH_BUYABLES[i].target
        }

        for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
            tmp.generatorFeatures.genXPBuyables[i].eff = GEN_XP_BUYABLES[i].eff
            tmp.generatorFeatures.genXPBuyables[i].cost = GEN_XP_BUYABLES[i].cost
            tmp.generatorFeatures.genXPBuyables[i].target = GEN_XP_BUYABLES[i].target
        }
    }
}

function updateHTML_generatorExtras() {
    html['generatorMainTabButton'].setDisplay(player.setbackUpgrades.includes(`r10`))
    html['generatorMain'].setDisplay(tmp.mainTab === 1)

    if (tmp.mainTab === 1) {
        html['genXP'].setTxt(format(player.generatorFeatures.xp, 2))
        html['genXPGain'].setTxt(format(tmp.generatorFeatures.gain, 2))
        html['genXPSpdEff'].setTxt(format(tmp.generatorFeatures.xpEffGenerators, 3))
        html['genXPPtsEff'].setTxt(format(tmp.generatorFeatures.xpEffPoints, 3))

        html['enhAmount'].setTxt(format(tmp.generatorFeatures.enhancerGain))
        html['enhNext'].setTxt(format(tmp.generatorFeatures.enhancerNext))
        html['generatorEnhance'].changeStyle('cursor', Decimal.gt(tmp.generatorFeatures.enhancerGain, 0) ? 'pointer' : 'not-allowed')

        let canBuy
        for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
            html[`genXPBuy${i}`].setDisplay(GEN_XP_BUYABLES[i].show)
            if (GEN_XP_BUYABLES[i].show) {
                canBuy = Decimal.gte(player.generatorFeatures.xp, GEN_XP_BUYABLES[i].cost)
                html[`genXPBuy${i}eff`].setTxt(GEN_XP_BUYABLES[i].desc)
                html[`genXPBuy${i}cost`].setTxt(`Cost: ${format(GEN_XP_BUYABLES[i].cost)} generator experience`)
                html[`genXPBuy${i}amount`].setTxt(`Gen. XP Buyable #${i+1}: ×${format(player.generatorFeatures.buyable[i])}`)
    
                html[`genXPBuy${i}`].changeStyle('background-color', canBuy ? '#C0780080' : '#40280080')
                html[`genXPBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFA000' : '#805000'}`)
                html[`genXPBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed')
            }
        }

        html['genEnhArea'].setDisplay(Decimal.gt(player.generatorFeatures.enhancer, 0))

        if (Decimal.gt(player.generatorFeatures.enhancer, 0)) {
            html['genEnhance'].setTxt(format(player.generatorFeatures.enhancer))
            html['genEnhXPEff'].setTxt(format(tmp.generatorFeatures.enhancerEff, 2))
            for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
                html[`genEnhBuy${i}`].setDisplay(GEN_ENH_BUYABLES[i].show)
                if (GEN_ENH_BUYABLES[i].show) {
                    canBuy = Decimal.gte(player.generatorFeatures.enhancer, GEN_ENH_BUYABLES[i].cost)
                    html[`genEnhBuy${i}eff`].setTxt(GEN_ENH_BUYABLES[i].desc)
                    html[`genEnhBuy${i}cost`].setTxt(`Cost: ${format(GEN_ENH_BUYABLES[i].cost)} enhancers`)
                    html[`genEnhBuy${i}amount`].setTxt(`Gen. Enh. Buyable #${i+1}: ×${format(player.generatorFeatures.enhancerBuyables[i])}`)
        
                    html[`genEnhBuy${i}`].changeStyle('background-color', canBuy ? '#C0C00080' : '#40400080')
                    html[`genEnhBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FFFF00' : '#808000'}`)
                    html[`genEnhBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed')
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
    }

    player.generatorFeatures.enhancer = Decimal.add(player.generatorFeatures.enhancer, tmp.generatorFeatures.enhancerGain)

    player.generatorFeatures.xp = D(0)
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        player.generatorFeatures.buyable[i] = D(0)
    }
    tmp.generatorFeatures.gain = D(0)
    doAscendReset(true)
    updateGame_generatorExtras()
}

function buyGenXPBuy(i) {
    if (Decimal.lt(player.generatorFeatures.xp, GEN_XP_BUYABLES[i].cost)) {
        return;
    }
    player.generatorFeatures.xp = Decimal.sub(player.generatorFeatures.xp, GEN_XP_BUYABLES[i].cost)
    player.generatorFeatures.buyable[i] = Decimal.add(player.generatorFeatures.buyable[i], 1)
}

function buyGenEnhBuy(i) {
    if (Decimal.lt(player.generatorFeatures.enhancer, GEN_ENH_BUYABLES[i].cost)) {
        return;
    }
    player.generatorFeatures.enhancer = Decimal.sub(player.generatorFeatures.enhancer, GEN_ENH_BUYABLES[i].cost)
    player.generatorFeatures.enhancerBuyables[i] = Decimal.add(player.generatorFeatures.enhancerBuyables[i], 1)
}