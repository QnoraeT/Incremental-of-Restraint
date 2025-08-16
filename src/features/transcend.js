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
        desc: "All Setback Dimension 3s and Blue Dimensions 4-6 now have autobuyers that run at 4/s, and Hinderance 3's PB starts off at the goal."
    },
    {
        baseReq: D(400),
        desc: "All Setback Dimension 5 & 6s now have autobuyers that run at 4/s, All Setback Dimension 1s have their autobuyers sped up to 10/s, and Hinderance 1's PB starts off at the goal."
    },
    {
        baseReq: D(1e3),
        desc: "All Setback Dimension 7 & 8s now have autobuyers that run at 4/s, All Setback Dimension 2s have their autobuyers sped up to 10/s, and Hinderance 2's PB starts off at the goal."
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

const TRANSCENSION_PERKS = [
    {
        show: true,
        unlocked: true,
        desc: 'Add <span style="color; #ffff00">Yellow</span> setback, which influences Generator XP and Enhancers.'
    },
    {
        show: true,
        unlocked: true,
        desc: 'PCs 1-13 can be completed one more time with varying new restrictions and rewards.'
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
                restriction: false,
                desc: ''
            },
            name: "Patience",
            get desc() {
                return `Point gain is boosted by <b>${format(tmp.transEffs[0][0][0], 2)}×</b>, then <b>^${format(tmp.transEffs[0][0][1], 3)}</b> based off time since a transcension.`
            },
            get eff() {
                const eff = [
                    Decimal.max(player.timeInTranscension, 0).div(86400).add(1).ln().pow_base(Number.MAX_VALUE), 
                    Decimal.max(player.timeInTranscension, 0).div(86400).add(1).ln().sqrt().mul(0.125).add(1)
                ]
                if (player.currentHinderance === 3) {
                    eff[1] = eff[1].pow(0.2)
                }
                return eff
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
                restriction: false,
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
                restriction: false,
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
                restriction: false,
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
                restriction: false,
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
                restriction: false,
                desc: ''
            },
            name: "Tier Combine",
            get desc() {
                return `Tiers also slow down Prestige Point scaling. Currently: <b>/${format(this.eff, 3)}</b>`
            },
            get eff() {
                let total = D(0)
                for (let i = 0; i < player.buyables.length; i++) {
                    total = total.add(tmp.buyables[i].tierLevels.sub(1))
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
                restriction: false,
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
                restriction: false,
                get desc() {
                    return `You must reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e2400'), format(player.bestPointsInTranscend) + ' / 1.000e2,400')} points and never buy Buyables ${conditionMet(!player.buyableInTranscension[4])} 5 & ${conditionMet(!player.buyableInTranscension[5])} 6 in the Transcension run.`
                }
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
                restriction: false,
                get desc() {
                    return `Reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e2000'), format(player.bestPointsInTranscend) + ' / 1.000e2,000')} points while never completing ${conditionMet(player.prestigeChallengeCompleted.filter((completed) => completed >= 7).length === 0)} PC7+ in the current Transcension run.`
                }
            },
            name: "Savings Account",
            get desc() {
                return `Buyables do not deduct currency, and PC4's effect is squared.`
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
                restriction: false,
                get desc() {
                    return `Complete ${conditionMet(player.setbackLoadout.filter((array) => (Decimal.eq(array[0], 4) && Decimal.eq(array[1], 10) && Decimal.eq(array[2], 4))).length >= 1)} setback (4, 10, 4) without having ${conditionMet(Decimal.lte(player.ascendUpgrades[1], 0))} Ascension Buyable 2 nor ${conditionMet(Decimal.lte(player.generatorFeatures.totalEnh, 0))} Generator Enhancers in the current Transcension run.`
                }
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
                    if (!(player.inSetback && Decimal.eq(player.setback[0], 4) && Decimal.eq(player.setback[1], 4))) {
                        return false;
                    }
                    if (player.currentHinderance !== 1) {
                        return false;
                    }
                    if (Decimal.gt(player.generatorFeatures.enhancerBuyables[1], 0)) {
                        return false;
                    }
                    return tmp.buyables.reduce((accumulator, current) => Decimal.max(accumulator, current.genLevels)).gte(40)
                },
                restriction: false,
                get desc() {
                    return `Enter setback ${conditionMet(player.inSetback && Decimal.eq(player.setback[0], 4) && Decimal.eq(player.setback[1], 4))} (4, 4, Any) and ${conditionMet(player.currentHinderance === 1)} Hinderance 2, then reach a highest generator level of ${conditionMet(tmp.buyables.reduce((accumulator, current) => Decimal.max(accumulator, current.genLevels)).gte(40), format(tmp.buyables.reduce((accumulator, current) => Decimal.max(accumulator, current.genLevels))) + ' / 40')} without Gen. Enh. Buyable #2.`
                }
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
            prereq: ["hinderance1"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && player.transcendInSpecialReq === "gen1"
                },
                restriction: true,
                get desc() {
                    return `You must start a transcension reset in Setback ${conditionMet(player.transcendInSpecialReq === 'gen1')} (0, 3, 0) and reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e2400'), format(player.bestPointsInTranscend) + ' / 1.000e2,400')} points.`
                }
            },
            name: "Extra Synergy II",
            get desc() {
                return `Generator points also boost points. Currently: <b>${format(this.eff, 2)}×</b>`
            },
            get eff() {
                let product = D(1)
                for (let i = 0; i < player.buyables.length; i++) {
                    product = product.mul(Decimal.max(player.buyablePoints[i], 0).add(1).log10().add(1).pow(2))
                }
                return product
            }
        },
        {
            id: "exp1",
            color: "genXP",
            cost: D(12000),
            prereq: ["hinderance1"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2400') && (player.generatorFeatures.buyable.filter((bought) => Decimal.neq(bought, 0)).length === 0) && (player.generatorFeatures.enhancerBuyables.filter((bought) => Decimal.neq(bought, 0)).length === 0)
                },
                restriction: false,
                get desc() {
                    return `You must reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e2400'), format(player.bestPointsInTranscend) + ' / 1.000e2,400')} points without buying any ${conditionMet(player.generatorFeatures.buyable.filter((bought) => Decimal.neq(bought, 0)).length === 0)} generator XP nor ${conditionMet(player.generatorFeatures.enhancerBuyables.filter((bought) => Decimal.neq(bought, 0)).length === 0)} Enhancer buyables in the current transcension.`
                }
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
            prereq: ["hinderance1"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance1')
            },
            unlock: {
                get req() {
                    let valid = true
                    for (let i = 0; i < player.ascendUpgrades.length; i++) {
                        if ((i >= 0 && i <= 3) || (i >= 8 && i <= 12)) {
                            if (Decimal.gt(player.ascendUpgrades[i], 0)) {
                                valid = false
                            }
                        }
                    }
                    return Decimal.gte(player.bestPointsInTranscend, 'e1600') && valid
                },
                restriction: false,
                get desc() {
                    let valid = true
                    for (let i = 0; i < player.ascendUpgrades.length; i++) {
                        if ((i >= 0 && i <= 3) || (i >= 8 && i <= 12)) {
                            if (Decimal.gt(player.ascendUpgrades[i], 0)) {
                                valid = false
                            }
                        }
                    }
                    return `You may only buy ${conditionMet(valid)} Ascension Buyables #5-8 and #14-16 in the current transcension run, and reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e1600'), format(player.bestPointsInTranscend) + ' / 1.000e1,600')} points.`
                }
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
                return player.transcendUpgrades.includes('hinderance1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e2000') && !player.prestigeChallengeCompleted.includes(0)
                },
                restriction: false,
                get desc() {
                    return `You must never complete ${conditionMet(!player.prestigeChallengeCompleted.includes(0))} PC1 in the current transcension run, and you must reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e2000'), format(player.bestPointsInTranscend) + ' / 1.000e2,000')} points.`
                }
            },
            name: "Tier Level Interest",
            get desc() {
                return `Every buyable's tier increases their generator speed by +^0.0001, and every buyables' level increases their tier gain by +0.001×.`
            },
            eff: null
        },
        {
            id: "exp2",
            color: "genXP",
            cost: D(1e9),
            prereq: ["exp1"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, 'e6000') && player.transcendInSpecialReq === "exp2"
                },
                restriction: true,
                get desc() {
                    return `You must reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e6000'), format(player.bestPointsInTranscend) + ' / 1.000e6,000')} points ${conditionMet(player.transcendInSpecialReq === "exp2")} while Tiers are always active, are 1,000× faster, and speed up buyable costs instead of slowing down. However, Gen. Enh. Buyable #3 slows down Tier gain exponentially and all other factors to tier gain are disabled.`
                }
            },
            name: "Point Enhancers",
            get desc() {
                return `Enhancers also boost point gain. Currently: <b>^${format(this.eff, 3)}</b>`
            },
            get eff() {
                let eff = Decimal.max(player.generatorFeatures.enhancer, 0).add(1).log10().add(1).log10().div(20).add(1)
                if (player.currentHinderance === 3) {
                    eff = eff.pow(0.2)
                }
                return eff
            }
        },
        {
            id: "prest4",
            color: "prestige",
            cost: D(1e11),
            prereq: ["ascend4"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, '7.777e7777') && Decimal.lte(player.prestigeCountInTrans, 1) && Decimal.lte(player.ascendCount, 1) && Decimal.lte(player.enhanceCount, 1) && player.transcendInSpecialReq === "prest4"
                },
                restriction: true,
                get desc() {
                    return `${conditionMet(player.transcendInSpecialReq === "prest4")} Auto-prestige, prestige essence, ascend, and enhancer gains are disabled. You may only ${conditionMet(Decimal.lte(player.prestigeCountInTrans, 1))} prestige, ${conditionMet(Decimal.lte(player.ascendCount, 1))} ascend, and ${conditionMet(Decimal.lte(player.enhanceCount, 1))} enhance once in a transcension reset, and reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, '7.777e7777'), format(player.bestPointsInTranscend) + ' / 7.777e7,777')} points. (Remember, challenges don't count.)`
                }
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
                    return Decimal.gte(player.setbackEnergy[1], 'e1000') && player.transcendInSpecialReq === "gen3"
                },
                restriction: true,
                get desc() {
                    return `You must start a transcension with Setback ${conditionMet(player.transcendInSpecialReq === 'gen3')} (5, 0, 5) and reach ${conditionMet(Decimal.gte(player.setbackEnergy[1], 'e1000'), format(player.setbackEnergy[1]) + ' / 1.000e1,000')} Green Energy.`
                }
            },
            name: "Energy Generation",
            get desc() {
                return `Green Energy also affects generator levels at a reduced rate. Currently: <b>×${format(this.eff, 3)}</b>`
            },
            get eff() {
                return Decimal.max(player.setbackEnergy[1], 0).add(1).log10().add(1).log10().add(1).log10().div(10).add(1).recip()
            }
        },
        {
            id: "exp3",
            color: "genXP",
            cost: D(1e16),
            prereq: ["exp2"],
            get shown() {
                return player.transcendUpgrades.includes('exp1')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend, '6.21e621') && player.prestigeUpgrades.filter((bought) => Decimal.gt(bought, 0)).length === 0 && player.ascendUpgrades.filter((bought) => Decimal.gt(bought, 0)).length === 0 && player.quarkDimsBought.filter((arr) => arr.filter((bought) => Decimal.gt(bought, 0)).length > 0).length === 0 && player.generatorFeatures.buyable.filter((bought) => Decimal.neq(bought, 0)).length === 0 && player.generatorFeatures.enhancerBuyables.filter((bought) => Decimal.neq(bought, 0)).length === 0
                },
                restriction: false,
                get desc() {
                    return `You must reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, '6.21e621'), format(player.bestPointsInTranscend) + ' / 6.210e621')} points and you cannot buy any ${conditionMet(player.prestigeUpgrades.filter((bought) => Decimal.gt(bought, 0)).length === 0)} prestige upgrades, ${conditionMet(player.ascendUpgrades.filter((bought) => Decimal.gt(bought, 0)).length === 0)} ascension buyables, ${conditionMet(player.quarkDimsBought.filter((arr) => arr.filter((bought) => Decimal.gt(bought, 0)).length > 0).length === 0)} setback dimensions, nor ${conditionMet(player.generatorFeatures.buyable.filter((bought) => Decimal.neq(bought, 0)).length === 0)} generator XP and ${conditionMet(player.generatorFeatures.enhancerBuyables.filter((bought) => Decimal.neq(bought, 0)).length === 0)} Enhancer buyables.`
                }
            },
            name: "Generator Manufacturing",
            get desc() {
                return `Unlock 1 more Generator XP buyable and 3 more Generator enhance buyables.<br><span style="font-size: 5px">Do not pay attention to the requirement.</span>`
            }
        },
        {
            id: "point4",
            color: "gen",
            cost: D(1e20),
            prereq: ["prest3"],
            get shown() {
                return player.transcendUpgrades.includes('ascend4')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend[1], 'ee4') && player.transcendInSpecialReq === "point4"
                },
                restriction: true,
                get desc() {
                    return `Reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'ee4'), format(player.bestPointsInTranscend) + ' / 1.000e10,000')} points while buyables, ascension buyables, and generators scale 10,000× faster. This resets ascension buyables!`
                }
            },
            name: "Extreme Buyable Boost",
            get desc() {
                return `The generator effect to buyables are dilated by 3.`
            },
            eff: null
        },
    ],
    [
        {
            id: "hinderance2",
            color: "hinderance",
            cost: D(1e27),
            prereq: ['point4', 'prest4', 'ascend4'],
            get shown() {
                return player.transcendUpgrades.includes('gen1') && player.transcendUpgrades.includes('exp1') && player.transcendUpgrades.includes('ascend4')
            },
            unlock: {
                get req() {
                    return Decimal.gte(player.bestPointsInTranscend[1], 'e1185') && player.transcendInSpecialReq === "hinderance2"
                },
                restriction: true,
                get desc() {
                    return `Reach ${conditionMet(Decimal.gte(player.bestPointsInTranscend, 'e1185'), format(player.bestPointsInTranscend) + ' / 1.000e1,185')} points while trapped in Hinderances 2, 3, and 4.`
                }
            },
            name: "Distant Stars",
            get desc() {
                return `Unlock Hinderance 5, and quarks also boost dimension mults.`
            },
            eff: null
        },
    ],
    [
        {
            id: "setback1",
            color: "basic",
            cost: D(1e33),
            prereq: ["hinderance2"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance2')
            },
            unlock: {
                get req() {
                    return false
                },
                restriction: false,
                get desc() {
                    return ``
                }
            },
            name: "",
            get desc() {
                return ``
            },
            eff: null
        },
        {
            id: "enhancer1",
            color: "genEnh",
            cost: D(1e39),
            prereq: ["hinderance2"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance2')
            },
            unlock: {
                get req() {
                    return false
                },
                restriction: false,
                get desc() {
                    return ``
                }
            },
            name: "",
            get desc() {
                return ``
            },
            eff: null
        },
        {
            id: "ascend5",
            color: "ascend",
            cost: D(1e45),
            prereq: ["hinderance2"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance2')
            },
            unlock: {
                get req() {
                    return false
                },
                restriction: false,
                get desc() {
                    return ``
                }
            },
            name: "",
            get desc() {
                return ``
            },
            eff: null
        },
        {
            id: "prest5",
            color: "prest",
            cost: D(1e52),
            prereq: ["hinderance2"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance2')
            },
            unlock: {
                get req() {
                    return false
                },
                restriction: false,
                get desc() {
                    return ``
                }
            },
            name: "",
            get desc() {
                return ``
            },
            eff: null
        },
        {
            id: "point5",
            color: "basic",
            cost: D(1e60),
            prereq: ["hinderance2"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance2')
            },
            unlock: {
                get req() {
                    return false
                },
                restriction: false,
                get desc() {
                    return ``
                }
            },
            name: "",
            get desc() {
                return ``
            },
            eff: null
        },
        {
            id: "gen4",
            color: "gen",
            cost: D(1e66),
            prereq: ["hinderance2"],
            get shown() {
                return player.transcendUpgrades.includes('hinderance2')
            },
            unlock: {
                get req() {
                    return false
                },
                restriction: false,
                get desc() {
                    return ``
                }
            },
            name: "",
            get desc() {
                return ``
            },
            eff: null
        },
    ],
]

