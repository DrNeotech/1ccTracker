"use strict";
const appDiv = document.getElementById('app');
const debugDiv = document.getElementById('debug');
const canvas = document.getElementById('mainCanvas');
const downloadButton = document.getElementById('download');
const yyyyMmDd = new Date().toISOString().split('T')[0];
downloadButton.download = `progress_${yyyyMmDd}.png`;
const ctx = canvas.getContext("2d");
const completionDiv = document.getElementById('completionDiv');
const completion = document.getElementById('completionRate');
canvas.style.width = "800px";
canvas.style.height = "640px";
// Prevent selection of text while interacting with the canvas
canvas.onselectstart = function () {
    return false;
};
var scale = 1;
if (ctx) {
    // Keeping for posterity - canvas scaling tech, which
    // doesn't work across browsers or OSes and certainly
    // not for our use-case of creating 800x640 images...
    canvas.width = Math.floor(800 * scale);
    canvas.height = Math.floor(640 * scale);
    ctx.scale(scale, scale);
}
let download = function (e) {
    deselectBox();
    if (debugDiv) {
        debugDiv.innerHTML = '(Double-)Click a square!';
    }
    drawScreen();
    var image = canvas.toDataURL("image/png");
    e.target.href = image;
};

function downloadAsBanner(originalCanvas) {
    const output = document.createElement("canvas");
    output.width = 1500;
    output.height = 500;

    const ctx = output.getContext("2d");

    // Example layout: 3 horizontal slices rearranged side-by-side

    const sliceWidth = originalCanvas.width / 3;
    const sliceHeight = originalCanvas.height;

    ctx.fillStyle = '#fefbe9';
    ctx.fillRect(0, 0, output.width, output.height);
    
    // Touhou 1-6
    ctx.drawImage(
        originalCanvas,
        0, 0, 459, 101,
        0, 0, 459*1.2, 111*1.2
    );

    // Touhou 7
    ctx.drawImage(
        originalCanvas, 
        7, 145, 112, 108,
        469*1.2, 0, 112*1.2, 108*1.2 
    );

    // Touhou 8 (needs to be scaled down bc of the two paths)
    ctx.drawImage(
        originalCanvas, 132, 112, 222, 136, 
        591*1.22, 0, 222*0.88, 136*0.88
    );

    // Touhou 9
    ctx.drawImage(
        originalCanvas, 374, 162, 249, 86, 
        765*1.22, 17, 249*1.2, 86*1.2
    );

    // Bonus Mainlines
    ctx.drawImage(
        originalCanvas, 468, 10, 182, 119,
        1250, 17, 182, 119
    );

    // Touhou 10 to 14
    ctx.drawImage(
        originalCanvas, 7, 265, 704, 91,
        7, 112*1.2, 704*1.2, 91*1.2
    );

    // Touhou 15, 16
    ctx.drawImage(
        originalCanvas, 7, 367, 449, 92, 
        260*3.35, 111*1.2, 449*1.2, 92*1.2
    );

    // Touhou 17, 18
    ctx.drawImage(
        originalCanvas, 477, 367, 299, 91,
        1120, 256, 299*1.2, 91*1.2
    );

    // Touhou 19, 20
    ctx.drawImage(
        originalCanvas, 7, 469, 636, 91,
        720, 366, 636*1.2, 91*1.2
    );

    ctx.fillStyle = "black";
    ctx.font = "40px touhouFont";
    ctx.fillText("1CC CHART", 720, 266, 1000);
    ctx.fillText("DRNEOTECH.COM/1CCTRACKER", 720, 296, 1000);

    // Extras
    // ctx.drawImage(
    //     originalCanvas, 7, 585, 667, 177,
    //     820, 301, 667, 200
    // );

    var image = output.toDataURL("image/png");
    window.open(image, '_blank');
}

