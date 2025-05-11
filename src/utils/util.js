"use strict";
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function inverseFact(x) {
    if (Decimal.gte(x, "eee18")) {
        return Decimal.log10(x);
    }
    if (Decimal.gte(x, "eee4")) {
        return Decimal.log10(x).div(Decimal.log10(x).log10());
    }
    return Decimal.div(x, 2.5066282746310002).ln().div(Math.E).lambertw().add(1).exp().sub(0.5);
};

class Element {
    constructor(el) {
        this.id = typeof el == "string" ? el : el.id;
        this.el = document.getElementById(this.id);
        if (this.el === null) {
            throw new Error(`${el} could not be found in the DOM!`)
        }
    }
    get style() {
        return this.el.style;
    }
    setTxt(txt) {
        if (this.el.textContent === txt) { return; }
        this.el.textContent = txt;
    }
    static setTxt(id, txt) {
        new Element(id).setTxt(txt);
    }
    setHTML(html) {
        if (this.el.innerHTML === html) { return; }
        this.el.innerHTML = html;
    }
    static setHTML(id, html) {
        new Element(id).setHTML(html);
    }
    addHTML(html) {
        this.el.innerHTML += html;
    }
    static addHTML(id, html) {
        new Element(id).addHTML(html);
    }
    setDisplay(bool) {
        this.el.style.display = bool ? "" : "none";
    }
    static setDisplay(id, bool) {
        new Element(id).setDisplay(bool);
    }
    addClass(name) {
        this.el.classList.add(name);
    }
    static addClass(id, name) {
        new Element(id).addClass(name);
    }
    removeClass(name) {
        this.el.classList.remove(name);
    }
    static removeClass(id, name) {
        new Element(id).removeClass(name);
    }
    clearClasses() {
        this.el.className = "";
    }
    static clearClasses(id) {
        new Element(id).clearClasses();
    }
    setClasses(data) {
        this.clearClasses();
        let list = Object.keys(data).filter(x => data[x]);
        for (let i = 0; i < list.length; i++) this.addClass(list[i]);
    }
    static setClasses(id, data) {
        new Element(id).setClasses(data);
    }
    setVisible(bool) {
        var s = this.el.style
        s.visibility = bool ? "visible" : "hidden";
        s.opacity = bool ? 1 : 0
        s.pointerEvents = bool ? "all" : "none"
    }
    static setVisible(id, bool) {
        new Element(id).setVisible(bool);
    }
    setOpacity(value) {
        this.el.style.opacity = value;
    }
    static setOpacity(id, value) {
        new Element(id).setOpacity(value);
    }
    changeStyle(type, input) {
        this.el.style[type] = input;
    }
    static changeStyle(id, type, input) {
        new Element(id).changeStyle(type, input);
    }
    isChecked() {
        return this.el.checked;
    }
    static isChecked(id) {
        return new Element(id).isChecked();
    }
    static allFromClass(name) {
        return Array.from(document.getElementsByClassName(name)).map(x => new Element(x.id));
    }
    setAttr(name, input) {
        this.el.setAttribute(name, input);
    }
    static setAttr(id, name, input) {
        new Element(id).setAttribute(name, input);
    }
    setTooltip(input) {
        this.setAttr("tooltip-html", input);
    }
    static setTooltip(id, input) {
        new Element(id).setAttr("tooltip-html", input);
    }
    setSize(h, w) {
        this.el.style["min-height"] = h + "px";
        this.el.style["min-width"] = w + "px";
    }
    static setSize(id, h, w) {
        new Element(id).setSize(h, w);
    }
}

let el = x => document.getElementById(x);
const toHTMLvar = x => html[x] = new Element(x)

function D(x) { return new Decimal(x) }

function lerp(t, s, e, type, p) {
    if (isNaN(t)) {
        throw new Error(`malformed input [LERP]: ${t}, expecting f64`)
    }
    t = clamp(t, 0, 1);
    if (t === 0) {
        return s;
    }
    if (t === 1) {
        return e;
    }
    switch (type) {
        case "QuadIn":
            t = t * t;
            break;
        case "QuadOut":
            t = 1.0 - ((1.0 - t) * (1.0 - t));
            break;
        case "CubeIn":
            t = t * t * t;
            break;
        case "CubeOut":
            t = 1.0 - ((1.0 - t) * (1.0 - t) * (1.0 - t));
            break;
        case "Smooth":
            t = 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3);
            break;
        case "ExpSCurve":
            t = (Math.tanh(p * Math.tan((t + 1.5 - ((t - 0.5) / 1e9)) * Math.PI)) + 1) / 2;
            break;
        case "Sine":
            t = Math.sin(t * Math.PI / 2) ** 2;
            break;
        case "Expo":
            if (p > 0) {
                t = Math.coth(p / 2) * Math.tanh(p * t / 2);
            } else if (p < 0) {
                t = 1.0 - Math.coth(p / 2) * Math.tanh(p * (1.0 - t) / 2);
            }
            break;
        default:
            break;
    }
    return (s * (1 - t)) + (e * t);
}

