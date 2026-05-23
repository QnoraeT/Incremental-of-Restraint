"use strict";

const SETBACK_UPGRADES = [
    [
        ...(() => {
            let arr = []
            for (let i = 0; i < 5; i++) {
                arr.push(        {
                    id: `r${i+1}`,
                    cost: D(1e6 * 1000 ** i),
                    get desc() {
                        return `Points are multiplied by +0.02% for each Buyable ${i+1} (${format(tmp.buyables[i].effective)}). Currently: ×${format(this.eff, 2)}`;
                    },
                    get eff() {
                        return tmp.buyables[i].effective.mul(0.0002).add(1);
                    }
                },)
            }
            return arr
        })(),
        {
            id: "r6",
            cost: D(1e21),
            get desc() {
                return `Ascension Points boost all Red Dimensions' mult. Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.ascend, 1).root(8);
            }
        },
        {
            id: "r7",
            cost: D(1e26),
            get desc() {
                return `Ascension Gems give a sparse but powerful boost to points. Next at ${format(Decimal.max(player.ascendGems, 1e4).log10().log2().sub(2).floor().add(3).pow_base(2).pow10())} AGs, Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.ascendGems, 1e4).log10().log2().sub(2).floor().pow10();
            }
        },
        {
            id: "r8",
            cost: D(1e32),
            get desc() {
                return `Point gain slowly increases over time, capping at ×100.00. Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.timeInPrestige, 0).mul(0.1).add(1).min(100);
            }
        },
        {
            id: "r9",
            cost: D(1e38),
            desc: `Ascension's requirement is decreased by /100. (This boosts Ascension Point gain!)`,
            eff: D(100)
        },
        {
            id: "r10",
            cost: D(1e45),
            desc: `Unlock generator experience in the Main tab.`
        },
        {
            id: "r11",
            cost: D('e10000'),
            get desc() {
                return `Generator Experience gain is multiplied based on your total OoMs of generator points. Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return player.buyablePoints.reduce((accumulator, current) => Decimal.mul(accumulator, Decimal.max(current, 1)), player.buyablePoints[0]).max(1).log10().pow(0.5).pow10();
            }
        },
        {
            id: "r12",
            cost: D('e50000'),
            desc: `Generator Experience's effect to points are based off of your total OoMs of generator points instead of generator levels.`
        },
        {
            id: "r13",
            cost: D('e250000'),
            desc: `Generator Enhancers' effect decays 100x slower.`
        },
        {
            id: "r14",
            cost: D('e6.25e6'),
            get desc() {
                return `Red Energy's effect also affects all basic buyable bases at a reduced rate. Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return tmp.energyEffs[0];
            }
        },
        {
            id: "r15",
            cost: D('e8e8'),
            desc: `Add an alternative to "generator experience" using Tiers instead of Generator Levels, called "tier experience." (This feature persists on transcension-level resets.)`
        },
    ],
    [
        ...(() => {
            let arr = [];
            for (let i = 0; i < 5; i++) {
                arr.push({
                    id: `g${i+1}`,
                    cost: D(1e6 * 1000 ** i),
                    get desc() {
                        let total = D(0);
                        for (let j = 0; j < player.buyables.length; j++) {
                            if (i === j) {
                                continue;
                            }
                            total = total.add(player.buyables[j]);
                        }
                        return `Total bought buyables excluding Buyable ${i+1} (${format(total)}) multiply point gain. Currently: ×${format(this.eff, 2)}`;
                    },
                    get eff() {
                        let total = D(0);
                        for (let j = 0; j < player.buyables.length; j++) {
                            if (i === j) {
                                continue;
                            }
                            total = total.add(player.buyables[j]);
                        }
                        return total.mul(0.0005).add(1);
                    }
                },)
            }
            return arr
        })(),
        {
            id: "g6",
            cost: D(1e21),
            desc: `Buyable Generators also boost Green Dims.' respective mult. (Ex. Buyable Gen. 1 boosts Green Dim. 1, etc.)`,
        },
        {
            id: "g7",
            cost: D(1e26),
            get desc() {
                return `Every 1,000 total buyables bought, buyable boost per interval increases by +0.10×. Currently: +${format(this.eff, 2)}×`;
            },
            get eff() {
                let total = D(0);
                for (let j = 0; j < player.buyables.length; j++) {
                    total = total.add(player.buyables[j]);
                }
                return total.div(1000).floor().mul(0.1);
            }
        },
        {
            id: "g8",
            cost: D(1e32),
            desc: `Every level of each generator divides the cost of that buyable by /10.`,
            eff: D(10)
        },
        {
            id: "g9",
            cost: D(1e38),
            desc: `All buyables' base costs are set to 1 and their cost scaling is -25% slower.`,
            eff: D(0.75)
        },
        {
            id: "g10",
            cost: D(1e45),
            desc: `Unlock the autobuyer for Buyable 5 at 10/s and unlock Buyable 6.`
        },
        {
            id: "g11",
            cost: D('e500'),
            get desc() {
                return `Green Energy also affects Generator Levels at a reduced rate. (~Every 25 OoM^2 slows down Generator Levels by +/1.) Currently: ${format(this.eff, 3)}×`;
            },
            get eff() {
                return Decimal.max(player.setbackEnergy[1], 0).add(1).log10().add(1).log10().div(25).add(1).recip();
            }
        },
        {
            id: "g12",
            cost: D('e2000'),
            get desc() {
                return `Basic buyables' costs scale slower with (2nd tier) time in ascension resets. (Every minute, costs grow 10× slower. Caps at 10 minutes.) Currently: ${format(this.eff, 2)}×`;
            },
            get eff() {
                return Decimal.max(player.time2ndInAscend, 0).div(60).min(10).pow10()
            }
        },
        {
            id: "g13",
            cost: D('e10000'),
            get desc() {
                return `Ascension Buyable #4's increasing cost scaling is also affected by Green Energy at a reduced rate. Currently: ×${format(this.eff.recip(), 3)}`;
            },
            get eff() {
                return tmp.energyEffs[1].recip().max(1).log10().add(1).pow(2);
            }
        },
        {
            id: "g14",
            cost: D('e160000'),
            desc: `Each buyables' tier level requirements are decreased by +/1 per generator level, outside of any challenges.`
        },
        {
            id: "g15",
            cost: D('ee8'),
            desc: `Green S. Upgrade #11 also affects tiers.`
        },
    ],
    [
        {
            id: "b1",
            cost: D(1e6),
            desc: `Unlock Prestige Essence, You can now freely do a prestige reset even if you won't gain any prestige points.`
        },
        {
            id: "b2",
            cost: D(1e12),
            desc:`Make all Prestige Upgrades into Prestige Buyables, making them repeatable. Their costs will scale drastically past the first purchase.`
        },
        {
            id: "b3",
            cost: D(1e20),
            desc: `Black Out is repeatable up to 5 completions.`
        },
        {
            id: "b4",
            cost: D(1e30),
            get desc() {
                return `Prestige Upgrade 3 and Stacking Interest gain one free level, and Ascension Gems boost their effects. Currently: ^${format(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.ascendGems, 1).log10().div(100).add(1).ln().add(1);
            }
        },
        {
            id: "b5",
            cost: D(1e45),
            desc: `Unlock Hinderances in the Ascend tab.`
        },
        {
            id: "b6",
            cost: D(1e100),
            desc: `Unlock prestige fluid, which boosts prestige essence effect. Kept on ascension resets.`
        },
        {
            id: "b7",
            cost: D(1e200),
            desc: `Prestige essence requirements are removed, allowing you to generate prestige essence over time. Prestige essence's minimum value is 1 second of generation. (Uses Tier 2 time speed!)`
        },
        {
            id: "b8",
            cost: D('e400'),
            desc: `Unlock repeatable ""prestige"" challenges. (They're actually transcension challenges, but shhh.) Kept on transcension resets.`
        },
        {
            id: "b9",
            cost: D('e1600'),
            desc: `Unlock Hinderance Points, which are earned based on your highest PB. Hinderance scores no longer get reset on transcension resets, but you must have transcension milestone 13.`
        },
        {
            id: "b10",
            cost: D('e12800'),
            desc: `Prestige point requirements are removed, allowing you to generate prestige points over time. Prestige points' minimum value is 1 second of generation. (Uses Tier 2 time speed!)`
        },
    ],
    [
        {
            id: "c1",
            cost: D(1e12),
            desc: `Generators for Buyable 1 scale 10% slower.`
        },
        {
            id: "c2",
            cost: D(1e16),
            desc: `Generators for Buyable 2 scale 7.5% slower.`
        },
        {
            id: "c3",
            cost: D(1e20),
            desc: `Generators for Buyable 3 scale 5% slower.`
        },
        {
            id: "c4",
            cost: D(1e27),
            desc: `Generators for Buyable 4 scale 4% slower.`
        },
        {
            id: "c5",
            cost: D(1e33),
            desc: `Generators for Buyable 5 scale 3.33% slower.`
        },
        {
            id: "c6",
            cost: D(1e39),
            get desc() {
                return `Your best Generator XP boosts all ${tmp.quarkNamesC[3]} Dimensions' mult. Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.generatorFeatures.xp, 1).log10().div(100).add(1).pow(2);
            }
        },
        {
            id: "c7",
            cost: D(1e48),
            desc: `Generator XP Buyable #1's increasing cost scaling grows half as fast.`
        },
        {
            id: "c8",
            cost: D(1e60),
            desc: `Generator XP's effect to points is slightly stronger outside of any challenge.`
        },
        {
            id: "c9",
            cost: D(1e75),
            desc: `Generator Enhancer Buyable #2's effect starts off at 30 seconds, and is twice as fast.`
        },
        {
            id: "c10",
            cost: D(1e90),
            get desc() {
                return `Generator Enhancers also increase tier gain at a reduced rate. Currently: ×${format(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.generatorFeatures.enhancer, 1).log10().add(1);
            }
        },
        {
            id: "c11",
            cost: D(1e120),
            get desc() {
                return `Total OoMs of tier points slow down Gen. XP buyables #1-3's cost scaling. Currently: -${formatPerc(this.eff, 2)}`;
            },
            get eff() {
                return player.buyableTierPoints.reduce((accumulator, current) => Decimal.mul(accumulator, Decimal.max(current, 0).add(1)), player.buyableTierPoints[0]).max(10).log10().log2().mul(0.01).add(1);
            }
        },
        {
            id: "c12",
            cost: D('e360'),
            desc: `Tier levels slow down generator level requirements. (Every OoM of tier levels slows down generator level reqs by 2%)`
        },
        {
            id: "c13",
            cost: D('e1080'),
            desc: `Gen. Enh. B. #4's increasing cost scaling grows 1,000× slower.`
        },
        {
            id: "c14",
            cost: D('e10000'),
            desc: `Unlock 3 new Gen. XP Buyables.`
        },
        {
            id: "c15",
            cost: D('e800000'),
            get desc() {
                return `Gen. Advances slow down Gen. XP and Enh. Buyables #1-6 cost scaling, and Cyan Energy's effect only weakens in setbacks (▲0.5) instead of being disabled. Currently: Currently: -${formatPerc(this.eff, 2)}`;
            },
            get eff() {
                return Decimal.max(player.generatorFeatures.totalAdv, 0).mul(0.01).add(1);
            }
        },
    ]
]

const SETBACK_CALC = {
    totalAmt: 4,
    dimAmt: 8,
    energy: [
        (x) => {
            let eff = Decimal.max(x, 10).log10().log10().floor().add(1);
            if (player.transcendUpgrades.includes('hinderance1')) {
                eff = eff.pow(2);
            }
            eff = Decimal.max(x, 0).add(1).log10().add(1).pow(eff);
            if (Decimal.gte(player.cheats.bullshit.ascendExtr, 5)) {
                eff = eff.log10().add(1);
            }
            return eff;
        },
        (x) => {
            let eff = Decimal.max(x, 0).add(1).log10().div(10).add(1).recip();
            return eff;
        },
        (x) => {
            let eff = Decimal.max(x, 0).add(1).log10().pow(2).div(200).add(1);
            if (Decimal.gte(player.cheats.bullshit.ascendExtr, 7)) {
                eff = eff.log10().add(1).ln().add(1).sqrt();
            }
            return eff;
        },
        (x) => {
            let eff = Decimal.max(x, 0).add(1).pow(Decimal.max(x, 0).add(1).log10().floor().mul(0.05).add(1));
            if (tmp.setbackTotalStacks.length === 0) {
                if (player.setbackUpgrades.includes('c15')) {
                    eff = eff.log10().add(1).pow(0.5).sub(1).pow10();
                } else {
                    eff = D(1);
                }
            }
            if (Decimal.gte(player.cheats.bullshit.ascendExtr, 8)) {
                eff = eff.log10().add(1).ln().add(1);
            }
            return eff; // i doubt a cyan mult would scale non-logarithmically with gen xp so this should be fine
        }
    ],
    difficulty: [
        (x) => {
            return [Decimal.div(x, 10).pow_base(0.2)];
        },
        (x) => {
            return [Decimal.pow(x, 2).pow_base(1.0621431631970534).sub(1).div(0.0621431631970534).mul(1.5).add(1)];
        },
        (x) => {
            return [Decimal.div(x, 10).pow_base(16)];
        },
        (x) => {
            return Decimal.gt(x, 0) ? [Decimal.add(x, 1).pow(2), Decimal.add(x, 15), x] : [D(1), D(0), D(0)];
        }
    ],
    shown: [
        () => {
            return true;
        },
        () => {
            return true;
        },
        () => {
            return true;
        },
        () => {
            return player.generatorFeatures.advanceUpgsChosen.includes(0);
        }
    ]
}

const SETBACK_PRIO = {
    cap: 8,
    prioReq: [
        (x, inv) => {
            return inv
                ? Decimal.log(x, 'e10000').log(5)
                : Decimal.pow(5, x).pow_base('e10000');
        },
        (x, inv) => {
            return inv
                ? Decimal.log(x, 'e500').log(4)
                : Decimal.pow(4, x).pow_base('e500');
        },
        (x, inv) => {
            return inv
                ? Decimal.log(x, 1e100).log(2)
                : Decimal.pow(2, x).pow_base(1e100);
        },
        (x, inv) => {
            return inv
                ? Decimal.log(x, 1e120).log(3)
                : Decimal.pow(3, x).pow_base(1e120);
        }
    ],
    prioScoreEff(x) {
        if (!player.transcendUpgrades.includes('setback1')) {
            return D(1);
        }
        return (Decimal.gte(x, 0)
            ? Decimal.add(x, 1)
            : Decimal.neg(x).add(1).recip()).max(0);
    },
    prioBoost(x) {
        if (!player.transcendUpgrades.includes('setback1')) {
            return D(1);
        }
        return Decimal.mul(x, 0.1).add(1);
    }
}

function initHTML_setback() {
    toHTMLvar('setbackAscend');
    toHTMLvar('setbackAscendTabButton');
    html['setbackAscend'].setDisplay(false);
    html['setbackAscendTabButton'].setDisplay(false);

    toHTMLvar('setbackToggle');
    toHTMLvar('setSBTabButton');
    toHTMLvar('loadSBTabButton');
    toHTMLvar('dimSBTabButton');
    toHTMLvar('upgSBTabButton');
    toHTMLvar('prioSBTabButton');

    toHTMLvar('setbackTabSettings');
    toHTMLvar('setbackTabLoadout');
    toHTMLvar('setbackTabDims');
    toHTMLvar('setbackTabUpgs');
    toHTMLvar('setbackTabPrio');

    toHTMLvar('setbackLoadoutList');
    toHTMLvar('setbackLoadoutView');
    toHTMLvar('dimScalingInterval');
    toHTMLvar('dimScalingBoost');
    toHTMLvar('dimScalingSpeed');
    toHTMLvar('upgSBDesc');
    toHTMLvar('upgSBCost');

    toHTMLvar('setbackEffectList');
    toHTMLvar('setbackSliderList');
    toHTMLvar('setbackQuarkEnergyDisp');
    toHTMLvar('setbackDimDisp');
    toHTMLvar('setbackUpgLists');
    toHTMLvar('setbackPrioList');

    html['setSBTabButton'].setDisplay(false);
    html['loadSBTabButton'].setDisplay(false);
    html['dimSBTabButton'].setDisplay(false);
    html['upgSBTabButton'].setDisplay(false);

    let txt = {
        effect: ``,
        slider: ``,
        qeDisp: ``,
        dimDisp: ``,
        upgs: ``,
        prio: ``
    };

    // having to do this in 3 stages sucks but eh, it's due to how we're doing things lmao

    for (let i = 0; i < player.setback.length; i++) {
        let color = tmp.quarkNames[i];
        let capsColor = tmp.quarkNamesC[i];

        txt.effect += `<span id="setbackEffDisp${capsColor}" class="font" style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}; font-size: 12px">Your ${color} setback is at difficulty <b><span id="setback${capsColor}Value"></span></b>, which ${
        [
            'raises point gain to the <b>^<span id="setback' + capsColor + 'Effect1"></span></b>',
            'make buyables, prestige points, and generators scale <b><span id="setback' + capsColor + 'Effect1"></span>&times;</b> faster',
            'increases the prestige challenge and ascension reqs. by <b>^<span id="setback' + capsColor + 'Effect1"></span></b>',
            'resets Generator XP (>0), disabling enhancer related features and Generator XP\'s gain from generators are reduced by <b>/<span id="setback' + capsColor + 'Effect1"></span></b>. This also applies a <b>(0, <span id="setback' + capsColor + 'Effect3"></span>, <span id="setback' + capsColor + 'Effect2"></span>)</b> setback',
        ][i]
        }.</span>`;

        txt.slider += `<input type="range" min="0" max="10" value="0" style="width: 400px" id="setbackSlider${capsColor}">`;

        txt.qeDisp += `
            <div class="flex-horizontal" id="setbackResDisp${capsColor}">
                <div style="margin: 4px; color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" class="flex-vertical">
                    <span class="font" style="font-size: 24px;" id="${color}Quarks"></span><span class="font" style="font-size: 12px;">${color} quarks</span>
                </div>
                <div style="margin: 4px; color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" class="flex-vertical">
                    <span class="font" style="font-size: 24px;" id="${color}Energy"></span><span class="font" style="font-size: 12px;">${color} energy</span>
                </div>
            </div>
        `;

        txt.dimDisp += `
            <div id="setbackDimDisp${capsColor}" style="margin: 4px; width: 325px; border: 3px dashed #${tmp.quarkColors[i]}80;" class="flex-vertical">
                <span class="font" style="font-size: 10px; color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}">${capsColor} Quarks boost ${capsColor} Energy gain by &times;<b><span id="${color}QuarkEff"></span></b>.</span>
                <span class="font" style="font-size: 10px; color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}">${capsColor} Energy ${
                [
                    'boosts point gain',
                    'multiplies Buyables\' cost scaling',
                    'increases prestige point gain',
                    'multiplies Generator XP gain outside of setbacks'
                ][i]} by &times;<b><span id="${color}EnergyEff"></span></b>.</span>
                <div id="setback${capsColor}DimList" class="flex-vertical"></div>
            </div>
        `;

        txt.upgs += `
            <div id="setbackUpgDisp${capsColor}" class="flex-vertical">
                <span class="font" style="font-size: 12px; color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}">You have <b><span id="${color}EnergyAmt2"></span></b> ${capsColor} Energy.</span>
                <div id="${color}SBUpgrades" style="width: 250px; display: flex; flex-direction: row; justify-content: center; flex-wrap: wrap"></div>
            </div>
        `;

        txt.prio += `
            <div id="setbackPrio${capsColor}" class="flex-vertical" style="border: 3px solid #${tmp.quarkColors[i]}; background-color: ${colorChange(tmp.quarkColors[i], 0.5, 1.0)}80; margin: 3px; padding: 4px;">
                <span class="whiteText font" style="font-size: 14px;">Your ${capsColor} priority is <b><span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackPrio${capsColor}amountBig"></span></b>.</span>
                <span class="whiteText font" style="font-size: 12px;">Your ${capsColor} priority is <span id="setbackPrio${capsColor}effPosNeg"></span> your effect by ^<b><span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackPrio${capsColor}eff"></span></b>.</span>
                <span class="whiteText font" style="font-size: 10px;">You have <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackEng${capsColor}AmtPrio"></span> ${color} energy.</span>
                <div id="setbackPrio${capsColor}all" style="width: 225px; margin-top: 4px;">
                    <button onclick="getSBPrio(${i})" id="setbackPrio${capsColor}button" class="whiteText font" style="height: 85px; width: 225px; font-size: 10px;">
                        <span style="font-size: 14px;" id="setbackPrio${capsColor}amount"></span><br>
                        <br>
                        Boosting effect by ^<span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackPrio${capsColor}baseEff"></span>.<br>
                        <span id="setbackPrio${capsColor}cost"></span><br>
                        <span id="setbackPrio${capsColor}costNext"></span>
                    </button>
                </div>
                <div id="setbackPrio${capsColor}Decall" style="width: 225px; margin-top: 4px; margin-bottom: 4px;">
                    <button onclick="decSBPrio(${i})" id="setbackPrio${capsColor}Decbutton" class="whiteText font" style="height: 30px; width: 225px; font-size: 10px;">
                        Decrease priority.
                    </button>
                </div>
                <span class="whiteText font" style="font-size: 10px;">+1 Priority: <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackEff${capsColor}PrioPlus1"></span>.</span>
                <span class="whiteText font" style="font-size: 10px;">Your current ${color} effect is: <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackEff${capsColor}PrioNeutral"></span>.</span>
                <span class="whiteText font" style="font-size: 10px;">-0.5 Priority: <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}" id="setbackEff${capsColor}PrioMinus1"></span>.</span>
            </div>
        `;
    }

    html['setbackEffectList'].setHTML(txt.effect);
    html['setbackSliderList'].setHTML(txt.slider);
    html['setbackQuarkEnergyDisp'].setHTML(txt.qeDisp);
    html['setbackDimDisp'].setHTML(txt.dimDisp);
    html['setbackUpgLists'].setHTML(txt.upgs);
    html['setbackPrioList'].setHTML(txt.prio);

    for (let i = 0; i < player.setback.length; i++) {
        let color = tmp.quarkNames[i];
        let capsColor = tmp.quarkNamesC[i];

        toHTMLvar(`setback${capsColor}DimList`);
        toHTMLvar(`${color}SBUpgrades`);
        toHTMLvar(`setbackEffDisp${capsColor}`);
        toHTMLvar(`setbackResDisp${capsColor}`);
        toHTMLvar(`setbackDimDisp${capsColor}`);
        toHTMLvar(`setbackUpgDisp${capsColor}`);

        toHTMLvar(`setbackPrio${capsColor}`);
        toHTMLvar(`setbackPrio${capsColor}amountBig`);
        toHTMLvar(`setbackPrio${capsColor}eff`);
        toHTMLvar(`setbackPrio${capsColor}effPosNeg`);
        toHTMLvar(`setbackPrio${capsColor}all`);
        toHTMLvar(`setbackPrio${capsColor}button`);
        toHTMLvar(`setbackPrio${capsColor}amount`);
        toHTMLvar(`setbackPrio${capsColor}baseEff`);
        toHTMLvar(`setbackPrio${capsColor}cost`);
        toHTMLvar(`setbackPrio${capsColor}costNext`);

        toHTMLvar(`setbackPrio${capsColor}Decall`);
        toHTMLvar(`setbackPrio${capsColor}Decbutton`);

        toHTMLvar(`setbackEng${capsColor}AmtPrio`);
        toHTMLvar(`setbackEff${capsColor}PrioNeutral`);
        toHTMLvar(`setbackEff${capsColor}PrioPlus1`);
        toHTMLvar(`setbackEff${capsColor}PrioMinus1`);

        txt.dimDisp = ``;
        txt.dimDisp += `
            <div class="flex-horizontal">
                <button onclick="buyMaxSBDim(${i})" id="${color}BuyMax" class="whiteText font" style="height: 45px; width: 250px; font-size: 9px; margin: 2px">
                    Buy Max all ${capsColor} Dims.<br>
                    You can buy ~<span id="${color}BMTotalEst"></span> dimensions currently.
                </button>
                <button onclick="toggleAllSBAuto(${i})" id="${color}DimAuto" class="whiteText font" style="cursor: pointer; height: 45px; width: 50px; font-size: 9px; margin: 2px">
                    Auto: <span id="${color}DimAutoDisp"></span>
                </button>
            </div>
        `;
        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            txt.dimDisp += `
                <div class="flex-horizontal">
                    <button onclick="buySBDim(${i}, ${j})" id="${color}Dim${j}" class="whiteText font" style="height: 45px; width: 250px; font-size: 9px; margin: 2px">
                        ${capsColor} Dimension ${j + 1}: ×<span id="${color}Dim${j}amount"></span><br>
                        Mult: ×<span id="${color}Dim${j}mult"></span><br>
                        Cost: <span id="${color}Dim${j}cost"></span>
                    </button>
                    <button onclick="player.quarkDimsAuto[${i}][${j}] = !player.quarkDimsAuto[${i}][${j}]" id="${color}Dim${j}Auto" class="whiteText font" style="cursor: pointer; height: 45px; width: 50px; font-size: 9px; margin: 2px">
                        Auto: <span id="${color}Dim${j}AutoDisp"></span>
                    </button>
                </div>
            `;
        }
        html[`setback${capsColor}DimList`].setHTML(txt.dimDisp);

        txt.upgs = ``;
        for (let j = 0; j < SETBACK_UPGRADES[i].length; j++) {
            txt.upgs += `
                <button onclick="selectSBUpg(${i}, ${j})" id="${color}SBUpg${j}" class="whiteText font" style="height: 40px; width: 40px; font-size: 16px; margin: 2px; cursor: pointer">
                    <span><b>${j+1}</b></span>
                </button>
            `;
        }
        html[`${color}SBUpgrades`].setHTML(txt.upgs);
    }

    for (let i = 0; i < player.setback.length; i++) {
        let color = tmp.quarkNames[i];
        let capsColor = tmp.quarkNamesC[i];

        for (let j = 0; j < SETBACK_UPGRADES[i].length; j++) {
            toHTMLvar(`${color}SBUpg${j}`);
        }

        toHTMLvar(`${color}Quarks`);
        toHTMLvar(`${color}Energy`);
        toHTMLvar(`${color}EnergyAmt2`);
        toHTMLvar(`${color}QuarkEff`);
        toHTMLvar(`${color}EnergyEff`);

        toHTMLvar(`setbackSlider${capsColor}`);
        toHTMLvar(`setback${capsColor}Value`);
        for (let j = 0; j < SETBACK_CALC.difficulty[i](0).length; j++) {
            toHTMLvar(`setback${capsColor}Effect${j+1}`);
        }

        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            toHTMLvar(`${color}Dim${j}`);
            toHTMLvar(`${color}Dim${j}amount`);
            toHTMLvar(`${color}Dim${j}mult`);
            toHTMLvar(`${color}Dim${j}cost`);
            toHTMLvar(`${color}Dim${j}Auto`);
            toHTMLvar(`${color}Dim${j}AutoDisp`);
        }
        toHTMLvar(`${color}BuyMax`);
        toHTMLvar(`${color}BMTotalEst`);
        toHTMLvar(`${color}DimAuto`);
        toHTMLvar(`${color}DimAutoDisp`);

        toHTMLvar(`${color}SBUpgrades`);
    }

    displaySetbackCompleted();
}

function updateGame_setback() {
    tmp.setbackSelected = [];
    tmp.setbackEffects = [];
    tmp.projectedEffects = [];
    tmp.setbackTotalStacks = [];
    tmp.setbackProjectedStacks = [];

    for (let i = 0; i < player.setback.length; i++) {
        let capsColor = tmp.quarkNamesC[i];

        tmp.setbackSelected[i] = D(html[`setbackSlider${capsColor}`].el.value);
        if (!player.inSetback) {
            player.setback[i] = D(html[`setbackSlider${capsColor}`].el.value);
            if (!SETBACK_CALC.shown[i]()) {
                player.setback[i] = D(0);
            }
        }

        tmp.setbackEffects[i] = SETBACK_CALC.difficulty[i](0);
        tmp.projectedEffects[i] = SETBACK_CALC.difficulty[i](0);
    }

    if (player.inSetback) {
        tmp.setbackTotalStacks.push(player.setback);
    }
    tmp.setbackProjectedStacks.push(tmp.setbackSelected);
    if (player.transcendInSpecialReq === 'gen1') {
        tmp.setbackTotalStacks.push([D(0), D(3)]);
        tmp.setbackProjectedStacks.push([D(0), D(3)]);
    }
    if (player.transcendInSpecialReq === 'gen3') {
        tmp.setbackTotalStacks.push([D(5), D(0), D(5)]);
        tmp.setbackProjectedStacks.push([D(5), D(0), D(5)]);
    }
    if (player.transcendInSpecialReq === "setback1") {
        tmp.setbackTotalStacks.push([D(1), D(1), D(1), D(1)]);
        tmp.setbackProjectedStacks.push([D(1), D(1), D(1), D(1)]);
    }

    const projected = processSetbackEffects(tmp.setbackProjectedStacks, tmp.projectedEffects);
    tmp.setbackProjectedStacks = projected.stacks;
    tmp.projectedEffects = projected.effect;

    const actual = processSetbackEffects(tmp.setbackTotalStacks, tmp.setbackEffects);
    tmp.setbackTotalStacks = actual.stacks;
    tmp.setbackEffects = actual.effect;
}

function updateGame_setbackResources() {
    // calculate this before the main loop that calculates effects
    let totalPrioScore = D(0);
    for (let i = 0; i < player.setback.length; i++) {
        totalPrioScore = totalPrioScore.add(player.setbackPriority[i]);
    }

    for (let i = 0; i < player.setback.length; i++) {
        let bonusActive = Decimal.gte(player.bestSetbackPriority[0], SETBACK_PRIO.cap)
            && Decimal.gte(player.bestSetbackPriority[1], SETBACK_PRIO.cap)
            && Decimal.gte(player.bestSetbackPriority[2], SETBACK_PRIO.cap)
            && Decimal.gte(player.bestSetbackPriority[3], SETBACK_PRIO.cap);
        tmp.quarkEffs[i] = Decimal.max(player.setbackQuarks[i], 0);

        // multiply this by 2 because we've already counted it in the totalPrioScore variable, and we actually want to add itself instead of cancelling itself out
        tmp.setbackPriorityData[i].effPrio = Decimal.mul(player.setbackPriority[i], bonusActive ? 2 : 3).sub(bonusActive ? D(0) : totalPrioScore).div(2);
        let baseEffect = SETBACK_CALC.energy[i](tmp.prestigeRepeatChal[5].depth.gt(0)
            ? D(0)
            : Decimal.max(player.setbackEnergy[i], 0));
        
        tmp.energyEffs[i] = baseEffect.pow(SETBACK_PRIO.prioScoreEff(tmp.setbackPriorityData[i].effPrio)).pow(SETBACK_PRIO.prioBoost(player.setbackPriority[i]));
        tmp.setbackPriorityData[i].plus1 = baseEffect.pow(SETBACK_PRIO.prioScoreEff(tmp.setbackPriorityData[i].effPrio.add(1))).pow(SETBACK_PRIO.prioBoost(Decimal.add(player.setbackPriority[i], 1)));
        tmp.setbackPriorityData[i].minus1 = baseEffect.pow(SETBACK_PRIO.prioScoreEff(tmp.setbackPriorityData[i].effPrio.sub(0.5))).pow(SETBACK_PRIO.prioBoost(player.setbackPriority[i]));

        tmp.setbackPriorityData[i].cost = Decimal.gte(player.setbackPriority[i], SETBACK_PRIO.cap)
            ? D(Infinity)
            : (Decimal.lt(player.setbackPriority[i], player.bestSetbackPriority[i]) 
                ? D(0) 
                : SETBACK_PRIO.prioReq[i](player.setbackPriority[i], false));
        tmp.setbackPriorityData[i].nextCost = Decimal.gte(Decimal.add(player.setbackPriority[i], 1), SETBACK_PRIO.cap)
            ? D(Infinity)
            : (Decimal.lt(Decimal.add(player.setbackPriority[i], 1), player.bestSetbackPriority[i]) 
                ? D(0) 
                : SETBACK_PRIO.prioReq[i](Decimal.add(player.setbackPriority[i], 1), false));

        tmp.setbackPriorityData[i].target = SETBACK_PRIO.prioReq[i](player.setbackEnergy[i], true).max(player.bestSetbackPriority[i]).min(SETBACK_PRIO.cap);

        for (let j = 0; j < player.setbackLoadout.length; j++) {
            if (player.setbackLoadout[j][i] === undefined) {
                player.setbackLoadout[j][i] = D(0);
            }
        }
    }

    for (let i = 0; i < player.quarkDimsBought.length; i++) {
        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            tmp.quarkDimAutoData[i][j] = D(0);
            if (i !== 3 && player.transcendInSpecialReq !== "setback1") {
                if (hasTranscendMilestone(3) && (j === 0 || (i === 0 && j >= 1 && j <= 3))) {
                    tmp.quarkDimAutoData[i][j] = D(4);
                }
                if (hasTranscendMilestone(4) && (j === 1 || (i === 1 && j >= 2 && j <= 4))) {
                    tmp.quarkDimAutoData[i][j] = D(4);
                }
                if (hasTranscendMilestone(5) && (j === 2 || (i === 2 && j >= 3 && j <= 5))) {
                    tmp.quarkDimAutoData[i][j] = D(4);
                }
                if (hasTranscendMilestone(6)) {
                    if (j === 0) {
                        tmp.quarkDimAutoData[i][j] = tmp.quarkDimAutoData[i][j].mul(2.5);
                    }
                    if (j === 4 || j === 5) {
                        tmp.quarkDimAutoData[i][j] = D(4);
                    }
                }
                if (hasTranscendMilestone(7)) {
                    if (j === 1) {
                        tmp.quarkDimAutoData[i][j] = tmp.quarkDimAutoData[i][j].mul(2.5);
                    }
                    if (j === 6 || j === 7) {
                        tmp.quarkDimAutoData[i][j] = D(4);
                    }
                }
                if (hasTranscendMilestone(8)) {
                    if (j === 2 || j === 3) {
                        tmp.quarkDimAutoData[i][j] = tmp.quarkDimAutoData[i][j].mul(2.5);
                    }
                }
                if (hasTranscendMilestone(9)) {
                    if (j >= 4 && j <= 7) {
                        tmp.quarkDimAutoData[i][j] = tmp.quarkDimAutoData[i][j].mul(2.5);
                    }
                }
            }
            if (player.anticap.upgrades.includes(11)) {
                tmp.quarkDimAutoData[i][j] = Decimal.max(tmp.quarkDimAutoData[i][j], 20);
            }

            tmp.quarkDimAutoData[i][j] = tmp.quarkDimAutoData[i][j].mul(tmp.timeSpeedTiers[0]);
            if (tmp.prestigeRepeatChal[2].depth.gt(0)) {
                tmp.quarkDimAutoData[i][j] = tmp.prestigeRepeatChal[2].effects.autobuyer;
            }
            if (player.cheats.autoDim) {
                tmp.quarkDimAutoData[i][j] = D(Infinity);
            }
        }
    }

    tmp.trueQuarkTotal = D(0);
    tmp.predictedQuarkTotal = D(0);
    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkGain[i] = player.currentSetback === null ? D(0) : player.setbackLoadout[player.currentSetback][i]
        tmp.predictedQuarkGain[i] = player.setback[i];

        tmp.trueQuarkTotal = tmp.trueQuarkTotal.add(tmp.trueQuarkGain[i]);
        tmp.predictedQuarkTotal = tmp.predictedQuarkTotal.add(tmp.predictedQuarkGain[i]);
    }

    tmp.trueQuarkTotal = tmp.trueQuarkTotal.pow(2);
    tmp.predictedQuarkTotal = tmp.predictedQuarkTotal.pow(2);

    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkGain[i] = Decimal.pow(tmp.trueQuarkGain[i], 2).mul(tmp.trueQuarkTotal);
        if (tmp.hinderances[4].depth.gt(0)) {
            tmp.trueQuarkGain[i] = tmp.trueQuarkGain[i].pow(tmp.hinderances[4].effects.resource);
        }
        if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
            tmp.trueQuarkGain[i] = tmp.trueQuarkGain[i].add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
        }
        tmp.trueQuarkGain[i] = cheatDilateBoost(tmp.trueQuarkGain[i]);
        tmp.trueQuarkGain[i] = tmp.trueQuarkGain[i].mul(tmp.timeSpeedTiers[0]);

        tmp.predictedQuarkGain[i] = Decimal.pow(tmp.predictedQuarkGain[i], 2).mul(tmp.predictedQuarkTotal);
        if (tmp.hinderances[4].depth.gt(0)) {
            tmp.predictedQuarkGain[i] = tmp.predictedQuarkGain[i].pow(tmp.hinderances[4].effects.resource);
        }
        if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
            tmp.predictedQuarkGain[i] = tmp.predictedQuarkGain[i].add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
        }
        tmp.predictedQuarkGain[i] = cheatDilateBoost(tmp.predictedQuarkGain[i]);
        tmp.predictedQuarkGain[i] = tmp.predictedQuarkGain[i].mul(tmp.timeSpeedTiers[0]);

        player.setbackQuarks[i] = Decimal.add(player.setbackQuarks[i], tmp.trueQuarkGain[i].mul(delta));
    }

    for (let i = 0; i < player.setback.length; i++) {
        tmp.quarkEffs[i] = cheatDilateBoost(tmp.quarkEffs[i]);
        tmp.quarkEffs[i] = tmp.quarkEffs[i].mul(tmp.timeSpeedTiers[0]);

        player.setbackEnergy[i] = Decimal.add(player.setbackEnergy[i], tmp.quarkEffs[i].mul(delta));
    }

    tmp.quarkBoostInterval = D(100);
    tmp.quarkBoostEffect = D(1);
    tmp.quarkBoostCost = D(2);

    if (hasHinderanceMilestone(3, 2)) {
        tmp.quarkBoostInterval = tmp.quarkBoostInterval.add(Decimal.max(player.hinderanceScore[3], 1e10).log10().log10().sub(HINDERANCES[3].threshold.log10().log10()).mul(10));
    }

    tmp.trueQuarkTotal = D(0);
    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkTotal = tmp.trueQuarkTotal.add(player.currentSetback === null ? D(0) : player.setbackLoadout[player.currentSetback][i]);
    }

    for (let i = 0; i < player.quarkDimsBought.length; i++) {
        tmp.dimBoughtBM[i] = D(0);
        for (let j = player.quarkDimsBought[i].length - 1; j >= 0; j--) {
            // this is not defined at init so it's done here
            // idk why i did this tbh, i could've easily done this at init time
            // i could just change it but ehh i'm too lazy for that
            if (tmp.quarkDim[i][j] === undefined) {
                tmp.quarkDim[i][j] = {
                    mult: D(1),
                    costSpeed: D(1),
                    cost: D(1),
                    target: D(0)
                };
            }

            // higher costSpeed = faster cost scaling
            tmp.quarkDim[i][j].costSpeed = D(1);
            if (i === 2) {
                if (Decimal.gte(player.prestigeChallengeRepCompleted[2], 1)) {
                    tmp.quarkDim[i][j].costSpeed = tmp.quarkDim[i][j].costSpeed.div(tmp.prestigeRepeatChal[2].rewardEffs.costSpeed);
                }
            }

            tmp.quarkDim[i][j].target = Decimal.max(player.setbackEnergy[i], 1).log10();
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.sub(Decimal.pow(j + 1, 2)).div(j + 3);
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.div(tmp.quarkDim[i][j].costSpeed);
            if (player.anticap.active) {
                tmp.quarkDim[i][j].target = anticapScaling(tmp.quarkDim[i][j].target, "setbackDims", true);
            }
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.max(-0.0001); // put this after all cost scaling changes, if i don't do this then eventually it will NaN

            let h = tmp.quarkDim[i][j].target.mul(tmp.quarkBoostCost.sub(1)).div(tmp.quarkBoostInterval).add(1).log(tmp.quarkBoostCost).floor();
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.add(tmp.quarkBoostInterval.div(tmp.quarkBoostCost.sub(1))).div(tmp.quarkBoostCost.pow(h)).add(h.sub(tmp.quarkBoostCost.sub(1).recip()).mul(tmp.quarkBoostInterval));

            tmp.dimBoughtBM[i] = tmp.dimBoughtBM[i].add(tmp.quarkDim[i][j].target.sub(player.quarkDimsBought[i][j]).add(1).max(0).floor());

            checkNaN(tmp.quarkDim[i][j].target, `NaN detected while attempting to calculate target of ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`);

            if (player.quarkDimsAuto[i][j]) {
                player.quarkDimsAutobought[i][j] = Decimal.add(player.quarkDimsAutobought[i][j], setbackAutobuyerSpeed(i, j).mul(delta)).min(tmp.quarkDim[i][j].target).max(player.quarkDimsAutobought[i][j]);
                let bought = player.quarkDimsBought[i][j]
                player.quarkDimsBought[i][j] = player.quarkDimsAutobought[i][j].add(0.99999999).floor().max(player.quarkDimsBought[i][j]);
                bought = Decimal.sub(bought, player.quarkDimsBought[i][j])
                if (bought.lt(0)) {
                    // why only the first buy? the earlier purchases get increasingly negligible
                    // ee15 as a limit because at some point, cost may equal points and do some weird crap
                    if (Decimal.lt(player.setbackEnergy[i], 'ee15')) {
                        player.setbackEnergy[i] = Decimal.sub(player.setbackEnergy[i], tmp.quarkDim[i][j].cost).max(0);
                    }
                }
                checkNaN(player.quarkDimsBought[i][j], `NaN detected while attempting to autobuy ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`);
            }

            tmp.quarkDim[i][j].cost = D(player.quarkDimsBought[i][j])
            let x = tmp.quarkDim[i][j].cost.div(tmp.quarkBoostInterval).floor();
            let m = tmp.quarkDim[i][j].cost.sub(x.mul(tmp.quarkBoostInterval));
            tmp.quarkDim[i][j].cost = m.mul(tmp.quarkBoostCost.pow(x)).add(tmp.quarkBoostCost.pow(x).sub(1).div(tmp.quarkBoostCost.sub(1)).mul(tmp.quarkBoostInterval));

            if (player.anticap.active) {
                tmp.quarkDim[i][j].cost = anticapScaling(tmp.quarkDim[i][j].cost, "setbackDims", false);
            }
            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.mul(tmp.quarkDim[i][j].costSpeed);
            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.mul(j + 3).add(Decimal.pow(j + 1, 2));
            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.pow10();

            checkNaN(tmp.quarkDim[i][j].cost, `NaN detected while attempting to calculate cost of ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`);

            let baseMultBoost = D(2);
            baseMultBoost = baseMultBoost.add(Decimal.div(player.quarkDimsBought[i][j], tmp.quarkBoostInterval).floor().mul(tmp.quarkBoostEffect));
            if (player.anticap.upgrades.includes(9)) {
                baseMultBoost = baseMultBoost.pow(tmp.anticap.upgrades[9].eff);
            }
            if (Decimal.gte(player.cheats.bullshit.ascendExtr, 4)) {
                baseMultBoost = baseMultBoost.div(20);
            }

            tmp.quarkDim[i][j].mult = D(1);
            if (Decimal.lt(player.cheats.bullshit.ascendExtr, 4)) {
                tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(Decimal.pow(baseMultBoost, player.quarkDimsBought[i][j]));
            }
            if (player.currentSetback !== null) {
                tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(getLoadoutBaseMult(player.setbackLoadout[player.currentSetback][i], tmp.trueQuarkTotal));
            }
            if (i === 0) {
                if (hasSetbackUpgrade(`r6`)) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(SETBACK_UPGRADES[0][5].eff);
                }
            }
            if (i === 1) {
                if (hasSetbackUpgrade(`g6`) && j < tmp.buyables.length) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(tmp.buyables[j].genEffect);
                }
            }
            if (i === 3) {
                if (hasSetbackUpgrade('c6')) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(SETBACK_UPGRADES[3][5].eff);
                }
            }
            if (i >= 0 && i <= 2) {
                if (player.transcendUpgrades.includes('hinderance2')) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(tmp.quarkEffs[i]);
                }
            }
            if (i >= 0 && i <= 3) {
                if (Decimal.gte(player.prestigeChallengeRepCompleted[4], 1)) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(tmp.prestigeRepeatChal[4].rewardEffs.mult);
                }
            }
            if (tmp.prestigeRepeatChal[2].depth.lte(0)) {
                tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.pow(tmp.repliRankBuyables[2].eff);
                if (i >= 0 && i <= 3) {
                    if (Decimal.gte(player.prestigeChallengeRepCompleted[4], 1)) {
                        tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.pow(tmp.prestigeRepeatChal[4].rewardEffs.pow);
                    }
                }
                if (player.transcendUpgrades.includes('setback3')) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.pow(Decimal.mul(player.quarkDimsBought[i][j], 0.0001).add(1));
                }
                if (Decimal.gte(player.cheats.bullshit.ascendExtr, 4)) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.pow(Decimal.mul(baseMultBoost, player.quarkDimsBought[i][j]).add(1));
                }
            }
            if (player.anticap.active) {
                tmp.quarkDim[i][j].mult = anticapSoftcap(tmp.quarkDim[i][j].mult, "quarkDimMult", null, false);
            }

            checkNaN(tmp.quarkDim[i][j].mult, `NaN detected while attempting to calculate mul of ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`);

            let gen = tmp.quarkDim[i][j].mult.mul(Decimal.add(player.quarkDimsAccumulated[i][j], player.quarkDimsBought[i][j]));
            if (j === 0) {
                gen = gen.mul(tmp.quarkEffs[i])
                if (tmp.hinderances[4].depth.gt(0)) {
                    gen = gen.pow(tmp.hinderances[4].effects.resource);
                }
                if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
                    gen = gen.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
                }
                gen = cheatDilateBoost(gen);
            } 

            if (player.transcendUpgrades.includes('setback2')) {
                gen = gen.pow(tmp.timeSpeedTiers[1]);
                gen = gen.pow(delta);
                if (j === 0) {
                    player.setbackEnergy[i] = Decimal.max(player.setbackEnergy[i], 1).mul(gen);
                } else {
                    player.quarkDimsAccumulated[i][j - 1] = Decimal.max(player.quarkDimsAccumulated[i][j - 1], 1).mul(gen);
                }
            } else {
                gen = gen.mul(tmp.timeSpeedTiers[0]);
                gen = gen.mul(delta);
                if (j === 0) {
                    player.setbackEnergy[i] = Decimal.add(player.setbackEnergy[i], gen);
                } else {
                    player.quarkDimsAccumulated[i][j - 1] = Decimal.add(player.quarkDimsAccumulated[i][j - 1], gen);
                }
            }
        }
    }
}

