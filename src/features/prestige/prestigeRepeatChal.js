"use strict";

const PRESTIGE_CHALLENGES_REPEAT = [
    {
        shown() {
            return true;
        },
        goal(comp) {
            // tl;dr: req starts at 4e42, multiplied by 2e6 per comp, but then that multiplier also gets multiplied by 2 per comp
            let goal = linearAdd(comp, Math.log10(2e6), Math.log10(2), false).pow10().mul(4e42);
            return goal;
        },
        target(essence) {
            let target = linearAdd(Decimal.div(essence, 4e42).max(1).log10(), Math.log10(2e6), Math.log10(2), true);
            return target;
        },
        name: "Disgusting Prestiges",
        desc: "Prestige Point gain is log2()'d, and normal PC goal requirements are increased.",
        eff(comp) {
            return `Prestige Buyables have their own Prestige Generators (using Tier 2 Time Speed), which add 0.5 free levels to their own effect per level. PG/s: ${format(this.rewardEff(comp).exponent)}^x → ${format(this.rewardEff(Decimal.add(comp, 1)).exponent)}^x`;
        },
        rewardEff(comp) {
            const obj = { exponent: D(4) };
            obj.exponent = obj.exponent.pow(comp);

            return obj;
        },
        chalEffects(depth) {
            const obj = { log: D(1), higherPCs: false };
            obj.higherPCs = Decimal.gte(depth, 1);
            obj.log = obj.log.mul(depth);

            return obj;
        }
    },
    {
        shown() {
            return Decimal.gte(player.prestigeChallengeRepCompleted[0], 1);
        },
        goal(comp) {
            // tl;dr: req starts at 1e13, multiplied by 900 per comp, but then that multiplier also gets multiplied by 2 per comp
            let goal = linearAdd(comp, Math.log10(900), Math.log10(2), false).pow10().mul(1e13);
            return goal;
        },
        target(essence) {
            let target = linearAdd(Decimal.div(essence, 1e13).max(1).log10(), Math.log10(900), Math.log10(2), true);
            return target;
        },
        name: "Complete Dilation",
        desc: "All pre-transcension resources' gains are decreased by ▲0.75.",
        eff(comp) {
            return `Tier 1 Time Speed is increased by prestige essence. ${format(this.rewardEff(comp).timeSpeed, 2)}× → ${format(this.rewardEff(Decimal.add(comp, 1)).timeSpeed, 2)}×`;
        },
        rewardEff(comp) {
            const obj = { timeSpeed: D(1) };
            obj.timeSpeed = Decimal.max(player.prestigeEssence, 1).log2().add(1);
            obj.timeSpeed = obj.timeSpeed.pow(comp);

            return obj;
        },
        chalEffects(depth) {
            const obj = { exponent: D(0.75) };
            obj.exponent = obj.exponent.pow(depth);

            return obj;
        }
    },
    {
        shown() {
            return Decimal.gte(player.prestigeChallengeRepCompleted[1], 1);
        },
        goal(comp) {
            // tl;dr: req starts at 1e14, multiplied by 200 per comp, but then that multiplier also gets multiplied by 3 per comp
            let goal = linearAdd(comp, Math.log10(200), Math.log10(3), false).pow10().mul(1e14);
            return goal;
        },
        target(essence) {
            let target = linearAdd(Decimal.div(essence, 1e14).max(1).log10(), Math.log10(200), Math.log10(3), true);
            return target;
        },
        name: "Arduous Traditions",
        desc: "All autobuyers are stuck at 25/s, and Tier 1 Time Speed is stuck at 1×. Shift-clicking is disabled entirely. All exponential-and-above boosts to pre-transcension resources are disabled.",
        eff(comp) {
            return `Blue setback dimensions scale -10% slower, and A.B. #2's increasing cost scaling is 2× slower. Currently: -${formatPerc(this.rewardEff(comp).costSpeed, 2)}, ${format(this.rewardEff(comp).ascendCost)}× → -${formatPerc(this.rewardEff(Decimal.add(comp, 1)).costSpeed, 2)}, ${format(this.rewardEff(Decimal.add(comp, 1)).ascendCost)}×`;
        },
        // it's actually closer to 11.1% but formatPerc makes this "9.09%" because its multiplicative and i do not want to have to put a cap on something like this because i'll have nothing to resolve it with
        rewardEff(comp) {
            const obj = { costSpeed: D(10/9), ascendCost: D(2) };
            obj.costSpeed = obj.costSpeed.pow(comp);
            obj.ascendCost = obj.ascendCost.pow(comp);

            return obj;
        },
        chalEffects(depth) {
            const obj = { autobuyer: D(25), exp: D(0.5) };
            obj.exp = obj.exp.pow(depth);

            return obj;
        }
    },
    {
        shown() {
            return Decimal.gte(player.prestigeChallengeRepCompleted[2], 1);
        },
        goal(comp) {
            // tl;dr: req starts at 2e45, multiplied by 4000 per comp, but then that multiplier also gets multiplied by 4 per comp
            let goal = linearAdd(comp, Math.log10(4000), Math.log10(4), false).pow10().mul(2e45);
            return goal;
        },
        target(essence) {
            let target = linearAdd(Decimal.div(essence, 2e45).max(1).log10(), Math.log10(4000), Math.log10(4), true);
            return target;
        },
        name: "Generator Competence",
        desc: "Generators and tier levels' requirements scale ^2 as fast. Each prestige point requires at least 1 total generator level, alongside the point requirement.",
        eff(comp) {
            return `Prestige Points give a large boost to Generator Enhancers. Currently: ×${format(this.rewardEff(comp).mult)} → ×${format(this.rewardEff(Decimal.add(comp, 1)).mult)}`;
        },
        rewardEff(comp) {
            const obj = { mult: D(1) };
            obj.mult = Decimal.max(player.prestige, 1).pow(5);
            obj.mult = obj.mult.pow(comp);

            return obj;
        },
        chalEffects(depth) {
            const obj = { scaling: D(2) };
            obj.scaling = obj.scaling.pow(depth);

            return obj;
        }
    },
    {
        shown() {
            return Decimal.gte(player.prestigeChallengeRepCompleted[3], 1);
        },
        goal(comp) {
            // tl;dr: req starts at 1e30, multiplied by 2000 per comp, but then that multiplier also gets multiplied by 5 per comp
            let goal = linearAdd(comp, Math.log10(2000), Math.log10(5), false).pow10().mul(1e30);
            return goal;
        },
        target(essence) {
            let target = linearAdd(Decimal.div(essence, 1e30).max(1).log10(), Math.log10(2000), Math.log10(5), true);
            return target;
        },
        name: "Transcension Translation",
        desc: "Points are raised ^0.0005.",
        eff(comp) {
            return `Red to Cyan Setback Dimension multipliers are boosted based off of your transcension points. Currently: ×${format(this.rewardEff(comp).mult, 1)}, ^${format(this.rewardEff(comp).pow, 3)} → ×${format(this.rewardEff(Decimal.add(comp, 1)).mult, 1)}, ^${format(this.rewardEff(Decimal.add(comp, 1)).pow, 3)}`;
        },
        rewardEff(comp) {
            const obj = { mult: D(1), pow: D(1) };
            obj.mult = Decimal.max(player.transcendPoints, 1).log10().add(1).pow(0.25).sub(1).mul(comp).pow10();
            obj.pow = Decimal.max(player.transcendPoints, 10).log10().log10().mul(0.005).mul(comp).add(1)
            return obj;
        },
        chalEffects(depth) {
            const obj = { pow: D(0.0005) };
            obj.pow = obj.pow.pow(depth);

            return obj;
        }
    }
]

