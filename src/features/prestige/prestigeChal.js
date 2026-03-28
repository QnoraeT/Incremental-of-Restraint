"use strict";

const PRESTIGE_CHALLENGES = [
    {
        get goal() {
            let goal = D(1e8);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Nerfed Buyables",
        desc: "Buyables' effect bases are halved.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyables generate a resource that boost themselves, called Generators.`;
        },
        chalEffects(depth) {
            const obj = { effectBase: D(0.5) };
            obj.effectBase = obj.effectBase.pow(depth);

            return obj;
        }
    },
    {
        get goal() {
            let goal = D(2.5e8);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Accelerated Spending",
        desc: "Buyable' scaling intervals now occur every 5 purchases and don't give a bonus.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and unlock Buyable 5.`;
        },
        chalEffects(depth) {
            const obj = { interval: D(5) };

            return obj;
        }
    },
    {
        get goal() {
            let goal = D(1e6);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "No Influencing",
        desc: "Buyables add to the point generation instead of multiplying.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1. Buyables now add free levels to their previous buyable, and Prestige Upgrade 4 is improved.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e16);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Stacking Interest",
        desc: "Buyables 2+ do not multiply point gain, but instead add to the effect base of the previous buyable. However, scaling intervals happen twice as often and don't give any boosts.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and prestige points give a passive boost to points.`
        },
        chalEffects(depth) {
            const obj = { interval: D(2) };
            obj.interval = obj.interval.pow(depth);

            return obj;
        }
    },
    {
        get goal() {
            let goal = D(1e10);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Intense Synergy",
        desc: "Apply Prestige Challenges 1-4.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give triple the effect instead of double.`;
        },
        chalEffects(depth) {
            const obj = { chal: D(1) };
            obj.chal = obj.chal.mul(depth);

            return obj;
        }
    },
    {
        get goal() {
            let goal = D(1e12);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Black Out",
        desc: "Buyable 1 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give quadruple the effect instead of triple.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e15);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Black Out II",
        desc: "Buyable 1 and 2 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give quintuple the effect instead of quadruple.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e20);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Black Out III",
        desc: "Buyables 1-3 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give sextuple the effect instead of quintuple.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e33);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Black Out IV",
        desc: "Buyables 1-4 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give septuple the effect instead of sextuple.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e45);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Black Out V",
        desc: "Buyables 1-5 and Prestige Upgrades are disabled.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyable scaling intervals give 10× the effect instead of septuple.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e90);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Factory Reversal",
        desc: "All generators (from PC1) are activated, but all generator multipliers other than buyables are disabled, and the effects decrease instead of increase.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and every OoM of your total generator level increases prestige essence' effect by +^0.1, smoothly.`;
        },
        chalEffects(depth) {
            // for sake of consistency
            return {};
        }
    },
    {
        get goal() {
            let goal = D(1e135);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Annhilation",
        desc: "Tier 1 Time Speed is reduced by /1,000, and Point and generators are rooted based on your points and the time since you have bought a buyable.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, Generator multipliers are raised ^1.2, and Point gain is raised ^1.025.`;
        },
        chalEffects(depth) {
            const obj = { timeSpeed: D(1000), root: D(1) };
            obj.timeSpeed = obj.timeSpeed.pow(depth);

            obj.root = Decimal.add(player.timeSinceBuyableBought, 0.001).div(0.011).min(1).mul(Decimal.sub(1, Decimal.div(1, Decimal.max(player.points, 0).add(1).log10().add(1).log10().add(1).log10().add(1))).mul(0.875).add(0.125));
            obj.root = obj.root.pow(depth);
            return obj;
        }
    },
    {
        get goal() {
            let goal = D('1e600');
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        name: "Generator Mastery",
        desc: "Generator speed is log10'd, then buyables instead boost Generator speed with log10 effect. Generator levels scale much slower (~1.05<sup>x</sup> instead of x!) and boost points exponentially instead of their effect linearly.",
        get eff() {
            return `Buyables also boost Generator speed and log2(Gen. Lvs.) past 12 increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'}.`;
        },
        chalEffects(depth) {
            const obj = { log: D(1) };
            obj.log = obj.log.mul(depth);

            return obj;
        }
    }
]

function initHTML_prestigeChallenges() {
    toHTMLvar('prestigeChallengeTab');
    toHTMLvar('prestigeChallengeTabButton');
    html['prestigeChallengeTab'].setDisplay(false);
    html['prestigeChallengeTabButton'].setDisplay(false);

    toHTMLvar('prestigeChallengeList');
    toHTMLvar('prestigeChallengeButton');
    toHTMLvar('prestigeChallengeName');
    toHTMLvar('prestigeChallengeRequirement');
    toHTMLvar('prestigeChalRespec');

    let txt = ``;
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        txt += `
        <button onclick="togglePrestigeChallenge(${i})" id="prestigeChallenge${i}" class="whiteText font" style="cursor: pointer; height: 160px; width: 320px; font-size: 10px; margin: 2px">
            <b><span id="prestigeChallenge${i}name" style="font-size: 12px"><b>PC${i+1}</b>: ${PRESTIGE_CHALLENGES[i].name}</span></b><br>
            <span id="prestigeChallenge${i}desc">${PRESTIGE_CHALLENGES[i].desc}</span><br>
            Goal: <span id="prestigeChallenge${i}goal"></span> points<br><br>
            Reward: <span id="prestigeChallenge${i}reward">${PRESTIGE_CHALLENGES[i].eff}</span>
        </button>
        `;
    }

    html['prestigeChallengeList'].setHTML(txt);
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        toHTMLvar(`prestigeChallenge${i}`);
        toHTMLvar(`prestigeChallenge${i}name`);
        toHTMLvar(`prestigeChallenge${i}desc`);
        toHTMLvar(`prestigeChallenge${i}goal`);
        toHTMLvar(`prestigeChallenge${i}reward`);
    }
}

