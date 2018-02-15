const fs = require('fs');

/**
 * 
 * @param {string} jsfilepath 
 */
function getHeadComment(jsfilepath) {
    const jscontent = fs.readFileSync(jsfilepath, "utf-8");

    const lines = jscontent.split('\n');

    var comment = "";

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];

        if (line.startsWith('//')) {
            comment = comment.concat(line + "\n");
        } else {
            return comment;
        }
    }
}

module.exports = { getHeadComment };