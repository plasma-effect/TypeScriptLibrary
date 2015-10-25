/// <reference path="TypeScriptLibrary.ts"/>

window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    var func = plasma.make_xorshift(1);
    c.draw_string(func().toString(), [0, 0, 0], 16, 0, 16 * 1);
    c.draw_string(func().toString(), [0, 0, 0], 16, 0, 16 * 2);
    c.draw_string(func().toString(), [0, 0, 0], 16, 0, 16 * 3);
    c.draw_string(func().toString(), [0, 0, 0], 16, 0, 16 * 4);
};