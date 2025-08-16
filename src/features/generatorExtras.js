"use strict";
const GEN_XP_BUYABLES = [
    {
        show: true,
        get cost() {
            let scale = D(0.004)
            if (hasSetbackUpgrade('c7')) {
                scale = scale.div(2)
            }
            let cost = D(player.generatorFeatures.buyable[0])
            cost = cost.pow_base(scale.add(1)).sub(1).div(scale).pow_base(3)
            return cost.floor()
        },
        get target() {
            let scale = D(0.004)
            if (hasSetbackUpgrade('c7')) {
                scale = scale.div(2)
            }
            let target = D(player.generatorFeatures.xp).ceil()
            target = target.max(1).log(3).mul(scale).add(1).log(scale.add(1))
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
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.xp).ceil()
            target = target.div(250).max(1).log(20).mul(0.007).add(1).log(1.007)
            return target
        },
        get eff() {
            let eff = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                eff = eff.add(Decimal.max(player.buyablePoints[i], 0).add(1).log10())
            }
            eff = eff.div(1000).add(1).pow(player.generatorFeatures.buyable[1])
            return eff
        },
        get desc() {
            return `Total generator points boost point gain by ×${format(tmp.generatorFeatures.genXPBuyables[1].eff, 2)}.`
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3')
        },
        get cost() {
            let cost = D(player.generatorFeatures.buyable[2])
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(1e25).mul(1e100)
            return cost
        },
        get target() {
            let target = D(player.generatorFeatures.xp).ceil()
            target = target.div(1e100).max(1).log(1e25).mul(0.02).add(1).log(1.02)
            return target
        },
        get eff() {
            let eff = D(0.001)
            eff = eff.mul(player.generatorFeatures.buyable[2])
            return eff
        },
        get desc() {
            return `XP's effect to generator speed's multiplier is increased by +×${format(tmp.generatorFeatures.genXPBuyables[2].eff, 3)}.`
        }
    },
]

