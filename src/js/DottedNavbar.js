/* globals $ */

const BaseNavbar = require('./BaseNavbar'); 



module.exports = class DottedNavbar extends BaseNavbar {


    constructor(element, options) {

        super(element, options);

        this.$parent = this.$element.parent();
        this.screenHeight = 0;
        this.height = 0;
        this.minTop = 0;
        this.maxTop = 0;

    }


    reset() {
        
        this.screenHeight    = $(window).height();
        this.height          = this.$element.outerHeight();
        this.minTop          = this.$parent.offset().top;
        this.maxTop          = this.minTop + this.$parent.outerHeight() - this.height;

        super.reset();

    }


    render() {

        super.render();

        var css = {};
        var scroll = this.scroll();
        var middle = this.screenHeight / 2 - this.height / 2;

        if (scroll + middle > this.minTop) {
           
            if (scroll + middle > this.maxTop) {

                css.position = 'absolute';
                css.top = this.maxTop;

            } else {

                css.position = 'fixed';
                css.top = middle;

            }

        } else {

            css.position = 'absolute';
            css.top = this.minTop;

        }

        this.$element.css(css);

    }


};