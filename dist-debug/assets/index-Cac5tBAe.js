const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/AboutPage-Dhb7xZVP.js","assets/motion-CwY3TCXX.js","assets/vendor-CFCQ-ZJr.js","assets/i18n-ti7dkFnK.js","assets/heart-CoZQZ5Kp.js","assets/brain-BVbsCg5A.js","assets/star-CaRtl2Cw.js","assets/EventsPage-BRIZoUPg.js","assets/Toast-B8UHSRxp.js","assets/circle-check-big-BWROkmEK.js","assets/arrow-left-Bbmrj-yL.js","assets/share-2-H61oQa6n.js","assets/MusicPage-CMsYf2LI.js","assets/text-DgctY_bk.js","assets/play-CjRq6fsI.js","assets/coffee-AowewQG_.js","assets/ZenTribePage-mrHYPeYm.js","assets/shield-XNTU4cFV.js","assets/trending-up-W9sh_7o0.js","assets/gift-IUjGOuBb.js","assets/zap-BXTxIMT0.js","assets/PressKitPage-BLoOZchM.js","assets/database-BgxuNUZY.js","assets/image-BTn539TG.js","assets/file-text-CIKLAVyj.js","assets/ShopPage-BkQpF_K0.js","assets/loader-circle-DTVp4yA4.js","assets/ProductPage-Cz3hfvjI.js","assets/circle-alert-C7BuYnBJ.js","assets/shopping-cart-C5N0VWkU.js","assets/CartPage-JDMXpbVY.js","assets/arrow-right-DAPyJrnT.js","assets/CheckoutPage-XTrNL3k1.js","assets/lock-B39ha62i.js","assets/DashboardPage-CTwRbJ9x.js","assets/ManaProgressBar-D5_LA-Xg.js","assets/MyAccountPage-Bz5qr5qv.js","assets/FAQPage-m9DN3CU1.js","assets/PhilosophyPage-DwWgo2rG.js","assets/NewsPage-BujQtisS.js","assets/MediaPage-ojbYcLV3.js","assets/PrivacyPolicyPage-DEEVilQu.js","assets/eye-nq4ae8V4.js","assets/ReturnPolicyPage-Bn6cVqQo.js","assets/TermsPage-DZSh4c0q.js","assets/ban-CodaoOad.js","assets/CodeOfConductPage-D93AQbR6.js","assets/SupportArtistPage-6z3zSFWR.js","assets/credit-card-iwRDF_6I.js","assets/TicketsPage-biyctaFr.js","assets/TicketsCheckoutPage-B9Ws3TA2.js","assets/ResetPasswordPage-DMJQNIj6.js","assets/eye-off-DcX1nzYR.js","assets/ZenLinkPage-BOA-NhNn.js","assets/ZoukPersonaQuizPage-DltWbA5F.js","assets/PayMePage-Ds5SVl0b.js","assets/NotFoundPage-B7h318Lz.js","assets/AuthModal-DqcC0Gd6.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _a, _b, _provider, _providerCalled, _c, _focused, _cleanup, _setup, _d, _online, _cleanup2, _setup2, _e, _gcTimeout, _f, _initialState, _revertState, _cache, _client, _retryer, _defaultOptions, _abortSignalConsumed, _Query_instances, dispatch_fn, _g, _client2, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _h, _client3, _observers, _mutationCache, _retryer2, _Mutation_instances, dispatch_fn2, _i, _mutations, _scopes, _mutationId, _j, _client4, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _k, _queries, _l, _queryCache, _mutationCache2, _defaultOptions2, _queryDefaults, _mutationDefaults, _mountCount, _unsubscribeFocus, _unsubscribeOnline, _m;
import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { b as requireReactDom, g as getDefaultExportFromCjs, r as reactExports, R as React, u as useLocation, L as Link, c as useNavigate, N as NavLink, O as Outlet, d as useRoutes, B as BrowserRouter } from "./vendor-CFCQ-ZJr.js";
import { u as useTranslation, T as Trans, i as instance, a as initReactI18next } from "./i18n-ti7dkFnK.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var client = {};
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  var m = requireReactDom();
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  return client;
}
var clientExports = requireClient();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
var reactFastCompare;
var hasRequiredReactFastCompare;
function requireReactFastCompare() {
  if (hasRequiredReactFastCompare) return reactFastCompare;
  hasRequiredReactFastCompare = 1;
  var hasElementType = typeof Element !== "undefined";
  var hasMap = typeof Map === "function";
  var hasSet = typeof Set === "function";
  var hasArrayBuffer = typeof ArrayBuffer === "function" && !!ArrayBuffer.isView;
  function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor) return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0; )
          if (!equal(a[i], b[i])) return false;
        return true;
      }
      var it;
      if (hasMap && a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!b.has(i.value[0])) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!equal(i.value[1], b.get(i.value[0]))) return false;
        return true;
      }
      if (hasSet && a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!b.has(i.value[0])) return false;
        return true;
      }
      if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0; )
          if (a[i] !== b[i]) return false;
        return true;
      }
      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf && typeof a.valueOf === "function" && typeof b.valueOf === "function") return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString && typeof a.toString === "function" && typeof b.toString === "function") return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
      if (hasElementType && a instanceof Element) return false;
      for (i = length; i-- !== 0; ) {
        if ((keys[i] === "_owner" || keys[i] === "__v" || keys[i] === "__o") && a.$$typeof) {
          continue;
        }
        if (!equal(a[keys[i]], b[keys[i]])) return false;
      }
      return true;
    }
    return a !== a && b !== b;
  }
  reactFastCompare = function isEqual(a, b) {
    try {
      return equal(a, b);
    } catch (error) {
      if ((error.message || "").match(/stack|recursion/i)) {
        console.warn("react-fast-compare cannot handle circular refs");
        return false;
      }
      throw error;
    }
  };
  return reactFastCompare;
}
var reactFastCompareExports = requireReactFastCompare();
const fastCompare = /* @__PURE__ */ getDefaultExportFromCjs(reactFastCompareExports);
var browser;
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser;
  hasRequiredBrowser = 1;
  var invariant2 = function(condition, format, a, b, c, d, e, f) {
    if (!condition) {
      var error;
      if (format === void 0) {
        error = new Error(
          "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function() {
            return args[argIndex++];
          })
        );
        error.name = "Invariant Violation";
      }
      error.framesToPop = 1;
      throw error;
    }
  };
  browser = invariant2;
  return browser;
}
var browserExports = requireBrowser();
const invariant = /* @__PURE__ */ getDefaultExportFromCjs(browserExports);
var shallowequal;
var hasRequiredShallowequal;
function requireShallowequal() {
  if (hasRequiredShallowequal) return shallowequal;
  hasRequiredShallowequal = 1;
  shallowequal = function shallowEqual2(objA, objB, compare, compareContext) {
    var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
    if (ret !== void 0) {
      return !!ret;
    }
    if (objA === objB) {
      return true;
    }
    if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
      return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var idx = 0; idx < keysA.length; idx++) {
      var key = keysA[idx];
      if (!bHasOwnProperty(key)) {
        return false;
      }
      var valueA = objA[key];
      var valueB = objB[key];
      ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
      if (ret === false || ret === void 0 && valueA !== valueB) {
        return false;
      }
    }
    return true;
  };
  return shallowequal;
}
var shallowequalExports = requireShallowequal();
const shallowEqual = /* @__PURE__ */ getDefaultExportFromCjs(shallowequalExports);
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance2) => {
          (this.canUseDOM ? instances : this.instances).push(instance2);
        },
        remove: (instance2) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance2);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React.createContext(defaultValue);
