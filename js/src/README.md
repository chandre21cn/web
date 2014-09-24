validate_methods 使用
================================================================================================
依赖 jquery validate插件

### 添加验证规则

方法：
```js
var email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;     //email正则

new Validate.AddMethod(
    'email',                       //规则名
    function(value, element){
        return this.optional(element) || (email.test(value));        // 验证代码
    },
   '请输入正确的E-mail地址’         //错误提示信息
);
```

### 表单验证

方法：
```js
new Validate.checked('选择器',{
   'wrapper' : null,               //用什么标签再把errorELement包起来
   'MsgElements'  : 'label',       //用什么标签标记错误
   'ErrorClass'   : "err",         //指定错误提示的css类名
   'MsgPlacement' : function (error, element) {     //更改错误信息显示的位置
       var that = element.parent();
       that.append(error);
   },
   'SuccessClass' : "success",     //指定正确提示的css类名
   'SuccessText' : '',             //指定正确提示的文字
   'submit': function(form){       //提交事件
       form.submit()
   },
   'rules' : {
         username: "required",
         email: {
             required: true,    //是否必填
             email: true        //验证规则
         },
   },
   'messages': {}
})
```

### 默认校验规则
```text
(1)required:true                必输字段
(2)remote:"check.php"           使用ajax方法调用check.php验证输入值
(3)email:true                   必须输入正确格式的电子邮件
(4)url:true                     必须输入正确格式的网址
(5)date:true                    必须输入正确格式的日期 日期校验ie6出错，慎用
(6)dateISO:true                 必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
(7)number:true                  必须输入合法的数字(负数，小数)
(8)digits:true                  必须输入整数
(9)creditcard:                  必须输入合法的信用卡号
(10)equalTo:"#field"             输入值必须和#field相同
(11)accept:                     输入拥有合法后缀名的字符串（上传文件的后缀）
(12)maxlength:5                 输入长度最多是5的字符串(汉字算一个字符)
(13)minlength:10                输入长度最小是10的字符串(汉字算一个字符)
(14)rangelength:[5,10]          输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
(15)range:[5,10]                输入值必须介于 5 和 10 之间
(16)max:5                       输入值不能大于5
(17)min:10                      输入值不能小于10
```


