"use strict";
// ! Ultimate Goal:
// ! Make inflation hard to do -- To test all currencies, try raising the third exponent by 2 (dilate true, dilateStage 2, dilateValue 2) to see what happens, it should stay stable
// ! Challenge: try to not use any softcaps/scalings!
/*
player.cheats.dilate = true;
player.cheats.dilateStage = 2;
player.cheats.dilateValue = D(2);
*/

// START GAME LOGIC
const saveID = "restraint_inc_tearonq";
function initPlayer() {
    return {
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
        time2ndInAscend: D(0),
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
        specialBuyables: [D(0)],
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
            D(0), D(0), D(0),
            D(0), D(0), D(0)
        ],
        prestigeFluid: D(0),
        prestigeFluidUpgs: [
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0),
            D(0), D(0), D(0)
        ],
        prestigeBuyablePoints: [
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0),
            D(0), D(0), D(0)
        ],
        prestigeChallenge: null,
        prestigeChallengeCompleted: [],
        prestigeChallengeRepeat: null,
        prestigeChallengeRepCompleted: [],
        prestigeChalRepeatSave: {
            transcendPoints: D(0),
            transcendResetCount: D(0),
            transcendUpgrades: [],
        },
        prestigeUpgradesInCurrentAscension: false,
        darts: D(0),
        hinderanceScore: [D(0), D(0), D(0), D(0), D(0)],
        bestHinderanceScore: [D(0), D(0), D(0), D(0), D(0)],
        currentHinderance: null,
        ascend: D(0),
        ascendCount: D(0),
        ascendGems: D(0),
        ascendUpgrades: [],
        ascendUpgAuto: false,
        setback: [D(0), D(0), D(0), D(0)],
        currentSetback: null,
        setbackLoadout: [],
        inSetback: false,
        setbackQuarks: [D(0), D(0), D(0), D(0)],
        setbackEnergy: [D(0), D(0), D(0), D(0)],
        quarkDimsBought: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAutobought: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAccumulated: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAuto: [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false]
        ],
        setbackUpgradeSelected: null,
        setbackUpgrades: [],
        setbackPriority: [D(0), D(0), D(0), D(0)],
        bestSetbackPriority: [D(0), D(0), D(0), D(0)],
        genXPAuto: false,
        generatorFeatures: {
            xp: D(0),
            buyable: [D(0), D(0), D(0)],
            enhancer: D(0),
            totalEnh: D(0),
            enhancerBuyables: [D(0), D(0), D(0), D(0), D(0), D(0)],
            enhanceCount: D(0),
            advance: D(0),
            totalAdv: D(0),
            advanceUpgsChosen: []
        },
        transcendPoints: D(0),
        transcendPointTotal: D(0),
        transcendResetCount: D(0),
        transcendUpgrades: [],
        transcendUpgradesUnlocked: {}, // FILL THIS WITH VALUES
        transcendInSpecialReq: null,
        replicators: D(1),
        bestReplicators: D(1),
        replirank: D(0),
        replirankPoints: D(0),
        replirankBuyables: [D(0), D(0), D(0), D(0)],
        replitier: D(0),
        replitierPoints: D(0),
        replitetr: D(0),
        replitetrPoints: D(0),
        replispawns: D(0),
        repliupgrades: [],
        perksUsed: []
    };
}
function initTmp() {
    return {
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
        timeSpeedTiers: [D(1), D(1)],
        inAnyChallenge: false,
        pointGen: D(1),
        buyables: resetMainBuyables(),
        basicBuyableEnabled: resetBuyableEnable(),
        basicBuyableAutobData: resetBuyableAuto(),
        tierEffectBase: D(1),
        bybBoostInterval: D(100),
        bybBoostEffect: D(2),
        bybBoostCost: D(2),
        autoPrestige: false,
        prestigePointGain: D(0),
        prestigePointNext: D(0),
        prestigePointEffect: D(1),
        prestigePointEffectNext: D(1),
        prestigePointsUsed: D(0),
        prestigeUpgCap: D(0),
        prestigeUpgEffs: [],
        prestigeUpgLevels: [],
        prestigeUpgDescs: [],
        prestigeChal: resetPrestigeChalEffs(),
        prestigeRepeatChal: resetPrestigeChalRepeatEffs(),
        prestigeIsUpg: true,
        prevPrestigeIsUpg: false,
        totalPrestigeUpg: D(0),
        peGain: D(0),
        peNext: D(0),
        peEffect: D(1),
        peEffectNext: D(1),
        pfUsed: D(0),
        pfGain: D(0),
        pfNext: D(0),
        pfEffect: D(1),
        pfEffectNext: D(1),
        pfUpgData: resetPFUpgData(),
        generatorSpeed: D(1),
        autoAscend: false,
        ascendBuyables: resetAscendBuyables(),
        ascendPointGain: D(0),
        ascendPointNext: D(0),
        ascendPointEffect: D(0),
        ascendPointEffectNext: D(0),
        dartGain: D(0),
        dartEffect: D(1),
        setbackTotalStacks: [],
        setbackEffects: resetSetbackEffects(),
        projectedEffects: [],
        predictedQuarkGain: [],
        predictedQuarkTotal: D(0),
        trueQuarkGain: [],
        trueQuarkTotal: D(0),
        quarkDim: [[], [], [], []],
        quarkMultPer: D(2),
        quarkBoostInterval: D(100),
        quarkBoostEffect: D(1),
        quarkBoostCost: D(2),
        quarkEffs: [],
        energyEffs: [],
        dimBoughtBM: [],
        quarkDimAutoData: resetQuarkDimAuto(),
        setbackPriorityData: resetSetbackPrioOnChange(),
        quarkNames: ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'],
        quarkNamesC: ['Red', 'Green', 'Blue', 'Cyan', 'Magenta', 'Yellow'],
        quarkColors: ['FF0000', '00FF00', '0000FF', '00FFFF', 'FF00FF', 'FFFF00'],
        // reuse array here
        quarkColorsCalc: resetQuarkColors(['FF0000', '00FF00', '0000FF', '00FFFF', 'FF00FF', 'FFFF00']),
        sbSelectedUpg: [],
        generatorFeatures: {
            gain: D(0),
            genXPBuyables: resetGenXPBuyables(),
            xpEffGenerators: D(1),
            xpEffPoints: D(1),
            enhancerGain: D(0),
            enhancerNext: D(0),
            enhancerEff: D(1),
            genEnhBuyables: resetGenEnhBuyables(),
            advanceGain: D(0),
            advanceNext: D(0),
            advanceEff: D(1)
        },
        hinderances: resetHinderanceEffs(),
        transcendReq: D(0),
        transcendAmount: D(0),
        transcendNext: D(0),
        transcendUsed: D(0),
        transcendEffect: D(1),
        transcendEffectNext: D(1),
        transcendResetEffect: D(1),
        transcendResetEffectMilestone: D(1),
        transEffs: resetTransUpgBuyables(),
        transSelectedUpg: [],
        replicatorSpd: D(1),
        replicatorStrength: D(1),
        replicatorEff: D(1),
        replicatorTrueSpdDisp1: D(1),
        replicatorTrueSpdDisp2: D(1),
        repliRankPointGen: D(0),
        repliRankReq: D(Infinity),
        repliRankTarget: D(0),
        repliRankEffect: D(0),
        repliRankBuyables: resetRepliRankBuyables(),
        anticap: {
            softcaps: [],
            scalings: [],
            powerGain: D(0),
            powerNext: D(0),
            energyGain: D(0),
            energyExp: D(1),
            energyEffs: [D(1), D(1), D(0), D(1), D(1)]
        }
    };
}

