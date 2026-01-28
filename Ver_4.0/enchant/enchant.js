/**
 * enchant.js v0.8.3
 * http://enchantjs.com
 *
 * Copyright UEI Corporation
 * Released under the MIT license.
 */

(function(window, undefined) {

    // ECMA-262 5th edition Functions
    if (typeof Object.defineProperty !== 'function') {
        Object.defineProperty = function(obj, prop, desc) {
            if ('value' in desc) {
                obj[prop] = desc.value;
            }
            if ('get' in desc) {
                obj.__defineGetter__(prop, desc.get);
            }
            if ('set' in desc) {
                obj.__defineSetter__(prop, desc.set);
            }
            return obj;
        };
    }
    if (typeof Object.defineProperties !== 'function') {
        Object.defineProperties = function(obj, descs) {
            for (var prop in descs) {
                if (descs.hasOwnProperty(prop)) {
                    Object.defineProperty(obj, prop, descs[prop]);
                }
            }
            return obj;
        };
    }
    if (typeof Object.create !== 'function') {
        Object.create = function(prototype, descs) {
            function F() {
            }
    
            F.prototype = prototype;
            var obj = new F();
            if (descs != null) {
                Object.defineProperties(obj, descs);
            }
            return obj;
        };
    }
    if (typeof Object.getPrototypeOf !== 'function') {
        Object.getPrototypeOf = function(obj) {
            return obj.__proto__;
        };
    }
    
    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = function(thisObject) {
            var func = this;
            var args = Array.prototype.slice.call(arguments, 1);
            var Nop = function() {
            };
            var bound = function() {
                var a = args.concat(Array.prototype.slice.call(arguments));
                return func.apply(
                    this instanceof Nop ? this : thisObject || window, a);
            };
            Nop.prototype = func.prototype;
            bound.prototype = new Nop();
            return bound;
        };
    }
    // High-resolution timestamp
    window.getTime = (function () {
        if (performance && performance.now) {
            const origin = Date.now();
            return () => origin + performance.now();
        }
        return Date.now;
    })();

    // requestAnimationFrame fallback
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            return setTimeout(() => {
                callback(window.getTime());
            }, 1000 / 60);
        };
    }

    /**
     * Export the library classes globally.
     *
     * When no arguments are given, all classes defined in enchant.js as well as all classes defined in
     * plugins will be exported. When more than one argument is given, by default only classes defined
     * in enchant.js will be exported. When you wish to export plugin classes you must explicitly deliver
     * the plugin identifiers as arguments.
     *
     * @example
     * enchant();     // All classes will be exported.
     * enchant('');   // Only classes in enchant.js will be exported.
     * enchant('ui'); // enchant.js classes and ui.enchant.js classes will be exported.
     *
     * @param {...String} [modules] Export module. Multiple designations possible.
     * @function
     * @global
     * @name enchant
     */
    var enchant = function (...modules) {
        // Normalize modules
        if (modules.length === 0) {
            modules = null;
        } else {
            modules = modules.filter(m => m !== '');
        }

        const include = (module, prefix) => {
            const submodules = [];

            for (const prop of Object.keys(module)) {
                const value = module[prop];

                if (typeof value === 'function') {
                    window[prop] = value;
                } else if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
                    const fullName = prefix + prop;

                    if (modules === null || modules.includes(fullName)) {
                        submodules.push(prop);

                        if (modules) {
                            modules = modules.filter(m => m !== fullName);
                        }
                    }
                }
            }

            for (const sub of submodules) {
                include(module[sub], prefix + sub + '.');
            }
        };

        include(enchant, '');

        // issue 185 fix (getInheritanceTree を使わない版)
        if (!(window.Game.prototype instanceof window.Core)) {
            window.Game = window.Core;
        }


        if (modules && modules.length) {
            throw new Error('Cannot load module: ' + modules.join(', '));
        }
    };

    // export enchant
    window.enchant = enchant;
    
    window.addEventListener("message", function(msg, origin) {
        try {
            var data = JSON.parse(msg.data);
            if (data.type === "event") {
                enchant.Core.instance.dispatchEvent(new enchant.Event(data.value));
            } else if (data.type === "debug") {
                switch (data.value) {
                    case "start":
                        enchant.Core.instance.start();
                        break;
                    case "pause":
                        enchant.Core.instance.pause();
                        break;
                    case "resume":
                        enchant.Core.instance.resume();
                        break;
                    case "tick":
                        enchant.Core.instance._tick();
                        break;
                    default:
                        break;
                }
            }
        } catch (e) {
            // ignore
        }
    }, false);
    
    /**
     * @name enchant.Class
     * @class
     * A Class representing a class which supports inheritance.
     * @param {Function} [superclass] The class from which the
     * new class will inherit the class definition.
     * @param {*} [definition] Class definition.
     * @constructor
     */
    enchant.Class = function(superclass, definition) {
        return enchant.Class.create(superclass, definition);
    };
    
    /**
     * Creates a class.
     *
     * When defining a class that extends from another class, 
     * the constructor of the other class will be used by default.
     * Even if you override this constructor, you must still call it
     * to ensure that the class is initialized correctly.
     *
     * @example
     * // Creates a Ball class.
     * var Ball = Class.create({ 
     *
     *     // Ball's constructor
     *     initialize: function(radius) {
     *       // ... code ...
     *     }, 
     *
     *     // Defines a fall method that doesn't take any arguments.
     *     fall: function() { 
     *       // ... code ...
     *     }
     * });
     *
     * // Creates a Ball class that extends from "Sprite"
     * var Ball = Class.create(Sprite);  
     *
     * // Creates a Ball class that extends from "Sprite"
     * var Ball = Class.create(Sprite, { 
     *
     *     // Overwrite Sprite's constructor
     *     initialize: function(radius) { 
     *
     *         // Call Sprite's constructor.
     *         Sprite.call(this, radius * 2, radius * 2);
     *
     *         this.image = core.assets['ball.gif'];
     *     }
     * });
     *
     * @param {Function} [superclass] The class from which the
     * new class will inherit the class definition.
     * @param {*} [definition] Class definition.
     * @static
     */
    enchant.Class.create = function (superclass, definition) {
        if (!superclass) throw new Error("superclass is undefined");
        if (!definition && typeof superclass !== "function") {
            definition = superclass;
            superclass = Object;
        }

        // Normalize definition into property descriptors
        const desc = {};
        for (const key in definition) {
            if (!definition.hasOwnProperty(key)) continue;
            const val = definition[key];

            if (val && typeof val === "object" && Object.getPrototypeOf(val) === Object.prototype) {
                desc[key] = { ...val, enumerable: true };
            } else {
                desc[key] = { value: val, enumerable: true, writable: true };
            }
        }

        // Constructor
        function Constructor() {
            return Constructor.prototype.initialize.apply(this, arguments);
        }

        Constructor.prototype = Object.create(superclass.prototype, desc);
        Constructor.prototype.constructor = Constructor;

        if (!Constructor.prototype.initialize) {
            Constructor.prototype.initialize = function () {
                superclass.apply(this, arguments);
            };
        }

        // Call inherited hook
        let proto = superclass;
        while (proto && proto !== Object) {
            if (typeof proto._inherited === "function") {
                proto._inherited(Constructor);
                break;
            }
            proto = Object.getPrototypeOf(proto.prototype)?.constructor;
        }

        return Constructor;
    };
    
    /**
     * @namespace
     * enchant.js environment variables.
     * Execution settings can be changed by modifying these before calling new Core().
     */
    enchant.ENV = {
        /**
         * Version of enchant.js
         * @type String
         */
        VERSION: '0.8.3',
        /**
         * Identifier of the current browser.
         * @type String
         */
        BROWSER: (function(ua) {
            if (/Eagle/.test(ua)) {
                return 'eagle';
            } else if (/Opera/.test(ua)) {
                return 'opera';
            } else if (/MSIE|Trident/.test(ua)) {
                return 'ie';
            } else if (/Chrome/.test(ua)) {
                return 'chrome';
            } else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
                return 'safari';
            } else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
                return 'mobilesafari';
            } else if (/Firefox/.test(ua)) {
                return 'firefox';
            } else if (/Android/.test(ua)) {
                return 'android';
            } else {
                return '';
            }
        }(navigator.userAgent)),
        /**
         * The CSS vendor prefix of the current browser.
         * @type String
         */
        VENDOR_PREFIX: (function() {
            var ua = navigator.userAgent;
            if (ua.indexOf('Opera') !== -1) {
                return 'O';
            } else if (/MSIE|Trident/.test(ua)) {
                return 'ms';
            } else if (ua.indexOf('WebKit') !== -1) {
                return 'webkit';
            } else if (navigator.product === 'Gecko') {
                return 'Moz';
            } else {
                return '';
            }
        }()),
        /**
         * Determines if the current browser supports touch.
         * True, if touch is enabled.
         * @type Boolean
         */
        TOUCH_ENABLED: (function() {
            var div = document.createElement('div');
            div.setAttribute('ontouchstart', 'return');
            return typeof div.ontouchstart === 'function';
        }()),
        /**
         * Determines if the current browser is an iPhone with a retina display.
         * True, if this display is a retina display.
         * @type Boolean
         */
        RETINA_DISPLAY: (function() {
            if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
                var viewport = document.querySelector('meta[name="viewport"]');
                if (viewport == null) {
                    viewport = document.createElement('meta');
                    document.head.appendChild(viewport);
                }
                viewport.setAttribute('content', 'width=640');
                return true;
            } else {
                return false;
            }
        }()),
        /**
         * Determines if for current browser Flash should be used to play 
         * sound instead of the native audio class.
         * True, if flash should be used.
         * @type Boolean
         */
        USE_FLASH_SOUND: (function() {
            var ua = navigator.userAgent;
            var vendor = navigator.vendor || "";
            // non-local access, not on mobile mobile device, not on safari
            return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
        }()),
        /**
         * If click/touch event occure for these tags the setPreventDefault() method will not be called.
         * @type String[]
         */
        USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
        /**
         * Method names of CanvasRenderingContext2D that will be defined as Surface method.
         * @type String[]
         */
        CANVAS_DRAWING_METHODS: [
            'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
            'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
        ],
        /**
         * Keybind Table.
         * You can use 'left', 'up', 'right', 'down' for preset event.
         * @example
         * enchant.ENV.KEY_BIND_TABLE = {
         *     37: 'left',
         *     38: 'up',
         *     39: 'right',
         *     40: 'down',
         *     32: 'a', //-> use 'space' key as 'a button'
         * };
         * @type Object
         */
        KEY_BIND_TABLE: {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        },
        /**
         * If keydown event occure for these keycodes the setPreventDefault() method will be called.
         * @type Number[]
         */
        PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40],
        /**
         * Determines if Sound is enabled on Mobile Safari.
         * @type Boolean
         */
        SOUND_ENABLED_ON_MOBILE_SAFARI: true,
        /**
         * Determines if "touch to start" scene is enabled.
         * It is necessary on Mobile Safari because WebAudio Sound is
         * muted by browser until play any sound in touch event handler.
         * If set it to false, you should control this behavior manually.
         * @type Boolean
         */
        USE_TOUCH_TO_START_SCENE: true,
        /**
         * Determines if WebAudioAPI is enabled. (true: use WebAudioAPI instead of Audio element if possible)
         * @type Boolean
         */
        USE_WEBAUDIO: (function() {
            return location.protocol !== 'file:';
        }()),
        /**
         * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
         * @type Boolean
         */
        USE_ANIMATION: true,
        /**
         * Specifies range of the touch detection.
         * The detection area will be (COLOR_DETECTION_LEVEL * 2 + 1)px square.
         * @type Boolean
         */
        COLOR_DETECTION_LEVEL: 2
    };
    
    /**
     * @scope enchant.Event.prototype
     */
    enchant.Event = enchant.Class.create({
        /**
         * @name enchant.Event
         * @class
         * A class for an independent implementation of events similar to DOM Events.
         * Does not include phase concepts.
         * @param {String} type Event type.
         * @constructs
         */
        initialize: function(type) {
            /**
             * The type of the event.
             * @type String
             */
            this.type = type;
            /**
             * The target of the event.
             * @type *
             */
            this.target = null;
            /**
             * The x-coordinate of the event's occurrence.
             * @type Number
             */
            this.x = 0;
            /**
             * The y-coordinate of the event's occurrence.
             * @type Number
             */
            this.y = 0;
            /**
             * The x-coordinate of the event's occurrence relative to the object
             * which issued the event.
             * @type Number
             */
            this.localX = 0;
            /**
             * The y-coordinate of the event's occurrence relative to the object
             * which issued the event.
             * @type Number
             */
            this.localY = 0;
        },
        _initPosition: function(pageX, pageY) {
            var core = enchant.Core.instance;
            this.x = this.localX = (pageX - core._pageX) / core.scale;
            this.y = this.localY = (pageY - core._pageY) / core.scale;
        }
    });
    
    /**
     * An event dispatched once the core has finished loading.
     *
     * When preloading images, it is necessary to wait until preloading is complete
     * before starting the game.
     * Issued by: {@link enchant.Core}
     *
     * @example
     * var core = new Core(320, 320);
     * core.preload('player.gif');
     * core.onload = function() {
     *     ... // Describes initial core processing
     * };
     * core.start();
     * @type String
     */
    enchant.Event.LOAD = 'load';
    
    /**
     * An event dispatched when an error occurs.
     * Issued by: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
     */
    enchant.Event.ERROR = 'error';
    
    /**
     * An event dispatched when the display size is changed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     @type String
     */
    enchant.Event.CORE_RESIZE = 'coreresize';
    
    /**
     * An event dispatched while the core is loading.
     * Dispatched each time an image is preloaded.
     * Issued by: {@link enchant.LoadingScene}
     * @type String
     */
    enchant.Event.PROGRESS = 'progress';
    
    /**
     * An event which is occurring when a new frame is beeing processed.
     * Issued object: {@link enchant.Core}, {@link enchant.Node}
     * @type String
     */
    enchant.Event.ENTER_FRAME = 'enterframe';
    
    /**
     * An event dispatched at the end of processing a new frame.
     * Issued by: {@link enchant.Core}, {@link enchant.Node}
     * @type String
     */
    enchant.Event.EXIT_FRAME = 'exitframe';
    
    /**
     * An event dispatched when a Scene begins.
     * Issued by: {@link enchant.Scene}
     * @type String
     */
    enchant.Event.ENTER = 'enter';
    
    /**
     * An event dispatched when a Scene ends.
     * Issued by: {@link enchant.Scene}
     * @type String
     */
    enchant.Event.EXIT = 'exit';
    
    /**
     * An event dispatched when a Child is added to a Node.
     * Issued by: {@link enchant.Group}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.CHILD_ADDED = 'childadded';
    
    /**
     * An event dispatched when a Node is added to a Group.
     * Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.ADDED = 'added';
    
    /**
     * An event dispatched when a Node is added to a Scene.
     * Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.ADDED_TO_SCENE = 'addedtoscene';
    
    /**
     * An event dispatched when a Child is removed from a Node.
     * Issued by: {@link enchant.Group}, {@link enchant.Scene}
     * @type String
     * @type String
     */
    enchant.Event.CHILD_REMOVED = 'childremoved';
    
    /**
     * An event dispatched when a Node is deleted from a Group.
     * Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.REMOVED = 'removed';
    
    /**
     * An event dispatched when a Node is deleted from a Scene.
     * Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';
    
    /**
     * An event dispatched when a touch event intersecting a Node begins.
     * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.TOUCH_START = 'touchstart';
    
    /**
     * An event dispatched when a touch event intersecting the Node has been moved.
     * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.TOUCH_MOVE = 'touchmove';
    
    /**
     * An event dispatched when a touch event intersecting the Node ends.
     * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
     * @type String
     */
    enchant.Event.TOUCH_END = 'touchend';
    
    /**
     * An event dispatched when an Entity is rendered.
     * Issued by: {@link enchant.Entity}
     * @type String
     */
    enchant.Event.RENDER = 'render';
    
    /**
     * An event dispatched when a button is pressed.
     * Issued by: {@link enchant.Core}, {@link .addEventListener('mousemove'}
     * @type String
     */
    enchant.Event.INPUT_START = 'inputstart';
    
    /**
     * An event dispatched when button inputs change.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.INPUT_CHANGE = 'inputchange';
    
    /**
     * An event dispatched when button input ends.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.INPUT_END = 'inputend';
    
    /**
     * An internal event which is occurring when a input changes.
     * Issued object: {@link enchant.InputSource}
     * @type String
     */
    enchant.Event.INPUT_STATE_CHANGED = 'inputstatechanged';
    
    /**
     * An event dispatched when the 'left' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';
    
    /**
     * An event dispatched when the 'left' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';
    
    /**
     * An event dispatched when the 'right' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';
    
    /**
     * An event dispatched when the 'right' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';
    
    /**
     * An event dispatched when the 'up' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';
    
    /**
     * An event dispatched when the 'up' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.UP_BUTTON_UP = 'upbuttonup';
    
    /**
     * An event dispatched when the 'down' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';
    
    /**
     * An event dispatched when the 'down' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';
    
    /**
     * An event dispatched when the 'a' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.A_BUTTON_DOWN = 'abuttondown';
    
    /**
     * An event dispatched when the 'a' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.A_BUTTON_UP = 'abuttonup';
    
    /**
     * An event dispatched when the 'b' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.B_BUTTON_DOWN = 'bbuttondown';
    
    /**
     * An event dispatched when the 'b' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     * @type String
     */
    enchant.Event.B_BUTTON_UP = 'bbuttonup';
    
    /**
     * An event dispatched when an Action is added to a Timeline.
     * When looped, an Action is removed from the Timeline and added back into it.
     * @type String
     */
    enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";
    
    /**
     * An event dispatched when an Action is removed from a Timeline.
     * When looped, an Action is removed from the timeline and added back into it.
     * @type String
     */
    enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";
    
    /**
     * An event dispatched when an Action begins.
     * @type String
     */
    enchant.Event.ACTION_START = "actionstart";
    
    /**
     * An event dispatched when an Action finishes.
     * @type String
     */
    enchant.Event.ACTION_END = "actionend";
    
    /**
     * An event dispatched when an Action has gone through one frame.
     * @type String
     */
    enchant.Event.ACTION_TICK = "actiontick";
    
    /**
     * An event dispatched to the Timeline when an Action is added.
     * @type String
     */
    enchant.Event.ACTION_ADDED = "actionadded";
    
    /**
     * An event dispatched to the Timeline when an Action is removed.
     * @type String
     */
    enchant.Event.ACTION_REMOVED = "actionremoved";
    
    /**
     * An event dispatched when an animation finishes, meaning null element was encountered
     * Issued by: {@link enchant.Sprite}
     * @type String
     */
    enchant.Event.ANIMATION_END = "animationend";
    
    /**
     * @scope enchant.EventTarget.prototype
     */
    enchant.EventTarget = enchant.Class.create({
        /**
         * @name enchant.EventTarget
         * @class
         * A class for implementation of events similar to DOM Events.
         * However, it does not include the concept of phases.
         * @constructs
         */
        initialize: function() {
            this._listeners = {};
        },
        /**
         * Add a new event listener which will be executed when the event
         * is dispatched.
         * @param {String} type Type of the events.
         * @param {Function(e:enchant.Event)} listener Event listener to be added.
         */
        addEventListener: function(type, listener) {
            var listeners = this._listeners[type];
            if (listeners == null) {
                this._listeners[type] = [listener];
            } else if (listeners.indexOf(listener) === -1) {
                listeners.unshift(listener);
    
            }
        },
        /**
         * Synonym for addEventListener.
         * @param {String} type Type of the events.
         * @param {Function(e:enchant.Event)} listener Event listener to be added.
         * @see enchant.EventTarget#addEventListener
         */
        on: function() {
            this.addEventListener.apply(this, arguments);
        },
        /**
         * Delete an event listener.
         * @param {String} [type] Type of the events.
         * @param {Function(e:enchant.Event)} listener Event listener to be deleted.
         */
        removeEventListener: function(type, listener) {
            var listeners = this._listeners[type];
            if (listeners != null) {
                var i = listeners.indexOf(listener);
                if (i !== -1) {
                    listeners.splice(i, 1);
                }
            }
        },
        /**
         * Clear all defined event listeners of a given type.
         * If no type is given, all listeners will be removed.
         * @param {String} type Type of the events.
         */
        clearEventListener: function(type) {
            if (type != null) {
                delete this._listeners[type];
            } else {
                this._listeners = {};
            }
        },
        /**
         * Issue an event.
         * @param {enchant.Event} e Event to be issued.
         */
        dispatchEvent: function(e) {
            e.target = this;
            e.localX = e.x - this._offsetX;
            e.localY = e.y - this._offsetY;
            if (this['on' + e.type] != null){
                this['on' + e.type](e);
            }
            var listeners = this._listeners[e.type];
            if (listeners != null) {
                listeners = listeners.slice();
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, e);
                }
            }
        }
    });
    
    (function() {
        var core;
        /**
         * @scope enchant.Core.prototype
         */
        enchant.Core = enchant.Class.create(enchant.EventTarget, {

            initialize: function (width, height) {
                if (!document.body) {
                    throw new Error("document.body is null. Please execute 'new Core()' in window.onload.");
                }

                enchant.EventTarget.call(this);

                var initial = !core;
                if (!initial) core.stop();
                core = enchant.Core.instance = this;

                this._calledTime = 0;
                this._mousedownID = 0;
                this._surfaceID = 0;
                this._soundID = 0;
                this._scenes = [];

                this._width = width || 320;
                this._height = height || 320;

                var stage = document.getElementById('enchant-stage');
                var scale = 1;

                if (!stage) {
                    stage = document.createElement('div');
                    stage.id = 'enchant-stage';
                    stage.style.position = 'absolute';

                    if (document.body.firstChild) {
                        document.body.insertBefore(stage, document.body.firstChild);
                    } else {
                        document.body.appendChild(stage);
                    }

                    scale = Math.min(
                        window.innerWidth / this._width,
                        window.innerHeight / this._height
                    );

                    var rect = stage.getBoundingClientRect();
                    this._pageX = rect.left;
                    this._pageY = rect.top;

                } else {
                    var style = window.getComputedStyle(stage);
                    var sWidth = parseInt(style.width, 10);
                    var sHeight = parseInt(style.height, 10);

                    if (sWidth && sHeight) {
                        scale = Math.min(sWidth / this._width, sHeight / this._height);
                    }

                    stage.textContent = '';
                    stage.style.position = 'relative';

                    var rect2 = stage.getBoundingClientRect();
                    var scrollX = window.scrollX || window.pageXOffset || 0;
                    var scrollY = window.scrollY || window.pageYOffset || 0;
                    this._pageX = Math.round(scrollX + rect2.left);
                    this._pageY = Math.round(scrollY + rect2.top);
                }

                stage.style.fontSize = '12px';
                stage.style.webkitTextSizeAdjust = 'none';
                stage.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
                this._element = stage;

                this.addEventListener('coreresize', this._oncoreresize);

                this.scale = scale;

                this.fps = 30;
                this.frame = 0;
                this.ready = false;
                this.running = false;
                this.assets = {};
                this._assets = [];

                // detectAssets（軽量化版）
                (function detectAssets(module) {
                    if (module.assets) enchant.Core.instance.preload(module.assets);
                    for (var prop in module) {
                        if (!module.hasOwnProperty(prop)) continue;
                        var v = module[prop];
                        if (v && typeof v === 'object' &&
                            Object.getPrototypeOf(v) === Object.prototype) {
                            detectAssets(v);
                        }
                    }
                }(enchant));

                this.currentScene = null;
                this.rootScene = new enchant.Scene();
                this.pushScene(this.rootScene);
                this.loadingScene = new enchant.LoadingScene();

                this._activated = false;
                this._offsetX = 0;
                this._offsetY = 0;

                this.input = {};
                this.keyboardInputManager = new enchant.KeyboardInputManager(document, this.input);
                this.keyboardInputManager.addBroadcastTarget(this);
                this._keybind = this.keyboardInputManager._binds;

                if (!enchant.ENV.KEY_BIND_TABLE) enchant.ENV.KEY_BIND_TABLE = {};
                for (var key in enchant.ENV.KEY_BIND_TABLE) {
                    if (enchant.ENV.KEY_BIND_TABLE.hasOwnProperty(key)) {
                        this.keybind(key, enchant.ENV.KEY_BIND_TABLE[key]);
                    }
                }

                if (initial) {
                    this._setupStageEvents(stage);
                }
            },

            _setupStageEvents: function (stage) {
                var core = this;

                document.addEventListener('keydown', function (e) {
                    core.dispatchEvent(new enchant.Event('keydown'));
                    if (enchant.ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(e.keyCode) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);

                var shouldHandle = function (e) {
                    var tag = (e.target.tagName || '').toLowerCase();
                    return enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tag) === -1;
                };

                var preventIfNeeded = function (e) {
                    if (!shouldHandle(e)) return false;
                    e.preventDefault();
                    if (!core.running) e.stopPropagation();
                    return true;
                };

                // Touch events
                if (enchant.ENV.TOUCH_ENABLED) {
                    ['touchstart', 'touchmove', 'touchend'].forEach(function (type) {
                        stage.addEventListener(type, function (e) {
                            preventIfNeeded(e);
                        }, true);
                    });
                }

                // Mouse events
                ['mousedown', 'mousemove', 'mouseup'].forEach(function (type) {
                    stage.addEventListener(type, function (e) {
                        if (!preventIfNeeded(e)) return;
                        if (type === 'mousedown') core._mousedownID++;
                    }, true);
                });

                core._touchEventTarget = {};

                // Touch → Scene dispatch
                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function (e) {
                        var touches = e.changedTouches;
                        var evt = new enchant.Event(enchant.Event.TOUCH_START);
                        var i, touch, target;

                        for (i = 0; i < touches.length; i++) {
                            touch = touches[i];
                            evt._initPosition(touch.pageX, touch.pageY);
                            target = core.currentScene._determineEventTarget(evt);
                            core._touchEventTarget[touch.identifier] = target;
                            target.dispatchEvent(evt);
                        }
                    }, false);

                    stage.addEventListener('touchmove', function (e) {
                        var touches = e.changedTouches;
                        var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                        var i, touch, target;

                        for (i = 0; i < touches.length; i++) {
                            touch = touches[i];
                            target = core._touchEventTarget[touch.identifier];
                            if (target) {
                                evt._initPosition(touch.pageX, touch.pageY);
                                target.dispatchEvent(evt);
                            }
                        }
                    }, false);

                    stage.addEventListener('touchend', function (e) {
                        var touches = e.changedTouches;
                        var evt = new enchant.Event(enchant.Event.TOUCH_END);
                        var i, touch, target;

                        for (i = 0; i < touches.length; i++) {
                            touch = touches[i];
                            target = core._touchEventTarget[touch.identifier];
                            if (target) {
                                evt._initPosition(touch.pageX, touch.pageY);
                                target.dispatchEvent(evt);
                                delete core._touchEventTarget[touch.identifier];
                            }
                        }
                    }, false);
                }

                // Mouse → Scene dispatch
                stage.addEventListener('mousedown', function (e) {
                    var evt = new enchant.Event(enchant.Event.TOUCH_START);
                    evt._initPosition(e.pageX, e.pageY);
                    var target = core.currentScene._determineEventTarget(evt);
                    core._touchEventTarget[core._mousedownID] = target;
                    target.dispatchEvent(evt);
                }, false);

                stage.addEventListener('mousemove', function (e) {
                    var target = core._touchEventTarget[core._mousedownID];
                    if (!target) return;
                    var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                    evt._initPosition(e.pageX, e.pageY);
                    target.dispatchEvent(evt);
                }, false);

                stage.addEventListener('mouseup', function (e) {
                    var target = core._touchEventTarget[core._mousedownID];
                    if (!target) return;
                    var evt = new enchant.Event(enchant.Event.TOUCH_END);
                    evt._initPosition(e.pageX, e.pageY);
                    target.dispatchEvent(evt);
                    delete core._touchEventTarget[core._mousedownID];
                }, false);
            },
            /* ============================
            *  Core Properties
            * ============================ */

            width: {
                get: function () { return this._width; },
                set: function (w) { this._width = w; this._dispatchCoreResizeEvent(); }
            },

            height: {
                get: function () { return this._height; },
                set: function (h) { this._height = h; this._dispatchCoreResizeEvent(); }
            },

            scale: {
                get: function () { return this._scale; },
                set: function (s) { this._scale = s; this._dispatchCoreResizeEvent(); }
            },

            _dispatchCoreResizeEvent: function () {
                var e = new enchant.Event('coreresize');
                e.width = this._width;
                e.height = this._height;
                e.scale = this._scale;
                this.dispatchEvent(e);
            },

            _oncoreresize: function (e) {
                this._element.style.width = Math.floor(this._width * this._scale) + 'px';
                this._element.style.height = Math.floor(this._height * this._scale) + 'px';

                for (var i = 0; i < this._scenes.length; i++) {
                    this._scenes[i].dispatchEvent(e);
                }
            },

            /* ============================
            *  Preload / Load
            * ============================ */

            preload: function (assets) {
                var a;

                if (!Array.isArray(assets)) {
                    if (assets && typeof assets === 'object') {
                        a = [];
                        for (var name in assets) {
                            if (assets.hasOwnProperty(name)) {
                                a.push([assets[name], name]);
                            }
                        }
                        assets = a;
                    } else {
                        assets = Array.prototype.slice.call(arguments);
                    }
                }

                Array.prototype.push.apply(this._assets, assets);
                return this;
            },

            load: function (src, alias, callback, onerror) {
                var assetName;

                if (typeof alias === 'string') {
                    assetName = alias;
                    callback = callback || function () {};
                    onerror = onerror || function () {};
                } else {
                    assetName = src;
                    var temp = callback;
                    callback = alias || function () {};
                    onerror = temp || function () {};
                }

                var ext = enchant.Core.findExt(src);

                return enchant.Deferred.next(function () {
                    var d = new enchant.Deferred();

                    var _callback = function (e) {
                        d.call(e);
                        callback.call(this, e);
                    };

                    var _onerror = function (e) {
                        d.fail(e);
                        onerror.call(this, e);
                    };

                    // 拡張子に応じたロード関数がある場合
                    if (enchant.Core._loadFuncs[ext]) {
                        enchant.Core.instance.assets[assetName] =
                            enchant.Core._loadFuncs[ext](src, ext, _callback, _onerror);
                    } else {
                        // XHR ロード（fetch に置き換え可能だが互換性のため残す）
                        var req = new XMLHttpRequest();
                        req.open('GET', src, true);

                        req.onreadystatechange = function () {
                            if (req.readyState !== 4) return;

                            if (req.status !== 200 && req.status !== 0) {
                                var ev = new enchant.Event('error');
                                ev.message = req.status + ': Cannot load asset: ' + src;
                                _onerror.call(enchant.Core.instance, ev);
                                return;
                            }

                            var type = req.getResponseHeader('Content-Type') || '';

                            if (type.indexOf('image') === 0) {
                                core.assets[assetName] = enchant.Surface.load(src, _callback, _onerror);
                            } else if (type.indexOf('audio') === 0) {
                                core.assets[assetName] = enchant.Sound.load(src, type, _callback, _onerror);
                            } else {
                                core.assets[assetName] = req.responseText;
                                _callback.call(enchant.Core.instance, new enchant.Event('load'));
                            }
                        };

                        req.send(null);
                    }

                    return d;
                });
            },

            _requestPreload: function () {
                var o = {};
                var loaded = 0;
                var len = 0;
                var core = this;

                var loadFunc = function () {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = len;
                    core.loadingScene.dispatchEvent(e);
                };

                this._assets.reverse().forEach(function (asset) {
                    var src, name;

                    if (asset instanceof Array) {
                        src = asset[0];
                        name = asset[1];
                    } else {
                        src = name = asset;
                    }

                    if (!o[name]) {
                        o[name] = this.load(src, name, loadFunc);
                        len++;
                    }
                }, this);

                this.pushScene(this.loadingScene);
                return enchant.Deferred.parallel(o);
            },
            /* ============================
            *  Start / Main Loop
            * ============================ */

            start: function (deferred) {
                var self = this;

                var onloadTimeSetter = function () {
                    self.frame = 0;
                    self.removeEventListener('load', onloadTimeSetter);
                };
                this.addEventListener('load', onloadTimeSetter);

                this.currentTime = window.getTime();
                this.running = true;
                this.ready = true;

                // Touch-to-start (iOS Safari 対策)
                if (!this._activated) {
                    this._activated = true;

                    if (enchant.ENV.BROWSER === 'mobilesafari' &&
                        enchant.ENV.USE_WEBAUDIO &&
                        enchant.ENV.USE_TOUCH_TO_START_SCENE) {

                        var d = new enchant.Deferred();
                        var scene = this._createTouchToStartScene();

                        scene.addEventListener(enchant.Event.TOUCH_START, function waitTouch() {
                            scene.removeEventListener(enchant.Event.TOUCH_START, waitTouch);

                            var a = new enchant.WebAudioSound();
                            a.buffer = enchant.WebAudioSound.audioContext.createBuffer(1, 1, 48000);
                            a.play();

                            core.removeScene(scene);
                            core.start(d);
                        });

                        core.pushScene(scene);
                        return d;
                    }
                }

                this._requestNextFrame(0);

                var ret = this._requestPreload()
                    .next(function () {
                        enchant.Core.instance.loadingScene.dispatchEvent(
                            new enchant.Event(enchant.Event.LOAD)
                        );
                    });

                if (deferred) {
                    ret.next(function (arg) { deferred.call(arg); })
                    .error(function (arg) { deferred.fail(arg); });
                }

                return ret;
            },

            debug: function() {
                this._debug = true;
                return this.start();
            },
            
            _requestNextFrame: function (delay) {
                if (!this.ready) return;

                var self = this;

                if (this.fps >= 60 || delay <= 16) {
                    this._calledTime = window.getTime();
                    window.requestAnimationFrame(this._callTick);
                } else {
                    setTimeout(function () {
                        var core = enchant.Core.instance;
                        core._calledTime = window.getTime();
                        window.requestAnimationFrame(core._callTick);
                    }, Math.max(0, delay));
                }
            },

            _callTick: function (time) {
                enchant.Core.instance._tick(time);
            },

            /* ============================
            *  Tick (Main Loop)
            * ============================ */

            _tick: function (time) {
                var now = window.getTime();
                var elapsed = now - this.currentTime;
                this.currentTime = now;

                this._actualFps = elapsed > 0 ? (1000 / elapsed) : 0;

                var e = new enchant.Event('enterframe');
                e.elapsed = elapsed;

                var nodes = this.currentScene.childNodes.slice();
                var push = Array.prototype.push;

                while (nodes.length) {
                    var node = nodes.pop();

                    // 時間ベースの age 管理
                    node.elapsedTime = (node.elapsedTime || 0) + elapsed;
                    node.dispatchEvent(e);

                    if (node.childNodes && node.childNodes.length) {
                        push.apply(nodes, node.childNodes);
                    }
                }

                this.currentScene.age += elapsed;
                this.currentScene.dispatchEvent(e);
                this.dispatchEvent(e);

                this.dispatchEvent(new enchant.Event('exitframe'));
                this.frame++;

                var nextFrameDelay = Math.max(
                    0,
                    1000 / this.fps - (window.getTime() - this._calledTime)
                );

                this._requestNextFrame(nextFrameDelay);
            },

            getTime: function () {
                return window.getTime();
            },

            /* ============================
            *  Stop / Pause / Resume
            * ============================ */

            stop: function () {
                this.ready = false;
                this.running = false;
            },

            pause: function () {
                this.ready = false;
            },

            resume: function () {
                if (this.ready) return;

                this.currentTime = window.getTime();
                this.ready = true;
                this.running = true;
                this._requestNextFrame(0);
            },

            /* ============================
            *  Scene Stack Management
            * ============================ */

            pushScene: function (scene) {
                this._element.appendChild(scene._element);

                if (this.currentScene) {
                    this.currentScene.dispatchEvent(new enchant.Event('exit'));
                }

                this.currentScene = scene;
                this.currentScene.dispatchEvent(new enchant.Event('enter'));

                return this._scenes.push(scene);
            },

            popScene: function () {
                if (this.currentScene === this.rootScene) {
                    return this.currentScene;
                }

                this._element.removeChild(this.currentScene._element);
                this.currentScene.dispatchEvent(new enchant.Event('exit'));

                this.currentScene = this._scenes[this._scenes.length - 2];
                this.currentScene.dispatchEvent(new enchant.Event('enter'));

                return this._scenes.pop();
            },

            replaceScene: function (scene) {
                this.popScene();
                return this.pushScene(scene);
            },

            removeScene: function (scene) {
                if (this.currentScene === scene) {
                    return this.popScene();
                }

                var i = this._scenes.indexOf(scene);
                if (i !== -1) {
                    this._scenes.splice(i, 1);
                    this._element.removeChild(scene._element);
                    return scene;
                }

                return null;
            },

            /* ============================
            *  Input / Keybind
            * ============================ */

            _buttonListener: function (e) {
                this.currentScene.dispatchEvent(e);
            },

            keybind: function (key, button) {
                this.keyboardInputManager.keybind(key, button);
                this.addEventListener(button + 'buttondown', this._buttonListener);
                this.addEventListener(button + 'buttonup', this._buttonListener);
                return this;
            },

            keyunbind: function (key) {
                var button = this._keybind[key];
                this.keyboardInputManager.keyunbind(key);
                this.removeEventListener(button + 'buttondown', this._buttonListener);
                this.removeEventListener(button + 'buttonup', this._buttonListener);
                return this;
            },

            changeButtonState: function (button, bool) {
                this.keyboardInputManager.changeState(button, bool);
            },

            /* ============================
            *  Utility
            * ============================ */

            getElapsedTime: function () {
                return this.frame / this.fps;
            }
        });

    
        // ============================
        //  Optimized _loadFuncs
        // ============================

        enchant.Core._loadFuncs = {};

        // Image extensions
        ['jpg', 'jpeg', 'gif', 'png', 'bmp'].forEach(function (ext) {
            enchant.Core._loadFuncs[ext] = function (src, ext, callback, onerror) {
                return enchant.Surface.load(src, callback, onerror);
            };
        });

        // Audio extensions
        ['mp3', 'aac', 'm4a', 'wav', 'ogg'].forEach(function (ext) {
            enchant.Core._loadFuncs[ext] = function (src, ext, callback, onerror) {
                return enchant.Sound.load(src, 'audio/' + ext, callback, onerror);
            };
        });

        // ============================
        //  Optimized findExt
        // ============================

        enchant.Core.findExt = function (path) {
            // Fast path: normal file extension
            var idx = path.lastIndexOf('.');
            if (idx !== -1 && idx < path.length - 1) {
                return path.substring(idx + 1).toLowerCase();
            }

            // Data URI
            if (path.indexOf('data:') === 0) {
                // "data:image/png;base64,..." → "png"
                var slash = path.indexOf('/');
                var semi = path.indexOf(';');
                if (slash !== -1 && semi !== -1 && semi > slash) {
                    return path.substring(slash + 1, semi).toLowerCase();
                }
            }

            return null;
        };

    
        /**
         * The current Core instance.
         * @type enchant.Core
         * @static
         */
        enchant.Core.instance = null;
    }());
    
    /**
     * @name enchant.Game
     * @class
     * enchant.Game is moved to {@link enchant.Core} from v0.6
     * @deprecated
     */
    enchant.Game = enchant.Core;
    
    /**
     * @scope enchant.InputManager.prototype
     */
    enchant.InputManager = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.InputManager
         * @class
         * Class for managing input.
         * @param {*} valueStore object that store input state.
         * @param {*} [source=this] source that will be added to event object.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(valueStore, source) {
            enchant.EventTarget.call(this);
    
            /**
             * Array that store event target.
             * @type enchant.EventTarget[]
             */
            this.broadcastTarget = [];
            /**
             * Object that store input state.
             * @type Object
             */
            this.valueStore = valueStore;
            /**
             * source that will be added to event object.
             * @type Object
             */
            this.source = source || this;
    
            this._binds = {};
    
            this._stateHandler = function(e) {
                var id = e.source.identifier;
                var name = this._binds[id];
                this.changeState(name, e.data);
            }.bind(this);
        },
        /**
         * Name specified input.
         * Input can be watched by flag or event.
         * @param {enchant.InputSource} inputSource input source.
         * @param {String} name input name.
         */
        bind: function(inputSource, name) {
            inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
            this._binds[inputSource.identifier] = name;
        },
        /**
         * Remove binded name.
         * @param {enchant.InputSource} inputSource input source.
         */
        unbind: function(inputSource) {
            inputSource.removeEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
            delete this._binds[inputSource.identifier];
        },
        /**
         * Add event target.
         * @param {enchant.EventTarget} eventTarget broadcast target.
         */
        addBroadcastTarget: function(eventTarget) {
            var i = this.broadcastTarget.indexOf(eventTarget);
            if (i === -1) {
                this.broadcastTarget.push(eventTarget);
            }
        },
        /**
         * Remove event target.
         * @param {enchant.EventTarget} eventTarget broadcast target.
         */
        removeBroadcastTarget: function(eventTarget) {
            var i = this.broadcastTarget.indexOf(eventTarget);
            if (i !== -1) {
                this.broadcastTarget.splice(i, 1);
            }
        },
        /**
         * Dispatch event to {@link enchant.InputManager#broadcastTarget}.
         * @param {enchant.Event} e event.
         */
        broadcastEvent: function(e) {
            var target = this.broadcastTarget;
            for (var i = 0, l = target.length; i < l; i++) {
                target[i].dispatchEvent(e);
            }
        },
        /**
         * Change state of input.
         * @param {String} name input name.
         * @param {*} data input state.
         */
        changeState: function(name, data) {
        }
    });
    
    /**
     * @scope enchant.InputSource.prototype
     */
    enchant.InputSource = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.InputSource
         * @class
         * Class that wrap input.
         * @param {String} identifier identifier of InputSource.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(identifier) {
            enchant.EventTarget.call(this);
            /**
             * identifier of InputSource.
             * @type String
             */
            this.identifier = identifier;
        },
        /**
         * Notify state change by event.
         * @param {*} data state.
         */
        notifyStateChange: function(data) {
            var e = new enchant.Event(enchant.Event.INPUT_STATE_CHANGED);
            e.data = data;
            e.source = this;
            this.dispatchEvent(e);
        }
    });
    
    /**
     * @scope enchant.BinaryInputManager.prototype
     */
    enchant.BinaryInputManager = enchant.Class.create(enchant.InputManager, {
        /**
         * @name enchant.BinaryInputManager
         * @class
         * Class for managing input.
         * @param {*} flagStore object that store input flag.
         * @param {String} activeEventNameSuffix event name suffix.
         * @param {String} inactiveEventNameSuffix event name suffix.
         * @param {*} [source=this] source that will be added to event object.
         * @constructs
         * @extends enchant.InputManager
         */
        initialize: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
            enchant.InputManager.call(this, flagStore, source);
            /**
             * The number of active inputs.
             * @type Number
             */
            this.activeInputsNum = 0;
            /**
             * event name suffix that dispatched by BinaryInputManager.
             * @type String
             */
            this.activeEventNameSuffix = activeEventNameSuffix;
            /**
             * event name suffix that dispatched by BinaryInputManager.
             * @type String
             */
            this.inactiveEventNameSuffix = inactiveEventNameSuffix;
        },
        /**
         * Name specified input.
         * @param {enchant.BinaryInputSource} inputSource input source.
         * @param {String} name input name.
         * @see enchant.InputManager#bind
         */
        bind: function(binaryInputSource, name) {
            enchant.InputManager.prototype.bind.call(this, binaryInputSource, name);
            this.valueStore[name] = false;
        },
        /**
         * Remove binded name.
         * @param {enchant.BinaryInputSource} inputSource input source.
         * @see enchant.InputManager#unbind
         */
        unbind: function(binaryInputSource) {
            var name = this._binds[binaryInputSource.identifier];
            enchant.InputManager.prototype.unbind.call(this, binaryInputSource);
            delete this.valueStore[name];
        },
        /**
         * Change state of input.
         * @param {String} name input name.
         * @param {Boolean} bool input state.
         */
        changeState: function(name, bool) {
            if (bool) {
                this._down(name);
            } else {
                this._up(name);
            }
        },
        _down: function(name) {
            var inputEvent;
            if (!this.valueStore[name]) {
                this.valueStore[name] = true;
                inputEvent = new enchant.Event((this.activeInputsNum++) ? 'inputchange' : 'inputstart');
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }
            var downEvent = new enchant.Event(name + this.activeEventNameSuffix);
            downEvent.source = this.source;
            this.broadcastEvent(downEvent);
        },
        _up: function(name) {
            var inputEvent;
            if (this.valueStore[name]) {
                this.valueStore[name] = false;
                inputEvent = new enchant.Event((--this.activeInputsNum) ? 'inputchange' : 'inputend');
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }
            var upEvent = new enchant.Event(name + this.inactiveEventNameSuffix);
            upEvent.source = this.source;
            this.broadcastEvent(upEvent);
        }
    });
    
    /**
     * @scope enchant.BinaryInputSource.prototype
     */
    enchant.BinaryInputSource = enchant.Class.create(enchant.InputSource, {
        /**
         * @name enchant.BinaryInputSource
         * @class
         * Class that wrap binary input.
         * @param {String} identifier identifier of BinaryInputSource.
         * @constructs
         * @extends enchant.InputSource
         */
        initialize: function(identifier) {
            enchant.InputSource.call(this, identifier);
        }
    });
    
    /**
     * @scope enchant.KeyboardInputManager.prototype
     */
    enchant.KeyboardInputManager = enchant.Class.create(enchant.BinaryInputManager, {
        /**
         * @name enchant.KeyboardInputManager
         * @class
         * Class that manage keyboard input.
         * @param {HTMLElement} dom element that will be watched.
         * @param {*} flagStore object that store input flag.
         * @constructs
         * @extends enchant.BinaryInputManager
         */
        initialize: function(domElement, flagStore) {
            enchant.BinaryInputManager.call(this, flagStore, 'buttondown', 'buttonup');
            this._attachDOMEvent(domElement, 'keydown', true);
            this._attachDOMEvent(domElement, 'keyup', false);
        },
        /**
         * Call {@link enchant.BinaryInputManager#bind} with BinaryInputSource equivalent of key code.
         * @param {Number} keyCode key code.
         * @param {String} name input name.
         */
        keybind: function(keyCode, name) {
            this.bind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode), name);
        },
        /**
         * Call {@link enchant.BinaryInputManager#unbind} with BinaryInputSource equivalent of key code.
         * @param {Number} keyCode key code.
         */
        keyunbind: function(keyCode) {
            this.unbind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode));
        },
        _attachDOMEvent: function(domElement, eventType, state) {
            domElement.addEventListener(eventType, function(e) {
                var core = enchant.Core.instance;
                if (!core || !core.running) {
                    return;
                }
                var code = e.keyCode;
                var source = enchant.KeyboardInputSource._instances[code];
                if (source) {
                    source.notifyStateChange(state);
                }
            }, true);
        }
    });
    
    /**
     * @scope enchant.KeyboardInputSource.prototype
     */
    enchant.KeyboardInputSource = enchant.Class.create(enchant.BinaryInputSource, {
        /**
         * @name enchant.KeyboardInputSource
         * @class
         * @param {String} keyCode key code of BinaryInputSource.
         * @constructs
         * @extends enchant.BinaryInputSource
         */
        initialize: function(keyCode) {
            enchant.BinaryInputSource.call(this, keyCode);
        }
    });
    /**
     * @private
     */
    enchant.KeyboardInputSource._instances = {};
    /**
     * @static
     * Get the instance by key code.
     * @param {Number} keyCode key code.
     * @return {enchant.KeyboardInputSource} instance.
     */
    enchant.KeyboardInputSource.getByKeyCode = function(keyCode) {
        if (!this._instances[keyCode]) {
            this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
        }
        return this._instances[keyCode];
    };
    
    enchant.Node = enchant.Class.create(enchant.EventTarget, {

        initialize: function () {
            enchant.EventTarget.call(this);

            this._dirty = false;

            // transform 行列
            this._matrix = [1, 0, 0, 1, 0, 0];

            this._x = 0;
            this._y = 0;
            this._offsetX = 0;
            this._offsetY = 0;

            // ★ 元仕様どおり「未設定＝null」
            this._originX = null;
            this._originY = null;

            this.age = 0;

            this.parentNode = null;
            this.scene = null;

            // 共有バブル関数
            this.addEventListener('touchstart', enchant.Node._bubble);
            this.addEventListener('touchmove', enchant.Node._bubble);
            this.addEventListener('touchend', enchant.Node._bubble);

            if (enchant.ENV.USE_ANIMATION) {
                this.tl = new enchant.Timeline(this);
            }
        },

        moveTo: function (x, y) {
            this.x = x;
            this.y = y;
        },

        moveBy: function (x, y) {
            this.x += x;
            this.y += y;
        },

        x: {
            get: function () { return this._x; },
            set: function (x) {
                if (this._x !== x) {
                    this._x = x;
                    // ★ 自分だけ dirty（これが安定）
                    this._dirty = true;
                }
            }
        },

        y: {
            get: function () { return this._y; },
            set: function (y) {
                if (this._y !== y) {
                    this._y = y;
                    this._dirty = true;
                }
            }
        },

        originX: {
            get: function () { return this._originX; },
            set: function (v) {
                if (this._originX !== v) {
                    this._originX = v;
                    this._dirty = true;
                }
            }
        },

        originY: {
            get: function () { return this._originY; },
            set: function (v) {
                if (this._originY !== v) {
                    this._originY = v;
                    this._dirty = true;
                }
            }
        },

        /* ============================
        *  最適化版 _updateCoordinate
        * ============================ */
        _updateCoordinate: function () {
            var node = this;
            var tree = [];

            // 親方向へ dirty が続く限り辿る
            while (node) {
                tree.push(node);
                if (!node._dirty) break;
                node = node.parentNode;
            }

            if (tree.length === 0) {
                return;
            }

            // ルートから順に行列を更新
            tree.reverse();

            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;

            // ルートの行列を push
            var base = tree[0]._matrix;
            stack.push(base);

            var parentMat;
            var newMat = [1, 0, 0, 1, 0, 0]; // 再利用
            var ox, oy;
            var vec = [0, 0];

            for (var i = 1; i < tree.length; i++) {
                node = tree[i];

                parentMat = stack[stack.length - 1];

                // node のローカル行列を newMat に生成
                matrix.makeTransformMatrix(node, newMat);

                // 親行列 × ローカル行列 → node._matrix
                matrix.multiply(parentMat, newMat, newMat);
                node._matrix = newMat;

                stack.push(newMat);

                // ★ 元仕様どおり：未設定なら width/2, height/2
                ox = (node._originX != null) ? node._originX : (node._width  >> 1) || 0;
                oy = (node._originY != null) ? node._originY : (node._height >> 1) || 0;

                vec[0] = ox;
                vec[1] = oy;

                matrix.multiplyVec(newMat, vec, vec);

                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;

                node._dirty = false;
            }

            matrix.reset();
        },

        remove: function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }

            if (this.childNodes && this.childNodes.length) {
                var children = this.childNodes;
                for (var i = children.length - 1; i >= 0; i--) {
                    if (children[i] && typeof children[i].remove === 'function') {
                        children[i].remove();
                    }
                }
            }

            this.clearEventListener();
        }
    });

    // 共有バブル関数
    enchant.Node._bubble = function (e) {
        if (this.parentNode) {
            this.parentNode.dispatchEvent(e);
        }
    };



    
    var _intersectBetweenClassAndInstance = function(Class, instance) {
        var ret = [];
        var c;
        for (var i = 0, l = Class.collection.length; i < l; i++) {
            c = Class.collection[i];
            if (instance._intersectOne(c)) {
                ret.push(c);
            }
        }
        return ret;
    };
    
    var _intersectBetweenClassAndClass = function(Class1, Class2) {
        var ret = [];
        var c1, c2;
        for (var i = 0, l = Class1.collection.length; i < l; i++) {
            c1 = Class1.collection[i];
            for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
                c2 = Class2.collection[j];
                if (c1._intersectOne(c2)) {
                    ret.push([ c1, c2 ]);
                }
            }
        }
        return ret;
    };
    
    var _intersectStrictBetweenClassAndInstance = function(Class, instance) {
        var ret = [];
        var c;
        for (var i = 0, l = Class.collection.length; i < l; i++) {
            c = Class.collection[i];
            if (instance._intersectStrictOne(c)) {
                ret.push(c);
            }
        }
        return ret;
    };

    var _withinBetweenClassAndInstance = function(Class, instance, distance) {
        var ret = [];
        var c;
        for (var i = 0, l = Class.collection.length; i < l; i++) {
            c = Class.collection[i];
            if (instance.within(Class, distance)){
                ret.push(c);
            }
        }
        return ret;
    };
    
    var _intersectStrictBetweenClassAndClass = function(Class1, Class2) {
        var ret = [];
        var c1, c2;
        for (var i = 0, l = Class1.collection.length; i < l; i++) {
            c1 = Class1.collection[i];
            for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
                c2 = Class2.collection[j];
                if (c1._intersectStrictOne(c2)) {
                    ret.push([ c1, c2 ]);
                }
            }
        }
        return ret;
    };
    
    var _staticIntersect = function(other) {
        if (other instanceof enchant.Entity) {
            return _intersectBetweenClassAndInstance(this, other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectBetweenClassAndClass(this, other);
        }
        return false;
    };
    
    var _staticIntersectStrict = function(other) {
        if (other instanceof enchant.Entity) {
            return _intersectStrictBetweenClassAndInstance(this, other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectStrictBetweenClassAndClass(this, other);
        }
        return false;
    };
    
    var _nodePrototypeClearEventListener = enchant.Node.prototype.clearEventListener;
    
    /**
     * @scope enchant.Entity.prototype
     */
    enchant.Entity = enchant.Class.create(enchant.Node, {

        initialize: function () {
            enchant.Node.call(this);

            var core = enchant.Core.instance;

            // Transform properties
            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;

            // Interaction / rendering flags
            this._touchEnabled = true;
            this._clipping = false;

            // Origin (null = auto center)
            this._originX = null;
            this._originY = null;

            // Size / appearance
            this._width = 0;
            this._height = 0;
            this._backgroundColor = null;
            this._debugColor = '#0000ff';
            this._strokeColor = '#0000ff';
            this._opacity = 1;
            this._visible = true;

            // Button mode
            this._buttonMode = null;
            this.buttonMode = null;
            this.buttonPressed = false;

            // Style cache
            this._style = {};
            this.__styleStatus = {};

            // Collision collection flag
            this._isContainedInCollection = false;

            // Composite operation
            this.compositeOperation = null;

            // --- 最適化：buttonMode 用のイベントを共通化 ---
            var self = this;

            var handleButton = function (isDown) {
                if (!self.buttonMode) return;

                self.buttonPressed = isDown;

                var evtName = self.buttonMode + (isDown ? 'buttondown' : 'buttonup');
                self.dispatchEvent(new enchant.Event(evtName));

                core.changeButtonState(self.buttonMode, isDown);
            };

            this.addEventListener('touchstart', function () {
                handleButton(true);
            });

            this.addEventListener('touchend', function () {
                handleButton(false);
            });

            // 衝突判定コレクションに登録
            this.enableCollection();
        },

        /* ============================
        *  Size / Appearance
        * ============================ */

        width: {
            get: function () { return this._width; },
            set: function (w) {
                if (this._width !== w) {
                    this._width = w;
                    this._dirty = true;
                }
            }
        },

        height: {
            get: function () { return this._height; },
            set: function (h) {
                if (this._height !== h) {
                    this._height = h;
                    this._dirty = true;
                }
            }
        },

        backgroundColor: {
            get: function () { return this._backgroundColor; },
            set: function (c) { this._backgroundColor = c; }
        },

        debugColor: {
            get: function () { return this._debugColor; },
            set: function (c) { this._debugColor = c; }
        },

        opacity: {
            get: function () { return this._opacity; },
            set: function (o) { this._opacity = +o; }
        },

        visible: {
            get: function () { return this._visible; },
            set: function (v) { this._visible = !!v; }
        },

        touchEnabled: {
            get: function () { return this._touchEnabled; },
            set: function (enabled) {
                this._touchEnabled = enabled;
                this._style.pointerEvents = enabled ? 'all' : 'none';
            }
        },

        /* ============================
        *  Collision Detection
        * ============================ */

        intersect: function (other) {
            if (other instanceof enchant.Entity) {
                return this._intersectOne(other);
            }
            if (typeof other === 'function' && other.collection) {
                return _intersectBetweenClassAndInstance(other, this);
            }
            return false;
        },

        _intersectOne: function (other) {
            if (this._dirty) this._updateCoordinate();
            if (other._dirty) other._updateCoordinate();

            var ax = this._offsetX, ay = this._offsetY;
            var bx = other._offsetX, by = other._offsetY;

            return (
                ax < bx + other.width &&
                bx < ax + this.width &&
                ay < by + other.height &&
                by < ay + this.height
            );
        },

        intersectStrict: function (other) {
            if (other instanceof enchant.Entity) {
                return this._intersectStrictOne(other);
            }
            if (typeof other === 'function' && other.collection) {
                return _intersectStrictBetweenClassAndInstance(other, this);
            }
            return false;
        },

        _intersectStrictOne: function (other) {
            if (this._dirty) this._updateCoordinate();
            if (other._dirty) other._updateCoordinate();

            var rect1 = this.getOrientedBoundingRect();
            var rect2 = other.getOrientedBoundingRect();

            var lt1 = rect1.leftTop,    rt1 = rect1.rightTop,
                lb1 = rect1.leftBottom, rb1 = rect1.rightBottom;

            var lt2 = rect2.leftTop,    rt2 = rect2.rightTop,
                lb2 = rect2.leftBottom, rb2 = rect2.rightBottom;

            // 4 辺の方向ベクトル（SAT 用）
            var t1 = [rt1[0] - lt1[0], rt1[1] - lt1[1]];
            var r1 = [rb1[0] - rt1[0], rb1[1] - rt1[1]];
            var b1 = [lb1[0] - rb1[0], lb1[1] - rb1[1]];
            var l1 = [lt1[0] - lb1[0], lt1[1] - lb1[1]];

            var t2 = [rt2[0] - lt2[0], rt2[1] - lt2[1]];
            var r2 = [rb2[0] - rt2[0], rb2[1] - rt2[1]];
            var b2 = [lb2[0] - rb2[0], lb2[1] - rb2[1]];
            var l2 = [lt2[0] - lb2[0], lt2[1] - lb2[1]];

            // 中心点
            var cx1 = (lt1[0] + rt1[0] + lb1[0] + rb1[0]) >> 2;
            var cy1 = (lt1[1] + rt1[1] + lb1[1] + rb1[1]) >> 2;
            var cx2 = (lt2[0] + rt2[0] + lb2[0] + rb2[0]) >> 2;
            var cy2 = (lt2[1] + rt2[1] + lb2[1] + rb2[1]) >> 2;

            // SAT の高速チェック
            if (
                t1[0] * (cy2 - lt1[1]) - t1[1] * (cx2 - lt1[0]) > 0 &&
                r1[0] * (cy2 - rt1[1]) - r1[1] * (cx2 - rt1[0]) > 0 &&
                b1[0] * (cy2 - rb1[1]) - b1[1] * (cx2 - rb1[0]) > 0 &&
                l1[0] * (cy2 - lb1[1]) - l1[1] * (cx2 - lb1[0]) > 0
            ) return true;

            if (
                t2[0] * (cy1 - lt2[1]) - t2[1] * (cx1 - lt2[0]) > 0 &&
                r2[0] * (cy1 - rt2[1]) - r2[1] * (cx1 - rt2[0]) > 0 &&
                b2[0] * (cy1 - rb2[1]) - b2[1] * (cx1 - rb2[0]) > 0 &&
                l2[0] * (cy1 - lb2[1]) - l2[1] * (cx1 - lb2[0]) > 0
            ) return true;

            // 辺同士の交差判定（最適化版）
            var poss1 = [lt1, rt1, rb1, lb1];
            var poss2 = [lt2, rt2, rb2, lb2];
            var dirs1 = [t1, r1, b1, l1];
            var dirs2 = [t2, r2, b2, l2];

            var i, j, p1, p2, d1, d2, c, vx, vy, c1, c2;

            for (i = 0; i < 4; i++) {
                p1 = poss1[i];
                d1 = dirs1[i];

                for (j = 0; j < 4; j++) {
                    p2 = poss2[j];
                    d2 = dirs2[j];

                    c = d1[0] * d2[1] - d1[1] * d2[0];
                    if (c !== 0) {
                        vx = p2[0] - p1[0];
                        vy = p2[1] - p1[1];

                        c1 = (vx * d1[1] - vy * d1[0]) / c;
                        c2 = (vx * d2[1] - vy * d2[0]) / c;

                        if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        /* ============================
        *  Distance-based Collision
        * ============================ */

        within: function (other, distance) {
            if (this._dirty) this._updateCoordinate();
            if (other._dirty) other._updateCoordinate();

            if (distance == null) {
                distance = (this.width + this.height + other.width + other.height) * 0.25;
            }

            var dx = this._offsetX - other._offsetX + (this.width - other.width) * 0.5;
            var dy = this._offsetY - other._offsetY + (this.height - other.height) * 0.5;

            return dx * dx + dy * dy < distance * distance;
        },

        withinStrict: function (other, distance) {
            if (other instanceof enchant.Entity) {
                return this.within(other, distance);
            }
            if (typeof other === 'function' && other.collection) {
                return _withinBetweenClassAndInstance(other, this, distance);
            }
            return false;
        },

        /* ============================
        *  Transform Operations
        * ============================ */

        scale: function (x, y) {
            this._scaleX *= x;
            this._scaleY *= (y !== undefined ? y : x);
            this._dirty = true;
        },

        rotate: function (deg) {
            this.rotation = this._rotation + deg;
        },

        scaleX: {
            get: function () { return this._scaleX; },
            set: function (v) {
                if (this._scaleX !== v) {
                    this._scaleX = v;
                    this._dirty = true;
                }
            }
        },

        scaleY: {
            get: function () { return this._scaleY; },
            set: function (v) {
                if (this._scaleY !== v) {
                    this._scaleY = v;
                    this._dirty = true;
                }
            }
        },

        rotation: {
            get: function () { return this._rotation; },
            set: function (v) {
                if (this._rotation !== v) {

                    // 高速な角度正規化
                    v %= 360;
                    if (v < 0) v += 360;

                    // 小数点2桁に丸め（高速版）
                    this._rotation = (v * 100 | 0) / 100;

                    this._dirty = true;
                }
            }
        },

        originX: {
            get: function () { return this._originX; },
            set: function (v) {
                if (this._originX !== v) {
                    this._originX = v;
                    this._dirty = true;
                }
            }
        },

        originY: {
            get: function () { return this._originY; },
            set: function (v) {
                if (this._originY !== v) {
                    this._originY = v;
                    this._dirty = true;
                }
            }
        },

        /* ============================
        *  Collision Collection
        * ============================ */

        enableCollection: function () {
            this.addEventListener('addedtoscene', this._addSelfToCollection);
            this.addEventListener('removedfromscene', this._removeSelfFromCollection);

            if (this.scene) this._addSelfToCollection();
        },

        disableCollection: function () {
            this.removeEventListener('addedtoscene', this._addSelfToCollection);
            this.removeEventListener('removedfromscene', this._removeSelfFromCollection);

            if (this.scene) this._removeSelfFromCollection();
        },

        clearEventListener: function () {
            _nodePrototypeClearEventListener.apply(this, arguments);
            if (this.scene) this._removeSelfFromCollection();
        },

        _addSelfToCollection: function () {
            if (this._isContainedInCollection) return;

            var Ctor = this.getConstructor();
            var targets = Ctor._collectionTarget;

            for (var i = 0; i < targets.length; i++) {
                targets[i].collection.push(this);
            }

            this._isContainedInCollection = true;
        },

        _removeSelfFromCollection: function () {
            if (!this._isContainedInCollection) return;

            var Ctor = this.getConstructor();
            var targets = Ctor._collectionTarget;

            for (var i = 0; i < targets.length; i++) {
                var list = targets[i].collection;
                var idx = list.indexOf(this);
                if (idx !== -1) list.splice(idx, 1);
            }

            this._isContainedInCollection = false;
        },

        /* ============================
        *  Bounding Rectangles
        * ============================ */

        getBoundingRect: function () {
            var w = this.width  || 0;
            var h = this.height || 0;
            var m = this._matrix;

            var m11w = m[0] * w, m12w = m[1] * w;
            var m21h = m[2] * h, m22h = m[3] * h;
            var dx = m[4], dy = m[5];

            // 4 点の x, y をまとめて計算
            var xs = [dx, m11w + dx, m21h + dx, m11w + m21h + dx];
            var ys = [dy, m12w + dy, m22h + dy, m12w + m22h + dy];

            xs.sort();
            ys.sort();

            return {
                left: xs[0],
                top: ys[0],
                width: xs[3] - xs[0],
                height: ys[3] - ys[0]
            };
        },

        getOrientedBoundingRect: function () {
            var w = this.width  || 0;
            var h = this.height || 0;
            var m = this._matrix;

            var m11w = m[0] * w, m12w = m[1] * w;
            var m21h = m[2] * h, m22h = m[3] * h;
            var dx = m[4], dy = m[5];

            return {
                leftTop:     [dx, dy],
                rightTop:    [m11w + dx, m12w + dy],
                leftBottom:  [m21h + dx, m22h + dy],
                rightBottom: [m11w + m21h + dx, m12w + m22h + dy]
            };
        },

        getConstructor: function () {
            return Object.getPrototypeOf(this).constructor;
        }

    });
    
    var _collectizeConstructor = function (Ctor) {
        if (Ctor._collective) return;

        // Entity を継承している場合のみコレクション対象を構築
        if (Ctor.prototype instanceof enchant.Entity) {

            // Entity までの継承チェーンを構築（高速版）
            var chain = [];
            var proto = Ctor;

            while (proto && proto !== enchant.Entity) {
                chain.push(proto);
                proto = Object.getPrototypeOf(proto.prototype).constructor;
            }

            // 最後に Entity を追加
            chain.push(enchant.Entity);

            Ctor._collectionTarget = chain;

        } else {
            Ctor._collectionTarget = [];
        }

        // 静的メソッドを付与
        Ctor.intersect = _staticIntersect;
        Ctor.intersectStrict = _staticIntersectStrict;

        // コレクション配列
        Ctor.collection = [];

        Ctor._collective = true;
    };

    // Entity 自身を初期化
    _collectizeConstructor(enchant.Entity);

    // 継承時に自動でコレクション設定
    enchant.Entity._inherited = function (subclass) {
        _collectizeConstructor(subclass);
    };

    
    /**
     * @scope enchant.Sprite.prototype
     */
    enchant.Sprite = enchant.Class.create(enchant.Entity, {

        initialize: function (width, height) {
            enchant.Entity.call(this);

            this.width = width;
            this.height = height;

            this._image = null;
            this._debugColor = '#ff0000';

            this._frameLeft = 0;
            this._frameTop = 0;
            this._frame = 0;

            this._frameSequence = null;
            this.__frameSequence = null;
            this._originalFrameSequence = null;
        },

        /* ============================
        *  Image
        * ============================ */

        image: {
            get: function () { return this._image; },
            set: function (img) {
                if (img === undefined) {
                    throw new Error(
                        'Sprite.image に undefined が代入されました。' +
                        '画像パスや preload を確認してください。'
                    );
                }
                if (img === this._image) return;

                this._image = img;
                this._computeFramePosition();
            }
        },

        /* ============================
        *  Frame
        * ============================ */

        frame: {
            get: function () { return this._frame; },
            set: function (f) {

                // 同じフレーム or 同じ配列なら何もしない
                if ((this._frameSequence == null && this._frame === f) ||
                    this._deepCompareToPreviousFrame(f)) {
                    return;
                }

                if (Array.isArray(f)) {
                    this._frameSequence = f;
                } else {
                    this._frameSequence = null;
                    this._frame = f;
                    this._computeFramePosition();
                }
            }
        },

        _frameSequence: {
            get: function () { return this.__frameSequence; },
            set: function (seq) {

                var hadSeq = !!this.__frameSequence;

                if (seq && !hadSeq) {
                    this.addEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
                } else if (!seq && hadSeq) {
                    this.removeEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
                }

                if (seq) {
                    // slice を 1 回に削減
                    var copy = seq.slice();
                    this.__frameSequence = copy;
                    this._originalFrameSequence = copy.slice();
                    this._rotateFrameSequence();
                } else {
                    this.__frameSequence = null;
                    this._originalFrameSequence = null;
                }
            }
        },

        _deepCompareToPreviousFrame: function (arr) {
            var prev = this._originalFrameSequence;

            if (arr === prev) return true;
            if (!arr || !prev) return false;
            if (!Array.isArray(arr)) return false;
            if (arr.length !== prev.length) return false;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== prev[i]) return false;
            }
            return true;
        },

        /* ============================
        *  Frame Position
        * ============================ */

        _computeFramePosition: function () {
            var img = this._image;
            if (!img) return;

            var w = this._width;
            var h = this._height;

            var row = (img.width / w) | 0;

            var f = this._frame | 0;

            this._frameLeft = (f % row) * w;
            this._frameTop = ((f / row) | 0) * h % img.height;
        },

        _rotateFrameSequence: function () {
            var seq = this._frameSequence;
            if (!seq || seq.length === 0) return;

            var next = seq.shift();

            if (next === null) {
                this._frameSequence = null;
                this.dispatchEvent(new enchant.Event(enchant.Event.ANIMATION_END));
                return;
            }

            this._frame = next;
            this._computeFramePosition();
            seq.push(next);
        },

        /* ============================
        *  Width / Height override
        * ============================ */

        width: {
            get: function () { return this._width; },
            set: function (w) {
                this._width = w;
                this._computeFramePosition();
                this._dirty = true;
            }
        },

        height: {
            get: function () { return this._height; },
            set: function (h) {
                this._height = h;
                this._computeFramePosition();
                this._dirty = true;
            }
        },

        /* ============================
        *  Canvas Rendering
        * ============================ */

        cvsRender: function (ctx) {
            var img = this._image;
            var w = this._width, h = this._height;

            if (!img || w === 0 || h === 0) return;

            var iw = img.width;
            var ih = img.height;

            if (iw < w || ih < h) {
                ctx.fillStyle = enchant.Surface._getPattern(img);
                ctx.fillRect(0, 0, w, h);
                return;
            }

            var elem = img._element;
            var sx = this._frameLeft;
            var sy = this._frameTop;

            // IE9 対策
            var sw = Math.max(0.01, Math.min(iw - sx, w));
            var sh = Math.max(0.01, Math.min(ih - sy, h));

            ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h);
        },

        /* ============================
        *  DOM Rendering
        * ============================ */

        domRender: function () {
            var img = this._image;
            if (!img) return;

            if (img._css) {
                this._style['background-image'] = img._css;
                this._style['background-position'] =
                    -this._frameLeft + 'px ' + -this._frameTop + 'px';
            }
        }
    });

    
    /**
     * @scope enchant.Label.prototype
     */
    enchant.Label = enchant.Class.create(enchant.Entity, {
        initialize: function (text) {
            enchant.Entity.call(this);

            this.text = text || '';
            this.width = 300;
            this.font = '14px serif';
            this.textAlign = 'left';

            this._debugColor = '#ff0000';
            this._splitText = [];
            this._boundWidth = 0;
            this._boundHeight = 0;
            this._boundOffset = 0;
        },

        // width は境界更新も行う
        width: {
            get: function () { return this._width; },
            set: function (w) {
                this._width = w;
                this._dirty = true;
                this.updateBoundArea();
            }
        },

        text: {
            get: function () { return this._text; },
            set: function (t) {
                t = '' + t;
                if (this._text === t) return;

                this._text = t;

                // <br> 正規化 & 分割
                var normalized = t.replace(/<br ?\/?>/gi, '<br/>');
                var lines = normalized.split('<br/>');

                this._splitText = [];
                this.updateBoundArea(); // font/align 依存のため先に更新

                for (var i = 0, l = lines.length; i < l; i++) {
                    var lineText = lines[i];
                    var metrics = this.getMetrics(lineText);
                    this._splitText.push({
                        text: lineText,
                        height: metrics.height,
                        width: metrics.width
                    });
                }
            }
        },

        textAlign: {
            get: function () { return this._style['text-align']; },
            set: function (align) {
                this._style['text-align'] = align;
                this.updateBoundArea();
            }
        },

        font: {
            get: function () { return this._style.font; },
            set: function (font) {
                this._style.font = font;
                this.updateBoundArea();
            }
        },

        color: {
            get: function () { return this._style.color; },
            set: function (c) { this._style.color = c; }
        },

        cvsRender: function (ctx) {
            var lines = this._splitText;
            if (!lines || !lines.length) return;

            var labelWidth = this.width;
            var y = 0;

            ctx.textBaseline = 'top';
            ctx.font = this.font;
            ctx.fillStyle = this.color || '#000000';

            var align = this.textAlign || 'left';

            for (var i = 0, l = lines.length; i < l; i++) {
                var line = lines[i];
                var text = line.text;
                var len = text.length;
                var c = 0;

                while (c < len) {
                    var buf = '';
                    var step = 1;
                    var maxWidth = labelWidth;
                    var length = 0;

                    // 最大幅に収まる文字列を探す
                    while (c + length < len) {
                        var candidate = text.slice(c, c + length + step);
                        var w = ctx.measureText(candidate).width;
                        if (w <= maxWidth) {
                            length += step;
                        } else {
                            break;
                        }
                    }

                    if (length === 0) length = 1;
                    buf = text.slice(c, c + length);
                    var bufWidth = ctx.measureText(buf).width;

                    var x = 0;
                    if (align === 'right') {
                        x = labelWidth - bufWidth;
                    } else if (align === 'center') {
                        x = (labelWidth - bufWidth) / 2;
                    }

                    ctx.fillText(buf, x, y);
                    y += line.height; // ← -1 を削除して安定化
                    c += length;
                }
            }
        },


        domRender: function (element) {
            if (element.innerHTML !== this._text) {
                element.innerHTML = this._text;
            }
        },

        detectRender: function (ctx) {
            ctx.fillRect(this._boundOffset, 0, this._boundWidth, this._boundHeight);
        },

        updateBoundArea: function () {
            var metrics = this.getMetrics();
            this._boundWidth = metrics.width;
            this._boundHeight = metrics.height;

            var w = this.width;
            var bw = this._boundWidth;

            if (this.textAlign === 'right') {
                this._boundOffset = w - bw;
            } else if (this.textAlign === 'center') {
                this._boundOffset = (w - bw) / 2;
            } else {
                this._boundOffset = 0;
            }
        },

        getMetrics: function (text) {
            var ret = { width: 0, height: 0 };

            if (!document.body) {
                ret.width = this.width;
                ret.height = this.height;
                return ret;
            }

            var div = document.createElement('div');
            var style = this._style;

            for (var prop in style) {
                if (!style.hasOwnProperty(prop)) continue;
                if (prop === 'width' || prop === 'height') continue;
                div.style[prop] = style[prop];
            }

            text = text || this._text || '';
            div.innerHTML = text.replace(/ /g, '&nbsp;');
            div.style.whiteSpace = 'noWrap';
            div.style.lineHeight = 1;

            document.body.appendChild(div);

            var cs = getComputedStyle(div);
            ret.height = (parseInt(cs.height, 10) || 0) + 1;

            div.style.position = 'absolute';
            ret.width = (parseInt(cs.width, 10) || 0) + 1;

            document.body.removeChild(div);

            return ret;
        }
    });

    
    /**
     * @scope enchant.Map.prototype
     */
    enchant.Map = enchant.Class.create(enchant.Entity, {
        initialize: function (tileWidth, tileHeight) {
            var core = enchant.Core.instance;

            enchant.Entity.call(this);

            var w = core.width;
            var h = core.height;

            var surface = new enchant.Surface(w, h);
            this._surface = surface;

            var canvas = surface._element;
            canvas.style.position = 'absolute';

            if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                canvas.width = w * 2;
                canvas.height = h * 2;
                this._style.webkitTransformOrigin = '0 0';
                this._style.webkitTransform = 'scale(0.5)';
            } else {
                canvas.width = w;
                canvas.height = h;
            }

            this._context = canvas.getContext('2d');

            this._tileWidth = tileWidth || 0;
            this._tileHeight = tileHeight || 0;
            this._image = null;

            // [layer][y][x]
            this._data = [[[ ]]];

            this._dirty = false;
            this._tight = false;

            this.touchEnabled = false;

            this.collisionData = null;

            this._previousOffsetX = null;
            this._previousOffsetY = null;

            this._listeners['render'] = null;
            this.addEventListener('render', function () {
                if (this._dirty) {
                    this._previousOffsetX = this._previousOffsetY = null;
                }
            });
        },

        loadData: function () {
            // 可変長引数 → 配列化
            this._data = Array.prototype.slice.call(arguments);
            this._dirty = true;

            this._tight = false;

            for (var i = 0, len = this._data.length; i < len; i++) {
                var layer = this._data[i];
                var rows = layer.length;
                var cols = layer[0].length;
                var filled = 0;

                for (var y = 0; y < rows; y++) {
                    var row = layer[y];
                    for (var x = 0; x < cols; x++) {
                        if (row[x] >= 0) filled++;
                    }
                }

                if (filled / (rows * cols) > 0.2) {
                    this._tight = true;
                    break;
                }
            }
        },

        checkTile: function (x, y) {
            if (x < 0 || y < 0) return false;

            var tw = this._tileWidth  || (this._image && this._image.width)  || 0;
            var th = this._tileHeight || (this._image && this._image.height) || 0;
            if (!tw || !th) return false;

            var tx = (x / tw) | 0;
            var ty = (y / th) | 0;

            var layer0 = this._data[0];
            if (!layer0 || !layer0[ty] || layer0[ty][tx] == null) return false;

            return layer0[ty][tx];
        },

        hitTest: function (x, y) {
            if (x < 0 || y < 0) return false;

            var tw = this._tileWidth  || (this._image && this._image.width)  || 0;
            var th = this._tileHeight || (this._image && this._image.height) || 0;
            if (!tw || !th) return false;

            var tx = (x / tw) | 0;
            var ty = (y / th) | 0;

            if (this.collisionData) {
                var row = this.collisionData[ty];
                return !!(row && row[tx]);
            }

            if (!this._image) return false;

            var iw = this._image.width;
            var ih = this._image.height;
            var maxIndex = ((iw / tw) | 0) * ((ih / th) | 0);

            for (var i = 0, len = this._data.length; i < len; i++) {
                var layer = this._data[i];
                var row = layer[ty];
                if (!row) continue;

                var n = row[tx];
                if (n != null && n >= 0 && n < maxIndex) {
                    return true;
                }
            }
            return false;
        },

        image: {
            get: function () { return this._image; },
            set: function (img) {
                var core = enchant.Core.instance;

                this._image = img;
                this._doubledImage = null;

                if (img && enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                    var tw = this._tileWidth  || img.width;
                    var th = this._tileHeight || img.height;

                    var row = (img.width  / tw) | 0;
                    var col = (img.height / th) | 0;

                    var doubled = new enchant.Surface(img.width * 2, img.height * 2);

                    for (var y = 0; y < col; y++) {
                        for (var x = 0; x < row; x++) {
                            doubled.draw(
                                img,
                                x * tw, y * th, tw, th,
                                x * tw * 2, y * th * 2, tw * 2, th * 2
                            );
                        }
                    }
                    this._doubledImage = doubled;
                }

                this._dirty = true;
            }
        },

        tileWidth: {
            get: function () { return this._tileWidth; },
            set: function (w) {
                if (this._tileWidth !== w) {
                    this._tileWidth = w;
                    this._dirty = true;
                }
            }
        },

        tileHeight: {
            get: function () { return this._tileHeight; },
            set: function (h) {
                if (this._tileHeight !== h) {
                    this._tileHeight = h;
                    this._dirty = true;
                }
            }
        },

        width: {
            get: function () {
                var layer0 = this._data[0];
                return this._tileWidth * (layer0 && layer0[0] ? layer0[0].length : 0);
            }
        },

        height: {
            get: function () {
                var layer0 = this._data[0];
                return this._tileHeight * (layer0 ? layer0.length : 0);
            }
        },

        redraw: function (x, y, width, height) {
            if (!this._image) return;

            var img = this._doubledImage || this._image;
            var tw = this._doubledImage ? this._tileWidth * 2 : this._tileWidth;
            var th = this._doubledImage ? this._tileHeight * 2 : this._tileHeight;

            var dx = this._doubledImage ? -this._offsetX * 2 : -this._offsetX;
            var dy = this._doubledImage ? -this._offsetY * 2 : -this._offsetY;

            if (this._doubledImage) {
                x <<= 1; y <<= 1;
                width <<= 1; height <<= 1;
            }

            var row = (img.width / tw) | 0;
            var col = (img.height / th) | 0;
            var maxIndex = row * col;

            var left   = Math.max(((x + dx) / tw) | 0, 0);
            var top    = Math.max(((y + dy) / th) | 0, 0);
            var right  = Math.min(Math.ceil((x + dx + width) / tw),  this._data[0][0].length);
            var bottom = Math.min(Math.ceil((y + dy + height) / th), this._data[0].length);

            var ctx = this._context;
            var source = img._element;

            ctx.clearRect(x, y, width, height);

            var layers = this._data;

            for (var i = 0, L = layers.length; i < L; i++) {
                var data = layers[i];

                for (var ty = top; ty < bottom; ty++) {
                    var rowData = data[ty];
                    for (var tx = left; tx < right; tx++) {
                        var n = rowData[tx];
                        if (n >= 0 && n < maxIndex) {
                            var sx = (n % row) * tw;
                            var sy = ((n / row) | 0) * th;

                            ctx.drawImage(
                                source,
                                sx, sy, tw, th,
                                tx * tw - dx,
                                ty * th - dy,
                                tw, th
                            );
                        }
                    }
                }
            }
        },

        updateBuffer: function () {
            if (this._visible === false) return;

            var core = enchant.Core.instance;

            // 初回 or 完全更新
            if (this._dirty || this._previousOffsetX == null) {
                this.redraw(0, 0, core.width, core.height);
                this._previousOffsetX = this._offsetX;
                this._previousOffsetY = this._offsetY;
                return;
            }

            // オフセットが変わらないなら何もしない
            if (this._offsetX === this._previousOffsetX &&
                this._offsetY === this._previousOffsetY) {
                return;
            }

            // tight モードで部分更新
            if (this._tight) {
                var x = -this._offsetX;
                var y = -this._offsetY;
                var px = -this._previousOffsetX;
                var py = -this._previousOffsetY;

                var w1 = x - px + core.width;
                var w2 = px - x + core.width;
                var h1 = y - py + core.height;
                var h2 = py - y + core.height;

                if (w1 > this._tileWidth && w2 > this._tileWidth &&
                    h1 > this._tileHeight && h2 > this._tileHeight) {

                    if (!core._buffer) {
                        core._buffer = document.createElement('canvas');
                        core._buffer.width = this._context.canvas.width;
                        core._buffer.height = this._context.canvas.height;
                    }

                    var bufCtx = core._buffer.getContext('2d');
                    var ctx = this._context;

                    var sx = (w1 < w2) ? 0 : (x - px);
                    var dx = (w1 < w2) ? (px - x) : 0;
                    var sw = (w1 < w2) ? w1 : w2;

                    var sy = (h1 < h2) ? 0 : (y - py);
                    var dy = (h1 < h2) ? (py - y) : 0;
                    var sh = (h1 < h2) ? h1 : h2;

                    // Retina 対応
                    var mul = this._doubledImage ? 2 : 1;

                    bufCtx.clearRect(0, 0, sw * mul, sh * mul);
                    bufCtx.drawImage(
                        ctx.canvas,
                        sx * mul, sy * mul, sw * mul, sh * mul,
                        0, 0, sw * mul, sh * mul
                    );

                    ctx.clearRect(dx * mul, dy * mul, sw * mul, sh * mul);
                    ctx.drawImage(
                        core._buffer,
                        0, 0, sw * mul, sh * mul,
                        dx * mul, dy * mul, sw * mul, sh * mul
                    );

                    // 残り部分を再描画
                    if (dx === 0) {
                        this.redraw(sw, 0, core.width - sw, core.height);
                    } else {
                        this.redraw(0, 0, core.width - sw, core.height);
                    }

                    if (dy === 0) {
                        this.redraw(0, sh, core.width, core.height - sh);
                    } else {
                        this.redraw(0, 0, core.width, core.height - sh);
                    }

                } else {
                    this.redraw(0, 0, core.width, core.height);
                }

            } else {
                this.redraw(0, 0, core.width, core.height);
            }

            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        },

        cvsRender: function (ctx) {
            if (this.width === 0 || this.height === 0) return;

            var core = enchant.Core.instance;
            this.updateBuffer();

            var cvs = this._context.canvas;

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(cvs, 0, 0, core.width, core.height);
            ctx.restore();
        },

        domRender: function () {
            if (!this._image) return;

            this.updateBuffer();
            this._style['background-image'] = this._surface._css;
            this._style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(1,0,0,1,0,0)';
        }

    });
    
    
    /**
     * @scope enchant.Group.prototype
     */
    enchant.Group = enchant.Class.create(enchant.Node, {

        initialize: function () {
            this.childNodes = [];

            enchant.Node.call(this);

            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;

            this._originX = null;
            this._originY = null;

            this.__dirty = false;

            // --- 最適化：イベント伝播を1回のループに統合 ---
            var self = this;
            var propagate = function (e) {
                var scene = self.scene;
                var children = self.childNodes;
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = children[i];
                    child.scene = scene;
                    child.dispatchEvent(e);
                }
            };

            this.addEventListener(enchant.Event.ADDED_TO_SCENE, propagate);
            this.addEventListener(enchant.Event.REMOVED_FROM_SCENE, propagate);
        },

        /* ============================
        *  Child Management
        * ============================ */

        addChild: function (node) {
            if (node.parentNode) node.parentNode.removeChild(node);

            this.childNodes.push(node);
            node.parentNode = this;

            var e1 = new enchant.Event('childadded');
            e1.node = node;
            e1.next = null;
            this.dispatchEvent(e1);

            node.dispatchEvent(new enchant.Event('added'));

            if (this.scene) {
                node.scene = this.scene;
                node.dispatchEvent(new enchant.Event('addedtoscene'));
            }
        },

        insertBefore: function (node, reference) {
            if (node.parentNode) node.parentNode.removeChild(node);

            var list = this.childNodes;
            var idx = list.indexOf(reference);

            if (idx !== -1) {
                list.splice(idx, 0, node);
                node.parentNode = this;

                var e1 = new enchant.Event('childadded');
                e1.node = node;
                e1.next = reference;
                this.dispatchEvent(e1);

                node.dispatchEvent(new enchant.Event('added'));

                if (this.scene) {
                    node.scene = this.scene;
                    node.dispatchEvent(new enchant.Event('addedtoscene'));
                }
            } else {
                this.addChild(node);
            }
        },

        removeChild: function (node) {
            var list = this.childNodes;
            var idx = list.indexOf(node);

            if (idx !== -1) {
                list.splice(idx, 1);
                node.parentNode = null;

                var e1 = new enchant.Event('childremoved');
                e1.node = node;
                this.dispatchEvent(e1);

                node.dispatchEvent(new enchant.Event('removed'));

                if (this.scene) {
                    node.scene = null;
                    node.dispatchEvent(new enchant.Event('removedfromscene'));
                }
            }
        },

        /* ============================
        *  First / Last Child
        * ============================ */

        firstChild: {
            get: function () {
                return this.childNodes[0];
            }
        },

        lastChild: {
            get: function () {
                var list = this.childNodes;
                return list[list.length - 1];
            }
        },

        /* ============================
        *  Transform Properties
        * ============================ */

        rotation: {
            get: function () { return this._rotation; },
            set: function (v) {
                if (this._rotation !== v) {
                    this._rotation = v;
                    this._dirty = true;
                }
            }
        },

        scaleX: {
            get: function () { return this._scaleX; },
            set: function (v) {
                if (this._scaleX !== v) {
                    this._scaleX = v;
                    this._dirty = true;
                }
            }
        },

        scaleY: {
            get: function () { return this._scaleY; },
            set: function (v) {
                if (this._scaleY !== v) {
                    this._scaleY = v;
                    this._dirty = true;
                }
            }
        },

        originX: {
            get: function () { return this._originX; },
            set: function (v) {
                if (this._originX !== v) {
                    this._originX = v;
                    this._dirty = true;
                }
            }
        },

        originY: {
            get: function () { return this._originY; },
            set: function (v) {
                if (this._originY !== v) {
                    this._originY = v;
                    this._dirty = true;
                }
            }
        },

        /* ============================
        *  Dirty Propagation
        * ============================ */

        _dirty: {
            get: function () { return this.__dirty; },
            set: function (flag) {
                flag = !!flag;
                this.__dirty = flag;

                if (flag) {
                    var list = this.childNodes;
                    for (var i = 0, l = list.length; i < l; i++) {
                        list[i]._dirty = true;
                    }
                }
            }
        }
    });

    
    enchant.Matrix = enchant.Class.create({
        initialize: function() {
            this.reset();
        },
        reset: function() {
            this.stack = [];
            this.stack.push([ 1, 0, 0, 1, 0, 0 ]);
        },
        makeTransformMatrix: function(node, dest) {
            var x = node._x;
            var y = node._y;
            var width = node.width || 0;
            var height = node.height || 0;
            var rotation = node._rotation || 0;
            var scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
            var scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
            var theta = rotation * Math.PI / 180;
            var tmpcos = Math.cos(theta);
            var tmpsin = Math.sin(theta);
            var w = (typeof node._originX === 'number') ? node._originX : width / 2;
            var h = (typeof node._originY === 'number') ? node._originY : height / 2;
            var a = scaleX * tmpcos;
            var b = scaleX * tmpsin;
            var c = scaleY * tmpsin;
            var d = scaleY * tmpcos;
            dest[0] = a;
            dest[1] = b;
            dest[2] = -c;
            dest[3] = d;
            dest[4] = (-a * w + c * h + x + w);
            dest[5] = (-b * w - d * h + y + h);
        },
        multiply: function(m1, m2, dest) {
            var a11 = m1[0], a21 = m1[2], adx = m1[4],
                a12 = m1[1], a22 = m1[3], ady = m1[5];
            var b11 = m2[0], b21 = m2[2], bdx = m2[4],
                b12 = m2[1], b22 = m2[3], bdy = m2[5];
    
            dest[0] = a11 * b11 + a21 * b12;
            dest[1] = a12 * b11 + a22 * b12;
            dest[2] = a11 * b21 + a21 * b22;
            dest[3] = a12 * b21 + a22 * b22;
            dest[4] = a11 * bdx + a21 * bdy + adx;
            dest[5] = a12 * bdx + a22 * bdy + ady;
        },
        multiplyVec: function(mat, vec, dest) {
            var x = vec[0], y = vec[1];
            var m11 = mat[0], m21 = mat[2], mdx = mat[4],
                m12 = mat[1], m22 = mat[3], mdy = mat[5];
            dest[0] = m11 * x + m21 * y + mdx;
            dest[1] = m12 * x + m22 * y + mdy;
        }
    });
    enchant.Matrix.instance = new enchant.Matrix();
    
    enchant.DetectColorManager = enchant.Class.create({
        initialize: function(reso, max) {
            this.reference = [];
            this.colorResolution = reso || 16;
            this.max = max || 1;
            this.capacity = Math.pow(this.colorResolution, 3);
            for (var i = 1, l = this.capacity; i < l; i++) {
                this.reference[i] = null;
            }
        },
        attachDetectColor: function(sprite) {
            var i = this.reference.indexOf(null);
            if (i === -1) {
                i = 1;
            }
            this.reference[i] = sprite;
            return this._getColor(i);
        },
        detachDetectColor: function(sprite) {
            var i = this.reference.indexOf(sprite);
            if (i !== -1) {
                this.reference[i] = null;
            }
        },
        _getColor: function(n) {
            var C = this.colorResolution;
            var d = C / this.max;
            return [
                parseInt((n / C / C) % C, 10) / d,
                parseInt((n / C) % C, 10) / d,
                parseInt(n % C, 10) / d,
                1.0
            ];
        },
        _decodeDetectColor: function(color, i) {
            i = i || 0;
            var C = this.colorResolution;
            return ~~(color[i] * C * C * C / 256) +
                ~~(color[i + 1] * C * C / 256) +
                ~~(color[i + 2] * C / 256);
        },
        getSpriteByColor: function(color) {
            return this.reference[this._decodeDetectColor(color)];
        },
        getSpriteByColors: function(rgba) {
            var i, l, id, result,
                score = 0,
                found = {};
    
            for (i = 0, l = rgba.length; i < l; i+= 4) {
                id = this._decodeDetectColor(rgba, i);
                found[id] = (found[id] || 0) + 1;
            }
            for (id in found) {
                if (found[id] > score) {
                    score = found[id];
                    result = id;
                }
            }
    
            return this.reference[result];
        }
    });
    
    enchant.DomManager = enchant.Class.create({
        initialize: function(node, elementDefinition) {
            var core = enchant.Core.instance;
            this.layer = null;
            this.targetNode = node;
            if (typeof elementDefinition === 'string') {
                this.element = document.createElement(elementDefinition);
            } else if (elementDefinition instanceof HTMLElement) {
                this.element = elementDefinition;
            }
            this.style = this.element.style;
            this.style.position = 'absolute';
            this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0px 0px';
            if (core._debug) {
                this.style.border = '1px solid blue';
                this.style.margin = '-1px';
            }
    
            var manager = this;
            this._setDomTarget = function() {
                manager.layer._touchEventTarget = manager.targetNode;
            };
            this._attachEvent();
        },
        getDomElement: function() {
            return this.element;
        },
        getDomElementAsNext: function() {
            return this.element;
        },
        getNextManager: function(manager) {
            var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
            if (i !== this.targetNode.parentNode.childNodes.length - 1) {
                return this.targetNode.parentNode.childNodes[i + 1]._domManager;
            } else {
                return null;
            }
        },
        addManager: function(childManager, nextManager) {
            var nextElement;
            if (nextManager) {
                nextElement = nextManager.getDomElementAsNext();
            }
            var element = childManager.getDomElement();
            if (element instanceof Array) {
                element.forEach(function(child) {
                    if (nextElement) {
                        this.element.insertBefore(child, nextElement);
                    } else {
                        this.element.appendChild(child);
                    }
                }, this);
            } else {
                if (nextElement) {
                    this.element.insertBefore(element, nextElement);
                } else {
                    this.element.appendChild(element);
                }
            }
            this.setLayer(this.layer);
        },
        removeManager: function(childManager) {
            if (childManager instanceof enchant.DomlessManager) {
                childManager._domRef.forEach(function(element) {
                    this.element.removeChild(element);
                }, this);
            } else {
                this.element.removeChild(childManager.element);
            }
            this.setLayer(this.layer);
        },
        setLayer: function(layer) {
            this.layer = layer;
            var node = this.targetNode;
            var manager;
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    manager = node.childNodes[i]._domManager;
                    if (manager) {
                        manager.setLayer(layer);
                    }
                }
            }
        },
        render: function(inheritMat) {
            var node = this.targetNode;
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var dest = [];
            matrix.makeTransformMatrix(node, dest);
            matrix.multiply(stack[stack.length - 1], dest, dest);
            matrix.multiply(inheritMat, dest, inheritMat);
            node._matrix = inheritMat;
            var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
            var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(dest, vec, vec);
    
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            if(node.parentNode && !(node.parentNode instanceof enchant.Group)) {
                node._offsetX += node.parentNode._offsetX;
                node._offsetY += node.parentNode._offsetY;
            }
            if (node._dirty) {
                this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(' +
                    dest[0].toFixed(10) + ',' +
                    dest[1].toFixed(10) + ',' +
                    dest[2].toFixed(10) + ',' +
                    dest[3].toFixed(10) + ',' +
                    dest[4].toFixed(10) + ',' +
                    dest[5].toFixed(10) +
                ')';
            }
            this.domRender();
        },
        domRender: function() {
            var node = this.targetNode;
            if(!node._style) {
                node._style = {};
            }
            if(!node.__styleStatus) {
                node.__styleStatus = {};
            }
            if (node.width !== null) {
                node._style.width = node.width + 'px';
            }
            if (node.height !== null) {
                node._style.height = node.height + 'px';
            }
            node._style.opacity = node._opacity;
            node._style['background-color'] = node._backgroundColor;
            if (typeof node._visible !== 'undefined') {
                node._style.display = node._visible ? 'block' : 'none';
            }
            if (typeof node.domRender === 'function') {
                node.domRender(this.element);
            }
            var value;
            for (var prop in node._style) {
                value = node._style[prop];
                if(node.__styleStatus[prop] !== value && value != null) {
                    this.style.setProperty(prop, '' + value);
                    node.__styleStatus[prop] = value;
                }
            }
        },
        _attachEvent: function() {
            if (enchant.ENV.TOUCH_ENABLED) {
                this.element.addEventListener('touchstart', this._setDomTarget, true);
            }
            this.element.addEventListener('mousedown', this._setDomTarget, true);
        },
        _detachEvent: function() {
            if (enchant.ENV.TOUCH_ENABLED) {
                this.element.removeEventListener('touchstart', this._setDomTarget, true);
            }
            this.element.removeEventListener('mousedown', this._setDomTarget, true);
        },
        remove: function() {
            this._detachEvent();
            this.element = this.style = this.targetNode = null;
        }
    });
    
    enchant.DomlessManager = enchant.Class.create({
        initialize: function(node) {
            this._domRef = [];
            this.targetNode = node;
        },
        _register: function(element, nextElement) {
            var i = this._domRef.indexOf(nextElement);
            if (element instanceof Array) {
                if (i === -1) {
                    Array.prototype.push.apply(this._domRef, element);
                } else {
                    Array.prototype.splice.apply(this._domRef, [i, 0].concat(element));
                }
            } else {
                if (i === -1) {
                    this._domRef.push(element);
                } else {
                    this._domRef.splice(i, 0, element);
                }
            }
        },
        getNextManager: function(manager) {
            var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
            if (i !== this.targetNode.parentNode.childNodes.length - 1) {
                return this.targetNode.parentNode.childNodes[i + 1]._domManager;
            } else {
                return null;
            }
        },
        getDomElement: function() {
            var ret = [];
            this.targetNode.childNodes.forEach(function(child) {
                ret = ret.concat(child._domManager.getDomElement());
            });
            return ret;
        },
        getDomElementAsNext: function() {
            if (this._domRef.length) {
                return this._domRef[0];
            } else {
                var nextManager = this.getNextManager(this);
                if (nextManager) {
                    return nextManager.element;
                } else {
                    return null;
                }
            }
        },
        addManager: function(childManager, nextManager) {
            var parentNode = this.targetNode.parentNode;
            if (parentNode) {
                if (nextManager === null) {
                    nextManager = this.getNextManager(this);
                }
                if (parentNode instanceof enchant.Scene) {
                    parentNode._layers.Dom._domManager.addManager(childManager, nextManager);
                } else {
                    parentNode._domManager.addManager(childManager, nextManager);
                }
            }
            var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
            this._register(childManager.getDomElement(), nextElement);
            this.setLayer(this.layer);
        },
        removeManager: function(childManager) {
            var dom;
            var i = this._domRef.indexOf(childManager.element);
            if (i !== -1) {
                dom = this._domRef[i];
                dom.parentNode.removeChild(dom);
                this._domRef.splice(i, 1);
            }
            this.setLayer(this.layer);
        },
        setLayer: function(layer) {
            this.layer = layer;
            var node = this.targetNode;
            var manager;
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    manager = node.childNodes[i]._domManager;
                    if (manager) {
                        manager.setLayer(layer);
                    }
                }
            }
        },
        render: function(inheritMat) {
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var node = this.targetNode;
            var dest = [];
            matrix.makeTransformMatrix(node, dest);
            matrix.multiply(stack[stack.length - 1], dest, dest);
            matrix.multiply(inheritMat, dest, inheritMat);
            node._matrix = inheritMat;
            var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
            var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(dest, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            stack.push(dest);
        },
        remove: function() {
            this._domRef = [];
            this.targetNode = null;
        }
    });
    
    enchant.DomLayer = enchant.Class.create(enchant.Group, {
        initialize: function() {
            var core = enchant.Core.instance;
            enchant.Group.call(this);
    
            this._touchEventTarget = null;
    
            this._element = document.createElement('div');
            this._element.style.position = 'absolute';
    
            this._domManager = new enchant.DomManager(this, this._element);
            this._domManager.layer = this;
    
            this.width = core.width;
            this.height = core.height;
    
            var touch = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END
            ];
    
            touch.forEach(function(type) {
                this.addEventListener(type, function(e) {
                    if (this._scene) {
                        this._scene.dispatchEvent(e);
                    }
                });
            }, this);
    
            var __onchildadded = function(e) {
                var child = e.node;
                var next = e.next;
                var self = e.target;
                var nextManager = next ? next._domManager : null;
                enchant.DomLayer._attachDomManager(child, __onchildadded, __onchildremoved);
                self._domManager.addManager(child._domManager, nextManager);
                var render = new enchant.Event(enchant.Event.RENDER);
                child._dirty = true;
                self._domManager.layer._rendering(child, render);
            };
    
            var __onchildremoved = function(e) {
                var child = e.node;
                var self = e.target;
                self._domManager.removeManager(child._domManager);
                enchant.DomLayer._detachDomManager(child, __onchildadded, __onchildremoved);
            };
    
            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);
    
        },
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._element.style.width = width + 'px';
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._element.style.height = height + 'px';
            }
        },
        addChild: function(node) {
            this.childNodes.push(node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = null;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        },
        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);
            if (i !== -1) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;
                var childAdded = new enchant.Event('childadded');
                childAdded.node = node;
                childAdded.next = reference;
                this.dispatchEvent(childAdded);
                node.dispatchEvent(new enchant.Event('added'));
                if (this.scene) {
                    node.scene = this.scene;
                    var addedToScene = new enchant.Event('addedtoscene');
                    node.dispatchEvent(addedToScene);
                }
            } else {
                this.addChild(node);
            }
        },
        _startRendering: function() {
            this.addEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        _stopRendering: function() {
            this.removeEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        _onexitframe: function() {
            this._rendering(this, new enchant.Event(enchant.Event.RENDER));
        },
        _rendering: function(node, e, inheritMat) {
            var child;
            if (!inheritMat) {
                inheritMat = [ 1, 0, 0, 1, 0, 0 ];
            }
            node.dispatchEvent(e);
            node._domManager.render(inheritMat);
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this._rendering(child, e, inheritMat.slice());
                }
            }
            if (node._domManager instanceof enchant.DomlessManager) {
                enchant.Matrix.instance.stack.pop();
            }
            node._dirty = false;
        },
        _determineEventTarget: function() {
            var target = this._touchEventTarget;
            this._touchEventTarget = null;
            return (target === this) ? null : target;
        }
    });
    
    enchant.DomLayer._attachDomManager = function(node, onchildadded, onchildremoved) {
        var child;
        if (!node._domManager) {
            node.addEventListener('childadded', onchildadded);
            node.addEventListener('childremoved', onchildremoved);
            if (node instanceof enchant.Group) {
                node._domManager = new enchant.DomlessManager(node);
            } else {
                if (node._element) {
                    node._domManager = new enchant.DomManager(node, node._element);
                } else {
                    node._domManager = new enchant.DomManager(node, 'div');
                }
            }
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                enchant.DomLayer._attachDomManager(child, onchildadded, onchildremoved);
                node._domManager.addManager(child._domManager, null);
            }
        }
    };
    
    enchant.DomLayer._detachDomManager = function(node, onchildadded, onchildremoved) {
        var child;
        node.removeEventListener('childadded', onchildadded);
        node.removeEventListener('childremoved', onchildremoved);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                node._domManager.removeManager(child._domManager, null);
                enchant.DomLayer._detachDomManager(child, onchildadded, onchildremoved);
            }
        }
        node._domManager.remove();
        delete node._domManager;
    };
    
    /**
     * @scope enchant.CanvasLayer.prototype
     */
    enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
        /**
         * @name enchant.CanvasLayer
         * @class
         * Class that uses the HTML Canvas for rendering.
         * The rendering of children will be replaced by the Canvas rendering.
         * @constructs
         * @extends enchant.Group
         */
        initialize: function() {
            var core = enchant.Core.instance;
    
            enchant.Group.call(this);
    
            this._cvsCache = {
                matrix: [1, 0, 0, 1, 0, 0],
                detectColor: '#000000'
            };
            this._cvsCache.layer = this;
    
            this._element = document.createElement('canvas');
            this._element.style.position = 'absolute';
            // issue 179
            this._element.style.left = this._element.style.top = '0px';
    
            this._detect = document.createElement('canvas');
            this._detect.style.position = 'absolute';
            this._lastDetected = 0;
    
            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');
            this._setImageSmoothingEnable();
    
            this._colorManager = new enchant.DetectColorManager(16, 256);
    
            this.width = core.width;
            this.height = core.height;
    
            var touch = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END
            ];
    
            touch.forEach(function(type) {
                this.addEventListener(type, function(e) {
                    if (this._scene) {
                        this._scene.dispatchEvent(e);
                    }
                });
            }, this);
    
            var __onchildadded = function(e) {
                var child = e.node;
                var self = e.target;
                var layer;
                if (self instanceof enchant.CanvasLayer) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }
                enchant.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);
                var render = new enchant.Event(enchant.Event.RENDER);
                if (self._dirty) {
                    self._updateCoordinate();
                }
                child._dirty = true;
                enchant.Matrix.instance.stack.push(self._matrix);
                enchant.CanvasRenderer.instance.render(layer.context, child, render);
                enchant.Matrix.instance.stack.pop(self._matrix);
            };
    
            var __onchildremoved = function(e) {
                var child = e.node;
                var self = e.target;
                var layer;
                if (self instanceof enchant.CanvasLayer) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }
                enchant.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
            };
    
            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);
    
        },
        /**
         * The width of the CanvasLayer.
         * @type Number
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._element.width = this._detect.width = width;
                this._setImageSmoothingEnable();
            }
        },
        /**
         * The height of the CanvasLayer.
         * @type Number
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._element.height = this._detect.height = height;
                this._setImageSmoothingEnable();
            }
        },
        addChild: function(node) {
            this.childNodes.push(node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = null;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
        },
        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);
            if (i !== -1) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;
                var childAdded = new enchant.Event('childadded');
                childAdded.node = node;
                childAdded.next = reference;
                this.dispatchEvent(childAdded);
                node.dispatchEvent(new enchant.Event('added'));
            } else {
                this.addChild(node);
            }
        },
        /**
         * @private
         */
        _startRendering: function() {
            this.addEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        /**
         * @private
         */
        _stopRendering: function() {
            this.removeEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        _onexitframe: function() {
            var core = enchant.Core.instance;
            var ctx = this.context;
            ctx.clearRect(0, 0, core.width, core.height);
            var render = new enchant.Event(enchant.Event.RENDER);
            enchant.CanvasRenderer.instance.render(ctx, this, render);
        },
        _determineEventTarget: function(e) {
            return this._getEntityByPosition(e.x, e.y);
        },
        _getEntityByPosition: function(x, y) {
            var core = enchant.Core.instance;
            var ctx = this._dctx;
            if (this._lastDetected < core.frame) {
                ctx.clearRect(0, 0, this.width, this.height);
                enchant.CanvasRenderer.instance.detectRender(ctx, this);
                this._lastDetected = core.frame;
            }
            var extra = enchant.ENV.COLOR_DETECTION_LEVEL - 1;
            var rgba = ctx.getImageData(x - extra, y - extra, 1 + extra * 2, 1 + extra * 2).data;
            return this._colorManager.getSpriteByColors(rgba);
        },
        _setImageSmoothingEnable: function() {
            this._dctx.imageSmoothingEnabled =
                    this._dctx.msImageSmoothingEnabled =
                    this._dctx.mozImageSmoothingEnabled =
                    this._dctx.webkitImageSmoothingEnabled = false;
        }
    });
    
    enchant.CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
        var child;
        if (!node._cvsCache) {
            node._cvsCache = {};
            node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
            node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
            node.addEventListener('childadded', onchildadded);
            node.addEventListener('childremoved', onchildremoved);
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                enchant.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };
    
    enchant.CanvasLayer._detachCache = function(node, layer, onchildadded, onchildremoved) {
        var child;
        if (node._cvsCache) {
            layer._colorManager.detachDetectColor(node);
            node.removeEventListener('childadded', onchildadded);
            node.removeEventListener('childremoved', onchildremoved);
            delete node._cvsCache;
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                enchant.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };
    
    enchant.CanvasRenderer = enchant.Class.create({
        render: function(ctx, node, e) {
            var width, height, child;
            ctx.save();
            node.dispatchEvent(e);
            // transform
            this.transform(ctx, node);
            if (typeof node._visible === 'undefined' || node._visible) {
                width = node.width;
                height = node.height;
                // composite
                if (node.compositeOperation) {
                    ctx.globalCompositeOperation = node.compositeOperation;
                }
                ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
                // render
                if (node._backgroundColor) {
                    ctx.fillStyle = node._backgroundColor;
                    ctx.fillRect(0, 0, width, height);
                }
    
                if (node.cvsRender) {
                    node.cvsRender(ctx);
                }
    
                if (enchant.Core.instance._debug && node._debugColor) {
                    ctx.strokeStyle = node._debugColor;
                    ctx.strokeRect(0, 0, width, height);
                }
                if (node._clipping) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }
                if (node.childNodes) {
                    for (var i = 0, l = node.childNodes.length; i < l; i++) {
                        child = node.childNodes[i];
                        this.render(ctx, child, e);
                    }
                }
            }
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        },
        detectRender: function(ctx, node) {
            var width, height, child;
            if (typeof node._visible === 'undefined' || node._visible) {
                width = node.width;
                height = node.height;
                ctx.save();
                this.transform(ctx, node);
                ctx.fillStyle = node._cvsCache.detectColor;
                if (node._touchEnabled) {
                    if (node.detectRender) {
                        node.detectRender(ctx);
                    } else {
                        ctx.fillRect(0, 0, width, height);
                    }
                }
                if (node._clipping) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }
                if (node.childNodes) {
                    for (var i = 0, l = node.childNodes.length; i < l; i++) {
                        child = node.childNodes[i];
                        this.detectRender(ctx, child);
                    }
                }
                ctx.restore();
                enchant.Matrix.instance.stack.pop();
            }
        },
        transform: function(ctx, node) {
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var newmat, ox, oy, vec;
            if (node._dirty) {
                matrix.makeTransformMatrix(node, node._cvsCache.matrix);
                newmat = [];
                matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
                node._matrix = newmat;
                ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
                oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
                vec = [ ox, oy ];
                matrix.multiplyVec(newmat, vec, vec);
                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;
                node._dirty = false;
            } else {
                newmat = node._matrix;
            }
            stack.push(newmat);
            ctx.setTransform.apply(ctx, newmat);
        }
    });
    enchant.CanvasRenderer.instance = new enchant.CanvasRenderer();
    
    /**
     * @scope enchant.Scene.prototype
     */
    enchant.Scene = enchant.Class.create(enchant.Group, {
        initialize: function() {
            var core = enchant.Core.instance;

            // Call initialize method of enchant.Group
            enchant.Group.call(this);

            // All nodes (entities, groups, scenes) have reference to the scene that it belongs to.
            this.scene = this;

            this._backgroundColor = null;

            // Create div tag which possesses its layers
            this._element = document.createElement('div');
            this._element.style.position = 'absolute';
            this._element.style.overflow = 'hidden';
            this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

            this._layers = {};
            this._layerPriority = [];
            // キャッシュ用：頻出ループで for-in を避ける
            this._layerList = [];
            this._layerListDirty = false;

            this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
            this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
            this.addEventListener(enchant.Event.ENTER, this._onenter);
            this.addEventListener(enchant.Event.EXIT, this._onexit);

            // EXIT_FRAME イベントをキャッシュ
            this._exitFrameEvent = new enchant.Event(enchant.Event.EXIT_FRAME);

            var that = this;
            this._dispatchExitframe = function() {
                if (that._layerListDirty) {
                    that._updateLayerList();
                }
                var list = that._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].dispatchEvent(that._exitFrameEvent);
                }
            };

            this.addEventListener(enchant.Event.CORE_RESIZE, this._oncoreresize);

            this._oncoreresize(core);
        },

        // 内部用：レイヤー配列キャッシュを更新
        _updateLayerList: function() {
            var list = [];
            for (var i = 0, len = this._layerPriority.length; i < len; i++) {
                var type = this._layerPriority[i];
                var layer = this._layers[type];
                if (layer) {
                    list.push(layer);
                }
            }
            this._layerList = list;
            this._layerListDirty = false;
        },

        /**#nocode+*/
        x: {
            get: function() {
                return this._x;
            },
            set: function(x) {
                this._x = x;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].x = x;
                }
            }
        },
        y: {
            get: function() {
                return this._y;
            },
            set: function(y) {
                this._y = y;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].y = y;
                }
            }
        },
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].width = width;
                }
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].height = height;
                }
            }
        },
        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                this._rotation = rotation;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].rotation = rotation;
                }
            }
        },
        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scaleX) {
                this._scaleX = scaleX;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].scaleX = scaleX;
                }
            }
        },
        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scaleY) {
                this._scaleY = scaleY;
                if (this._layerListDirty) {
                    this._updateLayerList();
                }
                var list = this._layerList;
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].scaleY = scaleY;
                }
            }
        },
        backgroundColor: {
            get: function() {
                return this._backgroundColor;
            },
            set: function(color) {
                this._backgroundColor = this._element.style.backgroundColor = color;
            }
        },
        remove: function() {
            this.clearEventListener();

            while (this.childNodes.length > 0) {
                this.childNodes[0].remove();
            }

            return enchant.Core.instance.removeScene(this);
        },
        /**#nocode-*/
        _oncoreresize: function(e) {
            this._element.style.width = e.width + 'px';
            this.width = e.width;
            this._element.style.height = e.height + 'px';
            this.height = e.height;
            this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

            if (this._layerListDirty) {
                this._updateLayerList();
            }
            var list = this._layerList;
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].dispatchEvent(e);
            }
        },
        addLayer: function(type, i) {
            var core = enchant.Core.instance;
            if (this._layers[type]) {
                return;
            }
            var layer = new enchant[type + 'Layer']();
            if (core.currentScene === this) {
                layer._startRendering();
            }
            this._layers[type] = layer;
            var element = layer._element;
            if (typeof i === 'number') {
                var nextSibling = this._element.childNodes[i];
                if (nextSibling) {
                    this._element.insertBefore(element, nextSibling);
                } else {
                    this._element.appendChild(element);
                }
                this._layerPriority.splice(i, 0, type);
            } else {
                this._element.appendChild(element);
                this._layerPriority.push(type);
            }
            this._layerListDirty = true;
            layer._scene = this;
        },
        _determineEventTarget: function(e) {
            var layer, target;

            // よくある 2 レイヤー構成（Dom / Canvas）の場合は高速パス
            if (this._layers.Dom || this._layers.Canvas) {
                if (this._layers.Dom) {
                    target = this._layers.Dom._determineEventTarget(e);
                    if (target) {
                        return target;
                    }
                }
                if (this._layers.Canvas) {
                    target = this._layers.Canvas._determineEventTarget(e);
                    if (target) {
                        return target;
                    }
                }
                return this;
            }

            // 汎用パス（元の構造を維持）
            for (var i = this._layerPriority.length - 1; i >= 0; i--) {
                layer = this._layers[this._layerPriority[i]];
                target = layer._determineEventTarget(e);
                if (target) {
                    break;
                }
            }
            if (!target) {
                target = this;
            }
            return target;
        },
        _onchildadded: function(e) {
            var child = e.node;
            var next = e.next;
            var target, i;
            if (child._element) {
                target = 'Dom';
                i = 1;
            } else {
                target = 'Canvas';
                i = 0;
            }
            if (!this._layers[target]) {
                this.addLayer(target, i);
            }
            child._layer = this._layers[target];
            this._layers[target].insertBefore(child, next);
            child.parentNode = this;
        },
        _onchildremoved: function(e) {
            var child = e.node;
            if (child._layer) {
                child._layer.removeChild(child);
                child._layer = null;
            }
        },
        _onenter: function() {
            if (this._layerListDirty) {
                this._updateLayerList();
            }
            var list = this._layerList;
            for (var i = 0, len = list.length; i < len; i++) {
                list[i]._startRendering();
            }
            enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
        },
        _onexit: function() {
            if (this._layerListDirty) {
                this._updateLayerList();
            }
            var list = this._layerList;
            for (var i = 0, len = list.length; i < len; i++) {
                list[i]._stopRendering();
            }
            enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
        }
    });
    
    /**
     * @scope enchant.LoadingScene.prototype
     */
    enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
        /**
         * @name enchant.LoadingScene
         * @class
         * Default loading scene. If you want to use your own loading animation, overwrite (don't inherit) this class.
         * Referred from enchant.Core in default, as `new enchant.LoadingScene` etc.
         *
         * @example
         * enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
         *     initialize: function() {
         *         enchant.Scene.call(this);
         *         this.backgroundColor = 'red';
         *         // ...
         *         this.addEventListener('progress', function(e) {
         *             progress = e.loaded / e.total;
         *         });
         *         this.addEventListener('enterframe', function() {
         *             // animation
         *         });
         *     }
         * });
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            this.backgroundColor = '#000';
            var barWidth = this.width * 0.4 | 0;
            var barHeight = this.width * 0.05 | 0;
            var border = barWidth * 0.03 | 0;
            var bar = new enchant.Sprite(barWidth, barHeight);
            bar.disableCollection();
            bar.x = (this.width - barWidth) / 2;
            bar.y = (this.height - barHeight) / 2;
            var image = new enchant.Surface(barWidth, barHeight);
            image.context.fillStyle = '#fff';
            image.context.fillRect(0, 0, barWidth, barHeight);
            image.context.fillStyle = '#000';
            image.context.fillRect(border, border, barWidth - border * 2, barHeight - border * 2);
            bar.image = image;
            var progress = 0, _progress = 0;
            this.addEventListener('progress', function(e) {
                // avoid #167 https://github.com/wise9/enchant.js/issues/177
                progress = e.loaded / e.total * 1.0;
            });
            bar.addEventListener('enterframe', function() {
                _progress *= 0.9;
                _progress += progress * 0.1;
                image.context.fillStyle = '#fff';
                image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
            });
            this.addChild(bar);
            this.addEventListener('load', function(e) {
                var core = enchant.Core.instance;
                core.removeScene(core.loadingScene);
                core.dispatchEvent(e);
            });
        }
    });
    
    /**
     * @scope enchant.CanvasScene.prototype
     */
    enchant.CanvasScene = enchant.Class.create(enchant.Scene, {
        /**
         * @name enchant.CanvasScene
         * @class
         * Scene to draw by the Canvas all of the children.
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            this.addLayer('Canvas');
        },
        _determineEventTarget: function(e) {
            var target = this._layers.Canvas._determineEventTarget(e);
            if (!target) {
                target = this;
            }
            return target;
        },
        _onchildadded: function(e) {
            var child = e.node;
            var next = e.next;
            child._layer = this._layers.Canvas;
            this._layers.Canvas.insertBefore(child, next);
        },
        _onenter: function() {
            this._layers.Canvas._startRendering();
            enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
        },
        _onexit: function() {
            this._layers.Canvas._stopRendering();
            enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
        }
    });
    
    /**
     * @scope enchant.DOMScene.prototype
     */
    enchant.DOMScene = enchant.Class.create(enchant.Scene, {
        /**
         * @name enchant.DOMScene
         * @class
         * Scene to draw by the DOM all of the children.
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            this.addLayer('Dom');
        },
        _determineEventTarget: function(e) {
            var target = this._layers.Dom._determineEventTarget(e);
            if (!target) {
                target = this;
            }
            return target;
        },
        _onchildadded: function(e) {
            var child = e.node;
            var next = e.next;
            child._layer = this._layers.Dom;
            this._layers.Dom.insertBefore(child, next);
        },
        _onenter: function() {
            this._layers.Dom._startRendering();
            enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
        },
        _onexit: function() {
            this._layers.Dom._stopRendering();
            enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
        }
    });
    
    /**
     * @scope enchant.Surface.prototype
     */
    enchant.Surface = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Surface
         * @class
         * @param {Number} width
         * @param {Number} height
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function (width, height) {
            enchant.EventTarget.call(this);

            var core = enchant.Core.instance;

            this.width  = Math.ceil(width);
            this.height = Math.ceil(height);

            this.context = null;
            this._element = null;
            this._css = null;

            var id = 'enchant-surface' + core._surfaceID++;

            if (document.getCSSCanvasContext) {
                this.context = document.getCSSCanvasContext('2d', id, width, height);
                this._element = this.context.canvas;
                this._css = '-webkit-canvas(' + id + ')';
            } else if (document.mozSetImageElement) {
                var canvas = document.createElement('canvas');
                canvas.width  = width;
                canvas.height = height;
                this._element = canvas;
                this._css = '-moz-element(#' + id + ')';
                this.context = canvas.getContext('2d');
                document.mozSetImageElement(id, canvas);
            } else {
                var canvas2 = document.createElement('canvas');
                canvas2.width  = width;
                canvas2.height = height;
                canvas2.style.position = 'absolute';
                this._element = canvas2;
                this.context = canvas2.getContext('2d');

                var ctx = this.context;
                var self = this;
                enchant.ENV.CANVAS_DRAWING_METHODS.forEach(function (name) {
                    var method = ctx[name];
                    if (!method) { return; }
                    ctx[name] = function () {
                        method.apply(ctx, arguments);
                        self._dirty = true;
                    };
                });
            }

            // setPixel 用 1x1 ImageData キャッシュ
            this._onePixel = null;
        },

        getPixel: function (x, y) {
            return this.context.getImageData(x, y, 1, 1).data;
        },

        setPixel: function (x, y, r, g, b, a) {
            var pixel = this._onePixel;
            if (!pixel) {
                pixel = this._onePixel = this.context.createImageData(1, 1);
            }
            var data = pixel.data;
            data[0] = r;
            data[1] = g;
            data[2] = b;
            data[3] = a;
            this.context.putImageData(pixel, x, y);
        },

        clear: function () {
            this.context.clearRect(0, 0, this.width, this.height);
        },

        draw: function (image) {
            var elem = image._element;
            switch (arguments.length) {
                case 1:
                    this.context.drawImage(elem, 0, 0);
                    break;
                case 3:
                    this.context.drawImage(elem, arguments[1], arguments[2]);
                    break;
                case 5:
                    this.context.drawImage(elem, arguments[1], arguments[2],
                                        arguments[3], arguments[4]);
                    break;
                default:
                    // 9 引数パターンなど
                    var args = Array.prototype.slice.call(arguments);
                    args[0] = elem;
                    this.context.drawImage.apply(this.context, args);
                    break;
            }
        },

        clone: function () {
            var clone = new enchant.Surface(this.width, this.height);
            clone.draw(this);
            return clone;
        },

        toDataURL: function () {
            var src = this._element.src;
            if (src) {
                if (src.slice(0, 5) === 'data:') {
                    return src;
                } else {
                    return this.clone().toDataURL();
                }
            }
            return this._element.toDataURL();
        }
    });

    
    /**
     * Loads an image and creates a Surface object out of it.
     *
     * It is not possible to access properties or methods of the {@link enchant.Surface#context}, or to call methods using the Canvas API -
     * like {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.. -
     * of the wrapped image created with this method.
     * However, it is possible to use this surface to draw it to another surface using the {@link enchant.Surface#draw} method.
     * The resulting surface can then be manipulated. (when loading images in a cross-origin resource sharing environment,
     * pixel acquisition and other image manipulation might be limited).
     *
     * @param {String} src The file path of the image to be loaded.
     * @param {Function} callback on load callback.
     * @param {Function} [onerror] on error callback.
     * @static
     * @return {enchant.Surface} Surface
     */
    enchant.Surface.load = function(src, callback, onerror) {
        var image = new Image();
        var surface = Object.create(enchant.Surface.prototype, {
            context: { value: null },
            _css: { value: 'url(' + src + ')' },
            _element: { value: image }
        });
        enchant.EventTarget.call(surface);
        onerror = onerror || function() {};
        surface.addEventListener('load', callback);
        surface.addEventListener('error', onerror);
        image.onerror = function() {
            var e = new enchant.Event(enchant.Event.ERROR);
            e.message = 'Cannot load an asset: ' + image.src;
            enchant.Core.instance.dispatchEvent(e);
            surface.dispatchEvent(e);
        };
        image.onload = function() {
            surface.width = image.width;
            surface.height = image.height;
            surface.dispatchEvent(new enchant.Event('load'));
        };
        image.src = src;
        return surface;
    };
    enchant.Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');
    
    enchant.Surface._getPattern = function(surface, force) {
        if (!surface._pattern || force) {
            surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
        }
        return surface._pattern;
    };
    
    if (window.Deferred) {
        enchant.Deferred = window.Deferred;
    } else {
        /**
         * @scope enchant.Deferred.prototype
         */
        enchant.Deferred = enchant.Class.create({
            /**
             * @name enchant.Deferred
             * @class
             * <br/>
             * See: <a href="http://cho45.stfuawsc.com/jsdeferred/">
             * http://cho45.stfuawsc.com/jsdeferred/</a>
             *
             * @example
             * enchant.Deferred
             *     .next(function() {
             *         return 42;
             *     })
             *     .next(function(n) {
             *         console.log(n); // 42
             *     })
             *     .next(function() {
             *         return core.load('img.png'); // wait loading
             *     })
             *     .next(function() {
             *         var img = core.assets['img.png'];
             *         console.log(img instanceof enchant.Surface); // true
             *         throw new Error('!!!');
             *     })
             *     .next(function() {
             *         // skip
             *     })
             *     .error(function(err) {
             *          console.log(err.message); // !!!
             *     });
             *
             * @constructs
             */
            initialize: function() {
                this._succ = this._fail = this._next = this._id = null;
                this._tail = this;
            },
            /**
             * @param {Function} func
             */
            next: function(func) {
                var q = new enchant.Deferred();
                q._succ = func;
                return this._add(q);
            },
            /**
             * @param {Function} func
             */
            error: function(func) {
                var q = new enchant.Deferred();
                q._fail = func;
                return this._add(q);
            },
            _add: function(queue) {
                this._tail._next = queue;
                this._tail = queue;
                return this;
            },
            /**
             * @param {*} arg
             */
            call: function(arg) {
                var received;
                var queue = this;
                while (queue && !queue._succ) {
                    queue = queue._next;
                }
                if (!(queue instanceof enchant.Deferred)) {
                    return;
                }
                try {
                    received = queue._succ(arg);
                } catch (e) {
                    return queue.fail(e);
                }
                if (received instanceof enchant.Deferred) {
                    enchant.Deferred._insert(queue, received);
                } else if (queue._next instanceof enchant.Deferred) {
                    queue._next.call(received);
                }
            },
            /**
             * @param {*} arg
             */
            fail: function(arg) {
                var result, err,
                    queue = this;
                while (queue && !queue._fail) {
                    queue = queue._next;
                }
                if (queue instanceof enchant.Deferred) {
                    result = queue._fail(arg);
                    queue.call(result);
                } else if (arg instanceof Error) {
                    throw arg;
                } else {
                    err = new Error('failed in Deferred');
                    err.arg = arg;
                    throw err;
                }
            }
        });
        enchant.Deferred._insert = function(queue, ins) {
            if (queue._next instanceof enchant.Deferred) {
                ins._tail._next = queue._next;
            }
            queue._next = ins;
        };
        /**
         * @param {Function} func
         * @return {enchant.Deferred}
         * @static
         */
        enchant.Deferred.next = function(func) {
            var q = new enchant.Deferred().next(func);
            q._id = setTimeout(function() { q.call(); }, 0);
            return q;
        };
        /**
         * @param {Object|enchant.Deferred[]} arg
         * @return {enchant.Deferred}
         *
         * @example
         * // array
         * enchant.Deferred
         *     .parallel([
         *         enchant.Deferred.next(function() {
         *             return 24;
         *         }),
         *         enchant.Deferred.next(function() {
         *             return 42;
         *         })
         *     ])
         *     .next(function(arg) {
         *         console.log(arg); // [ 24, 42 ]
         *     });
         * // object
         * enchant.Deferred
         *     .parallel({
         *         foo: enchant.Deferred.next(function() {
         *             return 24;
         *         }),
         *         bar: enchant.Deferred.next(function() {
         *             return 42;
         *         })
         *     })
         *     .next(function(arg) {
         *         console.log(arg.foo); // 24
         *         console.log(arg.bar); // 42
         *     });
         *
         * @static
         */
        enchant.Deferred.parallel = function(arg) {
            var q = new enchant.Deferred();
            q._id = setTimeout(function() { q.call(); }, 0);
            var progress = 0;
            var ret = (arg instanceof Array) ? [] : {};
            var p = new enchant.Deferred();
            for (var prop in arg) {
                if (arg.hasOwnProperty(prop)) {
                    progress++;
                    /*jshint loopfunc:true */
                    (function(queue, name) {
                        queue.next(function(arg) {
                            progress--;
                            ret[name] = arg;
                            if (progress <= 0) {
                                p.call(ret);
                            }
                        })
                        .error(function(err) { p.fail(err); });
                        if (typeof queue._id === 'number') {
                            clearTimeout(queue._id);
                        }
                        queue._id = setTimeout(function() { queue.call(); }, 0);
                    }(arg[prop], prop));
                }
            }
            if (!progress) {
                p._id = setTimeout(function() { p.call(ret); }, 0);
            }
            return q.next(function() { return p; });
        };
    }
    
    /**
     * @scope enchant.DOMSound.prototype
     */
    enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {

        initialize: function () {
            enchant.EventTarget.call(this);
            this.duration = 0;
            throw new Error("Illegal Constructor");
        },

        play: function () {
            var el = this._element;
            if (el) {
                el.play();
            }
        },

        pause: function () {
            var el = this._element;
            if (el) {
                el.pause();
            }
        },

        stop: function () {
            var el = this._element;
            if (el) {
                el.pause();
                el.currentTime = 0;
            }
        },

        clone: function () {
            var el = this._element;
            var clone;

            if (el instanceof Audio) {
                clone = Object.create(enchant.DOMSound.prototype);
                clone._element = el.cloneNode(false);
                clone.duration = this.duration;
            } else if (enchant.ENV.USE_FLASH_SOUND) {
                return this;
            } else {
                clone = Object.create(enchant.DOMSound.prototype);
            }

            enchant.EventTarget.call(clone);
            return clone;
        },

        currentTime: {
            get: function () {
                var el = this._element;
                return el ? el.currentTime : 0;
            },
            set: function (time) {
                var el = this._element;
                if (el) {
                    el.currentTime = time;
                }
            }
        },

        volume: {
            get: function () {
                var el = this._element;
                return el ? el.volume : 1;
            },
            set: function (v) {
                var el = this._element;
                if (el) {
                    el.volume = v;
                }
            }
        }
    });

    
    /**
     * Loads an audio file and creates DOMSound object.
     * @param {String} src Path of the audio file to be loaded.
     * @param {String} [type] MIME Type of the audio file.
     * @param {Function} [callback] on load callback.
     * @param {Function} [onerror] on error callback.
     * @return {enchant.DOMSound} DOMSound
     * @static
     */
    enchant.DOMSound.load = function(src, type, callback, onerror) {
        if (type == null) {
            var ext = enchant.Core.findExt(src);
            if (ext) {
                type = 'audio/' + ext;
            } else {
                type = '';
            }
        }
        type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');
        callback = callback || function() {};
        onerror = onerror || function() {};
    
        var sound = Object.create(enchant.DOMSound.prototype);
        enchant.EventTarget.call(sound);
        sound.addEventListener('load', callback);
        sound.addEventListener('error', onerror);
        var audio = new Audio();
        if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
            enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        } else {
            if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
                audio.addEventListener('canplaythrough', function canplay() {
                    sound.duration = audio.duration;
                    sound.dispatchEvent(new enchant.Event('load'));
                    audio.removeEventListener('canplaythrough', canplay);
                }, false);
                audio.src = src;
                audio.load();
                audio.autoplay = false;
                audio.onerror = function() {
                    var e = new enchant.Event(enchant.Event.ERROR);
                    e.message = 'Cannot load an asset: ' + audio.src;
                    enchant.Core.instance.dispatchEvent(e);
                    sound.dispatchEvent(e);
                };
                sound._element = audio;
            } else if (type === 'audio/mpeg') {
                var embed = document.createElement('embed');
                var id = 'enchant-audio' + enchant.Core.instance._soundID++;
                embed.width = embed.height = 1;
                embed.name = id;
                embed.src = 'sound.swf?id=' + id + '&src=' + src;
                embed.allowscriptaccess = 'always';
                embed.style.position = 'absolute';
                embed.style.left = '-1px';
                sound.addEventListener('load', function() {
                    Object.defineProperties(embed, {
                        currentTime: {
                            get: function() {
                                return embed.getCurrentTime();
                            },
                            set: function(time) {
                                embed.setCurrentTime(time);
                            }
                        },
                        volume: {
                            get: function() {
                                return embed.getVolume();
                            },
                            set: function(volume) {
                                embed.setVolume(volume);
                            }
                        }
                    });
                    sound._element = embed;
                    sound.duration = embed.getDuration();
                });
                enchant.Core.instance._element.appendChild(embed);
                enchant.DOMSound[id] = sound;
            } else {
                window.setTimeout(function() {
                    sound.dispatchEvent(new enchant.Event('load'));
                }, 0);
            }
        }
        return sound;
    };
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;
    
    /**
     * @scope enchant.WebAudioSound.prototype
     */
    enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {

        initialize: function () {
            if (!window.AudioContext) {
                throw new Error("This browser does not support WebAudio API.");
            }

            enchant.EventTarget.call(this);

            if (!enchant.WebAudioSound.audioContext) {
                var ctx = new window.AudioContext();
                enchant.WebAudioSound.audioContext = ctx;
                enchant.WebAudioSound.destination = ctx.destination;
            }

            var ctx = enchant.WebAudioSound.audioContext;

            this.context = ctx;
            this.src = ctx.createBufferSource();
            this.buffer = null;

            this._gain = null;
            this._volume = 1;

            this._currentTime = 0;
            this._startTime = 0;
            this._state = 0;

            this.connectTarget = enchant.WebAudioSound.destination;
        },

        play: function (dup) {
            var state = this._state;
            var ctx = this.context;

            if (state === 1 && !dup) {
                this.src.disconnect();
            }

            if (state !== 2) {
                this._currentTime = 0;
            }

            var offset = this._currentTime;

            var src = ctx.createBufferSource();
            var gain = ctx.createGain();

            src.buffer = this.buffer;
            gain.gain.value = this._volume;

            src.connect(gain);
            gain.connect(this.connectTarget);

            var dur = this.buffer.duration - offset - 1.192e-7;
            if (src.start) {
                src.start(0, offset, dur);
            } else {
                src.noteGrainOn(0, offset, dur);
            }

            this.src = src;
            this._gain = gain;

            this._startTime = ctx.currentTime - this._currentTime;
            this._state = 1;
        },

        pause: function () {
            var current = this.currentTime;
            if (current === this.duration) {
                return;
            }

            var src = this.src;
            if (src.stop) {
                src.stop(0);
            } else {
                src.noteOff(0);
            }

            this._currentTime = current;
            this._state = 2;
        },

        stop: function () {
            var src = this.src;
            if (src.stop) {
                src.stop(0);
            } else {
                src.noteOff(0);
            }
            this._state = 0;
        },

        clone: function () {
            var sound = new enchant.WebAudioSound();
            sound.buffer = this.buffer;
            sound._volume = this._volume;
            return sound;
        },

        duration: {
            get: function () {
                var b = this.buffer;
                return b ? b.duration : 0;
            }
        },

        volume: {
            get: function () {
                return this._volume;
            },
            set: function (v) {
                v = Math.max(0, Math.min(1, v));
                this._volume = v;

                var gain = this._gain;
                if (gain) {
                    gain.gain.value = v;
                }
            }
        },

        currentTime: {
            get: function () {
                var dur = this.duration;
                var t = this.src.context.currentTime - this._startTime;
                return Math.max(0, Math.min(dur, t));
            },
            set: function (time) {
                this._currentTime = time;
                if (this._state !== 2) {
                    this.play(false);
                }
            }
        }
    });

    
    /**
     * Loads an audio file and creates WebAudioSound object.
     * @param {String} src Path of the audio file to be loaded.
     * @param {String} [type] MIME Type of the audio file.
     * @param {Function} [callback] on load callback.
     * @param {Function} [onerror] on error callback.
     * @return {enchant.WebAudioSound} WebAudioSound
     * @static
     */
    enchant.WebAudioSound.load = function(src, type, callback, onerror) {
        var canPlay = (new Audio()).canPlayType(type);
        var sound = new enchant.WebAudioSound();
        callback = callback || function() {};
        onerror = onerror || function() {};
        sound.addEventListener(enchant.Event.LOAD, callback);
        sound.addEventListener(enchant.Event.ERROR, onerror);
        function dispatchErrorEvent() {
            var e = new enchant.Event(enchant.Event.ERROR);
            e.message = 'Cannot load an asset: ' + src;
            enchant.Core.instance.dispatchEvent(e);
            sound.dispatchEvent(e);
        }
        var actx, xhr;
        if (canPlay === 'maybe' || canPlay === 'probably') {
            actx = enchant.WebAudioSound.audioContext;
            xhr = new XMLHttpRequest();
            xhr.open('GET', src, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
                actx.decodeAudioData(xhr.response, function(buffer) {
                    sound.buffer = buffer;
                    sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                }, dispatchErrorEvent);
            };
            xhr.onerror = dispatchErrorEvent;
            xhr.send(null);
        } else {
            setTimeout(dispatchErrorEvent,  50);
        }
        return sound;
    };
    
    enchant.Sound = window.AudioContext && enchant.ENV.USE_WEBAUDIO ? enchant.WebAudioSound : enchant.DOMSound;
    
    /*
     * ============================================================================================
     * Easing Equations v2.0
     * September 1, 2003
     * (c) 2003 Robert Penner, all rights reserved.
     * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
     * ============================================================================================
     */
    
    /**
     * @namespace
     * JavaScript translation of Robert Penner's "Easing Equations" library which is widely used in ActionScript.
     * 
     * @param [t] the current time
     * @param [b] the property's initial value
     * @param [c] how much the value should change
     * @param [d] how much time should elapse before value is changed
     * 
     * @return {Number}
     * <br/>
     * See: <a href="http://www.robertpenner.com/easing/">
     * http://www.robertpenner.com/easing/</a>
     * <br/>
     * See: <a href="http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf">
     * http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf</a>
     */
    enchant.Easing = {
        LINEAR: function(t, b, c, d) {
            return c * t / d + b;
        },
    
        SWING: function(t, b, c, d) {
            return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
        },
    
        // *** quad
        QUAD_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
    
        QUAD_EASEOUT: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
    
        QUAD_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
    
        // *** cubic
        CUBIC_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
    
        CUBIC_EASEOUT: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
    
        CUBIC_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
    
        // *** quart
        QUART_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
    
        QUART_EASEOUT: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
    
        QUART_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
    
        // *** quint
        QUINT_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
    
        QUINT_EASEOUT: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
    
        QUINT_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
    
        // *** sin
        SIN_EASEIN: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
    
        SIN_EASEOUT: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
    
        SIN_EASEINOUT: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
    
        // *** circ
        CIRC_EASEIN: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
    
        CIRC_EASEOUT: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
    
        CIRC_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
    
        // *** elastic
        ELASTIC_EASEIN: function(t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ((t /= d) === 1) {
                return b + c;
            }
    
            if (!p) {
                p = d * 0.3;
            }
    
            var s;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
    
        ELASTIC_EASEOUT: function(t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ((t /= d) === 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            var s;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
    
        ELASTIC_EASEINOUT: function(t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ((t /= d / 2) === 2) {
                return b + c;
            }
            if (!p) {
                p = d * (0.3 * 1.5);
            }
            var s;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
    
        // *** bounce
        BOUNCE_EASEOUT: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
    
        BOUNCE_EASEIN: function(t, b, c, d) {
            return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
        },
    
        BOUNCE_EASEINOUT: function(t, b, c, d) {
            if (t < d / 2) {
                return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
            } else {
                return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
    
        },
    
        // *** back
        BACK_EASEIN: function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
    
        BACK_EASEOUT: function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
    
        BACK_EASEINOUT: function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
    
        // *** expo
        EXPO_EASEIN: function(t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
    
        EXPO_EASEOUT: function(t, b, c, d) {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
    
        EXPO_EASEINOUT: function(t, b, c, d) {
            if (t === 0) {
                return b;
            }
            if (t === d) {
                return b + c;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
    
    /**
     * @scope enchant.ActionEventTarget.prototype
     */
    enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.ActionEventTarget
         * @class
         * EventTarget which can change the context of event listeners.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function() {
            enchant.EventTarget.apply(this, arguments);
        },
        dispatchEvent: function(e) {
            var target = this.node ? this.node : this;
    
            e.target = target;
            e.localX = e.x - target._offsetX;
            e.localY = e.y - target._offsetY;
    
            if (this['on' + e.type] != null) {
                this['on' + e.type].call(target, e);
            }
            var listeners = this._listeners[e.type];
            if (listeners != null) {
                listeners = listeners.slice();
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(target, e);
                }
            }
        }
    });
    
    /**
     * @scope enchant.Timeline.prototype
     */
    enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Timeline
         * @class
         * Time-line class.
         * Class for managing the action.
         *
         * For one node to manipulate the timeline of one must correspond.
         * Time-line class has a method to add a variety of actions to himself,
         * entities can be animated and various operations by using these briefly.
         * You can choose time based and frame based(default) animation.
         * @param {enchant.Node} node target node.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(node) {
            enchant.EventTarget.call(this);
            this.node = node;
            this.queue = [];
            this.paused = false;
            this.looped = false;
            this.isFrameBased = true;
            this._parallel = null;
            this._activated = false;

            this.addEventListener(enchant.Event.ENTER_FRAME, this._onenterframe);

            var tl = this;
            this._nodeEventListener = function(e) {
                tl.dispatchEvent(e);
            };
        },

        _deactivateTimeline: function() {
            if (this._activated) {
                this._activated = false;
                this.node.removeEventListener('enterframe', this._nodeEventListener);
            }
        },

        _activateTimeline: function() {
            if (!this._activated && !this.paused) {
                this.node.addEventListener('enterframe', this._nodeEventListener);
                this._activated = true;
            }
        },

        _onenterframe: function(evt) {
            if (this.paused || this.queue.length === 0) {
                return;
            }
            this.tick(this.isFrameBased ? 1 : evt.elapsed);
        },

        setFrameBased: function() {
            this.isFrameBased = true;
        },

        setTimeBased: function() {
            this.isFrameBased = false;
        },

        next: function(remainingTime) {
            var action = this.queue.shift();
            var e;

            if (action) {
                e = new enchant.Event('actionend');
                e.timeline = this;
                action.dispatchEvent(e);

                e = new enchant.Event('removedfromtimeline');
                e.timeline = this;
                action.dispatchEvent(e);

                if (this.looped) {
                    this.add(action);
                }
            }

            var nextAction = this.queue[0];
            if (!nextAction) {
                this._deactivateTimeline();
                return;
            }

            if (remainingTime > 0 || nextAction.time === 0) {
                var event = new enchant.Event('actiontick');
                event.elapsed = remainingTime;
                event.timeline = this;
                nextAction.dispatchEvent(event);
            }
        },

        tick: function(elapsed) {
            var action = this.queue[0];
            if (!action) {
                return;
            }

            if (action.frame === 0) {
                var startEvent = new enchant.Event('actionstart');
                startEvent.timeline = this;
                action.dispatchEvent(startEvent);
            }

            var e = new enchant.Event('actiontick');
            e.timeline = this;
            e.elapsed = elapsed;
            action.dispatchEvent(e);
        },

        add: function(action) {
            this._activateTimeline();

            if (this._parallel) {
                this._parallel.actions.push(action);
                this._parallel = null;
            } else {
                this.queue.push(action);
            }

            action.frame = 0;

            var e = new enchant.Event('addedtotimeline');
            e.timeline = this;
            action.dispatchEvent(e);

            e = new enchant.Event('actionadded');
            e.action = action;
            this.dispatchEvent(e);

            return this;
        },

        action: function(params) {
            return this.add(new enchant.Action(params));
        },

        tween: function(params) {
            return this.add(new enchant.Tween(params));
        },

        clear: function() {
            var e = new enchant.Event('removedfromtimeline');
            e.timeline = this;

            var q = this.queue;
            for (var i = 0, len = q.length; i < len; i++) {
                q[i].dispatchEvent(e);
            }
            this.queue = [];
            this._deactivateTimeline();
            return this;
        },

        /**
         * @param {Number} frames
         * @return {enchant.Timeline}
         */
        skip: function(frames) {
            // Event を毎ループ new しない（1つだけ使い回す）
            var event = new enchant.Event("enterframe");

            if (this.isFrameBased) {
                event.elapsed = 1;
            } else {
                event.elapsed = frames;
                frames = 1;
            }

            // while より for の方が JIT 最適化されやすい
            for (var i = 0; i < frames; i++) {
                this.dispatchEvent(event);
            }
            return this;
        },

        pause: function() {
            if (!this.paused) {
                this.paused = true;
                this._deactivateTimeline();
            }
            return this;
        },

        resume: function() {
            if (this.paused) {
                this.paused = false;
                this._activateTimeline();
            }
            return this;
        },

        loop: function() {
            this.looped = true;
            return this;
        },

        unloop: function() {
            this.looped = false;
            return this;
        },

        delay: function(time) {
            return this.action({ time: time });
        },

        wait: function(time) {
            // reserved
            return this;
        },

        then: function(func) {
            return this.action({
                onactiontick: function(evt) {
                    func.call(this);
                },
                time: 0
            });
        },

        exec: function(func) {
            return this.then(func);
        },

        cue: function(cue) {
            var ptr = 0;
            // for-in は遅いので keys() を使う
            var keys = Object.keys(cue);
            for (var i = 0, len = keys.length; i < len; i++) {
                var frame = keys[i] | 0; // 数値化
                this.delay(frame - ptr);
                this.then(cue[frame]);
                ptr = frame;
            }
            return this;
        },

        repeat: function(func, time) {
            return this.action({
                onactiontick: function(evt) {
                    func.call(this);
                },
                time: time
            });
        },

        and: function() {
            var last = this.queue.pop();

            if (last instanceof enchant.ParallelAction) {
                this._parallel = last;
                this.queue.push(last);
            } else {
                var parallel = new enchant.ParallelAction();
                parallel.actions.push(last);
                this.queue.push(parallel);
                this._parallel = parallel;
            }
            return this;
        },

        or: function() {
            return this;
        },

        doAll: function(children) {
            return this;
        },

        waitAll: function() {
            return this;
        },

        waitUntil: function(func) {
            return this.action({
                onactiontick: function(evt) {
                    if (func.call(this)) {
                        evt.timeline.next();
                    }
                }
            });
        },

        fadeTo: function(opacity, time, easing) {
            return this.tween({
                opacity: opacity,
                time: time,
                easing: easing
            });
        },

        fadeIn: function(time, easing) {
            return this.fadeTo(1, time, easing);
        },

        fadeOut: function(time, easing) {
            return this.fadeTo(0, time, easing);
        },

        moveTo: function(x, y, time, easing) {
            return this.tween({ x, y, time, easing });
        },

        moveX: function(x, time, easing) {
            return this.tween({ x, time, easing });
        },

        moveY: function(y, time, easing) {
            return this.tween({ y, time, easing });
        },

        moveBy: function(x, y, time, easing) {
            // クロージャ生成は必要最小限に
            return this.tween({
                x: function() { return this.x + x; },
                y: function() { return this.y + y; },
                time,
                easing
            });
        },

        hide: function() {
            return this.then(function() { this.opacity = 0; });
        },

        show: function() {
            return this.then(function() { this.opacity = 1; });
        },

        removeFromScene: function() {
            return this.then(function() {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            });
        },

        scaleTo: function(scale, time, easing) {
            // 元コードの「引数の型で分岐」を高速化
            var scaleX, scaleY;

            if (typeof easing === "number") {
                // scaleTo(x, y, time, easing)
                scaleX = scale;
                scaleY = time;
                time   = easing;
                easing = arguments[4];
            } else {
                // scaleTo(scale, time, easing)
                scaleX = scaleY = scale;
            }

            return this.tween({ scaleX, scaleY, time, easing });
        },

        scaleBy: function(scale, time, easing) {
            var scaleX, scaleY;

            if (typeof easing === "number") {
                scaleX = scale;
                scaleY = time;
                time   = easing;
                easing = arguments[4];
            } else {
                scaleX = scaleY = scale;
            }

            return this.tween({
                scaleX: function() { return this.scaleX * scaleX; },
                scaleY: function() { return this.scaleY * scaleY; },
                time,
                easing
            });
        },

        rotateTo: function(deg, time, easing) {
            return this.tween({ rotation: deg, time, easing });
        },

        rotateBy: function(deg, time, easing) {
            return this.tween({
                rotation: function() { return this.rotation + deg; },
                time,
                easing
            });
        }

    });
    
    /**
     * @scope enchant.Action.prototype
     */
    enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
        initialize: function(param) {
            enchant.ActionEventTarget.call(this);

            this.time = null;
            this.frame = 0;

            // param のコピーを高速化
            if (param) {
                var keys = Object.keys(param);
                for (var i = 0, len = keys.length; i < len; i++) {
                    var k = keys[i];
                    var v = param[k];
                    if (v != null) {
                        this[k] = v;
                    }
                }
            }

            this.timeline = null;
            this.node = null;

            // ★ リスナーはインスタンスごとに1回だけ生成
            var self = this;

            this._onAdded = function(evt) {
                self.timeline = evt.timeline;
                self.node = evt.timeline.node;
                self.frame = 0;
            };

            this._onRemoved = function() {
                self.timeline = null;
                self.node = null;
                self.frame = 0;
            };

            this._onTick = function(evt) {
                var t = self.time;
                var f = self.frame + evt.elapsed;

                if (t != null && f >= t) {
                    // 終了
                    self.frame = t;
                    evt.timeline.next(f - t); // 残り時間を渡す
                } else {
                    self.frame = f;
                }
            };

            this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, this._onAdded);
            this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, this._onRemoved);
            this.addEventListener(enchant.Event.ACTION_TICK, this._onTick);
        }
    });

    
    /**
     * @scope enchant.ParallelAction.prototype
     */
    enchant.ParallelAction = enchant.Class.create(enchant.Action, {
        initialize: function(param) {
            enchant.Action.call(this, param);

            this.actions = [];
            this.endedActions = [];

            var self = this;

            // ACTION_START
            this.addEventListener(enchant.Event.ACTION_START, function(evt) {
                var acts = self.actions;
                for (var i = 0, len = acts.length; i < len; i++) {
                    acts[i].dispatchEvent(evt);
                }
            });

            // ACTION_TICK
            this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
                var acts = self.actions;
                var i = 0;
                var len = acts.length;

                while (i < len) {

                    // ★ timeline は毎回 new（安全）
                    var timeline = {
                        next: function(remaining) {
                            var action = acts[this._i];
                            acts.splice(this._i--, 1);
                            len = acts.length;
                            self.endedActions.push(action);

                            var e1 = new enchant.Event("actionend");
                            e1.timeline = this;
                            action.dispatchEvent(e1);

                            var e2 = new enchant.Event("removedfromtimeline");
                            e2.timeline = this;
                            action.dispatchEvent(e2);
                        },
                        _i: i
                    };

                    // ★ tick イベントも毎回 new（安全）
                    var tick = new enchant.Event("actiontick");
                    tick.timeline = timeline;
                    tick.elapsed = evt.elapsed;

                    acts[i].dispatchEvent(tick);

                    i++;
                }

                if (acts.length === 0) {
                    evt.timeline.next();
                }
            });

            // ADDED_TO_TIMELINE
            this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
                var acts = self.actions;
                for (var i = 0, len = acts.length; i < len; i++) {
                    acts[i].dispatchEvent(evt);
                }
            });

            // REMOVED_FROM_TIMELINE
            this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
                self.actions = self.endedActions;
                self.endedActions = [];
            });
        }
    });


    
    /**
     * @scope enchant.Tween.prototype
     */
    enchant.Tween = enchant.Class.create(enchant.Action, {
        initialize: function(params) {
            var origin = {};
            var target = {};

            enchant.Action.call(this, params);

            if (this.easing == null) {
                this.easing = enchant.Easing.LINEAR;
            }

            var tween = this;

            // 除外プロパティは配列＋indexOf ではなくマップで判定
            var excluded = {
                frame: true,
                time: true,
                callback: true,
                onactiontick: true,
                onactionstart: true,
                onactionend: true
            };

            // 対象プロパティ名だけを事前に抽出しておく（毎フレーム for-in しない）
            var propNames = [];
            if (params) {
                var keys = Object.keys(params);
                for (var i = 0, len = keys.length; i < len; i++) {
                    var prop = keys[i];
                    if (!excluded[prop]) {
                        propNames.push(prop);
                    }
                }
            }

            this.addEventListener(enchant.Event.ACTION_START, function() {
                // origin / target を開始時に確定
                for (var i = 0, len = propNames.length; i < len; i++) {
                    var prop = propNames[i];

                    var v = params[prop];
                    var targetVal = (typeof v === "function") ? v.call(tween.node) : v;

                    origin[prop] = tween.node[prop];
                    target[prop] = targetVal;
                }
            });

            this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
                var t = tween.time;
                var f = tween.frame;
                var elapsed = evt.elapsed;
                var easing = tween.easing;

                // time が 0 のときは即座に目標値へ
                var ratio;
                if (t === 0) {
                    ratio = 1;
                } else {
                    var nf = Math.min(t, f + elapsed);
                    var e1 = easing(nf, 0, 1, t);
                    var e0 = easing(f, 0, 1, t);
                    ratio = e1 - e0;
                }

                for (var i = 0, len = propNames.length; i < len; i++) {
                    var prop = propNames[i];

                    // this は node を指す前提（元コードと同じ）
                    if (typeof this[prop] === "undefined") {
                        continue;
                    }

                    var o = origin[prop];
                    var tg = target[prop];

                    tween.node[prop] += (tg - o) * ratio;

                    if (Math.abs(tween.node[prop]) < 10e-8) {
                        tween.node[prop] = 0;
                    }
                }
            });
        }
    });

    
    }(window));