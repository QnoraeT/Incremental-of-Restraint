"use strict";
const ASCENSION_UPGRADES = [
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[0])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(100).exp().sub(1).mul(100).pow_base(2).mul(10)
            return cost
        },
        target(resource) {
            let target = Decimal.div(resource, 10).max(1).log2().div(100).add(1).ln().mul(100)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            return Decimal.pow(1.258, player.ascendUpgrades[0])
        },
        get desc() {
            return `Multiply point gain by 25.8%. Currently: ×${format(this.eff, 2)}.`
        } 
    },
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[1])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(25).exp().sub(1).mul(25).pow_base(2.5).mul(50)
            return cost
        },
        target(resource) {
            let target = Decimal.div(resource, 50).max(1).log(2.5).div(25).add(1).ln().mul(25)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            return Decimal.pow(Decimal.max(player.ascend, 0).add(1).log10().add(1.095).pow(2), player.ascendUpgrades[1])
        },
        get desc() {
            return `Multiply generator gain by ${format(Decimal.max(player.ascend, 0).add(1).log10().add(1.095).pow(2), 2)}×. Currently: ×${format(this.eff, 2)}.`
        } 
    },
    {
        show: true,
        get cap() {
            let cap = D(5)
            if (player.transcendUpgrades.includes('ascend2')) {
                cap = cap.add(1)
            }
            return cap
        },
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[2])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.pow_base(40).mul(250)
            return cost
        },
        target(resource) {
            let target = Decimal.div(resource, 250).max(1).log(40)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            return D(1.1)
        },
        get desc() {
            return Decimal.eq(player.ascendUpgrades[2], 0)
                ? `Buyable 1's effect is raised to the ^${format(this.eff, 2)} Currently: None.`
                : Decimal.eq(player.ascendUpgrades[2], 1)
                    ? `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyable 1.`
                    : `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyables 1-${format(player.ascendUpgrades[2])}.`
        } 
    },
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[3])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(25).exp().sub(1).mul(25).pow_base(3).mul(10)
            return cost
        },
        target(resource) {
            let target = Decimal.div(resource, 10).max(1).log(3).div(25).add(1).ln().mul(25)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            let eff = Decimal.max(player.ascend, 1).log10().add(2)
            if (player.transcendUpgrades.includes('ascend4')) {
                eff = eff.mul(Decimal.max(player.ascendGems, 1).log10().add(1))
            }
            return Decimal.pow(eff, player.ascendUpgrades[3])
        },
        get desc() {
            return `Ascension Gem gain is increased based off of your Ascension Points. Currently: ×${format(this.eff, 2)}.`
        } 
    },
    ...(() => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push({
                show: true,
                cap: D(Infinity),
                req: true,
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 4])
                    if (player.transcendInSpecialReq === "point4") {
                        cost = cost.mul(1000)
                    }
                    cost = cost.div(9).add(1).pow(1.5).sub(1).exp().sub(1).mul(6).pow(2).mul(2).pow_base(i + 2).mul(100 * (2 ** i))
                    return cost
                },
                target(resource) {
                    let target = D(resource)
                    target = target.div(100 * (2 ** i)).max(1).log(i + 2).div(2).root(2).div(6).add(1).ln().add(1).root(1.5).sub(1).mul(9)
                    if (player.transcendInSpecialReq === "point4") {
                        target = target.div(1000)
                    }
                    return target
                },
                get eff() {
                    return Decimal.eq(player.ascendUpgrades[i + 4], 0) ? D(0) : Decimal.add(player.ascendUpgrades[i + 4], 1).pow_base(2)
                },
                get desc() {
                    return `Automate Buyable ${i+1}. This autobuyer can buy up to ${format(this.eff)}/s.`
                } 
            })
        }
        return arr
    })(),
    ...(() => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push({
                show: true,
                get cap() {
                    if (false) {
                        return D(Infinity)
                    }
                    let cap = D(5)
                    if (player.transcendUpgrades.includes('ascend2')) {
                        cap = cap.add(1)
                    }
                    return cap
                },
                // ! replace false with the condition to ignore the buyable limitation
                get req() {
                    return (false || Decimal.lte(player.buyables[i], 0)) && Decimal.gte(player.points, Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))
                },
                get reqDesc() {
                    if (false) {
                        return `You must reach ${format(Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))} points.`
                    } else {
                        return `You must not buy Buyable ${i+1} and you must reach ${format(Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))} points.`
                    }
                },
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 8])
                    if (player.transcendInSpecialReq === "point4") {
                        cost = cost.mul(1000)
                    }
                    cost = cost.add(1).pow_base(1000 * (2 ** i))
                    return cost
                },
                target(resource) {
                    if (!false && Decimal.gt(player.buyables[i], 0)) {
                        return D(0)
                    }
                    let target1 = D(player.ascendGems)
                    target1 = target1.max(1000 * (2 ** i)).log(1000 * (2 ** i)).sub(1)
                    if (player.transcendInSpecialReq === "point4") {
                        target1 = target1.div(1000)
                    }

                    let target2 = D(player.points)
                    target2 = target2.div(1e20 * (1e3 ** i)).max(1).log(1e3 * (10 ** i)).root(2)
                    if (player.transcendInSpecialReq === "point4") {
                        target2 = target2.div(1000)
                    }
                    return Decimal.min(target1, target2)
                },
                get eff() {
                    if (Decimal.gt(player.ascendUpgrades[i + 8], 9)) {
                        return Decimal.sub(player.ascendUpgrades[i + 8], 9).pow_base(0.9).recip().mul(10)
                    } else {
                        return Decimal.sub(1, Decimal.mul(0.1, player.ascendUpgrades[i + 8])).recip()
                    }
                },
                get desc() {
                    return `Buyable ${i+1}'s cost scaling is 10% slower. Currently: ${formatPerc(this.eff, 2)} slower.`
                } 
            })
        }
        return arr
    })(),
    {
        show: true,
        cap: D(2),
        get req() {
            return player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension
        },
        reqDesc: `You must not buy any Prestige Upgrades in the current Ascension while completing 5 Prestige Challenges.`,
        get cost() {
            let cost = D(player.ascendUpgrades[12])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.add(1).pow_base(1e6)
            return cost
        },
        target(resource) {
            if (!(player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension)) {
                return D(0)
            }
            let target = Decimal.max(player.ascendGems, 1e6).log(1e6).sub(1)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            return player.ascendUpgrades[12]
        },
        get desc() {
            return `Unlock 1 more row of Prestige Upgrades. Currently: +${format(this.eff)} rows.`
        } 
    },
    {
        show: true,
        cap: D(4),
        get req() {
            return player.prestigeChallengeCompleted.length === 0 && Decimal.gte(player.prestige, Decimal.add(player.ascendUpgrades[13], 1).pow(3).mul(10))
        },
        get reqDesc() {
            return `You must not complete any Prestige Challenges while having ${format(Decimal.add(player.ascendUpgrades[13], 1).pow(3).mul(10))} total prestige points.`
        },
        get cost() {
            let cost = D(player.ascendUpgrades[13])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.add(1).pow(2.5).pow_base(1e6).div(100)
            return cost
        },
        target(resource) {
            if (player.prestigeChallengeCompleted.length !== 0) {
                return D(0)
            }
            let target1 = Decimal.max(player.ascendGems, 1e4).mul(100).log(1e6).root(2.5).sub(1)
            if (player.transcendInSpecialReq === "point4") {
                target1 = target1.div(1000)
            }

            let target2 = Decimal.max(player.prestige, 10).div(10).root(3).sub(1)
            if (player.transcendInSpecialReq === "point4") {
                target2 = target2.div(1000)
            }
            return Decimal.min(target1, target2)
        },
        get eff() {
            return player.ascendUpgrades[13]
        },
        get desc() {
            return `Unlock another Prestige Challenge. Currently: +${format(this.eff)} challenges.`
        } 
    },
    {
        get show() {
            return hasSetbackUpgrade('g10')
        },
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[14])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(12).add(1).pow(2).sub(1).exp().sub(1).mul(6).pow(2).mul(2).pow_base(1e8).mul(1e60)
            return cost
        },
        target(resource) {
            let target = D(resource)
            target = target.div(1e60).max(1).log(1e8).div(2).root(2).div(6).add(1).ln().add(1).root(2).sub(1).mul(12)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            let eff = D(player.ascendUpgrades[14])
            if (hasTranscendMilestone(3)) {
                eff = eff.add(2)
            }
            return Decimal.pow(2, eff)
        },
        get desc() {
            return `Automate Buyable 5. This autobuyer can buy up to ${format(this.eff.mul(10))}/s.`
        } 
    },
    {
        get show() {
            return hasSetbackUpgrade('g10')
        },
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[15])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(16).add(1).pow(2).sub(1).exp().sub(1).mul(6).pow(2).mul(2).pow_base(1e10).mul(1e70)
            return cost
        },
        target(resource) {
            let target = D(resource)
            target = target.div(1e70).max(1).log(1e10).div(2).root(2).div(6).add(1).ln().add(1).root(2).sub(1).mul(16)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            let eff = D(player.ascendUpgrades[15])
            if (hasTranscendMilestone(3)) {
                eff = eff.add(2)
            }
            return Decimal.eq(eff, 0) ? D(0) : Decimal.add(eff, 1).pow_base(2)
        },
        get desc() {
            return `Automate Buyable 6. This autobuyer can buy up to ${format(this.eff)}/s.`
        } 
    },
]

