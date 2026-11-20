var W = globalThis, oe = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, le = /* @__PURE__ */ Symbol(), _e = /* @__PURE__ */ new WeakMap(), Oe = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== le) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (oe && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = _e.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && _e.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}, Ke = (e) => new Oe(typeof e == "string" ? e : e + "", void 0, le), Je = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((s, i, a) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[a + 1], e[0]);
  return new Oe(r, e, le);
}, Qe = (e, t) => {
  if (oe) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const s = document.createElement("style"), i = W.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = r.cssText, e.appendChild(s);
  }
}, be = oe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const s of t.cssRules) r += s.cssText;
  return Ke(r);
})(e) : e, { is: et, defineProperty: tt, getOwnPropertyDescriptor: rt, getOwnPropertyNames: st, getOwnPropertySymbols: it, getPrototypeOf: at } = Object, Z = globalThis, $e = Z.trustedTypes, nt = $e ? $e.emptyScript : "", ot = Z.reactiveElementPolyfillSupport, z = (e, t) => e, se = {
  toAttribute(e, t) {
    switch (t) {
      case Boolean:
        e = e ? nt : null;
        break;
      case Object:
      case Array:
        e = e == null ? e : JSON.stringify(e);
    }
    return e;
  },
  fromAttribute(e, t) {
    let r = e;
    switch (t) {
      case Boolean:
        r = e !== null;
        break;
      case Number:
        r = e === null ? null : Number(e);
        break;
      case Object:
      case Array:
        try {
          r = JSON.parse(e);
        } catch {
          r = null;
        }
    }
    return r;
  }
}, Pe = (e, t) => !et(e, t), ye = {
  attribute: !0,
  type: String,
  converter: se,
  reflect: !1,
  useDefault: !1,
  hasChanged: Pe
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var H = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ye) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && tt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: i } = rt(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(a) {
        this[t] = a;
      }
    };
    return {
      get: s,
      set(a) {
        const n = s?.call(this);
        i?.call(this, a), this.requestUpdate(e, n, r);
      },
      configurable: !0,
      enumerable: !0
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ye;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = at(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, r = [...st(t), ...it(t)];
      for (const s of r) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, s] of t) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const s = this._$Eu(t, r);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) t.unshift(be(s));
    } else e !== void 0 && t.push(be(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : se).toAttribute(t, r.type);
      this._$Em = e, i == null ? this.removeAttribute(s) : this.setAttribute(s, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const i = r.getPropertyOptions(s), a = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : se;
      this._$Em = s;
      const n = a.fromAttribute(t, i.type);
      this[s] = n ?? this._$Ej?.get(s) ?? n, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, i) {
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (i = this[e]), r ??= a.getPropertyOptions(e), !((r.hasChanged ?? Pe)(i, t) || r.useDefault && r.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: i }, a) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), i !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
        const { wrapped: a } = i, n = this[s];
        a !== !0 || this._$AL.has(s) || n === void 0 || this.C(s, void 0, i, n);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