const boxWidth = 17;
function drawBox(x, y, width = boxWidth, height = boxWidth, lineWidth = 1.0, strokeStyle = 'rgba(128, 128, 128, 1.0)') {
    if (ctx) {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
}
function drawExtraHeader(x, y) {
    if (ctx) {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.lineTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        drawText("EXTRA", 2, y + 8);
    }
}
function drawGFWBox(x, y) {
    if (ctx) {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = 2.0;
        // Do the really annoying thing of tracing around the box...
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x + boxWidth * 6, y);
        const height = easyMode ? 4 : 3;
        ctx.lineTo(x + boxWidth * 6, y + boxWidth * (height - 1));
        ctx.lineTo(x + boxWidth * 7, y + boxWidth * (height - 1));
        ctx.lineTo(x + boxWidth * 7, y + boxWidth * height);
        ctx.lineTo(x, y + boxWidth * height);
        ctx.lineTo(x, y);
        ctx.stroke();
        // We disabled drawing lines for C2 and EX to handle this very
        // annoying edge case, so draw them all in.
        y += 0.5;
        x += 0.5;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.lineTo(x + boxWidth * 5, y + boxWidth * (height - 1));
        ctx.lineTo(x + boxWidth * 6, y + boxWidth * (height - 1));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + boxWidth * 5, y + boxWidth * (height - 1));
        ctx.lineTo(x + boxWidth * 5, y + boxWidth * height);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + boxWidth * 6 - 1, y + boxWidth * (height - 1));
        ctx.lineTo(x + boxWidth * 6 - 1, y + boxWidth * height + 8.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + boxWidth * 6 + 1, y + boxWidth * (height - 1));
        ctx.lineTo(x + boxWidth * 6 + 1, y + boxWidth * height + 8.5);
        ctx.stroke();
    }
}
function drawLOLKBox(x, y) {
    if (ctx) {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = 2.0;
        // Do the really annoying thing of tracing around the box...
        ctx.beginPath();
        ctx.lineTo(x, y + boxWidth);
        ctx.lineTo(x + boxWidth, y + boxWidth);
        ctx.lineTo(x + boxWidth, y);
        ctx.lineTo(x + boxWidth * 2, y);
        ctx.lineTo(x + boxWidth * 2, y + boxWidth);
        ctx.lineTo(x + boxWidth * 3, y + boxWidth);
        ctx.lineTo(x + boxWidth * 3, y);
        ctx.lineTo(x + boxWidth * 4, y);
        ctx.lineTo(x + boxWidth * 4, y + boxWidth);
        ctx.lineTo(x + boxWidth * 5, y + boxWidth);
        ctx.lineTo(x + boxWidth * 5, y);
        ctx.lineTo(x + boxWidth * 6, y);
        ctx.lineTo(x + boxWidth * 6, y + boxWidth);
        ctx.lineTo(x + boxWidth * 7, y + boxWidth);
        ctx.lineTo(x + boxWidth * 7, y);
        ctx.lineTo(x + boxWidth * 8, y);
        if (!easyMode) {
            ctx.lineTo(x + boxWidth * 8, y + boxWidth * 4);
            ctx.lineTo(x, y + boxWidth * 4);
            ctx.lineTo(x, y + boxWidth);
        }
        if (easyMode) {
            ctx.lineTo(x + boxWidth * 8, y + boxWidth * 5);
            ctx.lineTo(x, y + boxWidth * 5);
            ctx.lineTo(x, y + boxWidth);
        }
        ctx.stroke();
    }
}
function drawHSIFSBox(x, y) {
    if (ctx) {
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = 2.0;
        // Do the really annoying thing of tracing around the box...
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x + boxWidth, y);
        ctx.lineTo(x + boxWidth, y + boxWidth);
        ctx.lineTo(x + boxWidth * 4, y + boxWidth);
        ctx.lineTo(x + boxWidth * 4, y);
        ctx.lineTo(x + boxWidth * 5, y);
        ctx.lineTo(x + boxWidth * 5, y + boxWidth);
        ctx.lineTo(x + boxWidth * 8, y + boxWidth);
        ctx.lineTo(x + boxWidth * 8, y);
        ctx.lineTo(x + boxWidth * 9, y);
        ctx.lineTo(x + boxWidth * 9, y + boxWidth);
        ctx.lineTo(x + boxWidth * 12, y + boxWidth);
        ctx.lineTo(x + boxWidth * 12, y);
        ctx.lineTo(x + boxWidth * 13, y);
        ctx.lineTo(x + boxWidth * 13, y + boxWidth);
        ctx.lineTo(x + boxWidth * 16, y + boxWidth);
        let height = 4;
        if (easyMode) {
            height = 5;
        }
        ctx.lineTo(x + boxWidth * 16, y + boxWidth * height);
        ctx.lineTo(x, y + boxWidth * height);
        ctx.lineTo(x, y);
        ctx.stroke();
        // Draw the X dividers
        y += 0.5;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.lineTo(x, y + boxWidth - 2);
        ctx.lineTo(x + boxWidth, y + boxWidth - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + 4 * boxWidth, y + boxWidth - 2);
        ctx.lineTo(x + 5 * boxWidth, y + boxWidth - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + 8 * boxWidth, y + boxWidth - 2);
        ctx.lineTo(x + 9 * boxWidth, y + boxWidth - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + 12 * boxWidth, y + boxWidth - 2);
        ctx.lineTo(x + 13 * boxWidth, y + boxWidth - 2);
        ctx.stroke();
    }
}
function drawTDUMBox(x, y) {
    if (ctx) {
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = 2.0;
        // Do the really annoying thing of tracing around the box...
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x + boxWidth, y);
        ctx.lineTo(x + boxWidth, y + boxWidth);
        ctx.lineTo(x + boxWidth * 2, y + boxWidth);
        ctx.lineTo(x + boxWidth * 2, y);
        ctx.lineTo(x + boxWidth * 3, y);
        ctx.lineTo(x + boxWidth * 3, y + boxWidth);
        ctx.lineTo(x + boxWidth * 4, y + boxWidth);
        ctx.lineTo(x + boxWidth * 4, y);
        ctx.lineTo(x + boxWidth * 5, y);
        ctx.lineTo(x + boxWidth * 5, y + boxWidth);
        ctx.lineTo(x + boxWidth * 6, y + boxWidth);
        ctx.lineTo(x + boxWidth * 6, y);
        ctx.lineTo(x + boxWidth * 7, y);
        ctx.lineTo(x + boxWidth * 7, y + boxWidth);
        ctx.lineTo(x + boxWidth * 8, y + boxWidth);
        const height = easyMode ? 5 : 4;
        ctx.lineTo(x + boxWidth * 8, y + boxWidth * height);
        ctx.lineTo(x, y + boxWidth * height);
        ctx.lineTo(x, y);
        ctx.stroke();
        // Draw the X dividers
        y += 0.5;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.lineTo(x, y + boxWidth - 2);
        ctx.lineTo(x + boxWidth, y + boxWidth - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + 2 * boxWidth, y + boxWidth - 2);
        ctx.lineTo(x + 3 * boxWidth, y + boxWidth - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + 4 * boxWidth, y + boxWidth - 2);
        ctx.lineTo(x + 5 * boxWidth, y + boxWidth - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(x + 6 * boxWidth, y + boxWidth - 2);
        ctx.lineTo(x + 7 * boxWidth, y + boxWidth - 2);
        ctx.stroke();
    }
}
function drawBoxContentsAux(x, y, done, misses, bombs, lives, vertical, focus, pacifist, unique, cellColour, textColour, colour) {
    if (ctx) {
        if (done) {
            ctx.fillStyle = colour;
        }
        else {
            ctx.fillStyle = cellColour;
        }
        ctx.fillRect(x, y, boxWidth, boxWidth);
        // Draw the little bits and pieces
        // Draw miss/bomb/starting counts
        if (misses) {
            drawText(misses, x + 2, y + 7, 'left', "16px touhouFontMini", textColour);
        }
        if (bombs) {
            drawText(bombs, x + 7, y + 7, 'left', "16px touhouFontMini", textColour);
        }
        if (lives) {
            drawText(lives, x + 16, y + 7, 'right', "16px touhouFontMini", textColour);
        }
        // No vertical?
        if (vertical) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = textColour;
            ctx.beginPath();
            ctx.lineTo(x + 1.5, y + boxWidth / 2 - 0.5);
            ctx.lineTo(x + boxWidth - 2.5, y + boxWidth / 2 - 0.5);
            ctx.stroke();
        }
        // No focus / pacifist / unique
        if (focus) {
            drawText("F", x + 2, y + 15, 'left', "16px touhouFontMini", textColour);
        }
        if (pacifist) {
            drawText("P", x + 7, y + 15, 'left', "16px touhouFontMini", textColour);
        }
        if (unique) {
            drawText("U", x + 12, y + 15, 'left', "16px touhouFontMini", textColour);
        }
    }
}
function drawBoxContents(x, y, boxName, colour) {
    const box = getBoxFromState([new Path2D(), boxName]);
    drawBoxContentsAux(x, y, box.done, box.misses, box.bombs, box.lives, box.vertical, box.focus, box.pacifist, box.unique, box.cellColour, box.textColour, colour);
}
class Character {
    constructor(name, fullName, subcharacters = []) {
        this.name = name;
        this.fullName = fullName;
        this.subcharacters = subcharacters.slice();
    }
}
class BoxObject {
    constructor(name) {
        this.name = name;
        this.textColour = '#000000';
        this.cellColour = '#FFFFFF';
        this.done = false;
        this.pacifist = false;
        this.unique = false;
        this.focus = false;
        this.vertical = false;
        this.lives = null;
        this.bombs = null;
        this.misses = null;
    }
}
class Game {
    constructor(name, colour, difficulties, characters) {
        this.name = name;
        this.colour = colour;
        this.difficulties = difficulties.slice();
        this.characters = characters.slice();
    }
}

var hrtp = new Game("HRTP", "rgba(210, 60, 255, 1.0)", "LHN".split(''), [
    new Character("", "Reimu", ["ma", "j"])]);
var soew = new Game("SOEW", "rgba(32, 51, 255, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b", "c"])]);
var podd = new Game("PODD", "rgba(255, 92, 92, 1.0)", "LHN".split(''), [
    new Character("R", "Reimu"),
    new Character("MI", "Mima"),
    new Character("M", "Marisa"),
    new Character("EL", "Ellen"),
    new Character("KH", "Kotohime"),
    new Character("KA", "Kana"),
    new Character("RI", "Rikako"),
    new Character("CH", "Chiyuri"),
    new Character("YM", "Yumemi")]);
