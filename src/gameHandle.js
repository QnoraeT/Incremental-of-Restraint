"use strict";
// ! Ultimate Goal:
// ! Make inflation hard to do -- To test all currencies, try raising the third exponent by 2 (dilate true, dilateStage 2, dilateValue 2) to see what happens, it should stay stable

// upgrade/study ideas
// .
// 100 levels
// UP1: +1x,    ^1.5   = 100 -> 1,000
// UP2: +0.5x,  ^1.75  = 50  -> 1,000
// UP3: +0.25x, ^2.125 = 25  -> 1,000
// UP4: +0.1x,  ^2.9   = 10  -> 1,000
// UP5: +0.05x, ^3.9   = 5   -> 1,000
// UP6: +0.01x, ^10    = 2   -> 1,000 (base cost: 1.000 B, but due to g9, is 1)

// START GAME LOGIC
const saveID = "restraint_inc_tearonq";
function initPlayer() {
    const obj = {
        cheats: {
            autobuyUnlock: false,
            autobuyBulk: false,
            autoPrestige: false,
            autoAscend: false,
            autoAscendUpgrades: false,
            autoDim: false,
            dilate: false,
            dilateStage: 0,
            dilateValue: D(1)
        },
        lastTick: Date.now(),
        version: 0,
        tab: 0,
        statTab: 0,
        mainTab: 0,
        points: D(0),
        bestPointsInPrestige: D(0),
        bestPointsInAscend: D(0),
        buyables: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyablePoints: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyableTierPoints: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyableAutobought: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyableAuto: [false, false, false, false, false],
        timeSinceBuyableBought: D(0),
        prestige: D(0),
        prestigeEssence: D(0),
        prestigeTab: 0,
        timeInPrestige: D(0),
        prestigeUpgrades: [
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0)
        ],
        prestigeChallenge: null,
        prestigeChallengeCompleted: [],
        prestigeUpgradesInCurrentAscension: false,
        darts: D(0),
        hinderanceScore: [D(0), D(0), D(0)],
        currentHinderance: null,
        ascendTab: 0,
        ascend: D(0),
        timeInAscend: D(0),
        ascendGems: D(0),
        ascendUpgrades: [],
        setbackTab: 0,
        setbackDimTab: 0,
        setback: [D(0), D(0), D(0)],
        currentSetback: null,
        setbackLoadout: [],
        inSetback: false,
        setbackQuarks: [D(0), D(0), D(0)],
        setbackEnergy: [D(0), D(0), D(0)],
        quarkDimsBought: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAutobought: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAccumulated: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAuto: [
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false]
        ],
        setbackUpgradeSelected: null,
        setbackUpgrades: [],
        generatorFeatures: {
            xp: D(0),
            buyable: [D(0), D(0)],
            enhancer: D(0),
            enhancerBuyables: [D(0), D(0), D(0)]
        }
    }

    return obj
}
function initTmp() {
    const obj = {
        fps: [],
        lastFPSTick: 0,
        offlineTime: {
            active: false,
            tickRemaining: 0,
            tickMax: 0,
            tickLength: 0.05,
            returnTime: 0,
        },
        timeSpeedTiers: [D(1)],
        timeFactors: [[]],
        pointGen: D(1),
        pointFactors: [],
        buyables: [],
        bybBoostInterval: D(100),
        bybBoostEffect: D(2),
        bybBoostCost: D(2),
        pc11Eff: D(1),
        prestigeAmount: D(0),
        prestigeFactors: [],
        prestigeNext: D(0),
        prestigeUsed: D(0),
        prestigeUpgradeCap: D(0),
        prestigePointEffect: D(1),
        prestigeUpgEffs: [],
        prestigeUpgDescs: [],
        totalPrestigeUpgrades: D(0),
        peGain: D(0),
        peNext: D(0),
        peEffect: D(1),
        prestigeEssenceFactors: [],
        generatorFactors: [],
        generatorSpeed: D(1),
        ascendFactors: [],
        ascendAmount: D(0),
        ascendNext: D(0),
        ascendPointEffect: D(0),
        dartGain: D(0),
        dartEffect: D(1),
        setbackEffects: [D(1), D(1), D(1)],
        predictedQuarkGain: [D(0), D(0), D(0)],
        predictedQuarkTotal: D(0),
        trueQuarkGain: [D(0), D(0), D(0)],
        trueQuarkTotal: D(0),
        quarkDim: [[], [], []],
        quarkMultPer: D(2),
        quarkBoostInterval: D(100),
        quarkBoostEffect: D(1),
        quarkBoostCost: D(2),
        quarkEffs: [D(1), D(1), D(1)],
        energyEffs: [D(1), D(1), D(1)],
        quarkNames: ['red', 'green', 'blue'],
        quarkNamesC: ['Red', 'Green', 'Blue'],
        quarkColors: [
            {
                border: {
                    canBuy: 'FF0000',
                    cannotBuy: '800000',
                    complete: 'FF8080'
                },
                fill: {
                    canBuy: '800000',
                    cannotBuy: '400000',
                    complete: 'a04040'
                }
            },
            {
                border: {
                    canBuy: '00FF00',
                    cannotBuy: '008000',
                    complete: '80FF80'
                },
                fill: {
                    canBuy: '008000',
                    cannotBuy: '004000',
                    complete: '40a040'
                }
            },
            {
                border: {
                    canBuy: '0000FF',
                    cannotBuy: '000080',
                    complete: '8080FF'
                },
                fill: {
                    canBuy: '000080',
                    cannotBuy: '000040',
                    complete: '4040a0'
                }
            },
            
        ],
        sbSelectedUpg: [],
        generatorFeatures: {
            gain: D(0),
            genXPBuyables: [],
            xpEffGenerators: D(1),
            xpEffPoints: D(1),
            enhancerGain: D(0),
            enhancerNext: D(0),
            enhancerEff: D(1),
            genEnhBuyables: []
        }
    }
    obj.buyables = resetMainBuyables()
    obj.generatorFeatures.genXPBuyables = resetGenXPBuyables()
    obj.generatorFeatures.genEnhBuyables = resetGenEnhBuyables()
    return obj
}