function initHTML_transcend() {
    toHTMLvar('transcendTab')
    toHTMLvar('transcendTabButton')
    html['transcendTab'].setDisplay(false)
    html['transcendTabButton'].setDisplay(false)

    toHTMLvar('transcend')
    toHTMLvar('transcendAmount')
    toHTMLvar('transcendNext')
    toHTMLvar('transcendPoints')
    toHTMLvar('transcendPointEffect')
    toHTMLvar('transcendResets')
    toHTMLvar('transcendResetEffect')

    toHTMLvar('transUpgName')
    toHTMLvar('transUpgDesc')
    toHTMLvar('transUpgReq')
    toHTMLvar('buyTransUpgrade')
    toHTMLvar('transUpgName2')
    toHTMLvar('transUpgCost')
    toHTMLvar('enterTransRestriction')

    toHTMLvar('upgradeTransTabButton')
    toHTMLvar('milestoneTransTabButton')
    toHTMLvar('perkTransTabButton')

    toHTMLvar('UpgradeTransTab')
    toHTMLvar('MilestoneTransTab')
    toHTMLvar('PerkTransTab')

    toHTMLvar('transUpgradeList')
    toHTMLvar('transMilestoneList')
    toHTMLvar('transPerkList')

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

    txt = ``
    for (let i = 0; i < TRANSCENSION_UPGRADES.length; i++) {
        let upg = ``
        for (let j = 0; j < TRANSCENSION_UPGRADES[i].length; j++) {
            upg += `
                <button id="transcendUpg${i},${j}" onclick="tmp.transSelectedUpg[0] = ${i}; tmp.transSelectedUpg[1] = ${j}" class="whiteText font" style="margin: 4px; cursor: pointer; height: 50px; width: 100px;">
                    <span style="font-size: 12px;">${TRANSCENSION_UPGRADES[i][j].id}</span>
                </button>
            `
        }
        txt += `
            <div id="transcendUpgCate${i}" class="flex-vertical" style="margin-top: -3px; margin-left: -3px; height: 100%; min-width: 300px; border: 3px dashed #8000ff80; justify-content: center;">
                ${upg}
            </div>
        `
    }
    html['transUpgradeList'].setHTML(txt)

    for (let i = 0; i < TRANSCENSION_UPGRADES.length; i++) {
        for (let j = 0; j < TRANSCENSION_UPGRADES[i].length; j++) {
            toHTMLvar(`transcendUpg${i},${j}`)
        }
        toHTMLvar(`transcendUpgCate${i}`)
    }
}

