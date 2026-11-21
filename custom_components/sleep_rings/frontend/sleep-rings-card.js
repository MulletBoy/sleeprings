var Z = globalThis, pt = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ut = /* @__PURE__ */ Symbol(), wt = /* @__PURE__ */ new WeakMap(), Dt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (pt && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = wt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && wt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
}, Jt = (t) => new Dt(typeof t == "string" ? t : t + "", void 0, ut), Qt = (t, ...e) => {
  const r = t.length === 1 ? t[0] : e.reduce((s, i, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[n + 1], t[0]);
  return new Dt(r, t, ut);
}, te = (t, e) => {
  if (pt) t.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const s = document.createElement("style"), i = Z.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = r.cssText, t.appendChild(s);
  }
}, kt = pt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const s of e.cssRules) r += s.cssText;
  return Jt(r);
})(t) : t, { is: ee, defineProperty: re, getOwnPropertyDescriptor: se, getOwnPropertyNames: ie, getOwnPropertySymbols: ne, getPrototypeOf: ae } = Object, tt = globalThis, At = tt.trustedTypes, oe = At ? At.emptyScript : "", le = tt.reactiveElementPolyfillSupport, W = (t, e) => t, at = {
  toAttribute(t, e) {
    switch (e) {
      case Boolean:
        t = t ? oe : null;
        break;
      case Object:
      case Array:
        t = t == null ? t : JSON.stringify(t);
    }
    return t;
  },
  fromAttribute(t, e) {
    let r = t;
    switch (e) {
      case Boolean:
        r = t !== null;
        break;
      case Number:
        r = t === null ? null : Number(t);
        break;
      case Object:
      case Array:
        try {
          r = JSON.parse(t);
        } catch {
          r = null;
        }
    }
    return r;
  }
}, Lt = (t, e) => !ee(t, e), St = {
  attribute: !0,
  type: String,
  converter: at,
  reflect: !1,
  useDefault: !1,
  hasChanged: Lt
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), tt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var U = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = St) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, r, e);
      s !== void 0 && re(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: s, set: i } = se(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(n) {
        this[e] = n;
      }
    };
    return {
      get: s,
      set(n) {
        const a = s?.call(this);
        i?.call(this, n), this.requestUpdate(t, a, r);
      },
      configurable: !0,
      enumerable: !0
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? St;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const t = ae(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const e = this.properties, r = [...ie(e), ...ne(e)];
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
      for (const s of r) e.unshift(kt(s));
    } else t !== void 0 && e.push(kt(t));
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
    return te(t, this.constructor.elementStyles), t;
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
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : at).toAttribute(e, r.type);
      this._$Em = t, i == null ? this.removeAttribute(s) : this.setAttribute(s, i), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const i = r.getPropertyOptions(s), n = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : at;
      this._$Em = s;
      const a = n.fromAttribute(e, i.type);
      this[s] = a ?? this._$Ej?.get(s) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, s = !1, i) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (i = this[t]), r ??= n.getPropertyOptions(t), !((r.hasChanged ?? Lt)(i, e) || r.useDefault && r.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: s, wrapped: i }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), i !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, i] of this._$Ep) this[s] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, i] of r) {
        const { wrapped: n } = i, a = this[s];
        n !== !0 || this._$AL.has(s) || a === void 0 || this.C(s, void 0, i, a);
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
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[W("elementProperties")] = /* @__PURE__ */ new Map(), U[W("finalized")] = /* @__PURE__ */ new Map(), le?.({ ReactiveElement: U }), (tt.reactiveElementVersions ??= []).push("2.1.2");
var gt = globalThis, Et = (t) => t, J = gt.trustedTypes, Ct = J ? J.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ut = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + S, he = `<${zt}>`, N = document, X = () => N.createComment(""), G = (t) => t === null || typeof t != "object" && typeof t != "function", mt = Array.isArray, ce = (t) => mt(t) || typeof t?.[Symbol.iterator] == "function", rt = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Tt = />/g, T = RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ht = /'/g, Rt = /"/g, Bt = /^(?:script|style|textarea|title)$/i, ft = (t) => (e, ...r) => ({
  _$litType$: t,
  strings: e,
  values: r
}), u = ft(1), st = ft(2), We = ft(3), P = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), R = N.createTreeWalker(N, 129);
function It(t, e) {
  if (!mt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ct !== void 0 ? Ct.createHTML(e) : e;
}
var de = (t, e) => {
  const r = t.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = j;
  for (let l = 0; l < r; l++) {
    const c = t[l];
    let _, p, m = -1, f = 0;
    for (; f < c.length && (a.lastIndex = f, p = a.exec(c), p !== null); ) f = a.lastIndex, a === j ? p[1] === "!--" ? a = Mt : p[1] !== void 0 ? a = Tt : p[2] !== void 0 ? (Bt.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = T) : p[3] !== void 0 && (a = T) : a === T ? p[0] === ">" ? (a = i ?? j, m = -1) : p[1] === void 0 ? m = -2 : (m = a.lastIndex - p[2].length, _ = p[1], a = p[3] === void 0 ? T : p[3] === '"' ? Rt : Ht) : a === Rt || a === Ht ? a = T : a === Mt || a === Tt ? a = j : (a = T, i = void 0);
    const v = a === T && t[l + 1].startsWith("/>") ? " " : "";
    n += a === j ? c + he : m >= 0 ? (s.push(_), c.slice(0, m) + Ut + c.slice(m) + S + v) : c + S + (m === -2 ? l : v);
  }
  return [It(t, n + (t[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
}, ot = class jt {
  constructor({ strings: e, _$litType$: r }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, c = this.parts, [_, p] = de(e, r);
    if (this.el = jt.createElement(_, s), R.currentNode = this.el.content, r === 2 || r === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (i = R.nextNode()) !== null && c.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const m of i.getAttributeNames()) if (m.endsWith(Ut)) {
          const f = p[a++], v = i.getAttribute(m).split(S), $ = /([.?@])?(.*)/.exec(f);
          c.push({
            type: 1,
            index: n,
            name: $[2],
            strings: v,
            ctor: $[1] === "." ? ue : $[1] === "?" ? ge : $[1] === "@" ? me : et
          }), i.removeAttribute(m);
        } else m.startsWith(S) && (c.push({
          type: 6,
          index: n
        }), i.removeAttribute(m));
        if (Bt.test(i.tagName)) {
          const m = i.textContent.split(S), f = m.length - 1;
          if (f > 0) {
            i.textContent = J ? J.emptyScript : "";
            for (let v = 0; v < f; v++) i.append(m[v], X()), R.nextNode(), c.push({
              type: 2,
              index: ++n
            });
            i.append(m[f], X());
          }
        }
      } else if (i.nodeType === 8) if (i.data === zt) c.push({
        type: 2,
        index: n
      });
      else {
        let m = -1;
        for (; (m = i.data.indexOf(S, m + 1)) !== -1; ) c.push({
          type: 7,
          index: n
        }), m += S.length - 1;
      }
      n++;
    }
  }
  static createElement(e, r) {
    const s = N.createElement("template");
    return s.innerHTML = e, s;
  }
};
function I(t, e, r = t, s) {
  if (e === P) return e;
  let i = s !== void 0 ? r._$Co?.[s] : r._$Cl;
  const n = G(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(t), i._$AT(t, r, s)), s !== void 0 ? (r._$Co ??= [])[s] = i : r._$Cl = i), i !== void 0 && (e = I(t, i._$AS(t, e.values), i, s)), e;
}
var pe = class {
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
    const { el: { content: e }, parts: r } = this._$AD, s = (t?.creationScope ?? N).importNode(e, !0);
    R.currentNode = s;
    let i = R.nextNode(), n = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new vt(i, i.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(i, l.name, l.strings, this, t) : l.type === 6 && (c = new fe(i, this, t)), this._$AV.push(c), l = r[++a];
      }
      n !== l?.index && (i = R.nextNode(), n++);
    }
    return R.currentNode = N, s;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}, vt = class Ft {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, r, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && e?.nodeType === 11 && (e = r.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, r = this) {
    e = I(this, e, r), G(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== P && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ce(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && G(this._$AH) ? this._$AA.nextSibling.data = e : this.T(N.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: r, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = ot.createElement(It(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(r);
    else {
      const n = new pe(i, this), a = n.u(this.options);
      n.p(r), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let r = Nt.get(e.strings);
    return r === void 0 && Nt.set(e.strings, r = new ot(e)), r;
  }
  k(e) {
    mt(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let s, i = 0;
    for (const n of e) i === r.length ? r.push(s = new Ft(this.O(X()), this.O(X()), this, this.options)) : s = r[i], s._$AI(n), i++;
    i < r.length && (this._$AR(s && s._$AB.nextSibling, i), r.length = i);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); e !== this._$AB; ) {
      const s = Et(e).nextSibling;
      Et(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}, et = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, s, i) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(/* @__PURE__ */ new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(t, e = this, r, s) {
    const i = this.strings;
    let n = !1;
    if (i === void 0) t = I(this, t, e, 0), n = !G(t) || t !== this._$AH && t !== P, n && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = i[0], l = 0; l < i.length - 1; l++) c = I(this, a[r + l], e, l), c === P && (c = this._$AH[l]), n ||= !G(c) || c !== this._$AH[l], c === d ? t = d : t !== d && (t += (c ?? "") + i[l + 1]), this._$AH[l] = c;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}, ue = class extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}, ge = class extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}, me = class extends et {
  constructor(t, e, r, s, i) {
    super(t, e, r, s, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = I(this, t, e, 0) ?? d) === P) return;
    const r = this._$AH, s = t === d && r !== d || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, i = t !== d && (r === d || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}, fe = class {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    I(this, t);
  }
}, ve = gt.litHtmlPolyfillSupport;
ve?.(ot, vt), (gt.litHtmlVersions ??= []).push("3.3.3");
var _e = (t, e, r) => {
  const s = r?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = r?.renderBefore ?? null;
    s._$litPart$ = i = new vt(e.insertBefore(X(), n), n, void 0, r ?? {});
  }
  return i._$AI(t), i;
}, _t = globalThis, z = class extends U {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = _e(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return P;
  }
};
z._$litElement$ = !0, z.finalized = !0, _t.litElementHydrateSupport?.({ LitElement: z });
var be = _t.litElementPolyfillSupport;
be?.({ LitElement: z });
(_t.litElementVersions ??= []).push("4.2.2");
var $e = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6
}, ye = (t) => (...e) => ({
  _$litDirective$: t,
  values: e
}), xe = class {
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
}, Vt = "important", we = " !" + Vt, ke = ye(class extends xe {
  constructor(t) {
    if (super(t), t.type !== $e.ATTRIBUTE || t.name !== "style" || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, r) => {
      const s = t[r];
      return s == null ? e : e + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(t, [e]) {
    const { style: r } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const s of this.ft) e[s] ?? (this.ft.delete(s), s.includes("-") ? r.removeProperty(s) : r[s] = null);
    for (const s in e) {
      const i = e[s];
      if (i != null) {
        this.ft.add(s);
        const n = typeof i == "string" && i.endsWith(we);
        s.includes("-") || n ? r.setProperty(s, n ? i.slice(0, -11) : i, n ? Vt : "") : r[s] = i;
      }
    }
    return P;
  }
}), lt = {
  very_low: "Very Low",
  low: "Low",
  ok: "OK",
  high: "High",
  very_high: "Very High"
}, Ae = Object.keys(lt);
function k(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function ht(t) {
  return t >= 96 ? "very_high" : t >= 81 ? "high" : t >= 61 ? "ok" : t >= 41 ? "low" : "very_low";
}
function Se(t) {
  return K(t?.attributes ?? {}, t ? k(t.state) : null);
}
function K(t, e) {
  const r = String(t.band ?? "");
  return {
    score: e,
    band: Ae.includes(r) ? r : e !== null ? ht(e) : null,
    night: typeof t.night == "string" ? t.night : null,
    duration: k(t.duration_points),
    bedtime: k(t.bedtime_points),
    interruptions: k(t.interruptions_points),
    asleepMinutes: k(t.asleep_minutes),
    deviationMinutes: k(t.bedtime_deviation_minutes),
    wakeups: k(t.wakeups),
    awakeMinutes: k(t.awake_minutes),
    stages: Array.isArray(t.stages) ? t.stages : [],
    history: Array.isArray(t.history) ? t.history : [],
    goalHours: k(t.duration_goal_hours),
    usualOnsetMinutes: k(t.usual_onset_minutes),
    heartRate: k(t.heart_rate_average),
    heartRateLow: k(t.heart_rate_lowest),
    heartRateHours: Array.isArray(t.heart_rate_hours) ? t.heart_rate_hours : []
  };
}
function E(t) {
  const e = Math.round(Math.abs(t)), r = Math.floor(e / 60), s = e % 60;
  return r === 0 ? `${s}m` : `${r}h ${String(s).padStart(2, "0")}m`;
}
function Ee(t) {
  return t.asleepMinutes === null ? "" : `${E(t.asleepMinutes)} asleep`;
}
function Ce(t) {
  if (t.bedtime === null) return "";
  if (t.deviationMinutes === null) return "No bedtime history yet";
  if (Math.abs(t.deviationMinutes) < 1) return "At your usual time";
  const e = t.deviationMinutes > 0 ? "later" : "earlier";
  return `${E(t.deviationMinutes)} ${e} than usual`;
}
function Me(t) {
  if (t.wakeups === null) return "";
  const e = t.awakeMinutes === null ? "" : `, ${E(t.awakeMinutes)} awake`;
  return t.wakeups === 0 ? `No wake-ups${e}` : `${t.wakeups} wake-up${t.wakeups === 1 ? "" : "s"}${e}`;
}
function B(t) {
  const [e, r, s] = t.split("-").map(Number);
  return new Date(e, (r || 1) - 1, s || 1);
}
function ct(t) {
  const e = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
  return `${t.getFullYear()}-${e}-${r}`;
}
function q(t, e) {
  return B(t).toLocaleDateString(e, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function D(t, e, r) {
  try {
    return t.toLocaleTimeString(e, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: r
    });
  } catch {
    return t.toLocaleTimeString(e, {
      hour: "numeric",
      minute: "2-digit"
    });
  }
}
function Pt(t) {
  return t === null ? "--" : String(Math.round(t));
}
function Te(t, e) {
  const r = ((Math.round(t) + 720) % 1440 + 1440) % 1440;
  return new Date(2e3, 0, 1, Math.floor(r / 60), r % 60).toLocaleTimeString(e, {
    hour: "numeric",
    minute: "2-digit"
  });
}
function it(t) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: t,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(/* @__PURE__ */ new Date());
  } catch {
    return ct(/* @__PURE__ */ new Date());
  }
}
function He(t, e) {
  return Math.round((B(e).getTime() - B(t).getTime()) / 864e5);
}
var Wt = [
  "duration",
  "bedtime",
  "interruptions",
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
], dt = "synthwave", nt = {
  theme: {
    colors: {
      duration_end: "#a78bfa",
      bedtime_end: "#34d3b4",
      interruptions_end: "#f97316"
    },
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
    background: {
      "--ha-card-background": "#16082b",
      "--ha-card-border-color": "#3b1c66"
    }
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
}, Re = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla)\([0-9.,%\s/deg-]+\)|var\(--[a-z0-9-]+\))$/i;
function Ne(t) {
  if (typeof t != "string") return;
  const e = t.trim();
  return Re.test(e) ? e : void 0;
}
function Xt(t) {
  const e = typeof t == "string" ? t : dt;
  return Object.prototype.hasOwnProperty.call(nt, e) ? nt[e] : nt[dt];
}
function Gt(t) {
  return Xt(t).tiles ?? !1;
}
function Pe(t, e, r = !1) {
  const s = Xt(t), i = {
    ...s.vars ?? {},
    ...r ? {} : s.background ?? {}
  };
  for (const n of Wt) {
    const a = Ne(e?.[n]) ?? s.colors[n];
    a && (i[`--sr-${n.replace("_", "-")}`] = a);
  }
  return i;
}
var qt, Ot = "sleep-rings-card-editor", Yt = {
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
  history_style: "History bars",
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
}, Oe = {
  colors: "Any CSS colour, for example #ff2fd6. Leave a field empty to use the preset.",
  theme_background: "Off: the Synthwave preset paints its own dark card.",
  sleep_goal_hours: "Shown on the Duration row. Empty: the duration that earns full points."
}, L = (t) => ({
  name: t,
  selector: { boolean: {} }
}), De = [
  {
    name: "entity",
    required: !0,
    selector: { entity: { filter: {
      integration: "sleep_rings",
      domain: "sensor"
    } } }
  },
  {
    name: "name",
    selector: { text: {} }
  },
  {
    type: "grid",
    name: "",
    schema: [{
      name: "preset",
      selector: { select: {
        mode: "dropdown",
        options: [
          {
            value: "synthwave",
            label: "Synthwave"
          },
          {
            value: "theme",
            label: "Follow the theme (light or dark)"
          },
          {
            value: "health",
            label: "Health"
          }
        ]
      } }
    }, {
      name: "ring_style",
      selector: { select: {
        mode: "dropdown",
        options: [{
          value: "concentric",
          label: "Three rings"
        }, {
          value: "segmented",
          label: "One ring split 50 / 30 / 20"
        }]
      } }
    }]
  },
  {
    type: "grid",
    name: "",
    schema: [
      L("show_rows"),
      L("show_hypnogram"),
      L("show_history"),
      L("show_heart_rate"),
      L("tiles"),
      L("theme_background")
    ]
  },
  {
    name: "sleep_goal_hours",
    selector: { number: {
      min: 4,
      max: 12,
      step: 0.1,
      mode: "box"
    } }
  },
  {
    name: "history_style",
    selector: { select: {
      mode: "dropdown",
      options: [{
        value: "components",
        label: "Stacked: Duration, Bedtime, Interruptions"
      }, {
        value: "bands",
        label: "One bar per night, coloured by band"
      }]
    } }
  },
  {
    name: "history_nights",
    selector: { number: {
      min: 7,
      max: 60,
      step: 1,
      mode: "slider"
    } }
  },
  {
    type: "expandable",
    name: "colors",
    title: Yt.colors,
    schema: Wt.map((t) => ({
      name: t,
      selector: { text: {} }
    }))
  }
], Zt = class extends z {
  setConfig(t) {
    this._config = t;
  }
  render() {
    if (!this._config) return d;
    const t = {
      preset: dt,
      ring_style: "concentric",
      show_rows: !0,
      show_hypnogram: !0,
      show_history: !0,
      show_heart_rate: !0,
      history_nights: 30,
      history_style: "components",
      theme_background: !1,
      tiles: Gt(this._config.preset),
      ...this._config
    };
    return u`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${De}
        .computeLabel=${(e) => Yt[e.name] ?? e.name}
        .computeHelper=${(e) => Oe[e.name]}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  _valueChanged(t) {
    t.stopPropagation();
    const e = { ...t.detail.value };
    if (e.colors) {
      const r = Object.fromEntries(Object.entries(e.colors).filter(([, s]) => typeof s == "string" && s.trim()));
      Object.keys(r).length ? e.colors = r : delete e.colors;
    }
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    }));
  }
};
qt = Zt;
qt.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
};
customElements.get(Ot) || customElements.define(Ot, Zt);
var Le = Qt`
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

  /* Night navigation in the header: arrows and a date that opens a date picker */
  .night {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .nav-btn,
  .date-btn {
    font: inherit;
    color: inherit;
    background: none;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    line-height: 1;
  }
  .nav-btn {
    width: 26px;
    height: 26px;
    font-size: 18px;
    color: var(--_text);
  }
  .date-btn {
    position: relative;
    padding: 5px 8px;
    font-variant-numeric: tabular-nums;
  }
  .nav-btn:hover:not(:disabled),
  .date-btn:hover {
    border-color: var(--_divider);
    background: color-mix(in srgb, var(--_text) 8%, transparent);
  }
  .nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }
  .nav-btn:focus-visible,
  .date-btn:focus-visible {
    outline: 2px solid var(--_text2);
    outline-offset: 1px;
  }
  .date-btn.loading {
    opacity: 0.6;
  }
  /* The real date input sits invisibly under the date; the button opens its picker. */
  .date-btn input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    border: 0;
    padding: 0;
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
  .age.past {
    color: var(--_text2);
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
  .hr-tip.below {
    top: auto;
    bottom: 4px;
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
  .hr-xaxis span.centered {
    transform: translateX(-50%);
  }

  /* History: one column per night, stacked by part; click a column to open that night */
  .night-cols {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: stretch;
    gap: 2px;
  }
  .night-col {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    gap: 1px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    opacity: 0.78;
  }
  .night-col i {
    display: block;
    width: 100%;
    background: currentColor;
  }
  .night-col i:last-child {
    border-radius: 3px 3px 0 0;
  }
  .night-col.estimated {
    opacity: 0.4;
  }
  .night-col.selected,
  .night-col:hover,
  .night-col.current {
    opacity: 1;
  }
  .night-col.current i {
    box-shadow: 0 0 calc(var(--_glow) + 3px) currentColor;
  }
  .night-col.current {
    outline: 1px solid var(--_text2);
    outline-offset: 1px;
    border-radius: 3px;
  }
  .night-col:focus-visible {
    outline: 2px solid var(--_text);
    outline-offset: 1px;
  }
  /* A night with no recording: a faint mark on the baseline, still clickable */
  .night-col.missing::after {
    content: "";
    height: 2px;
    border-radius: 1px;
    background: var(--_text2);
    opacity: 0.45;
  }
  .hr-legend b {
    font-weight: 400;
    color: var(--_text2);
  }
  .hr-legend .c-duration i,
  .hr-legend .c-bedtime i,
  .hr-legend .c-interruptions i,
  .hr-tip .c-duration i,
  .hr-tip .c-bedtime i,
  .hr-tip .c-interruptions i,
  .hr-tip [class^="b-"] i,
  .hr-tip [class^="s-"] i {
    background: currentColor;
    opacity: 1;
  }
  .hr-tip .c-duration,
  .hr-tip .c-bedtime,
  .hr-tip .c-interruptions,
  .hr-tip [class^="b-"] {
    color: inherit;
  }
  .hr-tip .c-duration i {
    color: var(--_duration);
  }
  .hr-tip .c-bedtime i {
    color: var(--_bedtime);
  }
  .hr-tip .c-interruptions i {
    color: var(--_interruptions);
  }
  .hr-tip [class^="b-"] i {
    color: var(--band);
  }
  /* Stage tooltip: the dot is the stage's own colour, the text stays readable. */
  .hr-tip.s-awake,
  .hr-tip.s-rem,
  .hr-tip.s-core,
  .hr-tip.s-deep {
    color: #f4f1fa;
  }
  .hr-tip.s-awake i {
    background: var(--_awake);
    opacity: 1;
  }
  .hr-tip.s-rem i {
    background: var(--_rem);
    opacity: 1;
  }
  .hr-tip.s-core i {
    background: var(--_core);
    opacity: 1;
  }
  .hr-tip.s-deep i {
    background: var(--_deep);
    opacity: 1;
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
    border: 0;
    padding: 0;
    cursor: pointer;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) currentColor;
  }
  .stage.selected,
  .stage:hover {
    box-shadow:
      0 0 0 2px color-mix(in srgb, currentColor 35%, transparent),
      0 0 calc(var(--_glow) + 4px) currentColor;
  }
  .stage:focus-visible {
    outline: 2px solid var(--_text);
    outline-offset: 2px;
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
`, bt, Ue = "1.1.1", Q = "sleep-rings-card", F = [
  {
    key: "duration",
    label: "Duration",
    max: 50
  },
  {
    key: "bedtime",
    label: "Bedtime",
    max: 30
  },
  {
    key: "interruptions",
    label: "Interruptions",
    max: 20
  }
], H = [
  "awake",
  "rem",
  "core",
  "deep"
], Y = [
  "Awake",
  "REM",
  "Core",
  "Deep"
], ze = {
  awake: 0,
  out_of_bed: 0,
  rem: 1,
  core: 2,
  light: 2,
  asleep: 2,
  sleeping: 2,
  deep: 3
}, V = 26, Be = 60, Ie = 1e3, je = 1296e5, Fe = 36, Ve = (t, e) => t === null ? 0 : Math.min(1, Math.max(0, t / e)), Kt = class extends z {
  constructor() {
    super(), this._selected = null, this._ready = !1, this._today = it(), this._hrHour = null, this._stage = null, this._night = null, this._detail = null;
  }
  static getConfigElement() {
    return document.createElement("sleep-rings-card-editor");
  }
  static getStubConfig(t) {
    return { entity: Object.values(t?.states ?? {}).find((e) => e.entity_id.startsWith("sensor.") && "duration_points" in e.attributes)?.entity_id ?? "" };
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("Sleep Rings: the card configuration is missing");
    this._config = {
      ring_style: "concentric",
      show_rows: !0,
      show_hypnogram: !0,
      show_history: !0,
      show_heart_rate: !0,
      history_nights: 30,
      history_style: "components",
      ...t
    };
    const e = Math.round(Number(this._config.history_nights));
    this._config.history_nights = Number.isFinite(e) ? Math.min(Be, Math.max(1, e)) : 30;
  }
  getCardSize() {
    return 4 + (this._config?.show_hypnogram ? 4 : 0) + (this._config?.show_history ? 2 : 0) + (this._config?.show_heart_rate ? 2 : 0);
  }
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto"
    };
  }
  willUpdate(t) {
    t.has("hass") && (this._today = it(this.hass?.config?.time_zone));
  }
  shouldUpdate(t) {
    if (this.hass && it(this.hass.config?.time_zone) !== this._today || t.size > 1 || !t.has("hass")) return !0;
    const e = this._config?.entity;
    return e ? t.get("hass")?.states[e] !== this.hass?.states[e] : !0;
  }
  firstUpdated() {
    requestAnimationFrame(() => this._ready = !0);
  }
  render() {
    const t = this._config;
    if (!t) return d;
    const e = t.entity ? this.hass?.states[t.entity] : void 0, r = Se(e), s = this._night && this._night !== r.night && this._detail?.night === this._night ? this._detail : null, i = s ? {
      ...s,
      history: r.history
    } : r, n = Pe(t.preset, t.colors, t.theme_background);
    let a = "";
    t.entity ? e ? s && i.score === null ? a = "No sleep was recorded for this night." : i.score === null && (a = "No sleep score yet. It appears after the next recorded night.") : a = `Entity not found: ${t.entity}` : a = "Choose a sleep score entity in the card settings.";
    const l = t.show_hypnogram && i.stages.length ? this._renderHypnogram(i.stages) : d, c = t.show_history && i.history.length ? this._renderHistory(i, t.history_nights ?? 30) : d, _ = t.show_heart_rate && i.heartRate !== null ? this._renderHeartRate(i) : d, p = l !== d || c !== d || _ !== d;
    return u`
      <ha-card class=${t.tiles ?? Gt(t.preset) ? "tiles" : ""} style=${ke(n)}>
        <div class="header">
          <span class="title">${t.name ?? "Sleep Score"}</span>
          ${i.night ? this._renderNavigation(i, r) : d}
        </div>
        ${a ? u`<div class="message">${a}</div>` : d}
        <div class="body ${p ? "has-extras" : ""}">
          <div class="hero">
            ${this._renderRings(i, t.ring_style === "segmented")}
            ${t.show_rows ? this._renderRows(i) : d}
          </div>
          ${p ? u`<div class="extras ${_ !== d ? "has-hr" : ""} ${l !== d ? "has-stages" : ""}">
                ${l}${_}${c}
              </div>` : d}
        </div>
      </ha-card>
    `;
  }
  _fraction(t, e, r) {
    return this._ready ? Ve(t[e], r) : 0;
  }
  _renderRings(t, e) {
    const r = t.score === null ? "Sleep score not available" : `Sleep score ${t.score} of 100, ${t.band ? lt[t.band] : ""}. ` + F.map((s) => `${s.label} ${Pt(t[s.key])} of ${s.max}`).join(", ");
    return u`
      <div class="rings ${e ? "segmented" : "concentric"} ${t.band ? `b-${t.band}` : ""}" role="img" aria-label=${r}>
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <defs>
            ${F.map((s) => st`
                <linearGradient id="sr-grad-${s.key}" class="c-${s.key}" gradientUnits="userSpaceOnUse"
                  x1="0" y1="0" x2="0" y2="160">
                  <stop offset="0" style="stop-color:currentColor"></stop>
                  <stop offset="1" style="stop-color:var(--end, currentColor)"></stop>
                </linearGradient>`)}
          </defs>
          ${e ? this._segments(t) : this._concentric(t)}
        </svg>
        <div class="center">
          <span class="score">${t.score ?? "--"}</span>
          ${t.band ? u`<span class="band b-${t.band}"><span class="band-dot"></span><span>${lt[t.band]}</span></span>` : d}
        </div>
      </div>
    `;
  }
  _concentric(t) {
    const e = [
      70,
      56,
      42
    ];
    return F.map((r, s) => {
      const i = e[s], n = 2 * Math.PI * i, a = this._fraction(t, r.key, r.max);
      return st`
        <circle class="track c-${r.key}" cx="80" cy="80" r=${i} stroke-width="10"></circle>
        <circle style="stroke:url(#sr-grad-${r.key})" class="fill c-${r.key} ${a <= 0 ? "empty" : ""}" cx="80" cy="80" r=${i} stroke-width="10"
          stroke-dasharray=${n} stroke-dashoffset=${n * (1 - a)}></circle>`;
    });
  }
  _segments(t) {
    const s = 2 * Math.PI * 68, i = 17;
    let n = 0;
    return F.map((a) => {
      const l = a.max / 100, c = n * s + i / 2, _ = l * s - i;
      n += l;
      const p = _ * this._fraction(t, a.key, a.max);
      return st`
        <circle class="track c-${a.key}" cx="80" cy="80" r=${68} stroke-width=${12}
          stroke-dasharray="${_} ${s - _}" stroke-dashoffset=${-c}></circle>
        <circle style="stroke:url(#sr-grad-${a.key})" class="fill c-${a.key} ${p <= 0 ? "empty" : ""}" cx="80" cy="80" r=${68} stroke-width=${12}
          stroke-dasharray="${p} ${s - p}" stroke-dashoffset=${-c}></circle>`;
    });
  }
  _renderRows(t) {
    const e = {
      duration: Ee(t),
      bedtime: Ce(t),
      interruptions: Me(t)
    }, r = this.hass?.locale?.language, s = this._config?.sleep_goal_hours ?? t.goalHours, i = {
      duration: s ? `Goal ${E(s * 60)}` : "",
      bedtime: t.usualOnsetMinutes !== null ? `Usual ${Te(t.usualOnsetMinutes, r)}` : "",
      interruptions: ""
    };
    return u`
      <div class="rows">
        ${F.map((n) => u`
            <div class="row c-${n.key}">
              <div class="row-head">
                <span class="dot"></span>
                <span class="row-name">${n.label}</span>
                <span class="row-pts"><b>${Pt(t[n.key])}</b>/${n.max}</span>
              </div>
              <div class="bar">
                <div class="bar-fill" style="width:${this._fraction(t, n.key, n.max) * 100}%"></div>
              </div>
              <div class="row-detail">
                <span>${e[n.key] || "\xA0"}</span>
                ${i[n.key] ? u`<span class="row-target">${i[n.key]}</span>` : d}
              </div>
            </div>
          `)}
      </div>
    `;
  }
  _renderHypnogram(t) {
    const e = t.map((o) => ({
      lane: ze[o.stage],
      start: Date.parse(o.start),
      end: Date.parse(o.end)
    })).filter((o) => o.lane !== void 0 && o.end > o.start).slice(0, Ie).sort((o, h) => o.start - h.start);
    if (!e.length) return d;
    const r = e[0].start, s = Math.max(...e.map((o) => o.end));
    if (!Number.isFinite(r) || !Number.isFinite(s) || s - r > je) return d;
    const i = (o) => (o - r) / (s - r) * 100, n = this.hass?.locale?.language, a = this.hass?.config?.time_zone, l = H.map((o, h) => e.filter((x) => x.lane === h).reduce((x, y) => x + (y.end - y.start) / 6e4, 0)), c = l[1] + l[2] + l[3], _ = (s - r) / 6e4, p = (o) => c > 0 ? Math.min(1, o / c) : 0, m = [...H.map((o, h) => ({
      key: o,
      label: Y[h],
      minutes: l[h],
      percent: h > 0
    })), {
      key: "combo",
      label: "Deep + REM",
      minutes: l[1] + l[3],
      percent: !0
    }], f = this._stage !== null ? e[this._stage] : void 0, v = f ? (i(f.start) + i(f.end)) / 2 : 0, $ = (o) => o * V + 7, C = [];
    for (let o = 1; o < e.length; o++) {
      const h = e[o - 1], x = e[o];
      if (h.lane === x.lane || x.start - h.end > 6e4) continue;
      const [y, M] = h.lane < x.lane ? [h.lane, x.lane] : [x.lane, h.lane];
      C.push(u`<div
        class="link"
        style="left:${i(x.start)}%;top:${y * V + V / 2}px;height:${(M - y) * V}px;
          background:linear-gradient(var(--_${H[y]}),var(--_${H[M]}))"
      ></div>`);
    }
    const g = [], b = new Date(r);
    let O = b.getMinutes();
    try {
      O = Number(new Intl.DateTimeFormat("en", {
        minute: "numeric",
        timeZone: a
      }).format(b));
    } catch {
    }
    const w = s - r > 216e5 ? 2 : 1;
    let A = 0;
    for (let o = r + (60 - O) % 60 * 6e4; o < s; o += 36e5, A++) {
      if (A % w) continue;
      const h = i(o);
      if (h < 4 || h > 96) continue;
      let x;
      try {
        x = new Date(o).toLocaleTimeString(n, {
          hour: "numeric",
          timeZone: a
        });
      } catch {
        x = new Date(o).toLocaleTimeString(n, { hour: "numeric" });
      }
      g.push({
        at: o,
        label: x
      });
    }
    return u`
      <div class="section stages">
        <div class="section-head">
          <span>Stages</span>
          <span>${D(new Date(r), n, a)} ${"\u2013"} ${D(new Date(s), n, a)}</span>
        </div>
        <div class="hypno" role="img" aria-label="Sleep stages through the night">
          <div class="lane-labels">${Y.map((o) => u`<span>${o}</span>`)}</div>
          <div class="plot" @pointerleave=${() => this._stage = null}>
            ${H.map((o, h) => u`<div class="lane-band s-${o}" style="top:${h * V}px"></div>`)}
            ${g.map((o) => u`<div class="tick" style="left:${i(o.at)}%"></div>`)}
            ${C}
            ${e.map((o, h) => u`<button
                class="stage s-${H[o.lane]} ${this._stage === h ? "selected" : ""}"
                style="left:${i(o.start)}%;width:${i(o.end) - i(o.start)}%;top:${$(o.lane)}px"
                aria-label="${Y[o.lane]}, ${D(new Date(o.start), n, a)} to ${D(new Date(o.end), n, a)}"
                @pointerenter=${() => this._stage = h}
                @focus=${() => this._stage = h}
                @blur=${() => this._stage = null}
                @click=${() => this._stage = h}
              ></button>`)}
            ${f ? u`<div
                  class="hr-tip s-${H[f.lane]} ${v > 55 ? "left" : ""} ${f.lane < 2 ? "below" : ""}"
                  style="left:${v}%"
                >
                  <span><i></i><b>${Y[f.lane]}</b><u>${E((f.end - f.start) / 6e4)}</u></span>
                  <em>${D(new Date(f.start), n, a)} ${"\u2013"} ${D(new Date(f.end), n, a)}</em>
                </div>` : d}
          </div>
          <div class="axis">${g.map((o) => u`<span style="left:${i(o.at)}%">${o.label}</span>`)}</div>
        </div>
        <div class="night-summary">
          <span>In bed <b>${E(_)}</b></span>
          <span>Asleep <b>${E(c)}</b></span>
          <span>Efficiency <b>${_ > 0 ? Math.round(c / _ * 100) : 0}%</b></span>
        </div>
        <div class="stage-stats">
          ${m.map((o) => u`
              <div class="stat s-${o.key}">
                <span class="dot"></span>
                <span class="stat-name">${o.label}</span>
                <span class="stat-bar"><i style="width:${p(o.minutes) * 100}%"></i></span>
                <span class="stat-value">${E(o.minutes)}</span>
                <span class="stat-pct">${o.percent ? `${Math.round(p(o.minutes) * 100)}%` : ""}</span>
              </div>
            `)}
        </div>
      </div>
    `;
  }
  async _go(t, e) {
    if (!t) return;
    if (this._stage = null, this._hrHour = null, t === e) {
      this._night = null, this._detail = null;
      return;
    }
    this._night = t;
    const r = this._config?.entity;
    if (!r || !this.hass?.callWS) {
      this._detail = K({ night: t }, null);
      return;
    }
    try {
      const s = await this.hass.callWS({
        type: "sleep_rings/night",
        entity_id: r,
        night: t
      });
      if (this._night === t) {
        const i = Number(s.score);
        this._detail = K(s, Number.isFinite(i) ? i : null);
      }
    } catch {
      this._night === t && (this._detail = K({ night: t }, null));
    }
  }
  _renderNavigation(t, e) {
    const r = this.hass?.locale?.language, s = e.history.map((v) => v.night);
    e.night && !s.includes(e.night) && s.push(e.night), s.sort();
    const i = this._night ?? e.night ?? "", n = s[0] ?? i, a = s[s.length - 1] ?? i, l = (v) => {
      const $ = B(i);
      return $.setDate($.getDate() + v), ct($);
    }, c = i > n ? l(-1) : void 0, _ = i < a ? l(1) : void 0, p = this._night !== null && t.night !== this._night, m = (v) => {
      const $ = v.target.value;
      $ && this._go($ < n ? n : $ > a ? a : $, e.night);
    }, f = (v) => {
      const $ = v.currentTarget.querySelector("input");
      try {
        $?.showPicker();
      } catch {
        $?.focus();
      }
    };
    return u`
      <span class="night">
        ${this._renderAge(i, this._night !== null)}
        <button class="nav-btn" ?disabled=${!c} aria-label="Previous night"
          @click=${() => this._go(c, e.night)}>\u2039</button>
        <button class="date-btn ${p ? "loading" : ""}" aria-label="Choose a night" @click=${f}>
          ${q(i, r)}
          <input type="date" tabindex="-1" aria-hidden="true" .value=${i}
            min=${s[0] ?? ""} max=${s[s.length - 1] ?? ""}
            @click=${(v) => v.stopPropagation()} @change=${m} />
        </button>
        <button class="nav-btn" ?disabled=${!_} aria-label="Next night"
          @click=${() => this._go(_, e.night)}>\u203a</button>
      </span>
    `;
  }
  _renderAge(t, e = !1) {
    const r = He(t, this._today);
    if (r < 0) return d;
    const s = r === 0 ? "Today" : r === 1 ? "Yesterday" : `${r} days ago`;
    return u`<span class="age ${e ? "past" : r === 0 ? "fresh" : r === 1 ? "recent" : "old"}" title=${e ? "You are looking at an earlier night" : r === 0 ? "This is the night you woke up from today" : "No sleep has been recorded for today yet"}>${s}</span>`;
  }
  _renderHeartRate(t) {
    const e = this.hass?.locale?.language, r = this.hass?.config?.time_zone, s = t.heartRateHours.slice(0, Fe).filter((l) => Number.isFinite(l.mean) && Number.isFinite(Date.parse(l.start))).map((l) => ({
      at: Date.parse(l.start),
      mean: l.mean,
      low: l.min ?? l.mean,
      high: l.max ?? l.mean,
      partial: l.partial === !0
    })), i = (l) => {
      try {
        return new Date(l).toLocaleTimeString(e, {
          hour: "numeric",
          timeZone: r
        });
      } catch {
        return new Date(l).toLocaleTimeString(e, { hour: "numeric" });
      }
    }, n = `${Math.round(t.heartRate ?? 0)} bpm` + (t.heartRateLow !== null ? ` \xB7 low ${Math.round(t.heartRateLow)}` : "");
    let a = d;
    if (s.length >= 2) {
      const l = s.some((o) => !o.partial) ? s.filter((o) => !o.partial) : s, c = Math.floor((Math.min(...l.map((o) => o.low)) - 1) / 5) * 5, _ = Math.ceil((Math.max(...l.map((o) => o.high)) + 1) / 5) * 5, p = Math.max(5, _ - c), m = (o) => (o + 0.5) / s.length * 100, f = (o) => (1 - Math.min(1, Math.max(0, (o - c) / p))) * 100, v = (o) => Math.min(100, Math.max(0, o)), $ = (o) => {
        const h = s.map((y, M) => [m(M), f(o(y))]);
        let x = `M${h[0][0].toFixed(2)},${h[0][1].toFixed(2)}`;
        for (let y = 0; y < h.length - 1; y++) {
          const M = h[Math.max(0, y - 1)], $t = h[Math.min(h.length - 1, y + 2)], yt = [h[y][0] + (h[y + 1][0] - M[0]) / 6, v(h[y][1] + (h[y + 1][1] - M[1]) / 6)], xt = [h[y + 1][0] - ($t[0] - h[y][0]) / 6, v(h[y + 1][1] - ($t[1] - h[y][1]) / 6)];
          x += ` C${yt[0].toFixed(2)},${yt[1].toFixed(2)} ${xt[0].toFixed(2)},${xt[1].toFixed(2)} ${h[y + 1][0].toFixed(2)},${h[y + 1][1].toFixed(2)}`;
        }
        return x;
      }, C = $((o) => o.mean), g = `${C} L${m(s.length - 1).toFixed(2)},100 L${m(0).toFixed(2)},100 Z`, b = [
        _,
        c + p / 2,
        c
      ], O = s.length > 6 ? 2 : 1, w = this._hrHour !== null ? s[this._hrHour] : void 0, A = this._hrHour !== null ? m(this._hrHour) : 0;
      a = u`
        <div class="hr-chart">
          <div class="hr-yaxis">${b.map((o) => u`<span>${Math.round(o)}</span>`)}</div>
          <div class="hr-plot" @pointerleave=${() => this._hrHour = null}>
            ${b.map((o, h) => u`<div class="hr-grid" style="top:${h * 50}%"></div>`)}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path class="hr-area" d=${g}></path>
              <path class="hr-line high" d=${$((o) => o.high)}></path>
              <path class="hr-line low" d=${$((o) => o.low)}></path>
              <path class="hr-line avg" d=${C}></path>
            </svg>
            ${w ? u`
                  <div class="hr-guide" style="left:${A}%"></div>
                  <i class="hr-dot high" style="left:${A}%;top:${f(w.high)}%"></i>
                  <i class="hr-dot avg" style="left:${A}%;top:${f(w.mean)}%"></i>
                  <i class="hr-dot low" style="left:${A}%;top:${f(w.low)}%"></i>
                  <div class="hr-tip ${A > 55 ? "left" : ""}" style="left:${A}%">
                    <b>${i(w.at)} \u2013 ${i(w.at + 36e5)}</b>
                    ${w.partial ? u`<em>partly awake</em>` : d}
                    <span class="high"><i></i>Hourly high<u>${Math.round(w.high)} bpm</u></span>
                    <span class="avg"><i></i>Average<u>${Math.round(w.mean)} bpm</u></span>
                    <span class="low"><i></i>Hourly low<u>${Math.round(w.low)} bpm</u></span>
                  </div>
                ` : d}
            ${s.map((o, h) => u`<button
                class="hr-hit"
                style="left:${h / s.length * 100}%;width:${100 / s.length}%"
                aria-label="${i(o.at)}: average ${Math.round(o.mean)}, high ${Math.round(o.high)}, low ${Math.round(o.low)} bpm"
                @pointerenter=${() => this._hrHour = h}
                @focus=${() => this._hrHour = h}
                @blur=${() => this._hrHour = null}
                @click=${() => this._hrHour = h}
              ></button>`)}
          </div>
          <div class="hr-xaxis">
            ${s.map((o, h) => h % O === 0 ? u`<span style="left:${h / s.length * 100}%">${i(o.at)}</span>` : d)}
          </div>
        </div>
        <div class="hr-legend">
          <span class="high"><i></i>Hourly high</span>
          <span class="avg"><i></i>Average</span>
          <span class="low"><i></i>Hourly low</span>
        </div>
      `;
    }
    return u`
      <div class="section heart">
        <div class="section-head">
          <span>Sleeping heart rate</span>
          <span class="hr-summary">${n}</span>
        </div>
        ${a}
      </div>
    `;
  }
  _renderHistory(t, e) {
    const r = this.hass?.locale?.language, s = new Map(t.history.map((g) => [g.night, g])), i = t.history[t.history.length - 1].night, n = B(i), a = [];
    for (let g = Math.max(1, e) - 1; g >= 0; g--) {
      const b = new Date(n);
      b.setDate(n.getDate() - g), a.push(ct(b));
    }
    const l = a.map((g) => s.get(g)).filter((g) => g !== void 0), c = l.length ? `Average ${Math.round(l.reduce((g, b) => g + b.score, 0) / l.length)}` : "", _ = t.night ?? i, p = this._selected ? s.get(this._selected) : void 0, m = p ? (a.indexOf(p.night) + 0.5) / a.length * 100 : 0, f = this._config?.history_style !== "bands", v = (g) => Math.max(0, Math.min(100, g ?? 0)), $ = a.length > 14 ? 7 : a.length > 7 ? 2 : 1, C = (g) => B(g).toLocaleDateString(r, {
      day: "numeric",
      month: "short"
    });
    return u`
      <div class="section nights">
        <div class="section-head">
          <span>${e} nights</span>
          <span>${c}</span>
        </div>
        <div class="hr-chart">
          <div class="hr-yaxis"><span>100</span><span>50</span><span>0</span></div>
          <div class="hr-plot" @pointerleave=${() => this._selected = null}>
            ${[
      0,
      50,
      100
    ].map((g) => u`<div class="hr-grid" style="top:${g}%"></div>`)}
            <div class="night-cols">
              ${a.map((g) => {
      const b = s.get(g);
      if (!b) return u`<button
                    class="night-col missing ${g === _ ? "current" : ""}"
                    aria-label="${q(g, r)}: no sleep recorded. Show this night."
                    @click=${() => this._go(g, i)}
                  ></button>`;
      const O = f && b.d !== void 0 && b.b !== void 0 && b.i !== void 0;
      return u`<button
                  class="night-col ${b.estimated ? "estimated" : ""} ${g === _ ? "current" : ""} ${this._selected === g ? "selected" : ""}"
                  aria-label="${q(g, r)}: score ${b.score}. Show this night."
                  @pointerenter=${() => this._selected = g}
                  @focus=${() => this._selected = g}
                  @blur=${() => this._selected = null}
                  @click=${() => this._go(g, i)}
                >
                  ${O ? u`<i class="c-duration" style="height:${v(b.d)}%"></i
                        ><i class="c-bedtime" style="height:${v(b.b)}%"></i
                        ><i class="c-interruptions" style="height:${v(b.i)}%"></i>` : u`<i class="b-${ht(b.score)}" style="height:${v(b.score)}%"></i>`}
                </button>`;
    })}
            </div>
            ${p ? u`<div class="hr-tip ${m > 55 ? "left" : ""}" style="left:${m}%">
                  <b>${q(p.night, r)}</b>
                  <span class="b-${ht(p.score)}"><i></i>Score<u>${p.score}</u></span>
                  ${p.d !== void 0 ? u`<span class="c-duration"><i></i>Duration<u>${p.d} / 50</u></span>
                        <span class="c-bedtime"><i></i>Bedtime<u>${p.b} / 30</u></span>
                        <span class="c-interruptions"><i></i>Interruptions<u>${p.i} / 20</u></span>` : d}
                  ${p.estimated ? u`<em>estimated: no stage data</em>` : d}
                </div>` : d}
          </div>
          <div class="hr-xaxis">
            ${a.map((g, b) => (a.length - 1 - b) % $ === 0 ? u`<span class="centered" style="left:${(b + 0.5) / a.length * 100}%">${C(g)}</span>` : d)}
          </div>
        </div>
        ${f ? u`<div class="hr-legend">
              <span class="c-duration"><i></i><b>Duration</b></span>
              <span class="c-bedtime"><i></i><b>Bedtime</b></span>
              <span class="c-interruptions"><i></i><b>Interruptions</b></span>
            </div>` : d}
      </div>
    `;
  }
};
bt = Kt;
bt.styles = Le;
bt.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _selected: { state: !0 },
  _ready: { state: !0 },
  _today: { state: !0 },
  _hrHour: { state: !0 },
  _stage: { state: !0 },
  _night: { state: !0 },
  _detail: { state: !0 }
};
customElements.get(Q) || customElements.define(Q, Kt);
window.customCards = window.customCards ?? [];
window.customCards.some((t) => t.type === Q) || window.customCards.push({
  type: Q,
  name: "Sleep Rings",
  description: "Sleep score with rings, a scorecard, sleep stages and history.",
  preview: !0
});
console.info(`%c SLEEP-RINGS-CARD %c ${Ue} `, "background:#6e6adf;color:#fff", "");
export {
  Ue as CARD_VERSION,
  Kt as SleepRingsCard
};
