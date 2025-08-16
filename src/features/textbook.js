const TEXTBOOK = [
    {
        get show() {
            return true
        },
        title: `Basics`,
        stage: `Information`,
        colors: ['#FFFFFF', '#80808080'],
        get info() {
            return `
                This is an incremental game created by TearonQ (@QnoraeT in Github).<br>
                I imposed a bit of a challenge for myself, to not use any softcaps, scalings, and the game mustn't inflate. Idk, I was bored and I tried doing something.<br>
                This game is also slower than my other incrementals, but is still pretty active. This may be comparable to randomtuba's Algebraic Progression, but with slightly more head room for optimization.<br><br>
                You can hold shift to buy max what you click on. This will not come with a confirmation!<br><br>
                Inspired by <span style="color: #ffff00">randomtuba</span>, <span style="color: #8000ff">Jacorb</span>, <span style="color: #ff0000">MrRedShark</span>, and more!
            `
        },
        enabled: false // changable, doesn't need to be saved
    },
    {
        get show() {
            return true
        },
        title: `Buyables`,
        stage: `Unlocked instantly`,
        colors: ['#FFFFFF', '#80808080'],
        get info() {
            let txt = ``
            for (let i = 0; i < player.buyables.length; i++) {
                if (buyableEnabled(i)) {
                    txt += `<li>Buyable ${i+1}: Base Cost: ${format([D(2), D(20), D(500), D(10000), D(1e6), D(1e9)][i])}, Scaling: ${i+2}×</li>`
                }
            }
            return `
                Buyables are the game's main source of point generation. These are unlimited, meaning you can buy them infinitely many times. Buyables also give a free level to the previous buyable.<br>
                However, there is an "interval" attached to them. Every ${format(tmp.bybBoostInterval)}, the buyable's effect increases by ${format(tmp.bybBoostEffect, 2)}x, but their cost scaling speeds up by ${format(tmp.bybBoostCost, 2)}×, essentially making their costs scale double-exponentially. The default interval is every 100 purchases, 2× to boost, and 2× to cost.<br><br>
                Buyables' costs are as follows:<br>
                ${txt}
            `
        },
        enabled: false // changable, doesn't need to be saved
    },
    {
        get show() {
            return true
        },
        title: `Prestige`,
        stage: `Unlocked at 1,000,000 Points`,
        colors: ['#0080FF', '#00408080'],
        get info() {
            return `
                Prestige is the game's first prestige layer. Every OoM of your best points within the prestige past 1,000,000 gives you 1 prestige point.<br>
                You can use Prestige Points to buy Prestige Upgrades, which give varying boosts. However, there is a cap to how many Prestige Upgrades you can hold. You may respec your upgrades, which does a prestige reset but does not give you any prestige points.<br><br>
                Exact Prestige Point gain formula: log<sub>10</sub>(x/1,000,000)
            `
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0)
        },
        title: `Prestige Challenges`,
        stage: `Unlocked at 3 <span style="color: #80c0ff">Prestige Points</span>`,
        colors: ['#0080FF', '#00408080'],
        get info() {
            return `
                Prestige Challenges are places where you do a prestige reset, however, the game will be more limiting. You will need to have your current points surpass the prestige challenge's goal and prestige in order to complete the challenge. Challenges have certain rewards that you gain after you complete them.<br>
                You will see common abbreviations like "PCx" where x is the number of that prestige challenge. You can see which challenge(s) you're in by seeing the text below your point amount.<br><br>
                <span style="color: #ffff00"><b>Warning!</b> Entering and exiting a prestige challenge will not count as an actual prestige! <b>You will not gain any prestige-related resources if you enter and exit any prestige challenge!</b></span>
            `
        },
        enabled: false
    },
    {
        get show() {
            return player.prestigeChallengeCompleted.includes(0) || Decimal.gt(player.ascend, 0)
        },
        title: `Generators`,
        stage: `Unlocked by completing <span style="color: #80c0ff">PC1</span>`,
        colors: ['#00FF40', '#00804080'],
        get info() {
            return `
                Generators are extra features that increase each buyable's effect gradually over time.<br>
                Generator Speed similarly calculated to the buyable's effect, that being x*${format(tmp.bybBoostEffect, 2)}<sup>⌊x/${format(tmp.bybBoostInterval)}⌋</sup><br>
                The requirements of each generator level scale factorially. (Lv 1 needs 2 XP, Lv 2 needs 6 XP, etc.), but this requirement gradually scales faster and faster.<br><br>
                Exact requirement formula: 1,000(e<sup>x/1,000</sup>-1)!
            `
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gt(player.ascend, 0)
        },
        title: `Ascension`,
        stage: `Unlocked by reaching 1.000 Sx Points`,
        colors: ['#00FF00', '#00800080'],
        get info() {
            return `
                Ascension is the game's second prestige layer. You initally gain 1 ascension point, and every time you multiply your point amount by ${format(tmp.ascendReq)}, you gain 1,000× more ascension points. Roughly, your ascension point gain is (x/${format(tmp.ascendReq)})<sup>${format(Decimal.log(1e3, tmp.ascendReq), 4)}</sup><br>
                Ascension points create Ascension gems, which can be used to buy upgrades. However, Ascension Buyables also have other requirements that you must meet before being able to buy them.<br><br>
                Past 10 ascension points, you will unlock Setback.
            `
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gt(player.ascend, 10)
        },
        title: `Setback`,
        stage: `Unlocked by accumulating 10 <span style="color: #80ff80">Ascension Points</span>`,
        colors: ['rainbow'],
        get info() {
            return `
                Setback is a custom challenge modifier that does as Ascension reset. You currently have 3 different options that range from 1 to 10 that causes different effects and you must do an ascension reset to complete a setback. Upon completing a setback, you have the option to enable/disable it in your loadouts, which generate quarks and energy.<br>
                The higher the individual AND total difficulty, the higher your quark gain and multipliers are.<br>
                There are various upgrades you can buy with energy as well. You may have to swap loadouts so that you can buy the upgrades.<br>
                <span style="color: #ffff00">Dimensions, Quarks, and Energy reset on Ascensions!</span><br>
                Dimensions multiply your energy gain as well. They're also subject to a similar interval with buyables, except that every 100 purchases, the dimensions' multiplier per bought (base of 2) increases by +1. The cost scaling per interval is similar to the scaling for buyables. The default interval is every 100 purchases, +1× to mult per bought, and 2× to cost.<br><br>
                Exact Quark Gain Formula: Total<sup>2</sup>*Power<sup>2</sup>, where Power is the scale from 0 to 10.<br>
                Exact Dim. Mult. Formula: 2<sup>0.75*Power+0.25*Total</sup><br>
                <span style="color: #FF8080">Exact Red Energy Formula: (1+log<sub>10</sub>(1+Red Energy))<sup>Every OoM^2 (1e10, 1e100, etc.), this power increases by 1, starting at 1.</sup></span><br>
                <span style="color: #80FF80">Exact Green Energy Formula: 1+log<sub>10</sub>(1+Green Energy)/10</span><br>
                <span style="color: #8080FF">Exact Blue Energy Formula: 1+log<sub>10</sub>(1+Blue Energy)<sup>2</sup>/200</span><br>
                Exact Dimension Costs: 10<sup>Dim#<sup>2</sup></sup>*10<sup>Bought*(2+Dim#)</sup>
            `
        },
        enabled: false
    },
    {
        get show() {
            return hasSetbackUpgrade('r10')
        },
        title: `Generator Experience`,
        get stage() {
            return `Unlocked by buying the 10th <span style="color: #ff8080">Red</span> <span class="rainbowText">Setback</span> Upgrade`
        },
        colors: ['#FF4000', '#80200080'],
        get info() {
            return `
                Generator Experience starts generating as soon as you grab the 10th upgrade of Red. Generator Experience gain is based off of your generator levels. Remember to cycle through prestige upgrade sets!<br>
                Generator Experience boosts your generation speed. Your points will also be boosted if you have >200 total generator levels. You may also buy generator experience buyables to further increase your generator experience gain.<br>
                Past 1.000 Dc Generator Experience, you can do an ascension reset for generator enhancements, which boost your generator experience gain and unlock new buyables, one of them has an especially powerful unlock!<br><br>
                Exact Generator Experience gain: (t/200)*10<sup>t/200-6</sup>, where t is your total generator levels.<br>
                Exact Generator Experience effect to generator speed: ^1+ln(1+0.05log<sub>10</sub>(1+XP))<br>
                Exact Generator Experience effect to points: ^1+0.05(1+log<sub>10</sub>(1+log<sub>10</sub>(XP)))*log<sub>2</sub>(t/200)<br>
            `
        },
        enabled: false
    },
        {
        get show() {
            return hasSetbackUpgrade('b5')
        },
        title: `Hinderances`,
        get stage() {
            return `Unlocked by buying the 5th <span style="color: #8080ff">Blue</span> <span class="rainbowText">Setback</span> Upgrade`
        },
        colors: ['#FF0040', '#80002080'],
        get info() {
            return `
                Hinderances are a special type of challenge that does an Ascension reset. These are similar to Prestige Challenges, but their goal is not set in stone. Your best Points in these hinderances determines what rewards you gain.
            `
        },
        enabled: false
    },
    {
        get show() {
            return Decimal.gt(player.generatorFeatures.enhancer, 0)
        },
        title: `Generator Enhancers`,
        get stage() {
            return `Unlocked by reaching 1.000 Dc <span style="color: #ffa080">Generator Experience</span>`
        },
        colors: ['#FFFF00', '#80800080'],
        get info() {
            return `
                Generator Enhancers are an extra sub-layer that does an ascension reset and resets your Generator Experience.<br>
                Enhancers give a passive boost based on your total amount, and you also unlock a couple of extra buyables. The third enhancer buyable is especially important.<br>
                <span style="text-decoration: underline;">Note that normal ascension resets do not reset Generator Experience! Only if you reset for Generator Enhancers will it reset. You can use this property to your advantage.</span><br>
                If you are stuck at ~1.000e1,000, then you might have to grind generator enhancers!<br><br>
                Exact Generator Enhancer gain: (XP/1.000 Dc)<sup>0.02</sup><br>
                Exact Generator Enhancer effect: 10<sup>10ln(1+log<sub>10</sub>(1+Enhancers)/10)</sup><br>
                ${Decimal.gt(player.generatorFeatures.enhancerBuyables[2], 0) ? 'Exact Tier Point gain: (1+(Buyable Bought)/1000)<sup>(Enhancer Buyable #3 Bought)</sup>-1<br>Exact requirement formula: 100(1.01<sup>x</sup>-1)-1' : ''}
            `
        },
        enabled: false
    },
        {
        get show() {
            return true
        },
        title: `Transcension`,
        get stage() {
            return `Unlocked by reaching 1.000e2,400 Points`
        },
        colors: ['#8000FF', '#40008080'],
        get info() {
            return `
                Transcension is the third prestige layer that resets everything before it. Its gain is simple, past 1.000e2,400 points, your Points<sup>0.0005</sup> determines transcension point gain.<br>
                You also have transcension milestones. Each has a total transcension point requirement that decreases by /2 per transcension. Transcension milestones are the beginning source of QoL progress for this layer.<br>
                Transcension upgrades (yes, I know, basic name) are in a tree formation. Very creative and unique totally. I totally didn't run out of ideas. Moving on... Transcension upgrades need transcension points and sometimes also need a requirement, like how Ascension Buyables are, however, they are more expansive. Some upgrades can be boosted by using strings.<br>
                Strings are earned by reaching specific milestones. There are three types of strings. Dotted Strings, Blue Strings, and String Factories. Each string can boost different upgrades depending on where they're allocated. Upgrades can themselves be boosted by strings, but they have a cap of 1 boost. Every 10 of that upgrade's string adds 1 to the boost cap. (Ex. An upgrade needs Dotted Strings to be boosted. If you have 10 total dotted strings, this upgrade can now be boosted twice.)
                <br><br>
                Exact Dotted String requirements: 10<sup>10,000*1.2<sup>D.S.</sup></sup> Points<br>
                Exact Blue String requirements: 10,000,000(5(1.2<sup>B.S.</sup>-1)+1) Prestige Points<br>
                Exact String Factory requirements: 5,000+200*S.F. Best of all Generator Levels<br>
            `
        },
        enabled: false
    },
]

