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
        
        if (scroll > this.minTop) {
            
            top = this.lastTop + (this.lastScrolled - scroll) * this.options.factor;
            top = (top < -this.height)  ? -this.height  : top;
            top = (top > 0)             ? 0             : top;

            this.$element.addClass('fixed');
            this.$content.css('top', top);

        } else {

            this.$element.removeClass('fixed');
            this.$content.css('top', 0);
            
        }

        this.lastTop = top;
        this.lastScrolled = Math.max(scroll, this.minTop);

    }


};