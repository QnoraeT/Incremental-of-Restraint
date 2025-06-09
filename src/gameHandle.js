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
        timeInPrestige: D(0),
        timeInAscend: D(0),
        timeInTranscension: D(0),
        points: D(0),
        bestPointsInPrestige: D(0),
        bestPointsInAscend: D(0),
        bestPointsInTranscend: D(0),
        buyables: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyablePoints: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyableTierPoints: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyableAutobought: [D(0), D(0), D(0), D(0), D(0), D(0)],
        buyableInTranscension: [false, false, false, false, false, false],
        buyableAuto: [false, false, false, false, false, false, false],
        bestTotalGenLvs: D(0),
        timeSinceBuyableBought: D(0),
        prestige: D(0),
        prestigeCount: D(0),
        prestigeCountInTrans: D(0),
        prestigeEssence: D(0),
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
        ascend: D(0),
        ascendCount: D(0),
        ascendGems: D(0),
        ascendUpgrades: [],
        ascendUpgAuto: false,
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
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false]
        ],
        setbackUpgradeSelected: null,
        setbackUpgrades: [],
        generatorFeatures: {
            xp: D(0),
            buyable: [D(0), D(0)],
            enhancer: D(0),
            totalEnh: D(0),
            enhancerBuyables: [D(0), D(0), D(0)],
            enhanceCount: D(0)
        },
        transcendPoints: D(0),
        transcendPointTotal: D(0),
        transcendResetCount: D(0),
        transcendUpgrades: [],
        transcendUpgradesUnlocked: {}, // FILL THIS WITH VALUES
        transcendInSpecialReq: [null, null],
        perksUsed: []
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
        tab: 0,
        statTab: 0,
        mainTab: 0,
        prestigeTab: 0,
        ascendTab: 0,
        setbackTab: 0,
        setbackDimTab: 0,
        transTab: 0,
        factors: {},
        timeSpeedTiers: [D(1)],
        pointGen: D(1),
        buyables: [],
        bybBoostInterval: D(100),
        bybBoostEffect: D(2),
        bybBoostCost: D(2),
        pc11Eff: D(1),
        prestigeAmount: D(0),
        prestigeNext: D(0),
        prestigeUsed: D(0),
        prestigeUpgradeCap: D(0),
        prestigePointEffect: D(1),
        prestigeUpgEffs: [],
        prestigeUpgDescs: [],
        prestigeChal: [],
        totalPrestigeUpgrades: D(0),
        peGain: D(0),
        peNext: D(0),
        peEffect: D(1),
        generatorSpeed: D(1),
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
        dimBoughtBM: [D(0), D(0), D(0)],
        quarkNames: ['red', 'green', 'blue', 'yellow'],
        quarkNamesC: ['Red', 'Green', 'Blue', 'Yellow'],
        quarkColors: ['FF0000', '00FF00', '0000FF', 'FFFF00'],
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
        },
        transcendReq: D(0),
        transcendAmount: D(0),
        transcendNext: D(0),
        transcendUsed: D(0),
        transcendEffect: D(1),
        transcendResetEffect: D(1),
        transEffs: [],
        transSelectedUpg: []
    }
    obj.buyables = resetMainBuyables()
    for (let i = PRESTIGE_CHALLENGES.length - 1; i >= 0; i--) {
        obj.prestigeChal[i] = {
            entered: false,
            trapped: false,
            depth: D(0)
        }
    }
    obj.generatorFeatures.genXPBuyables = resetGenXPBuyables()
    obj.generatorFeatures.genEnhBuyables = resetGenEnhBuyables()
    obj.transEffs = resetTransUpgBuyables()
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