var lls = new Game("LLS", "rgba(73, 250, 76, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b"]),
    new Character("M", "Marisa", ["a", "b"])]);
var ms = new Game("MS", "rgba(194, 36, 128, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("MI", "Mima"),
    new Character("YK", "Yuuka")]);
var eosd = new Game("EOSD", "rgba(255, 51, 18, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b"]),
    new Character("M", "Marisa", ["a", "b"])]);
var stb = new Game("STB", "rgba(99, 44, 0, 1.0)", ["85", "66"], [
    new Character("AY", "Aya")]);
var ds = new Game("DS", "rgba(10, 34, 119, 1.0)", ["108", "58"], [
    new Character("AY", "Aya"), 
    new Character("HA", "Hatate")]);
var isc = new Game("ISC", "rgba(99, 44, 0, 1.0)", ["NI", "C"], [
    new Character("SJ", "Seija")]);
var vd = new Game("VD", "rgba(163, 73, 164, 1.0)", ["103", "C"], [
    new Character("SM", "Sumireko")]);
var bm = new Game("100BM", "rgba(232, 125, 0, 1.0)", ["85", "C"], [
    new Character("M", "Marisa")]);
var pcb = new Game("PCB", "rgba(255, 127, 191, 1.0)", "PXLHN".split(''), [
    new Character("R", "Reimu", ["a", "b"]),
    new Character("M", "Marisa", ["a", "b"]),
    new Character("S", "Sakuya", ["a", "b"])]);
var imp = new Game("IN", "rgba(196, 101, 0, 1.0)", ["X", "B-L", "B-H", "B-N", "A-L", "A-H", "A-N"], [
    new Character("BT", "Border Team"),
    new Character("MT", "Magic Team"),
    new Character("ST", "Scarlet Team"),
    new Character("NT", "Netherworld Team"),
    new Character("R", "Reimu"),
    new Character("YU", "Yukari"),
    new Character("M", "Marisa"),
    new Character("A", "Alice"),
    new Character("S", "Sakuya"),
    new Character("RE", "Remelia"),
    new Character("Y", "Yuyuko"),
    new Character("YY", "Youmu")]);
var pofv = new Game("POFV", "rgba(16, 15, 107, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("S", "Sakuya"),
    new Character("Y", "Youmu"),
    new Character("RS", "Reisen"),
    new Character("C", "Cirno"),
    new Character("L", "Lunasa"),
    new Character("MY", "Mystia"),
    new Character("T", "Tewi"),
    new Character("AY", "Aya"),
    new Character("ME", "Medicine"),
    new Character("YK", "Yuuka"),
    new Character("K", "Komachi"),
    new Character("E", "Eiki")]);
var mof = new Game("MOF", "rgba(255, 168, 0, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b", "c"]),
    new Character("M", "Marisa", ["a", "b", "c"])]);
var sa = new Game("SA", "rgba(0, 201, 109, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b", "c"]),
    new Character("M", "Marisa", ["a", "b", "c"])]);
var ufo = new Game("UFO", "rgba(127, 191, 255, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b"]),
    new Character("M", "Marisa", ["a", "b"]),
    new Character("SN", "Sanae", ["a", "b"])]);
var gfw = new Game("GFW", "rgba(127, 253, 255, 1.0)", "LHN".split(''), [
    new Character("A1", "Route A-1"),
    new Character("A2", "Route A-2"),
    new Character("B1", "Route B-1"),
    new Character("B2", "Route B-2"),
    new Character("C1", "Route C-1"),
    new Character("C2", "Route C-2"),
    new Character("EX", "Extra Route")]);
var td = new Game("TD", "rgba(255, 191, 127, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["e1", "e2"]),
    new Character("M", "Marisa", ["e1", "e2"]),
    new Character("SN", "Sanae", ["e1", "e2"]),
    new Character("Y", "Youmu", ["e1", "e2"])]);
var ddc = new Game("DDC", "rgba(123, 95, 135, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["a", "b"]),
    new Character("M", "Marisa", ["a", "b"]),
    new Character("S", "Sakuya", ["a", "b"])]);
var lolk = new Game("LOLK", "rgba(159, 21, 41, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["p", "l"]),
    new Character("M", "Marisa", ["p", "l"]),
    new Character("SN", "Sanae", ["p", "l"]),
    new Character("RS", "Reisen", ["p", "l"])]);
var hsifs = new Game("HSIFS", "rgba(255, 127, 39, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["sp", "sm", "f", "w"]),
    new Character("C", "Cirno", ["sp", "sm", "f", "w"]),
    new Character("AY", "Aya", ["sp", "sm", "f", "w"]),
    new Character("M", "Marisa", ["sp", "sm", "f", "w"])]);
var wbawc = new Game("WBAWC", "rgba(224, 66, 44, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["w", "o", "e"]),
    new Character("M", "Marisa", ["w", "o", "e"]),
    new Character("Y", "Youmu", ["w", "o", "e"])]);
var um = new Game("UM", "rgba(0, 201, 109, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["e1", "e2"]),
    new Character("M", "Marisa", ["e1", "e2"]),
    new Character("S", "Sakuya", ["e1", "e2"]),
    new Character("SN", "Sanae", ["e1", "e2"])]);
var udoalg = new Game("UDOALG", "rgba(74, 124, 71, 1.0)", "LHN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("SN", "Sanae"),
    new Character("RA", "Ran"),
    new Character("A", "Aunn"),
    new Character("N", "Nazrin"),
    new Character("SR", "Seiran"),
    new Character("RI", "Rin"),
    new Character("TS", "Tsukasa"),
    new Character("MM", "Mamizou"),
    new Character("YC", "Yachie"),
    new Character("SK", "Saki"),
    new Character("YT", "Yuuma"),
    new Character("SU", "Suika"),
    new Character("BS", "Son Biten"),
    new Character("EN", "Enoko"),
    new Character("CY", "Chiyari"),
    new Character("H", "Hisami"),
    new Character("Z", "Zanmu")]);
var fw = new Game("FW", "rgba(90, 133, 250, 1.0)", "XLHN".split(''), [
    new Character("R", "Reimu", ["sd", "cr", "sb", "bs", "ys", "im", "bh", "sw"]),
    new Character("M", "Marisa", ["sd", "cr", "sb", "bs", "ys", "im", "bh", "sw"])]);
var iamp = new Game("IAMP", "rgba(78, 22, 86, 1.0)", "LHN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("S", "Sakuya"),
    new Character("A", "Alice"),
    new Character("P", "Patchouli"),
    new Character("Y", "Youmu"),
    new Character("RE", "Remelia"),
    new Character("YY", "Yuyuko"),
    new Character("YU", "Yukari"),
    new Character("SU", "Suika")]);
