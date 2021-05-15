// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/reflect-metadata/Reflect.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;

(function (Reflect) {
  // Metadata Proposal
  // https://rbuckton.github.io/reflect-metadata/
  (function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : Function("return this;")();
    var exporter = makeExporter(Reflect);

    if (typeof root.Reflect === "undefined") {
      root.Reflect = Reflect;
    } else {
      exporter = makeExporter(root.Reflect, exporter);
    }

    factory(exporter);

    function makeExporter(target, previous) {
      return function (key, value) {
        if (typeof target[key] !== "function") {
          Object.defineProperty(target, key, {
            configurable: true,
            writable: true,
            value: value
          });
        }

        if (previous) previous(key, value);
      };
    }
  })(function (exporter) {
    var hasOwn = Object.prototype.hasOwnProperty; // feature test for Symbol support

    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support

    var supportsProto = {
      __proto__: []
    } instanceof Array; // feature test for __proto__ support

    var downLevel = !supportsCreate && !supportsProto;
    var HashMap = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: supportsCreate ? function () {
        return MakeDictionary(Object.create(null));
      } : supportsProto ? function () {
        return MakeDictionary({
          __proto__: null
        });
      } : function () {
        return MakeDictionary({});
      },
      has: downLevel ? function (map, key) {
        return hasOwn.call(map, key);
      } : function (map, key) {
        return key in map;
      },
      get: downLevel ? function (map, key) {
        return hasOwn.call(map, key) ? map[key] : undefined;
      } : function (map, key) {
        return map[key];
      }
    }; // Load global or shim versions of Map, Set, and WeakMap

    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && undefined === "true";

    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();

    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();

    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill(); // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots


    var Metadata = new _WeakMap();
    /**
     * Applies a set of decorators to a property of a target object.
     * @param decorators An array of decorators.
     * @param target The target object.
     * @param propertyKey (Optional) The property key to decorate.
     * @param attributes (Optional) The property descriptor for the target key.
     * @remarks Decorators are applied in reverse order.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     Example = Reflect.decorate(decoratorsArray, Example);
     *
     *     // property (on constructor)
     *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
     *
     *     // property (on prototype)
     *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
     *
     *     // method (on constructor)
     *     Object.defineProperty(Example, "staticMethod",
     *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
     *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
     *
     *     // method (on prototype)
     *     Object.defineProperty(Example.prototype, "method",
     *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
     *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
     *
     */

    function decorate(decorators, target, propertyKey, attributes) {
      if (!IsUndefined(propertyKey)) {
        if (!IsArray(decorators)) throw new TypeError();
        if (!IsObject(target)) throw new TypeError();
        if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
        if (IsNull(attributes)) attributes = undefined;
        propertyKey = ToPropertyKey(propertyKey);
        return DecorateProperty(decorators, target, propertyKey, attributes);
      } else {
        if (!IsArray(decorators)) throw new TypeError();
        if (!IsConstructor(target)) throw new TypeError();
        return DecorateConstructor(decorators, target);
      }
    }

    exporter("decorate", decorate); // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata

    /**
     * A default metadata decorator factory that can be used on a class, class member, or parameter.
     * @param metadataKey The key for the metadata entry.
     * @param metadataValue The value for the metadata entry.
     * @returns A decorator function.
     * @remarks
     * If `metadataKey` is already defined for the target and target key, the
     * metadataValue for that key will be overwritten.
     * @example
     *
     *     // constructor
     *     @Reflect.metadata(key, value)
     *     class Example {
     *     }
     *
     *     // property (on constructor, TypeScript only)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         static staticProperty;
     *     }
     *
     *     // property (on prototype, TypeScript only)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         property;
     *     }
     *
     *     // method (on constructor)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         static staticMethod() { }
     *     }
     *
     *     // method (on prototype)
     *     class Example {
     *         @Reflect.metadata(key, value)
     *         method() { }
     *     }
     *
     */

    function metadata(metadataKey, metadataValue) {
      function decorator(target, propertyKey) {
        if (!IsObject(target)) throw new TypeError();
        if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
        OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
      }

      return decorator;
    }

    exporter("metadata", metadata);
    /**
     * Define a unique metadata entry on the target.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param metadataValue A value that contains attached metadata.
     * @param target The target object on which to define metadata.
     * @param propertyKey (Optional) The property key for the target.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     Reflect.defineMetadata("custom:annotation", options, Example);
     *
     *     // property (on constructor)
     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
     *
     *     // property (on prototype)
     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
     *
     *     // method (on constructor)
     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
     *
     *     // method (on prototype)
     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
     *
     *     // decorator factory as metadata-producing annotation.
     *     function MyAnnotation(options): Decorator {
     *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
     *     }
     *
     */

    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }

    exporter("defineMetadata", defineMetadata);
    /**
     * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.hasMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function hasMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }

    exporter("hasMetadata", hasMetadata);
    /**
     * Gets a value indicating whether the target object has the provided metadata key defined.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function hasOwnMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }

    exporter("hasOwnMetadata", hasOwnMetadata);
    /**
     * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function getMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }

    exporter("getMetadata", getMetadata);
    /**
     * Gets the metadata value for the provided metadata key on the target object.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getOwnMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function getOwnMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }

    exporter("getOwnMetadata", getOwnMetadata);
    /**
     * Gets the metadata keys defined on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns An array of unique metadata keys.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getMetadataKeys(Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getMetadataKeys(Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getMetadataKeys(Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getMetadataKeys(Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getMetadataKeys(Example.prototype, "method");
     *
     */

    function getMetadataKeys(target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryMetadataKeys(target, propertyKey);
    }

    exporter("getMetadataKeys", getMetadataKeys);
    /**
     * Gets the unique metadata keys defined on the target object.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns An array of unique metadata keys.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.getOwnMetadataKeys(Example);
     *
     *     // property (on constructor)
     *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
     *
     */

    function getOwnMetadataKeys(target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      return OrdinaryOwnMetadataKeys(target, propertyKey);
    }

    exporter("getOwnMetadataKeys", getOwnMetadataKeys);
    /**
     * Deletes the metadata entry from the target object with the provided key.
     * @param metadataKey A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey (Optional) The property key for the target.
     * @returns `true` if the metadata entry was found and deleted; otherwise, false.
     * @example
     *
     *     class Example {
     *         // property declarations are not part of ES6, though they are valid in TypeScript:
     *         // static staticProperty;
     *         // property;
     *
     *         constructor(p) { }
     *         static staticMethod(p) { }
     *         method(p) { }
     *     }
     *
     *     // constructor
     *     result = Reflect.deleteMetadata("custom:annotation", Example);
     *
     *     // property (on constructor)
     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
     *
     *     // property (on prototype)
     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
     *
     *     // method (on constructor)
     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
     *
     *     // method (on prototype)
     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
     *
     */

    function deleteMetadata(metadataKey, target, propertyKey) {
      if (!IsObject(target)) throw new TypeError();
      if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
      var metadataMap = GetOrCreateMetadataMap(target, propertyKey,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return false;
      if (!metadataMap.delete(metadataKey)) return false;
      if (metadataMap.size > 0) return true;
      var targetMetadata = Metadata.get(target);
      targetMetadata.delete(propertyKey);
      if (targetMetadata.size > 0) return true;
      Metadata.delete(target);
      return true;
    }

    exporter("deleteMetadata", deleteMetadata);

    function DecorateConstructor(decorators, target) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target);

        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsConstructor(decorated)) throw new TypeError();
          target = decorated;
        }
      }

      return target;
    }

    function DecorateProperty(decorators, target, propertyKey, descriptor) {
      for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        var decorated = decorator(target, propertyKey, descriptor);

        if (!IsUndefined(decorated) && !IsNull(decorated)) {
          if (!IsObject(decorated)) throw new TypeError();
          descriptor = decorated;
        }
      }

      return descriptor;
    }

    function GetOrCreateMetadataMap(O, P, Create) {
      var targetMetadata = Metadata.get(O);

      if (IsUndefined(targetMetadata)) {
        if (!Create) return undefined;
        targetMetadata = new _Map();
        Metadata.set(O, targetMetadata);
      }

      var metadataMap = targetMetadata.get(P);

      if (IsUndefined(metadataMap)) {
        if (!Create) return undefined;
        metadataMap = new _Map();
        targetMetadata.set(P, metadataMap);
      }

      return metadataMap;
    } // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata


    function OrdinaryHasMetadata(MetadataKey, O, P) {
      var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) return true;
      var parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
      return false;
    } // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata


    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return false;
      return ToBoolean(metadataMap.has(MetadataKey));
    } // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata


    function OrdinaryGetMetadata(MetadataKey, O, P) {
      var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
      if (hasOwn) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
      var parent = OrdinaryGetPrototypeOf(O);
      if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
      return undefined;
    } // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata


    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return undefined;
      return metadataMap.get(MetadataKey);
    } // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata


    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      true);
      metadataMap.set(MetadataKey, MetadataValue);
    } // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys


    function OrdinaryMetadataKeys(O, P) {
      var ownKeys = OrdinaryOwnMetadataKeys(O, P);
      var parent = OrdinaryGetPrototypeOf(O);
      if (parent === null) return ownKeys;
      var parentKeys = OrdinaryMetadataKeys(parent, P);
      if (parentKeys.length <= 0) return ownKeys;
      if (ownKeys.length <= 0) return parentKeys;
      var set = new _Set();
      var keys = [];

      for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
        var key = ownKeys_1[_i];
        var hasKey = set.has(key);

        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }

      for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
        var key = parentKeys_1[_a];
        var hasKey = set.has(key);

        if (!hasKey) {
          set.add(key);
          keys.push(key);
        }
      }

      return keys;
    } // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys


    function OrdinaryOwnMetadataKeys(O, P) {
      var keys = [];
      var metadataMap = GetOrCreateMetadataMap(O, P,
      /*Create*/
      false);
      if (IsUndefined(metadataMap)) return keys;
      var keysObj = metadataMap.keys();
      var iterator = GetIterator(keysObj);
      var k = 0;

      while (true) {
        var next = IteratorStep(iterator);

        if (!next) {
          keys.length = k;
          return keys;
        }

        var nextValue = IteratorValue(next);

        try {
          keys[k] = nextValue;
        } catch (e) {
          try {
            IteratorClose(iterator);
          } finally {
            throw e;
          }
        }

        k++;
      }
    } // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values


    function Type(x) {
      if (x === null) return 1
      /* Null */
      ;

      switch (typeof x) {
        case "undefined":
          return 0
          /* Undefined */
          ;

        case "boolean":
          return 2
          /* Boolean */
          ;

        case "string":
          return 3
          /* String */
          ;

        case "symbol":
          return 4
          /* Symbol */
          ;

        case "number":
          return 5
          /* Number */
          ;

        case "object":
          return x === null ? 1
          /* Null */
          : 6
          /* Object */
          ;

        default:
          return 6
          /* Object */
          ;
      }
    } // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type


    function IsUndefined(x) {
      return x === undefined;
    } // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type


    function IsNull(x) {
      return x === null;
    } // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type


    function IsSymbol(x) {
      return typeof x === "symbol";
    } // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type


    function IsObject(x) {
      return typeof x === "object" ? x !== null : typeof x === "function";
    } // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive


    function ToPrimitive(input, PreferredType) {
      switch (Type(input)) {
        case 0
        /* Undefined */
        :
          return input;

        case 1
        /* Null */
        :
          return input;

        case 2
        /* Boolean */
        :
          return input;

        case 3
        /* String */
        :
          return input;

        case 4
        /* Symbol */
        :
          return input;

        case 5
        /* Number */
        :
          return input;
      }

      var hint = PreferredType === 3
      /* String */
      ? "string" : PreferredType === 5
      /* Number */
      ? "number" : "default";
      var exoticToPrim = GetMethod(input, toPrimitiveSymbol);

      if (exoticToPrim !== undefined) {
        var result = exoticToPrim.call(input, hint);
        if (IsObject(result)) throw new TypeError();
        return result;
      }

      return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    } // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive


    function OrdinaryToPrimitive(O, hint) {
      if (hint === "string") {
        var toString_1 = O.toString;

        if (IsCallable(toString_1)) {
          var result = toString_1.call(O);
          if (!IsObject(result)) return result;
        }

        var valueOf = O.valueOf;

        if (IsCallable(valueOf)) {
          var result = valueOf.call(O);
          if (!IsObject(result)) return result;
        }
      } else {
        var valueOf = O.valueOf;

        if (IsCallable(valueOf)) {
          var result = valueOf.call(O);
          if (!IsObject(result)) return result;
        }

        var toString_2 = O.toString;

        if (IsCallable(toString_2)) {
          var result = toString_2.call(O);
          if (!IsObject(result)) return result;
        }
      }

      throw new TypeError();
    } // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean


    function ToBoolean(argument) {
      return !!argument;
    } // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring


    function ToString(argument) {
      return "" + argument;
    } // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey


    function ToPropertyKey(argument) {
      var key = ToPrimitive(argument, 3
      /* String */
      );
      if (IsSymbol(key)) return key;
      return ToString(key);
    } // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray


    function IsArray(argument) {
      return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
    } // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable


    function IsCallable(argument) {
      // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
      return typeof argument === "function";
    } // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor


    function IsConstructor(argument) {
      // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
      return typeof argument === "function";
    } // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey


    function IsPropertyKey(argument) {
      switch (Type(argument)) {
        case 3
        /* String */
        :
          return true;

        case 4
        /* Symbol */
        :
          return true;

        default:
          return false;
      }
    } // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod


    function GetMethod(V, P) {
      var func = V[P];
      if (func === undefined || func === null) return undefined;
      if (!IsCallable(func)) throw new TypeError();
      return func;
    } // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects


    function GetIterator(obj) {
      var method = GetMethod(obj, iteratorSymbol);
      if (!IsCallable(method)) throw new TypeError(); // from Call

      var iterator = method.call(obj);
      if (!IsObject(iterator)) throw new TypeError();
      return iterator;
    } // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue


    function IteratorValue(iterResult) {
      return iterResult.value;
    } // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep


    function IteratorStep(iterator) {
      var result = iterator.next();
      return result.done ? false : result;
    } // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose


    function IteratorClose(iterator) {
      var f = iterator["return"];
      if (f) f.call(iterator);
    } // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof


    function OrdinaryGetPrototypeOf(O) {
      var proto = Object.getPrototypeOf(O);
      if (typeof O !== "function" || O === functionPrototype) return proto; // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
      // Try to determine the superclass constructor. Compatible implementations
      // must either set __proto__ on a subclass constructor to the superclass constructor,
      // or ensure each class has a valid `constructor` property on its prototype that
      // points back to the constructor.
      // If this is not the same as Function.[[Prototype]], then this is definately inherited.
      // This is the case when in ES6 or when using __proto__ in a compatible browser.

      if (proto !== functionPrototype) return proto; // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.

      var prototype = O.prototype;
      var prototypeProto = prototype && Object.getPrototypeOf(prototype);
      if (prototypeProto == null || prototypeProto === Object.prototype) return proto; // If the constructor was not a function, then we cannot determine the heritage.

      var constructor = prototypeProto.constructor;
      if (typeof constructor !== "function") return proto; // If we have some kind of self-reference, then we cannot determine the heritage.

      if (constructor === O) return proto; // we have a pretty good guess at the heritage.

      return constructor;
    } // naive Map shim


    function CreateMapPolyfill() {
      var cacheSentinel = {};
      var arraySentinel = [];

      var MapIterator =
      /** @class */
      function () {
        function MapIterator(keys, values, selector) {
          this._index = 0;
          this._keys = keys;
          this._values = values;
          this._selector = selector;
        }

        MapIterator.prototype["@@iterator"] = function () {
          return this;
        };

        MapIterator.prototype[iteratorSymbol] = function () {
          return this;
        };

        MapIterator.prototype.next = function () {
          var index = this._index;

          if (index >= 0 && index < this._keys.length) {
            var result = this._selector(this._keys[index], this._values[index]);

            if (index + 1 >= this._keys.length) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            } else {
              this._index++;
            }

            return {
              value: result,
              done: false
            };
          }

          return {
            value: undefined,
            done: true
          };
        };

        MapIterator.prototype.throw = function (error) {
          if (this._index >= 0) {
            this._index = -1;
            this._keys = arraySentinel;
            this._values = arraySentinel;
          }

          throw error;
        };

        MapIterator.prototype.return = function (value) {
          if (this._index >= 0) {
            this._index = -1;
            this._keys = arraySentinel;
            this._values = arraySentinel;
          }

          return {
            value: value,
            done: true
          };
        };

        return MapIterator;
      }();

      return (
        /** @class */
        function () {
          function Map() {
            this._keys = [];
            this._values = [];
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          }

          Object.defineProperty(Map.prototype, "size", {
            get: function () {
              return this._keys.length;
            },
            enumerable: true,
            configurable: true
          });

          Map.prototype.has = function (key) {
            return this._find(key,
            /*insert*/
            false) >= 0;
          };

          Map.prototype.get = function (key) {
            var index = this._find(key,
            /*insert*/
            false);

            return index >= 0 ? this._values[index] : undefined;
          };

          Map.prototype.set = function (key, value) {
            var index = this._find(key,
            /*insert*/
            true);

            this._values[index] = value;
            return this;
          };

          Map.prototype.delete = function (key) {
            var index = this._find(key,
            /*insert*/
            false);

            if (index >= 0) {
              var size = this._keys.length;

              for (var i = index + 1; i < size; i++) {
                this._keys[i - 1] = this._keys[i];
                this._values[i - 1] = this._values[i];
              }

              this._keys.length--;
              this._values.length--;

              if (key === this._cacheKey) {
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }

              return true;
            }

            return false;
          };

          Map.prototype.clear = function () {
            this._keys.length = 0;
            this._values.length = 0;
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          };

          Map.prototype.keys = function () {
            return new MapIterator(this._keys, this._values, getKey);
          };

          Map.prototype.values = function () {
            return new MapIterator(this._keys, this._values, getValue);
          };

          Map.prototype.entries = function () {
            return new MapIterator(this._keys, this._values, getEntry);
          };

          Map.prototype["@@iterator"] = function () {
            return this.entries();
          };

          Map.prototype[iteratorSymbol] = function () {
            return this.entries();
          };

          Map.prototype._find = function (key, insert) {
            if (this._cacheKey !== key) {
              this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
            }

            if (this._cacheIndex < 0 && insert) {
              this._cacheIndex = this._keys.length;

              this._keys.push(key);

              this._values.push(undefined);
            }

            return this._cacheIndex;
          };

          return Map;
        }()
      );

      function getKey(key, _) {
        return key;
      }

      function getValue(_, value) {
        return value;
      }

      function getEntry(key, value) {
        return [key, value];
      }
    } // naive Set shim


    function CreateSetPolyfill() {
      return (
        /** @class */
        function () {
          function Set() {
            this._map = new _Map();
          }

          Object.defineProperty(Set.prototype, "size", {
            get: function () {
              return this._map.size;
            },
            enumerable: true,
            configurable: true
          });

          Set.prototype.has = function (value) {
            return this._map.has(value);
          };

          Set.prototype.add = function (value) {
            return this._map.set(value, value), this;
          };

          Set.prototype.delete = function (value) {
            return this._map.delete(value);
          };

          Set.prototype.clear = function () {
            this._map.clear();
          };

          Set.prototype.keys = function () {
            return this._map.keys();
          };

          Set.prototype.values = function () {
            return this._map.values();
          };

          Set.prototype.entries = function () {
            return this._map.entries();
          };

          Set.prototype["@@iterator"] = function () {
            return this.keys();
          };

          Set.prototype[iteratorSymbol] = function () {
            return this.keys();
          };

          return Set;
        }()
      );
    } // naive WeakMap shim


    function CreateWeakMapPolyfill() {
      var UUID_SIZE = 16;
      var keys = HashMap.create();
      var rootKey = CreateUniqueKey();
      return (
        /** @class */
        function () {
          function WeakMap() {
            this._key = CreateUniqueKey();
          }

          WeakMap.prototype.has = function (target) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            false);
            return table !== undefined ? HashMap.has(table, this._key) : false;
          };

          WeakMap.prototype.get = function (target) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            false);
            return table !== undefined ? HashMap.get(table, this._key) : undefined;
          };

          WeakMap.prototype.set = function (target, value) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            true);
            table[this._key] = value;
            return this;
          };

          WeakMap.prototype.delete = function (target) {
            var table = GetOrCreateWeakMapTable(target,
            /*create*/
            false);
            return table !== undefined ? delete table[this._key] : false;
          };

          WeakMap.prototype.clear = function () {
            // NOTE: not a real clear, just makes the previous data unreachable
            this._key = CreateUniqueKey();
          };

          return WeakMap;
        }()
      );

      function CreateUniqueKey() {
        var key;

        do key = "@@WeakMap@@" + CreateUUID(); while (HashMap.has(keys, key));

        keys[key] = true;
        return key;
      }

      function GetOrCreateWeakMapTable(target, create) {
        if (!hasOwn.call(target, rootKey)) {
          if (!create) return undefined;
          Object.defineProperty(target, rootKey, {
            value: HashMap.create()
          });
        }

        return target[rootKey];
      }

      function FillRandomBytes(buffer, size) {
        for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 0xff | 0;

        return buffer;
      }

      function GenRandomBytes(size) {
        if (typeof Uint8Array === "function") {
          if (typeof crypto !== "undefined") return crypto.getRandomValues(new Uint8Array(size));
          if (typeof msCrypto !== "undefined") return msCrypto.getRandomValues(new Uint8Array(size));
          return FillRandomBytes(new Uint8Array(size), size);
        }

        return FillRandomBytes(new Array(size), size);
      }

      function CreateUUID() {
        var data = GenRandomBytes(UUID_SIZE); // mark as random - RFC 4122 § 4.4

        data[6] = data[6] & 0x4f | 0x40;
        data[8] = data[8] & 0xbf | 0x80;
        var result = "";

        for (var offset = 0; offset < UUID_SIZE; ++offset) {
          var byte = data[offset];
          if (offset === 4 || offset === 6 || offset === 8) result += "-";
          if (byte < 16) result += "0";
          result += byte.toString(16).toLowerCase();
        }

        return result;
      }
    } // uses a heuristic used by v8 and chakra to force an object into dictionary mode.


    function MakeDictionary(obj) {
      obj.__ = undefined;
      delete obj.__;
      return obj;
    }
  });
})(Reflect || (Reflect = {}));
},{"process":"node_modules/process/browser.js"}],"node_modules/tsyringe/dist/esm5/types/lifecycle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Lifecycle;

