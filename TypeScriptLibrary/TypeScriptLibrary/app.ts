/// <reference path="TypeScriptLibrary.ts"/>
window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    var f = false;
    var f2 = false;
    plasma.game_interface.set_interval(() => {
        f = f || plasma.game_interface.detail.helper.mouse_on;
        f2 = f2 || plasma.game_interface.detail.now_data.mouse_on;
        c.draw_string(f ? "true" : "false", 16, 0, 0);
        c.draw_string(f2 ? "true" : "false", 16, 0, 16);

    });
};