var swr = new Game("SWR", "rgba(255, 51, 18, 1.0)", "LHN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("S", "Sakuya"),
    new Character("A", "Alice"),
    new Character("P", "Patchouli"),
    new Character("Y", "Youmu"),
    new Character("RE", "Remelia"),
    new Character("YY", "Yuyuko"),
    new Character("YU", "Yukari"),
    new Character("SU", "Suika"),
    new Character("RS", "Reisen"),
    new Character("AY", "Aya"),
    new Character("K", "Komachi"),
    new Character("I", "Iku"),
    new Character("TE", "Tenshi")]);
var hsoku = new Game("H.SOKU", "rgba(210, 210, 210, 1.0)", "LHN".split(''), [
    new Character("SN", "Sanae"),
    new Character("C", "Cirno"),
    new Character("ML", "Meiling")]);
var hm = new Game("HM", "rgba(179, 193, 148, 1.0)", "LHN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("IC", "Ichirin"),
    new Character("B", "Byakuren"),
    new Character("F", "Futo"),
    new Character("TO", "Toyosatomimi"),
    new Character("N", "Nitori"),
    new Character("KO", "Koishi"),
    new Character("MA", "Mamizou"),
    new Character("KK", "Kokoro")]);
let ulil = new Game("ULIL", "rgba(0, 136, 148, 1.0)", "LHN".split(''), [
    new Character("R1", "Reimu"), 
    new Character("M", "Marisa"),
    new Character("IC", "Ichirin"),
    new Character("B", "Byakuren"),
    new Character("F", "Futo"),
    new Character("TO", "Toyosatomimi"),
    new Character("N", "Nitori"),
    new Character("KO", "Koishi"),
    new Character("MA", "Mamizou"),
    new Character("KK", "Kokoro"),
    new Character("MO", "Mokou"),
    new Character("SH", "Shinmyoumaru"),
    new Character("KA", "Kasen"),
    new Character("SM", "Sumireko"),
    new Character("R2", "Reimu Ending")]);
var aocf = new Game("AOCF", "rgba(201, 143, 255, 1.0)", "OLHN".split(''), [
    new Character("R", "Reimu & Kasen"),
    new Character("M", "Marisa & Koishi"),
    new Character("N", "Nitori & Kokoro"),
    new Character("MA", "Mamizou & Mokou"),
    new Character("TO", "Miko & Byakuren"),
    new Character("F", "Futo & Ichirin"),
    new Character("RS", "Reisen & Doremy"),
    new Character("SM", "Sumireko & Doremy"),
    new Character("TE", "Tenshi & Shinmyoumaru"),
    new Character("YU", "Yukari & Reimu"),
    new Character("J", "Joon & Shion")]);
var gi = new Game("GI", "rgba(131, 5, 5, 1.0)", "HN".split(''), [
    new Character("R", "Reimu"),
    new Character("M", "Marisa"),
    new Character("KA", "Kanako"),
    new Character("MU", "Murasa"),
    new Character("J", "Joon"),
    new Character("FL", "Flandre", ["a", "b", "c"]),
    new Character("YT", "Yuuma")]);
let lastX = 0;
let lastY = 0;


