"use strict";
function initHTML_main() {
    toHTMLvar('mainTab')
    toHTMLvar('mainTabButton')
    toHTMLvar('upgradeScalingInterval')
    toHTMLvar('upgradeScalingBoost')
    toHTMLvar('upgradeScalingSpeed')
    toHTMLvar('upgradeScalingPC1')
    toHTMLvar('upgradePC1Desc')
    toHTMLvar('upgradeInSetback')
    toHTMLvar('prestigeChallengeEffs')
    toHTMLvar('hinderanceEffs')
    toHTMLvar('upgradeList')
    toHTMLvar('mainMainTabButton')
    toHTMLvar('mainMain')

    html['mainTab'].setDisplay(false)

    let txt = ``
    for (let i = 0; i < player.buyables.length; i++) {
        txt += `
            <div id="upgrade${i}all" style="width: 175px; margin: 2px">
                <button onclick="toggleUpgradeAutobuy(${i})" id="upgrade${i}auto" class="whiteText font" style="height: 20px; width: 175px; font-size: 10px; margin: 2px">
                    Autobuyer: <span id="upgrade${i}autoStatus"></span>
                </button>
                <button onclick="buyBuyable(${i})" id="upgrade${i}" class="whiteText font" style="height: 70px; width: 175px; font-size: 10px; margin: 2px">
                    Buyable ${i+1} ×<span id="upgrade${i}amount"></span><br>
                    <br>
                    Effect: <span id="upgrade${i}eff"></span><br>
                    Cost: <span id="upgrade${i}cost"></span> points
                </button>
                <div id="upgrade${i}generators" style="height: 10px; width: 175px; position: relative; margin: 2px">
                    <div id="upgrade${i}generatorProgressBarBase" style="background-color: #008020; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                    <div id="upgrade${i}generatorProgressBar" style="background-color: #00FF40; position: absolute; top: 0; left: 0; height: 100%"></div>
                </div>
                <span id="upgrade${i}generatorProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
                <div id="upgrade${i}generatorTiers" style="height: 10px; width: 175px; position: relative; margin: 2px">
                    <div id="upgrade${i}generatorTierProgressBarBase" style="background-color: #805000; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                    <div id="upgrade${i}generatorTierProgressBar" style="background-color: #FFA000; position: absolute; top: 0; left: 0; height: 100%"></div>
                </div>
                <span id="upgrade${i}generatorTierProgressNumber" class="whiteText font" style="font-size: 10px; text-align: center"></span>
            </div>
        `
    }
    html['upgradeList'].setHTML(txt)
    for (let i = 0; i < player.buyables.length; i++) {
        toHTMLvar(`upgrade${i}all`)
        toHTMLvar(`upgrade${i}`)
        toHTMLvar(`upgrade${i}auto`)
        toHTMLvar(`upgrade${i}autoStatus`)
        toHTMLvar(`upgrade${i}amount`)
        toHTMLvar(`upgrade${i}eff`)
        toHTMLvar(`upgrade${i}cost`)
        toHTMLvar(`upgrade${i}generators`)
        toHTMLvar(`upgrade${i}generatorProgressBarBase`)
        toHTMLvar(`upgrade${i}generatorProgressBar`)
        toHTMLvar(`upgrade${i}generatorProgressNumber`)
        toHTMLvar(`upgrade${i}generatorTiers`)
        toHTMLvar(`upgrade${i}generatorTierProgressBarBase`)
        toHTMLvar(`upgrade${i}generatorTierProgressBar`)
        toHTMLvar(`upgrade${i}generatorTierProgressNumber`)
    }
}