function resetMainBuyables() {
    const arr = [];
    for (let i = 0; i < player.buyables.length; i++) {
        arr[i] = {
            effective: D(0),
            effect: D(0),
            cost: D(10),
            effectBase: D(0),
            costSpeed: D(1),
            target: D(0),
            genLevels: D(0),
            genEffect: D(1),
            tierLevels: D(0),
            tierEffect: D(1),
            canBuy: false,
        };
    }
    return arr;
}

function resetBuyableEnable() {
    const arr = [];
    for (let i = 0; i < player.buyables.length; i++) {
        arr[i] = false;
    }
    return arr;
}

function resetBuyableAuto() {
    const arr = [];
    for (let i = 0; i < player.buyables.length; i++) {
        arr[i] = D(0);
    }
    return arr;
}

function resetPrestigeChalEffs() {
    const arr = [];
    for (let i = PRESTIGE_CHALLENGES.length - 1; i >= 0; i--) {
        arr[i] = {
            entered: false,
            trapped: false,
            effects: {},
            depth: D(0)
        };
    }
    return arr;
}

function resetPrestigeChalRepeatEffs() {
    const arr = [];
    for (let i = PRESTIGE_CHALLENGES_REPEAT.length - 1; i >= 0; i--) {
        arr[i] = {
            entered: false,
            trapped: false,
            effects: {},
            depth: D(0),
            goal: D(Infinity),
            target: D(0),
            shown: false,
            rewardEffs: {}
        };
    }
    return arr;
}

function resetPFUpgData() {
    const arr = [];
    for (let i = 0; i < player.prestigeUpgrades.length; i++) {
        arr[i] = {
            effect: D(1),
            effectNext: D(1),
            cost: D(1),
            priorCost: D(0),
            target: D(0),
            canBuy: false,
        };
    }
    return arr;
}

