define("base/common/1/validate_methods",["sea-modules/jquery/jquery","sea-modules/lib/jquery_validate"],function(a,b,c){var d=a("sea-modules/jquery/jquery"),e=(a("sea-modules/lib/jquery_validate"),{email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,password:/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,20}$/,username:/^[a-zA-Z]\w{5,11}$/,nickname:/^[\w\u4e00-\u9fa5]+$/,datetime:/^(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})$/,tel:/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,mobile:/^0?(13|15|18|17|14)[0-9]{9}$/,qq:/^[1-9][0-9]{4,}$/,date:/^(\d{4})-(\d{2})-(\d{2})$/,zip:/^[1-9][0-9]{5}$/,url:/^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,idcard:/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,color:/^#[a-fA-F0-9]{6}$/,image:/^.*[^a][^b][^c]\.(?:png|jpg|bmp|gif|jpeg)$/,file:/^.*[^a][^b][^c]\.(?:doc|docx|pdf|pptx|ppt|xls|xlsx|zip|rar)$/});d.extend(d.validator.messages,{required:"必选字段",remote:"请修正该字段",email:"请输入正确格式的电子邮件",url:"请输入合法的网址",date:"请输入合法的日期",dateISO:"请输入合法的日期 (ISO).",number:"请输入合法的数字",digits:"只能输入整数",creditcard:"请输入合法的信用卡号",equalTo:"请再次输入相同的值",accept:"请输入拥有合法后缀名的字符串",maxlength:d.validator.format("请输入一个 长度最多是 {0} 的字符串"),minlength:d.validator.format("请输入一个 长度最少是 {0} 的字符串"),rangelength:d.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),range:d.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),max:d.validator.format("请输入一个最大为{0} 的值"),min:d.validator.format("请输入一个最小为{0} 的值")}),d.validator.addMethod("mobile_email",function(a,b){return this.optional(b)||e.mobile.test(a)||e.email.test(a)},"账号必须为手机号或邮箱地址"),d.validator.addMethod("username",function(a,b){return this.optional(b)||e.username.test(a)},"6~12个字符，包括字母、数字、下划线，以字母开头，字母或数字结尾"),d.validator.addMethod("nickname",function(a,b){return this.optional(b)||e.nickname.test(a)},"只能输入中文、字母、数字或下划线"),d.validator.addMethod("pass",function(a,b){return this.optional(b)||e.password.test(a)},"只能输入6-20个字母、数字、特殊字符"),d.validator.addMethod("repassword",function(a,b){var c=d("#password").val();return this.optional(b)||a==c},"两次输入的密码不一致"),d.validator.addMethod("datetime",function(a,b){return this.optional(b)||e.datetime.test(a)},"请正确填写您的日期(如:2014-01-01 00:00:00)"),d.validator.addMethod("date",function(a,b){return this.optional(b)||e.date.test(a)},"请正确填写您的日期(如:2014-01-01)"),d.validator.addMethod("dateContrast",function(a){var b=d("#starttime").val();return new Date(Date.parse(b.replace(/-/g,"/")))<=new Date(Date.parse(a.replace(/-/g,"/")))},"结束日期必须大于开始日期"),d.validator.addMethod("datefromto",function(a){var b=d("#fromdate").val();return new Date(Date.parse(a.replace(/-/g,"/")))>new Date(Date.parse(b.replace(/-/g,"/")))},"结束日期必须大于或等于开始日期"),d.validator.addMethod("phone",function(a,b){return this.optional(b)||e.tel.test(a)||e.mobile.test(a)},"请正确填写手机、固定电话号码(如：010-80101011/13801010101)"),d.validator.addMethod("tel",function(a,b){return this.optional(b)||e.tel.test(a)},"请正确填写固定电话号码(如：010-80101011)"),d.validator.addMethod("mobile",function(a,b){return this.optional(b)||e.mobile.test(a)},"请正确填写手机号码(如：13801010101)"),d.validator.addMethod("qq",function(a,b){return this.optional(b)||e.qq.test(a)},"请正确填写您的QQ号码"),d.validator.addMethod("email",function(a,b){return this.optional(b)||e.email.test(a)},"请输入正确的E-mail地址"),d.validator.addMethod("zip",function(a,b){return this.optional(b)||e.zip.test(a)},"请输入正确的邮编号码"),d.validator.addMethod("url",function(a,b){return this.optional(b)||e.url.test(a)},"请输入正确URL地址，如：http://www.google.com"),d.validator.addMethod("idcard",function(a,b){return this.optional(b)||idcard.test(a)},"请输入正确的15、18位身份证号码"),d.validator.addMethod("color",function(a,b){return this.optional(b)||e.color.test(a)},"颜色值填写错误"),d.validator.addMethod("image",function(a,b){return this.optional(b)||e.image.test(a)},"请上传png，jpg，bmp，gif，jpeg格式图片"),d.validator.addMethod("file",function(a,b){return this.optional(b)||e.file.test(a)},"请上传doc,ppt,xls,pdf,zip,rar格式文件");var f={debug:!1,wrapper:null,errorElement:"label",errorClass:"err",ignore:null,errorPlacement:function(a,b){b.parent().append(a)},success:function(a){a.addClass("ok").text("ok!")},submitHandler:function(a){a.submit()},rules:{},messages:{}},g={AddMethod:function(a,b,c){return d.validator.addMethod(a,b,c)},checked:function(a,b){a=this.select=d(a),b=d.extend({},f,b),a.validate(b)}};c.exports=g});
