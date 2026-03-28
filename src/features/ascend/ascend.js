"use strict";
const ASCENSION_UPGRADES = [
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[0]);
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000);
            }
            cost = cost.div(100).exp().sub(1).mul(100).pow_base(2).mul(10);
            return cost;
        },
        target(resource) {
            let target = Decimal.div(resource, 10).max(1).log2().div(100).add(1).ln().mul(100);
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000);
            }
            return target;
        },
        get eff() {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            return Decimal.pow(1.258, player.ascendUpgrades[0]);
        },
        get desc() {
            return `Multiply point gain by 25.8%. Currently: ×${format(this.eff, 2)}.`;
        } 
    },
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[1]);
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000);
            }
            cost = cost.div(25).exp().sub(1).mul(25).pow_base(2.5).mul(50);
            return cost;
        },
        target(resource) {
            let target = Decimal.div(resource, 50).max(1).log(2.5).div(25).add(1).ln().mul(25);
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000);
            }
            return target;
        },
        get eff() {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            return Decimal.pow(Decimal.max(player.ascend, 0).add(1).log10().add(1.095).pow(2), player.ascendUpgrades[1]);
        },
        get desc() {
            return `Multiply generator gain by ${format(Decimal.max(player.ascend, 0).add(1).log10().add(1.095).pow(2), 2)}×. Currently: ×${format(this.eff, 2)}.`;
        } 
    },
    {
        show: true,
        get cap() {
            let cap = D(5);
            if (player.transcendUpgrades.includes('ascend2')) {
                cap = cap.add(1);
            }
            return cap;
        },
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[2]);
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000);
            }
            cost = cost.pow_base(40).mul(250);
            return cost;
        },
        target(resource) {
            let target = Decimal.div(resource, 250).max(1).log(40);
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000);
            }
            return target;
        },
        get eff() {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            return D(1.1);
        },
        get desc() {
            return Decimal.eq(player.ascendUpgrades[2], 0)
                ? `Buyable 1's effect is raised to the ^${format(this.eff, 2)} Currently: None.`
                : Decimal.eq(player.ascendUpgrades[2], 1)
                    ? `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyable 1.`
                    : `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyables 1-${format(player.ascendUpgrades[2])}.`
        } 
    },
    {
        show: true,
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[3]);
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000);
            }

            let scale = D(25);
            if (hasSetbackUpgrade(`g13`)) {
                scale = scale.mul(SETBACK_UPGRADES[1][12].eff);
            }
            cost = cost.div(scale).exp().sub(1).mul(scale).pow_base(3).mul(10);
            return cost
        },
        target(resource) {
            let scale = D(25);
            if (hasSetbackUpgrade(`g13`)) {
                scale = scale.mul(SETBACK_UPGRADES[1][12].eff);
            }

            let target = Decimal.div(resource, 10).max(1).log(3).div(scale).add(1).ln().mul(scale);
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000);
            }
            return target;
        },
        get eff() {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let eff = Decimal.max(player.ascend, 1).log10().add(2);
            if (player.transcendUpgrades.includes('ascend4')) {
                eff = eff.mul(Decimal.max(player.ascendGems, 1).log10().add(1));
            }
            return Decimal.pow(eff, player.ascendUpgrades[3]);
        },
        get desc() {
            return `Ascension Gem gain is increased based off of your Ascension Points. Currently: ×${format(this.eff, 2)}.`;
        } 
    },
    ...(() => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push({
                show: true,
                cap: D(Infinity),
                req: true,
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 4]);
                    if (player.transcendInSpecialReq === "point4") {
                        cost = cost.mul(1000);
                    }
                    cost = cost.div(9).add(1).pow(1.5).sub(1).exp().sub(1).mul(6).pow(2).mul(2).pow_base(i + 2).mul(100 * (2 ** i));
                    return cost;
                },
                target(resource) {
                    let target = D(resource);
                    target = target.div(100 * (2 ** i)).max(1).log(i + 2).div(2).root(2).div(6).add(1).ln().add(1).root(1.5).sub(1).mul(9);
                    if (player.transcendInSpecialReq === "point4") {
                        target = target.div(1000);
                    }
                    return target;
                },
                get eff() {
                    if (player.transcendInSpecialReq === "ascend5") {
                        return D(0);
                    }
                    return Decimal.eq(player.ascendUpgrades[i + 4], 0) ? D(0) : Decimal.add(player.ascendUpgrades[i + 4], 1).pow_base(2);
                },
                get desc() {
                    return `Automate Buyable ${i+1}. This autobuyer can buy up to ${format(this.eff)}/s.`;
                } 
            });
        }
        return arr;
    })(),
    ...(() => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push({
                show: true,
                get cap() {
                    if (false) {
                        return D(Infinity);
                    }
                    let cap = D(5);
                    if (player.transcendUpgrades.includes('ascend2')) {
                        cap = cap.add(1);
                    }
                    return cap;
                },
                // ! replace false with the condition to ignore the buyable limitation
                get req() {
                    return (false || Decimal.lte(player.buyables[i], 0)) && Decimal.gte(player.points, Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)));
                },
                get reqDesc() {
                    if (false) {
                        return `You must reach ${format(Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))} points.`;
                    } else {
                        return `You must not buy Buyable ${i+1} and you must reach ${format(Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))} points.`;
                    }
                },
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 8]);
                    if (player.transcendInSpecialReq === "point4") {
                        cost = cost.mul(1000);
                    }
                    cost = cost.add(1).pow_base(1000 * (2 ** i));
                    return cost;
                },
                target(resource) {
                    if (!false && Decimal.gt(player.buyables[i], 0)) {
                        return D(0);
                    }
                    let target1 = D(resource);
                    target1 = target1.max(1000 * (2 ** i)).log(1000 * (2 ** i)).sub(1);
                    if (player.transcendInSpecialReq === "point4") {
                        target1 = target1.div(1000);
                    }

                    let target2 = D(player.points);
                    target2 = target2.div(1e20 * (1e3 ** i)).max(1).log(1e3 * (10 ** i)).root(2);
                    if (player.transcendInSpecialReq === "point4") {
                        target2 = target2.div(1000);
                    }
                    return Decimal.min(target1, target2);
                },
                get eff() {
                    // i don't believe this is a softcap because what do you expect me to do, make it go divide by 0?
                    // besides that, this is still accurate to the description
                    if (Decimal.gt(player.ascendUpgrades[i + 8], 9)) {
                        return Decimal.sub(player.ascendUpgrades[i + 8], 9).pow_base(0.9).recip().mul(10);
                    } else {
                        return Decimal.sub(1, Decimal.mul(0.1, player.ascendUpgrades[i + 8])).recip();
                    }
                },
                get desc() {
                    return `Buyable ${i+1}'s cost scaling is 10% slower. Currently: ${formatPerc(this.eff, 2)} slower.`
                } 
            })
        }
        return arr
    })(),
    {
        show: true,
        get cap() {
            let cap = D(2);
            if (player.transcendUpgrades.includes('ascend5')) {
                cap = cap.add(1);
            }
            return cap;
        },
        get req() {
            return player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension
        },
        reqDesc: `You must not buy any Prestige Upgrades in the current Ascension while completing 5 Prestige Challenges.`,
        get cost() {
            let cost = D(player.ascendUpgrades[12])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.add(1).pow_base(1e6)
            return cost
        },
        target(resource) {
            if (!(player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension)) {
                return D(0)
            }
            let target = Decimal.max(resource, 1e6).log(1e6).sub(1)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            return player.ascendUpgrades[12]
        },
        get desc() {
            return `Unlock 1 more row of Prestige Upgrades. Currently: +${format(this.eff)} row(s).`
        } 
    },
    {
        show: true,
        cap: D(4),
        get req() {
            return player.prestigeChallengeCompleted.length === 0 && Decimal.gte(player.prestige, Decimal.add(player.ascendUpgrades[13], 1).pow(3).mul(10))
        },
        get reqDesc() {
            return `You must not complete any Prestige Challenges while having ${format(Decimal.add(player.ascendUpgrades[13], 1).pow(3).mul(10))} total prestige points.`
        },
        get cost() {
            let cost = D(player.ascendUpgrades[13])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.add(1).pow(2.5).pow_base(1e6).div(100)
            return cost
        },
        target(resource) {
            if (player.prestigeChallengeCompleted.length !== 0) {
                return D(0)
            }
            let target1 = Decimal.max(player.ascendGems, 1e4).mul(100).log(1e6).root(2.5).sub(1)
            if (player.transcendInSpecialReq === "point4") {
                target1 = target1.div(1000)
            }

            let target2 = Decimal.max(player.prestige, 10).div(10).root(3).sub(1)
            if (player.transcendInSpecialReq === "point4") {
                target2 = target2.div(1000)
            }
            return Decimal.min(target1, target2)
        },
        get eff() {
            return player.ascendUpgrades[13]
        },
        get desc() {
            return `Unlock another Prestige Challenge. Currently: +${format(this.eff)} challenges.`
        } 
    },
    {
        get show() {
            return hasSetbackUpgrade('g10')
        },
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[14])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(12).add(1).pow(2).sub(1).exp().sub(1).mul(6).pow(2).mul(2).pow_base(1e8).mul(1e60)
            return cost
        },
        target(resource) {
            let target = D(resource)
            target = target.div(1e60).max(1).log(1e8).div(2).root(2).div(6).add(1).ln().add(1).root(2).sub(1).mul(12)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            let eff = D(player.ascendUpgrades[14])
            if (hasTranscendMilestone(3)) {
                eff = eff.add(2)
            }
            return Decimal.pow(2, eff)
        },
        get desc() {
            return `Automate Buyable 5. This autobuyer can buy up to ${format(this.eff.mul(10))}/s.`
        } 
    },
    {
        get show() {
            return hasSetbackUpgrade('g10')
        },
        cap: D(Infinity),
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[15])
            if (player.transcendInSpecialReq === "point4") {
                cost = cost.mul(1000)
            }
            cost = cost.div(16).add(1).pow(2).sub(1).exp().sub(1).mul(6).pow(2).mul(2).pow_base(1e10).mul(1e70)
            return cost
        },
        target(resource) {
            let target = D(resource)
            target = target.div(1e70).max(1).log(1e10).div(2).root(2).div(6).add(1).ln().add(1).root(2).sub(1).mul(16)
            if (player.transcendInSpecialReq === "point4") {
                target = target.div(1000)
            }
            return target
        },
        get eff() {
            let eff = D(player.ascendUpgrades[15])
            if (hasTranscendMilestone(3)) {
                eff = eff.add(2)
            }
            return Decimal.eq(eff, 0) ? D(0) : Decimal.add(eff, 1).pow_base(2)
        },
        get desc() {
            return `Automate Buyable 6. This autobuyer can buy up to ${format(this.eff)}/s.`
        } 
    },
]