function initHTML_textbook() {
    toHTMLvar('textbookTabButton')
    toHTMLvar('textbookTab')
    toHTMLvar('informationList')

    let txt = ``
    for (let i = 0; i < TEXTBOOK.length; i++) {
        if (TEXTBOOK[i].colors.length === 1) {
            console.log(`${TEXTBOOK[i].colors[0]}Border`)
            txt += `
                <div onclick="TEXTBOOK[${i}].enabled = !TEXTBOOK[${i}].enabled" id="textbookButton${i}" class="flex-vertical whiteText font ${TEXTBOOK[i].colors[0]}Border ${TEXTBOOK[i].colors[0]}Fill" style="padding: 4px; height: 40px; width: 400px; font-size: 16px; margin-top: 2px; margin-bottom: 4px; cursor: pointer">
                    <b style="margin-bottom: 4px">${TEXTBOOK[i].title}</b>
                    <span id="textbookStage${i}" style="font-size: 12px">${TEXTBOOK[i].stage}</span>
                </div>
                <div id="textbook${i}" class="whiteText font ${TEXTBOOK[i].colors[0]}Border ${TEXTBOOK[i].colors[0]}Fill" style="width: 1000px; padding: 4px; margin-top: -7px; margin-bottom: 3px; font-size: 12px; text-align: center"></div>
            `
        } else {
            txt += `
                <div onclick="TEXTBOOK[${i}].enabled = !TEXTBOOK[${i}].enabled" id="textbookButton${i}" class="flex-vertical whiteText font" style="background-color: ${TEXTBOOK[i].colors[1]}; border: 3px solid ${TEXTBOOK[i].colors[0]}; padding: 4px; height: 40px; width: 400px; font-size: 16px; margin-top: 2px; margin-bottom: 4px; cursor: pointer">
                    <b style="margin-bottom: 4px">${TEXTBOOK[i].title}</b>
                    <span id="textbookStage${i}" style="font-size: 12px">${TEXTBOOK[i].stage}</span>
                </div>
                <div id="textbook${i}" class="whiteText font" style="background-color: ${TEXTBOOK[i].colors[1]}; border: 3px solid ${TEXTBOOK[i].colors[0]}; width: 1000px; padding: 4px; margin-top: -7px; margin-bottom: 3px; font-size: 12px; text-align: center"></div>
            `
        }
    }
    html['informationList'].setHTML(txt)
    for (let i = 0; i < TEXTBOOK.length; i++) {
        toHTMLvar(`textbook${i}`)
        toHTMLvar(`textbookButton${i}`)
        toHTMLvar(`textbookStage${i}`)
    }
}

function updateHTML_textbook() {
    html['textbookTab'].setDisplay(tmp.tab === 2)
    if (tmp.tab === 2) {
        for (let i = 0; i < TEXTBOOK.length; i++) {
            html[`textbookButton${i}`].setDisplay(TEXTBOOK[i].show)
            html[`textbook${i}`].setDisplay(TEXTBOOK[i].enabled && TEXTBOOK[i].show)
            if (TEXTBOOK[i].show) {
                html[`textbookStage${i}`].setHTML(TEXTBOOK[i].stage)
                if (TEXTBOOK[i].enabled) {
                    html[`textbook${i}`].setHTML(TEXTBOOK[i].info)
                }
            }
        }
    }
}