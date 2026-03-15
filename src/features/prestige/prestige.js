"use strict";
const PRESTIGE_UPGRADES = [
    {
        cost: D(1),
        get desc() {
            return `Point gain is boosted. Currently: ×${format(tmp.prestigeUpgEffs[0], 2)}`
        },
        get eff() {
            let eff = D(2)
            if (hasPrestigeUpgrade(13)) {
                eff = eff.pow(PRESTIGE_UPGRADES[13].eff);
            }
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[0], 1))
            return eff
        }
    },
    {
        cost: D(1),
        get desc() {
            return `Point gain is boosted based off of points. Currently: ×${format(tmp.prestigeUpgEffs[1], 2)}`
        },
        get eff() {
            let eff = Decimal.max(player.bestPointsInPrestige, 1).log10().div(5).add(1)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[1], 1))
            return eff
        }
    },
    {
        cost: D(1),
        get desc() {
            return `Point gain is boosted based off of total prestige points. Currently: ×${format(tmp.prestigeUpgEffs[2], 2)}`
        },
        get eff() {
            let eff = Decimal.max(player.prestige, 0).div(2).add(1)
            let bought
            if (hasSetbackUpgrade('b4')) {
                bought = Decimal.max(player.prestigeUpgrades[2], 0).add(1)
            } else {
                bought = Decimal.max(player.prestigeUpgrades[2], 1)
            }
            eff = eff.pow(bought)
            if (hasSetbackUpgrade('b4')) {
                eff = eff.pow(SETBACK_UPGRADES[2][3].eff)
            }
            return eff
        }
    },
    {
        cost: D(5),
        get desc() {
            return player.prestigeChallengeCompleted.includes(2)
                ? Decimal.neq(player.prestigeUpgrades[3], 0) && Decimal.neq(player.prestigeUpgrades[3], 1)
                    ? `Basic Buyables give ${format(tmp.prestigeUpgEffs[3], 1)} free levels to all previous basic buyables instead of only the previous basic buyable.`
                    : `Basic Buyables give a free level to all previous basic buyables instead of only the previous basic buyable.`
                : Decimal.neq(player.prestigeUpgrades[3], 0) && Decimal.neq(player.prestigeUpgrades[3], 1)
                    ? `Basic Buyables give ${format(tmp.prestigeUpgEffs[3], 1)} free levels to the previous basic buyable.`
                    : `Basic Buyables give a free level to the previous basic buyable.`
        },
        get eff() {
            let eff = Decimal.max(player.prestigeUpgrades[3], 0)
            return eff
        }
    },
    {
        cost: D(5),
        get desc() {
            return `Total amount of basic buyables gives an extra boost to points. Currently: ×${format(tmp.prestigeUpgEffs[4], 2)}`
        },
        get eff() {
            let total = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(player.buyables[i])
            }
            let eff = total.mul(0.01).add(1)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[4], 1))
            return eff
        }
    },
    {
        cost: D(5),
        get desc() {
            return `Buy. 4's effect base increases by +×0.002 per Buy. 4 bought. Currently: +×${format(tmp.prestigeUpgEffs[5], 3)}`
        },
        get eff() {
            let eff = Decimal.mul(player.buyables[3], 0.002)
            eff = eff.mul(Decimal.max(player.prestigeUpgrades[5], 1))
            return eff
        }
    },
    {
        cost: D(8),
        get desc() {
            return `Point gain is increased based off of the amount of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'}. Currently: ×${format(tmp.prestigeUpgEffs[6], 2)}`
        },
            get eff() {
                let eff = tmp.totalPrestigeUpg.div(10).pow_base(32)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[6], 1))
            return eff
        }
    },
    {
        cost: D(8),
        get desc() {
            return `Prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} and total basic buyables bought give a boost to points. Currently: ×${format(tmp.prestigeUpgEffs[7], 2)}`
        },
            get eff() {
                let total = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(player.buyables[i])
            }
            let eff = total.mul(tmp.totalPrestigeUpg.div(400)).add(1)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[7], 1))
            return eff
        }
    },
    {
        cost: D(8),
        get desc() {
            return `Prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} increase Buyable 1's effect base. Currently: +${format(tmp.prestigeUpgEffs[8], 2)}`
        },
            get eff() {
                let eff = tmp.totalPrestigeUpg.mul(0.5)
            eff = eff.mul(Decimal.max(player.prestigeUpgrades[8], 1))
            return eff
        }
    },
    {
        cost: D(15),
        get desc() {
            return `Raise Point gain by ^${format(tmp.prestigeUpgEffs[9], 2)}. (~×${format(tmp.pointGen.root(this.eff).pow(this.eff.sub(1)))})`
        },
        get eff() {
            let eff = D(1.1)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[9], 1))
            if (tmp.hinderances[3].entered) {
                eff = eff.pow(tmp.hinderances[3].effects.pts)
            }
            return eff
        }
    },
    {
        cost: D(15),
        get desc() {
            return `Raise Generator Speed by ^${format(tmp.prestigeUpgEffs[10], 2)}. (~×${format(Decimal.root(player.buyablePoints[0], this.eff).pow(this.eff.sub(1)))}) `
        },
        get eff() {
            let eff = D(1.2)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[10], 1))
            return eff
        }
    },
    {
        cost: D(15),
        get desc() {
            return `Raise Point and Generator Speed by ^${format(tmp.prestigeUpgEffs[11], 3)}. (~×${format(tmp.pointGen.root(this.eff).pow(this.eff.sub(1)))} pts, ~×${format(Decimal.root(player.buyablePoints[0], this.eff).pow(this.eff.sub(1)))} gen. spd)`
        },
        get eff() {
            let eff = D(1.075)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[11], 1))
            return eff
        }
    },
    {
        cost: D(25),
        get desc() {
            return `Increase Generator effects from +${format(tmp.prestigeUpgEffs[12].recip().mul(100))}%/level to +${format(this.eff2(Decimal.add(player.prestigeUpgrades[12], 1)).recip().mul(100))}%/level.`
        },
        get eff() {
            return this.eff2(player.prestigeUpgrades[12])
        },
        eff2(x) {
            let eff = D(10)
            eff = eff.div(Decimal.min(x, 1).pow_base(2.5))
            eff = eff.div(Decimal.max(x, 1).sub(1).pow_base(2))
            return eff
        }
    },
    {
        cost: D(25),
        get desc() {
            return `P${tmp.prestigeIsUpg ? 'U' : 'B'}1 is raised to the ^${format(tmp.prestigeUpgEffs[13], 2)}`
        },
        get eff() {
            let eff = D(4)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[13], 1))
            return eff
        }
    },
    {
        cost: D(25),
        get desc() {
            return `Prestige Point effect from PC4 is increased from +${format(tmp.prestigeUpgEffs[14].mul(100))}%/point to +${format(this.eff2(Decimal.add(player.prestigeUpgrades[14], 1)).mul(100))}%/point.`
        },
        get eff() {
            return this.eff2(player.prestigeUpgrades[14])
        },
        eff2(x) {
            let eff = D(0.2)
            eff = eff.mul(Decimal.min(x, 1).pow_base(2.5))
            eff = eff.mul(Decimal.max(x, 1).sub(1).pow_base(2))
            return eff
        }
    },
]

