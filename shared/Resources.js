const resources = {
    "screenexit": {
        title: {
            "en-US": "Exit Pure Mode",
            "zh-CN": "退出纯壁纸模式",
        }
    },
    "screenfull": {
        title: {
            "en-US": "Enter Pure Mode",
            "zh-CN": "纯壁纸模式",
        }
    },
    "download": {
        title: {
            "en-US": "Download",
            "zh-CN": "下载",
        }
    }
};

/**
 * 
 * @param {string} path 
 * @param {string} region 
 */
resources.getResource = function () {
    function getByOnePath(obj, path) {
        return typeof obj === 'undefined' ? undefined : obj[path];
    }

    return function (path, region) {
        let ps = path.split('.');
        var curObj = this;
        ps.forEach(p => { curObj = getByOnePath(curObj, p); });

        return this.getLocalized(curObj, region);
    };
}();

function getLocalized(obj, region) {
    if (typeof obj === "undefined") {
        return undefined;
    }

    if (obj.hasOwnProperty(region)) {
        return obj[region];
    }

    for (const key in obj) {
        if (region.indexOf(key) > -1 || key.indexOf(region) > -1) {
            return obj[key];
        }
    }
    return obj['en-US'];
}

module.exports = { resources, getLocalized };