// ==UserScript==
// @name         Pure Bing
// @namespace    https://equal.stream
// @version      1.0.0
// @description  Enjoy pure home page of bing.com
// @author       Equal Ma
// @match        https://*.bing.com/
// @include      /^https?://.*\.bing\.com/(\?.*)?$/
// @grant        GM_addStyle
// @homepage     https://github.com/EqualMa/PureBing
// @updateURL    https://raw.githubusercontent.com/EqualMa/PureBing/master/dist/PureBingTM.min.js
// @downloadURL  https://raw.githubusercontent.com/EqualMa/PureBing/master/dist/PureBingTM.min.js
// @supportURL   https://github.com/EqualMa/PureBing/issues
// ==/UserScript==

import screenfull from "screenfull";
import { resources, getLocalized } from "../shared/Resources";

import { importedCSS } from "./PureBingTM.css.js";

(function () {
    'use strict';

    const importedClassNames = importedCSS.classNames;
    const HIDED_CLASS_NAME = importedClassNames.hided;
    const HIDABLE_CLASS_NAME = importedClassNames.hidable;


    /* js utils */

    const switchDo = (do1, do2) => {
        var s = true;
        return function () {
            if (s) {
                do1.apply(this, arguments);
            } else {
                do2.apply(this, arguments);
            }
            s = !s;
        };
    };

    const once = (fn) => {
        var called = false;
        return function () {
            if (!called) {
                called = true;
                fn.apply(this, arguments);
            }
        };
    };

    function info(msg) {
        console.log('[Pure Bing]' + msg);
    }

    const id = id => document.getElementById(id);

    const classElements = className => document.getElementsByClassName(className);

    const getRegion = () => document.body.classList[1];

    const do_for_element = (element, previousValue) => {
        return action => do_for_element(element, action(element, previousValue));
    };

    function actions_for_element(...actions) {
        return element => actions.forEach(action => action(element));
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {object} [attrs]
     */
    const addAttributes = (element, attrs) => {
        if (attrs)
            for (const key in attrs) {
                element.setAttribute(key, attrs[key]);
            }
    };

    /**
     * 
     * @param {HTMLElement} element 
     * @param {object} styles 
     */
    const addStyles = (element, styles) => {
        if (element && styles)
            for (const key in styles) {
                element.style.setProperty(key, styles[key]);
            }
    };

    /**
     * 
     * @param {...string} classNames 
     */
    const actionToAddClasses = (...classNames) => {
        return element => element.classList.add(...classNames);
    };

    /**
     * 
     * @param {...string} classNames 
     */
    const actionToRemoveClasses = (...classNames) => {
        return element => element.classList.remove(...classNames);
    };


    /**
     * 
     * @param {string} tagName 
     * @param {object} attrs 
     * @param {object} styles
     */
    const create = (tagName, attrs, styles) => {
        let element = document.createElement(tagName);

        if (attrs) addAttributes(element, attrs);

        if (styles) addStyles(element, styles);

        return element;
    };


    /**
     * 
     * @param {HTMLCollection} htmlCollection 
     * @param {(element:Element)=>void} element_do 
     */
    function forEachElement(htmlCollection, element_do) {
        for (let index = 0; index < htmlCollection.length; index++) {
            const element = htmlCollection[index];
            element_do(element);
        }
    }


    /**
     * 
     * @param {Element} parent 
     * @param {*} id_Do 
     * @param {(child:Element)=>void} default_do 
     */
    function forEachChild(parent, id_Do, default_do) {
        forEachElement(parent.children, e => {
            const todo = ((id_Do && id_Do[e.id]) ? id_Do[e.id] : default_do);
            if (todo) todo(e);
        });
    }

    info('enabled.');

    const initHidableListOnce = once(function () {
        const hide_el = actionToAddClasses(HIDABLE_CLASS_NAME);

        forEachChild(
            id('hp_container'),
            {
                bgDiv: () => { },
                hp_bottomCell: hp_bottomCell => {
                    forEachChild(hp_bottomCell,
                        {
                            hp_ctrls: hp_ctrls => {
                                forEachChild(
                                    hp_ctrls,
                                    { sh_rdiv: () => { } },
                                    hide_el
                                );
                            }
                        },
                        hide_el
                    );
                },
                lap_w: () => { hide_el(id("lap_s")); }
            },
            hide_el
        );
    });

    function hide() {

        initHidableListOnce();

        // hide
        forEachElement(classElements(HIDABLE_CLASS_NAME), actionToAddClasses(HIDED_CLASS_NAME));

        // fullscreen
        screenfull.request();

        // change icon
        document.querySelectorAll(`.${importedClassNames.screen}.${importedClassNames.full}`).forEach(
            actions_for_element(
                actionToRemoveClasses(importedClassNames.full),
                actionToAddClasses(importedClassNames.exit)
            )
        );

        // fade when mouseout
        id('hp_ctrls').classList.add(importedCSS.classNames.fade);
    }

    function unhide() {
        // unhide
        forEachElement(classElements(HIDABLE_CLASS_NAME), actionToRemoveClasses(HIDED_CLASS_NAME));

        // exit fullscreen
        screenfull.exit();

        // change icon to screenfull
        document.querySelectorAll(`.${importedClassNames.screen}.${importedClassNames.exit}`).forEach(
            actions_for_element(
                actionToRemoveClasses(importedClassNames.exit),
                actionToAddClasses(importedClassNames.full)
            )
        );

        // don't fade
        id('hp_ctrls').classList.remove(importedCSS.classNames.fade);
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    const addToRight = (element) => {
        id('sh_rdiv').lastElementChild.insertAdjacentElement('beforeBegin', element);
    };

    /**
     * 
     * @param {string} text 
     * @param {function} fn 
     * @param {object} styles 可通过styles参数设置按钮的样式
     * @param {string=} id
     * @param {...string} classNames
     * 
     */
    function addButton(text, fn, styles, id, ...classNames) {
        const attrs = {
            role: "button",
            title: text,
            tabindex: "-1",
        };

        let a = create('a', attrs);

        if (fn)
            a.onclick = fn;

        if (id) a.id = id;

        if (classNames.length > 0) {
            a.classList.add(importedClassNames.button, getAvailableRegionClassName(), ...classNames);
        }

        if (styles) {
            addStyles(a, styles);
        }

        addToRight(a);

        const action_a = (callback_a) => { callback_a(a); return action_a; };

        return action_a;
    }

    function getAvailableRegionClassName() {
        return getLocalized(importedCSS.classNames, getRegion());
    }

    function getLocalTitle(btnName) {
        return getLocalized(resources[btnName].title, getRegion());
    }

    /* end declaration. start main program */

    addButton(getLocalTitle("screenfull"), switchDo(hide, unhide), null, null,
        importedClassNames.screen, importedClassNames.full, getAvailableRegionClassName());

    addButton(getLocalTitle("download"), null, null, null, importedClassNames.download, getAvailableRegionClassName())(da => {
        // watch background image change

        const bgDiv = id('bgDiv');
        const getComputedBgImage = () => getComputedStyle(bgDiv).backgroundImage;

        const re = /url\(('|")(.*)('|")\)/;
        const getUrl = u => { let r = u.match(re); return r ? r[2] : r; };

        const valueChanged = v => {
            addAttributes(da, { href: getUrl(v), download: "" });
        };

        Object.defineProperty(bgDiv.style, "backgroundImage",
            function () {
                var valueStorer = bgDiv.style.backgroundImage;
                valueChanged(getComputedBgImage());
                return {
                    get: function () {
                        return valueStorer;
                    },
                    set: function (newValue) {
                        valueStorer = newValue;
                        bgDiv.style.setProperty("background-image", valueStorer);
                        valueChanged(newValue);
                    },
                    enumerable: true,
                    configurable: true
                };
            }()
        );
    });
})();