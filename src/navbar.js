if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($, window, document) {
    "use strict";

    var NavBar = {
        init: function(options, element) {
            this.options = $.extend({}, $.fn.navbar.defaults, options);

            this.$window = $(window);
            this.$document = $(document);
            this.$htmlbody = $('html, body');
            this.$element = $(element);
            this.$links = this.$element.find('a'); 

            this.$window.on('resize', this.onWindowResize.bind(this));
            this.$window.on('scroll', this.onWindowScroll.bind(this));

            this.$links.on('mouseover', this.onLinkHover.bind(this));
            this.$links.on('mouseout', this.onLinkHover.bind(this));
            this.$links.on('click', this.onLinkClick.bind(this));

            this.options.init && this.options.init(this);
            this.options.reset && this.options.reset(this);
        },

        onWindowResize: function() {
            var scrolled = this.getScrolled();

            this.options.reset && this.options.reset(this);
            //this.options.fixed && this.options.fixed(this, scrolled);
        },

        onWindowScroll: function() {
            var scrolled = this.getScrolled();
            var activeLink = this.getActiveLink(scrolled);

            if (activeLink) {
                this.$links.removeClass(this.options.activeClass);
                $(activeLink).addClass(this.options.activeClass);
            }

            this.options.fixed && this.options.fixed(this, scrolled);
        },

        onLinkHover: function(event) {
            $(event.currentTarget).toggleClass(this.options.hoverClass);
        },

        onLinkClick: function(event) {
            var $anchor = $(event.currentTarget.hash);
            var top = $anchor.offset().top;

            this.$htmlbody.stop().animate(
                { scrollTop: top + 1 },
                { duration: this.options.speed }
            );
        },

        getScrolled: function() {
            return this.$document.scrollTop();
        },

        getActiveLink: function(scrolled) {
            var link = null;

            for (var i = 0; i < this.$links.length; i++) {
                var $anchor = $(this.$links[i].hash);

                if ($anchor.length) {
                    if (scrolled >= $anchor.offset().top) {
                        link = this.$links[i];
                    }
                }
            }

            // get the last section if we reached the bottom of the page 
            // before reaching the last section top
            var pageBottom = this.$document.height() - this.$window.height();
            
            if (scrolled == pageBottom) {
                var numberOfLinks = this.$links.length;
                
                if (numberOfLinks > 0) {
                    link = this.$links[numberOfLinks - 1].hash;
                }
            }

            return link;
        }
    };

    $.fn.navbar = function(options) {
        return this.each(function() {
            var navbar = Object.create(NavBar);
            navbar.init(options, this);
        });
    };

    $.fn.navbar.defaults = {
        speed: 1000,
        hoverClass: 'hover',
        activeClass: 'active',
        init: null,
        reset: null,
        fixed: null,
    };


    var DotNavBar = function() {
        var $parent, screenHeight, elementHeight, minTop, maxTop;

        return {
            init: function(navbar) {
                $parent = navbar.$element.parent();
            },

            reset: function(navbar) {
                screenHeight = navbar.$window.height();
                elementHeight = navbar.$element.height();
                minTop = $parent.offset().top;
                maxTop = minTop + $parent.outerHeight() - elementHeight;
            },

            fixed: function(navbar, scrolled) {
                var center = screenHeight / 2 - elementHeight / 2;

                if (scrolled + center > minTop) {
                    if (scrolled + center > maxTop) {
                        navbar.$element.css({
                            'position': 'absolute',
                            'top': maxTop + 'px'
                        });
                    } else {
                        navbar.$element.css({
                            'position': 'fixed',
                            'top': center + 'px'
                        });
                    }
                } else {
                    navbar.$element.css({
                        'position': 'absolute',
                        'top': minTop + 'px'
                    });
                }
            }
        };
    };

    $.fn.dotnavbar = function(options) {
        return this.each(function() {
            var navbar = Object.create(NavBar);
            var dotnavbar = new DotNavBar();
            
            options = $.extend(dotnavbar, $.fn.dotnavbar.defaults, options);
            navbar.init(options, this);
        });
    };

    $.fn.dotnavbar.defaults = {
        speed: 1000,
        hoverClass: 'hover',
        activeClass: 'active'
    };  


    var TopNavBar = function() {
        var $wrapper, min_top, height;
        var last_scrolled = 0, last_top = 0;

        function setStaticPosition($element) {
            $wrapper.css('padding-bottom', 0);
            $element.css('position', 'static');
        }

        function setFixedPosition($element, top) {
            $wrapper.css('padding-bottom', height);
            $element.css({ 'top': top, 'position': 'fixed' });
        }

        return {
            init: function(navbar) {
                $wrapper = navbar.$element.wrap('<div></div>').parent();
            },

            reset: function(navbar) {
                min_top = $wrapper.offset().top;
                height = navbar.$element.outerHeight();
            },

            fixed: function(navbar, scrolled) {
                var state = 'normal';

                if (last_scrolled >= scrolled) {
                    // scroll up

                    if (scrolled <= min_top) {

                        state = 'normal';

                    } else {

                        state = 'visible';

                    }

                } else {
                    // scroll down

                    if (scrolled > min_top) {

                        state = 'visible';

                    } else {

                        state = 'normal';

                    }
                }

                if (state === 'normal') {

                    setStaticPosition(navbar.$element);
                    last_top = 0;

                } else {

                    var top = 0;

                    if (state === 'visible') {
                        var scroll_offset = (last_scrolled - scrolled) * navbar.options.factor;

                        top = last_top + scroll_offset;

                        if (top < -height) {

                            top = -height;

                        } else if (top > 0) {

                            top = 0;

                        }

                        last_top = top;
                    }

                    setFixedPosition(navbar.$element, top);
                }

                last_scrolled = Math.max(scrolled, min_top);
            }
        };
    };

    $.fn.topnavbar = function(options) {
        return this.each(function() {
            var navbar = Object.create(NavBar);
            var topnavbar = new TopNavBar();
            
            options = $.extend(topnavbar, $.fn.topnavbar.defaults, options);
            navbar.init(options, this);
        });
    };

    $.fn.topnavbar.defaults = {
        factor: 1,
        speed: 1000,
        hoverClass: 'hover',
        activeClass: 'active'
    };

})(jQuery, window, document);
