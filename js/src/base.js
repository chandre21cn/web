/**
 * Created by chandre on 14-9-20.
 */
define(function (require) {
    var $ = require('$');
    //表单验证
    require.async(['validate','./validate_methods'], function() {
        var validator = $("#form1").validate({
            submitHandler:function(form){
                alert("submitted");
                form.submit();
            }
        });

    });
});