function resetAscendBuyables() {
    const arr = [];
    for (let i = ASCENSION_UPGRADES.length - 1; i >= 0; i--) {
        arr[i] = {
            eff: D(0),
            cost: D(1),
            target: D(0),
            canBuy: false
        };
    }
    return arr;
}

function resetSetbackEffects() {
    const arr = [];
    for (let i = 0; i < SETBACK_CALC.difficulty.length; i++) {
        arr.push(SETBACK_CALC.difficulty[i](0));
    }
    return arr;
}

function resetSetbackPrioOnChange() {
    const arr = [];
    for (let i = 0; i < SETBACK_CALC.energy.length; i++) {
        arr.push({
            effPrio: D(0),
            cost: D(Infinity),
            nextCost: D(Infinity),
            target: D(0),
            plus1: SETBACK_CALC.energy[i](0),
            minus1: SETBACK_CALC.energy[i](0)
        });
    }
    return arr;
}

function resetQuarkColors(colors) {
    const arr = [];
    for (let i = 0; i < player.quarkDimsBought.length; i++) {
        arr.push({
            yes: {
                border: `${colorChange(colors[i], 1.0, 1.0)}`,
                bg: `${colorChange(colors[i], 0.5, 1.0)}80`,
            },
            no: {
                border: `${colorChange(colors[i], 0.5, 1.0)}`,
                bg: `${colorChange(colors[i], 0.25, 1.0)}80`,
            }
        });
    }
    return arr;
}

function resetQuarkDimAuto() {
    const arr = [];
    for (let i = 0; i < player.quarkDimsBought.length; i++) {
        arr.push([]);
    }
    for (let i = 0; i < player.quarkDimsBought.length; i++) {
        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            arr[i].push({ enabled: false, spd: D(0) });
        }
    }
    return arr;
}

function resetHinderanceEffs() {
    const arr = [];
    for (let i = HINDERANCES.length - 1; i >= 0; i--) {
        arr[i] = {
            entered: false,
            trapped: false,
            effects: {},
            depth: D(0)
        };
    }
    return arr;
}

function resetGenXPBuyables() {
    const arr = [];
    for (let i = 0; i < player.generatorFeatures.buyable.length; i++) {
        arr[i] = {
            eff: D(0),
            cost: D(1),
            target: D(0),
            canBuy: false
        };
    }
    return arr;
}

function resetGenEnhBuyables() {
    const arr = [];
    for (let i = 0; i < player.generatorFeatures.enhancerBuyables.length; i++) {
        arr[i] = {
            eff: D(0),
            cost: D(1),
            target: D(0),
            canBuy: false
        };
    }
    return arr;
}

function resetTransUpgBuyables() {
    const arr = [];
    for (let i = 0; i < TRANSCENSION_UPGRADES.length; i++) {
        arr.push([]);
        for (let j = 0; j < TRANSCENSION_UPGRADES[i].length; j++) {
            arr[i].push(D(0));
        }
    }
    return arr;
}

