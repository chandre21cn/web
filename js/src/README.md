validate_methods 使用
================================================================================================
依赖 jquery validate插件

添加验证规则
==============

方法：
new Validate.AddMethod('规则名称'，function(value, element){
   执行代码
},'提示信息’);


表单验证
==============

方法：
new Validate.checked('选择器',{
   wrapper      :  '用什么标签再把errorELement包起来，默认null',
   MsgElements  : '用什么标签标记错误，默认的是label',
   ErrorClass   : '指定错误提示的css类名，默认的是err',
   SuccessClass : '指定正确提示的css类名，默认的是success',
   SuccessText  : '指定正确提示的文字，默认为空',
   submit       : function(form){ 提交事件 }
})




