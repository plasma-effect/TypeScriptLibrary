/// <reference path="TypeScriptLibrary.ts" />

var test = (() => {
    var x = 0;
    return () => {
        return ++x;
    };
})();

window.onload = () => {
    var c = new TSL.CanvasTraits("field");
    c.draw_string(test().toString(), 16, 0, 0);
    c.draw_string(test().toString(), 16, 16, 0);
}