function resetRepliRankBuyables() {
    const arr = [];
    for (let i = 0; i < player.replirankBuyables.length; i++) {
        arr[i] = {
            eff: D(0),
            cost: D(1),
            target: D(0),
            canBuy: false
        };
    }
    return arr;
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

const html = [];
const dots = [];
let player = initPlayer();
let tmp = initTmp();
let draw;
let pen;
let gameTick;
const gameVars = {
    timeUntilSave: 5,
    delta: 0,
    offlineTimeFailed: false,
    saveDisabled: false
};

function updatePlayer() {
    if (player.version === 0) {
        delete player.tab;
        delete player.statTab;
        delete player.mainTab;
        delete player.prestigeTab;
        delete player.ascendTab;
        delete player.setbackTab;
        delete player.setbackDimTab;
        player.version = 1;
    }
    if (player.version === 1) {
        player.bestTotalGenLvs = D(0);
        player.version = 2;
    }
    if (player.version === 2) {
        player.generatorFeatures.totalEnh = D(0);
        player.version = 3;
    }
    if (player.version === 3) {
        player.transcendPoints = D(0);
        player.transcendPointTotal = D(0);
        player.transcendResetCount = D(0);
        player.transcendUpgrades = [];
        player.bestPointsInTranscend = D(0);
        player.version = 4;
    }
    if (player.version === 4) {
        player.timeInTranscension = D(0);
        player.version = 5;
    }
    if (player.version === 5) {
        player.buyableInTranscension = [false, false, false, false, false, false];
        player.version = 6;
    }
    if (player.version === 6) {
        player.prestigeCount = D(0);
        player.ascendCount = D(0);
        player.enhanceCount = D(0);
        player.prestigeCountInTrans = D(0);
        player.version = 7;
    }
    if (player.version === 7) {
        player.transcendUpgradesUnlocked = {};
        player.version = 8;
    }
    if (player.version === 8) {
        player.transcendInSpecialReq = null;
        player.version = 9;
    }
    if (player.version === 9) {
        player.perksUsed = [];
        player.version = 10;
    }
    if (player.version === 10) {
        player.ascendUpgAuto = false;
        player.version = 11;
    }
    if (player.version === 11) {
        player.setback[3] = D(0);
        player.quarkDimsBought[3] = [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)];
        player.quarkDimsAutobought[3] = [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)];
        player.quarkDimsAccumulated[3] = [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)];
        player.quarkDimsAuto[3] = [false, false, false, false, false, false, false, false];
        player.version = 12;
    }
    if (player.version === 12) {
        player.genXPAuto = false;
        player.bestHinderanceScore = [D(0), D(0), D(0)];
        player.genEnhGenerate = false;
        player.version = 13;
    }
    if (player.version === 13) {
        player.specialBuyables = [D(0)];
        player.version = 14;
    }
    if (player.version === 14) {
        player.hinderanceScore[3] = D(0);
        player.bestHinderanceScore[3] = D(0);
        player.version = 15;
    }
    if (player.version === 15) {
        player.generatorFeatures.buyable[2] = D(0);
        player.generatorFeatures.enhancerBuyables[3] = D(0);
        player.generatorFeatures.enhancerBuyables[4] = D(0);
        player.generatorFeatures.enhancerBuyables[5] = D(0);
        player.version = 16;
    }
    if (player.version === 16) {
        player.generatorFeatures.advance = D(0);
        player.generatorFeatures.totalAdv = D(0);
        player.generatorFeatures.advanceUpgsChosen = [];
        player.version = 17;
    }
    if (player.version === 17) {
        player.hinderanceScore[4] = D(0);
        player.bestHinderanceScore[4] = D(0);
        player.version = 18
    }
    if (player.version === 18) {
        player.specialBuyables[1] = D(0);
        player.version = 19;
    }
    if (player.version === 19) {
        if (player.prestigeChallenge >= 13) {
            togglePrestigeChallenge(player.prestigeChallenge);
        }
        player.prestigeChallengeCompleted = player.prestigeChallengeCompleted.filter((val) => val <= 12);
        player.version = 20;
    }
    if (player.version === 20) {
        delete player.specialBuyables[1];
        player.version = 21;
    }
    if (player.version === 21) {
        player.replicators = D(1);
        player.replirank = D(0);
        player.replitier = D(0);
        player.replitetr = D(0);
        player.replispawns = D(0);
        player.repliupgrades = [];
        player.version = 22;
    }
    if (player.version === 22) {
        player.replirankBuyables = [D(0), D(0), D(0), D(0)];
        player.version = 23;
    }
    if (player.version === 23) {
        player.replirankPoints = D(0);
        player.replitierPoints = D(0);
        player.replitetrPoints = D(0);
        
        player.version = 24;
    }
    if (player.version === 24) {
        player.bestReplicators = D(1);

        player.version = 25;
    }
    if (player.version === 25) {
        player.prestigeUpgrades[15] = D(0);
        player.prestigeUpgrades[16] = D(0);
        player.prestigeUpgrades[17] = D(0);

        player.version = 26;
    }
    if (player.version === 26) {
        player.setbackPriority = [D(0), D(0), D(0), D(0)];

        player.version = 27;
    }
    if (player.version === 27) {
        player.bestSetbackPriority = [D(0), D(0), D(0), D(0)];

        player.version = 28;
    }
    if (player.version === 28) {
        player.time2ndInAscend = D(0);

        player.version = 29;
    }
    if (player.version === 29) {
        player.prestigeFluid = D(0);
        player.prestigeFluidUpgs = [
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0),
            D(0), D(0), D(0)
        ];

        player.version = 30;
    }
    if (player.version === 30) {
        player.prestigeChallengeRepeat = null;
        player.prestigeChallengeRepCompleted = [D(0), D(0), D(0), D(0)];

        player.version = 31;
    }
    if (player.version === 31) {
        player.prestigeChalRepeatSave = {
            transcendPoints: D(0),
            transcendResetCount: D(0),
            transcendUpgrades: [],
        }

        player.version = 32;
    }
    if (player.version === 32) {
        player.prestigeBuyablePoints = [
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0), 
            D(0), D(0), D(0),
            D(0), D(0), D(0)
        ];

        player.version = 33;
    }
    if (player.version === 33) {
        player.prestigeChallengeRepCompleted[4] = D(0);
        
        player.version = 34;
    }
    if (player.version === 34) {

        // player.version = 35;
    }
}