(function (Lifecycle) {
  Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
  Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
  Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
  Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));

var _default = Lifecycle;
exports.default = _default;
},{}],"node_modules/tsyringe/dist/esm5/types/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Lifecycle", {
  enumerable: true,
  get: function () {
    return _lifecycle.default;
  }
});

var _lifecycle = _interopRequireDefault(require("./lifecycle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./lifecycle":"node_modules/tsyringe/dist/esm5/types/lifecycle.js"}],"node_modules/tsyringe/node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__createBinding = __createBinding;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__classPrivateFieldGet = __classPrivateFieldGet;
exports.__classPrivateFieldSet = __classPrivateFieldSet;
exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

function __createBinding(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}

function __exportStar(m, exports) {
  for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

;

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result.default = mod;
  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}

function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  privateMap.set(receiver, value);
  return value;
}
},{}],"node_modules/tsyringe/dist/esm5/reflection-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParamInfo = getParamInfo;
exports.defineInjectionTokenMetadata = defineInjectionTokenMetadata;
exports.INJECTION_TOKEN_METADATA_KEY = void 0;
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
exports.INJECTION_TOKEN_METADATA_KEY = INJECTION_TOKEN_METADATA_KEY;

function getParamInfo(target) {
  var params = Reflect.getMetadata("design:paramtypes", target) || [];
  var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
  Object.keys(injectionTokens).forEach(function (key) {
    params[+key] = injectionTokens[key];
  });
  return params;
}

