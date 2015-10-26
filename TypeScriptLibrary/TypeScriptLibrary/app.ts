/// <reference path="TypeScriptLibrary.ts"/>

window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    var engine = plasma.random.make_xorshift(plasma.random.seed_generate());
    var dis = plasma.random.uniformed_int_distribution(engine, 1, 6);
    c.draw_rect(0, 0, 32, 32);
    c.draw_rect(0, 32, 32, 32, "red");

};