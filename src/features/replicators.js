"use strict";

const REPLIRANK_DATA = {
    gain(rank) {
        if (Decimal.eq(rank, 0)) { return D(0); }
        let gain = D(rank);
        gain = gain.factorial();
        return gain;
    },
    cost(rank) {
        let cost = D(rank);
        cost = cost.pow(2).pow_base(2).mul(2);
        return cost;
    },
    target(resource) {
        let target = D(resource);
        target = target.div(2).max(1).log(2).root(2);
        return target;
    },
    buyables: [
        {
            // shouldn't inflate because replicators scale exponentially but gradually slowdown via log,
            // after a point, i believe replicators scale linearly/polynomially at some point so this shouldn't inflate hopefully
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.add(1).pow_base(2);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.max(1).log(2).sub(1);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1);
                return eff;
            },
            desc(bought) {
                return `Increase replicator speed by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(3).mul(20);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(20).max(1).log(3);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.add(1);
                return eff;
            },
            desc(bought) {
                return `Increase rank point gain by ×${format(this.eff(bought))} → ×${format(this.eff(Decimal.add(bought, 1)))}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.01).sub(1).div(0.01).pow_base(16).mul(100);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(100).max(1).log(16).mul(0.01).add(1).log(1.01);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Setback multipliers are increased by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        },
        {
            enabled() {
                return true;
            },
            cost(bought) {
                let cost = D(bought);
                cost = cost.pow_base(1.02).sub(1).div(0.02).pow_base(20).mul(400);
                return cost;
            },
            target(resource) {
                let target = D(resource);
                target = target.div(400).max(1).log(20).mul(0.02).add(1).log(1.02);
                return target;
            },
            eff(bought) {
                let eff = D(bought);
                eff = eff.pow_base(1.01);
                return eff;
            },
            desc(bought) {
                return `Increase generator speed by ^${format(this.eff(bought), 2)} → ^${format(this.eff(Decimal.add(bought, 1)), 2)}.`;
            }
        }
    ]
}

function initHTML_replicators() {
    toHTMLvar('replicatorMainTabButton')
    toHTMLvar('replicatorMain')

    toHTMLvar('replicatorDisp')
    toHTMLvar('replicatorBestDisp')
    toHTMLvar('replicatorEffectDisp')
    toHTMLvar('replicatorTrueSpeed')
    toHTMLvar('replicatorTrueSpeed2')

    toHTMLvar('replicatorStrengthDisp1')
    toHTMLvar('replicatorStrengthDisp2')
    toHTMLvar('replicatorStrengthEffect')

    toHTMLvar('rankPointDisp')
    toHTMLvar('rankPointGenDisp')
    toHTMLvar('rankPointShow')
    toHTMLvar('repliRankAll')
    toHTMLvar('repliRank')
    toHTMLvar('repliRankAmount')
    toHTMLvar('repliRankEff')
    toHTMLvar('repliRankCost')
    toHTMLvar('rankPointBuyList')

    let txt = ``;
    for (let i = 0; i < player.replirankBuyables.length; i++) {
        txt += `
            <div id="repliRankBuy${i}all" style="width: 175px; margin: 2px">
                <button onclick="buyRepliRankBuy(${i})" id="repliRankBuy${i}" class="whiteText font" style="height: 85px; width: 175px; font-size: 10px; margin: 2px">
                    <span id="repliRankBuy${i}amount"></span><br>
                    <br>
                    <span id="repliRankBuy${i}eff"></span><br>
                    Cost: <span id="repliRankBuy${i}cost"></span>
                </button>
            </div>
        `;
    }
    html['rankPointBuyList'].setHTML(txt);
    for (let i = 0; i < player.replirankBuyables.length; i++) {
        toHTMLvar(`repliRankBuy${i}all`);
        toHTMLvar(`repliRankBuy${i}`);
        toHTMLvar(`repliRankBuy${i}amount`);
        toHTMLvar(`repliRankBuy${i}eff`);
        toHTMLvar(`repliRankBuy${i}cost`);
    }
}

function updateGame_replicators() {
    tmp.replicatorEff = D(1)

    if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
        for (let i = REPLIRANK_DATA.buyables.length - 1; i >= 0; i--) {
            let resource = player.replirankPoints
            tmp.repliRankBuyables[i].target = REPLIRANK_DATA.buyables[i].target(resource)
            
            let bought = player.replirankBuyables[i]
            tmp.repliRankBuyables[i].cost = REPLIRANK_DATA.buyables[i].cost(bought)
            tmp.repliRankBuyables[i].eff = REPLIRANK_DATA.buyables[i].eff(bought)
            tmp.repliRankBuyables[i].canBuy = Decimal.gte(resource, tmp.repliRankBuyables[i].cost)
        }

        let resource = player.replicators
        tmp.repliRankTarget = REPLIRANK_DATA.target(resource)

        let bought = player.replirank
        tmp.repliRankReq = REPLIRANK_DATA.cost(bought)
        tmp.repliRankEffect = REPLIRANK_DATA.gain(bought)

        tmp.repliRankPointGen = D(0)
        tmp.repliRankPointGen = tmp.repliRankEffect
        tmp.repliRankPointGen = tmp.repliRankPointGen.mul(tmp.repliRankBuyables[1].eff)

        player.replirankPoints = Decimal.add(player.replirankPoints, tmp.repliRankPointGen.mul(delta))

        tmp.replicatorSpd = D(1) // ! player.replicators can be placed in this even with trilate and no runaway inflation as long as no .pow10()
        tmp.replicatorSpd = tmp.replicatorSpd.mul(tmp.repliRankBuyables[0].eff)

        tmp.replicatorSpd = tmp.replicatorSpd.div(60).add(1) // per minute
        tmp.replicatorStrength = D(100) // ! player.replicators CANNOT be placed in this without .log10() without runaway inflation

        tmp.replicatorTrueSpdDisp2 = player.replicators
        player.replicators = Decimal.max(player.replicators, 1).root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).exp().mul(tmp.replicatorSpd.pow(delta)).ln().div(tmp.replicatorStrength).add(1).pow(tmp.replicatorStrength)
        tmp.replicatorTrueSpdDisp2 = player.replicators.div(tmp.replicatorTrueSpdDisp2).root(delta) // replicators get auto turned into a decimal before this
        tmp.replicatorTrueSpdDisp1 = tmp.replicatorTrueSpdDisp2.eq(1) ? D(Infinity) : Decimal.log(2, tmp.replicatorTrueSpdDisp2)

        player.bestReplicators = Decimal.max(player.bestReplicators, player.replicators)

        tmp.replicatorEff = Decimal.max(player.replirank, 0).mul(0.05).add(1)
        tmp.replicatorEff = Decimal.max(player.bestReplicators, 1).log10().div(100).add(1).ln().mul(1000).pow10().pow(tmp.replicatorEff)
    }
}

