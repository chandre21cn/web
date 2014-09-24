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
    'debug': false,                 //进行调试模式（表单不提交）
    'wrapper' : null,               //用什么标签再把errorELement包起来
    'errorElement'  : 'label',       //用什么标签标记错误
    'errorClass'   : "err",         //指定错误提示的css类名
    'ignore': null,                   //对某些元素不进行验证
    'errorPlacement' : function (error, element) {    //更改错误信息显示的位置
       element.parent().append(error)
    },
    'success': function (label) {
       label.addClass("ok").text("ok!")
    },
    'submitHandler': function(form){       //提交事件
       form.submit()
    },
    'rules' : {},
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

### data方法验证
```text
data-rule-required="true"                  是否必填
data-msg-required="请输入6-20位密码"         必填提示信息
data-rule-pass="true"                      pass验证规则
data-msg-pass="请输入6-20位密码"             pass验证规则提示信息
```

### 验证规则
```text
mobile_email        账号                    手机或email
username            账号                    6~12个字符，包括字母、数字、下划线，以字母开头，字母或数字结尾
nickname            昵称                    只能输入中文、字母、数字或下划线
pass                密码                    只能输入6-20个字母、数字、特殊字符
repassword          确认密码
datetime            日期时间                 如:2014-01-01 00:00:00
date                日期                    如:2014-01-01
phone               电话与手机号              如：010-80101011/13801010101
mobile              手机号                   如：13801010101
tel                 固定电话                 包括验证国内区号,国际区号,分机号如：+86-010-11111111-010
qq                  QQ号码
email               E-mail地址
zipcode             邮政编码
url                 URL地址
```