const PRESTIGE_CHALLENGES = [
    {
        get goal() {
            let goal = D(1e8)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Nerfed Buyables",
        desc: "Buyables' effect bases are halved.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyables generate a resource that boost themselves, called Generators.`
        },
        chalEffects(depth) {
            const obj = { effectBase: D(0.5) }
            obj.effectBase = obj.effectBase.pow(depth)

            return obj
        }
    },
    {
        get goal() {
            let goal = D(2.5e8)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Accelerated Spending",
        desc: "Buyable' scaling intervals now occur every 5 purchases and don't give a bonus.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and unlock Buyable 5.`
        },
        chalEffects(depth) {
            const obj = { interval: D(5) }

            return obj
        }
    },
    {
        get goal() {
            let goal = D(1e6)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "No Influencing",
        desc: "Buyables add to the point generation instead of multiplying.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1. Buyables now add free levels to their previous buyable, and Prestige Upgrade 4 is improved.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e16)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Stacking Interest",
        desc: "Buyables 2+ do not multiply point gain, but instead add to the effect base of the previous buyable. However, scaling intervals happen twice as often and don't give any boosts.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and prestige points give a passive boost to points.`
        },
        chalEffects(depth) {
            const obj = { interval: D(2) }
            obj.interval = obj.interval.pow(depth)

            return obj
        }
    },
    {
        get goal() {
            let goal = D(1e10)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Intense Synergy",
        desc: "Apply Prestige Challenges 1-4.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give triple the effect instead of double.`
        },
        chalEffects(depth) {
            const obj = { chal: D(1) }
            obj.chal = obj.chal.mul(depth)

            return obj
        }
    },
    {
        get goal() {
            let goal = D(1e12)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Black Out",
        desc: "Buyable 1 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give quadruple the effect instead of triple.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e15)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Black Out II",
        desc: "Buyable 1 and 2 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give quintuple the effect instead of quadruple.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e20)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Black Out III",
        desc: "Buyables 1-3 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give sextuple the effect instead of quintuple.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e33)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Black Out IV",
        desc: "Buyables 1-4 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give septuple the effect instead of sextuple.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e45)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Black Out V",
        desc: "Buyables 1-5 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give 10× the effect instead of septuple.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e90)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Factory Reversal",
        desc: "All generators (from PC1) are activated, but all generator multipliers other than buyables are disabled, and the effects decrease instead of increase.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and every OoM of your total generator level increases prestige essence' effect by +^0.1, smoothly.`
        },
        chalEffects(depth) {
            // for sake of consistency
            return {}
        }
    },
    {
        get goal() {
            let goal = D(1e135)
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Annhilation",
        desc: "Tier 1 Time Speed is reduced by /1,000, and Point and generators are rooted based on your points and the time since you have bought a buyable.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, Generator multipliers are raised ^1.2, and Point gain is raised ^1.025.`
        },
        chalEffects(depth) {
            const obj = { timeSpeed: D(1000), root: D(1) }
            obj.timeSpeed = obj.timeSpeed.pow(depth)

            obj.root = Decimal.add(player.timeSinceBuyableBought, 0.001).div(0.011).min(1).mul(Decimal.sub(1, Decimal.div(1, Decimal.max(player.points, 0).add(1).log10().add(1).log10().add(1).log10().add(1))).mul(0.875).add(0.125))
            obj.root = obj.root.pow(depth)
            return obj
        }
    },
    {
        get goal() {
            let goal = D('1e600')
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0])
            }
            return goal
        },
        name: "Generator Mastery",
        desc: "Generator speed is log10'd, then buyables instead boost Generator speed with log10 effect. Generator levels scale much slower (~1.05<sup>x</sup> instead of x!) and boost points exponentially instead of their effect linearly.",
        get eff() {
            return `Buyables also boost Generator speed and log2(Gen. Lvs.) past 12 increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'}.`
        },
        chalEffects(depth) {
            const obj = { log: D(1) }
            obj.log = obj.log.mul(depth)

            return obj
        }
    }
]

