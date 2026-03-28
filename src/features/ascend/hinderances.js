"use strict";

const HINDERANCES = [
    {
        name: "Precision Prestige",
        desc: "You gain a certain amount of darts upon prestiging based on your points and your time since a prestige. Your dart amount must be as close to an interval of 1,000 as possible. Buyables bought must be a perfect square in order for their effects to count.",
        start: D(1e160),
        get reward() {
            return `Prestige Essence gain is raised ^${format(this.eff, 3)} and every OoM of Prestige Essence increases Generator Speed by ^1.02.`;
        },
        get eff() {
            if (Decimal.lt(player.hinderanceScore[0], 1e160)) {
                return D(1);
            }
            let eff = Decimal.log(player.hinderanceScore[0], 1e40).log2().div(10).add(1);
            return eff;
        },
        chalEffects(depth) {
            const obj = { dartEffect: D(1), dartGain: D(1) };
            obj.dartGain = Decimal.max(player.points, 10).slog().log10().add(1).pow(2).mul(Decimal.max(player.timeInPrestige, 0).add(1).ln()).mul(1000);
            obj.dartGain = obj.dartGain.mul(depth);

            obj.dartEffect = Decimal.max(player.darts, 0).mul(Math.PI * 0.002).cos().add(1).div(2);
            obj.dartEffect = obj.dartEffect.pow(depth);
            return obj;
        },
        show: true
    },
    {
        name: "Undesirable Rot",
        desc: "Point and Generator speed decays the more you have. Every prestige point increases the requirement to the next.",
        start: D(1e75),
        get reward() {
            return `Prestige Point gain is increased by ×${format(this.eff, 3)} and Prestige Upgrade cap is increased by +2.`;
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[1], 1e75);
            eff = eff.log(1e75);
            return eff;
        },
        chalEffects(depth) {
            const obj = { decay: D(0.9), prestige: D(0.5) };
            obj.decay = obj.decay.pow(depth);
            obj.prestige = obj.prestige.pow(depth);

            return obj;
        },
        show: true
    },
    {
        name: "Multitude",
        desc: "You are trapped in PC1x3 (the effect is applied 3 times), PC3, PC4, and PC8: Black Out III. However, PC4 does not change intervals and Prestige Upgrades are reenabled.",
        start: D(1e110),
        get reward() {
            return `Point gain is multiplied by ×${format(this.eff, 1)} and automate gaining Prestige Points and Prestige Essence.`;
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[2], 1e110);
            eff = eff.log(1e110).ln().div(2).add(1).pow(2).sub(1).pow_base(1e35);
            return eff;
        },
        chalEffects(depth) {
            const obj = { nerfedUpg: D(3), others: D(1) };
            obj.nerfedUpg = obj.nerfedUpg.mul(depth);
            obj.others = obj.others.mul(depth);

            return obj;
        },
        show: true
    },
    {
        name: "Buyable Exclusion",
        desc: "All sources of points outside of basic buyables are raised ^0.2, including exponential changes, and the buyable interval is set to every 1,000.",
        start: D('e1000'),
        get reward() {
            return `The buyable interval boost is multiplied by ×${format(this.eff, 2)} and the buyable interval cost scaling is reduced to ×1.95.`;
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[3], 'e1000');
            eff = eff.log('e1000').pow(2);
            return eff;
        },
        chalEffects(depth) {
            const obj = { pts: D(0.2) };
            obj.pts = obj.pts.pow(depth);

            return obj;
        },
        get show() {
            return player.transcendUpgrades.includes('hinderance1');
        }
    },
    {
        name: "Supernova",
        desc: "All pre-transcension buyables cost the previous buyable, except for the first. This forcefully does a transcension reset!",
        start: D('6.666e6666'),
        get reward() {
            return `Tier 1 Timespeed is ×${format(this.eff, 2)} faster, and outside of transcension upgrade restrictions, tier levels' effect is changed from /1.01 -> /1.011.`;
        },
        get eff() {
            let eff = Decimal.max(player.hinderanceScore[4], '6.666e6666');
            eff = eff.log('6.666e6666').log2().pow_base(100000);
            return eff;
        },
        chalEffects(depth) {
            // unused because it used to be a power nerf to all resources pre-transcension(points, prestige points, etc.)
            const obj = { resource: D(1.0) };
            obj.resource = obj.resource.pow(depth);

            return obj;
        },
        get show() {
            return player.transcendUpgrades.includes('hinderance2');
        }
    },
]

