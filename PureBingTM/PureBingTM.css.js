import initialCSS from "./PureBingTM.css";

const importedCSS = {
    cssString: initialCSS.toString(),
    classNames: initialCSS.locals
};

GM_addStyle(importedCSS.cssString);

export { importedCSS };
