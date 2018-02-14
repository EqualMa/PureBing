// ==UserScript==
// @name         Pure Bing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enjoy pure pictures and videos on bing.com
// @author       Equal Ma
// @include      /^https?://.*\.bing\.com/(\?.*)?$/
// @grant        GM_addStyle
// ==/UserScript==

import screenfull from "screenfull";
import { resources } from "../FullStyleResources";

import { importedCSS } from "./PureBingTM.css.js";

(function () {
    'use strict';

    const HIDED_CLASS_NAME = importedCSS.classNames.hided;

    function info(msg) {
        console.log('[Pure Bing]' + msg);
    }

    const id = id => document.getElementById(id);

    const getRegion = () => document.body.classList[1];

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
        if (styles)
            for (const key in styles) {
                element.style.setProperty(key, styles[key]);
            }
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

    function hide() {
        const hide_el = e => e.classList.add(HIDED_CLASS_NAME);

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
                }
            },
            hide_el
        );

        screenfull.request();

        getActionToRemoveEventListeners("screenfull", "mouseenter", "mouseleave")(this);

        addStyles(this, getLocalStyle("screenexit", "mouseenter"));

        getActionToAddEventListeners("screenexit", "mouseenter", "mouseleave")(this);

        id('hp_ctrls').classList.add(importedCSS.classNames.fade);
    }

    function unhide() {
        var hidedEls = document.getElementsByClassName(HIDED_CLASS_NAME);

        while (hidedEls.length) {
            hidedEls[0].classList.remove(HIDED_CLASS_NAME);
        }

        screenfull.exit();

        getActionToRemoveEventListeners("screenexit", "mouseenter", "mouseleave")(this);

        addStyles(this, getLocalStyle("screenfull", "mouseenter"));

        getActionToAddEventListeners("screenfull", "mouseenter", "mouseleave")(this);

        id('hp_ctrls').classList.remove(importedCSS.classNames.fade);

    }

    const switchDo = (do1, do2) => {
        var s = true;
        return function () {
            if (s) {
                do1.call(this);
            } else {
                do2.call(this);
            }
            s = !s;
        };
    };

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
     * 
     */
    function addButton(text, fn, styles, id) {
        const attrs = {
            role: "button",
            title: text,
            tabindex: "-1",
        };
        const a_styles = { cursor: 'pointer', width: "40px", height: "40px" };
        let a = create('a', attrs, a_styles);

        if (fn)
            a.onclick = fn;

        if (id) a.id = id;

        //         a.innerHTML = `
        // <div class="sc_light">
        // <div style="
        // overflow: hidden;
        // width: 40px;
        // height: 40px;
        // "></div>
        // </div>
        // `.trim();

        if (styles) {
            addStyles(a, styles);
        }

        addToRight(a);

        const action_a = (callback_a) => { callback_a(a); return action_a; };

        return action_a;
    }

    function getLocalTitle(btnName) {
        return resources.getLocalized(resources[btnName].title, getRegion());
    }

    function getLocalStyle(btnName, event) {
        return resources.getLocalized(resources[btnName][event].style, getRegion());
    }

    /**
     * get a unique event listener to change style
     * @param {string} btnName
     * @param {string} event
     */
    const getEventListener = function () {
        const listeners = {};
        return function (btnName, event) {
            if (listeners[btnName] === undefined) {
                listeners[btnName] = {};
            }
            if (listeners[btnName][event] === undefined) {
                listeners[btnName][event] = function () { addStyles(this, getLocalStyle(btnName, event)); };
            }
            return listeners[btnName][event];
        };
    }();

    function getActionToAddEventListeners(btnName, ...events) {
        return element => events.forEach(ev => element.addEventListener(ev, getEventListener(btnName, ev)));
    }

    function getActionToRemoveEventListeners(btnName, ...events) {
        return element => events.forEach(ev => element.removeEventListener(ev, getEventListener(btnName, ev)));
    }

    function addLocalizedButton(fn, btnName, ...events) {
        return addButton(getLocalTitle(btnName), fn, getLocalStyle(btnName, events[0]))(
            getActionToAddEventListeners(btnName, ...events)
        );
    }

    /* end declaration. start main program */

    addLocalizedButton(switchDo(hide, unhide), "screenfull", "mouseleave", "mouseenter");

    addLocalizedButton(null, "download", "mouseleave", "mouseenter")(da => {
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