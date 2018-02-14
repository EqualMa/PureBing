const IMAGES_DIR = "images";
const OUTPUT_STYLE_RESOURCES_FILEPATH = "FullStyleResources.js";

const getSliceOfEn = (x, y) => `url("/s/a/hpc23.png") -${x}px -${y}px no-repeat rgba(34, 34, 34, 0.75)`;


const CONST_screenfull_style_enUS = { background: getSliceOfEn(47, 139) };
const CONST_screenexit_style_enUS = { background: getSliceOfEn(47, 179) };
const CONST_download_style_enUS = {
    "background-repeat": "no-repeat",
    "background-position": "center",
    "background-color": "rgba(34, 34, 34, 0.75)"
};

const resources = {
    "screenexit": {
        title: {
            "en-US": "Exit Pure Mode",
            "zh-CN": "退出纯壁纸模式",
        },
        mouseleave: { "style": { "en-US": CONST_screenexit_style_enUS } },
        mouseenter: { "style": { "en-US": CONST_screenexit_style_enUS } }
    },
    "screenfull": {
        title: {
            "en-US": "Enter Pure Mode",
            "zh-CN": "纯壁纸模式",
        },
        mouseleave: { "style": { "en-US": CONST_screenfull_style_enUS } },
        mouseenter: { "style": { "en-US": CONST_screenfull_style_enUS } }
    },
    "download": {
        title: {
            "en-US": "Download",
            "zh-CN": "下载",
        },
        mouseleave: { "style": { "en-US": CONST_download_style_enUS } },
        mouseenter: { "style": { "en-US": CONST_download_style_enUS } }
    }
};


module.exports = { resources, IMAGES_DIR, OUTPUT_STYLE_RESOURCES_FILEPATH };