const GEN_ENH_BUYABLES = [
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.totalEnh, 0)
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[0])
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(2)
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer).ceil()
            target = target.max(1).log(2).mul(0.02).add(1).log(1.02)
            return target
        },
        get eff() {
            let eff = D(0.1)
            eff = eff.mul(player.generatorFeatures.enhancerBuyables[0])
            if (colorAmountTotal(3).gt(0)) {
                return D(0)
            }
            return eff
        },
        get desc() {
            return `Generator Buyable 1's effect base is boosted by +${format(tmp.generatorFeatures.genEnhBuyables[0].eff, 2)}.`
        }
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.totalEnh, 0)
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[1])
            cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(3).mul(5)
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer).ceil()
            target = target.div(5).max(1).log(3).mul(0.02).add(1).log(1.02)
            return target
        },
        get eff() {
            let eff = Decimal.max(player.timeInAscend, 0)
            if (hasSetbackUpgrade('c9')) {
                eff = eff.mul(2).add(30)
            }
            eff = Decimal.div(eff, 30).add(1).ln().pow_base(1e20)
            eff = eff.pow(player.generatorFeatures.enhancerBuyables[1])
            if (colorAmountTotal(3).gt(0)) {
                return D(1)
            }
            return eff
        },
        get desc() {
            return `Time since ascension boosts generators by ×${format(tmp.generatorFeatures.genEnhBuyables[1].eff, 1)}.`
        }
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.totalEnh, 0)
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[2])
            cost = cost.pow_base(2).add(1).pow10()
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer).ceil()
            target = target.max(100).log10().sub(1).log(2)
            return target
        },
        get eff() {
            let eff = D(1)
            eff = eff.mul(player.generatorFeatures.enhancerBuyables[2])
            if (colorAmountTotal(3).gt(0)) {
                return D(0)
            }
            return eff
        },
        get desc() {
            return `Unlock Tiers (like generators) that slows down buyable costs. Tier gain speeds up with more purchases.`
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3')
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[3])
            cost = cost.pow_base(1.03).sub(1).div(0.03).pow_base(3).mul(1000)
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer).ceil()
            target = target.div(1000).max(1).log(3).mul(0.03).add(1).log(1.03)
            return target
        },
        get eff() {
            let eff = D(2)
            eff = eff.pow(player.generatorFeatures.enhancerBuyables[3])
            if (colorAmountTotal(3).gt(0)) {
                return D(1)
            }
            return eff
        },
        get desc() {
            return `Enhancer gain is multiplied by ×${format(tmp.generatorFeatures.genEnhBuyables[3].eff)}.`
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3')
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[4])
            cost = cost.pow_base(1.01).sub(1).div(0.01).pow_base(1e25).mul(1e100)
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer).ceil()
            target = target.div(1e100).max(1).log(1e25).mul(0.01).add(1).log(1.01)
            return target
        },
        get eff() {
            let eff = player.buyableTierPoints.reduce((accumulator, current) => Decimal.mul(accumulator, current), player.buyableTierPoints[0])
            eff = eff.pow(player.generatorFeatures.enhancerBuyables[4])
            if (colorAmountTotal(3).gt(0)) {
                return D(1)
            }
            return eff
        },
        get desc() {
            return `Total tiers boost point gain by ×${format(tmp.generatorFeatures.genEnhBuyables[4].eff, 2)}.`
        }
    },
    {
        get show() {
            return player.transcendUpgrades.includes('exp3')
        },
        get cost() {
            let cost = D(player.generatorFeatures.enhancerBuyables[5])
            cost = cost.pow_base(3).pow_base(Number.MAX_VALUE)
            return cost.floor()
        },
        get target() {
            let target = D(player.generatorFeatures.enhancer).ceil()
            target = target.max(1).log(Number.MAX_VALUE).max(1).log(3)
            return target
        },
        get eff() {
            let eff = D(1)
            eff = eff.mul(player.generatorFeatures.enhancerBuyables[5])
            if (colorAmountTotal(3).gt(0)) {
                return D(0)
            }
            return eff
        },
        get desc() {
            return `Unlock advancements. Advancement effect increases per this buyable bought.`
        }
    },
]

const GEN_ADV = [
    {
        show: true,
        cost: D(1),
        desc: "Add the cyan setback, which affects generator XP and Enhancers."
    },
    {
        show: true,
        cost: D(1),
        desc: "Add a new resource called 'replicators.'"
    },
]

function initHTML_generatorExtras() {
    toHTMLvar('generatorMainTabButton')
    toHTMLvar('generatorMain')

    toHTMLvar('genLvTotal')
    toHTMLvar('genLvTotalBest')

    toHTMLvar('generatorEnhance')
    toHTMLvar('generatorAdvance')

    toHTMLvar('enhAmount')
    toHTMLvar('enhNext')
    toHTMLvar('advAmount')
    toHTMLvar('advNext')

    toHTMLvar('genXP')
    toHTMLvar('genXPGain')
    toHTMLvar('genEnhance')
    toHTMLvar('genAdvance')

    toHTMLvar('genXPSpdEff')
    toHTMLvar('genXPPtsEff')
    toHTMLvar('genEnhXPEff')
    toHTMLvar('genAdvEff')

    toHTMLvar('genMainArea')
    toHTMLvar('genEnhArea')
    toHTMLvar('genAdvArea')

    toHTMLvar('genXPAuto')
    toHTMLvar('genEnhGenerate')
    toHTMLvar('genEnhAuto')

    toHTMLvar('genXPUpgList')
    toHTMLvar('genEnhUpgList')
    toHTMLvar('genAdvUpgList')

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

    txt = ``
    for (let i = 0; i < GEN_ADV.length; i++) {
        txt += `
            <button onclick="buyGenAdvBuy(${i})" id="genAdvBuy${i}" class="whiteText font" style="height: 85px; width: 170px; font-size: 9px; margin: 2px">
                <span id="genAdvBuy${i}amount"></span><br>
                <span id="genAdvBuy${i}eff"></span><br><br>
                <span id="genAdvBuy${i}cost"></span>
            </button>
        `
    }
    html['genAdvUpgList'].setHTML(txt)
    for (let i = 0; i < GEN_ADV.length; i++) {
        toHTMLvar(`genAdvBuy${i}`)
        toHTMLvar(`genAdvBuy${i}eff`)
        toHTMLvar(`genAdvBuy${i}cost`)
        toHTMLvar(`genAdvBuy${i}amount`)
    }
}

