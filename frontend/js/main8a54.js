/*
 * CS Hero
 *
 */
function sameHeight() {
    jQuery('.sameheight').each(function() {
        jQuery(this).load(function(){
            var biggestHeight = 0;
            var _this = jQuery(this);
            jQuery('article', _this).each(function() {
                if (jQuery(this).outerHeight() > biggestHeight) {
                    biggestHeight = jQuery(this).height();
                }
            })
            jQuery('article', _this).height(biggestHeight); 
        })
    })
}
(function ($) { "use strict";
function fullWidth() {
    var windowWidth = jQuery(window).width();
    jQuery('.stripe').each(function() {
        var $bgobj = jQuery(this);
        var width = $bgobj.width();
        var v = (windowWidth - width) / 2;
        $bgobj.css({
            marginLeft: -v,
            paddingLeft: v,
            paddingRight: v
        });
    })
}
function boxed() {
    var windowWidth = jQuery(window).width();
    jQuery('.stripe').each(function() {
        jQuery(this).css({
            marginLeft: 0,
            paddingLeft: 0,
            paddingRight: 0
        });
    })
}
jQuery(document).ready(function($) {
    /*Search form*/
    $('.searchform').click(function(){
        if($('#s').hasClass('active')){
            $('#s').removeClass('active');
        }else{
            $('#s').addClass('active');
        }
    });
    $('#s').click(function(e){
        e.stopPropagation();
    });
    /*Search form*/
    /* Show Tooltip */
    jQuery('[data-toggle="tooltip"]').tooltip();
    jQuery('[rel="tooltip"]').tooltip();
    /* Fix Column Height */
    jQuery('.feature-box').each(function() {
        var subs = $(this).find('> .column_container');
        if (subs.length < 2)
            return;
        var maxHeight = Math.max.apply(null, $(this).find("> .column_container").map(function() {
            return $(this).height();
        }).get());
        $(this).find("> .column_container").height(maxHeight - 3);
    });
    // Same Height
    jQuery('.wpb_row').each(function() {
        if (jQuery(this).hasClass('ww-same-height')) {
            var height = jQuery(this).height();
            jQuery(this).children(":first").children().each(function() {
                jQuery(this).css('min-height', height);
            });
        }

    });
});
!(function(j) {
    function menubar(elem) {
        this.thisEl = j(elem);
        this.init();
    }

    menubar.prototype = {
        init: function() {
            var menubar = this,
                logoImg = menubar.thisEl.find('.menubar-brand > img'),
                btn_menubar = j('.btn-menubar'),
                menu_list = menubar.thisEl.find('.menu-list');
            menubar.info = {
                toggleClass: menubar.thisEl.data('scroll-toggle-class').split(' '),
                classFixedTop: 'menubar-fixed-top',
                top: menubar.thisEl.offset().top,
                height: menubar.thisEl.innerHeight(),
                windowW: j(window).width()
            }
            if (j.inArray(menubar.info.classFixedTop, menubar.info.toggleClass) != -1) {
                menubar.contentEl = j('<div>').addClass('content-menu-bar');
                menubar.thisEl.before(this.contentEl);
            }

            j(window).resize(function() {
                // update width browser
                menubar.thisEl.find('ul').css('left', '');
                menubar.info.windowW = j(window).width();                
                if(menu_list.hasClass('active')) return;
                //btn_menubar.css({height: menubar.thisEl.height() - 10, opacity: 1});
            }).trigger('resize');

            menubar.thisEl.find('.menu-list ul ul,.menu-list-right ul ul').each(function() {
                var thisEl = j(this);
                if (thisEl.parent().hasClass('menu-item-has-children')||thisEl.parent().hasClass('page_item_has_children')) {
                    thisEl.addClass('child');
                    menubar.thisEl.find('.menu-list > ul > li,.menu-list-right > ul > li').children('ul').removeClass('child');
                }
            })

            // call handle hover
            menubar.handleHover();

            // call handle mobi
            menubar.handleMobi();

            if (menubar.info.toggleClass.length <= 0)
                return;
            // call handle scroll
            menubar.handleScroll();
        },
        handleScroll: function() {
            var menubar = this,
                    elTop = (menubar.thisEl.hasClass(menubar.info.classFixedTop) || menubar.info.top == 0) ? 1 : menubar.info.top,
                    scrollTop = 0,
                    state = true;
            j(window).scroll(function() {
                scrollTop = j(this).scrollTop();
                if (scrollTop >= elTop) {
                    if (state == true) {
                        j.each(menubar.info.toggleClass, function($k, $v) {
                            (menubar.thisEl.hasClass($v)) ? menubar.thisEl.removeClass($v) : menubar.thisEl.addClass($v);
                        })
                    }
                    if (menubar.contentEl)
                        menubar.contentEl.css({'height': menubar.thisEl.css('height')});
                    state = false;
                } else {
                    if (state == false) {
                        j.each(menubar.info.toggleClass, function($k, $v) {
                            (menubar.thisEl.hasClass($v)) ? menubar.thisEl.removeClass($v) : menubar.thisEl.addClass($v);
                        })
                    }
                    if (menubar.contentEl)
                        menubar.contentEl.css({'height': 0});
                    state = true;
                }

            }).trigger('scroll')
        },
        handleHover: function() {
            var menubar = this;
            menubar.thisEl.find('li.menu-item-has-children,li.page_item_has_children').on({
                mouseover: function() {
                    var thisEl = j(this),
                    childUl = thisEl.children('ul'),
                    params = {
                        left: childUl.offset().left,
                        width: childUl.innerWidth()
                    }
                    if ((params.left + params.width) > menubar.info.windowW && (childUl.hasClass('child')||childUl.hasClass('children'))) {			
                        childUl.css({left: (params.width) * -1,right: 'auto'});
                    }else if((params.left + params.width) > menubar.info.windowW ){
                        
                        childUl.css({right: 0,left: 'auto'});
                    }
                }
            })
        },
        handleMobi: function() {
            var menubar = this,
                    btn_menubar = j('.btn-menubar'),
                    menu_list = menubar.thisEl.find('.menu-list');

            menubar.thisEl.find('li.menu-item-has-children,li.page_item_has_children').each(function() {
                var btnMobiSub = j('<button>').addClass('btn-mobi-sub');
                j(this).append(btnMobiSub);
                btnMobiSub.bind('click', function() {
                    j(this).toggleClass('active');
                    j(this).parent().children('ul').toggleClass('active');
                    j(this).parent().toggleClass('active-sub');
                })
            })

            btn_menubar.click(function() {
                if (!menu_list.hasClass('menu-list-mobi'))
                    menu_list.addClass('menu-list-mobi')

                menu_list.toggleClass('active');
            })

        }
    }

    // Document ready
    j(function() {
        var menubarEl = j('.menubar');
        menubarEl.each(function() {
            new menubar(this);
        })
    })
})(jQuery)
})(jQuery);