const HINDERANCES = [
    {
        name: "Precision Prestige",
        desc: "You gain a certain amount of darts upon prestiging based on your points and your time since a prestige. Your dart amount must be as close to an interval of 1,000 as possible. Buyables bought must be a perfect square in order for their effects to count.",
        start: D(1e160),
        get reward() {
            return `Prestige Essence gain is raised ^${format(this.eff, 3)} and every OoM of Prestige Essence increases Generator Speed by ^1.02.`
        },
        get eff() {
            if (Decimal.lt(player.hinderanceScore[0], 1e160)) {
                return D(1)
            }
            let eff = Decimal.log(player.hinderanceScore[0], 1e40).log2().div(10).add(1)
            return eff
        },
        chalEffects(depth) {
            const obj = { dartEffect: D(1), dartGain: D(1) }
            obj.dartGain = Decimal.max(player.points, 10).slog().log10().add(1).pow(2).mul(Decimal.max(player.timeInPrestige, 0).add(1).ln()).mul(1000)
            obj.dartGain = obj.dartGain.mul(depth)

            obj.dartEffect = Decimal.max(player.darts, 0).mul(Math.PI * 0.002).cos().add(1).div(2)
            obj.dartEffect = obj.dartEffect.pow(depth)
            return obj
        },
        show: true
    },
    {
        name: "Undesirable Rot",
        desc: "Point and Generator speed decays the more you have. Every prestige point increases the requirement to the next.",
        start: D(1e75),
        get reward() {
            return `Prestige Point gain is increased by ×${format(this.eff, 3)} and Prestige Upgrade cap is increased by +2.`
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[1], 1e75)
            eff = eff.log(1e75)
            return eff
        },
        chalEffects(depth) {
            const obj = { decay: D(0.9), prestige: D(0.5) }
            obj.decay = obj.decay.pow(depth)
            obj.prestige = obj.prestige.pow(depth)

            return obj
        },
        show: true
    },
    {
        name: "Multitude",
        desc: "You are trapped in PC1x3 (the effect is applied 3 times), PC3, PC4, and PC8: Black Out III. However, PC4 does not change intervals and Prestige Upgrades are reenabled.",
        start: D(1e110),
        get reward() {
            return `Point gain is multiplied by ×${format(this.eff, 1)} and automate gaining Prestige Points and Prestige Essence.`
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[2], 1e110)
            eff = eff.log(1e110).ln().div(2).add(1).pow(2).sub(1).pow_base(1e35)
            return eff
        },
        chalEffects(depth) {
            const obj = { nerfedUpg: D(3), others: D(1) }
            obj.nerfedUpg = obj.nerfedUpg.mul(depth)
            obj.others = obj.others.mul(depth)

            return obj
        },
        show: true
    },
    {
        name: "Buyable Exclusion",
        desc: "All sources of points outside of basic buyables are raised ^0.2, including exponential changes, and the buyable interval is set to every 1,000.",
        start: D('e1000'),
        get reward() {
            return `The buyable interval boost is multiplied by ×${format(this.eff, 2)} and the buyable interval cost scaling is reduced to ×1.95.`
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[3], 'e1000')
            eff = eff.log('e1000').pow(2)
            return eff
        },
        chalEffects(depth) {
            const obj = { pts: D(0.2) }
            obj.pts = obj.pts.pow(depth)

            return obj
        },
        get show() {
            return player.transcendUpgrades.includes('hinderance1')
        }
    },
    {
        name: "Supernova",
        desc: "Every resource pre-transcension (points, prestige points, etc.)' generation is nerfed by ^0.25, and all pre-transcension buyables cost the previous effective buyable, except for the first. This forcefully resets PBs, PCs, and ascension buyables!",
        start: D('6.666e6666'),
        get reward() {
            return `Tier 1 Timespeed is ×${format(this.eff, 2)} faster, and outside of Hinderances, tier levels' effect is changed from /1.01 -> /1.011.`
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[4], '6.666e6666')
            eff = eff.log('6.666e6666').log2().pow_base(1e10)
            return eff
        },
        chalEffects(depth) {
            const obj = { resource: D(0.25) }
            obj.resource = obj.resource.pow(depth)

            return obj
        },
        get show() {
            return player.transcendUpgrades.includes('hinderance2')
        }
    },
]

