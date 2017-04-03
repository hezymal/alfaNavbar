"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        /* globals $ */

        module.exports = function () {
            function BaseNavbar(element, options) {
                _classCallCheck(this, BaseNavbar);

                this.options = options;
                this.$element = $(element);
                this.$links = this.$element.find('a');

                if (!element.alfaNavbar) {

                    setTimeout(this.init.bind(this), 0);

                    element.alfaNavbar = this;
                }
            }

            _createClass(BaseNavbar, [{
                key: "init",
                value: function init() {

                    $(window).on('resize', this.onWindowResize.bind(this)).on('scroll', this.onWindowScroll.bind(this));

                    this.$links.on('click', this.onLinkClick.bind(this));

                    this.reset();
                    this.render();
                }
            }, {
                key: "reset",
                value: function reset() {

                    this.render();
                }
            }, {
                key: "render",
                value: function render() {

                    this.renderActiveLink();
                }
            }, {
                key: "renderActiveLink",
                value: function renderActiveLink() {

                    if (this.$links.length < 1) {

                        return;
                    }

                    var scroll = this.scroll();
                    var link = this.$links[0];

                    for (var i = 1, length = this.$links.length; i < length; i++) {

                        var selector = this.$links[i].hash;

                        if ($(selector).length) {

                            if (scroll >= this.getAnchorScroll(selector)) {

                                link = this.$links[i];
                            }
                        }
                    }

                    // add `.active` class on link and remove others
                    this.$links.removeClass(this.options.activeClass);
                    $(link).addClass(this.options.activeClass);
                }
            }, {
                key: "scroll",
                value: function scroll(selector) {

                    if (selector) {

                        $('html, body').stop().animate({ scrollTop: this.getAnchorScroll(selector, true) }, { duration: this.options.speed });
                    } else {

                        return $(document).scrollTop();
                    }
                }
            }, {
                key: "getAnchorScroll",
                value: function getAnchorScroll(selector, forScroll) {

                    var $anchor = $(selector);
                    var threshold = this.options.threshold;

                    if (threshold === 'center') {

                        forScroll = forScroll ? 1 : 0;
                        threshold = (forScroll * $anchor.height() - $(window).height()) / 2;
                    }

                    return $anchor.offset().top + threshold;
                }
            }, {
                key: "onWindowResize",
                value: function onWindowResize() {

                    this.reset();
                    this.render();
                }
            }, {
                key: "onWindowScroll",
                value: function onWindowScroll() {

                    this.render();
                }
            }, {
                key: "onLinkClick",
                value: function onLinkClick(event) {

                    var selector = event.currentTarget.hash;

                    if ($(selector).length) {

                        event.preventDefault();

                        this.scroll(selector);
                    }
                }
            }]);

            return BaseNavbar;
        }();
    }, {}], 2: [function (require, module, exports) {
        /* globals $ */

        var BaseNavbar = require('./BaseNavbar');

        module.exports = function (_BaseNavbar) {
            _inherits(DottedNavbar, _BaseNavbar);

            function DottedNavbar(element, options) {
                _classCallCheck(this, DottedNavbar);

                var _this = _possibleConstructorReturn(this, (DottedNavbar.__proto__ || Object.getPrototypeOf(DottedNavbar)).call(this, element, options));

                _this.$parent = _this.$element.parent();
                _this.screenHeight = 0;
                _this.height = 0;
                _this.minTop = 0;
                _this.maxTop = 0;

                return _this;
            }

            _createClass(DottedNavbar, [{
                key: "reset",
                value: function reset() {

                    this.screenHeight = $(window).height();
                    this.height = this.$element.outerHeight();
                    this.minTop = this.$parent.offset().top;
                    this.maxTop = this.minTop + this.$parent.outerHeight() - this.height;

                    _get(DottedNavbar.prototype.__proto__ || Object.getPrototypeOf(DottedNavbar.prototype), "reset", this).call(this);
                }
            }, {
                key: "render",
                value: function render() {

                    _get(DottedNavbar.prototype.__proto__ || Object.getPrototypeOf(DottedNavbar.prototype), "render", this).call(this);

                    var scroll = this.scroll();
                    var middle = this.screenHeight / 2 - this.height / 2;

                    if (scroll + middle > this.minTop) {

                        if (scroll + middle > this.maxTop) {

                            this.$element.removeClass(this.options.fixedClass).css('top', this.maxTop);
                        } else {

                            this.$element.addClass(this.options.fixedClass).css('top', middle);
                        }
                    } else {

                        this.$element.removeClass(this.options.fixedClass).css('top', this.minTop);
                    }
                }
            }]);

            return DottedNavbar;
        }(BaseNavbar);
    }, { "./BaseNavbar": 1 }], 3: [function (require, module, exports) {
        /* globals $ */

        var BaseNavbar = require('./BaseNavbar');

        module.exports = function (_BaseNavbar2) {
            _inherits(ToppedNavbar, _BaseNavbar2);

            function ToppedNavbar(element, options) {
                _classCallCheck(this, ToppedNavbar);

                var _this2 = _possibleConstructorReturn(this, (ToppedNavbar.__proto__ || Object.getPrototypeOf(ToppedNavbar)).call(this, element, options));

                _this2.lastScrolled = 0;
                _this2.lastTop = 0;
                _this2.minTop = 0;
                _this2.height = 0;
                _this2.$content = _this2.$element.children().first();

                return _this2;
            }

            _createClass(ToppedNavbar, [{
                key: "reset",
                value: function reset() {

                    this.minTop = this.$element.offset().top;
                    this.height = this.$content.outerHeight();

                    _get(ToppedNavbar.prototype.__proto__ || Object.getPrototypeOf(ToppedNavbar.prototype), "reset", this).call(this);
                }
            }, {
                key: "render",
                value: function render() {

                    _get(ToppedNavbar.prototype.__proto__ || Object.getPrototypeOf(ToppedNavbar.prototype), "render", this).call(this);

                    var scroll = this.scroll();
                    var top = 0;

                    if (scroll > this.minTop) {

                        top = this.lastTop + (this.lastScrolled - scroll) * this.options.factor;
                        top = top < -this.height ? -this.height : top;
                        top = top > 0 ? 0 : top;

                        this.$element.addClass(this.options.fixedClass);
                        this.$content.css('top', top);
                    } else {

                        this.$element.removeClass(this.options.fixedClass);
                        this.$content.css('top', 0);
                    }

                    if (scroll > this.lastScrolled) {

                        if (scroll > this.minTop + this.height) {

                            this.$element.addClass(this.options.outerClass);
                        } else {

                            this.$element.removeClass(this.options.outerClass);
                        }
                    } else if (this.$element.hasClass(this.options.outerClass)) {

                        if (scroll > this.minTop) {

                            this.$element.addClass(this.options.outerClass);
                        } else {

                            this.$element.removeClass(this.options.outerClass);
                        }
                    }

                    this.lastTop = top;
                    this.lastScrolled = Math.max(scroll, this.minTop);
                }
            }]);

            return ToppedNavbar;
        }(BaseNavbar);
    }, { "./BaseNavbar": 1 }], 4: [function (require, module, exports) {
        /* globals $ */

        var ToppedNavbar = require('./ToppedNavbar');
        var DottedNavbar = require('./DottedNavbar');

        $.fn.alfaNavbar = function (options) {

            options = $.extend({}, $.fn.alfaNavbar.defaults, options);

            return this.each(function () {

                if (options.type === 'dotted') {

                    this.alfaNavbar = new DottedNavbar(this, options);
                } else {

                    this.alfaNavbar = new ToppedNavbar(this, options);
                }
            });
        };

        $.fn.alfaNavbar.defaults = {

            type: 'topped',
            speed: 1000,
            activeClass: 'active',
            fixedClass: 'fixed',
            outerClass: 'outer',
            threshold: 0,
            factor: 1

        };
    }, { "./DottedNavbar": 2, "./ToppedNavbar": 3 }] }, {}, [4]);