function getLoadoutBaseMult(base, total) {
    let loadoutMult = Decimal.mul(base, 0.75).add(total.mul(0.25)).pow_base(2);
    if (player.transcendUpgrades.includes("anticap1")) {
        loadoutMult = loadoutMult.pow(2);
    }
    return loadoutMult;
}

function updateHTML_setback() {
    html['setbackAscend'].setDisplay(tmp.ascendTab == 1);
    html['setbackAscendTabButton'].setDisplay(Decimal.gte(player.ascend, 10));

    if (tmp.ascendTab == 1) {
        html['setSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0));
        html['loadSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0));
        html['dimSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0));
        html['upgSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0));
        html['prioSBTabButton'].setDisplay(player.transcendUpgrades.includes('setback1'));

        html['setbackTabSettings'].setDisplay(tmp.setbackTab === 0);
        html['setbackTabLoadout'].setDisplay(tmp.setbackTab === 1);
        html['setbackTabDims'].setDisplay(tmp.setbackTab === 2);
        html['setbackTabUpgs'].setDisplay(tmp.setbackTab === 3);
        html['setbackTabPrio'].setDisplay(tmp.setbackTab === 4);

        if (tmp.setbackTab === 0) {
            for (let i = 0; i < player.setback.length; i++) {
                let capsColor = tmp.quarkNamesC[i]
                html[`setbackSlider${capsColor}`].setDisplay(SETBACK_CALC.shown[i]())
                html[`setbackEffDisp${capsColor}`].setDisplay(SETBACK_CALC.shown[i]())
                if (SETBACK_CALC.shown[i]()) {
                    html[`setbackSlider${capsColor}`].el.disabled = player.inSetback
                    html[`setback${capsColor}Value`].setTxt(format(player.setback[i]))
                    for (let j = 0; j < tmp.projectedEffects[i].length; j++) {
                        html[`setback${capsColor}Effect${j+1}`].setTxt(format(tmp.projectedEffects[i][j], 2))
                    }
                }
            }

            // i hate this because even though it uses the same/similar code, it's just highly inefficient because its redoing a lot of long HTML stuff
            // i should probably make this static (in HTML file) and edited from there, even tho the code will be different 
            // which'll likely mean that i'll have to figure something out
            displaySetbackView()
            html['setbackToggle'].changeStyle('cursor', player.setback.filter((amt) => Decimal.gt(amt, 0)).length !== 0 ? 'pointer' : 'not-allowed')
        }

        if (tmp.setbackTab === 1) {
            // the displaying is done in displaySetbackCompleted() !
        }

        if (tmp.setbackTab === 2) {
            html['dimScalingInterval'].setTxt(format(tmp.quarkBoostInterval));
            html['dimScalingSpeed'].setTxt(format(tmp.quarkBoostCost, 2));
            html['dimScalingBoost'].setTxt(format(tmp.quarkBoostEffect, 2));

            for (let i = 0; i < player.setback.length; i++) {
                let color = tmp.quarkNames[i];
                let capsColor = tmp.quarkNamesC[i];
                html[`setbackResDisp${capsColor}`].setDisplay(SETBACK_CALC.shown[i]());
                html[`setbackDimDisp${capsColor}`].setDisplay(SETBACK_CALC.shown[i]());
                if (SETBACK_CALC.shown[i]()) {
                    html[`${color}Quarks`].setTxt(format(player.setbackQuarks[i]));
                    html[`${color}Energy`].setTxt(format(player.setbackEnergy[i]));

                    html[`${tmp.quarkNames[i]}BuyMax`].changeStyle('background-color', `${tmp.quarkColorsCalc[i][tmp.dimBoughtBM[i].gt(0) ? 'yes' : 'no'].bg}`);
                    html[`${tmp.quarkNames[i]}BuyMax`].changeStyle('border', `3px solid ${tmp.quarkColorsCalc[i][tmp.dimBoughtBM[i].gt(0) ? 'yes' : 'no'].border}`);
                    html[`${tmp.quarkNames[i]}BuyMax`].changeStyle('cursor', tmp.dimBoughtBM[i].gt(0) ? 'pointer' : 'not-allowed');

                    html[`${tmp.quarkNames[i]}BMTotalEst`].setTxt(`${format(tmp.dimBoughtBM[i])}`);

                    html[`${tmp.quarkNames[i]}DimAuto`].setDisplay(tmp.quarkDimAutoData[i].filter((x) => Decimal.gt(x, 0)).length > 0);
                    html[`${tmp.quarkNames[i]}DimAuto`].changeStyle('background-color', `${tmp.quarkColorsCalc[i][player.quarkDimsAuto[i].filter((x) => x).length > 0 ? 'yes' : 'no'].bg}`);
                    html[`${tmp.quarkNames[i]}DimAuto`].changeStyle('border', `3px solid ${tmp.quarkColorsCalc[i][player.quarkDimsAuto[i].filter((x) => x).length > 0 ? 'yes' : 'no'].border}`);

                    html[`${tmp.quarkNames[i]}DimAutoDisp`].setTxt(player.quarkDimsAuto[i].filter((item) => { return item }).length > 0 ? 'On' : 'Off');

                    html[`${tmp.quarkNames[i]}QuarkEff`].setTxt(format(tmp.quarkEffs[i]));
                    html[`${tmp.quarkNames[i]}EnergyEff`].setTxt(format(tmp.energyEffs[i], 3));

                    for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
                        html[`${tmp.quarkNames[i]}Dim${j}`].setDisplay(j === 0 || Decimal.gt(player.quarkDimsBought[i][j - 1], 0) || Decimal.gt(player.quarkDimsAccumulated[i][j - 1], 0));
                        html[`${tmp.quarkNames[i]}Dim${j}Auto`].setDisplay(false);
                        if (j === 0 || Decimal.gt(player.quarkDimsBought[i][j - 1], 0) || Decimal.gt(player.quarkDimsAccumulated[i][j - 1], 0)) {
                            html[`${tmp.quarkNames[i]}Dim${j}`].changeStyle('background-color', `${tmp.quarkColorsCalc[i][Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost) ? 'yes' : 'no'].bg}`);
                            html[`${tmp.quarkNames[i]}Dim${j}`].changeStyle('border', `3px solid ${tmp.quarkColorsCalc[i][Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost) ? 'yes' : 'no'].border}`);
                            html[`${tmp.quarkNames[i]}Dim${j}`].changeStyle('cursor', Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost) ? 'pointer' : 'not-allowed');

                            html[`${tmp.quarkNames[i]}Dim${j}amount`].setTxt(`${format(player.quarkDimsBought[i][j])} (${format(player.quarkDimsAccumulated[i][j])})`);
                            html[`${tmp.quarkNames[i]}Dim${j}mult`].setTxt(`${format(tmp.quarkDim[i][j].mult, 2)}`);
                            html[`${tmp.quarkNames[i]}Dim${j}cost`].setTxt(`${format(tmp.quarkDim[i][j].cost)} ${tmp.quarkNamesC[i]} Energy`);

                            html[`${tmp.quarkNames[i]}Dim${j}Auto`].setDisplay(setbackAutobuyerSpeed(i, j).gt(0));
                            if (setbackAutobuyerSpeed(i, j).gt(0)) {
                                html[`${tmp.quarkNames[i]}Dim${j}Auto`].changeStyle('background-color', `${tmp.quarkColorsCalc[i][player.quarkDimsAuto[i][j] ? 'yes' : 'no'].bg}`);
                                html[`${tmp.quarkNames[i]}Dim${j}Auto`].changeStyle('border', `3px solid ${tmp.quarkColorsCalc[i][player.quarkDimsAuto[i][j] ? 'yes' : 'no'].border}`);
                                html[`${tmp.quarkNames[i]}Dim${j}AutoDisp`].setTxt(player.quarkDimsAuto[i][j] ? `${format(setbackAutobuyerSpeed(i, j), 0, 0)}/s` : 'Off');
                            }
                        }
                    }
                }
            }
        }

        if (tmp.setbackTab === 3) {
            for (let i = 0; i < player.setback.length; i++) {
                let capsColor = tmp.quarkNamesC[i];
                html[`setbackUpgDisp${capsColor}`].setDisplay(SETBACK_CALC.shown[i]());
                if (SETBACK_CALC.shown[i]()) {
                    html[`${tmp.quarkNames[i]}EnergyAmt2`].setTxt(format(player.setbackEnergy[i]));

                    let shownUpgradesSubtracted = 5;
                    if (Decimal.gte(player.bestSetbackPriority[i], 1)) {
                        shownUpgradesSubtracted--;
                    }
                    if (Decimal.gte(player.bestSetbackPriority[i], 2)) {
                        shownUpgradesSubtracted--;
                    }
                    if (Decimal.gte(player.bestSetbackPriority[i], 3)) {
                        shownUpgradesSubtracted--;
                    }
                    if (Decimal.gte(player.bestSetbackPriority[i], 5)) {
                        shownUpgradesSubtracted--;
                    }
                    if (Decimal.gte(player.bestSetbackPriority[i], 8)) {
                        shownUpgradesSubtracted--;
                    }

                    for (let j = 0; j < SETBACK_UPGRADES[i].length; j++) {
                        html[`${tmp.quarkNames[i]}SBUpg${j}`].setDisplay(j < (SETBACK_UPGRADES[i].length - shownUpgradesSubtracted))
                        if (j < (SETBACK_UPGRADES[i].length - shownUpgradesSubtracted)) {
                            // mess around with colors
                            html[`${tmp.quarkNames[i]}SBUpg${j}`].changeStyle('border', `3px solid ${colorChange(
                                tmp.quarkColors[i],
                                0.5 * (Decimal.gte(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost) || hasSetbackUpgrade(SETBACK_UPGRADES[i][j].id) ? 2 : 1), 
                                1 / ((tmp.sbSelectedUpg[0] === i && tmp.sbSelectedUpg[1] === j) ? 4 : 1) / (hasSetbackUpgrade(SETBACK_UPGRADES[i][j].id) ? 2 : 1)
                            )}`);

                            html[`${tmp.quarkNames[i]}SBUpg${j}`].changeStyle('background-color', `${colorChange(
                                tmp.quarkColors[i],
                                0.25 * (Decimal.gte(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost) || hasSetbackUpgrade(SETBACK_UPGRADES[i][j].id) ? 2 : 1) * (hasSetbackUpgrade(SETBACK_UPGRADES[i][j].id) ? 2 : 1),
                                1.0
                            )}80`);
                        }
                    }
                }
            }

            html['upgSBDesc'].setTxt(tmp.sbSelectedUpg.length === 0 ? '' : `${SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].desc}`)
            html['upgSBCost'].setTxt(tmp.sbSelectedUpg.length === 0 ? '' : `Cost: ${format(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].cost)} ${tmp.quarkNames[tmp.sbSelectedUpg[0]]} energy.${hasSetbackUpgrade(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].id) ? ' Bought!' : ''}`)
        }

        if (tmp.setbackTab === 4) {
            for (let i = 0; i < player.setback.length; i++) {
                let color = tmp.quarkNames[i];
                let capsColor = tmp.quarkNamesC[i];
                html[`setbackPrio${capsColor}`].setDisplay(SETBACK_CALC.shown[i]());
                if (SETBACK_CALC.shown[i]()) {
                    html[`setbackEng${capsColor}AmtPrio`].setTxt(format(player.setbackEnergy[i]));

                    html[`setbackEff${capsColor}PrioNeutral`].setTxt(format(tmp.energyEffs[i], 3));
                    html[`setbackEff${capsColor}PrioPlus1`].setTxt(format(tmp.setbackPriorityData[i].plus1, 3));
                    html[`setbackEff${capsColor}PrioMinus1`].setTxt(format(tmp.setbackPriorityData[i].minus1, 3));

                    html[`setbackPrio${capsColor}eff`].setTxt(format(SETBACK_PRIO.prioScoreEff(tmp.setbackPriorityData[i].effPrio), 2))
                    html[`setbackPrio${capsColor}effPosNeg`].setTxt(tmp.setbackPriorityData[i].effPrio.gte(0) ? 'boosting' : 'nerfing')
                    html[`setbackPrio${capsColor}amountBig`].setTxt((tmp.setbackPriorityData[i].effPrio.gt(0) ? '+' : '') + format(tmp.setbackPriorityData[i].effPrio, 1));

                    html[`setbackPrio${capsColor}Decbutton`].changeStyle('background-color', `${tmp.quarkColorsCalc[i][Decimal.gt(player.setbackPriority[i], 0) ? 'yes' : 'no'].bg}`);
                    html[`setbackPrio${capsColor}Decbutton`].changeStyle('border', `3px solid ${tmp.quarkColorsCalc[i][Decimal.gt(player.setbackPriority[i], 0) ? 'yes' : 'no'].border}`);
                    html[`setbackPrio${capsColor}Decbutton`].changeStyle('cursor', Decimal.gt(player.setbackPriority[i], 0) ? 'pointer' : 'not-allowed');

                    html[`setbackPrio${capsColor}button`].changeStyle('background-color', `${tmp.quarkColorsCalc[i][Decimal.gte(player.setbackEnergy[i], tmp.setbackPriorityData[i].cost) ? 'yes' : 'no'].bg}`);
                    html[`setbackPrio${capsColor}button`].changeStyle('border', `3px solid ${tmp.quarkColorsCalc[i][Decimal.gte(player.setbackEnergy[i], tmp.setbackPriorityData[i].cost) ? 'yes' : 'no'].border}`);
                    html[`setbackPrio${capsColor}button`].changeStyle('cursor', Decimal.gte(player.setbackEnergy[i], tmp.setbackPriorityData[i].cost) ? 'pointer' : 'not-allowed');

                    html[`setbackPrio${capsColor}amount`].setTxt(`Base Priority: ${format(player.setbackPriority[i])} (Max: ${format(player.bestSetbackPriority[i])}/${format(SETBACK_PRIO.cap)})`);
                    html[`setbackPrio${capsColor}baseEff`].setTxt(format(SETBACK_PRIO.prioBoost(player.setbackPriority[i]), 2))
                    html[`setbackPrio${capsColor}cost`].setTxt(Decimal.isFinite(tmp.setbackPriorityData[i].cost) 
                        ? `Increase for ${format(tmp.setbackPriorityData[i].cost)} ${color} energy`
                        : 'You have maxed this priority!');
                    html[`setbackPrio${capsColor}costNext`].setTxt(Decimal.isFinite(tmp.setbackPriorityData[i].nextCost) 
                        ? `Next: ${format(tmp.setbackPriorityData[i].nextCost)} ${color} energy` 
                        : '');
                }
            }
        }
    }
}

function toggleSetback() {
    if (player.setback.filter((x) => Decimal.neq(x, 0)).length === 0) {
        return;
    }
    if (Decimal.gt(player.setback[3], 0)) {
        player.bestTotalGenLvs = D(0);
        player.generatorFeatures.xp = D(0);
        for (let i = 0; i < player.generatorFeatures.buyable.length; i++) {
            player.generatorFeatures.buyable[i] = D(0);
        }
        player.bestTotalGenLvs = D(0);

        tmp.generatorFeatures.gain = D(0);
        tmp.generatorFeatures.xpEffGenerators = D(1);
        tmp.generatorFeatures.xpEffPoints = D(1);
    }
    if (player.inSetback) {
        player.inSetback = false;
        doAscendReset(true);
    } else {
        doAscendReset(true);
        player.inSetback = true;
    }
}

function displaySetbackCompleted() {
    let txt = ``
    for (let i = 0; i < player.setbackLoadout.length; i++) {
        const total = player.setbackLoadout[i].reduce((a,b) => Decimal.add(a, b))
        let txt2 = ``
        for (let j = 0; j < player.setback.length; j++) {
            if (!SETBACK_CALC.shown[j]()) {
                continue;
            }
            let color = tmp.quarkNames[j]
            let capsColor = tmp.quarkNamesC[j]

            txt2 += `
                    <span style="color: ${colorChange(tmp.quarkColors[j], 1.0, 0.5)}; font-size: 14px">${capsColor}: <b>${format(player.setbackLoadout[i][j])}</b></span>
                    <span style="color: ${colorChange(tmp.quarkColors[j], 1.0, 0.5)}; font-size: 12px">This will generate <b>${format(total.pow(2).mul(Decimal.pow(player.setbackLoadout[i][j], 2)))}</b> base ${color} quarks per second.</span>
                    <span style="color: ${colorChange(tmp.quarkColors[j], 1.0, 0.5)}; font-size: 12px">${capsColor} multipliers are increased by <b>${format(getLoadoutBaseMult(player.setbackLoadout[i][j], total), 2)}×</b>.</span>
                `
        }
        txt += `
            <div style="background-color: #${player.currentSetback === i ? '006060' : '404040'}80; border: 3px solid #${player.currentSetback === i ? '00ff' : 'ffff'}ff; width: 400px;">
                <div class="font flex-vertical" style="font-size: 12px;">
                    <span style="color: #ffffff; font-size: 16px">Total Difficulty: <b>${format(total)}</b></span>
                    ${txt2}
                </div>
                <div class="flex-horizontal">
                    <button onclick="useSetback(${i})" class="whiteText font" style="background-color: #80808080; border: 3px solid #ffffff; height: 25px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                        ${player.currentSetback === i ? 'Unuse' : 'Use'}
                    </button>
                    <button onclick="deleteSetback(${i})" class="whiteText font" style="background-color: #80808080; border: 3px solid #ffffff; height: 25px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                        Delete
                    </button>
                    <button onclick="setUsingSetback(${i})" class="whiteText font" style="background-color: #80808080; border: 3px solid #ffffff; height: 25px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                        Set Difficulty
                    </button>
                </div>
            </div>
        `
    }
    html['setbackLoadoutList'].setHTML(txt)
}

function displaySetbackView() {
    let txt = ``

    const total = player.setback.reduce((a,b) => Decimal.add(a, b))
    let txt2 = ``
    for (let i = 0; i < player.setback.length; i++) {
        if (!SETBACK_CALC.shown[i]()) {
            continue;
        }
        let color = tmp.quarkNames[i]
        let capsColor = tmp.quarkNamesC[i]
        txt2 += `
                <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}; font-size: 14px">${capsColor}: <b>${format(player.setback[i])}</b></span>
                <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}; font-size: 12px">This will generate <b>${format(total.pow(2).mul(Decimal.pow(player.setback[i], 2)))}</b> base ${color} quarks per second.</span>
                <span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}; font-size: 12px">${capsColor} multipliers are increased by <b>${format(getLoadoutBaseMult(player.setback[i], total), 2)}×</b>.</span>
            `
    }
    txt += `
        <div style="background-color: #40404080; border: 3px solid #ffffff; width: 400px;">
            <div class="font flex-vertical" style="font-size: 12px;">
                <span style="color: #ffffff; font-size: 16px">Total Difficulty: <b>${format(total)}</b></span>
                ${txt2}
            </div>
        </div>
    `

    html['setbackLoadoutView'].setHTML(txt)
}

function useSetback(i) {
    if (player.currentSetback === i) {
        player.currentSetback = null;
    } else {
        player.currentSetback = i;
    }
    doAscendReset(true);
}

function deleteSetback(i) {
    if (confirm('Are you sure you want to delete this setback? You will have to do the setback with the same settings again!')) {
        if (player.currentSetback === i) {
            player.currentSetback = null;
        }
        if (player.currentSetback > i) {
            player.currentSetback -= 1;
        }
        player.setbackLoadout.splice(i, 1);
    }
    displaySetbackCompleted();
}

function setUsingSetback(i) {
    for (let j = 0; j < player.setback.length; j++) {
        let capsColor = tmp.quarkNamesC[j];
        html[`setbackSlider${capsColor}`].el.value = player.setbackLoadout[i][j];
    }

    player.setback = player.setbackLoadout[i];
    displaySetbackCompleted();
}

function buySBDim(i, j) {
    if (Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost)) {
        player.setbackEnergy[i] = player.setbackEnergy[i].sub(tmp.quarkDim[i][j].cost);
        player.quarkDimsBought[i][j] = Decimal.add(player.quarkDimsBought[i][j], 1);
        player.quarkDimsAutobought[i][j] = Decimal.add(player.quarkDimsAutobought[i][j], 1);
        updateGame_setback();
    }
}

function buyMaxSBDim(i) {
    for (let j = player.quarkDimsBought[i].length - 1; j >= 0; j--) {
        if (Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost)) {
            player.quarkDimsBought[i][j] = tmp.quarkDim[i][j].target.floor().add(1).max(player.quarkDimsBought[i][j]);
            player.quarkDimsAutobought[i][j] = tmp.quarkDim[i][j].target.floor().add(1).max(player.quarkDimsAutobought[i][j]);
            player.setbackEnergy[i] = player.setbackEnergy[i].sub(tmp.quarkDim[i][j].cost); // this isn't updated but whatever, not like it actually matters too much
        }
    }
    updateGame_setback();
}

