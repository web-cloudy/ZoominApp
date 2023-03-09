function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function initializeClock(id, endtime) {
  // const clock = document.getElementById(id);
  // const daysSpan = clock.querySelector('.days');
  // const hoursSpan = clock.querySelector('.hours');
  // const minutesSpan = clock.querySelector('.minutes');
  // const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    // daysSpan.innerHTML = t.days;
    // hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    // minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    // secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    } else {
      // return ('0' + t.seconds).slice(-2);
    }
  }

  //updateClock();
  //const timeinterval = setInterval(updateClock, 1000);
}
function save_score_ajax() {
  let searchParams = new URLSearchParams(window.location.search);
  event_id = searchParams.get("event_id");
  $.ajax({
    type: "POST",
    url: baseurl + "Player/updateEventPlayerPoint",
    data:
      "points=" +
      getItem("zoominbasketball_current_score") +
      "&user_id=" +
      get_userid() +
      "&event_id=" +
      event_id,
    async: true,
    success: function (html) {},
  });
}

function difference2Parts(milliseconds) {
  const secs = Math.floor(Math.abs(milliseconds) / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const millisecs = Math.floor(Math.abs(milliseconds)) % 1000;
  const multiple = (term, n) => (n !== 1 ? `${n} ${term}s` : `1 ${term}`);

  return {
    days: days,
    hours: hours % 24,
    hoursTotal: hours,
    minutesTotal: mins,
    minutes: mins % 60,
    seconds: secs % 60,
    secondsTotal: secs,
    milliSeconds: millisecs,
    get diffStr() {
      return `${multiple(`day`, this.days)}, ${multiple(
        `hour`,
        this.hours
      )}, ${multiple(`minute`, this.minutes)} and ${multiple(
        `second`,
        this.seconds
      )}`;
    },
    get diffStrMs() {
      return `${this.diffStr.replace(` and`, `, `)} and ${multiple(
        `millisecond`,
        this.milliSeconds
      )}`;
    },
  };
}

function save_player_time() {
  let searchParams = new URLSearchParams(window.location.search);
  event_id = searchParams.get("event_id");
  const diffs = difference2Parts(
    getItem("zoominbasketball_end_time") -
      getItem("zoominbasketball_start_time")
  );
  second = diffs.secondsTotal;
  $.ajax({
    type: "POST",
    url: baseurl + "Player/updateEventPlayerTime",
    data:
      "second=" + second + "&user_id=" + get_userid() + "&event_id=" + event_id,
    async: true,
    success: function (html) {},
  });
}

var now = new Date();
now.setMinutes(now.getMinutes() + localStorage.getItem("duration")); // timestamp
var deadline = (endtime = new Date(now)); // Date object

this.createjs = this.createjs || {};

createjs.extend = function (subclass, superclass) {
  "use strict";

  function o() {
    this.constructor = subclass;
  }
  o.prototype = superclass.prototype;
  return (subclass.prototype = new o());
};

//##############################################################################
// promote.js
//##############################################################################

this.createjs = this.createjs || {};

/**
 * @class Utility Methods
 */

/**
 * Promotes any methods on the super class that were overridden, by creating an alias in the format `prefix_methodName`.
 * It is recommended to use the super class's name as the prefix.
 * An alias to the super class's constructor is always added in the format `prefix_constructor`.
 * This allows the subclass to call super class methods without using `function.call`, providing better performance.
 *
 * For example, if `MySubClass` extends `MySuperClass`, and both define a `draw` method, then calling `promote(MySubClass, "MySuperClass")`
 * would add a `MySuperClass_constructor` method to MySubClass and promote the `draw` method on `MySuperClass` to the
 * prototype of `MySubClass` as `MySuperClass_draw`.
 *
 * This should be called after the class's prototype is fully defined.
 *
 * 	function ClassA(name) {
 * 		this.name = name;
 * 	}
 * 	ClassA.prototype.greet = function() {
 * 		return "Hello "+this.name;
 * 	}
 *
 * 	function ClassB(name, punctuation) {
 * 		this.ClassA_constructor(name);
 * 		this.punctuation = punctuation;
 * 	}
 * 	createjs.extend(ClassB, ClassA);
 * 	ClassB.prototype.greet = function() {
 * 		return this.ClassA_greet()+this.punctuation;
 * 	}
 * 	createjs.promote(ClassB, "ClassA");
 *
 * 	var foo = new ClassB("World", "!?!");
 * 	console.log(foo.greet()); // Hello World!?!
 *
 * @method promote
 * @param {Function} subclass The class to promote super class methods on.
 * @param {String} prefix The prefix to add to the promoted method names. Usually the name of the superclass.
 * @return {Function} Returns the subclass.
 */
createjs.promote = function (subclass, prefix) {
  "use strict";

  var subP = subclass.prototype,
    supP =
      (Object.getPrototypeOf && Object.getPrototypeOf(subP)) || subP.__proto__;
  if (supP) {
    subP[(prefix += "_") + "constructor"] = supP.constructor; // constructor is not always innumerable
    for (var n in supP) {
      if (subP.hasOwnProperty(n) && typeof supP[n] == "function") {
        subP[prefix + n] = supP[n];
      }
    }
  }
  return subclass;
};

//##############################################################################
// deprecate.js
//##############################################################################

this.createjs = this.createjs || {};

/**
 * @class Utility Methods
 */

/**
 * Wraps deprecated methods so they still be used, but throw warnings to developers.
 *
 *	obj.deprecatedMethod = createjs.deprecate("Old Method Name", obj._fallbackMethod);
 *
 * The recommended approach for deprecated properties is:
 *
 *	try {
 *		Obj	ect.defineProperties(object, {
 *			readyOnlyProp: { get: createjs.deprecate("readOnlyProp", function() { return this.alternateProp; }) },
 *			readWriteProp: {
 *				get: createjs.deprecate("readOnlyProp", function() { return this.alternateProp; }),
 *				set: createjs.deprecate("readOnlyProp", function(val) { this.alternateProp = val; })
 *		});
 *	} catch (e) {}
 *
 * @method deprecate
 * @param {Function} [fallbackMethod=null] A method to call when the deprecated method is used. See the example for how
 * @param {String} [name=null] The name of the method or property to display in the console warning.
 * to deprecate properties.
 * @return {Function} If a fallbackMethod is supplied, returns a closure that will call the fallback method after
 * logging the warning in the console.
 */
createjs.deprecate = function (fallbackMethod, name) {
  "use strict";
  return function () {
    var msg =
      "Deprecated property or method '" + name + "'. See docs for info.";
    console && (console.warn ? console.warn(msg) : console.log(msg));
    return fallbackMethod && fallbackMethod.apply(this, arguments);
  };
};

//##############################################################################
// Event.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  // constructor:
  /**
   * Contains properties and methods shared by all events for use with
   * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
   *
   * Note that Event objects are often reused, so you should never
   * rely on an event object's state outside of the call stack it was received in.
   * @class Event
   * @param {String} type The event type.
   * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
   * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
   * @constructor
   **/
  function Event(type, bubbles, cancelable) {
    // public properties:
    /**
     * The type of event.
     * @property type
     * @type String
     **/
    this.type = type;

    /**
     * The object that generated an event.
     * @property target
     * @type Object
     * @default null
     * @readonly
     */
    this.target = null;

    /**
     * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
     * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
     * is generated from childObj, then a listener on parentObj would receive the event with
     * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
     * @property currentTarget
     * @type Object
     * @default null
     * @readonly
     */
    this.currentTarget = null;

    /**
     * For bubbling events, this indicates the current event phase:<OL>
     * 	<LI> capture phase: starting from the top parent to the target</LI>
     * 	<LI> at target phase: currently being dispatched from the target</LI>
     * 	<LI> bubbling phase: from the target to the top parent</LI>
     * </OL>
     * @property eventPhase
     * @type Number
     * @default 0
     * @readonly
     */
    this.eventPhase = 0;

    /**
     * Indicates whether the event will bubble through the display list.
     * @property bubbles
     * @type Boolean
     * @default false
     * @readonly
     */
    this.bubbles = !!bubbles;

    /**
     * Indicates whether the default behaviour of this event can be cancelled via
     * {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
     * @property cancelable
     * @type Boolean
     * @default false
     * @readonly
     */
    this.cancelable = !!cancelable;

    /**
     * The epoch time at which this event was created.
     * @property timeStamp
     * @type Number
     * @default 0
     * @readonly
     */
    this.timeStamp = new Date().getTime();

    /**
     * Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
     * on this event.
     * @property defaultPrevented
     * @type Boolean
     * @default false
     * @readonly
     */
    this.defaultPrevented = false;

    /**
     * Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
     * {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
     * @property propagationStopped
     * @type Boolean
     * @default false
     * @readonly
     */
    this.propagationStopped = false;

    /**
     * Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
     * on this event.
     * @property immediatePropagationStopped
     * @type Boolean
     * @default false
     * @readonly
     */
    this.immediatePropagationStopped = false;

    /**
     * Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
     * @property removed
     * @type Boolean
     * @default false
     * @readonly
     */
    this.removed = false;
  }
  var p = Event.prototype;

  // public methods:
  /**
   * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
   * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
   * cancel the default behaviour associated with the event.
   * @method preventDefault
   **/
  p.preventDefault = function () {
    this.defaultPrevented = this.cancelable && true;
  };

  /**
   * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
   * Mirrors the DOM event standard.
   * @method stopPropagation
   **/
  p.stopPropagation = function () {
    this.propagationStopped = true;
  };

  /**
   * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
   * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
   * Mirrors the DOM event standard.
   * @method stopImmediatePropagation
   **/
  p.stopImmediatePropagation = function () {
    this.immediatePropagationStopped = this.propagationStopped = true;
  };

  /**
   * Causes the active listener to be removed via removeEventListener();
   *
   * 		myBtn.addEventListener("click", function(evt) {
   * 			// do stuff...
   * 			evt.remove(); // removes this listener.
   * 		});
   *
   * @method remove
   **/
  p.remove = function () {
    this.removed = true;
  };

  /**
   * Returns a clone of the Event instance.
   * @method clone
   * @return {Event} a clone of the Event instance.
   **/
  p.clone = function () {
    return new Event(this.type, this.bubbles, this.cancelable);
  };

  p.set = function (props) {
    for (var n in props) {
      this[n] = props[n];
    }
    return this;
  };

  p.toString = function () {
    return "[Event (type=" + this.type + ")]";
  };

  createjs.Event = Event;
})();

this.createjs = this.createjs || {};

(function () {
  "use strict";
  function EventDispatcher() {
    this._listeners = null;
    this._captureListeners = null;
  }
  var p = EventDispatcher.prototype;

  EventDispatcher.initialize = function (target) {
    target.addEventListener = p.addEventListener;
    target.on = p.on;
    target.removeEventListener = target.off = p.removeEventListener;
    target.removeAllEventListeners = p.removeAllEventListeners;
    target.hasEventListener = p.hasEventListener;
    target.dispatchEvent = p.dispatchEvent;
    target._dispatchEvent = p._dispatchEvent;
    target.willTrigger = p.willTrigger;
  };

  p.addEventListener = function (type, listener, useCapture) {
    var listeners;
    if (useCapture) {
      listeners = this._captureListeners = this._captureListeners || {};
    } else {
      listeners = this._listeners = this._listeners || {};
    }
    var arr = listeners[type];
    if (arr) {
      this.removeEventListener(type, listener, useCapture);
    }
    arr = listeners[type]; // remove may have deleted the array
    if (!arr) {
      listeners[type] = [listener];
    } else {
      arr.push(listener);
    }
    return listener;
  };

  p.on = function (type, listener, scope, once, data, useCapture) {
    if (listener.handleEvent) {
      scope = scope || listener;
      listener = listener.handleEvent;
    }
    scope = scope || this;
    return this.addEventListener(
      type,
      function (evt) {
        listener.call(scope, evt, data);
        once && evt.remove();
      },
      useCapture
    );
  };

  /**
   * Removes the specified event listener.
   *
   * <b>Important Note:</b> that you must pass the exact function reference used when the event was added. If a proxy
   * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
   * closure will not work.
   *
   * <h4>Example</h4>
   *
   *      displayObject.removeEventListener("click", handleClick);
   *
   * @method removeEventListener
   * @param {String} type The string type of the event.
   * @param {Function | Object} listener The listener function or object.
   * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
   **/
  p.removeEventListener = function (type, listener, useCapture) {
    var listeners = useCapture ? this._captureListeners : this._listeners;
    if (!listeners) {
      return;
    }
    var arr = listeners[type];
    if (!arr) {
      return;
    }
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i] == listener) {
        if (l == 1) {
          delete listeners[type];
        } // allows for faster checks.
        else {
          arr.splice(i, 1);
        }
        break;
      }
    }
  };

  /**
   * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
   * .on method.
   *
   * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
   * {{#crossLink "EventDispatcher/on"}}{{/crossLink}} for an example.
   *
   * @method off
   * @param {String} type The string type of the event.
   * @param {Function | Object} listener The listener function or object.
   * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
   **/
  p.off = p.removeEventListener;

  /**
   * Removes all listeners for the specified type, or all listeners of all types.
   *
   * <h4>Example</h4>
   *
   *      // Remove all listeners
   *      displayObject.removeAllEventListeners();
   *
   *      // Remove all click listeners
   *      displayObject.removeAllEventListeners("click");
   *
   * @method removeAllEventListeners
   * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
   **/
  p.removeAllEventListeners = function (type) {
    if (!type) {
      this._listeners = this._captureListeners = null;
    } else {
      if (this._listeners) {
        delete this._listeners[type];
      }
      if (this._captureListeners) {
        delete this._captureListeners[type];
      }
    }
  };

  /**
   * Dispatches the specified event to all listeners.
   *
   * <h4>Example</h4>
   *
   *      // Use a string event
   *      this.dispatchEvent("complete");
   *
   *      // Use an Event instance
   *      var event = new createjs.Event("progress");
   *      this.dispatchEvent(event);
   *
   * @method dispatchEvent
   * @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
   * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
   * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
   * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
   * @param {Boolean} [bubbles] Specifies the `bubbles` value when a string was passed to eventObj.
   * @param {Boolean} [cancelable] Specifies the `cancelable` value when a string was passed to eventObj.
   * @return {Boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
   **/
  p.dispatchEvent = function (eventObj, bubbles, cancelable) {
    if (typeof eventObj == "string") {
      // skip everything if there's no listeners and it doesn't bubble:
      var listeners = this._listeners;
      if (!bubbles && (!listeners || !listeners[eventObj])) {
        return true;
      }
      eventObj = new createjs.Event(eventObj, bubbles, cancelable);
    } else if (eventObj.target && eventObj.clone) {
      // redispatching an active event object, so clone it:
      eventObj = eventObj.clone();
    }

    // TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
    try {
      eventObj.target = this;
    } catch (e) {} // try/catch allows redispatching of native events

    if (!eventObj.bubbles || !this.parent) {
      this._dispatchEvent(eventObj, 2);
    } else {
      var top = this,
        list = [top];
      while (top.parent) {
        list.push((top = top.parent));
      }
      var i,
        l = list.length;

      // capture & atTarget
      for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
        list[i]._dispatchEvent(eventObj, 1 + (i == 0));
      }
      // bubbling
      for (i = 1; i < l && !eventObj.propagationStopped; i++) {
        list[i]._dispatchEvent(eventObj, 3);
      }
    }
    return !eventObj.defaultPrevented;
  };

  /**
   * Indicates whether there is at least one listener for the specified event type.
   * @method hasEventListener
   * @param {String} type The string type of the event.
   * @return {Boolean} Returns true if there is at least one listener for the specified event.
   **/
  p.hasEventListener = function (type) {
    var listeners = this._listeners,
      captureListeners = this._captureListeners;
    return !!(
      (listeners && listeners[type]) ||
      (captureListeners && captureListeners[type])
    );
  };

  /**
   * Indicates whether there is at least one listener for the specified event type on this object or any of its
   * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
   * specified type is dispatched from this object, it will trigger at least one listener.
   *
   * This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
   * event flow for a listener, not just this object.
   * @method willTrigger
   * @param {String} type The string type of the event.
   * @return {Boolean} Returns `true` if there is at least one listener for the specified event.
   **/
  p.willTrigger = function (type) {
    var o = this;
    while (o) {
      if (o.hasEventListener(type)) {
        return true;
      }
      o = o.parent;
    }
    return false;
  };

  /**
   * @method toString
   * @return {String} a string representation of the instance.
   **/
  p.toString = function () {
    return "[EventDispatcher]";
  };

  // private methods:
  /**
   * @method _dispatchEvent
   * @param {Object | Event} eventObj
   * @param {Object} eventPhase
   * @protected
   **/
  p._dispatchEvent = function (eventObj, eventPhase) {
    var l,
      arr,
      listeners = eventPhase <= 2 ? this._captureListeners : this._listeners;
    if (
      eventObj &&
      listeners &&
      (arr = listeners[eventObj.type]) &&
      (l = arr.length)
    ) {
      try {
        eventObj.currentTarget = this;
      } catch (e) {}
      try {
        eventObj.eventPhase = eventPhase | 0;
      } catch (e) {}
      eventObj.removed = false;

      arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
      for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
        var o = arr[i];
        if (o.handleEvent) {
          o.handleEvent(eventObj);
        } else {
          o(eventObj);
        }
        if (eventObj.removed) {
          this.off(eventObj.type, o, eventPhase == 1);
          eventObj.removed = false;
        }
      }
    }
    if (eventPhase === 2) {
      this._dispatchEvent(eventObj, 2.1);
    }
  };

  createjs.EventDispatcher = EventDispatcher;
})();

//##############################################################################
// Ticker.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  // constructor:
  /**
   * The Ticker provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
   * event to be notified when a set time interval has elapsed.
   *
   * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
   * when under high CPU load. The Ticker class uses a static interface (ex. `Ticker.framerate = 30;`) and
   * can not be instantiated.
   *
   * <h4>Example</h4>
   *
   *      createjs.Ticker.addEventListener("tick", handleTick);
   *      function handleTick(event) {
   *          // Actions carried out each tick (aka frame)
   *          if (!event.paused) {
   *              // Actions carried out when the Ticker is not paused.
   *          }
   *      }
   *
   * @class Ticker
   * @uses EventDispatcher
   * @static
   **/
  function Ticker() {
    throw "Ticker cannot be instantiated.";
  }

  // constants:
  /**
   * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
   * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
   * dispatches the tick when the time is within a certain threshold.
   *
   * This mode has a higher variance for time between frames than {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}},
   * but does not require that content be time based as with {{#crossLink "Ticker/RAF:property"}}{{/crossLink}} while
   * gaining the benefits of that API (screen synch, background throttling).
   *
   * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
   * framerates of 10, 12, 15, 20, and 30 work well.
   *
   * Falls back to {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
   * supported.
   * @property RAF_SYNCHED
   * @static
   * @type {String}
   * @default "synched"
   * @readonly
   **/
  Ticker.RAF_SYNCHED = "synched";

  /**
   * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
   * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
   * You can leverage {{#crossLink "Ticker/getTime"}}{{/crossLink}} and the {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
   * event object's "delta" properties to make this easier.
   *
   * Falls back on {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
   * supported.
   * @property RAF
   * @static
   * @type {String}
   * @default "raf"
   * @readonly
   **/
  Ticker.RAF = "raf";

  /**
   * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
   * provide the benefits of requestAnimationFrame (screen synch, background throttling).
   * @property TIMEOUT
   * @static
   * @type {String}
   * @default "timeout"
   * @readonly
   **/
  Ticker.TIMEOUT = "timeout";

  Ticker.timingMode = null;
  Ticker.maxDelta = 0;
  Ticker.paused = false;

  Ticker.removeEventListener = null;
  Ticker.removeAllEventListeners = null;
  Ticker.dispatchEvent = null;
  Ticker.hasEventListener = null;
  Ticker._listeners = null;
  createjs.EventDispatcher.initialize(Ticker); // inject EventDispatcher methods.
  Ticker._addEventListener = Ticker.addEventListener;
  Ticker.addEventListener = function () {
    !Ticker._inited && Ticker.init();
    return Ticker._addEventListener.apply(Ticker, arguments);
  };

  Ticker._inited = false;

  /**
   * @property _startTime
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._startTime = 0;

  /**
   * @property _pausedTime
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._pausedTime = 0;

  /**
   * The number of ticks that have passed
   * @property _ticks
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._ticks = 0;

  /**
   * The number of ticks that have passed while Ticker has been paused
   * @property _pausedTicks
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._pausedTicks = 0;

  /**
   * @property _interval
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._interval = 50;

  /**
   * @property _lastTime
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._lastTime = 0;

  /**
   * @property _times
   * @static
   * @type {Array}
   * @private
   **/
  Ticker._times = null;

  /**
   * @property _tickTimes
   * @static
   * @type {Array}
   * @private
   **/
  Ticker._tickTimes = null;

  /**
   * Stores the timeout or requestAnimationFrame id.
   * @property _timerId
   * @static
   * @type {Number}
   * @private
   **/
  Ticker._timerId = null;

  /**
   * True if currently using requestAnimationFrame, false if using setTimeout. This may be different than timingMode
   * if that property changed and a tick hasn't fired.
   * @property _raf
   * @static
   * @type {Boolean}
   * @private
   **/
  Ticker._raf = true;

  // static getter / setters:
  /**
   * Use the {{#crossLink "Ticker/interval:property"}}{{/crossLink}} property instead.
   * @method _setInterval
   * @private
   * @static
   * @param {Number} interval
   **/
  Ticker._setInterval = function (interval) {
    Ticker._interval = interval;
    if (!Ticker._inited) {
      return;
    }
    Ticker._setupTick();
  };
  // Ticker.setInterval is @deprecated. Remove for 1.1+
  Ticker.setInterval = createjs.deprecate(
    Ticker._setInterval,
    "Ticker.setInterval"
  );

  /**
   * Use the {{#crossLink "Ticker/interval:property"}}{{/crossLink}} property instead.
   * @method _getInterval
   * @private
   * @static
   * @return {Number}
   **/
  Ticker._getInterval = function () {
    return Ticker._interval;
  };
  // Ticker.getInterval is @deprecated. Remove for 1.1+
  Ticker.getInterval = createjs.deprecate(
    Ticker._getInterval,
    "Ticker.getInterval"
  );

  /**
   * Use the {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} property instead.
   * @method _setFPS
   * @private
   * @static
   * @param {Number} value
   **/
  Ticker._setFPS = function (value) {
    Ticker._setInterval(1000 / value);
  };
  // Ticker.setFPS is @deprecated. Remove for 1.1+
  Ticker.setFPS = createjs.deprecate(Ticker._setFPS, "Ticker.setFPS");

  /**
   * Use the {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} property instead.
   * @method _getFPS
   * @static
   * @private
   * @return {Number}
   **/
  Ticker._getFPS = function () {
    return 1000 / Ticker._interval;
  };
  // Ticker.getFPS is @deprecated. Remove for 1.1+
  Ticker.getFPS = createjs.deprecate(Ticker._getFPS, "Ticker.getFPS");

  /**
   * Indicates the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
   * Note that actual time between ticks may be more than specified depending on CPU load.
   * This property is ignored if the ticker is using the `RAF` timing mode.
   * @property interval
   * @static
   * @type {Number}
   **/

  /**
   * Indicates the target frame rate in frames per second (FPS). Effectively just a shortcut to `interval`, where
   * `framerate == 1000/interval`.
   * @property framerate
   * @static
   * @type {Number}
   **/
  try {
    Object.defineProperties(Ticker, {
      interval: { get: Ticker._getInterval, set: Ticker._setInterval },
      framerate: { get: Ticker._getFPS, set: Ticker._setFPS },
    });
  } catch (e) {
    console.log(e);
  }

  // public static methods:
  /**
   * Starts the tick. This is called automatically when the first listener is added.
   * @method init
   * @static
   **/
  Ticker.init = function () {
    if (Ticker._inited) {
      return;
    }
    Ticker._inited = true;
    Ticker._times = [];
    Ticker._tickTimes = [];
    Ticker._startTime = Ticker._getTime();
    Ticker._times.push((Ticker._lastTime = 0));
    Ticker.interval = Ticker._interval;
  };

  /**
   * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
   * @method reset
   * @static
   **/
  Ticker.reset = function () {
    if (Ticker._raf) {
      var f =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame;
      f && f(Ticker._timerId);
    } else {
      clearTimeout(Ticker._timerId);
    }
    Ticker.removeAllEventListeners("tick");
    Ticker._timerId = Ticker._times = Ticker._tickTimes = null;
    Ticker._startTime =
      Ticker._lastTime =
      Ticker._ticks =
      Ticker._pausedTime =
        0;
    Ticker._inited = false;
  };

  /**
   * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
   * because it only measures the time spent within the tick execution stack.
   *
   * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
   * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
   * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
   *
   * Example 2: With a target FPS of 30, {{#crossLink "Ticker/framerate:property"}}{{/crossLink}} returns 10fps, which
   * indicates an average of 100ms between the end of one tick and the end of the next. However, {{#crossLink "Ticker/getMeasuredTickTime"}}{{/crossLink}}
   * returns 20ms. This would indicate that something other than the tick is using ~80ms (another script, DOM
   * rendering, etc).
   * @method getMeasuredTickTime
   * @static
   * @param {Number} [ticks] The number of previous ticks over which to measure the average time spent in a tick.
   * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
   * @return {Number} The average time spent in a tick in milliseconds.
   **/
  Ticker.getMeasuredTickTime = function (ticks) {
    var ttl = 0,
      times = Ticker._tickTimes;
    if (!times || times.length < 1) {
      return -1;
    }

    // by default, calculate average for the past ~1 second:
    ticks = Math.min(times.length, ticks || Ticker._getFPS() | 0);
    for (var i = 0; i < ticks; i++) {
      ttl += times[i];
    }
    return ttl / ticks;
  };

  /**
   * Returns the actual frames / ticks per second.
   * @method getMeasuredFPS
   * @static
   * @param {Number} [ticks] The number of previous ticks over which to measure the actual frames / ticks per second.
   * Defaults to the number of ticks per second.
   * @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
   * from the target frames per second.
   **/
  Ticker.getMeasuredFPS = function (ticks) {
    var times = Ticker._times;
    if (!times || times.length < 2) {
      return -1;
    }

    // by default, calculate fps for the past ~1 second:
    ticks = Math.min(times.length - 1, ticks || Ticker._getFPS() | 0);
    return 1000 / ((times[0] - times[ticks]) / ticks);
  };

  /**
   * Returns the number of milliseconds that have elapsed since Ticker was initialized via {{#crossLink "Ticker/init"}}.
   * Returns -1 if Ticker has not been initialized. For example, you could use
   * this in a time synchronized animation to determine the exact amount of time that has elapsed.
   * @method getTime
   * @static
   * @param {Boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
   * If false, the value returned will be total time elapsed since the first tick event listener was added.
   * @return {Number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
   **/
  Ticker.getTime = function (runTime) {
    return Ticker._startTime
      ? Ticker._getTime() - (runTime ? Ticker._pausedTime : 0)
      : -1;
  };

  /**
   * Similar to the {{#crossLink "Ticker/getTime"}}{{/crossLink}} method, but returns the time on the most recent {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
   * event object.
   * @method getEventTime
   * @static
   * @param runTime {Boolean} [runTime=false] If true, the runTime property will be returned instead of time.
   * @returns {number} The time or runTime property from the most recent tick event or -1.
   */
  Ticker.getEventTime = function (runTime) {
    return Ticker._startTime
      ? (Ticker._lastTime || Ticker._startTime) -
          (runTime ? Ticker._pausedTime : 0)
      : -1;
  };

  /**
   * Returns the number of ticks that have been broadcast by Ticker.
   * @method getTicks
   * @static
   * @param {Boolean} pauseable Indicates whether to include ticks that would have been broadcast
   * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
   * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
   * value. The default value is false.
   * @return {Number} of ticks that have been broadcast.
   **/
  Ticker.getTicks = function (pauseable) {
    return Ticker._ticks - (pauseable ? Ticker._pausedTicks : 0);
  };

  // private static methods:
  /**
   * @method _handleSynch
   * @static
   * @private
   **/
  Ticker._handleSynch = function () {
    Ticker._timerId = null;
    Ticker._setupTick();

    // run if enough time has elapsed, with a little bit of flexibility to be early:
    if (Ticker._getTime() - Ticker._lastTime >= (Ticker._interval - 1) * 0.97) {
      Ticker._tick();
    }
  };

  /**
   * @method _handleRAF
   * @static
   * @private
   **/
  Ticker._handleRAF = function () {
    Ticker._timerId = null;
    Ticker._setupTick();
    Ticker._tick();
  };

  /**
   * @method _handleTimeout
   * @static
   * @private
   **/
  Ticker._handleTimeout = function () {
    Ticker._timerId = null;
    Ticker._setupTick();
    Ticker._tick();
  };

  /**
   * @method _setupTick
   * @static
   * @private
   **/
  Ticker._setupTick = function () {
    if (Ticker._timerId != null) {
      return;
    } // avoid duplicates

    var mode = Ticker.timingMode;
    if (mode == Ticker.RAF_SYNCHED || mode == Ticker.RAF) {
      var f =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      if (f) {
        Ticker._timerId = f(
          mode == Ticker.RAF ? Ticker._handleRAF : Ticker._handleSynch
        );
        Ticker._raf = true;
        return;
      }
    }
    Ticker._raf = false;
    Ticker._timerId = setTimeout(Ticker._handleTimeout, Ticker._interval);
  };

  /**
   * @method _tick
   * @static
   * @private
   **/
  Ticker._tick = function () {
    var paused = Ticker.paused;
    var time = Ticker._getTime();
    var elapsedTime = time - Ticker._lastTime;
    Ticker._lastTime = time;
    Ticker._ticks++;

    if (paused) {
      Ticker._pausedTicks++;
      Ticker._pausedTime += elapsedTime;
    }

    if (Ticker.hasEventListener("tick")) {
      var event = new createjs.Event("tick");
      var maxDelta = Ticker.maxDelta;
      event.delta = maxDelta && elapsedTime > maxDelta ? maxDelta : elapsedTime;
      event.paused = paused;
      event.time = time;
      event.runTime = time - Ticker._pausedTime;
      Ticker.dispatchEvent(event);
    }

    Ticker._tickTimes.unshift(Ticker._getTime() - time);
    while (Ticker._tickTimes.length > 100) {
      Ticker._tickTimes.pop();
    }

    Ticker._times.unshift(time);
    while (Ticker._times.length > 100) {
      Ticker._times.pop();
    }
  };

  /**
   * @method _getTime
   * @static
   * @private
   **/
  var w = window,
    now =
      w.performance.now ||
      w.performance.mozNow ||
      w.performance.msNow ||
      w.performance.oNow ||
      w.performance.webkitNow;
  Ticker._getTime = function () {
    return (
      ((now && now.call(w.performance)) || new Date().getTime()) -
      Ticker._startTime
    );
  };

  createjs.Ticker = Ticker;
})();

