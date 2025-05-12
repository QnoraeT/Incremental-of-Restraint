"use strict";
const PRESTIGE_UPGRADES = [
    {
        cost: D(1),
        get desc() {
            return `Point gain is boosted. Currently: ×${format(tmp.prestigeUpgEffs[0], 2)}`
        },
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
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
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let eff = Decimal.max(player.points, 1).log10().div(5).add(1)
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
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let eff = Decimal.max(player.prestige, 0).div(2).add(1)
            let bought
            if (player.setbackUpgrades.includes('b4')) {
                bought = Decimal.max(player.prestigeUpgrades[2], 0).add(1)
            } else {
                bought = Decimal.max(player.prestigeUpgrades[2], 1)
            }
            eff = eff.pow(bought)
            if (player.setbackUpgrades.includes('b4')) {
                eff = eff.pow(SETBACK_UPGRADES[2][3].eff)
            }
            return eff
        }
    },
    {
        cost: D(5),
        get desc() {
            return Decimal.gt(player.prestigeUpgrades[3], 1)
                ? `Buyables give ${format(tmp.prestigeUpgEffs[3])} free levels to all previous buyables instead of only the previous upgrade.`
                : `Buyables give a free level to all previous buyables instead of only the previous upgrade.`
        },
        get eff() {
            let eff = Decimal.max(player.prestigeUpgrades[3], 1)
            return eff
        }
    },
    {
        cost: D(5),
        get desc() {
            return `Total amount of buyables gives an extra boost to points. Currently: ×${format(tmp.prestigeUpgEffs[4], 2)}`
        },
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
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
            if (player.prestigeChallenge === 5) {
                return D(0)
            }
            let eff = Decimal.mul(player.buyables[3], 0.002)
            eff = eff.mul(Decimal.max(player.prestigeUpgrades[5], 1))
            return eff
        }
    },
    {
        cost: D(8),
        get desc() {
            return `Point gain is increased based off of the amount of prestige upgrades. Currently: ×${format(tmp.prestigeUpgEffs[6], 2)}`
        },
            get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let eff = tmp.totalPrestigeUpgrades.div(10).pow_base(32)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[6], 1))
            return eff
        }
    },
    {
        cost: D(8),
        get desc() {
            return `Prestige upgrades and total buyables bought give a boost to points. Currently: ×${format(tmp.prestigeUpgEffs[7], 2)}`
        },
            get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let total = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(player.buyables[i])
            }
            let eff = total.mul(tmp.totalPrestigeUpgrades.div(400)).add(1)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[7], 1))
            return eff
        }
    },
    {
        cost: D(8),
        get desc() {
            return `Prestige upgrades increase Buyable 1's effect base. Currently: +${format(tmp.prestigeUpgEffs[8], 2)}`
        },
            get eff() {
            if (player.prestigeChallenge === 5) {
                return D(0)
            }
            let eff = tmp.totalPrestigeUpgrades.mul(0.5)
            eff = eff.mul(Decimal.max(player.prestigeUpgrades[8], 1))
            return eff
        }
    },
    {
        cost: D(15),
        get desc() {
            return `(Equiv. to a ×${format(tmp.pointGen.root(this.eff).pow(this.eff.sub(1)))}) Raise Point gain by ^${format(tmp.prestigeUpgEffs[9], 2)}`
        },
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let eff = D(1.1)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[9], 1))
            return eff
        }
    },
    {
        cost: D(15),
        get desc() {
            return `(Equiv. to a ~×${format(Decimal.root(player.buyablePoints[0], this.eff).pow(this.eff.sub(1)))}) Raise Generator speed by ^${format(tmp.prestigeUpgEffs[10], 2)}`
        },
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let eff = D(1.2)
            eff = eff.pow(Decimal.max(player.prestigeUpgrades[10], 1))
            return eff
        }
    },
    {
        cost: D(15),
        get desc() {
            return `(Equiv. to a ×${format(tmp.pointGen.root(this.eff).pow(this.eff.sub(1)))} pts, ~×${format(Decimal.root(player.buyablePoints[0], this.eff).pow(this.eff.sub(1)))} gen) Raise Point and Generator speed by ^${format(tmp.prestigeUpgEffs[11], 3)}`
        },
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
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
            return `Prestige Upgrade (1, 1) is raised to the ^${format(tmp.prestigeUpgEffs[13], 2)}`
        },
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
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
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Nerfed Upgrades",
        desc: "Buyables' effect bases are halved.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyables generate a resource that boost themselves, called Generators."
    },
    {
        get goal() {
            let goal = D(2.5e8)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Accelerated Spending",
        desc: "Buyable' scaling intervals are decreased to every 5 levels, but don't give any boost.",
        eff: "Increase the cap of prestige upgrades by 1, and unlock Buyable 5."
    },
    {
        get goal() {
            let goal = D(1e11)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "No Influencing",
        desc: "Buyables do not give any free levels.",
        eff: "Increase the cap of prestige upgrades by 1, and bought buyables are 50% stronger."
    },
    {
        get goal() {
            let goal = D(1e16)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Stacking Interest",
        desc: "Buyables 2+ do not multiply point gain, but instead add to the effect base of the previous buyable. However, scaling intervals happen twice as often and don't give any boosts.",
        eff: "Increase the cap of prestige upgrades by 1, and prestige points give a passive boost to points."
    },
    {
        get goal() {
            let goal = D(1e10)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Intense Synergy",
        desc: "Apply Prestige Challenges 1-4.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give triple the effect instead of double."
    },
    {
        get goal() {
            let goal = D(1e12)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Black Out",
        desc: "Buyable 1 and Prestige Upgrades are disabled.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give quadruple the effect instead of triple."
    },
    {
        get goal() {
            let goal = D(1e15)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Black Out II",
        desc: "Buyable 1 and 2 and Prestige Upgrades are disabled.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give quintuple the effect instead of quadruple."
    },
    {
        get goal() {
            let goal = D(1e20)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Black Out III",
        desc: "Buyables 1-3 and Prestige Upgrades are disabled.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give sextuple the effect instead of quintuple."
    },
    {
        get goal() {
            let goal = D(1e33)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Black Out IV",
        desc: "Buyables 1-4 and Prestige Upgrades are disabled.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give septuple the effect instead of sextuple."
    },
    {
        get goal() {
            let goal = D(1e45)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Black Out V",
        desc: "Buyables 1-5 and Prestige Upgrades are disabled.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give 10× the effect instead of septuple."
    },
    {
        get goal() {
            let goal = D(1e90)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Factory Reversal",
        desc: "All generators (from PC1) are activated, but all generator multipliers other than buyables are disabled, and the effects decrease instead of increase.",
        eff: "Increase the cap of prestige upgrades by 1, and every generator level increases prestige essence' effect by +^0.001."
    },
    {
        get goal() {
            let goal = D(1e135)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Annhilation",
        desc: "Tier 1 Time Speed is reduced by /1,000, and Point and generators are rooted based on your points and the time since you have bought a buyable.",
        eff: "Increase the cap of prestige upgrades by 1, Generator multipliers are raised ^1.2, and Point gain is raised ^1.025."
    },
    {
        get goal() {
            let goal = D('1e600')
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Generator Mastery",
        desc: "Generator speed is log10'd, then buyables instead boost Generator speed with ^0.1 effect. Generator levels scale weaker and boost points exponentially instead of their effect linearly.",
        eff: "Buyables also boost Generator speed and log2(Gen. Lvs.) past 12 increase the cap of prestige upgrades."
    },
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
    toHTMLvar('mainPrestigeTabButton')
    toHTMLvar('essencePrestigeTabButton')
    toHTMLvar('mainPrestigeTab')
    toHTMLvar('essencePrestigeTab')
    toHTMLvar('prestigeEssenceAmount')
    toHTMLvar('prestigeEssenceNext')
    toHTMLvar('prestigeEssence')
    toHTMLvar('prestigeEssenceEffect')
    
    let txt = ``
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyPrestigeUpgrade(${i})" id="prestigeUpgrade${i}" class="whiteText font" style="height: 80px; width: 190px; font-size: 9px; margin: 2px">
                <b>Prestige Upgrade ${i+1}<span id="prestigeUpgrade${i}amount"></span></b><br><br>
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
        <button onclick="togglePrestigeChallenge(${i})" id="prestigeChallenge${i}" class="whiteText font" style="height: 160px; width: 320px; font-size: 10px; margin: 2px">
            <b><span id="prestigeChallenge${i}name" style="font-size: 12px"></span></b><br>
            <span id="prestigeChallenge${i}desc"></span><br>
            Goal: <span id="prestigeChallenge${i}goal"></span> points<br><br>
            Reward: <span id="prestigeChallenge${i}reward"></span>
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
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        tmp.prestigeUpgEffs[i] = PRESTIGE_UPGRADES[i].eff
        tmp.prestigeUpgDescs[i] = PRESTIGE_UPGRADES[i].desc
    }

    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        tmp.prestigeChal[i] = {
            entered: false,
            trapped: false,
            depth: D(0)
        }

        if (player.prestigeChallenge === i) {
            tmp.prestigeChal[i].entered = true
            tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, 1)
        }
    }

    if (player.prestigeChallenge === 11) {
        tmp.pc11Eff = Decimal.add(player.timeSinceBuyableBought, 0.001).div(0.011).min(1).mul(Decimal.sub(1, Decimal.div(1, Decimal.max(player.points, 0).add(1).log10().add(1).log10().add(1).log10().add(1))).mul(0.875).add(0.125))
    }

    player.timeInPrestige = Decimal.add(player.timeInPrestige, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    tmp.prestigeEssenceFactors = []
    tmp.peGain = player.setbackUpgrades.includes(`b1`)
        ? Decimal.max(player.bestPointsInPrestige, 10).log(1e6).log2().pow_base(10)
        : D(0)
    tmp.prestigeEssenceFactors.push(`Base: 10<sup>log<sub>2</sub>(log<sub>1,000,000</sub>(${format(player.bestPointsInPrestige)}))</sup> → ${format(tmp.peGain, 2)}`)
    if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
        tmp.peGain = tmp.peGain.pow(HINDERANCES[0].eff)
        tmp.prestigeEssenceFactors.push(`H1 PB: ^${format(HINDERANCES[0].eff, 3)} → ${format(tmp.peGain, 2)}`)
    }
    tmp.prestigeEssenceFactors.push(`Current P. Essence: -${format(player.prestigeEssence, 2)} → ${format(tmp.peGain.sub(player.prestigeEssence).max(0), 2)}`)
    tmp.peGain = tmp.peGain.sub(player.prestigeEssence).floor().max(0)

    tmp.peNext = tmp.peGain
    tmp.peNext = tmp.peNext.add(1).floor().add(player.prestigeEssence)
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
        tmp.peEffect = tmp.peEffect.pow(total.mul(0.001).add(1))
    }

    tmp.prestigeUpgradeCap = D(4)
    if (player.prestigeChallengeCompleted.includes(0)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(1)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(2)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(3)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(6)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(7)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(8)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(9)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(10)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(11)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(12)) {
        let total = D(0)
        for (let i = 0; i < player.buyables.length; i++) {
            total = total.add(tmp.buyables[i].genLevels)
        }
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(total.log2().sub(11).max(0).floor())
    }
    if (Decimal.gte(player.hinderanceScore[1], HINDERANCES[1].start)) {
        tmp.prestigeUpgradeCap = tmp.prestigeUpgradeCap.add(2)
    }

    tmp.prestigeUsed = D(0)
    tmp.totalPrestigeUpgrades = D(0)
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        if (hasPrestigeUpgrade(i)) {
            tmp.totalPrestigeUpgrades = tmp.totalPrestigeUpgrades.add(player.prestigeUpgrades[i])
            tmp.prestigeUsed = tmp.prestigeUsed.add(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i, true)))
        }
    }
    if (player.prestigeChallenge !== null) {
        tmp.totalPrestigeUpgrades = tmp.prestigeUpgradeCap
    }

    tmp.prestigeFactors = []
    tmp.prestigeAmount = Decimal.max(player.bestPointsInPrestige, 1e5).div(1e6).log10().add(1)
    tmp.prestigeFactors.push(`Base: 1+log<sub>10</sub>(${format(player.bestPointsInPrestige)}/1,000,000) → ${format(tmp.prestigeAmount, 2)}`)
    if (Decimal.gt(player.setbackEnergy[2], 0)) {
        tmp.prestigeAmount = tmp.prestigeAmount.mul(tmp.energyEffs[2])
        tmp.prestigeFactors.push(`Blue Energy: ×${format(tmp.energyEffs[2], 2)} → ${format(tmp.prestigeAmount, 2)}`)
    }
    if (Decimal.gt(player.hinderanceScore[1], HINDERANCES[1].start)) {
        tmp.prestigeAmount = tmp.prestigeAmount.mul(HINDERANCES[1].eff)
        tmp.prestigeFactors.push(`H2 PB: ×${format(HINDERANCES[1].eff, 2)} → ${format(tmp.prestigeAmount, 2)}`)
    }
    if (player.inSetback) {
        tmp.prestigeAmount = tmp.prestigeAmount.div(tmp.setbackEffects[1])
        tmp.prestigeFactors.push(`Setback Green Effect: /${format(tmp.setbackEffects[1], 2)} → ${format(tmp.prestigeAmount, 2)}`)
    }
    if (player.currentHinderance === 1) {
        tmp.prestigeAmount = tmp.prestigeAmount.root(2)
        tmp.prestigeFactors.push(`H2 Effect: ^${format(0.5, 2)} → ${format(tmp.prestigeAmount, 2)}`)
    }
    tmp.prestigeAmount = cheatDilateBoost(tmp.prestigeAmount)
    tmp.prestigeFactors.push(`Current P. Points: -${format(player.prestige, 2)} → ${format(tmp.prestigeAmount.sub(player.prestige).max(0), 2)}`)
    tmp.prestigeAmount = tmp.prestigeAmount.sub(player.prestige).floor().max(0)

    tmp.prestigeNext = tmp.prestigeAmount.add(player.prestige).add(1)
    tmp.prestigeNext = cheatDilateBoost(tmp.prestigeNext, true)
    if (player.currentHinderance === 1) {
        tmp.prestigeNext = tmp.prestigeNext.pow(2)
    }
    if (player.inSetback) {
        tmp.prestigeNext = tmp.prestigeNext.mul(tmp.setbackEffects[1])
    }
    tmp.prestigeNext = tmp.prestigeNext.div(HINDERANCES[1].eff)
    tmp.prestigeNext = tmp.prestigeNext.div(tmp.energyEffs[2])
    tmp.prestigeNext = tmp.prestigeNext.sub(1).pow10().mul(1e6)

    // auto-prestige
    if (player.cheats.autoPrestige || Decimal.gte(player.hinderanceScore[2], HINDERANCES[2].start)) {
        player.prestige = Decimal.add(player.prestige, tmp.prestigeAmount)
        player.prestigeEssence = Decimal.add(player.prestigeEssence, tmp.peGain)
    }

    tmp.prestigePointEffect = player.prestigeChallengeCompleted.includes(3) || player.setbackUpgrades.includes('b4')
        ? Decimal.mul(player.prestige, 
            hasPrestigeUpgrade(14) 
                ? tmp.prestigeUpgEffs[14]
                : 0.2
            )
            .add(1) 
        : D(1)
    if (player.setbackUpgrades.includes('b4')) {
        tmp.prestigePointEffect = tmp.prestigePointEffect.pow(player.prestigeChallengeCompleted.includes(3) ? 2 : 1)
        tmp.prestigePointEffect = tmp.prestigePointEffect.pow(SETBACK_UPGRADES[2][3].eff)
    }
}

function updateHTML_prestige() {
    html['prestigeTab'].setDisplay(tmp.tab === 1)
    html['prestigeTabButton'].setDisplay(Decimal.gt(player.prestige, 0) || Decimal.gt(player.ascend, 0))

    if (tmp.tab === 1) {
        html['mainPrestigeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0))
        html['mainPrestigeTab'].setDisplay(tmp.prestigeTab === 0)
    
        html['prestigeChallengeTab'].setDisplay(tmp.prestigeTab === 2)
        html['prestigeChallengeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0))
        html['essencePrestigeTabButton'].setDisplay(player.setbackUpgrades.includes(`b1`))
        html['essencePrestigeTab'].setDisplay(tmp.prestigeTab === 1)
    
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
                    html[`prestigeUpgrade${i}cost`].setTxt(hasPrestigeUpgrade(i) && !player.setbackUpgrades.includes(`b2`) ? `Bought!` : `Cost: ${format(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i)))} prestige points`)
                    if (player.setbackUpgrades.includes('b3')) {
                        html[`prestigeUpgrade${i}amount`].setTxt(` ×${format(player.prestigeUpgrades[i])}`)
                    }
    
                    html[`prestigeUpgrade${i}`].changeStyle('background-color', !(hasPrestigeUpgrade(i) && !player.setbackUpgrades.includes(`b2`)) ? (canBuyPrestigeUpgrade(i) ? '#00408080' : '#00008080') : '#00808080')
                    html[`prestigeUpgrade${i}`].changeStyle('border', `3px solid ${!(hasPrestigeUpgrade(i) && !player.setbackUpgrades.includes(`b2`)) ? (canBuyPrestigeUpgrade(i) ? '#0080ff' : '#0000ff') : '#00ffff'}`)
                    html[`prestigeUpgrade${i}`].changeStyle('cursor', !(hasPrestigeUpgrade(i) && !player.setbackUpgrades.includes(`b2`)) && canBuyPrestigeUpgrade(i) ? 'pointer' : 'not-allowed')
                }
            }
    
            html['prestigePoints'].setTxt(`${format(Decimal.sub(player.prestige, tmp.prestigeUsed))}`)
            html['prestigePointEffect'].setDisplay(player.prestigeChallengeCompleted.includes(3) || player.setbackUpgrades.includes('b4'))
            if (player.prestigeChallengeCompleted.includes(3) || player.setbackUpgrades.includes('b4')) {
                html['prestigePointEffect'].setTxt(`Boosting points by ×${format(tmp.prestigePointEffect, 2)}`)
            }
            html['prestigeUpgradeCap'].setTxt(`${format(tmp.totalPrestigeUpgrades)} / ${format(tmp.prestigeUpgradeCap)}`)
        }
        if (tmp.prestigeTab === 1) {
            html['prestigeEssence'].setTxt(format(player.prestigeEssence))
            html['prestigeEssenceEffect'].setTxt(`Boosting points by ×${format(tmp.peEffect, 2)}`)
        }
        if (tmp.prestigeTab === 2) {
            for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
                html[`prestigeChallenge${i}name`].setTxt(PRESTIGE_CHALLENGES[i].name)
                html[`prestigeChallenge${i}desc`].setTxt(PRESTIGE_CHALLENGES[i].desc)
                html[`prestigeChallenge${i}goal`].setTxt(format(PRESTIGE_CHALLENGES[i].goal))
                html[`prestigeChallenge${i}reward`].setTxt(PRESTIGE_CHALLENGES[i].eff)
    
                let shown = true
                if (i === 4) {
                    shown = player.prestigeChallengeCompleted.includes(0)
                        && player.prestigeChallengeCompleted.includes(1)
                        && player.prestigeChallengeCompleted.includes(2)
                        && player.prestigeChallengeCompleted.includes(3)
                }
                if (i === 5) {
                    shown = Decimal.gte(player.ascendUpgrades[13], 1) && !(player.setbackUpgrades.includes(`b3`) && player.prestigeChallengeCompleted.includes(5))
                }
                if (i >= 6 && i <= 8) {
                    shown = player.setbackUpgrades.includes(`b3`) && player.prestigeChallengeCompleted.includes(i - 1) && !player.prestigeChallengeCompleted.includes(i)
                }
                if (i === 9) {
                    shown = player.setbackUpgrades.includes(`b3`) && player.prestigeChallengeCompleted.includes(i - 1)
                }
                if (i >= 10 && i <= 12) {
                    shown = Decimal.gte(player.ascendUpgrades[13], i - 8)
                }
    
                if (shown) {
                    html[`prestigeChallenge${i}`].changeStyle('background-color', !player.prestigeChallengeCompleted.includes(i) ? (player.prestigeChallenge === i ? '#00408080' : '#00008080') : '#00808080')
                    html[`prestigeChallenge${i}`].changeStyle('border', `3px solid ${!player.prestigeChallengeCompleted.includes(i) ? (player.prestigeChallenge === i ? '#0080ff' : '#0000ff') : '#00ffff'}`)
                    html[`prestigeChallenge${i}`].changeStyle('cursor', !player.prestigeChallengeCompleted.includes(i) ? 'pointer' : 'not-allowed')
                    html[`prestigeChallenge${i}`].setDisplay(true)
                } else {
                    html[`prestigeChallenge${i}`].setDisplay(false)
                }
            }
        }
    }
}

function toggleCurrentPrestigeChallenge() {
    togglePrestigeChallenge(player.prestigeChallenge)
}

function canBuyPrestigeUpgrade(i) {
    if (tmp.totalPrestigeUpgrades.gte(tmp.prestigeUpgradeCap)) {
        return false;
    }
    if (Decimal.sub(player.prestige, tmp.prestigeUsed).lt(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(i)))) {
        return false;
    }
    if (hasPrestigeUpgrade(i) && !player.setbackUpgrades.includes(`b2`)) {
        return false;
    }
    return true;
}

function buyPrestigeUpgrade(i) {
    if (!canBuyPrestigeUpgrade(i)) {
        return;
    }
    player.prestigeUpgrades[i] = Decimal.add(player.prestigeUpgrades[i], 1)
    player.prestigeUpgradesInCurrentAscension = true
}

function hasPrestigeUpgrade(i) {
    if (player.prestigeChallenge >= 5 && player.prestigeChallenge <= 9) {
        return false
    }
    return Decimal.gte(player.prestigeUpgrades[i], 1)
}

function prestigeUpgradeCostScaling(i, oneBefore) {
    let bought = player.prestigeUpgrades[i]
    if (oneBefore) {
        bought = Decimal.sub(bought, 1)
    }
    return Decimal.lt(bought, 1)
        ? Decimal.pow10(bought) // for when like maybe idk fractional prestige upgrade amount
        : Decimal.pow(2, bought.sub(1)).pow10()
}

function togglePrestigeChallenge(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }
    tmp.prestigeAmount = D(0)
    if (player.prestigeChallenge === null) {
        doPrestigeReset(true)
        player.prestigeChallenge = i
        return;
    }
    if (Decimal.gte(player.points, PRESTIGE_CHALLENGES[i].goal)) {
        if (!player.prestigeChallengeCompleted.includes(i)) {
            player.prestigeChallengeCompleted.push(i)
        }
    }
    doPrestigeReset(true)
    player.prestigeChallenge = null
}

function toggleHinderance(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }
    tmp.ascendAmount = D(0)
    if (player.currentHinderance === null) {
        doAscendReset(true)
        player.currentHinderance = i
        return;
    }
    doAscendReset(true)
    player.currentHinderance = null
}

function doPrestigeReset(doAnyway = false) {
    if (player.setbackUpgrades.includes(`b1`)) {
        player.prestigeEssence = Decimal.add(player.prestigeEssence, tmp.peGain)
    }
    player.prestige = Decimal.add(player.prestige, tmp.prestigeAmount)
    if (!doAnyway) {
        player.darts = Decimal.add(player.darts, tmp.dartGain)
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
    player.prestigeUpgrades = []
    doPrestigeReset(true)
}