function resetMainBuyables() {
    const arr = []
    for (let i = 0; i < player.buyables.length; i++) {
        arr[i] = {
            effective: D(0),
            effect: D(1),
            cost: D(10),
            effectBase: D(0),
            costSpeed: D(1),
            target: D(0),
            genLevels: D(0),
            genEffect: D(1),
            tierLevels: D(0),
            tierEffect: D(1)
        }
    }
    return arr
}

function resetGenXPBuyables() {
    const arr = []
    for (let i = 0; i < player.generatorFeatures.buyable.length; i++) {
        arr[i] = {
            eff: D(1),
            cost: D(1),
            target: D(0)
        }
    }
    return arr
}

function resetGenEnhBuyables() {
    const arr = []
    for (let i = 0; i < player.generatorFeatures.enhancerBuyables.length; i++) {
        arr[i] = {
            eff: D(1),
            cost: D(1),
            target: D(0)
        }
    }
    return arr
}

function resetTheWholeGame(prompt) {
    if (prompt) {
        if (!confirm("Are you sure you want to delete EVERY save?")) {
            return;
        }
        if (!confirm("You cannot recover ANY of your save files unless if you have an exported backup! Are you still sure? [Final Warning]")) {
            return;
        }
    }

    localStorage.removeItem(saveID);
};

const html = []
const dots = []
let player = initPlayer()
let tmp = initTmp()
let draw
let pen
let gameTick
const gameVars = {
    timeUntilSave: 5,
    offlineTimeFailed: false,
    saveDisabled: false
};

function loadGame() {
    player = initPlayer()
    tmp = initTmp()

    if (localStorage.getItem(saveID) !== null && localStorage.getItem(saveID) !== "null") {
        try {
            player = JSON.parse(LZString.decompressFromBase64(localStorage.getItem(saveID)));
        } catch (e) {
            console.error(`loading the game went wrong!`);
            console.error(e);
            console.error(localStorage.getItem(saveID));
            gameVars.saveDisabled = true;
        }
    }

    initHTML()

    // cheats start

    // player.cheats.autoAscend = true
    // player.cheats.autoAscendUpgrades = true
    // player.cheats.autobuyBulk = true
    // player.cheats.autobuyUnlock = true
    // player.cheats.autoDim = true
    // player.cheats.autoPrestige = true
    // player.cheats.dilate = true
    // player.cheats.dilateStage = 2
    // player.cheats.dilateValue = new Decimal(1.1)

    // player.generatorFeatures.enhancerBuyables[2] = D(1)
    // for (let i = 0; i < 10; i++) {
    //     player.setbackUpgrades.push(`r${i+1}`)
    //     player.setbackUpgrades.push(`g${i+1}`)
    //     player.setbackUpgrades.push(`b${i+1}`)
    // }
    // player.ascend = D(1e6)
    // player.setbackLoadout[0] = [D(2), D(2), D(2)]
    // player.currentSetback = 0
    // displaySetbackCompleted()

    doGameLoopTicksLol()
}

