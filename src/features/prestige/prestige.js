"use strict";

const PRESTIGE_UPGRADES = [
    {
        cost: D(1),
        desc(levels) {
            return `Point gain is boosted. Currently: ×${format(tmp.prestigeUpgEffs[0], 2)}`;
        },
        eff(levels) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let eff = D(2);
            if (hasPrestigeUpgrade(13)) {
                eff = eff.pow(tmp.prestigeUpgEffs[13]);
            }
            eff = eff.pow(Decimal.max(levels, 1));
            return eff;
        }
    },
    {
        cost: D(1),
        desc(levels) {
            return `Point gain is boosted based off of points. Currently: ×${format(tmp.prestigeUpgEffs[1], 2)}`;
        },
        eff(levels) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let eff = Decimal.max(player.bestPointsInPrestige, 1).log10().div(5).add(1);
            eff = eff.pow(Decimal.max(levels, 1));
            return eff;
        }
    },
    {
        cost: D(1),
        desc(levels) {
            return `Point gain is boosted based off of total prestige points. Currently: ×${format(tmp.prestigeUpgEffs[2], 2)}`;
        },
        eff(levels) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let eff = Decimal.max(player.prestige, 0).div(2).add(1);
            let bought;
            if (hasSetbackUpgrade('b4')) {
                bought = Decimal.max(levels, 0).add(1);
            } else {
                bought = Decimal.max(levels, 1);
            }
            eff = eff.pow(bought);
            if (hasSetbackUpgrade('b4')) {
                eff = eff.pow(SETBACK_UPGRADES[2][3].eff);
            }
            return eff;
        }
    },
    {
        cost: D(5),
        desc(levels) {
            return player.prestigeChallengeCompleted.includes(2)
                ? Decimal.neq(tmp.prestigeUpgEffs[3], 0) && Decimal.neq(tmp.prestigeUpgEffs[3], 1)
                    ? `Basic Buyables give ${format(tmp.prestigeUpgEffs[3], 1)} free levels to all previous basic buyables instead of only the previous basic buyable.`
                    : `Basic Buyables give a free level to all previous basic buyables instead of only the previous basic buyable.`
                : Decimal.neq(tmp.prestigeUpgEffs[3], 0) && Decimal.neq(tmp.prestigeUpgEffs[3], 1)
                    ? `Basic Buyables give ${format(tmp.prestigeUpgEffs[3], 1)} free levels to the previous basic buyable.`
                    : `Basic Buyables give a free level to the previous basic buyable.`;
        },
        eff(levels) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(0);
            }
            let eff = Decimal.max(levels, 0);
            if (hasPrestigeUpgrade(17)) {
                eff = eff.add(tmp.prestigeUpgEffs[17]);
            }

            return eff;
        }
    },
    {
        cost: D(5),
        desc(levels) {
            return `Total amount of basic buyables gives an extra boost to points. Currently: ×${format(tmp.prestigeUpgEffs[4], 2)}`;
        },
        eff(levels) {
            if (player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let total = D(0);
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(tmp.buyables[i].effective);
            }
            let eff = total.mul(0.01).add(1);
            eff = eff.pow(Decimal.max(levels, 1).add(hasPrestigeUpgrade(17) ? tmp.prestigeUpgEffs[17] : 0));
            return eff;
        }
    },
    {
        cost: D(5),
        desc(levels) {
            return `Buy. 4's effect base increases by +×0.002 per Buy. 4 bought. Currently: +×${format(tmp.prestigeUpgEffs[5], 3)}`;
        },
        eff(levels) {
            if (Decimal.gt(player.ascendUpgrades[12], 0) && player.transcendInSpecialReq === "ascend5") {
                return D(0);
            }
            let eff = Decimal.mul(player.buyables[3], 0.002);
            eff = eff.mul(Decimal.max(levels, 1).add(hasPrestigeUpgrade(17) ? tmp.prestigeUpgEffs[17] : 0));
            return eff
        }
    },
    {
        cost: D(8),
        desc(levels) {
            return `Point gain is increased based off of the amount of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'}. Currently: ×${format(tmp.prestigeUpgEffs[6], 2)}`;
        },
        eff(levels) {
            if (Decimal.gt(player.ascendUpgrades[12], 1) && player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let eff = tmp.totalPrestigeUpg.div(10).pow_base(32);
            eff = eff.pow(Decimal.max(levels, 1).add(hasPrestigeUpgrade(17) ? tmp.prestigeUpgEffs[17] : 0));
            return eff;
        }
    },
    {
        cost: D(8),
        desc(levels) {
            return `Prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} and total basic buyables bought give a boost to points. Currently: ×${format(tmp.prestigeUpgEffs[7], 2)}`;
        },
        eff(levels) {
            if (Decimal.gt(player.ascendUpgrades[12], 1) && player.transcendInSpecialReq === "ascend5") {
                return D(1);
            }
            let total = D(0);
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(player.buyables[i]);
            }
            let eff = total.mul(tmp.totalPrestigeUpg.div(400)).add(1);
            eff = eff.pow(Decimal.max(levels, 1).add(hasPrestigeUpgrade(17) ? tmp.prestigeUpgEffs[17] : 0));
            return eff;
        }
    },
    {
        cost: D(8),
        desc(levels) {
            return `Prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} increase Buyable 1's effect base. Currently: +${format(tmp.prestigeUpgEffs[8], 2)}`;
        },
        eff(levels) {
            if (Decimal.gt(player.ascendUpgrades[12], 2) && player.transcendInSpecialReq === "ascend5") {
                return D(0);
            }
            let eff = tmp.totalPrestigeUpg.mul(0.5);
            eff = eff.mul(Decimal.max(levels, 1).add(hasPrestigeUpgrade(17) ? tmp.prestigeUpgEffs[17] : 0));
            return eff;
        }
    },
    {
        cost: D(15),
        desc(levels) {
            return `Raise Point gain by ^${format(tmp.prestigeUpgEffs[9], 2)}. (~×${format(tmp.pointGen.root(tmp.prestigeUpgEffs[9]).pow(tmp.prestigeUpgEffs[9].sub(1)))})`
        },
        eff(levels) {
            let eff = D(1.1)
            eff = eff.pow(Decimal.max(levels, 1))
            if (tmp.hinderances[3].entered) {
                eff = eff.pow(tmp.hinderances[3].effects.pts)
            }
            return eff
        }
    },
    {
        cost: D(15),
        desc(levels) {
            return `Raise Generator Speed by ^${format(tmp.prestigeUpgEffs[10], 2)}. (~×${format(Decimal.root(player.buyablePoints[0], tmp.prestigeUpgEffs[10]).pow(tmp.prestigeUpgEffs[10].sub(1)))}) `
        },
        eff(levels) {
            let eff = D(1.2)
            eff = eff.pow(Decimal.max(levels, 1))
            return eff
        }
    },
    {
        cost: D(15),
        desc(levels) {
            return `Raise Point and Generator Speed by ^${format(tmp.prestigeUpgEffs[11], 3)}. (~×${format(tmp.pointGen.root(tmp.prestigeUpgEffs[11]).pow(tmp.prestigeUpgEffs[11].sub(1)))} pts, ~×${format(Decimal.root(player.buyablePoints[0], tmp.prestigeUpgEffs[11]).pow(tmp.prestigeUpgEffs[11].sub(1)))} gen. spd)`
        },
        eff(levels) {
            let eff = D(1.075)
            eff = eff.pow(Decimal.max(levels, 1))
            return eff
        }
    },
    {
        cost: D(25),
        desc(levels) {
            return `Increase Generator effects from +${format(tmp.prestigeUpgEffs[12].recip().mul(100))}%/level to +${format(this.eff2(Decimal.add(levels, 1)).recip().mul(100))}%/level.`
        },
        eff(levels) {
            return this.eff2(levels)
        },
        eff2(x) {
            let eff = D(10)
            eff = eff.div(Decimal.min(x, 1).pow_base(2.5))
            eff = eff.div(Decimal.max(x, 1).sub(1).pow_base(2))
            return eff
        }
    },
    {
        cost: D(25),
        desc(levels) {
            return `P${tmp.prestigeIsUpg ? 'U' : 'B'}1 is raised to the ^${format(tmp.prestigeUpgEffs[13], 2)}`
        },
        eff(levels) {
            let eff = D(4)
            eff = eff.pow(Decimal.max(levels, 1))
            return eff
        }
    },
    {
        cost: D(25),
        desc(levels) {
            return `Prestige Point effect from PC4 is increased from +${format(tmp.prestigeUpgEffs[14].mul(100))}%/point to +${format(this.eff2(Decimal.add(levels, 1)).mul(100))}%/point.`
        },
        eff(levels) {
            return this.eff2(levels)
        },
        eff2(x) {
            let eff = D(0.2)
            eff = eff.mul(Decimal.min(x, 1).pow_base(2.5))
            eff = eff.mul(Decimal.max(x, 1).sub(1).pow_base(2))
            return eff
        }
    },
    {
        cost: D(1e11),
        desc(levels) {
            return `Raise Point gain by +▲${format(tmp.prestigeUpgEffs[15].sub(1), 3)}. (~^${format(tmp.pointGen.max(10).log10().root(tmp.prestigeUpgEffs[15]).pow(tmp.prestigeUpgEffs[15].sub(1)), 3)})`;
        },
        eff(levels) {
            let eff = Decimal.max(levels, 1);
            eff = eff.mul(0.001).add(1);
            if (tmp.hinderances[3].entered) {
                eff = eff.pow(tmp.hinderances[3].effects.pts);
            }
            return eff
        }
    },
    {
        cost: D(1e11),
        desc(levels) {
            return `Raise Generator Speed by +▲${format(tmp.prestigeUpgEffs[16].sub(1), 3)}. (~^${format(Decimal.max(player.buyablePoints[0], 10).log10().root(tmp.prestigeUpgEffs[16]).pow(tmp.prestigeUpgEffs[16].sub(1)), 3)})`;
        },
        eff(levels) {
            let eff = Decimal.max(levels, 1);
            eff = eff.mul(0.001).add(1);
            return eff;
        }
    },
    {
        cost: D(1e12),
        desc(levels) {
            return `PB4 to PB9 gain ${format(tmp.prestigeUpgEffs[17], 1)} free level(s).`;
        },
        eff(levels) {
            let eff = Decimal.max(levels, 1);
            return eff;
        }
    },
]

