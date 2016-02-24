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


namespace TSL {
    export namespace utility {
        var date = new Date();
        export function get_time() {
            return date.getTime();
        }
    }

    export namespace vector{
        export class Vector {
            public x: number;
            public y: number;
        }
        export function makeVector(x: number, y: number) {
            return <Vector>{ x, y };
        }
        export function VectorAdd(v: Vector, u: Vector) {
            return makeVector(v.x + u.x, v.y + u.y);
        }
        export function VectorMul(v: Vector, n: number) {
            return makeVector(v.x * n, v.y * n);
        }

        export class Matrix {
            public m11: number;
            public m12: number;
            public m21: number;
            public m22: number;
        }
        export function makeMatrix(m11: number, m12: number, m21: number, m22: number) {
            return <Matrix>{ m11, m12, m21, m22 };
        }

        export function matrixAdd(m: Matrix, u: Matrix) {
            return makeMatrix(
                m.m11 + u.m11, m.m12 + u.m12,
                m.m21 + u.m21, m.m22 + u.m22);
        }

        export function matrixMul(m: Matrix, u: Matrix) {
            return makeMatrix(
                m.m11 * u.m11 + m.m12 * u.m21, m.m11 * u.m12 + m.m12* u.m22,
                m.m21 * u.m11 + m.m22 * u.m21, m.m21 * u.m12 + m.m22* u.m22);
        }

