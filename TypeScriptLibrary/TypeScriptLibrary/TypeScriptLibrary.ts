namespace plasma {
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
            this.ctx.font = size + "px 'ＭＳ Ｐゴシック'";
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
    }
}