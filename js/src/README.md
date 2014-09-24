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
   'SuccessClass' : "success",     //指定正确提示的css类名
   'SuccessText' : '',             //指定正确提示的文字
   'submit': function(form){       //提交事件
       form.submit()
   },
   'rules' : {},
   'messages': {}
})
```