function initHTML() {
    document.body.style.backgroundColor = "#000000"
    document.body.style.margin = "0px"
    document.body.style.padding = "0px"
    toHTMLvar('offlineTime')
    toHTMLvar('inGame')
    toHTMLvar('offlineTimeProgress')
    toHTMLvar('offlineTimeProgressBar')
    toHTMLvar('offlineTimeProgressBarBase')
    toHTMLvar('offlineTimeDisplay')

    html['inGame'].setDisplay(false)
    html['offlineTime'].setDisplay(false)

    toHTMLvar('points')
    toHTMLvar('pointsPerSecond')
    toHTMLvar('chalList')

    initHTML_generatorExtras()
    initHTML_setback()
    initHTML_ascend()
    initHTML_prestige()
    initHTML_main()
    initHTML_stats()

    toHTMLvar('textbookTabButton')
    toHTMLvar('textbookTab')
    toHTMLvar('informationList')

    let txt = ``
    for (let i = 0; i < TEXTBOOK.length; i++) {
        txt += `
            <button onclick="TEXTBOOK[${i}].enabled = !TEXTBOOK[${i}].enabled" id="textbookButton${i}" class="whiteText font" style="background-color: ${TEXTBOOK[i].colors[1]}; border: 3px solid ${TEXTBOOK[i].colors[0]}; height: 55px; width: 300px; font-size: 16px; margin-top: 2px; margin-bottom: 4px; cursor: pointer">
                <b>${TEXTBOOK[i].title}</b><br>
                <span style="font-size: 12px">${TEXTBOOK[i].stage}</span>
            </button>
            <div id="textbook${i}" class="whiteText font" style="background-color: ${TEXTBOOK[i].colors[1]}; border: 3px solid ${TEXTBOOK[i].colors[0]}; width: 1000px; padding: 4px; margin-top: -7px; margin-bottom: 3px; font-size: 12px; text-align: center"></div>
        `
    }
    html['informationList'].setHTML(txt)
    for (let i = 0; i < TEXTBOOK.length; i++) {
        toHTMLvar(`textbook${i}`)
        toHTMLvar(`textbookButton${i}`)
    }

    draw = document.getElementById('draw');
    pen = draw.getContext("2d");
    initDots()
}

let gameStopped = false

let sessionTime = 0
let delta = 0

function initDots() {
    for (let i = 0; i < 32; i++) {
        dots.push([0, rand(-10000, 10000), rand(-10000, 10000), rand(0.1, 0.4), rand(-0.02, 0.02), rand(-0.02, 0.02)]);
    }
    for (let i = 0; i < 128; i++) {
        dots.push([1, rand(-10000, 10000), rand(-10000, 10000), rand(1.1, 3), rand(-0.1, 0.1), rand(-0.1, 0.1)]);
    }
}

const drawing = () => {
    draw.width = window.innerWidth;
    draw.height = window.innerHeight;
    for (let i = 0; i < dots.length; i++) {
        dots[i][4] += Math.random() - 0.5;
        dots[i][5] += Math.random() - 0.5;
        dots[i][4] = lerp(1 - (0.9 ** delta), dots[i][4], 0);
        dots[i][5] = lerp(1 - (0.9 ** delta), dots[i][5], 0);
        dots[i][1] += dots[i][3] * delta * dots[i][4];
        dots[i][2] += dots[i][3] * delta * dots[i][5];

        pen.beginPath();
        let alpha;
        if (dots[i][0] === 0) {
            alpha = 20 + (4 * Math.cos((sessionTime + 11 * i) / 50));
        } else {
            alpha = 160 + (64 * Math.cos((sessionTime + 11 * i) / 50));
        }
        pen.fillStyle = `hsla(${sessionTime + (i * (dots[i][0] === 0 ? 1 : 0.1))}, 100%, 50%, ${alpha / 255})`;
        let j = Math.cos((sessionTime * dots[i][3] + i) / (2 * Math.PI));
        pen.arc((Math.abs(dots[i][1] % 3800) - 700),
            (Math.abs(dots[i][2] % 2400) - 700),
            dots[i][0] == 0 ? (300 + 100 * j) : (10 + 4 * j),
            0,
            2 * Math.PI);
        pen.fill();
    }
}

function doGameLoopTicksLol() {
    gameTick = setInterval(gameLoop, 20)
}

function doOfflineTime() {
    if (gameVars.offlineTimeFailed) {
        return;
    }
    for (let i = 0; i < Math.min(tmp.offlineTime.tickRemaining, 100); i++) {
        try {
            gameLoop()
            tmp.offlineTime.tickRemaining -= 1
        } catch(e) {
            console.error(`Offline time couldn't be done!`)
            console.error(e)
            gameVars.offlineTimeFailed = true
            return;
        }
    }

    html['inGame'].setDisplay(false)
    html['offlineTime'].setDisplay(true)

    html['offlineTimeDisplay'].setTxt(`Ticks: ${format(tmp.offlineTime.tickRemaining)} / ${format(tmp.offlineTime.tickMax)} (${formatTime(tmp.offlineTime.tickRemaining * tmp.offlineTime.tickLength)} / ${formatTime(tmp.offlineTime.tickMax * tmp.offlineTime.tickLength)})`)
    html['offlineTimeProgressBar'].changeStyle('width', `${100 * (1 - (tmp.offlineTime.tickRemaining / tmp.offlineTime.tickMax))}%`)

    if (tmp.offlineTime.tickRemaining > 0) {
        window.setTimeout(doOfflineTime, 0)
    } else {
        tmp.offlineTime.active = false
        doGameLoopTicksLol()
        console.log('offline time deactivated!')
    }
} 

