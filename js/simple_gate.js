import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

function showImages(node, urls) {
    node.imgs = [];
    urls.forEach((u)=> {
        const img = new Image();
        node.imgs.push(img);
        img.onload = () => { app.graph.setDirtyCanvas(true); };
        img.src = `/view?filename=${encodeURIComponent(u.filename)}&type=temp&subfolder=${app.getPreviewFormatParam()}`
    })
    node.setSizeForImage?.();
}

function display_preview_images(event) {
    const node = app.graph._nodes_by_id[event.detail.id];
    if (node) {
        showImages(node, event.detail.urls);
    } 
}

function close_gate(event) {
    const node = app.graph._nodes_by_id[event.detail.id];
	var w = node?.widgets.find((w) => w.name==='gate'); // and then it's just the same
	if (w) { 
		w.value = "closed"; 
		node.onResize?.(node.size);
	} 
}

app.registerExtension({
	name: "cg.simple_gate",

    setup() {
        api.addEventListener("simple_gate_image", display_preview_images);
        api.addEventListener("simple_gate_close", close_gate);
    },

});

