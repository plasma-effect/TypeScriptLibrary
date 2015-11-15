/// <reference path="TypeScriptLibrary.ts"/>

function get_string(code: number) {
    return plasma.game_interface.keyboard_press(code) ? "true" : "false";
}

window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    var image = new Image();
    image.src = "plasma.png";
    
    var v = 0.1;
    plasma.game_interface.set_interval(() => {
        if (plasma.game_interface.keyboard_click(plasma.game_interface.keycode.space)) v += 0.1;
        c.draw_image_scale(image, 0, 0, v, v);
    });
}