function defineInjectionTokenMetadata(data, transform) {
  return function (target, _propertyKey, parameterIndex) {
    var descriptors = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    descriptors[parameterIndex] = transform ? {
      token: data,
      transform: transform.transformToken,
      transformArgs: transform.args || []
    } : data;
    Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target);
  };
}
},{}],"node_modules/tsyringe/dist/esm5/providers/class-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClassProvider = isClassProvider;

function isClassProvider(provider) {
  return !!provider.useClass;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/factory-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFactoryProvider = isFactoryProvider;

function isFactoryProvider(provider) {
  return !!provider.useFactory;
}
},{}],"node_modules/tsyringe/dist/esm5/lazy-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = delay;
exports.DelayedConstructor = void 0;

var _tslib = require("tslib");

var DelayedConstructor = function () {
  function DelayedConstructor(wrap) {
    this.wrap = wrap;
    this.reflectMethods = ["get", "getPrototypeOf", "setPrototypeOf", "getOwnPropertyDescriptor", "defineProperty", "has", "set", "deleteProperty", "apply", "construct", "ownKeys"];
  }

  DelayedConstructor.prototype.createProxy = function (createObject) {
    var _this = this;

    var target = {};
    var init = false;
    var value;

    var delayedObject = function () {
      if (!init) {
        value = createObject(_this.wrap());
        init = true;
      }

      return value;
    };

    return new Proxy(target, this.createHandler(delayedObject));
  };

  DelayedConstructor.prototype.createHandler = function (delayedObject) {
    var handler = {};

    var install = function (name) {
      handler[name] = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        args[0] = delayedObject();
        var method = Reflect[name];
        return method.apply(void 0, (0, _tslib.__spread)(args));
      };
    };

    this.reflectMethods.forEach(install);
    return handler;
  };

  return DelayedConstructor;
}();

