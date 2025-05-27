"use strict";
/*
TODO: add transgender :3
(idk if i will, i'm just scared i'll accidentally offend :c)
*/

const TRANSCENSION_MILESTONES = [
    {
        baseReq: D(2),
        desc: "Keep Prestige Challenge completions on Ascension resets. You now have a button in the Prestige Challenge tab to reset Prestige Challenge completions."
    },
    {
        baseReq: D(4),
        desc: "Buyable 1-6's autobuyers are instantly unlocked and start running at 5/s, keep all prestige upgrades on Ascension resets, and prestige upgrades no longer cost prestige points."
    },
    {
        baseReq: D(10),
        desc: "Enhancement resets no longer do an ascension reset as well."
    },
    {
        baseReq: D(20),
        desc: "All Setback Dimension 1s and Red Dimensions 2-4 now have autobuyers that run at 4/s, and Ascension Buyables 15 & 16 gain 2 free levels."
    },
    {
        baseReq: D(50),
        desc: "All Setback Dimension 2s and Green Dimensions 3-5 now have autobuyers that run at 4/s, and keep the first 5 Red and green Setback upgrades."
    },
    {
        baseReq: D(128),
        desc: "All Setback Dimension 3s and Blue Dimensions 4-6 now have autobuyers that run at 4/s, and Hinderance 3's secondary effect is always active."
    },
    {
        baseReq: D(400),
        desc: "All Setback Dimension 7s now have autobuyers that run at 4/s, All Setback Dimension 1s have their autobuyers sped up to 10/s, and Hinderance 1's PB starts off at the goal."
    },
    {
        baseReq: D(1e3),
        desc: "All Setback Dimension 8s now have autobuyers that run at 4/s, All Setback Dimension 2s have their autobuyers sped up to 10/s, and Hinderance 2's PB starts off at the goal."
    },
    {
        baseReq: D(1e4),
        desc: "All Setback Dimensions 3-4 have their autobuyers sped up to 10/s, and all Ascension Buyables can be autobought with no limit."
    },
    {
        baseReq: D(1e6),
        desc: "All Setback Dimensions 5-8 have their autobuyers sped up to 10/s, and Ascension Points are automatically generated at a rate of 1%/s."
    },
    {
        baseReq: D(1e8),
        desc: "Generator XP buyables can now be autobought with no limit, and Red and Green Setback Upgrades 6-10 and Blue Setback Upgrades 1-5 are kept on transcension resets."
    },
    {
        baseReq: D(1e10),
        desc: "Ascension Buyables 9-16 are kept on Transcension resets."
    },
    {
        baseReq: D(1e12),
        desc: "Hinderances keep at least ^0.5 of your highest PB in them after a Transcension reset."
    },
    {
        baseReq: D(1e15),
        desc: "Enhancers are automatically generated at a rate of 1%/s, and your Generator XP gain is based on your best XP rate."
    },
    {
        baseReq: D(1e20),
        desc: "Start off with a (10, 10, 10) setback loadout automatically equipped, and all Enhancer buyables can be automatically bought with no limit."
    }
]

const TU_ColorIDs = {
    basic: 'ffffff',
    prestige: '0080ff',
    ascend: '00ff00',
    hinderance: 'ff0040',
    gen: '00ff40',
    genXP: 'ff8000',
    genEnh: 'ffff00'
}

/*
if (TRANSCENSION_UPGRADES[i][j].unlock.restriction !== null) {
    showRestriction()
}

function enterTransUpgRestr(i, j) {
    if (!tmp.transUpgClicked[0] === i && tmp.transUpgClicked[1] === j) {
        return;
    }
    doTranscendReset(true)
    TRANSCENSION_UPGRADES[i][j].unlock.restriction()
}
*/

