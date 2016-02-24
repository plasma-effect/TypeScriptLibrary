//Copyright(c) 2015, plasma_effect
//All rights reserved.

//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are met:

//* Redistributions of source code must retain the above copyright notice, this
//list of conditions and the following disclaimer.

//* Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//and / or other materials provided with the distribution.

//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//DISCLAIMED.IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
//FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//DAMAGES(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
//CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
//    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
//OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
namespace TSL {
    

    export namespace canvas {
        export interface event_handler {
                isClick(e: JQueryEventObject): boolean;
                clicked(): void;
                mainLoop(): boolean;
        }
        export var events: { [key: string]: event_handler } = {};

        export function WriteText(
            text: string,
            x: number,
            y: number,
            size: number = 16,
            style: string = "black") {
            ctx.fillStyle = style;
            ctx.font = size + "px 'メイリオ'";
            ctx.fillText(text, x, y + size);
        }

        export function DrawRect(
            offset_x: number,
            offset_y: number,
            width: number,
            height: number,
            style: string = "black") {
            ctx.fillStyle = style;
            ctx.fillRect(offset_x, offset_y, width, height);
        }

        export function AddEvent(
            name: string,
            event: event_handler) {
            events[name] = event;
        }

        export function RemoveEvent(
            name: string) {
            return delete events[name];
        }

        export function DrawImage(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number) {
            ctx.drawImage(image, offset_x, offset_y);
        }
    }
}
module Anonymous {
    export function Initial() {
        canvas = <HTMLCanvasElement>document.getElementById("field");
        ctx = canvas.getContext("2d");
        $(canvas).click((e) => {
            for (var key in TSL.canvas.events) {
                var handler = TSL.canvas.events[key];
                if (handler.isClick(e))
                    handler.clicked();
            }
        });
        setInterval(() => {
            TSL.canvas.DrawRect(0, 0, canvas.clientWidth, canvas.clientHeight, "white");
            for (var key in TSL.canvas.events) {
                var handler = TSL.canvas.events[key];
                if (handler.mainLoop())
                    TSL.canvas.RemoveEvent(key);
            }
        });
    }
}
