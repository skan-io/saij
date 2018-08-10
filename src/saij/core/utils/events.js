/**
 * @module saij/core/utils/events
 */
import {clear} from './object.js';

/* eslint max-len: 0 */
/* eslint no-use-before-define: 0 */


/**
 * Key to use with {@link module:saij/core/Observable~Observable#unByKey}.
 * @typedef {Object} EventsKey
 * @property {Object} [bindTo]
 * @property {module:saij/core/utils/events~ListenerFunction} [boundListener]
 * @property {boolean} callOnce
 * @property {number} [deleteIndex]
 * @property {module:saij/core/utils/events~ListenerFunction} listener
 * @property {module:saij/core/Target~EventTargetLike} target
 * @property {string} type
 * @api
 */


/**
 * Listener function. This function is called with an event object as argument.
 * When the function returns `false`, event propagation will stop.
 *
 * @typedef {function(module:saij/core/Event)|function(module:saij/core/Event): boolean} ListenerFunction
 * @api
 */


/**
 * @param {module:saij/core/utils/events~EventsKey} listenerObj Listener object.
 * @return {module:saij/core/utils/events~ListenerFunction} Bound listener.
 */
export function bindListener(listenerObj) {
  const boundListener = (evt)=> {
    const listener = listenerObj.listener;
    const bindTo = listenerObj.bindTo || listenerObj.target;
    if (listenerObj.callOnce) {
      unlistenByKey(listenerObj);
    }

    // eslint-disable-next-line
    return listener.call(bindTo, evt);
  };
  listenerObj.boundListener = boundListener;
  return boundListener;
}


/**
 * Finds the matching {@link module:saij/core/utils/events~EventsKey} in the given listener
 * array.
 *
 * @param {!Array<!module:saij/core/utils/events~EventsKey>} listeners Array of listeners.
 * @param {!Function} listener The listener function.
 * @param {Object=} opt_this The `this` value inside the listener.
 * @param {boolean=} opt_setDeleteIndex Set the deleteIndex on the matching
 *     listener, for {@link module:saij/core/utils/events~unlistenByKey}.
 * @return {module:saij/core/utils/events~EventsKey|undefined} The matching listener object.
 */
export function findListener(listeners, listener, opt_this, opt_setDeleteIndex) {
  let listenerObj = null;
  for (let i = 0, ii = listeners.length; i < ii; i += 1) {
    listenerObj = listeners[i];
    if (listenerObj.listener === listener &&
        listenerObj.bindTo === opt_this) {
      if (opt_setDeleteIndex) {
        listenerObj.deleteIndex = i;
      }
      return listenerObj;
    }
  }
  return undefined;
}


/**
 * @param {module:saij/core/Target~EventTargetLike} target Target.
 * @param {string} type Type.
 * @return {Array<module:saij/core/utils/events~EventsKey>|undefined} Listeners.
 */
export function getListeners(target, type) {
  const listenerMap = target.saij_lm;
  return listenerMap ? listenerMap[type] : undefined;
}


/**
 * Get the lookup of listeners.  If one does not exist on the target, it is
 * created.
 * @param {module:saij/core/Target~EventTargetLike} target Target.
 * @return {!Object<string, Array<module:saij/core/utils/events~EventsKey>>} Map of
 *     listeners by event type.
 */
function getListenerMap(target) {
  let listenerMap = target.saij_lm;
  if (!listenerMap) {
    listenerMap = target.saij_lm = {};
  }
  return listenerMap;
}


/**
 * Clean up all listener objects of the given type.  All properties on the
 * listener objects will be removed, and if no listeners remain in the listener
 * map, it will be removed from the target.
 * @param {module:saij/core/Target~EventTargetLike} target Target.
 * @param {string} type Type.
 */