function updateGame_generatorExtras() {
    if (hasSetbackUpgrade(`r10`)) {
        tmp.generatorFeatures.advanceGain = Decimal.gte(player.generatorFeatures.totalEnh, Number.MAX_VALUE) && Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) ? Decimal.max(player.generatorFeatures.totalEnh, 1).log(Number.MAX_VALUE) : D(0)
        tmp.generatorFeatures.advanceGain = cheatDilateBoost(tmp.generatorFeatures.advanceGain).floor()
        tmp.generatorFeatures.advanceGain = tmp.generatorFeatures.advanceGain.sub(player.generatorFeatures.totalAdv).max(0)

        if (Decimal.lte(player.generatorFeatures.enhancerBuyables[5], 0)) {
            tmp.generatorFeatures.advanceNext = D(Infinity)
        } else {
            tmp.generatorFeatures.advanceNext = tmp.generatorFeatures.advanceGain.add(1).add(player.generatorFeatures.totalAdv)
            tmp.generatorFeatures.advanceNext = cheatDilateBoost(tmp.generatorFeatures.advanceNext, true)
            tmp.generatorFeatures.advanceNext = tmp.generatorFeatures.advanceNext.pow_base(Number.MAX_VALUE)
        }

        tmp.generatorFeatures.advanceEff = Decimal.max(player.generatorFeatures.totalAdv, 0).add(1).log10().mul(Decimal.max(player.generatorFeatures.enhancerBuyables[5], 1)).add(1)

        for (let i = 0; i < GEN_ENH_BUYABLES.length; i++) {
            tmp.generatorFeatures.genEnhBuyables[i].cost = GEN_ENH_BUYABLES[i].cost
            tmp.generatorFeatures.genEnhBuyables[i].target = GEN_ENH_BUYABLES[i].target

            if (player.genEnhAuto && GEN_ENH_BUYABLES[i].show) {
                let bought = player.generatorFeatures.enhancerBuyables[i]
                player.generatorFeatures.enhancerBuyables[i] = Decimal.add(tmp.generatorFeatures.genEnhBuyables[i].target, 0.99999999).max(player.generatorFeatures.enhancerBuyables[i]).floor()
                if (Decimal.gt(player.generatorFeatures.enhancerBuyables[i], bought)) {
                    player.generatorFeatures.enhancer = Decimal.sub(player.generatorFeatures.enhancer, tmp.generatorFeatures.genEnhBuyables[i].cost).max(0) // idk why this is causing ascendGems to go negative so i put a max 0 here
                }
            }

            tmp.generatorFeatures.genEnhBuyables[i].eff = GEN_ENH_BUYABLES[i].eff
        }

        tmp.generatorFeatures.enhancerGain = Decimal.gte(player.generatorFeatures.xp, 1e33) && colorAmountTotal(3).lte(0) ? Decimal.div(player.generatorFeatures.xp, 1e33).pow(0.02) : D(0)
        tmp.generatorFeatures.enhancerGain = tmp.generatorFeatures.enhancerGain.mul(tmp.generatorFeatures.genEnhBuyables[3].eff)
        tmp.generatorFeatures.enhancerGain = cheatDilateBoost(tmp.generatorFeatures.enhancerGain).floor()

        if (colorAmountTotal(3).gt(0)) {
            tmp.generatorFeatures.enhancerNext = D(Infinity)
        } else {
            tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerGain.add(1)
            tmp.generatorFeatures.enhancerNext = cheatDilateBoost(tmp.generatorFeatures.enhancerNext, true)
            tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.div(tmp.generatorFeatures.genEnhBuyables[3].eff)
            tmp.generatorFeatures.enhancerNext = tmp.generatorFeatures.enhancerNext.root(0.02).mul(1e33)
        }

        if (player.genEnhGenerate && player.transcendInSpecialReq !== "prest4") {
            player.generatorFeatures.enhancer = Decimal.add(player.generatorFeatures.enhancer, tmp.generatorFeatures.enhancerGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[0]))
            player.generatorFeatures.totalEnh = Decimal.add(player.generatorFeatures.totalEnh, tmp.generatorFeatures.enhancerGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[0]))
        }

        tmp.generatorFeatures.enhancerEff = Decimal.add(player.generatorFeatures.totalEnh, 1).log10().div(10).add(1).ln().mul(50).pow10()
        if (colorAmountTotal(3).gt(0)) {
            tmp.generatorFeatures.enhancerEff = D(1)
        }

        for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
            tmp.generatorFeatures.genXPBuyables[i].cost = GEN_XP_BUYABLES[i].cost
            tmp.generatorFeatures.genXPBuyables[i].target = GEN_XP_BUYABLES[i].target

            if (player.genXPAuto && GEN_XP_BUYABLES[i].show) {
                let bought = player.generatorFeatures.buyable[i]
                player.generatorFeatures.buyable[i] = Decimal.add(tmp.generatorFeatures.genXPBuyables[i].target, 0.99999999).max(player.generatorFeatures.buyable[i]).floor()
                if (Decimal.gt(player.generatorFeatures.buyable[i], bought)) {
                    player.generatorFeatures.xp = Decimal.sub(player.generatorFeatures.xp, tmp.generatorFeatures.genXPBuyables[i].cost).max(0) // idk why this is causing ascendGems to go negative so i put a max 0 here
                }
            }

            tmp.generatorFeatures.genXPBuyables[i].eff = GEN_XP_BUYABLES[i].eff
        }

        let total = D(0)
        if (hasTranscendMilestone(13)) {
            total = D(player.bestTotalGenLvs)
        } else {
            total = tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.genLevels), tmp.buyables[0])
        }
        total = total.div(200)
        let totalGain = total
        if (player.transcendUpgrades.includes('exp1')) {
            totalGain = totalGain.mul(4/3)
        }
        if (player.inSetback) {
            totalGain = totalGain.div(tmp.setbackEffects[3][0])
        }
        tmp.generatorFeatures.gain = totalGain.mul(totalGain.pow10()).div(1e6)
        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(GEN_XP_BUYABLES[0].eff)
        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.generatorFeatures.enhancerEff)
        if (!player.inSetback) {
            tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.energyEffs[3])
        }

        tmp.generatorFeatures.gain = cheatDilateBoost(tmp.generatorFeatures.gain)
        tmp.generatorFeatures.gain = tmp.generatorFeatures.gain.mul(tmp.timeSpeedTiers[0])

        player.generatorFeatures.xp = Decimal.add(player.generatorFeatures.xp, tmp.generatorFeatures.gain.mul(delta))
        // console.log(`${format(tmp.generatorFeatures.gain)} -- ${format(player.bestTotalGenLvs)}`)
        tmp.generatorFeatures.xpEffGenerators = D(0.05)
        tmp.generatorFeatures.xpEffGenerators = tmp.generatorFeatures.xpEffGenerators.add(tmp.generatorFeatures.genXPBuyables[2].eff)
        tmp.generatorFeatures.xpEffGenerators = player.generatorFeatures.xp.add(1).log10().mul(tmp.generatorFeatures.xpEffGenerators).add(1).ln().add(1)

        if (hasSetbackUpgrade('c8') && player.prestigeChallenge === null && !player.inSetback && player.currentHinderance === null && player.transcendInSpecialReq === null) {
            tmp.generatorFeatures.xpEffPoints = D(0.055)
        } else {
            tmp.generatorFeatures.xpEffPoints = D(0.05)
        }
        tmp.generatorFeatures.xpEffPoints = player.generatorFeatures.xp.add(1).log10().add(1).log10().mul(total.max(1).log2()).mul(tmp.generatorFeatures.xpEffPoints).add(1)
        if (player.currentHinderance === 3) {
            tmp.generatorFeatures.xpEffPoints = tmp.generatorFeatures.xpEffPoints.pow(0.2)
        }
    }
}