function updateGame_transcend() {
    player.timeInTranscension = Decimal.add(player.timeInTranscension, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    for (let i = 0; i < TRANSCENSION_UPGRADES.length; i++) {
        for (let j = 0; j < TRANSCENSION_UPGRADES[i].length; j++) {
            tmp.transEffs[i][j] = TRANSCENSION_UPGRADES[i][j].eff
        }
    }

    tmp.transcendReq = D('e2400')
    tmp.factors.transcend = []
    tmp.transcendAmount = Decimal.div(player.bestPointsInTranscend, tmp.transcendReq).pow(0.0005)
    addStatFactor('transcend', `Base`, `(${format(player.bestPointsInTranscend)}/${format('e2400')})<sup>0.0005</sup>`, null, tmp.transcendAmount)
    if (player.cheats.dilate) {
        tmp.transcendAmount = cheatDilateBoost(tmp.transcendAmount)
        addStatFactor('transcend', `Cheats`, `...`, null, tmp.transcendAmount)
    }
    tmp.transcendAmount = tmp.transcendAmount.floor()

    tmp.transcendNext = tmp.transcendAmount
    tmp.transcendNext = cheatDilateBoost(tmp.transcendNext, true)
    tmp.transcendNext = tmp.transcendNext.add(1).root(0.0005).mul(tmp.transcendReq)

    tmp.transcendEffect = Decimal.max(player.transcendPointTotal, 0).add(1).log10().mul(0.02).add(1).ln().mul(100).pow10()
    tmp.transcendResetEffect = Decimal.max(player.transcendResetCount, 0).pow_base(2) // this is probably risky, i should change this at some point
}

function updateHTML_transcend() {
    html['transcendTab'].setDisplay(tmp.tab === 5)
    html['transcendTabButton'].setDisplay(Decimal.gt(player.transcendResetCount, 0))
    if (tmp.tab === 5) {
        html['transcendPoints'].setTxt(`${format(player.transcendPoints)}`)
        html['transcendPointEffect'].setTxt(`Multiplying point gain by ${format(tmp.transcendEffect, 2)}`)
        html['transcendResets'].setTxt(`${format(player.transcendResetCount)}`)
        html['transcendResetEffect'].setTxt(`Multiplying point gain by ${format(tmp.transcendResetEffect, 2)}`)

        html['MilestoneTransTab'].setDisplay(tmp.transTab === 0)
        html['UpgradeTransTab'].setDisplay(tmp.transTab === 1)
        html['PerkTransTab'].setDisplay(tmp.transTab === 1)
        if (tmp.transTab === 0) {
            for (let i = 0; i < TRANSCENSION_MILESTONES.length; i++) {
                if (i > 0) {
                    html[`transcendMilestone${i}`].setDisplay(willGetTM(i - 1))
                }
                html[`transcendMilestone${i}`].changeStyle('background-color', hasTranscendMilestone(i) ? '#8000FF80' : '#40008080')
                html[`transcendMilestone${i}`].changeStyle('border', hasTranscendMilestone(i) ? '3px solid #8000FF' : '3px solid #400080')
                html[`transcendMilestone${i}req`].setHTML(`Requirement: ${willGetTM(i) && !hasTranscendMilestone(i) ? '<b>' : ''}${format(player.transcendPointTotal)} (+${format(tmp.transcendAmount)}) / ${format(TRANSCENSION_MILESTONES[i].baseReq.div(Decimal.pow(2, player.transcendResetCount)))}${willGetTM(i) && !hasTranscendMilestone(i) ? '</b>' : ''} Total Transcension Points`)
            }
        }
        if (tmp.transTab === 1) {
            if (tmp.transSelectedUpg[0] !== undefined && tmp.transSelectedUpg[1] !== undefined) {
                const transUpg = TRANSCENSION_UPGRADES[tmp.transSelectedUpg[0]][tmp.transSelectedUpg[1]]
                let unlocked = (player.transcendUpgradesUnlocked[transUpg.id] !== undefined || transUpg.unlock.req) && !player.transcendUpgrades.includes(transUpg.id)
                let preReqLimited = false
                let preReqArray = []
                let preReqText = ``
                if (transUpg.prereq !== null) {
                    for (let i = 0; i < transUpg.prereq.length; i++) {
                        preReqLimited ||= !player.transcendUpgrades.includes(transUpg.prereq[i])
                        if (!player.transcendUpgrades.includes(transUpg.prereq[i])) {
                            preReqArray.push(transUpg.prereq[i])
                        }
                    }
                    if (preReqLimited) {
                        unlocked = false
                    }
                    if (preReqArray.length === 1) {
                        preReqText = preReqArray[0]
                    } else if (preReqArray.length === 2) {
                        preReqText = `${preReqArray[0]} and ${preReqArray[1]}`
                    } else {
                        preReqText = ``
                        for (let i = 0; i < preReqArray.length - 1; i++) {
                            preReqText += `${preReqArray[i]}, `
                        }
                        preReqText += `and ${preReqArray[preReqArray.length - 1]}`
                    }
                }
                html['transUpgName'].setTxt(transUpg.name)
                html['transUpgDesc'].setHTML(transUpg.desc)
                html['transUpgReq'].setHTML(transUpg.unlock.desc === '' ? 'This upgrade has no special conditions.' : transUpg.unlock.desc)
                html['transUpgName2'].setTxt(transUpg.name)
                html['transUpgCost'].setTxt(player.transcendUpgrades.includes(transUpg.id) ? 'This upgrade is already bought.' : (preReqLimited ? `You need to buy ${preReqText} in order to buy ${transUpg.name}.` : (unlocked ? `Cost: ${format(transUpg.cost)} Transcension Points` : `You need to meet the upgrade's requirements before buying ${transUpg.name}!`)))

                html['buyTransUpgrade'].changeStyle('background-color', unlocked ? (Decimal.gte(player.transcendPoints, transUpg.cost) ? '#40008080' : '#20004080') : '#20202080')
                html['buyTransUpgrade'].changeStyle('border', '3px solid ' + (unlocked ? (Decimal.gte(player.transcendPoints, transUpg.cost) ? '#8000ff' : '#400080') : '#404040'))
                html['buyTransUpgrade'].changeStyle('cursor', unlocked && Decimal.gte(player.transcendPoints, transUpg.cost) ? 'pointer' : 'not-allowed')

                html['enterTransRestriction'].setTxt(!transUpg.unlock.restriction ? 'This upgrade does not have a custom restriction.' : `Press this button to do a transcension reset and enter ${transUpg.name}.`)
                html['enterTransRestriction'].changeStyle('background-color', transUpg.unlock.restriction ? (player.transcendInSpecialReq === TRANSCENSION_UPGRADES[tmp.transSelectedUpg[0]][tmp.transSelectedUpg[1]].id ? '#40008080' : '#20004080') : '#20202080')
                html['enterTransRestriction'].changeStyle('border', '3px solid ' + (transUpg.unlock.restriction ? (player.transcendInSpecialReq === TRANSCENSION_UPGRADES[tmp.transSelectedUpg[0]][tmp.transSelectedUpg[1]].id ? '#8000ff' : '#400080') : '#404040'))
                html['enterTransRestriction'].changeStyle('cursor', transUpg.unlock.restriction ? 'pointer' : 'not-allowed')
            }

            for (let i = 0; i < TRANSCENSION_UPGRADES.length; i++) {
                let displayed = false
                for (let j = 0; j < TRANSCENSION_UPGRADES[i].length; j++) {
                    html[`transcendUpg${i},${j}`].setDisplay(TRANSCENSION_UPGRADES[i][j].shown)
                    displayed ||= TRANSCENSION_UPGRADES[i][j].shown
                    if (TRANSCENSION_UPGRADES[i][j].shown) {
                        html[`transcendUpg${i},${j}`].changeStyle('background-color', `${colorChange(
                            TU_ColorIDs[TRANSCENSION_UPGRADES[i][j].color], 
                            0.25 * (player.transcendUpgrades.includes(TRANSCENSION_UPGRADES[i][j].id) ? 2 : 1),
                            1.0 / (player.transcendUpgradesUnlocked[TRANSCENSION_UPGRADES[i][j].id] !== undefined || TRANSCENSION_UPGRADES[i][j].req ? 1 : 2)
                        )}`)
                        html[`transcendUpg${i},${j}`].changeStyle('border', `3px solid ${colorChange(
                            TU_ColorIDs[TRANSCENSION_UPGRADES[i][j].color], 
                            0.333 * (player.transcendUpgrades.includes(TRANSCENSION_UPGRADES[i][j].id) ? 2 : 1) * (tmp.transSelectedUpg[0] === i && tmp.transSelectedUpg[1] === j ? 1.5 : 1),
                            1.0 / (player.transcendUpgradesUnlocked[TRANSCENSION_UPGRADES[i][j].id] !== undefined || TRANSCENSION_UPGRADES[i][j].req ? 1 : 2)
                        )}`)
                    }
                }
                html[`transcendUpgCate${i}`].setDisplay(displayed)
            }
        }
        if (tmp.transTab === 2) {

        }
    }
}

function conditionMet(bool, txt) {
    if (txt === undefined) {
        txt = bool ? '✓' : '✗'
    }
    return bool ? `<span style="color: #00ff00">[${txt}]</span>` : `<span style="color: #ff4040">[${txt}]</span>`
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
        player.buyableTierPoints[i] = D(0)
    }
    player.prestigeCountInTrans = D(0)
    player.currentHinderance = null
    for (let i = 0; i < HINDERANCES.length; i++) {
        if (hasTranscendMilestone(12)) {
            player.hinderanceScore[i] = Decimal.pow(player.bestHinderanceScore[i], 0.5)
        } else {
            player.hinderanceScore[i] = D(0)
        }
    }
    if (hasTranscendMilestone(5)) {
        player.hinderanceScore[2] = Decimal.max(player.hinderanceScore[2], HINDERANCES[2].start)
    }
    if (hasTranscendMilestone(6)) {
        player.hinderanceScore[0] = Decimal.max(player.hinderanceScore[0], HINDERANCES[0].start)
    }
    if (hasTranscendMilestone(7)) {
        player.hinderanceScore[1] = Decimal.max(player.hinderanceScore[1], HINDERANCES[1].start)
    }
    player.ascend = D(0)
    player.ascendCount = D(0)
    player.ascendGems = D(0)
    for (let i = 0; i < player.ascendUpgrades.length; i++) {
        if (hasTranscendMilestone(11) && i >= 8 && i <= 15) {
            continue;
        }
        player.ascendUpgrades[i] = D(0)
    }
    player.currentSetback = null
    player.inSetback = false
    player.setbackLoadout = []
    if (hasTranscendMilestone(14)) {
        player.setbackLoadout.push([D(10), D(10), D(10)])
        player.currentSetback = 0
    }
    player.setbackUpgrades = []
    if (hasTranscendMilestone(4)) {
        for (let i = 0; i < 5; i++) {
            player.setbackUpgrades.push(`r${i+1}`)
            player.setbackUpgrades.push(`g${i+1}`)
        }
    }
    if (hasTranscendMilestone(10)) {
        for (let i = 0; i < 5; i++) {
            player.setbackUpgrades.push(`r${i+6}`)
            player.setbackUpgrades.push(`g${i+6}`)
            player.setbackUpgrades.push(`b${i+1}`)
        }
    }
    player.generatorFeatures.xp = D(0)
    for (let i = 0; i < player.generatorFeatures.buyable.length; i++) {
        player.generatorFeatures.buyable[i] = D(0)
    }
    player.generatorFeatures.enhancer = D(0)
    player.generatorFeatures.totalEnh = D(0)
    for (let i = 0; i < player.generatorFeatures.enhancerBuyables.length; i++) {
        player.generatorFeatures.enhancerBuyables[i] = D(0)
    }
    player.generatorFeatures.enhanceCount = D(0)

    player.prestigeChallengeCompleted = []
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        player.prestigeUpgrades[i] = D(0)
    }

    for (let i = 0; i < player.buyables.length; i++) {
        player.buyableInTranscension[i] = false
    }

    tmp.generatorFeatures.genXPBuyables = resetGenXPBuyables()
    tmp.generatorFeatures.genEnhBuyables = resetGenEnhBuyables()
    tmp.ascendAmount = D(0)
    tmp.setbackTab = 0
    tmp.ascendTab = 0

    doAscendReset(true)
}

function canBuyTransUpg(i, j) {
    return (player.transcendUpgradesUnlocked[TRANSCENSION_UPGRADES[i][j].id] !== undefined || TRANSCENSION_UPGRADES[i][j].unlock.req) 
    && !player.transcendUpgrades.includes(TRANSCENSION_UPGRADES[i][j].id) 
    && Decimal.gte(player.transcendPoints, TRANSCENSION_UPGRADES[i][j].cost)
}

function buyTransUpg(i, j) {
    if (!canBuyTransUpg(i, j)) {
        return;
    }
    player.transcendPoints = Decimal.sub(player.transcendPoints, TRANSCENSION_UPGRADES[i][j].cost)
    player.transcendUpgrades.push(TRANSCENSION_UPGRADES[i][j].id)
}

function toggleTransRest() {
    if (player.transcendInSpecialReq === TRANSCENSION_UPGRADES[tmp.transSelectedUpg[0]][tmp.transSelectedUpg[1]].id) {
        player.transcendInSpecialReq = null
    } else {
        player.transcendInSpecialReq = TRANSCENSION_UPGRADES[tmp.transSelectedUpg[0]][tmp.transSelectedUpg[1]].id
    }
    doTranscendReset(true)
}