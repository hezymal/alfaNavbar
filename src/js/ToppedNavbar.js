/* globals $ */

const BaseNavbar = require('./BaseNavbar'); 



module.exports = class ToppedNavbar extends BaseNavbar {


    constructor(element, options) {

        super(element, options);

        this.lastScrolled   = 0;
        this.lastTop        = 0;
        this.minTop         = 0;
        this.height         = 0;

        this.$wrapper       = this.$element
            .wrap('<div></div>')
            .parent()
            .css({
                position    : this.$element.css('position'),
                width       : this.$element.css('width'),
            });

    }


    reset() {
        
        this.minTop  = this.$wrapper.offset().top;
        this.height  = this.$element.outerHeight();

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

            this.$wrapper.css('padding-bottom', this.height);
            this.$element.css({ 'top': top, 'position': 'fixed' });

        } else {

            this.$wrapper.css('padding-bottom', 0);
            this.$element.css('position', 'static');
            
        }

        this.lastTop = top;
        this.lastScrolled = Math.max(scroll, this.minTop);

    }


};