const TEXTBOOK = [
    {
        show: true,
        title: `Basics`,
        stage: `Information`,
        colors: ['#FFFFFF', '#80808080'],
        get info() {
            return `
                This is an incremental game created by TearonQ (@QnoraeT in Github).<br>
                I imposed a bit of a challenge for myself, to not use any softcaps, scalings, and the game mustn't inflate. Idk, I was bored and I tried doing something.<br>
                This game is also slower than my other incrementals, but is still pretty active. This may be comparable to randomtuba's Algebraic Progression, but with slightly more head room for optimization.<br><br>
                You can hold shift to buy max what you click on. This will not come with a confirmation!<br>
                <br>
                ▲X.XX = The exponent is raised to the power of X.XX. (ex. e1,000,000 ▲2 = e1.000 T), a.k.a. "dilation"<br>
                ■X.XX = The 2nd exponent is raised to the power of X.XX. (ex. ee1,000 ■2 = ee1,000,000) a.k.a. "siltation"<br>
                ⬟X.XX = The 3rd exponent is raised to the power of X.XX. (ex. eee100 ⬟2 = eee10,000)<br>
                <br>
                Inspired by <span style="color: #ffff80">randomtuba</span>, <span style="color: #c080ff">Jacorb</span>, <span style="color: #ff8080">MrRedShark</span>, <span style="color: #80ff80">Hevipelle</span>,and more!
            `;
        },
        enabled: false // changable, doesn't need to be saved
    },
    {
        show: true,
        title: `Buyables`,
        stage: `Unlocked instantly`,
        colors: ['#FFFFFF', '#80808080'],
        get info() {
            let txt = ``;
            for (let i = 0; i < player.buyables.length; i++) {
                if (buyableEnabled(i)) {
                    txt += `Buyable ${i+1}: Base Cost: ${format([D(2), D(20), D(500), D(10000), D(1e6), D(1e9)][i])}, which multiplies by ${i+2}× every 10 purchases. Every purchase adds +${format([D(1.0), D(0.5), D(0.25), D(0.1), D(0.05), D(0.01)][i], 2)}× to its effect.<br>`;
                }
            }
            return `
                Buyables are the game's main source of point generation. Buyables are clickable buttons that can be bought repeatedly. The basic buyables you see in this game that you see in the very start has a couple of properties, including how fast its cost scales and how much it boosts point generation.<br><br>
                There is also an extra feature attached to these basic buyables applied individually: an interval. Currently, every ${format(tmp.bybBoostInterval)} purchases, the buyable's effect increases by ${format(tmp.bybBoostEffect, 2)}×, but their cost scales ${format(tmp.bybBoostCost, 2)}× faster.<br><br>
                The basic buyables' base state are:<br>
                ${txt}
            `;
        },
        enabled: false // changable, doesn't need to be saved
    },
    {
        show: true,
        title: `Prestige`,
        stage: `Unlocked at 1,000,000 Points`,
        colors: ['#0080FF', '#00408080'],
        get info() {
            return `
                Prestige is the game's first prestige layer, go figure. You will be able to prestige when when you have reached 1,000,000 points. Prestige resets your basic buyables and your points. Prestiging gives you prestige points. Every prestige point increases the requirement for the next, where the next prestige point will usually require 10× more points.<br><br>
                You can use prestige points to purchase prestige upgrades. Upgrades can only be bought once, but they give unique effects. There is also a limit to how many prestige upgrades you can have. This way, you have to prioritize which prestige upgrades to keep. Respeccing is when you refund all prestige upgrades.<br><br>
                Exact Prestige Point gain formula: log<sub>10</sub>(x/1,000,000)
            `;
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0);
        },
        title: `Prestige Challenges`,
        stage: `Unlocked at 3 <span style="color: #80c0ff">Prestige Points</span>`,
        colors: ['#0080FF', '#00408080'],
        get info() {
            return `
                Prestige Challenges are features where you can reset and start the game with restrictions. These give rewards if you can surpass their goal and complete them. Points are used as the primary measurement for completing Prestige Challenges.<br>
                Commonly, you will see abbreviations such as "PC#" where # is the number of that prestige challenge. You can see what prestige challenge you're in by looking below your point amount.<br><br>
                <span style="color: #ffff00"><b>Warning!</b> Entering and exiting a prestige challenge will not count as an actual prestige! <b>You will not gain any prestige-related resources if you enter and exit any prestige challenge!</b></span>
            `;
        },
        enabled: false
    },
    {
        get show() {
            return player.prestigeChallengeCompleted.includes(0) || Decimal.gt(player.ascend, 0);
        },
        title: `Generators`,
        stage: `Unlocked by completing <span style="color: #80c0ff">PC1</span>`,
        colors: ['#00FF40', '#00804080'],
        get info() {
            return `
                Generators are extra features that increase each buyable's effect gradually over time.<br>
                The speed of the buyables' generators, commonly referred to as "Generator Speed" is dependent on how many purchases a buyable has and the buyable's interval.<br>
                Generator levels give a small boost to the buyable that stacks. However, their level requirements grow quickly.<br>
                Generators will be very important later.<br><br> 
                Exact requirement formula: x!
            `;
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gt(player.ascend, 0);
        },
        title: `Ascension`,
        stage: `Unlocked by reaching 1.000 Sx Points`,
        colors: ['#00FF00', '#00800080'],
        get info() {
            return `
                Ascension is the game's second prestige layer. You initally gain 1 ascension point, and every time you multiply your point amount by ${format(tmp.ascendReq)}, you gain 1,000× more ascension points. Roughly, your ascension point gain is (x/${format(tmp.ascendReq)})<sup>${format(Decimal.log(1e3, tmp.ascendReq), 4)}</sup><br>
                Ascension points create Ascension gems, which can be used to buy upgrades. However, Ascension Buyables also have other requirements that you must meet before being able to buy them.<br><br>
                Past 10 ascension points, you will unlock Setback.
            `;
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gt(player.ascend, 10);
        },
        title: `Setback`,
        stage: `Unlocked by accumulating 10 <span style="color: #80ff80">Ascension Points</span>`,
        colors: ['rainbow'],
        get info() {
            let txt = `A "setback" is a custom challenge modifier that allows you to choose how strongly you slow/restrict your game.<br>
                There are currently ${SETBACK_CALC.shown.filter((isShown) => isShown()).length} sliders that range from 0 (None) or 10 (Maximum) that can cause different effects.<br>
                Setbacks are completed once you have enough points to do an ascension reset.<br>
                <span style="color: #ffff00"> You must do an ascension reset in order to enter or complete a setback.</span><br>
            `;
            if (player.setbackLoadout.length >= 1) {
                txt += `<br><br>
                    After you have completed a setback, you will now see an item show up in your "Setback Loadout" tab. Use the item in order to extract quarks from it. The amount of quarks you gain is dependent on how strongly you imposed your setbacks, with higher restrictions equaling higher extraction rates.<br>
                    Quarks generate energy, for some odd reason. (Seems to be a common thing.) Energy passively buffs various features of the game.<br>
                    You will also see "dimensions" which are items that boost energy gain and can generate each other. This is like how basic buyables influence each other, but instead of adding to their levels, it adds to their amount over time.<br><br>
                    Dimensions are also subject to an interval, but this time, the interval's boost influences the multiplier each purchase instead of the effect itself.<br>
                    You can also see certain energy upgrades, which use different types of energy. These are more permanent boosts that influence the game, including adding new features or greatly buffing certain areas of the game, including Quality of Life (QoL).<br>
                    <b>If you feel stuck, you might be missing some upgrades. Do some setback runs, gather energy, and purchase the upgrades to continue; some upgrades are very important.</b><br><br>
                    <span style="color: #ffff00">Do note that Dimensions, Quarks, and Energy resets on Ascension resets. Your energy upgrades are not affected by this.</span><br>
                `;
            }
            let list = ``;
            if (SETBACK_CALC.shown[0]()) {
                list += `<span style="color: #FF8080">Exact Red Energy Formula: (1+log<sub>10</sub>(1+Red Energy))<sup>Every OoM^2 (1e10, 1e100, etc.), this power increases by 1, starting at 1.</sup></span><br>`;
            }
            if (SETBACK_CALC.shown[1]()) {
                list += `<span style="color: #80FF80">Exact Green Energy Formula: 1+log<sub>10</sub>(1+Green Energy)/10</span><br>`;
            }
            if (SETBACK_CALC.shown[2]()) {
                list += `<span style="color: #8080FF">Exact Blue Energy Formula: 1+log<sub>10</sub>(1+Blue Energy)<sup>2</sup>/200</span><br>`;
            }
            if (SETBACK_CALC.shown[3]()) {
                list += `<span style="color: #80FFFF">Exact Cyan Energy Formula: (1+Cyan Energy)<sup>Every OoM, this power increases by 0.05, starting at 1.</sup></span><br>`;
            }

            return `
                ${txt}<br><br>
                Exact Quark Gain Formula: Total<sup>2</sup>*Power<sup>2</sup>, where Power is the scale from 0 to 10.<br>
                Exact Dim. Mult. Formula: 2<sup>0.75*Power+0.25*Total</sup><br>
                ${list}
                Exact Dimension Costs: 10<sup>Dim#<sup>2</sup></sup>*10<sup>Bought*(2+Dim#)</sup>
            `;
        },
        enabled: false
    },
    {
        get show() {
            return hasSetbackUpgrade('r10');
        },
        title: `Generator Experience`,
        stage: `Unlocked by buying the 10th <span style="color: #ff8080">Red</span> <span class="rainbowText">Setback</span> Upgrade`,
        colors: ['#FF4000', '#80200080'],
        get info() {
            return `
                Generator Experience starts generating as soon as you grab the 10th upgrade of Red. Generator Experience gain is based off of your generator levels. Remember to cycle through prestige upgrade sets!<br>
                Generator Experience boosts your generation speed. Your points will also be boosted if you have >200 total generator levels. You may also buy generator experience buyables to further increase your generator experience gain.<br>
                Past 1.000 Dc Generator Experience, you can do an ascension reset for generator enhancements, which boost your generator experience gain and unlock new buyables, one of them has an especially powerful unlock!<br><br>
                Exact Generator Experience gain: (t/200)*10<sup>t/200-6</sup>, where t is your total generator levels.<br>
                Exact Generator Experience effect to generator speed: ^1+ln(1+0.05log<sub>10</sub>(1+XP))<br>
                Exact Generator Experience effect to points: ^1+0.05(1+log<sub>10</sub>(1+log<sub>10</sub>(XP)))*log<sub>2</sub>(t/200)<br>
            `;
        },
        enabled: false
    },
        {
        get show() {
            return hasSetbackUpgrade('b5');
        },
        title: `Hinderances`,
        get stage() {
            return `Unlocked by buying the 5th <span style="color: #8080ff">Blue</span> <span class="rainbowText">Setback</span> Upgrade`
        },
        colors: ['#FF0040', '#80002080'],
        get info() {
            return `
                Hinderances are a special type of challenge that does an Ascension reset. These are similar to Prestige Challenges, but their goal is not set in stone. Your best Points in these hinderances determines what rewards you gain.
            `;
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.enhancer, 0)
        },
        title: `Generator Enhancers`,
        stage: `Unlocked by reaching 1.000 Dc <span style="color: #ffa080">Generator Experience</span>`,
        colors: ['#FFFF00', '#80800080'],
        get info() {
            return `
                Generator Enhancers are an extra sub-layer that does an ascension reset and resets your Generator Experience.<br>
                Enhancers give a passive boost based on your total amount, and you also unlock a couple of extra buyables. The third enhancer buyable is especially important.<br>
                <span style="text-decoration: underline;">Note that normal ascension resets do not reset Generator Experience! Only if you reset for Generator Enhancers will it reset. You can use this property to your advantage.</span><br>
                If you are stuck at ~1.000e1,000, then you might have to grind generator enhancers!<br><br>
                Exact Generator Enhancer gain: (XP/1.000 Dc)<sup>0.02</sup><br>
                Exact Generator Enhancer effect: 10<sup>50ln(1+log<sub>10</sub>(1+Enhancers)/10)</sup><br>
                ${Decimal.gt(player.generatorFeatures.enhancerBuyables[2], 0) ? 'Exact Tier Point gain: (1+(Buyable Bought)/1000)<sup>(Enhancer Buyable #3 Bought)</sup>-1<br>Exact requirement formula: 100(1.01<sup>x</sup>-1)-1' : ''}
            `;
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gte(player.bestPointsInTranscend, 'e1500') || Decimal.gt(player.transcendResetCount, 0)
        },
        title: `Transcension`,
        stage: `Unlocked by reaching 1.000e2,400 Points`,
        colors: ['#8000FF', '#40008080'],
        get info() {
            return `
                Transcension is the third prestige layer that resets everything before it. Its gain is simple, past 1.000e2,400 points, your Points<sup>0.0005</sup> determines transcension point gain.<br>
                You also have transcension milestones. Each has a total transcension point requirement that decreases by /2 per transcension. Transcension milestones are the beginning source of QoL progress for this layer.<br>
                Transcension upgrades (yes, I know, basic name) are in a tree formation. Very creative and unique totally. I totally didn't run out of ideas. Moving on... Transcension upgrades need transcension points and sometimes also need a requirement, like how Ascension Buyables are, however, they are more expansive.
            `;
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gte(player.generatorFeatures.advance, 1)
        },
        title: `Replicators`,
        stage: `Unlocked via Generator Advance Upgrade #2`,
        colors: ['#FF0080', '#80004080'],
        get info() {
            return `
                Replicators are weird things that replicate. Go figure. You gain a bonus point multiplier from them. These replicators, however, have a constraint: there can only be so many before they can no longer replicate as quickly. This is called their Strength.<br>
                Your best Replicators passively boost points.<br>
                <br>
                RepliRanks can be first acquired by getting at least 2 Replicators. These reset your replicators, but increase replicators' effects and generate RepliRank points which can be used for buyables and upgrades.<br>
            `;
        },
        enabled: false
    },

]

