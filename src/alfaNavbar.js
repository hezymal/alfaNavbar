/* globals $ */

const ToppedNavbar = require('./ToppedNavbar'); 
const DottedNavbar = require('./DottedNavbar'); 



$.fn.alfaNavbar = function(options) {
    
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
    factor: 1,

};