function updateGame_main() {
    player.timeSinceBuyableBought = Decimal.add(player.timeSinceBuyableBought, Decimal.mul(delta, tmp.timeSpeedTiers[0]))

    tmp.bybBoostInterval = D(100)
    tmp.bybBoostEffect = D(2)
    tmp.bybBoostCost = D(2)

    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(6)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(7)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(8)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }
    if (player.prestigeChallengeCompleted.includes(9)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(2)
    }

    if (player.setbackUpgrades.includes(`g7`)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(SETBACK_UPGRADES[1][6].eff)
    }

    if (player.prestigeChallenge === 3) {
        tmp.bybBoostInterval = tmp.bybBoostInterval.div(2)
        tmp.bybBoostEffect = D(1)
    }

    if (player.prestigeChallenge === 1 || player.prestigeChallenge === 4) {
        tmp.bybBoostInterval = D(5)
        tmp.bybBoostEffect = D(1)
    }

    // cheat
    // tmp.bybBoostEffect = tmp.bybBoostEffect.add(player.timeInPrestige)
    // tmp.bybBoostCost = tmp.bybBoostCost.root(player.timeInPrestige.add(1))
    // end cheat

    tmp.generatorFactors = []
    tmp.pointGen = D(1)
    tmp.pointFactors = []
    tmp.pointFactors.push(`Base: ${format(1)}`)
    for (let i = player.buyables.length - 1; i >= 0; i--) {
        if (buyableEnabled(i)) {
            tmp.buyables[i].costSpeed = D(1)
            if (i >= 0 && i <= 3) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(Decimal.sub(1, ASCENSION_UPGRADES[i + 8].eff))
            }
            if (player.inSetback) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(tmp.setbackEffects[1])
            }
            if (player.setbackUpgrades.includes(`g9`)) {
                tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(0.75)
            }
            tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.mul(tmp.energyEffs[1])
            tmp.buyables[i].costSpeed = tmp.buyables[i].costSpeed.div(tmp.buyables[i].tierEffect)

            let pow = Decimal.pow(2 + i, 0.1)
            let baseCost
            if (player.setbackUpgrades.includes(`g9`)) {
                baseCost = D(1)
            } else {
                baseCost = [D(2), D(20), D(500), D(10000), D(1e6), D(1e9)][i]
            }

            tmp.buyables[i].target = D(player.points)
            if (player.setbackUpgrades.includes(`g8`)) {
                tmp.buyables[i].target = tmp.buyables[i].target.mul(tmp.buyables[i].genLevels.sub(1).pow10())
            }

            tmp.buyables[i].target = tmp.buyables[i].target.div(baseCost).max(1).mul(pow.sub(1)).add(1).log(pow).sub(1)
            tmp.buyables[i].target = tmp.buyables[i].target.div(tmp.buyables[i].costSpeed)
            let h = tmp.buyables[i].target.mul(tmp.bybBoostCost.sub(1)).div(tmp.bybBoostInterval).add(1).log(tmp.bybBoostCost).floor()
            tmp.buyables[i].target = tmp.buyables[i].target.add(tmp.bybBoostInterval.div(tmp.bybBoostCost.sub(1))).div(tmp.bybBoostCost.pow(h)).add(h.sub(tmp.bybBoostCost.sub(1).recip()).mul(tmp.bybBoostInterval))
            checkNaN(tmp.buyables[i].target, `NaN detected while attempting to calculate target of Buyable #${i + 1}`)

            // auto-upgrade
            if (player.buyableAuto[i]) {
                player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], buyableAutoEnabledAndSpeed(i).speed.mul(delta)).min(tmp.buyables[i].target).max(player.buyableAutobought[i])
                let bought = player.buyables[i]
                player.buyables[i] = player.buyableAutobought[i].add(0.99999999).floor().max(player.buyables[i])
                bought = Decimal.sub(bought, player.buyables[i])
                if (bought.lt(0)) {
                    // why only the first buy? the earlier purchases get increasingly negligible
                    // ee15 as a limit because at some point, cost may equal points and do some weird crap
                    player.timeSinceBuyableBought = D(0)
                    if (Decimal.lt(player.points, 'ee15')) {
                        player.points = Decimal.sub(player.points, tmp.buyables[i].cost).max(0)
                    }
                }
            }

            tmp.buyables[i].cost = D(player.buyables[i])
            let x = tmp.buyables[i].cost.div(tmp.bybBoostInterval).floor()
            let m = tmp.buyables[i].cost.sub(x.mul(tmp.bybBoostInterval))
            tmp.buyables[i].cost = m.mul(tmp.bybBoostCost.pow(x)).add(tmp.bybBoostCost.pow(x).sub(1).div(tmp.bybBoostCost.sub(1)).mul(tmp.bybBoostInterval))
            tmp.buyables[i].cost = tmp.buyables[i].cost.mul(tmp.buyables[i].costSpeed)
            tmp.buyables[i].cost = Decimal.add(tmp.buyables[i].cost, 1).pow_base(pow).sub(1).div(pow.sub(1)).mul(baseCost)

            // an exception to the "mul always first then pow" cuz i want to make the effect clear
            if (player.setbackUpgrades.includes(`g8`)) {
                tmp.buyables[i].cost = tmp.buyables[i].cost.div(tmp.buyables[i].genLevels.sub(1).pow10())
            }
            checkNaN(tmp.buyables[i].cost, `NaN detected while attempting to calculate cost of Buyable #${i + 1}`)

            tmp.buyables[i].effective = D(player.buyables[i])
            if (player.prestigeChallengeCompleted.includes(2)) {
                tmp.buyables[i].effective = tmp.buyables[i].effective.mul(1.5)
            }
            if (!(player.prestigeChallenge === 2 || player.prestigeChallenge === 4 || player.currentHinderance === 2)) {
                if (hasPrestigeUpgrade(3)) {
                    for (let j = i + 1; j < player.buyables.length; j++) {
                        tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[j].effective.mul(tmp.prestigeUpgEffs[3]))
                    }
                } else {
                    if (i !== player.buyables.length - 1) {
                        tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[i + 1].effective)
                    }
                }
            }

            let upgGen = D(0)
            if (Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1)) {
                upgGen = Decimal.div(player.buyables[i], 1000).add(1).pow(player.generatorFeatures.enhancerBuyables[2]).sub(1)
            }
            player.buyableTierPoints[i] = Decimal.add(player.buyableTierPoints[i], upgGen.mul(delta).mul(tmp.timeSpeedTiers[0]))
            upgGen = D(0)
            if (player.prestigeChallengeCompleted.includes(0) || player.prestigeChallenge === 10) {
                upgGen = D(player.buyables[i])
                upgGen = upgGen.mul(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostEffect))
                if (i === 0) {
                    tmp.generatorFactors.push(`Base: ${format(player.buyables[i])}*${format(tmp.bybBoostEffect, 2)}<sup>⌊${format(player.buyables[i])}/${format(tmp.bybBoostInterval)}⌋</sup> → ${format(upgGen)}`)
                }
                if (player.prestigeChallenge !== 10) {
                    if (Decimal.gt(player.ascendUpgrades[1], 0)) {
                        upgGen = upgGen.mul(ASCENSION_UPGRADES[1].eff)
                        if (i === 0) {
                            tmp.generatorFactors.push(`Ascension Upgrade 2: ×${format(ASCENSION_UPGRADES[1].eff, 2)} → ${format(upgGen)}`)
                        }
                    }
                    if (player.prestigeChallengeCompleted.includes(12)) {
                        upgGen = upgGen.mul(tmp.buyables[i].effect)
                        if (i === 0) {
                            tmp.generatorFactors.push(`PC12: ×${format(tmp.buyables[i].effect, 2)} → ${format(upgGen)}`)
                        }
                    }
                    if (Decimal.gt(player.generatorFeatures.enhancerBuyables[1], 0)) {
                        upgGen = upgGen.mul(tmp.generatorFeatures.genEnhBuyables[1].eff)
                        if (i === 0) {
                            tmp.generatorFactors.push(`Gen. Enh. Buyable 2: ×${format(tmp.generatorFeatures.genEnhBuyables[1].eff, 2)} → ${format(upgGen)}`)
                        }
                    }
                    if (hasPrestigeUpgrade(10)) {
                        upgGen = upgGen.pow(tmp.prestigeUpgEffs[10]);
                        if (i === 0) {
                            tmp.generatorFactors.push(`Prestige Upgrade 10: ^${format(tmp.prestigeUpgEffs[10], 3)} → ${format(upgGen)}`)
                        }
                    }
                    if (hasPrestigeUpgrade(11)) {
                        upgGen = upgGen.pow(tmp.prestigeUpgEffs[11]);
                        if (i === 0) {
                            tmp.generatorFactors.push(`Prestige Upgrade 11: ^${format(tmp.prestigeUpgEffs[11], 3)} → ${format(upgGen)}`)
                        }
                    }
                    if (Decimal.gt(player.generatorFeatures.xp, 0)) {
                        upgGen = upgGen.pow(tmp.generatorFeatures.xpEffGenerators)
                        if (i === 0) {
                            tmp.generatorFactors.push(`Generator XP Effect: ^${format(tmp.generatorFeatures.xpEffGenerators, 3)} → ${format(upgGen)}`)
                        }
                    }
                    if (player.prestigeChallenge === 11) {
                        upgGen = upgGen.pow(tmp.pc11Eff)
                        if (i === 0) {
                            tmp.generatorFactors.push(`PC11: ^${format(tmp.pc11Eff, 3)} → ${format(upgGen)}`)
                        }
                    }
                    if (player.prestigeChallengeCompleted.includes(11)) {
                        upgGen = upgGen.pow(1.2)
                        if (i === 0) {
                            tmp.generatorFactors.push(`PC11 Reward: ^1.200 → ${format(upgGen)}`)
                        }
                    }
                    if (Decimal.gte(player.hinderanceScore[0], HINDERANCES[0].start)) {
                        upgGen = upgGen.pow(Decimal.pow(1.02, Decimal.max(player.prestigeEssence, 1).log10().floor()))
                        if (i === 0) {
                            tmp.generatorFactors.push(`H1 Reward: ^1.02<sup>⌊log<sub>10</sub>(${format(player.prestigeEssence)})⌋</sup> → ^${format(Decimal.pow(1.02, Decimal.max(player.prestigeEssence, 1).log10().floor()), 3)} → ${format(upgGen)}`)
                        }
                    }
                    if (player.prestigeChallenge === 12) {
                        upgGen = upgGen.add(1).log10()
                        if (i === 0) {
                            tmp.generatorFactors.push(`PC12: log<sub>10</sub>(${format(upgGen.pow10().sub(1))}) → ${format(upgGen)}`)
                        }
                        upgGen = upgGen.mul(tmp.buyables[i].effect)
                        if (i === 0) {
                            tmp.generatorFactors.push(`PC12: ×${format(tmp.buyables[i].effect, 2)} → ${format(upgGen)}`)
                        }
                    }

                    if (player.cheats.dilate) {
                        upgGen = cheatDilateBoost(upgGen) 
                        tmp.generatorFactors.push(`Cheats: ... → ${format(upgGen)}`)
                    }
                    upgGen = upgGen.mul(tmp.timeSpeedTiers[0])
                    if (tmp.timeSpeedTiers[0].neq(1)) {
                        tmp.generatorFactors.push(`Tier 1 Time Speed: ×${format(tmp.timeSpeedTiers[0], 2)} → ${format(upgGen)}`)
                    }

                    if (i === 0) {
                        tmp.generatorSpeed = upgGen
                    }
                }
            }
            if (player.currentHinderance === 1) {
                player.buyablePoints[i] = Decimal.max(player.buyablePoints[i], 0).add(1).log10().add(1).root(0.9).sub(1).pow10().sub(1).add(upgGen.mul(delta)).add(1).log10().add(1).pow(0.9).sub(1).pow10().sub(1)
            } else {
                player.buyablePoints[i] = Decimal.add(player.buyablePoints[i], upgGen.mul(delta))
            }
            // if (player.prestigeChallenge === 12 && Decimal.add(player.buyablePoints[i], upgGen).gte(1e9)) {
            //     player.buyablePoints[i] = player.buyablePoints[i].max(1e9).log(1e9).pow(2).sub(1).exp().pow_base(1e9).add(upgGen.mul(delta).mul(tmp.timeSpeedTiers[0])).log(1e9).ln().add(1).root(2).pow_base(1e9)
            // } else {
            //     if (player.currentHinderance === 1) {
            //         player.buyablePoints[i] = Decimal.max(player.buyablePoints[i], 0).add(1).log10().add(1).root(0.9).sub(1).pow10().sub(1).add(upgGen.mul(delta)).add(1).log10().add(1).pow(0.9).sub(1).pow10().sub(1)
            //     } else {
            //         player.buyablePoints[i] = Decimal.add(player.buyablePoints[i], upgGen.mul(delta))
            //     }
            // }

            tmp.buyables[i].tierLevels = tierPointFunc(Decimal.max(player.buyableTierPoints[i], 1), true).max(1).floor()
            tmp.buyables[i].tierEffect = tmp.buyables[i].tierLevels.pow_base(1.01)
            
            tmp.buyables[i].genLevels = genPointFunc(Decimal.max(player.buyablePoints[i], 1), true).max(1).floor()

            if (player.prestigeChallenge === 12) {
                tmp.buyables[i].genEffect = tmp.buyables[i].genLevels.sub(1).pow_base(Decimal.div(1, hasPrestigeUpgrade(12) ? tmp.prestigeUpgEffs[12] : 10).add(1))
            } else {
                tmp.buyables[i].genEffect = tmp.buyables[i].genLevels.sub(1).div(hasPrestigeUpgrade(12) ? tmp.prestigeUpgEffs[12] : 10).add(1)
            }

            if (player.prestigeChallenge === 10) {
                tmp.buyables[i].genEffect = Decimal.sub(2, tmp.buyables[i].genEffect).max(0)
            }

            tmp.buyables[i].effectBase = [D(1.0), D(0.5), D(0.25), D(0.1), D(0.05), D(0.01)][i]
            if ((player.prestigeChallenge === 3 || player.prestigeChallenge === 4 || player.currentHinderance === 2) && i < player.buyables.length - 1) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.add(tmp.buyables[i+1].effect)
            }

            if (hasPrestigeUpgrade(5)) {
                if (i === 3) {
                    tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.add(tmp.prestigeUpgEffs[5])
                }
            }

            if (hasPrestigeUpgrade(8)) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.mul(tmp.prestigeUpgEffs[8]);
            }

            if (player.prestigeChallenge === 0 || player.prestigeChallenge === 4) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.div(2)
            }
            if (player.currentHinderance === 2) {
                tmp.buyables[i].effectBase = tmp.buyables[i].effectBase.div(8)
            }
            tmp.buyables[i].effect = tmp.buyables[i].effective.mul(tmp.buyables[i].effectBase).add(1)
            if (player.prestigeChallenge !== 12) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.mul(tmp.buyables[i].genEffect)
            }

            if ((player.prestigeChallenge === 3 || player.prestigeChallenge === 4 || player.currentHinderance === 2) && i !== 0) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.sub(1)
            }

            tmp.buyables[i].effect = tmp.buyables[i].effect.mul(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostEffect))
            if (Decimal.lt(i, player.ascendUpgrades[2])) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.pow(ASCENSION_UPGRADES[2].eff)
            }
            if (player.prestigeChallenge === 12) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.pow(0.1)
            }
            if (player.currentHinderance === 0 && Decimal.sqrt(player.buyables[i]).neq(Decimal.sqrt(player.buyables[i]).round())) {
                tmp.buyables[i].effect = D(1)
            }

            if ((!(player.prestigeChallenge === 3 || player.prestigeChallenge === 4 || player.currentHinderance === 2) || i === 0) && player.prestigeChallenge !== 12) {
                tmp.pointGen = tmp.pointGen.mul(tmp.buyables[i].effect)
                tmp.pointFactors.push(`Buyable ${i+1}: ×${format(tmp.buyables[i].effect, 2)} → ${format(tmp.pointGen)}`)
            }
            if (player.prestigeChallenge === 12) {
                tmp.pointGen = tmp.pointGen.mul(tmp.buyables[i].genEffect)
                tmp.pointFactors.push(`Buyable ${i+1}: ×${format(tmp.buyables[i].genEffect, 2)} → ${format(tmp.pointGen)}`)
            }
        }
    }
    if (hasPrestigeUpgrade(0)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[0]);
        tmp.pointFactors.push(`Prestige Upgrade 1: ×${format(tmp.prestigeUpgEffs[0], 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(1)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[1]);
        tmp.pointFactors.push(`Prestige Upgrade 2: ×${format(tmp.prestigeUpgEffs[1], 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(2) || player.setbackUpgrades.includes('b4')) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[2]);
        tmp.pointFactors.push(`Prestige Upgrade 3: ×${format(tmp.prestigeUpgEffs[2], 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(4)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[4]);
        tmp.pointFactors.push(`Prestige Upgrade 5: ×${format(tmp.prestigeUpgEffs[4], 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(6)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[6]);
        tmp.pointFactors.push(`Prestige Upgrade 7: ×${format(tmp.prestigeUpgEffs[6], 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(7)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigeUpgEffs[7]);
        tmp.pointFactors.push(`Prestige Upgrade 8: ×${format(tmp.prestigeUpgEffs[7], 2)} → ${format(tmp.pointGen)}`)
    }
    if (player.prestigeChallengeCompleted.includes(3) || player.setbackUpgrades.includes('b4')) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigePointEffect)
        tmp.pointFactors.push(`PC3 Reward: ×${format(tmp.prestigePointEffect, 2)} → ${format(tmp.pointGen)}`)
    }
    if (Decimal.gt(player.ascendUpgrades[0], 9)) {
        tmp.pointGen = tmp.pointGen.mul(ASCENSION_UPGRADES[0].eff)
        tmp.pointFactors.push(`Ascension Upgrade 1: ×${format(ASCENSION_UPGRADES[0].eff, 2)} → ${format(tmp.pointGen)}`)
    }
    if (Decimal.gt(player.setbackEnergy[0], 0)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.energyEffs[0])
        tmp.pointFactors.push(`Red Energy: ×${format(tmp.energyEffs[0], 2)} → ${format(tmp.pointGen)}`)
    }

    for (let i = 0; i < 5; i++) {
        if (player.setbackUpgrades.includes(`r${i+1}`)) {
            tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[0][i].eff)
            tmp.pointFactors.push(`Red S. Upgrade ${i+1}: ×${format(SETBACK_UPGRADES[0][i].eff, 2)} → ${format(tmp.pointGen)}`)
        }
        if (player.setbackUpgrades.includes(`g${i+1}`)) {
            tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[1][i].eff)
            tmp.pointFactors.push(`Green S. Upgrade ${i+1}: ×${format(SETBACK_UPGRADES[1][i].eff, 2)} → ${format(tmp.pointGen)}`)
        }
    }

    if (player.setbackUpgrades.includes(`r7`)) {
        tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[0][6].eff)
        tmp.pointFactors.push(`Red S. Upgrade 7: ×${format(SETBACK_UPGRADES[0][6].eff, 2)} → ${format(tmp.pointGen)}`)
    }
    if (player.setbackUpgrades.includes(`r8`)) {
        tmp.pointGen = tmp.pointGen.mul(SETBACK_UPGRADES[0][7].eff)
        tmp.pointFactors.push(`Red S. Upgrade 8: ×${format(SETBACK_UPGRADES[0][7].eff, 2)} → ${format(tmp.pointGen)}`)
    }
    if (Decimal.gt(player.prestigeEssence, 0)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.peEffect)
        tmp.pointFactors.push(`Prestige Essence: ×${format(tmp.peEffect, 2)} → ${format(tmp.pointGen)}`)
    }
    if (Decimal.gt(player.generatorFeatures.buyable[1], 0)) {
        tmp.pointGen = tmp.pointGen.mul(GEN_XP_BUYABLES[1].eff)
        tmp.pointFactors.push(`Generator XP Buyable 1: ×${format(GEN_XP_BUYABLES[1].eff, 2)} → ${format(tmp.pointGen)}`)
    }
    if (Decimal.gte(player.hinderanceScore[2], HINDERANCES[2].start)) {
        tmp.pointGen = tmp.pointGen.mul(HINDERANCES[2].eff)
        tmp.pointFactors.push(`Hinderance 3 PB: ×${format(HINDERANCES[2].eff, 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(9)) {
        tmp.pointGen = tmp.pointGen.pow(tmp.prestigeUpgEffs[9]);
        tmp.pointFactors.push(`Prestige Upgrade 10: ^${format(tmp.prestigeUpgEffs[9], 2)} → ${format(tmp.pointGen)}`)
    }
    if (hasPrestigeUpgrade(11)) {
        tmp.pointGen = tmp.pointGen.pow(tmp.prestigeUpgEffs[11]);
        tmp.pointFactors.push(`Prestige Upgrade 12: ^${format(tmp.prestigeUpgEffs[11], 2)} → ${format(tmp.pointGen)}`)
    }
    if (player.inSetback) {
        tmp.pointGen = tmp.pointGen.pow(tmp.setbackEffects[0])
        tmp.pointFactors.push(`Setback Red Effect: ^${format(tmp.setbackEffects[0], 2)} → ${format(tmp.pointGen)}`)
    }
    if (Decimal.gt(player.generatorFeatures.xp, 0)) {
        tmp.pointGen = tmp.pointGen.pow(tmp.generatorFeatures.xpEffPoints)
        tmp.pointFactors.push(`Generator XP Sec. Eff.: ^${format(tmp.generatorFeatures.xpEffPoints, 2)} → ${format(tmp.pointGen)}`)
    }
    if (player.prestigeChallenge === 11) {
        tmp.pointGen = tmp.pointGen.pow(tmp.pc11Eff)
        tmp.pointFactors.push(`PC11: ^${format(tmp.pc11Eff, 3)} → ${format(tmp.pointGen)}`)
    }
    if (player.prestigeChallengeCompleted.includes(11)) {
        tmp.pointGen = tmp.pointGen.pow(1.025)
        tmp.pointFactors.push(`PC11 Reward: ^${format(1.025, 3)} → ${format(tmp.pointGen)}`)
    }
    if (player.currentHinderance === 0) {
        tmp.pointGen = tmp.pointGen.pow(tmp.dartEffect)
        tmp.pointFactors.push(`H1 Effect: ^${format(tmp.dartEffect, 3)} → ${format(tmp.pointGen)}`)
    }
    if (player.cheats.dilate) {
        tmp.pointGen = cheatDilateBoost(tmp.pointGen)
        tmp.pointFactors.push(`Cheats: ... → ${format(tmp.pointGen)}`)
    }
    tmp.pointGen = tmp.pointGen.mul(tmp.timeSpeedTiers[0])
    if (tmp.timeSpeedTiers[0].neq(1)) {
        tmp.pointFactors.push(`Tier 1 Time Speed: ×${format(tmp.timeSpeedTiers[0], 2)} → ${format(tmp.pointGen)}`)
    }

    let old = player.points
    let oldpps = tmp.pointGen
    if (player.currentHinderance === 1) {
        player.points = Decimal.max(player.points, 0).add(1).log10().add(1).root(0.9).sub(1).pow10().add(tmp.pointGen.mul(delta)).log10().add(1).pow(0.9).sub(1).pow10().sub(1)
        tmp.pointGen = Decimal.sub(player.points, old).div(delta)
        tmp.pointFactors.push(`H2: /${format(oldpps.div(tmp.pointGen))} → ${format(tmp.pointGen)}`)
    } else {
        player.points = Decimal.add(player.points, tmp.pointGen.mul(delta))
    }

    player.bestPointsInPrestige = Decimal.max(player.points, player.bestPointsInPrestige)
    if (player.prestigeChallenge === null) {
        player.bestPointsInAscend = Decimal.max(player.points, player.bestPointsInAscend)
    }
}

function updateHTML_main() {
    let txt = ``
    html['mainTab'].setDisplay(player.tab === 0)
    if (player.tab === 0) {
        html['mainMainTabButton'].setDisplay(player.setbackUpgrades.includes(`r10`))
        html['mainMain'].setDisplay(player.mainTab === 0)
    
        if (player.mainTab === 0) {
            txt = ``
            if (player.prestigeChallenge === 11) {
                txt = `PC11 Effect: ^${format(tmp.pc11Eff, 6)}, (${format(player.timeSinceBuyableBought, 3)}s / 0.010s)`
            }
            html['prestigeChallengeEffs'].setHTML(txt)
            txt = ``
            if (player.currentHinderance === 0) {
                txt = `Precision Prestige Effect: ${format(player.darts)} darts (+${format(tmp.dartGain)}), ^${format(tmp.dartEffect, 3)}`
            }
            html['hinderanceEffs'].setHTML(txt)
    
            html['upgradeScalingInterval'].setTxt(format(tmp.bybBoostInterval))
            html['upgradeScalingSpeed'].setTxt(format(tmp.bybBoostCost, 2))
            html['upgradeScalingBoost'].setTxt(format(tmp.bybBoostEffect, 2))
            html['upgradeScalingPC1'].setTxt(player.prestigeChallengeCompleted.includes(0) ? ' and generation' : '')
            html['upgradeInSetback'].setTxt(player.inSetback ? `Ascend to complete a setback or exit early in the Setback tab!` : '')
            html['upgradePC1Desc'].setDisplay(player.prestigeChallengeCompleted.includes(0))
            
            if (player.prestigeChallenge === null) {
                html['prestigeAmount'].setTxt(format(tmp.prestigeAmount))
                html['prestigeNext'].setTxt(format(tmp.prestigeNext))
    
                html['prestigeEssenceAmount'].setDisplay(player.setbackUpgrades.includes(`b1`))
                html['prestigeEssenceNext'].setDisplay(player.setbackUpgrades.includes(`b1`))
                if (player.setbackUpgrades.includes(`b1`)) {
                    html['prestigeEssenceAmount'].setTxt(` and ${format(tmp.peGain)} prestige essence`)
                    html['prestigeEssenceNext'].setTxt(`Next essence at ${format(tmp.peNext)} points.`)
                }

                html['prestige'].setDisplay(true)
                html['prestigeChallengeButton'].setDisplay(false)
            } else {
                html['prestigeChallengeName'].setTxt(PRESTIGE_CHALLENGES[player.prestigeChallenge].name)
                html['prestigeChallengeRequirement'].setTxt(format(PRESTIGE_CHALLENGES[player.prestigeChallenge].goal))
                html['prestigeChallengeButton'].changeStyle('cursor', Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? 'pointer' : 'not-allowed')

                html['prestige'].setDisplay(false)
                html['prestigeChallengeButton'].setDisplay(true)
            }

            html['ascendAmount'].setTxt(`${format(tmp.ascendAmount)}`)
            html['ascendNext'].setTxt(`${format(tmp.ascendNext)}`)

            html['ascend'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e18) || Decimal.gt(player.ascend, 0))

            for (let i = 0; i < player.buyables.length; i++) {
                if (buyableEnabled(i)) {
                    html[`upgrade${i}`].setDisplay(true)
                    html[`upgrade${i}all`].setDisplay(true)
                    html[`upgrade${i}generators`].setDisplay(player.prestigeChallengeCompleted.includes(0))
                    html[`upgrade${i}generatorProgressNumber`].setDisplay(player.prestigeChallengeCompleted.includes(0))
                    html[`upgrade${i}generatorTiers`].setDisplay(Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1))
                    html[`upgrade${i}generatorTierProgressNumber`].setDisplay(Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1))
                    
            
                    if (player.prestigeChallengeCompleted.includes(0)) {
                        if (tmp.buyables[i].genLevels.gte(20)) {
                            if (tmp.buyables[i].genLevels.gte(100000)) {
                                html[`upgrade${i}generatorProgressNumber`].setTxt(`Level ${format(tmp.buyables[i].genLevels)}`)
                            } else {
                                html[`upgrade${i}generatorProgressNumber`].setTxt(`${format(player.buyablePoints[i])}, Level ${format(tmp.buyables[i].genLevels)}`)
                            }
                            html[`upgrade${i}generatorProgressBar`].changeStyle('width', `${player.buyablePoints[i].div(genPointFunc(tmp.buyables[i].genLevels, false)).max(1).log(genPointFunc(tmp.buyables[i].genLevels.add(1), false).div(genPointFunc(tmp.buyables[i].genLevels, false))).min(1).mul(100).toNumber()}%`)
                        } else {
                            html[`upgrade${i}generatorProgressNumber`].setTxt(`${format(player.buyablePoints[i])}/${format(genPointFunc(tmp.buyables[i].genLevels.add(1), false))}, Level ${format(tmp.buyables[i].genLevels)}`)
                            html[`upgrade${i}generatorProgressBar`].changeStyle('width', `${player.buyablePoints[i].div(genPointFunc(tmp.buyables[i].genLevels.add(1), false)).min(1).mul(100).toNumber()}%`)
                        }
                    }
                    if (Decimal.gte(player.generatorFeatures.enhancerBuyables[2], 1)) {
                        if (tmp.buyables[i].tierLevels.gte(100000)) {
                            if (tmp.buyables[i].tierLevels.gte(100000)) {
                                html[`upgrade${i}generatorTierProgressNumber`].setTxt(`Tier ${format(tmp.buyables[i].tierLevels)}`)
                            } else {
                                html[`upgrade${i}generatorTierProgressNumber`].setTxt(`${format(player.buyableTierPoints[i])}, Tier ${format(tmp.buyables[i].tierLevels)}`)
                            }
                            html[`upgrade${i}generatorTierProgressBar`].changeStyle('width', `${player.buyableTierPoints[i].div(tierPointFunc(tmp.buyables[i].tierLevels, false)).max(1).log(tierPointFunc(tmp.buyables[i].tierLevels.add(1), false).div(tierPointFunc(tmp.buyables[i].tierLevels, false))).min(1).mul(100).toNumber()}%`)
                        } else {
                            html[`upgrade${i}generatorTierProgressNumber`].setTxt(`${format(player.buyableTierPoints[i].sub(tierPointFunc(tmp.buyables[i].tierLevels, false)), 2)}/${format(tierPointFunc(tmp.buyables[i].tierLevels.add(1), false).sub(tierPointFunc(tmp.buyables[i].tierLevels, false)), 2)}, Tier ${format(tmp.buyables[i].tierLevels)}`)
                            html[`upgrade${i}generatorTierProgressBar`].changeStyle('width', `${player.buyableTierPoints[i].sub(tierPointFunc(tmp.buyables[i].tierLevels, false)).div(tierPointFunc(tmp.buyables[i].tierLevels.add(1), false).sub(tierPointFunc(tmp.buyables[i].tierLevels, false))).min(1).mul(100).toNumber()}%`)
                        }
                    }
            
                    html[`upgrade${i}amount`].setTxt(`${format(player.buyables[i])}${player.currentHinderance === 0 ? (Decimal.sqrt(player.buyables[i]).eq(Decimal.sqrt(player.buyables[i]).round()) ? '=' : '≠') + format(Decimal.sqrt(player.buyables[i]).ceil().pow(2)) : ''}${tmp.buyables[i].effective.eq(player.buyables[i]) ? '' : ' (' + format(tmp.buyables[i].effective) + ')'}`)
                    html[`upgrade${i}cost`].setTxt(`${format(tmp.buyables[i].cost)}`)
                    if (!(player.prestigeChallenge === 3 || player.prestigeChallenge === 4 || player.currentHinderance === 2) || i === 0) {
                        if (player.prestigeChallenge === 12) {
                            html[`upgrade${i}eff`].setTxt(`×${format(tmp.buyables[i].effect, 2)} generator speed`)
                        } else {
                            if (player.prestigeChallengeCompleted.includes(12)) {
                                html[`upgrade${i}eff`].setTxt(`×${format(tmp.buyables[i].effect, 2)} point and gen. speed`)
                            } else {
                                html[`upgrade${i}eff`].setTxt(`×${format(tmp.buyables[i].effect, 2)} point gain`)
                            }
                        }
                    } else {
                        html[`upgrade${i}eff`].setTxt(`+${format(tmp.buyables[i].effect, 2)} Buyable ${i} base`)
                    }
            
                    html[`upgrade${i}`].changeStyle('background-color', Decimal.gte(player.points, tmp.buyables[i].cost) ? '#00400080' : '#40000080')
                    html[`upgrade${i}`].changeStyle('border', `3px solid ${Decimal.gte(player.points, tmp.buyables[i].cost) ? '#00ff00' : '#ff0000'}`)
                    html[`upgrade${i}`].changeStyle('cursor', Decimal.gte(player.points, tmp.buyables[i].cost) ? 'pointer' : 'not-allowed')
    
                    html[`upgrade${i}auto`].setDisplay(buyableAutoEnabledAndSpeed(i).enabled)
                    if (buyableAutoEnabledAndSpeed(i).enabled) {
                        html[`upgrade${i}autoStatus`].setTxt(player.buyableAuto[i] ? 'On' : 'Off')
                        html[`upgrade${i}auto`].changeStyle('background-color', player.buyableAuto[i] ? '#00400080' : '#40000080')
                        html[`upgrade${i}auto`].changeStyle('border', `3px solid ${player.buyableAuto[i] ? '#00ff00' : '#ff0000'}`)
                    }
                } else {
                    html[`upgrade${i}`].setDisplay(false)
                    html[`upgrade${i}all`].setDisplay(false)
                }
            }
        }
    }
}

function toggleUpgradeAutobuy(i) {
    player.buyableAuto[i] = !player.buyableAuto[i]
}

function buyBuyable(i) {
    if (player.currentHinderance === 0) {
        let prev = player.buyables[i]
        player.buyables[i] = Decimal.add(player.buyables[i], 1).sqrt().ceil().pow(2).round()
        if (Decimal.lt(player.points, tmp.buyables[i].cost)) {
            player.buyables[i] = prev
            return;
        }
        player.timeSinceBuyableBought = D(0)
        player.points = Decimal.sub(player.points, tmp.buyables[i].cost)
        player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1).sqrt().ceil().pow(2).round()
    } else {
        if (Decimal.lt(player.points, tmp.buyables[i].cost)) {
            return;
        }
        player.timeSinceBuyableBought = D(0)
        player.points = Decimal.sub(player.points, tmp.buyables[i].cost)
        player.buyables[i] = Decimal.add(player.buyables[i], 1)
        player.buyableAutobought[i] = Decimal.add(player.buyableAutobought[i], 1)
    }
    updateGame_main()
}