function loadGame() {
    player = initPlayer();
    tmp = initTmp();

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

    updatePlayer();

    initHTML();

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

    doGameLoopTicksLol();
}

function initHTML() {
    document.body.style.backgroundColor = "#000000";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";
    try {
        toHTMLvar('offlineTime');
        toHTMLvar('inGame');
        toHTMLvar('offlineTimeProgress');
        toHTMLvar('offlineTimeProgressBar');
        toHTMLvar('offlineTimeProgressBarBase');
        toHTMLvar('offlineTimeDisplay');
        toHTMLvar('offlineTimeView');
        toHTMLvar('popup-container');

        html['inGame'].setDisplay(false);
        html['offlineTime'].setDisplay(false);

        toHTMLvar('points');
        toHTMLvar('pointsPerSecond');
        toHTMLvar('chalList');

        initHTML_anticap();
        initHTML_replicators();
        initHTML_transcend();
        initHTML_genAdvances();
        initHTML_genEnhancers();
        initHTML_genXP();
        initHTML_hinderance();
        initHTML_setback();
        initHTML_ascend();
        initHTML_prestigeRepChal();
        initHTML_prestigeChallenges();
        initHTML_prestigeFluid();
        initHTML_prestige();
        initHTML_main();
        initHTML_stats();
        initHTML_textbook();

        draw = document.getElementById('draw');
        pen = draw.getContext("2d");
        initDots();
    } catch(e) {
        document.getElementById("error").innerHTML = `
            <span style="font-size: 12px; text-align: center" class="whiteText font flex-vertical">
                <b>Frick.</b>&nbsp;An error has occurred during start up of the game!<br><br>
                ${e}<br><br>
                Check the console by right click → Inspect, or by pressing Ctrl + Shift + I (Windows).
            </span>
        `;

        console.error(e);
        throw new Error('stopped.');
    }
}

let gameStopped = false;

let sessionTime = 0;
let delta = 0;

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
    gameTick = setInterval(gameLoop, 20);
}

