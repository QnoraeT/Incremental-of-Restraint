"use strict";

function initHTML_replicators() {
    toHTMLvar('replicatorMainTabButton')
    toHTMLvar('replicatorMain')

    toHTMLvar('replicatorAmount')
    toHTMLvar('replicatorEffect')
    toHTMLvar('replicatorTrueSpeed')
    toHTMLvar('replicatorTrueSpeed2')
    
}

function updateGame_replicators() {
    tmp.replicatorEff = D(1)
    if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
        tmp.replicatorSpd = D(Decimal.root(2, 60)) // ! player.replicators can be placed in self even with trilate and no runaway inflation as long as no .pow10()
        tmp.replicatorStrength = D(100) // ! player.replicators CANNOT be placed in self without .log10() without runaway inflation

        tmp.replicatorTrueSpdDisp2 = player.replicators
        player.replicators = Decimal.max(player.replicators, 1).root(tmp.replicatorStrength).sub(1).mul(tmp.replicatorStrength).exp().mul(tmp.replicatorSpd.pow(delta)).ln().div(tmp.replicatorStrength).add(1).pow(tmp.replicatorStrength)
        tmp.replicatorTrueSpdDisp2 = player.replicators.div(tmp.replicatorTrueSpdDisp2).root(delta) // replicators get auto turned into a decimal before this
        tmp.replicatorTrueSpdDisp1 = tmp.replicatorTrueSpdDisp2.eq(1) ? D(Infinity) : Decimal.log(2, tmp.replicatorTrueSpdDisp2)

        tmp.replicatorEff = player.replicators.pow(1000) // player replicators would've already been turned into a Decimal
    }
}

function updateHTML_replicators() {
    html['replicatorMainTabButton'].setDisplay(player.generatorFeatures.advanceUpgsChosen.includes(1))
    html['replicatorMain'].setDisplay(tmp.mainTab === 3)

    if (tmp.mainTab === 3) {
        html['replicatorAmount'].setTxt(format(player.replicators, 2))
        html['replicatorEffect'].setTxt(format(tmp.replicatorEff))
        html['replicatorTrueSpeed'].setTxt(formatTime(tmp.replicatorTrueSpdDisp1, 2))
        html['replicatorTrueSpeed2'].setTxt(format(tmp.replicatorTrueSpdDisp2, 2))
    }
}