function initHTML_prestige() {
    toHTMLvar('prestigeTab');
    toHTMLvar('prestigeTabButton');
    html['prestigeTab'].setDisplay(false);
    html['prestigeTabButton'].setDisplay(false);

    toHTMLvar('prestige');
    toHTMLvar('prestigeAmount');
    toHTMLvar('prestigeNext');
    toHTMLvar('prestigePoints');
    toHTMLvar('prestigeUpgradeList');
    toHTMLvar('prestigeUpgradeCap');
    toHTMLvar('prestigePointEffect');
    toHTMLvar('prestigePointEffectNext');
    toHTMLvar('mainPrestigeTabButton');
    toHTMLvar('mainPrestigeTab');
    toHTMLvar('prestigeEssenceAmount');
    toHTMLvar('prestigeEssenceNext');
    toHTMLvar('prestigeEssence');
    toHTMLvar('prestigeEssenceEffect');
    toHTMLvar('prestigeEssenceEffectNext');
    toHTMLvar('prestigeEssenceDisp');

    let txt = ``;
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        txt += `
            <div id="prestigeUpgrade${i}all" style="width: 190px; margin: 2px">
                <button onclick="buyPrestigeUpgrade(${i})" id="prestigeUpgrade${i}" class="whiteText font" style="height: 80px; width: 190px; font-size: 9px;">
                    <b><span id="prestigeUpgrade${i}amount"></span></b><br><br>
                    <span id="prestigeUpgrade${i}eff"></span><br>
                    <span id="prestigeUpgrade${i}cost"></span>
                </button>
                <div class="flex-vertical" style="margin-left: 0px">
                    <div id="pb${i}generators" style="height: 10px; width: 190px; position: relative; margin: 2px">
                        <div id="pb${i}generatorProgressBarBase" style="background-color: #004080; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                        <div id="pb${i}generatorProgressBar" style="background-color: #0080FF; position: absolute; top: 0; left: 0; height: 100%"></div>
                    </div>
                    <span id="pb${i}generatorProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
                </div>
            </div>
        `;
    }

    html['prestigeUpgradeList'].setHTML(txt);
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        toHTMLvar(`prestigeUpgrade${i}all`);
        toHTMLvar(`prestigeUpgrade${i}`);
        toHTMLvar(`prestigeUpgrade${i}amount`);
        toHTMLvar(`prestigeUpgrade${i}eff`);
        toHTMLvar(`prestigeUpgrade${i}cost`);

        toHTMLvar(`pb${i}generators`);
        toHTMLvar(`pb${i}generatorProgressBarBase`);
        toHTMLvar(`pb${i}generatorProgressBar`);
        toHTMLvar(`pb${i}generatorProgressNumber`);
    }
}

