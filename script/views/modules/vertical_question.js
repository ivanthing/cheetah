// Filename: views/modules/vertical_question
//@off
define([
  'jquery',
  'underscore',
  'backbone',
  'mustache',
  'help/text!tpl/mustache/common/vertical_question.tpl',
  'models/modules/vertical_question',
  'models/modules/option_box',
  'views/modules/option_box',
  'collections/modules/option_box'],
//@on
function($, _, Backbone, $$, vq_tpl, model, opx_model, opx_view, opxes) {
    var Vertical_Question_View = Backbone.View.extend({
        template : vq_tpl,
        opx_con : "#ets-act-mc-form-options",
        initialize : function() {
            this.model.bind('change:current', this.render, this);
            this.model.bind('destroy', this.remove, this);

            opxes.bind('add', this.addOne, this);
        },
        events : {
        },
        addOne : function(opx) {
            var view = new opx_view({
                model : opx
            }),data = this.model.toJSON(), _curr = data['current'];;
            this.$el.find(this.opx_con).append(view.render().el);
        },
        render : function(current) {
            //clear current options box view
            this.clearOpts();
            //get data from model
            var data = this.model.toJSON();
            current = parseInt(current) || data.current;
            //fix error data
            if(current > data.total) {
                current = data.total;
            }
            else
            if(current < 1) {
                current = 1;
            }
            //update attributes
            this.model.attributes.current = data.current = current;
            //get current question data
            _.extend(data, data.Questions[current - 1]);
            //load vertical question and option box container view
            var compiledTemplate = $$.render(this.template, data);
            $(this.el).html(compiledTemplate);
            //load option box
            var sel=data.selection[current - 1];
            console.log(data.selection);
            _.each(data.Questions[current - 1].Options, function(opt,index) {
                opxes.add(new opx_model({
                    content : opt.Txt,
                    type : data.boxType,
                    checked:sel&&~sel.indexOf(index)?true:false
                }));
            });
            return this;
        },
        clearOpts : function() {
            this.$el.find("li").remove();
        },
        remove : function() {
            this.$el.remove();
        },
        setSelection : function() {
            var sels = [], data = this.model.toJSON(), _curr = data['current'];
            this.$el.find("input").each(function(index, item) {
                if($(this)[0].checked) {
                    sels.push(index);
                }
            });
            this.model.attributes.selection[_curr - 1] = sels;
        }
    });
    return Vertical_Question_View;
});
