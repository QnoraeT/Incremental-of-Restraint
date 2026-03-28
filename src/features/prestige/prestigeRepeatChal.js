"use strict;"

const PRESTIGE_CHALLENGES_REPEAT = [
    {
        goal(comp) {
            let goal = D(1e8);
            if (colorAmountTotal(2).gt(0)) {
                goal = goal.pow(tmp.setbackEffects[2][0]);
            }
            return goal;
        },
        target(essence) {
            
        },
        name: "Nerfed Buyables",
        desc: "Buyables' effect bases are halved.",
        get eff() {
            return `Increase the cap of prestige ${tmp.prestigeIsUpg ? 'upgrades' : 'buyables'} by 1, and Buyables generate a resource that boost themselves, called Generators.`;
        },
        chalEffects(depth) {
            const obj = { effectBase: D(0.5) };
            obj.effectBase = obj.effectBase.pow(depth);

            return obj;
        }
    },
]

function initHTML_prestigeRepChal() {
    toHTMLvar('prestigeChallengeRepeatTab');
    toHTMLvar('prestigeChallengeRepeatTabButton');
    html['prestigeChallengeRepeatTab'].setDisplay(false);
    html['prestigeChallengeRepeatTabButton'].setDisplay(false);

    toHTMLvar('prestigeChallengeRepeatList');

    let txt = ``;
    for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
        txt += `
        <button onclick="togglePrestigeChallengeRepeat(${i})" id="prestigeChallengeRepeat${i}" class="whiteText font" style="cursor: pointer; height: 160px; width: 320px; font-size: 10px; margin: 2px">
            <b><span id="prestigeChallengeRepeat${i}name" style="font-size: 12px"><b>PRC${i+1}</b>: ${PRESTIGE_CHALLENGES_REPEAT[i].name} ×<span id="prestigeChallengeRepeat${i}comp"></span></span></b><br>
            <span id="prestigeChallengeRepeat${i}desc">${PRESTIGE_CHALLENGES_REPEAT[i].desc}</span><br>
            Goal: <span id="prestigeChallengeRepeat${i}goal"></span> prestige essence<br><br>
            Reward: <span id="prestigeChallengeRepeat${i}reward">${PRESTIGE_CHALLENGES_REPEAT[i].eff}</span>
        </button>
        `;
    }

    html['prestigeChallengeRepeatList'].setHTML(txt);
    for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
        toHTMLvar(`prestigeChallengeRepeat${i}`);
        toHTMLvar(`prestigeChallengeRepeat${i}name`);
        toHTMLvar(`prestigeChallengeRepeat${i}desc`);
        toHTMLvar(`prestigeChallengeRepeat${i}goal`);
        toHTMLvar(`prestigeChallengeRepeat${i}reward`);
    }
}

function updateGame_prestigeRepChal() {
    for (let i = PRESTIGE_CHALLENGES_REPEAT.length - 1; i >= 0; i--) {
        tmp.prestigeRepeatChal[i].entered = false;
        tmp.prestigeRepeatChal[i].trapped = false;
        tmp.prestigeRepeatChal[i].depth = D(0);

        if (player.prestigeRepeatChal === i && !prestigeChallengeRepeatEnabled(i)) {
            togglePrestigeChallengeRepeat(i);
        }

        if (player.prestigeChallengeRepeat === i) {
            tmp.prestigeRepeatChal[i].entered = true;
            tmp.prestigeRepeatChal[i].depth = Decimal.add(tmp.prestigeRepeatChal[i].depth, 1);
        }

        tmp.prestigeRepeatChal[i].effects = PRESTIGE_CHALLENGES_REPEAT[i].chalEffects(tmp.prestigeRepeatChal[i].depth);
    }
}

function updateHTML_prestigeRepChal() {
    if (tmp.tab === 1) {
        html['prestigeChallengeRepeatTab'].setDisplay(tmp.prestigeTab === 3)
        html['prestigeChallengeRepeatTabButton'].setDisplay(hasSetbackUpgrade('b8'))

        if (tmp.prestigeTab === 3) {
            for (let i = 0; i < PRESTIGE_CHALLENGES_REPEAT.length; i++) {
                let shown = prestigeChallengeRepeatEnabled(i)

                html[`prestigeChallengeRepeat${i}`].setDisplay(shown)
                if (shown) {
                    html[`prestigeChallengeRepeat${i}goal`].setTxt(format(PRESTIGE_CHALLENGES_REPEAT[i].goal))
                    html[`prestigeChallengeRepeat${i}reward`].setTxt(PRESTIGE_CHALLENGES_REPEAT[i].eff)

                    html[`prestigeChallengeRepeat${i}`].changeStyle('background-color', 
                        !player.prestigeChallengeRepCompleted.includes(i)
                            ? (player.prestigeChallengeRepeat === i
                                ? '#00408080'
                                : '#00008080')
                            : (player.prestigeChallengeRepeat === i
                                ? '#60808080'
                                : '#00808080'))
                    html[`prestigeChallengeRepeat${i}`].changeStyle('border', `3px solid ${
                        !player.prestigeChallengeRepCompleted.includes(i)
                            ? (player.prestigeChallengeRepeat === i
                                ? '#0080ff'
                                : '#0000ff')
                            : (player.prestigeChallengeRepeat === i
                                ? '#c0ffff'
                                : '#00ffff')}`)
                }
            }
        }
    }
}