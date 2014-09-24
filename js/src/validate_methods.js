/**
 * Created by chandre on 14-9-24.
 * 依赖 jquery validate插件
 */
define(function(require, exports, module) {
    var $ = require('$'),
        validate = require('validate'),
        Exp = {
            email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,     //邮件
            zipcode:  /^[1-9][0-9]{5}$/,         //邮编
            url : /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,       //url
            passowrd : /^.*[A-Za-z0-9\\w_-]+.*$/,  			//密码
            datetime : /^(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})$/,
            //日期支持 00-00-00 00:00:00 | 0000-00-00 00:00:00 | 09-05-22 08:16:00 | 1970-00-00 00:00:00 | 20090522081600
            tel : /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,			//固定电话
            mobile : /^0?(13|15|18|17|14)[0-9]{9}$/,									//手机号
            qq : /^[1-9][0-9]{4,}$/,												//QQ
            date :  /^(\d{4})-(\d{2})-(\d{2})$/    //日期 YYYY-MM-DD
        };

    //登录账号 邮箱与手机号
    $.validator.addMethod("mobile_email", function(value, element) {
        return this.optional(element) || ( (Exp.mobile.test(value)) || (Exp.email.test(value)) );
    }, "账号必须为手机号或邮箱地址");
    // 密码
    $.validator.addMethod("passowrd", function(value, element) {
        return this.optional(element) || (Exp.passowrd.test(value));
    }, "只能输入6-20个字母、数字、特殊字符");

    // 确认密码
    //$.validator.addMethod("confirmpassword", function(value, element) {
    //    var val = $('#Password').val();
    //    return this.optional(element) || (value == val);
    //}, "两次输入的密码不一致");

    //日期时间
    $.validator.addMethod("datetime", function(value, element) {
        return this.optional(element) || (Exp.datetime.test(value));
    }, "请正确填写您的日期(如:2014-01-01 00:00:00)");
    //日期
    $.validator.addMethod("date", function(value, element) {
        return this.optional(element) || (Exp.date.test(value));
    }, "请正确填写您的日期(如:2014-01-01)");
    // 电话号码与手机
    $.validator.addMethod("phone", function(value, element) {
        return this.optional(element) || ( (Exp.tel.test(value)) || (Exp.mobile.test(value)) );
    },"请正确填写手机、固定电话号码(如：010-80101011/13801010101)");
    // 电话号码 (包括验证国内区号,国际区号,分机号如：+86-010-11111111-010)
    $.validator.addMethod("tel", function(value, element) {
        return this.optional(element) || (Exp.tel.test(value));
    },"请正确填写固定电话号码(如：010-80101011)");
    // 手机 支持最新的18、17开头号码
    $.validator.addMethod("mobile", function(value, element) {
        return this.optional(element) || (Exp.mobile.test(value));
    },"请正确填写手机号码(如：13801010101)");
    // QQ号码
    $.validator.addMethod("qq", function(value, element) {
        return this.optional(element) || (Exp.qq.test(value));
    },"请正确填写您的QQ号码");
    //邮箱
    $.validator.addMethod("email", function(value, element) {
        return this.optional(element) || (Exp.email.test(value));
    }, '请输入正确的E-mail地址');
    //邮编
    $.validator.addMethod("zipcode", function(value, element) {
        return this.optional(element) || (Exp.zipcode.test(value));
    }, '请输入正确的邮编号码');
    //邮编
    $.validator.addMethod("url", function(value, element) {
        return this.optional(element) || (Exp.url.test(value));
    }, '请输入正确URL地址，如：http://www.google.com');

    var defaults = {
        'wrapper' : null,               //用什么标签再把errorELement包起来
        'MsgElements'  : 'label',       //用什么标签标记错误
        'ErrorClass'   : "err",         //指定错误提示的css类名
        'MsgPlacement' : function (error, element) {    //更改错误信息显示的位置
            var that = element.parent();
            that.append(error);
        },
        'SuccessClass' : "success",     //指定正确提示的css类名
        'SuccessText' : '',             //指定正确提示的文字
        'submit': function(form){       //提交事件
            form.submit()
        },
        'rules' : null,
        'messages': null
    };


    var Validate = {
        /**
         *   添加验证规则
         *   方法：
         *   new Validate.AddMethod('规则名称'，function(value, element){
         *      执行代码
         *   },'提示信息’);
         */

        AddMethod : function (name,method,message) {
            return $.validator.addMethod(name,method,message);
        },

        /**
         *   表单验证
         *   方法
         *   new Validate.checked('选择器',{
         *      wrapper      :  '用什么标签再把errorELement包起来，默认null',
         *      MsgElements  : '用什么标签标记错误，默认的是label',
         *      ErrorClass   : '指定错误提示的css类名，默认的是err',
         *      MsgPlacement : function (error, element) {
         *          var that = element.parent();
         *          that.append(error);
         *      },
         *      SuccessClass : '指定正确提示的css类名，默认的是success',
         *      SuccessText  : '指定正确提示的文字，默认为空',
         *      submit       : function(form){ 提交事件 }
         *   })
         */
        checked : function (select,options) {
            select = this.select = $(select);
            options = $.extend({}, defaults, options);
            select.validate({
                'submitHandler': options.submit,
                'errorElement': options.MsgElements,
                'errorClass': options.ErrorClass,
                'wrapper': options.wrapper,
                'errorPlacement': function (error, element) {
                    var that = element.parent();
                    that.append(error);
                },
                'success': function (label, element) {
                    label.addClass(options.SuccessClass).text(options.SuccessText);
                },
                'rules' : options.rules,
                'messages' : options.messages
            });
        }
    }

    module.exports = Validate;
});