exports.DelayedConstructor = DelayedConstructor;

function delay(wrappedConstructor) {
  if (typeof wrappedConstructor === "undefined") {
    throw new Error("Attempt to `delay` undefined. Constructor must be wrapped in a callback");
  }

  return new DelayedConstructor(wrappedConstructor);
}
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js"}],"node_modules/tsyringe/dist/esm5/providers/injection-token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNormalToken = isNormalToken;
exports.isTokenDescriptor = isTokenDescriptor;
exports.isTransformDescriptor = isTransformDescriptor;
exports.isConstructorToken = isConstructorToken;

var _lazyHelpers = require("../lazy-helpers");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNormalToken(token) {
  return typeof token === "string" || _typeof(token) === "symbol";
}

function isTokenDescriptor(descriptor) {
  return _typeof(descriptor) === "object" && "token" in descriptor && "multiple" in descriptor;
}

function isTransformDescriptor(descriptor) {
  return _typeof(descriptor) === "object" && "token" in descriptor && "transform" in descriptor;
}

function isConstructorToken(token) {
  return typeof token === "function" || token instanceof _lazyHelpers.DelayedConstructor;
}
},{"../lazy-helpers":"node_modules/tsyringe/dist/esm5/lazy-helpers.js"}],"node_modules/tsyringe/dist/esm5/providers/token-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTokenProvider = isTokenProvider;

function isTokenProvider(provider) {
  return !!provider.useToken;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/value-provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValueProvider = isValueProvider;

function isValueProvider(provider) {
  return provider.useValue != undefined;
}
},{}],"node_modules/tsyringe/dist/esm5/providers/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isClassProvider", {
  enumerable: true,
  get: function () {
    return _classProvider.isClassProvider;
  }
});
Object.defineProperty(exports, "isFactoryProvider", {
  enumerable: true,
  get: function () {
    return _factoryProvider.isFactoryProvider;
  }
});
Object.defineProperty(exports, "isNormalToken", {
  enumerable: true,
  get: function () {
    return _injectionToken.isNormalToken;
  }
});
Object.defineProperty(exports, "isTokenProvider", {
  enumerable: true,
  get: function () {
    return _tokenProvider.isTokenProvider;
  }
});
Object.defineProperty(exports, "isValueProvider", {
  enumerable: true,
  get: function () {
    return _valueProvider.isValueProvider;
  }
});

var _classProvider = require("./class-provider");

var _factoryProvider = require("./factory-provider");

var _injectionToken = require("./injection-token");

var _tokenProvider = require("./token-provider");

var _valueProvider = require("./value-provider");
},{"./class-provider":"node_modules/tsyringe/dist/esm5/providers/class-provider.js","./factory-provider":"node_modules/tsyringe/dist/esm5/providers/factory-provider.js","./injection-token":"node_modules/tsyringe/dist/esm5/providers/injection-token.js","./token-provider":"node_modules/tsyringe/dist/esm5/providers/token-provider.js","./value-provider":"node_modules/tsyringe/dist/esm5/providers/value-provider.js"}],"node_modules/tsyringe/dist/esm5/providers/provider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isProvider = isProvider;

