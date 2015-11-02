﻿namespace plasma {
    export namespace utility {
        var date = new Date();
        export function get_time() {
            return date.getTime();
        }
    }

    export namespace random {
        export class XorShift {
            constructor(private seed: number) {
            }

            public run() {
                this.seed ^= (this.seed << 17);
                this.seed ^= (this.seed >> 9);
                this.seed ^= (this.seed << 8);
                this.seed ^= (this.seed >> 27);
                return this.seed;
            }
        }
        export function make_xorshift(seed: number) {
            var engine = new XorShift(seed);
            return () => {
                return engine.run();
            };
        }
        export function seed_generate() {
            var v = utility.get_time();
            v ^= (v << 19);
            v ^= (v >> 13);
            v ^= (v << 8);
            v ^= (v >> 21);
            return v;
        }

        export function uniformed_int_distribution(callback: () => number, min: number, max: number) {
            return () => {
                var x = callback();
                var m = Math.floor((1 << 30) / (max - min + 1)) * (max - min + 1);
                for (; x < 0 || x >= m; x = callback());
                return (x % (max - min + 1)) + min;
            };
        }
    }

    export class CanvasTraits {
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;
        public flag: boolean;
        constructor(field_name: string) {
            this.canvas = <HTMLCanvasElement>document.getElementById(field_name);
            if (!this.canvas || !this.canvas.getContext) {
                this.flag = false;
            }
            else {
                this.ctx = this.canvas.getContext('2d');
                this.flag = true;
            }
        }

        public draw_string(
            str: string,
            size: number,
            offset_x: number,
            offset_y: number,
            style: string = "black"
        ) {
            if (!this.flag) return;
            this.ctx.fillStyle = style;
            this.ctx.font = size + "px 'Arial'";
            this.ctx.fillText(str, offset_x, offset_y + size);
        }

        public draw_rect(
            offset_x: number,
            offset_y: number,
            width: number,
            height: number,
            style: string = "black") {
            if (!this.flag) return;
            this.ctx.fillStyle = style;
            this.ctx.fillRect(offset_x, offset_y, width, height);
        }

        public draw_image(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number) {
            if (!this.flag) return;
            this.ctx.drawImage(image, offset_x, offset_y);
        }   
    }

    export namespace game_interface {
        export class interface_data{
            public mouse_on: boolean;
            public mouse_x: number;
            public mouse_y: number;

            public keyboardpress: boolean[];
            public keyboardclick: boolean[];

            constructor() {
                this.keyboardpress = new Array<boolean>(0x100);
                this.keyboardclick = new Array<boolean>(0x100);
                for (var i = 0; i < 0x100; ++i)
                    this.keyboardpress[i] = false;
                this.reset();
            }

            public reset() {
                this.mouse_on = false;
                this.mouse_x = 0;
                this.mouse_y = 0;
                for (var i = 0; i < 0x100; ++i)
                    this.keyboardclick[i] = false;
            }
        }
        var helper = new interface_data();
        var now_data = new interface_data();
        document.addEventListener('click', (e) => {
            helper.mouse_on = true;
            helper.mouse_x = e.clientX;
            helper.mouse_y = e.clientY;
        });
        document.addEventListener("keydown", (e) => {
            helper.keyboardclick[e.keyCode] = true;
            helper.keyboardpress[e.keyCode] = true;
        });
        document.addEventListener("keyup", (e) => {
            helper.keyboardpress[e.keyCode] = false;
        });

        export function mouse_on() {
            return now_data.mouse_on;
        }
        export function mouse_x() {
            return now_data.mouse_x;
        }
        export function mouse_y() {
            return now_data.mouse_y;
        }
        export function keyboard_click(code: number) {
            return now_data.keyboardclick[code];
        }
        export function keyboard_press(code: number) {
            return now_data.keyboardpress[code];
        }

        export function set_interval(callback: () => void, timer: number = 20) {
            setInterval(() => {
                now_data = helper;
                helper.reset();
                callback();
            }, timer);
        }
    }
    
}