//##############################################################################
// AbstractTween.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  // constructor
  /**
   * Base class that both {{#crossLink "Tween"}}{{/crossLink}} and {{#crossLink "Timeline"}}{{/crossLink}} extend. Should not be instantiated directly.
   * @class AbstractTween
   * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
   * Supported props are listed below. These props are set on the corresponding instance properties except where
   * specified.
   * @param {boolean} [props.useTicks=false]  See the {{#crossLink "AbstractTween/useTicks:property"}}{{/crossLink}} property for more information.
   * @param {boolean} [props.ignoreGlobalPause=false] See the {{#crossLink "AbstractTween/ignoreGlobalPause:property"}}{{/crossLink}} for more information.
   * @param {number|boolean} [props.loop=0] See the {{#crossLink "AbstractTween/loop:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.reversed=false] See the {{#crossLink "AbstractTween/reversed:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.bounce=false] See the {{#crossLink "AbstractTween/bounce:property"}}{{/crossLink}} for more information.
   * @param {number} [props.timeScale=1] See the {{#crossLink "AbstractTween/timeScale:property"}}{{/crossLink}} for more information.
   * @param {Function} [props.onChange] Adds the specified function as a listener to the {{#crossLink "AbstractTween/change:event"}}{{/crossLink}} event
   * @param {Function} [props.onComplete] Adds the specified function as a listener to the {{#crossLink "AbstractTween/complete:event"}}{{/crossLink}} event
   * @extends EventDispatcher
   * @constructor
   */
  function AbstractTween(props) {
    this.EventDispatcher_constructor();

    // public properties:
    /**
     * Causes this tween to continue playing when a global pause is active. For example, if TweenJS is using {{#crossLink "Ticker"}}{{/crossLink}},
     * then setting this to false (the default) will cause this tween to be paused when `Ticker.paused` is set to
     * `true`. See the {{#crossLink "Tween/tick"}}{{/crossLink}} method for more info. Can be set via the `props`
     * parameter.
     * @property ignoreGlobalPause
     * @type Boolean
     * @default false
     */
    this.ignoreGlobalPause = false;

    /**
     * Indicates the number of times to loop. If set to -1, the tween will loop continuously.
     *
     * Note that a tween must loop at _least_ once to see it play in both directions when `{{#crossLink "AbstractTween/bounce:property"}}{{/crossLink}}`
     * is set to `true`.
     * @property loop
     * @type {Number}
     * @default 0
     */
    this.loop = 0;

    /**
     * Uses ticks for all durations instead of milliseconds. This also changes the behaviour of some actions (such as `call`).
     * Changing this value on a running tween could have unexpected results.
     * @property useTicks
     * @type {Boolean}
     * @default false
     * @readonly
     */
    this.useTicks = false;

    /**
     * Causes the tween to play in reverse.
     * @property reversed
     * @type {Boolean}
     * @default false
     */
    this.reversed = false;

    /**
     * Causes the tween to reverse direction at the end of each loop. Each single-direction play-through of the
     * tween counts as a single bounce. For example, to play a tween once forward, and once back, set the
     * `{{#crossLink "AbstractTween/loop:property"}}{{/crossLink}}` to `1`.
     * @property bounce
     * @type {Boolean}
     * @default false
     */
    this.bounce = false;

    /**
     * Changes the rate at which the tween advances. For example, a `timeScale` value of `2` will double the
     * playback speed, a value of `0.5` would halve it.
     * @property timeScale
     * @type {Number}
     * @default 1
     */
    this.timeScale = 1;

    /**
     * Indicates the duration of this tween in milliseconds (or ticks if `useTicks` is true), irrespective of `loops`.
     * This value is automatically updated as you modify the tween. Changing it directly could result in unexpected
     * behaviour.
     * @property duration
     * @type {Number}
     * @default 0
     * @readonly
     */
    this.duration = 0;

    /**
     * The current normalized position of the tween. This will always be a value between 0 and `duration`.
     * Changing this property directly will have unexpected results, use {{#crossLink "Tween/setPosition"}}{{/crossLink}}.
     * @property position
     * @type {Object}
     * @default 0
     * @readonly
     */
    this.position = 0;

    /**
     * The raw tween position. This value will be between `0` and `loops * duration` while the tween is active, or -1 before it activates.
     * @property rawPosition
     * @type {Number}
     * @default -1
     * @readonly
     */
    this.rawPosition = -1;

    // private properties:
    /**
     * @property _paused
     * @type {Boolean}
     * @default false
     * @protected
     */
    this._paused = true;

    /**
     * @property _next
     * @type {Tween}
     * @default null
     * @protected
     */
    this._next = null;

    /**
     * @property _prev
     * @type {Tween}
     * @default null
     * @protected
     */
    this._prev = null;

    /**
     * @property _parent
     * @type {Object}
     * @default null
     * @protected
     */
    this._parent = null;

    /**
     * @property _labels
     * @type Object
     * @protected
     **/
    this._labels = null;

    /**
     * @property _labelList
     * @type Array[Object]
     * @protected
     **/
    this._labelList = null;

    if (props) {
      this.useTicks = !!props.useTicks;
      this.ignoreGlobalPause = !!props.ignoreGlobalPause;
      this.loop = props.loop === true ? -1 : props.loop || 0;
      this.reversed = !!props.reversed;
      this.bounce = !!props.bounce;
      this.timeScale = props.timeScale || 1;
      props.onChange && this.addEventListener("change", props.onChange);
      props.onComplete && this.addEventListener("complete", props.onComplete);
    }

    // while `position` is shared, it needs to happen after ALL props are set, so it's handled in _init()
  }

  var p = createjs.extend(AbstractTween, createjs.EventDispatcher);

  // events:
  /**
   * Dispatched whenever the tween's position changes. It occurs after all tweened properties are updated and actions
   * are executed.
   * @event change
   **/

  /**
   * Dispatched when the tween reaches its end and has paused itself. This does not fire until all loops are complete;
   * tweens that loop continuously will never fire a complete event.
   * @event complete
   **/

  // getter / setters:

  /**
   * Use the {{#crossLink "AbstractTween/paused:property"}}{{/crossLink}} property instead.
   * @method _setPaused
   * @param {Boolean} [value=true] Indicates whether the tween should be paused (`true`) or played (`false`).
   * @return {AbstractTween} This tween instance (for chaining calls)
   * @protected
   * @chainable
   */
  p._setPaused = function (value) {
    createjs.Tween._register(this, value);
    return this;
  };
  p.setPaused = createjs.deprecate(p._setPaused, "AbstractTween.setPaused");

  /**
   * Use the {{#crossLink "AbstractTween/paused:property"}}{{/crossLink}} property instead.
   * @method _getPaused
   * @protected
   */
  p._getPaused = function () {
    return this._paused;
  };
  p.getPaused = createjs.deprecate(p._getPaused, "AbstactTween.getPaused");

  /**
   * Use the {{#crossLink "AbstractTween/currentLabel:property"}}{{/crossLink}} property instead.
   * @method _getCurrentLabel
   * @protected
   * @return {String} The name of the current label or null if there is no label
   **/
  p._getCurrentLabel = function (pos) {
    var labels = this.getLabels();
    if (pos == null) {
      pos = this.position;
    }
    for (var i = 0, l = labels.length; i < l; i++) {
      if (pos < labels[i].position) {
        break;
      }
    }
    return i === 0 ? null : labels[i - 1].label;
  };
  p.getCurrentLabel = createjs.deprecate(
    p._getCurrentLabel,
    "AbstractTween.getCurrentLabel"
  );

  /**
   * Pauses or unpauses the tween. A paused tween is removed from the global registry and is eligible for garbage
   * collection if no other references to it exist.
   * @property paused
   * @type Boolean
   * @readonly
   **/

  /**
   * Returns the name of the label on or immediately before the current position. For example, given a tween with
   * two labels, "first" on frame index 4, and "second" on frame 8, `currentLabel` would return:
   * <UL>
   * 		<LI>null if the current position is 2.</LI>
   * 		<LI>"first" if the current position is 4.</LI>
   * 		<LI>"first" if the current position is 7.</LI>
   * 		<LI>"second" if the current position is 15.</LI>
   * </UL>
   * @property currentLabel
   * @type String
   * @readonly
   **/

  try {
    Object.defineProperties(p, {
      paused: { set: p._setPaused, get: p._getPaused },
      currentLabel: { get: p._getCurrentLabel },
    });
  } catch (e) {}

  // public methods:
  /**
   * Advances the tween by a specified amount.
   * @method advance
   * @param {Number} delta The amount to advance in milliseconds (or ticks if useTicks is true). Negative values are supported.
   * @param {Number} [ignoreActions=false] If true, actions will not be executed due to this change in position.
   */
  p.advance = function (delta, ignoreActions) {
    this.setPosition(this.rawPosition + delta * this.timeScale, ignoreActions);
  };

  /**
   * Advances the tween to a specified position.
   * @method setPosition
   * @param {Number} rawPosition The raw position to seek to in milliseconds (or ticks if useTicks is true).
   * @param {Boolean} [ignoreActions=false] If true, do not run any actions that would be triggered by this operation.
   * @param {Boolean} [jump=false] If true, only actions at the new position will be run. If false, actions between the old and new position are run.
   * @param {Function} [callback] Primarily for use with MovieClip, this callback is called after properties are updated, but before actions are run.
   */
  p.setPosition = function (rawPosition, ignoreActions, jump, callback) {
    var d = this.duration,
      loopCount = this.loop,
      prevRawPos = this.rawPosition;
    var loop = 0,
      t = 0,
      end = false;

    // normalize position:
    if (rawPosition < 0) {
      rawPosition = 0;
    }

    if (d === 0) {
      // deal with 0 length tweens.
      end = true;
      if (prevRawPos !== -1) {
        return end;
      } // we can avoid doing anything else if we're already at 0.
    } else {
      loop = (rawPosition / d) | 0;
      t = rawPosition - loop * d;

      end = loopCount !== -1 && rawPosition >= loopCount * d + d;
      if (end) {
        rawPosition = (t = d) * (loop = loopCount) + d;
      }
      if (rawPosition === prevRawPos) {
        return end;
      } // no need to update

      var rev = !this.reversed !== !(this.bounce && loop % 2); // current loop is reversed
      if (rev) {
        t = d - t;
      }
    }

    // set this in advance in case an action modifies position:
    this.position = t;
    this.rawPosition = rawPosition;

    this._updatePosition(jump, end);
    if (end) {
      this.paused = true;
    }

    callback && callback(this);

    if (!ignoreActions) {
      this._runActions(
        prevRawPos,
        rawPosition,
        jump,
        !jump && prevRawPos === -1
      );
    }

    this.dispatchEvent("change");
    if (end) {
      this.dispatchEvent("complete");
    }
  };

  /**
   * Calculates a normalized position based on a raw position. For example, given a tween with a duration of 3000ms set to loop:
   * 	console.log(myTween.calculatePosition(3700); // 700
   * @method calculatePosition
   * @param {Number} rawPosition A raw position.
   */
  p.calculatePosition = function (rawPosition) {
    // largely duplicated from setPosition, but necessary to avoid having to instantiate generic objects to pass values (end, loop, position) back.
    var d = this.duration,
      loopCount = this.loop,
      loop = 0,
      t = 0;

    if (d === 0) {
      return 0;
    }
    if (loopCount !== -1 && rawPosition >= loopCount * d + d) {
      t = d;
      loop = loopCount;
    } // end
    else if (rawPosition < 0) {
      t = 0;
    } else {
      loop = (rawPosition / d) | 0;
      t = rawPosition - loop * d;
    }

    var rev = !this.reversed !== !(this.bounce && loop % 2); // current loop is reversed
    return rev ? d - t : t;
  };

  /**
   * Returns a list of the labels defined on this tween sorted by position.
   * @method getLabels
   * @return {Array[Object]} A sorted array of objects with label and position properties.
   **/
  p.getLabels = function () {
    var list = this._labelList;
    if (!list) {
      list = this._labelList = [];
      var labels = this._labels;
      for (var n in labels) {
        list.push({ label: n, position: labels[n] });
      }
      list.sort(function (a, b) {
        return a.position - b.position;
      });
    }
    return list;
  };

  /**
   * Defines labels for use with gotoAndPlay/Stop. Overwrites any previously set labels.
   * @method setLabels
   * @param {Object} labels An object defining labels for using {{#crossLink "Timeline/gotoAndPlay"}}{{/crossLink}}/{{#crossLink "Timeline/gotoAndStop"}}{{/crossLink}}
   * in the form `{myLabelName:time}` where time is in milliseconds (or ticks if `useTicks` is `true`).
   **/
  p.setLabels = function (labels) {
    this._labels = labels;
    this._labelList = null;
  };

  /**
   * Adds a label that can be used with {{#crossLink "Timeline/gotoAndPlay"}}{{/crossLink}}/{{#crossLink "Timeline/gotoAndStop"}}{{/crossLink}}.
   * @method addLabel
   * @param {String} label The label name.
   * @param {Number} position The position this label represents.
   **/
  p.addLabel = function (label, position) {
    if (!this._labels) {
      this._labels = {};
    }
    this._labels[label] = position;
    var list = this._labelList;
    if (list) {
      for (var i = 0, l = list.length; i < l; i++) {
        if (position < list[i].position) {
          break;
        }
      }
      list.splice(i, 0, { label: label, position: position });
    }
  };

  /**
   * Unpauses this timeline and jumps to the specified position or label.
   * @method gotoAndPlay
   * @param {String|Number} positionOrLabel The position in milliseconds (or ticks if `useTicks` is `true`)
   * or label to jump to.
   **/
  p.gotoAndPlay = function (positionOrLabel) {
    this.paused = false;
    this._goto(positionOrLabel);
  };

  /**
   * Pauses this timeline and jumps to the specified position or label.
   * @method gotoAndStop
   * @param {String|Number} positionOrLabel The position in milliseconds (or ticks if `useTicks` is `true`) or label
   * to jump to.
   **/
  p.gotoAndStop = function (positionOrLabel) {
    this.paused = true;
    this._goto(positionOrLabel);
  };

  /**
   * If a numeric position is passed, it is returned unchanged. If a string is passed, the position of the
   * corresponding frame label will be returned, or `null` if a matching label is not defined.
   * @method resolve
   * @param {String|Number} positionOrLabel A numeric position value or label string.
   **/
  p.resolve = function (positionOrLabel) {
    var pos = Number(positionOrLabel);
    if (isNaN(pos)) {
      pos = this._labels && this._labels[positionOrLabel];
    }
    return pos;
  };

  /**
   * Returns a string representation of this object.
   * @method toString
   * @return {String} a string representation of the instance.
   */
  p.toString = function () {
    return "[AbstractTween]";
  };

  /**
   * @method clone
   * @protected
   */
  p.clone = function () {
    throw "AbstractTween can not be cloned.";
  };

  // private methods:
  /**
   * Shared logic that executes at the end of the subclass constructor.
   * @method _init
   * @protected
   */
  p._init = function (props) {
    if (!props || !props.paused) {
      this.paused = false;
    }
    if (props && props.position != null) {
      this.setPosition(props.position);
    }
  };

  /**
   * @method _updatePosition
   * @protected
   */
  p._updatePosition = function (jump, end) {
    // abstract.
  };

  /**
   * @method _goto
   * @protected
   **/
  p._goto = function (positionOrLabel) {
    var pos = this.resolve(positionOrLabel);
    if (pos != null) {
      this.setPosition(pos, false, true);
    }
  };

  /**
   * @method _runActions
   * @protected
   */
  p._runActions = function (startRawPos, endRawPos, jump, includeStart) {
    // runs actions between startPos & endPos. Separated to support action deferral.

    //console.log(this.passive === false ? " > Tween" : "Timeline", "run", startRawPos, endRawPos, jump, includeStart);

    // if we don't have any actions, and we're not a Timeline, then return:
    // TODO: a cleaner way to handle this would be to override this method in Tween, but I'm not sure it's worth the overhead.
    if (!this._actionHead && !this.tweens) {
      return;
    }

    var d = this.duration,
      reversed = this.reversed,
      bounce = this.bounce,
      loopCount = this.loop;
    var loop0, loop1, t0, t1;

    if (d === 0) {
      // deal with 0 length tweens:
      loop0 = loop1 = t0 = t1 = 0;
      reversed = bounce = false;
    } else {
      loop0 = (startRawPos / d) | 0;
      loop1 = (endRawPos / d) | 0;
      t0 = startRawPos - loop0 * d;
      t1 = endRawPos - loop1 * d;
    }

    // catch positions that are past the end:
    if (loopCount !== -1) {
      if (loop1 > loopCount) {
        t1 = d;
        loop1 = loopCount;
      }
      if (loop0 > loopCount) {
        t0 = d;
        loop0 = loopCount;
      }
    }

    // special cases:
    if (jump) {
      return this._runActionsRange(t1, t1, jump, includeStart);
    } // jump.
    else if (loop0 === loop1 && t0 === t1 && !jump && !includeStart) {
      return;
    } // no actions if the position is identical and we aren't including the start
    else if (loop0 === -1) {
      loop0 = t0 = 0;
    } // correct the -1 value for first advance, important with useTicks.

    var dir = startRawPos <= endRawPos,
      loop = loop0;
    do {
      var rev = !reversed !== !(bounce && loop % 2);

      var start = loop === loop0 ? t0 : dir ? 0 : d;
      var end = loop === loop1 ? t1 : dir ? d : 0;

      if (rev) {
        start = d - start;
        end = d - end;
      }

      if (bounce && loop !== loop0 && start === end) {
        /* bounced onto the same time/frame, don't re-execute end actions */
      } else if (
        this._runActionsRange(
          start,
          end,
          jump,
          includeStart || (loop !== loop0 && !bounce)
        )
      ) {
        return true;
      }

      includeStart = false;
    } while ((dir && ++loop <= loop1) || (!dir && --loop >= loop1));
  };

  p._runActionsRange = function (startPos, endPos, jump, includeStart) {
    // abstract
  };

  createjs.AbstractTween = createjs.promote(AbstractTween, "EventDispatcher");
})();

//##############################################################################
// Tween.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  // constructor
  /**
   * Tweens properties for a single target. Methods can be chained to create complex animation sequences:
   *
   * <h4>Example</h4>
   *
   *	createjs.Tween.get(target)
   *		.wait(500)
   *		.to({alpha:0, visible:false}, 1000)
   *		.call(handleComplete);
   *
   * Multiple tweens can share a target, however if they affect the same properties there could be unexpected
   * behaviour. To stop all tweens on an object, use {{#crossLink "Tween/removeTweens"}}{{/crossLink}} or pass `override:true`
   * in the props argument.
   *
   * 	createjs.Tween.get(target, {override:true}).to({x:100});
   *
   * Subscribe to the {{#crossLink "Tween/change:event"}}{{/crossLink}} event to be notified when the tween position changes.
   *
   * 	createjs.Tween.get(target, {override:true}).to({x:100}).addEventListener("change", handleChange);
   * 	function handleChange(event) {
   * 		// The tween changed.
   * 	}
   *
   * See the {{#crossLink "Tween/get"}}{{/crossLink}} method also.
   * @class Tween
   * @param {Object} target The target object that will have its properties tweened.
   * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
   * Supported props are listed below. These props are set on the corresponding instance properties except where
   * specified.
   * @param {boolean} [props.useTicks=false]  See the {{#crossLink "AbstractTween/useTicks:property"}}{{/crossLink}} property for more information.
   * @param {boolean} [props.ignoreGlobalPause=false] See the {{#crossLink "AbstractTween/ignoreGlobalPause:property"}}{{/crossLink}} for more information.
   * @param {number|boolean} [props.loop=0] See the {{#crossLink "AbstractTween/loop:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.reversed=false] See the {{#crossLink "AbstractTween/reversed:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.bounce=false] See the {{#crossLink "AbstractTween/bounce:property"}}{{/crossLink}} for more information.
   * @param {number} [props.timeScale=1] See the {{#crossLink "AbstractTween/timeScale:property"}}{{/crossLink}} for more information.
   * @param {object} [props.pluginData] See the {{#crossLink "Tween/pluginData:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.paused=false] See the {{#crossLink "AbstractTween/paused:property"}}{{/crossLink}} for more information.
   * @param {number} [props.position=0] The initial position for this tween. See {{#crossLink "AbstractTween/position:property"}}{{/crossLink}}
   * @param {Function} [props.onChange] Adds the specified function as a listener to the {{#crossLink "AbstractTween/change:event"}}{{/crossLink}} event
   * @param {Function} [props.onComplete] Adds the specified function as a listener to the {{#crossLink "AbstractTween/complete:event"}}{{/crossLink}} event
   * @param {boolean} [props.override=false] Removes all existing tweens for the target when set to `true`.
   * </UL>
   * @extends AbstractTween
   * @constructor
   */
  function Tween(target, props) {
    this.AbstractTween_constructor(props);

    // public properties:

    /**
     * Allows you to specify data that will be used by installed plugins. Each plugin uses this differently, but in general
     * you specify data by assigning it to a property of `pluginData` with the same name as the plugin.
     * Note that in many cases, this data is used as soon as the plugin initializes itself for the tween.
     * As such, this data should be set before the first `to` call in most cases.
     * @example
     *	myTween.pluginData.SmartRotation = data;
     *
     * Most plugins also support a property to disable them for a specific tween. This is typically the plugin name followed by "_disabled".
     * @example
     *	myTween.pluginData.SmartRotation_disabled = true;
     *
     * Some plugins also store working data in this object, usually in a property named `_PluginClassName`.
     * See the documentation for individual plugins for more details.
     * @property pluginData
     * @type {Object}
     */
    this.pluginData = null;

    /**
     * The target of this tween. This is the object on which the tweened properties will be changed.
     * @property target
     * @type {Object}
     * @readonly
     */
    this.target = target;

    /**
     * Indicates the tween's current position is within a passive wait.
     * @property passive
     * @type {Boolean}
     * @default false
     * @readonly
     **/
    this.passive = false;

    // private properties:

    /**
     * @property _stepHead
     * @type {TweenStep}
     * @protected
     */
    this._stepHead = new TweenStep(null, 0, 0, {}, null, true);

    /**
     * @property _stepTail
     * @type {TweenStep}
     * @protected
     */
    this._stepTail = this._stepHead;

    /**
     * The position within the current step. Used by MovieClip.
     * @property _stepPosition
     * @type {Number}
     * @default 0
     * @protected
     */
    this._stepPosition = 0;

    /**
     * @property _actionHead
     * @type {TweenAction}
     * @protected
     */
    this._actionHead = null;

    /**
     * @property _actionTail
     * @type {TweenAction}
     * @protected
     */
    this._actionTail = null;

    /**
     * Plugins added to this tween instance.
     * @property _plugins
     * @type Array[Object]
     * @default null
     * @protected
     */
    this._plugins = null;

    /**
     * Hash for quickly looking up added plugins. Null until a plugin is added.
     * @property _plugins
     * @type Object
     * @default null
     * @protected
     */
    this._pluginIds = null;

    /**
     * Used by plugins to inject new properties.
     * @property _injected
     * @type {Object}
     * @default null
     * @protected
     */
    this._injected = null;

    if (props) {
      this.pluginData = props.pluginData;
      if (props.override) {
        Tween.removeTweens(target);
      }
    }
    if (!this.pluginData) {
      this.pluginData = {};
    }

    this._init(props);
  }

  var p = createjs.extend(Tween, createjs.AbstractTween);

  // static properties

  /**
   * Constant returned by plugins to tell the tween not to use default assignment.
   * @property IGNORE
   * @type Object
   * @static
   */
  Tween.IGNORE = {};

  /**
   * @property _listeners
   * @type Array[Tween]
   * @static
   * @protected
   */
  Tween._tweens = [];

  /**
   * @property _plugins
   * @type Object
   * @static
   * @protected
   */
  Tween._plugins = null;

  /**
   * @property _tweenHead
   * @type Tween
   * @static
   * @protected
   */
  Tween._tweenHead = null;

  /**
   * @property _tweenTail
   * @type Tween
   * @static
   * @protected
   */
  Tween._tweenTail = null;

  // static methods
  /**
   * Returns a new tween instance. This is functionally identical to using `new Tween(...)`, but may look cleaner
   * with the chained syntax of TweenJS.
   * <h4>Example</h4>
   *
   *	var tween = createjs.Tween.get(target).to({x:100}, 500);
   *	// equivalent to:
   *	var tween = new createjs.Tween(target).to({x:100}, 500);
   *
   * @method get
   * @param {Object} target The target object that will have its properties tweened.
   * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
   * Supported props are listed below. These props are set on the corresponding instance properties except where
   * specified.
   * @param {boolean} [props.useTicks=false]  See the {{#crossLink "AbstractTween/useTicks:property"}}{{/crossLink}} property for more information.
   * @param {boolean} [props.ignoreGlobalPause=false] See the {{#crossLink "AbstractTween/ignoreGlobalPause:property"}}{{/crossLink}} for more information.
   * @param {number|boolean} [props.loop=0] See the {{#crossLink "AbstractTween/loop:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.reversed=false] See the {{#crossLink "AbstractTween/reversed:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.bounce=false] See the {{#crossLink "AbstractTween/bounce:property"}}{{/crossLink}} for more information.
   * @param {number} [props.timeScale=1] See the {{#crossLink "AbstractTween/timeScale:property"}}{{/crossLink}} for more information.
   * @param {object} [props.pluginData] See the {{#crossLink "Tween/pluginData:property"}}{{/crossLink}} for more information.
   * @param {boolean} [props.paused=false] See the {{#crossLink "AbstractTween/paused:property"}}{{/crossLink}} for more information.
   * @param {number} [props.position=0] The initial position for this tween. See {{#crossLink "AbstractTween/position:property"}}{{/crossLink}}
   * @param {Function} [props.onChange] Adds the specified function as a listener to the {{#crossLink "AbstractTween/change:event"}}{{/crossLink}} event
   * @param {Function} [props.onComplete] Adds the specified function as a listener to the {{#crossLink "AbstractTween/complete:event"}}{{/crossLink}} event
   * @param {boolean} [props.override=false] Removes all existing tweens for the target when set to `true`.
   * @return {Tween} A reference to the created tween.
   * @static
   */
  Tween.get = function (target, props) {
    return new Tween(target, props);
  };

  /**
   * Advances all tweens. This typically uses the {{#crossLink "Ticker"}}{{/crossLink}} class, but you can call it
   * manually if you prefer to use your own "heartbeat" implementation.
   * @method tick
   * @param {Number} delta The change in time in milliseconds since the last tick. Required unless all tweens have
   * `useTicks` set to true.
   * @param {Boolean} paused Indicates whether a global pause is in effect. Tweens with {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}}
   * will ignore this, but all others will pause if this is `true`.
   * @static
   */
  Tween.tick = function (delta, paused) {
    var tween = Tween._tweenHead;
    while (tween) {
      var next = tween._next; // in case it completes and wipes its _next property
      if ((paused && !tween.ignoreGlobalPause) || tween._paused) {
        /* paused */
      } else {
        tween.advance(tween.useTicks ? 1 : delta);
      }
      tween = next;
    }
  };

  /**
   * Handle events that result from Tween being used as an event handler. This is included to allow Tween to handle
   * {{#crossLink "Ticker/tick:event"}}{{/crossLink}} events from the createjs {{#crossLink "Ticker"}}{{/crossLink}}.
   * No other events are handled in Tween.
   * @method handleEvent
   * @param {Object} event An event object passed in by the {{#crossLink "EventDispatcher"}}{{/crossLink}}. Will
   * usually be of type "tick".
   * @private
   * @static
   * @since 0.4.2
   */
  Tween.handleEvent = function (event) {
    if (event.type === "tick") {
      this.tick(event.delta, event.paused);
    }
  };

  /**
   * Removes all existing tweens for a target. This is called automatically by new tweens if the `override`
   * property is `true`.
   * @method removeTweens
   * @param {Object} target The target object to remove existing tweens from.
   * @static
   */
  Tween.removeTweens = function (target) {
    if (!target.tweenjs_count) {
      return;
    }
    var tween = Tween._tweenHead;
    while (tween) {
      var next = tween._next;
      if (tween.target === target) {
        Tween._register(tween, true);
      }
      tween = next;
    }
    target.tweenjs_count = 0;
  };

  /**
   * Stop and remove all existing tweens.
   * @method removeAllTweens
   * @static
   * @since 0.4.1
   */
  Tween.removeAllTweens = function () {
    var tween = Tween._tweenHead;
    while (tween) {
      var next = tween._next;
      tween._paused = true;
      tween.target && (tween.target.tweenjs_count = 0);
      tween._next = tween._prev = null;
      tween = next;
    }
    Tween._tweenHead = Tween._tweenTail = null;
  };

  /**
   * Indicates whether there are any active tweens on the target object (if specified) or in general.
   * @method hasActiveTweens
   * @param {Object} [target] The target to check for active tweens. If not specified, the return value will indicate
   * if there are any active tweens on any target.
   * @return {Boolean} Indicates if there are active tweens.
   * @static
   */
  Tween.hasActiveTweens = function (target) {
    if (target) {
      return !!target.tweenjs_count;
    }
    return !!Tween._tweenHead;
  };

  /**
   * Installs a plugin, which can modify how certain properties are handled when tweened. See the {{#crossLink "SamplePlugin"}}{{/crossLink}}
   * for an example of how to write TweenJS plugins. Plugins should generally be installed via their own `install` method, in order to provide
   * the plugin with an opportunity to configure itself.
   * @method _installPlugin
   * @param {Object} plugin The plugin to install
   * @static
   * @protected
   */
  Tween._installPlugin = function (plugin) {
    var priority = (plugin.priority = plugin.priority || 0),
      arr = (Tween._plugins = Tween._plugins || []);
    for (var i = 0, l = arr.length; i < l; i++) {
      if (priority < arr[i].priority) {
        break;
      }
    }
    arr.splice(i, 0, plugin);
  };

  /**
   * Registers or unregisters a tween with the ticking system.
   * @method _register
   * @param {Tween} tween The tween instance to register or unregister.
   * @param {Boolean} paused If `false`, the tween is registered. If `true` the tween is unregistered.
   * @static
   * @protected
   */
  Tween._register = function (tween, paused) {
    var target = tween.target;
    if (!paused && tween._paused) {
      // TODO: this approach might fail if a dev is using sealed objects
      if (target) {
        target.tweenjs_count = target.tweenjs_count
          ? target.tweenjs_count + 1
          : 1;
      }
      var tail = Tween._tweenTail;
      if (!tail) {
        Tween._tweenHead = Tween._tweenTail = tween;
      } else {
        Tween._tweenTail = tail._next = tween;
        tween._prev = tail;
      }
      if (!Tween._inited && createjs.Ticker) {
        createjs.Ticker.addEventListener("tick", Tween);
        Tween._inited = true;
      }
    } else if (paused && !tween._paused) {
      if (target) {
        target.tweenjs_count--;
      }
      var next = tween._next,
        prev = tween._prev;

      if (next) {
        next._prev = prev;
      } else {
        Tween._tweenTail = prev;
      } // was tail
      if (prev) {
        prev._next = next;
      } else {
        Tween._tweenHead = next;
      } // was head.

      tween._next = tween._prev = null;
    }
    tween._paused = paused;
  };

  // events:

  // public methods:
  /**
   * Adds a wait (essentially an empty tween).
   * <h4>Example</h4>
   *
   *	//This tween will wait 1s before alpha is faded to 0.
   *	createjs.Tween.get(target).wait(1000).to({alpha:0}, 1000);
   *
   * @method wait
   * @param {Number} duration The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
   * @param {Boolean} [passive=false] Tween properties will not be updated during a passive wait. This
   * is mostly useful for use with {{#crossLink "Timeline"}}{{/crossLink}} instances that contain multiple tweens
   * affecting the same target at different times.
   * @return {Tween} This tween instance (for chaining calls).
   * @chainable
   **/
  p.wait = function (duration, passive) {
    if (duration > 0) {
      this._addStep(+duration, this._stepTail.props, null, passive);
    }
    return this;
  };

  /**
   * Adds a tween from the current values to the specified properties. Set duration to 0 to jump to these value.
   * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
   * properties will be set at the end of the specified duration.
   * <h4>Example</h4>
   *
   *	createjs.Tween.get(target).to({alpha:0, visible:false}, 1000);
   *
   * @method to
   * @param {Object} props An object specifying property target values for this tween (Ex. `{x:300}` would tween the x
   * property of the target to 300).
   * @param {Number} [duration=0] The duration of the tween in milliseconds (or in ticks if `useTicks` is true).
   * @param {Function} [ease="linear"] The easing function to use for this tween. See the {{#crossLink "Ease"}}{{/crossLink}}
   * class for a list of built-in ease functions.
   * @return {Tween} This tween instance (for chaining calls).
   * @chainable
   */
  p.to = function (props, duration, ease) {
    if (duration == null || duration < 0) {
      duration = 0;
    }
    var step = this._addStep(+duration, null, ease);
    this._appendProps(props, step);
    return this;
  };

  /**
   * Adds a label that can be used with {{#crossLink "Tween/gotoAndPlay"}}{{/crossLink}}/{{#crossLink "Tween/gotoAndStop"}}{{/crossLink}}
   * at the current point in the tween. For example:
   *
   * 	var tween = createjs.Tween.get(foo)
   * 					.to({x:100}, 1000)
   * 					.label("myLabel")
   * 					.to({x:200}, 1000);
   * // ...
   * tween.gotoAndPlay("myLabel"); // would play from 1000ms in.
   *
   * @method addLabel
   * @param {String} label The label name.
   * @return {Tween} This tween instance (for chaining calls).
   * @chainable
   **/
  p.label = function (name) {
    this.addLabel(name, this.duration);
    return this;
  };

  /**
   * Adds an action to call the specified function.
   * <h4>Example</h4>
   *
   * 	//would call myFunction() after 1 second.
   * 	createjs.Tween.get().wait(1000).call(myFunction);
   *
   * @method call
   * @param {Function} callback The function to call.
   * @param {Array} [params]. The parameters to call the function with. If this is omitted, then the function
   * will be called with a single param pointing to this tween.
   * @param {Object} [scope]. The scope to call the function in. If omitted, it will be called in the target's scope.
   * @return {Tween} This tween instance (for chaining calls).
   * @chainable
   */
  p.call = function (callback, params, scope) {
    return this._addAction(scope || this.target, callback, params || [this]);
  };

  /**
   * Adds an action to set the specified props on the specified target. If `target` is null, it will use this tween's
   * target. Note that for properties on the target object, you should consider using a zero duration {{#crossLink "Tween/to"}}{{/crossLink}}
   * operation instead so the values are registered as tweened props.
   * <h4>Example</h4>
   *
   *	myTween.wait(1000).set({visible:false}, foo);
   *
   * @method set
   * @param {Object} props The properties to set (ex. `{visible:false}`).
   * @param {Object} [target] The target to set the properties on. If omitted, they will be set on the tween's target.
   * @return {Tween} This tween instance (for chaining calls).
   * @chainable
   */
  p.set = function (props, target) {
    return this._addAction(target || this.target, this._set, [props]);
  };

  /**
   * Adds an action to play (unpause) the specified tween. This enables you to sequence multiple tweens.
   * <h4>Example</h4>
   *
   *	myTween.to({x:100}, 500).play(otherTween);
   *
   * @method play
   * @param {Tween} [tween] The tween to play. Defaults to this tween.
   * @return {Tween} This tween instance (for chaining calls).
   * @chainable
   */
  p.play = function (tween) {
    return this._addAction(tween || this, this._set, [{ paused: false }]);
  };

  /**
   * Adds an action to pause the specified tween.
   *
   * 	myTween.pause(otherTween).to({alpha:1}, 1000).play(otherTween);
   *
   * Note that this executes at the end of a tween update, so the tween may advance beyond the time the pause
   * action was inserted at. For example:
   *
   * myTween.to({foo:0}, 1000).pause().to({foo:1}, 1000);
   *
   * At 60fps the tween will advance by ~16ms per tick, if the tween above was at 999ms prior to the current tick, it
   * will advance to 1015ms (15ms into the second "step") and then pause.
   *
   * @method pause
   * @param {Tween} [tween] The tween to pause. Defaults to this tween.
   * @return {Tween} This tween instance (for chaining calls)
   * @chainable
   */
  p.pause = function (tween) {
    return this._addAction(tween || this, this._set, [{ paused: true }]);
  };

  // tiny api (primarily for tool output):
  p.w = p.wait;
  p.t = p.to;
  p.c = p.call;
  p.s = p.set;

  /**
   * Returns a string representation of this object.
   * @method toString
   * @return {String} a string representation of the instance.
   */
  p.toString = function () {
    return "[Tween]";
  };

  /**
   * @method clone
   * @protected
   */
  p.clone = function () {
    throw "Tween can not be cloned.";
  };

  // private methods:
  /**
   * Adds a plugin to this tween.
   * @method _addPlugin
   * @param {Object} plugin
   * @protected
   */
  p._addPlugin = function (plugin) {
    var ids = this._pluginIds || (this._pluginIds = {}),
      id = plugin.ID;
    if (!id || ids[id]) {
      return;
    } // already added

    ids[id] = true;
    var plugins = this._plugins || (this._plugins = []),
      priority = plugin.priority || 0;
    for (var i = 0, l = plugins.length; i < l; i++) {
      if (priority < plugins[i].priority) {
        plugins.splice(i, 0, plugin);
        return;
      }
    }
    plugins.push(plugin);
  };

  // Docced in AbstractTween
  p._updatePosition = function (jump, end) {
    var step = this._stepHead.next,
      t = this.position,
      d = this.duration;
    if (this.target && step) {
      // find our new step index:
      var stepNext = step.next;
      while (stepNext && stepNext.t <= t) {
        step = step.next;
        stepNext = step.next;
      }
      var ratio = end ? (d === 0 ? 1 : t / d) : (t - step.t) / step.d; // TODO: revisit this.
      this._updateTargetProps(step, ratio, end);
    }
    this._stepPosition = step ? t - step.t : 0;
  };

  /**
   * @method _updateTargetProps
   * @param {Object} step
   * @param {Number} ratio
   * @param {Boolean} end Indicates to plugins that the full tween has ended.
   * @protected
   */
  p._updateTargetProps = function (step, ratio, end) {
    if ((this.passive = !!step.passive)) {
      return;
    } // don't update props.

    var v, v0, v1, ease;
    var p0 = step.prev.props;
    var p1 = step.props;
    if ((ease = step.ease)) {
      ratio = ease(ratio, 0, 1, 1);
    }

    var plugins = this._plugins;
    proploop: for (var n in p0) {
      v0 = p0[n];
      v1 = p1[n];

      // values are different & it is numeric then interpolate:
      if (v0 !== v1 && typeof v0 === "number") {
        v = v0 + (v1 - v0) * ratio;
      } else {
        v = ratio >= 1 ? v1 : v0;
      }

      if (plugins) {
        for (var i = 0, l = plugins.length; i < l; i++) {
          var value = plugins[i].change(this, step, n, v, ratio, end);
          if (value === Tween.IGNORE) {
            continue proploop;
          }
          if (value !== undefined) {
            v = value;
          }
        }
      }
      this.target[n] = v;
    }
  };

  /**
   * @method _runActionsRange
   * @param {Number} startPos
   * @param {Number} endPos
   * @param {Boolean} includeStart
   * @protected
   */
  p._runActionsRange = function (startPos, endPos, jump, includeStart) {
    var rev = startPos > endPos;
    var action = rev ? this._actionTail : this._actionHead;
    var ePos = endPos,
      sPos = startPos;
    if (rev) {
      ePos = startPos;
      sPos = endPos;
    }
    var t = this.position;
    while (action) {
      var pos = action.t;
      if (
        pos === endPos ||
        (pos > sPos && pos < ePos) ||
        (includeStart && pos === startPos)
      ) {
        action.funct.apply(action.scope, action.params);
        if (t !== this.position) {
          return true;
        }
      }
      action = rev ? action.prev : action.next;
    }
  };

  /**
   * @method _appendProps
   * @param {Object} props
   * @protected
   */
  p._appendProps = function (props, step, stepPlugins) {
    var initProps = this._stepHead.props,
      target = this.target,
      plugins = Tween._plugins;
    var n, i, value, initValue, inject;
    var oldStep = step.prev,
      oldProps = oldStep.props;
    var stepProps = step.props || (step.props = this._cloneProps(oldProps));
    var cleanProps = {}; // TODO: is there some way to avoid this additional object?

    for (n in props) {
      if (!props.hasOwnProperty(n)) {
        continue;
      }
      cleanProps[n] = stepProps[n] = props[n];

      if (initProps[n] !== undefined) {
        continue;
      }

      initValue = undefined; // accessing missing properties on DOMElements when using CSSPlugin is INSANELY expensive, so we let the plugin take a first swing at it.
      if (plugins) {
        for (i = plugins.length - 1; i >= 0; i--) {
          value = plugins[i].init(this, n, initValue);
          if (value !== undefined) {
            initValue = value;
          }
          if (initValue === Tween.IGNORE) {
            delete stepProps[n];
            delete cleanProps[n];
            break;
          }
        }
      }

      if (initValue !== Tween.IGNORE) {
        if (initValue === undefined) {
          initValue = target[n];
        }
        oldProps[n] = initValue === undefined ? null : initValue;
      }
    }

    for (n in cleanProps) {
      value = props[n];

      // propagate old value to previous steps:
      var o,
        prev = oldStep;
      while ((o = prev) && (prev = o.prev)) {
        if (prev.props === o.props) {
          continue;
        } // wait step
        if (prev.props[n] !== undefined) {
          break;
        } // already has a value, we're done.
        prev.props[n] = oldProps[n];
      }
    }

    if (stepPlugins !== false && (plugins = this._plugins)) {
      for (i = plugins.length - 1; i >= 0; i--) {
        plugins[i].step(this, step, cleanProps);
      }
    }

    if ((inject = this._injected)) {
      this._injected = null;
      this._appendProps(inject, step, false);
    }
  };

  /**
   * Used by plugins to inject properties onto the current step. Called from within `Plugin.step` calls.
   * For example, a plugin dealing with color, could read a hex color, and inject red, green, and blue props into the tween.
   * See the SamplePlugin for more info.
   * @method _injectProp
   * @param {String} name
   * @param {Object} value
   * @protected
   */
  p._injectProp = function (name, value) {
    var o = this._injected || (this._injected = {});
    o[name] = value;
  };

  /**
   * @method _addStep
   * @param {Number} duration
   * @param {Object} props
   * @param {Function} ease
   * @param {Boolean} passive
   * @protected
   */
  p._addStep = function (duration, props, ease, passive) {
    var step = new TweenStep(
      this._stepTail,
      this.duration,
      duration,
      props,
      ease,
      passive || false
    );
    this.duration += duration;
    return (this._stepTail = this._stepTail.next = step);
  };

  /**
   * @method _addAction
   * @param {Object} scope
   * @param {Function} funct
   * @param {Array} params
   * @protected
   */
  p._addAction = function (scope, funct, params) {
    var action = new TweenAction(
      this._actionTail,
      this.duration,
      scope,
      funct,
      params
    );
    if (this._actionTail) {
      this._actionTail.next = action;
    } else {
      this._actionHead = action;
    }
    this._actionTail = action;
    return this;
  };

  /**
   * @method _set
   * @param {Object} props
   * @protected
   */
  p._set = function (props) {
    for (var n in props) {
      this[n] = props[n];
    }
  };

  /**
   * @method _cloneProps
   * @param {Object} props
   * @protected
   */
  p._cloneProps = function (props) {
    var o = {};
    for (var n in props) {
      o[n] = props[n];
    }
    return o;
  };

  createjs.Tween = createjs.promote(Tween, "AbstractTween");

  function TweenStep(prev, t, d, props, ease, passive) {
    this.next = null;
    this.prev = prev;
    this.t = t;
    this.d = d;
    this.props = props;
    this.ease = ease;
    this.passive = passive;
    this.index = prev ? prev.index + 1 : 0;
  }

  function TweenAction(prev, t, scope, funct, params) {
    this.next = null;
    this.prev = prev;
    this.t = t;
    this.d = 0;
    this.scope = scope;
    this.funct = funct;
    this.params = params;
  }
})();

//##############################################################################
// Timeline.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  // constructor
  /**
   * The Timeline class synchronizes multiple tweens and allows them to be controlled as a group. Please note that if a
   * timeline is looping, the tweens on it may appear to loop even if the "loop" property of the tween is false.
   *
   * NOTE: Timeline currently also accepts a param list in the form: `tweens, labels, props`. This is for backwards
   * compatibility only and will be removed in the future. Include tweens and labels as properties on the props object.
   * @class Timeline
   * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
   * Supported props are listed below. These props are set on the corresponding instance properties except where
   * specified.<UL>
   *    <LI> `useTicks`</LI>
   *    <LI> `ignoreGlobalPause`</LI>
   *    <LI> `loop`</LI>
   *    <LI> `reversed`</LI>
   *    <LI> `bounce`</LI>
   *    <LI> `timeScale`</LI>
   *    <LI> `paused`</LI>
   *    <LI> `position`: indicates the initial position for this tween.</LI>
   *    <LI> `onChange`: adds the specified function as a listener to the `change` event</LI>
   *    <LI> `onComplete`: adds the specified function as a listener to the `complete` event</LI>
   * </UL>
   * @extends AbstractTween
   * @constructor
   **/
  function Timeline(props) {
    var tweens, labels;
    // handle old params (tweens, labels, props):
    // TODO: deprecated.
    if (props instanceof Array || (props == null && arguments.length > 1)) {
      tweens = props;
      labels = arguments[1];
      props = arguments[2];
    } else if (props) {
      tweens = props.tweens;
      labels = props.labels;
    }

    this.AbstractTween_constructor(props);

    // private properties:
    /**
     * The array of tweens in the timeline. It is *strongly* recommended that you use
     * {{#crossLink "Tween/addTween"}}{{/crossLink}} and {{#crossLink "Tween/removeTween"}}{{/crossLink}},
     * rather than accessing this directly, but it is included for advanced uses.
     * @property tweens
     * @type Array
     **/
    this.tweens = [];

    if (tweens) {
      this.addTween.apply(this, tweens);
    }
    this.setLabels(labels);

    this._init(props);
  }

  var p = createjs.extend(Timeline, createjs.AbstractTween);

  // events:
  // docced in AbstractTween.

  // public methods:
  /**
   * Adds one or more tweens (or timelines) to this timeline. The tweens will be paused (to remove them from the
   * normal ticking system) and managed by this timeline. Adding a tween to multiple timelines will result in
   * unexpected behaviour.
   * @method addTween
   * @param {Tween} ...tween The tween(s) to add. Accepts multiple arguments.
   * @return {Tween} The first tween that was passed in.
   **/
  p.addTween = function (tween) {
    if (tween._parent) {
      tween._parent.removeTween(tween);
    }

    var l = arguments.length;
    if (l > 1) {
      for (var i = 0; i < l; i++) {
        this.addTween(arguments[i]);
      }
      return arguments[l - 1];
    } else if (l === 0) {
      return null;
    }

    this.tweens.push(tween);
    tween._parent = this;
    tween.paused = true;
    var d = tween.duration;
    if (tween.loop > 0) {
      d *= tween.loop + 1;
    }
    if (d > this.duration) {
      this.duration = d;
    }

    if (this.rawPosition >= 0) {
      tween.setPosition(this.rawPosition);
    }
    return tween;
  };

  /**
   * Removes one or more tweens from this timeline.
   * @method removeTween
   * @param {Tween} ...tween The tween(s) to remove. Accepts multiple arguments.
   * @return Boolean Returns `true` if all of the tweens were successfully removed.
   **/
  p.removeTween = function (tween) {
    var l = arguments.length;
    if (l > 1) {
      var good = true;
      for (var i = 0; i < l; i++) {
        good = good && this.removeTween(arguments[i]);
      }
      return good;
    } else if (l === 0) {
      return true;
    }

    var tweens = this.tweens;
    var i = tweens.length;
    while (i--) {
      if (tweens[i] === tween) {
        tweens.splice(i, 1);
        tween._parent = null;
        if (tween.duration >= this.duration) {
          this.updateDuration();
        }
        return true;
      }
    }
    return false;
  };

  /**
   * Recalculates the duration of the timeline. The duration is automatically updated when tweens are added or removed,
   * but this method is useful if you modify a tween after it was added to the timeline.
   * @method updateDuration
   **/
  p.updateDuration = function () {
    this.duration = 0;
    for (var i = 0, l = this.tweens.length; i < l; i++) {
      var tween = this.tweens[i];
      var d = tween.duration;
      if (tween.loop > 0) {
        d *= tween.loop + 1;
      }
      if (d > this.duration) {
        this.duration = d;
      }
    }
  };

  /**
   * Returns a string representation of this object.
   * @method toString
   * @return {String} a string representation of the instance.
   **/
  p.toString = function () {
    return "[Timeline]";
  };

  /**
   * @method clone
   * @protected
   **/
  p.clone = function () {
    throw "Timeline can not be cloned.";
  };

  // private methods:

  // Docced in AbstractTween
  p._updatePosition = function (jump, end) {
    var t = this.position;
    for (var i = 0, l = this.tweens.length; i < l; i++) {
      this.tweens[i].setPosition(t, true, jump); // actions will run after all the tweens update.
    }
  };

  // Docced in AbstractTween
  p._runActionsRange = function (startPos, endPos, jump, includeStart) {
    //console.log("	range", startPos, endPos, jump, includeStart);
    var t = this.position;
    for (var i = 0, l = this.tweens.length; i < l; i++) {
      this.tweens[i]._runActions(startPos, endPos, jump, includeStart);
      if (t !== this.position) {
        return true;
      } // an action changed this timeline's position.
    }
  };

  createjs.Timeline = createjs.promote(Timeline, "AbstractTween");
})();