function genPointFunc(xp, inv) {
    let eff
    if (inv) {
        if (player.prestigeChallenge === 12) {
            eff = Decimal.max(xp, 0).div(100).mul(0.05).add(1).log(1.05)
        } else {
            eff = inverseFact(xp).div(1e6).add(1).ln().mul(1e6)
        }
        if (player.inSetback) {
            eff = eff.div(tmp.setbackEffects[1])
        }
    } else {
        eff = xp
        if (player.inSetback) {
            eff = eff.mul(tmp.setbackEffects[1])
        }
        if (player.prestigeChallenge === 12) {
            eff = Decimal.pow(1.05, eff).sub(1).div(0.05).mul(100)
        } else {
            eff = Decimal.div(eff, 1e6).exp().sub(1).mul(1e6).factorial()
        }
    }
    return eff
}

function tierPointFunc(xp, inv) {
    return inv
        ? Decimal.add(xp, 1).mul(0.01).add(1).log(1.01)
        : Decimal.pow(1.01, xp).sub(1).div(0.01).sub(1)
}

function buyableEnabled(id) {
    if (player.prestigeChallenge >= 5 && player.prestigeChallenge <= 9) {
        if (id <= player.prestigeChallenge - 5) {
            return false
        }
    }
    if (player.currentHinderance === 2) {
        if (id <= 2) {
            return false
        }
    }
    if (id === 4 && !player.prestigeChallengeCompleted.includes(1)) {
        return false
    }
    if (id === 5 && !player.setbackUpgrades.includes(`g10`)) {
        return false
    }
    return true
}

function buyableAutoEnabledAndSpeed(id) {
    let auto = false
    let spd = D(0)
    if (id >= 0 && id <= 3) {
        auto = Decimal.gt(player.ascendUpgrades[id + 4], 0)
    }
    if (id === 4 && player.setbackUpgrades.includes(`g10`)) {
        auto = true
    }
    if (id === 5 && Decimal.gt(player.ascendUpgrades[15], 0)) {
        auto = true
    }

    auto ||= player.cheats.autobuyUnlock
    if (!auto) {
        return { enabled: false, speed: D(0) }
    }

    if (id < 4) {
        spd = ASCENSION_UPGRADES[id + 4].eff
    }

    if (id === 4) {
        spd = D(10)
        spd = spd.mul(ASCENSION_UPGRADES[14].eff)
    }

    if (id === 5) {
        spd = ASCENSION_UPGRADES[15].eff
    }

    spd = spd.mul(tmp.timeSpeedTiers[0])

    if (player.cheats.autobuyBulk) {
        spd = D(Infinity)
    }
    return { enabled: true, speed: spd }
}