var _classProvider = require("./class-provider");

var _valueProvider = require("./value-provider");

var _tokenProvider = require("./token-provider");

var _factoryProvider = require("./factory-provider");

function isProvider(provider) {
  return (0, _classProvider.isClassProvider)(provider) || (0, _valueProvider.isValueProvider)(provider) || (0, _tokenProvider.isTokenProvider)(provider) || (0, _factoryProvider.isFactoryProvider)(provider);
}
},{"./class-provider":"node_modules/tsyringe/dist/esm5/providers/class-provider.js","./value-provider":"node_modules/tsyringe/dist/esm5/providers/value-provider.js","./token-provider":"node_modules/tsyringe/dist/esm5/providers/token-provider.js","./factory-provider":"node_modules/tsyringe/dist/esm5/providers/factory-provider.js"}],"node_modules/tsyringe/dist/esm5/registry-base.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var RegistryBase = function () {
  function RegistryBase() {
    this._registryMap = new Map();
  }

  RegistryBase.prototype.entries = function () {
    return this._registryMap.entries();
  };

  RegistryBase.prototype.getAll = function (key) {
    this.ensure(key);
    return this._registryMap.get(key);
  };

  RegistryBase.prototype.get = function (key) {
    this.ensure(key);

    var value = this._registryMap.get(key);

    return value[value.length - 1] || null;
  };

  RegistryBase.prototype.set = function (key, value) {
    this.ensure(key);

    this._registryMap.get(key).push(value);
  };

  RegistryBase.prototype.setAll = function (key, value) {
    this._registryMap.set(key, value);
  };

  RegistryBase.prototype.has = function (key) {
    this.ensure(key);
    return this._registryMap.get(key).length > 0;
  };

  RegistryBase.prototype.clear = function () {
    this._registryMap.clear();
  };

  RegistryBase.prototype.ensure = function (key) {
    if (!this._registryMap.has(key)) {
      this._registryMap.set(key, []);
    }
  };

  return RegistryBase;
}();

var _default = RegistryBase;
exports.default = _default;
},{}],"node_modules/tsyringe/dist/esm5/registry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tslib = require("tslib");

var _registryBase = _interopRequireDefault(require("./registry-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Registry = function (_super) {
  (0, _tslib.__extends)(Registry, _super);

  function Registry() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return Registry;
}(_registryBase.default);

var _default = Registry;
exports.default = _default;
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js","./registry-base":"node_modules/tsyringe/dist/esm5/registry-base.js"}],"node_modules/tsyringe/dist/esm5/resolution-context.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var ResolutionContext = function () {
  function ResolutionContext() {
    this.scopedResolutions = new Map();
  }

  return ResolutionContext;
}();

var _default = ResolutionContext;
exports.default = _default;
},{}],"node_modules/tsyringe/dist/esm5/error-helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatErrorCtor = formatErrorCtor;

var _tslib = require("tslib");

function formatDependency(params, idx) {
  if (params === null) {
    return "at position #" + idx;
  }

  var argName = params.split(",")[idx].trim();
  return "\"" + argName + "\" at position #" + idx;
}

function composeErrorMessage(msg, e, indent) {
  if (indent === void 0) {
    indent = "    ";
  }

  return (0, _tslib.__spread)([msg], e.message.split("\n").map(function (l) {
    return indent + l;
  })).join("\n");
}