H.elementStyles = [], H.shadowRootOptions = { mode: "open" }, H[z("elementProperties")] = /* @__PURE__ */ new Map(), H[z("finalized")] = /* @__PURE__ */ new Map(), ot?.({ ReactiveElement: H }), (Z.reactiveElementVersions ??= []).push("2.1.2");
var he = globalThis, xe = (e) => e, q = he.trustedTypes, we = q ? q.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ne = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, De = "?" + w, lt = `<${De}>`, E = document, B = () => E.createComment(""), j = (e) => e === null || typeof e != "object" && typeof e != "function", ce = Array.isArray, ht = (e) => ce(e) || typeof e?.[Symbol.iterator] == "function", J = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ae = /-->/g, ke = />/g, A = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Se = /'/g, Ee = /"/g, Ue = /^(?:script|style|textarea|title)$/i, de = (e) => (t, ...r) => ({
  _$litType$: e,
  strings: t,
  values: r
}), f = de(1), Q = de(2), Vt = de(3), C = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Ce = /* @__PURE__ */ new WeakMap(), k = E.createTreeWalker(E, 129);
function Le(e, t) {
  if (!ce(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return we !== void 0 ? we.createHTML(t) : t;
}
var ct = (e, t) => {
  const r = e.length - 1, s = [];
  let i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = D;
  for (let o = 0; o < r; o++) {
    const h = e[o];
    let p, u, g = -1, _ = 0;
    for (; _ < h.length && (n.lastIndex = _, u = n.exec(h), u !== null); ) _ = n.lastIndex, n === D ? u[1] === "!--" ? n = Ae : u[1] !== void 0 ? n = ke : u[2] !== void 0 ? (Ue.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = A) : u[3] !== void 0 && (n = A) : n === A ? u[0] === ">" ? (n = i ?? D, g = -1) : u[1] === void 0 ? g = -2 : (g = n.lastIndex - u[2].length, p = u[1], n = u[3] === void 0 ? A : u[3] === '"' ? Ee : Se) : n === Ee || n === Se ? n = A : n === Ae || n === ke ? n = D : (n = A, i = void 0);
    const $ = n === A && e[o + 1].startsWith("/>") ? " " : "";
    a += n === D ? h + lt : g >= 0 ? (s.push(p), h.slice(0, g) + Ne + h.slice(g) + w + $) : h + w + (g === -2 ? o : $);
  }
  return [Le(e, a + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
}, ie = class ze {
  constructor({ strings: t, _$litType$: r }, s) {
    let i;
    this.parts = [];
    let a = 0, n = 0;
    const o = t.length - 1, h = this.parts, [p, u] = ct(t, r);
    if (this.el = ze.createElement(p, s), k.currentNode = this.el.content, r === 2 || r === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (i = k.nextNode()) !== null && h.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const g of i.getAttributeNames()) if (g.endsWith(Ne)) {
          const _ = u[n++], $ = i.getAttribute(g).split(w), y = /([.?@])?(.*)/.exec(_);
          h.push({
            type: 1,
            index: a,
            name: y[2],
            strings: $,
            ctor: y[1] === "." ? pt : y[1] === "?" ? ut : y[1] === "@" ? gt : K
          }), i.removeAttribute(g);
        } else g.startsWith(w) && (h.push({
          type: 6,
          index: a
        }), i.removeAttribute(g));
        if (Ue.test(i.tagName)) {
          const g = i.textContent.split(w), _ = g.length - 1;
          if (_ > 0) {
            i.textContent = q ? q.emptyScript : "";
            for (let $ = 0; $ < _; $++) i.append(g[$], B()), k.nextNode(), h.push({
              type: 2,
              index: ++a
            });
            i.append(g[_], B());
          }
        }
      } else if (i.nodeType === 8) if (i.data === De) h.push({
        type: 2,
        index: a
      });
      else {
        let g = -1;
        for (; (g = i.data.indexOf(w, g + 1)) !== -1; ) h.push({
          type: 7,
          index: a
        }), g += w.length - 1;
      }
      a++;
    }
  }
  static createElement(t, r) {
    const s = E.createElement("template");
    return s.innerHTML = t, s;
  }
};
function O(e, t, r = e, s) {
  if (t === C) return t;
  let i = s !== void 0 ? r._$Co?.[s] : r._$Cl;
  const a = j(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, r, s)), s !== void 0 ? (r._$Co ??= [])[s] = i : r._$Cl = i), i !== void 0 && (t = O(e, i._$AS(e, t.values), i, s)), t;
}
var dt = class {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? E).importNode(t, !0);
    k.currentNode = s;
    let i = k.nextNode(), a = 0, n = 0, o = r[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let h;
        o.type === 2 ? h = new pe(i, i.nextSibling, this, e) : o.type === 1 ? h = new o.ctor(i, o.name, o.strings, this, e) : o.type === 6 && (h = new mt(i, this, e)), this._$AV.push(h), o = r[++n];
      }
      a !== o?.index && (i = k.nextNode(), a++);
    }
    return k.currentNode = E, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}, pe = class Be {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && t?.nodeType === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = O(this, t, r), j(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ht(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = ie.createElement(Le(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(r);
    else {
      const a = new dt(i, this), n = a.u(this.options);
      a.p(r), this.T(n), this._$AH = a;
    }
  }
  _$AC(t) {
    let r = Ce.get(t.strings);
    return r === void 0 && Ce.set(t.strings, r = new ie(t)), r;
  }
  k(t) {
    ce(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let s, i = 0;
    for (const a of t) i === r.length ? r.push(s = new Be(this.O(B()), this.O(B()), this, this.options)) : s = r[i], s._$AI(a), i++;
    i < r.length && (this._$AR(s && s._$AB.nextSibling, i), r.length = i);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const s = xe(t).nextSibling;
      xe(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}, K = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, i) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(/* @__PURE__ */ new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, t = this, r, s) {
    const i = this.strings;
    let a = !1;
    if (i === void 0) e = O(this, e, t, 0), a = !j(e) || e !== this._$AH && e !== C, a && (this._$AH = e);
    else {
      const n = e;
      let o, h;
      for (e = i[0], o = 0; o < i.length - 1; o++) h = O(this, n[r + o], t, o), h === C && (h = this._$AH[o]), a ||= !j(h) || h !== this._$AH[o], h === d ? e = d : e !== d && (e += (h ?? "") + i[o + 1]), this._$AH[o] = h;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}, pt = class extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}, ut = class extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}, gt = class extends K {
  constructor(e, t, r, s, i) {
    super(e, t, r, s, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = O(this, e, t, 0) ?? d) === C) return;
    const r = this._$AH, s = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== d && (r === d || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}, mt = class {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}, ft = he.litHtmlPolyfillSupport;
ft?.(ie, pe), (he.litHtmlVersions ??= []).push("3.3.3");
var vt = (e, t, r) => {
  const s = r?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = r?.renderBefore ?? null;
    s._$litPart$ = i = new pe(t.insertBefore(B(), a), a, void 0, r ?? {});
  }
  return i._$AI(e), i;
}, ue = globalThis, R = class extends H {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = vt(t, this.renderRoot, this.renderOptions);
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
R._$litElement$ = !0, R.finalized = !0, ue.litElementHydrateSupport?.({ LitElement: R });
var _t = ue.litElementPolyfillSupport;
_t?.({ LitElement: R });
(ue.litElementVersions ??= []).push("4.2.2");
var bt = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6
}, $t = (e) => (...t) => ({
  _$litDirective$: e,
  values: t
}), yt = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, r) {
    this._$Ct = e, this._$AM = t, this._$Ci = r;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}, je = "important", xt = " !" + je, wt = $t(class extends yt {
  constructor(e) {
    if (super(e), e.type !== bt.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(e) {
    return Object.keys(e).reduce((t, r) => {
      const s = e[r];
      return s == null ? t : t + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(e, [t]) {
    const { style: r } = e.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const s of this.ft) t[s] ?? (this.ft.delete(s), s.includes("-") ? r.removeProperty(s) : r[s] = null);
    for (const s in t) {
      const i = t[s];
      if (i != null) {
        this.ft.add(s);
        const a = typeof i == "string" && i.endsWith(xt);
        s.includes("-") || a ? r.setProperty(s, a ? i.slice(0, -11) : i, a ? je : "") : r[s] = i;
      }
    }
    return C;
  }
}), ae = {
  very_low: "Very Low",
  low: "Low",
  ok: "OK",
  high: "High",
  very_high: "Very High"
}, At = Object.keys(ae);
function x(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function Ie(e) {
  return e >= 96 ? "very_high" : e >= 81 ? "high" : e >= 61 ? "ok" : e >= 41 ? "low" : "very_low";
}
function kt(e) {
  const t = e?.attributes ?? {}, r = e ? x(e.state) : null, s = String(t.band ?? "");
  return {
    score: r,
    band: At.includes(s) ? s : r !== null ? Ie(r) : null,
    night: typeof t.night == "string" ? t.night : null,
    duration: x(t.duration_points),
    bedtime: x(t.bedtime_points),
    interruptions: x(t.interruptions_points),
    asleepMinutes: x(t.asleep_minutes),
    deviationMinutes: x(t.bedtime_deviation_minutes),
    wakeups: x(t.wakeups),
    awakeMinutes: x(t.awake_minutes),
    stages: Array.isArray(t.stages) ? t.stages : [],
    history: Array.isArray(t.history) ? t.history : [],
    goalHours: x(t.duration_goal_hours),
    usualOnsetMinutes: x(t.usual_onset_minutes),
    heartRate: x(t.heart_rate_average),
    heartRateLow: x(t.heart_rate_lowest),
    heartRateHours: Array.isArray(t.heart_rate_hours) ? t.heart_rate_hours : []
  };
}
function S(e) {
  const t = Math.round(Math.abs(e)), r = Math.floor(t / 60), s = t % 60;
  return r === 0 ? `${s}m` : `${r}h ${String(s).padStart(2, "0")}m`;
}
function St(e) {
  return e.asleepMinutes === null ? "" : `${S(e.asleepMinutes)} asleep`;
}
function Et(e) {
  if (e.bedtime === null) return "";
  if (e.deviationMinutes === null) return "No bedtime history yet";
  if (Math.abs(e.deviationMinutes) < 1) return "At your usual time";
  const t = e.deviationMinutes > 0 ? "later" : "earlier";
  return `${S(e.deviationMinutes)} ${t} than usual`;
}
function Ct(e) {
  if (e.wakeups === null) return "";
  const t = e.awakeMinutes === null ? "" : `, ${S(e.awakeMinutes)} awake`;
  return e.wakeups === 0 ? `No wake-ups${t}` : `${e.wakeups} wake-up${e.wakeups === 1 ? "" : "s"}${t}`;
}
function X(e) {
  const [t, r, s] = e.split("-").map(Number);
  return new Date(t, (r || 1) - 1, s || 1);
}
function Fe(e) {
  const t = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
  return `${e.getFullYear()}-${t}-${r}`;
}
function ee(e, t) {
  return X(e).toLocaleDateString(t, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function Me(e, t, r) {
  try {
    return e.toLocaleTimeString(t, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: r
    });
  } catch {
    return e.toLocaleTimeString(t, {
      hour: "numeric",
      minute: "2-digit"
    });
  }
}
function Te(e) {
  return e === null ? "--" : String(Math.round(e));
}
function Mt(e, t) {
  const r = ((Math.round(e) + 720) % 1440 + 1440) % 1440;
  return new Date(2e3, 0, 1, Math.floor(r / 60), r % 60).toLocaleTimeString(t, {
    hour: "numeric",
    minute: "2-digit"
  });
}
function te(e) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: e,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(/* @__PURE__ */ new Date());
  } catch {
    return Fe(/* @__PURE__ */ new Date());
  }
}
function Tt(e, t) {
  return Math.round((X(t).getTime() - X(e).getTime()) / 864e5);
}
var Ve = [
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
], ne = "synthwave", re = {
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
}, Ht = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla)\([0-9.,%\s/deg-]+\)|var\(--[a-z0-9-]+\))$/i;
function Rt(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  return Ht.test(t) ? t : void 0;
}
function Ge(e) {
  const t = typeof e == "string" ? e : ne;
  return Object.prototype.hasOwnProperty.call(re, t) ? re[t] : re[ne];
}
function We(e) {
  return Ge(e).tiles ?? !1;
}
function Ot(e, t, r = !1) {
  const s = Ge(e), i = {
    ...s.vars ?? {},
    ...r ? {} : s.background ?? {}
  };
  for (const a of Ve) {
    const n = Rt(t?.[a]) ?? s.colors[a];
    n && (i[`--sr-${a.replace("_", "-")}`] = n);
  }
  return i;
}
var qe, He = "sleep-rings-card-editor", Xe = {
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
}, Pt = {
  colors: "Any CSS colour, for example #ff2fd6. Leave a field empty to use the preset.",
  theme_background: "Off: the Synthwave preset paints its own dark card.",
  sleep_goal_hours: "Shown on the Duration row. Empty: the duration that earns full points."
}, M = (e) => ({
  name: e,
  selector: { boolean: {} }
}), Nt = [
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
      M("show_rows"),
      M("show_hypnogram"),
      M("show_history"),
      M("show_heart_rate"),
      M("tiles"),
      M("theme_background")
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
    title: Xe.colors,
    schema: Ve.map((e) => ({
      name: e,
      selector: { text: {} }
    }))
  }
], Ye = class extends R {
  setConfig(e) {
    this._config = e;
  }
  render() {
    if (!this._config) return d;
    const e = {
      preset: ne,
      ring_style: "concentric",
      show_rows: !0,
      show_hypnogram: !0,
      show_history: !0,
      show_heart_rate: !0,
      history_nights: 30,
      theme_background: !1,
      tiles: We(this._config.preset),
      ...this._config
    };
    return f`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${Nt}
        .computeLabel=${(t) => Xe[t.name] ?? t.name}
        .computeHelper=${(t) => Pt[t.name]}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  _valueChanged(e) {
    e.stopPropagation();
    const t = { ...e.detail.value };
    if (t.colors) {
      const r = Object.fromEntries(Object.entries(t.colors).filter(([, s]) => typeof s == "string" && s.trim()));
      Object.keys(r).length ? t.colors = r : delete t.colors;
    }
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    }));
  }
};
qe = Ye;
qe.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
};
customElements.get(He) || customElements.define(He, Ye);
var Dt = Je`
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
`, ge, Ut = "1.0.0", Y = "sleep-rings-card", U = [
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
], T = [
  "awake",
  "rem",
  "core",
  "deep"
], Re = [
  "Awake",
  "REM",
  "Core",
  "Deep"
], Lt = {
  awake: 0,
  out_of_bed: 0,
  rem: 1,
  core: 2,
  light: 2,
  asleep: 2,
  sleeping: 2,
  deep: 3
}, L = 26, zt = 60, Bt = 1e3, jt = 1296e5, It = 36, Ft = (e, t) => e === null ? 0 : Math.min(1, Math.max(0, e / t)), Ze = class extends R {
  constructor() {
    super(), this._selected = null, this._ready = !1, this._today = te(), this._hrHour = null;
  }
  static getConfigElement() {
    return document.createElement("sleep-rings-card-editor");
  }
  static getStubConfig(e) {
    return { entity: Object.values(e?.states ?? {}).find((t) => t.entity_id.startsWith("sensor.") && "duration_points" in t.attributes)?.entity_id ?? "" };
  }
  setConfig(e) {
    if (!e || typeof e != "object") throw new Error("Sleep Rings: the card configuration is missing");
    this._config = {
      ring_style: "concentric",
      show_rows: !0,
      show_hypnogram: !0,
      show_history: !0,
      show_heart_rate: !0,
      history_nights: 30,
      ...e
    };
    const t = Math.round(Number(this._config.history_nights));
    this._config.history_nights = Number.isFinite(t) ? Math.min(zt, Math.max(1, t)) : 30;
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
  willUpdate(e) {
    e.has("hass") && (this._today = te(this.hass?.config?.time_zone));
  }
  shouldUpdate(e) {
    if (this.hass && te(this.hass.config?.time_zone) !== this._today || e.size > 1 || !e.has("hass")) return !0;
    const t = this._config?.entity;
    return t ? e.get("hass")?.states[t] !== this.hass?.states[t] : !0;
  }
  firstUpdated() {
    requestAnimationFrame(() => this._ready = !0);
  }
  render() {
    const e = this._config;
    if (!e) return d;
    const t = e.entity ? this.hass?.states[e.entity] : void 0, r = kt(t), s = this.hass?.locale?.language, i = Ot(e.preset, e.colors, e.theme_background);
    let a = "";
    e.entity ? t ? r.score === null && (a = "No sleep score yet. It appears after the next recorded night.") : a = `Entity not found: ${e.entity}` : a = "Choose a sleep score entity in the card settings.";
    const n = e.show_hypnogram && r.stages.length ? this._renderHypnogram(r.stages) : d, o = e.show_history && r.history.length ? this._renderHistory(r, e.history_nights ?? 30) : d, h = e.show_heart_rate && r.heartRate !== null ? this._renderHeartRate(r) : d, p = n !== d || o !== d || h !== d;
    return f`
      <ha-card class=${e.tiles ?? We(e.preset) ? "tiles" : ""} style=${wt(i)}>
        <div class="header">
          <span class="title">${e.name ?? "Sleep Score"}</span>
          ${r.night ? f`<span class="night">${this._renderAge(r.night)}${ee(r.night, s)}</span>` : d}
        </div>
        ${a ? f`<div class="message">${a}</div>` : d}
        <div class="body ${p ? "has-extras" : ""}">
          <div class="hero">
            ${this._renderRings(r, e.ring_style === "segmented")}
            ${e.show_rows ? this._renderRows(r) : d}
          </div>
          ${p ? f`<div class="extras ${h !== d ? "has-hr" : ""} ${n !== d ? "has-stages" : ""}">
                ${n}${h}${o}
              </div>` : d}
        </div>
      </ha-card>
    `;
  }
  _fraction(e, t, r) {
    return this._ready ? Ft(e[t], r) : 0;
  }
  _renderRings(e, t) {
    const r = e.score === null ? "Sleep score not available" : `Sleep score ${e.score} of 100, ${e.band ? ae[e.band] : ""}. ` + U.map((s) => `${s.label} ${Te(e[s.key])} of ${s.max}`).join(", ");
    return f`
      <div class="rings ${t ? "segmented" : "concentric"} ${e.band ? `b-${e.band}` : ""}" role="img" aria-label=${r}>
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <defs>
            ${U.map((s) => Q`
                <linearGradient id="sr-grad-${s.key}" class="c-${s.key}" gradientUnits="userSpaceOnUse"
                  x1="0" y1="0" x2="0" y2="160">
                  <stop offset="0" style="stop-color:currentColor"></stop>
                  <stop offset="1" style="stop-color:var(--end, currentColor)"></stop>
                </linearGradient>`)}
          </defs>
          ${t ? this._segments(e) : this._concentric(e)}
        </svg>
        <div class="center">
          <span class="score">${e.score ?? "--"}</span>
          ${e.band ? f`<span class="band b-${e.band}"><span class="band-dot"></span><span>${ae[e.band]}</span></span>` : d}
        </div>
      </div>
    `;
  }
  _concentric(e) {
    const t = [
      70,
      56,
      42
    ];
    return U.map((r, s) => {
      const i = t[s], a = 2 * Math.PI * i, n = this._fraction(e, r.key, r.max);
      return Q`
        <circle class="track c-${r.key}" cx="80" cy="80" r=${i} stroke-width="10"></circle>
        <circle style="stroke:url(#sr-grad-${r.key})" class="fill c-${r.key} ${n <= 0 ? "empty" : ""}" cx="80" cy="80" r=${i} stroke-width="10"
          stroke-dasharray=${a} stroke-dashoffset=${a * (1 - n)}></circle>`;
    });
  }
  _segments(e) {
    const s = 2 * Math.PI * 68, i = 17;
    let a = 0;
    return U.map((n) => {
      const o = n.max / 100, h = a * s + i / 2, p = o * s - i;
      a += o;
      const u = p * this._fraction(e, n.key, n.max);
      return Q`
        <circle class="track c-${n.key}" cx="80" cy="80" r=${68} stroke-width=${12}
          stroke-dasharray="${p} ${s - p}" stroke-dashoffset=${-h}></circle>
        <circle style="stroke:url(#sr-grad-${n.key})" class="fill c-${n.key} ${u <= 0 ? "empty" : ""}" cx="80" cy="80" r=${68} stroke-width=${12}
          stroke-dasharray="${u} ${s - u}" stroke-dashoffset=${-h}></circle>`;
    });
  }
  _renderRows(e) {
    const t = {
      duration: St(e),
      bedtime: Et(e),
      interruptions: Ct(e)
    }, r = this.hass?.locale?.language, s = this._config?.sleep_goal_hours ?? e.goalHours, i = {
      duration: s ? `Goal ${S(s * 60)}` : "",
      bedtime: e.usualOnsetMinutes !== null ? `Usual ${Mt(e.usualOnsetMinutes, r)}` : "",
      interruptions: ""
    };
    return f`
      <div class="rows">
        ${U.map((a) => f`
            <div class="row c-${a.key}">
              <div class="row-head">
                <span class="dot"></span>
                <span class="row-name">${a.label}</span>
                <span class="row-pts"><b>${Te(e[a.key])}</b>/${a.max}</span>
              </div>
              <div class="bar">
                <div class="bar-fill" style="width:${this._fraction(e, a.key, a.max) * 100}%"></div>
              </div>
              <div class="row-detail">
                <span>${t[a.key] || "\xA0"}</span>
                ${i[a.key] ? f`<span class="row-target">${i[a.key]}</span>` : d}
              </div>
            </div>
          `)}
      </div>
    `;
  }
  _renderHypnogram(e) {
    const t = e.map((l) => ({
      lane: Lt[l.stage],
      start: Date.parse(l.start),
      end: Date.parse(l.end)
    })).filter((l) => l.lane !== void 0 && l.end > l.start).slice(0, Bt).sort((l, v) => l.start - v.start);
    if (!t.length) return d;
    const r = t[0].start, s = Math.max(...t.map((l) => l.end));
    if (!Number.isFinite(r) || !Number.isFinite(s) || s - r > jt) return d;
    const i = (l) => (l - r) / (s - r) * 100, a = this.hass?.locale?.language, n = this.hass?.config?.time_zone, o = T.map((l, v) => t.filter((c) => c.lane === v).reduce((c, m) => c + (m.end - m.start) / 6e4, 0)), h = o[1] + o[2] + o[3], p = (s - r) / 6e4, u = (l) => h > 0 ? Math.min(1, l / h) : 0, g = [...T.map((l, v) => ({
      key: l,
      label: Re[v],
      minutes: o[v],
      percent: v > 0
    })), {
      key: "combo",
      label: "Deep + REM",
      minutes: o[1] + o[3],
      percent: !0
    }], _ = (l) => l * L + 7, $ = [];
    for (let l = 1; l < t.length; l++) {
      const v = t[l - 1], c = t[l];
      if (v.lane === c.lane || c.start - v.end > 6e4) continue;
      const [m, N] = v.lane < c.lane ? [v.lane, c.lane] : [c.lane, v.lane];
      $.push(f`<div
        class="link"
        style="left:${i(c.start)}%;top:${m * L + L / 2}px;height:${(N - m) * L}px;
          background:linear-gradient(var(--_${T[m]}),var(--_${T[N]}))"
      ></div>`);
    }
    const y = [], P = new Date(r);
    let I = P.getMinutes();
    try {
      I = Number(new Intl.DateTimeFormat("en", {
        minute: "numeric",
        timeZone: n
      }).format(P));
    } catch {
    }
    const F = s - r > 216e5 ? 2 : 1;
    let V = 0;
    for (let l = r + (60 - I) % 60 * 6e4; l < s; l += 36e5, V++) {
      if (V % F) continue;
      const v = i(l);
      if (v < 4 || v > 96) continue;
      let c;
      try {
        c = new Date(l).toLocaleTimeString(a, {
          hour: "numeric",
          timeZone: n
        });
      } catch {
        c = new Date(l).toLocaleTimeString(a, { hour: "numeric" });
      }
      y.push({
        at: l,
        label: c
      });
    }
    return f`
      <div class="section stages">
        <div class="section-head">
          <span>Stages</span>
          <span>${Me(new Date(r), a, n)} ${"\u2013"} ${Me(new Date(s), a, n)}</span>
        </div>
        <div class="hypno" role="img" aria-label="Sleep stages through the night">
          <div class="lane-labels">${Re.map((l) => f`<span>${l}</span>`)}</div>
          <div class="plot">
            ${T.map((l, v) => f`<div class="lane-band s-${l}" style="top:${v * L}px"></div>`)}
            ${y.map((l) => f`<div class="tick" style="left:${i(l.at)}%"></div>`)}
            ${$}
            ${t.map((l) => f`<div
                class="stage s-${T[l.lane]}"
                style="left:${i(l.start)}%;width:${i(l.end) - i(l.start)}%;top:${_(l.lane)}px"
              ></div>`)}
          </div>
          <div class="axis">${y.map((l) => f`<span style="left:${i(l.at)}%">${l.label}</span>`)}</div>
        </div>
        <div class="night-summary">
          <span>In bed <b>${S(p)}</b></span>
          <span>Asleep <b>${S(h)}</b></span>
          <span>Efficiency <b>${p > 0 ? Math.round(h / p * 100) : 0}%</b></span>
        </div>
        <div class="stage-stats">
          ${g.map((l) => f`
              <div class="stat s-${l.key}">
                <span class="dot"></span>
                <span class="stat-name">${l.label}</span>
                <span class="stat-bar"><i style="width:${u(l.minutes) * 100}%"></i></span>
                <span class="stat-value">${S(l.minutes)}</span>
                <span class="stat-pct">${l.percent ? `${Math.round(u(l.minutes) * 100)}%` : ""}</span>
              </div>
            `)}
        </div>
      </div>
    `;
  }
  _renderAge(e) {
    const t = Tt(e, this._today);
    if (t < 0) return d;
    const r = t === 0 ? "Today" : t === 1 ? "Yesterday" : `${t} days ago`;
    return f`<span class="age ${t === 0 ? "fresh" : t === 1 ? "recent" : "old"}" title=${t === 0 ? "This is the night you woke up from today" : "No sleep has been recorded for today yet"}>${r}</span>`;
  }
  _renderHeartRate(e) {
    const t = this.hass?.locale?.language, r = this.hass?.config?.time_zone, s = e.heartRateHours.slice(0, It).filter((o) => Number.isFinite(o.mean) && Number.isFinite(Date.parse(o.start))).map((o) => ({
      at: Date.parse(o.start),
      mean: o.mean,
      low: o.min ?? o.mean,
      high: o.max ?? o.mean,
      partial: o.partial === !0
    })), i = (o) => {
      try {
        return new Date(o).toLocaleTimeString(t, {
          hour: "numeric",
          timeZone: r
        });
      } catch {
        return new Date(o).toLocaleTimeString(t, { hour: "numeric" });
      }
    }, a = `${Math.round(e.heartRate ?? 0)} bpm` + (e.heartRateLow !== null ? ` \xB7 low ${Math.round(e.heartRateLow)}` : "");
    let n = d;
    if (s.length >= 2) {
      const o = s.some((c) => !c.partial) ? s.filter((c) => !c.partial) : s, h = Math.floor((Math.min(...o.map((c) => c.low)) - 1) / 5) * 5, p = Math.ceil((Math.max(...o.map((c) => c.high)) + 1) / 5) * 5, u = Math.max(5, p - h), g = (c) => (c + 0.5) / s.length * 100, _ = (c) => (1 - Math.min(1, Math.max(0, (c - h) / u))) * 100, $ = (c) => Math.min(100, Math.max(0, c)), y = (c) => {
        const m = s.map((b, G) => [g(G), _(c(b))]);
        let N = `M${m[0][0].toFixed(2)},${m[0][1].toFixed(2)}`;
        for (let b = 0; b < m.length - 1; b++) {
          const G = m[Math.max(0, b - 1)], me = m[Math.min(m.length - 1, b + 2)], fe = [m[b][0] + (m[b + 1][0] - G[0]) / 6, $(m[b][1] + (m[b + 1][1] - G[1]) / 6)], ve = [m[b + 1][0] - (me[0] - m[b][0]) / 6, $(m[b + 1][1] - (me[1] - m[b][1]) / 6)];
          N += ` C${fe[0].toFixed(2)},${fe[1].toFixed(2)} ${ve[0].toFixed(2)},${ve[1].toFixed(2)} ${m[b + 1][0].toFixed(2)},${m[b + 1][1].toFixed(2)}`;
        }
        return N;
      }, P = y((c) => c.mean), I = `${P} L${g(s.length - 1).toFixed(2)},100 L${g(0).toFixed(2)},100 Z`, F = [
        p,
        h + u / 2,
        h
      ], V = s.length > 6 ? 2 : 1, l = this._hrHour !== null ? s[this._hrHour] : void 0, v = this._hrHour !== null ? g(this._hrHour) : 0;
      n = f`
        <div class="hr-chart">
          <div class="hr-yaxis">${F.map((c) => f`<span>${Math.round(c)}</span>`)}</div>
          <div class="hr-plot" @pointerleave=${() => this._hrHour = null}>
            ${F.map((c, m) => f`<div class="hr-grid" style="top:${m * 50}%"></div>`)}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path class="hr-area" d=${I}></path>
              <path class="hr-line high" d=${y((c) => c.high)}></path>
              <path class="hr-line low" d=${y((c) => c.low)}></path>
              <path class="hr-line avg" d=${P}></path>
            </svg>
            ${l ? f`
                  <div class="hr-guide" style="left:${v}%"></div>
                  <i class="hr-dot high" style="left:${v}%;top:${_(l.high)}%"></i>
                  <i class="hr-dot avg" style="left:${v}%;top:${_(l.mean)}%"></i>
                  <i class="hr-dot low" style="left:${v}%;top:${_(l.low)}%"></i>
                  <div class="hr-tip ${v > 55 ? "left" : ""}" style="left:${v}%">
                    <b>${i(l.at)} \u2013 ${i(l.at + 36e5)}</b>
                    ${l.partial ? f`<em>partly awake</em>` : d}
                    <span class="high"><i></i>Hourly high<u>${Math.round(l.high)} bpm</u></span>
                    <span class="avg"><i></i>Average<u>${Math.round(l.mean)} bpm</u></span>
                    <span class="low"><i></i>Hourly low<u>${Math.round(l.low)} bpm</u></span>
                  </div>
                ` : d}
            ${s.map((c, m) => f`<button
                class="hr-hit"
                style="left:${m / s.length * 100}%;width:${100 / s.length}%"
                aria-label="${i(c.at)}: average ${Math.round(c.mean)}, high ${Math.round(c.high)}, low ${Math.round(c.low)} bpm"
                @pointerenter=${() => this._hrHour = m}
                @focus=${() => this._hrHour = m}
                @blur=${() => this._hrHour = null}
                @click=${() => this._hrHour = m}
              ></button>`)}
          </div>
          <div class="hr-xaxis">
            ${s.map((c, m) => m % V === 0 ? f`<span style="left:${m / s.length * 100}%">${i(c.at)}</span>` : d)}
          </div>
        </div>
        <div class="hr-legend">
          <span class="high"><i></i>Hourly high</span>
          <span class="avg"><i></i>Average</span>
          <span class="low"><i></i>Hourly low</span>
        </div>
      `;
    }
    return f`
      <div class="section heart">
        <div class="section-head">
          <span>Sleeping heart rate</span>
          <span class="hr-summary">${a}</span>
        </div>
        ${n}
      </div>
    `;
  }
  _renderHistory(e, t) {
    const r = this.hass?.locale?.language, s = new Map(e.history.map((p) => [p.night, p])), i = X(e.history[e.history.length - 1].night), a = [];
    for (let p = Math.max(1, t) - 1; p >= 0; p--) {
      const u = new Date(i);
      u.setDate(i.getDate() - p), a.push(Fe(u));
    }
    const n = a.map((p) => s.get(p)).filter((p) => p !== void 0), o = this._selected ? s.get(this._selected) : void 0;
    let h = "";
    if (o) {
      const p = [
        o.d,
        o.b,
        o.i
      ].every((g) => g !== void 0) ? ` (${o.d} / ${o.b} / ${o.i})` : "", u = o.estimated ? " \xB7 estimated" : "";
      h = `${ee(o.night, r)} \xB7 ${o.score}${p}${u}`;
    } else if (n.length) {
      const p = n.reduce((u, g) => u + g.score, 0) / n.length;
      h = `Average ${Math.round(p)}`;
    }
    return f`
      <div class="section nights">
        <div class="section-head">
          <span>${t} nights</span>
          <span>${h}</span>
        </div>
        <div class="history" @pointerleave=${() => this._selected = null}>
          ${a.map((p) => {
      const u = s.get(p);
      return u ? f`<button
              class="night-bar b-${Ie(u.score)} ${u.estimated ? "estimated" : ""} ${this._selected === p ? "selected" : ""}"
              aria-label="${ee(p, r)}: ${u.score}"
              @pointerenter=${() => this._selected = p}
              @focus=${() => this._selected = p}
              @click=${() => this._selected = p}
            >
              <i style="height:${Math.max(0, Math.min(100, u.score))}%"></i>
            </button>` : f`<span class="night-bar missing"><i></i></span>`;
    })}
        </div>
      </div>
    `;
  }
};
ge = Ze;
ge.styles = Dt;
ge.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _selected: { state: !0 },
  _ready: { state: !0 },
  _today: { state: !0 },
  _hrHour: { state: !0 }
};
customElements.get(Y) || customElements.define(Y, Ze);
window.customCards = window.customCards ?? [];
window.customCards.some((e) => e.type === Y) || window.customCards.push({
  type: Y,
  name: "Sleep Rings",
  description: "Sleep score with rings, a scorecard, sleep stages and history.",
  preview: !0
});
console.info(`%c SLEEP-RINGS-CARD %c ${Ut} `, "background:#6e6adf;color:#fff", "");
export {
  Ut as CARD_VERSION,
  Ze as SleepRingsCard
};