function initHTML_prestige() {
    toHTMLvar('prestigeTab')
    toHTMLvar('prestigeTabButton')
    toHTMLvar('prestigeChallengeTab')
    toHTMLvar('prestigeChallengeTabButton')
    html['prestigeTab'].setDisplay(false)
    html['prestigeTabButton'].setDisplay(false)
    html['prestigeChallengeTab'].setDisplay(false)
    html['prestigeChallengeTabButton'].setDisplay(false)

    toHTMLvar('prestige')
    toHTMLvar('prestigeAmount')
    toHTMLvar('prestigeNext')
    toHTMLvar('prestigePoints')
    toHTMLvar('prestigeUpgradeList')
    toHTMLvar('prestigeUpgradeCap')
    toHTMLvar('prestigeChallengeList')
    toHTMLvar('prestigeChallengeButton')
    toHTMLvar('prestigeChallengeName')
    toHTMLvar('prestigeChallengeRequirement')
    toHTMLvar('prestigePointEffect')
    toHTMLvar('prestigePointEffectNext')
    toHTMLvar('mainPrestigeTabButton')
    toHTMLvar('mainPrestigeTab')
    toHTMLvar('prestigeEssenceAmount')
    toHTMLvar('prestigeEssenceNext')
    toHTMLvar('prestigeEssence')
    toHTMLvar('prestigeEssenceEffect')
    toHTMLvar('prestigeEssenceEffectNext')
    toHTMLvar('prestigeEssenceDisp')
    toHTMLvar('prestigeChalRespec')

    let txt = ``
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyPrestigeUpgrade(${i})" id="prestigeUpgrade${i}" class="whiteText font" style="height: 80px; width: 190px; font-size: 9px; margin: 2px">
                <b><span id="prestigeUpgrade${i}amount"></span></b><br><br>
                <span id="prestigeUpgrade${i}eff"></span><br>
                <span id="prestigeUpgrade${i}cost"></span>
            </button>
        `
    }
    html['prestigeUpgradeList'].setHTML(txt)
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        toHTMLvar(`prestigeUpgrade${i}`)
        toHTMLvar(`prestigeUpgrade${i}amount`)
        toHTMLvar(`prestigeUpgrade${i}eff`)
        toHTMLvar(`prestigeUpgrade${i}cost`)
    }

    txt = ``
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        txt += `
        <button onclick="togglePrestigeChallenge(${i})" id="prestigeChallenge${i}" class="whiteText font" style="cursor: pointer; height: 160px; width: 320px; font-size: 10px; margin: 2px">
            <b><span id="prestigeChallenge${i}name" style="font-size: 12px"><b>PC${i+1}</b>: ${PRESTIGE_CHALLENGES[i].name}</span></b><br>
            <span id="prestigeChallenge${i}desc">${PRESTIGE_CHALLENGES[i].desc}</span><br>
            Goal: <span id="prestigeChallenge${i}goal"></span> points<br><br>
            Reward: <span id="prestigeChallenge${i}reward">${PRESTIGE_CHALLENGES[i].eff}</span>
        </button>
        `
    }

    html['prestigeChallengeList'].setHTML(txt)
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        toHTMLvar(`prestigeChallenge${i}`)
        toHTMLvar(`prestigeChallenge${i}name`)
        toHTMLvar(`prestigeChallenge${i}desc`)
        toHTMLvar(`prestigeChallenge${i}goal`)
        toHTMLvar(`prestigeChallenge${i}reward`)
    }
}

function updateGame_prestige() {
    for (let i = PRESTIGE_CHALLENGES.length - 1; i >= 0; i--) {
        tmp.prestigeChal[i].entered = false
        tmp.prestigeChal[i].trapped = false
        tmp.prestigeChal[i].depth = D(0)

        if (player.prestigeChallenge === i && !prestigeChallengeEnabled(i)) {
            togglePrestigeChallenge(i)
        }

        if (tmp.hinderances[2].depth.gt(0)) {
            if (i === 0) {
                tmp.prestigeChal[i].trapped = true
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.hinderances[2].effects.nerfedUpg)
            }
            if (i === 2 || i === 3 || i === 7) {
                tmp.prestigeChal[i].trapped = true
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.hinderances[2].effects.others)
            }
        }

        if (player.prestigeChallenge === i) {
            tmp.prestigeChal[i].entered = true
            tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, 1)
        }

        if (i <= 3 && i >= 0) {
            if (tmp.prestigeChal[4].depth.gt(0)) {
                tmp.prestigeChal[i].trapped = true
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.prestigeChal[4].effects.chal)
            }
        }

        if (i >= 5 && i <= 8) {
            if (tmp.prestigeChal[i + 1].depth.gt(0)) {
                tmp.prestigeChal[i].trapped = true
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.prestigeChal[i + 1].depth)
            }
        }

        tmp.prestigeChal[i].effects = PRESTIGE_CHALLENGES[i].chalEffects(tmp.prestigeChal[i].depth)
    }

    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        tmp.prestigeUpgEffs[i] = PRESTIGE_UPGRADES[i].eff
        tmp.prestigeUpgDescs[i] = PRESTIGE_UPGRADES[i].desc
    }

    player.timeInPrestige = Decimal.add(player.timeInPrestige, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    tmp.factors.prestigeEssence = []
    tmp.peGain = hasSetbackUpgrade(`b1`)
        ? Decimal.max(player.bestPointsInPrestige, 10).log(1e6).log2().pow_base(10)
        : D(0)
    addStatFactor('prestigeEssence', `Base`, `10<sup>log<sub>2</sub>(log<sub>1,000,000</sub>(${format(player.bestPointsInPrestige)}))</sup>`, null, tmp.peGain)
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.peGain = new Decimal(0)
        addStatFactor('prestigeEssence', `Advantageous 'Challenge'`, `...`, null, tmp.peGain)
    }
    if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
        tmp.peGain = tmp.peGain.pow(HINDERANCES[0].eff)
        addStatFactor('prestigeEssence', `H1 PB`, `^`, HINDERANCES[0].eff, tmp.peGain)
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.peGain = tmp.peGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('prestigeEssence', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.peGain);
    }
    addStatFactor('prestigeEssence', `Current P. Essence`, `-`, player.prestigeEssence, tmp.peGain.sub(player.prestigeEssence).max(0))
    tmp.peGain = tmp.peGain.sub(player.prestigeEssence).floor().max(0)

    tmp.peNext = tmp.peGain
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.peNext = new Decimal(Infinity)
    }
    tmp.peNext = tmp.peNext.add(1).floor().add(player.prestigeEssence)
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.peNext = tmp.peNext.root(tmp.hinderances[4].effects.resource);
    }
    if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
        tmp.peNext = tmp.peNext.root(HINDERANCES[0].eff)
    }
    tmp.peNext = tmp.peNext.log(10).pow_base(2).pow_base(1e6)

    tmp.peEffect = Decimal.max(player.prestigeEssence, 0).add(1)
    if (player.prestigeChallengeCompleted.includes(10)) {
        let total = D(0)
        for (let i = 0; i < player.buyables.length; i++) {
            total = total.add(tmp.buyables[i].genLevels)
        }
        tmp.peEffect = tmp.peEffect.pow(total.add(1).log10().mul(0.1).add(1))
    }

    tmp.peEffectNext = Decimal.add(player.prestigeEssence, tmp.peGain).add(1)
    if (player.prestigeChallengeCompleted.includes(10)) {
        let total = D(0)
        for (let i = 0; i < player.buyables.length; i++) {
            total = total.add(tmp.buyables[i].genLevels)
        }
        tmp.peEffectNext = tmp.peEffectNext.pow(total.add(1).log10().mul(0.1).add(1))
    }

    tmp.prestigeUpgCap = D(4)
    if (player.prestigeChallengeCompleted.includes(0)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(1)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(2)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(3)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(6)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(7)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(8)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(9)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(10)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(11)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(12)) {
        if (player.transcendUpgrades.includes('prest4')) {
            tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(Decimal.max(player.bestTotalGenLvs, 1).log2().sub(11).max(0).mul(2).floor().div(2))
        } else {
            tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(Decimal.max(player.bestTotalGenLvs, 1).log2().sub(11).max(0).floor())
        }
    }
    if (Decimal.gte(player.hinderanceScore[1], HINDERANCES[1].start)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(2)
    }

    tmp.prestigeIsUpg = !player.transcendUpgrades.includes('prest4')
    tmp.prestigePointsUsed = D(0)
    tmp.totalPrestigeUpg = D(0)
    if (!hasTranscendMilestone(1)) {
        for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
            if (Decimal.eq(player.prestigeUpgrades[i], 0)) {
                continue
            }
            if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                continue
            } 
            tmp.prestigePointsUsed = tmp.prestigePointsUsed.add(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i, true)))
        }
    }
    tmp.totalPrestigeUpg = player.prestigeUpgrades.reduce((accu, bought) => Decimal.add(accu, bought))
    // if (player.prestigeChallenge !== null) {
    //     tmp.totalPrestigeUpgrades = tmp.prestigeUpgradeCap
    // }

    tmp.factors.prestige = []
    tmp.prestigePointGain = Decimal.max(player.bestPointsInPrestige, 1e5).div(1e6).log10().add(1)
    addStatFactor('prestige', `Base`, `1+log<sub>10</sub>(${format(player.bestPointsInPrestige)}/1,000,000)`, null, tmp.prestigePointGain)
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.prestigePointGain = new Decimal(0)
        addStatFactor('prestige', `Advantageous 'Challenge'`, `...`, null, tmp.prestigePointGain)
    }
    if (Decimal.gt(player.setbackEnergy[2], 0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(tmp.energyEffs[2])
        addStatFactor('prestige', `Blue Energy`, `×`, tmp.energyEffs[2], tmp.prestigePointGain)
    }
    if (Decimal.gt(player.hinderanceScore[1], HINDERANCES[1].start)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(HINDERANCES[1].eff)
        addStatFactor('prestige', `H2 PB`, `×`, HINDERANCES[1].eff, tmp.prestigePointGain)
    }
    if (player.transcendUpgrades.includes('prest1')) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(2)
        addStatFactor('prestige', `Trans. Upg. "Double the prestige?"`, `×`, 2, tmp.prestigePointGain)
    }
    if (player.transcendUpgrades.includes('prest2')) {
        tmp.prestigePointGain = tmp.prestigePointGain.div(tmp.transEffs[2][1])
        addStatFactor('prestige', `Trans. Upg. "Tier Combine"`, `/`, tmp.transEffs[2][1], tmp.prestigePointGain)
    }
    if (Decimal.gt(player.generatorFeatures.totalAdv, 0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(tmp.generatorFeatures.advanceEff)
        addStatFactor('prestige', `Generator Advance Effect"`, `×`, tmp.generatorFeatures.advanceEff, tmp.prestigePointGain)
    }
    if (colorAmountTotal(1).gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.div(tmp.setbackEffects[1][0])
        addStatFactor('prestige', `Setback Green Effect`, `/`, tmp.setbackEffects[1][0], tmp.prestigePointGain)
    }
    if (tmp.hinderances[1].depth.gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.pow(tmp.hinderances[1].effects.prestige)
        addStatFactor('prestige', `Hinderance 2`, `^`, tmp.hinderances[1].effects.prestige, tmp.prestigePointGain)
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('prestige', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.prestigePointGain);
    }
    tmp.prestigePointGain = cheatDilateBoost(tmp.prestigePointGain)
    addStatFactor('prestige', `Current P. Points`, `-`, player.prestige, tmp.prestigePointGain.sub(player.prestige).max(0))
    tmp.prestigePointGain = tmp.prestigePointGain.sub(player.prestige).floor().max(0)

    tmp.prestigePointNext = tmp.prestigePointGain.add(player.prestige).add(1)
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.prestigePointNext = new Decimal(Infinity)
    }
    tmp.prestigePointNext = cheatDilateBoost(tmp.prestigePointNext, true)
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.root(tmp.hinderances[4].effects.resource);
    }
    if (tmp.hinderances[1].depth.gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.root(tmp.hinderances[1].effects.prestige)
    }
    if (colorAmountTotal(1).gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.mul(tmp.setbackEffects[1][0])
    }
    if (Decimal.gt(player.generatorFeatures.totalAdv, 0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.div(tmp.generatorFeatures.advanceEff)
    }
    if (player.transcendUpgrades.includes('prest2')) {
        tmp.prestigePointNext = tmp.prestigePointNext.mul(tmp.transEffs[2][1])
    }
    if (player.transcendUpgrades.includes('prest1')) {
        tmp.prestigePointNext = tmp.prestigePointNext.div(2)
    }
    tmp.prestigePointNext = tmp.prestigePointNext.div(HINDERANCES[1].eff)
    tmp.prestigePointNext = tmp.prestigePointNext.div(tmp.energyEffs[2])
    tmp.prestigePointNext = tmp.prestigePointNext.sub(1).pow10().mul(1e6)

    // auto-prestige
    tmp.autoPrestige = player.cheats.autoPrestige || (Decimal.gte(player.hinderanceScore[2], HINDERANCES[2].start) && player.transcendInSpecialReq !== "prest4")
    if (tmp.autoPrestige) {
        player.prestige = Decimal.add(player.prestige, tmp.prestigePointGain)
        player.prestigeEssence = Decimal.add(player.prestigeEssence, tmp.peGain)
    }

    tmp.prestigePointEffect = player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')
        ? Decimal.mul(player.prestige, 
            hasPrestigeUpgrade(14) 
                ? tmp.prestigeUpgEffs[14]
                : 0.2
            )
            .add(1) 
        : D(1)
    if (hasSetbackUpgrade('b4')) {
        tmp.prestigePointEffect = tmp.prestigePointEffect.pow(player.prestigeChallengeCompleted.includes(3) ? 2 : 1)
        tmp.prestigePointEffect = tmp.prestigePointEffect.pow(SETBACK_UPGRADES[2][3].eff)
    }
    if (player.transcendUpgrades.includes('prest3')) {
        tmp.prestigePointEffect = tmp.prestigePointEffect.pow(2)
    }

    tmp.prestigePointEffectNext = player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')
        ? Decimal.mul(Decimal.add(player.prestige, tmp.prestigePointGain), 
            hasPrestigeUpgrade(14) 
                ? tmp.prestigeUpgEffs[14]
                : 0.2
            )
            .add(1) 
        : D(1)
    if (hasSetbackUpgrade('b4')) {
        tmp.prestigePointEffectNext = tmp.prestigePointEffectNext.pow(player.prestigeChallengeCompleted.includes(3) ? 2 : 1)
        tmp.prestigePointEffectNext = tmp.prestigePointEffectNext.pow(SETBACK_UPGRADES[2][3].eff)
    }
    if (player.transcendUpgrades.includes('prest3')) {
        tmp.prestigePointEffectNext = tmp.prestigePointEffectNext.pow(2)
    }
}

