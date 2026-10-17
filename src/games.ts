class Game {
    name: string;
    colour: string;
    difficulties: string[];
    characters: Character[];
    constructor(name: string, colour: string, difficulties: string[], characters: Character[]) {
        this.name = name;
        this.colour = colour;
        this.difficulties = difficulties.slice();
        this.characters = characters.slice();
    }
}

class Character {
    name: string;
    fullName: string;
    subcharacters: string[];
    constructor(name: string, fullName: string, subcharacters: string[] = []) {
        this.name = name;
        this.fullName = fullName;
        this.subcharacters = subcharacters.slice();
    }
}

// Consider moving this into localStorage? would allow for custom games and the sort
let gameMap = {
    hrtp: new Game("HRTP", "rgba(210, 60, 255, 1.0)", "LHN".split(''), [
        new Character("", "Reimu", ["ma", "j"])]),
    soew: new Game("SOEW", "rgba(32, 51, 255, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b", "c"])]),
    podd: new Game("PODD", "rgba(255, 92, 92, 1.0)", "LHN".split(''), [
        new Character("R", "Reimu"),
        new Character("MI", "Mima"),
        new Character("M", "Marisa"),
        new Character("EL", "Ellen"),
        new Character("KH", "Kotohime"),
        new Character("KA", "Kana"),
        new Character("RI", "Rikako"),
        new Character("CH", "Chiyuri"),
        new Character("YM", "Yumemi")]),
    lls: new Game("LLS", "rgba(73, 250, 76, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b"]),
        new Character("M", "Marisa", ["a", "b"])]),
    ms: new Game("MS", "rgba(194, 36, 128, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu"),
        new Character("M", "Marisa"),
        new Character("MI", "Mima"),
        new Character("YK", "Yuuka")]),
    eosd: new Game("EOSD", "rgba(255, 51, 18, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b"]),
        new Character("M", "Marisa", ["a", "b"])]),
    eosdNC: new Game("EOSD(NC)", "rgb(194, 26, 0, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b"]),
        new Character("M", "Marisa", ["a", "b"])]),
    stb: new Game("STB", "rgba(99, 44, 0, 1.0)", ["85", "66"], [
        new Character("AY", "Aya")]),
    ds: new Game("DS", "rgba(10, 34, 119, 1.0)", ["108", "58"], [
        new Character("AY", "Aya"),
        new Character("HA", "Hatate")]),
    isc: new Game("ISC", "rgba(99, 44, 0, 1.0)", ["NI", "C"], [
        new Character("SJ", "Seija")]),
    vd: new Game("VD", "rgba(163, 73, 164, 1.0)", ["103", "C"], [
        new Character("SM", "Sumireko")]),
    bm: new Game("100BM", "rgba(232, 125, 0, 1.0)", ["85", "C"], [
        new Character("M", "Marisa")]),
    pcb: new Game("PCB", "rgba(255, 127, 191, 1.0)", "PXLHN".split(''), [
        new Character("R", "Reimu", ["a", "b"]),
        new Character("M", "Marisa", ["a", "b"]),
        new Character("S", "Sakuya", ["a", "b"])]),
    imp: new Game("IN", "rgba(196, 101, 0, 1.0)", ["X", "B-L", "B-H", "B-N", "A-L", "A-H", "A-N"], [
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
        new Character("Y", "Youmu"),
        new Character("YY", "Yuyuko")]),
    pofv: new Game("POFV", "rgba(16, 15, 107, 1.0)", "XLHN".split(''), [
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
        new Character("E", "Eiki")]),
    mof: new Game("MOF", "rgba(255, 168, 0, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b", "c"]),
        new Character("M", "Marisa", ["a", "b", "c"])]),
    sa: new Game("SA", "rgba(0, 201, 109, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b", "c"]),
        new Character("M", "Marisa", ["a", "b", "c"])]),
    ufo: new Game("UFO", "rgba(127, 191, 255, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b"]),
        new Character("M", "Marisa", ["a", "b"]),
        new Character("SN", "Sanae", ["a", "b"])]),
    gfw: new Game("GFW", "rgba(127, 253, 255, 1.0)", "LHN".split(''), [
        new Character("A1", "Route A-1"),
        new Character("A2", "Route A-2"),
        new Character("B1", "Route B-1"),
        new Character("B2", "Route B-2"),
        new Character("C1", "Route C-1"),
        new Character("C2", "Route C-2"),
        new Character("EX", "Extra Route")]),
    td: new Game("TD", "rgba(255, 191, 127, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["e1", "e2"]),
        new Character("M", "Marisa", ["e1", "e2"]),
        new Character("SN", "Sanae", ["e1", "e2"]),
        new Character("Y", "Youmu", ["e1", "e2"])]),
    ddc: new Game("DDC", "rgba(123, 95, 135, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["a", "b"]),
        new Character("M", "Marisa", ["a", "b"]),
        new Character("S", "Sakuya", ["a", "b"])]),
    lolk: new Game("LOLK", "rgba(159, 21, 41, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["p", "l"]),
        new Character("M", "Marisa", ["p", "l"]),
        new Character("SN", "Sanae", ["p", "l"]),
        new Character("RS", "Reisen", ["p", "l"])]),
    hsifs: new Game("HSIFS", "rgba(255, 127, 39, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["sp", "sm", "f", "w"]),
        new Character("C", "Cirno", ["sp", "sm", "f", "w"]),
        new Character("AY", "Aya", ["sp", "sm", "f", "w"]),
        new Character("M", "Marisa", ["sp", "sm", "f", "w"])]),
    wbawc: new Game("WBAWC", "rgba(224, 66, 44, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["w", "o", "e"]),
        new Character("M", "Marisa", ["w", "o", "e"]),
        new Character("Y", "Youmu", ["w", "o", "e"])]),
    um: new Game("UM", "rgba(0, 201, 109, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["e1", "e2"]),
        new Character("M", "Marisa", ["e1", "e2"]),
        new Character("S", "Sakuya", ["e1", "e2"]),
        new Character("SN", "Sanae", ["e1", "e2"])]),
    udoalg: new Game("UDOALG", "rgba(74, 124, 71, 1.0)", "LHN".split(''), [
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
        new Character("Z", "Zanmu")]),
    fw: new Game("FW", "rgba(90, 133, 250, 1.0)", "XLHN".split(''), [
        new Character("R", "Reimu", ["sd", "cr", "sb", "bs", "ys", "im", "bh", "sw"]),
        new Character("M", "Marisa", ["sd", "cr", "sb", "bs", "ys", "im", "bh", "sw"])]),
    iamp: new Game("IAMP", "rgba(78, 22, 86, 1.0)", "LHN".split(''), [
        new Character("R", "Reimu"),
        new Character("M", "Marisa"),
        new Character("S", "Sakuya"),
        new Character("A", "Alice"),
        new Character("P", "Patchouli"),
        new Character("Y", "Youmu"),
        new Character("RE", "Remelia"),
        new Character("YY", "Yuyuko"),
        new Character("YU", "Yukari"),
        new Character("SU", "Suika")]),
    swr: new Game("SWR", "rgba(255, 51, 18, 1.0)", "LHN".split(''), [
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
        new Character("TE", "Tenshi")]),
    hsoku: new Game("H.SOKU", "rgba(210, 210, 210, 1.0)", "LHN".split(''), [
        new Character("SN", "Sanae"),
        new Character("C", "Cirno"),
        new Character("ML", "Meiling")]),
    hm: new Game("HM", "rgba(179, 193, 148, 1.0)", "LHN".split(''), [
        new Character("R", "Reimu"),
        new Character("M", "Marisa"),
        new Character("IC", "Ichirin"),
        new Character("B", "Byakuren"),
        new Character("F", "Futo"),
        new Character("TO", "Toyosatomimi"),
        new Character("N", "Nitori"),
        new Character("KO", "Koishi"),
        new Character("MA", "Mamizou"),
        new Character("KK", "Kokoro")]),
    ulil: new Game("ULIL", "rgba(0, 136, 148, 1.0)", "LHN".split(''), [
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
        new Character("R2", "Reimu Ending")]),
    aocf: new Game("AOCF", "rgba(201, 143, 255, 1.0)", "OLHN".split(''), [
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
        new Character("J", "Joon & Shion")]),
    gi: new Game("GI", "rgba(131, 5, 5, 1.0)", "HN".split(''), [
        new Character("R", "Reimu"),
        new Character("M", "Marisa"),
        new Character("KA", "Kanako"),
        new Character("MU", "Murasa"),
        new Character("J", "Joon"),
        new Character("FL", "Flandre", ["a", "b", "c"]),
        new Character("YT", "Yuuma")]),
} satisfies Record<string, Game>;

export { Game, Character, gameMap };