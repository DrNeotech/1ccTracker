import { drawScreen, getBoxFromState, setBoxInState, selectedBox } from "./index.js";

class BoxState {
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

type BoxProperty = Exclude<keyof BoxState, "name">;

class BoxSettings {
    public readonly element: HTMLInputElement | HTMLSelectElement;

    constructor(
        public readonly elementID: string,
        public readonly property: BoxProperty,
    ) {
        const element = document.getElementById(elementID);
        if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement)) {
            throw new Error(`Failed to read box settings: #${elementID} is not an input or select`);
        }
        this.element = element;
        this.element.addEventListener("change", () => { this.update(); });
    }

    private get isCheckbox(): boolean {
        return this.element instanceof HTMLInputElement && this.element.type === "checkbox";
    }

    private readValue(): boolean | string | null {
        if (this.isCheckbox) {
            return (this.element as HTMLInputElement).checked;
        }
        if (this.element instanceof HTMLSelectElement) {
            return this.element.value === "" ? null : this.element.value;
        }
        return this.element.value;
    }

    private writeValue(value: boolean | string | null): void {
        if (this.isCheckbox) {
            (this.element as HTMLInputElement).checked = Boolean(value);
        } else {
            this.element.value = (value as string | null) ?? "";
        }
    }

    update(): void {
        if (!selectedBox) return;
        const box = getBoxFromState(selectedBox);
        (box as unknown as Record<BoxProperty, boolean | string | null>)[this.property] = this.readValue();
        setBoxInState(box);
        drawScreen();
    }

    load(box: BoxState): void {
        this.writeValue(box[this.property]);
    }

    setEnabled(enabled: boolean): void {
        this.element.disabled = !enabled;
        if (!enabled) {
            this.writeValue(this.isCheckbox ? false : null);
        }
    }
}

export { BoxSettings, BoxState };
export type { BoxProperty };