/*
strings mention in transcension

Some upgrades can be boosted by using strings.<br>
Strings are earned by reaching specific milestones. There are three types of strings. Dotted Strings, Blue Strings, and String Factories. Each string can boost different upgrades depending on where they're allocated. Upgrades can themselves be boosted by strings, but they have a cap of 1 boost. Every 10 of that upgrade's string adds 1 to the boost cap. (Ex. An upgrade needs Dotted Strings to be boosted. If you have 10 total dotted strings, this upgrade can now be boosted twice.)
<br><br>
Exact Dotted String requirements: 10<sup>10,000*1.2<sup>D.S.</sup></sup> Points<br>
Exact Blue String requirements: 10,000,000(5(1.2<sup>B.S.</sup>-1)+1) Prestige Points<br>
Exact String Factory requirements: 5,000+200*S.F. Best of all Generator Levels<br>
*/

function initHTML_textbook() {
    toHTMLvar('textbookTabButton');
    toHTMLvar('textbookTab');
    toHTMLvar('informationList');

    let txt = ``;
    for (let i = 0; i < TEXTBOOK.length; i++) {
        if (TEXTBOOK[i].colors.length === 1) {
            txt += `
                <div onclick="TEXTBOOK[${i}].enabled = !TEXTBOOK[${i}].enabled" id="textbookButton${i}" class="flex-vertical whiteText font ${TEXTBOOK[i].colors[0]}FillBorder" style="padding: 4px; height: 40px; width: 400px; font-size: 16px; margin-top: 2px; margin-bottom: 4px; cursor: pointer">
                    <b style="margin-bottom: 4px">${TEXTBOOK[i].title}</b>
                    <span id="textbookStage${i}" style="font-size: 12px">${TEXTBOOK[i].stage}</span>
                </div>
                <div id="textbook${i}" class="whiteText font ${TEXTBOOK[i].colors[0]}FillBorder" style="width: 1000px; padding: 4px; margin-top: -7px; margin-bottom: 3px; font-size: 12px; text-align: center"></div>
            `;
        } else {
            txt += `
                <div onclick="TEXTBOOK[${i}].enabled = !TEXTBOOK[${i}].enabled" id="textbookButton${i}" class="flex-vertical whiteText font" style="background-color: ${TEXTBOOK[i].colors[1]}; border: 3px solid ${TEXTBOOK[i].colors[0]}; padding: 4px; height: 40px; width: 400px; font-size: 16px; margin-top: 2px; margin-bottom: 4px; cursor: pointer">
                    <b style="margin-bottom: 4px">${TEXTBOOK[i].title}</b>
                    <span id="textbookStage${i}" style="font-size: 12px">${TEXTBOOK[i].stage}</span>
                </div>
                <div id="textbook${i}" class="whiteText font" style="background-color: ${TEXTBOOK[i].colors[1]}; border: 3px solid ${TEXTBOOK[i].colors[0]}; width: 1000px; padding: 4px; margin-top: -7px; margin-bottom: 3px; font-size: 12px; text-align: center"></div>
            `;
        }
    }
    html['informationList'].setHTML(txt);
    for (let i = 0; i < TEXTBOOK.length; i++) {
        toHTMLvar(`textbook${i}`);
        toHTMLvar(`textbookButton${i}`);
        toHTMLvar(`textbookStage${i}`);
    }
}

function updateHTML_textbook() {
    html['textbookTab'].setDisplay(tmp.tab === 2);
    if (tmp.tab === 2) {
        for (let i = 0; i < TEXTBOOK.length; i++) {
            html[`textbookButton${i}`].setDisplay(TEXTBOOK[i].show);
            html[`textbook${i}`].setDisplay(TEXTBOOK[i].enabled && TEXTBOOK[i].show);
            if (TEXTBOOK[i].show) {
                html[`textbookStage${i}`].setHTML(TEXTBOOK[i].stage);
                if (TEXTBOOK[i].enabled) {
                    html[`textbook${i}`].setHTML(TEXTBOOK[i].info);
                }
            }
        }
    }
}