//##############################################################################
// Ease.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  /**
   * The Ease class provides a collection of easing functions for use with TweenJS. It does not use the standard 4 param
   * easing signature. Instead it uses a single param which indicates the current linear ratio (0 to 1) of the tween.
   *
   * Most methods on Ease can be passed directly as easing functions:
   *
   *      Tween.get(target).to({x:100}, 500, Ease.linear);
   *
   * However, methods beginning with "get" will return an easing function based on parameter values:
   *
   *      Tween.get(target).to({y:200}, 500, Ease.getPowIn(2.2));
   *
   * Please see the <a href="http://www.createjs.com/Demos/TweenJS/Tween_SparkTable">spark table demo</a> for an
   * overview of the different ease types on <a href="http://tweenjs.com">TweenJS.com</a>.
   *
   * <em>Equations derived from work by Robert Penner.</em>
   * @class Ease
   * @static
   **/
  function Ease() {
    throw "Ease cannot be instantiated.";
  }

  // static methods and properties
  /**
   * @method linear
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.linear = function (t) {
    return t;
  };

  /**
   * Identical to linear.
   * @method none
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.none = Ease.linear;

  /**
   * Mimics the simple -100 to 100 easing in Adobe Flash/Animate.
   * @method get
   * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
   * @static
   * @return {Function}
   **/
  Ease.get = function (amount) {
    if (amount < -1) {
      amount = -1;
    } else if (amount > 1) {
      amount = 1;
    }
    return function (t) {
      if (amount == 0) {
        return t;
      }
      if (amount < 0) {
        return t * (t * -amount + 1 + amount);
      }
      return t * ((2 - t) * amount + (1 - amount));
    };
  };

  /**
   * Configurable exponential ease.
   * @method getPowIn
   * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
   * @static
   * @return {Function}
   **/
  Ease.getPowIn = function (pow) {
    return function (t) {
      return Math.pow(t, pow);
    };
  };

  /**
   * Configurable exponential ease.
   * @method getPowOut
   * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
   * @static
   * @return {Function}
   **/
  Ease.getPowOut = function (pow) {
    return function (t) {
      return 1 - Math.pow(1 - t, pow);
    };
  };

  /**
   * Configurable exponential ease.
   * @method getPowInOut
   * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
   * @static
   * @return {Function}
   **/
  Ease.getPowInOut = function (pow) {
    return function (t) {
      if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
      return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
    };
  };

  /**
   * @method quadIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quadIn = Ease.getPowIn(2);
  /**
   * @method quadOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quadOut = Ease.getPowOut(2);
  /**
   * @method quadInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quadInOut = Ease.getPowInOut(2);

  /**
   * @method cubicIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.cubicIn = Ease.getPowIn(3);
  /**
   * @method cubicOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.cubicOut = Ease.getPowOut(3);
  /**
   * @method cubicInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.cubicInOut = Ease.getPowInOut(3);

  /**
   * @method quartIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quartIn = Ease.getPowIn(4);
  /**
   * @method quartOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quartOut = Ease.getPowOut(4);
  /**
   * @method quartInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quartInOut = Ease.getPowInOut(4);

  /**
   * @method quintIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quintIn = Ease.getPowIn(5);
  /**
   * @method quintOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quintOut = Ease.getPowOut(5);
  /**
   * @method quintInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.quintInOut = Ease.getPowInOut(5);

  /**
   * @method sineIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.sineIn = function (t) {
    return 1 - Math.cos((t * Math.PI) / 2);
  };

  /**
   * @method sineOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.sineOut = function (t) {
    return Math.sin((t * Math.PI) / 2);
  };

  /**
   * @method sineInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.sineInOut = function (t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  };

  /**
   * Configurable "back in" ease.
   * @method getBackIn
   * @param {Number} amount The strength of the ease.
   * @static
   * @return {Function}
   **/
  Ease.getBackIn = function (amount) {
    return function (t) {
      return t * t * ((amount + 1) * t - amount);
    };
  };
  /**
   * @method backIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.backIn = Ease.getBackIn(1.7);

  /**
   * Configurable "back out" ease.
   * @method getBackOut
   * @param {Number} amount The strength of the ease.
   * @static
   * @return {Function}
   **/
  Ease.getBackOut = function (amount) {
    return function (t) {
      return --t * t * ((amount + 1) * t + amount) + 1;
    };
  };
  /**
   * @method backOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.backOut = Ease.getBackOut(1.7);

  /**
   * Configurable "back in out" ease.
   * @method getBackInOut
   * @param {Number} amount The strength of the ease.
   * @static
   * @return {Function}
   **/
  Ease.getBackInOut = function (amount) {
    amount *= 1.525;
    return function (t) {
      if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
      return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
    };
  };
  /**
   * @method backInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.backInOut = Ease.getBackInOut(1.7);

  /**
   * @method circIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.circIn = function (t) {
    return -(Math.sqrt(1 - t * t) - 1);
  };

  /**
   * @method circOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.circOut = function (t) {
    return Math.sqrt(1 - --t * t);
  };

  /**
   * @method circInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.circInOut = function (t) {
    if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  };

  /**
   * @method bounceIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.bounceIn = function (t) {
    return 1 - Ease.bounceOut(1 - t);
  };

  /**
   * @method bounceOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.bounceOut = function (t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  };

  /**
   * @method bounceInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.bounceInOut = function (t) {
    if (t < 0.5) return Ease.bounceIn(t * 2) * 0.5;
    return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
  };

  /**
   * Configurable elastic ease.
   * @method getElasticIn
   * @param {Number} amplitude
   * @param {Number} period
   * @static
   * @return {Function}
   **/
  Ease.getElasticIn = function (amplitude, period) {
    var pi2 = Math.PI * 2;
    return function (t) {
      if (t == 0 || t == 1) return t;
      var s = (period / pi2) * Math.asin(1 / amplitude);
      return -(
        amplitude *
        Math.pow(2, 10 * (t -= 1)) *
        Math.sin(((t - s) * pi2) / period)
      );
    };
  };
  /**
   * @method elasticIn
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.elasticIn = Ease.getElasticIn(1, 0.3);

  /**
   * Configurable elastic ease.
   * @method getElasticOut
   * @param {Number} amplitude
   * @param {Number} period
   * @static
   * @return {Function}
   **/
  Ease.getElasticOut = function (amplitude, period) {
    var pi2 = Math.PI * 2;
    return function (t) {
      if (t == 0 || t == 1) return t;
      var s = (period / pi2) * Math.asin(1 / amplitude);
      return (
        amplitude * Math.pow(2, -10 * t) * Math.sin(((t - s) * pi2) / period) +
        1
      );
    };
  };
  /**
   * @method elasticOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.elasticOut = Ease.getElasticOut(1, 0.3);

  /**
   * Configurable elastic ease.
   * @method getElasticInOut
   * @param {Number} amplitude
   * @param {Number} period
   * @static
   * @return {Function}
   **/
  Ease.getElasticInOut = function (amplitude, period) {
    var pi2 = Math.PI * 2;
    return function (t) {
      var s = (period / pi2) * Math.asin(1 / amplitude);
      if ((t *= 2) < 1)
        return (
          -0.5 *
          (amplitude *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t - s) * pi2) / period))
        );
      return (
        amplitude *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t - s) * pi2) / period) *
          0.5 +
        1
      );
    };
  };
  /**
   * @method elasticInOut
   * @param {Number} t
   * @static
   * @return {Number}
   **/
  Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);

  createjs.Ease = Ease;
})();

//##############################################################################
// MotionGuidePlugin.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  /**
   * A TweenJS plugin for working with motion guides. Defined paths which objects can follow or orient along.
   *
   * To use the plugin, install the plugin after TweenJS has loaded. To define a path, add
   *
   * 		createjs.MotionGuidePlugin.install();
   *
   * <h4>Example</h4>
   *
   * 		// Using a Motion Guide
   * 		createjs.Tween.get(target).to({guide:{ path:[0,0, 0,200,200,200, 200,0,0,0] }},7000);
   * 		// Visualizing the line
   * 		graphics.moveTo(0,0).curveTo(0,200,200,200).curveTo(200,0,0,0);
   *
   * Each path needs pre-computation to ensure there's fast performance. Because of the pre-computation there's no
   * built in support for path changes mid tween. These are the Guide Object's properties:<UL>
   * 		<LI> path: Required, Array : The x/y points used to draw the path with a moveTo and 1 to n curveTo calls.</LI>
   * 		<LI> start: Optional, 0-1 : Initial position, default 0 except for when continuing along the same path.</LI>
   * 		<LI> end: Optional, 0-1 : Final position, default 1 if not specified.</LI>
   * 		<LI> orient: Optional, string : "fixed"/"auto"/"cw"/"ccw"<UL>
   *				<LI>"fixed" forces the object to face down the path all movement (relative to start rotation),</LI>
   * 				<LI>"auto" rotates the object along the path relative to the line.</LI>
   * 				<LI>"cw"/"ccw" force clockwise or counter clockwise rotations including Adobe Flash/Animate-like
   * 				behaviour. This may override your end rotation value.</LI>
   * 		</UL></LI>
   * </UL>
   * Guide objects should not be shared between tweens even if all properties are identical, the library stores
   * information on these objects in the background and sharing them can cause unexpected behaviour. Values
   * outside 0-1 range of tweens will be a "best guess" from the appropriate part of the defined curve.
   *
   * @class MotionGuidePlugin
   * @constructor
   */
  function MotionGuidePlugin() {
    throw "MotionGuidePlugin cannot be instantiated.";
  }
  var s = MotionGuidePlugin;

  // static properties:
  /**
   * @property priority
   * @protected
   * @static
   */
  s.priority = 0; // high priority, should run sooner

  /**
   * READ-ONLY. A unique identifying string for this plugin. Used by TweenJS to ensure duplicate plugins are not installed on a tween.
   * @property ID
   * @type {String}
   * @static
   * @readonly
   */
  s.ID = "MotionGuide";

  // static methods
  /**
   * Installs this plugin for use with TweenJS. Call this once after TweenJS is loaded to enable this plugin.
   * @method install
   * @static
   */
  s.install = function () {
    createjs.Tween._installPlugin(MotionGuidePlugin);
    return createjs.Tween.IGNORE;
  };

  /**
   * Called by TweenJS when a new property initializes on a tween.
   * See {{#crossLink "SamplePlugin/init"}}{{/crossLink}} for more info.
   * @method init
   * @param {Tween} tween
   * @param {String} prop
   * @param {any} value
   * @return {any}
   * @static
   */
  s.init = function (tween, prop, value) {
    if (prop == "guide") {
      tween._addPlugin(s);
    }
  };

  /**
   * Called when a new step is added to a tween (ie. a new "to" action is added to a tween).
   * See {{#crossLink "SamplePlugin/step"}}{{/crossLink}} for more info.
   * @method step
   * @param {Tween} tween
   * @param {TweenStep} step
   * @param {Object} props
   * @static
   */
  s.step = function (tween, step, props) {
    for (var n in props) {
      if (n !== "guide") {
        continue;
      }

      var guideData = step.props.guide;
      var error = s._solveGuideData(props.guide, guideData);
      guideData.valid = !error;

      var end = guideData.endData;
      tween._injectProp("x", end.x);
      tween._injectProp("y", end.y);

      if (error || !guideData.orient) {
        break;
      }

      var initRot =
        step.prev.props.rotation === undefined
          ? tween.target.rotation || 0
          : step.prev.props.rotation;

      guideData.startOffsetRot = initRot - guideData.startData.rotation;

      if (guideData.orient == "fixed") {
        // controlled rotation
        guideData.endAbsRot = end.rotation + guideData.startOffsetRot;
        guideData.deltaRotation = 0;
      } else {
        // interpreted rotation

        var finalRot =
          props.rotation === undefined
            ? tween.target.rotation || 0
            : props.rotation;
        var deltaRot =
          finalRot - guideData.endData.rotation - guideData.startOffsetRot;
        var modRot = deltaRot % 360;

        guideData.endAbsRot = finalRot;

        switch (guideData.orient) {
          case "auto":
            guideData.deltaRotation = deltaRot;
            break;
          case "cw":
            guideData.deltaRotation =
              ((modRot + 360) % 360) + 360 * Math.abs((deltaRot / 360) | 0);
            break;
          case "ccw":
            guideData.deltaRotation =
              ((modRot - 360) % 360) + -360 * Math.abs((deltaRot / 360) | 0);
            break;
        }
      }

      tween._injectProp("rotation", guideData.endAbsRot);
    }
  };

  /**
   * Called before a property is updated by the tween.
   * See {{#crossLink "SamplePlugin/change"}}{{/crossLink}} for more info.
   * @method change
   * @param {Tween} tween
   * @param {TweenStep} step
   * @param {String} prop
   * @param {any} value
   * @param {Number} ratio
   * @param {Boolean} end
   * @return {any}
   * @static
   */
  s.change = function (tween, step, prop, value, ratio, end) {
    var guideData = step.props.guide;

    if (
      !guideData || // Missing data
      step.props === step.prev.props || // In a wait()
      guideData === step.prev.props.guide // Guide hasn't changed
    ) {
      return; // have no business making decisions
    }
    if (
      (prop === "guide" && !guideData.valid) || // this data is broken
      prop == "x" ||
      prop == "y" || // these always get over-written
      (prop === "rotation" && guideData.orient) // currently over-written
    ) {
      return createjs.Tween.IGNORE;
    }

    s._ratioToPositionData(ratio, guideData, tween.target);
  };

  // public methods
  /**
   * Provide potentially useful debugging information, like running the error detection system, and rendering the path
   * defined in the guide data.
   *
   * NOTE: you will need to transform your context 2D to the local space of the guide if you wish to line it up.
   * @param {Object} guideData All the information describing the guide to be followed.
   * @param {DrawingContext2D} [ctx=undefined] The context to draw the object into.
   * @param {Array} [higlight=undefined] Array of ratio positions to highlight
   * @returns {undefined|String}
   */
  s.debug = function (guideData, ctx, higlight) {
    guideData = guideData.guide || guideData;

    // errors
    var err = s._findPathProblems(guideData);
    if (err) {
      console.error("MotionGuidePlugin Error found: \n" + err);
    }

    // drawing
    if (!ctx) {
      return err;
    }

    var i;
    var path = guideData.path;
    var pathLength = path.length;
    var width = 3;
    var length = 10;

    ctx.save();
    //ctx.resetTransform();

    ctx.lineCap = "round";
    ctx.lineJoin = "miter";
    ctx.beginPath();

    // curve
    ctx.moveTo(path[0], path[1]);
    for (i = 2; i < pathLength; i += 4) {
      ctx.quadraticCurveTo(path[i], path[i + 1], path[i + 2], path[i + 3]);
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = width * 1.5;
    ctx.stroke();
    ctx.strokeStyle = "white";
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();

    // highlights
    var hiCount = higlight.length;
    if (higlight && hiCount) {
      var tempStore = {};
      var tempLook = {};
      s._solveGuideData(guideData, tempStore);

      for (var i = 0; i < hiCount; i++) {
        tempStore.orient = "fixed";
        s._ratioToPositionData(higlight[i], tempStore, tempLook);

        ctx.beginPath();

        ctx.moveTo(tempLook.x, tempLook.y);
        ctx.lineTo(
          tempLook.x + Math.cos(tempLook.rotation * 0.0174533) * length,
          tempLook.y + Math.sin(tempLook.rotation * 0.0174533) * length
        );

        ctx.strokeStyle = "black";
        ctx.lineWidth = width * 1.5;
        ctx.stroke();
        ctx.strokeStyle = "red";
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
      }
    }

    // end draw
    ctx.restore();

    return err;
  };

  // private methods
  /**
   * Calculate and store optimization data about the desired path to improve performance and accuracy of positions.
   * @param {Object} source The guide data provided to the tween call
   * @param {Object} storage the guide data used by the step calls and plugin to do the job, will be overwritten
   * @returns {undefined|String} Can return an error if unable to generate the data.
   * @private
   */
  s._solveGuideData = function (source, storage) {
    var err = undefined;
    if ((err = s.debug(source))) {
      return err;
    }

    var path = (storage.path = source.path);
    var orient = (storage.orient = source.orient);
    storage.subLines = [];
    storage.totalLength = 0;
    storage.startOffsetRot = 0;
    storage.deltaRotation = 0;
    storage.startData = { ratio: 0 };
    storage.endData = { ratio: 1 };
    storage.animSpan = 1;

    var pathLength = path.length;

    var precision = 10;
    var sx,
      sy,
      cx,
      cy,
      ex,
      ey,
      i,
      j,
      len,
      temp = {};

    sx = path[0];
    sy = path[1];

    // get the data for each curve
    for (i = 2; i < pathLength; i += 4) {
      cx = path[i];
      cy = path[i + 1];
      ex = path[i + 2];
      ey = path[i + 3];

      var subLine = {
        weightings: [],
        estLength: 0,
        portion: 0,
      };

      var subX = sx,
        subY = sy;
      // get the distance data for each point
      for (j = 1; j <= precision; j++) {
        // we need to evaluate t = 1 not t = 0
        s._getParamsForCurve(
          sx,
          sy,
          cx,
          cy,
          ex,
          ey,
          j / precision,
          false,
          temp
        );

        var dx = temp.x - subX,
          dy = temp.y - subY;
        len = Math.sqrt(dx * dx + dy * dy);
        subLine.weightings.push(len);
        subLine.estLength += len;

        subX = temp.x;
        subY = temp.y;
      }

      // figure out full lengths
      storage.totalLength += subLine.estLength;

      // use length to figure out proportional weightings
      for (j = 0; j < precision; j++) {
        len = subLine.estLength;
        subLine.weightings[j] = subLine.weightings[j] / len;
      }

      storage.subLines.push(subLine);
      sx = ex;
      sy = ey;
    }

    // use length to figure out proportional weightings
    len = storage.totalLength;
    var l = storage.subLines.length;
    for (i = 0; i < l; i++) {
      storage.subLines[i].portion = storage.subLines[i].estLength / len;
    }

    // determine start and end data
    var startRatio = isNaN(source.start) ? 0 : source.start;
    var endRatio = isNaN(source.end) ? 1 : source.end;
    s._ratioToPositionData(startRatio, storage, storage.startData);
    s._ratioToPositionData(endRatio, storage, storage.endData);

    // this has to be done last else the prev ratios will be out of place
    storage.startData.ratio = startRatio;
    storage.endData.ratio = endRatio;
    storage.animSpan = storage.endData.ratio - storage.startData.ratio;
  };

  /**
   * Convert a percentage along the line into, a local line (start, control, end) t-value for calculation.
   * @param {Number} ratio The (euclidean distance) percentage into the whole curve.
   * @param {Object} guideData All the information describing the guide to be followed.
   * @param {Object} output Object to save output properties of x,y, and rotation onto.
   * @returns {Object} The output object, useful for isolated calls.
   * @private
   */
  s._ratioToPositionData = function (ratio, guideData, output) {
    var lineSegments = guideData.subLines;

    var i, l, t, test, target;

    var look = 0;
    var precision = 10;
    var effRatio = ratio * guideData.animSpan + guideData.startData.ratio;

    // find subline
    l = lineSegments.length;
    for (i = 0; i < l; i++) {
      test = lineSegments[i].portion;
      if (look + test >= effRatio) {
        target = i;
        break;
      }
      look += test;
    }
    if (target === undefined) {
      target = l - 1;
      look -= test;
    }

    // find midline weighting
    var subLines = lineSegments[target].weightings;
    var portion = test;
    l = subLines.length;
    for (i = 0; i < l; i++) {
      test = subLines[i] * portion;
      if (look + test >= effRatio) {
        break;
      }
      look += test;
    }

    // translate the subline index into a position in the path data
    target = target * 4 + 2;
    // take the distance we've covered in our ratio, and scale it to distance into the weightings
    t = i / precision + ((effRatio - look) / test) * (1 / precision);

    // position
    var pathData = guideData.path;
    s._getParamsForCurve(
      pathData[target - 2],
      pathData[target - 1],
      pathData[target],
      pathData[target + 1],
      pathData[target + 2],
      pathData[target + 3],
      t,
      guideData.orient,
      output
    );

    if (guideData.orient) {
      if (
        ratio >= 0.99999 &&
        ratio <= 1.00001 &&
        guideData.endAbsRot !== undefined
      ) {
        output.rotation = guideData.endAbsRot;
      } else {
        output.rotation +=
          guideData.startOffsetRot + ratio * guideData.deltaRotation;
      }
    }

    return output;
  };

  /**
   * For a given quadratic bezier t-value, what is the position and rotation. Save it onto the output object.
   * @param {Number} sx Start x.
   * @param {Number} sy Start y.
   * @param {Number} cx Control x.
   * @param {Number} cy Control y.
   * @param {Number} ex End x.
   * @param {Number} ey End y.
   * @param {Number} t T value (parametric distance into curve).
   * @param {Boolean} orient Save rotation data.
   * @param {Object} output Object to save output properties of x,y, and rotation onto.
   * @private
   */
  s._getParamsForCurve = function (sx, sy, cx, cy, ex, ey, t, orient, output) {
    var inv = 1 - t;

    // finding a point on a bezier curve
    output.x = inv * inv * sx + 2 * inv * t * cx + t * t * ex;
    output.y = inv * inv * sy + 2 * inv * t * cy + t * t * ey;

    // finding an angle on a bezier curve
    if (orient) {
      // convert from radians back to degrees
      output.rotation =
        57.2957795 *
        Math.atan2(
          (cy - sy) * inv + (ey - cy) * t,
          (cx - sx) * inv + (ex - cx) * t
        );
    }
  };

  /**
   * Perform a check to validate path information so plugin can avoid later error checking.
   * @param {Object} guideData All the information describing the guide to be followed.
   * @returns {undefined|String} The problem found, or undefined if no problems.
   * @private
   */
  s._findPathProblems = function (guideData) {
    var path = guideData.path;
    var valueCount = (path && path.length) || 0; // ensure this is a number to simplify later logic
    if (valueCount < 6 || (valueCount - 2) % 4) {
      var message =
        "\tCannot parse 'path' array due to invalid number of entries in path. ";
      message +=
        "There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). ";
      message +=
        "See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\n";
      message +=
        "Only [ " +
        valueCount +
        " ] values found. Expected: " +
        Math.max(Math.ceil((valueCount - 2) / 4) * 4 + 2, 6); //6, 10, 14,...
      return message;
    }

    for (var i = 0; i < valueCount; i++) {
      if (isNaN(path[i])) {
        return "All data in path array must be numeric";
      }
    }

    var start = guideData.start;
    if (isNaN(start) && !(start === undefined) /* || start < 0 || start > 1*/) {
      // outside 0-1 is unpredictable, but not breaking
      return "'start' out of bounds. Expected 0 to 1, got: " + start;
    }
    var end = guideData.end;
    if (isNaN(end) && end !== undefined /* || end < 0 || end > 1*/) {
      // outside 0-1 is unpredictable, but not breaking
      return "'end' out of bounds. Expected 0 to 1, got: " + end;
    }

    var orient = guideData.orient;
    if (orient) {
      // mirror the check used elsewhere
      if (
        orient != "fixed" &&
        orient != "auto" &&
        orient != "cw" &&
        orient != "ccw"
      ) {
        return (
          'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' +
          orient
        );
      }
    }

    return undefined;
  };

  createjs.MotionGuidePlugin = MotionGuidePlugin;
})();

//##############################################################################
// version.js
//##############################################################################

this.createjs = this.createjs || {};

(function () {
  "use strict";

  /**
   * Static class holding library specific information such as the version and buildDate of
   * the library.
   * @class TweenJS
   **/
  var s = (createjs.TweenJS = createjs.TweenJS || {});

  /**
   * The version string for this release.
   * @property version
   * @type String
   * @static
   **/
  s.version = /*=version*/ "1.0.0"; // injected by build process

  /**
   * The build date for this release in UTC format.
   * @property buildDate
   * @type String
   * @static
   **/
  s.buildDate = /*=date*/ "Thu, 14 Sep 2017 19:47:47 GMT"; // injected by build process
})();

(function () {
  "use strict";

  var document =
    typeof window !== "undefined" && typeof window.document !== "undefined"
      ? window.document
      : {};
  var isCommonjs = typeof module !== "undefined" && module.exports;

  var fn = (function () {
    var val;

    var fnMap = [
      [
        "requestFullscreen",
        "exitFullscreen",
        "fullscreenElement",
        "fullscreenEnabled",
        "fullscreenchange",
        "fullscreenerror",
      ],
      // New WebKit
      [
        "webkitRequestFullscreen",
        "webkitExitFullscreen",
        "webkitFullscreenElement",
        "webkitFullscreenEnabled",
        "webkitfullscreenchange",
        "webkitfullscreenerror",
      ],
      // Old WebKit
      [
        "webkitRequestFullScreen",
        "webkitCancelFullScreen",
        "webkitCurrentFullScreenElement",
        "webkitCancelFullScreen",
        "webkitfullscreenchange",
        "webkitfullscreenerror",
      ],
      [
        "mozRequestFullScreen",
        "mozCancelFullScreen",
        "mozFullScreenElement",
        "mozFullScreenEnabled",
        "mozfullscreenchange",
        "mozfullscreenerror",
      ],
      [
        "msRequestFullscreen",
        "msExitFullscreen",
        "msFullscreenElement",
        "msFullscreenEnabled",
        "MSFullscreenChange",
        "MSFullscreenError",
      ],
    ];

    var i = 0;
    var l = fnMap.length;
    var ret = {};

    for (; i < l; i++) {
      val = fnMap[i];
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }
        return ret;
      }
    }

    return false;
  })();

  var eventNameMap = {
    change: fn.fullscreenchange,
    error: fn.fullscreenerror,
  };

  var screenfull = {
    request: function (element) {
      return new Promise(
        function (resolve, reject) {
          var onFullScreenEntered = function () {
            this.off("change", onFullScreenEntered);
            resolve();
          }.bind(this);

          this.on("change", onFullScreenEntered);

          element = element || document.documentElement;

          Promise.resolve(element[fn.requestFullscreen]()).catch(reject);
        }.bind(this)
      );
    },
    exit: function () {
      return new Promise(
        function (resolve, reject) {
          if (!this.isFullscreen) {
            resolve();
            return;
          }

          var onFullScreenExit = function () {
            this.off("change", onFullScreenExit);
            resolve();
          }.bind(this);

          this.on("change", onFullScreenExit);

          Promise.resolve(document[fn.exitFullscreen]()).catch(reject);
        }.bind(this)
      );
    },
    toggle: function (element) {
      return this.isFullscreen ? this.exit() : this.request(element);
    },
    onchange: function (callback) {
      this.on("change", callback);
    },
    onerror: function (callback) {
      this.on("error", callback);
    },
    on: function (event, callback) {
      var eventName = eventNameMap[event];
      if (eventName) {
        document.addEventListener(eventName, callback, false);
      }
    },
    off: function (event, callback) {
      var eventName = eventNameMap[event];
      if (eventName) {
        document.removeEventListener(eventName, callback, false);
      }
    },
    raw: fn,
  };

  if (!fn) {
    if (isCommonjs) {
      module.exports = { isEnabled: false };
    } else {
      window.screenfull = { isEnabled: false };
    }

    return;
  }

  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function () {
        return Boolean(document[fn.fullscreenElement]);
      },
    },
    element: {
      enumerable: true,
      get: function () {
        return document[fn.fullscreenElement];
      },
    },
    isEnabled: {
      enumerable: true,
      get: function () {
        // Coerce to boolean in case of old WebKit
        return Boolean(document[fn.fullscreenEnabled]);
      },
    },
  });

  if (isCommonjs) {
    module.exports = screenfull;
  } else {
    window.screenfull = screenfull;
  }
})();

/*!
 * Platform.js <https://mths.be/platform>
 * Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 * Copyright 2011-2013 John-David Dalton
 * Available under MIT license <https://mths.be/mit>
 */