function updateHTML_prestige() {
    html['prestigeTab'].setDisplay(tmp.tab === 1)
    html['prestigeTabButton'].setDisplay(Decimal.gt(player.prestige, 0) || Decimal.gt(player.ascend, 0))

    if (tmp.tab === 0 && tmp.mainTab === 0) {
        html['prestige'].setDisplay(player.prestigeChallenge === null);
        html['prestigeChallengeButton'].setDisplay(player.prestigeChallenge !== null);
        if (player.prestigeChallenge === null) {
            html['prestigeAmount'].setTxt(format(tmp.prestigePointGain));
            let show = Decimal.lt(tmp.prestigePointGain, 100);
            html['prestigeNext'].setDisplay(show)
            if (show) {
                html['prestigeNext'].setTxt(`Next prestige point at ${format(tmp.prestigePointNext)} points.`);
            }

            html['prestigeEssenceAmount'].setDisplay(hasSetbackUpgrade(`b1`));
            html['prestigeEssenceNext'].setDisplay(hasSetbackUpgrade(`b1`) && Decimal.lt(tmp.peNext, 100));
            if (hasSetbackUpgrade(`b1`)) {
                html['prestigeEssenceAmount'].setTxt(` and ${format(tmp.peGain)} prestige essence`);
                html['prestigeEssenceNext'].setTxt(`Next essence at ${format(tmp.peNext)} points.`);
            }
        } else {
            html['prestigeChallengeName'].setTxt(PRESTIGE_CHALLENGES[player.prestigeChallenge].name);
            html['prestigeChallengeRequirement'].setTxt(format(PRESTIGE_CHALLENGES[player.prestigeChallenge].goal));
            html['prestigeChallengeButton'].changeStyle('cursor', Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? 'pointer' : 'not-allowed');
            html['prestigeChallengeButton'].changeStyle('border', '3px solid ' + (Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? '#0080ff' : '#004080'));
            html['prestigeChallengeButton'].changeStyle('background-color', Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? '#00408080' : '#00204080');
        }
    }

    if (tmp.tab === 1) {
        html['mainPrestigeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0))
        html['mainPrestigeTab'].setDisplay(tmp.prestigeTab === 0)

        html['prestigeChallengeTab'].setDisplay(tmp.prestigeTab === 2)
        html['prestigeChallengeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0))


        if (tmp.prestigeTab === 0) {
            for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
                let show = true
                if (i >= 9 && i <= 11) {
                    show = Decimal.gt(player.ascendUpgrades[12], 0)
                }
                if (i >= 12 && i <= 14) {
                    show = Decimal.gt(player.ascendUpgrades[12], 1)
                }
                html[`prestigeUpgrade${i}`].setDisplay(show)
                if (show) {
                    html[`prestigeUpgrade${i}eff`].setTxt(tmp.prestigeUpgDescs[i])
                    html[`prestigeUpgrade${i}cost`].setTxt(
                        hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`) 
                            ? `Bought!` 
                            : (tmp.hinderances[4].depth.gt(0) && i != 0)
                                ? `Cost: ${format(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i)))} PB${i}`
                                : `Cost: ${format(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i)))} prestige points`
                            )
                    if (hasSetbackUpgrade('b2')) {
                        if (player.transcendUpgrades.includes('prest4')) {
                            html[`prestigeUpgrade${i}amount`].setTxt(`PB${i+1}: ×${format(player.prestigeUpgrades[i], 1)}`)
                        } else {
                            html[`prestigeUpgrade${i}amount`].setTxt(`PU${i+1}: ×${format(player.prestigeUpgrades[i])}`)
                        }
                    } else {
                        html[`prestigeUpgrade${i}amount`].setTxt(`Prestige Upgrade ${i+1}`)
                    }

                    html[`prestigeUpgrade${i}`].changeStyle('background-color',
                        !(hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`))
                            ? (canBuyPrestigeUpgrade(i)
                                ? '#00408080'
                                : '#00008080')
                            : '#00808080')
                    html[`prestigeUpgrade${i}`].changeStyle('border', `3px solid ${
                        !(hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`))
                            ? (canBuyPrestigeUpgrade(i)
                                ? '#0080ff'
                                : '#0000ff')
                            : '#00ffff'}`)
                    html[`prestigeUpgrade${i}`].changeStyle('cursor',
                        !(hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`)) && canBuyPrestigeUpgrade(i)
                            ? 'pointer'
                            : 'not-allowed')
                }
            }

            html['prestigePoints'].setTxt(`${format(Decimal.sub(player.prestige, tmp.prestigePointsUsed))}`)

            html['prestigeEssenceDisp'].setDisplay(hasSetbackUpgrade(`b1`))
            if (hasSetbackUpgrade(`b1`)) {
                html['prestigeEssence'].setTxt(format(player.prestigeEssence))
                html['prestigeEssenceEffect'].setTxt(`Boosting points by ×${format(tmp.peEffect, 2)}`)

                html['prestigeEssenceEffectNext'].setDisplay(!tmp.autoPrestige)
                if (!tmp.autoPrestige) {
                    html['prestigeEssenceEffectNext'].setTxt(`×${format(tmp.peEffectNext.div(tmp.peEffect), 2)} upon next reset`)
                }
            }

            html['prestigePointEffect'].setDisplay(player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4'))
            html['prestigePointEffectNext'].setDisplay((player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')) && !tmp.autoPrestige)
            if (player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')) {
                html['prestigePointEffect'].setTxt(`Boosting points by ×${format(tmp.prestigePointEffect, 2)}`)
                html['prestigePointEffectNext'].setTxt(`×${format(tmp.prestigePointEffectNext.div(tmp.prestigePointEffect), 2)} upon next reset`)
            }
            html['prestigeUpgradeCap'].setTxt(`${format(tmp.totalPrestigeUpg, player.transcendUpgrades.includes('prest4') ? 1 : 0)} / ${format(tmp.prestigeUpgCap, player.transcendUpgrades.includes('prest4') ? 1 : 0)}`)
        }
        if (tmp.prestigeTab === 2) {
            html['prestigeChalRespec'].setDisplay(hasTranscendMilestone(0))
            for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
                html[`prestigeChallenge${i}goal`].setTxt(format(PRESTIGE_CHALLENGES[i].goal))
                if (tmp.prevPrestigeIsUpg !== tmp.prestigeIsUpg) {
                    html[`prestigeChallenge${i}reward`].setTxt(PRESTIGE_CHALLENGES[i].eff)
                    tmp.prevPrestigeIsUpg = tmp.prestigeIsUpg // only update if its changed otherwise lose performance ig
                }

                let shown = prestigeChallengeEnabled(i)

                html[`prestigeChallenge${i}`].setDisplay(shown)
                if (shown) {
                    html[`prestigeChallenge${i}`].changeStyle('background-color', 
                        !player.prestigeChallengeCompleted.includes(i)
                            ? (player.prestigeChallenge === i
                                ? '#00408080'
                                : '#00008080')
                            : (player.prestigeChallenge === i
                                ? '#60808080'
                                : '#00808080'))
                    html[`prestigeChallenge${i}`].changeStyle('border', `3px solid ${
                        !player.prestigeChallengeCompleted.includes(i)
                            ? (player.prestigeChallenge === i
                                ? '#0080ff'
                                : '#0000ff')
                            : (player.prestigeChallenge === i
                                ? '#c0ffff'
                                : '#00ffff')}`)
                    if (PRESTIGE_CHALLENGES[i].effChange !== undefined) {
                        html[`prestigeChallenge${i}reward`].setTxt(PRESTIGE_CHALLENGES[i].eff)
                    }
                }
            }
        }
    }
}