function updateGame_prestigeChallenges() {
    for (let i = PRESTIGE_CHALLENGES.length - 1; i >= 0; i--) {
        tmp.prestigeChal[i].entered = false;
        tmp.prestigeChal[i].trapped = false;
        tmp.prestigeChal[i].depth = D(0);

        if (player.prestigeChallenge === i && !prestigeChallengeEnabled(i)) {
            togglePrestigeChallenge(i);
        }

        if (player.transcendInSpecialReq === "prest5") {
            if (i >= 0 && i <= 12) {
                tmp.prestigeChal[i].trapped = true;
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, 1);
            }
        }

        if (player.transcendInSpecialReq === "gen4") {
            if (i === 12) {
                tmp.prestigeChal[i].trapped = true;
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, 1);
            }
        }

        if (tmp.hinderances[2].depth.gt(0)) {
            if (i === 0) {
                tmp.prestigeChal[i].trapped = true;
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.hinderances[2].effects.nerfedUpg);
            }
            if (i === 2 || i === 3 || i === 7) {
                tmp.prestigeChal[i].trapped = true;
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.hinderances[2].effects.others);
            }
        }

        if (player.prestigeChallenge === i) {
            tmp.prestigeChal[i].entered = true;
            tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, 1);
        }

        if (i <= 3 && i >= 0) {
            if (tmp.prestigeChal[4].depth.gt(0)) {
                tmp.prestigeChal[i].trapped = true;
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.prestigeChal[4].effects.chal);
            }
        }

        if (i >= 5 && i <= 8) {
            if (tmp.prestigeChal[i + 1].depth.gt(0)) {
                tmp.prestigeChal[i].trapped = true;
                tmp.prestigeChal[i].depth = Decimal.add(tmp.prestigeChal[i].depth, tmp.prestigeChal[i + 1].depth);
            }
        }

        tmp.prestigeChal[i].effects = PRESTIGE_CHALLENGES[i].chalEffects(tmp.prestigeChal[i].depth);
    }
}

function updateHTML_prestigeChallenges() {
    if (tmp.tab === 1) {
        html['prestigeChallengeTab'].setDisplay(tmp.prestigeTab === 1)
        html['prestigeChallengeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0))

        if (tmp.prestigeTab === 1) {
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
    let shown = true;
    if (id === 4) {
        shown = player.prestigeChallengeCompleted.includes(0)
            && player.prestigeChallengeCompleted.includes(1)
            && player.prestigeChallengeCompleted.includes(2)
            && player.prestigeChallengeCompleted.includes(3);
    }
    if (id === 5) {
        shown = Decimal.gte(player.ascendUpgrades[13], 1) && !(hasSetbackUpgrade(`b3`) && player.prestigeChallengeCompleted.includes(5));
    }
    if (id >= 6 && id <= 8) {
        shown = hasSetbackUpgrade(`b3`) && player.prestigeChallengeCompleted.includes(id - 1) && !player.prestigeChallengeCompleted.includes(id);
    }
    if (id === 9) {
        shown = hasSetbackUpgrade(`b3`) && player.prestigeChallengeCompleted.includes(id - 1);
    }
    if (id >= 10 && id <= 12) {
        shown = Decimal.gte(player.ascendUpgrades[13], id - 8);
    }

    return shown;
}

function toggleCurrentPrestigeChallenge() {
    togglePrestigeChallenge(player.prestigeChallenge);
}

function togglePrestigeChallenge(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }
    tmp.prestigePointGain = D(0);
    if (player.prestigeChallenge === null) {
        doPrestigeReset(true);
        player.prestigeChallenge = i;
        if (i === 14) {
            for (let i = 0; i < player.prestigeUpgrades.length; i++) {
                player.prestigeUpgrades[i] = D(0);
            }
        }
        updateGame_prestige();
        return;
    }
    if (Decimal.gte(player.points, PRESTIGE_CHALLENGES[i].goal)) {
        if (!player.prestigeChallengeCompleted.includes(i)) {
            player.prestigeChallengeCompleted.push(i);
        }
    }
    doPrestigeReset(true);
    player.prestigeChallenge = null;
    updateGame_prestige();
}

function respecPrestigeChallenge() {
    player.prestigeChallengeCompleted = [];
    doAscendReset(true);
}