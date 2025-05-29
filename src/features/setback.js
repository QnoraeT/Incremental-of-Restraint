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
                        return `Points are multiplied by +0.01% for each Buyable ${i+1} (${format(tmp.buyables[i].effective)}). Currently: ×${format(this.eff, 2)} (Caps at ×${format(1e3)})`
                    },
                    get eff() {
                        return tmp.buyables[i].effective.pow_base(1.0001).min(1e3)
                    }
                },)
            }
            return arr
        })(),
        {
            id: "r6",
            cost: D(1e21),
            get desc() {
                return `Ascension Points boost all Red Dimensions' mult. Currently: ×${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.ascend, 1).root(8)
            }
        },
        {
            id: "r7",
            cost: D(1e26),
            get desc() {
                return `Ascension Gems give a sparse but powerful boost to points. Next at ${format(Decimal.max(player.ascendGems, 1e4).log10().log2().sub(2).floor().add(3).pow_base(2).pow10())} AGs, Currently: ×${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.ascendGems, 1e4).log10().log2().sub(2).floor().pow10()
            }
        },
        {
            id: "r8",
            cost: D(1e32),
            get desc() {
                return `Point gain slowly increases over time, capping at ×100.00. Currently: ×${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.timeInPrestige, 0).mul(0.1).add(1).min(100)
            }
        },
        {
            id: "r9",
            cost: D(1e38),
            get desc() {
                return `Ascension's requirement is decreased by /${format(100)}. (This boosts Ascension Point gain!)`
            },
            get eff() {
                return D(100)
            }
        },
        {
            id: "r10",
            cost: D(1e45),
            get desc() {
                return `Unlock generator experience in the Main tab.`
            },
        },
    ],
    [
        ...(() => {
            let arr = []
            for (let i = 0; i < 5; i++) {
                arr.push(        {
                    id: `g${i+1}`,
                    cost: D(1e6 * 1000 ** i),
                    get desc() {
                        let total = D(0)
                        for (let j = 0; j < player.buyables.length; j++) {
                            if (i === j) {
                                continue;
                            }
                            total = total.add(player.buyables[j])
                        }
                        return `Total bought buyables excluding Buyable ${i+1} (${format(total)}) multiply point gain. Currently: ×${format(this.eff, 2)} (Caps at ×${format(1e3)})`
                    },
                    get eff() {
                        let total = D(0)
                        for (let j = 0; j < player.buyables.length; j++) {
                            if (i === j) {
                                continue;
                            }
                            total = total.add(player.buyables[j])
                        }
                        return total.pow_base(1.00025).min(1e3)
                    }
                },)
            }
            return arr
        })(),
        {
            id: "g6",
            cost: D(1e21),
            get desc() {
                return `Buyable Generators also boost Green Dims.' respective mult. (Ex. Buyable Gen. 1 boosts Green Dim. 1, etc.)`
            },
        },
        {
            id: "g7",
            cost: D(1e26),
            get desc() {
                return `Every 1,000 total buyables bought, buyable boost per interval increases by +0.10×. Currently: +${format(this.eff, 2)}×`
            },
            get eff() {
                let total = D(0)
                for (let j = 0; j < player.buyables.length; j++) {
                    total = total.add(player.buyables[j])
                }
                return total.div(1000).floor().mul(0.1)
            }
        },
        {
            id: "g8",
            cost: D(1e32),
            get desc() {
                return `Every level of each generator divides the cost of that buyable by /10.`
            },
            get eff() {
                return D(10)
            }
        },
        {
            id: "g9",
            cost: D(1e38),
            get desc() {
                return `All buyables' base costs are set to 1 and their cost scaling is -25% slower.`
            },
            get eff() {
                return D(0.75)
            }
        },
        {
            id: "g10",
            cost: D(1e45),
            get desc() {
                return `Unlock the autobuyer for Buyable 5 at 10/s and unlock Buyable 6.`
            },
        },
    ],
    [
        {
            id: "b1",
            cost: D(1e6),
            get desc() {
                return `Unlock Prestige Essence, You can now freely do a prestige reset even if you won't gain any prestige points.`
            }
        },
        {
            id: "b2",
            cost: D(1e12),
            get desc() {
                return `Prestige Upgrades are rebuyable but their costs scale very fast.`
            }
        },
        {
            id: "b3",
            cost: D(1e20),
            get desc() {
                return `Black Out is repeatable up to 5 completions.`
            }
        },
        {
            id: "b4",
            cost: D(1e30),
            get desc() {
                return `Prestige Upgrade 3 and Stacking Interest gain one free level, and Ascension Gems boost their effects. Currently: ^${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.ascendGems, 1).log10().div(100).add(1).ln().add(1)
            }
        },
        {
            id: "b5",
            cost: D(1e45),
            get desc() {
                return `Unlock Hinderances in the Ascend tab.`
            }
        },
    ]
]

function initHTML_setback() {
    toHTMLvar('setbackTab')
    toHTMLvar('setbackTabButton')
    html['setbackTab'].setDisplay(false)
    html['setbackTabButton'].setDisplay(false)

    toHTMLvar('setbackToggle')
    toHTMLvar('setSBTabButton')
    toHTMLvar('loadSBTabButton')
    toHTMLvar('dimSBTabButton')
    toHTMLvar('upgSBTabButton')
    toHTMLvar('setbackTabSettings')
    toHTMLvar('setbackTabLoadout')
    toHTMLvar('setbackTabDims')
    toHTMLvar('setbackTabUpgs')
    toHTMLvar('setbackLoadoutList')
    toHTMLvar('dimScalingInterval')
    toHTMLvar('dimScalingBoost')
    toHTMLvar('dimScalingSpeed')
    toHTMLvar('upgSBDesc')
    toHTMLvar('upgSBCost')

    html['setSBTabButton'].setDisplay(false)
    html['loadSBTabButton'].setDisplay(false)
    html['dimSBTabButton'].setDisplay(false)
    html['upgSBTabButton'].setDisplay(false)

    for (let i = 0; i < 3; i++) {
        let color = tmp.quarkNames[i]
        let capsColor = tmp.quarkNamesC[i]

        toHTMLvar(`${color}Quarks`)
        toHTMLvar(`${color}Energy`)
        toHTMLvar(`${color}EnergyAmt2`)
        toHTMLvar(`${color}QuarkEff`)
        toHTMLvar(`${color}EnergyEff`)

        toHTMLvar(`setback${capsColor}DimList`)
        toHTMLvar(`setback${capsColor}Value`)
        toHTMLvar(`setback${capsColor}Effect`)
        toHTMLvar(`setback${capsColor}Generate`)
        toHTMLvar(`setbackSlider${capsColor}`)

        toHTMLvar(`${color}SBUpgrades`)

        let txt = ``
        for (let j = 0; j < SETBACK_UPGRADES[i].length; j++) {
            txt += `
                <button onclick="selectSBUpg(${i}, ${j})" id="${color}SBUpg${j}" class="whiteText font" style="height: 40px; width: 40px; font-size: 16px; margin: 2px; cursor: pointer">
                    <span><b>${j+1}</b></span>
                </button>
            `
        }
        html[`${color}SBUpgrades`].setHTML(txt)

        for (let j = 0; j < SETBACK_UPGRADES[i].length; j++) {
            toHTMLvar(`${color}SBUpg${j}`)
        }

        txt = `
            <button onclick="buyMaxSBDim(${i})" id="${color}BuyMax" class="whiteText font" style="height: 45px; width: 250px; font-size: 9px; margin: 2px">
                Buy Max all ${capsColor} Dims.<br>
                You can buy ~<span id="${color}BMTotalEst"></span> dimensions currently.
            </button>
        `
        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            txt += `
                <button onclick="buySBDim(${i}, ${j})" id="${color}Dim${j}" class="whiteText font" style="height: 45px; width: 250px; font-size: 9px; margin: 2px">
                    ${capsColor} Dimension ${j + 1}: ×<span id="${color}Dim${j}amount"></span><br>
                    Mult: ×<span id="${color}Dim${j}mult"></span><br>
                    Cost: <span id="${color}Dim${j}cost"></span>
                </button>
            `
        }
        html[`setback${capsColor}DimList`].setHTML(txt)

        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            toHTMLvar(`${color}Dim${j}`)
            toHTMLvar(`${color}Dim${j}amount`)
            toHTMLvar(`${color}Dim${j}mult`)
            toHTMLvar(`${color}Dim${j}cost`)
        }
        toHTMLvar(`${color}BuyMax`)
        toHTMLvar(`${color}BMTotalEst`)
    }

    displaySetbackCompleted()
}

function updateGame_setback() {
    tmp.quarkEffs[0] = Decimal.max(player.setbackQuarks[0], 0)
    tmp.quarkEffs[1] = Decimal.max(player.setbackQuarks[1], 0)
    tmp.quarkEffs[2] = Decimal.max(player.setbackQuarks[2], 0)

    tmp.energyEffs[0] = Decimal.max(player.setbackEnergy[0], 0).add(1).log10().add(1).pow(Decimal.max(player.setbackEnergy[0], 10).log10().log10().floor().add(1))
    tmp.energyEffs[1] = Decimal.max(player.setbackEnergy[1], 0).add(1).log10().div(10).add(1).recip()
    tmp.energyEffs[2] = Decimal.max(player.setbackEnergy[2], 0).add(1).log10().pow(2).div(200).add(1)

    if (!player.inSetback) {
        player.setback = [D(html['setbackSliderRed'].el.value), D(html['setbackSliderGreen'].el.value), D(html['setbackSliderBlue'].el.value)]
    }

    tmp.setbackEffects[0] = Decimal.div(player.setback[0], 10).pow_base(0.2)
    tmp.setbackEffects[1] = Decimal.pow(player.setback[1], 2).pow_base(1.06214316).sub(1).div(0.06214316).mul(1.5).add(1)
    tmp.setbackEffects[2] = Decimal.div(player.setback[2], 10).pow_base(16)

    tmp.trueQuarkTotal = D(0)
    tmp.predictedQuarkTotal = D(0)
    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkGain[i] = player.currentSetback === null ? D(0) : player.setbackLoadout[player.currentSetback][i]
        tmp.predictedQuarkGain[i] = player.setback[i]

        tmp.trueQuarkTotal = tmp.trueQuarkTotal.add(tmp.trueQuarkGain[i])
        tmp.predictedQuarkTotal = tmp.predictedQuarkTotal.add(tmp.predictedQuarkGain[i])
    }

    tmp.trueQuarkTotal = tmp.trueQuarkTotal.pow(2);
    tmp.predictedQuarkTotal = tmp.predictedQuarkTotal.pow(2);

    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkGain[i] = Decimal.pow(tmp.trueQuarkGain[i], 2).mul(tmp.trueQuarkTotal)
        tmp.trueQuarkGain[i] = cheatDilateBoost(tmp.trueQuarkGain[i])
        tmp.trueQuarkGain[i] = tmp.trueQuarkGain[i].mul(tmp.timeSpeedTiers[0])

        tmp.predictedQuarkGain[i] = Decimal.pow(tmp.predictedQuarkGain[i], 2).mul(tmp.predictedQuarkTotal)
        tmp.predictedQuarkGain[i] = cheatDilateBoost(tmp.predictedQuarkGain[i])
        tmp.predictedQuarkGain[i] = tmp.predictedQuarkGain[i].mul(tmp.timeSpeedTiers[0])

        player.setbackQuarks[i] = Decimal.add(player.setbackQuarks[i], tmp.trueQuarkGain[i].mul(delta))
    }

    for (let i = 0; i < player.setback.length; i++) {
        tmp.quarkEffs[i] = cheatDilateBoost(tmp.quarkEffs[i])
        tmp.quarkEffs[i] = tmp.quarkEffs[i].mul(tmp.timeSpeedTiers[0])

        player.setbackEnergy[i] = Decimal.add(player.setbackEnergy[i], tmp.quarkEffs[i].mul(delta))
    }

    tmp.quarkBoostInterval = D(100)
    tmp.quarkBoostEffect = D(1)
    tmp.quarkBoostCost = D(2)

    tmp.trueQuarkTotal = D(0)
    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkTotal = tmp.trueQuarkTotal.add(player.currentSetback === null ? D(0) : player.setbackLoadout[player.currentSetback][i])
    }

    for (let i = 0; i < player.setback.length; i++) {
        tmp.dimBoughtBM[i] = D(0)
        for (let j = player.quarkDimsBought[i].length - 1; j >= 0; j--) {
            if (tmp.quarkDim[i][j] === undefined) {
                tmp.quarkDim[i][j] = {
                    mult: D(1),
                    cost: D(1),
                    target: D(0)
                }
            }

            tmp.quarkDim[i][j].target = Decimal.max(player.setbackEnergy[i], 1).log10()
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.sub(Decimal.pow(j + 1, 2)).div(j + 3)

            let h = tmp.quarkDim[i][j].target.mul(tmp.quarkBoostCost.sub(1)).div(tmp.quarkBoostInterval).add(1).log(tmp.quarkBoostCost).floor()
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.add(tmp.quarkBoostInterval.div(tmp.quarkBoostCost.sub(1))).div(tmp.quarkBoostCost.pow(h)).add(h.sub(tmp.quarkBoostCost.sub(1).recip()).mul(tmp.quarkBoostInterval))

            tmp.dimBoughtBM[i] = tmp.dimBoughtBM[i].add(tmp.quarkDim[i][j].target.sub(player.quarkDimsBought[i][j]).add(1).max(0).floor())

            checkNaN(tmp.quarkDim[i][j].target, `NaN detected while attempting to calculate target of ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`)

            if (setbackAutobuyerEnabledAndSpeed(i, j).enabled) {
                player.quarkDimsAutobought[i][j] = Decimal.add(player.quarkDimsAutobought[i][j], setbackAutobuyerEnabledAndSpeed(i, j).speed.mul(delta)).min(tmp.quarkDim[i][j].target).max(player.quarkDimsAutobought[i][j])
                let bought = player.quarkDimsBought[i][j]
                player.quarkDimsBought[i][j] = player.quarkDimsAutobought[i][j].add(0.99999999).floor().max(player.quarkDimsBought[i][j])
                bought = Decimal.sub(bought, player.quarkDimsBought[i][j])
                if (bought.lt(0)) {
                    // why only the first buy? the earlier purchases get increasingly negligible
                    // ee15 as a limit because at some point, cost may equal points and do some weird crap
                    if (Decimal.lt(player.setbackEnergy[i], 'ee15')) {
                        player.setbackEnergy[i] = Decimal.sub(player.setbackEnergy[i], tmp.quarkDim[i][j].cost).max(0)
                    }
                }
                checkNaN(player.quarkDimsBought[i][j], `NaN detected while attempting to autobuy ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`)
            }

            tmp.quarkDim[i][j].cost = D(player.quarkDimsBought[i][j])
            let x = tmp.quarkDim[i][j].cost.div(tmp.quarkBoostInterval).floor()
            let m = tmp.quarkDim[i][j].cost.sub(x.mul(tmp.quarkBoostInterval))
            tmp.quarkDim[i][j].cost = m.mul(tmp.quarkBoostCost.pow(x)).add(tmp.quarkBoostCost.pow(x).sub(1).div(tmp.quarkBoostCost.sub(1)).mul(tmp.quarkBoostInterval))

            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.mul(j + 3).add(Decimal.pow(j + 1, 2))
            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.pow10()

            checkNaN(tmp.quarkDim[i][j].cost, `NaN detected while attempting to calculate cost of ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`)

            let baseMultBoost = D(2)
            baseMultBoost = baseMultBoost.add(Decimal.div(player.quarkDimsBought[i][j], tmp.quarkBoostInterval).floor().mul(tmp.quarkBoostEffect))
            // cheat
            // baseMultBoost = baseMultBoost.pow(8)
            // end cheat

            tmp.quarkDim[i][j].mult = D(1)
            tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(Decimal.pow(baseMultBoost, player.quarkDimsBought[i][j]))
            if (player.currentSetback !== null) {
                tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(Decimal.pow(2, Decimal.mul(player.setbackLoadout[player.currentSetback][i], 0.75).add(tmp.trueQuarkTotal.mul(0.25))))
            }
            if (i === 0) {
                if (player.setbackUpgrades.includes(`r6`)) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(SETBACK_UPGRADES[0][5].eff)
                }
            }
            if (i === 1) {
                if (player.setbackUpgrades.includes(`g6`) && j < tmp.buyables.length) {
                    tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(tmp.buyables[j].genEffect)
                }
            }
            checkNaN(tmp.quarkDim[i][j].mult, `NaN detected while attempting to calculate mul of ${tmp.quarkNamesC[i]} Quark Dimension #${j + 1}`)

            let gen = tmp.quarkDim[i][j].mult.mul(Decimal.add(player.quarkDimsAccumulated[i][j], player.quarkDimsBought[i][j]))
            if (j === 0) {
                gen = gen.mul(tmp.quarkEffs[i])
                gen = cheatDilateBoost(gen)
            } 
            gen = gen.mul(delta).mul(tmp.timeSpeedTiers[0])

            if (j === 0) {
                player.setbackEnergy[i] = Decimal.add(player.setbackEnergy[i], gen)
            } else {
                player.quarkDimsAccumulated[i][j - 1] = Decimal.add(player.quarkDimsAccumulated[i][j - 1], gen)
            }
        }
    }
}

