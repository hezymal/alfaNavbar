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

        var scroll = this.scroll();
        var middle = this.screenHeight / 2 - this.height / 2;

        if (scroll + middle > this.minTop) {
           
            if (scroll + middle > this.maxTop) {

                this.$element
                    .removeClass('fixed')
                    .css('top', this.maxTop);

            } else {

                this.$element
                    .addClass('fixed')
                    .css('top', middle);

            }

        } else {

            this.$element
                .removeClass('fixed')
                .css('top', this.minTop);

        }

    }


};