function drawText(text, x, y, align = 'left', font = "16px touhouFont", colour = "black") {
    x -= 0.5; // Dumb hack for Windows
    if (ctx) {
        ctx.font = font;
        ctx.textAlign = align;
        ctx.fillStyle = colour;
        ctx.fillText(text, x, y - 1);
    }
}
function drawUILine(x, y, drop, width) {
    if (ctx) {
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + drop);
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = width;
        ctx.stroke();
    }
}
function drawDot(colour, x, y, width = 2) {
    if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = colour;
        ctx.arc(x, y, width, 0, 2 * Math.PI);
        ctx.fill();
    }
}
let boxes = [];
function drawGame(game, baseX, baseY, drawDifficulties = false) {
    // Except for certain games, we can just draw a difficulties-by-subcharacters box grid
    let width = 0;
    // Expand out the subcharacters while we're at it
    let expandedChars = [];
    for (let character of game.characters) {
        if (character.subcharacters.length > 0) {
            width += character.subcharacters.length;
            for (let subcharacter of character.subcharacters) {
                expandedChars.push([character.name + subcharacter, character.fullName]);
            }
        }
        else {
            width += 1;
            expandedChars.push([character.name, character.fullName]);
        }
    }
    // Easy mode toggle need special work
    let difficulties = game.difficulties.slice();
    if (easyMode) {
        if (game.name === 'IN') {
            difficulties = ["X", "B-L", "B-H", "B-N", "B-E", "A-L", "A-H", "A-N", "A-E"];
        }
        else if (difficulties[difficulties.length - 1] === 'N') {
            difficulties.push('E');
        }
    }
    const height = difficulties.length;
    // Draw difficulties?
    if (drawDifficulties) {
        if (game.name === 'IN') {
            // IN has an A/B split, so do this custom-style.
            difficulties = 'XLHNLHN'.split('');
            if (easyMode) {
                difficulties = 'XLHNELHNE'.split('');
            }
            if (ctx) {
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.lineTo(baseX - 3.5, baseY + (boxWidth));
                ctx.lineTo(baseX + 15, baseY + (boxWidth));
                ctx.stroke();
                drawText("B", baseX - 2, baseY + (boxWidth) + 7);
                let aOffset = 4;
                if (easyMode) {
                    aOffset = 5;
                }
                ctx.beginPath();
                ctx.lineTo(baseX - 3.5, baseY + (aOffset * boxWidth));
                ctx.lineTo(baseX + 15, baseY + (aOffset * boxWidth));
                ctx.stroke();
                drawText("A", baseX - 2, baseY + (aOffset * boxWidth) + 7);
            }
        }
        let y = 1;
        for (let difficulty of difficulties) {
            drawText(difficulty, baseX + 11, baseY + (y * boxWidth) - 1, 'right');
            y += 1;
        }
        baseX += 14;
    }
    if (game.name === 'IN') {
        // We screwed with IN to make it render nice, so fix it up again.
        if (easyMode) {
            difficulties = ["X", "B-L", "B-H", "B-N", "B-E", "A-L", "A-H", "A-N", "A-E"];
        } else {
            difficulties = ["X", "B-L", "B-H", "B-N", "A-L", "A-H", "A-N"];
        }
    }
    let dotOffset = 0;
    if (width == 1) {
        dotOffset = -6;
    }
    let dotNameOffset = 3;
    const gap = 4;
    if (game.name === 'GFW' || game.name === 'PODD') {
        dotNameOffset = 4;
    }
    // Draw game colour dot
    drawDot(game.colour, baseX + dotNameOffset + dotOffset, baseY - 5);
    // Draw game name
    drawText(game.name, baseX + dotNameOffset + gap + dotOffset, baseY - 2);
    let lastY = 0;
    // Draw individual boxes
    let x = 0;
    let y = 0;
    for (let characterNames of expandedChars) {
        y = 0;
        let character = characterNames[0];
        for (let difficulty of difficulties) {
            // Some games need to skip boxes...
            let skipBox = false;
            let skipDraw = false;
            skipBox = skipBox || (game.name === 'GFW' && character === 'EX' && difficulty !== 'N');
            skipBox = skipBox || (game.name === 'LOLK' && !character.endsWith('l') && difficulty === 'X');
            skipBox = skipBox || (game.name === 'HSIFS' && !character.endsWith('sp') && difficulty === 'X');
            skipBox = skipBox || (game.name === 'TD' && character.endsWith('2') && difficulty === 'X');
            skipBox = skipBox || (game.name === 'UM' && character.endsWith('2') && difficulty === 'X');
            skipDraw = (game.name === 'GFW' && character === 'EX' && difficulty === 'N');
            if (easyMode) {
                skipDraw = skipDraw || (game.name === 'GFW' && character === 'C2' && difficulty === 'E');
            }
            else {
                skipDraw = skipDraw || (game.name === 'GFW' && character === 'C2' && difficulty === 'N');
            }
            if (!skipBox) {
                let yDraw = y;
                if (game.name === 'GFW' && character === 'EX' && difficulty === 'N' && easyMode) {
                    yDraw += 1;
                }
                let box = new Path2D();
                box.rect(baseX + (x * boxWidth) + 0.5, baseY + (yDraw * boxWidth) + 0.5, boxWidth - 1, boxWidth - 1);
                let boxName = game.name + '-' + character + '-' + difficulty;
                boxes.push([box, boxName, characterNames[1]]);
                drawBoxContents(baseX + (x * boxWidth), baseY + (yDraw * boxWidth), boxName, game.colour);
                if (!skipDraw) {
                    drawBox(baseX + (x * boxWidth), baseY + (yDraw * boxWidth), boxWidth, boxWidth, 1);
                }
            }
            lastY = baseY + (y * boxWidth);
            y++;
        }
        lastX = baseX + (x * boxWidth);
        x++;
    }
    // Draw outer box, except for annoying games like LOLK, GFW and HSIFS.
    if (game.name != 'TD' && game.name != 'UM' && game.name !== 'LOLK' && game.name !== 'GFW' && game.name !== 'HSIFS') {
        drawBox(baseX - 0.5, baseY - 0.5, boxWidth * width, boxWidth * height, 2);
    }
    if (game.name === 'LOLK') {
        drawLOLKBox(baseX - 0.5, baseY - 0.5);
    }
    if (game.name === 'TD' || game.name === 'UM') {
        drawTDUMBox(baseX - 0.5, baseY - 0.5);
    }
    if (game.name === 'GFW') {
        drawGFWBox(baseX - 0.5, baseY - 0.5);
    }
    if (game.name === 'HSIFS') {
        drawHSIFSBox(baseX - 0.5, baseY - 0.5);
    }
    // Draw characters
    let charX = 0;
    for (let character of game.characters) {
        if (character.subcharacters.length > 0) {
            let lineWidth = 1;
            let xAdjust = 0;
            let yAdjust = 0.5;
            // If this is the first character, we need a long thick bar at the start..
            if (charX == 0) {
                lineWidth = 2;
                xAdjust = -0.5;
                yAdjust = 0.5;
            }
            drawUILine(xAdjust + (charX * boxWidth) + baseX, yAdjust + lastY + boxWidth, boxWidth - 2, lineWidth);
            drawText(character.name, baseX + (charX * boxWidth) + 2, lastY + (boxWidth) + 14);
            for (let subcharacter of character.subcharacters) {
                drawText(subcharacter, baseX + (charX * boxWidth) + 2, lastY + (boxWidth) + 7, 'left', "16px touhouFontMini");
                charX += 1;
            }
            charX -= 1;
        }
        else {
            // If this is the first chracter, we need a thick short bar at the start, otherwise a thin one
            let lineWidth = 1;
            let xAdjust = 1;
            let yAdjust = 0.5;
            let textAdjust = 0;
            if (charX == 0) {
                lineWidth = 2;
                xAdjust = 0.5;
            }
            if (game.name === 'GFW' && character.name === 'EX') {
                textAdjust = 1;
            }
            else {
                // We draw the GFW EX line ourselves
                drawUILine(xAdjust + baseX - 1 + (charX * boxWidth), lastY + boxWidth, boxWidth - 8 + yAdjust, lineWidth);
            }
            drawText(character.name, textAdjust + baseX + (charX * boxWidth) + 2, lastY + (boxWidth) + 8);
        }
        charX += 1;
    }
    // Draw closing bar
    drawUILine(baseX - 0.5 + (charX * boxWidth), lastY + boxWidth + 0.5, boxWidth - 8, 2);
}
if (ctx) {
    downloadButton.addEventListener('click', download);
    canvas.addEventListener('click', function (event) {
        event.preventDefault();
        var ClientRect = canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - ClientRect.left) * scale;
        const y = Math.round(event.clientY - ClientRect.top) * scale;
        let found = false;
        for (let box of boxes) {
            if (ctx.isPointInPath(box[0], x, y)) {
                found = true;
                selectBox(box);
                drawScreen();
                if (debugDiv) {
                    debugDiv.innerHTML = `${box[1]} (${box[2]})`;
                }
                break;
            }
        }
        if (!found) {
            deselectBox();
            if (debugDiv) {
                debugDiv.innerHTML = '(Double-)Click a square!';
            }
            drawScreen();
        }
        return false;
    });
    canvas.addEventListener('dblclick', function (event) {
        event.preventDefault();
        var ClientRect = canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - ClientRect.left) * scale;
        const y = Math.round(event.clientY - ClientRect.top) * scale;
        let found = false;
        for (let box of boxes) {
            if (ctx.isPointInPath(box[0], x, y)) {
                found = true;
                selectBox(box);
                toggleDone();
                setCompletion();
                break;
            }
        }
        if (!found) {
            deselectBox();
            if (debugDiv) {
                debugDiv.innerHTML = '(Double-)Click a square!';
            }
            drawScreen();
        }
        return false;
    });
    canvas.addEventListener('contextmenu', function (event) {
        deselectBox();
        if (debugDiv) {
            debugDiv.innerHTML = '(Double-)Click a square!';
        }
        drawScreen();
    });
}
let selectedBox = null;
function setupControls() {
    const doneCheckbox = document.getElementById('doneCheckbox');
    doneCheckbox.addEventListener('change', updateDoneStatus);
    const pacifistCheckbox = document.getElementById('pacifistCheckbox');
    pacifistCheckbox.addEventListener('change', updatePacifistStatus);
    const focusCheckbox = document.getElementById('focusCheckbox');
    focusCheckbox.addEventListener('change', updateFocusStatus);
    const uniqueCheckbox = document.getElementById('uniqueCheckbox');
    uniqueCheckbox.addEventListener('change', updateUniqueStatus);
    const verticalCheckbox = document.getElementById('verticalCheckbox');
    verticalCheckbox.addEventListener('change', updateVerticalStatus);
    const livesSelect = document.getElementById('livesSelect');
    livesSelect.addEventListener('change', updateLives);
    const bombsSelect = document.getElementById('bombsSelect');
    bombsSelect.addEventListener('change', updateBombs);
    const missesSelect = document.getElementById('missesSelect');
    missesSelect.addEventListener('change', updateMisses);
    const cellColour = document.getElementById('bgColour');
    cellColour.addEventListener('change', updateCellColour);
    const textColour = document.getElementById('textColour');
    textColour.addEventListener('change', updateTextColour);
    const bgCheckbox = document.getElementById('useBackgroundCheckbox');
    bgCheckbox.addEventListener('change', updateBgStatus);
    const fightingCheckbox = document.getElementById('fightingCheckbox');
    fightingCheckbox.addEventListener('change', updateFightingStatus);
    const easyCheckbox = document.getElementById('easyCheckbox');
    easyCheckbox.addEventListener('change', updateEasyStatus);
    const legendCheckbox = document.getElementById('legendCheckbox');
    legendCheckbox.addEventListener('change', updateLegendStatus);
    const reisenCheckbox = document.getElementById('reisenCheckbox');
    reisenCheckbox.addEventListener('change', updateReisenStatus);
    const completionCheckbox = document.getElementById('completionCheckbox');
    completionCheckbox.addEventListener('change', updateCompletionStatus);
    // For the checkboxes, set them to whatever's in the checkboxState map, if available.
    let checkboxValue = getCheckboxFromState('bg');
    if (checkboxValue !== null) {
        transparentPng = checkboxValue;
        bgCheckbox.checked = checkboxValue;
    }
    checkboxValue = getCheckboxFromState('fighting');
    if (checkboxValue !== null) {
        showFighting = checkboxValue;
        fightingCheckbox.checked = checkboxValue;
    }
    checkboxValue = getCheckboxFromState('easy');
    if (checkboxValue !== null) {
        easyMode = checkboxValue;
        easyCheckbox.checked = checkboxValue;
    }
    checkboxValue = getCheckboxFromState('legend');
    if (checkboxValue !== null) {
        showLegend = checkboxValue;
        legendCheckbox.checked = checkboxValue;
    }
    checkboxValue = getCheckboxFromState('reisen');
    if (checkboxValue !== null) {
        showReisen = checkboxValue;
        reisenCheckbox.checked = checkboxValue;
    }
    checkboxValue = getCheckboxFromState('completions');
    if (checkboxValue !== null) {
        showCompletions = checkboxValue;
        completionCheckbox.checked = checkboxValue;
    }
}

