/// <reference path="TypeScriptLibrary.ts"/>

window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    plasma.game_interface.set_interval(() => {
        c.draw_rect(0, 0, 128, 16, "white");
        var str = plasma.game_interface.keyboard_press(37) ? "true" : "false";
        c.draw_string(str, 16, 0, 0);
    });
};