function initHTML_ascend() {
    toHTMLvar('ascendTab')
    toHTMLvar('ascendTabButton')
    html['ascendTab'].setDisplay(false)
    html['ascendTabButton'].setDisplay(false)

    toHTMLvar('ascend')
    toHTMLvar('ascendAmount')
    toHTMLvar('ascendNext')
    toHTMLvar('ascendPoints')
    toHTMLvar('ascendPointEffect')
    toHTMLvar('ascendPointEffectNext')
    toHTMLvar('ascendUpgradeList')
    toHTMLvar('ascendGems')
    toHTMLvar('ascendUpgAuto')
    toHTMLvar('ascendBuyRespec')
    toHTMLvar('mainAscend')
    toHTMLvar('hinderanceAscend')
    toHTMLvar('mainAscendTabButton')
    toHTMLvar('hinderanceAscendTabButton')
    toHTMLvar('hinderanceList')

    let txt = ``
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyAscendUpgrade(${i})" id="ascendUpgrade${i}" class="whiteText font" style="height: 110px; width: 220px; font-size: 9px; margin: 2px">
                <span style="font-size: 11px;">Ascension Buyable #${i + 1}</span><br>
                <span style="font-size: 8px;" id="ascendUpgrade${i}amount"></span><br>
                <span id="ascendUpgrade${i}eff"></span><br><br>
                <span style="font-size: 8px;" id="ascendUpgrade${i}req"></span><br>
                <span id="ascendUpgrade${i}cost"></span>
            </button>
        `
    }
    html['ascendUpgradeList'].setHTML(txt)
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        toHTMLvar(`ascendUpgrade${i}`)
        toHTMLvar(`ascendUpgrade${i}eff`)
        toHTMLvar(`ascendUpgrade${i}cost`)
        toHTMLvar(`ascendUpgrade${i}req`)
        toHTMLvar(`ascendUpgrade${i}amount`)
    }

    txt = ``
    for (let i = 0; i < HINDERANCES.length; i++) {
        txt += `
        <button onclick="toggleHinderance(${i})" id="hinderance${i}" class="whiteText font" style="height: 160px; width: 320px; font-size: 10px; margin: 2px; cursor: pointer">
            <b><span id="hinderance${i}name" style="font-size: 12px">H${i+1}: ${HINDERANCES[i].name}</span></b><br>
            <span id="hinderance${i}desc">${HINDERANCES[i].desc}</span><br>
            Goal: <span id="hinderance${i}goal"></span> points<br><br>
            Reward: <span id="hinderance${i}reward"></span>
        </button>
        `
    }

    html['hinderanceList'].setHTML(txt)
    for (let i = 0; i < HINDERANCES.length; i++) {
        toHTMLvar(`hinderance${i}`)
        toHTMLvar(`hinderance${i}name`)
        toHTMLvar(`hinderance${i}desc`)
        toHTMLvar(`hinderance${i}goal`)
        toHTMLvar(`hinderance${i}reward`)
    }
}

function updateGame_ascend() {
        for (let i = HINDERANCES.length - 1; i >= 0; i--) {
        tmp.hinderances[i].entered = false
        tmp.hinderances[i].trapped = false
        tmp.hinderances[i].depth = D(0)

        // higher level stuff first
        if (player.transcendInSpecialReq === "hinderance2") {
            if (i === 2 || i === 3) {
                tmp.hinderances[i].trapped = true
                tmp.hinderances[i].depth = Decimal.add(tmp.hinderances[i].depth, 1)
            }
        }

        if (player.currentHinderance === i) {
            tmp.hinderances[i].entered = true
            tmp.hinderances[i].depth = Decimal.add(tmp.hinderances[i].depth, 1)
        }

        tmp.hinderances[i].effects = HINDERANCES[i].chalEffects(tmp.hinderances[i].depth)
    }

    if (player.currentHinderance !== null) {
        player.hinderanceScore[player.currentHinderance] = Decimal.max(player.hinderanceScore[player.currentHinderance], player.bestPointsInAscend)
    }
    for (let i = 0; i < HINDERANCES.length; i++) {
        player.bestHinderanceScore[i] = Decimal.max(player.bestHinderanceScore[i], player.hinderanceScore[i])
    }

    player.timeInAscend = Decimal.add(player.timeInAscend, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    for (let i = ASCENSION_UPGRADES.length - 1; i >= 0; i--) {
        if (player.ascendUpgrades[i] === undefined) {
            player.ascendUpgrades[i] = D(0)
        }

        tmp.ascendBuyables[i].cost = ASCENSION_UPGRADES[i].cost

        let resource
        if (tmp.hinderances[4].depth.gt(0) && i != 0) {
            resource = player.ascendUpgrades[i - 1]
        } else {
            resource = player.ascendGems
        }
        tmp.ascendBuyables[i].target = ASCENSION_UPGRADES[i].target(resource)

        if (player.cheats.autoAscendUpgrades || player.ascendUpgAuto) {
            let bought = player.ascendUpgrades[i]
            player.ascendUpgrades[i] = Decimal.min(ASCENSION_UPGRADES[i].target, ASCENSION_UPGRADES[i].cap).add(0.99999999).max(player.ascendUpgrades[i]).floor()
            if (Decimal.gt(player.ascendUpgrades[i], bought)) {
                player.ascendUpgrades[i] = Decimal.sub(player.ascendUpgrades[i], 1)
                player.ascendGems = Decimal.sub(player.ascendGems, ASCENSION_UPGRADES[i].cost).max(0) // idk why this is causing ascendGems to go negative so i put a max 0 here
                player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1)
            }
        }

        tmp.ascendBuyables[i].eff = ASCENSION_UPGRADES[i].eff
    }

    tmp.ascendReq = D(1e21)
    if (hasSetbackUpgrade(`r9`)) {
        tmp.ascendReq = tmp.ascendReq.div(SETBACK_UPGRADES[0][8].eff)
    }
    if (colorAmountTotal(2).gt(0)) {
        tmp.ascendReq = tmp.ascendReq.pow(tmp.setbackEffects[2][0])
    }
    tmp.factors.ascend = []
    tmp.ascendPointGain = Decimal.max(player.bestPointsInAscend, 1).log(tmp.ascendReq).sub(1).pow_base(1000)
    addStatFactor('ascend', `Base`, `1,000<sup>log<sub>${format(tmp.ascendReq)}</sub>(${format(player.bestPointsInAscend)})-1</sup>`, null, tmp.ascendPointGain)
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.ascendPointGain = tmp.ascendPointGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('ascend', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.ascendPointGain);
    }
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.ascendCount, 1)) {
        tmp.ascendPointGain = new Decimal(0)
        addStatFactor('ascend', `Advantageous 'Challenge'`, `...`, null, tmp.ascendPointGain)
    }
    if (player.cheats.dilate) {
        tmp.ascendPointGain = cheatDilateBoost(tmp.ascendPointGain)
        addStatFactor('ascend', `Cheats`, `...`, null, tmp.ascendPointGain)
    }
    tmp.ascendPointGain = tmp.ascendPointGain.floor()

    tmp.ascendPointNext = tmp.ascendPointGain
    tmp.ascendPointNext = cheatDilateBoost(tmp.ascendPointNext, true)
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.ascendCount, 1)) {
        tmp.ascendPointNext = new Decimal(Infinity)
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.ascendPointNext = tmp.ascendPointNext.root(tmp.hinderances[4].effects.resource);
    }
    tmp.ascendPointNext = tmp.ascendPointNext.add(1).log(1000).add(1).pow_base(tmp.ascendReq)

    tmp.autoAscend = player.cheats.autoAscend || (hasTranscendMilestone(9) && player.transcendInSpecialReq !== "prest4")
    if (tmp.autoAscend) {
        player.ascend = Decimal.add(player.ascend, tmp.ascendPointGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[0]))
    }

    tmp.ascendPointEffect = D(player.ascend)
    tmp.ascendPointEffect = tmp.ascendPointEffect.mul(ASCENSION_UPGRADES[3].eff)
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.ascendPointEffect = tmp.ascendPointEffect.pow(tmp.hinderances[4].effects.resource);
    }
    tmp.ascendPointEffect = cheatDilateBoost(tmp.ascendPointEffect)
    tmp.ascendPointEffect = tmp.ascendPointEffect.mul(tmp.timeSpeedTiers[0])

    tmp.ascendPointEffectNext = Decimal.add(player.ascend, tmp.ascendPointGain)
    tmp.ascendPointEffectNext = tmp.ascendPointEffectNext.mul(ASCENSION_UPGRADES[3].eff)
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.ascendPointEffectNext = tmp.ascendPointEffectNext.pow(tmp.hinderances[4].effects.resource);
    }
    tmp.ascendPointEffectNext = cheatDilateBoost(tmp.ascendPointEffectNext)
    tmp.ascendPointEffectNext = tmp.ascendPointEffectNext.mul(tmp.timeSpeedTiers[0])

    player.ascendGems = Decimal.add(player.ascendGems, tmp.ascendPointEffect.mul(delta))
}

function updateHTML_ascend() {
    html['ascendTab'].setDisplay(tmp.tab === 3)
    html['ascendTabButton'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e21) || Decimal.gt(player.ascend, 0))

    if (tmp.tab === 0 && tmp.mainTab === 0) {
        html['ascendAmount'].setTxt(`${format(tmp.ascendPointGain)}`);
        let show = Decimal.lt(tmp.ascendPointGain, 100)
        html['ascendNext'].setDisplay(show)
        if (show) {
            html['ascendNext'].setTxt(`Next ascension point at ${format(tmp.ascendPointNext)} points.`);
        }

        html['ascend'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e18) || Decimal.gt(player.ascend, 0));
    }

    if (tmp.tab === 3) {
        html['mainAscendTabButton'].setDisplay(hasSetbackUpgrade(`b5`))
        html['hinderanceAscendTabButton'].setDisplay(hasSetbackUpgrade(`b5`))
        html['mainAscend'].setDisplay(tmp.ascendTab === 0)
        html['hinderanceAscend'].setDisplay(tmp.ascendTab === 2)
        if (tmp.ascendTab === 0) {
            html['ascendBuyRespec'].setDisplay(hasTranscendMilestone(11))

            let notCapped, canBuy
            for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
                html[`ascendUpgrade${i}`].setDisplay(ASCENSION_UPGRADES[i].show)
                if (ASCENSION_UPGRADES[i].show) {
                    notCapped = Decimal.lt(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap)
                    canBuy = ASCENSION_UPGRADES[i].req && Decimal.gte(player.ascendGems, ASCENSION_UPGRADES[i].cost)
                    html[`ascendUpgrade${i}eff`].setTxt(ASCENSION_UPGRADES[i].desc)
                    html[`ascendUpgrade${i}cost`].setTxt(`Cost: ${format(ASCENSION_UPGRADES[i].cost)} gems`)
                    html[`ascendUpgrade${i}req`].setTxt(ASCENSION_UPGRADES[i].reqDesc === undefined ? '' : ASCENSION_UPGRADES[i].reqDesc)
                    html[`ascendUpgrade${i}amount`].setTxt(`${format(player.ascendUpgrades[i])}${!Decimal.isFinite(ASCENSION_UPGRADES[i].cap) ? '×' : ' / ' + format(ASCENSION_UPGRADES[i].cap)}`)

                    html[`ascendUpgrade${i}`].changeStyle('background-color', notCapped ? (canBuy ? '#00C00080' : ASCENSION_UPGRADES[i].req ? '#00800080' : '#80000080') : '#00FF0080')
                    html[`ascendUpgrade${i}`].changeStyle('border', `3px solid ${notCapped ? (canBuy ? '#00C000' : ASCENSION_UPGRADES[i].req ? '#008000' : '#800000') : '#00ff00'}`)
                    html[`ascendUpgrade${i}`].changeStyle('cursor', notCapped && canBuy ? 'pointer' : 'not-allowed')
                }
            }

            html['ascendPoints'].setTxt(`${format(player.ascend)}`)
            html['ascendGems'].setTxt(`${format(player.ascendGems)}`)
            html['ascendPointEffect'].setTxt(`Producing ${format(tmp.ascendPointEffect, 2)} gems per second`)
            html['ascendPointEffectNext'].setDisplay(!tmp.autoAscend)
            if (!tmp.autoAscend) {
                html['ascendPointEffectNext'].setTxt(`×${format(tmp.ascendPointEffect.eq(0) ? 1 : tmp.ascendPointEffectNext.div(tmp.ascendPointEffect), 2)} upon next reset`)
            }

            html['ascendUpgAuto'].setDisplay(hasTranscendMilestone(8))
            if (hasTranscendMilestone(8)) {
                html[`ascendUpgAuto`].changeStyle('background-color', player.ascendUpgAuto ? '#00800080' : '#80000080')
                html[`ascendUpgAuto`].changeStyle('border', `3px solid #${player.ascendUpgAuto ? '00ff00' : 'ff0000'}`)
                html[`ascendUpgAuto`].setTxt(player.ascendUpgAuto ? 'Auto: Infinity/s' : 'Auto: Off')
            }
        }
        if (tmp.ascendTab === 2) {
            for (let i = 0; i < HINDERANCES.length; i++) {
                html[`hinderance${i}`].setDisplay(HINDERANCES[i].show)
                if (HINDERANCES[i].show) {
                    html[`hinderance${i}`].changeStyle('background-color', (player.currentHinderance === i ? '#b0002080' : '#60001080'))
                    html[`hinderance${i}`].changeStyle('border', `3px solid ${Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].start) ? (player.currentHinderance === i ? '#ff809a' : '#c60078') : (player.currentHinderance === i ? '#ff0030' : '#c00020')}`)
                    html[`hinderance${i}goal`].setTxt(`${format(player.hinderanceScore[i])} / ${format(HINDERANCES[i].start)}`)
                    html[`hinderance${i}reward`].setTxt(HINDERANCES[i].reward)
                }
            }
        }
    }
}

function doAscendReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.ascendPointGain.lte(0)) {
            return;
        }

        player.ascend = Decimal.add(player.ascend, tmp.ascendPointGain)
        player.ascendCount = Decimal.add(player.ascendCount, 1)
    }

    if (player.inSetback && tmp.ascendPointGain.gt(0)) {
        player.inSetback = false
        player.setbackLoadout.push([...player.setback]) // stupid fucking butt-ugly hack to clone arrays instead of keeping them by reference
    }

    for (let i = 0; i < player.setback.length; i++) {
        player.setbackQuarks[i] = D(0)
        player.setbackEnergy[i] = D(0)
        for (let j = 0; j < player.quarkDimsAccumulated[i].length; j++) {
            player.quarkDimsBought[i][j] = D(0)
            player.quarkDimsAccumulated[i][j] = D(0)
            player.quarkDimsAutobought[i][j] = D(0)
        }
    }

    player.darts = D(0)
    player.timeInAscend = D(0)
    player.prestigeUpgradesInCurrentAscension = false
    if (!hasTranscendMilestone(0)) {
        player.prestigeChallengeCompleted = []
    }
    player.prestigeChallenge = null
    if (!hasTranscendMilestone(1)) {
        for (let i = 0; i < player.prestigeUpgrades.length; i++) {
            player.prestigeUpgrades[i] = D(0)
        }
    }
    player.prestige = D(0)
    player.prestigeEssence = D(0)
    player.bestPointsInAscend = D(0)
    player.prestigeCount = D(0)
    player.specialBuyables[0] = D(0)
    player.specialBuyables[1] = D(0)

    tmp.prestigePointGain = D(0)
    tmp.peGain = D(0)
    tmp.prestigePointNext = D(0)
    tmp.prestigePointsUsed = D(0)
    tmp.prestigeUpgCap = D(0)
    tmp.prestigePointEffect = D(1)
    doPrestigeReset(true)

    displaySetbackCompleted()
}