function updateGame_prestige() {
    for (let i = PRESTIGE_UPGRADES.length - 1; i >= 0; i--) {
        let upgGen = D(0);
        if (Decimal.gte(player.prestigeChallengeRepCompleted[0], 1)) {
            upgGen = Decimal.gt(player.prestigeUpgrades[i], 0) ? Decimal.pow(tmp.prestigeRepeatChal[0].rewardEffs.exponent, player.prestigeUpgrades[i]) : D(0);
        }
        player.prestigeBuyablePoints[i] = Decimal.add(player.prestigeBuyablePoints[i], upgGen.mul(delta).mul(tmp.timeSpeedTiers[1]))

        tmp.prestigeUpgLevels[i] = prestigeBuyGenFunc(player.prestigeBuyablePoints[i], true, i).floor().max(1);

        let levels = Decimal.max(player.prestigeUpgrades[i], 0);
        levels = levels.add(tmp.prestigeUpgLevels[i].sub(1).mul(0.5));
        levels = levels.add(tmp.anticap.energyEffs[2]);

        tmp.prestigeUpgEffs[i] = PRESTIGE_UPGRADES[i].eff(levels);
        // sigh, i don't want to go through each and every prestige upgrade, and i also want it to be faithful to the description of PF buyables
        // "Raises PB# effect by ^x.xx"
        tmp.prestigeUpgEffs[i] = tmp.prestigeUpgEffs[i].pow(tmp.pfUpgData[i].effect);

        tmp.prestigeUpgDescs[i] = PRESTIGE_UPGRADES[i].desc(levels);
    }

    player.timeInPrestige = Decimal.add(player.timeInPrestige, Decimal.mul(delta, tmp.timeSpeedTiers[0]));

    tmp.factors.prestigeEssence = [];
    tmp.peGain = hasSetbackUpgrade(`b1`)
        ? Decimal.max(player.bestPointsInPrestige, 10).log(1e6).log2().pow_base(10)
        : D(0);
    addStatFactor('prestigeEssence', `Base`, `10<sup>log<sub>2</sub>(log<sub>1,000,000</sub>(${format(player.bestPointsInPrestige)}))</sup>`, null, tmp.peGain);
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.peGain = new Decimal(0);
        addStatFactor('prestigeEssence', `Advantageous 'Challenge'`, `...`, null, tmp.peGain);
    }

    // exp boosts
    if (tmp.prestigeRepeatChal[2].depth.lte(0)) {
        if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
            tmp.peGain = tmp.peGain.pow(HINDERANCES[0].eff);
            addStatFactor('prestigeEssence', `H1 PB`, `^`, HINDERANCES[0].eff, tmp.peGain);
        }
    }

    // nerfs
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.peGain = tmp.peGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('prestigeEssence', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.peGain);
    }
    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
        tmp.peGain = tmp.peGain.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
        addStatFactor('prestigeEssence', `PRC2`, `▲`, tmp.prestigeRepeatChal[1].effects.exponent, tmp.peGain);
    }

    if (player.anticap.active) {
        tmp.peGain = anticapSoftcap(tmp.peGain, "prestigeEssence", "prestigeEssence", false);
    }

    if (!hasSetbackUpgrade('b7')) {
        tmp.peGain = tmp.peGain.sub(player.prestigeEssence);
        addStatFactor('prestigeEssence', `Current P. Essence`, `-`, player.prestigeEssence, tmp.peGain.sub(player.prestigeEssence).max(0));
    }
    tmp.peGain = tmp.peGain.floor().max(0);


    tmp.peNext = tmp.peGain;
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.peNext = new Decimal(Infinity);
    }

    tmp.peNext = tmp.peNext.add(1).floor().add(hasSetbackUpgrade('b7') ? D(0) : player.prestigeEssence);
    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
        tmp.peNext = tmp.peNext.add(1).log10().add(1).root(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.peNext = tmp.peNext.root(tmp.hinderances[4].effects.resource);
    }
    if (tmp.prestigeRepeatChal[2].depth.lte(0)) {
        if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
            tmp.peNext = tmp.peNext.root(HINDERANCES[0].eff);
        }
    }
    tmp.peNext = tmp.peNext.log(10).pow_base(2).pow_base(1e6);

    tmp.peEffect = getPrestigeEssenceEff(player.prestigeEssence);
    tmp.peEffectNext = getPrestigeEssenceEff(Decimal.add(player.prestigeEssence, tmp.peGain));

    tmp.prestigeUpgCap = D(4);
    if (player.prestigeChallengeCompleted.includes(0)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(1)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(2)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(3)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(6)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(7)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(8)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(9)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(10)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(11)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(1);
    }
    if (player.prestigeChallengeCompleted.includes(12)) {
        if (player.transcendUpgrades.includes('prest4')) {
            tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(Decimal.max(player.bestTotalGenLvs, 1).log2().sub(11).max(0).mul(2).floor().div(2));
        } else {
            tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(Decimal.max(player.bestTotalGenLvs, 1).log2().sub(11).max(0).floor());
        }
    }
    if (Decimal.gte(player.hinderanceScore[1], HINDERANCES[1].start)) {
        tmp.prestigeUpgCap = tmp.prestigeUpgCap.add(2);
    }

    tmp.prestigeIsUpg = !player.transcendUpgrades.includes('prest4');
    tmp.prestigePointsUsed = D(0);
    tmp.totalPrestigeUpg = D(0);
    if (!hasTranscendMilestone(1)) {
        for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
            if (Decimal.eq(player.prestigeUpgrades[i], 0)) {
                continue;
            }
            if (tmp.hinderances[4].depth.gt(0) && i != 0) {
                continue;
            } 
            tmp.prestigePointsUsed = tmp.prestigePointsUsed.add(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(Decimal.sub(player.prestigeUpgrades[i], 1), false)));
        }
    }
    tmp.totalPrestigeUpg = player.prestigeUpgrades.reduce((accu, bought) => Decimal.add(accu, bought));

    tmp.factors.prestige = [];
    tmp.prestigePointGain = Decimal.max(player.bestPointsInPrestige, 1e5).div(1e6).log10().add(1);
    addStatFactor('prestige', `Base`, `1+log<sub>10</sub>(${format(player.bestPointsInPrestige)}/1,000,000)`, null, tmp.prestigePointGain);
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.prestigePointGain = new Decimal(0);
        addStatFactor('prestige', `Advantageous 'Challenge'`, `...`, null, tmp.prestigePointGain);
    }
    if (Decimal.gt(player.setbackEnergy[2], 0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(tmp.energyEffs[2]);
        addStatFactor('prestige', `Blue Energy`, `×`, tmp.energyEffs[2], tmp.prestigePointGain);
    }
    if (Decimal.gt(player.hinderanceScore[1], HINDERANCES[1].start)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(HINDERANCES[1].eff);
        addStatFactor('prestige', `H2 PB`, `×`, HINDERANCES[1].eff, tmp.prestigePointGain);
    }
    if (player.transcendUpgrades.includes('prest1')) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(2);
        addStatFactor('prestige', `Trans. Upg. "Double the prestige?"`, `×`, 2, tmp.prestigePointGain);
    }
    if (player.transcendUpgrades.includes('prest2')) {
        tmp.prestigePointGain = tmp.prestigePointGain.div(tmp.transEffs[2][1]);
        addStatFactor('prestige', `Trans. Upg. "Tier Combine"`, `/`, tmp.transEffs[2][1], tmp.prestigePointGain);
    }
    if (Decimal.neq(tmp.generatorFeatures.advanceEff, 0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(tmp.generatorFeatures.advanceEff);
        addStatFactor('prestige', `Generator Advance Effect"`, `×`, tmp.generatorFeatures.advanceEff, tmp.prestigePointGain);
    }
    if (player.anticap.upgrades.includes(6)) {
        tmp.prestigePointGain = tmp.prestigePointGain.mul(tmp.anticap.upgrades[6].eff);
        addStatFactor('prestige', `Anticap Upgrade #7`, `×`, tmp.anticap.upgrades[6].eff, tmp.prestigePointGain);
    }
    if (tmp.repliTierBuyables[4].eff.neq(1)) {
        tmp.prestigePointGain = tmp.prestigePointGain.pow(tmp.repliTierBuyables[4].eff);
        addStatFactor('prestige', `RepliTier Buyable #5`, `^`, tmp.repliTierBuyables[4].eff, tmp.prestigePointGain);
    }

    // challenge effs
    if (colorAmountTotal(1).gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.div(tmp.setbackEffects[1][0]);
        addStatFactor('prestige', `Setback Green Effect`, `/`, tmp.setbackEffects[1][0], tmp.prestigePointGain);
    }
    if (tmp.hinderances[1].depth.gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.pow(tmp.hinderances[1].effects.prestige);
        addStatFactor('prestige', `Hinderance 2`, `^`, tmp.hinderances[1].effects.prestige, tmp.prestigePointGain);
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.pow(tmp.hinderances[4].effects.resource);
        addStatFactor('prestige', `Hinderance 5`, `^`, tmp.hinderances[4].effects.resource, tmp.prestigePointGain);
    }
    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.add(1).log10().add(1).pow(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
        addStatFactor('prestige', `PRC2`, `▲`, tmp.prestigeRepeatChal[1].effects.exponent, tmp.prestigePointGain);
    }
    if (tmp.prestigeRepeatChal[0].depth.gt(0)) {
        // i have to cache this cuz slogs/tetrates are super slow
        // also put linear because we are almost never going to use fractional depths for challenges >_>
        let prevValue = tmp.prestigePointGain;
        tmp.prestigePointGain = tmp.prestigePointGain.iteratedlog(2, tmp.prestigeRepeatChal[0].effects.log, true);
        if (Decimal.isNaN(tmp.prestigePointGain)) {
            tmp.prestigePointGain = D(0);
        }
        addStatFactor('prestige', `PRC1`, `log${tmp.prestigeRepeatChal[0].effects.log.neq(1) ? '<sup>' + format(tmp.prestigeRepeatChal[0].effects.log, 2) + '</sup>' : ''}<sub>2</sub>(${format(prevValue.sub(1))})`, null, tmp.prestigePointGain);
    }

    if (tmp.prestigeRepeatChal[3].depth.gt(0)) {
        tmp.prestigePointGain = tmp.prestigePointGain.min(player.bestTotalGenLvs);
        addStatFactor('prestige', `PRC4`, `...`, null, tmp.prestigePointGain);
    }

    if (player.anticap.active) {
        tmp.prestigePointGain = anticapSoftcap(tmp.prestigePointGain, "prestigePts", "prestige", false);
    }

    tmp.prestigePointGain = cheatDilateBoost(tmp.prestigePointGain);
    if (player.cheats.dilate) {
        addStatFactor('prestige', `Cheats`, `...`, null, tmp.prestigePointGain);
    }

    addStatFactor('prestige', `Current P. Points`, `-`, player.prestige, tmp.prestigePointGain.sub(player.prestige).max(0));
    tmp.prestigePointGain = tmp.prestigePointGain.sub(player.prestige).floor().max(0);

    tmp.prestigePointNext = tmp.prestigePointGain.add(player.prestige).add(1);
    if (player.transcendInSpecialReq === "prest4" && Decimal.gte(player.prestigeCountInTrans, 1)) {
        tmp.prestigePointNext = new Decimal(Infinity);
    }
    tmp.prestigePointNext = cheatDilateBoost(tmp.prestigePointNext, true);

    if (player.anticap.active) {
        tmp.prestigePointNext = anticapSoftcap(tmp.prestigePointNext, "prestigePts", "prestige", true);
    }

    if (tmp.prestigeRepeatChal[1].depth.gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.add(1).log10().add(1).root(tmp.prestigeRepeatChal[1].effects.exponent).sub(1).pow10().sub(1);
    }
    if (tmp.prestigeRepeatChal[0].depth.gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.layeradd(tmp.prestigeRepeatChal[0].effects.log.toNumber(), 2, true);
    }
    if (tmp.hinderances[4].depth.gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.root(tmp.hinderances[4].effects.resource);
    }
    if (tmp.hinderances[1].depth.gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.root(tmp.hinderances[1].effects.prestige);
    }
    if (colorAmountTotal(1).gt(0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.mul(tmp.setbackEffects[1][0]);
    }

    tmp.prestigePointGain = tmp.prestigePointGain.root(tmp.repliTierBuyables[4].eff);
    if (player.anticap.upgrades.includes(6)) {
        tmp.prestigePointNext = tmp.prestigePointNext.div(tmp.anticap.upgrades[6].eff);
    }
    if (Decimal.gt(player.generatorFeatures.totalAdv, 0)) {
        tmp.prestigePointNext = tmp.prestigePointNext.div(tmp.generatorFeatures.advanceEff);
    }
    if (player.transcendUpgrades.includes('prest2')) {
        tmp.prestigePointNext = tmp.prestigePointNext.mul(tmp.transEffs[2][1]);
    }
    if (player.transcendUpgrades.includes('prest1')) {
        tmp.prestigePointNext = tmp.prestigePointNext.div(2);
    }
    tmp.prestigePointNext = tmp.prestigePointNext.div(HINDERANCES[1].eff);
    tmp.prestigePointNext = tmp.prestigePointNext.div(tmp.energyEffs[2]);
    tmp.prestigePointNext = tmp.prestigePointNext.sub(1).pow10().mul(1e6);

    if (tmp.prestigeRepeatChal[3].depth.gt(0)) {
        if (tmp.prestigePointGain.gte(player.bestTotalGenLvs)) {
            tmp.prestigePointNext = player.bestTotalGenLvs;
        }
    }

    // auto-prestige
    tmp.autoPrestige = player.cheats.autoPrestige || (Decimal.gte(player.hinderanceScore[2], HINDERANCES[2].start) && player.transcendInSpecialReq !== "prest4");
    if (tmp.autoPrestige) {
        player.prestige = Decimal.add(player.prestige, tmp.prestigePointGain);

        if (hasSetbackUpgrade('b7')) {
            player.prestigeEssence = Decimal.max(player.prestigeEssence, tmp.peGain).add(tmp.peGain.mul(delta).mul(tmp.timeSpeedTiers[1]));
        } else {
            player.prestigeEssence = Decimal.add(player.prestigeEssence, tmp.peGain);
        }
    }

    tmp.prestigePointEffect = getPrestigePointEff(player.prestige);
    tmp.prestigePointEffectNext = getPrestigePointEff(Decimal.add(player.prestige, tmp.prestigePointGain));
}

function getPrestigePointEff(points) {
    let eff = player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')
        ? Decimal.mul(points, 
            hasPrestigeUpgrade(14) 
                ? tmp.prestigeUpgEffs[14]
                : 0.2
            )
            .add(1) 
        : D(1)
    if (hasSetbackUpgrade('b4')) {
        eff = eff.pow(player.prestigeChallengeCompleted.includes(3) ? 2 : 1);
        eff = eff.pow(SETBACK_UPGRADES[2][3].eff);
    }
    if (player.transcendUpgrades.includes('prest3')) {
        eff = eff.pow(2);
    }
    return eff;
}

function getPrestigeEssenceEff(essence) {
    let eff = Decimal.max(essence, 0).add(1);
    if (player.prestigeChallengeCompleted.includes(10)) {
        let total = D(0);
        for (let i = 0; i < player.buyables.length; i++) {
            total = total.add(tmp.buyables[i].genLevels);
        }
        eff = eff.pow(total.add(1).log10().mul(0.1).add(1));
    }
    eff = eff.pow(tmp.pfEffect);
    return eff;
}

function updateHTML_prestige() {
    html['prestigeTab'].setDisplay(tmp.tab === 1);
    html['prestigeTabButton'].setDisplay(Decimal.gt(player.prestige, 0) || Decimal.gt(player.ascend, 0));

    // i think the challenge code should stay here because its linked with a normal part of prestiges, and having to look at
    // different files for this probably isn't great
    if (tmp.tab === 0 && tmp.mainTab === 0) {
        html['prestige'].setDisplay(player.prestigeChallenge === null);
        html['prestigeChallengeButton'].setDisplay(player.prestigeChallenge !== null);
        if (player.prestigeChallenge === null) {
            html['prestigeAmount'].setTxt(format(tmp.prestigePointGain));
            let show = Decimal.lt(tmp.prestigePointGain, 100);
            html['prestigeNext'].setDisplay(show);
            if (show) {
                html['prestigeNext'].setTxt(`Next prestige point at ${format(tmp.prestigePointNext)} points.`);
            }

            html['prestigeEssenceAmount'].setDisplay(hasSetbackUpgrade(`b1`));
            html['prestigeEssenceNext'].setDisplay(hasSetbackUpgrade(`b1`) && Decimal.lt(tmp.peGain, 100));
            if (hasSetbackUpgrade(`b1`)) {
                html['prestigeEssenceAmount'].setTxt(`${hasSetbackUpgrade(`b6`) ? ", " : " and"} ${format(tmp.peGain)} prestige essence`);
                html['prestigeEssenceNext'].setTxt(`Next essence at ${format(tmp.peNext)} points.`);
            }
        } else {
            html['prestigeChallengeName'].setTxt(PRESTIGE_CHALLENGES[player.prestigeChallenge].name);
            html['prestigeChallengeRequirement'].setTxt(format(PRESTIGE_CHALLENGES[player.prestigeChallenge].goal));
            html['prestigeChallengeButton'].changeStyle('cursor', Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? 'pointer' : 'not-allowed');
            html['prestigeChallengeButton'].changeStyle('border', '3px solid ' + (Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? '#0080ff' : '#004080'));
            html['prestigeChallengeButton'].changeStyle('background-color', Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? '#00408080' : '#00204080');
        }
    }

    if (tmp.tab === 1) {
        html['mainPrestigeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0));
        html['mainPrestigeTab'].setDisplay(tmp.prestigeTab === 0);

        html['prestigePoints'].setTxt(`${format(Decimal.sub(player.prestige, tmp.prestigePointsUsed))}`);

        html['prestigePointEffect'].setDisplay(player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4'));
        html['prestigePointEffectNext'].setDisplay((player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')) && !tmp.autoPrestige);
        if (player.prestigeChallengeCompleted.includes(3) || hasSetbackUpgrade('b4')) {
            html['prestigePointEffect'].setTxt(`Boosting points by ×${format(tmp.prestigePointEffect, 2)}`);
            html['prestigePointEffectNext'].setTxt(`×${format(tmp.prestigePointEffectNext.div(tmp.prestigePointEffect), 2)} upon next reset`);
        }

        html['prestigeEssenceDisp'].setDisplay(hasSetbackUpgrade(`b1`));
        if (hasSetbackUpgrade(`b1`)) {
            html['prestigeEssence'].setTxt(format(player.prestigeEssence));
            html['prestigeEssenceEffect'].setTxt(`Boosting points by ×${format(tmp.peEffect, 2)}`);

            html['prestigeEssenceEffectNext'].setDisplay(!tmp.autoPrestige);
            if (!tmp.autoPrestige) {
                html['prestigeEssenceEffectNext'].setTxt(`×${format(tmp.peEffectNext.div(tmp.peEffect), 2)} upon next reset`);
            }
        }

        if (tmp.prestigeTab === 0) {
            html['prestigeUpgradeCap'].setTxt(`${format(tmp.totalPrestigeUpg, player.transcendUpgrades.includes('prest4') ? 1 : 0)} / ${format(tmp.prestigeUpgCap, player.transcendUpgrades.includes('prest4') ? 1 : 0)}`);

            for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
                let show = true;
                if (i >= 9 && i <= 11) {
                    show = Decimal.gt(player.ascendUpgrades[12], 0);
                }
                if (i >= 12 && i <= 14) {
                    show = Decimal.gt(player.ascendUpgrades[12], 1);
                }
                if (i >= 15 && i <= 17) {
                    show = Decimal.gt(player.ascendUpgrades[12], 2);
                }
                html[`prestigeUpgrade${i}all`].setDisplay(show);
                if (show) {
                    html[`prestigeUpgrade${i}eff`].setTxt(tmp.prestigeUpgDescs[i]);
                    html[`prestigeUpgrade${i}cost`].setTxt(
                        hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`) 
                            ? `Bought!` 
                            : (tmp.hinderances[4].depth.gt(0) && i != 0)
                                ? `Cost: ${format(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(player.prestigeUpgrades[i], false)))} PB${i}`
                                : `Cost: ${format(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(player.prestigeUpgrades[i], false)))} prestige points`
                            );
                    if (hasSetbackUpgrade('b2')) {
                        let txt = `PB${i+1}`;
                        if (!hasPrestigeUpgrade(i)) {
                            txt += ` (Inactive)`;
                        }
                        txt += `: ×`;
                        if (player.transcendUpgrades.includes('prest4')) {
                            txt += `${format(player.prestigeUpgrades[i], 1)}`;
                        } else {
                            txt += `${format(player.prestigeUpgrades[i])}`;
                        }

                        html[`prestigeUpgrade${i}amount`].setTxt(txt);
                        html[`prestigeUpgrade${i}amount`].changeStyle('color', hasPrestigeUpgrade(i) ? '#ffffff' : '#ff8080');
                    } else {
                        html[`prestigeUpgrade${i}amount`].setTxt(`Prestige Upgrade ${i+1}`);
                    }

                    html[`prestigeUpgrade${i}`].changeStyle('background-color',
                        !(hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`))
                            ? (canBuyPrestigeUpgrade(i)
                                ? '#00408080'
                                : '#00008080')
                            : '#00808080');
                    html[`prestigeUpgrade${i}`].changeStyle('border', `3px solid ${
                        !(hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`))
                            ? (canBuyPrestigeUpgrade(i)
                                ? '#0080ff'
                                : '#0000ff')
                            : '#00ffff'}`);
                    html[`prestigeUpgrade${i}`].changeStyle('cursor',
                        !(hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`)) && canBuyPrestigeUpgrade(i)
                            ? 'pointer'
                            : 'not-allowed');

                    html[`pb${i}generators`].setDisplay(Decimal.gte(player.prestigeChallengeRepCompleted[0], 1));
                    html[`pb${i}generatorProgressNumber`].setDisplay(Decimal.gte(player.prestigeChallengeRepCompleted[0], 1));

                    if (Decimal.gte(player.prestigeChallengeRepCompleted[0], 1)) {
                        if (tmp.prestigeUpgLevels[i].gte(20)) {
                            if (tmp.prestigeUpgLevels[i].gte(100)) {
                                html[`pb${i}generatorProgressNumber`].setTxt(`Level ${format(tmp.prestigeUpgLevels[i])}`);
                            } else {
                                html[`pb${i}generatorProgressNumber`].setTxt(`${format(player.prestigeBuyablePoints[i])}, Level ${format(tmp.prestigeUpgLevels[i])}`);
                            }
                            html[`pb${i}generatorProgressBar`].changeStyle('width', `${player.prestigeBuyablePoints[i].div(prestigeBuyGenFunc(tmp.prestigeUpgLevels[i], false, i)).max(1).log(prestigeBuyGenFunc(tmp.prestigeUpgLevels[i].add(1), false, i).div(prestigeBuyGenFunc(tmp.prestigeUpgLevels[i], false, i))).min(1).mul(100).toNumber()}%`);
                        } else {
                            html[`pb${i}generatorProgressNumber`].setTxt(`${format(player.prestigeBuyablePoints[i])}/${format(prestigeBuyGenFunc(tmp.prestigeUpgLevels[i].add(1), false, i))}, Level ${format(tmp.prestigeUpgLevels[i])}`);
                            html[`pb${i}generatorProgressBar`].changeStyle('width', `${Decimal.div(player.prestigeBuyablePoints[i], prestigeBuyGenFunc(tmp.prestigeUpgLevels[i].add(1), false, i)).min(1).mul(100).toNumber()}%`);
                        }
                    }
                }
            }
        }
    }
}

