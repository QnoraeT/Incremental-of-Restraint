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
            "WIP Replicators."
        ],
        features: [

        ],
        bugfixes: [

        ]
    },
    {
        tooSmall: true,
        version: 25,
        changes: [
            "WIP Replicators"
        ],
        features: [

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
        tooSmall: false,
        version: 27,
        changes: [

        ],
        features: [

        ],
        bugfixes: [

        ]
    },
]