function selectSBUpg(i, j) {
    if (tmp.sbSelectedUpg[0] === i && tmp.sbSelectedUpg[1] === j) {
        if (Decimal.gte(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost)) {
            if (!hasSetbackUpgrade(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].id)) {
                player.setbackEnergy[i] = Decimal.sub(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost);
                player.setbackUpgrades.push(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].id);
            }
        }
    }
    tmp.sbSelectedUpg[0] = i;
    tmp.sbSelectedUpg[1] = j;
}

function setbackAutobuyerSpeed(i, j) {
    return tmp.quarkDimAutoData[i][j];
}

function displaySetbackUI(list) {
    let setbackList = [];
    for (let i = 0; i < list.length; i++) {
        if (SETBACK_CALC.shown[i]()) {
            setbackList.push(list[i]);
        }
    }
    let setbackTxt = ``;
    for (let i = 0; i < setbackList.length - 1; i++) {
        setbackTxt += `${format(setbackList[i])}, `;
    }

    let color = {
        r: D(0),
        g: D(0),
        b: D(0)
    };
    color.r = Decimal.add(color.r, list[0]);
    color.g = Decimal.add(color.g, list[1]);
    color.b = Decimal.add(color.b, list[2]);

    color.g = Decimal.add(color.g, list[3]);
    color.b = Decimal.add(color.b, list[3]);

    let best = Decimal.max(10, color.r).max(color.g).max(color.b);
    // this is all bounded from 0.0 - 1.0
    color.r = Decimal.div(color.r, best).toNumber();
    color.g = Decimal.div(color.g, best).toNumber();
    color.b = Decimal.div(color.b, best).toNumber();

    setbackTxt += `${format(setbackList[setbackList.length - 1])}`;
    return `<span style="color: #${Math.ceil(128 + 127 * color.r).toString(16)}${Math.ceil(128 + 127 * color.g).toString(16)}${Math.ceil(128 + 127 * color.b).toString(16)}"><b>Setback</b> (${setbackTxt})</span>`;
}