function prestigeBuyGenFunc(xp, inv, i) {
    let eff;
    if (inv) {
        eff = linearAdd(Decimal.max(xp, 1).log10(), 1, 1, true);
    } else {
        eff = linearAdd(xp, 1, 1, false).pow10();
    }
    return eff;
}

function canBuyPrestigeUpgrade(i) {
    if (tmp.totalPrestigeUpg.gte(tmp.prestigeUpgCap)) {
        return false;
    }
    let resource;
    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
        resource = player.prestigeUpgrades[i - 1];
    } else {
        resource = player.prestige;
    }
    if (Decimal.sub(resource, tmp.prestigePointsUsed).lt(PRESTIGE_UPGRADES[i].cost.mul(prestigeUpgradeCostScaling(player.prestigeUpgrades[i], false)))) {
        return false;
    }
    if (hasPrestigeUpgrade(i) && !hasSetbackUpgrade(`b2`)) {
        return false;
    }
    return true;
}

function buyPrestigeUpgrade(i) {
    if (!canBuyPrestigeUpgrade(i)) {
        return;
    }
    let resource;
    if (tmp.hinderances[4].depth.gt(0) && i != 0) {
        resource = player.prestigeUpgrades[i - 1];
    } else {
        resource = player.prestige;
    }
    if (shiftDown) {
        player.prestigeUpgrades[i] = prestigeUpgradeCostScaling(Decimal.sub(resource, tmp.prestigePointsUsed).div(PRESTIGE_UPGRADES[i].cost), true);
        if (player.transcendUpgrades.includes('prest4')) {
            player.prestigeUpgrades[i] = player.prestigeUpgrades[i].mul(2).ceil().div(2);
        } else {
            player.prestigeUpgrades[i] = player.prestigeUpgrades[i].ceil();
        }
    } else {
        if (player.transcendUpgrades.includes('prest4')) {
            player.prestigeUpgrades[i] = Decimal.add(player.prestigeUpgrades[i], 0.5);
        } else {
            player.prestigeUpgrades[i] = Decimal.add(player.prestigeUpgrades[i], 1);
        }
    }
    if (!hasSetbackUpgrade(`b2`)) {
        player.prestigeUpgrades[i] = Decimal.min(player.prestigeUpgrades[i], 1);
    }
    // accomodate for if buying this would bring this over the prestige buyable cap
    if (player.prestigeUpgrades.reduce((accu, bought) => Decimal.add(accu, bought)).gt(tmp.prestigeUpgCap)) {
        player.prestigeUpgrades[i] = Decimal.sub(player.prestigeUpgrades[i], player.prestigeUpgrades.reduce((accu, bought) => Decimal.add(accu, bought)).sub(tmp.prestigeUpgCap));
    }

    player.prestigeUpgradesInCurrentAscension = true;
}