const TRANSCENSION_UPGRADES = [
    [
        {
            id: "base",
            color: "basic",
            cost: D(1),
            prereq: null,
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Patience",
            get desc() {
                return `Point gain is boosted by ${format(tmp.transEffs[0][0], 2)}× based off time since a transcension.`
            },
            get eff() {
                return Decimal.max(player.timeInTranscension, 0).div(86400).add(1).ln().pow_base(Number.MAX_VALUE)
            }
        }
    ],
    [
        {
            id: "point1",
            color: "basic",
            cost: D(1),
            prereq: ["base"],
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Double the fun?",
            get desc() {
                return `The Buyable interval effect boost is doubled.`
            },
            eff: null
        },
        {
            id: "prest1",
            color: "prestige",
            cost: D(1),
            prereq: ["point1"],
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Double the prestige?",
            get desc() {
                return `Prestige point gain is doubled.`
            },
            eff: null
        },
        {
            id: "ascend1",
            color: "ascend",
            cost: D(2),
            prereq: ["prest1"],
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Double the speed?",
            get desc() {
                return `Tier 1 Time Speed is doubled.`
            },
            eff: null
        },
    ],
    [
        {
            id: "point2",
            color: "basic",
            cost: D(5),
            prereq: ["point1"],
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Extra Synergy",
            get desc() {
                return `Product of generator levels also boost points. Currently: <b>${format(this.eff, 2)}×</b>`
            },
            get eff() {
                let product = D(1)
                for (let i = 0; i < player.buyables.length; i++) {
                    product = product.mul(tmp.buyables[i].genLevels.max(1))
                }
                return product
            }
        },
        {
            id: "prest2",
            color: "prestige",
            cost: D(5),
            prereq: ["prest1"],
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Tier Combine",
            get desc() {
                return `Tiers also slow down Prestige Point scaling. Currently: <b>/${format(this.eff, 3)}</b>`
            },
            get eff() {
                let total = D(0)
                for (let i = 0; i < player.buyables.length; i++) {
                    total = total.add(tmp.buyables[i].tierLevels)
                }
                return total.pow_base(0.9999)
            }
        },
        {
            id: "ascend2",
            color: "ascend",
            cost: D(5),
            prereq: ["ascend1"],
            shown: true,
            unlock: {
                req: true,
                restriction: null,
                desc: ''
            },
            name: "Cap Extender",
            get desc() {
                return `Increase the cap of Ascension Buyables 3 and 9-12 by 1 purchase.`
            },
            eff: null
        },
    ],
    [
        {
            id: "point3",
            color: "basic",
            cost: D(25),
            prereq: ["point2"],
            get shown() {
                return player.transcendUpgrades.includes('point1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && !player.buyableInTranscension[4] && !player.buyableInTranscension[5]
                },
                restriction: null,
                desc: 'You must reach 1.000e2,400 points and never by Buyables 5 & 6 in the Transcension run.'
            },
            name: "Buyable 7?!",
            get desc() {
                return `Unlock a Special buyable (in another tab) that costs points and boosts your point gain directly. It also does not reset on prestige resets.`
            },
            eff: null
        },
        {
            id: "prest3",
            color: "prestige",
            cost: D(25),
            prereq: ["prest2"],
            get shown() {
                return player.transcendUpgrades.includes('prest1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2000') && player.prestigeChallengeCompleted.filter((completed) => completed >= 7).length === 0
                },
                restriction: null,
                desc: 'Reach 1.000e2,000 points while never completing PC7+ in the current Transcension run.'
            },
            name: "Savings Account",
            get desc() {
                return `Buyables do not deduct currency, and PC3's effect is squared.`
            },
            eff: null
        },
        {
            id: "ascend3",
            color: "ascend",
            cost: D(25),
            prereq: ["ascend2"],
            get shown() {
                return player.transcendUpgrades.includes('ascend1')
            },
            unlock: {
                get req() {
                    return Decimal.lte(player.ascendUpgrades[1], 0) && Decimal.lte(player.generatorFeatures.totalEnh, 0) && player.setbackLoadout.filter((array) => (Decimal.eq(array[0], 4) && Decimal.eq(array[1], 10) && Decimal.eq(array[2], 4))).length >= 1
                },
                restriction: null,
                desc: 'Complete setback (4, 10, 4) without having Ascension Buyable 2 nor Generator Enhancers in the current Transcension run.'
            },
            name: "Generator Ascensions",
            get desc() {
                return `Ascension gems drastically increase the base boost for generators. Currently: <b>^${format(this.eff, 3)}</b>`
            },
            get eff() {
                return Decimal.max(player.ascendGems, 10).log10().log10().add(1).pow(2)
            }
        },
    ],
    [
        {
            id: "hinderance1",
            color: "hinderance",
            cost: D(150),
            prereq: ['point3', 'prest3', 'ascend3'],
            get shown() {
                return player.transcendUpgrades.includes('point2') && player.transcendUpgrades.includes('prest2') && player.transcendUpgrades.includes('ascend2')
            },
            unlock: {
                get req() {
                    if (!player.inSetback) {
                        return false;
                    }
                    if (Decimal.neq(player.setback[0], 4) || Decimal.neq(player.setback[1], 4)) {
                        return false;
                    }
                    if (player.currentHinderance !== 1) {
                        return false;
                    }
                    if (Decimal.gt(player.generatorFeatures.enhancerBuyables[1], 0)) {
                        return false;
                    }
                    let best = D(0)
                    for (let i = 0; i < player.buyables.length; i++) {
                        best = best.max(tmp.buyables[i].genlevels)
                    }
                    return best.gte(40)
                },
                restriction: null,
                desc: 'Enter setback (4, 4, Any) and Hinderance 2, then reach a highest generator level of 40 without Gen. Enh. Buyable #2.'
            },
            name: "Truly a Hinderance",
            get desc() {
                return `Unlock Hinderance 4, and Red Energy's milestone-like boosts are squared.`
            },
            eff: null
        }
    ],
    [
        {
            id: "gen1",
            color: "gen",
            cost: D(4000),
            prereq: ["hinderance"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && player.inTransUpg === "gen1"
                },
                restriction() {
                    player.inSetback = true
                    player.setback = [D(0), D(3), D(0)]
                },
                desc: 'You must start a transcension reset in Setback (0, 3, 0) and reach 1.000e2,400 points.'
            },
            name: "Extra Synergy II",
            get desc() {
                return `Generator points also boost points. Currently: <b>${format(this.eff, 2)}×</b>`
            },
            get eff() {
                let product = D(1)
                for (let i = 0; i < player.buyables.length; i++) {
                    product = product.mul(Decimal.max(player.buyablePoints, 0).add(1).log10().add(1))
                }
                return product
            }
        },
        {
            id: "exp1",
            color: "genXP",
            cost: D(12000),
            prereq: ["hinderance"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && (player.generatorFeatures.buyable.filter((bought) => Decimal.neq(bought, 0)).length === 0) && (player.generatorFeatures.enhancerBuyables.filter((bought) => Decimal.neq(bought, 0)).length === 0)
                },
                restriction: null,
                desc: 'You must reach 1.000e2,400 points without buying any generator XP nor Enhancer buyables in the current transcension.'
            },
            name: "Expert Efficiency",
            get desc() {
                return `The generator experience gain's coefficient is decreased from 200 to 150, meaning now, every 150 total generator levels will multiply your generator XP gain by 10×.`
            },
            eff: null
        },
        {
            id: "ascend4",
            color: "ascend",
            cost: D(1e6),
            prereq: ["hinderance"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance')
            },
            unlock: {
                get req() {
                    let valid = true
                    for (let i = 0; i < player.ascendUpgrades.length; i++) {
                        if ((i >= 0 && i <= 4) || (i >= 8 && i <= 13)) {
                            if (Decimal.gt(player.ascendUpgrades[i], 0)) {
                                valid = false
                            }
                        }
                    }
                    return Decimal.gte(player.bestPointsInTranscend, 'e3500') && valid
                },
                restriction: null,
                desc: 'You may only buy Ascension Buyables #5-8 and #14-16 in the current transcension run, and reach 1.000e3,500 points.'
            },
            name: "Fortune III",
            get desc() {
                return `Ascension Upgrade 4 is boosted by your ascension gems as well.`
            },
            eff: null
        },
    ],
    [
        {
            id: "gen2",
            color: "gen",
            cost: D(4.5e8),
            prereq: ["gen1"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e4000') && !player.prestigeChallengeCompleted.includes(0)
                },
                restriction: null,
                desc: 'You must never complete PC1 in the current transcension run, and you must reach 1.000e4,000 points.'
            },
            name: "Tier Level Interest",
            get desc() {
                return `Every tier increases generator speed by +^0.0001, and every level increases tier gain by +0.001×.`
            },
            eff: null
        },
        {
            id: "exp2",
            color: "genXP",
            cost: D(1e9),
            prereq: ["exp1"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && player.inTransUpg === "exp2"
                },
                restriction: null,
                desc: 'You must reach 1.000e2,400 points while Tiers are always active, are 1,000× faster, and speed up buyable costs instead of slowing down. Gen. Enh. Buyable #3 slows down Tier gain exponentially.'
            },
            name: "Point Enhancers",
            get desc() {
                return `Enhancers also boost point gain. Currently: <b>${format(this.eff, 3)}</b>`
            },
            get eff() {
                return Decimal.max(player.generatorFeatures.enhancer, 0).add(1).log10().add(1).log10().div(20).add(1)
            }
        },
        {
            id: "prest4",
            color: "prestige",
            cost: D(1e11),
            prereq: ["ascend4"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && Decimal.lte(player.prestigeCountInTrans, 1) && Decimal.lte(player.ascendCount, 1) && Decimal.lte(player.enhanceCount, 1)
                },
                restriction: null,
                desc: 'You may only prestige, ascend, and enhance once in a transcension reset, and reach 1.000e2,400 points. (Remember, challenges don\'t count.)'
            },
            name: "Advantageous 'Challenge'",
            get desc() {
                return `Unlock the ability to buy half a prestige upgrade, and PC4's effect always applies outside of prestige challenges without its debuffs. PC4 is unchanged.`
            },
            eff: null
        },
    ],
    [
        {
            id: "gen3",
            color: "gen",
            cost: D(1e13),
            prereq: ["gen2"],
            get shown() {
                return player.transcendUpgrades.includes('gen1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.setbackEnergy[1], Number.MAX_VALUE) && player.inTransUpg === "gen3"
                },
                restriction() {
                    player.inSetback = true
                    player.setback = [D(5), D(0), D(5)]
                },
                desc: 'You must start a transcension with Setback (5, 0, 5) and reach 1.798e308 Green Energy.'
            },
            name: "Energy Generation",
            get desc() {
                return `Green Energy also affects generator levels at a reduced rate. Currently: <b>×${format(this.eff, 3)}</b>`
            },
            get eff() {
                return Decimal.max(player.setbackEnergy[1], 0).add(1).log10().add(1).log10().add(1).log10().div(10).add(1).recip()
            }
        },
        // {
        //     id: "exp3",
        //     color: "genXP",
        //     cost: D(1e16),
        //     prereq: ["exp2"],
        //     get shown() {
        //         return player.transcendUpgrades.includes('exp1')
        //     },
        //     unlock: {
        //         get req() {
        //             return Decimal.gte(player.bestPointsInTranscend, 'e2400') && player.inTransUpg === "exp2"
        //         },
        //         restriction: null,
        //         desc: 'You must reach 1.000e2,400 points while Tiers are always active, are 1,000× faster, and speed up buyable costs instead of slowing down. Gen. Enh. Buyable #3 slows down Tier gain exponentially.'
        //     },
        //     name: "Point Enhancers",
        //     get desc() {
        //         return `Enhancers also boost point gain. Currently: <b>${format(this.eff, 3)}</b>`
        //     },
        //     get eff() {
        //         return Decimal.max(player.generatorFeatures.enhancer, 0).add(1).log10().add(1).log10().div(20).add(1)
        //     }
        // },
        // {
        //     id: "prest3",
        //     color: "prestige",
        //     cost: D(1e11),
        //     prereq: ["ascend4"],
        //     get shown() {
        //         return player.transcendUpgrades.includes('hinderance')
        //     },
        //     unlock: {
        //         get req() {
        //             return Decimal.gte(player.bestPointsInTranscend, 'e2400') && Decimal.lte(player.prestigeCountInTrans, 1) && Decimal.lte(player.ascendCount, 1) && Decimal.lte(player.enhanceCount, 1)
        //         },
        //         restriction: null,
        //         desc: 'You may only prestige, ascend, and enhance once in a transcension reset, and reach 1.000e2,400 points. (Remember, challenges don\'t count.)'
        //     },
        //     name: "Advantageous 'Challenge'",
        //     get desc() {
        //         return `Unlock the ability to buy half a prestige upgrade, and PC4's effect always applies outside of prestige challenges without its debuffs. PC4 is unchanged.`
        //     },
        //     eff: null
        // },
    ],
]