var HelmetProvider = (_a = class extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    this.helmetData = new HelmetData(this.props.context || {}, _a.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_a, "canUseDOM", isDocument), _a);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => tag.parentNode?.removeChild(tag));
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends reactExports.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance2) => {
        const props = { ...instance2.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = (_b = class extends reactExports.Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React.createElement(HelmetDispatcher, { ...newProps, context }));
  }
}, __publicField(_b, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _b);
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = (_c = class {
  constructor() {
    // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
    // type at app boot; and if we leave that type, then any new timer provider
    // would need to support ReturnType<typeof setTimeout>, which is infeasible.
    //
    // We settle for type safety for the TimeoutProvider type, and accept that
    // this class is unsafe internally to allow for extension.
    __privateAdd(this, _provider, defaultTimeoutProvider);
    __privateAdd(this, _providerCalled, false);
  }
  setTimeoutProvider(provider) {
    __privateSet(this, _provider, provider);
  }
  setTimeout(callback, delay) {
    return __privateGet(this, _provider).setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    __privateGet(this, _provider).clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    return __privateGet(this, _provider).setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    __privateGet(this, _provider).clearInterval(intervalId);
  }
}, _provider = new WeakMap(), _providerCalled = new WeakMap(), _c);
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
  return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) {
    return a;
  }
  if (depth > 500) return b;
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aItems = array ? a : Object.keys(a);
  const aSize = aItems.length;
  const bItems = array ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v;
    if (v === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
  if (!b || Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
  if (typeof throwOnError === "function") {
    return throwOnError(...params);
  }
  return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object, "signal", {
    enumerable: true,
    get: () => {
      signal ?? (signal = getSignal());
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object;
}
var FocusManager = (_d = class extends Subscribable {
  constructor() {
    super();
    __privateAdd(this, _focused);
    __privateAdd(this, _cleanup);
    __privateAdd(this, _setup);
    __privateSet(this, _setup, (onFocus) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    });
  }
  onSubscribe() {
    if (!__privateGet(this, _cleanup)) {
      this.setEventListener(__privateGet(this, _setup));
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup, void 0);
    }
  }
  setEventListener(setup) {
    var _a2;
    __privateSet(this, _setup, setup);
    (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _cleanup, setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    }));
  }
  setFocused(focused) {
    const changed = __privateGet(this, _focused) !== focused;
    if (changed) {
      __privateSet(this, _focused, focused);
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof __privateGet(this, _focused) === "boolean") {
      return __privateGet(this, _focused);
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
}, _focused = new WeakMap(), _cleanup = new WeakMap(), _setup = new WeakMap(), _d);
var focusManager = new FocusManager();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = (_e = class extends Subscribable {
  constructor() {
    super();
    __privateAdd(this, _online, true);
    __privateAdd(this, _cleanup2);
    __privateAdd(this, _setup2);
    __privateSet(this, _setup2, (onOnline) => {
      if (!isServer && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    });
  }
  onSubscribe() {
    if (!__privateGet(this, _cleanup2)) {
      this.setEventListener(__privateGet(this, _setup2));
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup2, void 0);
    }
  }
  setEventListener(setup) {
    var _a2;
    __privateSet(this, _setup2, setup);
    (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _cleanup2, setup(this.setOnline.bind(this)));
  }
  setOnline(online) {
    const changed = __privateGet(this, _online) !== online;
    if (changed) {
      __privateSet(this, _online, online);
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return __privateGet(this, _online);
  }
}, _online = new WeakMap(), _cleanup2 = new WeakMap(), _setup2 = new WeakMap(), _e);
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (isServer ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = (_f = class {
  constructor() {
    __privateAdd(this, _gcTimeout);
  }
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      __privateSet(this, _gcTimeout, timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime));
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (isServer ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (__privateGet(this, _gcTimeout)) {
      timeoutManager.clearTimeout(__privateGet(this, _gcTimeout));
      __privateSet(this, _gcTimeout, void 0);
    }
  }
}, _gcTimeout = new WeakMap(), _f);
var Query = (_g = class extends Removable {
  constructor(config) {
    super();
    __privateAdd(this, _Query_instances);
    __privateAdd(this, _initialState);
    __privateAdd(this, _revertState);
    __privateAdd(this, _cache);
    __privateAdd(this, _client);
    __privateAdd(this, _retryer);
    __privateAdd(this, _defaultOptions);
    __privateAdd(this, _abortSignalConsumed);
    __privateSet(this, _abortSignalConsumed, false);
    __privateSet(this, _defaultOptions, config.defaultOptions);
    this.setOptions(config.options);
    this.observers = [];
    __privateSet(this, _client, config.client);
    __privateSet(this, _cache, __privateGet(this, _client).getQueryCache());
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    __privateSet(this, _initialState, getDefaultState$1(this.options));
    this.state = config.state ?? __privateGet(this, _initialState);
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get promise() {
    return __privateGet(this, _retryer)?.promise;
  }
  setOptions(options) {
    this.options = { ...__privateGet(this, _defaultOptions), ...options };
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        __privateSet(this, _initialState, defaultState);
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      __privateGet(this, _cache).remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state, setStateOptions) {
    __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "setState", state, setStateOptions });
  }
  cancel(options) {
    const promise = __privateGet(this, _retryer)?.promise;
    __privateGet(this, _retryer)?.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  reset() {
    this.destroy();
    this.setState(__privateGet(this, _initialState));
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveEnabled(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    __privateGet(this, _retryer)?.continue();
  }
  onOnline() {
    const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    __privateGet(this, _retryer)?.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      __privateGet(this, _cache).notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
      if (!this.observers.length) {
        if (__privateGet(this, _retryer)) {
          if (__privateGet(this, _abortSignalConsumed)) {
            __privateGet(this, _retryer).cancel({ revert: true });
          } else {
            __privateGet(this, _retryer).cancelRetry();
          }
        }
        this.scheduleGc();
      }
      __privateGet(this, _cache).notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    __privateGet(this, _retryer)?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (__privateGet(this, _retryer)) {
        __privateGet(this, _retryer).continueRetry();
        return __privateGet(this, _retryer).promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x) => x.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          __privateSet(this, _abortSignalConsumed, true);
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: __privateGet(this, _client),
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      __privateSet(this, _abortSignalConsumed, false);
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: __privateGet(this, _client),
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    this.options.behavior?.onFetch(context, this);
    __privateSet(this, _revertState, this.state);
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "fetch", meta: context.fetchOptions?.meta });
    }
    __privateSet(this, _retryer, createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...__privateGet(this, _revertState),
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "failed", failureCount, error });
      },
      onPause: () => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "pause" });
      },
      onContinue: () => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    }));
    try {
      const data = await __privateGet(this, _retryer).start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      __privateGet(this, _cache).config.onSuccess?.(data, this);
      __privateGet(this, _cache).config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return __privateGet(this, _retryer).promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
        type: "error",
        error
      });
      __privateGet(this, _cache).config.onError?.(
        error,
        this
      );
      __privateGet(this, _cache).config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
}, _initialState = new WeakMap(), _revertState = new WeakMap(), _cache = new WeakMap(), _client = new WeakMap(), _retryer = new WeakMap(), _defaultOptions = new WeakMap(), _abortSignalConsumed = new WeakMap(), _Query_instances = new WeakSet(), dispatch_fn = function(action) {
  const reducer = (state) => {
    switch (action.type) {
      case "failed":
        return {
          ...state,
          fetchFailureCount: action.failureCount,
          fetchFailureReason: action.error
        };
      case "pause":
        return {
          ...state,
          fetchStatus: "paused"
        };
      case "continue":
        return {
          ...state,
          fetchStatus: "fetching"
        };
      case "fetch":
        return {
          ...state,
          ...fetchState(state.data, this.options),
          fetchMeta: action.meta ?? null
        };
      case "success":
        const newState = {
          ...state,
          ...successState(action.data, action.dataUpdatedAt),
          dataUpdateCount: state.dataUpdateCount + 1,
          ...!action.manual && {
            fetchStatus: "idle",
            fetchFailureCount: 0,
            fetchFailureReason: null
          }
        };
        __privateSet(this, _revertState, action.manual ? newState : void 0);
        return newState;
      case "error":
        const error = action.error;
        return {
          ...state,
          error,
          errorUpdateCount: state.errorUpdateCount + 1,
          errorUpdatedAt: Date.now(),
          fetchFailureCount: state.fetchFailureCount + 1,
          fetchFailureReason: error,
          fetchStatus: "idle",
          status: "error",
          // flag existing data as invalidated if we get a background error
          // note that "no data" always means stale so we can set unconditionally here
          isInvalidated: true
        };
      case "invalidate":
        return {
          ...state,
          isInvalidated: true
        };
      case "setState":
        return {
          ...state,
          ...action.state
        };
    }
  };
  this.state = reducer(this.state);
  notifyManager.batch(() => {
    this.observers.forEach((observer) => {
      observer.onQueryUpdate();
    });
    __privateGet(this, _cache).notify({ query: this, type: "updated", action });
  });
}, _g);
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var QueryObserver = (_h = class extends Subscribable {
  constructor(client2, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client2, client2);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client2).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client2).getQueryCache().build(__privateGet(this, _client2), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked?.(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client2).defaultQueryOptions(options);
    const query = __privateGet(this, _client2).getQueryCache().build(__privateGet(this, _client2), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          __privateGet(this, _lastQueryWithDefinedData)?.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult?.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === prevResultState?.data && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult?.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: newState.dataUpdateCount > 0 || newState.errorUpdateCount > 0,
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client2 = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!fetchOptions?.throwOnError) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (isServer || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (isServer || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client2).getQueryCache().build(__privateGet(this, _client2), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery?.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client2).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _h);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Mutation = (_i = class extends Removable {
  constructor(config) {
    super();
    __privateAdd(this, _Mutation_instances);
    __privateAdd(this, _client3);
    __privateAdd(this, _observers);
    __privateAdd(this, _mutationCache);
    __privateAdd(this, _retryer2);
    __privateSet(this, _client3, config.client);
    this.mutationId = config.mutationId;
    __privateSet(this, _mutationCache, config.mutationCache);
    __privateSet(this, _observers, []);
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!__privateGet(this, _observers).includes(observer)) {
      __privateGet(this, _observers).push(observer);
      this.clearGcTimeout();
      __privateGet(this, _mutationCache).notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    __privateSet(this, _observers, __privateGet(this, _observers).filter((x) => x !== observer));
    this.scheduleGc();
    __privateGet(this, _mutationCache).notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!__privateGet(this, _observers).length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        __privateGet(this, _mutationCache).remove(this);
      }
    }
  }
  continue() {
    return __privateGet(this, _retryer2)?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "continue" });
    };
    const mutationFnContext = {
      client: __privateGet(this, _client3),
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    __privateSet(this, _retryer2, createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "failed", failureCount, error });
      },
      onPause: () => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => __privateGet(this, _mutationCache).canRun(this)
    }));
    const restored = this.state.status === "pending";
    const isPaused = !__privateGet(this, _retryer2).canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pending", variables, isPaused });
        if (__privateGet(this, _mutationCache).config.onMutate) {
          await __privateGet(this, _mutationCache).config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, {
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await __privateGet(this, _retryer2).start();
      await __privateGet(this, _mutationCache).config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await __privateGet(this, _mutationCache).config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "success", data });
      return data;
    } catch (error) {
      try {
        await __privateGet(this, _mutationCache).config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await __privateGet(this, _mutationCache).config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "error", error });
      throw error;
    } finally {
      __privateGet(this, _mutationCache).runNext(this);
    }
  }
}, _client3 = new WeakMap(), _observers = new WeakMap(), _mutationCache = new WeakMap(), _retryer2 = new WeakMap(), _Mutation_instances = new WeakSet(), dispatch_fn2 = function(action) {
  const reducer = (state) => {
    switch (action.type) {
      case "failed":
        return {
          ...state,
          failureCount: action.failureCount,
          failureReason: action.error
        };
      case "pause":
        return {
          ...state,
          isPaused: true
        };
      case "continue":
        return {
          ...state,
          isPaused: false
        };
      case "pending":
        return {
          ...state,
          context: action.context,
          data: void 0,
          failureCount: 0,
          failureReason: null,
          error: null,
          isPaused: action.isPaused,
          status: "pending",
          variables: action.variables,
          submittedAt: Date.now()
        };
      case "success":
        return {
          ...state,
          data: action.data,
          failureCount: 0,
          failureReason: null,
          error: null,
          status: "success",
          isPaused: false
        };
      case "error":
        return {
          ...state,
          data: void 0,
          error: action.error,
          failureCount: state.failureCount + 1,
          failureReason: action.error,
          isPaused: false,
          status: "error"
        };
    }
  };
  this.state = reducer(this.state);
  notifyManager.batch(() => {
    __privateGet(this, _observers).forEach((observer) => {
      observer.onMutationUpdate(action);
    });
    __privateGet(this, _mutationCache).notify({
      mutation: this,
      type: "updated",
      action
    });
  });
}, _i);
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = (_j = class extends Subscribable {
  constructor(config = {}) {
    super();
    __privateAdd(this, _mutations);
    __privateAdd(this, _scopes);
    __privateAdd(this, _mutationId);
    this.config = config;
    __privateSet(this, _mutations, /* @__PURE__ */ new Set());
    __privateSet(this, _scopes, /* @__PURE__ */ new Map());
    __privateSet(this, _mutationId, 0);
  }
  build(client2, options, state) {
    const mutation = new Mutation({
      client: client2,
      mutationCache: this,
      mutationId: ++__privateWrapper(this, _mutationId)._,
      options: client2.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    __privateGet(this, _mutations).add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = __privateGet(this, _scopes).get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        __privateGet(this, _scopes).set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (__privateGet(this, _mutations).delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = __privateGet(this, _scopes).get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            __privateGet(this, _scopes).delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = __privateGet(this, _scopes).get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = __privateGet(this, _scopes).get(scope)?.find((m) => m !== mutation && m.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      __privateGet(this, _mutations).forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      __privateGet(this, _mutations).clear();
      __privateGet(this, _scopes).clear();
    });
  }
  getAll() {
    return Array.from(__privateGet(this, _mutations));
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
}, _mutations = new WeakMap(), _scopes = new WeakMap(), _mutationId = new WeakMap(), _j);
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var MutationObserver$1 = (_k = class extends Subscribable {
  constructor(client2, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client4);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client4, client2);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    this.options = __privateGet(this, _client4).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client4).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (__privateGet(this, _currentMutation)?.state.status === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      __privateGet(this, _currentMutation)?.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    __privateGet(this, _currentMutation)?.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    __privateSet(this, _mutateOptions, options);
    __privateGet(this, _currentMutation)?.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client4).getMutationCache().build(__privateGet(this, _client4), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client4 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  const state = __privateGet(this, _currentMutation)?.state ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client4),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if (action?.type === "success") {
        try {
          __privateGet(this, _mutateOptions).onSuccess?.(
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          __privateGet(this, _mutateOptions).onSettled?.(
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if (action?.type === "error") {
        try {
          __privateGet(this, _mutateOptions).onError?.(
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          __privateGet(this, _mutateOptions).onSettled?.(
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _k);
var QueryCache = (_l = class extends Subscribable {
  constructor(config = {}) {
    super();
    __privateAdd(this, _queries);
    this.config = config;
    __privateSet(this, _queries, /* @__PURE__ */ new Map());
  }
  build(client2, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client: client2,
        queryKey,
        queryHash,
        options: client2.defaultQueryOptions(options),
        state,
        defaultOptions: client2.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!__privateGet(this, _queries).has(query.queryHash)) {
      __privateGet(this, _queries).set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = __privateGet(this, _queries).get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        __privateGet(this, _queries).delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return __privateGet(this, _queries).get(queryHash);
  }
  getAll() {
    return [...__privateGet(this, _queries).values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
}, _queries = new WeakMap(), _l);
var QueryClient = (_m = class {
  constructor(config = {}) {
    __privateAdd(this, _queryCache);
    __privateAdd(this, _mutationCache2);
    __privateAdd(this, _defaultOptions2);
    __privateAdd(this, _queryDefaults);
    __privateAdd(this, _mutationDefaults);
    __privateAdd(this, _mountCount);
    __privateAdd(this, _unsubscribeFocus);
    __privateAdd(this, _unsubscribeOnline);
    __privateSet(this, _queryCache, config.queryCache || new QueryCache());
    __privateSet(this, _mutationCache2, config.mutationCache || new MutationCache());
    __privateSet(this, _defaultOptions2, config.defaultOptions || {});
    __privateSet(this, _queryDefaults, /* @__PURE__ */ new Map());
    __privateSet(this, _mutationDefaults, /* @__PURE__ */ new Map());
    __privateSet(this, _mountCount, 0);
  }
  mount() {
    __privateWrapper(this, _mountCount)._++;
    if (__privateGet(this, _mountCount) !== 1) return;
    __privateSet(this, _unsubscribeFocus, focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        __privateGet(this, _queryCache).onFocus();
      }
    }));
    __privateSet(this, _unsubscribeOnline, onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        __privateGet(this, _queryCache).onOnline();
      }
    }));
  }
  unmount() {
    var _a2, _b2;
    __privateWrapper(this, _mountCount)._--;
    if (__privateGet(this, _mountCount) !== 0) return;
    (_a2 = __privateGet(this, _unsubscribeFocus)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _unsubscribeFocus, void 0);
    (_b2 = __privateGet(this, _unsubscribeOnline)) == null ? void 0 : _b2.call(this);
    __privateSet(this, _unsubscribeOnline, void 0);
  }
  isFetching(filters) {
    return __privateGet(this, _queryCache).findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return __privateGet(this, _mutationCache2).findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return __privateGet(this, _queryCache).get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return __privateGet(this, _queryCache).findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = __privateGet(this, _queryCache).get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return __privateGet(this, _queryCache).build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return __privateGet(this, _queryCache).get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = __privateGet(this, _queryCache);
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = __privateGet(this, _queryCache);
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      __privateGet(this, _queryCache).findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return __privateGet(this, _mutationCache2).resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return __privateGet(this, _queryCache);
  }
  getMutationCache() {
    return __privateGet(this, _mutationCache2);
  }
  getDefaultOptions() {
    return __privateGet(this, _defaultOptions2);
  }
  setDefaultOptions(options) {
    __privateSet(this, _defaultOptions2, options);
  }
  setQueryDefaults(queryKey, options) {
    __privateGet(this, _queryDefaults).set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults2 = [...__privateGet(this, _queryDefaults).values()];
    const result = {};
    defaults2.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    __privateGet(this, _mutationDefaults).set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults2 = [...__privateGet(this, _mutationDefaults).values()];
    const result = {};
    defaults2.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...__privateGet(this, _defaultOptions2).queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...__privateGet(this, _defaultOptions2).mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    __privateGet(this, _queryCache).clear();
    __privateGet(this, _mutationCache2).clear();
  }
}, _queryCache = new WeakMap(), _mutationCache2 = new WeakMap(), _defaultOptions2 = new WeakMap(), _queryDefaults = new WeakMap(), _mutationDefaults = new WeakMap(), _mountCount = new WeakMap(), _unsubscribeFocus = new WeakMap(), _unsubscribeOnline = new WeakMap(), _m);
var QueryClientContext = reactExports.createContext(
  void 0
);
var useQueryClient = (queryClient2) => {
  const client2 = reactExports.useContext(QueryClientContext);
  if (!client2) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return client2;
};
var QueryClientProvider = ({
  client: client2,
  children
}) => {
  reactExports.useEffect(() => {
    client2.mount();
    return () => {
      client2.unmount();
    };
  }, [client2]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client2, children });
};
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient2) {
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client2 = useQueryClient();
  const defaultedOptions = client2.defaultQueryOptions(options);
  client2.getDefaultOptions().queries?._experimental_beforeQuery?.(
    defaultedOptions
  );
  const query = client2.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client2.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client2,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  client2.getDefaultOptions().queries?._experimental_afterQuery?.(
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !isServer && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query?.promise
    );
    promise?.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient2) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient2) {
  const client2 = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver$1(
      client2,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
const STALE_TIME = {
  /** Menu: 5 minutos (muda raramente) */
  MENU: 5 * 60 * 1e3,
  /** Eventos: 5 minutos (equilíbrio entre frescor e menos requests) */
  EVENTS: 5 * 60 * 1e3,
  /** Músicas: 5 minutos (catálogo estável) */
  TRACKS: 5 * 60 * 1e3,
  /** Produtos: 10 minutos (catálogo tende a ser estável durante a sessão) */
  PRODUCTS: 10 * 60 * 1e3,
  /** Perfil do usuário: 5 minutos */
  USER_PROFILE: 5 * 60 * 1e3,
  /** GamiPress: 1 minuto (pontos/achievements atualizam rápido) */
  GAMIPRESS: 1 * 60 * 1e3
};
const CACHE_TIME = {
  /** Padrão: 10 minutos */
  DEFAULT: 10 * 60 * 1e3
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache padrão: 5 minutos
      staleTime: STALE_TIME.TRACKS,
      // Garbage collection: 10 minutos
      gcTime: CACHE_TIME.DEFAULT,
      // Refetch ao focar na janela (útil para dados que mudam frequentemente)
      refetchOnWindowFocus: false,
      // Evita rajadas de refetch em reconexões curtas de rede mobile
      refetchOnReconnect: false,
      // Retry automático com backoff exponencial
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1e3 * 2 ** attemptIndex, 3e4),
      // Não refetch automaticamente em mount (usa cache)
      refetchOnMount: false
    },
    mutations: {
      // Retry para mutations (POST, PUT, DELETE)
      retry: 1
    }
  }
});
const QUERY_KEYS = {
  /** Menu de navegação */
  menu: {
    all: ["menu"],
    list: (lang) => ["menu", "list", lang]
  },
  /** Eventos */
  events: {
    all: ["events"],
    list: (params) => ["events", "list", params],
    detail: (id) => ["events", "detail", id]
  },
  /** Notícias/Posts */
  posts: {
    all: ["posts"],
    list: (lang) => ["posts", "list", lang],
    detail: (slug2) => ["posts", "detail", slug2]
  },
  /** Músicas/Tracks */
  tracks: {
    all: ["tracks"],
    list: (filters) => ["tracks", "list", filters],
    detail: (slug2) => ["tracks", "detail", slug2]
  },
  /** Produtos (Shop) */
  products: {
    all: ["products"],
    list: (lang) => ["products", "list", lang],
    collections: (lang, limit) => ["products", "collections", lang, limit],
    detail: (id) => ["products", "detail", id]
  },
  /** Carrinho */
  cart: {
    current: ["cart", "current"]
  },
  /** Usuário */
  user: {
    profile: (userId) => ["user", "profile", userId],
    orders: (userId, limit) => ["user", "orders", userId, limit],
    gamipress: (userId) => ["user", "gamipress", userId],
    leaderboard: (limit) => ["user", "leaderboard", limit]
  }
};
const invalidateQueries = {
  menu: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menu.all }),
  events: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all }),
  tracks: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tracks.all }),
  products: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all }),
  posts: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all }),
  cart: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.current }),
  user: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  leaderboard: () => queryClient.invalidateQueries({ queryKey: ["user", "leaderboard"] })
};
const clearAllCache = () => {
  queryClient.clear();
};
const UserContext = reactExports.createContext(void 0);
const UserProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [googleClientId, setGoogleClientId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [loadingInitial, setLoadingInitial] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const API_URL = `${window.location.origin}/wp-json/zeneyer-auth/v1`;
  const logout = reactExports.useCallback(() => {
    setUser(null);
    localStorage.removeItem("zen_jwt");
    localStorage.removeItem("zen_user");
    clearAllCache();
  }, []);
  reactExports.useEffect(() => {
    const init = async () => {
      try {
        const settingsRes = await fetch(`${API_URL}/settings`);
        const settingsText = await settingsRes.text();
        if (settingsText.trim().startsWith("<!DOCTYPE") || settingsText.trim().startsWith("<html")) {
          console.error("[UserContext] ❌ ERRO: Backend retornou HTML ao invés de JSON!");
          console.error("[UserContext] 💡 Possíveis causas:");
          console.error("  1. Plugin ZenEyer Auth não está ativo");
          console.error("  2. Rewrite rules não foram flushed (wp rewrite flush)");
          console.error("  3. .htaccess bloqueando o endpoint");
          setError("Plugin de autenticação não está configurado. Contate o administrador.");
          setLoadingInitial(false);
          return;
        }
        const settingsData = JSON.parse(settingsText);
        if (settingsData.success && settingsData.data.google_client_id) {
          setGoogleClientId(settingsData.data.google_client_id);
        } else {
          console.warn("[UserContext] ⚠️ Google Client ID não configurado");
        }
        const token = localStorage.getItem("zen_jwt");
        const savedUser = localStorage.getItem("zen_user");
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          fetch(`${API_URL}/auth/validate`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          }).then((res) => res.json()).then((data) => {
            if (!data.success) {
              logout();
            }
          }).catch((err) => {
            console.error("[UserContext] ❌ Erro na validação:", err);
          });
        }
      } catch (err) {
        console.error("[UserContext] ❌ Falha na inicialização:", err);
        setError("Erro ao conectar com o servidor de autenticação");
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, [logout, API_URL]);
  const saveSession = (userData, token) => {
    const userWithStatus = { ...userData, isLoggedIn: true, token };
    setUser(userWithStatus);
    localStorage.setItem("zen_jwt", token);
    localStorage.setItem("zen_user", JSON.stringify(userWithStatus));
  };
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const responseText = await res.text();
      if (responseText.trim().startsWith("<!DOCTYPE")) {
        throw new Error("Servidor retornou HTML. Verifique se o plugin está ativo.");
      }
      const json = JSON.parse(responseText);
      if (!json.success) {
        throw new Error(json.message || "Credenciais inválidas");
      }
      saveSession(json.data.user, json.data.token);
    } catch (err) {
      const error2 = err;
      console.error("[UserContext] ❌ Erro no login:", error2);
      setError(error2.message);
      throw error2;
    } finally {
      setLoading(false);
    }
  };
  const register = async (name, email, password, turnstileToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviando o token junto com os dados
        body: JSON.stringify({
          email,
          password,
          name,
          turnstileToken: turnstileToken || ""
          // Garante que envia string vazia se undefined
        })
      });
      const responseText = await res.text();
      if (responseText.trim().startsWith("<!DOCTYPE")) {
        throw new Error("Servidor retornou HTML. Verifique se o plugin está ativo.");
      }
      const json = JSON.parse(responseText);
      if (!json.success) {
        throw new Error(json.message || "Falha no registro");
      }
      saveSession(json.data.user, json.data.token);
    } catch (err) {
      const error2 = err;
      console.error("[UserContext] ❌ Erro no registro:", error2);
      setError(error2.message);
      throw error2;
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = async (idToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken })
      });
      const responseText = await res.text();
      if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        console.error("[UserContext] ❌ ERRO CRÍTICO: Backend retornou HTML!");
        console.error("[UserContext] 💡 Diagnóstico:");
        console.error("  Status:", res.status);
        console.error("  Content-Type:", res.headers.get("content-type"));
        console.error("  URL chamada:", `${API_URL}/auth/google`);
        throw new Error(
          "Servidor retornou HTML ao invés de JSON. Possíveis causas: (1) Plugin ZenEyer Auth não está ativo, (2) Rewrite rules não foram atualizadas (rode: wp rewrite flush), (3) .htaccess bloqueando requisições REST."
        );
      }
      const json = JSON.parse(responseText);
      if (!json.success) {
        throw new Error(json.message || "Falha no Google Login");
      }
      saveSession(json.data.user, json.data.token);
    } catch (err) {
      const error2 = err;
      console.error("[UserContext] ❌ Google Login falhou:", error2);
      setError(error2.message);
      throw error2;
    } finally {
      setLoading(false);
    }
  };
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Erro ao solicitar reset de senha");
      }
    } catch (err) {
      const error2 = err;
      console.error("[UserContext] ❌ Erro ao solicitar reset:", error2);
      setError(error2.message);
      throw error2;
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (key, login2, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/password/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, login: login2, password })
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Erro ao definir nova senha");
      }
    } catch (err) {
      const error2 = err;
      console.error("[UserContext] ❌ Erro ao resetar senha:", error2);
      setError(error2.message);
      throw error2;
    } finally {
      setLoading(false);
    }
  };
  const clearError = () => setError(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserContext.Provider, { value: {
    user,
    googleClientId,
    isAuthenticated: !!user,
    loading,
    loadingInitial,
    error,
    login,
    register,
    googleLogin,
    logout,
    requestPasswordReset,
    resetPassword,
    clearError
  }, children });
};
const useUser = () => {
  const context = reactExports.useContext(UserContext);
  if (context === void 0) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
const useAuth = useUser;
const getApiConfig = () => {
  if (window.wpData?.restUrl) {
    return {
      siteUrl: window.wpData.siteUrl || "",
      restUrl: window.wpData.restUrl || "",
      nonce: window.wpData.nonce || "",
      turnstileSiteKey: ""
    };
  }
  return {
    siteUrl: "https://djzeneyer.com",
    restUrl: "https://djzeneyer.com/wp-json/",
    nonce: "dev-nonce",
    turnstileSiteKey: ""
  };
};
const getRestUrl = () => {
  const config = getApiConfig();
  return config.restUrl.replace(/\/$/, "");
};
const getSiteUrl = () => {
  const config = getApiConfig();
  return config.siteUrl;
};
const getNonce = () => {
  const config = getApiConfig();
  return config.nonce;
};
const getTurnstileSiteKey = () => {
  const config = getApiConfig();
  return config.turnstileSiteKey;
};
const buildApiUrl = (endpoint, params) => {
  const baseUrl = getRestUrl();
  const cleanEndpoint = endpoint.replace(/^\//, "");
  let url = `${baseUrl}/${cleanEndpoint}`;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  return url;
};
const getAuthHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json"
  };
  const nonce = getNonce();
  if (nonce && nonce !== "dev-nonce") {
    headers["X-WP-Nonce"] = nonce;
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};
const CartContext = reactExports.createContext(void 0);
const CartProvider = ({ children }) => {
  const [cart, setCart] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const getCart = reactExports.useCallback(async () => {
    setLoading(true);
    const apiUrl = buildApiUrl("wc/store/v1/cart");
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Falha ao buscar carrinho");
      setCart(responseData);
    } catch (err) {
      const error = err;
      console.error("[CartContext] Erro ao buscar carrinho:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const removeItem = reactExports.useCallback(async (key) => {
    setLoading(true);
    const apiUrl = buildApiUrl(`wc/store/v1/cart/items/${key}`);
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": window.wpData?.nonce || ""
        },
        credentials: "include"
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove item");
      }
      await getCart();
    } catch (err) {
      const error = err;
      console.error("[CartContext] Error removing item:", error);
    } finally {
      setLoading(false);
    }
  }, [getCart]);
  const clearCart = reactExports.useCallback(async () => {
    setLoading(true);
    const apiUrl = buildApiUrl("wc/store/v1/cart/items");
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": window.wpData?.nonce || ""
        },
        credentials: "include"
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to clear cart");
      }
      await getCart();
    } catch (err) {
      const error = err;
      console.error("[CartContext] Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  }, [getCart]);
  const value = reactExports.useMemo(() => ({
    cart,
    getCart,
    removeItem,
    clearCart,
    loading
  }), [cart, getCart, removeItem, clearCart, loading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartContext.Provider, { value, children });
};
const useCart = () => {
  const context = reactExports.useContext(CartContext);
  if (context === void 0) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
const normalizeLanguage$2 = (lang) => {
  const normalized = (lang || "").trim().toLowerCase();
  return normalized.startsWith("pt") ? "pt" : "en";
};
const LanguageWrapper = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  reactExports.useEffect(() => {
    const pathname = location.pathname || "/";
    const targetLang = normalizeLanguage$2(pathname.startsWith("/pt") ? "pt" : "en");
    const currentLang = normalizeLanguage$2(i18n.resolvedLanguage || i18n.language || "en");
    if (currentLang !== targetLang) {
      i18n.changeLanguage(targetLang).catch((err) => {
        console.error("[LanguageWrapper] i18n.changeLanguage error:", err);
      });
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = targetLang;
    }
  }, [location.pathname, i18n]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
};
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/wp-content/themes/zentheme/dist/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$u = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$u);
const __iconNode$t = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$t);
const __iconNode$s = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$s);
const __iconNode$r = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$r);
const __iconNode$q = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$q);
const __iconNode$p = [
  [
    "path",
    {
      d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      key: "kmsa83"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode$p);
const __iconNode$o = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$o);
const __iconNode$n = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$n);
const __iconNode$m = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$m);
const __iconNode$l = [
  [
    "path",
    { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "1jg4f8" }
  ]
];
const Facebook = createLucideIcon("facebook", __iconNode$l);
const __iconNode$k = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$k);
const __iconNode$j = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$j);
const __iconNode$i = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$i);
const __iconNode$h = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
];
const Instagram = createLucideIcon("instagram", __iconNode$h);
const __iconNode$g = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$g);
const __iconNode$f = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$f);
const __iconNode$e = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$e);
const __iconNode$d = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$d);
const __iconNode$c = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$c);
const __iconNode$b = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode$b);
const __iconNode$a = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$a);
const __iconNode$9 = [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
];
const Music2 = createLucideIcon("music-2", __iconNode$9);
const __iconNode$8 = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$8);
const __iconNode$7 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$7);
const __iconNode$6 = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978", key: "1n3hpd" }],
  ["path", { d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978", key: "rfe1zi" }],
  ["path", { d: "M18 9h1.5a1 1 0 0 0 0-5H18", key: "7xy6bh" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z", key: "1mhfuq" }],
  ["path", { d: "M6 9H4.5a1 1 0 0 1 0-5H6", key: "tex48p" }]
];
const Trophy = createLucideIcon("trophy", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
      key: "1q2vi4"
    }
  ],
  ["path", { d: "m10 15 5-3-5-3z", key: "1jp15x" }]
];
const Youtube = createLucideIcon("youtube", __iconNode);
const START_YEAR = 2015;
const CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
const ARTIST = {
  // 🆔 Identidade
  identity: {
    stageName: "DJ Zen Eyer",
    shortName: "Zen Eyer",
    fullName: "Marcelo Eyer Fernandes",
    displayTitle: "Zen Eyer",
    birthDate: "1985-08-20",
    // Wikidata + MusicBrainz
    nationality: "Brazilian",
    legalName: "Marcelo Eyer Fernandes 44063765000146",
    // Wikidata CNPJ
    taxId: "44.063.765/0001-46"
  },
  // 🏆 Títulos e Credenciais (informação complementar, não contradiz Wikidata)
  titles: {
    primary: "World Champion Brazilian Zouk DJ (Best Remix & Best Performance)",
    event: "Ilha do Zouk DJ Championship",
    eventUrl: "https://alexdecarvalho.com.br/ilhadozouk/dj-championship/",
    location: "Ilha Grande, Rio de Janeiro, Brazil",
    year: 2022,
    categories: ["Best DJ Performance", "Best Remix"],
    description: "Winner of two world titles at Ilha do Zouk 2022: Best DJ Performance and Best Remix."
  },
  // 🧠 Diferencial (Mensa)
  mensa: {
    isMember: true,
    organization: "Mensa International",
    url: "https://www.mensa.org",
    description: "Member of the high IQ society (top 2%)."
  },
  // 📊 Estatísticas (estimativas / não conflitam com fontes externas)
  stats: {
    yearsActive: CURRENT_YEAR - START_YEAR,
    countriesPlayed: 11,
    eventsPlayed: (CURRENT_YEAR - START_YEAR) * 50,
    streamsTotal: "N/A",
    followersTotal: "N/A",
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  // 🌎 Festivais de Destaque
  // Datas adicionadas baseadas nos anos informados e calendário típico dos eventos
  // NOTA: Datas mantidas intencionalmente no passado para fins de autoridade/histórico.
  // NÃO ATUALIZAR para datas futuras estimadas a menos que confirmado.
  festivals: [
    {
      name: "One Zouk Congress",
      country: "Australia",
      flag: "🇦🇺",
      url: "https://www.onezoukcongress.com/",
      date: "2022-05-19"
      // Edição de 2022 (Maio)
    },
    {
      name: "Dutch Zouk",
      country: "Netherlands",
      flag: "🇳🇱",
      url: "https://www.dutchzouk.nl/",
      date: "2025-10-15"
      // Edição de 2025 (Outubro)
    },
    {
      name: "Prague Zouk Congress",
      country: "Czech Republic",
      flag: "🇨🇿",
      url: "https://www.praguezoukcongress.com/",
      date: "2017-07-27"
      // Edição de 2017 (Julho/Agosto)
    },
    {
      name: "LA Zouk Marathon",
      country: "United States",
      flag: "🇺🇸",
      url: "https://www.lazoukmarathon.com/",
      date: "2024-06-07"
      // Edição de 2024 (Junho)
    },
    {
      name: "Zurich Zouk Congress",
      country: "Switzerland",
      flag: "🇨🇭",
      url: "https://www.zurichzoukcongress.com/",
      date: "2023-09-22"
      // Data estimada baseada no calendário anual (Setembro)
    },
    {
      name: "Rio Zouk Congress",
      country: "Brazil",
      flag: "🇧🇷",
      url: "https://www.riozoukcongress.com/",
      date: "2025-01-10"
      // Edição de 2025 (Janeiro)
    },
    {
      name: "IZC Brazil",
      country: "Brazil",
      flag: "🇧🇷",
      url: "https://www.instagram.com/izcbrazil/",
      date: "2024-01-20"
      // Data estimada (Geralmente segue a temporada de Janeiro/Fev)
    },
    {
      name: "Polish Zouk Festival - Katowice",
      country: "Poland",
      flag: "🇵🇱",
      url: "https://www.polishzoukfestival.pl/",
      upcoming: true,
      date: "2025-11-20"
      // Data estimada para edição futura
    }
  ],
  // 🔗 Identificadores de Autoridade
  identifiers: {
    wikidata: "Q136551855",
    wikidataUrl: "https://www.wikidata.org/wiki/Q136551855",
    musicbrainz: "13afa63c-8164-4697-9cad-c5100062a154",
    musicbrainzUrl: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
    isni: "0000000528931015",
    discogs: "16872046",
    discogsUrl: "https://www.discogs.com/artist/16872046",
    residentAdvisor: "djzeneyer",
    residentAdvisorUrl: "https://ra.co/dj/djzeneyer",
    danceWikiFandom: "https://dance.fandom.com/wiki/Zen_Eyer",
    orcid: "0009-0006-2948-2148",
    knowledgeGraphId: "/g/11ff3mhh10",
    knowledgeGraphUrl: "https://www.google.com/search?kgmid=/g/11ff3mhh10"
  },
  // 📱 Redes Sociais / Plataformas
  social: {
    instagram: { handle: "@djzeneyer", url: "https://instagram.com/djzeneyer" },
    facebook: { handle: "djzeneyer", url: "https://facebook.com/djzeneyer" },
    youtube: { handle: "@djzeneyer", url: "https://www.youtube.com/@djzeneyer" },
    tiktok: { handle: "@djzeneyer", url: "https://www.tiktok.com/@djzeneyer" },
    twitter: { handle: "@djzeneyer", url: "https://x.com/djzeneyer" },
    twitch: { handle: "djzeneyer", url: "https://www.twitch.tv/djzeneyer" },
    linkedin: { handle: "eyermarcelo", url: "https://www.linkedin.com/in/eyermarcelo" },
    telegram: { handle: "djzeneyer", url: "https://t.me/djzeneyer" },
    soundcloud: { handle: "djzeneyer", url: "https://soundcloud.com/djzeneyer" },
    spotify: {
      id: "68SHKGndTlq3USQ2LZmyLw",
      url: "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
    },
    appleMusic: { url: "https://music.apple.com/artist/1439280950" },
    youtubeMusic: { url: "https://music.youtube.com/channel/UCEVHG-5iyNLWK3Zeungvdqg" },
    deezer: { url: "https://www.deezer.com/artist/52900762" },
    bandsintown: { url: "https://www.bandsintown.com/a/15619775" },
    mixcloud: { url: "https://www.mixcloud.com/djzeneyer" },
    bandcamp: { url: "https://djzeneyer.bandcamp.com" },
    lastfm: { url: "https://www.last.fm/music/Zen+Eyer" },
    songkick: { url: "https://www.songkick.com/artists/8815204-zen-eyer" },
    tidal: { url: "https://tidal.com/artist/10492592" },
    genius: { url: "https://genius.com/artists/Zen-eyer" },
    musixmatch: { url: "https://www.musixmatch.com/pt/artista/Zen-Eyer" },
    amazonMusic: { url: "https://music.amazon.com/artists/B07JKCDCG8" },
    audiomack: { url: "https://audiomack.com/djzeneyer" },
    boomplay: { url: "https://www.boomplay.com/artists/35157982" },
    napster: { url: "https://us.napster.com/artist/art.626690096" },
    qobuz: { url: "https://www.qobuz.com/artist/7501129" },
    reddit: { url: "https://www.reddit.com/user/djzeneyer" },
    crunchbase: { url: "https://www.crunchbase.com/organization/zen-eyer" },
    pinterest: { url: "https://www.pinterest.com/djzeneyer" }
  },
  // 📍 Contato
  contact: {
    email: "booking@djzeneyer.com",
    whatsapp: {
      number: "5521987413091",
      display: "+55 21 98741-3091"
    },
    location: {
      city: "Niterói",
      state: "RJ",
      country: "Brazil",
      areaDetail: "Born in Rio de Janeiro, based in Niterói"
    }
  },
  // 💰 Pagamentos & Doações (SSOT)
  payment: {
    interGlobal: {
      usd: {
        accountName: "MARCELO EYER FERNANDES",
        accountNumber: "889693163-5",
        achRouting: "026073150",
        wireRouting: "026073008",
        bankName: "Community Federal Savings Bank",
        bankAddress: "5 Penn Plaza, New York, NY 10001",
        beneficiaryBank: "Banco Inter SA",
        swiftCode: "ITEMBRSP",
        intermediaryBank: {
          name: "JP Morgan Chase N.A.",
          swift: "CHASUS33",
          aba: "021000021",
          account: "360556937"
        },
        iban: "BR9600416968000010007524137C1"
      },
      eur: {
        accountName: "MARCELO EYER FERNANDES",
        beneficiaryBank: "Banco Inter S.A.",
        swiftCode: "ITEMBRSP",
        intermediaryBank: {
          name: "J.P.Morgan AG",
          swift: "CHASDEFX"
        },
        iban: "BR9600416968000010007524137C1"
      },
      gbp: {
        accountName: "MARCELO EYER FERNANDES",
        beneficiaryBank: "Banco Inter S.A.",
        swiftCode: "ITEMBRSP",
        intermediaryBank: {
          name: "JPMORGAN CHASE BANK N.A., LONDON BRANCH",
          swift: "CHASGB2L"
        },
        iban: "BR9600416968000010007524137C1"
      },
      brazil: {
        accountName: "MARCELO EYER FERNANDES",
        cpf: "113.739.157-06",
        bank: "Banco Inter (077)",
        branch: "0001",
        account: "752413-7",
        pixKey: "21987413091"
      }
    },
    wise: {
      email: "eyer.marcelo@gmail.com",
      url: "https://wise.com/pay/me/marceloe131",
      eur: {
        accountName: "Marcelo Eyer Fernandes",
        iban: "BE09967420872757",
        swiftCode: "TRWIBEB1XXX",
        bankName: "Wise (Brussels, Belgium)",
        bankAddress: "Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium"
      }
    },
    paypal: {
      email: "eyer.marcelo@gmail.com",
      phone: "+5521987413091",
      businessId: "6BBTGNK7ZWUHY",
      me: "https://paypal.me/djzeneyer",
      donateUrl: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=6BBTGNK7ZWUHY&item_name=Mensagem%20Personalizada&currency_code=BRL&no_recurring=0"
    }
  },
  // 💡 Filosofia & Marca
  philosophy: {
    slogan: "A pressa é inimiga da cremosidade",
    style: "Cremosidade",
    styleDefinition: "Smooth, continuous Brazilian Zouk musical flow with long, seamless transitions that preserve emotional tension on the dance floor.",
    mission: "Bring the soul and passion of Brazilian Zouk to dancers around the world through immersive DJ sets and creative remixes."
  },
  // 🌐 Site / Navegação
  site: {
    baseUrl: "https://djzeneyer.com",
    defaultDescription: "Official website of DJ Zen Eyer, Brazilian Zouk DJ and music producer from Rio de Janeiro, member of Mensa International and 2× world champion at Ilha do Zouk DJ Championship.",
    pages: {
      home: "/",
      about: "/about",
      events: "/events",
      music: "/music",
      tribe: "/zentribe",
      presskit: "/work-with-me",
      shop: "/shop",
      faq: "/faq"
    }
  }
};
const getWhatsAppUrl = (message) => {
  const defaultMsg = "Olá Zen Eyer! Gostaria de conversar sobre booking.";
  return `https://wa.me/${ARTIST.contact.whatsapp.number}?text=${encodeURIComponent(
    message || defaultMsg
  )}`;
};
const getSocialUrls = () => Object.values(ARTIST.social).map((s) => s.url);
const getVerificationUrls = () => [
  ARTIST.identifiers.wikidataUrl,
  ARTIST.identifiers.knowledgeGraphUrl,
  ARTIST.identifiers.musicbrainzUrl,
  `https://isni.org/isni/${ARTIST.identifiers.isni}`,
  `https://orcid.org/${ARTIST.identifiers.orcid}`,
  ARTIST.identifiers.discogsUrl,
  ARTIST.identifiers.residentAdvisorUrl,
  ARTIST.identifiers.danceWikiFandom
];
const ARTIST_SCHEMA_BASE = {
  "@type": "MusicGroup",
  "@id": `${ARTIST.site.baseUrl}/#artist`,
  name: ARTIST.identity.stageName,
  alternateName: [ARTIST.identity.shortName, ARTIST.identity.fullName],
  description: `${ARTIST.titles.primary}. Known for the "${ARTIST.philosophy.style}" musical style.`,
  genre: ["Brazilian Zouk", "Zouk", "Dance Music", "Electronic"],
  url: ARTIST.site.baseUrl,
  foundingLocation: {
    "@type": "Place",
    name: `${ARTIST.contact.location.city}, ${ARTIST.contact.location.country}`
  },
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  sameAs: [...getSocialUrls(), ...getVerificationUrls()],
  award: [
    {
      "@type": "Award",
      name: "World Champion Brazilian Zouk DJ - Best Performance",
      datePublished: "2022"
    },
    {
      "@type": "Award",
      name: "World Champion Brazilian Zouk DJ - Best Remix",
      datePublished: "2022"
    }
  ],
  memberOf: {
    "@type": "Organization",
    name: ARTIST.mensa.organization,
    url: ARTIST.mensa.url
  },
  // 🌎 Conexão semântica com pioneiros e autoridades do Zouk Brasileiro
  // (fortalece o Grafo de Conhecimento e os sinais E-E-A-T)
  knowsAbout: [
    "Brazilian Zouk",
    "DJing",
    "Music Production",
    "Remixing",
    "Festival Performance",
    "Dance Music",
    "Lambada",
    "Cremosidade",
    "Zouk Music Theory"
  ],
  mentions: [
    {
      "@type": "Person",
      name: "Renata Peçanha",
      description: "Pioneer and major figure of Brazilian Zouk. Founder of Rio Zouk Congress.",
      url: "https://en.wikipedia.org/wiki/Brazilian_Zouk"
    },
    {
      "@type": "Person",
      name: "Adílio Porto",
      description: "Pioneer of Brazilian Zouk and Lambada, who helped systematize the foundational techniques of the dance."
    },
    {
      "@type": "Organization",
      name: "Brazilian Zouk Council",
      alternateName: "BZC",
      description: "International governing body for Brazilian Zouk, defining official techniques and standards.",
      url: "https://www.brazilianzoukcouncil.com/"
    }
  ],
  performerIn: [
    {
      "@type": "DanceEvent",
      name: "Rio Zouk Congress",
      description: "Largest Brazilian Zouk congress in Brazil, organized by Renata Peçanha.",
      location: {
        "@type": "Place",
        name: "Rio de Janeiro, Brazil"
      },
      organizer: {
        "@type": "Person",
        name: "Renata Peçanha"
      }
    },
    {
      "@type": "DanceEvent",
      name: "Ilha do Zouk DJ Championship",
      description: "Brazilian Zouk World Championship event in Ilha Grande, Rio de Janeiro, Brazil.",
      location: {
        "@type": "Place",
        name: "Ilha Grande, Rio de Janeiro, Brazil"
      },
      startDate: "2022"
    }
  ]
};
const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object;
let {
  apply,
  construct
} = typeof Reflect !== "undefined" && Reflect;
if (!freeze) {
  freeze = function freeze2(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal2(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
const text = freeze(["#text"]);
const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR,
  ATTR_WHITESPACE,
  CUSTOM_ELEMENT,
  DATA_ATTR,
  DOCTYPE_NAME,
  ERB_EXPR,
  IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR,
  TMPLIT_EXPR
});
const NODE_TYPE = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
};
const getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
const _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.3.2";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element: Element2,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element2.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = create(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    if (!objectHasOwnProperty(cfg, "ADD_TAGS")) {
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
    }
    if (!objectHasOwnProperty(cfg, "ADD_ATTR")) {
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    }
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (cfg.ADD_FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element2 && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (FORBID_ATTR[lcName]) {
      return false;
    }
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l = attributes.length;
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      if (typeof dirty.toString === "function") {
        dirty = dirty.toString();
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      } else {
        throw typeErrorCreate("toString is not a function");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();
const sanitizeHtml = (html2) => {
  if (!html2) return "";
  return purify.sanitize(html2, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "span",
      "div",
      "img",
      "blockquote"
    ],
    ALLOWED_ATTR: ["href", "target", "src", "alt", "class", "id", "title"]
  });
};
const TRUSTED_DOMAINS = [
  "djzeneyer.com",
  "localhost",
  "127.0.0.1",
  "pagbank.com.br",
  "pagseguro.uol.com.br",
  "spotify.com",
  "soundcloud.com",
  "instagram.com",
  "facebook.com",
  "youtube.com",
  "wa.me",
  "whatsapp.com",
  "bandsintown.com",
  "google.com"
];
const isInternalPath = (path2) => {
  if (!path2) return false;
  const trimmed = path2.trim();
  return trimmed.startsWith("/") && !trimmed.startsWith("//") || trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed === "#" || trimmed.startsWith("#");
};
const safeUrl = (url, fallback = "#") => {
  if (!url) return fallback;
  const trimmedUrl = url.trim();
  const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
  try {
    if (isInternalPath(trimmedUrl)) {
      return trimmedUrl;
    }
    if (trimmedUrl.startsWith("//")) {
      const domain2 = trimmedUrl.substring(2).split("/")[0].split(":")[0].toLowerCase();
      if (TRUSTED_DOMAINS.some((trusted) => domain2 === trusted || domain2.endsWith("." + trusted))) {
        return trimmedUrl;
      }
      return fallback;
    }
    const parsed = new URL(trimmedUrl);
    if (!allowedProtocols.includes(parsed.protocol)) {
      return fallback;
    }
    const domain = parsed.hostname.toLowerCase();
    TRUSTED_DOMAINS.some((trusted) => domain === trusted || domain.endsWith("." + trusted));
    return trimmedUrl;
  } catch {
    if (/^(javascript|data|vbscript|file|about):/i.test(trimmedUrl)) {
      return fallback;
    }
    if (allowedProtocols.some((proto) => trimmedUrl.toLowerCase().startsWith(proto))) {
      return trimmedUrl;
    }
    return isInternalPath(trimmedUrl) ? trimmedUrl : fallback;
  }
};
const safeRedirect = (url, fallback = "/") => {
  if (!url) return fallback;
  if (isInternalPath(url)) {
    return url;
  }
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase();
    if (TRUSTED_DOMAINS.some((trusted) => domain === trusted || domain.endsWith("." + trusted))) {
      return url;
    }
  } catch {
  }
  return fallback;
};
const sanitizePath = (path2) => {
  if (!path2) return "/";
  let clean = path2.replace(/^[a-zA-Z]+:\/*|^[\\/]+/g, "/");
  clean = "/" + clean.replace(/[^\w./?=&#%-]/g, "").replace(/\/+/g, "/").replace(/^\/+/, "");
  if (/^(javascript|data|vbscript):/i.test(clean)) return "/";
  return clean;
};
const ensureTrailingSlash = (url) => {
  if (!url) return "/";
  if (url.endsWith("/")) return url;
  const hasQuery = url.includes("?");
  const hasHash = url.includes("#");
  if (hasQuery || hasHash) {
    const [basePath, ...rest] = url.split(/(\?|#)/);
    return `${basePath}/${rest.join("")}`;
  }
  if (/\.[a-z0-9]{2,4}$/i.test(url)) return url;
  return `${url}/`;
};
const ensureAbsoluteUrl = (u, baseUrl) => {
  if (!u) return baseUrl;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = u.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};
const HeadlessSEO = React.memo(({
  data,
  schema,
  title,
  description,
  url,
  image,
  type = "website",
  hrefLang = [],
  noindex = false,
  keywords,
  isHomepage = false,
  preload: preload2 = [],
  locale,
  leadAnswer,
  faqs,
  events
}) => {
  const baseUrl = ARTIST.site.baseUrl;
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = normalizeLanguage$1(i18n.language || "en");
  const computedHrefLang = React.useMemo(() => {
    if (hrefLang && hrefLang.length > 0) return hrefLang;
    const links = [];
    const siteUrlClean = baseUrl.replace(/\/$/, "");
    try {
      const alternates = getAlternateLinks(location.pathname, currentLang);
      Object.entries(alternates).forEach(([lang, path2]) => {
        const safePath = path2.startsWith("/") ? path2 : `/${path2}`;
        const url2 = ensureTrailingSlash(`${siteUrlClean}${safePath}`);
        if (lang === "x-default") {
          links.push({ lang: "x-default", url: url2 });
        } else {
          links.push({ lang: lang === "pt" ? "pt-BR" : "en", url: url2 });
        }
      });
    } catch (err) {
      console.error("Error generating alternate links:", err);
    }
    return links;
  }, [hrefLang, location.pathname, currentLang, baseUrl]);
  const rawDescription = data?.desc || description || ARTIST.site.defaultDescription;
  const finalTitle = data?.title || title || "DJ Zen Eyer | World Champion Brazilian Zouk DJ";
  const finalDescription = leadAnswer ? `${leadAnswer.trim()}${leadAnswer.endsWith(".") ? "" : "."} ${rawDescription}` : rawDescription;
  const truncatedDesc = finalDescription.length > 160 ? `${finalDescription.substring(0, 157)}...` : finalDescription;
  const finalUrlRaw = data?.canonical || url || baseUrl;
  const absoluteUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);
  const finalUrl = safeUrl(ensureTrailingSlash(absoluteUrl));
  const defaultImage = `${baseUrl}/images/zen-eyer-og-image.png`;
  const finalImage = safeUrl(ensureAbsoluteUrl(data?.image || image || defaultImage, baseUrl), defaultImage);
  const shouldNoIndex = data?.noindex || noindex;
  let currentLocale = locale;
  if (!currentLocale) {
    currentLocale = currentLang === "pt" ? "pt_BR" : "en_US";
  }
  const htmlLangAttribute = currentLocale === "pt_BR" ? "pt-BR" : "en";
  const nameParts = ARTIST.identity.fullName.split(" ").filter(Boolean);
  const authorFirstName = nameParts[0] || ARTIST.identity.stageName;
  const authorLastName = nameParts.slice(1).join(" ") || ARTIST.identity.stageName;
  const isProfileType = type === "profile";
  let finalSchema = schema;
  if (!finalSchema && isHomepage) {
    finalSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          url: baseUrl,
          name: "DJ Zen Eyer - Official Website",
          description: ARTIST.site.defaultDescription,
          publisher: { "@id": `${baseUrl}/#artist` },
          inLanguage: ["en", "pt-BR"]
        },
        { ...ARTIST_SCHEMA_BASE, "@id": `${baseUrl}/#artist` },
        {
          "@type": "WebPage",
          "@id": `${baseUrl}/#webpage`,
          url: baseUrl,
          name: finalTitle,
          isPartOf: { "@id": `${baseUrl}/#website` },
          about: { "@id": `${baseUrl}/#artist` },
          mainEntityOfPage: { "@id": `${baseUrl}/#artist` },
          description: truncatedDesc,
          inLanguage: htmlLangAttribute
        }
      ]
    };
  }
  if (!schema) {
    const graph = [];
    const siteUrlClean = baseUrl.replace(/\/$/, "");
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const breadcrumbList = {
        "@type": "BreadcrumbList",
        "@id": `${finalUrl}#breadcrumb`,
        itemListElement: pathSegments.map((segment, index) => {
          const path2 = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@id": `${siteUrlClean}${path2}${isLast ? "" : "/"}`,
              name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
            }
          };
        })
      };
      graph.push(breadcrumbList);
    }
    if (faqs && faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a
          }
        }))
      });
    }
    if (events && events.length > 0) {
      events.forEach((event) => {
        const eventTitle = event.title?.rendered || event.title || event.name || "Zouk Event";
        const startDate = event.starts_at || event.event_date || event.start_date;
        const endDate = event.ends_at || event.end_date;
        const locName = event.location?.venue || event.event_location || "TBA";
        let eventOffers = void 0;
        const ticketUrl = event.event_ticket || event.tickets && event.tickets[0]?.url || event.offers && event.offers[0]?.url;
        if (ticketUrl) {
          eventOffers = {
            "@type": "Offer",
            url: ticketUrl,
            availability: "https://schema.org/InStock",
            validFrom: startDate
          };
        }
        graph.push({
          "@type": "Event",
          name: eventTitle,
          startDate,
          ...endDate ? { endDate } : {},
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: locName.toLowerCase().includes("online") ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: locName,
            address: {
              "@type": "PostalAddress",
              streetAddress: locName,
              addressLocality: event.location?.city || "",
              addressCountry: event.location?.country || ""
            }
          },
          image: event.image || finalImage,
          description: (event.description || event.desc || "").replace(/<[^>]*>?/gm, "").substring(0, 300),
          performer: {
            "@type": "Person",
            name: ARTIST.identity.stageName,
            sameAs: ARTIST.social.instagram
          },
          ...eventOffers ? { offers: eventOffers } : {}
        });
      });
    }
    const webPageSchema = {
      "@type": "WebPage",
      "@id": `${finalUrl}#webpage`,
      url: finalUrl,
      name: finalTitle,
      isPartOf: { "@id": `${baseUrl}/#website` },
      about: { "@id": `${baseUrl}/#artist` },
      description: truncatedDesc,
      inLanguage: htmlLangAttribute
    };
    if (graph.length > 0) {
      finalSchema = {
        "@context": "https://schema.org",
        "@graph": [
          ...isHomepage ? [
            {
              "@type": "WebSite",
              "@id": `${baseUrl}/#website`,
              url: baseUrl,
              name: "DJ Zen Eyer",
              publisher: { "@id": `${baseUrl}/#artist` }
            },
            { ...ARTIST_SCHEMA_BASE, "@id": `${baseUrl}/#artist` }
          ] : [],
          webPageSchema,
          ...graph
        ]
      };
    } else if (isHomepage) {
      finalSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            url: baseUrl,
            name: "DJ Zen Eyer - Official Website",
            description: ARTIST.site.defaultDescription,
            publisher: { "@id": `${baseUrl}/#artist` },
            inLanguage: ["en", "pt-BR"]
          },
          { ...ARTIST_SCHEMA_BASE, "@id": `${baseUrl}/#artist` },
          webPageSchema
        ]
      };
    } else {
      finalSchema = webPageSchema;
    }
  }
  const schemaId = isHomepage ? "homepage-schema" : `schema-${location.pathname.replace(/\//g, "-")}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("html", { lang: htmlLangAttribute }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { charSet: "utf-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "theme-color", content: "#000000" }),
    preload2.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preload", ...item, href: safeUrl(item.href) }, `preload-${index}`)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: finalTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: truncatedDesc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "canonical", href: finalUrl }),
    keywords && /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "keywords", content: keywords }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "author", content: ARTIST.identity.stageName }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "creator", content: ARTIST.identity.fullName }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "publisher", content: ARTIST.identity.stageName }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "subject", content: "Brazilian Zouk DJ & Music Producer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "meta",
      {
        name: "robots",
        content: shouldNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:site_name", content: "DJ Zen Eyer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:title", content: finalTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:description", content: truncatedDesc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:url", content: finalUrl }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image", content: finalImage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image:secure_url", content: finalImage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:locale", content: currentLocale }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:locale:alternate", content: currentLocale === "en_US" ? "pt_BR" : "en_US" }),
    isProfileType && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "profile:first_name", content: authorFirstName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "profile:last_name", content: authorLastName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "profile:username", content: "djzeneyer" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:title", content: finalTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:description", content: truncatedDesc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:image", content: finalImage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:site", content: "@djzeneyer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:creator", content: "@djzeneyer" }),
    computedHrefLang.map(({ lang, url: hrefUrl }) => /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "alternate", hrefLang: lang, href: safeUrl(hrefUrl) }, lang)),
    finalSchema && /* @__PURE__ */ jsxRuntimeExports.jsx("script", { type: "application/ld+json", children: JSON.stringify(finalSchema).replace(/</g, "\\u003c") }, schemaId)
  ] });
});
const fetchMenuFn = async (lang) => {
  const apiUrl = buildApiUrl("djzeneyer/v1/menu", { lang });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to fetch menu");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
const fetchEventsFn = async ({
  mode = "upcoming",
  days,
  date,
  limit = 10,
  lang
} = {}) => {
  try {
    const params = {
      mode,
      limit: String(limit)
    };
    if (days !== void 0) params.days = String(days);
    if (date) params.date = date;
    if (lang) params.lang = lang;
    const apiUrl = buildApiUrl("zen-bit/v2/events", params);
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error(`Events API Error: ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.events))
      return data.events;
    return [];
  } catch (err) {
    console.error("Fetch Events failed:", err);
    return [];
  }
};
const fetchTracksFn = async () => {
  const apiUrl = buildApiUrl("wp/v2/remixes", {
    per_page: "100",
    // OPTIMIZATION: Limit fields to reduce payload size
    _fields: "id,title,category_name,tag_names,links,featured_image_src,slug"
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to fetch tracks");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
const fetchNewsFn = async (lang) => {
  const apiUrl = buildApiUrl("wp/v2/posts", {
    per_page: "10",
    ...{ lang },
    // OPTIMIZATION: Replaced _embed=true with targeted fields
    _fields: "id,date,slug,title,excerpt,featured_image_src,featured_image_src_full,author_name"
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to fetch news posts");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
const fetchProductsFn = async (lang, filters = {}) => {
  const params = { per_page: "100", ...filters };
  params.lang = lang;
  const apiUrl = buildApiUrl("djzeneyer/v1/products", params);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
const useMenuQuery = (lang) => {
  return useQuery({
    queryKey: QUERY_KEYS.menu.list(lang),
    queryFn: () => fetchMenuFn(lang),
    staleTime: STALE_TIME.MENU,
    retry: 1
  });
};
const useEventsQuery = (params = {}, options) => {
  const normalizedParams = {
    mode: params.mode ?? (params.upcomingOnly === false ? "all" : "upcoming"),
    days: params.days,
    date: params.date,
    limit: params.limit ?? 10,
    lang: params.lang
  };
  return useQuery({
    queryKey: QUERY_KEYS.events.list(normalizedParams),
    queryFn: () => fetchEventsFn(normalizedParams),
    staleTime: STALE_TIME.EVENTS,
    retry: 2,
    ...options
  });
};
const useTracksQuery = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.tracks.list(),
    queryFn: fetchTracksFn,
    staleTime: STALE_TIME.TRACKS,
    gcTime: 15 * 60 * 1e3,
    ...options
  });
};
const useTrackBySlug = (slug2) => {
  return useQuery({
    queryKey: ["tracks", "detail", slug2],
    queryFn: async () => {
      if (!slug2) return null;
      const apiUrl = buildApiUrl("wp/v2/remixes", {
        slug: slug2,
        _fields: "id,title,content,excerpt,links,featured_image_src_full,slug"
      });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch track");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    },
    enabled: !!slug2,
    staleTime: STALE_TIME.TRACKS
  });
};
function extractZenBitEventId(routeParam) {
  if (!routeParam) return routeParam;
  if (!routeParam.includes("-")) return routeParam;
  const last = routeParam.split("-").pop() ?? routeParam;
  if (/^\d+$/.test(last)) return last;
  return last;
}
const useEventById = (routeParam, options) => {
  const eventId = routeParam ? extractZenBitEventId(routeParam) : void 0;
  return useQuery({
    // queryKey usa routeParam original para diferenciar entradas de cache distintas
    queryKey: QUERY_KEYS.events.detail(routeParam || ""),
    queryFn: async () => {
      if (!eventId) return null;
      try {
        const apiUrl = buildApiUrl(`zen-bit/v2/events/${eventId}`);
        const res = await fetch(apiUrl);
        if (!res.ok) {
          console.error(`Event Detail API ${res.status}`);
          return null;
        }
        const data = await res.json();
        return data?.event || null;
      } catch (err) {
        console.error("Zen BIT Event detail fetch failed:", err);
        return null;
      }
    },
    enabled: !!eventId,
    // Detalhe tem TTL maior (24h no backend)
    staleTime: 24 * 60 * 60 * 1e3,
    ...options
  });
};
const useShopPageQuery = (lang) => {
  return useQuery({
    queryKey: ["shop_page", lang],
    queryFn: async () => {
      const apiUrl = buildApiUrl("djzeneyer/v1/shop/page", { lang: lang || "en" });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch shop page view-model");
      return res.json();
    },
    staleTime: STALE_TIME.PRODUCTS
  });
};
const useAddToCartMutation = () => {
  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const apiUrl = buildApiUrl("wc/store/v1/cart/add-item");
      const nonce = window.wpData?.nonce ?? "";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce
        },
        credentials: "include",
        body: JSON.stringify({ id: productId, quantity })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add item to cart");
      return data;
    },
    onSuccess: () => {
      invalidateQueries.cart();
    }
  });
};
const useGamipressQuery = (userId, token) => {
  return useQuery({
    // Usa boolean do token na queryKey — evita colocar JWT longo no cache
    queryKey: [...QUERY_KEYS.user.gamipress(userId || 0), !!token],
    queryFn: async () => {
      const apiUrl = buildApiUrl("zengame/v1/me");
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const nonce = window.wpData?.nonce;
      if (nonce) headers["X-WP-Nonce"] = nonce;
      const res = await fetch(apiUrl, { headers, credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch gamipress: ${res.status}`);
      return res.json();
    },
    staleTime: STALE_TIME.GAMIPRESS,
    refetchInterval: 6e4,
    enabled: Boolean(token),
    retry: false
  });
};
const useProfileQuery = (token) => {
  return useQuery({
    queryKey: ["user", "profile", !!token],
    queryFn: async () => {
      if (!token) return null;
      const apiUrl = buildApiUrl("zeneyer-auth/v1/profile");
      const res = await fetch(apiUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return data.success ? data.data : null;
    },
    enabled: !!token,
    staleTime: STALE_TIME.USER_PROFILE
  });
};
const useUserOrdersQuery = (userId, token, limit = 5) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.user.orders(userId, limit), !!token],
    queryFn: async () => {
      if (!token || !userId) return [];
      const apiUrl = buildApiUrl("zeneyer-auth/v1/orders", {
        limit: String(limit)
      });
      const res = await fetch(apiUrl, {
        headers: getAuthHeaders(token)
      });
      if (!res.ok) throw new Error("Failed to fetch user orders");
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
    enabled: Boolean(token && userId),
    staleTime: STALE_TIME.USER_PROFILE,
    retry: false
  });
};
const useUpdateProfileMutation = (token) => {
  return useMutation({
    mutationFn: async (profileData) => {
      if (!token) throw new Error("No token provided");
      const apiUrl = buildApiUrl("zeneyer-auth/v1/profile");
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      return data;
    }
  });
};
const useNewsletterStatusQuery = (token) => {
  return useQuery({
    queryKey: ["user", "newsletter", !!token],
    queryFn: async () => {
      if (!token) return null;
      const apiUrl = buildApiUrl("zeneyer-auth/v1/newsletter");
      const res = await fetch(apiUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch newsletter status");
      const data = await res.json();
      return data.success ? data.subscribed : false;
    },
    enabled: !!token,
    staleTime: STALE_TIME.USER_PROFILE
  });
};
const useUpdateNewsletterMutation = (token) => {
  return useMutation({
    mutationFn: async (enabled) => {
      if (!token) throw new Error("No token provided");
      const apiUrl = buildApiUrl("zeneyer-auth/v1/newsletter");
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ enabled })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      return data;
    }
  });
};
const useSubscriptionMutation = () => {
  return useMutation({
    mutationFn: async (email) => {
      const apiUrl = buildApiUrl("djzeneyer/v1/subscribe");
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Subscription failed");
      return data;
    }
  });
};
const patternSvg = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='540'%20height='450'%20viewBox='0%200%201080%20900'%3e%3crect%20width='1080'%20height='900'%20fill='%2300b7ff'/%3e%3cg%20fill-opacity='.1'%3e%3cpolygon%20fill='%23444'%20points='90%20150%200%20300%20180%20300'/%3e%3cpolygon%20points='90%20150%20180%200%200%200'/%3e%3cpolygon%20fill='%23AAA'%20points='270%20150%20360%200%20180%200'/%3e%3cpolygon%20fill='%23DDD'%20points='450%20150%20360%20300%20540%20300'/%3e%3cpolygon%20fill='%23999'%20points='450%20150%20540%200%20360%200'/%3e%3cpolygon%20points='630%20150%20540%20300%20720%20300'/%3e%3cpolygon%20fill='%23DDD'%20points='630%20150%20720%200%20540%200'/%3e%3cpolygon%20fill='%23444'%20points='810%20150%20720%20300%20900%20300'/%3e%3cpolygon%20fill='%23FFF'%20points='810%20150%20900%200%20720%200'/%3e%3cpolygon%20fill='%23DDD'%20points='990%20150%20900%20300%201080%20300'/%3e%3cpolygon%20fill='%23444'%20points='990%20150%201080%200%20900%200'/%3e%3cpolygon%20fill='%23DDD'%20points='90%20450%200%20600%20180%20600'/%3e%3cpolygon%20points='90%20450%20180%20300%200%20300'/%3e%3cpolygon%20fill='%23666'%20points='270%20450%20180%20600%20360%20600'/%3e%3cpolygon%20fill='%23AAA'%20points='270%20450%20360%20300%20180%20300'/%3e%3cpolygon%20fill='%23DDD'%20points='450%20450%20360%20600%20540%20600'/%3e%3cpolygon%20fill='%23999'%20points='450%20450%20540%20300%20360%20300'/%3e%3cpolygon%20fill='%23999'%20points='630%20450%20540%20600%20720%20600'/%3e%3cpolygon%20fill='%23FFF'%20points='630%20450%20720%20300%20540%20300'/%3e%3cpolygon%20points='810%20450%20720%20600%20900%20600'/%3e%3cpolygon%20fill='%23DDD'%20points='810%20450%20900%20300%20720%20300'/%3e%3cpolygon%20fill='%23AAA'%20points='990%20450%20900%20600%201080%20600'/%3e%3cpolygon%20fill='%23444'%20points='990%20450%201080%20300%20900%20300'/%3e%3cpolygon%20fill='%23222'%20points='90%20750%200%20900%20180%20900'/%3e%3cpolygon%20points='270%20750%20180%20900%20360%20900'/%3e%3cpolygon%20fill='%23DDD'%20points='270%20750%20360%20600%20180%20600'/%3e%3cpolygon%20points='450%20750%20540%20600%20360%20600'/%3e%3cpolygon%20points='630%20750%20540%20900%20720%20900'/%3e%3cpolygon%20fill='%23444'%20points='630%20750%20720%20600%20540%20600'/%3e%3cpolygon%20fill='%23AAA'%20points='810%20750%20720%20900%20900%20900'/%3e%3cpolygon%20fill='%23666'%20points='810%20750%20900%20600%20720%20600'/%3e%3cpolygon%20fill='%23999'%20points='990%20750%20900%20900%201080%20900'/%3e%3cpolygon%20fill='%23999'%20points='180%200%2090%20150%20270%20150'/%3e%3cpolygon%20fill='%23444'%20points='360%200%20270%20150%20450%20150'/%3e%3cpolygon%20fill='%23FFF'%20points='540%200%20450%20150%20630%20150'/%3e%3cpolygon%20points='900%200%20810%20150%20990%20150'/%3e%3cpolygon%20fill='%23222'%20points='0%20300%20-90%20450%2090%20450'/%3e%3cpolygon%20fill='%23FFF'%20points='0%20300%2090%20150%20-90%20150'/%3e%3cpolygon%20fill='%23FFF'%20points='180%20300%2090%20450%20270%20450'/%3e%3cpolygon%20fill='%23666'%20points='180%20300%20270%20150%2090%20150'/%3e%3cpolygon%20fill='%23222'%20points='360%20300%20270%20450%20450%20450'/%3e%3cpolygon%20fill='%23FFF'%20points='360%20300%20450%20150%20270%20150'/%3e%3cpolygon%20fill='%23444'%20points='540%20300%20450%20450%20630%20450'/%3e%3cpolygon%20fill='%23222'%20points='540%20300%20630%20150%20450%20150'/%3e%3cpolygon%20fill='%23AAA'%20points='720%20300%20630%20450%20810%20450'/%3e%3cpolygon%20fill='%23666'%20points='720%20300%20810%20150%20630%20150'/%3e%3cpolygon%20fill='%23FFF'%20points='900%20300%20810%20450%20990%20450'/%3e%3cpolygon%20fill='%23999'%20points='900%20300%20990%20150%20810%20150'/%3e%3cpolygon%20points='0%20600%20-90%20750%2090%20750'/%3e%3cpolygon%20fill='%23666'%20points='0%20600%2090%20450%20-90%20450'/%3e%3cpolygon%20fill='%23AAA'%20points='180%20600%2090%20750%20270%20750'/%3e%3cpolygon%20fill='%23444'%20points='180%20600%20270%20450%2090%20450'/%3e%3cpolygon%20fill='%23444'%20points='360%20600%20270%20750%20450%20750'/%3e%3cpolygon%20fill='%23999'%20points='360%20600%20450%20450%20270%20450'/%3e%3cpolygon%20fill='%23666'%20points='540%20600%20630%20450%20450%20450'/%3e%3cpolygon%20fill='%23222'%20points='720%20600%20630%20750%20810%20750'/%3e%3cpolygon%20fill='%23FFF'%20points='900%20600%20810%20750%20990%20750'/%3e%3cpolygon%20fill='%23222'%20points='900%20600%20990%20450%20810%20450'/%3e%3cpolygon%20fill='%23DDD'%20points='0%20900%2090%20750%20-90%20750'/%3e%3cpolygon%20fill='%23444'%20points='180%20900%20270%20750%2090%20750'/%3e%3cpolygon%20fill='%23FFF'%20points='360%20900%20450%20750%20270%20750'/%3e%3cpolygon%20fill='%23AAA'%20points='540%20900%20630%20750%20450%20750'/%3e%3cpolygon%20fill='%23FFF'%20points='720%20900%20810%20750%20630%20750'/%3e%3cpolygon%20fill='%23222'%20points='900%20900%20990%20750%20810%20750'/%3e%3cpolygon%20fill='%23222'%20points='1080%20300%20990%20450%201170%20450'/%3e%3cpolygon%20fill='%23FFF'%20points='1080%20300%201170%20150%20990%20150'/%3e%3cpolygon%20points='1080%20600%20990%20750%201170%20750'/%3e%3cpolygon%20fill='%23666'%20points='1080%20600%201170%20450%20990%20450'/%3e%3cpolygon%20fill='%23DDD'%20points='1080%20900%201170%20750%20990%20750'/%3e%3c/g%3e%3c/svg%3e";
const formatDate = (date, options, locale) => {
  return date.toLocaleDateString(locale, options);
};
const formatTime = (date, locale) => {
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
};
function EventsListInner({ limit = 10, showTitle = true, variant = "full" }) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language.startsWith("pt") ? "pt-BR" : "en-US";
  const lang = i18n.language.startsWith("pt") ? "pt" : "en";
  const { data: events = [], isLoading: loading, error } = useEventsQuery({
    mode: "upcoming",
    limit,
    lang
  }, { suspense: false });
  if (error) {
    console.error("Error fetching events:", error);
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
      variant === "full" && showTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-48 bg-white/5 animate-pulse rounded-lg mx-auto mb-8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: variant === "compact" ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6", children: Array.from({ length: limit }).map((_, i) => {
        const skeletonHeight = variant === "compact" ? "h-[106px]" : "h-[360px]";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `animate-pulse bg-surface/30 border border-white/5 rounded-xl overflow-hidden ${skeletonHeight}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" })
          },
          `skeleton-${i}`
        );
      }) })
    ] });
  }
  if (events.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-white/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 48, className: "mx-auto mb-4 text-white/20", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("events_noEvents") })
    ] });
  }
  const visibleEvents = events.slice(0, limit);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    variant === "full" && showTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-8 text-center font-display text-white", children: t("events_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: variant === "compact" ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: visibleEvents.map((event) => {
      const eventDate = new Date(event.starts_at);
      const loc = event.location;
      const eventLocation = `${loc.city}, ${loc.country || ""}`;
      const formattedDate = formatDate(eventDate, { day: "numeric", month: "long", year: "numeric" }, currentLocale);
      const formattedTime = formatTime(eventDate, currentLocale);
      const detailHref = event.canonical_path ? lang === "pt" ? `/pt/eventos${event.canonical_path.replace("/events", "")}` : event.canonical_path : `${getLocalizedRoute("events", lang)}/${event.event_id}`;
      if (variant === "compact") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "article",
          {
            className: "card hover:border-primary/50 transition-all duration-300 group bg-surface/30 border border-white/5 rounded-xl overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: detailHref, className: "flex items-start gap-4 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("time", { dateTime: event.starts_at, className: "flex-shrink-0 text-center bg-surface rounded-lg p-3 border border-white/10 min-w-[70px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-primary", children: eventDate.getDate() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-white/60", children: formatDate(eventDate, { month: "short" }, currentLocale) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors text-left", dangerouslySetInnerHTML: { __html: sanitizeHtml(event.title) } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm text-white/70 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "flex-shrink-0 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: loc.venue || loc.city })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "flex-shrink-0 text-white/40" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                      eventLocation,
                      " â€¢ ",
                      formattedTime
                    ] })
                  ] })
                ] })
              ] })
            ] })
          },
          event.event_id
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "article",
        {
          className: "card group hover:border-primary/50 transition-all duration-300 overflow-hidden bg-surface/30 border border-white/5 rounded-2xl",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: detailHref, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 opacity-10",
                  style: { backgroundImage: `url(${patternSvg})` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("time", { dateTime: event.starts_at, className: "relative z-10 text-center drop-shadow-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl font-bold text-primary", children: eventDate.getDate() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl uppercase text-white/90 font-semibold", children: formatDate(eventDate, { month: "short" }, currentLocale) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/80", children: eventDate.getFullYear() })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-white", dangerouslySetInnerHTML: { __html: sanitizeHtml(event.title) } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4 text-sm text-white/70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "flex-shrink-0 mt-0.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-white", children: loc.venue || t("loc_to_be_defined") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: eventLocation })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "flex-shrink-0 text-white/40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formattedDate })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "flex-shrink-0 text-white/40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formattedTime })
                ] })
              ] })
            ] })
          ] })
        },
        event.event_id
      );
    }) })
  ] });
}
const EventsList = reactExports.memo(EventsListInner);
EventsList.displayName = "EventsList";
const FEATURES_DATA = [
  { id: "music", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { size: 32 }), titleKey: "home_feat_exclusive_title", descKey: "home_feat_exclusive_desc" },
  { id: "achievements", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 32 }), titleKey: "home_feat_achievements_title", descKey: "home_feat_achievements_desc" },
  { id: "community", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 32 }), titleKey: "home_feat_community_title", descKey: "home_feat_community_desc" }
];
const FESTIVALS_HIGHLIGHT = ARTIST.festivals.slice(0, 6);
const STATS = [
  { value: "2×", labelKey: "home_stat_champion", icon: Trophy },
  { value: `${ARTIST.stats.countriesPlayed}+`, labelKey: "home_stat_countries", icon: Globe },
  { value: `${ARTIST.stats.yearsActive}+`, labelKey: "home_stat_years", icon: Sparkles }
];
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const ITEM_VARIANTS = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};
const StatCard = React.memo(({ value, label, icon: Icon2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "text-center p-4", variants: ITEM_VARIANTS, whileHover: { scale: 1.05 }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "w-6 h-6 mx-auto mb-2 text-primary", "aria-hidden": "true" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl md:text-4xl font-bold text-white font-display", children: value }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/70 uppercase tracking-wider", children: label })
] }));
const FeatureCard = React.memo(({ icon, title, description, variants }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { className: "card p-8 text-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors", variants, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary inline-block p-4 bg-primary/10 rounded-full mb-4", children: icon }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold mb-2", children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: description })
] }));
const FestivalBadge = React.memo(({ name, flag }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors cursor-default", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": `Flag of ${name}`, children: flag }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name })
] }));
const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [seoSettings, setSeoSettings] = reactExports.useState(null);
  const currentLang = normalizeLanguage$1(i18n.language);
  const currentUrl = ARTIST.site.baseUrl;
  reactExports.useEffect(() => {
    const wpRestUrl = window.wpData?.restUrl || "https://djzeneyer.com/wp-json";
    fetch(`${wpRestUrl}/zen-seo/v1/settings`).then((res) => res.json()).then((response) => {
      if (response.success) {
        setSeoSettings(response.data);
      }
    }).catch((err) => console.error("Zen SEO Plugin not reachable:", err));
  }, []);
  const schemaData = reactExports.useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${ARTIST.site.baseUrl}/#website`,
        "url": ARTIST.site.baseUrl,
        "name": seoSettings?.real_name || "DJ Zen Eyer - Official Website",
        "description": "Official website of DJ Zen Eyer, 2× World Champion Brazilian Zouk DJ & Producer",
        "publisher": { "@id": `${ARTIST.site.baseUrl}/#artist` },
        "inLanguage": ["en", "pt-BR"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${ARTIST.site.baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        ...ARTIST_SCHEMA_BASE,
        "@id": `${ARTIST.site.baseUrl}/#artist`,
        "name": seoSettings?.real_name || "DJ Zen Eyer",
        "nationality": { "@type": "Country", "name": "Brazil" },
        "birthDate": ARTIST.identity.birthDate,
        "jobTitle": "DJ & Music Producer",
        "knowsAbout": ["Brazilian Zouk", "Music Production", "DJing", "Remixing", "Kizomba"],
        "homeLocation": {
          "@type": "Place",
          "address": { "@type": "PostalAddress", "addressLocality": "São Paulo", "addressRegion": "SP", "addressCountry": "BR" }
        },
        "award": [
          { "@type": "Award", "name": "Best Remix", "description": "Brazilian Zouk World Championships", "dateAwarded": "2022" },
          { "@type": "Award", "name": "Best DJ Performance", "description": "Brazilian Zouk World Championships", "dateAwarded": "2022" }
        ],
        "hasOccupation": [
          {
            "@type": "Occupation",
            "name": "DJ",
            "skills": "Audio Mixing, Playlist Curation, Live Performance",
            "occupationalCategory": "27-2099.00"
          },
          {
            "@type": "Occupation",
            "name": "Music Producer",
            "skills": "Audio Engineering, Remixing, Mastering"
          }
        ],
        "performerIn": FESTIVALS_HIGHLIGHT.map((f) => ({
          "@type": "MusicEvent",
          "name": f.name,
          "startDate": f.date,
          "location": {
            "@type": "Place",
            "name": f.country,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": f.country
            }
          },
          "eventStatus": "https://schema.org/EventScheduled",
          "performer": { "@id": `${ARTIST.site.baseUrl}/#artist` }
        }))
      },
      {
        "@type": "WebPage",
        "@id": `${ARTIST.site.baseUrl}/#webpage`,
        "url": ARTIST.site.baseUrl,
        "name": "DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer",
        "description": "Two-time world champion DJ specializing in Brazilian Zouk. Book for international festivals and exclusive events.",
        "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": seoSettings?.default_og_image || `${ARTIST.site.baseUrl}/images/hero-background.webp`,
          "width": 1920,
          "height": 1080
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": ARTIST.site.baseUrl }]
        }
      }
    ]
  }), [seoSettings]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: seoSettings?.real_name ? `${seoSettings.real_name} | ${t("home_stat_champion")}` : t("home_page_title"),
        description: t("home_page_meta_desc"),
        url: currentUrl,
        image: seoSettings?.default_og_image || `${currentUrl}/images/zen-eyer-og-image.png`,
        isHomepage: true,
        schema: schemaData,
        keywords: t("home.seo.keywords"),
        leadAnswer: t("home.seo.lead_answer")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-12", "aria-label": "Introduction", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0 bg-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { scale: 1.1 }, animate: { scale: 1 }, transition: { duration: 12, ease: "linear" }, className: "w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { media: "(max-width: 768px)", srcSet: "/images/hero-background-mobile.webp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { media: "(min-width: 769px)", srcSet: "/images/hero-background.webp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/images/hero-background.webp",
              alt: "DJ Zen Eyer performing a live Brazilian Zouk set with immersive lighting at an international festival",
              className: "w-full h-full object-cover object-center opacity-40",
              width: "1920",
              height: "1080",
              loading: "eager",
              fetchPriority: "high",
              decoding: "async"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "max-w-4xl mx-auto", initial: "hidden", animate: "visible", variants: CONTAINER_VARIANTS, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: ITEM_VARIANTS, className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: t("home_hero_badge") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: ITEM_VARIANTS, className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Zen" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Eyer" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { variants: ITEM_VARIANTS, className: "text-xl md:text-2xl text-white/90 mb-2 font-light", children: t("home_hero_subtitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.p, { variants: ITEM_VARIANTS, className: "text-lg md:text-xl italic text-primary/90 mb-8", children: [
          '"',
          t("home_hero_slogan"),
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: ITEM_VARIANTS, className: "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto mb-10", children: STATS.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { value: stat.value, label: t(stat.labelKey), icon: stat.icon }, stat.labelKey)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap gap-4 justify-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: ARTIST.social.soundcloud.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "btn btn-primary btn-lg flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow",
              "aria-label": "Listen to DJ Zen Eyer on SoundCloud",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { size: 22 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("home_cta_soundcloud") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: getLocalizedRoute("work-with-me", currentLang),
              className: "btn btn-outline btn-lg flex items-center gap-2 backdrop-blur-sm",
              "aria-label": "Book DJ Zen Eyer or Get Press Kit",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 22 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("home_cta_booking") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { variants: ITEM_VARIANTS, className: "text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Trans,
          {
            i18nKey: "home_hero_cta_text",
            components: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: getLocalizedRoute("music", currentLang),
                  className: "text-primary hover:text-primary/80 underline underline-offset-4"
                },
                "music-link"
              )
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute bottom-8 left-1/2 -translate-x-1/2", animate: { y: [0, 10, 0] }, transition: { repeat: Infinity, duration: 2 }, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-3 bg-white/50 rounded-full mt-2" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-surface", id: "about", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "max-w-4xl mx-auto", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: CONTAINER_VARIANTS, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { variants: ITEM_VARIANTS, className: "prose prose-invert prose-lg max-w-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-6 text-white font-display", children: t("home_bio_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl leading-relaxed mb-6 text-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("home_bio_intro")) } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg leading-relaxed text-white/80 mb-6", dangerouslySetInnerHTML: { __html: sanitizeHtml(t("home_bio_style")) } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg leading-relaxed text-white/80", dangerouslySetInnerHTML: { __html: sanitizeHtml(t("home_bio_mensa")) } })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-background border-y border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "max-w-4xl mx-auto text-center", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: CONTAINER_VARIANTS, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h2, { variants: ITEM_VARIANTS, className: "text-2xl md:text-3xl font-bold mb-3 font-display", children: t("home.shows.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: ITEM_VARIANTS, className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventsList, { limit: 3, showTitle: false, variant: "compact" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("events", currentLang), className: "btn btn-primary btn-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("home.shows.cta") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: ARTIST.social.bandsintown?.url, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-lg flex items-center gap-2", "aria-label": "Follow DJ Zen Eyer on Bandsintown", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bandsintown" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto", variants: CONTAINER_VARIANTS, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 }, children: FEATURES_DATA.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: feature.icon, title: t(feature.titleKey), description: t(feature.descKey), variants: ITEM_VARIANTS }, feature.id)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: CONTAINER_VARIANTS, className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h2, { variants: ITEM_VARIANTS, className: "text-2xl md:text-3xl font-bold mb-2 font-display", children: t("home.festivals.presence") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap justify-center gap-3 mt-8", children: [
        FESTIVALS_HIGHLIGHT.map((festival) => /* @__PURE__ */ jsxRuntimeExports.jsx(FestivalBadge, { name: festival.name, flag: festival.flag }, festival.name)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "+",
          t("home.festivals.many_more")
        ] }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, className: "p-8 bg-surface border-l-4 border-primary rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold mb-3 flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 20, className: "text-primary" }),
          " ",
          t("home.press.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-4 text-sm", children: t("home.press.desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("work-with-me", currentLang), className: "inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors", children: [
          t("home.press.cta"),
          " →"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: 0.1 }, className: "p-8 bg-surface border-l-4 border-green-500 rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold mb-3 flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 20, className: "text-green-500" }),
          " ",
          t("home.bookers.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-4 text-sm", children: t("home.bookers.desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("work-with-me", currentLang), className: "inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-semibold transition-colors", children: [
          t("home.bookers.cta"),
          " →"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 bg-background border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-white/40 mb-4 uppercase tracking-widest", children: t("home.verified") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-6 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://musicbrainz.org/artist/${ARTIST.identifiers.musicbrainz}`, target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-primary transition-colors flex items-center gap-1", children: [
          "MusicBrainz ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://www.wikidata.org/wiki/${ARTIST.identifiers.wikidata}`, target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-primary transition-colors flex items-center gap-1", children: [
          "Wikidata ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: ARTIST.social.spotify.url, target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-primary transition-colors flex items-center gap-1", children: [
          "Spotify ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-24 relative overflow-hidden bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/50 to-background opacity-60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "container mx-auto px-4 text-center relative z-10", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, variants: CONTAINER_VARIANTS, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h2, { variants: ITEM_VARIANTS, className: "text-4xl md:text-6xl font-bold mb-6 font-display", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "home.tribe.title", children: [
          "Junte-se à ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Zen Tribe" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { variants: ITEM_VARIANTS, className: "text-xl text-white/70 mb-10 max-w-2xl mx-auto", children: t("home.tribe.desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap justify-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("zentribe", currentLang), className: "btn btn-primary btn-lg min-w-[200px]", children: t("nav.tribe") }) })
      ] })
    ] })
  ] });
};
const routes = [{ "key": "home", "en": "", "pt": "" }, { "key": "about", "en": "about-dj-zen-eyer", "pt": "sobre-dj-zen-eyer" }, { "key": "events", "en": "zouk-events", "pt": "eventos-zouk", "aliases": { "en": ["events"], "pt": ["eventos"] } }, { "key": "music", "en": "zouk-music", "pt": "musica-zouk", "aliases": { "en": ["music"], "pt": ["musica"] } }, { "key": "news", "en": "zouk-dance-news", "pt": "noticias-zouk", "aliases": { "en": ["news"], "pt": ["noticias"] } }, { "key": "philosophy", "en": "zouk-philosophy", "pt": "filosofia-zouk" }, { "key": "zentribe", "en": "zentribe", "pt": "tribo-zen", "aliases": { "en": ["tribe", "zen-tribe"], "pt": ["tribo"] } }, { "key": "booking", "en": "work-with-me", "pt": "trabalhe-comigo" }, { "key": "presskit", "en": "press-kit-dj-zen-eyer", "pt": "kit-de-imprensa" }, { "key": "shop", "en": "shop", "pt": "loja" }, { "key": "support", "en": "support-dj-zen-eyer", "pt": "apoie-dj-zen-eyer" }, { "key": "zenlink", "en": "zenlink", "pt": "links-zen", "aliases": { "en": ["links"] } }, { "key": "cart", "en": "cart", "pt": "carrinho" }, { "key": "checkout", "en": "checkout", "pt": "finalizar-compra" }, { "key": "tickets", "en": "tickets", "pt": "ingressos" }, { "key": "tickets-checkout", "en": "tickets-checkout", "pt": "finalizar-ingressos" }, { "key": "dashboard", "en": "dashboard", "pt": "painel" }, { "key": "my-account", "en": "my-account", "pt": "minha-conta" }, { "key": "faq", "en": "faq", "pt": "perguntas-frequentes" }, { "key": "privacy", "en": "privacy-policy", "pt": "privacidade" }, { "key": "returns", "en": "return-policy", "pt": "reembolso" }, { "key": "terms", "en": "terms", "pt": "termos" }, { "key": "conduct", "en": "conduct", "pt": "regras-de-conduta" }, { "key": "quiz", "en": "quiz", "pt": "perguntas" }, { "key": "reset-password", "en": "reset-password", "pt": "recuperar-senha" }, { "key": "payme", "en": "payme", "pt": "pagamentos" }];
const routesSlugs = {
  routes
};
const normalizeLanguage$1 = (lang) => {
  const normalized = lang.trim().toLowerCase();
  return normalized.startsWith("pt") ? "pt" : "en";
};
const AboutPage = reactExports.lazy(() => __vitePreload(() => import("./AboutPage-Dhb7xZVP.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0));
const EventsPage = reactExports.lazy(() => __vitePreload(() => import("./EventsPage-BRIZoUPg.js"), true ? __vite__mapDeps([7,1,2,3,8,9,10,11]) : void 0));
const MusicPage = reactExports.lazy(() => __vitePreload(() => import("./MusicPage-CMsYf2LI.js"), true ? __vite__mapDeps([12,1,2,13,3,10,14,15]) : void 0));
const ZenTribePage = reactExports.lazy(() => __vitePreload(() => import("./ZenTribePage-mrHYPeYm.js"), true ? __vite__mapDeps([16,1,2,3,6,17,18,19,20]) : void 0));
const PressKitPage = reactExports.lazy(() => __vitePreload(() => import("./PressKitPage-BLoOZchM.js"), true ? __vite__mapDeps([21,1,2,3,22,6,23,24]) : void 0));
const ShopPage = reactExports.lazy(() => __vitePreload(() => import("./ShopPage-BkQpF_K0.js"), true ? __vite__mapDeps([25,1,2,8,9,3,26,17,19,20,14]) : void 0));
const ProductPage = reactExports.lazy(() => __vitePreload(() => import("./ProductPage-Cz3hfvjI.js"), true ? __vite__mapDeps([27,1,2,3,26,28,10,29]) : void 0));
const CartPage = reactExports.lazy(() => __vitePreload(() => import("./CartPage-JDMXpbVY.js"), true ? __vite__mapDeps([30,1,2,3,29,31]) : void 0));
const CheckoutPage = reactExports.lazy(() => __vitePreload(() => import("./CheckoutPage-XTrNL3k1.js"), true ? __vite__mapDeps([32,1,2,3,9,33,28]) : void 0));
const DashboardPage = reactExports.lazy(() => __vitePreload(() => import("./DashboardPage-CTwRbJ9x.js"), true ? __vite__mapDeps([34,1,2,35,3,20,18,6,13,26,28,19,31]) : void 0));
const MyAccountPage = reactExports.lazy(() => __vitePreload(() => import("./MyAccountPage-Bz5qr5qv.js"), true ? __vite__mapDeps([36,1,2,35,3,20,18,6,14,13,26,28]) : void 0));
const FAQPage = reactExports.lazy(() => __vitePreload(() => import("./FAQPage-m9DN3CU1.js"), true ? __vite__mapDeps([37,1,2,3,5]) : void 0));
const PhilosophyPage = reactExports.lazy(() => __vitePreload(() => import("./PhilosophyPage-DwWgo2rG.js"), true ? __vite__mapDeps([38,1,2,3,4]) : void 0));
const NewsPage = reactExports.lazy(() => __vitePreload(() => import("./NewsPage-BujQtisS.js"), true ? __vite__mapDeps([39,1,2]) : void 0));
const MediaPage = reactExports.lazy(() => __vitePreload(() => import("./MediaPage-ojbYcLV3.js"), true ? __vite__mapDeps([40,1,2,3,23]) : void 0));
const PrivacyPolicyPage = reactExports.lazy(() => __vitePreload(() => import("./PrivacyPolicyPage-DEEVilQu.js"), true ? __vite__mapDeps([41,1,2,3,22,42,33,17]) : void 0));
const ReturnPolicyPage = reactExports.lazy(() => __vitePreload(() => import("./ReturnPolicyPage-Bn6cVqQo.js"), true ? __vite__mapDeps([43,1,2,3]) : void 0));
const TermsPage = reactExports.lazy(() => __vitePreload(() => import("./TermsPage-DZSh4c0q.js"), true ? __vite__mapDeps([44,1,2,3,9,28,45,24]) : void 0));
const CodeOfConductPage = reactExports.lazy(() => __vitePreload(() => import("./CodeOfConductPage-D93AQbR6.js"), true ? __vite__mapDeps([46,1,2,3,4,17,45]) : void 0));
const SupportArtistPage = reactExports.lazy(() => __vitePreload(() => import("./SupportArtistPage-6z3zSFWR.js"), true ? __vite__mapDeps([47,1,2,3,48,4]) : void 0));
const TicketsPage = reactExports.lazy(() => __vitePreload(() => import("./TicketsPage-biyctaFr.js"), true ? __vite__mapDeps([49,1,2,3,31]) : void 0));
const TicketsCheckoutPage = reactExports.lazy(() => __vitePreload(() => import("./TicketsCheckoutPage-B9Ws3TA2.js"), true ? __vite__mapDeps([50,1,2,32,3,9,33,28]) : void 0));
const ResetPasswordPage = reactExports.lazy(() => __vitePreload(() => import("./ResetPasswordPage-DMJQNIj6.js"), true ? __vite__mapDeps([51,1,2,3,9,10,28,26,33,52,42]) : void 0));
const ZenLinkPage$1 = reactExports.lazy(() => __vitePreload(() => import("./ZenLinkPage-BOA-NhNn.js"), true ? __vite__mapDeps([53,1,2,3]) : void 0).then((m) => ({ default: m.ZenLinkPage })));
const ZoukPersonaQuizPage = reactExports.lazy(() => __vitePreload(() => import("./ZoukPersonaQuizPage-DltWbA5F.js"), true ? __vite__mapDeps([54,1,2,3,11,15,4,20]) : void 0));
const PayMePage = reactExports.lazy(() => __vitePreload(() => import("./PayMePage-Ds5SVl0b.js"), true ? __vite__mapDeps([55,1,2,3,48,4,20]) : void 0));
const NotFoundPage = reactExports.lazy(() => __vitePreload(() => import("./NotFoundPage-B7h318Lz.js"), true ? __vite__mapDeps([56,1,2,3]) : void 0));
const slug = (key, lang) => {
  const route = routesSlugs.routes.find((r) => r.key === key);
  if (!route) return "";
  const base = route[lang];
  const aliases = route.aliases?.[lang] ?? [];
  return aliases.length > 0 ? [base, ...aliases] : base;
};
const ROUTES_CONFIG = [
  // Home (Index)
  {
    key: "home",
    component: HomePage,
    paths: { en: "", pt: "" },
    isIndex: true
  },
  // About
  {
    key: "about",
    component: AboutPage,
    paths: { en: slug("about", "en"), pt: slug("about", "pt") }
  },
  // Events (com rota dinâmica :id)
  {
    key: "events",
    component: EventsPage,
    paths: { en: slug("events", "en"), pt: slug("events", "pt") }
  },
  {
    key: "events-detail",
    component: EventsPage,
    paths: { en: `${slug("events", "en")}/:id`, pt: `${slug("events", "pt")}/:id` }
  },
  // Music (com rota dinâmica :slug)
  {
    key: "music",
    component: MusicPage,
    paths: { en: slug("music", "en"), pt: slug("music", "pt") }
  },
  {
    key: "music-detail",
    component: MusicPage,
    paths: { en: `${slug("music", "en")}/:slug`, pt: `${slug("music", "pt")}/:slug` }
  },
  // News / Blog
  {
    key: "news",
    component: NewsPage,
    paths: { en: slug("news", "en"), pt: slug("news", "pt") }
  },
  {
    key: "news-detail",
    component: NewsPage,
    paths: { en: `${slug("news", "en")}/:slug`, pt: `${slug("news", "pt")}/:slug` }
  },
  // Zen Tribe (com aliases)
  {
    key: "zentribe",
    component: ZenTribePage,
    paths: { en: slug("zentribe", "en"), pt: slug("zentribe", "pt") }
  },
  // Press Kit / Booking
  {
    key: "booking",
    component: PressKitPage,
    paths: { en: slug("booking", "en"), pt: slug("booking", "pt") }
  },
  // Shop (com wildcard para subrotas)
  {
    key: "product-detail",
    component: ProductPage,
    paths: { en: `${slug("shop", "en")}/product/:slug`, pt: `${slug("shop", "pt")}/produto/:slug` }
  },
  {
    key: "shop",
    component: ShopPage,
    paths: { en: slug("shop", "en"), pt: slug("shop", "pt") },
    hasWildcard: true
  },
  // Cart / Carrinho
  {
    key: "cart",
    component: CartPage,
    paths: { en: slug("cart", "en"), pt: slug("cart", "pt") }
  },
  // Checkout / Finalizar Compra
  {
    key: "checkout",
    component: CheckoutPage,
    paths: { en: slug("checkout", "en"), pt: slug("checkout", "pt") }
  },
  // Tickets / Compra de Ingressos
  {
    key: "tickets",
    component: TicketsPage,
    paths: { en: slug("tickets", "en"), pt: slug("tickets", "pt") }
  },
  // Tickets Checkout / Finalizar Ingressos
  {
    key: "tickets-checkout",
    component: TicketsCheckoutPage,
    paths: { en: slug("tickets-checkout", "en"), pt: slug("tickets-checkout", "pt") }
  },
  // Dashboard
  {
    key: "dashboard",
    component: DashboardPage,
    paths: { en: slug("dashboard", "en"), pt: slug("dashboard", "pt") }
  },
  // My Account
  {
    key: "my-account",
    component: MyAccountPage,
    paths: { en: slug("my-account", "en"), pt: slug("my-account", "pt") }
  },
  // FAQ
  {
    key: "faq",
    component: FAQPage,
    paths: { en: slug("faq", "en"), pt: slug("faq", "pt") }
  },
  // Philosophy
  {
    key: "philosophy",
    component: PhilosophyPage,
    paths: { en: slug("philosophy", "en"), pt: slug("philosophy", "pt") }
  },
  // Press Kit (EPK + Media)
  {
    key: "presskit",
    component: MediaPage,
    paths: { en: slug("presskit", "en"), pt: slug("presskit", "pt") }
  },
  // Support the Artist
  {
    key: "support",
    component: SupportArtistPage,
    paths: { en: slug("support", "en"), pt: slug("support", "pt") }
  },
  // Privacy Policy
  {
    key: "privacy",
    component: PrivacyPolicyPage,
    paths: { en: slug("privacy", "en"), pt: slug("privacy", "pt") }
  },
  // Return Policy
  {
    key: "returns",
    component: ReturnPolicyPage,
    paths: { en: slug("returns", "en"), pt: slug("returns", "pt") }
  },
  // Terms of Use
  {
    key: "terms",
    component: TermsPage,
    paths: { en: slug("terms", "en"), pt: slug("terms", "pt") }
  },
  // Code of Conduct
  {
    key: "conduct",
    component: CodeOfConductPage,
    paths: { en: slug("conduct", "en"), pt: slug("conduct", "pt") }
  },
  // Zen Link (com aliases)
  {
    key: "zenlink",
    component: ZenLinkPage$1,
    paths: { en: slug("zenlink", "en"), pt: slug("zenlink", "pt") }
  },
  // Zouk Persona Quiz
  {
    key: "quiz",
    component: ZoukPersonaQuizPage,
    paths: { en: slug("quiz", "en"), pt: slug("quiz", "pt") }
  },
  // Password Reset
  {
    key: "reset-password",
    component: ResetPasswordPage,
    paths: { en: slug("reset-password", "en"), pt: slug("reset-password", "pt") }
  },
  // PayMe / Pagamentos
  {
    key: "payme",
    component: PayMePage,
    paths: { en: slug("payme", "en"), pt: slug("payme", "pt") }
  }
];
const NOT_FOUND_COMPONENT = NotFoundPage;
const getLocalizedPaths = (routeConfig, lang) => {
  const paths = routeConfig.paths[lang];
  return Array.isArray(paths) ? paths : [paths];
};
const getLanguagePrefix = (lang) => {
  return lang === "pt" ? "/pt" : "/";
};
const buildFullPath = (path2, lang) => {
  const prefix = getLanguagePrefix(lang);
  if (!path2) return prefix;
  return prefix === "/" ? `/${path2}` : `${prefix}/${path2}`;
};
const normalizeRouteKey = (key) => {
  if (!key) return "";
  const trimmed = key.trim();
  if (!trimmed || trimmed === "/" || trimmed === "/pt") return "";
  return trimmed.replace(/^\/pt(\/|$)/, "/").replace(/^\//, "").replace(/\/$/, "");
};
const KEY_ROUTE_MAP = /* @__PURE__ */ new Map();
const PATH_TO_KEY_MAP = /* @__PURE__ */ new Map();
ROUTES_CONFIG.forEach((route) => {
  KEY_ROUTE_MAP.set(route.key, route);
  Object.values(route.paths).forEach((p) => {
    const pathsArray = Array.isArray(p) ? p : [p];
    pathsArray.forEach((path2) => {
      const cleanPath = path2.startsWith("/") ? path2.slice(1) : path2;
      if (cleanPath) PATH_TO_KEY_MAP.set(cleanPath, route.key);
    });
  });
});
const findKeyByPath = (path2) => {
  const cleanPath = normalizeRouteKey(path2);
  if (!cleanPath) return "home";
  const exact = PATH_TO_KEY_MAP.get(cleanPath);
  if (exact) return exact;
  const sortedPaths = Array.from(PATH_TO_KEY_MAP.entries()).sort((a, b) => b[0].length - a[0].length);
  for (const [p, key] of sortedPaths) {
    if (cleanPath.startsWith(p + "/")) {
      if (key === "events") return "events-detail";
      if (key === "music") return "music-detail";
      if (key === "news") return "news-detail";
      if (key === "shop") return "product-detail";
      return key;
    }
  }
  if (KEY_ROUTE_MAP.has(cleanPath)) return cleanPath;
  return void 0;
};
const getLocalizedRoute = (keyOrPath, lang) => {
  const sanitizedKey = normalizeRouteKey(keyOrPath);
  const finalKey = sanitizedKey || keyOrPath;
  let route = KEY_ROUTE_MAP.get(finalKey) || KEY_ROUTE_MAP.get(keyOrPath);
  if (!route) {
    const discoveredKey = findKeyByPath(keyOrPath);
    if (discoveredKey) {
      route = KEY_ROUTE_MAP.get(discoveredKey);
    }
  }
  if (!route) {
    return buildFullPath(keyOrPath, lang);
  }
  const localizedPaths = getLocalizedPaths(route, lang);
  const localizedPath = Array.isArray(localizedPaths) ? localizedPaths[0] : localizedPaths;
  return buildFullPath(localizedPath, lang);
};
const buildRouteMatchCache = () => {
  const cache = { en: [], pt: [] };
  const langs = ["en", "pt"];
  for (const lang of langs) {
    for (const route of ROUTES_CONFIG) {
      const paths = getLocalizedPaths(route, lang);
      for (const p of paths) {
        const fullPath = buildFullPath(p, lang);
        cache[lang].push({
          config: route,
          exactPath: fullPath,
          prefixPath: fullPath + "/"
        });
      }
    }
  }
  return cache;
};
buildRouteMatchCache();
const getAlternateLinks = (currentPath) => {
  const alternates = {};
  if (!currentPath || currentPath === "/") {
    return { en: "/", pt: "/pt/" };
  }
  const cleanPath = currentPath.replace(/^\/pt\//, "").replace(/^\//, "").replace(/\/$/, "");
  for (const route of ROUTES_CONFIG) {
    const pathsEn = getLocalizedPaths(route, "en");
    const enPath = Array.isArray(pathsEn) ? pathsEn[0] : pathsEn;
    const pathsPt = getLocalizedPaths(route, "pt");
    const ptPath = Array.isArray(pathsPt) ? pathsPt[0] : pathsPt;
    if (cleanPath === enPath || cleanPath.startsWith(enPath + "/")) {
      const suffix = cleanPath.slice(enPath.length);
      alternates.en = enPath ? `/${enPath}${suffix}` : `/${suffix}`;
      alternates.pt = ptPath ? `/pt/${ptPath}${suffix}` : `/pt/${suffix}`;
      alternates["x-default"] = alternates.en;
      return alternates;
    }
    if (cleanPath === ptPath || cleanPath.startsWith(ptPath + "/")) {
      const suffix = cleanPath.slice(ptPath.length);
      alternates.en = enPath ? `/${enPath}${suffix}` : `/${suffix}`;
      alternates.pt = ptPath ? `/pt/${ptPath}${suffix}` : `/pt/${suffix}`;
      alternates["x-default"] = alternates.en;
      return alternates;
    }
  }
  return {
    en: currentPath.replace(/^\/pt/, ""),
    pt: currentPath.startsWith("/pt") ? currentPath : `/pt${currentPath}`,
    "x-default": currentPath.replace(/^\/pt/, "")
  };
};
const UserMenu = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useUser();
  const currentLang = normalizeLanguage$1(i18n.language);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const menuRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!user) return null;
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate(getLocalizedRoute("", currentLang));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const menuLinks = [
    {
      to: getLocalizedRoute("dashboard", currentLang),
      label: t("nav.dashboard"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 18 })
    },
    {
      to: getLocalizedRoute("my-account", currentLang),
      label: t("nav.my_account"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18 })
    },
    {
      to: `${getLocalizedRoute("my-account", currentLang)}?tab=orders`,
      label: t("account.orders.title"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18 })
    },
    {
      to: `${getLocalizedRoute("my-account", currentLang)}?tab=settings`,
      label: t("account.tabs.settings"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18 })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: menuRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-2 p-1 pl-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:block text-sm font-medium mr-1 max-w-[100px] truncate", children: user.name || user.email.split("@")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 16,
              className: `transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-white/5 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold truncate", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 truncate", children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 px-2", children: menuLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: link.to,
          onClick: () => setIsOpen(false),
          className: "flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 group-hover:text-primary transition-colors", children: link.icon }),
            link.label
          ]
        },
        link.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 pt-2 border-t border-white/5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleLogout,
          className: "w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors text-left",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("nav.logout") })
          ]
        }
      ) })
    ] })
  ] });
};
function useMenu() {
  const { i18n } = useTranslation();
  const langToFetch = i18n.language.startsWith("pt") ? "pt" : "en";
  const { data, isLoading, error } = useMenuQuery(langToFetch);
  const formattedItems = reactExports.useMemo(() => {
    if (!Array.isArray(data)) return [];
    const siteUrl = getSiteUrl();
    return data.map((item) => ({
      ...item,
      url: (item.url || "/").replace(siteUrl, "") || "/"
    }));
  }, [data]);
  return formattedItems;
}
const usePrefetchOnHover = () => {
  return reactExports.useCallback((url) => {
    if (!url) return;
    const lowerUrl = url.toLowerCase();
    const lang = lowerUrl.startsWith("/pt") ? "pt" : "en";
    if (lowerUrl.includes("event")) {
      const params = { limit: 10, lang, upcomingOnly: true };
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.events.list(params),
        queryFn: () => fetchEventsFn(params)
      });
    } else if (lowerUrl.includes("music") || lowerUrl.includes("musica") || lowerUrl.includes("música")) {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.tracks.list(),
        queryFn: fetchTracksFn
      });
    } else if (lowerUrl.includes("news") || lowerUrl.includes("noticias")) {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.posts.list(lang),
        queryFn: () => fetchNewsFn(lang)
      });
    } else if (lowerUrl.includes("shop") || lowerUrl.includes("loja")) {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.products.list(lang),
        queryFn: () => fetchProductsFn(lang)
      });
    }
  }, []);
};
const getLinkVisuals = (url) => {
  const path2 = url.toLowerCase();
  if (path2.includes("event"))
    return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 20 }), color: "text-primary", bg: "bg-primary/10" };
  if (path2.includes("shop") || path2.includes("loja"))
    return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 20 }), color: "text-primary", bg: "bg-primary/10" };
  if (path2.includes("tribe") || path2.includes("tribo"))
    return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }), color: "text-primary", bg: "bg-primary/10" };
  if (path2.includes("music") || path2.includes("música") || path2.includes("musica"))
    return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { size: 20 }), color: "text-primary", bg: "bg-primary/10" };
  if (path2.includes("work") || path2.includes("trabalhe"))
    return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 20 }), color: "text-primary", bg: "bg-primary/10" };
  if (path2.includes("about") || path2.includes("sobre"))
    return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 20 }), color: "text-primary", bg: "bg-primary/10" };
  return { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 }), color: "text-white/70", bg: "bg-white/5" };
};
const LanguageSelector = React.memo(() => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = reactExports.useMemo(
    () => i18n.language?.startsWith("pt") ? "pt" : "en",
    [i18n.language]
  );
  const changeLanguage = reactExports.useCallback(
    (newLang) => {
      if (newLang === currentLang) return;
      const alternates = getAlternateLinks(location.pathname);
      const targetPath = alternates[newLang] || (newLang === "pt" ? "/pt/" : "/");
      const finalPath = safeRedirect(sanitizePath(targetPath) + (location.search || "") + (location.hash || ""), "/");
      navigate(finalPath);
    },
    [currentLang, location, navigate]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-r border-white/20 pr-4 mr-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => changeLanguage("pt"), className: `text-sm font-bold ${currentLang === "pt" ? "text-primary" : "text-white/60 hover:text-white"}`, children: "PT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20", children: "|" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => changeLanguage("en"), className: `text-sm font-bold ${currentLang === "en" ? "text-primary" : "text-white/60 hover:text-white"}`, children: "EN" })
  ] });
});
const MenuItem = ({ item, isMobile, onNavigate }) => {
  const { t } = useTranslation();
  const { safeUrl: safeUrl2, safeTitle, visuals, target } = item;
  const isExternal = safeUrl2.startsWith("http");
  const isBlank = target === "_blank";
  const commonClass = isMobile ? `group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent` : `relative group nav-link py-2 text-white/80 hover:text-white transition-colors`;
  const activeMobileClass = "bg-primary/10 border-white/5";
  if (isExternal) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: safeUrl2,
        target: target || "_self",
        rel: isBlank ? "noopener noreferrer" : void 0,
        "aria-label": isBlank ? `${safeTitle} (${t("common.opens_in_new_tab")})` : safeTitle,
        className: commonClass,
        onClick: onNavigate,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-white/5 text-white/50 group-hover:text-white", children: visuals.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isMobile ? "text-base font-medium" : "", children: safeTitle })
          ] }),
          isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-white/20" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    NavLink,
    {
      to: safeUrl2,
      end: true,
      onClick: onNavigate,
      className: ({ isActive }) => `${commonClass} ${isMobile && isActive ? activeMobileClass : ""} ${!isMobile && isActive ? "text-primary font-medium" : ""}`,
      children: ({ isActive }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${isActive ? visuals.color + " bg-black/20" : "text-white/50 bg-white/5 group-hover:text-white"}`, children: visuals.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isMobile ? "text-base font-medium" : "", children: safeTitle })
        ] }),
        !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -bottom-0.5 left-0 h-[2px] bg-primary transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}` }),
        isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: `transition-transform ${isActive ? "text-primary translate-x-1" : "text-white/20"}` })
      ] })
    }
  );
};
const Navbar = React.memo(({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = reactExports.useState(false);
  const [isMenuOpen, setIsMenuOpen] = reactExports.useState(false);
  const { user } = useUser();
  const location = useLocation();
  const menuItems = useMenu();
  const handlePrefetch = usePrefetchOnHover();
  const currentLang = reactExports.useMemo(() => normalizeLanguage$1(i18n.language), [i18n.language]);
  reactExports.useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);
  reactExports.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  reactExports.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLoginButtonClick = reactExports.useCallback(() => {
    setIsMenuOpen(false);
    onLoginClick();
  }, [onLoginClick]);
  const processedMenuItems = reactExports.useMemo(() => {
    if (!menuItems?.length) return [];
    return menuItems.map((item) => {
      const rawUrl = item.url || "/";
      const isExternal = /^https?:\/\//i.test(rawUrl);
      const localizedPath = isExternal ? rawUrl : getLocalizedRoute(rawUrl.split(/[#?]/)[0], currentLang);
      const queryPart = rawUrl.includes("?") ? "?" + rawUrl.split("?")[1].split("#")[0] : "";
      const hashPart = rawUrl.includes("#") ? "#" + rawUrl.split("#")[1] : "";
      const fullUrl = isExternal ? rawUrl : `${localizedPath}${queryPart}${hashPart}`;
      const safeUrl2 = isExternal ? fullUrl : sanitizePath(fullUrl);
      let safeTitle = item.title || "";
      const lowerTitle = safeTitle.toLowerCase();
      if (lowerTitle.includes("zouk events")) {
        safeTitle = t("nav.events");
      } else if (lowerTitle.includes("zouk music")) {
        safeTitle = t("nav.music");
      }
      return {
        ...item,
        safeUrl: safeUrl2,
        safeTitle,
        visuals: getLinkVisuals(safeUrl2)
      };
    });
  }, [menuItems, currentLang, t]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? "bg-[#121212]/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10" : "bg-transparent py-5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 md:px-6 flex items-center justify-between h-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("", currentLang), className: "flex items-center z-50 group font-display font-bold text-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mr-1", children: "DJ" }),
        " Zen Eyer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center space-x-8", children: processedMenuItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          item,
          isMobile: false,
          onNavigate: () => {
          },
          onPrefetch: handlePrefetch
        },
        item.ID
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSelector, {}),
        user?.isLoggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLoginButtonClick, className: "btn btn-primary btn-sm flex items-center gap-2 shadow-lg shadow-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 16 }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("nav.sign_in") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md:hidden text-white z-50", onClick: () => setIsMenuOpen(!isMenuOpen), children: isMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 26 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 26 }) })
    ] }) }),
    isMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: () => setIsMenuOpen(false),
          className: "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden opacity-100 transition-opacity duration-200"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-0 left-0 right-0 bg-[#0f0f0f] z-40 md:hidden shadow-2xl rounded-b-3xl border-b border-white/10 pt-24 pb-8 px-4 flex flex-col max-h-[90vh] overflow-y-auto translate-y-0 transition-transform duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col space-y-3 mb-6", children: processedMenuItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MenuItem,
          {
            item,
            isMobile: true,
            onNavigate: () => setIsMenuOpen(false),
            onPrefetch: handlePrefetch
          },
          item.ID
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6 border-t border-white/10 flex flex-col gap-4", children: [
          user?.isLoggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLoginButtonClick, className: "w-full btn btn-primary py-3 flex items-center justify-center space-x-2 shadow-lg shadow-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 18 }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: t("nav.join_the_tribe") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSelector, {}) })
        ] })
      ] })
    ] })
  ] });
});
Navbar.displayName = "Navbar";
const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const [email, setEmail] = reactExports.useState("");
  const [submitMessage, setSubmitMessage] = reactExports.useState(null);
  const [submitSuccess, setSubmitSuccess] = reactExports.useState(null);
  const currentLang = normalizeLanguage$1(i18n.language);
  const { mutate: subscribe, isPending: isSubmitting } = useSubscriptionMutation();
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitSuccess(null);
    if (!email) {
      setSubmitMessage(t("auth.errors.invalidEmail"));
      setSubmitSuccess(false);
      return;
    }
    subscribe(email, {
      onSuccess: (data) => {
        setSubmitMessage(data.message || t("footer_subscribe_success"));
        setSubmitSuccess(true);
        setEmail("");
      },
      onError: (err) => {
        const error = err;
        setSubmitMessage(error.message || t("footer_subscribe_error"));
        setSubmitSuccess(false);
      }
    });
  };
  const whatsappLink = `https://wa.me/${ARTIST.contact.whatsapp.number}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-background pt-20 pb-10 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("", currentLang), className: "flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity", "aria-label": "Voltar para Home", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 flex items-center justify-center rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { size: 20, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-display font-bold tracking-wide", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "DJ" }),
            " Zen Eyer"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-4 text-sm leading-relaxed", children: t("footer_bio") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: ARTIST.social.instagram.url, target: "_blank", rel: "noopener noreferrer", className: "text-white/70 hover:text-primary transition-colors", "aria-label": "Instagram", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: ARTIST.social.soundcloud.url, target: "_blank", rel: "noopener noreferrer", className: "text-white/70 hover:text-primary transition-colors", "aria-label": "SoundCloud", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: ARTIST.social.youtube.url, target: "_blank", rel: "noopener noreferrer", className: "text-white/70 hover:text-primary transition-colors", "aria-label": "Youtube", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: ARTIST.social.facebook.url, target: "_blank", rel: "noopener noreferrer", className: "text-white/70 hover:text-primary transition-colors", "aria-label": "Facebook", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: whatsappLink, target: "_blank", rel: "noopener noreferrer", className: "text-white/70 hover:text-primary transition-colors", "aria-label": "WhatsApp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 22 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-semibold mb-4 text-white", children: t("footer_quick_links") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("events", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("footer_events") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("music", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("footer_music") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("zentribe", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("footer_zen_tribe_info") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("shop", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("common.footer_shop") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("support-the-artist", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("footer_support_artist") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-semibold mb-4 text-white", children: t("footer_discover_more") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("about", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("footer_about") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("news", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("common.footer_news") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("my-philosophy", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("common.footer_philosophy") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("work-with-me", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("common.footer_work_with_me") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("media", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("common.footer_media") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("faq", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: "FAQ" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("conduct", currentLang), className: "text-white/70 hover:text-primary transition-colors", children: t("common.footer_conduct") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-semibold mb-4 text-white", children: t("footer_join_newsletter") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleNewsletterSubmit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              id: "footer_newsletter_email",
              name: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: t("footer_email_placeholder"),
              className: "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40",
              required: true,
              disabled: isSubmitting,
              autoComplete: "email"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "submit",
              className: "w-full btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed",
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isSubmitting ? t("loading") : t("footer_subscribe") })
              ]
            }
          )
        ] }),
        submitMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-3 text-sm ${submitSuccess ? "text-green-400" : "text-red-400"}`, children: submitMessage })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 pt-8 border-t border-white/10 text-center text-white/50 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("footer_copyright", { year: currentYear }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-4 mt-2 text-xs uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("privacy-policy", currentLang), className: "hover:text-primary transition-colors", children: t("common.footer_privacy") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("terms", currentLang), className: "hover:text-primary transition-colors", children: t("common.footer_terms") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-xs opacity-30 flex justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.wikidata.org/wiki/Q136551855", target: "_blank", rel: "noopener noreferrer", className: "hover:text-primary transition-colors", children: "Wikidata" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154", target: "_blank", rel: "noopener noreferrer", className: "hover:text-primary transition-colors", children: "MusicBrainz" })
      ] })
    ] })
  ] }) });
};
const ScrollToTop = () => {
  const { pathname } = useLocation();
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
const AuthModal = reactExports.lazy(() => __vitePreload(() => import("./AuthModal-DqcC0Gd6.js"), true ? __vite__mapDeps([57,1,2,3,28,26,33,52,42]) : void 0));
const MainLayout = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = reactExports.useState(false);
  const openModal = () => {
    setIsAuthModalOpen(true);
  };
  const closeModal = () => setIsAuthModalOpen(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeadlessSEO, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, { onLoginClick: openModal }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
      isAuthModalOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthModal, { isOpen: isAuthModalOpen, onClose: closeModal }) }) : null
    ] })
  ] });
};
const ZenLinkPage = reactExports.lazy(() => __vitePreload(() => import("./ZenLinkPage-BOA-NhNn.js"), true ? __vite__mapDeps([53,1,2,3]) : void 0).then((m) => ({ default: m.ZenLinkPage })));
const generateRoutes = (lang) => {
  return ROUTES_CONFIG.flatMap((route) => {
    const rawPath = route.paths[lang];
    const paths = Array.isArray(rawPath) ? rawPath : [rawPath];
    const Component = route.component;
    return paths.map((path2) => {
      if (route.isIndex || path2 === "") {
        return {
          index: true,
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {})
        };
      }
      return {
        path: path2,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {}),
        // Suporte para rotas com * (wildcard) como na Loja
        children: route.hasWildcard ? [
          { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {}) }
        ] : void 0
      };
    });
  });
};
const AppRoutes = () => {
  const NotFound = NOT_FOUND_COMPONENT;
  const element = useRoutes([
    // 🇧🇷 Rotas em Português (Raiz /pt)
    // Movido para cima para garantir prioridade na detecção
    {
      path: "/pt",
      element: /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, {}),
      children: generateRoutes("pt")
    },
    // 🇬🇧 Rotas em Inglês (Raiz /)
    {
      path: "/",
      element: /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, {}),
      children: generateRoutes("en")
    },
    // 🔗 ZenLink — página independente (sem Navbar/Footer)
    {
      path: "/zenlink",
      element: /* @__PURE__ */ jsxRuntimeExports.jsx(ZenLinkPage, {})
    },
    // 🚫 404 Catch-all
    {
      path: "*",
      element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFound, {})
    }
  ]);
  return element;
};
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HelmetProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    reactExports.Suspense,
    {
      fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppRoutes, {})
    }
  ) }) }) }) }) });
}
const {
  slice,
  forEach
} = [];
function defaults(obj) {
  forEach.call(slice.call(arguments, 1), (source) => {
    if (source) {
      for (const prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function hasXSS(input) {
  if (typeof input !== "string") return false;
  const xssPatterns = [/<\s*script.*?>/i, /<\s*\/\s*script\s*>/i, /<\s*img.*?on\w+\s*=/i, /<\s*\w+\s*on\w+\s*=.*?>/i, /javascript\s*:/i, /vbscript\s*:/i, /expression\s*\(/i, /eval\s*\(/i, /alert\s*\(/i, /document\.cookie/i, /document\.write\s*\(/i, /window\.location/i, /innerHTML/i];
  return xssPatterns.some((pattern) => pattern.test(input));
}
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const serializeCookie = function(name, val) {
  let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    path: "/"
  };
  const opt = options;
  const value = encodeURIComponent(val);
  let str = `${name}=${value}`;
  if (opt.maxAge > 0) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge)) throw new Error("maxAge should be a Number");
    str += `; Max-Age=${Math.floor(maxAge)}`;
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) str += "; HttpOnly";
  if (opt.secure) str += "; Secure";
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  if (opt.partitioned) str += "; Partitioned";
  return str;
};
const cookie = {
  create(name, value, minutes, domain) {
    let cookieOptions = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      path: "/",
      sameSite: "strict"
    };
    if (minutes) {
      cookieOptions.expires = /* @__PURE__ */ new Date();
      cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1e3);
    }
    if (domain) cookieOptions.domain = domain;
    document.cookie = serializeCookie(name, value, cookieOptions);
  },
  read(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  remove(name, domain) {
    this.create(name, "", -1, domain);
  }
};
var cookie$1 = {
  name: "cookie",
  // Deconstruct the options object and extract the lookupCookie property
  lookup(_ref) {
    let {
      lookupCookie
    } = _ref;
    if (lookupCookie && typeof document !== "undefined") {
      return cookie.read(lookupCookie) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupCookie,
      cookieMinutes,
      cookieDomain,
      cookieOptions
    } = _ref2;
    if (lookupCookie && typeof document !== "undefined") {
      cookie.create(lookupCookie, lng, cookieMinutes, cookieDomain, cookieOptions);
    }
  }
};
var querystring = {
  name: "querystring",
  // Deconstruct the options object and extract the lookupQuerystring property
  lookup(_ref) {
    let {
      lookupQuerystring
    } = _ref;
    let found;
    if (typeof window !== "undefined") {
      let {
        search
      } = window.location;
      if (!window.location.search && window.location.hash?.indexOf("?") > -1) {
        search = window.location.hash.substring(window.location.hash.indexOf("?"));
      }
      const query = search.substring(1);
      const params = query.split("&");
      for (let i = 0; i < params.length; i++) {
        const pos = params[i].indexOf("=");
        if (pos > 0) {
          const key = params[i].substring(0, pos);
          if (key === lookupQuerystring) {
            found = params[i].substring(pos + 1);
          }
        }
      }
    }
    return found;
  }
};
var hash = {
  name: "hash",
  // Deconstruct the options object and extract the lookupHash property and the lookupFromHashIndex property
  lookup(_ref) {
    let {
      lookupHash,
      lookupFromHashIndex
    } = _ref;
    let found;
    if (typeof window !== "undefined") {
      const {
        hash: hash2
      } = window.location;
      if (hash2 && hash2.length > 2) {
        const query = hash2.substring(1);
        if (lookupHash) {
          const params = query.split("&");
          for (let i = 0; i < params.length; i++) {
            const pos = params[i].indexOf("=");
            if (pos > 0) {
              const key = params[i].substring(0, pos);
              if (key === lookupHash) {
                found = params[i].substring(pos + 1);
              }
            }
          }
        }
        if (found) return found;
        if (!found && lookupFromHashIndex > -1) {
          const language = hash2.match(/\/([a-zA-Z-]*)/g);
          if (!Array.isArray(language)) return void 0;
          const index = typeof lookupFromHashIndex === "number" ? lookupFromHashIndex : 0;
          return language[index]?.replace("/", "");
        }
      }
    }
    return found;
  }
};
let hasLocalStorageSupport = null;
const localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;
  try {
    hasLocalStorageSupport = typeof window !== "undefined" && window.localStorage !== null;
    if (!hasLocalStorageSupport) {
      return false;
    }
    const testKey = "i18next.translate.boo";
    window.localStorage.setItem(testKey, "foo");
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }
  return hasLocalStorageSupport;
};
var localStorage$1 = {
  name: "localStorage",
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(_ref) {
    let {
      lookupLocalStorage
    } = _ref;
    if (lookupLocalStorage && localStorageAvailable()) {
      return window.localStorage.getItem(lookupLocalStorage) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupLocalStorage
    } = _ref2;
    if (lookupLocalStorage && localStorageAvailable()) {
      window.localStorage.setItem(lookupLocalStorage, lng);
    }
  }
};
let hasSessionStorageSupport = null;
const sessionStorageAvailable = () => {
  if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;
  try {
    hasSessionStorageSupport = typeof window !== "undefined" && window.sessionStorage !== null;
    if (!hasSessionStorageSupport) {
      return false;
    }
    const testKey = "i18next.translate.boo";
    window.sessionStorage.setItem(testKey, "foo");
    window.sessionStorage.removeItem(testKey);
  } catch (e) {
    hasSessionStorageSupport = false;
  }
  return hasSessionStorageSupport;
};
var sessionStorage = {
  name: "sessionStorage",
  lookup(_ref) {
    let {
      lookupSessionStorage
    } = _ref;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      return window.sessionStorage.getItem(lookupSessionStorage) || void 0;
    }
    return void 0;
  },
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupSessionStorage
    } = _ref2;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      window.sessionStorage.setItem(lookupSessionStorage, lng);
    }
  }
};
var navigator$1 = {
  name: "navigator",
  lookup(options) {
    const found = [];
    if (typeof navigator !== "undefined") {
      const {
        languages,
        userLanguage,
        language
      } = navigator;
      if (languages) {
        for (let i = 0; i < languages.length; i++) {
          found.push(languages[i]);
        }
      }
      if (userLanguage) {
        found.push(userLanguage);
      }
      if (language) {
        found.push(language);
      }
    }
    return found.length > 0 ? found : void 0;
  }
};
var htmlTag = {
  name: "htmlTag",
  // Deconstruct the options object and extract the htmlTag property
  lookup(_ref) {
    let {
      htmlTag: htmlTag2
    } = _ref;
    let found;
    const internalHtmlTag = htmlTag2 || (typeof document !== "undefined" ? document.documentElement : null);
    if (internalHtmlTag && typeof internalHtmlTag.getAttribute === "function") {
      found = internalHtmlTag.getAttribute("lang");
    }
    return found;
  }
};
var path = {
  name: "path",
  // Deconstruct the options object and extract the lookupFromPathIndex property
  lookup(_ref) {
    let {
      lookupFromPathIndex
    } = _ref;
    if (typeof window === "undefined") return void 0;
    const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
    if (!Array.isArray(language)) return void 0;
    const index = typeof lookupFromPathIndex === "number" ? lookupFromPathIndex : 0;
    return language[index]?.replace("/", "");
  }
};
var subdomain = {
  name: "subdomain",
  lookup(_ref) {
    let {
      lookupFromSubdomainIndex
    } = _ref;
    const internalLookupFromSubdomainIndex = typeof lookupFromSubdomainIndex === "number" ? lookupFromSubdomainIndex + 1 : 1;
    const language = typeof window !== "undefined" && window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);
    if (!language) return void 0;
    return language[internalLookupFromSubdomainIndex];
  }
};
let canCookies = false;
try {
  document.cookie;
  canCookies = true;
} catch (e) {
}
const order = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
if (!canCookies) order.splice(1, 1);
const getDefaults = () => ({
  order,
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  // cache user language
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain'
  convertDetectedLanguage: (l) => l
});
class Browser {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.type = "languageDetector";
    this.detectors = {};
    this.init(services, options);
  }
  init() {
    let services = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
      languageUtils: {}
    };
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let i18nOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.services = services;
    this.options = defaults(options, this.options || {}, getDefaults());
    if (typeof this.options.convertDetectedLanguage === "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1) {
      this.options.convertDetectedLanguage = (l) => l.replace("-", "_");
    }
    if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
    this.i18nOptions = i18nOptions;
    this.addDetector(cookie$1);
    this.addDetector(querystring);
    this.addDetector(localStorage$1);
    this.addDetector(sessionStorage);
    this.addDetector(navigator$1);
    this.addDetector(htmlTag);
    this.addDetector(path);
    this.addDetector(subdomain);
    this.addDetector(hash);
  }
  addDetector(detector) {
    this.detectors[detector.name] = detector;
    return this;
  }
  detect() {
    let detectionOrder = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order;
    let detected = [];
    detectionOrder.forEach((detectorName) => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options);
        if (lookup && typeof lookup === "string") lookup = [lookup];
        if (lookup) detected = detected.concat(lookup);
      }
    });
    detected = detected.filter((d) => d !== void 0 && d !== null && !hasXSS(d)).map((d) => this.options.convertDetectedLanguage(d));
    if (this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes) return detected;
    return detected.length > 0 ? detected[0] : null;
  }
  cacheUserLanguage(lng) {
    let caches = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    if (!caches) return;
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
    caches.forEach((cacheName) => {
      if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
    });
  }
}
Browser.type = "languageDetector";
const normalizeLanguage = (lang) => {
  const normalized = (lang || "").trim().toLowerCase();
  return normalized.startsWith("pt") ? "pt" : "en";
};
const namespaceLoaders = {
  en: {
    translation: async () => (await __vitePreload(async () => {
      const { default: __vite_default__ } = await import("./translation-DRJE7Sut.js");
      return { default: __vite_default__ };
    }, true ? [] : void 0)).default,
    quiz: async () => (await __vitePreload(async () => {
      const { default: __vite_default__ } = await import("./quiz-DtIZ1Gly.js");
      return { default: __vite_default__ };
    }, true ? [] : void 0)).default
  },
  pt: {
    translation: async () => (await __vitePreload(async () => {
      const { default: __vite_default__ } = await import("./translation-C8AQ-Jfy.js");
      return { default: __vite_default__ };
    }, true ? [] : void 0)).default,
    quiz: async () => (await __vitePreload(async () => {
      const { default: __vite_default__ } = await import("./quiz-DYRisJSb.js");
      return { default: __vite_default__ };
    }, true ? [] : void 0)).default
  }
};
const normalizeNamespace = (ns) => {
  return ns === "quiz" ? "quiz" : "translation";
};
instance.use({
  type: "backend",
  read: async (language, namespace, callback) => {
    const normalizedLanguage = normalizeLanguage(language);
    const normalizedNamespace = normalizeNamespace(namespace);
    try {
      const loader = namespaceLoaders[normalizedLanguage][normalizedNamespace];
      const translations = await loader();
      callback(null, translations);
    } catch (error) {
      callback(error, false);
    }
  }
}).use(Browser).use(initReactI18next).init({
  fallbackLng: "en",
  supportedLngs: ["en", "pt"],
  ns: ["translation", "quiz"],
  defaultNS: "translation",
  load: "languageOnly",
  nonExplicitSupportedLngs: true,
  cleanCode: true,
  detection: {
    order: ["path", "localStorage", "navigator", "htmlTag"],
    lookupFromPathIndex: 0,
    caches: ["localStorage"],
    convertDetectedLanguage: (lng) => normalizeLanguage(lng)
  },
  returnNull: false,
  returnEmptyString: false,
  interpolation: { escapeValue: false },
  react: {
    useSuspense: true,
    nsMode: "fallback"
  }
});
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
export {
  useAuth as $,
  ARTIST as A,
  useCart as B,
  Calendar as C,
  Download as D,
  ExternalLink as E,
  useTracksQuery as F,
  Globe as G,
  HeadlessSEO as H,
  Instagram as I,
  useProfileQuery as J,
  useNewsletterStatusQuery as K,
  useUpdateProfileMutation as L,
  Music2 as M,
  useUpdateNewsletterMutation as N,
  useUserOrdersQuery as O,
  ShoppingBag as P,
  Settings as Q,
  LogOut as R,
  Sparkles as S,
  Trophy as T,
  User as U,
  useGamipressQuery as V,
  buildApiUrl as W,
  X,
  Youtube as Y,
  getAuthHeaders as Z,
  safeRedirect as _,
  MessageCircle as a,
  patternSvg as a0,
  Briefcase as a1,
  House as a2,
  Mail as b,
  createLucideIcon as c,
  Award as d,
  MapPin as e,
  ChevronDown as f,
  getWhatsAppUrl as g,
  getTurnstileSiteKey as h,
  getLocalizedRoute as i,
  ARTIST_SCHEMA_BASE as j,
  Users as k,
  safeUrl as l,
  Music as m,
  normalizeLanguage$1 as n,
  useEventById as o,
  useEventsQuery as p,
  useTrackBySlug as q,
  Clock as r,
  sanitizeHtml as s,
  CirclePlay as t,
  useUser as u,
  useShopPageQuery as v,
  useAddToCartMutation as w,
  Helmet as x,
  Info as y,
  ChevronRight as z
};
//# sourceMappingURL=index-Cac5tBAe.js.map
