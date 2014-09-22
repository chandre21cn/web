/**
 * Created by chandre on 14-9-23.
 */
define("base/common/1/validate_methods-debug", [ "sea-modules/jquery/jquery-debug" ], function(require, exports, module) {
    var $ = require("sea-modules/jquery/jquery-debug"), Exp = {
        email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        //邮件
        zipcode: /^[1-9][0-9]{5}$/,
        //邮编
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/
    };
    require.async([ "$-debug", "validate-debug" ], function($, validate) {
        $.validator.setDefaults({
            submitHandler: function() {},
            errorElement: "label",
            errorClass: "err",
            errorPlacement: function(error, element, messages) {
                var thatErr = element.parent();
                thatErr.append(error);
            },
            success: function(label) {
                label.addClass("success").text("OK!");
            }
        });
        //邮件验证
        $.validator.addMethod("email", function(value, element, params) {
            return this.optional(element) || Exp.email.test(value);
        }, "请输入正确的E-mail地址");
        //邮编
        $.validator.addMethod("zipcode", function(value, element, params) {
            return this.optional(element) || Exp.zipcode.test(value);
        }, "请输入正确的邮编号码");
        //邮编
        $.validator.addMethod("url", function(value, element, params) {
            return this.optional(element) || Exp.url.test(value);
        }, "请输入正确URL地址，如：http://www.google.com");
    });
});