function updateHTML_generatorExtras() {
    html['generatorMainTabButton'].setDisplay(hasSetbackUpgrade(`r10`))
    html['generatorMain'].setDisplay(tmp.mainTab === 1)

    if (tmp.mainTab === 1) {
        html['genXPAuto'].setDisplay(hasTranscendMilestone(10))
        if (hasTranscendMilestone(10)) {
            html[`genXPAuto`].changeStyle('background-color', player.genXPAuto ? '#80400080' : '#80000080')
            html[`genXPAuto`].changeStyle('border', `3px solid #${player.genXPAuto ? 'ff8000' : 'ff0000'}`)
            html[`genXPAuto`].setTxt(player.genXPAuto ? 'Auto: Infinity/s' : 'Auto: Off')
        }
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
            html[`genEnhAuto`].setTxt(player.genEnhAuto ? 'Auto: Infinity/s' : 'Auto: Off')
        }

        html['genXP'].setTxt(format(player.generatorFeatures.xp, 2))
        html['genXPGain'].setTxt(format(tmp.generatorFeatures.gain, 2))
        html['genXPSpdEff'].setTxt(format(tmp.generatorFeatures.xpEffGenerators, 3))
        html['genXPPtsEff'].setTxt(format(tmp.generatorFeatures.xpEffPoints, 3))
        html['genLvTotal'].setTxt(format(tmp.buyables.reduce((accumulator, current) => Decimal.add(accumulator, current.genLevels), tmp.buyables[0])))
        html['genLvTotalBest'].setTxt(format(player.bestTotalGenLvs))

        html['enhAmount'].setTxt(format(tmp.generatorFeatures.enhancerGain))
        html['enhNext'].setTxt(format(tmp.generatorFeatures.enhancerNext))
        html['generatorEnhance'].changeStyle('cursor', Decimal.gt(tmp.generatorFeatures.enhancerGain, 0) ? 'pointer' : 'not-allowed')
        html['generatorAdvance'].setDisplay(Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0))
        html['generatorAdvance'].changeStyle('cursor', Decimal.gt(tmp.generatorFeatures.advanceGain, 0) ? 'pointer' : 'not-allowed')

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

        html['genEnhArea'].setDisplay(Decimal.gt(player.generatorFeatures.totalEnh, 0) && colorAmountTotal(3).lte(0))
        if (Decimal.gt(player.generatorFeatures.totalEnh, 0) && colorAmountTotal(3).lte(0)) {
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

        html['genAdvArea'].setDisplay(Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0))
        if (Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0) || Decimal.gt(player.generatorFeatures.totalAdv, 0)) {
            html['genAdvance'].setTxt(format(player.generatorFeatures.advance))
            html['genAdvEff'].setTxt(format(tmp.generatorFeatures.advanceEff, 2))
            html['advAmount'].setTxt(format(tmp.generatorFeatures.advanceGain))
            html['advNext'].setTxt(format(tmp.generatorFeatures.advanceNext))
            for (let i = 0; i < GEN_ADV.length; i++) {
                html[`genAdvBuy${i}`].setDisplay(GEN_ADV[i].show)
                if (GEN_ADV[i].show) {
                    canBuy = Decimal.gte(player.generatorFeatures.advance, GEN_ADV[i].cost)
                    html[`genAdvBuy${i}eff`].setTxt(GEN_ADV[i].desc)
                    html[`genAdvBuy${i}cost`].setTxt(`Cost: ${format(GEN_ADV[i].cost)} advances`)
                    html[`genAdvBuy${i}amount`].setTxt(`Gen. Advance #${i+1}`)

                    html[`genAdvBuy${i}`].changeStyle('background-color', player.generatorFeatures.advanceUpgsChosen.includes(i) ? '#00FFFF80' : (canBuy ? '#00C0C080' : '#00404080'))
                    html[`genAdvBuy${i}`].changeStyle('border', `3px solid ${player.generatorFeatures.advanceUpgsChosen.includes(i) ? '#80FFFF' : (canBuy ? '#00FFFF' : '#008080')}`)
                    html[`genAdvBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed')
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
    player.generatorFeatures.totalEnh = Decimal.add(player.generatorFeatures.totalEnh, tmp.generatorFeatures.enhancerGain)

    player.generatorFeatures.xp = D(0)
    for (let i = 0; i < GEN_XP_BUYABLES.length; i++) {
        player.generatorFeatures.buyable[i] = D(0)
    }
    tmp.generatorFeatures.gain = D(0)
    if (!hasTranscendMilestone(2)) {
        doAscendReset(true)
    }
    updateGame_generatorExtras()
}

function doGenAdvReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.generatorFeatures.advanceGain.lte(0)) {
            return;
        }
    }

    player.generatorFeatures.advance = Decimal.add(player.generatorFeatures.advance, tmp.generatorFeatures.advanceGain)
    player.generatorFeatures.totalAdv = Decimal.add(player.generatorFeatures.totalAdv, tmp.generatorFeatures.advanceGain)

    doTranscendReset(true)
}

function buyGenXPBuy(i) {
    if (Decimal.lt(player.generatorFeatures.xp, GEN_XP_BUYABLES[i].cost)) {
        return;
    }
    player.generatorFeatures.xp = Decimal.sub(player.generatorFeatures.xp, GEN_XP_BUYABLES[i].cost)
    if (shiftDown) {
        player.generatorFeatures.buyable[i] = Decimal.max(player.generatorFeatures.buyable[i], tmp.generatorFeatures.genXPBuyables[i].target.ceil())
    } else {
        player.generatorFeatures.buyable[i] = Decimal.add(player.generatorFeatures.buyable[i], 1)
    }
}

function buyGenEnhBuy(i) {
    if (Decimal.lt(player.generatorFeatures.enhancer, GEN_ENH_BUYABLES[i].cost)) {
        return;
    }
    player.generatorFeatures.enhancer = Decimal.sub(player.generatorFeatures.enhancer, GEN_ENH_BUYABLES[i].cost)
    if (shiftDown) {
        player.generatorFeatures.enhancerBuyables[i] = Decimal.max(player.generatorFeatures.enhancerBuyables[i], tmp.generatorFeatures.genEnhBuyables[i].target.ceil())
    } else {
        player.generatorFeatures.enhancerBuyables[i] = Decimal.add(player.generatorFeatures.enhancerBuyables[i], 1)
    }
}

function buyGenAdvBuy(i) {
    if (player.generatorFeatures.advanceUpgsChosen.includes(i)) {
        player.generatorFeatures.advanceUpgsChosen.splice(player.generatorFeatures.advanceUpgsChosen.indexOf(i), 1)
        player.generatorFeatures.advance = Decimal.add(player.generatorFeatures.advance, GEN_ADV[i].cost)
    } else {
        if (Decimal.lt(player.generatorFeatures.advance, GEN_ADV[i].cost)) {
            return;
        }

        player.generatorFeatures.advance = Decimal.sub(player.generatorFeatures.advance, GEN_ADV[i].cost)
        player.generatorFeatures.advanceUpgsChosen.push(i)
    }
    doTranscendReset(true)
}