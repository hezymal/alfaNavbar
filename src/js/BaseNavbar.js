/* globals $ */



module.exports = class BaseNavbar {


    constructor(element, options) {

        this.options    = options;
        this.$element   = $(element);
        this.$links     = this.$element.find('a');

        if (!element.alfaNavbar) {

            setTimeout(this.init.bind(this), 0);

            element.alfaNavbar = this;

        }

    }


    init() {

        $(window)
            .on('resize', this.onWindowResize.bind(this))
            .on('scroll', this.onWindowScroll.bind(this));

        this.$links
            .on('click', this.onLinkClick.bind(this));

        this.reset();
        this.render();

    }


    reset() {

        this.render();

    }


    render() {

        this.renderActiveLink();

    }


    renderActiveLink() {
        
        if ( this.$links.length < 1 ) {

            return;

        }

        const scroll = this.scroll();
        let link = this.$links[0];

        for ( var i = 1, length = this.$links.length; i < length; i++ ) {

            const selector = this.$links[i].hash;

            if ( $(selector).length ) {

                if ( scroll >= this.getAnchorScroll(selector) ) {

                    link = this.$links[i];

                }

            }

        }

        // add `.active` class on link and remove others
        this.$links.removeClass( this.options.activeClass );
        $( link ).addClass( this.options.activeClass );

    }


    scroll( selector ) {

        if ( selector ) {

            $('html, body')
                .stop()
                .animate(
                    { scrollTop: this.getAnchorScroll(selector, true) },
                    { duration: this.options.speed }
                );

        } else {

            return $(document).scrollTop();

        }

    }


    getAnchorScroll(selector, forScroll) {
        
        const $anchor = $(selector);
        let threshold = this.options.threshold;

        if (threshold === 'center') {

            forScroll = (forScroll) ? 1 : 0;
            threshold = (forScroll * $anchor.height() - $(window).height()) / 2;

        }

        return $anchor.offset().top + threshold;

    }


    onWindowResize() {

        this.reset();
        this.render();

    }


    onWindowScroll() {

        this.render();

    }


    onLinkClick(event) {

        const selector = event.currentTarget.hash;

        if ( $( selector ).length ) {

            event.preventDefault();

            this.scroll( selector );
        }

    }


};