function hasPrestigeUpgrade(i) {
    if (tmp.hinderances[2].depth.lte(0) && (tmp.prestigeChal[5].depth.gt(0) || tmp.prestigeChal[6].depth.gt(0) || tmp.prestigeChal[7].depth.gt(0) || tmp.prestigeChal[8].depth.gt(0) || tmp.prestigeChal[9].depth.gt(0))) {
        return false;
    }
    if (i >= 3 && i <= 8) {
        if (hasPrestigeUpgrade(17)) {
            return true;
        }
    }
    if (i >= 0 && i <= 14) {
        if (tmp.anticap.energyEffs[2].gt(0)) {
            return true;
        }
    }

    return Decimal.gt(player.prestigeUpgrades[i], 0);
}

function prestigeUpgradeCostScaling(amt, inverse) {
    if (Decimal.eq(amt, 0)) {
        return new Decimal(1);
    }
    let costScaling = new Decimal(2);
    if (player.transcendUpgrades.includes('prest5')) {
        costScaling = new Decimal(1.9);
    }

    // i have to accomodate the scaling somehow, using the normal scaling screws it up so i have to put an edge case for mults < 10
    return inverse
        ? Decimal.lt(amt, 10)
            ? Decimal.log10(amt)
            : Decimal.log10(amt).log(costScaling).add(1)
        : Decimal.lt(amt, 1)
            ? Decimal.pow10(amt)
            : Decimal.sub(amt, 1).pow_base(costScaling).pow10();
}

