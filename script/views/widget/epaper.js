/*
 * this epaper widget is depand on jquery plugin lionbars.
 */
//@off
define(['require',
'jquery', 
'underscore', 
'backbone', 
'engine', 
'help/text!tpl/jtemplate/common/ets_epaper.tpl',
'models/widget/epaper', 
'lionbars'],
//@on
function(require, $, _, Backbone, $$, epaper_tpl, model) {
    "use strict"

    var Epaper_View = Backbone.View.extend({
        id:'ets-epaper',
        template : epaper_tpl,

        initialize : function() {
            _.initView('epaper', this);
            this.defaultsSetting = model.toJSON();
        },
        events : {
            'click .ets-epaper-btn-expand' : 'expandEpaper',
            'click .ets-epaper-btn-collapse' : 'collapseEaper'
        },

        /*
         * options inputs
         *  @width: number,
         *  @hasOverlay: boolean
         *  @expandable: boolean
         *  @epaper_content: string, (HTML accept)
         */
        render : function(opt) {
            _.extend(this.defaultsSetting, opt);

            var $root = this.$el;
            
            $root.wrap('<div id="ets-epaper-outer"><div id="ets-epaper-inner"></div></div>');
            this.$box = $root.parents('#ets-epaper-outer');
            if(!this.defaultsSetting.container){
                this.setTemplate();  
            }
            
            return this;
        },
        
        setTemplate : function() {
            var compiledTemplate = $$.render(this.template, this.defaultsSetting),
            $root = this.$el;

            $root.html(compiledTemplate).width(this.defaultsSetting.width);

            this.$("#ets-epaper-main-hd, #ets-epaper-main-ft").width(this.defaultsSetting.width - 10);

            if(this.defaultsSetting.expandable) {
                $root.css("left", - this.defaultsSetting.width);
                this.$("#ets-epaper-main").width(this.defaultsSetting.width);

                // generate overlay
                if(this.defaultsSetting.hasOverlay) {
                    this.setOverlay();
                    this.outerWidth = '100%';
                } else {
                    this.outerWidth = this.defaultsSetting.width + 36;
                }
            } else {
                this.$box.width(this.defaultsSetting.width).css('overflow', 'visible');
                
            }
            
            // $(this.defaultsSetting.container).css('float', 'left');

            // whether neeed audio player bar or not
            if(this.defaultsSetting.mediaPlayer.show) {
                this.$("#ets-epaper-main").height(this.$("#ets-epaper-main").height()-73);
                this.insertMediaPlayer();
            }

            //call jquery plugin lionbars
            $("#ets-epaper-main").lionbars({
                'autohide': true
            });

            this.clickOutOfEpaperInner();
		},

        // insert media player
        insertMediaPlayer: function() {
            var that = this;
            require(['views/widget/media_player'], function(MP) {
                $(that.el).prepend(MP.render({
                    src: that.defaultsSetting.mediaPlayer.src,
                    hasBar: true
                }));
            });
        },

        setOverlay : function() {
            this.$box.prepend("<div id='ets-act-overlay'>");
        },

        expandEpaper: function(e) {
            this.$box.width(this.outerWidth);
            $(this.el).animate({left: 0}, 400, function() {
                $(e.target).removeClass().addClass('ets-epaper-btn-collapse');
            });
            $('#ets-act-overlay').animate({opacity:0.5},400);
        },
        collapseEaper : function(e) {
            $(this.el).animate({
                left : -this.defaultsSetting.width
            }, 400, function() {
                $(e.target).removeClass().addClass('ets-epaper-btn-expand');
                $('#ets-epaper-outer').width('36px');
            });
            $('#ets-act-overlay').animate({opacity:0},400);
        },

        clickOutOfEpaperInner: function() {
            $('body').bind('click', function(e) {
                if($(e.target).closest('#ets-epaper-inner').length === 0) {
                    $('.ets-epaper-btn-collapse').trigger('click');
                }
            });
        }
    });

    return {
        render : function(opt, callback) {
            var epaper_view = new Epaper_View();
            epaper_view.render(opt);
            if(_.isFunction(callback)) {
                callback.apply(epaper_view);
            }
        }
    };
});