function prestigeChallengeEnabled(id) {
    let shown = true
    if (id === 4) {
        shown = player.prestigeChallengeCompleted.includes(0)
            && player.prestigeChallengeCompleted.includes(1)
            && player.prestigeChallengeCompleted.includes(2)
            && player.prestigeChallengeCompleted.includes(3)
    }
    if (id === 5) {
        shown = Decimal.gte(player.ascendUpgrades[13], 1) && !(hasSetbackUpgrade(`b3`) && player.prestigeChallengeCompleted.includes(5))
    }
    if (id >= 6 && id <= 8) {
        shown = hasSetbackUpgrade(`b3`) && player.prestigeChallengeCompleted.includes(id - 1) && !player.prestigeChallengeCompleted.includes(id)
    }
    if (id === 9) {
        shown = hasSetbackUpgrade(`b3`) && player.prestigeChallengeCompleted.includes(id - 1)
    }
    if (id >= 10 && id <= 12) {
        shown = Decimal.gte(player.ascendUpgrades[13], id - 8)
    }
    // if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
    //     if (id >= 0 && id <= 12) {
    //         shown &&= !player.prestigeChallengeCompleted.includes(id)
    //     }
    // }
    if (id >= 13 && id <= 22) {
        if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
            shown = player.prestigeChallengeCompleted.includes(id - 13)
        } else {
            shown = false
        }
    }

    return shown
}