function doPrestigeReset(doAnyway = false) {
    if (!doAnyway && player.prestigeChallenge === null) {
        if (tmp.prestigePointGain.lte(0) && !hasSetbackUpgrade(`b1`)) {
            return;
        }

        if (hasSetbackUpgrade(`b6`)) {
            player.prestigeFluid = Decimal.add(player.prestigeFluid, tmp.pfGain);
        }
        if (hasSetbackUpgrade(`b1`)) {
            player.prestigeEssence = Decimal.add(player.prestigeEssence, tmp.peGain);
        }
        player.prestige = Decimal.add(player.prestige, tmp.prestigePointGain);
        player.prestigeCount = Decimal.add(player.prestigeCount, 1);
        player.prestigeCountInTrans = Decimal.add(player.prestigeCountInTrans, 1);

        player.darts = Decimal.add(player.darts, tmp.hinderances[0].effects.dartGain);
    }

    player.timeInPrestige = D(0);
    player.timeSinceBuyableBought = D(0);
    player.points = D(0);
    player.bestPointsInPrestige = D(0);
    for (let i = 0; i < player.buyables.length; i++) {
        player.buyables[i] = D(0);
        player.buyablePoints[i] = D(0);
        player.buyableAutobought[i] = D(0);
    }
    tmp.pointGen = D(0);
    tmp.buyables = resetMainBuyables();
}

function respecPrestigeUpgrades() {
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        player.prestigeUpgrades[i] = D(0);
    }
    doPrestigeReset(true);
}