function initHTML_prestigeRepChal() {
    toHTMLvar('prestigeChallengeRepeatTab');
    toHTMLvar('prestigeChallengeRepeatTabButton');
    html['prestigeChallengeRepeatTab'].setDisplay(false);
    html['prestigeChallengeRepeatTabButton'].setDisplay(false);

    toHTMLvar('prestigeChallengeRepeatList');

    let txt = ``;
    for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
        txt += `
        <button onclick="togglePrestigeChallengeRepeat(${i})" id="prestigeChallengeRepeat${i}" class="whiteText font" style="cursor: pointer; height: 160px; width: 320px; font-size: 10px; margin: 2px">
            <b><span id="prestigeChallengeRepeat${i}name" style="font-size: 12px"><b>PRC${i+1}</b>: ${PRESTIGE_CHALLENGES_REPEAT[i].name} ×<span id="prestigeChallengeRepeat${i}comp"></span></span></b><br>
            <span id="prestigeChallengeRepeat${i}desc">${PRESTIGE_CHALLENGES_REPEAT[i].desc}</span><br>
            Goal: <span id="prestigeChallengeRepeat${i}goal"></span> prestige essence<br><br>
            Reward: <span id="prestigeChallengeRepeat${i}reward">${PRESTIGE_CHALLENGES_REPEAT[i].eff}</span>
        </button>
        `;
    }

    html['prestigeChallengeRepeatList'].setHTML(txt);
    for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
        toHTMLvar(`prestigeChallengeRepeat${i}`);
        toHTMLvar(`prestigeChallengeRepeat${i}name`);
        toHTMLvar(`prestigeChallengeRepeat${i}comp`);
        toHTMLvar(`prestigeChallengeRepeat${i}desc`);
        toHTMLvar(`prestigeChallengeRepeat${i}goal`);
        toHTMLvar(`prestigeChallengeRepeat${i}reward`);
    }
}

