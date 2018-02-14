const fs = require("fs");
const path = require('path');

const { resources, IMAGES_DIR, OUTPUT_STYLE_RESOURCES_FILEPATH } = require("./i18n-dev-initial-styles");

const RESOURCES_EXPORT_NAME = "resources";

const getJsFileContent = () =>
    `
const ${RESOURCES_EXPORT_NAME} = ${JSON.stringify(resources, null, 4)};


/**
 * 
 * @param {string} path 
 * @param {string} region 
 */
${RESOURCES_EXPORT_NAME}.getResource = function () {
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

resources.getLocalized = function (obj, region) {
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
};

export { ${RESOURCES_EXPORT_NAME} };
    `.trim();

function setResourse(paths, resource) {
    var curObj = resources;

    for (let index = 0; index < paths.length; index++) {
        const p = paths[index];

        if (index === paths.length - 1) {
            curObj[p] = resource;
        } else {
            if (curObj[p] === undefined || curObj[p] === null) {
                curObj[p] = {};
            }
            curObj = curObj[p];
        }


    }
}
/**
 * 
 * @param {string} filename image file's name without ext. Represents its resource path
 * @param {string} url image's url
 */
function setStyleBackgroundImage(filename, url) {
    let paths = filename.split('.');
    setResourse(
        paths.slice(0, -1).concat('style', paths.slice(-1), "background-image"),
        `url(${url})`
    );
}

function getBase64Url(fullFilePath) {
    const imageBuf = fs.readFileSync(fullFilePath);

    return `data:image/jpeg;base64,${imageBuf.toString("base64")}`;
}

function addImgFileToStyle(dir, file) {

    const fullpath = path.join(dir, file);
    const full = path.parse(fullpath);

    if (full.ext === ".png") {
        setStyleBackgroundImage(full.name, getBase64Url(fullpath));
    }

}


fs.readdir(IMAGES_DIR, function (err, files) {
    if (err) {
        return console.error(err);
    }
    console.log(`开始遍历 ${IMAGES_DIR} 目录`);

    files.forEach(function (file) {
        addImgFileToStyle(IMAGES_DIR, file);
    });

    console.log(`${IMAGES_DIR} 目录遍历结束，开始更新${OUTPUT_STYLE_RESOURCES_FILEPATH}`);

    fs.writeFile(OUTPUT_STYLE_RESOURCES_FILEPATH, getJsFileContent(), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(`更新${OUTPUT_STYLE_RESOURCES_FILEPATH}成功！`);
    });
});

