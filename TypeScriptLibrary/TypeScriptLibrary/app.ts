/// <reference path="TypeScriptLibrary.ts"/>
window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    var image = new Image();
    image.src = "red.png";
    c.draw_image(image, 0, 0);
    c.draw_image_reverse(image, 80,80);
};