function toggleCurrentPrestigeChallenge() {
    togglePrestigeChallenge(player.prestigeChallenge)
}

function canBuyPrestigeUpgrade(i) {
    if (tmp.totalPrestigeUpg.gte(tmp.prestigeUpgCap)) {
        return false;
    }
    let resource
    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
        resource = player.prestigeUpgrades[i - 1]
    } else {
        resource = player.prestige
    }
    if (Decimal.sub(resource, tmp.prestigePointsUsed).lt(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i)))) {
        return false;
    }
    if (hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`)) {
        return false;
    }
    return true;
}

function buyPrestigeUpgrade(i) {
    if (!canBuyPrestigeUpgrade(i)) {
        return;
    }
    let resource
    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
        resource = player.prestigeUpgrades[i - 1]
    } else {
        resource = player.prestige
    }
    if (shiftDown) {
        if (player.transcendUpgrades.includes('prest4')) {
            if (Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost).gte(10)) {
                player.prestigeUpgrades[i] = Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost).log10().log2().add(1).mul(2).ceil().div(2)
            } else {
                player.prestigeUpgrades[i] = Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost).log10().mul(2).ceil().div(2)
            }
        } else {
            if (Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost).gte(10)) {
                player.prestigeUpgrades[i] = Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost).log10().log2().add(1).ceil()
            } else {
                player.prestigeUpgrades[i] = Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost).log10().ceil()
            }
        }
    } else {
        if (player.transcendUpgrades.includes('prest4')) {
            player.prestigeUpgrades[i] = Decimal.add(player.prestigeUpgrades[i], 0.5)
        } else {
            player.prestigeUpgrades[i] = Decimal.add(player.prestigeUpgrades[i], 1)
        }
    }
    if (!hasSetbackUpgrade(`b2`)) {
        player.prestigeUpgrades[i] = Decimal.min(player.prestigeUpgrades[i], 1)
    }
    if (player.prestigeUpgrades.reduce((accu, bought) => Decimal.add(accu, bought)).gt(tmp.prestigeUpgCap)) {
        player.prestigeUpgrades[i] = Decimal.sub(player.prestigeUpgrades[i], player.prestigeUpgrades.reduce((accu, bought) => Decimal.add(accu, bought)).sub(tmp.prestigeUpgCap))
    }

    player.prestigeUpgradesInCurrentAscension = true
}

function hasPrestigeUpgrade(i) {
    if (tmp.hinderances[2].depth.lte(0) && (tmp.prestigeChal[5].depth.gt(0) || tmp.prestigeChal[6].depth.gt(0) || tmp.prestigeChal[7].depth.gt(0) || tmp.prestigeChal[8].depth.gt(0) || tmp.prestigeChal[9].depth.gt(0))) {
        return false
    }
    return Decimal.gt(player.prestigeUpgrades[i], 0)
}

function prestigeUpgradeCostScaling(i, oneBefore = false) {
    let bought = player.prestigeUpgrades[i]
    if (bought === null) {
        bought = D(0)
    }
    if (oneBefore) {
        bought = Decimal.sub(bought, 1)
    }
    return Decimal.lt(bought, 1)
        ? Decimal.pow10(bought) // for when like maybe idk fractional prestige upgrade amount
        : Decimal.sub(bought, 1).pow_base(2).pow10()
}

function togglePrestigeChallenge(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }
    tmp.prestigePointGain = D(0)
    if (player.prestigeChallenge === null) {
        doPrestigeReset(true)
        player.prestigeChallenge = i
        if (i === 14) {
            for (let i = 0; i < player.prestigeUpgrades.length; i++) {
                player.prestigeUpgrades[i] = D(0)
            }
        }
        updateGame_prestige()
        return;
    }
    if (Decimal.gte(player.points, PRESTIGE_CHALLENGES[i].goal)) {
        if (!player.prestigeChallengeCompleted.includes(i)) {
            player.prestigeChallengeCompleted.push(i)
        }
    }
    doPrestigeReset(true)
    player.prestigeChallenge = null
    updateGame_prestige()
}

function doPrestigeReset(doAnyway = false) {
    if (!doAnyway && player.prestigeChallenge === null) {
        if (tmp.prestigePointGain.lte(0) && !doAnyway) {
            return;
        }

        if (hasSetbackUpgrade(`b1`)) {
            player.prestigeEssence = Decimal.add(player.prestigeEssence, tmp.peGain)
        }
        player.prestige = Decimal.add(player.prestige, tmp.prestigePointGain)
        player.prestigeCount = Decimal.add(player.prestigeCount, 1)
        player.prestigeCountInTrans = Decimal.add(player.prestigeCountInTrans, 1)

        if (!doAnyway) {
            player.darts = Decimal.add(player.darts, tmp.dartGain)
        }
    }

    player.timeInPrestige = D(0)
    player.timeSinceBuyableBought = D(0)
    player.points = D(0)
    player.bestPointsInPrestige = D(0)
    for (let i = 0; i < player.buyables.length; i++) {
        player.buyables[i] = D(0)
        player.buyablePoints[i] = D(0)
        player.buyableAutobought[i] = D(0)
    }
    tmp.pointGen = D(0)
    tmp.buyables = resetMainBuyables()
}

function respecPrestigeUpgrades() {
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        player.prestigeUpgrades[i] = D(0)
    }
    doPrestigeReset(true)
}

function respecPrestigeChallenge() {
    player.prestigeChallengeCompleted = []
    doAscendReset(true)
}