function doOfflineTime() {
    if (gameVars.offlineTimeFailed) {
        return;
    }
    for (let i = 0; i < Math.min(tmp.offlineTime.tickRemaining, 32); i++) {
        try {
            gameLoop();
            tmp.offlineTime.tickRemaining -= 1;
        } catch(e) {
            console.error(`Offline time couldn't be done!`);
            console.error(e);
            gameVars.offlineTimeFailed = true;
            return;
        }
    }

    html['inGame'].setDisplay(false);
    html['offlineTime'].setDisplay(true);

    html['offlineTimeDisplay'].setTxt(`Ticks: ${format(tmp.offlineTime.tickRemaining)} / ${format(tmp.offlineTime.tickMax)} (${formatTime(tmp.offlineTime.tickRemaining * tmp.offlineTime.tickLength)} / ${formatTime(tmp.offlineTime.tickMax * tmp.offlineTime.tickLength)})`);
    html['offlineTimeProgressBar'].changeStyle('width', `${100 * (1 - (tmp.offlineTime.tickRemaining / tmp.offlineTime.tickMax))}%`);

    let txt = ``;

    txt += `<b><span>You have ${format(player.points)} points. (+${format(tmp.pointGen)}/s)</span></b>`;
    if (player.prestigeChallengeCompleted.includes(0)) {
        txt += `<span style="color: #80ffa0">Your total generator levels are ${format(tmp.buyables.reduce((accumulator, current) => { return Decimal.add(accumulator, current.genLevels) }, tmp.buyables[0]))}.</span>`;
        txt += `<span style="color: #80ffa0">Your best generator level is ${format(tmp.buyables.reduce((accumulator, current) => { return Decimal.max(accumulator, current.genLevels) }, tmp.buyables[0]))}.</span>`;
    }
    if (Decimal.gte(tmp.generatorFeatures.genEnhBuyables[2].eff, 1)) {
        txt += `<span style="color: #ffa080">Your total tier levels are ${format(tmp.buyables.reduce((accumulator, current) => { return Decimal.add(accumulator, current.tierLevels) }, tmp.buyables[0]))}.</span>`;
        txt += `<span style="color: #ffa080">Your best tier level is ${format(tmp.buyables.reduce((accumulator, current) => { return Decimal.max(accumulator, current.tierLevels) }, tmp.buyables[0]))}.</span>`;
    }

    if (hasSetbackUpgrade('r10')) {
        txt += `<br>`;
        txt += `<b><span style="color: #ffc080">You have ${format(player.generatorFeatures.xp)} generator experience. (+${format(tmp.generatorFeatures.gain)}/s)</span></b>`;
    }
    if (Decimal.gt(player.generatorFeatures.totalEnh, 0)) {
        txt += `<span style="color: #ffff80">You have ${format(player.generatorFeatures.enhancer)} generator enhancers. (+${format(tmp.generatorFeatures.enhancerGain)})</span>`;
    }
    if (Decimal.gt(player.generatorFeatures.enhancerBuyables[5], 0)) {
        txt += `<span style="color: #80ffff">You have ${format(player.generatorFeatures.advance)} generator advances. (+${format(tmp.generatorFeatures.advanceGain)})</span>`;
    }

    if (player.generatorFeatures.advanceUpgsChosen.includes(1)) {
        txt += `<br>`;
        txt += `<b><span style="color: #ff80c0">You have ${format(player.replicators)} replicators. (&times;${format(tmp.replicatorTrueSpdDisp2, 3)}/s)</span></b>`;
        txt += `<span style="color: #ff80c0">You have ${format(player.replirankPoints)} rank points. (+${format(tmp.repliRankPointGen)}/s)</span>`;
    }

    txt += `<br>`;
    txt += `<b><span style="color: #80c0ff">You have ${format(player.prestige)} prestige points. (+${format(tmp.prestigePointGain)})</span></b>`;
    if (hasSetbackUpgrade('b1')) {
        txt += `<span style="color: #80c0ff">You have ${format(player.prestigeEssence)} prestige essence. (+${format(tmp.peGain)})</span>`;
    }
    if (hasSetbackUpgrade(`b6`)) {
        txt += `<span style="color: #80a0ff">You have ${format(player.prestigeFluid)} prestige fluid. (+${format(tmp.pfGain)})</span>`;
    }
    
    if (Decimal.gte(player.bestPointsInAscend, 1e21) || Decimal.gt(player.ascend, 0)) {
        txt += `<br>`;
        txt += `<b><span style="color: #80ff80">You have ${format(player.ascend)} ascension points. (+${format(tmp.ascendPointGain)})</span></b>`;
        txt += `<span style="color: #80ff80">You have ${format(player.ascendGems)} ascension gems. (+${format(tmp.ascendPointEffect)}/s)</span>`;
    }

    if (player.currentSetback != null) {
        for (let i = 0; i < SETBACK_CALC.shown.length; i++) {
            if (SETBACK_CALC.shown[i]()) {
                txt += `<span style="color: ${colorChange(tmp.quarkColors[i], 1.0, 0.5)}">You have ${format(player.setbackEnergy[i])} ${tmp.quarkNames[i]} energy.</span>`;
            }
        }
    }

    if (Decimal.gt(player.transcendPointTotal, 0)) {
        txt += `<br>`;
        txt += `<b><span style="color: #a080ff">You have ${format(player.transcendPoints)} transcension points. (+${format(tmp.transcendAmount)})</span></b>`;
    }

    html['offlineTimeView'].setHTML(txt);

    if (tmp.offlineTime.tickRemaining > 0) {
        window.setTimeout(doOfflineTime, 0);
    } else {
        tmp.offlineTime.active = false;
        doGameLoopTicksLol();
    }
} 

function gameLoop() {
    if (gameStopped) {
        return;
    }

    delta = (Date.now() - player.lastTick) / 1000;
    delta = Math.max(delta, 0); // for some reason, delta goes negative, and i'm really not sure why
    // happened when debugging a NaN error
    gameVars.delta = delta;
    if (!tmp.offlineTime.active) {
        player.lastTick = Date.now();
        if (delta >= 10) {
            tmp.offlineTime.active = true;
            tmp.offlineTime.tickMax = Math.floor(delta / tmp.offlineTime.tickLength);
            if (tmp.offlineTime.tickMax > 1024) {
                tmp.offlineTime.tickLength = tmp.offlineTime.tickLength * (tmp.offlineTime.tickMax / 1024);
                tmp.offlineTime.tickMax = tmp.offlineTime.tickMax / (tmp.offlineTime.tickMax / 1024);
            }
            tmp.offlineTime.tickRemaining = tmp.offlineTime.tickMax;
            tmp.offlineTime.returnTime = sessionTime + (tmp.offlineTime.tickLength * 10);
            doOfflineTime();
            clearInterval(gameTick);
            return;
        }
    } else {
        delta = tmp.offlineTime.tickLength;
    }
    sessionTime += delta;

    // tick game
    try {
        // i rather put misc stuff here, before anything else
        tmp.inAnyChallenge = player.prestigeChallenge !== null 
            || player.inSetback 
            || player.currentHinderance !== null 
            || player.transcendInSpecialReq !== null 
            || player.prestigeChallengeRepeat !== null;

        // put challenge effects at the top because before they were closer to the middle and upon reloading you could exploit them
        updateGame_anticap();
        updateGame_prestigeRepChal();
        updateGame_hinderance();
        updateGame_setback();
        updateGame_prestigeChallenges();

        calcTimeSpeed();
        updateGame_replicators();
        updateGame_transcend();
        updateGame_genAdvances();
        updateGame_genEnhancers();
        updateGame_genXP();
        updateGame_ascend();
        updateGame_prestigeFluid();
        updateGame_prestige();
        updateGame_main();
        updateGame_stats();
    } catch(e) {
        console.error(e);
        clearInterval(gameTick);
    }

    if (!tmp.offlineTime.active) {
        html['inGame'].setDisplay(true);
        html['offlineTime'].setDisplay(false);

        updateHTML();
        diePopupsDie();
        drawing();

        gameVars.timeUntilSave -= delta;
        if (gameVars.timeUntilSave <= 0) {
            gameVars.timeUntilSave += 5;
            localStorage.setItem(saveID, LZString.compressToBase64(JSON.stringify(player)));
        }
    }
}