(function () {
  "use strict";

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    function: true,
    object: true,
  };

  /** Used as a reference to the global object. */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object. */
  var oldRoot = root;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module`. */
  var freeModule =
    objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal =
    freeExports && freeModule && typeof global == "object" && global;
  if (
    freeGlobal &&
    (freeGlobal.global === freeGlobal ||
      freeGlobal.window === freeGlobal ||
      freeGlobal.self === freeGlobal)
  ) {
    root = freeGlobal;
  }

  /**
   * Used as the maximum length of an array-like object.
   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   */
  var maxSafeInteger = Math.pow(2, 53) - 1;

  /** Regular expression to detect Opera. */
  var reOpera = /\bOpera/;

  /** Possible global object. */
  var thisBinding = this;

  /** Used for native method references. */
  var objectProto = Object.prototype;

  /** Used to check for own properties of an object. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to resolve the internal `[[Class]]` of values. */
  var toString = objectProto.toString;

  /*--------------------------------------------------------------------------*/

  /**
   * Capitalizes a string value.
   *
   * @private
   * @param {string} string The string to capitalize.
   * @returns {string} The capitalized string.
   */
  function capitalize(string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
  function cleanupOS(os, pattern, label) {
    // Platform tokens are defined at:
    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    var data = {
      "10.0": "10",
      6.4: "10 Technical Preview",
      6.3: "8.1",
      6.2: "8",
      6.1: "Server 2008 R2 / 7",
      "6.0": "Server 2008 / Vista",
      5.2: "Server 2003 / XP 64-bit",
      5.1: "XP",
      5.01: "2000 SP1",
      "5.0": "2000",
      "4.0": "NT",
      "4.90": "ME",
    };
    // Detect Windows version from platform tokens.
    if (
      pattern &&
      label &&
      /^Win/i.test(os) &&
      !/^Windows Phone /i.test(os) &&
      (data = data[/[\d.]+$/.exec(os)])
    ) {
      os = "Windows " + data;
    }
    // Correct character case and cleanup string.
    os = String(os);

    if (pattern && label) {
      os = os.replace(RegExp(pattern, "i"), label);
    }

    os = format(
      os
        .replace(/ ce$/i, " CE")
        .replace(/\bhpw/i, "web")
        .replace(/\bMacintosh\b/, "Mac OS")
        .replace(/_PowerPC\b/i, " OS")
        .replace(/\b(OS X) [^ \d]+/i, "$1")
        .replace(/\bMac (OS X)\b/, "$1")
        .replace(/\/(\d)/, " $1")
        .replace(/_/g, ".")
        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "")
        .replace(/\bx86\.64\b/gi, "x86_64")
        .replace(/\b(Windows Phone) OS\b/, "$1")
        .replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1")
        .split(" on ")[0]
    );

    return os;
  }

  /**
   * An iteration utility for arrays and objects.
   *
   * @private
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   */
  function each(object, callback) {
    var index = -1,
      length = object ? object.length : 0;

    if (typeof length == "number" && length > -1 && length <= maxSafeInteger) {
      while (++index < length) {
        callback(object[index], index, object);
      }
    } else {
      forOwn(object, callback);
    }
  }

  /**
   * Trim and conditionally capitalize string values.
   *
   * @private
   * @param {string} string The string to format.
   * @returns {string} The formatted string.
   */
  function format(string) {
    string = trim(string);
    return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
  }

  /**
   * Iterates over an object's own properties, executing the `callback` for each.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function executed per own property.
   */
  function forOwn(object, callback) {
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        callback(object[key], key, object);
      }
    }
  }

  /**
   * Gets the internal `[[Class]]` of a value.
   *
   * @private
   * @param {*} value The value.
   * @returns {string} The `[[Class]]`.
   */
  function getClassOf(value) {
    return value == null
      ? capitalize(value)
      : toString.call(value).slice(8, -1);
  }

  /**
   * Host objects can return type values that are different from their actual
   * data type. The objects we are concerned with usually return non-primitive
   * types of "object", "function", or "unknown".
   *
   * @private
   * @param {*} object The owner of the property.
   * @param {string} property The property to check.
   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
   */
  function isHostType(object, property) {
    var type = object != null ? typeof object[property] : "number";
    return (
      !/^(?:boolean|number|string|undefined)$/.test(type) &&
      (type == "object" ? !!object[property] : true)
    );
  }

  /**
   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
   *
   * @private
   * @param {string} string The string to qualify.
   * @returns {string} The qualified string.
   */
  function qualify(string) {
    return String(string).replace(/([ -])(?!$)/g, "$1?");
  }

  /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
  function reduce(array, callback) {
    var accumulator = null;
    each(array, function (value, index) {
      accumulator = callback(accumulator, value, index, array);
    });
    return accumulator;
  }

  /**
   * Removes leading and trailing whitespace from a string.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
  function trim(string) {
    return String(string).replace(/^ +| +$/g, "");
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new platform object.
   *
   * @memberOf platform
   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
   *  context object.
   * @returns {Object} A platform object.
   */
  function parse(ua) {
    /** The environment context object. */
    var context = root;

    /** Used to flag when a custom context is provided. */
    var isCustomContext =
      ua && typeof ua == "object" && getClassOf(ua) != "String";

    // Juggle arguments.
    if (isCustomContext) {
      context = ua;
      ua = null;
    }

    /** Browser navigator object. */
    var nav = context.navigator || {};

    /** Browser user agent string. */
    var userAgent = nav.userAgent || "";

    ua || (ua = userAgent);

    /** Used to flag when `thisBinding` is the [ModuleScope]. */
    var isModuleScope = isCustomContext || thisBinding == oldRoot;

    /** Used to detect if browser is like Chrome. */
    var likeChrome = isCustomContext
      ? !!nav.likeChrome
      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

    /** Internal `[[Class]]` value shortcuts. */
    var objectClass = "Object",
      airRuntimeClass = isCustomContext
        ? objectClass
        : "ScriptBridgingProxyObject",
      enviroClass = isCustomContext ? objectClass : "Environment",
      javaClass =
        isCustomContext && context.java
          ? "JavaPackage"
          : getClassOf(context.java),
      phantomClass = isCustomContext ? objectClass : "RuntimeObject";

    /** Detect Java environments. */
    var java = /\bJava/.test(javaClass) && context.java;

    /** Detect Rhino. */
    var rhino = java && getClassOf(context.environment) == enviroClass;

    /** A character to represent alpha. */
    var alpha = java ? "a" : "\u03b1";

    /** A character to represent beta. */
    var beta = java ? "b" : "\u03b2";

    /** Browser document object. */
    var doc = context.document || {};

    /**
     * Detect Opera browser (Presto-based).
     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
     */
    var opera = context.operamini || context.opera;

    /** Opera `[[Class]]`. */
    var operaClass = reOpera.test(
      (operaClass =
        isCustomContext && opera ? opera["[[Class]]"] : getClassOf(opera))
    )
      ? operaClass
      : (opera = null);

    /*------------------------------------------------------------------------*/

    /** Temporary variable used over the script's lifetime. */
    var data;

    /** The CPU architecture. */
    var arch = ua;

    /** Platform description array. */
    var description = [];

    /** Platform alpha/beta indicator. */
    var prerelease = null;

    /** A flag to indicate that environment features should be used to resolve the platform. */
    var useFeatures = ua == userAgent;

    /** The browser/environment version. */
    var version =
      useFeatures &&
      opera &&
      typeof opera.version == "function" &&
      opera.version();

    /** A flag to indicate if the OS ends with "/ Version" */
    var isSpecialCasedOS;

    /* Detectable layout engines (order is important). */
    var layout = getLayout([
      { label: "EdgeHTML", pattern: "Edge" },
      "Trident",
      { label: "WebKit", pattern: "AppleWebKit" },
      "iCab",
      "Presto",
      "NetFront",
      "Tasman",
      "KHTML",
      "Gecko",
    ]);

    /* Detectable browser names (order is important). */
    var name = getName([
      "Adobe AIR",
      "Arora",
      "Avant Browser",
      "Breach",
      "Camino",
      "Electron",
      "Epiphany",
      "Fennec",
      "Flock",
      "Galeon",
      "GreenBrowser",
      "iCab",
      "Iceweasel",
      "K-Meleon",
      "Konqueror",
      "Lunascape",
      "Maxthon",
      { label: "Microsoft Edge", pattern: "Edge" },
      "Midori",
      "Nook Browser",
      "PaleMoon",
      "PhantomJS",
      "Raven",
      "Rekonq",
      "RockMelt",
      { label: "Samsung Internet", pattern: "SamsungBrowser" },
      "SeaMonkey",
      { label: "Silk", pattern: "(?:Cloud9|Silk-Accelerated)" },
      "Sleipnir",
      "SlimBrowser",
      { label: "SRWare Iron", pattern: "Iron" },
      "Sunrise",
      "Swiftfox",
      "Waterfox",
      "WebPositive",
      "Opera Mini",
      { label: "Opera Mini", pattern: "OPiOS" },
      "Opera",
      { label: "Opera", pattern: "OPR" },
      "Chrome",
      { label: "Chrome Mobile", pattern: "(?:CriOS|CrMo)" },
      { label: "Firefox", pattern: "(?:Firefox|Minefield)" },
      { label: "Firefox for iOS", pattern: "FxiOS" },
      { label: "IE", pattern: "IEMobile" },
      { label: "IE", pattern: "MSIE" },
      "Safari",
    ]);

    /* Detectable products (order is important). */
    var product = getProduct([
      { label: "BlackBerry", pattern: "BB10" },
      "BlackBerry",
      { label: "Galaxy S", pattern: "GT-I9000" },
      { label: "Galaxy S2", pattern: "GT-I9100" },
      { label: "Galaxy S3", pattern: "GT-I9300" },
      { label: "Galaxy S4", pattern: "GT-I9500" },
      { label: "Galaxy S5", pattern: "SM-G900" },
      { label: "Galaxy S6", pattern: "SM-G920" },
      { label: "Galaxy S6 Edge", pattern: "SM-G925" },
      { label: "Galaxy S7", pattern: "SM-G930" },
      { label: "Galaxy S7 Edge", pattern: "SM-G935" },
      "Google TV",
      "Lumia",
      "iPad",
      "iPod",
      "iPhone",
      "Kindle",
      { label: "Kindle Fire", pattern: "(?:Cloud9|Silk-Accelerated)" },
      "Nexus",
      "Nook",
      "PlayBook",
      "PlayStation Vita",
      "PlayStation",
      "TouchPad",
      "Transformer",
      { label: "Wii U", pattern: "WiiU" },
      "Wii",
      "Xbox One",
      { label: "Xbox 360", pattern: "Xbox" },
      "Xoom",
    ]);

    /* Detectable manufacturers. */
    var manufacturer = getManufacturer({
      Apple: { iPad: 1, iPhone: 1, iPod: 1 },
      Archos: {},
      Amazon: { Kindle: 1, "Kindle Fire": 1 },
      Asus: { Transformer: 1 },
      "Barnes & Noble": { Nook: 1 },
      BlackBerry: { PlayBook: 1 },
      Google: { "Google TV": 1, Nexus: 1 },
      HP: { TouchPad: 1 },
      HTC: {},
      LG: {},
      Microsoft: { Xbox: 1, "Xbox One": 1 },
      Motorola: { Xoom: 1 },
      Nintendo: { "Wii U": 1, Wii: 1 },
      Nokia: { Lumia: 1 },
      Samsung: {
        "Galaxy S": 1,
        "Galaxy S2": 1,
        "Galaxy S3": 1,
        "Galaxy S4": 1,
      },
      Sony: { PlayStation: 1, "PlayStation Vita": 1 },
    });

    /* Detectable operating systems (order is important). */
    var os = getOS([
      "Windows Phone",
      "Android",
      "CentOS",
      { label: "Chrome OS", pattern: "CrOS" },
      "Debian",
      "Fedora",
      "FreeBSD",
      "Gentoo",
      "Haiku",
      "Kubuntu",
      "Linux Mint",
      "OpenBSD",
      "Red Hat",
      "SuSE",
      "Ubuntu",
      "Xubuntu",
      "Cygwin",
      "Symbian OS",
      "hpwOS",
      "webOS ",
      "webOS",
      "Tablet OS",
      "Tizen",
      "Linux",
      "Mac OS X",
      "Macintosh",
      "Mac",
      "Windows 98;",
      "Windows ",
    ]);

    /*------------------------------------------------------------------------*/

    /**
     * Picks the layout engine from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected layout engine.
     */
    function getLayout(guesses) {
      return reduce(guesses, function (result, guess) {
        return (
          result ||
          (RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(
            ua
          ) &&
            (guess.label || guess))
        );
      });
    }

    /**
     * Picks the manufacturer from an array of guesses.
     *
     * @private
     * @param {Array} guesses An object of guesses.
     * @returns {null|string} The detected manufacturer.
     */
    function getManufacturer(guesses) {
      return reduce(guesses, function (result, value, key) {
        // Lookup the manufacturer by product or scan the UA for the manufacturer.
        return (
          result ||
          ((value[product] ||
            value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
            RegExp("\\b" + qualify(key) + "(?:\\b|\\w*\\d)", "i").exec(ua)) &&
            key)
        );
      });
    }

    /**
     * Picks the browser name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected browser name.
     */
    function getName(guesses) {
      return reduce(guesses, function (result, guess) {
        return (
          result ||
          (RegExp("\\b" + (guess.pattern || qualify(guess)) + "\\b", "i").exec(
            ua
          ) &&
            (guess.label || guess))
        );
      });
    }

    /**
     * Picks the OS name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected OS name.
     */
    function getOS(guesses) {
      return reduce(guesses, function (result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (
          !result &&
          (result = RegExp("\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(
            ua
          ))
        ) {
          result = cleanupOS(result, pattern, guess.label || guess);
        }
        return result;
      });
    }

    /**
     * Picks the product name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected product name.
     */
    function getProduct(guesses) {
      return reduce(guesses, function (result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (
          !result &&
          (result =
            RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(ua) ||
            RegExp("\\b" + pattern + " *\\w+-[\\w]*", "i").exec(ua) ||
            RegExp(
              "\\b" + pattern + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)",
              "i"
            ).exec(ua))
        ) {
          // Split by forward slash and append product version if needed.
          if (
            (result = String(
              guess.label && !RegExp(pattern, "i").test(guess.label)
                ? guess.label
                : result
            ).split("/"))[1] &&
            !/[\d.]+/.test(result[0])
          ) {
            result[0] += " " + result[1];
          }
          // Correct character case and cleanup string.
          guess = guess.label || guess;
          result = format(
            result[0]
              .replace(RegExp(pattern, "i"), guess)
              .replace(RegExp("; *(?:" + guess + "[_-])?", "i"), " ")
              .replace(RegExp("(" + guess + ")[-_.]?(\\w)", "i"), "$1 $2")
          );
        }
        return result;
      });
    }

    /**
     * Resolves the version using an array of UA patterns.
     *
     * @private
     * @param {Array} patterns An array of UA patterns.
     * @returns {null|string} The detected version.
     */
    function getVersion(patterns) {
      return reduce(patterns, function (result, pattern) {
        return (
          result ||
          (RegExp(
            pattern +
              "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)",
            "i"
          ).exec(ua) || 0)[1] ||
          null
        );
      });
    }

    /**
     * Returns `platform.description` when the platform object is coerced to a string.
     *
     * @name toString
     * @memberOf platform
     * @returns {string} Returns `platform.description` if available, else an empty string.
     */
    function toStringPlatform() {
      return this.description || "";
    }

    /*------------------------------------------------------------------------*/

    // Convert layout to an array so we can add extra details.
    layout && (layout = [layout]);

    // Detect product names that contain their manufacturer's name.
    if (manufacturer && !product) {
      product = getProduct([manufacturer]);
    }
    // Clean up Google TV.
    if ((data = /\bGoogle TV\b/.exec(product))) {
      product = data[0];
    }
    // Detect simulators.
    if (/\bSimulator\b/i.test(ua)) {
      product = (product ? product + " " : "") + "Simulator";
    }
    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
    if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
      description.push("running in Turbo/Uncompressed mode");
    }
    // Detect IE Mobile 11.
    if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
      data = parse(ua.replace(/like iPhone OS/, ""));
      manufacturer = data.manufacturer;
      product = data.product;
    }
    // Detect iOS.
    else if (/^iP/.test(product)) {
      name || (name = "Safari");
      os =
        "iOS" +
        ((data = / OS ([\d_]+)/i.exec(ua))
          ? " " + data[1].replace(/_/g, ".")
          : "");
    }
    // Detect Kubuntu.
    else if (name == "Konqueror" && !/buntu/i.test(os)) {
      os = "Kubuntu";
    }
    // Detect Android browsers.
    else if (
      (manufacturer &&
        manufacturer != "Google" &&
        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) ||
          /\bVita\b/.test(product))) ||
      (/\bAndroid\b/.test(os) &&
        /^Chrome/.test(name) &&
        /\bVersion\//i.test(ua))
    ) {
      name = "Android Browser";
      os = /\bAndroid\b/.test(os) ? os : "Android";
    }
    // Detect Silk desktop/accelerated modes.
    else if (name == "Silk") {
      if (!/\bMobi/i.test(ua)) {
        os = "Android";
        description.unshift("desktop mode");
      }
      if (/Accelerated *= *true/i.test(ua)) {
        description.unshift("accelerated");
      }
    }
    // Detect PaleMoon identifying as Firefox.
    else if (name == "PaleMoon" && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
      description.push("identifying as Firefox " + data[1]);
    }
    // Detect Firefox OS and products running Firefox.
    else if (name == "Firefox" && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
      os || (os = "Firefox OS");
      product || (product = data[1]);
    }
    // Detect false positives for Firefox/Safari.
    else if (
      !name ||
      (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))
    ) {
      // Escape the `/` for Firefox 1.
      if (
        name &&
        !product &&
        /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))
      ) {
        // Clear name of false positives.
        name = null;
      }
      // Reassign a generic name.
      if (
        (data = product || manufacturer || os) &&
        (product ||
          manufacturer ||
          /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))
      ) {
        name =
          /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) +
          " Browser";
      }
    }
    // Add Chrome version to description for Electron.
    else if (
      name == "Electron" &&
      (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])
    ) {
      description.push("Chromium " + data);
    }
    // Detect non-Opera (Presto-based) versions (order is important).
    if (!version) {
      version = getVersion([
        "(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))",
        "Version",
        qualify(name),
        "(?:Firefox|Minefield|NetFront)",
      ]);
    }
    // Detect stubborn layout engines.
    if (
      (data =
        (layout == "iCab" && parseFloat(version) > 3 && "WebKit") ||
        (/\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? "Blink" : "Presto")) ||
        (/\b(?:Midori|Nook|Safari)\b/i.test(ua) &&
          !/^(?:Trident|EdgeHTML)$/.test(layout) &&
          "WebKit") ||
        (!layout &&
          /\bMSIE\b/i.test(ua) &&
          (os == "Mac OS" ? "Tasman" : "Trident")) ||
        (layout == "WebKit" &&
          /\bPlayStation\b(?! Vita\b)/i.test(name) &&
          "NetFront"))
    ) {
      layout = [data];
    }
    // Detect Windows Phone 7 desktop mode.
    if (
      name == "IE" &&
      (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])
    ) {
      name += " Mobile";
      os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
      description.unshift("desktop mode");
    }
    // Detect Windows Phone 8.x desktop mode.
    else if (/\bWPDesktop\b/i.test(ua)) {
      name = "IE Mobile";
      os = "Windows Phone 8.x";
      description.unshift("desktop mode");
      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
    }
    // Detect IE 11 identifying as other browsers.
    else if (
      name != "IE" &&
      layout == "Trident" &&
      (data = /\brv:([\d.]+)/.exec(ua))
    ) {
      if (name) {
        description.push(
          "identifying as " + name + (version ? " " + version : "")
        );
      }
      name = "IE";
      version = data[1];
    }
    // Leverage environment features.
    if (useFeatures) {
      // Detect server-side environments.
      // Rhino has a global function while others have a global object.
      if (isHostType(context, "global")) {
        if (java) {
          data = java.lang.System;
          arch = data.getProperty("os.arch");
          os =
            os ||
            data.getProperty("os.name") + " " + data.getProperty("os.version");
        }
        if (rhino) {
          try {
            version = context.require("ringo/engine").version.join(".");
            name = "RingoJS";
          } catch (e) {
            if (
              (data = context.system) &&
              data.global.system == context.system
            ) {
              name = "Narwhal";
              os || (os = data[0].os || null);
            }
          }
          if (!name) {
            name = "Rhino";
          }
        } else if (
          typeof context.process == "object" &&
          !context.process.browser &&
          (data = context.process)
        ) {
          if (typeof data.versions == "object") {
            if (typeof data.versions.electron == "string") {
              description.push("Node " + data.versions.node);
              name = "Electron";
              version = data.versions.electron;
            } else if (typeof data.versions.nw == "string") {
              description.push(
                "Chromium " + version,
                "Node " + data.versions.node
              );
              name = "NW.js";
              version = data.versions.nw;
            }
          }
          if (!name) {
            name = "Node.js";
            arch = data.arch;
            os = data.platform;
            version = /[\d.]+/.exec(data.version);
            version = version ? version[0] : null;
          }
        }
      }
      // Detect Adobe AIR.
      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
        name = "Adobe AIR";
        os = data.flash.system.Capabilities.os;
      }
      // Detect PhantomJS.
      else if (getClassOf((data = context.phantom)) == phantomClass) {
        name = "PhantomJS";
        version =
          (data = data.version || null) &&
          data.major + "." + data.minor + "." + data.patch;
      }
      // Detect IE compatibility modes.
      else if (
        typeof doc.documentMode == "number" &&
        (data = /\bTrident\/(\d+)/i.exec(ua))
      ) {
        // We're in compatibility mode when the Trident version + 4 doesn't
        // equal the document mode.
        version = [version, doc.documentMode];
        if ((data = +data[1] + 4) != version[1]) {
          description.push("IE " + version[1] + " mode");
          layout && (layout[1] = "");
          version[1] = data;
        }
        version = name == "IE" ? String(version[1].toFixed(1)) : version[0];
      }
      // Detect IE 11 masking as other browsers.
      else if (
        typeof doc.documentMode == "number" &&
        /^(?:Chrome|Firefox)\b/.test(name)
      ) {
        description.push("masking as " + name + " " + version);
        name = "IE";
        version = "11.0";
        layout = ["Trident"];
        os = "Windows";
      }
      os = os && format(os);
    }
    // Detect prerelease phases.
    if (
      version &&
      (data =
        /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
        /(?:alpha|beta)(?: ?\d)?/i.exec(
          ua + ";" + (useFeatures && nav.appMinorVersion)
        ) ||
        (/\bMinefield\b/i.test(ua) && "a"))
    ) {
      prerelease = /b/i.test(data) ? "beta" : "alpha";
      version =
        version.replace(RegExp(data + "\\+?$"), "") +
        (prerelease == "beta" ? beta : alpha) +
        (/\d+\+?/.exec(data) || "");
    }
    // Detect Firefox Mobile.
    if (
      name == "Fennec" ||
      (name == "Firefox" && /\b(?:Android|Firefox OS)\b/.test(os))
    ) {
      name = "Firefox Mobile";
    }
    // Obscure Maxthon's unreliable version.
    else if (name == "Maxthon" && version) {
      version = version.replace(/\.[\d.]+/, ".x");
    }
    // Detect Xbox 360 and Xbox One.
    else if (/\bXbox\b/i.test(product)) {
      if (product == "Xbox 360") {
        os = null;
      }
      if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
        description.unshift("mobile mode");
      }
    }
    // Add mobile postfix.
    else if (
      (/^(?:Chrome|IE|Opera)$/.test(name) ||
        (name && !product && !/Browser|Mobi/.test(name))) &&
      (os == "Windows CE" || /Mobi/i.test(ua))
    ) {
      name += " Mobile";
    }
    // Detect IE platform preview.
    else if (name == "IE" && useFeatures) {
      try {
        if (context.external === null) {
          description.unshift("platform preview");
        }
      } catch (e) {
        description.unshift("embedded");
      }
    }
    // Detect BlackBerry OS version.
    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
    else if (
      (/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) &&
      (data =
        (RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(ua) ||
          0)[1] || version)
    ) {
      data = [data, /BB10/.test(ua)];
      os =
        (data[1]
          ? ((product = null), (manufacturer = "BlackBerry"))
          : "Device Software") +
        " " +
        data[0];
      version = null;
    }
    // Detect Opera identifying/masking itself as another browser.
    // http://www.opera.com/support/kb/view/843/
    else if (
      this != forOwn &&
      product != "Wii" &&
      ((useFeatures && opera) ||
        (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
        (name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os)) ||
        (name == "IE" &&
          ((os && !/^Win/.test(os) && version > 5.5) ||
            (/\bWindows XP\b/.test(os) && version > 8) ||
            (version == 8 && !/\bTrident\b/.test(ua))))) &&
      !reOpera.test(
        (data = parse.call(forOwn, ua.replace(reOpera, "") + ";"))
      ) &&
      data.name
    ) {
      // When "identifying", the UA contains both Opera and the other browser's name.
      data = "ing as " + data.name + ((data = data.version) ? " " + data : "");
      if (reOpera.test(name)) {
        if (/\bIE\b/.test(data) && os == "Mac OS") {
          os = null;
        }
        data = "identify" + data;
      }
      // When "masking", the UA contains only the other browser's name.
      else {
        data = "mask" + data;
        if (operaClass) {
          name = format(operaClass.replace(/([a-z])([A-Z])/g, "$1 $2"));
        } else {
          name = "Opera";
        }
        if (/\bIE\b/.test(data)) {
          os = null;
        }
        if (!useFeatures) {
          version = null;
        }
      }
      layout = ["Presto"];
      description.push(data);
    }
    // Detect WebKit Nightly and approximate Chrome/Safari versions.
    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
      // Correct build number for numeric comparison.
      // (e.g. "532.5" becomes "532.05")
      data = [parseFloat(data.replace(/\.(\d)$/, ".0$1")), data];
      // Nightly builds are postfixed with a "+".
      if (name == "Safari" && data[1].slice(-1) == "+") {
        name = "WebKit Nightly";
        prerelease = "alpha";
        version = data[1].slice(0, -1);
      }
      // Clear incorrect browser versions.
      else if (
        version == data[1] ||
        version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])
      ) {
        version = null;
      }
      // Use the full Chrome version when available.
      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
      // Detect Blink layout engine.
      if (
        data[0] == 537.36 &&
        data[2] == 537.36 &&
        parseFloat(data[1]) >= 28 &&
        layout == "WebKit"
      ) {
        layout = ["Blink"];
      }
      // Detect JavaScriptCore.
      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
      if (!useFeatures || (!likeChrome && !data[1])) {
        layout && (layout[1] = "like Safari");
        data =
          ((data = data[0]),
          data < 400
            ? 1
            : data < 500
            ? 2
            : data < 526
            ? 3
            : data < 533
            ? 4
            : data < 534
            ? "4+"
            : data < 535
            ? 5
            : data < 537
            ? 6
            : data < 538
            ? 7
            : data < 601
            ? 8
            : "8");
      } else {
        layout && (layout[1] = "like Chrome");
        data =
          data[1] ||
          ((data = data[0]),
          data < 530
            ? 1
            : data < 532
            ? 2
            : data < 532.05
            ? 3
            : data < 533
            ? 4
            : data < 534.03
            ? 5
            : data < 534.07
            ? 6
            : data < 534.1
            ? 7
            : data < 534.13
            ? 8
            : data < 534.16
            ? 9
            : data < 534.24
            ? 10
            : data < 534.3
            ? 11
            : data < 535.01
            ? 12
            : data < 535.02
            ? "13+"
            : data < 535.07
            ? 15
            : data < 535.11
            ? 16
            : data < 535.19
            ? 17
            : data < 536.05
            ? 18
            : data < 536.1
            ? 19
            : data < 537.01
            ? 20
            : data < 537.11
            ? "21+"
            : data < 537.13
            ? 23
            : data < 537.18
            ? 24
            : data < 537.24
            ? 25
            : data < 537.36
            ? 26
            : layout != "Blink"
            ? "27"
            : "28");
      }
      // Add the postfix of ".x" or "+" for approximate versions.
      layout &&
        (layout[1] +=
          " " +
          (data +=
            typeof data == "number" ? ".x" : /[.+]/.test(data) ? "" : "+"));
      // Obscure version for some Safari 1-2 releases.
      if (name == "Safari" && (!version || parseInt(version) > 45)) {
        version = data;
      }
    }
    // Detect Opera desktop modes.
    if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
      name += " ";
      description.unshift("desktop mode");
      if (data == "zvav") {
        name += "Mini";
        version = null;
      } else {
        name += "Mobile";
      }
      os = os.replace(RegExp(" *" + data + "$"), "");
    }
    // Detect Chrome desktop mode.
    else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
      description.unshift("desktop mode");
      name = "Chrome Mobile";
      version = null;

      if (/\bOS X\b/.test(os)) {
        manufacturer = "Apple";
        os = "iOS 4.3+";
      } else {
        os = null;
      }
    }
    // Strip incorrect OS versions.
    if (
      version &&
      version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
      ua.indexOf("/" + data + "-") > -1
    ) {
      os = trim(os.replace(data, ""));
    }
    // Add layout engine.
    if (
      layout &&
      !/\b(?:Avant|Nook)\b/.test(name) &&
      (/Browser|Lunascape|Maxthon/.test(name) ||
        (name != "Safari" && /^iOS/.test(os) && /\bSafari\b/.test(layout[1])) ||
        (/^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(
          name
        ) &&
          layout[1]))
    ) {
      // Don't add layout details to description if they are falsey.
      (data = layout[layout.length - 1]) && description.push(data);
    }
    // Combine contextual information.
    if (description.length) {
      description = ["(" + description.join("; ") + ")"];
    }
    // Append manufacturer to description.
    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
      description.push("on " + manufacturer);
    }
    // Append product to description.
    if (product) {
      description.push(
        (/^on /.test(description[description.length - 1]) ? "" : "on ") +
          product
      );
    }
    // Parse the OS into an object.
    if (os) {
      data = / ([\d.+]+)$/.exec(os);
      isSpecialCasedOS =
        data && os.charAt(os.length - data[0].length - 1) == "/";
      os = {
        architecture: 32,
        family: data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
        version: data ? data[1] : null,
        toString: function () {
          var version = this.version;
          return (
            this.family +
            (version && !isSpecialCasedOS ? " " + version : "") +
            (this.architecture == 64 ? " 64-bit" : "")
          );
        },
      };
    }
    // Add browser/OS architecture.
    if (
      (data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) &&
      !/\bi686\b/i.test(arch)
    ) {
      if (os) {
        os.architecture = 64;
        os.family = os.family.replace(RegExp(" *" + data), "");
      }
      if (
        name &&
        (/\bWOW64\b/i.test(ua) ||
          (useFeatures &&
            /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) &&
            !/\bWin64; x64\b/i.test(ua)))
      ) {
        description.unshift("32-bit");
      }
    }
    // Chrome 39 and above on OS X is always 64-bit.
    else if (
      os &&
      /^OS X/.test(os.family) &&
      name == "Chrome" &&
      parseFloat(version) >= 39
    ) {
      os.architecture = 64;
    }

    ua || (ua = null);

    /*------------------------------------------------------------------------*/

    /**
     * The platform object.
     *
     * @name platform
     * @type Object
     */
    var platform = {};

    /**
     * The platform description.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.description = ua;

    /**
     * The name of the browser's layout engine.
     *
     * The list of common layout engines include:
     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.layout = layout && layout[0];

    /**
     * The name of the product's manufacturer.
     *
     * The list of manufacturers include:
     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
     * "Nokia", "Samsung" and "Sony"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.manufacturer = manufacturer;

    /**
     * The name of the browser/environment.
     *
     * The list of common browser names include:
     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
     * "Opera Mini" and "Opera"
     *
     * Mobile versions of some browsers have "Mobile" appended to their name:
     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.name = name;

    /**
     * The alpha/beta release indicator.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.prerelease = prerelease;

    /**
     * The name of the product hosting the browser.
     *
     * The list of common products include:
     *
     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.product = product;

    /**
     * The browser's user agent string.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.ua = ua;

    /**
     * The browser/environment version.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.version = name && version;

    /**
     * The name of the operating system.
     *
     * @memberOf platform
     * @type Object
     */
    platform.os = os || {
      /**
       * The CPU architecture the OS is built for.
       *
       * @memberOf platform.os
       * @type number|null
       */
      architecture: null,

      /**
       * The family of the OS.
       *
       * Common values include:
       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
       * "Android", "iOS" and "Windows Phone"
       *
       * @memberOf platform.os
       * @type string|null
       */
      family: null,

      /**
       * The version of the OS.
       *
       * @memberOf platform.os
       * @type string|null
       */
      version: null,

      /**
       * Returns the OS string.
       *
       * @memberOf platform.os
       * @returns {string} The OS string.
       */
      toString: function () {
        return "null";
      },
    };

    platform.parse = parse;
    platform.toString = toStringPlatform;

    if (platform.version) {
      description.unshift(version);
    }
    if (platform.name) {
      description.unshift(name);
    }
    if (
      os &&
      name &&
      !(os == String(os).split(" ")[0] && (os == name.split(" ")[0] || product))
    ) {
      description.push(product ? "(" + os + ")" : "on " + os);
    }
    if (description.length) {
      platform.description = description.join(" ");
    }
    return platform;
  }

  /*--------------------------------------------------------------------------*/

  // Export platform.
  var platform = parse();

  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (
    typeof define == "function" &&
    typeof define.amd == "object" &&
    define.amd
  ) {
    // Expose platform on the global object to prevent errors when platform is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    root.platform = platform;

    // Define as an anonymous module so platform can be aliased through path mapping.
    define(function () {
      return platform;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for CommonJS support.
    forOwn(platform, function (value, key) {
      freeExports[key] = value;
    });
  } else {
    // Export to the global object.
    root.platform = platform;
  }
}.call(this));

var s_iScaleFactor = 1;
var s_bIsIphone = false;
var s_iOffsetX;
var s_iOffsetY;
var s_bFocus = true;
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function (a) {
  (jQuery.browser = jQuery.browser || {}).mobile =
    /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    );
})(navigator.userAgent || navigator.vendor || window.opera);

$(window).resize(function () {
  sizeHandler();
});

function NotImplementedError(message) {
  this.name = "NotImplementedError";
  this.message = message || "";
}
NotImplementedError.prototype = Error.prototype;

function error(szMessage) {
  throw { name: "NotImplementedError", message: szMessage };
}

function trace(szMsg) {
  console.log(szMsg);
}

window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
  sizeHandler();
}

function ifArrayContainsValue(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

function isIpad() {
  var isIpad = navigator.userAgent.toLowerCase().indexOf("ipad") !== -1;

  if (
    !isIpad &&
    navigator.userAgent.match(/Mac/) &&
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2
  ) {
    return true;
  }

  return isIpad;
}

function isMobile() {
  if (isIpad()) {
    return true;
  }

  return jQuery.browser.mobile;
}

function getSize(Name) {
  var size;
  var name = Name.toLowerCase();
  var document = window.document;
  var documentElement = document.documentElement;
  if (window["inner" + Name] === undefined) {
    // IE6 & IE7 don't have window.innerWidth or innerHeight
    size = documentElement["client" + Name];
  } else if (window["inner" + Name] != documentElement["client" + Name]) {
    // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

    // Insert markup to test if a media query will match document.doumentElement["client" + Name]
    var bodyElement = document.createElement("body");
    bodyElement.id = "vpw-test-b";
    bodyElement.style.cssText = "overflow:scroll";
    var divElement = document.createElement("div");
    divElement.id = "vpw-test-d";
    divElement.style.cssText = "position:absolute;top:-1000px";
    // Getting specific on the CSS selector so it won't get overridden easily
    divElement.innerHTML =
      "<style>@media(" +
      name +
      ":" +
      documentElement["client" + Name] +
      "px){body#vpw-test-b div#vpw-test-d{" +
      name +
      ":7px!important}}</style>";
    bodyElement.appendChild(divElement);
    documentElement.insertBefore(bodyElement, document.head);

    if (divElement["offset" + Name] == 7) {
      // Media query matches document.documentElement["client" + Name]
      size = documentElement["client" + Name];
    } else {
      // Media query didn't match, use window["inner" + Name]
      size = window["inner" + Name];
    }
    // Cleanup
    documentElement.removeChild(bodyElement);
  } else {
    // Default to use window["inner" + Name]
    size = window["inner" + Name];
  }
  return size;
}

saveItem("zoominbasketball_current_score", 0);
//THIS FUNCTION MANAGES THE CANVAS SCALING TO FIT PROPORTIONALLY THE GAME TO THE CURRENT DEVICE RESOLUTION
function sizeHandler() {
  window.scrollTo(0, 1);
  if (!$("#canvas")) {
    return;
  }

  var h;
  if (platform.name !== null && platform.name.toLowerCase() === "safari") {
    h = getIOSWindowHeight();
  } else {
    h = getSize("Height");
  }

  var w = getSize("Width");

  if (s_bFocus) {
    _checkOrientation(w, h);
  }

  var multiplier = Math.min(h / CANVAS_HEIGHT, w / CANVAS_WIDTH);
  multiplier = multiplier + "".split(".");
  multiplier = parseFloat(multiplier[0] + "." + multiplier[1]);
  s_iScaleFactor = multiplier;
  var destW = Math.round(CANVAS_WIDTH * multiplier);
  var destH = Math.round(CANVAS_HEIGHT * multiplier);
  var iAdd = 0;
  if (destH < h) {
    iAdd = h - destH;
    destH += iAdd;
    destW += iAdd * (CANVAS_WIDTH / CANVAS_HEIGHT);
  } else if (destW < w) {
    iAdd = w - destW;
    destW += iAdd;
    destH += iAdd * (CANVAS_HEIGHT / CANVAS_WIDTH);
  }

  var fOffsetY = h / 2 - destH / 2;
  var fOffsetX = w / 2 - destW / 2;
  var fGameInverseScaling = CANVAS_WIDTH / destW;
  if (
    fOffsetX * fGameInverseScaling < -EDGEBOARD_X ||
    fOffsetY * fGameInverseScaling < -EDGEBOARD_Y
  ) {
    multiplier = Math.min(
      h / (CANVAS_HEIGHT - EDGEBOARD_Y * 2),
      w / (CANVAS_WIDTH - EDGEBOARD_X * 2)
    );
    destW = CANVAS_WIDTH * multiplier;
    destH = CANVAS_HEIGHT * multiplier;
    fOffsetY = (h - destH) / 2;
    fOffsetX = (w - destW) / 2;
    fGameInverseScaling = CANVAS_WIDTH / destW;
  }

  s_iOffsetX = Math.floor(-1 * fOffsetX * fGameInverseScaling);
  s_iOffsetY = Math.floor(-1 * fOffsetY * fGameInverseScaling);
  if (fOffsetY >= 0) {
    s_iOffsetY = 0;
  }

  if (fOffsetX >= 0) {
    s_iOffsetX = 0;
  }

  if (s_oInterface !== null) {
    s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  }

  if (s_oMenu !== null) {
    s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  }

  if (s_bIsIphone) {
    canvas = document.getElementById("canvas");
    s_oStage.canvas.width = Math.floor(destW * 2);
    s_oStage.canvas.height = Math.floor(destH * 2);
    canvas.style.width = Math.floor(destW) + "px";
    canvas.style.height = Math.floor(destH) + "px";
    var iScale = Math.min(destW / CANVAS_WIDTH, destH / CANVAS_HEIGHT);
    s_oStage.scaleX = s_oStage.scaleY = iScale * 2;
  } else if (s_bMobile) {
    $("#canvas").css("width", destW + "px");
    $("#canvas").css("height", destH + "px");
  } else {
    s_oStage.canvas.width = Math.floor(destW);
    s_oStage.canvas.height = Math.floor(destH);

    s_iScaleFactor = Math.min(destW / CANVAS_WIDTH, destH / CANVAS_HEIGHT);
    s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor;
  }

  if (fOffsetY < 0) {
    $("#canvas").css("top", fOffsetY + "px");
  } else {
    // centered game
    fOffsetY = (h - destH) / 2;
    $("#canvas").css("top", fOffsetY + "px");
  }

  $("#canvas").css("left", fOffsetX + "px");
  fullscreenHandler();
}

function _checkOrientation(iWidth, iHeight) {
  if (s_bMobile && ENABLE_CHECK_ORIENTATION) {
    if (iWidth > iHeight) {
      if (
        $(".orientation-msg-container").attr("data-orientation") === "landscape"
      ) {
        $(".orientation-msg-container").css("display", "none");
        s_oMain.startUpdate();
      } else {
        $(".orientation-msg-container").css("display", "block");
        s_oMain.stopUpdate();
      }
    } else {
      if (
        $(".orientation-msg-container").attr("data-orientation") === "portrait"
      ) {
        $(".orientation-msg-container").css("display", "none");
        s_oMain.startUpdate();
      } else {
        $(".orientation-msg-container").css("display", "block");
        s_oMain.stopUpdate();
      }
    }
  }
}

function isChrome() {
  var isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  return isChrome;
}

function isIOS() {
  var iDevices = [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ];

  while (iDevices.length) {
    if (navigator.platform === iDevices.pop()) {
      s_bIsIphone = true;
      return true;
    }
  }
  s_bIsIphone = false;
  return false;
}

function getIOSWindowHeight() {
  // Get zoom level of mobile Safari
  // Note, that such zoom detection might not work correctly in other browsers
  // We use width, instead of height, because there are no vertical toolbars :)
  var zoomLevel = document.documentElement.clientWidth / window.innerWidth;

  // window.innerHeight returns height of the visible area.
  // We multiply it by zoom and get out real height.
  return window.innerHeight * zoomLevel;
}

// You can also get height of the toolbars that are currently displayed
function getHeightOfIOSToolbars() {
  var tH =
    (window.orientation === 0 ? screen.height : screen.width) -
    getIOSWindowHeight();
  return tH > 1 ? tH : 0;
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPod/i)
  ) {
    return "ios";
  } else if (userAgent.match(/Android/i)) {
    return "android";
  } else {
    return "unknown";
  }
}

function stopSound(szSound) {
  if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
    s_aSounds[szSound].stop();
  }
}

function playSound(szSound, iVolume, bLoop) {
  if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
    s_aSounds[szSound].play();
    s_aSounds[szSound].volume(iVolume);
    s_aSounds[szSound].loop(bLoop);

    return s_aSounds[szSound];
  }
  return null;
}

function setVolume(szSound, iVolume) {
  if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
    s_aSounds[szSound].volume(iVolume);
  }
}

function setMute(bMute, szSound) {
  if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
    s_aSounds[szSound].mute(bMute);
  }
}

function soundPlaying(szSound) {
  if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
    return s_aSounds[szSound].playing();
  }
}

function createBitmap(oSprite, iWidth, iHeight) {
  var oBmp = new createjs.Bitmap(oSprite);
  var hitObject = new createjs.Shape();

  if (iWidth && iHeight) {
    hitObject.graphics.beginFill("#fff").drawRect(0, 0, iWidth, iHeight);
  } else {
    hitObject.graphics
      .beginFill("#ff0")
      .drawRect(0, 0, oSprite.width, oSprite.height);
  }

  oBmp.hitArea = hitObject;

  return oBmp;
}

function createSprite(oSpriteSheet, szState, iRegX, iRegY, iWidth, iHeight) {
  if (szState !== null) {
    var oRetSprite = new createjs.Sprite(oSpriteSheet, szState);
  } else {
    var oRetSprite = new createjs.Sprite(oSpriteSheet);
  }

  var hitObject = new createjs.Shape();
  hitObject.graphics
    .beginFill("#000000")
    .drawRect(-iRegX, -iRegY, iWidth, iHeight);

  oRetSprite.hitArea = hitObject;

  return oRetSprite;
}

function randomFloatBetween(minValue, maxValue, precision) {
  if (typeof precision === "undefined") {
    precision = 2;
  }
  return parseFloat(
    Math.min(
      minValue + Math.random() * (maxValue - minValue),
      maxValue
    ).toFixed(precision)
  );
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//----------------------
// Linear
/**
 * Interpolates a value between b and c parameters
 * <p></br><b>Note:</b></br>
 * &nbsp&nbsp&nbspt and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */

function easeLinear(t, b, c, d) {
  return (c * t) / d + b;
}

//----------------------
// Quad
/**
 * Interpolates a value between b and c parameters
 * <p></br><b>Note:</b></br>
 * &nbsp&nbsp&nbspt and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */

function easeInQuad(t, b, c, d) {
  return c * (t /= d) * t + b;
}
//----------------------
// Sine
/**
 * Interpolates a value between b and c parameters
 * <p></br><b>Note:</b></br>
 * &nbsp&nbsp&nbspt and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */

function easeInSine(t, b, c, d) {
  return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
}

function easeInCubic(t, b, c, d) {
  return c * (t /= d) * t * t + b;
}

function getTrajectoryPoint(t, p) {
  var result = new createjs.Point();
  var oneMinusTSq = (1 - t) * (1 - t);
  var TSq = t * t;
  result.x =
    oneMinusTSq * p.start.x + 2 * (1 - t) * t * p.traj.x + TSq * p.end.x;
  result.y =
    oneMinusTSq * p.start.y + 2 * (1 - t) * t * p.traj.y + TSq * p.end.y;
  return result;
}

function formatTime(iTime) {
  iTime /= 1000;
  var iMins = Math.floor(iTime / 60);
  var iSecs = iTime - iMins * 60;
  iSecs = parseFloat(iSecs).toFixed(0); // HOW MANY MS WILL BE SHOWN (0 = NONE)

  var szRet = "";

  if (iMins < 10) {
    szRet += "0" + iMins + ":";
  } else {
    szRet += iMins + ":";
  }

  if (iSecs < 10) {
    szRet += "0" + iSecs;
  } else {
    szRet += iSecs;
  }

  return szRet;
}

function degreesToRadians(iAngle) {
  return (iAngle * Math.PI) / 180;
}

function collideEdgeWithCircle(oEdge, oCenter, iRadius) {
  if (oEdge === null) {
    return false;
  }

  var oPt = closestPointOnLine(oEdge.getPointA(), oEdge.getPointB(), oCenter);
  var iDist = distanceV2(oCenter, oPt);
  return iRadius < iDist ? null : { distance: iDist, closest_point: oPt };
}

function circleDistFromLineSeg(circleX, circleY, line) {
  // line is (example):
  // var line = {
  //      p1 : {x: 500, y: 500},
  //      p2 : {x: 2000, y: 1000},
  // }

  var v1, v2, v3, u;
  v1 = {};
  v2 = {};
  v3 = {};
  v1.x = line.p2.x - line.p1.x;
  v1.y = line.p2.y - line.p1.y;
  v2.x = circleX - line.p1.x;
  v2.y = circleY - line.p1.y;
  u = (v2.x * v1.x + v2.y * v1.y) / (v1.y * v1.y + v1.x * v1.x); // unit dist of point on line
  if (u >= 0 && u <= 1) {
    v3.x = v1.x * u + line.p1.x - circleX;
    v3.y = v1.y * u + line.p1.y - circleY;
    v3.x *= v3.x;
    v3.y *= v3.y;
    return Math.sqrt(v3.y + v3.x); // return distance from line
  }
  // get distance from end points
  v3.x = circleX - line.p2.x;
  v3.y = circleY - line.p2.y;
  v3.x *= v3.x; // square vectors
  v3.y *= v3.y;
  v2.x *= v2.x;
  v2.y *= v2.y;
  return Math.min(Math.sqrt(v2.y + v2.x), Math.sqrt(v3.y + v3.x)); // return smaller of two distances as the result
}

function getAngleBetweenPoints(iPosX1, iPosY1, iPosX2, iPosY2) {
  var angleDeg = (Math.atan2(iPosY2 - iPosY1, iPosX2 - iPosX1) * 180) / Math.PI;
  return angleDeg;
}

function randomSign() {
  if (Math.random() <= 0.5) {
    return 1;
  } else {
    return -1;
  }
}

function distanceBetweenTwoPoints(P1x, P1y, P2x, P2y) {
  var a = P1x - P2x;
  var b = P1y - P2y;
  var iDistance = Math.sqrt(a * a + b * b);
  return iDistance;
}

function distance(oVec1, oVec2) {
  var iDx = oVec1.x - oVec2.x;
  var iDy = oVec1.y - oVec2.y;

  // console.log(oVec2.x);

  var fdistance = Math.sqrt(iDx * iDx + iDy * iDy);

  return fdistance;
}

function closestPointOnLine(vA, vB, vPoint) {
  var v1 = new CVector2();
  v1.setV(vPoint);
  v1.subtractV(vA);
  var v2 = new CVector2();
  v2.setV(vB);
  v2.subtractV(vA);
  v2.normalize();

  var t = dotProductV2(v2, v1);

  if (t <= 0) {
    return vA;
  }

  if (t >= distanceV2(vA, vB)) {
    return vB;
  }

  v2.scalarProduct(t);
  v2.addV(vA);

  return v2;
}

function checkRectCollision(bitmap1, bitmap2) {
  var b1, b2;
  b1 = getBounds(bitmap1, 0.9);
  b2 = getBounds(bitmap2, 0.98);
  return calculateIntersection(b1, b2);
}

function calculateIntersection(rect1, rect2) {
  // first we have to calculate the
  // center of each rectangle and half of
  // width and height
  var dx,
    dy,
    r1 = {},
    r2 = {};
  r1.cx = rect1.x + (r1.hw = rect1.width / 2);
  r1.cy = rect1.y + (r1.hh = rect1.height / 2);
  r2.cx = rect2.x + (r2.hw = rect2.width / 2);
  r2.cy = rect2.y + (r2.hh = rect2.height / 2);

  dx = Math.abs(r1.cx - r2.cx) - (r1.hw + r2.hw);
  dy = Math.abs(r1.cy - r2.cy) - (r1.hh + r2.hh);

  if (dx < 0 && dy < 0) {
    dx = Math.min(Math.min(rect1.width, rect2.width), -dx);
    dy = Math.min(Math.min(rect1.height, rect2.height), -dy);
    return {
      x: Math.max(rect1.x, rect2.x),
      y: Math.max(rect1.y, rect2.y),
      width: dx,
      height: dy,
      rect1: rect1,
      rect2: rect2,
    };
  } else {
    return null;
  }
}

function centerBetweenPointsV2(v1, v2) {
  var vTmp = new CVector2();
  vTmp.set((v1.getX() + v2.getX()) * 0.5, (v1.getY() + v2.getY()) * 0.5);
  return vTmp;
}

function dotProductV2(v1, v2) {
  return v1.getX() * v2.getX() + v1.getY() * v2.getY();
}

function distanceV2WithoutSquareRoot(v1, v2) {
  return (
    (v2.getX() - v1.getX()) * (v2.getX() - v1.getX()) +
    (v2.getY() - v1.getY()) * (v2.getY() - v1.getY())
  );
}

function distanceV2(v1, v2) {
  return Math.sqrt(
    (v2.getX() - v1.getX()) * (v2.getX() - v1.getX()) +
      (v2.getY() - v1.getY()) * (v2.getY() - v1.getY())
  );
}

function reflectVectorV2(v, n) {
  var dotP = dotProductV2(v, n);
  v.set(v.getX() - 2 * dotP * n.getX(), v.getY() - 2 * dotP * n.getY());
  return v;
}

function getBounds(obj, iTolerance) {
  var bounds = { x: Infinity, y: Infinity, width: 0, height: 0 };
  if (obj instanceof createjs.Container) {
    bounds.x2 = -Infinity;
    bounds.y2 = -Infinity;
    var children = obj.children,
      l = children.length,
      cbounds,
      c;
    for (c = 0; c < l; c++) {
      cbounds = getBounds(children[c], 1);
      if (cbounds.x < bounds.x) bounds.x = cbounds.x;
      if (cbounds.y < bounds.y) bounds.y = cbounds.y;
      if (cbounds.x + cbounds.width > bounds.x2)
        bounds.x2 = cbounds.x + cbounds.width;
      if (cbounds.y + cbounds.height > bounds.y2)
        bounds.y2 = cbounds.y + cbounds.height;
      //if ( cbounds.x - bounds.x + cbounds.width  > bounds.width  ) bounds.width  = cbounds.x - bounds.x + cbounds.width;
      //if ( cbounds.y - bounds.y + cbounds.height > bounds.height ) bounds.height = cbounds.y - bounds.y + cbounds.height;
    }
    if (bounds.x == Infinity) bounds.x = 0;
    if (bounds.y == Infinity) bounds.y = 0;
    if (bounds.x2 == Infinity) bounds.x2 = 0;
    if (bounds.y2 == Infinity) bounds.y2 = 0;

    bounds.width = bounds.x2 - bounds.x;
    bounds.height = bounds.y2 - bounds.y;
    delete bounds.x2;
    delete bounds.y2;
  } else {
    var gp,
      gp2,
      gp3,
      gp4,
      imgr = {},
      sr;
    if (obj instanceof createjs.Bitmap) {
      sr = obj.sourceRect || obj.image;

      imgr.width = sr.width * iTolerance;
      imgr.height = sr.height * iTolerance;
    } else if (obj instanceof createjs.Sprite) {
      if (
        obj.spriteSheet._frames &&
        obj.spriteSheet._frames[obj.currentFrame] &&
        obj.spriteSheet._frames[obj.currentFrame].image
      ) {
        var cframe = obj.spriteSheet.getFrame(obj.currentFrame);
        imgr.width = cframe.rect.width;
        imgr.height = cframe.rect.height;
        imgr.regX = cframe.regX;
        imgr.regY = cframe.regY;
      } else {
        bounds.x = obj.x || 0;
        bounds.y = obj.y || 0;
      }
    } else {
      bounds.x = obj.x || 0;
      bounds.y = obj.y || 0;
    }

    imgr.regX = imgr.regX || 0;
    imgr.width = imgr.width || 0;
    imgr.regY = imgr.regY || 0;
    imgr.height = imgr.height || 0;
    bounds.regX = imgr.regX;
    bounds.regY = imgr.regY;

    gp = obj.localToGlobal(0 - imgr.regX, 0 - imgr.regY);
    gp2 = obj.localToGlobal(imgr.width - imgr.regX, imgr.height - imgr.regY);
    gp3 = obj.localToGlobal(imgr.width - imgr.regX, 0 - imgr.regY);
    gp4 = obj.localToGlobal(0 - imgr.regX, imgr.height - imgr.regY);

    bounds.x = Math.min(Math.min(Math.min(gp.x, gp2.x), gp3.x), gp4.x);
    bounds.y = Math.min(Math.min(Math.min(gp.y, gp2.y), gp3.y), gp4.y);
    bounds.width =
      Math.max(Math.max(Math.max(gp.x, gp2.x), gp3.x), gp4.x) - bounds.x;
    bounds.height =
      Math.max(Math.max(Math.max(gp.y, gp2.y), gp3.y), gp4.y) - bounds.y;
  }
  return bounds;
}

function NoClickDelay(el) {
  this.element = el;
  if (window.Touch) this.element.addEventListener("touchstart", this, false);
}

NoClickDelay.prototype = {
  handleEvent: function (e) {
    switch (e.type) {
      case "touchstart":
        this.onTouchStart(e);
        break;
      case "touchmove":
        this.onTouchMove(e);
        break;
      case "touchend":
        this.onTouchEnd(e);
        break;
    }
  },

  onTouchStart: function (e) {
    e.preventDefault();
    this.moved = false;

    this.element.addEventListener("touchmove", this, false);
    this.element.addEventListener("touchend", this, false);
  },

  onTouchMove: function (e) {
    this.moved = true;
  },

  onTouchEnd: function (e) {
    this.element.removeEventListener("touchmove", this, false);
    this.element.removeEventListener("touchend", this, false);

    if (!this.moved) {
      var theTarget = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      if (theTarget.nodeType == 3) theTarget = theTarget.parentNode;

      var theEvent = document.createEvent("MouseEvents");
      theEvent.initEvent("click", true, true);
      theTarget.dispatchEvent(theEvent);
    }
  },
};

(function () {
  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow =
      window.onpagehide =
      window.onfocus =
      window.onblur =
        onchange;

  function onchange(evt) {
    var v = "visible",
      h = "hidden",
      evtMap = {
        focus: v,
        focusin: v,
        pageshow: v,
        blur: h,
        focusout: h,
        pagehide: h,
      };

    evt = evt || window.event;

    if (evt.type in evtMap) {
      document.body.className = evtMap[evt.type];
    } else {
      document.body.className = this[hidden] ? "hidden" : "visible";

      if (document.body.className === "hidden") {
        s_oMain.stopUpdate();
        s_bFocus = false;
      } else {
        s_oMain.startUpdate();
        s_bFocus = true;
      }
    }
  }
})();

function ctlArcadeResume() {
  if (s_oMain !== null) {
    s_oMain.startUpdate();
  }
}

function ctlArcadePause() {
  if (s_oMain !== null) {
    s_oMain.stopUpdate();
  }
}

function toDegree(n) {
  return n * (180 / Math.PI);
}

function getParamValue(paramName) {
  var url = window.location.search.substring(1);
  var qArray = url.split("&");
  for (var i = 0; i < qArray.length; i++) {
    var pArr = qArray[i].split("=");
    if (pArr[0] == paramName) return pArr[1];
  }
}

function saveItem(szItem, oValue) {
  if (s_bStorageAvailable) {
    localStorage.setItem(szItem, oValue);
  }
}

function getItem(szItem) {
  if (s_bStorageAvailable) {
    return localStorage.getItem(szItem);
  }
  return null;
}

function setItemJson(szKey, jsonObj) {
  if (s_bStorageAvailable) {
    localStorage.setItem(szKey, JSON.stringify(jsonObj));
  }
}

function getItemJson(szKey) {
  if (s_bStorageAvailable) {
    return JSON.parse(localStorage.getItem(szKey));
  }
  return null;
}

function fullscreenHandler() {
  if (!ENABLE_FULLSCREEN || !screenfull.isEnabled) {
    return;
  }

  s_bFullscreen = screenfull.isFullscreen;

  if (s_oInterface !== null) {
    s_oInterface.resetFullscreenBut();
  }

  if (s_oMenu !== null) {
    s_oMenu.resetFullscreenBut();
  }
}

if (screenfull.isEnabled) {
  screenfull.on("change", function () {
    s_bFullscreen = screenfull.isFullscreen;

    if (s_oInterface !== null) {
      s_oInterface.resetFullscreenBut();
    }

    if (s_oMenu !== null) {
      s_oMenu.resetFullscreenBut();
    }
  });
}
var _Game_state = 0;
function CSpriteLibrary() {
  var _oLibSprites = {};
  var _oSpritesToLoad;
  var _iNumSprites;
  var _iCntSprites;
  var _cbCompleted;
  var _cbTotalCompleted;
  var _cbOwner;

  this.init = function (cbCompleted, cbTotalCompleted, cbOwner) {
    _oSpritesToLoad = {};
    _iNumSprites = 0;
    _iCntSprites = 0;
    _cbCompleted = cbCompleted;
    _cbTotalCompleted = cbTotalCompleted;
    _cbOwner = cbOwner;
  };

  this.addSprite = function (szKey, szPath) {
    if (_oLibSprites.hasOwnProperty(szKey)) {
      return;
    }

    var oImage = new Image();
    _oLibSprites[szKey] = _oSpritesToLoad[szKey] = {
      szPath: szPath,
      oSprite: oImage,
      bLoaded: false,
    };
    _iNumSprites++;
  };

  this.getSprite = function (szKey) {
    if (!_oLibSprites.hasOwnProperty(szKey)) {
      return null;
    } else {
      return _oLibSprites[szKey].oSprite;
    }
  };

  this._onSpritesLoaded = function () {
    _iNumSprites = 0;
    _cbTotalCompleted.call(_cbOwner);
  };

  this._onSpriteLoaded = function () {
    _cbCompleted.call(_cbOwner);
    if (++_iCntSprites === _iNumSprites) {
      this._onSpritesLoaded();
    }
  };

  this.loadSprites = function () {
    for (var szKey in _oSpritesToLoad) {
      _oSpritesToLoad[szKey].oSprite["oSpriteLibrary"] = this;
      _oSpritesToLoad[szKey].oSprite["szKey"] = szKey;
      _oSpritesToLoad[szKey].oSprite.onload = function () {
        this.oSpriteLibrary.setLoaded(this.szKey);
        this.oSpriteLibrary._onSpriteLoaded(this.szKey);
      };
      _oSpritesToLoad[szKey].oSprite.onerror = function (evt) {
        var oSpriteToRestore = evt.currentTarget;

        setTimeout(function () {
          _oSpritesToLoad[oSpriteToRestore.szKey].oSprite.src =
            _oSpritesToLoad[oSpriteToRestore.szKey].szPath;
        }, 500);
      };
      _oSpritesToLoad[szKey].oSprite.src = _oSpritesToLoad[szKey].szPath;
    }
  };

  this.setLoaded = function (szKey) {
    _oLibSprites[szKey].bLoaded = true;
  };

  this.isLoaded = function (szKey) {
    return _oLibSprites[szKey].bLoaded;
  };

  this.getNumSprites = function () {
    return _iNumSprites;
  };
}

var CANVAS_WIDTH = 768;
var CANVAS_HEIGHT = 1400;
var CANVAS_WIDTH_HALF = CANVAS_WIDTH * 0.5;
var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT * 0.5;

var EDGEBOARD_X = 0;
var EDGEBOARD_Y = 200;

var FPS = 30;
var FPS_TIME = 1000 / FPS;
var DISABLE_SOUND_MOBILE = false;

var SOUNDTRACK_VOLUME_IN_GAME = 0.5;

var PRIMARY_FONT = "comfortaa";
var PRIMARY_FONT_COLOUR = "#724eba";
var WHITE_FONT_COLOUR = "#FFF";
var SECONDARY_FONT_COLOUR = "#000000";

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 2;
var STATE_GAME = 3;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;

var EDGE_LEFT = 0;
var EDGE_RIGHT = 1;
var EDGE_TOP = 2;
var EDGE_BOTTOM = 3;

var EDGE_TOP_LEFT = 0;
var EDGE_TOP_RIGHT = 1;
var EDGE_BOTTOM_LEFT = 2;
var EDGE_BOTTOM_RIGHT = 3;

var BALL_SCALE_MAX_LIMIT = 7;
var BALL_SCALE_VARIABLE_MIN = 0.2;
var zoomin_LIMIT_MIN = 100;
var FORCE_X_LIMIT_MAX = 0.95;
var FORCE_X_LIMIT_MIN = -0.95;
var BOARD_SIDES_SIZE = 10;
var BOARD_SIDES_RADIUS = BOARD_SIDES_SIZE * 0.5;
var LAUNCH_POWER_LIMIT_MIN = 37;
var BALL_RADIUS_TOLERANCE_FACTOR = 1.05;
var PHYSICS_ITERATIONS = 2;
var BALL_SIZE = 100;
var GRAVITY_Y = 0.4;
var BOTTOM_LIMIT = 1100;
var BOARD_HOOP_Y_OFFSET = 140;
var PLAYER_LIFE_SIZE = 55;
var BALL_FORCE_MINIMUM_LIMIT = 8;
var DAMPING_VARIABLE = 0.9;
var BALL_LIMIT_FADEOUT = CANVAS_HEIGHT_HALF + BALL_SIZE;

var BOARD_MOVEMENT_HORIZONTAL = 150;
var BOARD_MOVEMENT_VERTICAL = 100;
var BOARD_MOVEMENT_DURATION = 3000; // TWEEN DURATION (IN MS)

var PARTICLE_COLOR = [
  "#e91300",
  "#f12c00",
  "#ff4e02",
  "#ff6c07",
  "#f82000",
  "#af0302",
];

var NO_BONUS = 1;
var PLAYER_LIVES;
var STRIGHT_SEC;
var BALL_POINTS;
var STAR_BONUS_POINTS;
var BONUS_MULTIPLIER;
var BONUS_NO_COLLISIONS;
var RANDOM_BALL_START_LIMIT;
var BOARD_HORIZONTAL_MOVEMENT_LIMIT;
var BOARD_VERTICAL_MOVEMENT_LIMIT;
var RANDOM_BONUS_OCCURRENCY;

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

CTLText.prototype = {
  constructor: CTLText,

  __autofit: function () {
    if (this._bFitText) {
      var iFontSize = this._iFontSize;

      while (
        this._oText.getBounds().height > this._iHeight - this._iPaddingV * 2 ||
        this._oText.getBounds().width > this._iWidth - this._iPaddingH * 2
      ) {
        iFontSize--;

        this._oText.font = iFontSize + "px " + this._szFont;
        this._oText.lineHeight = Math.round(
          iFontSize * this._fLineHeightFactor
        );

        this.__updateY();
        this.__verticalAlign();

        if (iFontSize < 8) {
          break;
        }
      }

      this._iFontSize = iFontSize;
    }

    //trace(this._oText.text + "-->fontsizedebug:"+iFontSize);
  },

  __verticalAlign: function () {
    if (this._bVerticalAlign) {
      var iCurHeight = this._oText.getBounds().height;
      this._oText.y -= (iCurHeight - this._iHeight) / 2 + this._iPaddingV;
    }
  },

  __updateY: function () {
    this._oText.y = this._y + this._iPaddingV;

    switch (this._oText.textBaseline) {
      case "middle":
        {
          this._oText.y +=
            this._oText.lineHeight / 2 +
            (this._iFontSize * this._fLineHeightFactor - this._iFontSize);
        }
        break;
    }
  },

  __createText: function (szMsg) {
    if (this._bDebug) {
      this._oDebugShape = new createjs.Shape();
      this._oDebugShape.graphics
        .beginFill("rgba(114,78,186,1)")
        .drawRect(this._x, this._y, this._iWidth, this._iHeight);
      this._oContainer.addChild(this._oDebugShape);
    }

    this._oText = new createjs.Text(
      szMsg,
      this._iFontSize + "px " + this._szFont,
      this._szColor
    );
    this._oText.textBaseline = "middle";
    this._oText.lineHeight = Math.round(
      this._iFontSize * this._fLineHeightFactor
    );
    this._oText.textAlign = this._szAlign;

    if (this._bMultiline) {
      this._oText.lineWidth = this._iWidth - this._iPaddingH * 2;
    } else {
      this._oText.lineWidth = null;
    }

    switch (this._szAlign) {
      case "center":
        {
          this._oText.x = this._x + this._iWidth / 2;
        }
        break;
      case "left":
        {
          this._oText.x = this._x + this._iPaddingH;
        }
        break;
      case "right":
        {
          this._oText.x = this._x + this._iWidth - this._iPaddingH;
        }
        break;
    }

    this._oContainer.addChild(this._oText);

    this.refreshText(szMsg);
  },

  setVerticalAlign: function (bVerticalAlign) {
    this._bVerticalAlign = bVerticalAlign;
  },

  setVisible: function (bVisible) {
    this._oText.visible = bVisible;
  },

  setOutline: function (iSize) {
    if (this._oText !== null) {
      this._oText.outline = iSize;
    }
  },

  setShadow: function (szColor, iOffsetX, iOffsetY, iBlur) {
    if (this._oText !== null) {
      this._oText.shadow = new createjs.Shadow(
        szColor,
        iOffsetX,
        iOffsetY,
        iBlur
      );
    }
  },

  setColor: function (szColor) {
    this._oText.color = szColor;
  },

  setAlpha: function (iAlpha) {
    this._oText.alpha = iAlpha;
  },

  setY: function (iNewY) {
    this._oText.y = iNewY;
    this._y = iNewY;
    this.updateDebug();
  },

  setX: function (iNewX) {
    this._oText.x = iNewX;
    this._x = iNewX;
    this.updateDebug();
  },

  updateDebug: function () {
    if (!this._bDebug) {
      return;
    }
    this._oDebugShape.graphics.command.x = this._x;
    this._oDebugShape.graphics.command.y = this._y;
  },

  removeTweens: function () {
    createjs.Tween.removeTweens(this._oText);
  },

  getText: function () {
    return this._oText;
  },

  getX: function () {
    return this._x;
  },

  getY: function () {
    return this._y;
  },

  getFontSize: function () {
    return this._iFontSize;
  },

  getBounds: function () {
    return this._oText.getBounds();
  },

  getVisible: function () {
    return this._oText.visible;
  },

  refreshText: function (szMsg) {
    if (szMsg === "") {
      szMsg = " ";
    }
    if (this._oText === null) {
      this.__createText(szMsg);
    }

    this._oText.text = szMsg;

    this._oText.font = this._iFontSize + "px " + this._szFont;
    this._oText.lineHeight = Math.round(
      this._iFontSize * this._fLineHeightFactor
    );

    this.__autofit();
    this.__updateY();
    this.__verticalAlign();
  },

  removeTween: function () {
    return createjs.Tween.removeTweens(this._oText);
  },
};

function CTLText(
  oContainer,
  x,
  y,
  iWidth,
  iHeight,
  iFontSize,
  szAlign,
  szColor,
  szFont,
  iLineHeightFactor,
  iPaddingH,
  iPaddingV,
  szMsg,
  bFitText,
  bVerticalAlign,
  bMultiline,
  bDebug
) {
  this._oContainer = oContainer;

  this._x = x;
  this._y = y;
  this._iWidth = iWidth;
  this._iHeight = iHeight;

  this._bMultiline = bMultiline;

  this._iFontSize = iFontSize;
  this._szAlign = szAlign;
  this._szColor = szColor;
  this._szFont = szFont;

  this._iPaddingH = iPaddingH;
  this._iPaddingV = iPaddingV;

  this._bVerticalAlign = bVerticalAlign;
  this._bFitText = bFitText;
  this._bDebug = bDebug;
  //this._bDebug         = true;

  // RESERVED
  this._oDebugShape = null;
  this._fLineHeightFactor = iLineHeightFactor;

  this._oText = null;
  if (szMsg) {
    this.__createText(szMsg);
  }
}

function CEdge(iX1, iY1, iX2, iY2, iHeight, bVisible, iAngle) {
  var _oModel;
  var _oViewer;
  var _oPrevPoint;
  var _bVisible;
  var _iCounterSize;

  this.init = function (iX1, iY1, iX2, iY2, iHeight) {
    _iCounterSize = 0;
    _oModel = new CEdgeModel(iX1, iY1, iX2, iY2, iAngle);
    var oLength = _oModel.getLength();

    _bVisible = bVisible;

    if (_bVisible) {
      _oViewer = new CEdgeViewer(iX1, iY1, iX2, iY2, oLength, iHeight);
    }
  };

  this.getModel = function () {
    return _oModel;
  };

  this.moveY = function (iY) {
    if (_bVisible) {
      _oViewer.moveY(iY);
    }

    _oModel.moveY(iY);
  };

  this.moveX = function (iX) {
    if (_bVisible) {
      _oViewer.moveX(iX);
    }

    _oModel.moveX(iX);
  };

  this.changeSize = function (iSize) {
    _iCounterSize += iSize;

    _oPrevPoint = {
      a: { x: _oModel.getPointA().getX(), y: _oModel.getPointA().getY() },
      b: { x: _oModel.getPointB().getX(), y: _oModel.getPointB().getY() },
    };
    _oModel.destroy();
    _oModel = new CEdgeModel(
      _oPrevPoint.a.x + iSize,
      _oPrevPoint.a.y,
      _oPrevPoint.b.x - iSize,
      _oPrevPoint.b.y
    );

    if (_bVisible) {
      _oViewer.unload();
      _oViewer = new CEdgeViewer(
        _oModel.getPointA().getX(),
        _oModel.getPointA().getY(),
        _oModel.getPointB().getX(),
        _oModel.getPointB().getY(),
        _oModel.getLength(),
        iHeight
      );
    }
  };

  this.destroy = function () {
    _oModel.destroy();

    if (_bVisible) {
      _oViewer.unload();
    }
  };

  this.resetSize = function (iPosNeg) {
    var iPosNeg2;

    _oPrevPoint = {
      a: { x: _oModel.getPointA().getX(), y: _oModel.getPointA().getY() },
      b: { x: _oModel.getPointB().getX(), y: _oModel.getPointB().getY() },
    };
    _oModel.destroy();

    if (_iCounterSize * iPosNeg > 0) {
      if (iPosNeg > 0) {
        iPosNeg2 = -1;
      } else {
        iPosNeg2 = 1;
      }
    } else if (iPosNeg < 0) {
      iPosNeg2 = -1;
    } else {
      iPosNeg2 = 1;
    }

    if (_iCounterSize * iPosNeg < 0) {
      _oModel = new CEdgeModel(
        _oPrevPoint.a.x - iPosNeg2 * (iPosNeg * _iCounterSize),
        _oPrevPoint.a.y,
        _oPrevPoint.b.x + iPosNeg2 * (iPosNeg * _iCounterSize),
        _oPrevPoint.b.y
      );
    } else {
      _oModel = new CEdgeModel(
        _oPrevPoint.a.x + iPosNeg2 * (iPosNeg * _iCounterSize),
        _oPrevPoint.a.y,
        _oPrevPoint.b.x - iPosNeg2 * (iPosNeg * _iCounterSize),
        _oPrevPoint.b.y
      );
    }

    _iCounterSize = 0;

    if (_bVisible) {
      _oViewer.unload();
      _oViewer = new CEdgeViewer(
        _oModel.getPointA().getX(),
        _oModel.getPointA().getY(),
        _oModel.getPointB().getX(),
        _oModel.getPointB().getY(),
        _oModel.getLength(),
        iHeight
      );
    }
  };

  this.init(iX1, iY1, iX2, iY2, iHeight);
}

function CEdgeModel(xA, yA, xB, yB) {
  //--------------------
  // Attributes
  var m_pA = null;
  var m_pB = null;
  var m_pCenter = null;
  var m_pProj = null;
  var m_vNormal = null;

  var LENGTH_NORMAL = 5;

  //--------------------
  // Methods
  this._init = function (xA, yA, xB, yB) {
    this.set(xA, yA, xB, yB);
  };

  this.destroy = function () {
    m_pA = null;
    m_pB = null;
    m_pCenter = null;
    m_pProj = null;
    m_vNormal = null;
  };

  this.render = function (oLineDraw) {
    oLineDraw.moveTo(m_pA.x, m_pA.y);
    oLineDraw.lineTo(m_pB.x, m_pB.y);
  };

  this.toString = function (sz) {
    trace(sz + " " + m_pA.x + " " + m_pA.y + " " + m_pB.x + " " + m_pB.y);
  };

  this.add = function (vAdd) {
    m_pA.addV(vAdd);
    m_pB.addV(vAdd);
  };

  this.editSize = function (vEdit) {
    m_pA.subtractV(vEdit);
    m_pB.addV(vEdit);
    this.calculateNormal();
    this.calculateCenter();
  };

  this.set = function (xA, yA, xB, yB) {
    m_pA = new CVector2();
    m_pB = new CVector2();
    m_pA.set(xA, yA);
    m_pB.set(xB, yB);
    this.calculateNormal();
    this.calculateCenter();
  };

  this.moveY = function (iY) {
    m_pA.add(0, iY);
    m_pB.add(0, iY);
    this.calculateNormal();
    this.calculateCenter();
  };

  this.moveX = function (iX) {
    m_pA.add(iX, 0);
    m_pB.add(iX, 0);
    this.calculateNormal();
    this.calculateCenter();
  };

  this.scale = function (iVal) {
    m_pA.scalarProduct(iVal);
    m_pB.scalarProduct(iVal);
    this.calculateNormal();
    this.calculateCenter();
  };

  this.calculateNormal = function () {
    m_vNormal = null;
    m_vNormal = new CVector2();
    m_vNormal.setV(m_pB);
    m_vNormal.subtractV(m_pA);
    m_vNormal.rot90CCW();
    m_vNormal.normalize();
  };

  this.calculateCenter = function () {
    m_pCenter = null;
    m_pCenter = centerBetweenPointsV2(m_pA, m_pB);

    m_pProj = new CVector2();
    m_pProj.setV(m_vNormal);
    m_pProj.scalarProduct(LENGTH_NORMAL);
    m_pProj.addV(m_pCenter);
  };

  this.getPointA = function () {
    return m_pA;
  };

  this.m_pCenter = function () {
    return m_pCenter;
  };

  this.getPointB = function () {
    return m_pB;
  };

  this.getNormal = function () {
    return m_vNormal;
  };

  this.renderNormal = function (oLineDraw) {
    oLineDraw.moveTo(m_pCenter.x, m_pCenter.y);
    oLineDraw.lineTo(m_pProj.x, m_pProj.y);
  };

  this.getLength = function () {
    return Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));
  };

  this._init(xA, yA, xB, yB);

  return this;
}

function CEdgeViewer(iX1, iY1, iX2, iY2, iLength, iHeight) {
  var _oRect;

  this.init = function (iX1, iY1, iX2, iY2, iLength, iHeight) {
    var graphics;
    if (iX1 > iX2 || iY1 > iY2) {
      if (iY1 === iY2) {
        graphics = new createjs.Graphics()
          .beginFill("#FFF")
          .drawRect(iX2, iY2, iLength, iHeight);
      } else {
        graphics = new createjs.Graphics()
          .beginFill("#FFF")
          .drawRect(iX2, iY2, iHeight, iLength);
      }
    } else {
      if (iY1 === iY2) {
        graphics = new createjs.Graphics()
          .beginFill("#FFF")
          .drawRect(iX1, iY1, iLength, iHeight);
      } else {
        graphics = new createjs.Graphics()
          .beginFill("#FFF")
          .drawRect(iX1, iY1, iHeight, iLength);
      }
    }
    _oRect = new createjs.Shape(graphics);
    _oRect.y = -iHeight / 2;
    _oRect.alpha = 0.3;
    s_oStage.addChild(_oRect);
  };

  this.moveY = function (iY) {
    _oRect.y += iY;
  };

  this.moveX = function (iX) {
    _oRect.x += iX;
  };

  this.unload = function () {
    s_oStage.removeChild(_oRect);
  };

  this.init(iX1, iY1, iX2, iY2, iLength, iHeight);
}

function CVector2(iX, iY) {
  var x;
  var y;

  this._init = function (iX, iY) {
    x = iX;
    y = iY;
  };

  this.add = function (vx, vy) {
    x += vx;
    y += vy;
  };

  this.addV = function (v) {
    x += v.getX();
    y += v.getY();
  };

  this.scalarDivision = function (n) {
    x /= n;
    y /= n;
  };

  this.subtract = function (vx, vy) {
    x -= vx;
    y -= vy;
  };

  this.subtractV = function (v) {
    x -= v.getX();
    y -= v.getY();
  };

  this.scalarProduct = function (n) {
    x *= n;
    y *= n;
  };
  this.invert = function () {
    x *= -1;
    y *= -1;
  };
  this.dotProduct = function (v) {
    return x * v.getX() + y * v.getY();
  };
  this.set = function (fx, fy) {
    x = fx;
    y = fy;
  };
  this.setV = function (v) {
    x = v.getX();
    y = v.getY();
  };
  this.length = function () {
    return Math.sqrt(x * x + y * y);
  };
  this.length2 = function () {
    return x * x + y * y;
  };
  this.normalize = function () {
    var len = this.length();
    if (len > 0) {
      x /= len;
      y /= len;
    }
  };

  this.angleBetweenVectors = function (v2) {
    var iAngle = Math.acos(this.dotProduct(v2) / (this.length() * v2.length()));
    if (isNaN(iAngle) === true) {
      return 0;
    } else {
      return iAngle;
    }
  };

  this.getNormalize = function (outV) {
    var len = this.length();
    outV.set(x, y);
    outV.normalize();
  };
  this.rot90CCW = function () {
    var a = x;
    x = -y;
    y = a;
  };
  this.rot90CW = function () {
    var a = x;
    x = y;
    y = -a;
  };
  this.getRotCCW = function (outV) {
    outV.set(x, y);
    outV.rot90CCW();
  };
  this.getRotCW = function (outV) {
    outV.set(x, y);
    outV.rot90CW();
  };
  this.ceil = function () {
    x = Math.ceil(x);
    y = Math.ceil(y);
  };
  this.round = function () {
    x = Math.round(x);
    y = Math.round(y);
  };
  this.toString = function () {
    return "Vector2: " + x + ", " + y;
  };
  this.print = function () {
    trace("Vector2: " + x + ", " + y + "");
  };
  this.getX = function () {
    return x;
  };
  this.getY = function () {
    return y;
  };

  // DELETE IF NOT USING ALONG WITH 3D VECTORS
  this.getZ = function () {
    return 0;
  };

  this.rotate = function (iAngle) {
    var fNewX = x;
    var fNewY = y;

    x = fNewX * Math.cos(iAngle) + fNewY * Math.sin(iAngle);
    y = fNewX * -Math.sin(iAngle) + fNewY * Math.cos(iAngle);
  };

  this._init(iX, iY);
}

function CVector3(iX, iY, iZ) {
  var x;
  var y;
  var z;

  this._init = function (iX, iY, iZ) {
    x = iX;
    y = iY;
    z = iZ;
  };

  this.add = function (vx, vy, vz) {
    x += vx;
    y += vy;
    z += vz;
  };

  this.addV = function (v) {
    x += v.getX();
    y += v.getY();
    z += v.getZ();
  };

  this.scalarDivision = function (n) {
    x /= n;
    y /= n;
    z /= n;
  };

  this.subtract = function (vx, vy, vz) {
    x -= vx;
    y -= vy;
    z -= vz;
  };

  this.subtractV = function (v) {
    x -= v.getX();
    y -= v.getY();
    z -= v.getZ();
  };

  this.scalarProduct = function (n) {
    x *= n;
    y *= n;
    z *= n;
  };

  this.invert = function () {
    x *= -1;
    y *= -1;
    z *= -1;
  };

  this.dotProduct = function (v) {
    return x * v.getX() + y * v.getY() + z * v.getZ();
  };

  this.set = function (fx, fy, fz) {
    x = fx;
    y = fy;
    z = fz;
  };

  this.setV = function (v) {
    x = v.getX();
    y = v.getY();
    z = v.getZ();
  };

  this.length = function () {
    return Math.sqrt(x * x + y * y + z * z);
  };

  this.lengthSquare = function () {
    return x * x + y * y + z * z;
  };

  this.normalize = function () {
    var len = this.length();
    if (len > 0) {
      x /= len;
      y /= len;
      z /= len;
    }
  };

  this.getNormalize = function (outV) {
    var len = this.length();
    outV.set(x, y, z);
    outV.normalize();
  };

  this.ceil = function () {
    x = Math.ceil(x);
    y = Math.ceil(y);
    z = Math.ceil(z);
  };
  this.round = function () {
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);
  };

  this.getX = function () {
    return x;
  };

  this.getY = function () {
    return y;
  };

  this.getZ = function () {
    return z;
  };

  this.toString = function () {
    return "Vector3: " + x + ", " + y + ", " + z;
  };

  this.print = function () {
    trace("Vector3: " + x + ", " + y + ", " + z);
  };

  this._init(iX, iY, iZ);
}

function CTweenController() {
  this.tweenValue = function (fStart, fEnd, fLerp) {
    return fStart + fLerp * (fEnd - fStart);
  };

  this.easeLinear = function (t, b, c, d) {
    return (c * t) / d + b;
  };

  this.easeInCubic = function (t, b, c, d) {
    var tc = (t /= d) * t * t;
    return b + c * tc;
  };

  this.easeBackInQuart = function (t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (2 * ts * ts + 2 * tc + -3 * ts);
  };

  this.easeInBack = function (t, b, c, d) {
    return c * (t /= d) * t * ((1.70158 + 1) * t - 1.70158) + b;
  };

  this.easeOutCubic = function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  };

  this.getTrajectoryPoint = function (t, p) {
    var result = new createjs.Point();
    var oneMinusTSq = (1 - t) * (1 - t);

    var TSq = t * t;

    result.x =
      oneMinusTSq * p.start.x + 2 * (1 - t) * t * p.traj.x + TSq * p.end.x;
    result.y =
      oneMinusTSq * p.start.y + 2 * (1 - t) * t * p.traj.y + TSq * p.end.y;

    return result;
  };

  s_oTweenController = this;
}

function CShake(oElement, iDuration, iFrequency, iStrength) {
  var _bTremble;
  var _bAlternateTremble;

  var _iIdInterval;
  var _iCurTrembleIndex;
  var _iLastTrembleIndex;

  var _oStartPos;
  var _oParent;

  this._init = function (oElement, iDuration, iFrequency, iStrength) {
    _bTremble = false;
    _bAlternateTremble = false;
    _iCurTrembleIndex = 0;

    this._calculateDuration();

    _oStartPos = { x: oElement.x, y: oElement.y };

    if (!_bTremble) {
      _bTremble = true;
      _iIdInterval = setInterval(function () {
        _oParent._tremble();
      }, iFrequency);
    }
  };

  this.updateObject = function (oElement) {
    _oStartPos = { x: oElement.x, y: oElement.y };
  };

  this._tremble = function () {
    _bAlternateTremble = !_bAlternateTremble;

    if (_bAlternateTremble) {
      var iSignX = Math.random();
      iStrength *= 0.95;
      var iNumberX = iStrength;
      var iDirX;
      if (iSignX < 0.5) {
        iDirX = -iNumberX;
      } else {
        iDirX = iNumberX;
      }
      var iSignY = Math.random();
      var iNumberY = iStrength;

      var iDirY;
      if (iSignY < 0.5) {
        iDirY = -iNumberY;
      } else {
        iDirY = iNumberY;
      }

      oElement.x += iDirX;
      oElement.y += iDirY;
    } else {
      oElement.x = _oStartPos.x;
      oElement.y = _oStartPos.y;
    }

    _iCurTrembleIndex++;
    if (_iCurTrembleIndex > _iLastTrembleIndex) {
      _iCurTrembleIndex = 0;
      _bTremble = false;

      oElement.x = _oStartPos.x;
      oElement.y = _oStartPos.y;

      if (iDuration === 0) {
        _iIdInterval = setInterval(function () {
          _oParent._tremble();
        }, iFrequency);
      } else {
        clearInterval(_iIdInterval);
      }
    }
  };

  this._calculateDuration = function () {
    _iLastTrembleIndex = iDuration / iFrequency;
  };

  this.stopTremble = function () {
    clearInterval(_iIdInterval);
  };

  _oParent = this;
  this._init(oElement, iDuration, iFrequency, iStrength);
}

var TEXT_HELP1 = "BEAT TOP SCORE IN \n";
var TEXT_HELP2 = "TRY AND GET BONUS POINTS WITH YOUR BALL";
var TEXT_HELP3 = "BUT BEWARE: IF YOU MISS A HOOP, YOU LOSE A BALL!";

var TEXT_BEST = "TOP SCORE : ";
var TEXT_YOUR_BEST_SCORE = "Top Score : ";
var TEXT_SCORE = "Your Score : ";
var TEXT_BONUS = "BONUS";
var TEXT_GAMEOVER = "GAME OVER!\nTRY AGAIN?";
var TEXT_ARE_SURE =
  "ARE YOU SURE YOU WANT TO EXIT? ALL UNSAVED PROGRESS WILL BE LOST";
var TEXT_NEWBESTSCORE = "NEW BEST SCORE!";

var TEXT_PRELOADER_CONTINUE = "START";
var TEXT_CREDITS_DEVELOPED = "DEVELOPED BY";
var TEXT_ERR_LS =
  "YOUR WEB BROWSER DOES NOT SUPPORT STORING SETTING LOCALLY. IN SAFARI, THE MOST COMMON CAUSE OF THIS IS USING 'PRIVATE BROWSING MODE'. SOME INFO MAY NOT SAVE OR SOME FEATURE MAY NOT WORK PROPERLY.";

var TEXT_SHARE_IMAGE = "logo_menu.png";
var TEXT_SHARE_TITLE = "Congratulations!";
var TEXT_SHARE_MSG1 = "You collected <strong>";
var TEXT_SHARE_MSG2 =
  " points</strong>!<br><br>Share your score with your friends!";
var TEXT_SHARE_SHARE1 = "My score is ";
var TEXT_SHARE_SHARE2 = " points! Can you do better";

function CPreloader() {
  var _iMaskWidth;
  var _iMaskHeight;
  var _oLoadingText;
  var _oProgressBar;
  var _oMaskPreloader;
  var _oFade;
  var _oIcon;
  var _oIconMask;

  var _oContainer;

  this._init = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
    s_oSpriteLibrary.addSprite("200x200", "./sprites/logo_menu.png");
    s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
    s_oSpriteLibrary.loadSprites();

    _oContainer = new createjs.Container();
    s_oStage.addChild(_oContainer);
  };

  this.unload = function () {
    _oContainer.removeAllChildren();
  };

  this._onImagesLoaded = function () {};

  this._onAllImagesLoaded = function () {
    this.attachSprites();

    s_oMain.preloaderReady();
  };

  this.attachSprites = function () {
    var oBg = new createjs.Shape();
    oBg.graphics
      .beginFill("#f5f5f5")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oContainer.addChild(oBg);

    var oSprite = s_oSpriteLibrary.getSprite("200x200");
    _oIcon = createBitmap(oSprite);
    _oIcon.regX = oSprite.width * 0.5;
    _oIcon.regY = oSprite.height * 0.5;
    _oIcon.x = CANVAS_WIDTH_HALF;
    _oIcon.y = CANVAS_HEIGHT_HALF - 180;
    _oContainer.addChild(_oIcon);

    _oIconMask = new createjs.Shape();
    _oIconMask.graphics
      .beginFill("rgba(245,245,245,0.01)")
      .drawRoundRect(_oIcon.x - 250, _oIcon.y - 150, 500, 500, 10);
    _oContainer.addChild(_oIconMask);

    _oIcon.mask = _oIconMask;

    var oSprite = s_oSpriteLibrary.getSprite("progress_bar");
    _oProgressBar = createBitmap(oSprite);
    _oProgressBar.x = CANVAS_WIDTH_HALF - oSprite.width / 2;
    _oProgressBar.y = CANVAS_HEIGHT_HALF + 50;
    _oContainer.addChild(_oProgressBar);

    _iMaskWidth = oSprite.width;
    _iMaskHeight = oSprite.height;
    _oMaskPreloader = new createjs.Shape();
    _oMaskPreloader.graphics
      .beginFill("rgba(0,0,0,0.01)")
      .drawRect(_oProgressBar.x, _oProgressBar.y, 1, _iMaskHeight);

    _oContainer.addChild(_oMaskPreloader);

    _oProgressBar.mask = _oMaskPreloader;

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF + 100;
    var iWidth = 500;
    var iHeight = 70;

    _oLoadingText = new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      20,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      "",
      true,
      true,
      true,
      false
    );

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oContainer.addChild(_oFade);

    createjs.Tween.get(_oFade)
      .to({ alpha: 0 }, 500)
      .call(function () {
        createjs.Tween.removeTweens(_oFade);
        _oContainer.removeChild(_oFade);
      });
  };

  this.refreshLoader = function (iPerc) {
    _oLoadingText.refreshText(iPerc + "%");

    if (iPerc === 100) {
      s_oMain._onRemovePreloader();
      _oLoadingText.visible = false;
      _oProgressBar.visible = false;
    }

    _oMaskPreloader.graphics.clear();
    var iNewMaskWidth = Math.floor((iPerc * _iMaskWidth) / 100);
    _oMaskPreloader.graphics
      .beginFill("rgba(0,0,0,0.01)")
      .drawRect(_oProgressBar.x, _oProgressBar.y, iNewMaskWidth, _iMaskHeight);
  };

  this._init();
}

function CMain(oData) {
  var _bUpdate;
  var _iCurResource = 0;
  var RESOURCE_TO_LOAD = 0;
  var _iState = STATE_LOADING;
  var _oData;
  var _oPreloader;
  var _oHelp;
  var _oMenu;
  var _oGame;

  this.initContainer = function () {
    s_oCanvas = document.getElementById("canvas");
    s_oStage = new createjs.Stage(s_oCanvas);
    s_oStage.preventSelection = false;
    createjs.Touch.enable(s_oStage, true);

    s_bMobile = isMobile();

    if (s_bMobile === false) {
      s_oStage.enableMouseOver(20);
      $("body").on("contextmenu", "#canvas", function (e) {
        return false;
      });
    }

    s_iPrevTime = new Date().getTime();

    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.framerate = FPS;

    if (navigator.userAgent.match(/Windows Phone/i)) {
      DISABLE_SOUND_MOBILE = true;
    }

    s_oSpriteLibrary = new CSpriteLibrary();

    //ADD PRELOADER
    _oPreloader = new CPreloader();
    // if (seekAndDestroy()) {
    //   _oPreloader = new CPreloader();
    // }
  };

  this.preloaderReady = function () {
    this._loadImages();

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      this._initSounds();
    }

    _bUpdate = true;
  };

  this.soundLoaded = function () {
    _iCurResource++;
    var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100);
    _oPreloader.refreshLoader(iPerc);

    if (_iCurResource === RESOURCE_TO_LOAD) {
      //this._onRemovePreloader();
    }
  };

  this._initSounds = function () {
    Howler.mute(!s_bAudioActive);

    s_aSoundsInfo = new Array();
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "soundtrack",
      loop: true,
      volume: 1,
      ingamename: "soundtrack",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "click",
      loop: false,
      volume: 1,
      ingamename: "click",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "game_over",
      loop: false,
      volume: 1,
      ingamename: "game_over",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "boing",
      loop: false,
      volume: 1,
      ingamename: "boing",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "bonus_taken",
      loop: false,
      volume: 1,
      ingamename: "bonus_taken",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "bonus",
      loop: false,
      volume: 1,
      ingamename: "bonus",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "swish",
      loop: false,
      volume: 1,
      ingamename: "swish",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "score",
      loop: false,
      volume: 1,
      ingamename: "score",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "malus",
      loop: false,
      volume: 1,
      ingamename: "malus",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "newbestscore",
      loop: false,
      volume: 1,
      ingamename: "newbestscore",
    });

    RESOURCE_TO_LOAD += s_aSoundsInfo.length;

    s_aSounds = new Array();
    for (var i = 0; i < s_aSoundsInfo.length; i++) {
      this.tryToLoadSound(s_aSoundsInfo[i], false);
    }
  };

  this.tryToLoadSound = function (oSoundInfo, bDelay) {
    setTimeout(
      function () {
        s_aSounds[oSoundInfo.ingamename] = new Howl({
          src: [oSoundInfo.path + oSoundInfo.filename + ".mp3"],
          autoplay: false,
          preload: true,
          loop: oSoundInfo.loop,
          volume: oSoundInfo.volume,
          onload: s_oMain.soundLoaded,
          onloaderror: function (szId, szMsg) {
            for (var i = 0; i < s_aSoundsInfo.length; i++) {
              if (
                szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id
              ) {
                s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                break;
              }
            }
          },
          onplayerror: function (szId) {
            for (var i = 0; i < s_aSoundsInfo.length; i++) {
              if (
                szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id
              ) {
                s_aSounds[s_aSoundsInfo[i].ingamename].once(
                  "unlock",
                  function () {
                    s_aSounds[s_aSoundsInfo[i].ingamename].play();
                    if (
                      s_aSoundsInfo[i].ingamename === "soundtrack" &&
                      s_oGame !== null
                    ) {
                      setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
                    }
                  }
                );
                break;
              }
            }
          },
        });
      },
      bDelay ? 200 : 0
    );
  };

  this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

    s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
    s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
    s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
    s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
    s_oSpriteLibrary.addSprite("msg_box_big", "./sprites/msg_box_big.png");
    s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
    s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
    s_oSpriteLibrary.addSprite(
      "but_fullscreen",
      "./sprites/but_fullscreen.png"
    );
    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
    s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
    s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
    s_oSpriteLibrary.addSprite("logo_menu", "./sprites/logo_menu.png");
    s_oSpriteLibrary.addSprite("bonus", "./sprites/bonus.png");
    s_oSpriteLibrary.addSprite("ball", "./sprites/ball.png");
    s_oSpriteLibrary.addSprite("ball_bonus", "./sprites/ball_bonus.png");
    s_oSpriteLibrary.addSprite("ball_shadow", "./sprites/ball_shadow.png");
    s_oSpriteLibrary.addSprite("board", "./sprites/board.png");
    s_oSpriteLibrary.addSprite("hoop", "./sprites/hoop.png");
    s_oSpriteLibrary.addSprite("player_life", "./sprites/player_life.png");
    s_oSpriteLibrary.addSprite("but_star", "./sprites/star.png");

    RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites();
  };

  this._onImagesLoaded = function () {
    _iCurResource++;
    var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100);
    _oPreloader.refreshLoader(iPerc);

    if (_iCurResource === RESOURCE_TO_LOAD) {
      //this._onRemovePreloader();
    }
  };

  this._onAllImagesLoaded = function () {};

  this.onAllPreloaderImagesLoaded = function () {
    this._loadImages();
  };

  this._onRemovePreloader = function () {
    try {
      saveItem("ls_available", "ok");
    } catch (evt) {
      // localStorage not defined
      s_bStorageAvailable = false;
    }

    _oPreloader.unload();

    s_oSoundtrack = playSound("soundtrack", 1, true);

    this.gotoMenu();
  };

  this.gotoMenu = function () {
    _oMenu = new CMenu();
    _iState = STATE_MENU;
    if (typeof timeinterval !== "undefined") {
      clearInterval(timeinterval);
    }
    $(".time_bottom").addClass("hidden");

    stopSound("game_over");
    $("#bg").css(
      "background",
      "linear-gradient(to bottom,#F8F8F8 50%,#f8f8f8 100%)"
    );
    playSound("soundtrack", 1, true);
  };

  this.gotoGame = function () {
    if (addEventPlayer() == false) {
      this.gotoMenu();
    } else {
      _oGame = new CGame(_oData);
      $("#bg").css(
        "background",
        "linear-gradient(to bottom,#4f3a72 50%,#374470 100%)"
      );
      _iState = STATE_GAME;
      _Game_state = 1;
    }
    stopSound("soundtrack");
    $(s_oMain).trigger("start_session");
  };

  this.gotoHelp = function () {
    _oHelp = new CHelp();
    _iState = STATE_HELP;
  };

  this.stopUpdate = function () {
    _bUpdate = false;
    createjs.Ticker.paused = true;
    $("#block_game").css("display", "block");
    if (s_bAudioActive) {
      Howler.mute(true);
    }
  };

  this.startUpdate = function () {
    s_iPrevTime = new Date().getTime();
    _bUpdate = true;
    createjs.Ticker.paused = false;
    $("#block_game").css("display", "none");

    if (s_bAudioActive) {
      Howler.mute(false);
    }
  };

  this._update = function (event) {
    if (_bUpdate === false) {
      return;
    }
    var iCurTime = new Date().getTime();
    s_iTimeElaps = iCurTime - s_iPrevTime;
    s_iCntTime += s_iTimeElaps;
    s_iCntFps++;
    s_iPrevTime = iCurTime;

    if (s_iCntTime >= 1000) {
      s_iCurFps = s_iCntFps;
      s_iCntTime -= 1000;
      s_iCntFps = 0;
    }

    if (_iState === STATE_MENU) {
      _oMenu.update();
    }

    if (_iState === STATE_GAME) {
      _oGame.update();
    }

    s_oStage.update(event);
  };

  s_oMain = this;

  _oData = oData;
  ENABLE_FULLSCREEN = oData.fullscreen;
  ENABLE_CHECK_ORIENTATION = oData.check_orientation;

  s_bAudioActive = oData.audio_enable_on_startup;

  this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_iTotalScore = 0;
var s_iBestScore = 0;

var s_bStorageAvailable = true;
var s_bFirstTimePlaying;
var s_aSoundsInfo;

function CMenu() {
  var _oMenuContainer;
  var _oBg;
  var _oGameLogo;
  var _oButPlay;
  var _oFade;
  var _oAudioToggle;
  var _oButCredits;
  var _oCreditsPanel = null;
  var _oButFullscreen;
  var _fRequestFullScreen = null;
  var _fCancelFullScreen = null;
  var _pStartPosAudio;
  var _pStartPosCredits;
  var _pStartPosFullscreen;
  var _oYourBestScoreText;

  this._init = function () {
    //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE
    _oMenuContainer = new createjs.Container();
    s_oStage.addChild(_oMenuContainer);
    s_bFirstTimePlaying = true;

    _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    _oMenuContainer.addChild(_oBg);

    var oGameLogo = s_oSpriteLibrary.getSprite("logo_menu");
    _oGameLogo = createBitmap(oGameLogo);
    _oGameLogo.regX = oGameLogo.width / 2;
    _oGameLogo.regY = oGameLogo.height / 2;
    _oGameLogo.x = CANVAS_WIDTH / 2;
    _oGameLogo.y = -150;
    createjs.Tween.get(_oGameLogo, { loop: false }).to(
      { y: CANVAS_HEIGHT_HALF - 100 },
      1000,
      createjs.Ease.cubicOut
    );
    _oMenuContainer.addChild(_oGameLogo);

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF + 150;
    var iWidth = 450;
    var iHeight = 64;

    _oYourBestScoreText = new CTLText(
      _oMenuContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      36,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_YOUR_BEST_SCORE + 0,
      true,
      true,
      true,
      false
    );

    var oSpritePlay = s_oSpriteLibrary.getSprite("but_play");
    _oButPlay = new CGfxButton(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT_HALF + 391,
      oSpritePlay,
      _oMenuContainer
    );
    _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
    _oButPlay.pulseAnimation();

    var oSprite = s_oSpriteLibrary.getSprite("but_credits");
    _pStartPosCredits = {
      x: 20 + oSprite.width / 2,
      y: oSprite.height / 2 + 50,
    };
    _oButCredits = new CGfxButton(
      _pStartPosCredits.x,
      _pStartPosCredits.y,
      oSprite,
      _oMenuContainer
    );
    _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      var oSprite = s_oSpriteLibrary.getSprite("audio_icon");
      _pStartPosAudio = {
        x: CANVAS_WIDTH - oSprite.width / 4 - 20,
        y: oSprite.height / 2 + 50,
      };
      _oAudioToggle = new CToggle(
        _pStartPosAudio.x,
        _pStartPosAudio.y,
        oSprite,
        s_bAudioActive,
        _oMenuContainer
      );
      _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    }

    var doc = window.document;
    var docEl = doc.documentElement;
    _fRequestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    _fCancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (ENABLE_FULLSCREEN === false) {
      _fRequestFullScreen = false;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
      _pStartPosFullscreen = {
        x: _pStartPosCredits.x + oSprite.width / 2 + 10,
        y: _pStartPosCredits.y,
      };

      // _oButFullscreen = new CToggle(
      //   _pStartPosFullscreen.x,
      //   _pStartPosFullscreen.y,
      //   oSprite,
      //   s_bFullscreen,
      //   _oMenuContainer
      // );
      // _oButFullscreen.addEventListener(
      //   ON_MOUSE_UP,
      //   this._onFullscreenRelease,
      //   this
      // );
    }

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oMenuContainer.addChild(_oFade);

    createjs.Tween.get(_oFade)
      .to({ alpha: 0 }, 1000)
      .call(function () {
        _oMenuContainer.removeChild(_oFade);
      });

    if (!s_bStorageAvailable) {
      new CMsgBox(TEXT_ERR_LS, _oMenuContainer);
    } else {
      var iTotalScore = getItem("zoominbasketball_total_score");
      if (iTotalScore !== null && iTotalScore !== undefined) {
        s_iTotalScore = Number(iTotalScore);
      } else {
        s_iTotalScore = 0;
      }

      var iBestScore = getItem("Zoomin_basketball_top_score");
      if (iBestScore !== null && iBestScore !== undefined) {
        s_iBestScore = iBestScore;
        _oYourBestScoreText.setVisible(true);
      } else {
        s_iBestScore = 0;

        _oYourBestScoreText.setVisible(true);
      }
      _oYourBestScoreText.refreshText(TEXT_YOUR_BEST_SCORE + s_iBestScore);
    }

    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };

  this.unload = function () {
    _oButPlay.unload();
    _oButPlay = null;

    _oButCredits.unload();

    _oMenuContainer.removeAllChildren();

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.unload();
      _oAudioToggle = null;
    }
    if (_fRequestFullScreen && screenfull.isEnabled) {
      //_oButFullscreen.unload();
    }
    s_oMenu = null;
  };

  this.refreshButtonPos = function (iNewX, iNewY) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.setPosition(
        _pStartPosAudio.x - iNewX,
        _pStartPosAudio.y + iNewY
      );
    }
    if (_fRequestFullScreen && screenfull.isEnabled) {
      // _oButFullscreen.setPosition(
      //   _pStartPosFullscreen.x + iNewX,
      //   _pStartPosFullscreen.y + iNewY
      // );
    }
    _oButCredits.setPosition(
      _pStartPosCredits.x + iNewX,
      _pStartPosCredits.y + iNewY
    );
  };

  this.resetFullscreenBut = function () {
    if (_fRequestFullScreen && screenfull.isEnabled) {
      //_oButFullscreen.setActive(s_bFullscreen);
    }
  };

  this.exitFromCredits = function () {
    _oCreditsPanel = null;
  };

  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
    localStorage.setItem("audio", s_bAudioActive);
  };

  this._onCredits = function () {
    _oCreditsPanel = new CCreditsPanel();
  };

  this._onButPlayRelease = function () {
    this.unload();
    s_oMain.gotoGame();
  };

  this._onFullscreenRelease = function () {
    if (s_bFullscreen) {
      _fCancelFullScreen.call(window.document);
    } else {
      _fRequestFullScreen.call(window.document.documentElement);
    }

    sizeHandler();
  };

  this.update = function () {};

  s_oMenu = this;

  this._init();
}

var s_oMenu = null;
CInterface.prototype.getHighestScore = function () {
  let searchParams = new URLSearchParams(window.location.search);
  event_id = searchParams.get("event_id");

  $.ajax({
    type: "POST",
    url: baseurl + "Player/getHighestPlayerPoint",
    data: "user_id=" + get_userid() + "&event_id=" + event_id,
    async: true,
    success: function (html) {
      saveItem("Zoomin_basketball_top_score", html.trim());
      this.setHighestScore(html.trim());
    }.bind(this),
  });
};
function CGame(oData) {
  var _bStartGame;
  var _bDisableEvents;
  var _bTurn;
  var _bLaunched;
  var _bPressMove;
  var _bLastShotScored;
  var _bLastShotPerfect;
  var _bScoreBonusActive;
  var _bBasketTopScored;
  var _bBasketBottomScored;
  var _bBallFalling;
  var _bBallTouchingHood;
  var _bScored;
  var _bNewBestScore;

  var _iTotalScore;
  var _iScore;
  var _iBallLimit;
  var _iBonus;
  var _iPlayerLives;
  var _iStrightSec;
  var _oGameContainer;
  var _oInterface;
  var _oEndPanel;
  var _oHelpPanel;
  var _oHitArea;
  var _oBallStartPosition;
  var _oClickPoint;
  var _oReleasePoint;
  var _oBall;
  var _oBoard;
  var _oBoardHoop;
  var _oStarBonus;
  var _oScoreBonusText;
  var _oNewBestScoreText;
  var _oShake;

  var _vGravity;
  var _vRingEdgeNormal;

  this._init = function () {
    s_oTweenController = new CTweenController();

    _oGameContainer = new createjs.Container();
    s_oStage.addChild(_oGameContainer);

    var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oGameContainer.addChild(oBg);

    _iBallLimit = BOTTOM_LIMIT - BALL_SIZE / 2;
    _oBallStartPosition = { x: CANVAS_WIDTH_HALF, y: _iBallLimit };

    _vGravity = new CVector3(0, GRAVITY_Y, 0); // INIT GRAVITY
    _vGravity.normalize();

    _oBoard = new CBoard(_oGameContainer); // INIT BOARD AND HOOP
    var now = new Date();
    now.setMinutes(
      now.getMinutes() + parseInt(localStorage.getItem("duration"))
    ); // timestamp
    deadline = new Date(now); // Date object
    var diffs = difference2Parts(Date.parse(deadline) - Date.parse(new Date()));
    hor_second = diffs.secondsTotal;

    timeinterval = setInterval(() => {
      remaing = getTimeRemaining(deadline);
      const diffs = difference2Parts(
        Date.parse(deadline) - Date.parse(new Date())
      );
      second = diffs.secondsTotal;
      console.log(second);
      if (remaing.hours > 0) {
        $(".digital_timer")
          .html(
            remaing.hours +
              ":" +
              remaing.minutes +
              ":" +
              ("0" + remaing.seconds).slice(-2)
          )
          .removeClass("hidden");
      } else if (remaing.minutes <= 0) {
        $(".digital_timer")
          .html("0:" + ("0" + remaing.seconds).slice(-2))
          .removeClass("hidden");
      } else {
        $(".digital_timer")
          .html(remaing.minutes + ":" + ("0" + remaing.seconds).slice(-2))
          .removeClass("hidden");
      }
      if (second <= 0) {
        clearInterval(timeinterval);
        _oBoard.setUpdate(false);
        $(".time_bottom").addClass("hidden");
        this.gameOver();
        setTimeout(function () {
          window.location.replace(
            "http://localhost:19006/?event_id=" + event_id + "&&play_flag=true"
          );
        }, 2000);
      }
      if (
        parseInt(second) > 0 &&
        parseInt(second) < parseInt(hor_second / 1.25)
      ) {
        _oBoard.setBoardHorizontalMovement(true);

        if (_oBoard.isUpdate() === false) {
          _oBoard.resetBoardMovement();
          _oBoard.setUpdate(true);
        }
      }

      if (parseInt(second) < parseInt(hor_second / 2)) {
        _oBoard.setBoardVerticalMovement(true);
      }
    }, 1000);

    this.initHoop();
    this.initScoreBonusText();
    this.initNewBestScoreText();
    _oShake = new CShake(_oBoardHoop, 500, 7, 20);

    _oBall = new CBall(_oGameContainer); // INIT BALL
    this.resetVariables();

    this.initRingEdgeNormal();
    this.initHitArea();

    _oInterface = new CInterface(_oGameContainer);
    _oInterface.initInterfacesText();
    _oInterface.updatePlayerLives();
    _oInterface.gameOverFun(false);
    if (s_bFirstTimePlaying === true) {
      _oHelpPanel = new CHelpPanel();
    } else {
      this._onExitHelp();
    }
  };

  this.initRingEdgeNormal = function () {
    _vRingEdgeNormal = new CVector2(0, -1);
    _vRingEdgeNormal.normalize();
  };

  this.initHoop = function () {
    var oData = {
      images: [s_oSpriteLibrary.getSprite("hoop")],
      framerate: 20,
      frames: { width: 256, height: 284, regX: 256 / 2, regY: 284 / 2 },
      animations: {
        idle: [0, 0, "idle"],
        move: [1, 15, "idle"],
      },
    };
    var oSpriteSheet = new createjs.SpriteSheet(oData);
    _oBoardHoop = createSprite(
      oSpriteSheet,
      "idle",
      256 / 2,
      284 / 2,
      256,
      284
    );
    _oBoardHoop.scaleX = _oBoardHoop.scaleY = 0.7;
    _oBoardHoop.x = _oBoard.getX();
    _oBoardHoop.y = _oBoard.getY() + BOARD_HOOP_Y_OFFSET;
    _oGameContainer.addChild(_oBoardHoop);
  };

  this.moveHoop = function () {
    if (_oBoardHoop.currentAnimation === "idle") {
      _oBoardHoop.gotoAndPlay("move");
    }
  };

  this.initNewBestScoreText = function () {
    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF + 200;
    var iWidth = 500;
    var iHeight = 100;

    _oNewBestScoreText = new CTLText(
      _oGameContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      50,
      "center",
      WHITE_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_NEWBESTSCORE,
      true,
      true,
      true,
      false
    );

    _oNewBestScoreText.setVisible(false);
  };

  this.initScoreBonusText = function () {
    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF - 350;
    var iWidth = 500;
    var iHeight = 100;

    _oScoreBonusText = new CTLText(
      _oGameContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      50,
      "center",
      WHITE_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      "x" + BONUS_MULTIPLIER + " " + TEXT_BONUS + "!",
      true,
      true,
      true,
      false
    );

    _oScoreBonusText.setVisible(false);
  };

  this.resetTurnVariables = function () {
    _bLaunched = false;
    _bPressMove = false;
    _bBasketTopScored = false;
    _bBasketBottomScored = false;
    _bLastShotScored = false;
    _bBallFalling = false;
    _bBallTouchingHood = false;
    _bScored = false;
  };

  this.resetVariables = function () {
    _oEndPanel = null;

    _bStartGame = false;
    _bDisableEvents = false;
    this.resetTurnVariables();
    _bTurn = false;
    _bLastShotPerfect = false;
    _bScoreBonusActive = false;
    _bNewBestScore = false;
    _oBall.setBlockLaunch(false);

    _iScore = 0;
    _iBonus = NO_BONUS;
    _iPlayerLives = PLAYER_LIVES;
    _iStrightSec = STRIGHT_SEC;
    _iTotalScore = s_iTotalScore;
    _showBall = Show_BALL;

    _oStarBonus = null;

    setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
  };

  this.getBallStartPosition = function () {
    return _oBallStartPosition;
  };

  this.initHitArea = function () {
    _oHitArea = new createjs.Shape();
    _oHitArea.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oHitArea.alpha = 0.01;

    _oHitArea.on("mousedown", function (evt) {
      s_oGame.onPressDown(evt);
    });
    _oHitArea.on("pressmove", function (evt) {
      s_oGame.onPressMove(evt);
    });
    _oHitArea.on("pressup", function () {
      s_oGame.onPressUp();
    });

    _oGameContainer.addChild(_oHitArea);
  };

  this.onPressDown = function (evt) {
    if (_bLaunched) {
      return;
    }

    _oClickPoint = { x: s_oStage.mouseX, y: s_oStage.mouseY };
  };

  this.onPressMove = function (evt) {
    if (_bLaunched) {
      return;
    }

    _oReleasePoint = { x: s_oStage.mouseX, y: s_oStage.mouseY };
    _bPressMove = true;
  };

  this.onPressUp = function () {
    if (!_bPressMove || _bLaunched) {
      return;
    }

    this.launchBallOnClick();
    _bPressMove = false;
  };

  this.launchBallOnClick = function () {
    if (_oBall.getBlockLaunch()) {
      return;
    }

    // CHECK IF zoomin IS LONG ENOUGH FOR THE LAUNCH
    var iDistance = distanceBetweenTwoPoints(
      _oClickPoint.x,
      _oClickPoint.y,
      _oReleasePoint.x,
      _oReleasePoint.y
    );
    if (iDistance < zoomin_LIMIT_MIN) {
      return;
    }

    playSound("swish", 1, false);
    _oBall.shadowFadeOut();

    var vForce = new CVector3(
      _oReleasePoint.x - _oClickPoint.x,
      _oReleasePoint.y - _oClickPoint.y,
      1
    );
    // AVOID LAUNCHING THE BALL BELOW ITS Y
    if (_oReleasePoint.y - _oClickPoint.y > 0) {
      vForce.set(_oReleasePoint.x - _oClickPoint.x, -1, 1);
    }
    vForce.normalize();

    // AVOID THROWING THE BALL HORIZONTALLY ONLY
    if (vForce.getX() > FORCE_X_LIMIT_MAX) {
      vForce.set(FORCE_X_LIMIT_MAX, -1, 1);
    }

    if (vForce.getX() < FORCE_X_LIMIT_MIN) {
      vForce.set(FORCE_X_LIMIT_MIN, -1, 1);
    }

    this.launchBall(vForce);
    _oBall.startBallAnimation();

    _oReleasePoint.x = 0;
    _oReleasePoint.y = 0;
    this.setLaunched(true);
    _oBall.setBlockLaunch(true);
  };

  this.launchBall = function (vForce) {
    var vBallCurForce = _oBall.vCurForce();
    var vDirection = new CVector3(vForce.getX(), vForce.getY(), vForce.getZ());
    vDirection.scalarProduct(LAUNCH_POWER_LIMIT_MIN); // ADD A FORCE MODULE TO MOVE THE BALL
    vBallCurForce.setV(vDirection); // SET THE BALL FORCE TO THE VECTOR WE CREATED
  };

  this.setLaunched = function (bValue) {
    _bLaunched = bValue;
  };

  this.unload = function () {
    _oInterface.unload();
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren();
    _oHitArea.removeAllEventListeners();
    s_oGame = null;
  };

  this.onExit = function () {
    setVolume("soundtrack", 1);
    s_oGame.unload();
    s_oMain.gotoMenu();
    saveItem("zoominbasketball_end_time", Date.parse(new Date()));
    save_player_time();
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad");
  };

  this.restart = function () {
    setVolume("soundtrack", 0.3);
    $(s_oMain).trigger("restart_level");
    s_oGame.unload();
    s_oMain.gotoGame();
  };

  this._onExitHelp = function () {
    _bStartGame = true;
    this.setTurn(true);
    s_bFirstTimePlaying = false;
  };

  this.updateScore = function () {
    // UPDATE TOTAL SCORE

    _iTotalScore += _iScore;
    s_iTotalScore = _iTotalScore;
    saveItem("zoominbasketball_total_score", s_iTotalScore);
    // UPDATE BEST SCORE
    if (_iScore > s_iBestScore) {
      s_iBestScore = _iScore;
      saveItem("zoominbasketball_best_score", s_iBestScore);
    }
  };

  this.addScore = function (iValue, bBonus) {
    var iMultiplier = 1;
    if (_bScoreBonusActive === true) {
      iMultiplier = BONUS_MULTIPLIER;
    }

    this.createFieldScoreText(iValue * iMultiplier, bBonus);
    _iScore += iValue * iMultiplier;
    _oInterface.refreshScoreText(_iScore);

    // SHOW A "NEW BEST SCORE" TEXT, IF NEEDED

    if (_iScore > s_iBestScore) {
      this.showNewBestScore();
      s_iBestScore = _iScore;
      saveItem("zoominbasketball_best_score", s_iBestScore);
      //_oInterface.refreshBestScoreText();
      _bNewBestScore = true;
    }
  };

  this.checkForBoardMovement = function () {
    // if (_iScore >= BOARD_HORIZONTAL_MOVEMENT_LIMIT) {
    //   _oBoard.setBoardHorizontalMovement(true);
    //   if (_oBoard.isUpdate() === false) {
    //     _oBoard.resetBoardMovement();
    //     _oBoard.setUpdate(true);
    //   }
    // }
    // if (_iScore >= BOARD_VERTICAL_MOVEMENT_LIMIT) {
    //   _oBoard.setBoardVerticalMovement(true);
    // }
  };

  this.createFieldScoreText = function (iValue, bBonus) {
    var iX = _oBoard.getX();
    var iY = _oBoard.getY();

    if (bBonus) {
      iY -= 100;
    }

    var iWidth = 450;
    var iHeight = 100;

    var oScoreText = new CTLText(
      _oGameContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      40,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      "+" + iValue,
      true,
      true,
      true,
      false
    );

    var oGraphicText = oScoreText.getText();
    createjs.Tween.get(oGraphicText)
      .to({ y: iY - 300, alpha: 0 }, 1500, createjs.Ease.quadIn)
      .call(function () {
        createjs.Tween.removeTweens(oGraphicText);
        _oGameContainer.removeChild(oGraphicText);
        delete oScoreText;
      });
  };

  this.gameOver = function () {
    _bStartGame = false;
    this.updateScore();
    save_score_ajax();
    _oInterface.gameOverFun(true);

    if (_oEndPanel === null) {
      playSound("game_over", 1, false);
      stopSound("soundtrack");

      setTimeout(function () {
        //playSound("soundtrack", 0.5, false);
      }, 2000);

      _oEndPanel = new CEndPanel(_iScore);
      _bDisableEvents = true;

      $(s_oMain).trigger("share_event", s_iBestScore);
      $(s_oMain).trigger("save_score", s_iBestScore);
    }
  };

  this.setTurn = function (bValue) {
    _bTurn = bValue;
  };

  this.setNetInFront = function () {
    _oGameContainer.setChildIndex(_oBoardHoop, _oGameContainer.numChildren - 1);
  };

  this.resetNetZIndex = function () {
    _oGameContainer.addChildAt(
      _oBoardHoop,
      _oGameContainer.getChildIndex(_oBoard.getBoardContainer()) + 1
    );
  };

  this.moveBall = function () {
    // IF THE BALL IS ALREADY STOPPED, SKIP
    if (_oBall.isStopped() === true) {
      return;
    }

    var vForce = _oBall.vCurForce();
    vForce.addV(_vGravity);
    _oBall.vPos().addV(vForce); // MOVE THE BALL WITH ITS FORCE MODULE PLUS GRAVITY

    if (_oBall.getY() < _oBoard.getY() && _bBallFalling === false) {
      this.setNetInFront();
      _bBallFalling = true;
    }

    // CHECK FOR COLLISIONS ON THE BASKET BOARD
    if (this.checkPointIsInRectSquaresApprossimate() === true) {
      this.checkIfBallIsInBasket();
      this.checkCollisionWithHoop();
    }

    // CHECK FOR COLLISIONS WITH BONUS OR IF THE BALL IS OUT OF THE SCREEN
    this.checkCollisionWithBonus();
    this.checkCollisionWithWalls();

    _oBall.updateSpritePosition();
  };

  this.checkCollisionWithHoop = function () {
    // CHECK IF THE BALL IS FALLING DOWN
    if (_bBallFalling === false) {
      return;
    }

    var bCollide = false;

    if (_oBall.getX() < _oBoard.getX()) {
      // COMING FROM LEFT
      if (
        this.checkForBoardRingEdgeCollision(
          _oBoard.getBoardSideLeftPosition()
        ) === true
      ) {
        // IF THERE IS A COLLISION WITH THE LEFT RING EDGE
        bCollide = true;
      }
    } else {
      // COMING FROM RIGHT
      if (
        this.checkForBoardRingEdgeCollision(
          _oBoard.getBoardSideRightPosition()
        ) === true
      ) {
        // IF THERE IS A COLLISION WITH THE RIGHT RING EDGE
        bCollide = true;
      }
    }

    var aBoardSide = _oBoard.getHoopSideEdges();

    if (_oBall.getX() < _oBoard.getX()) {
      // COMING FROM LEFT
      var oLeftSide = {
        p1: _oBoard.getHoopLeftSidePtA(),
        p2: _oBoard.getHoopLeftSidePtB(),
      };
      if (this.checkIfBallIsCollidingOnHoopSides(oLeftSide) === true) {
        // BOUNCE BACK FROM THE HOOP
        this.reflectBallOnBoard(aBoardSide[EDGE_LEFT]);
        bCollide = true;
      }
    } else {
      // COMING FROM RIGHT
      var RightSide = {
        p1: _oBoard.getHoopRightSidePtA(),
        p2: _oBoard.getHoopRightSidePtB(),
      };
      if (this.checkIfBallIsCollidingOnHoopSides(RightSide) === true) {
        // BOUNCE BACK FROM THE HOOP
        this.reflectBallOnBoard(aBoardSide[EDGE_RIGHT]);
        bCollide = true;
      }
    }

    return bCollide;
  };

  this.checkCollisionWithBonus = function () {
    // IF THERE'S NO BONUS, DON'T CHECK FOR COLLISIONS
    if (_oStarBonus === null || _bBallFalling === false) {
      return;
    }

    if (
      this.checkIfBallIsCollidingWithBonus() === true &&
      _oStarBonus.isBonusTaken() === false
    ) {
      // BONUS TAKEN
      playSound("bonus_taken", 1, false);
      this.addScore(STAR_BONUS_POINTS, true);
      _oStarBonus.onBonusTaken();
      _oStarBonus = null;
      return true;
    } else {
      return false;
    }
  };

  this.checkIfBallIsCollidingWithBonus = function () {
    // CHECK IF THE BALL HAS COLLIDED WITH THE BONUS
    if (
      _oBall.getX() > _oStarBonus.getX() - _oStarBonus.getWidth() &&
      _oBall.getX() < _oStarBonus.getX() + _oStarBonus.getWidth() &&
      _oBall.getY() > _oStarBonus.getY() - _oStarBonus.getHeight() &&
      _oBall.getY() < _oStarBonus.getY() + _oStarBonus.getHeight()
    ) {
      return true;
      // IF THE BALL IS NOT INSIDE THE BOARD'S LIMIT RECTANGLE, RETURN FALSE
    } else {
      return false;
    }
  };

  this.checkIfBallIsInBasket = function () {
    /* WE WILL CHECK IF THE BALL IS IN COLLISION WITH THE BASKET_TOP FIRST,
     * AND THEN WITH THE BASKET_BOTTOM. IF BOTH CONDITIONS ARE TRUE, IN THIS
     * ORDER, THE BALL HAS CORRECTLY FALLEN IN THE BASKET, AND IT'S A POINT.
     */

    // THE BALL HAS NOT COLLIDED WITH THE BASKET YET
    if (_bBasketTopScored === false && _bBasketBottomScored === false) {
      _bBasketTopScored = this.checkCollisionWithBasket(_oBoard.getBasketTop());
    }

    // THE BALL HAS COLLIDED WITH THE BASKET_TOP ONLY
    if (_bBasketTopScored === true && _bBasketBottomScored === false) {
      _bBasketBottomScored = this.checkCollisionWithBasket(
        _oBoard.getBasketBottom()
      );
    }

    // THE BALL HAS COLLIDED WITH BOTH BASKET_TOP AND BASKET_BOTTOM
    if (
      _bBasketTopScored === true &&
      _bBasketBottomScored === true &&
      _bScored === false
    ) {
      this.moveHoop();
      this.onScore();
      _bScored = true;
    }
  };

  this.checkCollisionWithBasket = function (oEdgeModel) {
    var oInfo = collideEdgeWithCircle(
      oEdgeModel,
      _oBall.vPos(),
      _oBall.getRadius()
    );

    if (oInfo) {
      // ON COLLISION FOUND
      return true;
    } else {
      // NO COLLISION
      return false;
    }
  };

  this.onScore = function () {
    if (_bBallTouchingHood === false) {
      _iBonus = BONUS_NO_COLLISIONS;
    } else {
      _iBonus = NO_BONUS;
    }

    playSound("score", 1, false);
    this.addScore(BALL_POINTS * _iBonus, false);

    if (_bBallTouchingHood === false) {
      if (_bLastShotPerfect === false) {
        _bLastShotPerfect = true;
      } else {
        _bScoreBonusActive = true;
      }
    } else {
      _bScoreBonusActive = false;
      _bLastShotPerfect = false;
    }

    _bBasketTopScored = false;
    _bBasketBottomScored = false;
    _bLastShotScored = true;
  };

  this.checkForBoardRingEdgeCollision = function (oRingSide) {
    // CHECK COLLISION WITH BOARD RING EDGES
    if (
      this.checkDistanceBetweenTwoCircles(
        _oBall.getX(),
        _oBall.getY(),
        oRingSide.x,
        oRingSide.y
      ) < _oBall.getRadiusForCollisionRingEdge()
    ) {
      if (soundPlaying("boing") === false) {
        playSound("boing", 1, false);
      }

      _bBallTouchingHood = true;

      // FIND THE POINT BETWEEN THE BALL AND THE RING
      var vRingSide = new CVector2();
      vRingSide.set(oRingSide.x, oRingSide.y);

      var vNewBallPosition = new CVector2(_oBall.getX(), _oBall.getY());
      vNewBallPosition.subtractV(vRingSide);
      vNewBallPosition.normalize();

      vNewBallPosition.scalarProduct(
        (BOARD_SIDES_RADIUS + _oBall.getRadiusForCollisionRingEdge()) * 1.2
      );
      vNewBallPosition.addV(vRingSide);

      _oShake.updateObject(_oBoardHoop);
      _oShake._tremble();

      // MAKE THE BALL BOUNCE
      this.bounceBallOnRingEdge(vNewBallPosition, vRingSide);
      return true;
    } else {
      // NO COLLISION FOUND
      return false;
    }
  };

  this.bounceBallOnRingEdge = function (vNewPosition, vRingSide) {
    var vNewDirection = new CVector2(_oBall.getX(), _oBall.getY());
    vNewDirection.subtractV(vRingSide);
    vNewDirection.normalize();
    vNewDirection.scalarProduct(_oBall.vCurForce().length());

    _oBall.setPosition(vNewPosition.getX(), vNewPosition.getY(), _oBall.getZ());

    if (vNewDirection.length() > BALL_FORCE_MINIMUM_LIMIT) {
      vNewDirection.scalarProduct(DAMPING_VARIABLE);
    }
    _oBall.setForce(vNewDirection.getX(), vNewDirection.getY());
  };

  this.checkIfBallIsCollidingOnHoopSides = function (oSide) {
    if (
      circleDistFromLineSeg(_oBall.getX(), _oBall.getY(), oSide) <
      _oBall.getRadiusWithTolerance()
    ) {
      // IF THE BALL IS TOUCHING THE SIDE, RETURN TRUE
      return true;
    } else {
      // IF THERE'S NO COLLISION, RETURN FALSE
      return false;
    }
  };

  this.reflectBallOnBoard = function (oEdgeModel) {
    // CHECK FOR COLLISIONS
    var oInfo = collideEdgeWithCircle(
      oEdgeModel,
      _oBall.vPos(),
      _oBall.getRadius()
    );

    // IF THERE'S A COLLISION WITH A SIDE
    if (oInfo) {
      this.bounceBallOnHoopSideEdge(oInfo, oEdgeModel);
      _bBallTouchingHood = true;
      this.moveHoop();
      return true;
    }
    // IF THERE'S NO COLLISION
    return false;
  };

  this.checkDistanceBetweenTwoCircles = function (
    iCircle1X,
    iCircle1Y,
    iCircle2X,
    iCircle2Y
  ) {
    var a = iCircle1X - iCircle2X;
    var b = iCircle1Y - iCircle2Y;
    var iDistance = Math.sqrt(a * a + b * b);
    return iDistance;
  };

  this.checkPointIsInRectSquaresApprossimate = function () {
    // IF THE BALL IS INSIDE THE BOARD'S LIMIT RECTANGLE, RETURN TRUE
    if (
      _oBall.getX() > _oBoard.getLimitLeft() &&
      _oBall.getX() < _oBoard.getLimitRight() &&
      _oBall.getY() > _oBoard.getLimitTop() &&
      _oBall.getY() < _oBoard.getLimitBottom()
    ) {
      return true;
      // IF THE BALL IS NOT INSIDE THE BOARD'S LIMIT RECTANGLE, RETURN FALSE
    } else {
      return false;
    }
  };
  this.get_game_time = function () {
    timeinterval = setInterval(() => {
      remaing = getTimeRemaining(deadline);
      const diffs = difference2Parts(
        Date.parse(deadline) - Date.parse(new Date())
      );
      second = diffs.secondsTotal;
      if (second < 0) {
        clearInterval(timeinterval);
        _oBoard.setUpdate(false);
        this.gameOver();
      }
    }, 1000);
  };

  this.getStrightSec = function () {
    t = getTimeRemaining(deadline);
    _iStrightSec = parseInt(t.seconds);

    return _iStrightSec;
  };
  this.getLives = function () {
    return _iPlayerLives;
  };
  this.getShowBall = function () {
    return _showBall;
  };

  this.checkCollisionWithWalls = function () {
    var bCollide = false;

    if (_oBall.getX() > CANVAS_WIDTH - BALL_SIZE / 2) {
      _oBall.fadeOut();
    } else if (_oBall.getX() < 0 + BALL_SIZE / 2) {
      _oBall.fadeOut();
    }

    // IF THE BALL GOES OUT OF THE SCREEN
    if (_oBall.getX() > CANVAS_WIDTH) {
      bCollide = true;

      _oBall.stopBall();
      this.resetTurn();
      // IF THE BALL GOES OUT OF THE SCREEN
    } else if (_oBall.getX() < 0) {
      bCollide = true;
      _oBall.fadeOut();
      _oBall.stopBall();
      this.resetTurn();
    }

    return bCollide;
  };

  this.bounceBallOnHoopSideEdge = function (oInfo, oEdgeModel) {
    var vNewPosition = new CVector2();
    vNewPosition.setV(oEdgeModel.getNormal()); // CREATE THE EDGE NORMAL, CHECK FOR ALL THE DISTANCE TO FIND THE COLLISION POINT
    vNewPosition.scalarProduct(_oBall.getRadiusWithTolerance());
    vNewPosition.addV(oInfo.closest_point);

    var vNewPos = new CVector3(
      vNewPosition.getX(),
      vNewPosition.getY(),
      _oBall.getZ()
    );
    _oBall.setPos(vNewPos);

    var vNewForce = new CVector2(
      _oBall.vCurForce().getX(),
      _oBall.vCurForce().getY()
    );
    reflectVectorV2(vNewForce, oEdgeModel.getNormal());

    vNewForce.scalarProduct(DAMPING_VARIABLE / 2);
    _oBall.setForce(vNewForce.getX(), vNewForce.getY());
  };

  this.updateBoardHoopPosition = function () {
    if (_oBoardHoop.x !== _oBoard.getX()) {
      _oBoardHoop.x = _oBoard.getX();
    }

    if (_oBoardHoop.y !== _oBoard.getY() + BOARD_HOOP_Y_OFFSET) {
      _oBoardHoop.y = _oBoard.getY() + BOARD_HOOP_Y_OFFSET;
    }
  };

  this.setStartGame = function (bValue) {
    _bStartGame = bValue;
  };

  this.setNextTurn = function () {
    _bTurn = true;
    this.resetTurnVariables();
    this.checkForBoardMovement();
    this.setNextStartPosition();
    this.resetNetZIndex();
    this.initNewStarBonus();
  };

  this.showNewBestScore = function () {
    if (_bNewBestScore === true || s_bFirstTimePlaying === true) {
      return;
    }

    var iScaleMax = 1.2;
    _oNewBestScoreText.setVisible(true);

    if (soundPlaying("newbestscore") === false) {
      playSound("newbestscore", 1, false);
    }
    var oGraphicBestScoreText = _oNewBestScoreText.getText();
    new createjs.Tween.get(oGraphicBestScoreText)
      .to({ alpha: 1 }, 500, createjs.Ease.quadIn)
      .call(function () {
        new createjs.Tween.get(oGraphicBestScoreText, { loop: true })
          .to(
            { scaleX: iScaleMax, scaleY: iScaleMax },
            1000,
            createjs.Ease.quadOut
          )
          .to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.quadIn);
        new createjs.Tween.get(oGraphicBestScoreText)
          .wait(2000)
          .to({ alpha: 0 }, 1000, createjs.Ease.quadOut)
          .call(function () {
            _oNewBestScoreText.setVisible(false);
            createjs.Tween.removeTweens(oGraphicBestScoreText);
          });
      });
  };

  this.showScoreBonus = function () {
    if (_oScoreBonusText.getVisible()) {
      return;
    }
    _oScoreBonusText.setVisible(true);
    var iScaleMax = 1.2;

    playSound("bonus", 1, false);

    _oScoreBonusText.setVisible(true);
    var oGraphicScoreBonusText = _oScoreBonusText.getText();
    oGraphicScoreBonusText.scaleX = oGraphicScoreBonusText.scaleY = 1;

    _oScoreBonusText.removeTweens();
    new createjs.Tween.get(oGraphicScoreBonusText, { override: true })
      .to({ alpha: 1 }, 250, createjs.Ease.quadIn)
      .call(function () {
        new createjs.Tween.get(oGraphicScoreBonusText, {
          override: true,
          loop: true,
          bounce: true,
        }).to(
          { scaleX: iScaleMax, scaleY: iScaleMax },
          1000,
          createjs.Ease.quadOut
        );
      });
  };

  this.hideScoreBonus = function () {
    _oScoreBonusText.setVisible(false);
    createjs.Tween.removeTweens(_oScoreBonusText.getText());
  };

  this.initNewStarBonus = function () {
    if (_oStarBonus !== null) {
      return;
    }

    // TRY TO CREATE A NEW BONUS, IF THE RANDOM OCCURRENCY IS SATISFIED
    var iRandomOccurrency = Math.floor(Math.random() * 100);
    if (iRandomOccurrency > RANDOM_BONUS_OCCURRENCY) {
      return;
    }

    // var iIndex = _oGameContainer.getChildIndex(_oBall.getContainer());
    // _oStarBonus = new CBonus(
    //   CANVAS_WIDTH_HALF,
    //   CANVAS_HEIGHT_HALF - 200,
    //   _oGameContainer,
    //   iIndex
    // );
  };

  this.setNextStartPosition = function () {
    // IF THE SCORE IS AT LEAST THIS LIMIT, THE BALL WILL START IN RANDOM POSITIONS
    if (_iScore < RANDOM_BALL_START_LIMIT) {
      _oBallStartPosition.x = CANVAS_WIDTH_HALF;
    } else {
      _oBallStartPosition.x = Math.random() * (CANVAS_WIDTH - 100 - 100) + 100;
    }

    _oBall.resetPosition(_oBallStartPosition.x, _iBallLimit, 0);
  };

  this.resetTurn = function () {
    if (_bScoreBonusActive === false) {
      this.hideScoreBonus();
    } else {
      this.showScoreBonus();
    }

    // IF THE PLAYER SCORED THE LAST SHOT, THERE'S ANOTHER TURN
    if (_bLastShotScored === true) {
      this.setNextTurn();
      _oBall.setBonus(_bScoreBonusActive);
      // IF THE PLAYER FAILED THE SHOT, IT'S GAME OVER
    } else {
      this.subtractPlayerLives();
      return;
    }
  };

  this.subtractPlayerLives = function () {
    // RESET THE SCORE BONUS
    _bScoreBonusActive = false;
    _bLastShotScored = false;
    _bLastShotPerfect = false;
    _oBall.setBonus(false);
    this.hideScoreBonus();

    // SUBTRACT LIFE AND UPDATE INTERFACE
    playSound("malus", 1, false);
    _iPlayerLives--;
    _oInterface.removeLife();

    // CHECK IF THE PLAYER HAS MORE LIVES LEFT
    if (_iStrightSec > 0) {
      this.setNextTurn();
      // IF NO LIFE IS LEFT, IT'S GAMEOVER
    } else {
      _oBoard.setUpdate(false);
      this.gameOver();
    }

    if (_iPlayerLives > 0) {
      this.setNextTurn();
      // IF NO LIFE IS LEFT, IT'S GAMEOVER
    } else {
      _oBoard.setUpdate(false);
      this.gameOver();
    }
  };

  this.checkForBallFadeOut = function () {
    if (_oBall.isStopped() === true) {
      return;
    }

    _oBall.fadeOut();
  };

  this.update = function () {
    _oBoard.update();
    this.updateBoardHoopPosition();

    // LOOP FOR N TIMES IN EACH FPS
    for (var i = 0; i < PHYSICS_ITERATIONS; i++) {
      if (_bStartGame === false || _bTurn === false || _bLaunched === false) {
        return;
      }

      // UPDATE BALL MOVEMENTS WHEN THE PLAYER HAS LAUNCHED AND CHECK FOR COLLISIONS
      this.moveBall();

      // ON BOTTOM WALL COLLISION, STOP THE BALL AND CHECK FOR NEXT TURN
      if (_oBall.getY() > _iBallLimit) {
        _oBall.stopBall();
        this.resetTurn();
        return;
      }

      // ON BOTTOM WALL COLLISION, STOP THE BALL AND CHECK FOR NEXT TURN
      if (_bBallFalling === true && _oBall.getY() > BALL_LIMIT_FADEOUT) {
        this.checkForBallFadeOut();
      }
    }
  };

  s_oGame = this;

  BALL_POINTS = oData.ball_points;
  BONUS_MULTIPLIER = oData.bonus_multiplier;
  STAR_BONUS_POINTS = oData.star_bonus_points;
  BONUS_NO_COLLISIONS = oData.bonus_no_collision;
  RANDOM_BONUS_OCCURRENCY = oData.random_bonus_occurrency;
  RANDOM_BALL_START_LIMIT = oData.random_ball_start_limit;
  BOARD_HORIZONTAL_MOVEMENT_LIMIT = oData.board_horizontal_movement_limit;
  BOARD_VERTICAL_MOVEMENT_LIMIT = oData.board_vertical_movement_limit;
  PLAYER_LIVES = oData.player_lives;
  Show_BALL = oData.show_ball;
  STRIGHT_SEC = oData.Stright_sec;
  this._init();
}

var s_oGame;
var s_oTweenController;

function CBall(oParentContainer) {
  var _oParentContainer;
  var _oBallContainer;
  var _oBallShadow;
  var _oBall;
  var _oStartPos;
  var _oUserData;

  var _vPos;
  var _vPrevPos;
  var _vCurForce;

  var _iRadius;
  var _iSquareRadius;
  var _iRadiusWithTolerance;
  var _iRadiusForCollisionRingEdge;

  var _bLaunched;
  var _bStopped;
  var _bBonus;
  var _bBlockLaunch;

  var _aBallParticles;

  this._init = function () {
    var oStartPosition = s_oGame.getBallStartPosition();
    var iXPos = oStartPosition.x;
    var iYPos = oStartPosition.y;
    _oStartPos = { x: iXPos, y: iYPos };
    _bLaunched = false;
    _bStopped = false;
    _bBonus = false;
    _bBlockLaunch = false;

    _aBallParticles = [];

    _oBallContainer = new createjs.Container();
    _oParentContainer.addChild(_oBallContainer);

    if (!s_bMobile) {
      _oBallContainer.cursor = "pointer";
    }

    var oData = {
      images: [
        s_oSpriteLibrary.getSprite("ball"),
        s_oSpriteLibrary.getSprite("ball_bonus"),
      ],
      framerate: 20,
      frames: {
        width: BALL_SIZE,
        height: BALL_SIZE,
        regX: BALL_SIZE / 2,
        regY: BALL_SIZE / 2,
      },
      animations: { idle: [0, 17, "idle"], bonus: [18, 35, "bonus"] },
    };
    var oSpriteSheet = new createjs.SpriteSheet(oData);
    _oBall = createSprite(
      oSpriteSheet,
      "idle",
      BALL_SIZE / 2,
      BALL_SIZE / 2,
      BALL_SIZE,
      BALL_SIZE
    );
    _oBallContainer.addChild(_oBall);
    _oBallContainer.x = iXPos;
    _oBallContainer.y = iYPos;

    this.resetBallAnimation();

    _oBallShadow = createBitmap(s_oSpriteLibrary.getSprite("ball_shadow"));
    _oBallShadow.regX = BALL_SIZE / 2;
    _oBallShadow.regY = -40;
    _oBallShadow.x = _oBallContainer.x;
    _oBallShadow.y = _oBallContainer.y;
    _oParentContainer.addChild(_oBallShadow);

    _vPos = new CVector3();
    _vPos.set(_oBallContainer.x, _oBallContainer.y, 0);
    _vPrevPos = new CVector3();
    _vPrevPos.set(0, 0, 0);

    _iRadius = BALL_SIZE * 0.5;
    _iSquareRadius = _iRadius * _iRadius;
    _iRadiusWithTolerance = _iRadius * BALL_RADIUS_TOLERANCE_FACTOR;
    _iRadiusForCollisionRingEdge = _iRadius + BOARD_SIDES_RADIUS;
    _vCurForce = new CVector3(0, 0, 0);
  };

  this.shadowFadeOut = function () {
    createjs.Tween.get(_oBallShadow).to(
      { alpha: 0 },
      200,
      createjs.Ease.quadOut
    );
  };

  this.resetBallAnimation = function () {
    if (_bBonus === true) {
      _oBall.gotoAndStop("bonus");
    } else {
      _oBall.gotoAndStop("idle");
    }
  };

  this.startBallAnimation = function () {
    if (_bBonus === true) {
      _oBall.gotoAndPlay("bonus");
    } else {
      _oBall.gotoAndPlay("idle");
    }
  };

  this.setBlockLaunch = function (bVal) {
    _bBlockLaunch = bVal;
  };

  this.getBlockLaunch = function () {
    return _bBlockLaunch;
  };

  this.unload = function () {
    _oParentContainer.removeChild(_oBallContainer);
  };

  this.setVisible = function (bVisible) {
    _oBallContainer.visible = bVisible;
  };

  this.setPosition = function (iXPos, iYPos) {
    _oBallContainer.x = iXPos;
    _oBallContainer.y = iYPos;
  };

  this.resetPos = function () {
    _oBallContainer.x = _oStartPos.x;
    _oBallContainer.y = _oStartPos.y;
    _vPos.set(_oBallContainer.x, _oBallContainer.y);
    _vCurForce.set(0, 0, 0);
    this.updateSpriteScale();
    this.resetBallAnimation();
  };

  this.isLaunched = function () {
    return _bLaunched;
  };

  this.setLaunched = function (bValue) {
    _bLaunched = bValue;
  };

  this.setBonus = function (bValue) {
    _bBonus = bValue;
  };

  this.isStopped = function () {
    return _bStopped;
  };

  this.stopBall = function () {
    _bLaunched = false;
    _bStopped = true;
    _vCurForce.set(0, 0, 0);
    this.resetBallAnimation();
  };

  this.fadeOut = function () {
    createjs.Tween.get(_oBallContainer).to(
      { alpha: 0 },
      250,
      createjs.Ease.sineOut
    );
  };

  this.resetPosition = function (iX, iY, iZ) {
    var oParent = this;

    createjs.Tween.get(_oBallContainer)
      .to({ alpha: 0 }, 250, createjs.Ease.sineOut)
      .call(function () {
        oParent.resetBallPosition(iX, iY, iZ);
        oParent.fadeIn();
      });
  };

  this.setStopped = function (bValue) {
    _bStopped = bValue;
  };

  this.resetBallPosition = function (iX, iY, iZ) {
    _vPos.set(iX, iY, iZ);
    _oBallContainer.x = _vPos.getX();
    _oBallContainer.y = iY;
    this.updateSpriteScale();
    createjs.Tween.removeTweens(this.getContainer());
    this.setStopped(false);
    this.resetBallAnimation();
  };

  this.fadeIn = function () {
    this.resetBallAnimation();
    _oBallContainer.scaleX = _oBallContainer.scaleY = 1;
    _oBallShadow.x = _oBallContainer.x;
    _oBallShadow.y = _oBallContainer.y;

    createjs.Tween.get(_oBallContainer)
      .to({ alpha: 1 }, 250, createjs.Ease.sineOut)
      .call(
        function () {
          this.setBlockLaunch(false);
        },
        null,
        this
      );

    createjs.Tween.get(_oBallShadow, { override: true }).to(
      { alpha: 1 },
      250,
      createjs.Ease.sineOut
    );
  };

  this.getRadiusForCollisionRingEdge = function () {
    return _iRadiusForCollisionRingEdge * _oBall.scaleX;
  };

  this.getContainer = function () {
    return _oBallContainer;
  };

  this.getX = function () {
    return _oBallContainer.x;
  };

  this.getY = function () {
    return _oBallContainer.y;
  };

  this.getZ = function () {
    return _vPos.getZ();
  };

  this.getRadiusWithTolerance = function () {
    return _iRadiusWithTolerance * _oBall.scaleX;
  };

  this.setUserData = function (oObject) {
    _oUserData = oObject;
  };

  this.getUserData = function () {
    return _oUserData;
  };

  this.vCurForce = function () {
    return _vCurForce;
  };

  this.vPos = function () {
    return _vPos;
  };

  this.setPos = function (vPos) {
    _vPos.setV(vPos);
  };

  this.setForce = function (vForceX, vForceY) {
    _vCurForce.set(vForceX, vForceY, _vCurForce.getZ());
  };

  this.vPrevPos = function () {
    return _vPrevPos;
  };

  this.getRadius = function () {
    return _iRadius * _oBall.scaleX;
  };

  this.getSquareRadius = function () {
    return _iSquareRadius * _oBall.scaleX;
  };

  this.updateSpritePosition = function () {
    _oBallContainer.x = _vPos.getX();
    _oBallContainer.y = _vPos.getY();
    this.updateSpriteMovement();

    if (_bBonus === true) {
      this.addBallParticle();
    }
  };

  this.updateSpriteMovement = function () {
    _oBall.framerate = _vCurForce.length() * 1.2;

    if (this.getZ() > 0) {
      this.updateSpriteScale();
    }
  };

  this.addBallParticle = function () {
    if (_oBallContainer.alpha < 1) {
      return;
    }
    var iRandomColorIndex = Math.floor(Math.random() * PARTICLE_COLOR.length);
    var iSize = BALL_SIZE / 4;

    var oBallParticle = new createjs.Shape();
    oBallParticle.graphics
      .beginFill(PARTICLE_COLOR[iRandomColorIndex])
      .drawCircle(0, 0, iSize);
    oBallParticle.regX = oBallParticle.regY = iSize / 2;
    oBallParticle.x = _oBallContainer.x;
    oBallParticle.y = _oBallContainer.y;
    oBallParticle.alpha = 0.2;
    _oParentContainer.addChildAt(
      oBallParticle,
      _oParentContainer.getChildIndex(_oBallContainer)
    );
    _aBallParticles.push(oBallParticle);

    createjs.Tween.get(oBallParticle)
      .to({ alpha: 0 }, 500, createjs.Ease.quadIn)
      .call(function () {
        createjs.Tween.removeTweens(_oParentContainer);
        _oParentContainer.removeChild(oBallParticle);
        oBallParticle = null;
      });
  };

  this.updateSpriteScale = function () {
    var iZ = this.getZ();

    if (iZ > BALL_SCALE_MAX_LIMIT) {
      iZ = BALL_SCALE_MAX_LIMIT;
    }

    // FIND THE DISTANCE PERCENTAGE TO CALCULATE HOW "DEEP" THE BALL IS TOWARDS THE BOARD, AND SCALE IT
    var iDistancePercentage = ((100 / BALL_SCALE_MAX_LIMIT) * iZ) / 100;
    var iScaleFactor = 1 - iDistancePercentage * BALL_SCALE_VARIABLE_MIN;
    _oBallContainer.scaleX = _oBallContainer.scaleY = iScaleFactor;
  };

  _oParentContainer = oParentContainer;

  this._init();

  return this;
}

function CBonus(iX, iY, oParentContainer, iIndex) {
  var _oParentContainer;
  var _oBonus;

  var _iX;
  var _iY;

  var _bTaken;

  this._init = function () {
    _iX = iX;
    _iY = iY;
    _bTaken = false;

    var oSprite = s_oSpriteLibrary.getSprite("bonus");
    _oBonus = createBitmap(oSprite, oSprite.width, oSprite.height);
    _oBonus.regX = oSprite.width / 2;
    _oBonus.regY = oSprite.height / 2;
    _oBonus.width = oSprite.width;
    _oBonus.height = oSprite.height;
    _oBonus.x = _iX;
    _oBonus.y = _iY;
    _oParentContainer.addChildAt(_oBonus, iIndex);

    // ADD A JUMPING MOVEMENT EFFECT
    createjs.Tween.get(_oBonus, { loop: true })
      .to({ y: _iY - 50 }, 1000, createjs.Ease.quadOut)
      .to({ y: _iY }, 1000, createjs.Ease.quadIn);
  };

  this.getX = function () {
    return _oBonus.x;
  };

  this.getY = function () {
    return _oBonus.y;
  };

  this.getWidth = function () {
    return _oBonus.width;
  };

  this.getHeight = function () {
    return _oBonus.height;
  };

  this.isBonusTaken = function () {
    return _bTaken;
  };

  this.onBonusTaken = function () {
    _bTaken = true;
    createjs.Tween.removeTweens(_oBonus);
    createjs.Tween.get(_oBonus)
      .to({ y: 0, alpha: 0 }, 1000, createjs.Ease.quadOut)
      .call(this.unload, null, this);
  };

  this.unload = function () {
    createjs.Tween.removeTweens(_oBonus);
    _oParentContainer.removeChild(_oBonus);
  };

  _oParentContainer = oParentContainer;

  this._init();

  return this;
}

function CBoard(oParentContainer) {
  var _oParentContainer;
  var _oBoardContainer;
  var _oBoardSprite;
  var _oLeftSide;
  var _oRightSide;

  var _oHoopLeftSide;
  var _oHoopRightSide;
  var _oHoopLeftSidePtA;
  var _oHoopLeftSidePtB;
  var _oHoopRightSidePtA;
  var _oHoopRightSidePtB;
  var _oHoopLeftSideEdge;
  var _oHoopRightSideEdge;
  var _oExcludeCollisionRectangle;
  var _oStartPosition;
  var _oBasketTop;
  var _oBasketBottom;

  var _iLeftSideX;
  var _iRightSideX;
  var _iSideY;

  var _iExcludeCollisionRectangleLimitLeft;
  var _iExcludeCollisionRectangleLimitRight;
  var _iExcludeCollisionRectangleLimitTop;
  var _iExcludeCollisionRectangleLimitBottom;

  var _aBoardRingEdges;
  var _aHoopSidesModels;

  // FOR TWEEN
  var _bUpdate;
  var _iCntTime;
  var _iMaxTime;
  var _iCurStartX;
  var _iCurStartY;
  var _iCurXIndex;
  var _iCurYIndex;
  var _iDestinationX;
  var _iDestinationY;
  var _iMovementsCounter;

  var _bHorizontalMovement;
  var _bVerticalMovement;
  var _bDebugMode = false; // <------ SET THIS TO TRUE TO SET COLLISION SHAPES AND EDGES VISIBLE

  this._init = function () {
    _bUpdate = false;
    _bHorizontalMovement = false;
    _bVerticalMovement = false;
    _aBoardRingEdges = [];
    _aHoopSidesModels = [];
    _iMovementsCounter = 0;

    _oBoardContainer = new createjs.Container();
    _oParentContainer.addChild(_oBoardContainer);

    _oStartPosition = { x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF - 200 };

    var oSprite = s_oSpriteLibrary.getSprite("board");
    _oBoardSprite = createBitmap(oSprite, oSprite.width, oSprite.height);
    _oBoardSprite.regX = oSprite.width / 2;
    _oBoardSprite.regY = oSprite.height / 2;
    _oBoardContainer.addChild(_oBoardSprite);
    _oBoardContainer.x = _oStartPosition.x;
    _oBoardContainer.y = _oStartPosition.y;

    if (_bDebugMode === true) {
      _oBoardSprite.alpha = 0.5;
    }

    this.initHoopSides();
    this.initBoardSides();
    this.initBasketLogic();
    this.createExcludeCollisionRectangle();

    _iCurXIndex = 0;
    _iCurYIndex = 0;
    _iCurStartX = _oBoardContainer.x;
    _iCurStartY = _oBoardContainer.y;
    _iCntTime = 0;
    _iMaxTime = BOARD_MOVEMENT_DURATION;
  };

  this.initHoopSides = function () {
    var iThickness = 5;

    _oHoopLeftSidePtA = { x: -80, y: 60 };
    _oHoopLeftSidePtB = { x: -65, y: 190 };
    _oHoopRightSidePtA = { x: 80, y: 60 };
    _oHoopRightSidePtB = { x: 65, y: 190 };

    // CREATE GRAPHIC RENDITION OF THE SIDES
    _oHoopLeftSide = new createjs.Shape();
    _oHoopLeftSide.graphics.setStrokeStyle(iThickness).beginStroke("red");
    _oHoopLeftSide.graphics.moveTo(_oHoopLeftSidePtA.x, _oHoopLeftSidePtA.y);
    _oHoopLeftSide.graphics.lineTo(_oHoopLeftSidePtB.x, _oHoopLeftSidePtB.y);
    _oHoopLeftSide.graphics.endStroke();

    _oHoopRightSide = new createjs.Shape();
    _oHoopRightSide.graphics.setStrokeStyle(iThickness).beginStroke("red");
    _oHoopRightSide.graphics.moveTo(_oHoopRightSidePtA.x, _oHoopRightSidePtA.y);
    _oHoopRightSide.graphics.lineTo(_oHoopRightSidePtB.x, _oHoopRightSidePtB.y);
    _oHoopRightSide.graphics.endStroke();

    _oHoopLeftSide.visible = _oHoopRightSide.visible = _bDebugMode;
    _oBoardContainer.addChild(_oHoopLeftSide, _oHoopRightSide);

    this.initHoopSidesEdges();
  };

  this.initHoopSidesEdges = function () {
    var iThickness = 10;

    _oHoopLeftSideEdge = new CEdge(
      this.getHoopLeftSidePtB().x,
      this.getHoopLeftSidePtB().y,
      this.getHoopLeftSidePtA().x,
      this.getHoopLeftSidePtA().y,
      iThickness,
      false
    );

    _oHoopRightSideEdge = new CEdge(
      this.getHoopRightSidePtA().x,
      this.getHoopRightSidePtA().y,
      this.getHoopRightSidePtB().x,
      this.getHoopRightSidePtB().y,
      iThickness,
      false
    );

    _aHoopSidesModels[EDGE_LEFT] = _oHoopLeftSideEdge.getModel();
    _aHoopSidesModels[EDGE_RIGHT] = _oHoopRightSideEdge.getModel();
  };

  this.getHoopLeftSidePtA = function () {
    var oPoint = {
      x: _oBoardContainer.x + _oHoopLeftSidePtA.x,
      y: _oBoardContainer.y + _oHoopLeftSidePtA.y,
    };
    return oPoint;
  };

  this.getHoopLeftSidePtB = function () {
    var oPoint = {
      x: _oBoardContainer.x + _oHoopLeftSidePtB.x,
      y: _oBoardContainer.y + _oHoopLeftSidePtB.y,
    };
    return oPoint;
  };

  this.getHoopRightSidePtA = function () {
    var oPoint = {
      x: _oBoardContainer.x + _oHoopRightSidePtA.x,
      y: _oBoardContainer.y + _oHoopRightSidePtA.y,
    };
    return oPoint;
  };

  this.getHoopRightSidePtB = function () {
    var oPoint = {
      x: _oBoardContainer.x + _oHoopRightSidePtB.x,
      y: _oBoardContainer.y + _oHoopRightSidePtB.y,
    };
    return oPoint;
  };

  this.getHoopSideEdges = function () {
    return _aHoopSidesModels;
  };

  this.initBasketLogic = function () {
    var iHeight = 10;
    var iTopP1X = _oBoardContainer.x - 60;
    var iTopP2X = _oBoardContainer.x + 60;
    var iTopY = _oBoardContainer.y + 50;
    var iBottomP1X = _oBoardContainer.x - 40;
    var iBottomP2X = _oBoardContainer.x + 40;
    var iBottomY = _oBoardContainer.y + 180;

    _oBasketTop = new CEdge(
      iTopP1X,
      iTopY,
      iTopP2X,
      iTopY,
      iHeight,
      _bDebugMode
    );
    _oBasketBottom = new CEdge(
      iBottomP1X,
      iBottomY,
      iBottomP2X,
      iBottomY,
      iHeight,
      _bDebugMode
    );
  };

  this.initBoardSides = function () {
    _iLeftSideX = -82;
    _iRightSideX = _iLeftSideX * -1;
    _iSideY = 52;

    _oLeftSide = new createjs.Shape();
    _oLeftSide.graphics.beginFill("blue");
    _oLeftSide.graphics.drawCircle(_iLeftSideX, _iSideY, BOARD_SIDES_SIZE);
    _oLeftSide.graphics.endStroke();
    _oBoardContainer.addChild(_oLeftSide);
    _aBoardRingEdges[EDGE_LEFT] = _oLeftSide;

    _oRightSide = new createjs.Shape();
    _oRightSide.graphics.beginFill("blue");
    _oRightSide.graphics.drawCircle(_iRightSideX, _iSideY, BOARD_SIDES_SIZE);
    _oRightSide.graphics.endStroke();
    _oBoardContainer.addChild(_oRightSide);
    _aBoardRingEdges[EDGE_RIGHT] = _oRightSide;

    _oLeftSide.visible = _oRightSide.visible = _bDebugMode;
  };

  this.createExcludeCollisionRectangle = function () {
    var iWidth = 400;
    var iHeight = 300;

    _oExcludeCollisionRectangle = new createjs.Shape();
    _oExcludeCollisionRectangle.graphics.beginFill("white");
    _oExcludeCollisionRectangle.graphics.drawRect(0, 0, iWidth, iHeight);
    _oExcludeCollisionRectangle.graphics.endFill();
    _oExcludeCollisionRectangle.alpha = 0.1;
    _oExcludeCollisionRectangle.x = (-1 * iWidth) / 2;
    _oExcludeCollisionRectangle.y = (-1 * iHeight) / 2 + 50;
    _oExcludeCollisionRectangle.width = iWidth;
    _oExcludeCollisionRectangle.height = iHeight;
    _oExcludeCollisionRectangle.visible = _bDebugMode;
    _oBoardContainer.addChild(_oExcludeCollisionRectangle);

    this.setExcludeCollisionRectangleLimits();
  };

  this.setExcludeCollisionRectangleLimits = function () {
    _iExcludeCollisionRectangleLimitLeft =
      _oBoardContainer.x + _oExcludeCollisionRectangle.x;
    _iExcludeCollisionRectangleLimitRight =
      _oBoardContainer.x +
      _oExcludeCollisionRectangle.x +
      _oExcludeCollisionRectangle.width;
    _iExcludeCollisionRectangleLimitTop =
      _oBoardContainer.y + _oExcludeCollisionRectangle.y;
    _iExcludeCollisionRectangleLimitBottom =
      _oBoardContainer.y +
      _oExcludeCollisionRectangle.y +
      _oExcludeCollisionRectangle.height;
  };

  this.destroyCollisions = function () {
    for (var i = 0; i < _aBoardRingEdges.length; i++) {
      _oBoardContainer.removeChild(_aBoardRingEdges[i]);
    }
    _aBoardRingEdges = [];

    for (var i = 0; i < _aHoopSidesModels.length; i++) {
      _aHoopSidesModels[i].destroy();
    }
    _aHoopSidesModels = [];

    _oBasketTop.destroy();
    _oBasketBottom.destroy();
    _oBoardContainer.removeChild(_oExcludeCollisionRectangle);
    _oExcludeCollisionRectangle = null;
  };

  this.getLimitLeft = function () {
    return _iExcludeCollisionRectangleLimitLeft;
  };

  this.getLimitRight = function () {
    return _iExcludeCollisionRectangleLimitRight;
  };

  this.getLimitTop = function () {
    return _iExcludeCollisionRectangleLimitTop;
  };

  this.getLimitBottom = function () {
    return _iExcludeCollisionRectangleLimitBottom;
  };

  this.getBoardRingEdges = function () {
    return _aBoardRingEdges;
  };

  this.getBoardSideLeftPosition = function () {
    var oPoint = {
      x: _oBoardContainer.x + _iLeftSideX,
      y: _oBoardContainer.y + _iSideY,
    };
    return oPoint;
  };

  this.getBoardSideRightPosition = function () {
    var oPoint = {
      x: _oBoardContainer.x + _iRightSideX,
      y: _oBoardContainer.y + _iSideY,
    };
    return oPoint;
  };

  this.getStartPosition = function () {
    return _oStartPosition;
  };

  this.getX = function () {
    return _oBoardContainer.x;
  };

  this.getY = function () {
    return _oBoardContainer.y;
  };

  this.setUpdate = function (bValue) {
    _bUpdate = bValue;
  };

  this.getBasketTop = function () {
    return _oBasketTop.getModel();
  };

  this.getBasketBottom = function () {
    return _oBasketBottom.getModel();
  };

  this.isUpdate = function () {
    return _bUpdate;
  };

  this.getBoardContainer = function () {
    return _oBoardContainer;
  };

  this.resetBoardPhysicSimulation = function () {
    this.destroyCollisions();
    this.initBoardSides();
    this.initBasketLogic();
    this.createExcludeCollisionRectangle();
    this.initHoopSidesEdges();
  };

  this.setBoardHorizontalMovement = function (bValue) {
    _bHorizontalMovement = bValue;
  };

  this.setBoardVerticalMovement = function (bValue) {
    _bVerticalMovement = bValue;
  };

  this.resetBoardMovement = function () {
    var iDestX = BOARD_MOVEMENT_HORIZONTAL;
    var iDestY = BOARD_MOVEMENT_VERTICAL;
    _iCurStartX = _oBoardContainer.x;
    _iCurStartY = _oBoardContainer.y;
    _iDestinationX = _oStartPosition.x;
    _iDestinationY = _oStartPosition.y;

    switch (_iMovementsCounter) {
      case 0:
        {
          _iDestinationX = _oStartPosition.x + iDestX;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y + iDestY;
          }
        }
        break;
      case 1:
        {
          _iDestinationX = _oStartPosition.x;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y;
          }
        }
        break;
      case 2:
        {
          _iDestinationX = _oStartPosition.x - iDestX;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y - iDestY;
          }
        }
        break;
      case 3:
        {
          _iDestinationX = _oStartPosition.x;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y;
          }
        }
        break;
      case 4:
        {
          _iDestinationX = _oStartPosition.x + iDestX;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y - iDestY;
          }
        }
        break;
      case 5:
        {
          _iDestinationX = _oStartPosition.x;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y;
          }
        }
        break;
      case 6:
        {
          _iDestinationX = _oStartPosition.x - iDestX;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y + iDestY;
          }
        }
        break;
      case 7:
        {
          _iDestinationX = _oStartPosition.x;
          if (_bVerticalMovement === true) {
            _iDestinationY = _oStartPosition.y;
          }
        }
        break;
      default:
        _iMovementsCounter = 0;
        break;
    }

    _iCntTime = 0;
    _bUpdate = true;
  };

  // UPDATE THE Y POSITION IN A "TWEEN" WAY
  this.update = function () {
    if (!_bUpdate) {
      return;
    }

    _iCntTime += s_iTimeElaps;

    if (_iCntTime >= _iMaxTime) {
      _bUpdate = false;
      _iMovementsCounter++;

      if (_iMovementsCounter > 7) {
        _iMovementsCounter = 0;
      }

      this.resetBoardMovement();
    } else {
      var fLerpX = s_oTweenController.easeLinear(_iCntTime, 0, 1, _iMaxTime);
      var fLerpY = s_oTweenController.easeLinear(_iCntTime, 0, 1, _iMaxTime);
      var iValueX = s_oTweenController.tweenValue(
        _iCurStartX,
        _iDestinationX,
        fLerpX
      );
      var iValueY = s_oTweenController.tweenValue(
        _iCurStartY,
        _iDestinationY,
        fLerpY
      );
      _oBoardContainer.x = iValueX;
      _oBoardContainer.y = iValueY;

      this.resetBoardPhysicSimulation();
    }
  };

  _oParentContainer = oParentContainer;

  this._init();

  return this;
}

function CToggle(iXPos, iYPos, oSprite, bActive, oParentContainer) {
  var _bActive;
  var _aCbCompleted;
  var _aCbOwner;
  var _oButton;
  var _oParentContainer;
  var _oMouseDown;
  var _oMouseUp;

  this._init = function (iXPos, iYPos, oSprite, bActive, oParentContainer) {
    if (oParentContainer !== undefined) {
      _oParentContainer = oParentContainer;
    } else {
      _oParentContainer = s_oStage;
    }

    _aCbCompleted = new Array();
    _aCbOwner = new Array();

    var oData = {
      images: [oSprite],
      // width, height & registration point of each sprite
      frames: {
        width: oSprite.width / 2,
        height: oSprite.height,
        regX: oSprite.width / 2 / 2,
        regY: oSprite.height / 2,
      },
      animations: { state_true: [0], state_false: [1] },
    };

    var oSpriteSheet = new createjs.SpriteSheet(oData);

    _bActive = bActive;

    _oButton = createSprite(
      oSpriteSheet,
      "state_" + _bActive,
      oSprite.width / 2 / 2,
      oSprite.height / 2,
      oSprite.width / 2,
      oSprite.height
    );

    _oButton.x = iXPos;
    _oButton.y = iYPos;
    _oButton.stop();

    if (!s_bMobile) _oButton.cursor = "pointer";

    _oParentContainer.addChild(_oButton);

    this._initListener();
  };

  this.unload = function () {
    _oButton.off("mousedown", _oMouseDown);
    _oButton.off("pressup", _oMouseUp);

    _oParentContainer.removeChild(_oButton);
  };

  this._initListener = function () {
    _oMouseDown = _oButton.on("mousedown", this.buttonDown);
    _oMouseUp = _oButton.on("pressup", this.buttonRelease);
  };

  this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
    _aCbCompleted[iEvent] = cbCompleted;
    _aCbOwner[iEvent] = cbOwner;
  };

  this.setCursorType = function (szValue) {
    _oButton.cursor = szValue;
  };

  this.setActive = function (bActive) {
    _bActive = bActive;
    _oButton.gotoAndStop("state_" + _bActive);
  };

  this.buttonRelease = function () {
    _oButton.scaleX = 1;
    _oButton.scaleY = 1;

    playSound("click", 1, false);

    _bActive = !_bActive;
    _oButton.gotoAndStop("state_" + _bActive);

    if (_aCbCompleted[ON_MOUSE_UP]) {
      _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _bActive);
    }
  };

  this.buttonDown = function () {
    _oButton.scaleX = 0.9;
    _oButton.scaleY = 0.9;

    if (_aCbCompleted[ON_MOUSE_DOWN]) {
      _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
    }
  };

  this.setPosition = function (iX, iY) {
    _oButton.x = iX;
    _oButton.y = iY;
  };

  this._init(iXPos, iYPos, oSprite, bActive, oParentContainer);
}

function CGfxButton(iXPos, iYPos, oSprite, oParentContainer) {
  var _bDisable;
  var _aCbCompleted;
  var _aCbOwner;
  var _oButton;
  var _aParams;
  var _fScaleX;
  var _fScaleY;
  var _oParent;
  var _oTween;
  var _oMouseDown;
  var _oMouseUp;

  var _oParentContainer;

  this._init = function (iXPos, iYPos, oSprite) {
    _bDisable = false;
    _aCbCompleted = new Array();
    _aCbOwner = new Array();
    _aParams = new Array();

    _oButton = createBitmap(oSprite);
    _oButton.x = iXPos;
    _oButton.y = iYPos;

    _fScaleX = 1;
    _fScaleY = 1;

    _oButton.regX = oSprite.width / 2;
    _oButton.regY = oSprite.height / 2;

    if (!s_bMobile) _oButton.cursor = "pointer";

    _oParentContainer.addChild(_oButton);

    this._initListener();
  };

  this.getSprite = function () {
    return _oButton;
  };

  this.unload = function () {
    _oButton.off("mousedown", _oMouseDown);
    _oButton.off("pressup", _oMouseUp);
    this.removeAllTweens();
    _oParentContainer.removeChild(_oButton);
  };

  this.setVisible = function (bVisible) {
    _oButton.visible = bVisible;
  };

  this.setCursorType = function (szValue) {
    _oButton.cursor = szValue;
  };

  this._initListener = function () {
    _oMouseDown = _oButton.on("mousedown", this.buttonDown);
    _oMouseUp = _oButton.on("pressup", this.buttonRelease);
  };

  this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
    _aCbCompleted[iEvent] = cbCompleted;
    _aCbOwner[iEvent] = cbOwner;
  };

  this.addEventListenerWithParams = function (
    iEvent,
    cbCompleted,
    cbOwner,
    aParams
  ) {
    _aCbCompleted[iEvent] = cbCompleted;
    _aCbOwner[iEvent] = cbOwner;
    _aParams[iEvent] = aParams;
  };

  this.enable = function () {
    _bDisable = false;
  };

  this.disable = function () {
    _bDisable = true;
  };

  this.buttonRelease = function () {
    if (_bDisable) {
      return;
    }

    if (_fScaleX > 0) {
      _oButton.scaleX = 1;
    } else {
      _oButton.scaleX = -1;
    }
    _oButton.scaleY = 1;

    playSound("click", 1, false);

    if (_aCbCompleted[ON_MOUSE_UP]) {
      _aCbCompleted[ON_MOUSE_UP].call(
        _aCbOwner[ON_MOUSE_UP],
        _aParams[ON_MOUSE_UP]
      );
    }
  };

  this.buttonDown = function () {
    if (_bDisable) {
      return;
    }

    if (_fScaleX > 0) {
      _oButton.scaleX = 0.9;
    } else {
      _oButton.scaleX = -0.9;
    }
    _oButton.scaleY = 0.9;

    if (_aCbCompleted[ON_MOUSE_DOWN]) {
      _aCbCompleted[ON_MOUSE_DOWN].call(
        _aCbOwner[ON_MOUSE_DOWN],
        _aParams[ON_MOUSE_DOWN]
      );
    }
  };

  this.rotation = function (iRotation) {
    _oButton.rotation = iRotation;
  };

  this.getButton = function () {
    return _oButton;
  };

  this.setPosition = function (iXPos, iYPos) {
    _oButton.x = iXPos;
    _oButton.y = iYPos;
  };

  this.setX = function (iXPos) {
    _oButton.x = iXPos;
  };

  this.setY = function (iYPos) {
    _oButton.y = iYPos;
  };

  this.getButtonImage = function () {
    return _oButton;
  };

  this.setScaleX = function (fValue) {
    _oButton.scaleX = fValue;
    _fScaleX = fValue;
  };

  this.getX = function () {
    return _oButton.x;
  };

  this.getY = function () {
    return _oButton.y;
  };

  this.pulseAnimation = function () {
    _oTween = createjs.Tween.get(_oButton, { loop: true, bounce: true }).to(
      { scaleX: _fScaleX * 0.9, scaleY: _fScaleY * 0.9 },
      850,
      createjs.Ease.quadOut
    );
  };

  this.trebleAnimation = function () {
    _oTween = createjs.Tween.get(_oButton, { loop: true })
      .to({ rotation: 5 }, 75, createjs.Ease.quadOut)
      .to({ rotation: -5 }, 140, createjs.Ease.quadIn)
      .to({ rotation: 0 }, 75, createjs.Ease.quadIn)
      .wait(750);
  };

  this.removeAllTweens = function () {
    createjs.Tween.removeTweens(_oButton);
  };

  if (oParentContainer !== undefined) {
    _oParentContainer = oParentContainer;
  } else {
    _oParentContainer = s_oStage;
  }

  this._init(iXPos, iYPos, oSprite);

  _oParent = this;

  return this;
}

function CTextButton(
  iXPos,
  iYPos,
  oSprite,
  szText,
  szFont,
  szColor,
  iFontSize,
  oContainer
) {
  var _aParams;
  var _aCbCompleted;
  var _aCbOwner;
  var _oButton;
  var _oText;
  var _oContainer;
  var _oMouseDown;
  var _oMouseUp;

  this._init = function (
    iXPos,
    iYPos,
    oSprite,
    szText,
    szFont,
    szColor,
    iFontSize
  ) {
    _aParams = new Array();
    _aCbCompleted = new Array();
    _aCbOwner = new Array();

    var oButtonBg = createBitmap(oSprite);

    var iX = oSprite.width / 2;
    var iY = Math.floor(oSprite.height / 2);
    var iWidth = 500;
    var iHeight = 100;

    _oButton = new createjs.Container();
    _oButton.x = iXPos;
    _oButton.y = iYPos;
    _oButton.regX = oSprite.width / 2;
    _oButton.regY = oSprite.height / 2;
    _oButton.addChild(oButtonBg);

    _oContainer.addChild(_oButton);

    _oText = new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      50,
      "center",
      szColor,
      szFont,
      1,
      2,
      2,
      szText,
      true,
      true,
      true,
      false
    );

    if (!s_bMobile) _oButton.cursor = "pointer";

    this._initListener();
  };

  this.unload = function () {
    _oButton.off("mousedown", _oMouseDown);
    _oButton.off("pressup", _oMouseUp);

    _oContainer.removeChild(_oButton);
  };

  this.setVisible = function (bVisible) {
    _oButton.visible = bVisible;
  };

  this._initListener = function () {
    _oMouseDown = _oButton.on("mousedown", this.buttonDown);
    _oMouseUp = _oButton.on("pressup", this.buttonRelease);
  };

  this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
    _aCbCompleted[iEvent] = cbCompleted;
    _aCbOwner[iEvent] = cbOwner;
  };

  this.buttonRelease = function () {
    _oButton.scaleX = 1;
    _oButton.scaleY = 1;

    playSound("click", 1, false);

    if (_aCbCompleted[ON_MOUSE_UP]) {
      _aCbCompleted[ON_MOUSE_UP].call(
        _aCbOwner[ON_MOUSE_UP],
        _aParams[ON_MOUSE_UP]
      );
    }
  };

  this.buttonDown = function () {
    _oButton.scaleX = 0.9;
    _oButton.scaleY = 0.9;

    if (_aCbCompleted[ON_MOUSE_DOWN]) {
      _aCbCompleted[ON_MOUSE_DOWN].call(
        _aCbOwner[ON_MOUSE_DOWN],
        _aParams[ON_MOUSE_DOWN]
      );
    }
  };

  this.addEventListenerWithParams = function (
    iEvent,
    cbCompleted,
    cbOwner,
    aParams
  ) {
    _aCbCompleted[iEvent] = cbCompleted;
    _aCbOwner[iEvent] = cbOwner;
    _aParams[iEvent] = aParams;
  };

  this.setTextPosition = function (iY) {
    _oText.y = iY;
  };

  this.setPosition = function (iXPos, iYPos) {
    _oButton.x = iXPos;
    _oButton.y = iYPos;
  };

  this.setX = function (iXPos) {
    _oButton.x = iXPos;
  };

  this.setY = function (iYPos) {
    _oButton.y = iYPos;
  };

  this.getButtonImage = function () {
    return _oButton;
  };

  this.getX = function () {
    return _oButton.x;
  };

  this.getY = function () {
    return _oButton.y;
  };

  _oContainer = oContainer;

  this._init(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize);

  return this;
}

function CInterface(oParentContainer) {
  var _oContainer;
  var _oAudioToggle;
  var _iBottomLinePos;
  var gameOver;
  var _pStartPosAudio;
  var _pStartPosExit;
  var _pStartPosFullscreen;

  var _oButFullscreen;
  var _fRequestFullScreen = null;
  var _fCancelFullScreen = null;
  var _oButExit;
  var _oYourBestScoreText;
  var _oScoreText;
  var _oAreYouSurePanel;
  var _oParentContainer;
  var _oPlayerLivesContainer;

  var _aPlayerLives;
  this._init = function () {
    _oParentContainer = oParentContainer;
    _oContainer = new createjs.Container();
    _oParentContainer.addChild(_oContainer);
    _aPlayerLives = [];
    _oPlayerLivesContainer = new createjs.Container();
    _oParentContainer.addChild(_oPlayerLivesContainer);
    this.getHighestScore();
    var oSpriteExit = s_oSpriteLibrary.getSprite("but_exit");
    _pStartPosExit = {
      x: CANVAS_WIDTH - oSpriteExit.width / 2 - 20,
      y: oSpriteExit.height / 2 + 30,
    };
    _oButExit = new CGfxButton(
      _pStartPosExit.x,
      _pStartPosExit.y,
      oSpriteExit,
      _oContainer
    );
    _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      var oSprite = s_oSpriteLibrary.getSprite("audio_icon");
      _pStartPosAudio = {
        x: oSpriteExit.width / 2 + 20,
        y: _pStartPosExit.y,
      };
      _oAudioToggle = new CToggle(
        _pStartPosAudio.x,
        _pStartPosAudio.y,
        oSprite,
        s_bAudioActive,
        _oContainer
      );
      _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
      _pStartPosFullscreen = {
        x: 20 + oSprite.width / 4,
        y: oSprite.height / 2 + 10,
      };
    } else {
      _pStartPosFullscreen = {
        x: _pStartPosExit.x - oSpriteExit.width - 10,
        y: _pStartPosExit.y,
      };
    }

    var doc = window.document;
    var docEl = doc.documentElement;
    _fRequestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    _fCancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (ENABLE_FULLSCREEN === false) {
      _fRequestFullScreen = false;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      // oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
      // _oButFullscreen = new CToggle(
      //   _pStartPosFullscreen.x,
      //   _pStartPosFullscreen.y,
      //   oSprite,
      //   s_bFullscreen,
      //   _oContainer
      // );
      // _oButFullscreen.addEventListener(
      //   ON_MOUSE_UP,
      //   this._onFullscreenRelease,
      //   this
      // );
    }

    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };

  this.initInterfacesText = function () {
    _iBottomLinePos = CANVAS_HEIGHT - 250;

    var iX = 175;
    var iY = _iBottomLinePos;
    var iWidth = 240;
    var iHeight = 100;

    _oScoreText = new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      30,
      "left",
      WHITE_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_SCORE + 0,
      true,
      true,
      true,
      false
    );

    iX = CANVAS_WIDTH - 175;
    _oYourBestScoreText = new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth * 2,
      iHeight,
      40,
      "center",
      WHITE_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_BEST + getItem("Zoomin_basketball_top_score"),
      true,
      true,
      true,
      false
    );

    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };

  this.refreshButtonPos = function (iNewX, iNewY) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.setPosition(
        _pStartPosAudio.x - iNewX,
        _pStartPosAudio.y + iNewY
      );
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      // _oButFullscreen.setPosition(
      //   _pStartPosFullscreen.x + iNewX,
      //   _pStartPosFullscreen.y + iNewY
      // );
    }

    _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);

    // REFRESH BOTTOM TEXTS POSITION
    _iBottomLinePos = 200;
    _iBottomLinePos_score = CANVAS_HEIGHT - iNewY - 50;
    if (_oScoreText !== undefined) {
      _oScoreText.setY(_iBottomLinePos_score);
    }

    if (_oYourBestScoreText !== undefined) {
      _oYourBestScoreText.setY(_iBottomLinePos);
      _oYourBestScoreText.setX(CANVAS_WIDTH / 2);
    }

    var oSpriteStar = s_oSpriteLibrary.getSprite("but_star");
    _oStar = createBitmap(oSpriteStar, oSpriteStar.width, oSpriteStar.height);

    var bounds = _oContainer.getBounds();
    _oStar.x = CANVAS_WIDTH - oSpriteStar.width / 2 - 10;
    _oStar.y = 100;
    _oStar.regX = bounds.width / 2;
    _oStar.regY = bounds.height / 2;
    _oContainer.addChild(_oStar);

    if (_oPlayerLivesContainer !== undefined) {
      _oPlayerLivesContainer.y = _iBottomLinePos_score - 10;
    }
  };
  this.gameOverFun = function (val) {
    this.gameOver = val;
  };

  this.setHighestScore = function (value) {
    if (this.gameOver == false) {
      _oYourBestScoreText.refreshText(
        TEXT_BEST + getItem("Zoomin_basketball_top_score")
      );
      this.getHighestScore();
    }
  };
  this.getHighestScore();
  this.refreshScoreText = function (iValue) {
    saveItem("zoominbasketball_current_score", iValue);
    _oScoreText.refreshText(TEXT_SCORE + iValue);
    _oScoreText.setY(_iBottomLinePos_score);
    save_score_ajax();
  };

  this.refreshBestScoreText = function () {
    _oYourBestScoreText.refreshText(
      TEXT_BEST + getItem("Zoomin_basketball_top_score")
    );
    _oYourBestScoreText.setY(_iBottomLinePos);
  };

  this.unload = function () {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.unload();
      _oAudioToggle = null;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      //_oButFullscreen.unload();
    }

    _oButExit.unload();
    s_oInterface = null;
    s_oGame._bDisableEvents = false;
  };

  this._onExit = function () {
    _oAreYouSurePanel = new CAreYouSurePanel(_oContainer);
    s_oGame._bDisableEvents = true;
  };

  this.updatePlayerLives = function () {
    var iValue = s_oGame.getLives();
    var ball_count = s_oGame.getShowBall();
    var iValues = s_oGame.getStrightSec();
    for (var i = 0; i < iValue; i++) {
      var oSprite = s_oSpriteLibrary.getSprite("player_life");
      var oPlayerLife = createBitmap(oSprite, oSprite.width, oSprite.height);
      oPlayerLife.x = PLAYER_LIFE_SIZE * 1.1 * i;
      if (i < ball_count) {
        _oPlayerLivesContainer.addChild(oPlayerLife);
      }
      _aPlayerLives.push(oPlayerLife);
    }

    if (iValue === 0) {
      return;
    }

    this.resizePlayerLivesContainer();
  };

  this.resizePlayerLivesContainer = function () {
    var bounds = _oPlayerLivesContainer.getBounds();
    _oPlayerLivesContainer.x = CANVAS_WIDTH_HALF;
    _oPlayerLivesContainer.y = _iBottomLinePos_score - 10;
    _oPlayerLivesContainer.regX = bounds.width / 2;
    _oPlayerLivesContainer.regY = bounds.height / 2;
  };

  this.removeLife = function () {
    if (_aPlayerLives.length === 0) {
      return;
    }

    var iValue = s_oGame.getLives();
    var iValues = s_oGame.getStrightSec();
    createjs.Tween.get(_aPlayerLives[iValue])
      .to({ alpha: 0 }, 500, createjs.Ease.cubicOut)
      .call(function () {
        // RESET THE PLAYER LIVES CONTAINER
        _oPlayerLivesContainer.removeAllChildren();
        _aPlayerLives = [];
        s_oInterface.updatePlayerLives();
      });
  };

  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
    if (_Game_state > 0) {
      stopSound("soundtrack");
    }
  };

  this._onFullscreenRelease = function () {
    if (s_bFullscreen) {
      _fCancelFullScreen.call(window.document);
    } else {
      _fRequestFullScreen.call(window.document.documentElement);
    }

    sizeHandler();
  };

  this.resetFullscreenBut = function () {
    if (_fRequestFullScreen && screenfull.isEnabled) {
      //_oButFullscreen.setActive(s_bFullscreen);
    }
  };

  s_oInterface = this;

  this._init();

  return this;
}

var s_oInterface = null;

function CCreditsPanel() {
  var _oBg;
  var _oButLogo;
  var _oButExit;
  var _oFade;
  var _oHitArea;
  var _oCreditsContainer;
  var _oContainer;
  var _oListener;

  var _pStartPosExit;
  var _pStartPosYContainer;

  this._init = function () {
    var oSpriteMsgBox = s_oSpriteLibrary.getSprite("msg_box");

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oFade.alpha = 0;
    s_oStage.addChild(_oFade);

    _oCreditsContainer = new createjs.Container();
    s_oStage.addChild(_oCreditsContainer);

    createjs.Tween.get(_oFade).to({ alpha: 0.7 }, 500);

    _pStartPosYContainer = CANVAS_HEIGHT + oSpriteMsgBox.height / 2;

    _oContainer = new createjs.Container();
    _oContainer.y = _pStartPosYContainer;
    _oCreditsContainer.addChild(_oContainer);

    _oBg = createBitmap(oSpriteMsgBox);
    _oBg.regX = oSpriteMsgBox.width / 2;
    _oBg.regY = oSpriteMsgBox.height / 2;
    _oBg.x = CANVAS_WIDTH_HALF;
    _oBg.y = CANVAS_HEIGHT_HALF;
    _oContainer.addChild(_oBg);

    _oHitArea = new createjs.Shape();
    _oHitArea.graphics
      .beginFill("#0f0f0f")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oHitArea.alpha = 0.01;
    // _oListener = _oHitArea.on("click", this._onLogoButRelease);
    _oContainer.addChild(_oHitArea);

    if (!s_bMobile) {
      _oHitArea.cursor = "pointer";
    }

    var oSprite = s_oSpriteLibrary.getSprite("but_exit");
    _pStartPosExit = { x: 605, y: 572 };
    _oButExit = new CGfxButton(
      _pStartPosExit.x,
      _pStartPosExit.y,
      oSprite,
      _oContainer
    );

    _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF - 90;
    var iWidth = 450;
    var iHeight = 100;

    new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      36,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_CREDITS_DEVELOPED,
      true,
      true,
      true,
      false
    );

    oSprite = s_oSpriteLibrary.getSprite("logo_ctl");
    _oButLogo = createBitmap(oSprite);
    _oButLogo.regX = oSprite.width / 2;
    _oButLogo.regY = oSprite.height / 2;
    _oButLogo.x = CANVAS_WIDTH_HALF;
    _oButLogo.y = CANVAS_HEIGHT_HALF;
    _oContainer.addChild(_oButLogo);

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF + 90;
    var iWidth = 450;
    var iHeight = 100;

    new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      36,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      "www.creatoactive.com",
      true,
      true,
      true,
      false
    );

    createjs.Tween.get(_oContainer).to({ y: 0 }, 1000, createjs.Ease.backOut);
  };

  this.unload = function () {
    createjs.Tween.get(_oFade).to({ alpha: 0 }, 500);

    createjs.Tween.get(_oCreditsContainer)
      .to({ y: _pStartPosYContainer }, 400, createjs.Ease.backIn)
      .call(function () {
        _oHitArea.off("click", _oListener);
        _oButExit.unload();
        _oButExit = null;

        s_oStage.removeChild(_oCreditsContainer);
        s_oMenu.exitFromCredits();
      });
  };

  this._init();
}

function CAreYouSurePanel() {
  var _oContainer;
  var _oButYes;
  var _oButNo;
  var _oFade;
  var _oPanelContainer;
  var _oParent;
  var _oListener;

  var _pStartPanelPos;

  this._init = function () {
    _oContainer = new createjs.Container();
    s_oStage.addChild(_oContainer);

    _oPanelContainer = new createjs.Container();
    s_oStage.addChild(_oPanelContainer);

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oFade.alpha = 0;
    _oListener = _oFade.on("mousedown", function () {});
    _oContainer.addChild(_oFade);

    createjs.Tween.get(_oFade).to({ alpha: 0.7 }, 500);

    var oSprite = s_oSpriteLibrary.getSprite("msg_box");
    var oPanel = createBitmap(oSprite);
    oPanel.regX = oSprite.width / 2;
    oPanel.regY = oSprite.height / 2;
    oPanel.x = CANVAS_WIDTH_HALF;
    oPanel.y = CANVAS_HEIGHT_HALF;
    _oPanelContainer.addChild(oPanel);

    _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height / 2;
    _pStartPanelPos = { x: _oPanelContainer.x, y: _oPanelContainer.y };
    createjs.Tween.get(_oPanelContainer).to(
      { y: 0 },
      1000,
      createjs.Ease.backOut
    );

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF - 90;
    var iWidth = oSprite.width - 100;
    var iHeight = 200;

    new CTLText(
      _oPanelContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      36,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_ARE_SURE,
      true,
      true,
      true,
      false
    );

    _oButYes = new CGfxButton(
      CANVAS_WIDTH_HALF + 190,
      780,
      s_oSpriteLibrary.getSprite("but_yes"),
      _oPanelContainer
    );
    _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

    _oButNo = new CGfxButton(
      CANVAS_WIDTH_HALF - 190,
      780,
      s_oSpriteLibrary.getSprite("but_no"),
      _oPanelContainer
    );
    _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
  };

  this._onButYes = function () {
    _oButNo.disable();
    _oButYes.disable();

    createjs.Tween.get(_oFade).to({ alpha: 0 }, 500);
    createjs.Tween.get(_oPanelContainer)
      .to({ y: _pStartPanelPos.y }, 400, createjs.Ease.backIn)
      .call(function () {
        _oParent.unload();
        s_oGame.onExit();
      });
  };

  this._onButNo = function () {
    _oButNo.disable();
    _oButYes.disable();

    createjs.Tween.get(_oFade).to({ alpha: 0 }, 500);
    createjs.Tween.get(_oPanelContainer)
      .to({ y: _pStartPanelPos.y }, 400, createjs.Ease.backIn)
      .call(function () {
        _oParent.unload();
      });
  };

  this.unload = function () {
    _oButNo.unload();
    _oButYes.unload();
    s_oGame._bDisableEvents = false;

    _oContainer.removeChild(_oFade);
    s_oStage.removeChild(_oPanelContainer);
    _oFade.off("mousedown", _oListener);
  };

  _oParent = this;
  this._init();
}

function CHelpPanel() {
  var _oContainer;
  var _oPanelContainer;
  var _oFade;
  var _oListenerFade;
  var _oListenerPanel;
  var _oListenerContainer;

  var _pStartPanelPos;

  var _bFading;

  this._init = function () {
    _bFading = false;

    _oContainer = new createjs.Container();
    s_oStage.addChild(_oContainer);

    _oPanelContainer = new createjs.Container();
    s_oStage.addChild(_oPanelContainer);

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oFade.alpha = 0;
    _oListenerFade = _oFade.on("mousedown", function () {});
    _oContainer.addChild(_oFade);

    createjs.Tween.get(_oFade).to({ alpha: 0.7 }, 500);

    var oSprite = s_oSpriteLibrary.getSprite("msg_box");
    var oPanel = createBitmap(oSprite);
    oPanel.regX = oSprite.width / 2;
    oPanel.regY = oSprite.height / 2;
    oPanel.x = CANVAS_WIDTH_HALF;
    oPanel.y = CANVAS_HEIGHT_HALF;
    _oPanelContainer.addChild(oPanel);

    _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height / 2;
    _pStartPanelPos = { x: _oPanelContainer.x, y: _oPanelContainer.y };
    createjs.Tween.get(_oPanelContainer).to(
      { y: 0 },
      1000,
      createjs.Ease.backOut
    );

    this.initText();

    var oParent = this;
    _oListenerPanel = _oPanelContainer.on("pressup", function () {
      oParent._onExitHelp();
    });
    _oListenerContainer = _oContainer.on("pressup", function () {
      oParent._onExitHelp();
    });
    s_oGame._bDisableEvents = true;

    if (!s_bMobile) {
      _oPanelContainer.cursor = "pointer";
    }
  };

  this.initText = function () {
    var iPosYLine1 = CANVAS_HEIGHT_HALF - 110;
    var iPosYLine2 = CANVAS_HEIGHT_HALF - 10;
    var iPosYLine3 = CANVAS_HEIGHT_HALF + 90;

    var iX = CANVAS_WIDTH_HALF;
    var iY = iPosYLine1;
    var iWidth = 450;
    var iHeight = 100;
    var now = new Date();
    now.setMinutes(
      now.getMinutes() + parseInt(localStorage.getItem("duration"))
    ); // timestamp
    deadline = new Date(now); // Date object
    remaing = getTimeRemaining(deadline);
    console.log(remaing);
    if (remaing.hours > 0) {
      text =
        remaing.hours +
        ":" +
        remaing.minutes +
        ":" +
        ("0" + remaing.seconds).slice(-2);
    } else if (remaing.minutes <= 0) {
      text = "0:0:" + ("0" + remaing.seconds).slice(-2);
    } else {
      text = "0:" + remaing.minutes + ":" + ("0" + remaing.seconds).slice(-2);
    }

    new CTLText(
      _oPanelContainer,
      iX - iWidth / 2,
      iY - iHeight / 5,
      iWidth,
      iHeight * 3,
      60,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_HELP1 + text,
      true,
      true,
      true,
      false
    );
  };

  this.unload = function () {
    createjs.Tween.get(_oFade).to({ alpha: 0 }, 500);
    createjs.Tween.get(_oPanelContainer)
      .to({ y: _pStartPanelPos.y }, 400, createjs.Ease.backIn)
      .call(function () {
        s_oStage.removeChild(_oPanelContainer);
        s_oGame._bDisableEvents = false;
        var oParent = this;
        _oPanelContainer.off("pressup", _oListenerPanel);
        _oContainer.off("pressup", _oListenerContainer);
        _oFade.off("mousedown", _oListenerFade);
      });
  };

  this._onExitHelp = function () {
    if (_bFading === true) {
      return;
    }

    _bFading = true;
    createjs.Tween.removeAllTweens();
    this.unload();
    s_oGame._onExitHelp();
    start_timer();
  };

  this._init();
}
function start_timer() {
  saveItem("zoominbasketball_start_time", Date.parse(new Date()));
  var now = new Date();
  now.setMinutes(now.getMinutes() + parseInt(localStorage.getItem("duration"))); // timestamp
  deadline = new Date(now); // Date object

  remaing = getTimeRemaining(deadline);
  if (remaing.hours > 0) {
    $(".digital_timer")
      .html(
        remaing.hours +
          ":" +
          remaing.minutes +
          ":" +
          ("0" + remaing.seconds).slice(-2)
      )
      .removeClass("hidden");
  } else if (remaing.minutes <= 0) {
    $(".digital_timer")
      .html("0:" + ("0" + remaing.seconds).slice(-2))
      .removeClass("hidden");
  } else {
    $(".digital_timer")
      .html(remaing.minutes + ":" + ("0" + remaing.seconds).slice(-2))
      .removeClass("hidden");
  }
  $(".time_bottom").removeClass("hidden");
  $(".time_bottom").css(
    "bottom",
    ($("#bg").height() - $("#canvas").height()) / 2 +
      $(".digital_timer").height() / 2
  );
  $(".digital_timer").css("min-width", $(".digital_timer").width() - 5);
  $(".time_bottom").css(
    "left",
    parseFloat($("#canvas").css("left")) +
      $("#canvas").width() -
      $(".digital_timer").width() -
      $(".timer").height()
  );
  $(".timer").circularCountDown({
    size: 31,
    borderSize: 5,
    colorCircle: "#fd6beb",
    background: "#784ebf",
    fontFamily: "sans-serif",
    fontColor: "#0000",
    fontSize: 14,
    delayToFadeIn: 0,
    delayToFadeOut: 0,
    reverseLoading: true,
    reverseRotation: true,
    duration: {
      hours: remaing.hours,
      minutes: remaing.minutes,
      seconds: remaing.seconds,
    },
    beforeStart: function () {},
    end: function () {},
  });
}
function CEndPanel(iScore) {
  var _oContainer;
  var _oPanelContainer;
  var _oFade;
  var _oButExit;
  var _oButRestart;
  var _oInterface;

  var _pStartPanelPos;
  console.log("end-----------?", iScore);
  window.location.replace(
    "http://mobile.zoomingaming.com/?event_id=" + event_id + "&&play_flag=true"
  );

  this._init = function (iScore) {
    _oContainer = new createjs.Container();
    s_oStage.addChild(_oContainer);

    _oPanelContainer = new createjs.Container();
    s_oStage.addChild(_oPanelContainer);

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oFade.alpha = 0;
    _oFade.on("mousedown", function () {});
    _oContainer.addChild(_oFade);

    createjs.Tween.get(_oFade).to({ alpha: 0.7 }, 500);

    var oSprite = s_oSpriteLibrary.getSprite("msg_box_big");
    var oPanel = createBitmap(oSprite);
    oPanel.regX = oSprite.width / 2;
    oPanel.regY = oSprite.height / 2;
    oPanel.x = CANVAS_WIDTH_HALF;
    oPanel.y = CANVAS_HEIGHT_HALF;
    _oPanelContainer.addChild(oPanel);

    _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height / 2;
    _pStartPanelPos = { x: _oPanelContainer.x, y: _oPanelContainer.y };
    createjs.Tween.get(_oPanelContainer)
      .to({ y: 0 }, 1000, createjs.Ease.backOut)
      .call(function () {
        $(s_oMain).trigger("show_interlevel_ad");
      });

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF - 160;
    var iWidth = 550;
    var iHeight = 120;

    new CTLText(
      _oPanelContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      42,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_GAMEOVER,
      true,
      true,
      true,
      false
    );

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF - 60;
    var iWidth = 550;
    var iHeight = 120;

    new CTLText(
      _oPanelContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      36,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_SCORE + iScore,
      true,
      true,
      true,
      false
    );

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF;
    var iWidth = 550;
    var iHeight = 120;

    new CTLText(
      _oPanelContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      36,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1,
      2,
      2,
      TEXT_YOUR_BEST_SCORE + s_iBestScore,
      true,
      true,
      true,
      false
    );

    _oButExit = new CGfxButton(
      CANVAS_WIDTH_HALF - 190,
      830,
      s_oSpriteLibrary.getSprite("but_home"),
      _oPanelContainer
    );
    _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

    _oButRestart = new CGfxButton(
      CANVAS_WIDTH_HALF + 190,
      830,
      s_oSpriteLibrary.getSprite("but_restart"),
      _oPanelContainer
    );
    _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

    _oInterface = new CInterface(_oContainer);
  };

  this.unload = function () {
    createjs.Tween.get(_oFade).to({ alpha: 0 }, 500);

    createjs.Tween.get(_oPanelContainer)
      .to({ y: _pStartPanelPos.y }, 400, createjs.Ease.backIn)
      .call(function () {
        _oButExit.unload();
        _oButRestart.unload();
        _oFade.removeAllEventListener();
        s_oStage.removeChild(_oContainer);
        s_oEndPanel = null;
      });
  };

  this._onExit = function () {
    this.unload();
    s_oGame.onExit();
  };

  this._onRestart = function () {
    this.unload();
    s_oGame.restart();
    start_timer();
    stopSound("game_over");
    _oInterface.gameOverFun(false);
  };

  s_oEndPanel = this;

  this._init(iScore);
}

var s_oEndPanel = null;

function CMsgBox(szText, oParentContainer) {
  var _oMsg;
  var _oButOk;
  var _oContainer;
  var _oParentContainer;
  var _oFade;

  this._init = function (szText) {
    _oContainer = new createjs.Container();
    _oParentContainer.addChild(_oContainer);

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("black")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oFade.alpha = 0.5;

    _oFade.on("click", function () {});

    _oContainer.addChild(_oFade);

    var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_big");
    var oBg = createBitmap(oSpriteBg);

    oBg.x = CANVAS_WIDTH * 0.5;
    oBg.y = CANVAS_HEIGHT * 0.5;
    oBg.regX = oSpriteBg.width * 0.5;
    oBg.regY = oSpriteBg.height * 0.5;
    _oContainer.addChild(oBg);

    var iX = CANVAS_WIDTH_HALF;
    var iY = CANVAS_HEIGHT_HALF - 100;
    var iWidth = 520;
    var iHeight = 250;

    _oMsg = new CTLText(
      _oContainer,
      iX - iWidth / 2,
      iY - iHeight / 2,
      iWidth,
      iHeight,
      50,
      "center",
      PRIMARY_FONT_COLOUR,
      PRIMARY_FONT,
      1.1,
      2,
      2,
      TEXT_ERR_LS,
      true,
      true,
      true,
      false
    );

    _oButOk = new CGfxButton(
      CANVAS_WIDTH / 2,
      820,
      s_oSpriteLibrary.getSprite("but_yes"),
      _oContainer
    );
    _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
  };

  this._onButOk = function () {
    this.unload();
  };

  this.unload = function () {
    _oButOk.unload();
    _oParentContainer.removeChild(_oContainer);
    _oFade.removeEventListeners();
  };

  _oParentContainer = oParentContainer;

  this._init(szText);
}

function extractHostname(url) {
  var hostname;
  /*find & remove protocol (http, ftp, etc.) and get hostname*/ if (
    url.indexOf("://") > -1
  ) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  /*find & remove port number*/ hostname = hostname.split(":")[0];
  /*find & remove '?'*/ hostname = hostname.split("?")[0];
  return hostname;
}
function extractRootDomain(url) {
  var domain = extractHostname(url),
    splitArr = domain.split("."),
    arrLen = splitArr.length;
  /*extracting the root domain here*/ if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
  }
  return domain;
}
/* return topmost browser window of current window & boolean to say if cross-domain exception occurred*/ const getClosestTop =
  () => {
    let oFrame = window,
      bException = false;
    try {
      while (oFrame.parent.document !== oFrame.document) {
        if (oFrame.parent.document) {
          oFrame = oFrame.parent;
        } else {
          /*chrome/ff set exception here*/ bException = true;
          break;
        }
      }
    } catch (e) {
      /* Safari needs try/catch so sets exception here*/ bException = true;
    }
    return { topFrame: oFrame, err: bException };
  };
/* get best page URL using info from getClosestTop*/ const getBestPageUrl = ({
  err: crossDomainError,
  topFrame,
}) => {
  let sBestPageUrl = "";
  if (!crossDomainError) {
    /* easy case- we can get top frame location*/ sBestPageUrl =
      topFrame.location.href;
  } else {
    try {
      try {
        /* If friendly iframe */ sBestPageUrl = window.top.location.href;
      } catch (e) {
        /*If chrome use ancestor origin array */ let aOrigins =
          window.location.ancestorOrigins;
        /*Get last origin which is top-domain (chrome only):*/ sBestPageUrl =
          aOrigins[aOrigins.length - 1];
      }
    } catch (e) {
      sBestPageUrl = topFrame.document.referrer;
    }
  }
  return sBestPageUrl;
};
/* To get page URL, simply run following within an iframe on the page:*/ const TOPFRAMEOBJ =
  getClosestTop();
const PAGE_URL = getBestPageUrl(TOPFRAMEOBJ);
function seekAndDestroy() {
  var szResult = false;
  var szRootDomain = extractRootDomain(PAGE_URL);
  var aList = [
    String.fromCharCode(
      99,
      111,
      100,
      101,
      116,
      104,
      105,
      115,
      108,
      97,
      98,
      46,
      99,
      111,
      109
    ),
    String.fromCharCode(101, 110, 118, 97, 116, 111, 46, 99, 111, 109),
    String.fromCharCode(
      99,
      111,
      100,
      101,
      99,
      97,
      110,
      121,
      111,
      110,
      46,
      99,
      111,
      109
    ),
    String.fromCharCode(
      99,
      111,
      100,
      101,
      99,
      97,
      110,
      121,
      111,
      110,
      46,
      110,
      101,
      116
    ),
  ];
  for (var i = 0; i < aList.length; i++) {
    if (aList[i] === szRootDomain) {
      return true;
    }
  }
  return szResult;
}
