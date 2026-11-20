/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, pt = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ut = Symbol(), yt = /* @__PURE__ */ new WeakMap();
let Dt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (pt && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = yt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && yt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Kt = (i) => new Dt(typeof i == "string" ? i : i + "", void 0, ut), Yt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[n + 1], i[0]);
  return new Dt(e, i, ut);
}, Jt = (i, t) => {
  if (pt) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), s = Z.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = e.cssText, i.appendChild(r);
  }
}, xt = pt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return Kt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Qt, defineProperty: te, getOwnPropertyDescriptor: ee, getOwnPropertyNames: re, getOwnPropertySymbols: se, getPrototypeOf: ie } = Object, tt = globalThis, wt = tt.trustedTypes, ne = wt ? wt.emptyScript : "", oe = tt.reactiveElementPolyfillSupport, B = (i, t) => i, at = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? ne : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ut = (i, t) => !Qt(i, t), At = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: Ut };
Symbol.metadata ??= Symbol("metadata"), tt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = At) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, e);
      s !== void 0 && te(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: s, set: n } = ee(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const p = s?.call(this);
      n?.call(this, o), this.requestUpdate(t, p, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? At;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const t = ie(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const e = this.properties, r = [...re(e), ...se(e)];
      for (const s of r) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, s] of e) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const s = this._$Eu(e, r);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r) e.unshift(xt(s));
    } else t !== void 0 && e.push(xt(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Jt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : at).toAttribute(e, r.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : at;
      this._$Em = s;
      const p = o.fromAttribute(e, n.type);
      this[s] = p ?? this._$Ej?.get(s) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, s = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[t]), r ??= o.getPropertyOptions(t), !((r.hasChanged ?? Ut)(n, e) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, n] of r) {
        const { wrapped: o } = n, p = this[s];
        o !== !0 || this._$AL.has(s) || p === void 0 || this.C(s, void 0, n, p);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[B("elementProperties")] = /* @__PURE__ */ new Map(), P[B("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: P }), (tt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = globalThis, kt = (i) => i, K = gt.trustedTypes, St = K ? K.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Lt = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + w, ae = `<${zt}>`, M = document, j = () => M.createComment(""), I = (i) => i === null || typeof i != "object" && typeof i != "function", ft = Array.isArray, le = (i) => ft(i) || typeof i?.[Symbol.iterator] == "function", rt = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Et = /-->/g, Mt = />/g, k = RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ct = /'/g, Tt = /"/g, Bt = /^(?:script|style|textarea|title)$/i, jt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), m = jt(1), st = jt(2), C = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Ht = /* @__PURE__ */ new WeakMap(), S = M.createTreeWalker(M, 129);
function It(i, t) {
  if (!ft(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return St !== void 0 ? St.createHTML(t) : t;
}
const he = (i, t) => {
  const e = i.length - 1, r = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = L;
  for (let p = 0; p < e; p++) {
    const a = i[p];
    let g, h, c = -1, v = 0;
    for (; v < a.length && (o.lastIndex = v, h = o.exec(a), h !== null); ) v = o.lastIndex, o === L ? h[1] === "!--" ? o = Et : h[1] !== void 0 ? o = Mt : h[2] !== void 0 ? (Bt.test(h[2]) && (s = RegExp("</" + h[2], "g")), o = k) : h[3] !== void 0 && (o = k) : o === k ? h[0] === ">" ? (o = s ?? L, c = -1) : h[1] === void 0 ? c = -2 : (c = o.lastIndex - h[2].length, g = h[1], o = h[3] === void 0 ? k : h[3] === '"' ? Tt : Ct) : o === Tt || o === Ct ? o = k : o === Et || o === Mt ? o = L : (o = k, s = void 0);
    const $ = o === k && i[p + 1].startsWith("/>") ? " " : "";
    n += o === L ? a + ae : c >= 0 ? (r.push(g), a.slice(0, c) + Lt + a.slice(c) + w + $) : a + w + (c === -2 ? p : $);
  }
  return [It(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class F {
  constructor({ strings: t, _$litType$: e }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const p = t.length - 1, a = this.parts, [g, h] = he(t, e);
    if (this.el = F.createElement(g, r), S.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = S.nextNode()) !== null && a.length < p; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Lt)) {
          const v = h[o++], $ = s.getAttribute(c).split(w), x = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: n, name: x[2], strings: $, ctor: x[1] === "." ? de : x[1] === "?" ? pe : x[1] === "@" ? ue : et }), s.removeAttribute(c);
        } else c.startsWith(w) && (a.push({ type: 6, index: n }), s.removeAttribute(c));
        if (Bt.test(s.tagName)) {
          const c = s.textContent.split(w), v = c.length - 1;
          if (v > 0) {
            s.textContent = K ? K.emptyScript : "";
            for (let $ = 0; $ < v; $++) s.append(c[$], j()), S.nextNode(), a.push({ type: 2, index: ++n });
            s.append(c[v], j());
          }
        }
      } else if (s.nodeType === 8) if (s.data === zt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(w, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += w.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const r = M.createElement("template");
    return r.innerHTML = t, r;
  }
}
function N(i, t, e = i, r) {
  if (t === C) return t;
  let s = r !== void 0 ? e._$Co?.[r] : e._$Cl;
  const n = I(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(i), s._$AT(i, e, r)), r !== void 0 ? (e._$Co ??= [])[r] = s : e._$Cl = s), s !== void 0 && (t = N(i, s._$AS(i, t.values), s, r)), t;
}
class ce {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: r } = this._$AD, s = (t?.creationScope ?? M).importNode(e, !0);
    S.currentNode = s;
    let n = S.nextNode(), o = 0, p = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let g;
        a.type === 2 ? g = new V(n, n.nextSibling, this, t) : a.type === 1 ? g = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (g = new ge(n, this, t)), this._$AV.push(g), a = r[++p];
      }
      o !== a?.index && (n = S.nextNode(), o++);
    }
    return S.currentNode = M, s;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class V {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, r, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = N(this, t, e), I(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : le(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && I(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = F.createElement(It(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const n = new ce(s, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = Ht.get(t.strings);
    return e === void 0 && Ht.set(t.strings, e = new F(t)), e;
  }
  k(t) {
    ft(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, s = 0;
    for (const n of t) s === e.length ? e.push(r = new V(this.O(j()), this.O(j()), this, this.options)) : r = e[s], r._$AI(n), s++;
    s < e.length && (this._$AR(r && r._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const r = kt(t).nextSibling;
      kt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class et {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, s, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = u;
  }
  _$AI(t, e = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = N(this, t, e, 0), o = !I(t) || t !== this._$AH && t !== C, o && (this._$AH = t);
    else {
      const p = t;
      let a, g;
      for (t = n[0], a = 0; a < n.length - 1; a++) g = N(this, p[r + a], e, a), g === C && (g = this._$AH[a]), o ||= !I(g) || g !== this._$AH[a], g === u ? t = u : t !== u && (t += (g ?? "") + n[a + 1]), this._$AH[a] = g;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class de extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class pe extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ue extends et {
  constructor(t, e, r, s, n) {
    super(t, e, r, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = N(this, t, e, 0) ?? u) === C) return;
    const r = this._$AH, s = t === u && r !== u || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== u && (r === u || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ge {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const fe = gt.litHtmlPolyfillSupport;
fe?.(F, V), (gt.litHtmlVersions ??= []).push("3.3.3");
const me = (i, t, e) => {
  const r = e?.renderBefore ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = e?.renderBefore ?? null;
    r._$litPart$ = s = new V(t.insertBefore(j(), n), n, void 0, e ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis;
let O = class extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = me(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return C;
  }
};
O._$litElement$ = !0, O.finalized = !0, mt.litElementHydrateSupport?.({ LitElement: O });
const _e = mt.litElementPolyfillSupport;
_e?.({ LitElement: O });
(mt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = { ATTRIBUTE: 1 }, be = (i) => (...t) => ({ _$litDirective$: i, values: t });
let $e = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, r) {
    this._$Ct = t, this._$AM = e, this._$Ci = r;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = "important", ye = " !" + Ft, xe = be(class extends $e {
  constructor(i) {
    if (super(i), i.type !== ve.ATTRIBUTE || i.name !== "style" || i.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return Object.keys(i).reduce((t, e) => {
      const r = i[e];
      return r == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(i, [t]) {
    const { style: e } = i.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const r of this.ft) t[r] == null && (this.ft.delete(r), r.includes("-") ? e.removeProperty(r) : e[r] = null);
    for (const r in t) {
      const s = t[r];
      if (s != null) {
        this.ft.add(r);
        const n = typeof s == "string" && s.endsWith(ye);
        r.includes("-") || n ? e.setProperty(r, n ? s.slice(0, -11) : s, n ? Ft : "") : e[r] = s;
      }
    }
    return C;
  }
}), lt = {
  very_low: "Very Low",
  low: "Low",
  ok: "OK",
  high: "High",
  very_high: "Very High"
}, we = Object.keys(lt);
function y(i) {
  if (i == null || i === "") return null;
  const t = Number(i);
  return Number.isFinite(t) ? t : null;
}
function Vt(i) {
  return i >= 96 ? "very_high" : i >= 81 ? "high" : i >= 61 ? "ok" : i >= 41 ? "low" : "very_low";
}
function Ae(i) {
  const t = i?.attributes ?? {}, e = i ? y(i.state) : null, r = String(t.band ?? ""), s = we.includes(r) ? r : e !== null ? Vt(e) : null;
  return {
    score: e,
    band: s,
    night: typeof t.night == "string" ? t.night : null,
    duration: y(t.duration_points),
    bedtime: y(t.bedtime_points),
    interruptions: y(t.interruptions_points),
    asleepMinutes: y(t.asleep_minutes),
    deviationMinutes: y(t.bedtime_deviation_minutes),
    wakeups: y(t.wakeups),
    awakeMinutes: y(t.awake_minutes),
    stages: Array.isArray(t.stages) ? t.stages : [],
    history: Array.isArray(t.history) ? t.history : [],
    goalHours: y(t.duration_goal_hours),
    usualOnsetMinutes: y(t.usual_onset_minutes),
    heartRate: y(t.heart_rate_average),
    heartRateLow: y(t.heart_rate_lowest),
    heartRateHours: Array.isArray(t.heart_rate_hours) ? t.heart_rate_hours : []
  };
}
function E(i) {
  const t = Math.round(Math.abs(i)), e = Math.floor(t / 60), r = t % 60;
  return e === 0 ? `${r}m` : `${e}h ${String(r).padStart(2, "0")}m`;
}
function ke(i) {
  return i.asleepMinutes === null ? "" : `${E(i.asleepMinutes)} asleep`;
}
function Se(i) {
  if (i.bedtime === null) return "";
  if (i.deviationMinutes === null) return "No bedtime history yet";
  if (Math.abs(i.deviationMinutes) < 1) return "At your usual time";
  const t = i.deviationMinutes > 0 ? "later" : "earlier";
  return `${E(i.deviationMinutes)} ${t} than usual`;
}
function Ee(i) {
  if (i.wakeups === null) return "";
  const t = i.awakeMinutes === null ? "" : `, ${E(i.awakeMinutes)} awake`;
  return i.wakeups === 0 ? `No wake-ups${t}` : `${i.wakeups} wake-up${i.wakeups === 1 ? "" : "s"}${t}`;
}
function Y(i) {
  const [t, e, r] = i.split("-").map(Number);
  return new Date(t, (e || 1) - 1, r || 1);
}
function Gt(i) {
  const t = String(i.getMonth() + 1).padStart(2, "0"), e = String(i.getDate()).padStart(2, "0");
  return `${i.getFullYear()}-${t}-${e}`;
}
function it(i, t) {
  return Y(i).toLocaleDateString(t, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function Rt(i, t, e) {
  try {
    return i.toLocaleTimeString(t, { hour: "numeric", minute: "2-digit", timeZone: e });
  } catch {
    return i.toLocaleTimeString(t, { hour: "numeric", minute: "2-digit" });
  }
}
function Pt(i) {
  return i === null ? "--" : String(Math.round(i));
}
function Me(i, t) {
  const e = ((Math.round(i) + 720) % 1440 + 1440) % 1440;
  return new Date(2e3, 0, 1, Math.floor(e / 60), e % 60).toLocaleTimeString(t, { hour: "numeric", minute: "2-digit" });
}
function nt(i) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: i,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(/* @__PURE__ */ new Date());
  } catch {
    return Gt(/* @__PURE__ */ new Date());
  }
}
function Ce(i, t) {
  return Math.round((Y(t).getTime() - Y(i).getTime()) / 864e5);
}
const Wt = [
  "duration",
  "bedtime",
  "interruptions",
  // Optional second colour of each ring: the ring fades from the first to this one.
  "duration_end",
  "bedtime_end",
  "interruptions_end",
  "very_low",
  "low",
  "ok",
  "high",
  "very_high",
  "awake",
  "rem",
  "core",
  "deep",
  "heart",
  "heart_low"
], ht = "synthwave", ot = {
  theme: {
    // Base colours come from the stylesheet (and the HA theme); only the
    // second colour of each ring's gradient is set here.
    colors: { duration_end: "#a78bfa", bedtime_end: "#34d3b4", interruptions_end: "#f97316" },
    tiles: !0
  },
  synthwave: {
    colors: {
      duration: "#ffb224",
      bedtime: "#ff2fd6",
      interruptions: "#5df0a8",
      duration_end: "#ff7a3d",
      bedtime_end: "#a46bff",
      interruptions_end: "#4df3ff",
      very_low: "#ff2fd6",
      low: "#ffb224",
      ok: "#a46bff",
      high: "#4df3ff",
      very_high: "#5df0a8",
      awake: "#ffb224",
      rem: "#4df3ff",
      core: "#3d7bff",
      deep: "#6d3dff",
      heart: "#ff2fd6",
      heart_low: "#a46bff"
    },
    vars: {
      "--sr-text": "#f1e8ff",
      "--sr-secondary-text": "#b9a6d6",
      "--sr-divider": "#3b1c66",
      "--sr-track": "rgba(185,166,214,0.10)",
      "--sr-track-opacity": "1",
      "--sr-accent-text": "currentColor",
      "--sr-glow": "6px",
      "--sr-tile-fill": "12%",
      "--sr-tile-border": "45%",
      "--sr-tile-glow": "18%",
      "--sr-tile-inset": "7%",
      "--sr-title-tint": "100%",
      "--sr-halo": "13%",
      "--sr-score-glow": "45%",
      "--sr-stages-tint": "#a46bff",
      "--sr-history-tint": "#4df3ff"
    },
    tiles: !0,
    // A neon palette needs a dark card, whatever the dashboard theme is.
    background: { "--ha-card-background": "#16082b", "--ha-card-border-color": "#3b1c66" }
  },
  health: {
    colors: {
      duration: "#5e5ce6",
      bedtime: "#32ade6",
      interruptions: "#ff9f0a",
      duration_end: "#bf5af2",
      bedtime_end: "#64d2ff",
      interruptions_end: "#ff6b5e",
      very_low: "#ff453a",
      low: "#ff9f0a",
      ok: "#ffd60a",
      high: "#30d158",
      very_high: "#40c8e0",
      awake: "#ff6b5e",
      rem: "#5ac8fa",
      core: "#0a84ff",
      deep: "#3634a3",
      heart: "#ff375f",
      heart_low: "#bf5af2"
    },
    tiles: !0
  }
}, Te = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla)\([0-9.,%\s/deg-]+\)|var\(--[a-z0-9-]+\))$/i;
function He(i) {
  if (typeof i != "string") return;
  const t = i.trim();
  return Te.test(t) ? t : void 0;
}
function Xt(i) {
  const t = typeof i == "string" ? i : ht;
  return Object.prototype.hasOwnProperty.call(ot, t) ? ot[t] : ot[ht];
}
function qt(i) {
  return Xt(i).tiles ?? !1;
}
function Re(i, t, e = !1) {
  const r = Xt(i), s = {
    ...r.vars ?? {},
    ...e ? {} : r.background ?? {}
  };
  for (const n of Wt) {
    const o = He(t?.[n]) ?? r.colors[n];
    o && (s[`--sr-${n.replace("_", "-")}`] = o);
  }
  return s;
}
const Ot = "sleep-rings-card-editor", Zt = {
  entity: "Sleep score entity",
  name: "Title",
  preset: "Colour preset",
  ring_style: "Ring style",
  show_rows: "Scorecard rows",
  show_hypnogram: "Sleep stages",
  show_history: "Score history",
  show_heart_rate: "Sleeping heart rate",
  sleep_goal_hours: "Sleep goal (hours)",
  heart: "Heart rate (average and high)",
  heart_low: "Heart rate (low)",
  tiles: "Tinted boxes",
  theme_background: "Use the theme's card background",
  history_nights: "Nights of history",
  colors: "Colours",
  duration: "Duration",
  duration_end: "Duration (gradient end)",
  bedtime: "Bedtime",
  bedtime_end: "Bedtime (gradient end)",
  interruptions: "Interruptions",
  interruptions_end: "Interruptions (gradient end)",
  very_low: "Band: Very Low",
  low: "Band: Low",
  ok: "Band: OK",
  high: "Band: High",
  very_high: "Band: Very High",
  awake: "Stage: Awake",
  rem: "Stage: REM",
  core: "Stage: Core",
  deep: "Stage: Deep"
}, Pe = {
  colors: "Any CSS colour, for example #ff2fd6. Leave a field empty to use the preset.",
  theme_background: "Off: the Synthwave preset paints its own dark card.",
  sleep_goal_hours: "Shown on the Duration row. Empty: the duration that earns full points."
}, T = (i) => ({ name: i, selector: { boolean: {} } }), Oe = [
  {
    name: "entity",
    required: !0,
    selector: { entity: { filter: { integration: "sleep_rings", domain: "sensor" } } }
  },
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "preset",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "synthwave", label: "Synthwave" },
              { value: "theme", label: "Follow the theme (light or dark)" },
              { value: "health", label: "Health" }
            ]
          }
        }
      },
      {
        name: "ring_style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "concentric", label: "Three rings" },
              { value: "segmented", label: "One ring split 50 / 30 / 20" }
            ]
          }
        }
      }
    ]
  },
  {
    type: "grid",
    name: "",
    schema: [
      T("show_rows"),
      T("show_hypnogram"),
      T("show_history"),
      T("show_heart_rate"),
      T("tiles"),
      T("theme_background")
    ]
  },
  { name: "sleep_goal_hours", selector: { number: { min: 4, max: 12, step: 0.1, mode: "box" } } },
  { name: "history_nights", selector: { number: { min: 7, max: 60, step: 1, mode: "slider" } } },
  {
    type: "expandable",
    name: "colors",
    title: Zt.colors,
    schema: Wt.map((i) => ({ name: i, selector: { text: {} } }))
  }
], _t = class _t extends O {
  setConfig(t) {
    this._config = t;
  }
  render() {
    if (!this._config) return u;
    const t = {
      preset: ht,
      ring_style: "concentric",
      show_rows: !0,
      show_hypnogram: !0,
      show_history: !0,
      show_heart_rate: !0,
      history_nights: 30,
      theme_background: !1,
      tiles: qt(this._config.preset),
      ...this._config
    };
    return m`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${Oe}
        .computeLabel=${(e) => Zt[e.name] ?? e.name}
        .computeHelper=${(e) => Pe[e.name]}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  _valueChanged(t) {
    t.stopPropagation();
    const e = { ...t.detail.value };
    if (e.colors) {
      const r = Object.fromEntries(
        Object.entries(e.colors).filter(
          ([, s]) => typeof s == "string" && s.trim()
        )
      );
      Object.keys(r).length ? e.colors = r : delete e.colors;
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 })
    );
  }
};
_t.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
};
let ct = _t;
customElements.get(Ot) || customElements.define(Ot, ct);
const Ne = Yt`
  :host {
    display: block;
    container-type: inline-size;
  }

  /* Colour tokens live on ha-card, where the preset's --sr-* values are set inline. */
  ha-card {
    --_duration: var(--sr-duration, var(--sleep-rings-duration-color, #6e6adf));
    --_bedtime: var(--sr-bedtime, var(--sleep-rings-bedtime-color, #2aa9c9));
    --_interruptions: var(--sr-interruptions, var(--sleep-rings-interruptions-color, #f59e0b));
    --_very-low: var(--sr-very-low, var(--sleep-rings-very-low-color, #ef4444));
    --_low: var(--sr-low, var(--sleep-rings-low-color, #f59e0b));
    --_ok: var(--sr-ok, var(--sleep-rings-ok-color, #eab308));
    --_high: var(--sr-high, var(--sleep-rings-high-color, #22c55e));
    --_very-high: var(--sr-very-high, var(--sleep-rings-very-high-color, #14b8a6));
    --_awake: var(--sr-awake, var(--sleep-rings-awake-color, #f97316));
    --_rem: var(--sr-rem, var(--sleep-rings-rem-color, #38bdf8));
    --_core: var(--sr-core, var(--sleep-rings-core-color, #3b82f6));
    --_deep: var(--sr-deep, var(--sleep-rings-deep-color, #4f46e5));
    --_heart: var(--sr-heart, var(--sleep-rings-heart-color, #ef4444));
    --_heart-low: var(--sr-heart-low, var(--sleep-rings-heart-low-color, #8b5cf6));
    --_text: var(--sr-text, var(--primary-text-color, #1c1c1e));
    --_text2: var(--sr-secondary-text, var(--secondary-text-color, #6b6b70));
    --_divider: var(--sr-divider, var(--divider-color, rgba(127, 127, 127, 0.25)));
    --_accent-text: var(--sr-accent-text, var(--_text));
    --_glow: var(--sr-glow, 0px);
    --_lane: 26px;
  }

  ha-card {
    display: block;
    padding: 16px;
    color: var(--_text);
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .night {
    font-size: 12px;
    color: var(--_text2);
    white-space: nowrap;
  }

  /* Hero: rings beside the scorecard, stacked on narrow cards */
  .hero {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .rings {
    position: relative;
    flex: 0 0 164px;
    width: 164px;
    height: 164px;
  }
  .rings svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    overflow: visible;
  }
  .track,
  .fill {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
  }
  .track {
    stroke: var(--sr-track, currentColor);
    opacity: var(--sr-track-opacity, 0.16);
  }
  .fill {
    transition:
      stroke-dashoffset 0.7s ease,
      stroke-dasharray 0.7s ease;
    filter: drop-shadow(0 0 calc(var(--_glow) * 0.5) color-mix(in srgb, currentColor 55%, transparent));
  }
  .fill.empty {
    opacity: 0;
  }
  .c-duration {
    color: var(--_duration);
    --end: var(--sr-duration-end, var(--_duration));
  }
  .c-bedtime {
    color: var(--_bedtime);
    --end: var(--sr-bedtime-end, var(--_bedtime));
  }
  .c-interruptions {
    color: var(--_interruptions);
    --end: var(--sr-interruptions-end, var(--_interruptions));
  }

  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    pointer-events: none;
    color: var(--_text);
  }
  .score {
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .segmented .score {
    font-size: 46px;
  }
  .band {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }
  .band span:last-child {
    color: var(--sr-accent-text, var(--_text2));
  }
  .segmented .band {
    font-size: 12px;
    margin-top: 6px;
  }
  .band-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) currentColor;
  }
  .b-very_low {
    color: var(--_very-low);
    --band: var(--_very-low);
  }
  .b-low {
    color: var(--_low);
    --band: var(--_low);
  }
  .b-ok {
    color: var(--_ok);
    --band: var(--_ok);
  }
  .b-high {
    color: var(--_high);
    --band: var(--_high);
  }
  .b-very_high {
    color: var(--_very-high);
    --band: var(--_very-high);
  }

  .rows {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: var(--sr-panel-pad, 0);
    border: 1px solid var(--sr-panel-border, transparent);
    border-radius: 12px;
    background: var(--sr-panel-bg, transparent);
  }
  .row-head {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 13px;
  }
  .dot {
    align-self: center;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex: none;
  }
  .row-name {
    flex: 1;
    font-weight: 600;
    color: var(--_accent-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row-pts {
    color: var(--_text2);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .row-pts b {
    color: var(--_text);
    font-size: 15px;
    font-weight: 700;
  }
  .bar {
    height: 5px;
    margin: 5px 0 4px;
    border-radius: 3px;
    background: var(--sr-track, color-mix(in srgb, currentColor 16%, transparent));
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, currentColor, var(--end, currentColor));
    box-shadow: 0 0 var(--_glow) color-mix(in srgb, currentColor 60%, transparent);
    transition: width 0.7s ease;
  }
  .row-detail {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--_text2);
  }
  .row-target {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Marker beside the date: is this today's night or an older one? */
  .age {
    display: inline-block;
    margin-right: 8px;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid color-mix(in srgb, currentColor 45%, transparent);
    background: color-mix(in srgb, currentColor 12%, transparent);
  }
  .age.fresh {
    color: var(--_very-high);
  }
  .age.recent {
    color: var(--_low);
  }
  .age.old {
    color: var(--_very-low);
  }

  /* Minutes and share of each stage, under the hypnogram */
  .stage-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
    gap: 6px 14px;
    margin-top: 8px;
    font-size: 12px;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .stat-name {
    color: var(--_text2);
  }
  /* Bars and the combined row only appear where the panel has room (wide layout). */
  .stat-bar,
  .stat.s-combo {
    display: none;
  }
  .stat-bar {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: var(--sr-track, color-mix(in srgb, currentColor 16%, transparent));
    overflow: hidden;
  }
  .stat-bar i {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) color-mix(in srgb, currentColor 60%, transparent);
  }
  .s-combo {
    color: var(--_rem);
  }
  .s-combo .dot,
  .s-combo .stat-bar i {
    background: linear-gradient(90deg, var(--_deep), var(--_rem));
  }
  .night-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--_text2);
  }
  .night-summary b {
    color: var(--_text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .stat-value {
    margin-left: auto;
    color: var(--_text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .stat-pct {
    width: 30px;
    text-align: right;
    color: var(--_text2);
    font-variant-numeric: tabular-nums;
  }

  /* Sleeping heart rate */
  .section.heart {
    --tint: var(--_heart);
  }
  .hr-summary {
    color: var(--_text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .hr-chart {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 6px;
  }
  .hr-yaxis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 112px;
    margin: -5px 0;
    font-size: 10px;
    line-height: 10px;
    text-align: right;
    color: var(--_text2);
    font-variant-numeric: tabular-nums;
  }
  .hr-plot {
    position: relative;
    height: 102px;
  }
  .hr-plot svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .hr-grid {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed var(--_divider);
  }
  .hr-line {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
  .hr-line.avg {
    stroke: var(--_heart);
    stroke-width: 2.5;
    filter: drop-shadow(0 0 var(--_glow) color-mix(in srgb, var(--_heart) 55%, transparent));
  }
  .hr-line.high {
    stroke: var(--_heart);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.55;
  }
  .hr-line.low {
    stroke: var(--_heart-low);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.8;
  }
  .hr-area {
    fill: color-mix(in srgb, var(--_heart) 18%, transparent);
    stroke: none;
  }
  /* Hover: one invisible column per hour, a guide line, dots and a floating box */
  .hr-hit {
    position: absolute;
    top: 0;
    bottom: 0;
    background: none;
    border: 0;
    padding: 0;
    cursor: crosshair;
  }
  .hr-hit:focus-visible {
    outline: 1px solid var(--_text2);
    outline-offset: -1px;
  }
  .hr-guide,
  .hr-dot,
  .hr-tip {
    position: absolute;
    pointer-events: none;
  }
  .hr-guide {
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--_text2);
    opacity: 0.45;
  }
  .hr-dot {
    width: 8px;
    height: 8px;
    margin: -4px 0 0 -4px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
  }
  .hr-dot.avg,
  .hr-dot.high {
    background: var(--_heart);
  }
  .hr-dot.low {
    background: var(--_heart-low);
  }
  /* The box floats over the chart, so showing it never moves the layout. */
  .hr-tip {
    top: 4px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: 10px;
    padding: 6px 9px;
    border-radius: 8px;
    font-size: 11px;
    white-space: nowrap;
    color: #f4f1fa;
    background: rgba(18, 14, 28, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  }
  .hr-tip.left {
    margin-left: -10px;
    transform: translateX(-100%);
  }
  .hr-tip b {
    font-weight: 600;
  }
  .hr-tip em {
    font-style: normal;
    opacity: 0.7;
  }
  .hr-tip span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .hr-tip u {
    margin-left: auto;
    padding-left: 12px;
    text-decoration: none;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .hr-tip i,
  .hr-legend i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--_heart);
  }
  .hr-tip .high i,
  .hr-legend .high i {
    opacity: 0.55;
  }
  .hr-tip .low i,
  .hr-legend .low i {
    background: var(--_heart-low);
  }
  .hr-xaxis {
    position: relative;
    grid-column: 2;
    height: 14px;
    margin-top: 3px;
    font-size: 10px;
    color: var(--_text2);
  }
  .hr-xaxis span {
    position: absolute;
    white-space: nowrap;
  }
  .hr-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--_text2);
  }
  .hr-legend span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  /* Sections under the hero */
  .section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--_divider);
  }
  .section-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--_text2);
    margin-bottom: 8px;
  }
  .section-head span:first-child {
    font-weight: 600;
    color: var(--_text);
  }

  /* Hypnogram: four lanes, one rounded bar per stage stretch */
  .hypno {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;
  }
  .lane-labels {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    color: var(--_text2);
  }
  .lane-labels span {
    height: var(--_lane);
    line-height: var(--_lane);
  }
  .plot {
    position: relative;
    height: calc(var(--_lane) * 4);
  }
  .lane-band {
    position: absolute;
    left: 0;
    right: 0;
    height: calc(var(--_lane) - 4px);
    margin-top: 2px;
    border-radius: 6px;
    background: color-mix(in srgb, currentColor 7%, transparent);
  }
  .tick {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--_divider);
  }
  .stage {
    position: absolute;
    height: 12px;
    min-width: 4px;
    border-radius: 6px;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) currentColor;
  }
  .link {
    position: absolute;
    width: 1.5px;
    margin-left: -0.75px;
    opacity: 0.55;
  }
  .s-awake {
    color: var(--_awake);
  }
  .s-rem {
    color: var(--_rem);
  }
  .s-core {
    color: var(--_core);
  }
  .s-deep {
    color: var(--_deep);
  }
  .axis {
    position: relative;
    grid-column: 2;
    height: 16px;
    margin-top: 2px;
    font-size: 10px;
    color: var(--_text2);
  }
  .axis span {
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  /* History: one bar per night, coloured by band */
  .history {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 64px;
  }
  .night-bar {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
  }
  .night-bar i {
    display: block;
    width: 100%;
    min-height: 3px;
    border-radius: 3px 3px 1px 1px;
    background: currentColor;
    opacity: 0.85;
  }
  .night-bar.estimated i {
    opacity: 0.45;
  }
  .night-bar.missing i {
    height: 3px;
    color: var(--_divider);
  }
  .night-bar.selected i,
  .night-bar:hover i {
    opacity: 1;
    box-shadow: 0 0 calc(var(--_glow) + 2px) currentColor;
  }
  .night-bar:focus-visible {
    outline: 2px solid var(--_text2);
    outline-offset: 1px;
    border-radius: 3px;
  }

  /* Tiles: every part in its own tinted, softly glowing box */
  .section.stages {
    --tint: var(--sr-stages-tint, var(--_core));
  }
  .section.nights {
    --tint: var(--sr-history-tint, var(--_bedtime));
  }
  /* Themed presets glow gently; a preset can turn it up with --sr-glow. */
  ha-card.tiles {
    --_glow: var(--sr-glow, 3px);
  }
  .tiles .rows {
    gap: 8px;
  }
  .tiles .row,
  .tiles .section {
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-border, 24%), transparent);
    background: color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-fill, 7%), transparent);
    box-shadow:
      0 0 16px color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-glow, 9%), transparent),
      inset 0 0 20px color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-inset, 0%), transparent);
  }
  .tiles .section {
    margin-top: 12px;
  }
  .tiles .section-head span:first-child {
    color: color-mix(in srgb, var(--tint) var(--sr-title-tint, 0%), var(--_text));
  }
  .tiles .bar {
    margin-bottom: 5px;
  }
  .tiles .rings {
    isolation: isolate;
  }
  .tiles .rings::before {
    content: "";
    position: absolute;
    inset: -14px;
    z-index: -1;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--band, transparent) var(--sr-halo, 7%), transparent) 0%,
      transparent 68%
    );
    pointer-events: none;
  }
  .tiles .score {
    text-shadow: 0 0 12px color-mix(in srgb, var(--band, transparent) var(--sr-score-glow, 0%), transparent);
  }

  .message {
    font-size: 13px;
    color: var(--_text2);
    padding: 8px 0;
  }

  /* Two dashboard columns: hero on the left, stages and history on the right */
  @container (min-width: 640px) {
    .body.has-extras {
      display: grid;
      grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
      column-gap: 28px;
      align-items: center;
    }
    ha-card:not(.tiles) .extras > .section:first-child {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
    }
    .tiles .extras > .section:first-child {
      margin-top: 0;
    }
  }

  /* Between two and three columns the hero column is slim: rings above the rows */
  @container (min-width: 640px) and (max-width: 959px) {
    .has-extras .hero {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    .has-extras .rings {
      align-self: center;
    }
  }

  /* Three columns: hero, stages and history side by side */
  @container (min-width: 960px) {
    .body.has-extras {
      grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    }
    /* Stages on the left, heart rate and history stacked on the right */
    .extras {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px 28px;
      align-items: stretch;
    }
    .extras.has-stages.has-hr > .section.stages {
      grid-row: span 2;
    }
    /* The stages panel is as tall as its two neighbours: fill it with bar rows. */
    .section.stages {
      display: flex;
      flex-direction: column;
    }
    .night-summary {
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--_divider);
    }
    .stage-stats {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      gap: 8px;
      margin-top: 10px;
      min-height: 120px;
    }
    .stat-bar,
    .stat.s-combo {
      display: flex;
    }
    .stat-bar {
      display: block;
    }
    .stat {
      gap: 10px;
    }
    .stat-name {
      width: 76px;
      flex: none;
    }
    .stat-value {
      margin-left: 0;
      width: 56px;
      text-align: right;
    }
    ha-card:not(.tiles) .extras > .section {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
    }
    .tiles .extras {
      column-gap: 12px;
    }
    .tiles .extras > .section {
      margin-top: 0;
    }
    .extras:not(.has-hr) .history {
      height: calc(var(--_lane) * 4);
    }
  }

  @container (max-width: 359px) {
    .hero {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    .rings {
      align-self: center;
    }
    .lane-labels {
      font-size: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fill,
    .bar-fill {
      transition: none;
    }
  }
`, De = "1.0.0", J = "sleep-rings-card", z = [
  { key: "duration", label: "Duration", max: 50 },
  { key: "bedtime", label: "Bedtime", max: 30 },
  { key: "interruptions", label: "Interruptions", max: 20 }
], H = ["awake", "rem", "core", "deep"], Nt = ["Awake", "REM", "Core", "Deep"], Ue = {
  awake: 0,
  out_of_bed: 0,
  rem: 1,
  core: 2,
  light: 2,
  asleep: 2,
  sleeping: 2,
  deep: 3
}, R = 26, Le = 60, ze = 1e3, Be = 36 * 36e5, je = 36, Ie = 12, Fe = (i, t) => i === null ? 0 : Math.min(1, Math.max(0, i / t)), Q = class Q extends O {
  constructor() {
    super(), this._selected = null, this._ready = !1, this._today = nt(), this._hrHour = null;
  }
  static getConfigElement() {
    return document.createElement("sleep-rings-card-editor");
  }
  static getStubConfig(t) {
    return { entity: Object.values(t?.states ?? {}).find(
      (r) => r.entity_id.startsWith("sensor.") && "duration_points" in r.attributes
    )?.entity_id ?? "" };
  }
  setConfig(t) {
    if (!t || typeof t != "object")
      throw new Error("Sleep Rings: the card configuration is missing");
    this._config = {
      ring_style: "concentric",
      show_rows: !0,
      show_hypnogram: !0,
      show_history: !0,
      show_heart_rate: !0,
      history_nights: 30,
      ...t
    };
    const e = Math.round(Number(this._config.history_nights));
    this._config.history_nights = Number.isFinite(e) ? Math.min(Le, Math.max(1, e)) : 30;
  }
  getCardSize() {
    return 4 + (this._config?.show_hypnogram ? 4 : 0) + (this._config?.show_history ? 2 : 0) + (this._config?.show_heart_rate ? 2 : 0);
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  willUpdate(t) {
    t.has("hass") && (this._today = nt(this.hass?.config?.time_zone));
  }
  shouldUpdate(t) {
    if (this.hass && nt(this.hass.config?.time_zone) !== this._today || t.size > 1 || !t.has("hass")) return !0;
    const e = this._config?.entity;
    return e ? t.get("hass")?.states[e] !== this.hass?.states[e] : !0;
  }
  firstUpdated() {
    requestAnimationFrame(() => this._ready = !0);
  }
  render() {
    const t = this._config;
    if (!t) return u;
    const e = t.entity ? this.hass?.states[t.entity] : void 0, r = Ae(e), s = this.hass?.locale?.language, n = Re(t.preset, t.colors, t.theme_background);
    let o = "";
    t.entity ? e ? r.score === null && (o = "No sleep score yet. It appears after the next recorded night.") : o = `Entity not found: ${t.entity}` : o = "Choose a sleep score entity in the card settings.";
    const p = t.show_hypnogram && r.stages.length ? this._renderHypnogram(r.stages) : u, a = t.show_history && r.history.length ? this._renderHistory(r, t.history_nights ?? 30) : u, g = t.show_heart_rate && r.heartRate !== null ? this._renderHeartRate(r) : u, h = p !== u || a !== u || g !== u;
    return m`
      <ha-card class=${t.tiles ?? qt(t.preset) ? "tiles" : ""} style=${xe(n)}>
        <div class="header">
          <span class="title">${t.name ?? "Sleep Score"}</span>
          ${r.night ? m`<span class="night">${this._renderAge(r.night)}${it(r.night, s)}</span>` : u}
        </div>
        ${o ? m`<div class="message">${o}</div>` : u}
        <div class="body ${h ? "has-extras" : ""}">
          <div class="hero">
            ${this._renderRings(r, t.ring_style === "segmented")}
            ${t.show_rows ? this._renderRows(r) : u}
          </div>
          ${h ? m`<div class="extras ${g !== u ? "has-hr" : ""} ${p !== u ? "has-stages" : ""}">
                ${p}${g}${a}
              </div>` : u}
        </div>
      </ha-card>
    `;
  }
  _fraction(t, e, r) {
    return this._ready ? Fe(t[e], r) : 0;
  }
  _renderRings(t, e) {
    const r = t.score === null ? "Sleep score not available" : `Sleep score ${t.score} of 100, ${t.band ? lt[t.band] : ""}. ` + z.map((s) => `${s.label} ${Pt(t[s.key])} of ${s.max}`).join(", ");
    return m`
      <div class="rings ${e ? "segmented" : "concentric"} ${t.band ? `b-${t.band}` : ""}" role="img" aria-label=${r}>
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <defs>
            ${z.map(
      (s) => st`
                <linearGradient id="sr-grad-${s.key}" class="c-${s.key}" gradientUnits="userSpaceOnUse"
                  x1="0" y1="0" x2="0" y2="160">
                  <stop offset="0" style="stop-color:currentColor"></stop>
                  <stop offset="1" style="stop-color:var(--end, currentColor)"></stop>
                </linearGradient>`
    )}
          </defs>
          ${e ? this._segments(t) : this._concentric(t)}
        </svg>
        <div class="center">
          <span class="score">${t.score ?? "--"}</span>
          ${t.band ? m`<span class="band b-${t.band}"><span class="band-dot"></span><span>${lt[t.band]}</span></span>` : u}
        </div>
      </div>
    `;
  }
  /** Three concentric rings, each filled to its own maximum. */
  _concentric(t) {
    const e = [70, 56, 42];
    return z.map((r, s) => {
      const n = e[s], o = 2 * Math.PI * n, p = this._fraction(t, r.key, r.max);
      return st`
        <circle class="track c-${r.key}" cx="80" cy="80" r=${n} stroke-width="10"></circle>
        <circle style="stroke:url(#sr-grad-${r.key})" class="fill c-${r.key} ${p <= 0 ? "empty" : ""}" cx="80" cy="80" r=${n} stroke-width="10"
          stroke-dasharray=${o} stroke-dashoffset=${o * (1 - p)}></circle>`;
    });
  }
  /** One ring of 100 points, split 50 / 30 / 20 into three arcs. */
  _segments(t) {
    const s = 2 * Math.PI * 68, n = 17;
    let o = 0;
    return z.map((p) => {
      const a = p.max / 100, g = o * s + n / 2, h = a * s - n;
      o += a;
      const c = h * this._fraction(t, p.key, p.max);
      return st`
        <circle class="track c-${p.key}" cx="80" cy="80" r=${68} stroke-width=${12}
          stroke-dasharray="${h} ${s - h}" stroke-dashoffset=${-g}></circle>
        <circle style="stroke:url(#sr-grad-${p.key})" class="fill c-${p.key} ${c <= 0 ? "empty" : ""}" cx="80" cy="80" r=${68} stroke-width=${12}
          stroke-dasharray="${c} ${s - c}" stroke-dashoffset=${-g}></circle>`;
    });
  }
  _renderRows(t) {
    const e = {
      duration: ke(t),
      bedtime: Se(t),
      interruptions: Ee(t)
    }, r = this.hass?.locale?.language, s = this._config?.sleep_goal_hours ?? t.goalHours, n = {
      duration: s ? `Goal ${E(s * 60)}` : "",
      bedtime: t.usualOnsetMinutes !== null ? `Usual ${Me(t.usualOnsetMinutes, r)}` : "",
      interruptions: ""
    };
    return m`
      <div class="rows">
        ${z.map(
      (o) => m`
            <div class="row c-${o.key}">
              <div class="row-head">
                <span class="dot"></span>
                <span class="row-name">${o.label}</span>
                <span class="row-pts"><b>${Pt(t[o.key])}</b>/${o.max}</span>
              </div>
              <div class="bar">
                <div class="bar-fill" style="width:${this._fraction(t, o.key, o.max) * 100}%"></div>
              </div>
              <div class="row-detail">
                <span>${e[o.key] || "\xA0"}</span>
                ${n[o.key] ? m`<span class="row-target">${n[o.key]}</span>` : u}
              </div>
            </div>
          `
    )}
      </div>
    `;
  }
  _renderHypnogram(t) {
    const e = t.map((l) => ({ lane: Ue[l.stage], start: Date.parse(l.start), end: Date.parse(l.end) })).filter((l) => l.lane !== void 0 && l.end > l.start).slice(0, ze).sort((l, _) => l.start - _.start);
    if (!e.length) return u;
    const r = e[0].start, s = Math.max(...e.map((l) => l.end));
    if (!Number.isFinite(r) || !Number.isFinite(s) || s - r > Be) return u;
    const n = (l) => (l - r) / (s - r) * 100, o = this.hass?.locale?.language, p = this.hass?.config?.time_zone, a = H.map(
      (l, _) => e.filter((d) => d.lane === _).reduce((d, f) => d + (f.end - f.start) / 6e4, 0)
    ), g = a[1] + a[2] + a[3], h = (s - r) / 6e4, c = (l) => g > 0 ? Math.min(1, l / g) : 0, v = [
      ...H.map((l, _) => ({
        key: l,
        label: Nt[_],
        minutes: a[_],
        percent: _ > 0
      })),
      // Deep and REM together: the restorative part of the night.
      { key: "combo", label: "Deep + REM", minutes: a[1] + a[3], percent: !0 }
    ], $ = (l) => l * R + (R - Ie) / 2, x = [];
    for (let l = 1; l < e.length; l++) {
      const _ = e[l - 1], d = e[l];
      if (_.lane === d.lane || d.start - _.end > 6e4) continue;
      const [f, U] = _.lane < d.lane ? [_.lane, d.lane] : [d.lane, _.lane];
      x.push(m`<div
        class="link"
        style="left:${n(d.start)}%;top:${f * R + R / 2}px;height:${(U - f) * R}px;
          background:linear-gradient(var(--_${H[f]}),var(--_${H[U]}))"
      ></div>`);
    }
    const A = [], D = new Date(r);
    let G = D.getMinutes();
    try {
      G = Number(
        new Intl.DateTimeFormat("en", { minute: "numeric", timeZone: p }).format(D)
      );
    } catch {
    }
    const W = s - r > 6 * 36e5 ? 2 : 1;
    let X = 0;
    for (let l = r + (60 - G) % 60 * 6e4; l < s; l += 36e5, X++) {
      if (X % W) continue;
      const _ = n(l);
      if (_ < 4 || _ > 96) continue;
      let d;
      try {
        d = new Date(l).toLocaleTimeString(o, { hour: "numeric", timeZone: p });
      } catch {
        d = new Date(l).toLocaleTimeString(o, { hour: "numeric" });
      }
      A.push({ at: l, label: d });
    }
    return m`
      <div class="section stages">
        <div class="section-head">
          <span>Stages</span>
          <span>${Rt(new Date(r), o, p)} ${"\u2013"} ${Rt(new Date(s), o, p)}</span>
        </div>
        <div class="hypno" role="img" aria-label="Sleep stages through the night">
          <div class="lane-labels">${Nt.map((l) => m`<span>${l}</span>`)}</div>
          <div class="plot">
            ${H.map((l, _) => m`<div class="lane-band s-${l}" style="top:${_ * R}px"></div>`)}
            ${A.map((l) => m`<div class="tick" style="left:${n(l.at)}%"></div>`)}
            ${x}
            ${e.map(
      (l) => m`<div
                class="stage s-${H[l.lane]}"
                style="left:${n(l.start)}%;width:${n(l.end) - n(l.start)}%;top:${$(l.lane)}px"
              ></div>`
    )}
          </div>
          <div class="axis">${A.map((l) => m`<span style="left:${n(l.at)}%">${l.label}</span>`)}</div>
        </div>
        <div class="night-summary">
          <span>In bed <b>${E(h)}</b></span>
          <span>Asleep <b>${E(g)}</b></span>
          <span>Efficiency <b>${h > 0 ? Math.round(g / h * 100) : 0}%</b></span>
        </div>
        <div class="stage-stats">
          ${v.map(
      (l) => m`
              <div class="stat s-${l.key}">
                <span class="dot"></span>
                <span class="stat-name">${l.label}</span>
                <span class="stat-bar"><i style="width:${c(l.minutes) * 100}%"></i></span>
                <span class="stat-value">${E(l.minutes)}</span>
                <span class="stat-pct">${l.percent ? `${Math.round(c(l.minutes) * 100)}%` : ""}</span>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }
  /** "Today" when the night ended today, otherwise how old the shown night is. */
  _renderAge(t) {
    const e = Ce(t, this._today);
    if (e < 0) return u;
    const r = e === 0 ? "Today" : e === 1 ? "Yesterday" : `${e} days ago`;
    return m`<span class="age ${e === 0 ? "fresh" : e === 1 ? "recent" : "old"}" title=${e === 0 ? "This is the night you woke up from today" : "No sleep has been recorded for today yet"}>${r}</span>`;
  }
  /**
   * Hourly heart rate through the night: a smooth average line over a soft
   * area, with dashed lines for each hour's high and low.
   */
  _renderHeartRate(t) {
    const e = this.hass?.locale?.language, r = this.hass?.config?.time_zone, s = t.heartRateHours.slice(0, je).filter((a) => Number.isFinite(a.mean) && Number.isFinite(Date.parse(a.start))).map((a) => ({
      at: Date.parse(a.start),
      mean: a.mean,
      low: a.min ?? a.mean,
      high: a.max ?? a.mean,
      partial: a.partial === !0
    })), n = (a) => {
      try {
        return new Date(a).toLocaleTimeString(e, { hour: "numeric", timeZone: r });
      } catch {
        return new Date(a).toLocaleTimeString(e, { hour: "numeric" });
      }
    }, o = `${Math.round(t.heartRate ?? 0)} bpm` + (t.heartRateLow !== null ? ` \xB7 low ${Math.round(t.heartRateLow)}` : "");
    let p = u;
    if (s.length >= 2) {
      const a = s.some((d) => !d.partial) ? s.filter((d) => !d.partial) : s, g = Math.floor((Math.min(...a.map((d) => d.low)) - 1) / 5) * 5, h = Math.ceil((Math.max(...a.map((d) => d.high)) + 1) / 5) * 5, c = Math.max(5, h - g), v = (d) => (d + 0.5) / s.length * 100, $ = (d) => (1 - Math.min(1, Math.max(0, (d - g) / c))) * 100, x = (d) => Math.min(100, Math.max(0, d)), A = (d) => {
        const f = s.map((b, q) => [v(q), $(d(b))]);
        let U = `M${f[0][0].toFixed(2)},${f[0][1].toFixed(2)}`;
        for (let b = 0; b < f.length - 1; b++) {
          const q = f[Math.max(0, b - 1)], vt = f[Math.min(f.length - 1, b + 2)], bt = [f[b][0] + (f[b + 1][0] - q[0]) / 6, x(f[b][1] + (f[b + 1][1] - q[1]) / 6)], $t = [f[b + 1][0] - (vt[0] - f[b][0]) / 6, x(f[b + 1][1] - (vt[1] - f[b][1]) / 6)];
          U += ` C${bt[0].toFixed(2)},${bt[1].toFixed(2)} ${$t[0].toFixed(2)},${$t[1].toFixed(2)} ${f[b + 1][0].toFixed(2)},${f[b + 1][1].toFixed(2)}`;
        }
        return U;
      }, D = A((d) => d.mean), G = `${D} L${v(s.length - 1).toFixed(2)},100 L${v(0).toFixed(2)},100 Z`, W = [h, g + c / 2, g], X = s.length > 6 ? 2 : 1, l = this._hrHour !== null ? s[this._hrHour] : void 0, _ = this._hrHour !== null ? v(this._hrHour) : 0;
      p = m`
        <div class="hr-chart">
          <div class="hr-yaxis">${W.map((d) => m`<span>${Math.round(d)}</span>`)}</div>
          <div class="hr-plot" @pointerleave=${() => this._hrHour = null}>
            ${W.map((d, f) => m`<div class="hr-grid" style="top:${f * 50}%"></div>`)}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path class="hr-area" d=${G}></path>
              <path class="hr-line high" d=${A((d) => d.high)}></path>
              <path class="hr-line low" d=${A((d) => d.low)}></path>
              <path class="hr-line avg" d=${D}></path>
            </svg>
            ${l ? m`
                  <div class="hr-guide" style="left:${_}%"></div>
                  <i class="hr-dot high" style="left:${_}%;top:${$(l.high)}%"></i>
                  <i class="hr-dot avg" style="left:${_}%;top:${$(l.mean)}%"></i>
                  <i class="hr-dot low" style="left:${_}%;top:${$(l.low)}%"></i>
                  <div class="hr-tip ${_ > 55 ? "left" : ""}" style="left:${_}%">
                    <b>${n(l.at)} \u2013 ${n(l.at + 36e5)}</b>
                    ${l.partial ? m`<em>partly awake</em>` : u}
                    <span class="high"><i></i>Hourly high<u>${Math.round(l.high)} bpm</u></span>
                    <span class="avg"><i></i>Average<u>${Math.round(l.mean)} bpm</u></span>
                    <span class="low"><i></i>Hourly low<u>${Math.round(l.low)} bpm</u></span>
                  </div>
                ` : u}
            ${s.map(
        (d, f) => m`<button
                class="hr-hit"
                style="left:${f / s.length * 100}%;width:${100 / s.length}%"
                aria-label="${n(d.at)}: average ${Math.round(d.mean)}, high ${Math.round(d.high)}, low ${Math.round(d.low)} bpm"
                @pointerenter=${() => this._hrHour = f}
                @focus=${() => this._hrHour = f}
                @blur=${() => this._hrHour = null}
                @click=${() => this._hrHour = f}
              ></button>`
      )}
          </div>
          <div class="hr-xaxis">
            ${s.map(
        (d, f) => f % X === 0 ? m`<span style="left:${f / s.length * 100}%">${n(d.at)}</span>` : u
      )}
          </div>
        </div>
        <div class="hr-legend">
          <span class="high"><i></i>Hourly high</span>
          <span class="avg"><i></i>Average</span>
          <span class="low"><i></i>Hourly low</span>
        </div>
      `;
    }
    return m`
      <div class="section heart">
        <div class="section-head">
          <span>Sleeping heart rate</span>
          <span class="hr-summary">${o}</span>
        </div>
        ${p}
      </div>
    `;
  }
  _renderHistory(t, e) {
    const r = this.hass?.locale?.language, s = new Map(t.history.map((h) => [h.night, h])), n = Y(t.history[t.history.length - 1].night), o = [];
    for (let h = Math.max(1, e) - 1; h >= 0; h--) {
      const c = new Date(n);
      c.setDate(n.getDate() - h), o.push(Gt(c));
    }
    const p = o.map((h) => s.get(h)).filter((h) => h !== void 0), a = this._selected ? s.get(this._selected) : void 0;
    let g = "";
    if (a) {
      const h = [a.d, a.b, a.i].every((v) => v !== void 0) ? ` (${a.d} / ${a.b} / ${a.i})` : "", c = a.estimated ? " \xB7 estimated" : "";
      g = `${it(a.night, r)} \xB7 ${a.score}${h}${c}`;
    } else if (p.length) {
      const h = p.reduce((c, v) => c + v.score, 0) / p.length;
      g = `Average ${Math.round(h)}`;
    }
    return m`
      <div class="section nights">
        <div class="section-head">
          <span>${e} nights</span>
          <span>${g}</span>
        </div>
        <div class="history" @pointerleave=${() => this._selected = null}>
          ${o.map((h) => {
      const c = s.get(h);
      return c ? m`<button
              class="night-bar b-${Vt(c.score)} ${c.estimated ? "estimated" : ""} ${this._selected === h ? "selected" : ""}"
              aria-label="${it(h, r)}: ${c.score}"
              @pointerenter=${() => this._selected = h}
              @focus=${() => this._selected = h}
              @click=${() => this._selected = h}
            >
              <i style="height:${Math.max(0, Math.min(100, c.score))}%"></i>
            </button>` : m`<span class="night-bar missing"><i></i></span>`;
    })}
        </div>
      </div>
    `;
  }
};
Q.styles = Ne, Q.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _selected: { state: !0 },
  _ready: { state: !0 },
  _today: { state: !0 },
  _hrHour: { state: !0 }
};
let dt = Q;
customElements.get(J) || customElements.define(J, dt);
window.customCards = window.customCards ?? [];
window.customCards.some((i) => i.type === J) || window.customCards.push({
  type: J,
  name: "Sleep Rings",
  description: "Sleep score with rings, a scorecard, sleep stages and history.",
  preview: !0
});
console.info(`%c SLEEP-RINGS-CARD %c ${De} `, "background:#6e6adf;color:#fff", "");
export {
  De as CARD_VERSION,
  dt as SleepRingsCard
};
