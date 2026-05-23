"use strict";

const UPDATE_LOG = [
    {
        tooSmall: false,
        version: 22,
        changes: [
            "Hid buyables that didn't have a prior buyable bought.",
            "Improved Textbook text.",
            "Hid the interval boost if it didn't boost anything.",
            "Removed Buyables' passive effect of adding a free level to previous buyables, that'll be unlocked with features."
        ],
        features: [

        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: false,
        version: 23,
        changes: [
            "Simplified reset gain description in buttons past 100 of that resource's gain.",
            "Added a warning about prestige challenges.",
            "Added a display in how much boosts will increase upon resetting.",
            "Slightly optimized some code regarding basic buyable disable/enable and autobuyer states. (tmp var instead of calculated)",
            "Made the Generators tab in statistics count Buyable 1 instead of the last available basic buyable.",
            "Changed Ascension Buyable formatting.",
            "Relocated the Setback tab from being in the main page into being in the Ascension page.",
            "Changed the wording of Blue Setback Upgrade #2.",
            "Made some mentions of \"prestige upgrades\" turn into \"prestige buyables\" when BSU2 is bought.",
            "Included text about tiers in the Main tab and improved info.",
            "Removed 'strings' mention in Transcension's textbook entry.",
            "Nerfed transcension upgrade 'base'.",
            "Renamed \"Buyable 7\" to \"Special Buyable 1\", as it is not a *basic buyable.*",
        ],
        features: [
            "Made the button to complete a prestige challenge turn cyan when the goal is reached.",
            "Made prestige challenges turn into a lighter shade of cyan when in the challenge and already completed.",
            "WIP Replicators."
        ],
        bugfixes: [
            "Fixed negative prestige point issues caused by overbuying prestige upgrades with Shift.",
            "Fixed PC13's generators not boosting points.",
            "Fixed setback effects being incorrect.",
            "Fixed minor grammatical issues in Setback Dimensions.",
            "Fixed Hinderance 2: Undesirable Rot's effect on Prestige Upgrade 12, it incorrectly affected generators.",
            "Fixed Hinderance 3: Multitude's effect on PC4: Stacking Interest, where it actually *enabled* its effect of intervals.",
            "Fixed an exploit when unlocking Ascension Buyable persistence, you can infinitely force transcend reset to gain increasing transcension reset boosts. Now you need 1.000e2,400 points for the reset to count.",
        ]
    },
    {
        tooSmall: true,
        version: 24,
        changes: [
            
        ],
        features: [
            "WIP Replicators."
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 25,
        changes: [

        ],
        features: [
            "WIP Replicators."
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 26,
        changes: [
            "Added 3 new prestige buyables unlockable via transcension upgrade."
        ],
        features: [

        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 27,
        changes: [

        ],
        features: [
            "WIP Setback Priorities"
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 28,
        changes: [

        ],
        features: [
            "WIP Setback Priorities."
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 29,
        changes: [
            "I was bored, so I added semi-colons in much of the code-base. It does nothing, I just felt like doing it."
        ],
        features: [
            "Added factors in stats for Generator XP, Generator Enhancer, and Tier gain.",
            "WIP Setback Priority Upgrades (Implemented R11-13, G11-12, B7)"
        ],
        bugfixes: [
            "Fixed Cyan Energy potentially having an effect even in setbacks due to it not accounting for being trapped in a setback.",
            "Fixed Hinderance 4's effect potentially not working properly on Generator XP's point boost.",
            "Fixed Hinderance 4's effect potentially not working properly on Trans. Upg. \"Point Enhancers\".",
        ]
    },
    {
        tooSmall: true,
        version: 30,
        changes: [

        ],
        features: [
            "WIP Prestige Fluid",
            "Implemented G13, implementing B6"
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 31,
        changes: [

        ],
        features: [
            "WIP Repeatable Prestige Challenges",
            "Implemented B6, implementing B8"
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 32,
        changes: [

        ],
        features: [
            "WIP Repeatable Prestige Challenges",
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 33,
        changes: [

        ],
        features: [
            "WIP Repeatable Prestige Challenges",
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 34,
        changes: [

        ],
        features: [
            "WIP Repeatable Prestige Challenges",
            "I'm an eepy trans girl"
        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: false,
        version: 35,
        changes: [
            "The inverse factorial formula was inaccurate at low values. I've changed it to be more accurate at a slight performance cost.",
            "Slightly buffed PB5, it now takes into account effective buyable amounts.",
            "Nerfed Ascension Buyables #9-12's effects, but increased their cap and slowed down their cost scalings.",
            "Setback upgrades R1-10 and G1-10 are changed into being additive, and no longer have a cap.",
            "Nerfed Hinderance 1's completion from being multiplicative to being additive.",
            "Nerfed point4 from ▲1.4 to ▲1.25. You could get more points being in PC13 than outside of it.",
            "Nerfed Prestige Generators by increasing their scaling from 10^x^2 to 10^2^x. It inflated with higher PRC1 completions.",
        ],
        features: [
            "Added Hinderance 6.",
            "Added Prestige Repeat Challenges.",
            "Completed implementing all extra setback upgrades from setback priorities.",
            "Added anticap.",
            "Added tier XP and Enhancers.",
            "Added new transcension upgrades and replicator tiers/tetrs."
        ],
        bugfixes: [
            "Fixed Setback in the Textbook not having a colored border. I hate CSS for this, but oh well.",
            "PC11 is very annoying. I made basic buyables have a minimum effect of 1.000e-1,000, so that you could still push through PC11 if you're far enough.",
            "Fixed an exploit that likely made several challenges trivial via 1 tick of extra PBs not being discarded after a reset.",
            "Fixed tiers having 1 extra level of effect.",
            "Fixed hinderance2's effect on dimensions not working at all.",
            "Fixed PRC3 working on all dimensions instead of only Blue dimensions."
        ]
    },
]

/*
    player.prestigeChallengeRepCompleted[5] = D(0)
    
    player.time2ndInTranscend = D(0)

    player.generatorFeatures.buyable[3] = D(0);
    player.generatorFeatures.buyable[4] = D(0);
    player.generatorFeatures.buyable[5] = D(0);

    player.buyableAccumulated = [D(0), D(0), D(0), D(0), D(0), D(0)]

    player.hinderanceScore[5] = D(0)
    player.bestHinderanceScore[5] = D(0)
    player.hinderancePts[5] = D(0)
    player.hinderancePts = [D(0), D(0), D(0), D(0), D(0), D(0)]
    
    player.replitierBuyables = [D(0), D(0), D(0), D(0), D(0)]
    player.replitetrBuyables = [D(0), D(0), D(0), D(0), D(0), D(0)]

    player.anticap = {
        active: false,
        savedTotalTP: null,
        savedTranscensionTimes: null,
        bestPoints: D(0),
        power: D(0),
        energy: D(0),
        bestEnergy: D(0),
        buyables: [D(0), D(0), D(0), D(0), D(0)],
        upgrades: []
    }

    player.tierXPAuto = false
    player.tierEnhGenerate = false
    player.tierEnhAuto = false
    
    player.tierFeatures = {
        xp: D(0),
        buyable: [D(0), D(0), D(0)],
        enhancer: D(0),
        totalEnh: D(0),
        enhancerBuyables: [D(0), D(0), D(0), D(0), D(0), D(0)],
        enhanceCount: D(0),
    }

    player.anticapBuyAuto = false;


    cheats

    player.cheats.bullshit = {
        pointExtr: 0,
        prestExtr: 0,
        ascendExtr: 0,
        transExtr: 0
    }
*/


const BULLSHIT = {
    pointExtr() {
        return Decimal.sub(player.cheats.bullshit.pointExtr, 1).mul(0.01).add(1);
    },
    prestExtr() {
        return Decimal.pow(1.001, Decimal.sub(player.cheats.bullshit.prestExtr, 1));
    },
    ascendExtr() {
        return Decimal.mul(Decimal.sub(player.cheats.bullshit.ascendExtr, 1), 0.04).add(1);
    },
    transExtr() {
        return Decimal.mul(Decimal.sub(player.cheats.bullshit.transExtr, 1), 0.01).add(1);
    },
}