function updateHTML() {
    for (let i = 0; i < popupList.length; i++) {
        html[`popupID${i}`].style.opacity = `${popupList[i].opacity}`;
    }

    let txt = ``;
    updateHTML_anticap();
    updateHTML_replicators();
    updateHTML_transcend();
    updateHTML_genAdvances();
    updateHTML_genEnhancers();
    updateHTML_genXP();
    updateHTML_hinderance();
    updateHTML_setback();
    updateHTML_ascend();
    updateHTML_prestigeRepChal();
    updateHTML_prestigeChallenges();
    updateHTML_prestigeFluid();
    updateHTML_prestige();
    updateHTML_main();
    updateHTML_stats();
    updateHTML_textbook();

    html["points"].setTxt(`${format(player.points, 2)}`);
    html["pointsPerSecond"].setTxt(`${format(tmp.pointGen, 2)}/s`);

    const trappedArr = [];
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        if (tmp.prestigeChal[i].trapped) {
            trappedArr.push(`<span style="color: #0080ff"><b>PC${i + 1}</b>: ${PRESTIGE_CHALLENGES[i].name}${tmp.prestigeChal[i].depth.neq(1) ? ' <b>×' + format(tmp.prestigeChal[i].depth) + '</b>' : ''}</span>`);
        }
    }
    for (let i = 0; i < HINDERANCES.length; i++) {
        if (tmp.hinderances[i].trapped) {
            trappedArr.push(`<span style="color: #ff0020"><b>H${i + 1}</b>: ${HINDERANCES[i].name}${tmp.hinderances[i].depth.neq(1) ? ' <b>×' + format(tmp.hinderances[i].depth) + '</b>' : ''}</span>`);
        }
    }
    if (tmp.setbackTotalStacks.length >= 1) {
        // this works for now but it might not work later, idk
        // this hack
        for (let i = player.inSetback ? 1 : 0; i < tmp.setbackTotalStacks.length; i++) {
            trappedArr.push(displaySetbackUI(tmp.setbackTotalStacks[i]));
        }
    }
    for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
        if (tmp.prestigeRepeatChal[i].trapped) {
            trappedArr.push(`<span style="color: #0080ff"><b>PRC${i + 1}</b>: ${PRESTIGE_CHALLENGES_REPEAT[i].name}${tmp.prestigeRepeatChal[i].depth.neq(1) ? ' <b>×' + format(tmp.prestigeRepeatChal[i].depth) + '</b>' : ''}</span>`);
        }
    }

    const enteredArr = [];
    txt = ``;
    if (player.prestigeChallenge !== null) {
        enteredArr.push(`<span style="color: #0080ff"><b>PC${player.prestigeChallenge + 1}</b>: ${PRESTIGE_CHALLENGES[player.prestigeChallenge].name}</span>`);
    }
    if (player.inSetback) {
        enteredArr.push(displaySetbackUI(player.setback));
    }
    if (player.currentHinderance !== null) {
        enteredArr.push(`<span style="color: #ff0020"><b>H${player.currentHinderance + 1}</b>: ${HINDERANCES[player.currentHinderance].name}</span>`);
    }
    if (player.transcendInSpecialReq !== null) {
        enteredArr.push(`<span style="color: #8000ff"><b>${player.transcendInSpecialReq}</b></span>`);
    }
    if (player.prestigeChallengeRepeat !== null) {
        enteredArr.push(`<span style="color: #0080ff"><b>PRC${player.prestigeChallengeRepeat + 1}</b>: ${PRESTIGE_CHALLENGES_REPEAT[player.prestigeChallengeRepeat].name}</span>`);
    }
    if (player.anticap.active) {
        enteredArr.push(`<span style="color: #c0c0c0"><b>Anticap</b>: Softcap Hell</span>`);
    }
    if (enteredArr.length === 0) {
        txt = `You currently have no obstructions.`;
    } else if (enteredArr.length === 1) {
        txt = `You have entered ${enteredArr[0]}.`;
    } else if (enteredArr.length === 2) {
        txt = `You have entered ${enteredArr[0]} and ${enteredArr[1]}.`;
    } else {
        txt = `You have entered `;
        for (let i = 0; i < enteredArr.length - 1; i++) {
            txt += `${enteredArr[i]}, `;
        }
        txt += `and ${enteredArr[enteredArr.length - 1]}.`;
    }
    if (trappedArr.length > 0) {
        txt += `<br>You are trapped in `;
        if (trappedArr.length === 1) {
            txt += `${trappedArr[0]}.`;
        } else if (trappedArr.length === 2) {
            txt += `${trappedArr[0]} and ${trappedArr[1]}`;
        } else {
            txt += ``;
            for (let i = 0; i < trappedArr.length - 1; i++) {
                txt += `${trappedArr[i]}, `;
            }
            txt += `and ${trappedArr[trappedArr.length - 1]}`;
        }
    }

    html['chalList'].setHTML(txt);
}