        export function matrixAction(m: Matrix, v: Vector) {
            return makeVector(m.m11 * v.x + m.m12 * v.y, m.m21 * v.x + m.m22 * v.y);
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

    export namespace shape {
        export class Rect {
            constructor(
                public offset_x: number,
                public offset_y: number,
                public width: number,
                public height: number) {
            }
        }

        export class Circle {
            constructor(
                public offset_x: number,
                public offset_y: number,
                public radius: number) {
            }
        }

        export function hitcheck_rect_point(a: Rect, b: { x: number, y: number }) {
            return a.offset_x <= b.x &&
                a.offset_x + a.width > b.x &&
                a.offset_y <= b.y &&
                a.offset_y + a.height > b.y;
        }

        export function hitcheck_rect_rect(a: Rect, b: Rect) {
            return(
                hitcheck_rect_point(a, { x: b.offset_x,                 y: b.offset_y                   }) ||
                hitcheck_rect_point(a, { x: b.offset_x,                 y: b.offset_y + b.height - 1    }) ||
                hitcheck_rect_point(a, { x: b.offset_x + b.width - 1,   y: b.offset_y                   }) ||
                hitcheck_rect_point(a, { x: b.offset_x + b.width - 1,   y: b.offset_y + b.height - 1    }) ||
                hitcheck_rect_point(b, { x: a.offset_x,                 y: a.offset_y                   }) ||
                hitcheck_rect_point(b, { x: a.offset_x,                 y: a.offset_y + a.height - 1    }) ||
                hitcheck_rect_point(b, { x: a.offset_x + a.width - 1,   y: a.offset_y                   }) ||
                hitcheck_rect_point(b, { x: a.offset_x + a.width - 1,   y: a.offset_y + a.height - 1    }));
        }
    }

    export class CanvasTraits {
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;
        private flag: boolean;
        private default_transform: number[];

        public defaultTransform() {
            this.default_transform = [1, 0, 0, 1, 0, 0];
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        public setTransform(
            m11: number, m12: number,
            m21: number, m22: number,
            dx: number, dy: number) {
            this.default_transform = [m11, m12, m21, m22, dx, dy];
            this.ctx.setTransform(m11, m12, m21, m22, dx, dy);
        }

        constructor(field_name: string) {
            this.canvas = <HTMLCanvasElement>document.getElementById(field_name);
            if (!this.canvas || !this.canvas.getContext) {
                this.flag = false;
            }
            else {
                this.ctx = this.canvas.getContext('2d');
                this.flag = true;
            }
            this.defaultTransform();
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
            this.ctx.font = size + "px 'メイリオ'";
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

        public draw_rect_t(
            rect: shape.Rect,
            style: string = "black") {
            this.draw_rect(rect.offset_x, rect.offset_y, rect.width, rect.height, style);
        }

        public draw_image(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number) {
            if (!this.flag) return;
            this.ctx.drawImage(image, offset_x, offset_y);
        }

        public draw_image_reverse(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number) {
            if (!this.flag) return;
            this.ctx.transform(-1, 0, 0, 1, offset_x + image.width, offset_y);
            this.ctx.drawImage(image, 0, 0);
            this.ctx.setTransform(
                this.default_transform[0],
                this.default_transform[1],
                this.default_transform[2],
                this.default_transform[3],
                this.default_transform[4],
                this.default_transform[5]);
        }

        public draw_image_rotate(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number,
            angle: number) {
            if (!this.flag) return;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            this.ctx.transform(cos, -sin, sin, cos, offset_x + image.width / 2, offset_y + image.height / 2);
            this.ctx.drawImage(image, -image.width / 2, - image.height / 2);
            this.ctx.setTransform(
                this.default_transform[0],
                this.default_transform[1],
                this.default_transform[2],
                this.default_transform[3],
                this.default_transform[4],
                this.default_transform[5]);
        }

        public draw_image_transform(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number,
            m11: number, m12: number,
            m21: number, m22: number) {
            if (!this.flag) return;
            this.ctx.transform(m11, m12, m21, m22, offset_x + image.width / 2, offset_y + image.height / 2);
            this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
            this.ctx.setTransform(
                this.default_transform[0],
                this.default_transform[1],
                this.default_transform[2],
                this.default_transform[3],
                this.default_transform[4],
                this.default_transform[5]);
        }

        public draw_image_scale(
            image: HTMLImageElement,
            offset_x: number,
            offset_y: number,
            scale_x: number,
            scale_y: number) {
            if (!this.flag) return;
            this.ctx.transform(scale_x, 0, 0, scale_y, offset_x, offset_y);
            this.ctx.drawImage(image, 0, 0);
            this.ctx.setTransform(
                this.default_transform[0],
                this.default_transform[1],
                this.default_transform[2],
                this.default_transform[3],
                this.default_transform[4],
                this.default_transform[5]);
        }

        public draw_line(
            startx: number,
            starty: number,
            endx: number,
            endy: number,
            style: string = "black") {
            this.ctx.strokeStyle = style;
            this.ctx.beginPath();
            this.ctx.moveTo(startx, starty);
            this.ctx.lineTo(endx, endy);
            this.ctx.stroke();
        }

        public canvas_resize(
            w: number,
            h: number) {
            if (!this.flag) return;
            this.canvas.width = w;
            this.canvas.height = h;
        }
        
    }

    export namespace game_interface {
        export class interface_data {
            public mouse_on: boolean;
            public mouse_click: boolean;
            public mouse_x: number;
            public mouse_y: number;

            public keyboardpress: boolean[];
            public keyboardclick: boolean[];

            constructor() {
                this.keyboardpress = new Array<boolean>(0x100);
                this.keyboardclick = new Array<boolean>(0x100);
                for (var i = 0; i < 0x100; ++i)
                    this.keyboardpress[i] = false;
                this.mouse_on = false;
                this.reset();
            }

            public reset() {
                this.mouse_click = false;
                for (var i = 0; i < 0x100; ++i)
                    this.keyboardclick[i] = false;
            }

            public copy() {
                var ret = new interface_data();
                ret.keyboardclick = this.keyboardclick.filter((v, i, ar) => { return true; });
                ret.keyboardpress = this.keyboardpress.filter((v, i, ar) => { return true; });
                ret.mouse_click = this.mouse_click;
                ret.mouse_on = this.mouse_on;
                ret.mouse_x = this.mouse_x;
                ret.mouse_y = this.mouse_y;
                return ret;
            }
        }
        export namespace detail {
            export var helper = new interface_data();
            export var now_data = new interface_data();
        }

        export function mouse_on() {
            return detail.now_data.mouse_on;
        }
        export function mouse_click() {
            return detail.now_data.mouse_click;
        }

        export function mouse_x() {
            return detail.now_data.mouse_x;
        }
        export function mouse_y() {
            return detail.now_data.mouse_y;
        }
        export function keyboard_click(code: number) {
            return detail.now_data.keyboardclick[code];
        }
        export function keyboard_press(code: number) {
            return detail.now_data.keyboardpress[code];
        }

        export function set_interval(callback: () => void, timer: number = 20) {
            setInterval(() => {
                detail.now_data = detail.helper.copy();
                detail.helper.reset();
                callback();
            }, timer);
        }

        export const enum keycode {
            a = 65,
            b = 66,
            c = 67,
            d = 68,
            e = 69,
            f = 70,
            g = 71,
            h = 72,
            i = 73,
            j = 74,
            k = 75,
            l = 76,
            m = 77,
            n = 78,
            o = 79,
            p = 80,
            q = 81,
            r = 82,
            s = 83,
            t = 84,
            u = 85,
            v = 86,
            w = 87,
            x = 88,
            y = 89,
            z = 90,
            left = 37,
            up = 38,
            right = 39,
            down = 40,
            shift = 16,
            ctrl = 17,
            space = 32,
            enter = 13
        }
    }
}
document.addEventListener("mousedown", (e) => {
    TSL.game_interface.detail.helper.mouse_on = true;
    TSL.game_interface.detail.helper.mouse_click = true;
    TSL.game_interface.detail.helper.mouse_x = e.clientX;
    TSL.game_interface.detail.helper.mouse_y = e.clientY;
});
document.addEventListener("mouseup", (e) => {
    TSL.game_interface.detail.helper.mouse_on = false;
});

document.addEventListener("keydown", (e) => {
    TSL.game_interface.detail.helper.keyboardclick[e.keyCode] = true;
    TSL.game_interface.detail.helper.keyboardpress[e.keyCode] = true;
});
document.addEventListener("keyup", (e) => {
    TSL.game_interface.detail.helper.keyboardpress[e.keyCode] = false;
});