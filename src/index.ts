import { Settings } from "./settings.js";
import { Game, Character, gameMap } from "./games.js";

const appDiv: HTMLElement | null = document.getElementById('app');
const debugDiv: HTMLElement | null = document.getElementById('debug');

const date: Date = new Date();
const timestamp = date.toISOString().split('T')[0];

const imageBtn: HTMLButtonElement = document.getElementById('downloadImg') as HTMLButtonElement;
const saveBtn: HTMLButtonElement = document.getElementById('exportSave') as HTMLButtonElement;
const importSaveBtn: HTMLButtonElement = document.getElementById('importSave') as HTMLButtonElement;
const importSaveInput: HTMLInputElement = document.getElementById('importSaveInput') as HTMLInputElement;

const completionDiv: HTMLElement = document.getElementById('completionDiv') as HTMLElement;
const completion: HTMLElement = document.getElementById('completionRate') as HTMLElement;

const canvas: HTMLCanvasElement = document.getElementById('mainCanvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

const SCALE = 1;

canvas.style.width = "800px";
canvas.style.height = "640px";

// might not be necessary. last guy didnt seem to think so but just to be safe
canvas.width = Math.floor(800 * SCALE);
canvas.height = Math.floor(640 * SCALE);

// Prevent selection of text while interacting with the canvas
canvas.onselectstart = function () {
    return false;
};

function downloadImage() {
    const link: HTMLAnchorElement = document.createElement('a');
    link.download = `progress_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

const boxWidth = 17;
function drawBox(x: number, y: number, width = boxWidth, height = boxWidth, lineWidth = 1.0, strokeStyle = 'rgba(128, 128, 128, 1.0)') {
    if (ctx) {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
}
function drawExtraHeader(x: number, y: number) {
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
function drawGFWBox(x: number, y: number) {
    if (ctx) {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = 2.0;
        // Do the really annoying thing of tracing around the box...
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x + boxWidth * 6, y);
        const height = CONFIG.easyMode.value ? 4 : 3;
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
function drawLOLKBox(x: number, y: number) {
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
        if (!CONFIG.easyMode.value) {
            ctx.lineTo(x + boxWidth * 8, y + boxWidth * 4);
            ctx.lineTo(x, y + boxWidth * 4);
            ctx.lineTo(x, y + boxWidth);
        }
        if (CONFIG.easyMode.value) {
            ctx.lineTo(x + boxWidth * 8, y + boxWidth * 5);
            ctx.lineTo(x, y + boxWidth * 5);
            ctx.lineTo(x, y + boxWidth);
        }
        ctx.stroke();
    }
}
function drawHSIFSBox(x: number, y: number) {
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
        if (CONFIG.easyMode.value) {
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
function drawTDUMBox(x: number, y: number) {
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
        const height = CONFIG.easyMode.value ? 5 : 4;
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
function drawBoxContentsAux(x: number,
    y: number,
    done: boolean,
    misses: string | null,
    bombs: string | null,
    lives: string | null,
    vertical: boolean,
    focus: boolean,
    pacifist: boolean,
    unique: boolean,
    cellColour: string,
    textColour: string,
    colour: string): void {
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
function drawBoxContents(x: number, y: number, boxName: string, colour: string): void {
    const box = getBoxFromState([new Path2D(), boxName, null]);
    drawBoxContentsAux(x, y, box.done, box.misses, box.bombs, box.lives, box.vertical, box.focus, box.pacifist, box.unique, box.cellColour, box.textColour, colour);
}

class BoxObject {
    name: string;
    done: boolean;
    pacifist: boolean;
    unique: boolean;
    focus: boolean;
    vertical: boolean;
    textColour: string;
    cellColour: string;

    lives: string | null;
    bombs: string | null;
    misses: string | null;

    constructor(name: string) {
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

let lastX = 0;
let lastY = 0;

function drawText(text: string, x: number, y: number, align: CanvasTextAlign = 'left', font = "16px touhouFont", colour = "black") {
    x -= 0.5; // Dumb hack for Windows
    if (ctx) {
        ctx.font = font;
        ctx.textAlign = align;
        ctx.fillStyle = colour;
        ctx.fillText(text, x, y - 1);
    }
}
function drawUILine(x: number, y: number, drop: number, width: number) {
    if (ctx) {
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + drop);
        ctx.strokeStyle = 'rgba(128, 128, 128, 1.0)';
        ctx.lineWidth = width;
        ctx.stroke();
    }
}
function drawDot(colour: string, x: number, y: number, width: number = 2) {
    if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = colour;
        ctx.arc(x, y, width, 0, 2 * Math.PI);
        ctx.fill();
    }
}
let boxes: [Path2D, string, string][] = []; // fix this typing, probably should introduce a new class for it
function drawGame(game: Game, baseX: number, baseY: number, drawDifficulties: boolean = false) {
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
    if (CONFIG.easyMode.value) {
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
            if (CONFIG.easyMode.value) {
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
                if (CONFIG.easyMode.value) {
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
        if (CONFIG.easyMode.value) {
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
            if (CONFIG.easyMode.value) {
                skipDraw = skipDraw || (game.name === 'GFW' && character === 'C2' && difficulty === 'E');
            }
            else {
                skipDraw = skipDraw || (game.name === 'GFW' && character === 'C2' && difficulty === 'N');
            }
            if (!skipBox) {
                let yDraw = y;
                if (game.name === 'GFW' && character === 'EX' && difficulty === 'N' && CONFIG.easyMode.value) {
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
    ctx.scale(SCALE, SCALE);
    imageBtn.addEventListener('click', downloadImage);
    saveBtn.addEventListener('click', async () => { await exportSaveFile; });
    importSaveBtn.addEventListener('click', () => importSaveInput.click());
    importSaveInput.addEventListener('change', async () => {
        try {
            await importSaveFile(importSaveInput.files?.[0]);
        } catch (error) {
            alert("Invalid file type. Make sure you're importing either a .1cc or .json.gz file");
        } finally {
            importSaveInput.value = '';
        }
    });
    canvas.addEventListener('click', function (event) {
        event.preventDefault();
        var ClientRect = canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - ClientRect.left) * SCALE;
        const y = Math.round(event.clientY - ClientRect.top) * SCALE;
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
            drawScreen();
        }
        return false;
    });
    canvas.addEventListener('dblclick', function (event) {
        event.preventDefault();
        var ClientRect = canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - ClientRect.left) * SCALE;
        const y = Math.round(event.clientY - ClientRect.top) * SCALE;
        let found = false;
        for (let box of boxes) {
            if (ctx.isPointInPath(box[0], x, y)) {
                found = true;
                selectBox(box);
                toggleDone();
                showCompletion();
                break;
            }
        }
        if (!found) {
            deselectBox();
            drawScreen();
        }
        return false;
    });
    canvas.addEventListener('contextmenu', function (event) {
        deselectBox();
        drawScreen();
    });
}

const CONFIG = {
    transparentPng: new Settings("bg", "useBackgroundCheckbox", true),
    showFighting: new Settings("fighting", "fightingCheckbox", true),
    easyMode: new Settings("easy", "easyCheckbox", false),
    showLegend: new Settings("legend", "legendCheckbox", true),
    showReisen: new Settings("reisen", "reisenCheckbox", false),
    showCompletions: new Settings("completions", "completionCheckbox", false),
} satisfies Record<string, Settings>;

let selectedBox: [Path2D, string, string] | null = null;
function setupControls() {
    const doneCheckbox: HTMLInputElement | null = document.getElementById('doneCheckbox') as HTMLInputElement;
    doneCheckbox.addEventListener('change', updateDoneStatus);
    const pacifistCheckbox: HTMLInputElement | null = document.getElementById('pacifistCheckbox') as HTMLInputElement;
    pacifistCheckbox.addEventListener('change', updatePacifistStatus);
    const focusCheckbox: HTMLInputElement | null = document.getElementById('focusCheckbox') as HTMLInputElement;
    focusCheckbox.addEventListener('change', updateFocusStatus);
    const uniqueCheckbox: HTMLInputElement | null = document.getElementById('uniqueCheckbox') as HTMLInputElement;
    uniqueCheckbox.addEventListener('change', updateUniqueStatus);
    const verticalCheckbox: HTMLInputElement | null = document.getElementById('verticalCheckbox') as HTMLInputElement;
    verticalCheckbox.addEventListener('change', updateVerticalStatus);

    const livesSelect: HTMLSelectElement | null = document.getElementById('livesSelect') as HTMLSelectElement;
    livesSelect.addEventListener('change', updateLives);
    const bombsSelect: HTMLSelectElement | null = document.getElementById('bombsSelect') as HTMLSelectElement;
    bombsSelect.addEventListener('change', updateBombs);
    const missesSelect: HTMLSelectElement | null = document.getElementById('missesSelect') as HTMLSelectElement;
    missesSelect.addEventListener('change', updateMisses);
    const cellColour: HTMLInputElement | null = document.getElementById('bgColour') as HTMLInputElement;
    cellColour.addEventListener('change', updateCellColour);
    const textColour: HTMLInputElement | null = document.getElementById('textColour') as HTMLInputElement;
    textColour.addEventListener('change', updateTextColour);
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

function updateCellColour(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.cellColour = (e.target! as HTMLInputElement).value;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateTextColour(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.textColour = (e.target! as HTMLInputElement).value;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateDoneStatus(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.done = (e.target! as HTMLInputElement).checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateFocusStatus(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.focus = (e.target! as HTMLInputElement).checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updatePacifistStatus(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.pacifist = (e.target! as HTMLInputElement).checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateVerticalStatus(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.vertical = (e.target! as HTMLInputElement).checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateUniqueStatus(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.unique = (e.target! as HTMLInputElement).checked;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateLives(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.lives = (e.target! as HTMLSelectElement).value;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateBombs(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.bombs = (e.target! as HTMLSelectElement).value;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateMisses(e: Event) {
    if (selectedBox) {
        let currentBox = getBoxFromState(selectedBox);
        currentBox.misses = (e.target! as HTMLSelectElement).value;
        setBoxInState(currentBox);
        drawScreen();
    }
}

function updateCanvasHeight() {
    let height = 765;
    if (!CONFIG.showFighting.value && !CONFIG.easyMode.value) {
        height = 560;
    }
    if (CONFIG.easyMode.value && !CONFIG.showFighting.value) {
        height = 570;
        height += 5.5 * boxWidth;
    }
    if (CONFIG.easyMode.value && CONFIG.showFighting.value) {
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

async function showCompletion() {
    if (CONFIG.showCompletions.value) {
        completionDiv.style.display = 'block';
        var { completed, total, percentage } = await getCompletions();
        completion.innerText = completed + " / " + total + " completed. (" + percentage + "%)";
    } else {
        completionDiv.style.display = 'none';
    }
}

function selectBox(box: [Path2D, string, string]) {
    selectedBox = box;
    // Enable all the buttons
    const doneCheckbox: HTMLInputElement | null = document.getElementById('doneCheckbox') as HTMLInputElement;
    doneCheckbox.disabled = false;
    const verticalCheckbox: HTMLInputElement | null = document.getElementById('verticalCheckbox') as HTMLInputElement;
    verticalCheckbox.disabled = false;
    const pacifistCheckbox: HTMLInputElement | null = document.getElementById('pacifistCheckbox') as HTMLInputElement;
    pacifistCheckbox.disabled = false;
    const uniqueCheckbox: HTMLInputElement | null = document.getElementById('uniqueCheckbox') as HTMLInputElement;
    uniqueCheckbox.disabled = false;
    const focusCheckbox: HTMLInputElement | null = document.getElementById('focusCheckbox') as HTMLInputElement;
    focusCheckbox.disabled = false;

    const livesSelect: HTMLSelectElement | null = document.getElementById('livesSelect') as HTMLSelectElement;
    livesSelect.disabled = false;
    const missesSelect: HTMLSelectElement | null = document.getElementById('missesSelect') as HTMLSelectElement;
    missesSelect.disabled = false;
    const bombsSelect: HTMLSelectElement | null = document.getElementById('bombsSelect') as HTMLSelectElement;
    bombsSelect.disabled = false;

    const cellColour: HTMLInputElement | null = document.getElementById('bgColour') as HTMLInputElement;
    cellColour.disabled = false;
    const textColour: HTMLInputElement | null = document.getElementById('textColour') as HTMLInputElement;
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
    } else {
        livesSelect.value = "";
    }
    if (boxObject.misses) {
        missesSelect.value = boxObject.misses;
    } else {
        missesSelect.value = "";
    }
    if (boxObject.bombs) {
        bombsSelect.value = boxObject.bombs;
    } else {
        bombsSelect.value = "";
    }
}

function deselectBox() {
    if (debugDiv) {
        debugDiv.innerHTML = '(Double-)Click a square!';
    };
    selectedBox = null;
    // Disable the controls!
    const doneCheckbox: HTMLInputElement | null = document.getElementById('doneCheckbox') as HTMLInputElement;
    doneCheckbox.disabled = true;
    doneCheckbox.checked = false;
    const focusCheckbox: HTMLInputElement | null = document.getElementById('focusCheckbox') as HTMLInputElement;
    focusCheckbox.disabled = true;
    focusCheckbox.checked = false;
    const pacifistCheckbox: HTMLInputElement | null = document.getElementById('pacifistCheckbox') as HTMLInputElement;
    pacifistCheckbox.disabled = true;
    pacifistCheckbox.checked = false;
    const uniqueCheckbox: HTMLInputElement | null = document.getElementById('uniqueCheckbox') as HTMLInputElement;
    uniqueCheckbox.disabled = true;
    uniqueCheckbox.checked = false;
    const verticalCheckbox: HTMLInputElement | null = document.getElementById('verticalCheckbox') as HTMLInputElement;
    verticalCheckbox.disabled = true;
    verticalCheckbox.checked = false;

    const livesSelect: HTMLSelectElement | null = document.getElementById('livesSelect') as HTMLSelectElement;
    livesSelect.disabled = true;
    livesSelect.value = "";

    const missesSelect: HTMLSelectElement | null = document.getElementById('missesSelect') as HTMLSelectElement;
    missesSelect.disabled = true;
    missesSelect.value = "";
    const bombsSelect: HTMLSelectElement | null = document.getElementById('bombsSelect') as HTMLSelectElement;
    bombsSelect.disabled = true;
    bombsSelect.value = "";

    const cellColour: HTMLInputElement | null = document.getElementById('bgColour') as HTMLInputElement;
    cellColour.disabled = true;
    cellColour.value = "#ffffff";
    const textColour: HTMLInputElement | null = document.getElementById('textColour') as HTMLInputElement;
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
        if (!CONFIG.transparentPng.value) {
            ctx.fillStyle = 'white';
            ctx.fillRect(-2, -2, canvas.width + 2, canvas.height + 2);
        }
    }
    let yOffset = boxWidth;
    drawText("1CC CHART", 2, 6);
    if (CONFIG.showLegend.value) {
        drawLegend();
    }
    drawGame(gameMap.hrtp, 2, yOffset + boxWidth, true);
    drawGame(gameMap.soew, lastX + boxWidth, yOffset);
    drawGame(gameMap.podd, lastX + boxWidth, yOffset + boxWidth);
    drawGame(gameMap.lls, lastX + boxWidth, yOffset);
    drawGame(gameMap.ms, lastX + boxWidth, yOffset);
    drawGame(gameMap.eosd, lastX + boxWidth, yOffset);
    drawGame(gameMap.eosdNC, lastX + boxWidth, yOffset);
    drawGame(gameMap.stb, 31.7 * boxWidth, yOffset + 0 * boxWidth, true);
    drawGame(gameMap.ds, lastX + 2 * boxWidth - 4, yOffset + 0 * boxWidth, true);
    drawGame(gameMap.isc, 31.7 * boxWidth, yOffset + 3.7 * boxWidth, true);
    drawGame(gameMap.vd, lastX + 1.6 * boxWidth, yOffset + 3.7 * boxWidth, true);
    drawGame(gameMap.bm, lastX + 1.4 * boxWidth, yOffset + 3.7 * boxWidth, true);
    if (CONFIG.easyMode.value) {
        yOffset += boxWidth;
    }
    let pcvPofvOffset = 0;
    if (CONFIG.easyMode.value) {
        pcvPofvOffset = 1;
    }
    drawGame(gameMap.pcb, 2, yOffset + ((pcvPofvOffset + 8) * boxWidth), true);
    drawGame(gameMap.imp, lastX + 2 * boxWidth, yOffset + 6 * boxWidth, true);
    drawGame(gameMap.pofv, lastX + 2 * boxWidth, yOffset + ((pcvPofvOffset + 9) * boxWidth), true);
    if (CONFIG.easyMode.value) {
        yOffset += 2 * boxWidth;
    }
    drawGame(gameMap.mof, 2, yOffset + 15 * boxWidth, true);
    drawGame(gameMap.sa, lastX + boxWidth, yOffset + 15 * boxWidth);
    drawGame(gameMap.ufo, lastX + boxWidth, yOffset + 15 * boxWidth);
    drawGame(gameMap.gfw, lastX + boxWidth, yOffset + 16 * boxWidth);
    drawGame(gameMap.td, lastX + 2 * boxWidth, yOffset + 15 * boxWidth, true);
    drawGame(gameMap.ddc, lastX + boxWidth, yOffset + 15 * boxWidth);
    if (CONFIG.easyMode.value) {
        yOffset += boxWidth;
    }
    drawGame(gameMap.lolk, 2, yOffset + 21 * boxWidth, true);
    drawGame(gameMap.hsifs, lastX + 2 * boxWidth, yOffset + 21 * boxWidth, true);
    drawGame(gameMap.wbawc, lastX + 2 * boxWidth, yOffset + 21 * boxWidth, true);
    drawGame(gameMap.um, lastX + boxWidth, yOffset + 21 * boxWidth);
    if (CONFIG.easyMode.value) {
        yOffset += boxWidth;
    }
    drawGame(gameMap.udoalg, 2, yOffset + 28 * boxWidth, true);
    drawGame(gameMap.fw, lastX + 2 * boxWidth, yOffset + 27 * boxWidth, true);
    if (CONFIG.easyMode.value) {
        yOffset += boxWidth;
    }
    if (CONFIG.showFighting.value) {
        drawExtraHeader(lastX, yOffset + 32.35 * boxWidth);
        drawGame(gameMap.iamp, 2, yOffset + 33.71 * boxWidth, true);
        drawGame(gameMap.swr, lastX + boxWidth, yOffset + 33.71 * boxWidth);
        drawGame(gameMap.hsoku, lastX + boxWidth, yOffset + 33.71 * boxWidth);
        drawGame(gameMap.hm, lastX + boxWidth, yOffset + 33.71 * boxWidth);
        if (CONFIG.easyMode.value) {
            yOffset += boxWidth;
        }
        gameMap.ulil.characters = gameMap.ulil.characters.filter((char) => char.name !== "RS");
        if (CONFIG.showReisen.value) {
            gameMap.ulil.characters.push(new Character("RS", "Reisen"));
        }
        drawGame(gameMap.ulil, 2, yOffset + 39.7 * boxWidth, true);
        drawGame(gameMap.aocf, lastX + 2 * boxWidth, yOffset + 38.7 * boxWidth, true);
        drawGame(gameMap.gi, lastX + 2 * boxWidth, yOffset + 40.7 * boxWidth, true);
    }
    drawHighlight();
}

let checkboxState: Map<string, boolean> = new Map();
let state: Map<string, BoxObject> = new Map();

function getBoxFromState(box: [Path2D, string, string | null]): BoxObject {
    if (state.has(box[1])) {
        return state.get(box[1])!;
    }
    else {
        let newBox = new BoxObject(box[1]);
        state.set(box[1], newBox);
        return newBox;
    }
}

function getCheckboxFromState(checkboxName: string) {
    if (checkboxState.has(checkboxName)) {
        return checkboxState.get(checkboxName)!;
    }
    else {
        return null;
    }
}

async function getCompletions() {
    var counter = 0;

    var enabledLevels = boxes.map(lvlName => { return lvlName[1]; });

    for (let level of state) {
        if (!enabledLevels.includes(level[0])) {
            continue;
        }
        counter += Number(level[1].done);
    }

    return { completed: counter, total: enabledLevels.length, percentage: (counter / enabledLevels.length * 100).toFixed(2) };
}

function setCheckboxInState(checkboxName: string, checkboxValue: boolean) {
    checkboxState.set(checkboxName, checkboxValue);
    window.localStorage.setItem('checkboxState', JSON.stringify(Array.from(checkboxState.entries())));
}

function setBoxInState(box: BoxObject) {
    state.set(box.name, box);
    window.localStorage.setItem('state', JSON.stringify(Array.from(state.entries())));
}

function loadState() {
    if (window.localStorage.getItem('state')) {
        state = new Map(JSON.parse(window.localStorage.getItem('state')!)!);
    }
    if (window.localStorage.getItem('checkboxState')) {
        checkboxState = new Map(JSON.parse(window.localStorage.getItem('checkboxState')!)!);
    }
}

async function exportSaveFile() {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
            data[key] = localStorage.getItem(key);
        }
    }

    const jsonString = JSON.stringify(data, null, 2);
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(jsonString));
            controller.close();
        }
    });

    const compressedStream = readableStream.pipeThrough(new CompressionStream('gzip'));
    const response = new Response(compressedStream);
    const blob = await response.blob();

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `progress_${timestamp}.1cc`;
    link.click();
    URL.revokeObjectURL(url);
};

async function importSaveFile(file: File | undefined) {
    if (!file) {
        return;
    }

    const decompressedStream = file.stream().pipeThrough(new DecompressionStream('gzip'));
    const jsonString = await new Response(decompressedStream).text();
    const data: unknown = JSON.parse(jsonString);
    if (!data || typeof data !== 'object' || Array.isArray(data) ||
        Object.keys(data).some(key => typeof (data as Record<string, unknown>)[key] !== 'string')) {
        throw new Error('Invalid save data');
    }

    const saveData = data as Record<string, string>;
    localStorage.clear();
    for (const key of Object.keys(saveData)) {
        localStorage.setItem(key, saveData[key]);
    }

    window.location.reload();
}

const font = new FontFace('touhouFont', 'url(fonts/touhouFont2.ttf)');
const fontMini = new FontFace('touhouFontMini', 'url(fonts/touhouFontLittle.ttf)');
fontMini.load().then(function () {
    font.load().then(function () {
        loadState();
        setupControls();
        updateCanvasHeight();
        drawScreen();
        showCompletion();
    });
});

export { drawScreen, updateCanvasHeight, setCheckboxInState, getCheckboxFromState, showCompletion };