function clamp(num, min, max) { // why isn't this built in
    return Math.min(Math.max(num, min), max);
}

const abbSuffixes = ["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc","UDc","DDc","TDc","QaDc","QiDc","SxDc","SpDc","OcDc","NoDc","Vg"];
const letter = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

const timeList = [
    { name: "pt",  stop: true,  amt: 5.39e-44 },
    { name: "qs",  stop: true,  amt: 1 / 1e30 },
    { name: "rs",  stop: true,  amt: 1 / 1e27 },
    { name: "ys",  stop: true,  amt: 1 / 1e24 },
    { name: "zs",  stop: true,  amt: 1 / 1e21 },
    { name: "as",  stop: true,  amt: 1 / 1e18 },
    { name: "fs",  stop: true,  amt: 1 / 1e15 },
    { name: "ps",  stop: true,  amt: 1 / 1e12 },
    { name: "ns",  stop: true,  amt: 1 / 1e9 },
    { name: "µs",  stop: true,  amt: 1 / 1e6 },
    { name: "ms",  stop: true,  amt: 1 / 1e3 },
    { name: "s",   stop: true,  amt: 1 },
    { name: "m",   stop: false, amt: 60 },
    { name: "h",   stop: false, amt: 3600 },
    { name: "d",   stop: false, amt: 86400 },
    { name: "mo",  stop: false, amt: 2592000 },
    { name: "y",   stop: false, amt: 3.1536e7 },
    { name: "mil", stop: false, amt: 3.1536e10 },
    { name: "uni", stop: false, amt: 4.320432e17 }
];

const abbExp = D(1e66);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function formatLetter(remainingLogNumber, string = ``) {
    if (Decimal.gte(remainingLogNumber, 1e12)) {
        console.error(
            `formatLetter is taking in numbers greater than ee12! This *will* freeze the game!`
        );
        return ``;
    }
    if (Decimal.lt(remainingLogNumber, letter.length)) {
        return `${letter[new Decimal(remainingLogNumber).toNumber()]}${string}`;
    }
    return formatLetter(
        Decimal.div(remainingLogNumber, letter.length).sub(1).floor(),
        `${letter[new Decimal(remainingLogNumber).mod(letter.length).toNumber()]}${string}`
    );
}

function format(number, dec = 0, expdec = 3, notation = 0) {
    if (Decimal.lt(number, 0)) return `-${format(Decimal.negate(number), dec, expdec)}`;
    if (Decimal.eq(number, 0)) return (0).toFixed(dec);
    if (Decimal.isNaN(number)) return "NaN";
    if (!Decimal.isFinite(number)) return "Infinity";
    try {
        switch (notation) {
            case 0: // mixed
                if (Decimal.gte(number, 1e8) && Decimal.lt(number, abbExp)) {
                    const abb = Decimal.log10(number).mul(0.33333333336666665).floor();
                    return `${Decimal.div(number, abb.mul(3).pow10()).toNumber().toFixed(expdec)} ${abbSuffixes[abb.toNumber()]}`;
                }
                return format(number, dec, expdec, 1);
            case 1: // sci
                if (Decimal.lt(number, "e-1e8")) {
                    return `e${format(Decimal.log10(number), 0, expdec)}`;
                } else if (Decimal.lt(number, 0.001)) {
                    const exp = Decimal.log10(number).mul(1.00000000001).floor();
                    return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
                } else if (Decimal.lt(number, 1e8)) {
                    return numberWithCommas(new Decimal(number).toNumber().toFixed(dec));
                } else if (Decimal.lt(number, 'ee8')) {
                    const exp = Decimal.log10(number).mul(1.00000000001).floor();
                    return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
                } else if (Decimal.lt(number, "10^^7")) {
                    return `e${format(Decimal.log10(number), dec, expdec)}`;
                } else {
                    return `F${format(Decimal.slog(number), Math.max(dec, 3), expdec)}`;
                }
            case 2: // letters
                if (Decimal.gte(number, 1e3) && Decimal.lt(number, 'ee8')) {
                    const abb = Decimal.log10(number).mul(0.33333333336666665).floor();
                    return `${Decimal.div(number, abb.mul(3).pow10()).toNumber().toFixed(expdec)} ${formatLetter(abb.sub(1), "")}`;
                }
                return format(number, dec, expdec, 1);
            case 3:
                if (Decimal.gte(number, "10^^7")) {
                    return `IM^${format(Decimal.slog(number).sub(2.0221273333), Math.max(dec, 3), expdec, 0)}`;
                }
                if (Decimal.gte(number, Number.MAX_VALUE)) {
                    if (Decimal.lt(number, "2.8e95173")) {
                        return `${format(Decimal.log10(number).div(308).sub(0.75).pow10(), expdec, expdec, 0)} ᴵᴾ`;
                    } else if (Decimal.lt(number, "e542945439")) {
                        return `${format(Decimal.log10(number).div(308).sub(0.75).div(308).sub(0.7).pow_base(5), expdec, expdec, 0)} ᴱᴾ`;
                    } else if (Decimal.lt(number, "e181502546658")) {
                        return `${format(Decimal.log10(number).div(308).sub(0.75).div(308).sub(0.7).mul(0.6989700043360187).div(4000).sub(1).pow_base(1000), expdec, expdec, 0)} ᴿᴹ`;
                    } else {
                        const rm = Decimal.log10(number).div(308).sub(0.75).div(308).sub(0.7).mul(0.6989700043360187).div(4000).sub(1).mul(3);
                        return `${format(rm.sub(1000).pow(2).mul(rm.sub(100000).max(1).pow(0.2)), expdec, expdec, Decimal.lt(number, "ee148.37336") ? 0 : 3)} ᴵᴹ`;
                    }
                }
                return format(number, dec, expdec, 1);
            case 4:
                return `Rank ${format(Decimal.max(number, 10).div(10).log(2).sqrt().add(1), dec, expdec, 1)}`;
            default:
                throw new Error(`${player.value.settings.notation} is not a valid notation index!`);
        }
    } catch(e) {
        console.warn(
            `There was an error trying to get player.settings.notation! Falling back to Mixed Scientific...\n\nIf you have an object that has an item that uses format() without it being a get or function, this will occurr on load!`
        );
        console.warn(e);
        if (Decimal.lt(number, "e-1e8")) {
            return `e${format(Decimal.log10(number), 0, expdec)}`;
        } else if (Decimal.lt(number, 0.001)) {
            const exp = Decimal.log10(number).mul(1.00000000001).floor();
            return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
        } else if (Decimal.lt(number, 1e8)) {
            return numberWithCommas(new Decimal(number).toNumber().toFixed(dec));
        } else if (Decimal.lt(number, abbExp)) {
            const abb = Decimal.log10(number).mul(0.33333333336666665).floor();
            return `${Decimal.div(number, abb.mul(3).pow10()).toNumber().toFixed(expdec)} ${abbSuffixes[abb.toNumber()]}`;
        } else if (Decimal.lt(number, 'ee8')) {
            const exp = Decimal.log10(number).mul(1.00000000001).floor();
            return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
        } else if (Decimal.lt(number, "10^^7")) {
            return `e${format(Decimal.log10(number), dec, expdec)}`;
        } else {
            return `F${format(Decimal.slog(number), Math.max(dec, 3), expdec)}`;
        }
    }
};