function formatErrorCtor(ctor, paramIdx, error) {
  var _a = (0, _tslib.__read)(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2),
      _b = _a[1],
      params = _b === void 0 ? null : _b;

  var dep = formatDependency(params, paramIdx);
  return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js"}],"node_modules/tsyringe/dist/esm5/interceptors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PostResolutionInterceptors = exports.PreResolutionInterceptors = void 0;

var _tslib = require("tslib");

var _registryBase = _interopRequireDefault(require("./registry-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PreResolutionInterceptors = function (_super) {
  (0, _tslib.__extends)(PreResolutionInterceptors, _super);

  function PreResolutionInterceptors() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return PreResolutionInterceptors;
}(_registryBase.default);

exports.PreResolutionInterceptors = PreResolutionInterceptors;

var PostResolutionInterceptors = function (_super) {
  (0, _tslib.__extends)(PostResolutionInterceptors, _super);

  function PostResolutionInterceptors() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return PostResolutionInterceptors;
}(_registryBase.default);

exports.PostResolutionInterceptors = PostResolutionInterceptors;

var Interceptors = function () {
  function Interceptors() {
    this.preResolution = new PreResolutionInterceptors();
    this.postResolution = new PostResolutionInterceptors();
  }

  return Interceptors;
}();

var _default = Interceptors;
exports.default = _default;
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js","./registry-base":"node_modules/tsyringe/dist/esm5/registry-base.js"}],"node_modules/tsyringe/dist/esm5/dependency-container.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.instance = exports.typeInfo = void 0;

var _tslib = require("tslib");

var _providers = require("./providers");

var _provider = require("./providers/provider");

var _injectionToken = require("./providers/injection-token");

var _registry = _interopRequireDefault(require("./registry"));

var _lifecycle = _interopRequireDefault(require("./types/lifecycle"));

var _resolutionContext = _interopRequireDefault(require("./resolution-context"));

var _errorHelpers = require("./error-helpers");

var _lazyHelpers = require("./lazy-helpers");

var _interceptors = _interopRequireDefault(require("./interceptors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeInfo = new Map();
exports.typeInfo = typeInfo;

var InternalDependencyContainer = function () {
  function InternalDependencyContainer(parent) {
    this.parent = parent;
    this._registry = new _registry.default();
    this.interceptors = new _interceptors.default();
  }

  InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
    if (options === void 0) {
      options = {
        lifecycle: _lifecycle.default.Transient
      };
    }

    var provider;

    if (!(0, _provider.isProvider)(providerOrConstructor)) {
      provider = {
        useClass: providerOrConstructor
      };
    } else {
      provider = providerOrConstructor;
    }

    if ((0, _providers.isTokenProvider)(provider)) {
      var path = [token];
      var tokenProvider = provider;

      while (tokenProvider != null) {
        var currentToken = tokenProvider.useToken;

        if (path.includes(currentToken)) {
          throw new Error("Token registration cycle detected! " + (0, _tslib.__spread)(path, [currentToken]).join(" -> "));
        }

        path.push(currentToken);

        var registration = this._registry.get(currentToken);

        if (registration && (0, _providers.isTokenProvider)(registration.provider)) {
          tokenProvider = registration.provider;
        } else {
          tokenProvider = null;
        }
      }
    }

    if (options.lifecycle === _lifecycle.default.Singleton || options.lifecycle == _lifecycle.default.ContainerScoped || options.lifecycle == _lifecycle.default.ResolutionScoped) {
      if ((0, _providers.isValueProvider)(provider) || (0, _providers.isFactoryProvider)(provider)) {
        throw new Error("Cannot use lifecycle \"" + _lifecycle.default[options.lifecycle] + "\" with ValueProviders or FactoryProviders");
      }
    }

    this._registry.set(token, {
      provider: provider,
      options: options
    });

    return this;
  };

  InternalDependencyContainer.prototype.registerType = function (from, to) {
    if ((0, _providers.isNormalToken)(to)) {
      return this.register(from, {
        useToken: to
      });
    }

    return this.register(from, {
      useClass: to
    });
  };

  InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
    return this.register(token, {
      useValue: instance
    });
  };

  InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
    if ((0, _providers.isNormalToken)(from)) {
      if ((0, _providers.isNormalToken)(to)) {
        return this.register(from, {
          useToken: to
        }, {
          lifecycle: _lifecycle.default.Singleton
        });
      } else if (to) {
        return this.register(from, {
          useClass: to
        }, {
          lifecycle: _lifecycle.default.Singleton
        });
      }

      throw new Error('Cannot register a type name as a singleton without a "to" token');
    }

    var useClass = from;

    if (to && !(0, _providers.isNormalToken)(to)) {
      useClass = to;
    }

    return this.register(from, {
      useClass: useClass
    }, {
      lifecycle: _lifecycle.default.Singleton
    });
  };

  InternalDependencyContainer.prototype.resolve = function (token, context) {
    if (context === void 0) {
      context = new _resolutionContext.default();
    }

    var registration = this.getRegistration(token);

    if (!registration && (0, _providers.isNormalToken)(token)) {
      throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
    }

    this.executePreResolutionInterceptor(token, "Single");

    if (registration) {
      var result = this.resolveRegistration(registration, context);
      this.executePostResolutionInterceptor(token, result, "Single");
      return result;
    }

    if ((0, _injectionToken.isConstructorToken)(token)) {
      var result = this.construct(token, context);
      this.executePostResolutionInterceptor(token, result, "Single");
      return result;
    }

    throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
  };

  InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
    var e_1, _a;

    if (this.interceptors.preResolution.has(token)) {
      var remainingInterceptors = [];

      try {
        for (var _b = (0, _tslib.__values)(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var interceptor = _c.value;

          if (interceptor.options.frequency != "Once") {
            remainingInterceptors.push(interceptor);
          }

          interceptor.callback(token, resolutionType);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      this.interceptors.preResolution.setAll(token, remainingInterceptors);
    }
  };

  InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
    var e_2, _a;

    if (this.interceptors.postResolution.has(token)) {
      var remainingInterceptors = [];

      try {
        for (var _b = (0, _tslib.__values)(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var interceptor = _c.value;

          if (interceptor.options.frequency != "Once") {
            remainingInterceptors.push(interceptor);
          }

          interceptor.callback(token, result, resolutionType);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      this.interceptors.postResolution.setAll(token, remainingInterceptors);
    }
  };

  InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
    if (registration.options.lifecycle === _lifecycle.default.ResolutionScoped && context.scopedResolutions.has(registration)) {
      return context.scopedResolutions.get(registration);
    }

    var isSingleton = registration.options.lifecycle === _lifecycle.default.Singleton;
    var isContainerScoped = registration.options.lifecycle === _lifecycle.default.ContainerScoped;
    var returnInstance = isSingleton || isContainerScoped;
    var resolved;

    if ((0, _providers.isValueProvider)(registration.provider)) {
      resolved = registration.provider.useValue;
    } else if ((0, _providers.isTokenProvider)(registration.provider)) {
      resolved = returnInstance ? registration.instance || (registration.instance = this.resolve(registration.provider.useToken, context)) : this.resolve(registration.provider.useToken, context);
    } else if ((0, _providers.isClassProvider)(registration.provider)) {
      resolved = returnInstance ? registration.instance || (registration.instance = this.construct(registration.provider.useClass, context)) : this.construct(registration.provider.useClass, context);
    } else if ((0, _providers.isFactoryProvider)(registration.provider)) {
      resolved = registration.provider.useFactory(this);
    } else {
      resolved = this.construct(registration.provider, context);
    }

    if (registration.options.lifecycle === _lifecycle.default.ResolutionScoped) {
      context.scopedResolutions.set(registration, resolved);
    }

    return resolved;
  };

  InternalDependencyContainer.prototype.resolveAll = function (token, context) {
    var _this = this;

    if (context === void 0) {
      context = new _resolutionContext.default();
    }

    var registrations = this.getAllRegistrations(token);

    if (!registrations && (0, _providers.isNormalToken)(token)) {
      throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
    }

    this.executePreResolutionInterceptor(token, "All");

    if (registrations) {
      var result_1 = registrations.map(function (item) {
        return _this.resolveRegistration(item, context);
      });
      this.executePostResolutionInterceptor(token, result_1, "All");
      return result_1;
    }

    var result = [this.construct(token, context)];
    this.executePostResolutionInterceptor(token, result, "All");
    return result;
  };

  InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
    if (recursive === void 0) {
      recursive = false;
    }

    return this._registry.has(token) || recursive && (this.parent || false) && this.parent.isRegistered(token, true);
  };

  InternalDependencyContainer.prototype.reset = function () {
    this._registry.clear();

    this.interceptors.preResolution.clear();
    this.interceptors.postResolution.clear();
  };

  InternalDependencyContainer.prototype.clearInstances = function () {
    var e_3, _a;

    try {
      for (var _b = (0, _tslib.__values)(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = (0, _tslib.__read)(_c.value, 2),
            token = _d[0],
            registrations = _d[1];

        this._registry.setAll(token, registrations.filter(function (registration) {
          return !(0, _providers.isValueProvider)(registration.provider);
        }).map(function (registration) {
          registration.instance = undefined;
          return registration;
        }));
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
  };

  InternalDependencyContainer.prototype.createChildContainer = function () {
    var e_4, _a;

    var childContainer = new InternalDependencyContainer(this);

    try {
      for (var _b = (0, _tslib.__values)(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = (0, _tslib.__read)(_c.value, 2),
            token = _d[0],
            registrations = _d[1];

        if (registrations.some(function (_a) {
          var options = _a.options;
          return options.lifecycle === _lifecycle.default.ContainerScoped;
        })) {
          childContainer._registry.setAll(token, registrations.map(function (registration) {
            if (registration.options.lifecycle === _lifecycle.default.ContainerScoped) {
              return {
                provider: registration.provider,
                options: registration.options
              };
            }

            return registration;
          }));
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    return childContainer;
  };

  InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
    if (options === void 0) {
      options = {
        frequency: "Always"
      };
    }

    this.interceptors.preResolution.set(token, {
      callback: callback,
      options: options
    });
  };

  InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
    if (options === void 0) {
      options = {
        frequency: "Always"
      };
    }

    this.interceptors.postResolution.set(token, {
      callback: callback,
      options: options
    });
  };

  InternalDependencyContainer.prototype.getRegistration = function (token) {
    if (this.isRegistered(token)) {
      return this._registry.get(token);
    }

    if (this.parent) {
      return this.parent.getRegistration(token);
    }

    return null;
  };

  InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
    if (this.isRegistered(token)) {
      return this._registry.getAll(token);
    }

    if (this.parent) {
      return this.parent.getAllRegistrations(token);
    }

    return null;
  };

  InternalDependencyContainer.prototype.construct = function (ctor, context) {
    var _this = this;

    if (ctor instanceof _lazyHelpers.DelayedConstructor) {
      return ctor.createProxy(function (target) {
        return _this.resolve(target, context);
      });
    }

    var paramInfo = typeInfo.get(ctor);

    if (!paramInfo || paramInfo.length === 0) {
      if (ctor.length === 0) {
        return new ctor();
      } else {
        throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
      }
    }

    var params = paramInfo.map(this.resolveParams(context, ctor));
    return new (ctor.bind.apply(ctor, (0, _tslib.__spread)([void 0], params)))();
  };

  InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
    var _this = this;

    return function (param, idx) {
      var _a, _b, _c;

      try {
        if ((0, _injectionToken.isTokenDescriptor)(param)) {
          if ((0, _injectionToken.isTransformDescriptor)(param)) {
            return param.multiple ? (_a = _this.resolve(param.transform)).transform.apply(_a, (0, _tslib.__spread)([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, (0, _tslib.__spread)([_this.resolve(param.token, context)], param.transformArgs));
          } else {
            return param.multiple ? _this.resolveAll(param.token) : _this.resolve(param.token, context);
          }
        } else if ((0, _injectionToken.isTransformDescriptor)(param)) {
          return (_c = _this.resolve(param.transform, context)).transform.apply(_c, (0, _tslib.__spread)([_this.resolve(param.token, context)], param.transformArgs));
        }

        return _this.resolve(param, context);
      } catch (e) {
        throw new Error((0, _errorHelpers.formatErrorCtor)(ctor, idx, e));
      }
    };
  };

  return InternalDependencyContainer;
}();

var instance = new InternalDependencyContainer();
exports.instance = instance;
var _default = instance;
exports.default = _default;
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js","./providers":"node_modules/tsyringe/dist/esm5/providers/index.js","./providers/provider":"node_modules/tsyringe/dist/esm5/providers/provider.js","./providers/injection-token":"node_modules/tsyringe/dist/esm5/providers/injection-token.js","./registry":"node_modules/tsyringe/dist/esm5/registry.js","./types/lifecycle":"node_modules/tsyringe/dist/esm5/types/lifecycle.js","./resolution-context":"node_modules/tsyringe/dist/esm5/resolution-context.js","./error-helpers":"node_modules/tsyringe/dist/esm5/error-helpers.js","./lazy-helpers":"node_modules/tsyringe/dist/esm5/lazy-helpers.js","./interceptors":"node_modules/tsyringe/dist/esm5/interceptors.js"}],"node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tslib = require("tslib");

var _reflectionHelpers = require("../reflection-helpers");

var _dependencyContainer = require("../dependency-container");

var _injectionToken = require("../providers/injection-token");

var _errorHelpers = require("../error-helpers");

function autoInjectable() {
  return function (target) {
    var paramInfo = (0, _reflectionHelpers.getParamInfo)(target);
    return function (_super) {
      (0, _tslib.__extends)(class_1, _super);

      function class_1() {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return _super.apply(this, (0, _tslib.__spread)(args.concat(paramInfo.slice(args.length).map(function (type, index) {
          var _a, _b, _c;

          try {
            if ((0, _injectionToken.isTokenDescriptor)(type)) {
              if ((0, _injectionToken.isTransformDescriptor)(type)) {
                return type.multiple ? (_a = _dependencyContainer.instance.resolve(type.transform)).transform.apply(_a, (0, _tslib.__spread)([_dependencyContainer.instance.resolveAll(type.token)], type.transformArgs)) : (_b = _dependencyContainer.instance.resolve(type.transform)).transform.apply(_b, (0, _tslib.__spread)([_dependencyContainer.instance.resolve(type.token)], type.transformArgs));
              } else {
                return type.multiple ? _dependencyContainer.instance.resolveAll(type.token) : _dependencyContainer.instance.resolve(type.token);
              }
            } else if ((0, _injectionToken.isTransformDescriptor)(type)) {
              return (_c = _dependencyContainer.instance.resolve(type.transform)).transform.apply(_c, (0, _tslib.__spread)([_dependencyContainer.instance.resolve(type.token)], type.transformArgs));
            }

            return _dependencyContainer.instance.resolve(type);
          } catch (e) {
            var argIndex = index + args.length;
            throw new Error((0, _errorHelpers.formatErrorCtor)(target, argIndex, e));
          }
        })))) || this;
      }

      return class_1;
    }(target);
  };
}

var _default = autoInjectable;
exports.default = _default;
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js","../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js","../providers/injection-token":"node_modules/tsyringe/dist/esm5/providers/injection-token.js","../error-helpers":"node_modules/tsyringe/dist/esm5/error-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/inject.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

function inject(token) {
  return (0, _reflectionHelpers.defineInjectionTokenMetadata)(token);
}

var _default = inject;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/injectable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

var _dependencyContainer = require("../dependency-container");

function injectable() {
  return function (target) {
    _dependencyContainer.typeInfo.set(target, (0, _reflectionHelpers.getParamInfo)(target));
  };
}

var _default = injectable;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/registry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tslib = require("tslib");

var _dependencyContainer = require("../dependency-container");

function registry(registrations) {
  if (registrations === void 0) {
    registrations = [];
  }

  return function (target) {
    registrations.forEach(function (_a) {
      var token = _a.token,
          options = _a.options,
          provider = (0, _tslib.__rest)(_a, ["token", "options"]);
      return _dependencyContainer.instance.register(token, provider, options);
    });
    return target;
  };
}

var _default = registry;
exports.default = _default;
},{"tslib":"node_modules/tsyringe/node_modules/tslib/tslib.es6.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/singleton.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _injectable = _interopRequireDefault(require("./injectable"));

var _dependencyContainer = require("../dependency-container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function singleton() {
  return function (target) {
    (0, _injectable.default)()(target);

    _dependencyContainer.instance.registerSingleton(target);
  };
}

var _default = singleton;
exports.default = _default;
},{"./injectable":"node_modules/tsyringe/dist/esm5/decorators/injectable.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/inject-all.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

function injectAll(token) {
  var data = {
    token: token,
    multiple: true
  };
  return (0, _reflectionHelpers.defineInjectionTokenMetadata)(data);
}

var _default = injectAll;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

function injectAllWithTransform(token, transformer) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  var data = {
    token: token,
    multiple: true,
    transform: transformer,
    transformArgs: args
  };
  return (0, _reflectionHelpers.defineInjectionTokenMetadata)(data);
}

var _default = injectAllWithTransform;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reflectionHelpers = require("../reflection-helpers");

function injectWithTransform(token, transformer) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  return (0, _reflectionHelpers.defineInjectionTokenMetadata)(token, {
    transformToken: transformer,
    args: args
  });
}

var _default = injectWithTransform;
exports.default = _default;
},{"../reflection-helpers":"node_modules/tsyringe/dist/esm5/reflection-helpers.js"}],"node_modules/tsyringe/dist/esm5/decorators/scoped.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scoped;

var _injectable = _interopRequireDefault(require("./injectable"));

var _dependencyContainer = require("../dependency-container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scoped(lifecycle, token) {
  return function (target) {
    (0, _injectable.default)()(target);

    _dependencyContainer.instance.register(token || target, target, {
      lifecycle: lifecycle
    });
  };
}
},{"./injectable":"node_modules/tsyringe/dist/esm5/decorators/injectable.js","../dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tsyringe/dist/esm5/decorators/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "autoInjectable", {
  enumerable: true,
  get: function () {
    return _autoInjectable.default;
  }
});
Object.defineProperty(exports, "inject", {
  enumerable: true,
  get: function () {
    return _inject.default;
  }
});
Object.defineProperty(exports, "injectable", {
  enumerable: true,
  get: function () {
    return _injectable.default;
  }
});
Object.defineProperty(exports, "registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});
Object.defineProperty(exports, "singleton", {
  enumerable: true,
  get: function () {
    return _singleton.default;
  }
});
Object.defineProperty(exports, "injectAll", {
  enumerable: true,
  get: function () {
    return _injectAll.default;
  }
});
Object.defineProperty(exports, "injectAllWithTransform", {
  enumerable: true,
  get: function () {
    return _injectAllWithTransform.default;
  }
});
Object.defineProperty(exports, "injectWithTransform", {
  enumerable: true,
  get: function () {
    return _injectWithTransform.default;
  }
});
Object.defineProperty(exports, "scoped", {
  enumerable: true,
  get: function () {
    return _scoped.default;
  }
});

var _autoInjectable = _interopRequireDefault(require("./auto-injectable"));

var _inject = _interopRequireDefault(require("./inject"));

var _injectable = _interopRequireDefault(require("./injectable"));

var _registry = _interopRequireDefault(require("./registry"));

var _singleton = _interopRequireDefault(require("./singleton"));

var _injectAll = _interopRequireDefault(require("./inject-all"));

var _injectAllWithTransform = _interopRequireDefault(require("./inject-all-with-transform"));

var _injectWithTransform = _interopRequireDefault(require("./inject-with-transform"));

var _scoped = _interopRequireDefault(require("./scoped"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./auto-injectable":"node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js","./inject":"node_modules/tsyringe/dist/esm5/decorators/inject.js","./injectable":"node_modules/tsyringe/dist/esm5/decorators/injectable.js","./registry":"node_modules/tsyringe/dist/esm5/decorators/registry.js","./singleton":"node_modules/tsyringe/dist/esm5/decorators/singleton.js","./inject-all":"node_modules/tsyringe/dist/esm5/decorators/inject-all.js","./inject-all-with-transform":"node_modules/tsyringe/dist/esm5/decorators/inject-all-with-transform.js","./inject-with-transform":"node_modules/tsyringe/dist/esm5/decorators/inject-with-transform.js","./scoped":"node_modules/tsyringe/dist/esm5/decorators/scoped.js"}],"node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = instanceCachingFactory;

function instanceCachingFactory(factoryFunc) {
  var instance;
  return function (dependencyContainer) {
    if (instance == undefined) {
      instance = factoryFunc(dependencyContainer);
    }

    return instance;
  };
}
},{}],"node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = predicateAwareClassFactory;

function predicateAwareClassFactory(predicate, trueConstructor, falseConstructor, useCaching) {
  if (useCaching === void 0) {
    useCaching = true;
  }

  var instance;
  var previousPredicate;
  return function (dependencyContainer) {
    var currentPredicate = predicate(dependencyContainer);

    if (!useCaching || previousPredicate !== currentPredicate) {
      if (previousPredicate = currentPredicate) {
        instance = dependencyContainer.resolve(trueConstructor);
      } else {
        instance = dependencyContainer.resolve(falseConstructor);
      }
    }

    return instance;
  };
}
},{}],"node_modules/tsyringe/dist/esm5/factories/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "instanceCachingFactory", {
  enumerable: true,
  get: function () {
    return _instanceCachingFactory.default;
  }
});
Object.defineProperty(exports, "predicateAwareClassFactory", {
  enumerable: true,
  get: function () {
    return _predicateAwareClassFactory.default;
  }
});

