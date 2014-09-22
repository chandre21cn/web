/**
 * Created by chandre on 14-9-20.
 */
define("base/common/1/base-debug", [ "sea-modules/jquery/jquery-debug" ], function(require) {
    var $ = require("sea-modules/jquery/jquery-debug");
    //表单验证
    require.async([ "validate-debug", "./validate_methods-debug" ], function() {
        var validator = $("#form1").validate({
            submitHandler: function(form) {
                alert("submitted");
                form.submit();
            }
        });
    });
});
