import { drawScreen, updateCanvasHeight, showCompletion, selectBox } from "./index.js";

// implement saving settings in localStorage and loading from storage and file
class Settings {
    public element: HTMLInputElement;

    constructor(
        public readonly saveID: string,
        public readonly elementID: string,
        public value: boolean = false,
    ) {
        const element = document.getElementById(elementID)! as HTMLInputElement;
        this.element = element;
        this.element.checked = value;
        this.element.addEventListener("change", () => { this.update(); });
    }

    update(): void {
        this.value = this.element.checked;
        drawScreen();
        updateCanvasHeight();
        showCompletion();
        selectBox();
    }
}

export { Settings };