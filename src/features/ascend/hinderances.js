"use strict";

const HINDERANCES = [
    {
        name: "Precision Prestige",
        desc: "You gain a certain amount of darts upon prestiging based on your points and your time since a prestige. Your dart amount must be as close to an interval of 1,000 as possible. Buyables bought must be a perfect square in order for their effects to count.",
        start: D(1e160),
        get reward() {
            return `Prestige Essence gain is raised ^${format(this.eff, 3)} and every OoM of Prestige Essence increases Generator Speed by +^${format(hasHinderanceMilestone(0, 2) ? D(0.02).add(Decimal.max(player.prestigeEssence, 1).log10().mul(0.0001)) : D(0.02), 2)}.`;
        },
        get eff() {
            if (Decimal.lt(player.hinderanceScore[0], 1e160) || tmp.prestigeRepeatChal[5].depth.gt(0)) {
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
        threshold: D('ee6'),
        pointEff(points) {
            return Decimal.max(points, 0).add(1).log10().add(1).log10().mul(0.05).add(1);
        },
        pointDisp(eff) {
            return `Raising prestige essence gain by ^${format(eff, 3)}.`;
        },
        milestones: [
            { req: D('ee7'), desc: `H1's effect also affects PE effect.` },
            { req: D('ee9'), desc: `In H1, autobuyers follow H1\'s restrictions.` },
            { req: D('ee15'), desc: `Every 100 OoMs of Prestige Essence increases the boost of H1's secondary effect by +0.01.` }
        ],
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
            if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
                return D(1);
            }
            let eff = Decimal.max(player.hinderanceScore[1], 1e75);
            eff = eff.log(1e75);
            if (hasHinderanceMilestone(1, 2)) {
                eff = eff.pow(2);
            }
            return eff;
        },
        chalEffects(depth) {
            const obj = { decay: D(0.9), prestige: D(0.5) };
            obj.decay = obj.decay.pow(depth);
            obj.prestige = obj.prestige.pow(depth);

            return obj;
        },
        threshold: D('ee6'),
        pointEff(points) {
            return Decimal.max(points, 0).add(1).log10().add(1).log10().mul(0.01).add(1);
        },
        pointDisp(eff) {
            return `Raising prestige points by ^${format(eff, 3)}.`;
        },
        milestones: [
            { req: D('e5e6'), desc: `H2\'s effect also affects prestige essence gain.` },
            { req: D('e2e8'), desc: `Prestige upgrade cap is increased by +2 per OoM^2 of PB past threshold.` },
            { req: D('ee12'), desc: `H2\'s effect is squared.` }
        ],
        show: true
    },
    {
        name: "Multitude",
        desc: "You are trapped in PC1x3 (the effect is applied 3 times), PC3, PC4, and PC8: Black Out III. However, PC4 does not change intervals and Prestige Upgrades are reenabled.",
        start: D(1e110),
        get reward() {
            if (hasHinderanceMilestone(2, 0)) {
                return `Point gain is multiplied by ^${format(this.eff, 3)} and automate gaining Prestige Points and Prestige Essence.`;
            } else {
                return `Point gain is multiplied by ×${format(this.eff, 1)} and automate gaining Prestige Points and Prestige Essence.`;
            }
        },
        get eff() {
            if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
                return D(1);
            }
            let eff = Decimal.max(player.hinderanceScore[2], 1e110);
            if (hasHinderanceMilestone(2, 0)) {
                eff = eff.log(1e110).log2().mul(0.01).add(1);
            } else {
                eff = eff.log(1e110).ln().div(2).add(1).pow(2).sub(1).pow_base(1e35);
            }

            return eff;
        },
        chalEffects(depth) {
            const obj = { nerfedUpg: D(3), others: D(1) };
            obj.nerfedUpg = obj.nerfedUpg.mul(depth);
            obj.others = obj.others.mul(depth);

            return obj;
        },
        threshold: D('e4e8'),
        pointEff(points) {
            return Decimal.max(points, 0).add(1).log10().add(1).log10().mul(0.1);
        },
        pointDisp(eff) {
            return `Basic buyables generate their previous buyable with ^${format(eff, 3)} effect. Uses Tier 1 time speed.`;
        },
        milestones: [
            { req: D('e2e10'), desc: `H3\'s effect is changed into raising point gain.` },
            { req: D('e5e14'), desc: `H3\'s effect also affects ascension points.` },
            { req: D('e3e16'), desc: `H3\'s effect also affects ascension gems.` },
            { req: D('e2e20'), desc: `H3\'s effect also affects generator xp.` },
            { req: D('ee25'), desc: `H3\'s effect also affects generator enhancers.` },
            { req: D('ee40'), desc: `H3\'s effect also affects tier 1 time speed.` },
            { req: D('ee60'), desc: `H3\'s effect also affects generator speed.` },
            { req: D('ee90'), desc: `H3\'s effect also affects transcension points.` },
            { req: D('ee120'), desc: `H3\'s effect also affects tier speed.` }
        ],
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
            if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
                return D(1);
            }
            let eff = Decimal.max(player.hinderanceScore[3], 'e1000');
            eff = eff.log('e1000').pow(2);
            return eff;
        },
        chalEffects(depth) {
            const obj = { pts: D(0.2) };
            obj.pts = obj.pts.pow(depth);

            return obj;
        },
        threshold: D('e1.25e7'),
        pointEff(points) {
            return passiveLogSlowdown(Decimal.max(points, 0).add(1), 10, false);
        },
        pointDisp(eff) {
            return `Increasing the buyable interval boost by ×${format(eff, 1)}.`;
        },
        milestones: [
            { req: D('e6.5e8'), desc: `Basic Buyables scale 1.90× faster instead.` },
            { req: D('e2e10'), desc: `Each basic buyable interval needs more purchases to reach. Every OoM^2 of PB past threshold increases the interval by +10.` },
            { req: D('ee12'), desc: `Last milestone also affects setback dimensions.` },
            { req: D('ee14'), desc: `Basic Buyables scale 1.85× faster instead.` },
            { req: D('ee16'), desc: `Basic Buyables scale 1.8× faster instead.` },
            { req: D('ee19'), desc: `Basic Buyables scale 1.75× faster instead.` },
            { req: D('ee23'), desc: `Basic Buyables scale 1.7× faster instead.` },
            { req: D('ee27'), desc: `Basic Buyables scale 1.65× faster instead.` },
            { req: D('ee30'), desc: `Basic Buyables scale 1.6× faster instead.` },
            { req: D('ee35'), desc: `Basic Buyables scale 1.55× faster instead.` },
            { req: D('ee40'), desc: `Basic Buyables scale 1.5× faster instead.` }
        ],
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
            if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
                return D(1);
            }
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
        threshold: D('e4e6'),
        pointEff(points) {
            return Decimal.max(points, 0).add(1).log10().add(1).log10().mul(0.02).add(1);
        },
        pointDisp(eff) {
            return `Raising T1 and T2 time speed by ^${format(eff, 3)}.`;
        },
        milestones: [
            { req: D('e2e8'), desc: `Gen. XP and Gen. Enh. Buyables\' #1-6 base costs are set to 1.` },
            { req: D('ee9'), desc: `Ascension buyables\' base costs are set to 1. A.B. #3\'s cap is removed, but non-existant buyables do nothing.` },
            { req: D('ee12'), desc: `Prestige buyables and fluid buyables\' base costs are set to 1.` },
            { req: D('ee16'), desc: `Tier effect is instead /1.012.` },
            { req: D('ee24'), desc: `Tier 2 Time Speed is affected by H5 by a reduced rate (1 + 0.01 log10(x)).` },
            { req: D('ee40'), desc: `Tier effect is instead /1.013.` },
            { req: D('ee96'), desc: `Tier effect is instead /1.014.` },
            { req: Decimal.pow10(Number.MAX_VALUE), desc: `Tier effect is instead /1.015.` }
        ],
        get show() {
            return player.transcendUpgrades.includes('hinderance2');
        }
    },
    {
        name: "I replican't.",
        desc: "Your point gain is replaced with your replicator amount, and T1 time speed is stuck at 1×. Replicator speed is reduced by ▲0.50 and strength reduced by /2. Force a transcension and replirank reset.",
        start: D('e2e6'),
        get reward() {
            return `Replicator strength is ×${format(this.eff, 2)} higher, and repli-resources' effects that boost the previous gains are squared.`;
        },
        get eff() {
            if (tmp.prestigeRepeatChal[5].depth.gt(0)) {
                return D(1);
            }
            let eff = Decimal.max(player.hinderanceScore[5], 'e2e6');
            eff = eff.log('e2e6').log2().add(1).pow(2);
            return eff;
        },
        chalEffects(depth) {
            const obj = { repliSpd: D(0.5), repliStr: D(2) };
            obj.repliSpd = obj.repliSpd.pow(depth);
            obj.repliStr = obj.repliStr.pow(depth);

            return obj;
        },
        threshold: D('ee7'),
        pointEff(points) {
            return Decimal.max(points, 0).add(1).log10().add(1).log10().mul(0.05).add(1);
        },
        pointDisp(eff) {
            return `Raising RepliRank, RepliTier, and RepliTetr points by ^${format(eff, 3)}.`;
        },
        milestones: [
            { req: D('ee7'), desc: `Repli-resources' effects that boost the previous gains are raised ^1.5.` },
            { req: D('e2.5e7'), desc: `RepliTetr points' effects are squared.` },
            { req: D('ee8'), desc: `Replicator speed is raised by H6 points' effect.` },
        ],
        get show() {
            return player.transcendUpgrades.includes('hinderance3');
        }
    }
]

