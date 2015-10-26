/// <reference path="TypeScriptLibrary.ts"/>

window.onload = () => {
    var c = new plasma.CanvasTraits("field");
    var image = new Image();
    image.src = "plasma.png";
    image.onload=()=>
    c.draw_image(image, 0, 0);
    

};