var _instanceCachingFactory = _interopRequireDefault(require("./instance-caching-factory"));

var _predicateAwareClassFactory = _interopRequireDefault(require("./predicate-aware-class-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./instance-caching-factory":"node_modules/tsyringe/dist/esm5/factories/instance-caching-factory.js","./predicate-aware-class-factory":"node_modules/tsyringe/dist/esm5/factories/predicate-aware-class-factory.js"}],"node_modules/tsyringe/dist/esm5/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Lifecycle: true,
  delay: true,
  container: true
};
Object.defineProperty(exports, "Lifecycle", {
  enumerable: true,
  get: function () {
    return _types.Lifecycle;
  }
});
Object.defineProperty(exports, "delay", {
  enumerable: true,
  get: function () {
    return _lazyHelpers.delay;
  }
});
Object.defineProperty(exports, "container", {
  enumerable: true,
  get: function () {
    return _dependencyContainer.instance;
  }
});

var _types = require("./types");

var _decorators = require("./decorators");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _decorators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _factories = require("./factories");

Object.keys(_factories).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _factories[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _factories[key];
    }
  });
});

var _providers = require("./providers");

Object.keys(_providers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _providers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _providers[key];
    }
  });
});

var _lazyHelpers = require("./lazy-helpers");

var _dependencyContainer = require("./dependency-container");

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
  throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}
},{"./types":"node_modules/tsyringe/dist/esm5/types/index.js","./decorators":"node_modules/tsyringe/dist/esm5/decorators/index.js","./factories":"node_modules/tsyringe/dist/esm5/factories/index.js","./providers":"node_modules/tsyringe/dist/esm5/providers/index.js","./lazy-helpers":"node_modules/tsyringe/dist/esm5/lazy-helpers.js","./dependency-container":"node_modules/tsyringe/dist/esm5/dependency-container.js"}],"node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__spreadArray = __spreadArray;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__classPrivateFieldGet = __classPrivateFieldGet;
exports.__classPrivateFieldSet = __classPrivateFieldSet;
exports.__createBinding = exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