function hasHinderanceMilestone(i, j) {
    if (!hasSetbackUpgrade('b9')) {
        return false;
    }
    return Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].milestones[j].req);
}

function initHTML_hinderance() {
    toHTMLvar('hinderanceAscend');
    toHTMLvar('hinderanceAscendTabButton');
    toHTMLvar('hinderancePtsAscend');
    toHTMLvar('hinderancePtsAscendTabButton');

    toHTMLvar('hinderanceList');
    toHTMLvar('hinderancePtsList');

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

    txt = ``;
    for (let i = 0; i < HINDERANCES.length; i++) {
        let milestone = ``;
        for (let j = HINDERANCES[i].milestones.length - 1; j >= 0; j--) {
            milestone += `
                <div style="font-size: 12px; width: 500px; margin: 4px; padding: 4px; background-color: #60001080; border: 3px solid #c00020;" class="flex-vertical whiteText font" id="hind${i}Milestone${j}">
                    <b style="font-size: 16px">Milestone ${j+1}</b><br>
                    <span id="hind${i}Milestone${j}desc" style="text-align: center">${HINDERANCES[i].milestones[j].desc}</span>
                    <span id="hind${i}Milestone${j}req" style="text-align: center"></span>
                </div>
            `
        }

        txt += `
        <div style="background-color: #60001080; border: 3px solid #c00020; margin: 2px;" id="hindPts${i}All">
            <div style="width: 1000px;" class="flex-horizontal">
                <div id="hindPts${i}PtsAll" style="background-color: #60001080; border: 3px solid #c00020; width: 450px; margin: 2px;" class="flex-horizontal">
                    <div style="margin: 4px" class="flex-vertical" id="hindPts${i}Show">
                        <span class="font" style="font-size: 24px;" id="hindPts${i}Disp"></span><span class="font" style="font-size: 12px;">Hinderance ${i+1} points</span>
                        <span class="font" style="font-size: 12px;" id="hindPts${i}GenDisp"></span>
                        <span class="font" style="font-size: 12px;" id="hindPts${i}EffDisp"></span>
                    </div>
                </div>
                <div id="hindPts${i}MilestoneList" style="background-color: #60001080; border: 3px solid #c00020; margin: 2px; width: 550px; height: 255px; overflow-x: hidden; overflow-y: auto; justify-content: normal;" class="flex-vertical">
                    ${milestone}
                </div>
            </div>
        </div>
        `;
    }
    html['hinderancePtsList'].setHTML(txt);

    for (let i = 0; i < HINDERANCES.length; i++) {
        for (let j = 0; j < HINDERANCES[i].milestones.length; j++) {
            toHTMLvar(`hind${i}Milestone${j}`);
            toHTMLvar(`hind${i}Milestone${j}desc`);
            toHTMLvar(`hind${i}Milestone${j}req`);
        }

        toHTMLvar(`hindPts${i}All`);
        toHTMLvar(`hindPts${i}Show`);
        toHTMLvar(`hindPts${i}Disp`);
        toHTMLvar(`hindPts${i}GenDisp`);
        toHTMLvar(`hindPts${i}EffDisp`);
        toHTMLvar(`hindPts${i}PtsAll`);
        toHTMLvar(`hindPts${i}MilestoneList`);
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

function updateGame_hinderanceResources() {
    for (let i = 0; i < HINDERANCES.length; i++) {
        let m =  Decimal.max(player.hinderanceScore[i], 1e10).log10().log10().sub(HINDERANCES[i].threshold.log10().log10());
        tmp.hinderancePtsGain[i] = m.mul(m.add(1)).div(2).pow_base(1000);
        tmp.hinderancePtsGain[i] = tmp.hinderancePtsGain[i].mul(tmp.timeSpeedTiers[1]);
        if (!hasSetbackUpgrade('b9') || Decimal.lt(player.hinderanceScore[i], HINDERANCES[i].threshold)) {
            tmp.hinderancePtsGain[i] = D(0);
        }

        player.hinderancePts[i] = Decimal.add(player.hinderancePts[i], tmp.hinderancePtsGain[i].mul(delta));

        tmp.hinderancePtsEff[i] = HINDERANCES[i].pointEff(hasSetbackUpgrade('b9') && m.gt(0)
            ? player.hinderancePts[i] 
            : D(0));
        tmp.hinderancePtsDesc[i] = HINDERANCES[i].pointDisp(tmp.hinderancePtsEff[i]);
    }
}

function updateHTML_hinderance() {
    if (tmp.tab === 3) {
        html['hinderanceAscendTabButton'].setDisplay(hasSetbackUpgrade(`b5`));
        html['hinderancePtsAscendTabButton'].setDisplay(hasSetbackUpgrade(`b9`));

        html['hinderanceAscend'].setDisplay(tmp.ascendTab === 2);
        html['hinderancePtsAscend'].setDisplay(tmp.ascendTab === 3);
        
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

        if (tmp.ascendTab === 3) {
            for (let i = 0; i < HINDERANCES.length; i++) {
                let unlocked = HINDERANCES[i].show && (i === 0 || (Decimal.gte(player.hinderanceScore[i - 1], HINDERANCES[i - 1].threshold)));
                html[`hindPts${i}All`].setDisplay(unlocked);
                if (unlocked) {
                    let color = Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].threshold)
                        ? '#80006080'
                        : '#60001080';
                    html[`hindPts${i}PtsAll`].changeStyle('background-color', color);
                    html[`hindPts${i}All`].changeStyle('background-color', color);

                    color = Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].threshold)
                        ? '#c60078'
                        : '#c00020';
                    html[`hindPts${i}PtsAll`].changeStyle('border', `3px solid ${color}`);
                    html[`hindPts${i}All`].changeStyle('border', `3px solid ${color}`);

                    html[`hindPts${i}Show`].changeStyle('color', Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].threshold)
                        ? '#e080c8'
                        : '#e080a0');

                    html[`hindPts${i}Disp`].setTxt(format(player.hinderancePts[i]));
                    html[`hindPts${i}GenDisp`].setTxt(Decimal.gte(player.hinderanceScore[i], HINDERANCES[i].threshold)
                        ? `${format(tmp.hinderancePtsGain[i], 2)}/s`
                        : `You need a PB of ${format(HINDERANCES[i].threshold)} in this hinderance!`);
                    html[`hindPts${i}EffDisp`].setTxt(tmp.hinderancePtsDesc[i]);

                    for (let j = 0; j < HINDERANCES[i].milestones.length; j++) {
                        if (j > 1) {
                            html[`hind${i}Milestone${j}`].setDisplay(hasHinderanceMilestone(i, j - 2) || hasHinderanceMilestone(i, j - 1) || hasHinderanceMilestone(i, j));
                        }
                        html[`hind${i}Milestone${j}`].changeStyle('background-color', hasHinderanceMilestone(i, j)
                            ? '#80006080' 
                            : '#60001080');
                        html[`hind${i}Milestone${j}`].changeStyle('border', hasHinderanceMilestone(i, j) 
                            ? '3px solid #c60078' 
                            : '3px solid #800018');

                        html[`hind${i}Milestone${j}req`].setHTML(`Requirement: ${format(player.hinderanceScore[i])} / ${format(HINDERANCES[i].milestones[j].req)} H${i+1} Personal Best`);
                    }
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
        if (i === 4 || i === 5) {
            doTranscendReset(true);
        }
        if (i === 5) {
            repliRankReset(true);
        }
        player.currentHinderance = i;
        return;
    }
    doAscendReset(true);
    player.currentHinderance = null;
}