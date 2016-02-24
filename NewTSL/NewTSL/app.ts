///<reference path="library.ts" />
class plasma implements TSL.canvas.event_handler {
    private x: number;
    private y: number;
    private flag: boolean;
    private image: HTMLImageElement;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.flag = false;
        this.image = new Image();
        this.image.src = "plasma.png";
        this.image.width = 80;
        this.image.height = 80;
    }

    public isClick(e: JQueryEventObject) {
        return !this.flag &&
            this.x < e.clientX &&
            this.y < e.clientY &&
            (this.x + 80) > e.clientX &&
            (this.y + 80) > e.clientY;
    }
    public clicked() {
        this.flag = true;
    }
    public mainLoop() {
        if (this.flag)
            TSL.canvas.WriteText("clicked", 240, 160);
        else if (this.y == 0) {
            if (this.x == 560)
                this.y = 5;
            else
                this.x += 5;
        }
        else if (this.x == 560) {
            if (this.y == 400)
                this.x = 555;
            else
                this.y += 5;
        }
        else if (this.y == 400) {
            if (this.x == 0)
                this.y = 395;
            else
                this.x -= 5;
        }
        else {
            if (this.y == 0)
                this.x = 5;
            else
                this.y -= 5;
        }
        TSL.canvas.DrawImage(this.image, this.x, this.y);
        
        return false;
    }
}

window.onload = () => {
    Anonymous.Initial();
    TSL.canvas.AddEvent("plasma", new plasma());
}