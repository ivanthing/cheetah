// Filename: models/modules/option_box
define(['underscore', 'backbone'], function(_, Backbone) {
    var option_box = Backbone.Model.extend({
        defaults : {
            content : "",
            type : "checkbox",            
            _name:_.uuid('optbx_')
        },
        initialize : function(option) {
          var attr=this.attributes;
            _.deepExtend(attr,option);
            if(!~attr.type.indexOf('radio')){
              attr._name=_.uuid('optbx_');
            }
            attr._id=_.uuid('optbx');
        },
        validate : function(attrs) {
            if(!attrs.type) {
                return "You must supply a attribute 'type'";
            }
        }
    });
    return option_box;
});
