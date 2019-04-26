/**
 * Created by crazygis on 2019/4/26.
 */
;(function(global, factory) {

    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get xmap.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var xmap = require("xmap")(window);
        module.exports = global.document ?
            factory(global, true) :
            function(w) {if (!w.document) {
                throw new Error("xmap requires a window with a document");
            }
                return factory(w);
            };
    } else {
        factory(global);
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    /**
     * CloudAtlas 云图框架命名空间
     * @namespace CAMap
     * */
    var CMap = {};
    window.CMap = CMap;
    return CMap;
}));