function toggleHinderance(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }
    if (i === 4) {
        player.prestigeChallengeCompleted = []

        for (let i = 0; i < player.prestigeUpgrades.length; i++) {
            player.prestigeUpgrades[i] = D(0)
        }

        for (let i = 0; i < player.ascendUpgrades.length; i++) {
            player.ascendUpgrades[i] = D(0)
        }
    }
    tmp.ascendPointGain = D(0)
    if (player.currentHinderance === null) {
        doAscendReset(true)
        player.currentHinderance = i
        return;
    }
    doAscendReset(true)
    player.currentHinderance = null
}

function buyAscendUpgrade(i) {
    if (!ASCENSION_UPGRADES[i].req) {
        return;
    }
    if (Decimal.gte(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap)) {
        return;
    }
    if (Decimal.lt(player.ascendGems, ASCENSION_UPGRADES[i].cost)) {
        return;
    }
    player.ascendGems = Decimal.sub(player.ascendGems, ASCENSION_UPGRADES[i].cost)
    if (shiftDown) {
        player.ascendUpgrades[i] = Decimal.max(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].target.ceil()).min(ASCENSION_UPGRADES[i].cap)
    } else {
        player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1)
    }
}

function respecAscendBuy() {
    for (let i = 0; i < player.ascendUpgrades.length; i++) {
        player.ascendUpgrades[i] = D(0)
    }
    doTranscendReset(true)
}