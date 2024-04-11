from comfy.model_management import InterruptProcessingException
from server import PromptServer
from nodes import PreviewImage
import time

class SimpleGate(PreviewImage):
    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    FUNCTION = "func"
    CATEGORY = "gate"
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "image" : ("IMAGE",{}),
				"gate": (["closed", "open", "held open"], {  }),
                "sleep": ("FLOAT", {"default":0, "min":0, "max":10})
            }, 
            "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO", "id":"UNIQUE_ID"},
        }

    def func(self, image, gate, id, sleep, **kwargs):
        ret = self.save_images(images=image, **kwargs)
        PromptServer.instance.send_sync("simple_gate_image", {"id": id, "urls":ret['ui']['images']})
        if sleep: time.sleep(sleep)
        if gate=="closed": raise InterruptProcessingException()
        if gate=="open": PromptServer.instance.send_sync("simple_gate_close", {"id": id})
        return (image,)