function updateHTML_replicators() {
    let canBuy
    html['replicatorMainTabButton'].setDisplay(player.generatorFeatures.advanceUpgsChosen.includes(1))
    html['replicatorMain'].setDisplay(tmp.mainTab === 3)

    if (tmp.mainTab === 3) {
        html['replicatorDisp'].setTxt(format(player.replicators, 2))
        html['replicatorBestDisp'].setTxt(`${format(player.bestReplicators, 2)} best replicators`)
        html['replicatorEffectDisp'].setTxt(`×${format(tmp.replicatorEff)} point gain`)
        html['replicatorTrueSpeed'].setTxt(formatTime(tmp.replicatorTrueSpdDisp1, 2))
        html['replicatorTrueSpeed2'].setTxt(format(tmp.replicatorTrueSpdDisp2, 2))

        html['replicatorStrengthDisp1'].setTxt(format(tmp.replicatorStrength, 1))
        html['replicatorStrengthDisp2'].setTxt(format(tmp.replicatorStrength, 1))
        html['replicatorStrengthEffect'].setTxt(format(Decimal.max(player.replicators, 1).log10().div(tmp.replicatorStrength).pow10(), 2))

        html['rankPointDisp'].setTxt(format(player.replirankPoints))
        html['rankPointGenDisp'].setTxt(`${format(tmp.repliRankPointGen)}/s`)

        canBuy = Decimal.gte(player.replicators, tmp.repliRankReq)
        html[`repliRankEff`].setTxt(`${format(REPLIRANK_DATA.gain(player.replirank))}/s → ${format(REPLIRANK_DATA.gain(Decimal.add(player.replirank, 1)))}/s`)
        html[`repliRankCost`].setTxt(`${format(tmp.repliRankReq)} replicators`)
        html[`repliRankAmount`].setTxt(`${format(player.replirank)} → ${format(Decimal.add(player.replirank, 1))}`)

        html[`repliRank`].changeStyle('background-color', canBuy ? '#800040' : '#40002080')
        html[`repliRank`].changeStyle('border', `3px solid ${canBuy ? '#FF0080' : '#800040'}`)
        html[`repliRank`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed')
        
        for (let i = 0; i < REPLIRANK_DATA.buyables.length; i++) {
            html[`repliRankBuy${i}`].setDisplay(REPLIRANK_DATA.buyables[i].enabled())
            if (REPLIRANK_DATA.buyables[i].enabled()) {
                canBuy = tmp.repliRankBuyables[i].canBuy
                html[`repliRankBuy${i}eff`].setTxt(REPLIRANK_DATA.buyables[i].desc(player.replirankBuyables[i]))
                html[`repliRankBuy${i}cost`].setTxt(`${format(tmp.repliRankBuyables[i].cost)} rank points`)
                html[`repliRankBuy${i}amount`].setTxt(`RepliRank Buyable #${i+1}: ×${format(player.replirankBuyables[i])}`)

                html[`repliRankBuy${i}`].changeStyle('background-color', canBuy ? '#800040' : '#40002080')
                html[`repliRankBuy${i}`].changeStyle('border', `3px solid ${canBuy ? '#FF0080' : '#800040'}`)
                html[`repliRankBuy${i}`].changeStyle('cursor', canBuy ? 'pointer' : 'not-allowed')
            }
        }
    }
}

function repliRankReset(force = false) {
    if (!force) {
        if (Decimal.lt(player.replicators, tmp.repliRankReq)) {
            return;
        }

        player.replirank = Decimal.add(player.replirank, 1)
    }

    player.replicators = D(1)
}

function buyRepliRankBuy(i) {
    if (!tmp.repliRankBuyables[i].canBuy) {
        return;
    }
    
    if (shiftDown) {
        player.replirankPoints = Decimal.sub(player.replirankPoints, tmp.repliRankBuyables[i].cost)
        player.replirankBuyables[i] = Decimal.max(player.replirankBuyables[i], tmp.repliRankBuyables[i].target.floor())
    } else {
        player.replirankPoints = Decimal.sub(player.replirankPoints, tmp.repliRankBuyables[i].cost)
        player.replirankBuyables[i] = Decimal.add(player.replirankBuyables[i], 1)
    }
    updateGame_replicators()
}