function updateHTML_setback() {
    html['setbackTab'].setDisplay(tmp.tab === 4)
    html['setbackTabButton'].setDisplay(Decimal.gte(player.ascend, 10))

    if (tmp.tab === 4) {
        html['setSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0))
        html['loadSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0))
        html['dimSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0))
        html['upgSBTabButton'].setDisplay(player.setbackLoadout.length > 0 || Decimal.gt(player.transcendResetCount, 0))

        html['setbackTabSettings'].setDisplay(tmp.setbackTab === 0)
        html['setbackTabLoadout'].setDisplay(tmp.setbackTab === 1)
        html['setbackTabDims'].setDisplay(tmp.setbackTab === 2)
        html['setbackTabUpgs'].setDisplay(tmp.setbackTab === 3)

        if (tmp.setbackTab === 0) {
            html['setbackSliderRed'].el.disabled = player.inSetback
            html['setbackSliderGreen'].el.disabled = player.inSetback
            html['setbackSliderBlue'].el.disabled = player.inSetback

            html['setbackRedValue'].setTxt(format(player.setback[0]))
            html['setbackGreenValue'].setTxt(format(player.setback[1]))
            html['setbackBlueValue'].setTxt(format(player.setback[2]))

            html['setbackRedEffect'].setTxt(format(tmp.setbackEffects[0], 2))
            html['setbackGreenEffect'].setTxt(format(tmp.setbackEffects[1], 1))
            html['setbackBlueEffect'].setTxt(format(tmp.setbackEffects[2], 2))

            html['setbackRedGenerate'].setTxt(format(tmp.predictedQuarkGain[0]))
            html['setbackGreenGenerate'].setTxt(format(tmp.predictedQuarkGain[1]))
            html['setbackBlueGenerate'].setTxt(format(tmp.predictedQuarkGain[2]))

            html['setbackToggle'].changeStyle(!(Decimal.eq(player.setback[0], 0) && Decimal.eq(player.setback[1], 0) && Decimal.eq(player.setback[2], 0)) ? 'pointer' : 'not-allowed')
        }

        if (tmp.setbackTab === 1) {
            // the displaying is done in displaySetbackCompleted() !
        }

        if (tmp.setbackTab === 2) {
            html['redQuarks'].setTxt(format(player.setbackQuarks[0]))
            html['greenQuarks'].setTxt(format(player.setbackQuarks[1]))
            html['blueQuarks'].setTxt(format(player.setbackQuarks[2]))
            
            html['redEnergy'].setTxt(format(player.setbackEnergy[0]))
            html['greenEnergy'].setTxt(format(player.setbackEnergy[1]))
            html['blueEnergy'].setTxt(format(player.setbackEnergy[2]))

            html['dimScalingInterval'].setTxt(format(tmp.quarkBoostInterval))
            html['dimScalingSpeed'].setTxt(format(tmp.quarkBoostCost, 2))
            html['dimScalingBoost'].setTxt(format(tmp.quarkBoostEffect, 2))

            for (let col = 0; col < player.setback.length; col++) {
                html[`${tmp.quarkNames[col]}BuyMax`].changeStyle('background-color', `${colorChange(tmp.quarkColors[col], tmp.dimBoughtBM[col].gt(0) ? 0.5 : 0.25, 1.0)}80`)
                html[`${tmp.quarkNames[col]}BuyMax`].changeStyle('border', `3px solid ${colorChange(tmp.quarkColors[col], tmp.dimBoughtBM[col].gt(0) ? 1.0 : 0.5, 1.0)}`)
                html[`${tmp.quarkNames[col]}BuyMax`].changeStyle('cursor', tmp.dimBoughtBM[col].gt(0) ? 'pointer' : 'not-allowed')
                html[`${tmp.quarkNames[col]}BMTotalEst`].setTxt(`${format(tmp.dimBoughtBM[col])}`)
                
                html[`${tmp.quarkNames[col]}QuarkEff`].setTxt(format(tmp.quarkEffs[col]))
                html[`${tmp.quarkNames[col]}EnergyEff`].setTxt(format(tmp.energyEffs[col], 3))

                for (let i = 0; i < player.quarkDimsBought[col].length; i++) {
                    html[`${tmp.quarkNames[col]}Dim${i}`].setDisplay(i === 0 ? true : Decimal.gt(player.quarkDimsBought[col][i - 1], 0) || Decimal.gt(player.quarkDimsAccumulated[col][i - 1], 0))
                    if (i === 0 ? true : Decimal.gt(player.quarkDimsBought[col][i - 1], 0) || Decimal.gt(player.quarkDimsAccumulated[col][i - 1], 0)) {
                        html[`${tmp.quarkNames[col]}Dim${i}`].changeStyle('background-color', `${colorChange(tmp.quarkColors[col], Decimal.gte(player.setbackEnergy[col], tmp.quarkDim[col][i].cost) ? 0.5 : 0.25, 1.0)}80`)
                        html[`${tmp.quarkNames[col]}Dim${i}`].changeStyle('border', `3px solid ${colorChange(tmp.quarkColors[col], Decimal.gte(player.setbackEnergy[col], tmp.quarkDim[col][i].cost) ? 1.0 : 0.5, 1.0)}`)
                        html[`${tmp.quarkNames[col]}Dim${i}`].changeStyle('cursor', Decimal.gte(player.setbackEnergy[col], tmp.quarkDim[col][i].cost) ? 'pointer' : 'not-allowed')
                        html[`${tmp.quarkNames[col]}Dim${i}amount`].setTxt(`${format(player.quarkDimsBought[col][i])} (${format(player.quarkDimsAccumulated[col][i])})`)
                        html[`${tmp.quarkNames[col]}Dim${i}mult`].setTxt(`${format(tmp.quarkDim[col][i].mult, 2)}`)
                        html[`${tmp.quarkNames[col]}Dim${i}cost`].setTxt(`${format(tmp.quarkDim[col][i].cost)} ${tmp.quarkNamesC[col]} Energy`)
                    }
                }
            }
        }

        if (tmp.setbackTab === 3) {
            for (let i = 0; i < player.setback.length; i++) {
                html[`${tmp.quarkNames[i]}EnergyAmt2`].setTxt(format(player.setbackEnergy[i]))
            }

            for (let i = 0; i < SETBACK_UPGRADES.length; i++) {
                for (let j = 0; j < SETBACK_UPGRADES[i].length; j++) {
                    html[`${tmp.quarkNames[i]}SBUpg${j}`].changeStyle('border', `3px solid ${colorChange(
                        tmp.quarkColors[i],
                        0.5 * (Decimal.gte(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost) || player.setbackUpgrades.includes(SETBACK_UPGRADES[i][j].id) ? 2 : 1), 
                        1 / ((tmp.sbSelectedUpg[0] === i && tmp.sbSelectedUpg[1] === j) ? 4 : 1) / (player.setbackUpgrades.includes(SETBACK_UPGRADES[i][j].id) ? 2 : 1)
                    )}`)

                    html[`${tmp.quarkNames[i]}SBUpg${j}`].changeStyle('background-color', `${colorChange(
                        tmp.quarkColors[i],
                        0.25 * (Decimal.gte(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost) || player.setbackUpgrades.includes(SETBACK_UPGRADES[i][j].id) ? 2 : 1) * (player.setbackUpgrades.includes(SETBACK_UPGRADES[i][j].id) ? 2 : 1),
                        1.0
                    )}80`)
                }
            }

            html['upgSBDesc'].setTxt(tmp.sbSelectedUpg.length === 0 ? '' : `${SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].desc}`)
            html['upgSBCost'].setTxt(tmp.sbSelectedUpg.length === 0 ? '' : `Cost: ${format(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].cost)} ${tmp.quarkNames[tmp.sbSelectedUpg[0]]} energy.${player.setbackUpgrades.includes(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].id) ? ' Bought!' : ''}`)
        }

    }
}

function toggleSetback() {
    if (Decimal.eq(player.setback[0], 0) && Decimal.eq(player.setback[1], 0) && Decimal.eq(player.setback[2], 0)) {
        return
    }
    if (player.inSetback) {
        player.inSetback = false
        doAscendReset(true)
    } else {
        doAscendReset(true)
        player.inSetback = true
    }
}

function displaySetbackCompleted() {
    let txt = ``
    for (let i = 0; i < player.setbackLoadout.length; i++) {
        const total = Decimal.add(player.setbackLoadout[i][0]).add(player.setbackLoadout[i][1]).add(player.setbackLoadout[i][2])
        txt += `
            <div style="background-color: #${player.currentSetback === i ? '006060' : '404040'}80; border: 3px solid #${player.currentSetback === i ? '00ff' : 'ffff'}ff; width: 400px; height: 190px">
                <div class="font flex-vertical" style="font-size: 12px;">
                    <span style="color: #ffffff; font-size: 16px">Total Difficulty: <b>${format(total)}</b></span>
                    <span style="color: #ff4040; font-size: 14px">Red: <b>${format(player.setbackLoadout[i][0])}</b></span>
                    <span style="color: #ff4040; font-size: 12px">This will generate <b>${format(total.pow(2).mul(Decimal.pow(player.setbackLoadout[i][0], 2)))}</b> base red quarks per second.</span>
                    <span style="color: #ff4040; font-size: 12px">Red multipliers are increased by <b>${format(Decimal.pow(2, Decimal.mul(player.setbackLoadout[i][0], 0.75).add(total.mul(0.25))), 2)}×</b>.</span>
                    <span style="color: #40ff40; font-size: 14px">Green: <b>${format(player.setbackLoadout[i][1])}</b></span>
                    <span style="color: #40ff40; font-size: 12px">This will generate <b>${format(total.pow(2).mul(Decimal.pow(player.setbackLoadout[i][1], 2)))}</b> base green quarks per second.</span>
                    <span style="color: #40ff40; font-size: 12px">Green multipliers are increased by <b>${format(Decimal.pow(2, Decimal.mul(player.setbackLoadout[i][1], 0.75).add(total.mul(0.25))), 2)}×</b>.</span>
                    <span style="color: #4040ff; font-size: 14px">Blue: <b>${format(player.setbackLoadout[i][2])}</b></span>
                    <span style="color: #4040ff; font-size: 12px">This will generate <b>${format(total.pow(2).mul(Decimal.pow(player.setbackLoadout[i][2], 2)))}</b> base blue quarks per second.</span>
                    <span style="color: #4040ff; font-size: 12px">Blue multipliers are increased by <b>${format(Decimal.pow(2, Decimal.mul(player.setbackLoadout[i][2], 0.75).add(total.mul(0.25))), 2)}×</b>.</span>
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

function useSetback(i) {
    if (player.currentSetback === i) {
        player.currentSetback = null
    } else {
        player.currentSetback = i
    }
    doAscendReset(true)
}

function deleteSetback(i) {
    if (confirm('Are you sure you want to delete this setback? You will have to do the setback with the same settings again!')) {
        if (player.currentSetback === i) {
            player.currentSetback = null
        }
        if (player.currentSetback > i) {
            player.currentSetback -= 1
        }
        player.setbackLoadout.splice(i, 1)
    }
    displaySetbackCompleted()
}

function setUsingSetback(i) {
    html['setbackSliderRed'].el.value = player.setbackLoadout[i][0]
    html['setbackSliderGreen'].el.value = player.setbackLoadout[i][1]
    html['setbackSliderBlue'].el.value = player.setbackLoadout[i][2]
    player.setback = player.setbackLoadout[i]
    displaySetbackCompleted()
}

function buySBDim(i, j) {
    if (Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost)) {
        player.setbackEnergy[i] = player.setbackEnergy[i].sub(tmp.quarkDim[i][j].cost)
        player.quarkDimsBought[i][j] = Decimal.add(player.quarkDimsBought[i][j], 1)
        updateGame_setback()
    }
}

function buyMaxSBDim(i) {
    for (let j = player.quarkDimsBought[i].length - 1; j >= 0; j--) {
        if (Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost)) {
            player.quarkDimsBought[i][j] = tmp.quarkDim[i][j].target.floor().add(1).max(player.quarkDimsBought[i][j])
            player.setbackEnergy[i] = player.setbackEnergy[i].sub(tmp.quarkDim[i][j].cost) // this isn't updated but whatever, not like it actually matters too much
        }
    }
    updateGame_setback()
}

function selectSBUpg(i, j) {
    if (tmp.sbSelectedUpg[0] === i && tmp.sbSelectedUpg[1] === j) {
        if (Decimal.gte(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost)) {
            if (!player.setbackUpgrades.includes(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].id)) {
                player.setbackEnergy[i] = Decimal.sub(player.setbackEnergy[i], SETBACK_UPGRADES[i][j].cost)
                player.setbackUpgrades.push(SETBACK_UPGRADES[tmp.sbSelectedUpg[0]][tmp.sbSelectedUpg[1]].id)
            }
        }
    }
    tmp.sbSelectedUpg[0] = i
    tmp.sbSelectedUpg[1] = j
}

function setbackAutobuyerEnabledAndSpeed(i, j) {
    let auto = false
    let spd = D(0)
    if (hasTranscendMilestone(3) && (j === 0 || (i === 0 && j >= 1 && j <= 3))) {
        auto = true
        spd = D(4)
    }
    if (hasTranscendMilestone(4) && (j === 1 || (i === 1 && j >= 2 && j <= 4))) {
        auto = true
        spd = D(4)
    }
    if (hasTranscendMilestone(5) && (j === 2 || (i === 2 && j >= 3 && j <= 5))) {
        auto = true
        spd = D(4)
    }
    if (hasTranscendMilestone(6)) {
        if (j === 0) {
            spd = spd.mul(2.5)
        }
        if (j === 6) {
            auto = true
            spd = D(4)
        }
    }
    if (hasTranscendMilestone(7)) {
        if (j === 1) {
            spd = spd.mul(2.5)
        }
        if (j === 7) {
            auto = true
            spd = D(4)
        }
    }

    auto ||= player.cheats.autoDim

    spd = spd.mul(tmp.timeSpeedTiers[0])
    if (player.cheats.autoDim) {
        spd = D(Infinity)
    }
    return {enabled: auto, speed: spd}
}
