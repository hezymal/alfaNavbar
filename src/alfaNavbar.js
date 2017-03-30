/*eslint-env browser*/

(function($, window, document) {
    "use strict";


    $.fn.alfaNavbar = function(options) {

        
        // check arguments

        options     = $.extend({}, $.fn.alfaNavbar.defaults, options);


        // private fields
        
        var $window = $(window);
        var $document = $(document);
        var $htmlbody = $('html, body');
        var $that   = this;
        var $links  = $that.find('a');
        
        // private functions

        function getAnchorTop($anchor, forScroll) {
            var threshold = options.threshold;

            forScroll = forScroll || 0;

            if (threshold === 'center') {
                threshold = (forScroll * $anchor.height() - $window.height()) / 2;
            }

            return $anchor.offset().top + threshold;
        }

        function getActiveLink(scrolled) {
            var link = null;

            if ($links.length)
            {
                link = $links[0];

                for (var i = 1; i < $links.length; i++) {
                    var $anchor = $($links[i].hash);

                    if ($anchor.length) {
                        if (scrolled >= getAnchorTop($anchor)) {
                            link = $links[i];
                        }
                    }
                }
            }

            return link;
        }

        function setActiveLink() {
            var scrolled = $that.getScrolled();
            var activeLink = getActiveLink(scrolled);

            if (activeLink) {
                $links.removeClass(options.activeClass);
                $(activeLink).addClass(options.activeClass);
            }
        }

        function onScrollWindow() {
            $that.trigger($.Event("fixed"));
        }

        function onResizeWindow() {
            $that.trigger($.Event("reset"));
            $that.trigger($.Event("fixed"));
        }

        function onLinkClick(event) {
            var $anchor = $(event.currentTarget.hash);

            if ($anchor.length) {
                event.preventDefault();

                $that.scrollTo($anchor);
            }
        }


        // global functions

        $that.scrollTo = function($anchor) {
            var top = getAnchorTop($anchor, true);

            $htmlbody.stop().animate(
                { scrollTop: top },
                { duration: options.speed }
            );
        };

        $that.getScrolled = function() {
            return $document.scrollTop();
        };

        $that.reload = function() {
            $that.trigger($.Event("reset"));
            $that.trigger($.Event("fixed"));
        };


        // subscribe

        $window.on('resize', onResizeWindow);
        $window.on('scroll', onScrollWindow);
        $links.on('click', onLinkClick);
        $that.on('fixed', setActiveLink);


        // return result

        return $that;
    };


    $.fn.alfaNavbar.defaults = {
        speed: 1000,
        activeClass: 'active',
        threshold: 0,
    };


    $.fn.alfaDotNavbar = function(options) {

        // check arguments

        options = $.extend({}, $.fn.alfaNavbar.defaults, options);


        // private fields

        var $window = $(window);
        var $navbar = $(this).alfaNavbar(options);
        var $parent = $navbar.parent();
        var screenHeight;
        var height;
        var minTop;
        var maxTop;


        // subscribe

        $navbar.on('reset', function() {
            screenHeight    = $window.height();
            height          = $navbar.outerHeight();
            minTop          = $parent.offset().top;
            maxTop          = minTop + $parent.outerHeight() - height;
        });

        $navbar.on('fixed', function() {
            var css = {};
            var scrolled = $navbar.getScrolled();
            var middle = screenHeight / 2 - height / 2;

            if (scrolled + middle > minTop) {
                if (scrolled + middle > maxTop) {
                    css.position = 'absolute';
                    css.top = maxTop;
                } else {
                    css.position = 'fixed';
                    css.top = middle;
                }
            } else {
                css.position = 'absolute';
                css.top = minTop;
            }

            $navbar.css(css);
        });


        // run

        $navbar.reload();


        // return result

        return $navbar;
    };


    $.fn.alfaTopNavbar = function(options) {

        // check arguments

        options = $.extend({}, $.fn.alfaNavbar.defaults, $.fn.alfaTopNavbar.defaults, options);


        // private fields
        var lastScrolled    = 0;
        var lastTop         = 0;
        var minTop;
        var height;

        var $navbar         = $(this).alfaNavbar(options);
        var $wrapper        = $navbar.wrap('<div></div>').parent();
        $wrapper.css('position', $navbar.css('position'));


        // subscribe

        $navbar.on('reset', function() {
            minTop  = $wrapper.offset().top;
            height  = $navbar.outerHeight();
        });

        $navbar.on('fixed', function() {
            var top = 0;
            var scrolled = $navbar.getScrolled();
            
            if (scrolled <= minTop) {

                $wrapper.css('padding-bottom', 0);
                $navbar.css('position', 'static');

            } else {
                
                top = lastTop + (lastScrolled - scrolled) * options.factor;
                top = (top < -height)   ? -height   : top;
                top = (top > 0)         ? 0         : top;

                $wrapper.css('padding-bottom', height);
                $navbar.css({ 'top': top, 'position': 'fixed' });
            }

            lastTop = top;
            lastScrolled = Math.max(scrolled, minTop);
        });


        // run

        $navbar.reload();


        // return result

        return $navbar;
    };

    $.fn.alfaTopNavbar.defaults = {
        factor: 1,
    };

})(window.jQuery, window, document);