var __createBinding = Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
};

exports.__createBinding = __createBinding;

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}
/** @deprecated */


function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}
/** @deprecated */


function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

function __spreadArray(to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

var __setModuleDefault = Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}

function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  privateMap.set(receiver, value);
  return value;
}
},{}],"src/Pilote.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pilote = function Pilote() {
  _classCallCheck(this, Pilote);

  this.name = 'Rom';
};

exports.default = Pilote;
},{}],"src/Car.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Car = void 0;

var _tslib = require("tslib");

var _tsyringe = require("tsyringe");

var _Pilote = _interopRequireDefault(require("App/Pilote"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _a;

var Car = /*#__PURE__*/function () {
  function Car(pilote) {
    _classCallCheck(this, Car);

    this.pilote = pilote;
  }

  _createClass(Car, [{
    key: "build",
    value: function build() {
      console.log(this.pilote);
      console.log(this.pilote.name);
    }
  }]);

  return Car;
}();

exports.Car = Car;
exports.Car = Car = (0, _tslib.__decorate)([(0, _tsyringe.injectable)(), (0, _tslib.__metadata)("design:paramtypes", [typeof (_a = typeof _Pilote.default !== "undefined" && _Pilote.default) === "function" ? _a : Object])], Car);
},{"tslib":"node_modules/tslib/tslib.es6.js","tsyringe":"node_modules/tsyringe/dist/esm5/index.js","App/Pilote":"src/Pilote.ts"}],"src/app.ts":[function(require,module,exports) {
"use strict";

require("reflect-metadata");

var _tsyringe = require("tsyringe");

var _Car = require("App/Car");

var instance = _tsyringe.container.resolve(_Car.Car);

console.log(instance);
},{"reflect-metadata":"node_modules/reflect-metadata/Reflect.js","tsyringe":"node_modules/tsyringe/dist/esm5/index.js","App/Car":"src/Car.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42133" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map