function initHTML_transcend() {
    toHTMLvar('transcendTab')
    toHTMLvar('transcendTabButton')
    html['transcendTab'].setDisplay(false)
    // html['transcendTabButton'].setDisplay(false)

    toHTMLvar('transcend')
    toHTMLvar('transcendAmount')
    toHTMLvar('transcendNext')
    toHTMLvar('transcendPoints')
    toHTMLvar('transcendPointEffect')
    toHTMLvar('transcendResets')
    toHTMLvar('transcendResetEffect')

    toHTMLvar('upgradeTransTabButton')
    toHTMLvar('milestoneTransTabButton')
    toHTMLvar('UpgradeTransTab')
    toHTMLvar('MilestoneTransTab')

    toHTMLvar('transMilestoneList')

    let txt = ``
    for (let i = TRANSCENSION_MILESTONES.length - 1; i >= 0; i--) {
        txt += `
            <div style="font-size: 12px; width: 600px; margin: 4px; padding: 4px;" class="flex-vertical whiteText font" id="transcendMilestone${i}">
                <b style="font-size: 16px">Milestone ${i+1}</b><br>
                <span id="transcendMilestone${i}desc" style="text-align: center">${TRANSCENSION_MILESTONES[i].desc}</span>
                <span id="transcendMilestone${i}req" style="text-align: center"></span>
            </div>
        `
    }
    html['transMilestoneList'].setHTML(txt)

    for (let i = TRANSCENSION_MILESTONES.length - 1; i >= 0; i--) {
        toHTMLvar(`transcendMilestone${i}`)
        toHTMLvar(`transcendMilestone${i}desc`)
        toHTMLvar(`transcendMilestone${i}req`)
    }
}