function calcTimeSpeed() {
    // tier 2 timespeed multiplies tier 1 timespeed

    tmp.factors.tier2Time = [];
    tmp.timeSpeedTiers[1] = D(1);
    if (player.cheats.dilate) {
        tmp.timeSpeedTiers[1] = cheatDilateBoost(tmp.timeSpeedTiers[1]);
        addStatFactor('tier2Time', `Cheats`, `...`, null, tmp.timeSpeedTiers[1]);
    }

    tmp.factors.tier1Time = [];
    tmp.timeSpeedTiers[0] = D(1);
    addStatFactor('tier1Time', `Base`, `×`, 1, tmp.timeSpeedTiers[0]);

    if (player.transcendUpgrades.includes('prest1')) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].mul(2);
        addStatFactor('tier1Time', `Trans. Upg. "Double the speed?"`, `×`, 2, tmp.timeSpeedTiers[0]);
    }
    if (Decimal.gte(player.prestigeChallengeRepCompleted[1], 1)) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].mul(tmp.prestigeRepeatChal[1].rewardEffs.timeSpeed);
        addStatFactor('tier1Time', `PRC2 Reward`, `×`, tmp.prestigeRepeatChal[1].rewardEffs.timeSpeed, tmp.timeSpeedTiers[0]);
    }
    if (Decimal.gte(player.hinderanceScore[4], HINDERANCES[4].start)) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].mul(HINDERANCES[4].eff);
        addStatFactor('tier1Time', `Hinderance 5 PB`, `×`, HINDERANCES[4].eff, tmp.timeSpeedTiers[0]);
    }
    if (tmp.prestigeChal[11].depth.gt(0)) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].div(tmp.prestigeChal[11].effects.timeSpeed);
        addStatFactor('tier1Time', `PC12`, `/`, tmp.prestigeChal[11].effects.timeSpeed, tmp.timeSpeedTiers[0]);
    }

    if (player.cheats.dilate) {
        tmp.timeSpeedTiers[0] = cheatDilateBoost(tmp.timeSpeedTiers[0]);
        addStatFactor('tier1Time', `Cheats`, `...`, null, tmp.timeSpeedTiers[0]);
    }

    if (tmp.timeSpeedTiers[1].neq(1)) {
        tmp.timeSpeedTiers[0] = tmp.timeSpeedTiers[0].mul(tmp.timeSpeedTiers[1]);
        addStatFactor('tier1Time', `Tier 2 Time Speed`, `×`, tmp.timeSpeedTiers[1], tmp.timeSpeedTiers[0]);
    }

    if (tmp.prestigeRepeatChal[2].depth.gt(0)) {
        tmp.timeSpeedTiers[0] = new Decimal(1);
        addStatFactor('tier1Time', `PRC3`, `...`, null, tmp.timeSpeedTiers[0]);
    }
}

function addStatFactor(type, name, desc, eff, result) {
    if (tmp.tab !== -1) {
        return;
    }
    if (tmp.statTab !== 1) {
        return;
    }
    if (tmp.factors[type] === undefined) {
        tmp.factors[type] = [];
    }
    tmp.factors[type].push(`${name}: ${desc}${eff !== null ? format(eff, 3) : ''} → ${format(result, 2)}`);
}

let shiftDown = false;
let ctrlDown = false;

document.onkeydown = function (e) {
    shiftDown = e.shiftKey;
    // there *is* a way to cheese the challenge but i'm not telling you how, just that it is possible
    if (tmp.prestigeRepeatChal[2].depth.gt(0)) {
        shiftDown = false;
    }

    ctrlDown = e.ctrlKey;
};

document.onkeyup = function (e) {
    shiftDown = e.shiftKey;
    ctrlDown = e.ctrlKey;
};