function resetTransUpgBuyables() {
    const arr = []
    for (let i = 0; i < TRANSCENSION_UPGRADES.length; i++) {
        arr.push([])
        for (let j = 0; j < TRANSCENSION_UPGRADES[i].length; j++) {
            arr[i].push(D(0))
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

function updatePlayer() {
    if (player.version === 0) {
        delete player.tab
        delete player.statTab
        delete player.mainTab
        delete player.prestigeTab
        delete player.ascendTab
        delete player.setbackTab
        delete player.setbackDimTab
        player.version = 1
    }
    if (player.version === 1) {
        player.bestTotalGenLvs = D(0)
        player.version = 2
    }
    if (player.version === 2) {
        player.generatorFeatures.totalEnh = D(0)
        player.version = 3
    }
    if (player.version === 3) {
        player.transcendPoints = D(0)
        player.transcendPointTotal = D(0)
        player.transcendResetCount = D(0)
        player.transcendUpgrades = []
        player.bestPointsInTranscend = D(0)
        player.version = 4
    }
    if (player.version === 4) {
        player.timeInTranscension = D(0)
        player.version = 5
    }
    if (player.version === 5) {
        player.buyableInTranscension = [false, false, false, false, false, false]
        player.version = 6
    }
    if (player.version === 6) {
        player.prestigeCount = D(0)
        player.ascendCount = D(0)
        player.enhanceCount = D(0)
        player.prestigeCountInTrans = D(0)
        player.version = 7
    }
    if (player.version === 7) {
        player.transcendUpgradesUnlocked = {}
        player.version = 8
    }
    if (player.version === 8) {
        player.transcendInSpecialReq = [null, null]
        player.version = 9
    }
    if (player.version === 9) {
        player.perksUsed = []
        player.version = 10
    }
    if (player.version === 10) {
        player.ascendUpgAuto = false
        player.version = 11
    }
    if (player.version === 11) {

        // player.version = 12
    }
    if (player.version === 12) {

        // player.version = 13
    }
    if (player.version === 13) {

        // player.version = 14
    }
}

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

    updatePlayer()

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
    try {
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

        initHTML_transcend()
        initHTML_generatorExtras()
        initHTML_setback()
        initHTML_ascend()
        initHTML_prestige()
        initHTML_main()
        initHTML_stats()
        initHTML_textbook()

        draw = document.getElementById('draw');
        pen = draw.getContext("2d");
        initDots()
    } catch(e) {
        document.body.innerHTML = `
            <span style="font-size: 12px; text-align: center" class="whiteText font flex-vertical">
                <b>Frick.</b>&nbsp;An error has occurred during start up of the game!<br><br>
                ${e}<br><br>
                Check the console by right click → Inspect, or by pressing Ctrl + Shift + I (Windows).
            </span>
        `
        console.error(e)
        throw new Error('stopped.')
    }
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
        updateGame_transcend()
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
    updateHTML_transcend()
    updateHTML_generatorExtras()      
    updateHTML_setback()
    updateHTML_ascend()
    updateHTML_prestige()
    updateHTML_main()
    updateHTML_stats()
    updateHTML_textbook()

    html["points"].setTxt(`${format(player.points, 2)}`)
    html["pointsPerSecond"].setTxt(`${format(tmp.pointGen, 2)}/s`)

    const trappedArr = []
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        if (tmp.prestigeChal[i].trapped) {
            trappedArr.push(`<span style="color: #0080ff"><b>PC${i + 1}</b>: ${PRESTIGE_CHALLENGES[i].name}${tmp.prestigeChal[i].depth.neq(1) ? ' <b>×' + format(tmp.prestigeChal[i].depth) + '</b>' : ''}</span>`)
        }
    }
    const enteredArr = []
    txt = ``
    if (player.prestigeChallenge !== null) {
        enteredArr.push(`<span style="color: #0080ff"><b>PC${player.prestigeChallenge + 1}</b>: ${PRESTIGE_CHALLENGES[player.prestigeChallenge].name}</span>`)
    }
    if (player.inSetback) {
        enteredArr.push(`<span style="color: #${new Decimal(player.setback[0]).mul(12).add(128).toNumber().toString(16)}${new Decimal(player.setback[1]).mul(12).add(128).toNumber().toString(16)}${new Decimal(player.setback[2]).mul(12).add(128).toNumber().toString(16)}"><b>Setback</b> (${format(player.setback[0])}, ${format(player.setback[1])}, ${format(player.setback[2])})</span>`)
    }
    if (player.currentHinderance !== null) {
        enteredArr.push(`<span style="color: #ff0020"><b>H${player.currentHinderance + 1}</b>: ${HINDERANCES[player.currentHinderance].name}</span>`)
    }
    if (enteredArr.length === 0) {
        txt = `You currently have no obstructions.`
    } else if (enteredArr.length === 1) {
        txt = `You have entered ${enteredArr[0]}.`
    } else if (enteredArr.length === 2) {
        txt = `You have entered ${enteredArr[0]} and ${enteredArr[1]}.`
    } else {
        txt = `You have entered `
        for (let i = 0; i < enteredArr.length - 1; i++) {
            txt += `${enteredArr[i]}, `
        }
        txt += `and ${enteredArr[enteredArr.length - 1]}.`
    }
    if (trappedArr.length > 0) {
        txt += `<br>You are trapped in `
        if (trappedArr.length === 1) {
            txt += `${trappedArr[0]}.`
        } else if (trappedArr.length === 2) {
            txt += `${trappedArr[0]} and ${trappedArr[1]}`
        } else {
            txt += ``
            for (let i = 0; i < trappedArr.length - 1; i++) {
                txt += `${trappedArr[i]}, `
            }
            txt += `and ${trappedArr[trappedArr.length - 1]}`
        }
    }

    html['chalList'].setHTML(txt)
}

function calcTimeSpeed() {
    // tier 2 timespeed multiplies tier 1 timespeed
    
    tmp.factors.tier1Time = []
    tmp.timeSpeedTiers[0] = D(1)
    addStatFactor('tier1Time', `Base`, `×`, 1, tmp.timeSpeedTiers[0])
    if (player.transcendUpgrades.includes('prest1')) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].mul(2)
        addStatFactor('tier1Time', `Trans. Upg. "Double the speed?"`, `×`, 2, tmp.timeSpeedTiers[0])
    }
    if (tmp.prestigeChal[11].depth.gt(0)) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].div(tmp.prestigeChal[11].depth.pow_base(1e3))
        addStatFactor('tier1Time', `PC12`, `/`, tmp.prestigeChal[11].depth.pow_base(1e3), tmp.timeSpeedTiers[0])
    }
}

function addStatFactor(type, name, desc, eff, result) {
    if (tmp.tab !== -1) {
        if (tmp.statTab !== 1) {
            return;
        }
    }
    if (tmp.factors[type] === undefined) {
        tmp.factors[type] = []
    }
    tmp.factors[type].push(`${name}: ${desc}${eff !== null ? format(eff, 3) : ''} → ${format(result, 2)}`)
}

let shiftDown = false;
let ctrlDown = false;

document.onkeydown = function (e) {
    shiftDown = e.shiftKey;
    ctrlDown = e.ctrlKey;
};

document.onkeyup = function (e) {
    shiftDown = e.shiftKey;
    ctrlDown = e.ctrlKey;
};