function updateGame_transcend() {
    player.timeInTranscension = Decimal.add(player.timeInTranscension, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    tmp.transcendReq = D('e2400')
    tmp.transcendFactors = []
    tmp.transcendAmount = Decimal.div(player.bestPointsInTranscend, tmp.transcendReq).pow(0.0005)
    tmp.transcendFactors.push(`Base: (${format(player.bestPointsInTranscend)}/${format('e2400')})<sup>0.0005</sup> → ${format(tmp.transcendAmount, 2)}`)
    if (player.cheats.dilate) {
        tmp.transcendAmount = cheatDilateBoost(tmp.transcendAmount)
        tmp.transcendFactors.push(`Cheats: ... → ${format(tmp.transcendAmount, 2)}`)
    }
    tmp.transcendAmount = tmp.transcendAmount.floor()

    tmp.transcendNext = tmp.transcendAmount
    tmp.transcendNext = cheatDilateBoost(tmp.transcendNext, true)
    tmp.transcendNext = tmp.transcendNext.add(1).root(0.0005).mul(tmp.transcendReq)

    tmp.transcendEffect = Decimal.max(player.transcendPointTotal, 0).add(1).log10().add(1).ln().mul(2).pow10()
    tmp.transcendResetEffect = Decimal.max(player.transcendResetCount, 0).pow_base(2) // this is probably risky, i should change this at some point
}

function updateHTML_transcend() {
    html['transcendTab'].setDisplay(tmp.tab === 5)
    // html['transcendTabButton'].setDisplay(Decimal.gt(player.transcendResetCount, 0))
    if (tmp.tab === 5) {
        html['transcendPoints'].setTxt(`${format(player.transcendPoints)}`)
        html['transcendPointEffect'].setTxt(`Multiplying point gain by ${format(tmp.transcendEffect, 2)}`)
        html['transcendResets'].setTxt(`${format(player.transcendResetCount)}`)
        html['transcendResetEffect'].setTxt(`Multiplying point gain by ${format(tmp.transcendResetEffect, 2)}`)

        html['MilestoneTransTab'].setDisplay(tmp.transTab === 0)
        html['UpgradeTransTab'].setDisplay(tmp.transTab === 1)
        if (tmp.transTab === 0) {
            for (let i = 0; i < TRANSCENSION_MILESTONES.length; i++) {
                if (i > 0) {
                    html[`transcendMilestone${i}`].setDisplay(willGetTM(i - 1))
                }
                html[`transcendMilestone${i}`].changeStyle('background-color', hasTranscendMilestone(i) ? '#8000FF80' : '#40008080')
                html[`transcendMilestone${i}`].changeStyle('border', hasTranscendMilestone(i) ? '4px solid #8000FF' : '3px solid #400080')
                html[`transcendMilestone${i}req`].setHTML(`Requirement: ${willGetTM(i) && !hasTranscendMilestone(i) ? '<b>' : ''}${format(player.transcendPointTotal)} (+${format(tmp.transcendAmount)}) / ${format(TRANSCENSION_MILESTONES[i].baseReq.div(Decimal.pow(2, player.transcendResetCount)))}${willGetTM(i) && !hasTranscendMilestone(i) ? '</b>' : ''} Total Transcension Points`)
            }
        }
        if (tmp.transTab === 1) {

        }
    }
}

function hasTranscendMilestone(id) {
    return Decimal.gte(player.transcendPointTotal, getTranscendMilestoneReq(id))
}

function willGetTM(id) {
    return Decimal.add(player.transcendPointTotal, tmp.transcendAmount).mul(2).gte(getTranscendMilestoneReq(id))
}

function getTranscendMilestoneReq(id) {
    return TRANSCENSION_MILESTONES[id].baseReq.div(Decimal.pow(2, player.transcendResetCount))
}

// ! note, Gen XP may not reset correctly!
function doTranscendReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.transcendAmount.lte(0)) {
            return
        }
    }

    player.transcendPoints = Decimal.add(player.transcendPoints, tmp.transcendAmount)
    player.transcendPointTotal = Decimal.add(player.transcendPointTotal, tmp.transcendAmount)
    player.transcendResetCount = Decimal.add(player.transcendResetCount, 1)

    player.bestPointsInTranscend = D(0)
    player.timeInTranscension = D(0)
    player.bestTotalGenLvs = D(0)
    for (let i = 0; i < player.buyables.length; i++) {
        player.buyableTierPoints = D(0)
    }
    player.prestigeCountInTrans = D(0)
    player.currentHinderance = null
    for (let i = 0; i < HINDERANCES.length; i++) {
        player.hinderanceScore = D(0)
    }
    player.ascend = D(0)
    player.ascendCount = D(0)
    player.ascendGems = D(0)
    player.ascendUpgrades = []
    player.currentSetback = null
    player.inSetback = false
    player.setbackLoadout = []
    player.setbackUpgrades = []
    player.generatorFeatures.xp = D(0)
    player.generatorFeatures.buyable = [D(0), D(0)]
    player.generatorFeatures.enhancer = D(0)
    player.generatorFeatures.totalEnh = D(0)
    player.generatorFeatures.enhancerBuyables = [D(0), D(0), D(0), D(0), D(0), D(0)]
    player.generatorFeatures.enhanceCount = D(0)

    tmp.generatorFeatures.genXPBuyables = resetGenXPBuyables()
    tmp.generatorFeatures.genEnhBuyables = resetGenEnhBuyables()
    tmp.ascendAmount = D(0)

    doAscendReset(true)
}