// eslint-disable-next-line max-statements
function removeListeners(target, type) {
  const listeners = getListeners(target, type);
  /* istanbul ignore next */
  if (listeners) {
    for (let i = 0, ii = listeners.length; i < ii; i += 1) {
      target.removeEventListener(type, listeners[i].boundListener);
      clear(listeners[i]);
    }
    listeners.length = 0;
    const listenerMap = target.saij_lm;
    /* istanbul ignore next */
    if (listenerMap) {
      Reflect.deleteProperty(listenerMap, type);
      if (Object.keys(listenerMap).length === 0) {
        // eslint-disable-next-line
        delete target.saij_lm;
      }
    }
  }
}


/**
 * Registers an event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * This function efficiently binds a `listener` to a `this` object, and returns
 * a key for use with {@link module:saij/core/utils/events~unlistenByKey}.
 *
 * @param {module:saij/core/Target~EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {module:saij/core/utils/events~ListenerFunction} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @param {boolean=} opt_once If true, add the listener as one-off listener.
 * @return {module:saij/core/utils/events~EventsKey} Unique key for the listener.
 */
// eslint-disable-next-line max-params, max-statements
export function listen(target, type, listener, opt_this, opt_once) {
  const listenerMap = getListenerMap(target);
  let listeners = listenerMap[type];
  if (!listeners) {
    listeners = listenerMap[type] = [];
  }
  let listenerObj = findListener(listeners, listener, opt_this, false);
  if (listenerObj) {
    if (!opt_once) {
      // Turn one-off listener into a permanent one.
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = /** @type {module:saij/core/utils/events~EventsKey} */ ({
      bindTo: opt_this,
      callOnce: Boolean(opt_once),
      listener,
      target,
      type
    });
    target.addEventListener(type, bindListener(listenerObj));
    listeners.push(listenerObj);
  }

  return listenerObj;
}


/**
 * Registers a one-off event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * This function efficiently binds a `listener` as self-unregistering listener
 * to a `this` object, and returns a key for use with
 * {@link module:saij/core/utils/events~unlistenByKey} in case the listener needs to be
 * unregistered before it is called.
 *
 * When {@link module:saij/core/utils/events~listen} is called with the same arguments after this
 * function, the self-unregistering listener will be turned into a permanent
 * listener.
 *
 * @param {module:saij/core/Target~EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {module:saij/core/utils/events~ListenerFunction} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @return {module:saij/core/utils/events~EventsKey} Key for unlistenByKey.
 */
export function listenOnce(target, type, listener, opt_this) {
  return listen(target, type, listener, opt_this, true);
}


/**
 * Unregisters an event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * To return a listener, this function needs to be called with the exact same
 * arguments that were used for a previous {@link module:saij/core/utils/events~listen} call.
 *
 * @param {module:saij/core/Target~EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {module:saij/core/utils/events~ListenerFunction} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 */
export function unlisten(target, type, listener, opt_this) {
  const listeners = getListeners(target, type);
  if (listeners) {
    const listenerObj = findListener(listeners, listener, opt_this, true);
    /* istanbul ignore next */
    if (listenerObj) {
      unlistenByKey(listenerObj);
    }
  }
}


/**
 * Unregisters event listeners on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * The argument passed to this function is the key returned from
 * {@link module:saij/core/utils/events~listen} or {@link module:saij/core/utils/events~listenOnce}.
 *
 * @param {module:saij/core/utils/events~EventsKey} key The key.
 */
export function unlistenByKey(key) {
  /* istanbul ignore next */
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.boundListener);
    const listeners = getListeners(key.target, key.type);
    if (listeners) {
      const i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key);
      /* istanbul ignore next */
      if (i !== -1) {
        listeners.splice(i, 1);
      }
      /* istanbul ignore next */
      if (listeners.length === 0) {
        removeListeners(key.target, key.type);
      }
    }
    clear(key);
  }
}


/**
 * Unregisters all event listeners on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * @param {module:saij/core/Target~EventTargetLike} target Target.
 */
export function unlistenAll(target) {
  const listenerMap = getListenerMap(target);
  // eslint-disable-next-line guard-for-in
  for (const type in listenerMap) {
    removeListeners(target, type);
  }
}