function toggleDone() {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.done = !currentBox.done;
        setBoxInState(currentBox);
        selectBox(selectedBox);
        drawScreen();
    }
}
function updateCellColour(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.cellColour = e.target.value;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateTextColour(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.textColour = e.target.value;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateDoneStatus(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.done = e.target.checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateFocusStatus(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.focus = e.target.checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updatePacifistStatus(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.pacifist = e.target.checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateVerticalStatus(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.vertical = e.target.checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateUniqueStatus(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.unique = e.target.checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateLives(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.lives = e.target.value;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateBombs(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.bombs = e.target.value;
        setBoxInState(currentBox);
        drawScreen();
    }
}
function updateMisses(e) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.misses = e.target.value;
        setBoxInState(currentBox);
        drawScreen();
    }
}
let transparentPng = true;
let showFighting = true;
let showLegend = true;
let easyMode = false;
let showReisen = false;
let showCompletions = false;

function updateCanvasHeight() {
    let height = 765;
    if (!showFighting && !easyMode) {
        height = 560;
    }
    if (easyMode && !showFighting) {
        height = 570;
        height += 5.5 * boxWidth;
    }
    if (easyMode && showFighting) {
        height = 770;
        height += 7.5 * boxWidth;
    }
    canvas.height = height;
    canvas.style.height = height + "px";
    if (ctx) {
        ctx.translate(0.5, 0.5);
    }
    drawScreen();
}
function updateBgStatus(e) {
    transparentPng = e.target.checked;
    setCheckboxInState('bg', transparentPng);
    drawScreen();
}
function updateLegendStatus(e) {
    showLegend = e.target.checked;
    setCheckboxInState('legend', showLegend);
    drawScreen();
}
function updateFightingStatus(e) {
    showFighting = e.target.checked;
    setCheckboxInState('fighting', showFighting);
    updateCanvasHeight();
    setCompletion();
}
function updateEasyStatus(e) {
    easyMode = e.target.checked;
    setCheckboxInState('easy', easyMode);
    updateCanvasHeight();
    setCompletion();
}
function updateReisenStatus(e) {
    showReisen = e.target.checked;
    setCheckboxInState('reisen', showReisen);
    drawScreen();
    setCompletion();
}
function updateCompletionStatus(e) {
    showCompletions = e.target.checked;
    setCheckboxInState('completions', showCompletions);
    setCompletion();
}

async function setCompletion() {
    if (showCompletions) {
        completionDiv.style.display = 'block';
        var {completed, total, percentage} = await getCompletions();
        completion.innerText = completed + " / " + total + " completed. (" + percentage + "%)";
    } else {
        completionDiv.style.display = 'none';
    }
}

function selectBox(box) {
    selectedBox = box;
    // Enable all the buttons
    const doneCheckbox = document.getElementById('doneCheckbox');
    doneCheckbox.disabled = false;
    const verticalCheckbox = document.getElementById('verticalCheckbox');
    verticalCheckbox.disabled = false;
    const pacifistCheckbox = document.getElementById('pacifistCheckbox');
    pacifistCheckbox.disabled = false;
    const uniqueCheckbox = document.getElementById('uniqueCheckbox');
    uniqueCheckbox.disabled = false;
    const focusCheckbox = document.getElementById('focusCheckbox');
    focusCheckbox.disabled = false;
    const livesSelect = document.getElementById('livesSelect');
    livesSelect.disabled = false;
    const missesSelect = document.getElementById('missesSelect');
    missesSelect.disabled = false;
    const bombsSelect = document.getElementById('bombsSelect');
    bombsSelect.disabled = false;
    const cellColour = document.getElementById('bgColour');
    cellColour.disabled = false;
    const textColour = document.getElementById('textColour');
    textColour.disabled = false;
    // Set their state according to the selected box
    const boxObject = getBoxFromState(box);
    doneCheckbox.checked = boxObject.done;
    pacifistCheckbox.checked = boxObject.pacifist;
    focusCheckbox.checked = boxObject.focus;
    uniqueCheckbox.checked = boxObject.unique;
    verticalCheckbox.checked = boxObject.vertical;
    cellColour.value = boxObject.cellColour;
    textColour.value = boxObject.textColour;
    if (boxObject.lives) {
        livesSelect.value = boxObject.lives;
    }
    else {
        livesSelect.value = "";
    }
    if (boxObject.misses) {
        missesSelect.value = boxObject.misses;
    }
    else {
        missesSelect.value = "";
    }
    if (boxObject.bombs) {
        bombsSelect.value = boxObject.bombs;
    }
    else {
        bombsSelect.value = "";
    }
}
function deselectBox() {
    selectedBox = null;
    // Disable the controls!
    const doneCheckbox = document.getElementById('doneCheckbox');
    doneCheckbox.disabled = true;
    doneCheckbox.checked = false;
    const focusCheckbox = document.getElementById('focusCheckbox');
    focusCheckbox.disabled = true;
    focusCheckbox.checked = false;
    const pacifistCheckbox = document.getElementById('pacifistCheckbox');
    pacifistCheckbox.disabled = true;
    pacifistCheckbox.checked = false;
    const uniqueCheckbox = document.getElementById('uniqueCheckbox');
    uniqueCheckbox.disabled = true;
    uniqueCheckbox.checked = false;
    const verticalCheckbox = document.getElementById('verticalCheckbox');
    verticalCheckbox.disabled = true;
    verticalCheckbox.checked = false;
    const livesSelect = document.getElementById('livesSelect');
    livesSelect.disabled = true;
    livesSelect.value = "";
    const missesSelect = document.getElementById('missesSelect');
    missesSelect.disabled = true;
    missesSelect.value = "";
    const bombsSelect = document.getElementById('bombsSelect');
    bombsSelect.disabled = true;
    bombsSelect.value = "";
    const cellColour = document.getElementById('bgColour');
    cellColour.disabled = true;
    cellColour.value = "#ffffff";
    const textColour = document.getElementById('textColour');
    textColour.disabled = true;
    textColour.value = "#000000";
}
function drawHighlight() {
    if (selectedBox) {
        if (ctx) {
            ctx.lineCap = 'butt';
            ctx.lineJoin = 'miter';
            ctx.strokeStyle = 'rgba(128, 0, 0, 1.0)';
            ctx.lineWidth = 2.0;
            ctx.stroke(selectedBox[0]);
        }
    }
}
function drawLegend() {
    const topLeft = canvas.width - 8 * boxWidth + 2.5;
    const textOffset = topLeft - 0.5;
    if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(topLeft, -2.5, 8 * boxWidth, 15 * boxWidth);
        drawBox(canvas.width - 8 * boxWidth + 2.5, -2.5, 8 * boxWidth, 15 * boxWidth, 2.0);
        drawBox(canvas.width - 8 * boxWidth + 2.5, -2.5, 8 * boxWidth, 10 * boxWidth + 6, 2.0);
        drawText("LEGEND", textOffset + 5, 8);
        let yOffset = 0;
        drawBoxContentsAux(topLeft + 5.5, 15, false, "0", null, null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth, 15, false, "1", null, null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 2, 15, false, "2", null, null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 3, 15, false, "3", null, null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBox(topLeft + 5, 14 + 0.5, 4 * boxWidth, boxWidth, 2.0);
        drawBox(topLeft + 5.5, 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + boxWidth, 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 2 * boxWidth, 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 3 * boxWidth, 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawText("ETC", textOffset + 10 + 4 * boxWidth, 22);
        drawText("MISS COUNT", textOffset + 5, 8 + boxWidth * 2 - 3);
        yOffset = boxWidth * 2 - 6;
        drawBoxContentsAux(topLeft + 5.5, yOffset + 15, false, null, "0", null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth, yOffset + 15, false, null, "1", null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 2, yOffset + 15, false, null, "2", null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 3, yOffset + 15, false, null, "3", null, false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBox(topLeft + 5, yOffset + 14 + 0.5, 4 * boxWidth, boxWidth, 2.0);
        drawBox(topLeft + 5.5, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 2 * boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 3 * boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawText("ETC", textOffset + 10 + 4 * boxWidth, yOffset + 22);
        drawText("BOMB COUNT", textOffset + 5, yOffset + 8 + boxWidth * 2 - 3);
        yOffset = boxWidth * 4 - 12;
        drawBoxContentsAux(topLeft + 6, yOffset + 15, false, null, null, "7", false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth, yOffset + 15, false, null, null, "6", false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 2, yOffset + 15, false, null, null, "5", false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 3, yOffset + 15, false, null, null, "4", false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 4, yOffset + 15, false, null, null, "2", false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 5, yOffset + 15, false, null, null, "1", false, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBox(topLeft + 5, yOffset + 14 + 0.5, 6 * boxWidth, boxWidth, 2.0);
        drawBox(topLeft + 5.5, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 2 * boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 3 * boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 4 * boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawBox(topLeft + 5.5 + 5 * boxWidth, yOffset + 14 + 0.5, boxWidth, boxWidth, 1.0);
        drawText("STARTING LIVES", textOffset + 5, yOffset + 8 + boxWidth * 2 - 3);
        yOffset = boxWidth * 6 - 18;
        drawBoxContentsAux(topLeft + 5.5, yOffset + 14, false, null, null, null, true, false, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5, yOffset + 14 + boxWidth, false, null, null, null, false, true, false, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5, yOffset + 14 + boxWidth * 2, false, null, null, null, false, false, true, false, "#FFFFFF", "#000000", "#FFFFFF");
        drawBoxContentsAux(topLeft + 5.5, yOffset + 14 + boxWidth * 3, false, null, null, null, false, false, false, true, "#FFFFFF", "#000000", "#FFFFFF");
        drawBox(topLeft + 5, yOffset + 14 + 0.5, boxWidth, boxWidth * 4, 2.0);
        drawBox(topLeft + 5, yOffset + 14, boxWidth, boxWidth, 1.0);
        drawText("NO", textOffset + 8 + boxWidth, yOffset + 22);
        drawText("VERTICAL", textOffset + 8 + boxWidth, yOffset + 28);
        drawBox(topLeft + 5, boxWidth + yOffset + 14, boxWidth, boxWidth, 1.0);
        drawText("F", textOffset + 26 + boxWidth, yOffset + 21 + boxWidth, 'left', "16px touhouFont", "red");
        drawText("NO  OCUS", textOffset + 8 + boxWidth, yOffset + 21 + boxWidth);
        drawBox(topLeft + 5, 2 * boxWidth + yOffset + 14, boxWidth, boxWidth, 1.0);
        drawText("P", textOffset + 8 + boxWidth, yOffset + 21 + boxWidth * 2, 'left', "16px touhouFont", "red");
        drawText(" ACIFIST", textOffset + 8 + boxWidth, yOffset + 21 + boxWidth * 2);
        drawBox(topLeft + 5, 3 * boxWidth + yOffset + 14, boxWidth, boxWidth, 1.0);
        drawText("U", textOffset + 8 + boxWidth, yOffset + 21 + boxWidth * 3, 'left', "16px touhouFont", "red");
        drawText(" NIQUE", textOffset + 8 + boxWidth, yOffset + 21 + boxWidth * 3);
        drawText(" (GAME-SPECIFIC)", textOffset + 6 + boxWidth, yOffset + 27 + boxWidth * 3);
        drawText("LIMITATION", textOffset + 8 + boxWidth, yOffset + 33 + boxWidth * 3);
        yOffset = 10 * boxWidth + 6;
        drawText("METADATA", textOffset + 5, yOffset + 6);
        drawText("1234567890", textOffset + 5, yOffset + 14);
        drawText("QWERTYUIOP", textOffset + 5, yOffset + 20);
        drawText("ASDFGHJKL", textOffset + 5, yOffset + 26);
        drawText("ZXCVBNM", textOffset + 5, yOffset + 32);
        drawText("18", topLeft + 10.5 + boxWidth * 4, yOffset + 13, 'left', "16px touhouFontMini");
        drawText("1", topLeft + 24.5 + boxWidth * 4, yOffset + 13 + boxWidth / 2, 'left', "16px touhouFontMini");
        drawText("8", topLeft + 24.5 + boxWidth * 4, yOffset + 13 + boxWidth / 2 + 6, 'left', "16px touhouFontMini");
        drawBox(topLeft + 5.5 + boxWidth * 4, yOffset + 14, boxWidth, boxWidth, 1.0);
        drawBoxContentsAux(topLeft + 5.5 + boxWidth * 6, yOffset + 14, false, "0", "0", "1", true, true, true, true, "#FFFFFF", "#000000", "#FFFFFF");
        drawBox(topLeft + 5.5 + boxWidth * 6, yOffset + 14, boxWidth, boxWidth, 1.0);
        drawText("CREATE YOUR CHART AT:", textOffset + 5, yOffset + 48);
        drawText("TINYURL.COM/TJ9829WC", textOffset + 5, yOffset + 54);
        drawText("FONT SIZE 5 PIXELS", textOffset + 5, yOffset + 70);
    }
}
function drawScreen() {
    boxes = [];
    if (ctx) {
        ctx.clearRect(-2, -2, canvas.width + 2, canvas.height + 2);
        if (!transparentPng) {
            ctx.fillStyle = 'white';
            ctx.fillRect(-2, -2, canvas.width + 2, canvas.height + 2);
        }
    }
    let yOffset = boxWidth;
    drawText("1CC CHART", 2, 6);
    if (showLegend) {
        drawLegend();
    }
    drawGame(hrtp, 2, yOffset + boxWidth, true);
    drawGame(soew, lastX + boxWidth, yOffset);
    drawGame(podd, lastX + boxWidth, yOffset + boxWidth);
    drawGame(lls, lastX + boxWidth, yOffset);
    drawGame(ms, lastX + boxWidth, yOffset);
    drawGame(eosd, lastX + boxWidth, yOffset);
    drawGame(stb, lastX + 2 * boxWidth - 6, yOffset + 0 * boxWidth, true);
    drawGame(ds, lastX + 2 * boxWidth - 4, yOffset + 0 * boxWidth, true);
    drawGame(isc, lastX + 2 * boxWidth - 8, yOffset + 0 * boxWidth, true);
    drawGame(vd, lastX + 2 * boxWidth, yOffset + 0 * boxWidth, true);
    drawGame(bm, 27.585 * boxWidth, yOffset + 4 * boxWidth, true);
    if (easyMode) {
        yOffset += boxWidth;
    }
    let pcvPofvOffset = 0;
    if (easyMode) {
        pcvPofvOffset = 1;
    }
    drawGame(pcb, 2, yOffset + ((pcvPofvOffset + 8) * boxWidth), true);
    drawGame(imp, lastX + 2 * boxWidth, yOffset + 6 * boxWidth, true);
    drawGame(pofv, lastX + 2 * boxWidth, yOffset + ((pcvPofvOffset + 9) * boxWidth), true);
    if (easyMode) {
        yOffset += 2 * boxWidth;
    }
    drawGame(mof, 2, yOffset + 15 * boxWidth, true);
    drawGame(sa, lastX + boxWidth, yOffset + 15 * boxWidth);
    drawGame(ufo, lastX + boxWidth, yOffset + 15 * boxWidth);
    drawGame(gfw, lastX + boxWidth, yOffset + 16 * boxWidth);
    drawGame(td, lastX + 2 * boxWidth, yOffset + 15 * boxWidth, true);
    drawGame(ddc, lastX + boxWidth, yOffset + 15 * boxWidth);
    if (easyMode) {
        yOffset += boxWidth;
    }
    drawGame(lolk, 2, yOffset + 21 * boxWidth, true);
    drawGame(hsifs, lastX + 2 * boxWidth, yOffset + 21 * boxWidth, true);
    drawGame(wbawc, lastX + 2 * boxWidth, yOffset + 21 * boxWidth, true);
    drawGame(um, lastX + boxWidth, yOffset + 21 * boxWidth);
    if (easyMode) {
        yOffset += boxWidth;
    }
    drawGame(udoalg, 2, yOffset + 28 * boxWidth, true);
    drawGame(fw, lastX + 2 * boxWidth, yOffset + 27 * boxWidth, true);
    if (easyMode) {
        yOffset += boxWidth;
    }
    if (showFighting) {
        drawExtraHeader(lastX, yOffset + 32.35 * boxWidth);
        drawGame(iamp, 2, yOffset + 33.85 * boxWidth, true);
        drawGame(swr, lastX + boxWidth, yOffset + 33.85 * boxWidth);
        drawGame(hsoku, lastX + boxWidth, yOffset + 33.85 * boxWidth);
        drawGame(hm, lastX + boxWidth, yOffset + 33.85 * boxWidth);
        if (easyMode) {
            yOffset += boxWidth;
        }
        ulil.characters = ulil.characters.filter((char) => char.name !== "RS");
        if (showReisen) {
            ulil.characters.push(new Character("RS", "Reisen"));
        }
        drawGame(ulil, 2, yOffset + 39.85 * boxWidth, true);
        drawGame(aocf, lastX + 2 * boxWidth, yOffset + 38.85 * boxWidth, true);
        drawGame(gi, lastX + 2 * boxWidth, yOffset + 40.85 * boxWidth, true);
    }
    drawHighlight();
}
let checkboxState = new Map();
let state = new Map();
function getBoxFromState(box) {
    if (state.has(box[1])) {
        return state.get(box[1]);
    }
    else {
        let newBox = new BoxObject(box[1]);
        state.set(box[1], newBox);
        return newBox;
    }
}
function getCheckboxFromState(checkboxName) {
    if (checkboxState.has(checkboxName)) {
        return checkboxState.get(checkboxName);
    }
    else {
        return null;
    }
}

async function getCompletions() {
    var counter = 0;

    var enabledLevels = boxes.map(lvlName => {return lvlName[1];});

    for (let level of state) {
        if (!enabledLevels.includes(level[0])) {
            continue;
        }
        counter += level[1].done;
    }

    return {completed: counter, total: enabledLevels.length, percentage: (counter / enabledLevels.length * 100).toFixed(2)};
}

function setCheckboxInState(checkboxName, checkboxValue) {
    checkboxState.set(checkboxName, checkboxValue);
    window.localStorage.setItem('checkboxState', JSON.stringify(Array.from(checkboxState.entries())));
}
function setBoxInState(box) {
    state.set(box.name, box);
    window.localStorage.setItem('state', JSON.stringify(Array.from(state.entries())));
}
function loadState() {
    if (window.localStorage.getItem('state')) {
        state = new Map(JSON.parse(window.localStorage.getItem('state')));
    }
    if (window.localStorage.getItem('checkboxState')) {
        checkboxState = new Map(JSON.parse(window.localStorage.getItem('checkboxState')));
    }
}
const font = new FontFace('touhouFont', 'url(touhouFont2.ttf)');
const fontMini = new FontFace('touhouFontMini', 'url(touhouFontLittle.ttf)');
fontMini.load().then(function () {
    font.load().then(function () {
        loadState();
        setupControls();
        updateCanvasHeight();
        drawScreen(); 
        setCompletion();
    });
});
