/*
		 *	表单验证
		 */
define("lib/validate_checked",["jquery/jquery",'lib/validate'],function(require) {
    var $ = jQuery = require('jquery/jquery');
    var validate = require('lib/validate');
    // 自定义验证规则
    	var passowrd = /^.*[A-Za-z0-9\\w_-]+.*$/;  			//密码
    	var zip = /^[0-9]{6}$/;								//邮编
    	var date = /^(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})$/;										//日期支持 00-00-00 00:00:00 | 0000-00-00 00:00:00 | 09-05-22 08:16:00 | 1970-00-00 00:00:00 | 20090522081600
		var tel = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;			//固定电话
		var mobile =/^0?(13|15|18|17|14)[0-9]{9}$/;									//手机号
		var qq = /^[1-9][0-9]{4,}$/;												//QQ
		var email = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;				//Email
		var dateYMD =  /^(\d{4})-(\d{2})-(\d{2})$/;    //日期 YYYY-MM-DD
		var enname = /^[A-Za-z][A-Za-z\s]*[A-Za-z]$/ ;  //英文姓名


		//登录账号
		$.validator.addMethod("username", function(value, element) {   
		    return this.optional(element) || ( (mobile.test(value)) || (email.test(value)) );
		}, "账号必须为手机号或邮箱地址");

    	// 密码
	    $.validator.addMethod("passowrd", function(value, element) {   
		    return this.optional(element) || (passowrd.test(value));
		}, "只能输入6-20个字母、数字、特殊字符");

    	// 邮政编码
	    $.validator.addMethod("isZipCode", function(value, element) {   
		    return this.optional(element) || (zip.test(value));
		}, "请正确填写您的邮政编码");

		// 日期时间验证 支持 00-00-00 00:00:00 | 0000-00-00 00:00:00 | 09-05-22 08:16:00 | 1970-00-00 00:00:00 | 20090522081600
	    $.validator.addMethod("datetime", function(value, element) {   
		    return this.optional(element) || (date.test(value));
		}, "请正确填写您的日期(如:2014-01-01 00:00)");

		$.validator.addMethod("dateYMD", function(value, element) {   
		    return this.optional(element) || (dateYMD.test(value));
		}, "请正确填写您的日期(如:2014-01-01)");

		// 日期时间对比验证
		$.validator.addMethod("dateContrast", function(value, element, param) {
		    var startDate = $('#starttime').val(); 
			return new Date(Date.parse(startDate.replace("-", "/"))) <= new Date(Date.parse(value.replace("-", "/")));
		},"结束日期必须大于开始日期");

		// 中文字两个字节
		$.validator.addMethod("byteRangeLength", function(value, element, param) {
		    var length = value.length;
		    for(var i = 0; i < value.length; i++){
		        if(value.charCodeAt(i) > 127){
		            length++;
		        }
		    }
		  return this.optional(element) || ( length >= param[0] && length <= param[1] );   
		}, $.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)"));

		// 电话号码与手机
		$.validator.addMethod("phone", function(value, element, param) {
		    return this.optional(element) || ( (tel.test(value)) || (mobile.test(value)) );
		},"请正确填写手机、固定电话号码(如：010-80101011/13801010101)");

		// 电话号码 (包括验证国内区号,国际区号,分机号如：+86-010-11111111-010)
		$.validator.addMethod("tel", function(value, element, param) {
		    return this.optional(element) || (tel.test(value));
		},"请正确填写固定电话号码(如：010-80101011)");

		// 手机 支持最新的18、17开头号码
		$.validator.addMethod("mobile", function(value, element, param) {
		    return this.optional(element) || (mobile.test(value));
		},"请正确填写手机号码(如：13801010101)");

		// QQ号码
		$.validator.addMethod("qq", function(value, element, param) {
		    return this.optional(element) || (qq.test(value));
		},"请正确填写您的QQ号码");

		// email
		$.validator.addMethod("email", function(value, element, param) {
		    return this.optional(element) || (email.test(value));
		},"请下确填写您的Email地址");





 
    // 规则
		$.validator.setDefaults({
			submitHandler: function() {
			},
			errorElement:'div',
			errorPlacement: function(error, element,messages) {
				var thatErr = element.parent().parent().find('.form-explain')
				thatErr.html(error) 
			},
		    rules: {
		    	username: {
					required: true,				//账号
					username:true
				},
		    	password: {
					required: true,				//密码
					rangelength: [6,20]
				},
				confirm_password: {
					required: true,				//确认密码与原密码相同
					equalTo:'#password'
				},
				

				// 以下是用户评论
				body: {
					required:true			//评论
				},



				// 以下是订单信息
				country: {
					required:true			//选择你的国籍
				},
				title: {
					required:true			//请选择你的称呼
				},
				firstname: {
					required:true			//填写你的姓
				},
				lastname: {
					required:true			//填写你的名
				},
				firstnamep: {
					required:true			//填写你的姓的拼音，与护照上的一致
				},
				lastnamep: {
					required:true			//请填写你的名的拼音，与护照上的一致
				},
				birthtype:	{
					required:true,			//请选择或填写你的出生日期（例如 1992-01-01）
					dateYMD : true
				},
				qq: {						//qq号码
					qq:true
				},

				address_country: {
					required:true			//国家
				},
				address_prov: {
					required:true			//省/直辖市:
				},
				address_city: {
					required:true			//城市/区县:
				},
				address: {
					required:true			//地址:
				},
				zipcode: {							//邮政编码
					digits:true
				},
				email: {						//邮箱
					required: true,
					email: true
				},
				mobile: {						//手机
					required: true,
					digits:true
				},

				useruni: {							
					required: true				//填写即将就读大学名称
				},
				usermajor: {							
					required: true				//填写即将学习的专业
				},
				lastuni : {
					required: true				//填写最近毕业学校名称
				}





			},
		    messages: {
		    	username: {
					required: "账号必须为手机号或邮箱地址"
				},
		    	password: {
					required: "请设置您的密码",
					rangelength: "密码长度必须在6-20位之间"
				},
				confirm_password: {
					required: "请再次输入您的密码",
					equalTo: "两次输入密码不一致"
				},
				

				//评论
				body: {
					required: 	'请输入您的评论内容'
				},

				// 订单信息
				country: {
					required: '选择你的国籍'
				},
				title: {
					required: '请选择你的称呼'
				},
				firstname: {
					required: '填写你的姓'
				},
				lastname: {
					required: '填写你的名'
				},
				firstnamep: {
					required: '填写你的姓的拼音，与护照上的一致'
				},
				lastnamep: {
					required: '请填写你的名的拼音，与护照上的一致'
				},
				birthtype:	{
					required: '请选择或填写你的出生日期（例如 1992-01-01）',
					dateYMD : '出生日期格式不正确（例如 1992-01-01）'
				},
				qq: {	
					qq: 		'qq号码不正确'
				},
				address_country: {
					required:	'请选择国家'
				},
				address_prov: {
					required:	'请填写省/直辖市'
				},
				address_city: {
					required:	'请填写城市/区县'
				},
				address: {
					required: 	'请填写详细地址'
				},
				zipcode: {		
					digits: '邮政编码不正确'
				},
				email: {		
					required: '请填写您的E-mail地址',
					email: 'E-mail格式不正确'
				},
				mobile: {	
					required: 		'请填写您的手机号码',
					digits:       '手机号不正确'
				},
				useruni: {							
					required: '填写即将就读大学名称'
				},
				usermajor: {							
					required: '填写即将学习的专业'
				},
				lastuni : {
					required: '填写最近毕业学校名称'
				}
			}
		});
});