function gameLoop() {
    if (gameStopped) {
        return;
    }

    delta = (Date.now() - player.lastTick) / 1000
    if (!tmp.offlineTime.active) {
        player.lastTick = Date.now()
        if (delta >= 10) {
            console.log('offline time activated!')
            tmp.offlineTime.active = true
            tmp.offlineTime.tickMax = Math.floor(delta / tmp.offlineTime.tickLength)
            if (tmp.offlineTime.tickMax > 1000) {
                tmp.offlineTime.tickLength = tmp.offlineTime.tickLength * (tmp.offlineTime.tickMax / 1000)
                tmp.offlineTime.tickMax = tmp.offlineTime.tickMax / (tmp.offlineTime.tickMax / 1000)
            }
            tmp.offlineTime.tickRemaining = tmp.offlineTime.tickMax
            tmp.offlineTime.returnTime = sessionTime + (tmp.offlineTime.tickLength * 10)
            doOfflineTime()
            clearInterval(gameTick)
            return;
        }
    } else {
        delta = tmp.offlineTime.tickLength
    }
    sessionTime += delta

    // tick game
    try {
        calcTimeSpeed()
        updateGame_generatorExtras()
        updateGame_setback()
        updateGame_ascend()
        updateGame_prestige()
        updateGame_main()
        updateGame_stats()
    } catch(e) {
        console.error(e)
        clearInterval(gameTick)
    }

    if (!tmp.offlineTime.active) {
        html['inGame'].setDisplay(true)
        html['offlineTime'].setDisplay(false)

        updateHTML()
        drawing()

        gameVars.timeUntilSave -= delta
        if (gameVars.timeUntilSave <= 0) {
            gameVars.timeUntilSave += 5
            localStorage.setItem(saveID, LZString.compressToBase64(JSON.stringify(player)));
        }
    }
}

function updateHTML() {
    let txt = ``
    updateHTML_generatorExtras()      
    updateHTML_setback()
    updateHTML_ascend()
    updateHTML_prestige()
    updateHTML_main()
    updateHTML_stats()

    html["points"].setTxt(`${format(player.points, 2)}`)
    html["pointsPerSecond"].setTxt(`${format(tmp.pointGen, 2)}/s`)

    const arr = []
    txt = ``
    if (player.prestigeChallenge !== null) {
        arr.push(`<span style="color: #0080ff">PC${player.prestigeChallenge + 1}: ${PRESTIGE_CHALLENGES[player.prestigeChallenge].name}</span>`)
    }
    if (player.inSetback) {
        arr.push(`<span style="color: #${new Decimal(player.setback[0]).mul(25).toNumber().toString(16)}${new Decimal(player.setback[1]).mul(25).toNumber().toString(16)}${new Decimal(player.setback[2]).mul(25).toNumber().toString(16)}">Setback (${format(player.setback[0])}, ${format(player.setback[1])}, ${format(player.setback[2])})</span>`)
    }
    if (player.currentHinderance !== null) {
        arr.push(`<span style="color: #ff0020">H${player.currentHinderance + 1}: ${HINDERANCES[player.currentHinderance].name}</span>`)
    }
    if (arr.length === 0) {
        txt = `You are currently without obstructions.`
    } else if (arr.length === 1) {
        txt = `You are in ${arr[0]}.`
    } else if (arr.length === 2) {
        txt = `You are in ${arr[0]} and ${arr[1]}.`
    } else {
        txt = `You are in `
        for (let i = 0; i < arr.length - 1; i++) {
            txt += `${arr[i]}, `
        }
        txt += `and ${arr[arr.length - 1]}.`
    }

    html['chalList'].setHTML(txt)

    html['textbookTab'].setDisplay(player.tab === 2)
    if (player.tab === 2) {
        for (let i = 0; i < TEXTBOOK.length; i++) {
            html[`textbookButton${i}`].setDisplay(TEXTBOOK[i].show)
            html[`textbook${i}`].setDisplay(TEXTBOOK[i].enabled)
            if (TEXTBOOK[i].enabled) {
                html[`textbook${i}`].setHTML(TEXTBOOK[i].info)
            }
        }
    }
}

function calcTimeSpeed() {
    // tier 2 timespeed multiplies tier 1 timespeed
    tmp.timeSpeedTiers[0] = D(1)
    if (player.prestigeChallenge === 11) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].div(1e3)
    }
}