function colorAmountTotal(color) {
    let total = D(0);
    for (let i = 0; i < tmp.setbackTotalStacks.length; i++) {
        total = total.add(tmp.setbackTotalStacks[i][color]);
    }
    return total;
}

function processSetbackEffects(stackArr, effectArr) {
    for (let i = 0; i < stackArr.length; i++) {
        for (let j = 0; j < player.setback.length; j++) {
            if (stackArr[i][j] === undefined) {
                stackArr[i][j] = D(0);
            }
        }
        if (i > 25) {
            throw new Error(`processSetbackEffects fell into a (likely) infinite loop. (>25 iterations)`);
        }

        if (Decimal.gte(stackArr[i][3], 1)) {
            stackArr.push([D(0), SETBACK_CALC.difficulty[3](stackArr[i][3])[2], SETBACK_CALC.difficulty[3](stackArr[i][3])[1]]);
        }

        for (let j = 0; j < player.setback.length; j++) {
            switch (j) {
                case 0:
                case 1:
                case 2:
                    effectArr[j][0] = effectArr[j][0].mul(SETBACK_CALC.difficulty[j](stackArr[i][j])[0]);
                    break
                case 3:
                    effectArr[j][0] = effectArr[j][0].mul(SETBACK_CALC.difficulty[j](stackArr[i][j])[0]);
                    effectArr[j][1] = effectArr[j][1].add(SETBACK_CALC.difficulty[j](stackArr[i][j])[1]);
                    effectArr[j][2] = effectArr[j][2].add(SETBACK_CALC.difficulty[j](stackArr[i][j])[2]);
                    break;
                default:
                    throw new Error(`Setback id ${j} doesn't exist!`);
            }
        }
    }
    return { stacks: stackArr, effect: effectArr }
}

