/**
 * Created by chandre on 14-9-20.
 */
define(function (require) {
    var $ = require('$');
    //表单验证
    require.async(['./validate_methods'], function(Validate) {

        //日期时间
        var a = new Validate.checked('#form1',{
           'ErrorClass'   : "err",
           'SuccessClass' : "success",
           'wrapper': "div",
           'SuccessText': "OK!",
           'submit' : function(form){
               console.log(form)
               alert('1'); return false;
           }
        });
       var b = new Validate.checked('#form2',{
           'MsgElements' : 'span',
           'ErrorClass'   : "err",
           'SuccessClass' : "success",
           'SuccessText': "你真棒！"
       });
    });
});