function initHTML_hinderance() {
    toHTMLvar('hinderanceAscend');
    toHTMLvar('hinderanceAscendTabButton');
    toHTMLvar('hinderanceList');

    let txt = ``;
    for (let i = 0; i < HINDERANCES.length; i++) {
        txt += `
        <button onclick="toggleHinderance(${i})" id="hinderance${i}" class="whiteText font" style="height: 160px; width: 320px; font-size: 10px; margin: 2px; cursor: pointer">
            <b><span id="hinderance${i}name" style="font-size: 12px">H${i+1}: ${HINDERANCES[i].name}</span></b><br>
            <span id="hinderance${i}desc">${HINDERANCES[i].desc}</span><br>
            Goal: <span id="hinderance${i}goal"></span> points<br><br>
            Reward: <span id="hinderance${i}reward"></span>
        </button>
        `;
    }

    html['hinderanceList'].setHTML(txt);
    for (let i = 0; i < HINDERANCES.length; i++) {
        toHTMLvar(`hinderance${i}`);
        toHTMLvar(`hinderance${i}name`);
        toHTMLvar(`hinderance${i}desc`);
        toHTMLvar(`hinderance${i}goal`);
        toHTMLvar(`hinderance${i}reward`);
    }
}

function updateGame_hinderance() {
    for (let i = HINDERANCES.length - 1; i >= 0; i--) {
        tmp.hinderances[i].entered = false;
        tmp.hinderances[i].trapped = false;
        tmp.hinderances[i].depth = D(0);

        // higher level stuff first
        if (player.transcendInSpecialReq === "hinderance2") {
            if (i === 2 || i === 3) {
                tmp.hinderances[i].trapped = true;
                tmp.hinderances[i].depth = Decimal.add(tmp.hinderances[i].depth, 1);
            }
        }

        if (player.currentHinderance === i) {
            tmp.hinderances[i].entered = true;
            tmp.hinderances[i].depth = Decimal.add(tmp.hinderances[i].depth, 1);
        }

        tmp.hinderances[i].effects = HINDERANCES[i].chalEffects(tmp.hinderances[i].depth);
    }

    if (player.currentHinderance !== null) {
        player.hinderanceScore[player.currentHinderance] = Decimal.max(player.hinderanceScore[player.currentHinderance], player.bestPointsInAscend);
    }
    for (let i = 0; i < HINDERANCES.length; i++) {
        player.bestHinderanceScore[i] = Decimal.max(player.bestHinderanceScore[i], player.hinderanceScore[i]);
    }
}

function updateHTML_hinderance() {
    if (tmp.tab === 3) {
        html['hinderanceAscendTabButton'].setDisplay(hasSetbackUpgrade(`b5`));
        html['hinderanceAscend'].setDisplay(tmp.ascendTab === 2);
        if (tmp.ascendTab === 2) {
            for (let i = 0; i < HINDERANCES.length; i++) {
                html[`hinderance${i}`].setDisplay(HINDERANCES[i].show);
                if (HINDERANCES[i].show) {
                    html[`hinderance${i}`].changeStyle('background-color', (player.currentHinderance === i ? '#b0002080' : '#60001080'));
                    html[`hinderance${i}`].changeStyle('border', `3px solid ${Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].start) ? (player.currentHinderance === i ? '#ff809a' : '#c60078') : (player.currentHinderance === i ? '#ff0030' : '#c00020')}`);
                    html[`hinderance${i}goal`].setTxt(`${format(player.hinderanceScore[i])} / ${format(HINDERANCES[i].start)}`);
                    html[`hinderance${i}reward`].setTxt(HINDERANCES[i].reward);
                }
            }
        }
    }
}

function toggleHinderance(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }

    tmp.ascendPointGain = D(0);
    if (player.currentHinderance === null) {
        doAscendReset(true);
        if (i === 4) {
            doTranscendReset(true);
        }
        player.currentHinderance = i;
        return;
    }
    doAscendReset(true);
    player.currentHinderance = null;
}