"use strict";
const ASCENSION_UPGRADES = [
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[0])
            cost = cost.div(100).exp().sub(1).mul(100).pow_base(2).mul(10)
            return cost
        },
        get target() {
            let target = Decimal.div(player.ascendGems, 10).max(1).log2().div(100).add(1).ln().mul(100)
            return target
        },
        get eff() {
            return Decimal.pow(1.258, player.ascendUpgrades[0])
        },
        get desc() {
            return `Multiply point gain by 25.8%. Currently: ×${format(this.eff, 2)}`
        } 
    },
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let interval = D(10)
            let costGrowth = D(2)

            let cost = D(player.ascendUpgrades[1])
            let x = cost.div(interval).floor()
            let m = cost.sub(x.mul(interval))
            cost = m.mul(costGrowth.pow(x)).add(costGrowth.pow(x).sub(1).div(costGrowth.sub(1)).mul(interval))

            cost = cost.pow_base(3).mul(50)
            return cost
        },
        get target() {
            let interval = D(10)
            let costGrowth = D(2)

            let target = Decimal.div(player.ascendGems, 50).max(1).log(3)
            let h = target.mul(costGrowth.sub(1)).div(interval).add(1).log(costGrowth).floor()
            target = target.add(interval.div(costGrowth.sub(1))).div(costGrowth.pow(h)).add(h.sub(costGrowth.sub(1).recip()).mul(interval))

            return target
        },
        get eff() {
            return Decimal.pow(Decimal.max(player.ascend, 0).add(1).log10().add(1.095).pow(2), player.ascendUpgrades[1])
        },
        get desc() {
            return `Multiply generator gain by ${format(Decimal.max(player.ascend, 0).add(1).log10().add(1.095).pow(2), 2)}×. Currently: ×${format(this.eff, 2)}`
        } 
    },
    {
        show: true,
        cap: D(5),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[2]).pow_base(40).mul(250)
            return cost
        },
        get target() {
            let target = Decimal.div(player.ascendGems, 250).max(1).log(40)
            return target
        },
        get eff() {
            return D(1.1)
        },
        get desc() {
            return Decimal.eq(player.ascendUpgrades[2], 0)
                ? `Buyable 1's effect is raised to the ^${format(this.eff, 2)} Currently: None`
                : Decimal.eq(player.ascendUpgrades[2], 1)
                    ? `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyable 1`
                    : `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyables 1-${format(player.ascendUpgrades[2])}`
        } 
    },
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let interval = D(10)
            let costGrowth = D(2)

            let cost = D(player.ascendUpgrades[3])
            let x = cost.div(interval).floor()
            let m = cost.sub(x.mul(interval))
            cost = m.mul(costGrowth.pow(x)).add(costGrowth.pow(x).sub(1).div(costGrowth.sub(1)).mul(interval))

            cost = cost.pow10().mul(10)
            return cost
        },
        get target() {
            let interval = D(10)
            let costGrowth = D(2)

            let target = Decimal.div(player.ascendGems, 10).max(1).log10()
            let h = target.mul(costGrowth.sub(1)).div(interval).add(1).log(costGrowth).floor()
            target = target.add(interval.div(costGrowth.sub(1))).div(costGrowth.pow(h)).add(h.sub(costGrowth.sub(1).recip()).mul(interval))

            return target
        },
        get eff() {
            return Decimal.pow(Decimal.max(player.ascend, 1).log10().add(2), player.ascendUpgrades[3])
        },
        get desc() {
            return `Ascension Gem gain is increased based off of your Ascension Points. Currently: ×${format(this.eff, 2)}`
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
                    cost = cost.div(6).exp().sub(1).mul(6).pow(2).mul(2).pow_base(i + 2).mul(100 * (2 ** i))
                    return cost
                },
                get target() {
                    let target = D(player.ascendGems)
                    target = target.div(100 * (2 ** i)).max(1).log(i + 2).div(2).root(2).div(6).add(1).ln().mul(6)
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
                cap: D(5),
                get req() {
                    return Decimal.lte(player.buyables[i], 0) && Decimal.gte(player.points, Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))
                },
                get reqDesc() {
                    return `You must not buy Buyable ${i+1} and you must reach ${format(Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))} points.`
                },
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 8])
                    cost = cost.add(1).pow_base(1000 * (2 ** i))
                    return cost
                },
                get target() {
                    if (Decimal.gt(player.buyables[i], 0)) {
                        return D(0)
                    }
                    let target1 = D(player.ascendGems)
                    target1 = target1.max(1000 * (2 ** i)).log(1000 * (2 ** i)).sub(1)
                    let target2 = D(player.points)
                    target2 = target2.div(1e20 * (1e3 ** i)).max(1).log(1e3 * (10 ** i)).root(2)
                    return Decimal.min(target1, target2)
                },
                get eff() {
                    return Decimal.mul(0.1, player.ascendUpgrades[i + 8])
                },
                get desc() {
                    return `Buyable ${i+1}'s cost scaling is 10% slower. Currently: -${format(this.eff.mul(100), 2)}%`
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
            cost = cost.add(1).pow_base(1e6)
            return cost
        },
        get target() {
            if (!(player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension)) {
                return D(0)
            }
            let target = Decimal.max(player.ascendGems, 1e6).log(1e6).sub(1)
            return target
        },
        get eff() {
            return player.ascendUpgrades[12]
        },
        get desc() {
            return `Unlock 1 more row of Prestige Upgrades. Currently: +${format(this.eff)} rows`
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
            cost = cost.add(1).pow(2.5).pow_base(1e6).div(100)
            return cost
        },
        get target() {
            if (player.prestigeChallengeCompleted.length !== 0) {
                return D(0)
            }
            let target1 = Decimal.max(player.ascendGems, 1e4).mul(100).log(1e6).root(2.5).sub(1)
            let target2 = Decimal.max(player.prestige, 10).div(10).root(3).sub(1)
            return Decimal.min(target1, target2)
        },
        get eff() {
            return player.ascendUpgrades[13]
        },
        get desc() {
            return `Unlock another Prestige Challenge. Currently: +${format(this.eff)} challenges`
        } 
    },
    {
        get show() {
            return player.setbackUpgrades.includes('g10')
        },
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[14]).add(2)
            cost = cost.div(6).exp().sub(1).mul(6).pow(2).mul(2).pow_base(4 + 2).mul(100 * (2 ** 4))
            return cost
        },
        get target() {
            let target = D(player.ascendGems)
            target = target.div(100 * (2 ** 4)).max(1).log(4 + 2).div(2).root(2).div(6).add(1).ln().mul(6)
            target = target.sub(2).max(-0.5)
            return target
        },
        get eff() {
            return Decimal.pow(2, player.ascendUpgrades[14])
        },
        get desc() {
            return `Automate Buyable 5. This autobuyer can buy up to ${format(this.eff.mul(10))}/s.`
        } 
    },
    {
        get show() {
            return player.setbackUpgrades.includes('g10')
        },
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[15])
            cost = cost.div(6).exp().sub(1).mul(6).pow(2).mul(2).pow_base(5 + 2).mul(100 * (2 ** 5))
            return cost
        },
        get target() {
            let target = D(player.ascendGems)
            target = target.div(100 * (2 ** 5)).max(1).log(5 + 2).div(2).root(2).div(6).add(1).ln().mul(6)
            return target
        },
        get eff() {
            return Decimal.eq(player.ascendUpgrades[15], 0) ? D(0) : Decimal.add(player.ascendUpgrades[15], 1).pow_base(2)
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
        start: D(1e40),
        get reward() {
            return `Prestige Essence gain is raised ^${format(this.eff, 3)} and every OoM of Prestige Essence increases Generator Speed by ^1.02.`
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[0], 1e40)
            eff = eff.log(1e40).log2().div(5).add(1)
            return eff
        }
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
            eff = eff.log(1e75).pow(2)
            return eff
        }
    },
    {
        name: "Multitude",
        desc: "You are trapped in Nerfed Upgrades x3 (the effect is applied 3 times), No Influencing, Stacking Interest, and Black Out III. However, S.I.'s changes to intervals don't count and Prestige Upgrades are reenabled.",
        start: D(1e110),
        get reward() {
            return `Point gain is multiplied by ×${format(this.eff, 1)} and Automate gaining Prestige Points and Prestige Essence.`
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[2], 1e110)
            eff = eff.log(1e110).log2().pow_base(1e33)
            return eff
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
    toHTMLvar('ascendUpgradeList')
    toHTMLvar('ascendGems')
    toHTMLvar('mainAscend')
    toHTMLvar('hinderanceAscend')
    toHTMLvar('mainAscendTabButton')
    toHTMLvar('hinderanceAscendTabButton')
    toHTMLvar('hinderanceList')

    let txt = ``
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyAscendUpgrade(${i})" id="ascendUpgrade${i}" class="whiteText font" style="height: 100px; width: 200px; font-size: 9px; margin: 2px">
                <span id="ascendUpgrade${i}amount"></span><br>
                <span id="ascendUpgrade${i}eff"></span><br><br>
                <span id="ascendUpgrade${i}req"></span><br>
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
            <b><span id="hinderance${i}name" style="font-size: 12px"></span></b><br>
            <span id="hinderance${i}desc"></span><br>
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
    if (player.currentHinderance === 0) {
        tmp.dartGain = Decimal.add(player.points, 10).slog().log10().add(1).pow(2).mul(Decimal.max(player.timeInPrestige, 0).add(1).ln()).mul(1000)
        tmp.dartEffect = Decimal.max(player.darts, 0).mul(Math.PI * 0.002).cos().add(1).div(2)
    }
    if (player.currentHinderance !== null) {
        player.hinderanceScore[player.currentHinderance] = Decimal.max(player.hinderanceScore[player.currentHinderance], player.bestPointsInAscend)
    }

    player.timeInAscend = Decimal.add(player.timeInAscend, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    for (let i = ASCENSION_UPGRADES.length - 1; i >= 0; i--) {
        if (player.ascendUpgrades[i] === undefined) {
            player.ascendUpgrades[i] = D(0)
        }
        if (player.cheats.autoAscendUpgrades) {
            let bought = player.ascendUpgrades[i]
            player.ascendUpgrades[i] = Decimal.min(ASCENSION_UPGRADES[i].target, ASCENSION_UPGRADES[i].cap).add(0.99999999).max(player.ascendUpgrades[i]).floor()
            if (Decimal.gt(player.ascendUpgrades[i], bought)) {
                player.ascendUpgrades[i] = Decimal.sub(player.ascendUpgrades[i], 1)
                player.ascendGems = Decimal.sub(player.ascendGems, ASCENSION_UPGRADES[i].cost).max(0) // idk why this is causing ascendGems to go negative so i put a max 0 here
                player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1)
            }
        }
    }

    tmp.ascendReq = D(1e21)
    if (player.setbackUpgrades.includes(`r9`)) {
        tmp.ascendReq = tmp.ascendReq.div(SETBACK_UPGRADES[0][8].eff)
    }
    if (player.inSetback) {
        tmp.ascendReq = tmp.ascendReq.pow(tmp.setbackEffects[2])
    }
    tmp.ascendFactors = []
    tmp.ascendAmount = Decimal.max(player.bestPointsInAscend, 1).log(tmp.ascendReq).sub(1).pow_base(1000)
    tmp.ascendFactors.push(`Base: 1,000<sup>log<sub>${format(tmp.ascendReq)}</sub>(${format(player.bestPointsInAscend)})-1</sup> → ${format(tmp.ascendAmount, 2)}`)
    if (player.cheats.dilate) {
        tmp.ascendAmount = cheatDilateBoost(tmp.ascendAmount)
        tmp.ascendFactors.push(`Cheats: ... → ${format(tmp.ascendAmount, 2)}`)
    }
    tmp.ascendAmount = tmp.ascendAmount.floor()

    tmp.ascendNext = tmp.ascendAmount
    tmp.ascendNext = cheatDilateBoost(tmp.ascendNext, true)
    tmp.ascendNext = tmp.ascendNext.add(1).log(1000).add(1).pow_base(tmp.ascendReq)

    if (player.cheats.autoAscend) {
        player.ascend = Decimal.add(player.ascend, tmp.ascendAmount.mul(delta).mul(tmp.timeSpeedTiers[0]))
    }

    tmp.ascendPointEffect = D(player.ascend)
    tmp.ascendPointEffect = tmp.ascendPointEffect.mul(ASCENSION_UPGRADES[3].eff)
    tmp.ascendPointEffect = cheatDilateBoost(tmp.ascendPointEffect)
    tmp.ascendPointEffect = tmp.ascendPointEffect.mul(tmp.timeSpeedTiers[0])

    player.ascendGems = Decimal.add(player.ascendGems, tmp.ascendPointEffect.mul(delta))
}

