"use strict";
const TRANSCENSION_MILESTONES = [
    {
        baseReq: D(2),
        desc: "Autobuyers for all buyables are always unlocked and start with a speed of 2/s."
    },
    {
        baseReq: D(4),
        desc: ""
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

const TRANSCENSION_UPGRADES = [
    // * Unlocks is an array that's basically stages for when its unlocked
    // * item 0 is if its shown, item 1 if it can be bought as long as it has prereq
    [
        {
            id: "base",
            cost: D(1),
            prereq: null,
            unlocks: [true, true],
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
            cost: D(1),
            prereq: ["base"],
            unlocks: [true, true],
            name: "Double the fun?",
            get desc() {
                return `All buyables' effect bases are doubled.`
            },
            eff: null
        },
        {
            id: "prest1",
            cost: D(1),
            prereq: ["point1"],
            unlocks: [true, true],
            name: "Double the prestige?",
            get desc() {
                return `Prestige point gain is doubled.`
            },
            eff: null
        },
        {
            id: "ascend1",
            cost: D(2),
            prereq: ["prest1"],
            unlocks: [true, true],
            name: "A little more than double the ascension gems?",
            get desc() {
                return `Ascension Upgrade 4's effect base is doubled.`
            },
            eff: null
        },
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
}

function updateGame_transcend() {
    tmp.transcendReq = D('e2400')
    tmp.transcendFactors = []
    tmp.transcendAmount = Decimal.div(player.bestPointsInTranscend, tmp.transcendReq).max(1).pow(0.0005)
    tmp.transcendFactors.push(`Base: (${format(player.bestPointsInTranscend)}/${format('e2400')})<sup>0.0005</sup> → ${format(tmp.transcendAmount, 2)}`)
    if (player.cheats.dilate) {
        tmp.transcendAmount = cheatDilateBoost(tmp.transcendAmount)
        tmp.transcendFactors.push(`Cheats: ... → ${format(tmp.transcendAmount, 2)}`)
    }
    tmp.transcendAmount = tmp.transcendAmount.floor()

    tmp.transcendNext = tmp.transcendAmount
    tmp.transcendNext = cheatDilateBoost(tmp.transcendNext, true)
    tmp.transcendNext = tmp.transcendNext.add(1).root(0.0005).mul(tmp.transcendReq)
}

function updateHTML_transcend() {
    html['transcendTab'].setDisplay(tmp.tab === 5)
    // html['transcendTabButton'].setDisplay(Decimal.gt(player.transcendResetCount, 0))
    if (tmp.tab === 5) {
        html['transcendPoints'].setTxt(`${format(player.transcend)}`)
        html['transcendPointEffect'].setTxt(`Multiplying point gain by ${format(tmp.transcendPointEffect, 2)}`)
    }
}

function doTranscendReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.transcendAmount.lte(0)) {
            return;
        }
    }

}