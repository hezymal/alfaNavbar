/* globals $ */

const BaseNavbar = require('./BaseNavbar'); 



module.exports = class ToppedNavbar extends BaseNavbar {


    constructor(element, options) {

        super(element, options);

        this.lastScrolled   = 0;
        this.lastTop        = 0;
        this.minTop         = 0;
        this.height         = 0;
        this.$content       = this.$element.children().first();

    }


    reset() {
        
        this.minTop  = this.$element.offset().top;
        this.height  = this.$content.outerHeight();

        super.reset();

    }


    render() {

        super.render();

        const scroll = this.scroll();
        let top = 0;
        
        if ( scroll > this.minTop ) {
            
            top = this.lastTop + ( this.lastScrolled - scroll ) * this.options.factor;
            top = (top < -this.height)  ? -this.height  : top;
            top = (top > 0)             ? 0             : top;

            this.$element.addClass( this.options.fixedClass );
            this.$content.css('top', top);

        } else {

            this.$element.removeClass( this.options.fixedClass );
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


};