function updateHTML_ascend() {
    html['ascendTab'].setDisplay(player.tab === 3)
    html['ascendTabButton'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e21) || Decimal.gt(player.ascend, 0))

    if (player.tab === 3) {
        html['mainAscendTabButton'].setDisplay(player.setbackUpgrades.includes(`b5`))
        html['hinderanceAscendTabButton'].setDisplay(player.setbackUpgrades.includes(`b5`))
        html['mainAscend'].setDisplay(player.ascendTab === 0)
        html['hinderanceAscend'].setDisplay(player.ascendTab === 1)
        if (player.ascendTab === 0) {
            let notCapped, canBuy
            for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
                html[`ascendUpgrade${i}`].setDisplay(ASCENSION_UPGRADES[i].show)
                if (ASCENSION_UPGRADES[i].show) {
                    notCapped = Decimal.lt(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap)
                    canBuy = ASCENSION_UPGRADES[i].req && Decimal.gte(player.ascendGems, ASCENSION_UPGRADES[i].cost)
                    html[`ascendUpgrade${i}eff`].setTxt(ASCENSION_UPGRADES[i].desc)
                    html[`ascendUpgrade${i}cost`].setTxt(`Cost: ${format(ASCENSION_UPGRADES[i].cost)} gems`)
                    html[`ascendUpgrade${i}req`].setTxt(ASCENSION_UPGRADES[i].reqDesc === undefined ? 'No restriction.' : ASCENSION_UPGRADES[i].reqDesc)
                    html[`ascendUpgrade${i}amount`].setTxt(`${format(player.ascendUpgrades[i])} / ${format(ASCENSION_UPGRADES[i].cap)}`)
        
                    html[`ascendUpgrade${i}`].changeStyle('background-color', notCapped ? (canBuy ? '#00C00080' : ASCENSION_UPGRADES[i].req ? '#00800080' : '#80000080') : '#00FF0080')
                    html[`ascendUpgrade${i}`].changeStyle('border', `3px solid ${notCapped ? (canBuy ? '#00C000' : ASCENSION_UPGRADES[i].req ? '#008000' : '#800000') : '#00ff00'}`)
                    html[`ascendUpgrade${i}`].changeStyle('cursor', notCapped && canBuy ? 'pointer' : 'not-allowed')
                }
            }
    
            html['ascendPoints'].setTxt(`${format(player.ascend)}`)
            html['ascendGems'].setTxt(`${format(player.ascendGems)}`)
            html['ascendPointEffect'].setDisplay(true)
            html['ascendPointEffect'].setTxt(`Producing ${format(tmp.ascendPointEffect, 2)} gems per second`)
        }
        if (player.ascendTab === 1) {
            for (let i = 0; i < HINDERANCES.length; i++) {
                html[`hinderance${i}name`].setTxt(HINDERANCES[i].name)
                html[`hinderance${i}desc`].setTxt(HINDERANCES[i].desc)
                html[`hinderance${i}goal`].setTxt(`${format(player.hinderanceScore[i])} / ${format(HINDERANCES[i].start)}`)
                html[`hinderance${i}reward`].setTxt(HINDERANCES[i].reward)
    
                let shown = true
    
                if (shown) {
                    html[`hinderance${i}`].changeStyle('background-color', (player.currentHinderance === i ? '#b0002080' : '#60001080'))
                    html[`hinderance${i}`].changeStyle('border', `3px solid ${Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].start) ? (player.currentHinderance === i ? '#ff809a' : '#c60078') : (player.currentHinderance === i ? '#ff0030' : '#c00020')}`)
                    html[`hinderance${i}`].setDisplay(true)
                } else {
                    html[`hinderance${i}`].setDisplay(false)
                }
            }
        }
    }
}

function doAscendReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.ascendAmount.lte(0)) {
            return;
        }
    }

    if (player.inSetback && tmp.ascendAmount.gt(0)) {
        player.inSetback = false
        player.setbackLoadout.push(player.setback)
    }

    for (let i = 0; i < player.setback.length; i++) {
        player.setbackQuarks[i] = D(0)
        player.setbackEnergy[i] = D(0)
        for (let j = 0; j < player.quarkDimsAccumulated[i].length; j++) {
            player.quarkDimsBought[i][j] = D(0)
            player.quarkDimsAccumulated[i][j] = D(0)
        }
    }

    player.ascend = Decimal.add(player.ascend, tmp.ascendAmount)
    player.darts = D(0)
    player.timeInAscend = D(0)
    player.prestigeUpgradesInCurrentAscension = false
    player.prestigeChallengeCompleted = []
    player.prestigeChallenge = null
    player.prestigeUpgrades = []
    player.prestige = D(0)
    player.prestigeEssence = D(0)
    player.bestPointsInAscend = D(0)
    tmp.prestigeAmount = D(0)
    tmp.peGain = D(0)
    tmp.prestigeNext = D(0)
    tmp.prestigeUsed = D(0)
    tmp.prestigeUpgradeCap = 0
    tmp.prestigePointEffect = D(1)
    doPrestigeReset(true)

    displaySetbackCompleted()
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
    player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1)
}