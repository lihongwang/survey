import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch
} from "./chunk-WMHRM4ZB.js";
import "./chunk-5WRI5ZAA.js";

// node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// node_modules/state-local/lib/es/state-local.js
function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread22(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys2(Object(source), true).forEach(function(key) {
        _defineProperty2(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys2(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function(x) {
    return fns.reduceRight(function(y, f) {
      return f(y);
    }, x);
  };
}
function curry(fn) {
  return function curried() {
    var _this = this;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return args.length >= fn.length ? fn.apply(this, args) : function() {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }
      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}
function isObject(value) {
  return {}.toString.call(value).includes("Object");
}
function isEmpty(obj) {
  return !Object.keys(obj).length;
}
function isFunction(value) {
  return typeof value === "function";
}
function hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}
function validateChanges(initial, changes) {
  if (!isObject(changes)) errorHandler("changeType");
  if (Object.keys(changes).some(function(field) {
    return !hasOwnProperty(initial, field);
  })) errorHandler("changeField");
  return changes;
}
function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler("selectorType");
}
function validateHandler(handler) {
  if (!(isFunction(handler) || isObject(handler))) errorHandler("handlerType");
  if (isObject(handler) && Object.values(handler).some(function(_handler) {
    return !isFunction(_handler);
  })) errorHandler("handlersType");
}
function validateInitial(initial) {
  if (!initial) errorHandler("initialIsRequired");
  if (!isObject(initial)) errorHandler("initialType");
  if (isEmpty(initial)) errorHandler("initialContent");
}
function throwError(errorMessages3, type) {
  throw new Error(errorMessages3[type] || errorMessages3["default"]);
}
var errorMessages = {
  initialIsRequired: "initial state is required",
  initialType: "initial state should be an object",
  initialContent: "initial state shouldn't be an empty object",
  handlerType: "handler should be an object or a function",
  handlersType: "all handlers should be a functions",
  selectorType: "selector should be a function",
  changeType: "provided value of changes should be an object",
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": "an unknown error accured in `state-local` package"
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};
function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  validators.initial(initial);
  validators.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry(didStateUpdate)(state, handler);
  var update = curry(updateState)(state);
  var validate = curry(validators.changes)(initial);
  var getChanges = curry(extractChanges)(state);
  function getState2() {
    var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
      return state2;
    };
    validators.selector(selector);
    return selector(state.current);
  }
  function setState2(causedChanges) {
    compose(didUpdate, update, validate, getChanges)(causedChanges);
  }
  return [getState2, setState2];
}
function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}
function updateState(state, changes) {
  state.current = _objectSpread22(_objectSpread22({}, state.current), changes);
  return changes;
}
function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
    var _handler$field;
    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}
var index = {
  create
};
var state_local_default = index;

// node_modules/@monaco-editor/loader/lib/es/config/index.js
var config = {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
  }
};
var config_default = config;

// node_modules/@monaco-editor/loader/lib/es/utils/curry.js
function curry2(fn) {
  return function curried() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return args.length >= fn.length ? fn.apply(this, args) : function() {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }
      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}
var curry_default = curry2;

// node_modules/@monaco-editor/loader/lib/es/utils/isObject.js
function isObject2(value) {
  return {}.toString.call(value).includes("Object");
}
var isObject_default = isObject2;

// node_modules/@monaco-editor/loader/lib/es/validators/index.js
function validateConfig(config3) {
  if (!config3) errorHandler2("configIsRequired");
  if (!isObject_default(config3)) errorHandler2("configType");
  if (config3.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config3.urls.monacoBase
      }
    };
  }
  return config3;
}
function informAboutDeprecation() {
  console.warn(errorMessages2.deprecation);
}
function throwError2(errorMessages3, type) {
  throw new Error(errorMessages3[type] || errorMessages3["default"]);
}
var errorMessages2 = {
  configIsRequired: "the configuration object is required",
  configType: "the configuration object should be an object",
  "default": "an unknown error accured in `@monaco-editor/loader` package",
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler2 = curry_default(throwError2)(errorMessages2);
var validators2 = {
  config: validateConfig
};
var validators_default = validators2;

// node_modules/@monaco-editor/loader/lib/es/utils/compose.js
var compose2 = function compose3() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function(x) {
    return fns.reduceRight(function(y, f) {
      return f(y);
    }, x);
  };
};
var compose_default = compose2;