function formatPerc(number, dec = 3, expdec = 3) {
    if (Decimal.gte(number, 1000)) {
        return `${format(number, dec, expdec)}x`;
    } else {
        return `${format(Decimal.sub(100, Decimal.div(100, number)), dec, expdec)}%`;
    }
};

function formatTime(number, dec = 0, expdec = 3, limit = 2) {
    if (Decimal.lt(number, 0)) return `-${formatTime(Decimal.negate(number), dec, expdec)}`;
    if (Decimal.eq(number, 0)) return `${(0).toFixed(dec)}s`;
    if (Decimal.isNaN(number)) return "NaN";
    if (!Decimal.isFinite(number)) return "Infinity";
    let lim = 0;
    let str = "";
    let end = false;
    let prevNumber;
    for (let i = timeList.length - 1; i >= 0; i--) {
        if (lim >= limit) {
            break;
        }
        if (Decimal.gte(number, timeList[i].amt)) {
            end = lim + 1 >= limit || timeList[i].stop;
            prevNumber = Decimal.div(number, timeList[i].amt);
            str = `${str} ${format(prevNumber.sub(end ? 0 : 0.5), end ? dec : 0, expdec)}${timeList[i].name}`;
            number = Decimal.sub(number, prevNumber.floor().mul(timeList[i].amt));
            lim++;
            if (timeList[i].stop || prevNumber.gte(1e8)) {
                break;
            }
        } else {
            if (i === 0) {
                return `${str} ${format(number, dec, expdec)}s`.slice(1);
            }
        }
    }
    return str.slice(1);
};

function checkNaN(x, err) {
    if (Decimal.isNaN(x)) {
        throw new Error(`Error: ${err}`)
    }
}

function cheatDilateBoost(x, inv) {
    checkNaN(x, `cheatDilateBoost detected a NaN outside of itself!`)
    if (!player.cheats.dilate) {
        return x
    }
    let result = Decimal.add(x, 1)
    for (let i = 0; i < player.cheats.dilateStage; i++) {
        result = result.log10().add(1)
    }
    result = inv
        ? result.root(player.cheats.dilateValue)
        : result.pow(player.cheats.dilateValue)
    for (let i = 0; i < player.cheats.dilateStage; i++) {
        result = result.sub(1).pow10()
    }
    result = result.sub(1)
    checkNaN(x, `cheatDilateBoost detected a NaN inside of itself!`)
    return result
}