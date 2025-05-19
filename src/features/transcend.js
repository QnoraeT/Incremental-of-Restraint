"use strict";
const TRANSCENSION_MILESTONES = [
    {
        baseReq: D(2),
        desc: "Autobuyers for all buyables are always unlocked."
    },
    {
        baseReq: D(4),
        desc: "Autobuyers for all buyables are always unlocked."
    },
]

const TRANSCENSION_UPGRADES = [
    // * Unlocks is an array that's basically stages for when its unlocked
    // * item 0 is if its shown, item 1 if it can be bought, and item 2 if it can be bought ignoring restrictions
    [
        {
            id: "base",
            cost: D(1),
            prereq: null,
            restricts: null,
            unlocks: [true, true, true],
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
            id: "main1",
            cost: D(1),
            prereq: ["base"],
            restricts: null,
            unlocks: [true, true, true],
            name: "Double the fun?",
            get desc() {
                return `All buyables' effect bases are doubled.`
            },
            eff: null
        },
        {
            id: "prest1",
            cost: D(1),
            prereq: ["base"],
            restricts: null,
            unlocks: [true, true, true],
            name: "Double the prestige?",
            get desc() {
                return `Prestige point gain is doubled.`
            },
            eff: null
        },
        {
            id: "ascend1",
            cost: D(1),
            prereq: ["base"],
            restricts: null,
            unlocks: [true, true, true],
            name: "A little more than double the ascension gems?",
            get desc() {
                return `Ascension Upgrade 4's effect base is doubled.`
            },
            eff: null
        },
    ]
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