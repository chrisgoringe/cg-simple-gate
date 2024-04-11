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
	const w = node?.widgets.find((w) => w.name==='gate'); 
	if (w) { 
        w.silent_value_change = true
		w.value = "closed"; 
        w.silent_value_change = false
		node.onResize?.(node.size);
	} 
}

function gate_state_changed() {
    var w = this.widgets.find((w) => w.name==='gate');
    if (w?.silent_value_change) return;
    if (w) {
        const body = new FormData();
        body.append('id',this.id);
        body.append('state',w.value);
        api.fetchApi("/simple_gate_state_changed", { method: "POST", body, });
    }
}

app.registerExtension({
	name: "cg.simple_gate",

    setup() {
        api.addEventListener("simple_gate_image", display_preview_images);
        api.addEventListener("simple_gate_close", close_gate);
    },

    async nodeCreated(node) {
        if (node?.comfyClass === "Simple Gate") {
            const w = node?.widgets.find((w) => w.name==='gate');
            w.callback = gate_state_changed.bind(node)
        }
    },
});