function updateGame_prestigeRepChal() {
    for (let i = PRESTIGE_CHALLENGES_REPEAT.length - 1; i >= 0; i--) {
        tmp.prestigeRepeatChal[i].shown = PRESTIGE_CHALLENGES_REPEAT[i].shown();

        tmp.prestigeRepeatChal[i].goal = PRESTIGE_CHALLENGES_REPEAT[i].goal(player.prestigeChallengeRepCompleted[i]);
        tmp.prestigeRepeatChal[i].target = PRESTIGE_CHALLENGES_REPEAT[i].target(player.prestigeEssence);

        // separate code for being trapped in a PRC
        // ! MAKE SURE NOT TO CHANGE PRC EFFECTS ON COMPLETIONS! they're all meant to be completed with the same restriction!
        tmp.prestigeRepeatChal[i].entered = false;
        tmp.prestigeRepeatChal[i].trapped = false;
        tmp.prestigeRepeatChal[i].depth = D(0);

        if (player.prestigeRepeatChal === i && !prestigeChallengeRepeatEnabled(i)) {
            togglePrestigeChallengeRepeat(i);
        }

        if (player.prestigeChallengeRepeat === i) {
            tmp.prestigeRepeatChal[i].entered = true;
            tmp.prestigeRepeatChal[i].depth = Decimal.add(tmp.prestigeRepeatChal[i].depth, 1);
        }

        tmp.prestigeRepeatChal[i].effects = PRESTIGE_CHALLENGES_REPEAT[i].chalEffects(tmp.prestigeRepeatChal[i].depth);
        tmp.prestigeRepeatChal[i].rewardEffs = PRESTIGE_CHALLENGES_REPEAT[i].rewardEff(player.prestigeChallengeRepCompleted[i]);
    }
}

function updateHTML_prestigeRepChal() {
    if (tmp.tab === 1) {
        html['prestigeChallengeRepeatTab'].setDisplay(tmp.prestigeTab === 3);
        html['prestigeChallengeRepeatTabButton'].setDisplay(hasSetbackUpgrade('b8'));

        if (tmp.prestigeTab === 3) {
            for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
                html[`prestigeChallengeRepeat${i}`].setDisplay(tmp.prestigeRepeatChal[i].shown);
                if (tmp.prestigeRepeatChal[i].shown) {
                    html[`prestigeChallengeRepeat${i}comp`].setTxt(format(player.prestigeChallengeRepCompleted[i]));

                    html[`prestigeChallengeRepeat${i}goal`].setTxt(format(tmp.prestigeRepeatChal[i].goal));
                    html[`prestigeChallengeRepeat${i}reward`].setTxt(PRESTIGE_CHALLENGES_REPEAT[i].eff(player.prestigeChallengeRepCompleted[i], 1));

                    html[`prestigeChallengeRepeat${i}`].changeStyle('background-color', 
                        (player.prestigeChallengeRepeat === i
                                ? '#00408080'
                                : '#00008080')
                    );
                    html[`prestigeChallengeRepeat${i}`].changeStyle('border', `3px solid ${
                        (player.prestigeChallengeRepeat === i
                                ? '#0080ff'
                                : '#0000ff')}`
                    );
                }
            }
        }
    }
}

function togglePrestigeChallengeRepeat(i) {
    if (!hasTranscendMilestone(14)) {
        if (!confirm("Are you sure you want to enter this challenge? You are entering a challenge which will do a TRANSCENSION reset! You have not gotten the 15th transcension milestone yet, which entering may lead to extensive loss of progress!")) {
            return;
        }
    }

    if (!(player.prestigeChallengeRepeat === i || player.prestigeChallengeRepeat === null)) {
        return;
    }

    const UNSAFE_UPGRADES = ["base", "point1", "prest1", "ascend1", "point2", "prest2", "ascend2", "point3", "prest3", "ascend3", "hinderance1", "gen1", "exp1", "ascend4", "gen2", "exp2", "prest4", "gen3", "exp3", "point4"];

    if (player.prestigeChallengeRepeat === null) {
        player.prestigeChalRepeatSave.transcendPoints = player.transcendPoints;
        player.prestigeChalRepeatSave.transcendResetCount = player.transcendResetCount;
        player.prestigeChalRepeatSave.transcendUpgrades = player.transcendUpgrades;

        player.transcendPoints = D(0);
        player.transcendResetCount = D(0);
        player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !UNSAFE_UPGRADES.includes(value) });

        player.specialBuyables[0] = D(0);
        doTranscendReset(true);

        player.prestigeChallengeRepeat = i;
        return;
    } else {
        player.transcendPoints = player.prestigeChalRepeatSave.transcendPoints;
        player.transcendResetCount = player.prestigeChalRepeatSave.transcendResetCount;
        player.transcendUpgrades = player.prestigeChalRepeatSave.transcendUpgrades;

        // saving transcendUpgrades is a waste, i should've done this instead
        player.transcendUpgrades = player.transcendUpgrades.filter((value) => { return !UNSAFE_UPGRADES.includes(value) });
        player.transcendUpgrades.push(...UNSAFE_UPGRADES);
    }

    if (Decimal.gte(player.prestigeEssence, tmp.prestigeRepeatChal[i].goal)) {
        player.prestigeChallengeRepCompleted[i] = Decimal.add(player.prestigeChallengeRepCompleted[i], 1);
    }

    player.specialBuyables[0] = D(0);
    doTranscendReset(true);
    
    player.prestigeChallengeRepeat = null;
}