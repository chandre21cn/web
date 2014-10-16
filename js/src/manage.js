/**
 * Created by Chandre on 14-9-26.
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Common = require('./common');			//通用模块
    var selectbox = require('selectbox');			//网页对话框组件
    var ajaxform = require('ajaxform');
    var Validate = require('./validate_methods');
    require('datetimepicker');
    require('livequery');
    require('history');
    require('cityselect');
    /*
     *	取得URL地址后的参数
     */
    function GetRequest(data) {
        var theRequest = new Object();
        if (data.indexOf("#") != -1) {
            str = data.substring(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        } else {
            theRequest = {'t':'baseinfo','p':'info','id':mid };
        }
        var url = URL.path + '/'+  theRequest.t +'/'+ theRequest.p +'/'+ theRequest.id;
        var opt = {'url':url,'type':theRequest.t,'oldhash':data,'templateID':theRequest.t+'_'+theRequest.p}
        return opt;
    }
    var URLRouter = GetRequest(location.hash);    //获取当前URL参数赋值

    $(function(){

        /*
         *	框架大小设置
         */

        $(window).resize(function(){
            Common.__windowSize();
        })


        /*
         *	导航条收起与展开
         */

        $(document).on('click','#NavMenu .NavItem .title',function(e){
            e.preventDefault;
            var $this = $(this);
            var $that = $this.parent();
            $that.siblings().find('.list').slideUp('fast',function(){
                $that.find('.list').slideDown('fast');
            });

        })

        /*
         *	页面后退
         */
        $(window).hashchange( function(){
            var hash = location.hash;
            var opt = GetRequest(hash);
            Common.__GetTemplate(opt);		//默认刷新加载
        });

        /*
         *	页面加载
         */
        Common.__GetTemplate(URLRouter);		//默认刷新加载

        /*
         *   信息提示
         */

        //会议提交审核
        $(document).on('click','#SubmitMeet',function(){
            var url = URL.path +'/baseinfo/change_power';
            var submitmeet = function(){
                $.ajax({
                    'url': url,
                    'type': 'POST',
                    'dataType': 'json',
                    'data': {'meetid': mid,'index':3},
                    'beforeSend': function() {
                        return Common.alertTips({'msg' : '会议提交中......'})
                    },
                    'error' : function(){
                        return Common.alertTips({'msg' : '操作出错啦！'})
                    },
                    'success': function(json) {
                        var n = Number(json.code);
                        switch(n){
                            case 1:
                                return Common.alertTips({'msg' : '提交成功，请待审核！'});
                                break;
                            default:
                                return Common.alertTips({'msg' : json.msg})
                        };
                    }
                })
            }
            require.async(['dialog'],function(dialog){
                dialogTip = dialog({
                    title: '提示',
                    content: '活动的基本信息都填写完整？<br />注意：您填写的基本信息完整性有促于我们对您的会议进行审核。',
                    okValue: '确定',
                    width: 450,
                    ok: function () {
                        submitmeet();
                    },
                    cancelValue: '取消',
                    cancel: function () {}
                }).showModal();
            });
            return false;
        })

        /*
         *	图片上传
         */
        $(document).on('click','[data-uploads="banner"]',function(){
            var that = $(this);
            Common.__UpFiles({
                trigger 	: 	that,
                title		: 	"上传图片",
                types 		:   "image",
                fileTypeExts 	: 	'*.jpg;*.gif;*.png;*.jpge',
                fileSizeLimit	: 	'1MB',
                multi		:   false,
                uploadLimit :   1
            })
        });

        /*
        * 图片切图
        * */
        $(document).on('click','[data-uploads="pics"]',function(){
            var $this = $(this);
            var size = $this.data('type');
            Common.CropPhoto({
                size: UpPics_size[size],
                fileSize: "1024KB",
                success: function(url){
                    $this.parent().find('input').val(url);
                }
            })
        });

        /*
         * 文件上传
         */
        $(document).on('click','[data-uploads="file"]',function(){
            var that = $(this);
            Common.__UpFiles({
                trigger 	: 	that,
                title		: 	"上传附件",
                types 		:   "file",
                fileTypeExts 	: 	'*.doc;*.docx;*.pdf;*.ppt;*.pptx;*.xls;*.xlsx;*.zip;*.rar',
                fileSizeLimit	: 	'20MB',
                multi		:   false,
                uploadLimit :   1
            })
        })

        /*
         *	表单验证  与 提交
         */
        // 表单提交
        var validator = null;
        var __formSubmit = function(obj){
            $(obj).ajaxSubmit({
                'dataType': 'json',
                'timeout':   3000,
                'error' : function(){
                    return Common.alertTips({'msg' : '信息提交时出错！'})
                },
                'success': function(json) {
                    var n = Number(json.code);
                    switch(n){
                        case 1: 			//无刷新
                            return Common.alertTips({'msg' : json.msg})
                            break;
                        case 2: 			//后退
                            history.go(-1);
                            return Common.alertTips({'msg' : json.msg})
                            break;
                        case 3: 			//刷新当前页
                            Common.alertTips({'msg' : json.msg})
                            setTimeout(function () {location.reload();}, 2000);
                            break;
                        case 4: 			//成功后不刷新 且添空表单
                            $('.redactor_editor').html(''); 	//编辑器数据重置
                            //validator.resetForm();		//重置表单
                            return Common.alertTips({'msg' : json.msg})
                            break;
                        default:
                            return Common.alertTips({'msg' : json.msg})
                    }
                }
            }).submit(function() {return false;});
        };

        $(document).on('click',"[data-validata='true'] [type=submit]",function(e){
            var thatform = $(this).parent().parent();
            new Validate.checked(thatform,{
                'errorElement'  : 'div',
                'errorClass'   : "error",
                'ignore': null,
                'errorPlacement' : function (error, element) {
                    var thatErr = element.parent().parent().find('.form-explain');
                    thatErr.html(error) ;
                },
                'success': function (label) {},
                'submitHandler': function(form){
                    __formSubmit(form)
                }
            });
        });


        /*
         *	下拉选项样式
         */
        $('select').livequery(function(){
            var val = $(this).data('val');
            if (val!=='' && val !== undefined) {
                $(this).find('option[value='+val +']').attr("selected",true);
                selectbox($(this));
            } else {
                selectbox($(this));
            }
        })

        /*
         *	地区联动选择
         */

        $('#city').livequery(function(){
            var p = $(this).data('prov');
            var c = $(this).data('city');
            if (p!='') {
                $(this).citySelect({
                    'prov':p,
                    'city':c
                });
            } else {
                $(this).citySelect({nodata:"none",required:false});
            }
        })

        // 添加导航选择
        $('#SelectNav').livequery(function(){
            var that = $(this);
            selectbox(that,{
                getData: function(data) {
                    if (that.val() == '7' ) {
                        $('#OutUrl').show();
                    } else {
                        $("#NavName").val(data.text);
                        $('#OutUrl').hide();
                    }
                }
            });
        })
        /*
         *	日历
         */
        $('[data-provide=datetimepicker]').livequery(function(){
            $('[data-provide=datetimepicker]').datetimepicker({
                lang:'ch',
                format:'Y-m-d H:i:00',
                step:5
            });
        });

        $('[data-provide=yearTotime]').livequery(function(){
            $(this).datetimepicker({
                lang:'ch',
                format:'Y-m-d H:i:00',
                step:5
            });
        });
        // 年月日选择
        $('[data-provide=year]').livequery(function(){
            $(this).datetimepicker({
                lang:'ch',
                format:'Y-m-d',
                timepicker:false
            });
        });
        // 日期选择
        $('[data-provide=date]').livequery(function(){
            $(this).datetimepicker({
                lang:'ch',
                format:'m月d日',
                timepicker:false
            });
        });
        //时间选择
        $('[data-provide=time]').livequery(function(){
            $(this).datetimepicker({
                lang:'ch',
                datepicker:false,
                format:'H:i',
                step:5
            });
        });

        // Tabs选项
        $('[data-tabs="true"]').livequery(function(){
            var that=$(this);
            require.async('switchTab',function(){
                that.switchTab({
                    effect: "fade",
                    titCell: ".ContTitle a",
                    trigger: "click",
                    mainCell: ".ContList"
                });
            });
        });


        /*
         *	编辑器
         */
        $('[data-editor="true"]').livequery(function(){
            var that = $(this);
            if(!-[1,]) {
                // IE9以下
                require.async('editor8_2',function(){
                    that.redactor({
                        buttons: ['bold', 'italic','orderedlist','image', 'video', 'table', 'link', 'alignment'],
                        imageUpload: URL.UpPics,
                        fileUpload: URL.UpPics,
                        minHeight: 200
                    });
                })
            }  else {
                require.async('editor',function(){
                    that.redactor({
                        lang: 'zh_cn',
                        buttons: ['bold', 'italic', 'orderedlist','image', 'video','table', 'link', 'alignment'],
                        plugins: ['fontsize','fontcolor','fullscreen'],
                        imageUpload: URL.UpPics,
                        fileUpload: URL.UpPics,
                        minHeight: 200
                    });
                })
            }
        });
        // 最简编辑器
        $('[data-editor="mini"]').livequery(function(){
            var that = $(this);
            if(!-[1,]) {
                // IE9以下
                require.async('editor8_2',function(){
                    that.redactor({
                        air: true,
                        buttons: ['bold', 'italic','unorderedlist', 'orderedlist'],
                        minHeight: 200
                    });
                })

            }  else {
                require.async('editor',function(){
                    that.redactor({
                        air: true,
                        lang: 'zh_cn',
                        deniedTags: ['p','div','html', 'head', 'link', 'body', 'meta', 'script', 'style', 'applet'],
                        minHeight: 200
                    });
                })
            }
        });


        // 弹出 详细查看
        $(document).on('click','.dialog_view',function(){
            var data =$.parseJSON($('textarea',this).val());
            var type = $(this).data('type') + '_view';
            Common.__Dialog({
                'tplID' : type,
                'data'	: data
            });
        })


        //弹出上的 编辑
        $(document).on('click','.dialog_edit',function(){
            var id = $(this).data('id');
            var type = $(this).data("type");
            var url = "/" + type + '/edit'+ "/" + mid;
            var tpl_id = type +'_edit';
            Common.__Edit({
                'trigger' : '#DialogLayout',
                'url'	  : url,
                'tpl_id'  : tpl_id,
                'infoid'  : id
            })

        })
        //弹出上的 添加
        $(document).on('click','.dialog_add',function(){
            var data = { 'meetid':mid } ;
            var type = $(this).data("type");
            var tplID = type +'_add';
            Common.__Dialog({
                'tplID' : tplID,
                'data' : data
            })

        })

        //删除
        $(document).on('click','.info_del',function(){
            var id = $(this).data('id'),
                type = $(this).data('type'),
                types = $(this).data('types'),
                url = URL.path +'/'+ type +'/'+ 'del',
                ListID = '#'+ type + "_list_" + id;
            // 提交删除
            if (types==undefined || types == '') { types = ''}
            var info_del = function(opt){
                $.ajax({
                    'url': opt.url,
                    'type': 'POST',
                    'dataType': 'json',
                    'data': {'meetid': mid,'id':opt.id,'type':types},
                    'beforeSend': function() {
                        return Common.alertTips({'msg' : '信息删除中......'})
                    },
                    'error' : function(){
                        return Common.alertTips({'msg' : '信息删除时出错！'})
                    },
                    'success': function(json) {
                        var n = Number(json.code);
                        switch(n){
                            case 1:
                                Common.__CloseDialog();		//关闭右侧弹出层
                                $(ListID).remove();			//删除列表中的数据
                                return Common.alertTips({'msg' : json.msg})
                                break;
                            case 2:
                                $(ListID).remove();			//删除列表中的数据
                                return Common.alertTips({'msg' : json.msg})
                                break;
                            default:
                                return Common.alertTips({'msg' : json.msg})
                        }
                    }
                })
            }
            require.async(['dialog'],function(dialog){
                dialogTip = dialog({
                    title: '提示',
                    content: '此信息一但删除，将不可恢复！',
                    okValue: '确定',
                    width: 300,
                    ok: function () {
                        info_del({
                            'url':url,
                            'meetid':mid,
                            'id': id
                        })
                    },
                    cancelValue: '取消',
                    cancel: function () {}
                }).showModal();
            });
            return false;
        })

        // 更新权重
        $(document).on('click','.weight',function(e){
            e.stopPropagation();
        })
        $(document).on("change",'.weight',function(){
            var index = $(this).val(),
                type = $(this).data('type'),
                types = $(this).data('types'),
                id = $(this).data('id');
            var url = URL.path + '/' + type + '/' +'change_sort';
            if (types==undefined || types == '') { types = ''}
            $.ajax({
                'url': url,
                'type': 'POST',
                'dataType': 'json',
                'data': {'meetid': mid,'id':id,'index': index,'type': types},
                'error' : function(){
                    return Common.alertTips({'msg' : '出错啦！'})
                },
                'success': function(json) {
                    var n = Number(json.code);
                    switch(n){
                        case 1:
                            return Common.alertTips({'msg' : json.msg})
                            break;
                        default:
                            return Common.alertTips({'msg' : json.msg})
                    }
                }
            })
        });

        // 嘉宾选择
        $(document).on('click','.selectUser li',function(){
            var val = $('input',this).val();
            if (val!=''){
                $(this).removeClass('on');
                $('input',this).val('');
            } else {
                var id = $(this).data('id');
                $('input',this).val(id);
                $(this).addClass('on');
            }

        })
        // 已选择嘉宾
        $('.selectUser li input').livequery(function(){
            var val = $(this).val();
            if (val!=''){
                $(this).parent().addClass('on');
            };
        });


        // 弹出日程详细查看
        $(document).on('click','.info_edit',function(){
            var data =$.parseJSON($(this).parents().find('textarea').val());
            var tplID = $(this).data("type") + '_edit';
            Common.__Dialog({
                'title' : "编辑",
                'tplID' : tplID,
                'data'	: data,
            });
        })


        // 数据分页
        $(document).on('click','#Pages a',function(){
            var that = $(this).parent().parent(),
                page = $(this).data('page'),
                type = $(this).parent().data('type'),

                tpl = $(this).parent().data('tpl');
            Common.__GetPages({
                page 		:  page,
                url 		:  URL.path + '/'+ tpl +'/all/'+ mid,
                id 			:  mid,
                change      :  that,
                type        :  type,
                templateID 	:  tpl + '_list'
            })
        })

        // 颜色选择器
        $("[data-color='true']").livequery(function(){
            var that = $(this);
            require.async('minicolors',function(){
                that.minicolors({
                    control: $(this).attr('data-control') || 'hue',
                    defaultValue: $(this).attr('data-defaultValue') || '',
                    inline: $(this).attr('data-inline') === 'true',
                    letterCase: $(this).attr('data-letterCase') || 'lowercase',
                    opacity: $(this).attr('data-opacity'),
                    position: $(this).attr('data-position') || 'bottom right',
                    change: function(hex, opacity) {
                        if( !hex ) return;
                        if( opacity ) hex += ', ' + opacity;
                        try {
                        } catch(e) {}
                    },
                    theme: 'bootstrap'
                });
            })
        })
        $('#Tpl_Val').livequery(function(){
            var that = $(this);
            var v = that.val();
            $('[data-tplid='+ v +']').find('span').show();
        })
        $(document).on('click',".SelectTpl li",function(){
            var that = $(this),
                tplid=that.data('tplid');
            //UpPics_size = Size_images.tpl_ + tplid;         //设置模板图片大小
            that.find('span').show();
            that.siblings().find('span').hide();
            $('#Tpl_Val').val(tplid);

        })
        // 预览模板
        $(document).on('click','#Theme_View',function(e){
            var that = $(this).parent().parent();
            var vali = that.valid()
            if (vali){
                var v = that.serialize();
                window.open(URL.path + '/theme/preview?'+ v ,'_blank')
            } else {
                return Common.alertTips({'msg' : '您的设置有误，请检查！'})
            }
        })

        // 报名表设置
        var field = {
            // '字段' : ['标题','类型0，1，2，3，4','默认值','是否必填1，0','验证规则']
            'truename': ['姓名',0,'',1,'text'],
            'engname': ['英文名',0,'',1,'text'],
            'nick': ['昵称',0,'',1,'text'],
            'email': ['E-mail',0,'',1,'email'],
            'tel': ['电话',0,'',1,'tel'],
            'phone': ['手机',0,'',1,'mobile'],
            'sex1': ['性别',3,'男|女|保密',0,'text'],
            'birthday': ['生日',0,'',0,'date'],
            'cnumbers': ['企业规模',1,'100人以下|100人-500人|500人-1000人|1000人-5000人|5000以上',0,'text'],
            'company_income': ['企业年营业额',1,'500万以下|500万-1千万|1千万-5千万|5千万-1亿|1亿-10亿|10亿-100亿|100亿以上',0,'text'],
            'ins_type': ['机构类别',3,'政府机构事业单位|国有企业|集体企业|民营企业|外商独资企业|合资企业|其他',0,'text'],
            'company': ['单位名称',0,'',1,'text'],
            'father': ['行业',0,'',1,'text'],
            'dept_tpye': ['部门',0,'',1,'text'],
            'position_type': ['职位类别',3,'决策层|管理层|专家学者|秘书/职员|工程师|学生|其他',1,'text'],
            'prov': ['省份',3,'北京|天津|河北|山西|内蒙古|辽宁|吉林|黑龙江|上海|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|重庆|四川|贵州|云南|西藏|陕西|甘肃|青海|宁夏|新疆|台湾|香港|澳门',1,'text'],
            'address': ['详细地址',0,'',0,'text'],
            'qq': ['QQ',0,'',0,'text'],
            'post': ['邮编',0,'',0,'text'],
            'intro': ['个人简介',4,'',0,'text']
        }
        $('#SelectField').livequery(function(){
            selectbox($('#SelectField'),{
                getData: function(data) {
                    var val = data.val;
                    var $title = $('#field-title');
                    var $val = $('#field-val');
                    var $type = $('#field-type');
                    var $rule = $('#field-rule');
                    var $required = $('#field-required');
                    if (val=='' || val==null || val==0 || val==undefined ) {
                        $title.val('');
                        $val.val('').attr("readonly",false);
                        $type.find('option[value="0"]').attr("selected",true);
                        $required.find('option[value="1"]').attr("selected",true);
                        $rule.find('option[value="text"]').attr("selected",true);
                    } else {
                        $title.val(field[val][0]);
                        $val.val(field[val][2])
                        field[val][2]!='' ? $val.attr("readonly",true) : $val.attr("readonly",false);
                        $type.find('option[value='+ field[val][1] +']').attr("selected",true);
                        $required.find('option[value='+ field[val][3] +']').attr("selected",true);
                        $rule.find('option[value='+ field[val][4] +']').attr("selected",true);
                    }
                    selectbox($type);
                    selectbox($required);
                    selectbox($rule);

                }
            });
            var val = $(this).data('val');
            if (val=='sex1' || val=='cnumbers' || val=='company_income' || val=='ins_type' || val=='position_type' || val=='prov'  ) {
                $('#field-val').attr("readonly",true);
            }
        })


        // 参会人员审核
        $('#ChangePower').livequery(function(){
            var that = $(this);
            selectbox($('#ChangePower'),{
                getData: function(data) {
                    var val = data.value;
                    var id = that.data('id');
                    var meetid = that.data('meetid');
                    var type = that.data('type');
                    var url = URL.path + '/' + type + '/' +'change_power';
                    $.ajax({
                        'url': url,
                        'type': 'POST',
                        'dataType': 'json',
                        'data': {'meetid': meetid,'id':id,'status': val},
                        'error' : function(){
                            return Common.alertTips({'msg' : '出错啦！'})
                        },
                        'success': function(json) {
                            var n = Number(json.code);
                            switch(n){
                                case 1:
                                    Common.alertTips({'msg' : json.msg})
                                    setTimeout(function () {location.reload();}, 2000);
                                    break;
                                default:
                                    return Common.alertTips({'msg' : json.msg})
                            }
                        }
                    })
                }
            });
        })

    })

});