function hasSetbackUpgrade(id) {
    if (id[0] === 'c' && !player.generatorFeatures.advanceUpgsChosen.includes(0)) {
        return false;
    }
    return player.setbackUpgrades.includes(id);
}

function toggleAllSBAuto(i) {
    let atLeastOneOn = player.quarkDimsAuto[i].filter((item) => { return item }).length > 0;
    for (let j = 0; j < player.quarkDimsAuto[i].length; j++) {
        if (tmp.quarkDimAutoData[i][j].gt(0)) {
            player.quarkDimsAuto[i][j] = !atLeastOneOn;
        }
    }
}

function getSBPrio(i) {
    if (Decimal.lt(player.setbackEnergy[i], tmp.setbackPriorityData[i].cost)) {
        return;
    }

    if (!transcendResetWOGainPrompt()) {
        return;
    }
    
    player.setbackPriority[i] = Decimal.add(player.setbackPriority[i], 1);
    player.bestSetbackPriority[i] = Decimal.max(player.bestSetbackPriority[i], player.setbackPriority[i]);
    
    doTranscendReset(true);
}

function decSBPrio(i) {
    if (Decimal.lt(player.setbackPriority[i], 1)) {
        return;
    }

    if (!transcendResetWOGainPrompt()) {
        return;
    }

    player.setbackPriority[i] = Decimal.sub(player.setbackPriority[i], 1);
    doTranscendReset(true);
}

function respecSetbackPriority() {
    if (player.setbackPriority.filter((value) => { return Decimal.neq(value, 0) }).length == 0) {
        return;
    }

    if (!transcendResetWOGainPrompt()) {
        return;
    }
    
    for (let i = 0; i < player.setbackPriority.length; i++) {
        player.setbackPriority[i] = D(0);
    }
    doTranscendReset(true);
}