// node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js
function merge(target, source) {
  Object.keys(source).forEach(function(key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return _objectSpread2(_objectSpread2({}, target), source);
}
var deepMerge_default = merge;

// node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js
var CANCELATION_MESSAGE = {
  type: "cancelation",
  msg: "operation is manually canceled"
};
function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function(resolve, reject) {
    promise.then(function(val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function() {
    return hasCanceled_ = true;
  }, wrappedPromise;
}
var makeCancelable_default = makeCancelable;

// node_modules/@monaco-editor/loader/lib/es/loader/index.js
var _state$create = state_local_default.create({
  config: config_default,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
});
var _state$create2 = _slicedToArray(_state$create, 2);
var getState = _state$create2[0];
var setState = _state$create2[1];
function config2(globalConfig) {
  var _validators$config = validators_default.config(globalConfig), monaco = _validators$config.monaco, config3 = _objectWithoutProperties(_validators$config, ["monaco"]);
  setState(function(state) {
    return {
      config: deepMerge_default(state.config, config3),
      monaco
    };
  });
}
function init() {
  var state = getState(function(_ref) {
    var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
    return {
      monaco,
      isInitialized,
      resolve
    };
  });
  if (!state.isInitialized) {
    setState({
      isInitialized: true
    });
    if (state.monaco) {
      state.resolve(state.monaco);
      return makeCancelable_default(wrapperPromise);
    }
    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      state.resolve(window.monaco);
      return makeCancelable_default(wrapperPromise);
    }
    compose_default(injectScripts, getMonacoLoaderScript)(configureLoader);
  }
  return makeCancelable_default(wrapperPromise);
}
function injectScripts(script) {
  return document.body.appendChild(script);
}
function createScript(src) {
  var script = document.createElement("script");
  return src && (script.src = src), script;
}
function getMonacoLoaderScript(configureLoader2) {
  var state = getState(function(_ref2) {
    var config3 = _ref2.config, reject = _ref2.reject;
    return {
      config: config3,
      reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
  loaderScript.onload = function() {
    return configureLoader2();
  };
  loaderScript.onerror = state.reject;
  return loaderScript;
}
function configureLoader() {
  var state = getState(function(_ref3) {
    var config3 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
    return {
      config: config3,
      resolve,
      reject
    };
  });
  var require2 = window.require;
  require2.config(state.config);
  require2(["vs/editor/editor.main"], function(monaco) {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function(error) {
    state.reject(error);
  });
}
function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco
    });
  }
}
function __getMonacoInstance() {
  return getState(function(_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}
var wrapperPromise = new Promise(function(resolve, reject) {
  return setState({
    resolve,
    reject
  });
});
var loader = {
  config: config2,
  init,
  __getMonacoInstance
};
var loader_default = loader;

// node_modules/@guolao/vue-monaco-editor/lib/es/index.js
var __defProp$2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var styles = {
  wrapper: {
    display: "flex",
    position: "relative",
    textAlign: "initial"
  },
  fullWidth: {
    width: "100%"
  },
  hide: {
    display: "none"
  }
};
function useContainer(props, isEditorReady) {
  const wrapperStyle = computed(() => {
    const { width, height } = props;
    return __spreadProps(__spreadValues$2({}, styles.wrapper), {
      width,
      height
    });
  });
  const containerStyle = computed(() => {
    return __spreadValues$2(__spreadValues$2({}, styles.fullWidth), !isEditorReady.value && styles.hide);
  });
  return { wrapperStyle, containerStyle };
}
function useMonaco() {
  const monacoRef = shallowRef(loader_default.__getMonacoInstance());
  const isLoadFailed = ref(false);
  let promise;
  onMounted(() => {
    if (monacoRef.value)
      return;
    promise = loader_default.init();
    promise.then((monacoInstance) => monacoRef.value = monacoInstance).catch((error) => {
      if ((error == null ? void 0 : error.type) !== "cancelation") {
        isLoadFailed.value = true;
        console.error("Monaco initialization error:", error);
      }
    });
  });
  const unload = () => promise == null ? void 0 : promise.cancel();
  return {
    monacoRef,
    unload,
    isLoadFailed
  };
}
function slotHelper(slot) {
  return typeof slot == "function" ? slot() : slot;
}
function isUndefined(v) {
  return v === void 0;
}
function getOrCreateModel(monaco, value, language, path) {
  return getModel(monaco, path) || createModel(monaco, value, language, path);
}
function getModel(monaco, path) {
  return monaco.editor.getModel(createModelUri(monaco, path));
}
function createModel(monaco, value, language, path) {
  return monaco.editor.createModel(value, language, path ? createModelUri(monaco, path) : void 0);
}
function createModelUri(monaco, path) {
  return monaco.Uri.parse(path);
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var loadingStyle$1 = {
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center"
};
var VueMonacoEditor = defineComponent({
  name: "VueMonacoEditor",
  // TODO: vue3 use modelValue, vue2 use value
  model: {
    prop: "value",
    event: "update:value"
  },
  props: {
    defaultValue: String,
    defaultPath: String,
    defaultLanguage: String,
    value: String,
    language: String,
    path: String,
    /* === */
    theme: {
      type: String,
      default: "vs"
    },
    line: Number,
    options: {
      type: Object,
      default: () => ({})
    },
    overrideServices: {
      type: Object,
      default: () => ({})
    },
    saveViewState: {
      type: Boolean,
      default: true
    },
    /* === */
    width: {
      type: [Number, String],
      default: "100%"
    },
    height: {
      type: [Number, String],
      default: "100%"
    },
    className: String
  },
  emits: ["update:value", "beforeMount", "mount", "change", "validate"],
  setup(props, ctx) {
    const viewStates = /* @__PURE__ */ new Map();
    const containerRef = shallowRef(null);
    const { monacoRef, unload, isLoadFailed } = useMonaco();
    const { editorRef } = useEditor(ctx, props, monacoRef, containerRef);
    const { disposeValidator } = useValidator(ctx, props, monacoRef, editorRef);
    const isEditorReady = computed(() => !!monacoRef.value && !!editorRef.value);
    const { wrapperStyle, containerStyle } = useContainer(props, isEditorReady);
    onUnmounted(() => {
      var _a, _b;
      (_a = disposeValidator.value) == null ? void 0 : _a.call(disposeValidator);
      if (editorRef.value) {
        (_b = editorRef.value.getModel()) == null ? void 0 : _b.dispose();
        editorRef.value.dispose();
      } else {
        unload();
      }
    });
    watch(
      [() => props.path, () => props.value, () => props.language, () => props.line],
      ([newPath, newValue, newLanguage, newLine], [oldPath, oldValue, oldLanguage, oldLine]) => {
        if (!isEditorReady.value) {
          return;
        }
        if (newPath !== oldPath) {
          const newModel = getOrCreateModel(
            monacoRef.value,
            newValue || props.defaultValue || "",
            newLanguage || props.defaultLanguage || "",
            newPath || props.defaultPath || ""
          );
          props.saveViewState && viewStates.set(oldPath, editorRef.value.saveViewState());
          editorRef.value.setModel(newModel);
          props.saveViewState && editorRef.value.restoreViewState(viewStates.get(newPath));
          if (!isUndefined(newLine)) {
            editorRef.value.revealLine(newLine);
          }
          return;
        }
        if (editorRef.value.getValue() !== newValue) {
          editorRef.value.setValue(newValue);
        }
        if (newLanguage !== oldLanguage) {
          monacoRef.value.editor.setModelLanguage(editorRef.value.getModel(), newLanguage);
        }
        if (!isUndefined(newLine) && newLine !== oldLine) {
          editorRef.value.revealLine(newLine);
        }
      }
    );
    watch(
      () => props.options,
      (options) => editorRef.value && editorRef.value.updateOptions(options),
      { deep: true }
    );
    watch(
      () => props.theme,
      (theme) => monacoRef.value && monacoRef.value.editor.setTheme(theme)
    );
    return {
      containerRef,
      isEditorReady,
      isLoadFailed,
      wrapperStyle,
      containerStyle
    };
  },
  render() {
    const {
      $slots,
      isEditorReady,
      isLoadFailed,
      wrapperStyle,
      containerStyle,
      // TODO: need remove, add `@deprecated` flag
      className
    } = this;
    return h(
      "div",
      {
        style: wrapperStyle
      },
      [
        !isEditorReady && h(
          "div",
          {
            style: loadingStyle$1
          },
          isLoadFailed ? $slots.failure ? slotHelper($slots.failure) : "load failed" : $slots.default ? slotHelper($slots.default) : "loading..."
        ),
        h("div", {
          ref: "containerRef",
          key: "monaco_editor_container",
          style: containerStyle,
          class: className
        })
      ]
    );
  }
});
function useEditor({ emit }, props, monacoRef, containerRef) {
  const editorRef = shallowRef(null);
  onMounted(() => {
    const stop = watch(
      monacoRef,
      () => {
        if (containerRef.value && monacoRef.value) {
          nextTick(() => stop());
          createEditor();
        }
      },
      { immediate: true }
    );
  });
  function createEditor() {
    var _a;
    if (!containerRef.value || !monacoRef.value || editorRef.value) {
      return;
    }
    emit("beforeMount", monacoRef.value);
    const autoCreatedModelPath = props.path || props.defaultPath;
    const defaultModel = getOrCreateModel(
      monacoRef.value,
      props.value || props.defaultValue || "",
      props.language || props.defaultLanguage || "",
      autoCreatedModelPath || ""
    );
    editorRef.value = monacoRef.value.editor.create(
      containerRef.value,
      __spreadValues$1({
        model: defaultModel,
        theme: props.theme,
        automaticLayout: true,
        autoIndent: "brackets",
        formatOnPaste: true,
        formatOnType: true
      }, props.options),
      props.overrideServices
    );
    (_a = editorRef.value) == null ? void 0 : _a.onDidChangeModelContent((event) => {
      const value = editorRef.value.getValue();
      if (value !== props.value) {
        emit("update:value", value);
        emit("change", value, event);
      }
    });
    if (editorRef.value && !isUndefined(props.line)) {
      editorRef.value.revealLine(props.line);
    }
    emit("mount", editorRef.value, monacoRef.value);
  }
  return { editorRef };
}
function useValidator({ emit }, props, monacoRef, editorRef) {
  const disposeValidator = ref(null);
  const stop = watch([monacoRef, editorRef], () => {
    if (monacoRef.value && editorRef.value) {
      nextTick(() => stop());
      const changeMarkersListener = monacoRef.value.editor.onDidChangeMarkers((uris) => {
        var _a, _b;
        const editorUri = (_b = (_a = editorRef.value) == null ? void 0 : _a.getModel()) == null ? void 0 : _b.uri;
        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find((uri) => uri.path === editorUri.path);
          if (currentEditorHasMarkerChanges) {
            const markers = monacoRef.value.editor.getModelMarkers({
              resource: editorUri
            });
            emit("validate", markers);
          }
        }
      });
      disposeValidator.value = () => changeMarkersListener == null ? void 0 : changeMarkersListener.dispose();
    }
  });
  return { disposeValidator };
}
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var loadingStyle = {
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center"
};
var VueMonacoDiffEditor = defineComponent({
  name: "VueMonacoDiffEditor",
  props: {
    original: String,
    modified: String,
    language: String,
    originalLanguage: String,
    modifiedLanguage: String,
    originalModelPath: String,
    modifiedModelPath: String,
    /* == */
    theme: {
      type: String,
      default: "vs"
    },
    options: {
      type: Object,
      default: () => ({})
    },
    /* == */
    width: {
      type: [Number, String],
      default: "100%"
    },
    height: {
      type: [Number, String],
      default: "100%"
    },
    className: String
  },
  setup(props, ctx) {
    const containerRef = shallowRef(null);
    const { monacoRef, unload, isLoadFailed } = useMonaco();
    const { diffEditorRef } = useDiffEditor(ctx, props, monacoRef, containerRef);
    const isDiffEditorReady = computed(() => !!monacoRef.value && !!diffEditorRef.value);
    const { wrapperStyle, containerStyle } = useContainer(props, isDiffEditorReady);
    onUnmounted(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      !monacoRef.value && unload();
      const models = (_b = (_a = diffEditorRef.value) == null ? void 0 : _a.getModel) == null ? void 0 : _b.call(_a);
      (_d = (_c = models == null ? void 0 : models.original) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
      (_f = (_e = models == null ? void 0 : models.modified) == null ? void 0 : _e.dispose) == null ? void 0 : _f.call(_e);
      (_h = (_g = diffEditorRef.value) == null ? void 0 : _g.dispose) == null ? void 0 : _h.call(_g);
    });
    watch(
      [() => props.originalModelPath, () => props.original, () => props.originalLanguage, () => props.language],
      ([newOriginalModelPath, newOriginal, newOriginalLanguage, newLanguage], [oldOriginalModelPath, oldOriginal, oldOriginalLanguage, oldLanguage]) => {
        if (!isDiffEditorReady.value) {
          return;
        }
        const originalEditor = diffEditorRef.value.getOriginalEditor();
        if (newOriginalModelPath !== oldOriginalModelPath) {
          const newOriginModel = getOrCreateModel(
            monacoRef.value,
            newOriginal || "",
            newOriginalLanguage || newLanguage || "text",
            newOriginalModelPath || ""
          );
          originalEditor.setModel(newOriginModel);
          return;
        }
        if (newOriginal !== originalEditor.getValue()) {
          originalEditor.setValue(newOriginal || "");
        }
        if (newOriginalLanguage !== oldOriginalLanguage || newLanguage !== oldLanguage) {
          monacoRef.value.editor.setModelLanguage(
            diffEditorRef.value.getModel().original,
            newOriginalLanguage || newLanguage || "text"
          );
        }
      }
    );
    watch(
      [() => props.modifiedModelPath, () => props.modified, () => props.modifiedLanguage, () => props.language],
      ([newModifiedModelPath, newModified, newModifiedLanguage, newLanguage], [oldModifiedModelPath, oldModified, oldModifiedLanguage, oldLanguage]) => {
        if (!isDiffEditorReady.value) {
          return;
        }
        const modifiedEditor = diffEditorRef.value.getModifiedEditor();
        if (oldModifiedModelPath !== newModifiedModelPath) {
          const newModifiedModel = getOrCreateModel(
            monacoRef.value,
            newModified || "",
            newModifiedLanguage || newLanguage || "text",
            newModifiedModelPath || ""
          );
          modifiedEditor.setModel(newModifiedModel);
          return;
        }
        if (newModified !== modifiedEditor.getValue()) {
          const readOnlyCode = monacoRef.value.editor.EditorOption.readOnly;
          if (modifiedEditor.getOption(readOnlyCode)) {
            modifiedEditor.setValue(newModified || "");
          } else {
            modifiedEditor.executeEdits("", [
              {
                range: modifiedEditor.getModel().getFullModelRange(),
                text: newModified || "",
                forceMoveMarkers: true
              }
            ]);
            modifiedEditor.pushUndoStop();
          }
        }
        if (newModifiedLanguage !== oldModifiedLanguage || newLanguage !== oldLanguage) {
          monacoRef.value.editor.setModelLanguage(
            diffEditorRef.value.getModel().modified,
            newModifiedLanguage || newLanguage || "text"
          );
        }
      }
    );
    watch(
      () => props.theme,
      () => {
        var _a;
        return (_a = monacoRef.value) == null ? void 0 : _a.editor.setTheme(props.theme);
      }
    );
    watch(
      () => props.options,
      () => {
        var _a;
        return (_a = diffEditorRef.value) == null ? void 0 : _a.updateOptions(props.options);
      },
      { deep: true }
    );
    return {
      containerRef,
      isDiffEditorReady,
      isLoadFailed,
      wrapperStyle,
      containerStyle
    };
  },
  render() {
    const { $slots, isDiffEditorReady, isLoadFailed, wrapperStyle, containerStyle, className } = this;
    return h(
      "div",
      {
        style: wrapperStyle
      },
      [
        !isDiffEditorReady && h(
          "div",
          {
            style: loadingStyle
          },
          isLoadFailed ? $slots.failure ? slotHelper($slots.failure) : "load failed" : $slots.default ? slotHelper($slots.default) : "loading..."
        ),
        h("div", {
          ref: "containerRef",
          key: "monaco_diff_editor_container",
          style: containerStyle,
          class: className
        })
      ]
    );
  }
});
function useDiffEditor({ emit }, props, monacoRef, containerRef) {
  const diffEditorRef = shallowRef(null);
  onMounted(() => {
    const stop = watch(
      monacoRef,
      () => {
        if (containerRef.value && monacoRef.value) {
          nextTick(() => stop());
          createDiffEditor();
        }
      },
      { immediate: true }
    );
  });
  function createDiffEditor() {
    var _a;
    if (!containerRef.value || !monacoRef.value || diffEditorRef.value) {
      return;
    }
    emit("beforeMount", monacoRef.value);
    diffEditorRef.value = monacoRef.value.editor.createDiffEditor(containerRef.value, __spreadValues({
      automaticLayout: true,
      autoIndent: "brackets",
      theme: props.theme,
      formatOnPaste: true,
      formatOnType: true
    }, props.options));
    const originalModel = getOrCreateModel(
      monacoRef.value,
      props.original || "",
      props.originalLanguage || props.language || "text",
      props.originalModelPath || ""
    );
    const modifiedModel = getOrCreateModel(
      monacoRef.value,
      props.modified || "",
      props.modifiedLanguage || props.language || "text",
      props.modifiedModelPath || ""
    );
    (_a = diffEditorRef.value) == null ? void 0 : _a.setModel({
      original: originalModel,
      modified: modifiedModel
    });
    emit("mount", diffEditorRef.value, monacoRef.value);
  }
  return { diffEditorRef };
}
function install(app, options) {
  if (options) {
    loader_default.config(options);
  }
  app.component(VueMonacoEditor.name, VueMonacoEditor);
  app.component(VueMonacoDiffEditor.name, VueMonacoDiffEditor);
}
export {
  VueMonacoDiffEditor as DiffEditor,
  VueMonacoEditor as Editor,
  VueMonacoDiffEditor,
  VueMonacoEditor,
  VueMonacoEditor as default,
  install,
  loader_default as loader,
  useMonaco
};
//# sourceMappingURL=@guolao_vue-monaco-editor.js.map