function initHTML_ascend() {
    toHTMLvar('ascendTab');
    toHTMLvar('ascendTabButton');
    html['ascendTab'].setDisplay(false);
    html['ascendTabButton'].setDisplay(false);

    toHTMLvar('mainAscendTabButton');
    toHTMLvar('ascend');
    toHTMLvar('ascendAmount');
    toHTMLvar('ascendNext');
    toHTMLvar('ascendPoints');
    toHTMLvar('ascendPointEffect');
    toHTMLvar('ascendPointEffectNext');
    toHTMLvar('ascendUpgradeList');
    toHTMLvar('ascendGems');
    toHTMLvar('ascendUpgAuto');
    toHTMLvar('ascendBuyRespec');
    toHTMLvar('mainAscend');

    let txt = ``;
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyAscendUpgrade(${i})" id="ascendUpgrade${i}" class="whiteText font" style="height: 110px; width: 220px; font-size: 9px; margin: 2px">
                <span style="font-size: 11px;">Ascension Buyable #${i + 1}</span><br>
                <span style="font-size: 8px;" id="ascendUpgrade${i}amount"></span><br>
                <span id="ascendUpgrade${i}eff"></span><br><br>
                <span style="font-size: 8px;" id="ascendUpgrade${i}req"></span><br>
                <span id="ascendUpgrade${i}cost"></span>
            </button>
        `;
    }
    html['ascendUpgradeList'].setHTML(txt);
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        toHTMLvar(`ascendUpgrade${i}`);
        toHTMLvar(`ascendUpgrade${i}eff`);
        toHTMLvar(`ascendUpgrade${i}cost`);
        toHTMLvar(`ascendUpgrade${i}req`);
        toHTMLvar(`ascendUpgrade${i}amount`);
    }
}

function updateGame_ascend() {
    player.timeInAscend = Decimal.add(player.timeInAscend, Decimal.mul(delta, tmp.timeSpeedTiers[0]));
    player.time2ndInAscend = Decimal.add(player.time2ndInAscend, Decimal.mul(delta, tmp.timeSpeedTiers[1]));

    for (let i = ASCENSION_UPGRADES.length - 1; i >= 0; i--) {
        if (player.ascendUpgrades[i] === undefined) {
            player.ascendUpgrades[i] = D(0);
        }

        tmp.ascendBuyables[i].cost = ASCENSION_UPGRADES[i].cost;

        let resource;
        if (tmp.hinderances[4].depth.gt(0) && i != 0) {
            resource = player.ascendUpgrades[i - 1];
        } else {
            resource = player.ascendGems;
        }
        tmp.ascendBuyables[i].target = ASCENSION_UPGRADES[i].target(resource);
        tmp.ascendBuyables[i].canBuy = Decimal.gte(resource, tmp.ascendBuyables[i].cost);

        if (player.cheats.autoAscendUpgrades || player.ascendUpgAuto) {
            let bought = player.ascendUpgrades[i];
            player.ascendUpgrades[i] = Decimal.min(tmp.ascendBuyables[i].target, ASCENSION_UPGRADES[i].cap).add(0.99999999).max(player.ascendUpgrades[i]).floor();
            if (Decimal.gt(player.ascendUpgrades[i], bought)) {
                player.ascendUpgrades[i] = Decimal.sub(player.ascendUpgrades[i], 1);
                player.ascendGems = Decimal.sub(player.ascendGems, tmp.ascendBuyables[i].cost).max(0); // idk why this is causing ascendGems to go negative so i put a max 0 here
                player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1);
            }
        }

        tmp.ascendBuyables[i].eff = ASCENSION_UPGRADES[i].eff;
    }

    tmp.ascendReq = D(1e21);
    if (hasSetbackUpgrade(`r9`)) {
        tmp.ascendReq = tmp.ascendReq.div(SETBACK_UPGRADES[0][8].eff);
    }
    if (colorAmountTotal(2).gt(0)) {
        tmp.ascendReq = tmp.ascendReq.pow(tmp.setbackEffects[2][0]);
    }
    tmp.factors.ascend = []
    tmp.ascendPointGain = Decimal.max(player.bestPointsInAscend, 1).log(tmp.ascendReq).sub(1).pow_base(1000);
    addStatFactor('ascend', `Base`, `1,000<sup>log<sub>${format(tmp.ascendReq)}</sub>(${format(player.bestPointsInAscend)})-1</sup>`, null, tmp.ascendPointGain);
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.ascendPointGain = tmp.ascendPointGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('ascend', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.ascendPointGain);
    }
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.ascendCount, 1)) {
        tmp.ascendPointGain = new Decimal(0);
        addStatFactor('ascend', `Advantageous 'Challenge'`, `...`, null, tmp.ascendPointGain);
    }
    if (player.cheats.dilate) {
        tmp.ascendPointGain = cheatDilateBoost(tmp.ascendPointGain);
        addStatFactor('ascend', `Cheats`, `...`, null, tmp.ascendPointGain);
    }
    tmp.ascendPointGain = tmp.ascendPointGain.floor();

    tmp.ascendPointNext = tmp.ascendPointGain;
    tmp.ascendPointNext = cheatDilateBoost(tmp.ascendPointNext, true);
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.ascendCount, 1)) {
        tmp.ascendPointNext = new Decimal(Infinity);
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.ascendPointNext = tmp.ascendPointNext.root(tmp.hinderances[4].effects.resource);
    }
    tmp.ascendPointNext = tmp.ascendPointNext.add(1).log(1000).add(1).pow_base(tmp.ascendReq);

    tmp.autoAscend = player.cheats.autoAscend || (hasTranscendMilestone(9) && player.transcendInSpecialReq !== "prest4")
    if (tmp.autoAscend) {
        player.ascend = Decimal.add(player.ascend, tmp.ascendPointGain.mul(0.01).mul(delta).mul(tmp.timeSpeedTiers[0]));
    }

    tmp.ascendPointEffect = getAscendEff(player.ascend);
    tmp.ascendPointEffectNext = getAscendEff(Decimal.add(player.ascend, tmp.ascendPointGain));

    player.ascendGems = Decimal.add(player.ascendGems, tmp.ascendPointEffect.mul(delta));
}

function getAscendEff(ascend) {
    let eff = D(ascend);
    eff = eff.mul(tmp.ascendBuyables[3].eff);
    if (tmp.hinderances[4].depth.gt(0)) {
        eff = eff.pow(tmp.hinderances[4].effects.resource);
    }
    eff = cheatDilateBoost(eff);
    eff = eff.mul(tmp.timeSpeedTiers[0]);
    return eff;
}

function updateHTML_ascend() {
    html['ascendTab'].setDisplay(tmp.tab === 3);
    html['ascendTabButton'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e21) || Decimal.gt(player.ascend, 0));

    if (tmp.tab === 0 && tmp.mainTab === 0) {
        html['ascendAmount'].setTxt(`${format(tmp.ascendPointGain)}`);
        let show = Decimal.lt(tmp.ascendPointGain, 100);
        html['ascendNext'].setDisplay(show);
        if (show) {
            html['ascendNext'].setTxt(`Next ascension point at ${format(tmp.ascendPointNext)} points.`);
        }

        html['ascend'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e18) || Decimal.gt(player.ascend, 0));
    }

    if (tmp.tab === 3) {
        html['mainAscendTabButton'].setDisplay(Decimal.gte(player.ascend, 10));
        html['mainAscend'].setDisplay(tmp.ascendTab === 0);
        if (tmp.ascendTab === 0) {
            html['ascendBuyRespec'].setDisplay(hasTranscendMilestone(11));

            let notCapped, canBuy
            for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
                html[`ascendUpgrade${i}`].setDisplay(ASCENSION_UPGRADES[i].show);
                if (ASCENSION_UPGRADES[i].show) {
                    notCapped = Decimal.lt(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap);
                    canBuy = ASCENSION_UPGRADES[i].req && tmp.ascendBuyables[i].canBuy;
                    html[`ascendUpgrade${i}eff`].setTxt(ASCENSION_UPGRADES[i].desc)
                    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                        html[`ascendUpgrade${i}cost`].setTxt(`Cost: ${format(tmp.ascendBuyables[i].cost)} A. Buyable ${i}`);
                    } else {
                        html[`ascendUpgrade${i}cost`].setTxt(`Cost: ${format(tmp.ascendBuyables[i].cost)} gems`);
                    }
                    
                    html[`ascendUpgrade${i}req`].setTxt(ASCENSION_UPGRADES[i].reqDesc === undefined ? '' : ASCENSION_UPGRADES[i].reqDesc);
                    html[`ascendUpgrade${i}amount`].setTxt(`${format(player.ascendUpgrades[i])}${!Decimal.isFinite(ASCENSION_UPGRADES[i].cap) ? '×' : ' / ' + format(ASCENSION_UPGRADES[i].cap)}`);

                    html[`ascendUpgrade${i}`].changeStyle('background-color', notCapped ? (canBuy ? '#00C00080' : ASCENSION_UPGRADES[i].req ? '#00800080' : '#80000080') : '#00FF0080');
                    html[`ascendUpgrade${i}`].changeStyle('border', `3px solid ${notCapped ? (canBuy ? '#00C000' : ASCENSION_UPGRADES[i].req ? '#008000' : '#800000') : '#00ff00'}`);
                    html[`ascendUpgrade${i}`].changeStyle('cursor', notCapped && canBuy ? 'pointer' : 'not-allowed');
                }
            }

            html['ascendPoints'].setTxt(`${format(player.ascend)}`);
            html['ascendGems'].setTxt(`${format(player.ascendGems)}`);
            html['ascendPointEffect'].setTxt(`Producing ${format(tmp.ascendPointEffect, 2)} gems per second`);
            html['ascendPointEffectNext'].setDisplay(!tmp.autoAscend);
            if (!tmp.autoAscend) {
                html['ascendPointEffectNext'].setTxt(`×${format(tmp.ascendPointEffect.eq(0) ? 1 : tmp.ascendPointEffectNext.div(tmp.ascendPointEffect), 2)} upon next reset`);
            }

            html['ascendUpgAuto'].setDisplay(hasTranscendMilestone(8));
            if (hasTranscendMilestone(8)) {
                html[`ascendUpgAuto`].changeStyle('background-color', player.ascendUpgAuto ? '#00800080' : '#80000080');
                html[`ascendUpgAuto`].changeStyle('border', `3px solid #${player.ascendUpgAuto ? '00ff00' : 'ff0000'}`);
                html[`ascendUpgAuto`].setTxt(player.ascendUpgAuto ? 'Auto: Infinity/s' : 'Auto: Off');
            }
        }
    }
}

function doAscendReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.ascendPointGain.lte(0)) {
            return;
        }

        player.ascend = Decimal.add(player.ascend, tmp.ascendPointGain);
        player.ascendCount = Decimal.add(player.ascendCount, 1);
    }

    if (player.inSetback && tmp.ascendPointGain.gt(0)) {
        player.inSetback = false;
        player.setbackLoadout.push([...player.setback]); // stupid fucking butt-ugly hack to clone arrays instead of keeping them by reference
    }

    for (let i = 0; i < player.setback.length; i++) {
        player.setbackQuarks[i] = D(0);
        player.setbackEnergy[i] = D(0);
        for (let j = 0; j < player.quarkDimsAccumulated[i].length; j++) {
            player.quarkDimsBought[i][j] = D(0);
            player.quarkDimsAccumulated[i][j] = D(0);
            player.quarkDimsAutobought[i][j] = D(0);
        }
    }

    player.darts = D(0);
    player.timeInAscend = D(0);
    player.time2ndInAscend = D(0);
    player.prestigeUpgradesInCurrentAscension = false;
    if (!hasTranscendMilestone(0)) {
        player.prestigeChallengeCompleted = [];
    }
    player.prestigeChallenge = null;
    if (!hasTranscendMilestone(1)) {
        for (let i = 0; i < player.prestigeUpgrades.length; i++) {
            player.prestigeUpgrades[i] = D(0);
        }
    }
    player.prestige = D(0);
    player.prestigeEssence = D(0);
    player.bestPointsInAscend = D(0);
    player.prestigeCount = D(0);
    player.specialBuyables[0] = D(0);
    player.specialBuyables[1] = D(0);

    tmp.prestigePointGain = D(0);
    tmp.peGain = D(0);
    tmp.prestigePointNext = D(0);
    tmp.prestigePointsUsed = D(0);
    tmp.prestigeUpgCap = D(0);
    tmp.prestigePointEffect = D(1);
    doPrestigeReset(true);

    displaySetbackCompleted();
}

function buyAscendUpgrade(i) {
    if (!ASCENSION_UPGRADES[i].req) {
        return;
    }
    if (Decimal.gte(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap)) {
        return;
    }
    if (!tmp.ascendBuyables[i].canBuy) {
        return;
    }

    if (tmp.hinderances[4].depth.lte(0) || i != 0) {
        player.ascendGems = Decimal.sub(player.ascendGems, tmp.ascendBuyables[i].cost);
    }
    
    if (shiftDown) {
        player.ascendUpgrades[i] = Decimal.max(player.ascendUpgrades[i], tmp.ascendBuyables[i].target.ceil()).min(ASCENSION_UPGRADES[i].cap);
    } else {
        player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1);
    }
}

function respecAscendBuy() {
    for (let i = 0; i < player.ascendUpgrades.length; i++) {
        player.ascendUpgrades[i] = D(0)
    }
    doTranscendReset(true)
}