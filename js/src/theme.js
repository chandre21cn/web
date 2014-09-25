seajs.config({
    base:'/source/meet_app/js/',
    alias: {
        '$': 'jquery/jquery',                           //jquery 1.8.3版
        'placeholder':'lib/placeholder',                //IE6-IE8 支持placeholder属性
        'scroll':'lib/scroll',                          //滚动条
        'dialog':'lib/dialog',                          //弹出层
        'popup':'lib/popup',                            //层
        'template':'lib/template',                      //模板加载
        'selectbox':'lib/selectbox',                    //下拉选项
        'validate':'lib/jquery_validate',                      //表单验证
        'formchecked':'base/common/1/validate_methods',                      //表单验证
        'ajaxform':'lib/ajaxform',                        //表单提交
        'livequery':'lib/livequery',                        //表单提交
        'switchTab':'lib/switchTab'                    //tab切换
    },
    paths: {
        'jquery': 'sea-modules/jquery',
        'lib': 'sea-modules/lib',
    },
    preload:['$'],
    'map': [ //修改版本号
        [ /^(.*\.(?:css|js))(.*)$/i, '$1?20140925' ]
    ],
    charset: 'utf-8'
});

define('theme',['$','template'],function(require){
    var $ = require('$'),
        template = require('template');

    /*
    * 提示信息
    */
    var __alertTips = function(options) {
        var defaults = {
            'msg'       :  "操作成功！",
            'close'     : true
        };
        opt = $.extend(true, {}, defaults, options);

        require.async(['dialog'],function(dialog){
            var __alertMsg = dialog({       //弹出消息提示
                width: 200,
                cancel: false,
                content: '<div style="text-align:center">'+ opt.msg +'</div>'
            }).showModal()

            if (close) {
                setTimeout(function () {__alertMsg.remove();}, 2000);
            }
        });
    };

    /*
    *   登录与注册
    */
    var LoginDialog = null;
    var _UserDialog = function(title,width,html){
        require.async(['formchecked','ajaxform','dialog'],function(Validate,ajaxform,dialog){
            //弹出
            if (LoginDialog == null) {
                LoginDialog = dialog({
                    title: title,
                    width: width,
                    content: html,
                    cancel: function () {
                        LoginDialog = null;
                    },
                    cancelDisplay: false
                }).show()
            } else {
                LoginDialog.title(title);
                LoginDialog.width(width);
                LoginDialog.content(html);
                LoginDialog.reset()
            }
            //表单验证
            var a = new Validate.checked('#LoginFrom',{
                'debug': false,                 //进行调试模式（表单不提交）
                'wrapper' : 'div',               //用什么标签再把errorELement包起来
                'errorElement'  : 'label',       //用什么标签标记错误
                'errorClass'   : "err",         //指定错误提示的css类名
                'ignore': null,                   //对某些元素不进行验证
                'errorPlacement' : function (error, element) {    //更改错误信息显示的位置
                    element.parent().append(error)
                },
                'success': function (label) {},
                'submitHandler': function(form){       //提交事件
                    var btn = $(form).find('button');
                    btn.attr('disabled',true).addClass('disabled');
                    $(form).ajaxSubmit({
                        'dataType': 'json',
                        'timeout':   3000,
                        'error' : function(){
                            return __alertTips({'msg' : '提交出错！'})
                        },
                        'success': function(json) {
                            var n = Number(json.status);
                            switch(n){
                                case 1:
                                    __alertTips({'msg' : '操作成功！'})
                                    setTimeout('location.reload();',2000);
                                    break;
                                default:
                                    btn.attr('disabled',false).removeClass('disabled');
                                    return __alertTips({'msg' : json.message})
                            }
                        }
                    }).submit(function() {return false;});
                }
            });
        });
    };

    $(function(){
        $(document).one('focus','#verify_code',function(){  //显示验证码
            $("#captcha_content").show();
        });
        $(document).on('click','#captcha_content',function(){   //刷新验证码
            $(this)[0].src = verify + '&t='+ Math.random();
        });

        $(document).on('click','.UserLogin',function(){     //弹出登录
            _UserDialog('登录',500,template('UserLogin'))
        });

        $(document).on('click','.UserReg',function(){       //弹出注册
            _UserDialog('快速注册',500,template('UserReg'))
        });
    });

    /*
     *   是否登录
     */
    var _isLogin = function(){
        if ( islogin!=true ) {
            _UserDialog('登录',500,template('UserLogin'))
            return false;
        } else {
            return true;
        }
    };

    /*
     *  图文直播
     */

    $(function(){
        var page = 0;
        var GetLive = function(){       //获取直播内容
            $.ajax({
                type:"POST",
                dataType:"json",
                url:ajax_url.live,
                timeout:80000,     //ajax请求超时时间80秒
                data:{time:"80",'page':page}, //40秒后无论结果服务器都返回数据
                success:function(data,textStatus){
                    //从服务器得到数据，显示数据并继续查询
                    if(data.success=="1"){
                        var html = template('LiveList',data);
                        $(".Live_Text ul").prepend(html);
                        page = data.page;
                        GetLive();
                    }
                    //未从服务器得到数据，继续查询
                    if(data.success=="0"){
                        GetLive();
                    }
                },
                //Ajax请求超时，继续查询
                error:function(XMLHttpRequest,textStatus,errorThrown){
                    if(textStatus=="timeout"){
                        GetLive();
                    }
                }
            });
        };

        if ($(".Live_Text ul").length > 0) {
            GetLive(); //默认执行加载
            // 滚动条
            require.async('scroll',function(){
                $("[data-scroll='true']").mCustomScrollbar({
                    scrollInertia:0,
                    'scrollTo': 'top',
                    'scrollButtons': {
                        'enable': false
                    },
                    'advanced': {
                        'updateOnContentResize': true,
                        'autoScrollOnFocus':true
                    }
                });
            });
        }
    });

    /*
     *  评论
     */
    $(function(){

        //评论
        if ( $("[data-validata='true']").length > 0 ) {
            require.async(['livequery','formchecked','ajaxform'],function(livequery,Validate,ajaxform){
                var __formSubmit = function(obj){       //提交
                    if ( !_isLogin() ) { return false };
                    $(obj).ajaxSubmit({
                        'dataType': 'json',
                        'timeout':   3000,
                        'error' : function(){
                            return __alertTips({'msg' : '信息提交时出错！'})
                        },
                        'success': function(json) {
                            var n = Number(json.code);
                            switch(n){
                                case 1:
                                    json.data.uid= json.uid;
                                    var html = template('CommentList',json.data);
                                    $('#comment-list').prepend(html);
                                    $(obj).find('textarea').val('');    //清除内容
                                    return __alertTips({'msg' : json.msg})
                                    break;
                                default:
                                    return __alertTips({'msg' : json.msg})
                            }
                        }
                    }).submit(function() {return false;});
                }
                $('[data-validata="true"]').livequery(function(){
                    new Validate.checked($(this),{
                        'debug': false,                 //进行调试模式（表单不提交）
                        'wrapper' : 'div',               //用什么标签再把errorELement包起来
                        'errorElement'  : 'label',       //用什么标签标记错误
                        'errorClass'   : "err",         //指定错误提示的css类名
                        'ignore': null,                   //对某些元素不进行验证
                        'errorPlacement' : function (error, element) {    //更改错误信息显示的位置
                            var thatErr = element.parent().parent().find('.error');
                            thatErr.html(error) ;
                        },
                        'success': function (label) {},
                        'submitHandler': function(form){       //提交事件
                            __formSubmit(form);
                        },
                        'rules': {
                            'comment' : {
                                required: true,
                                minlength: 5
                            }
                        },
                        'messages': {
                            'comment' : {
                                required: '请输入您的内容',
                                minlength: '文字不能少于{0}个'
                            }
                        }
                    })
                });
            })
        }
        $(document).on('click','.btn-reply',function(){    //显示回复框
            if ( !_isLogin() ) { return false };
            var id = $(this).data('id'),
                that = $('#comment_list_'+ id),
                data = {'belongs': id,'meetid':meetid},
                html = template('ReplyWrite',data);
            if ( $("#WriteReply").length == 0  ) {
                that.append(html);
            } else {
                $('#WriteReply').remove();
                that.append(html);
            }
        });
        $(document).on('click','.btn-remove',function(){    //删除评论
            var id = $(this).data('id');
            $.ajax({
                'type':         "POST",
                'dataType':     "json",
                'url':          ajax_url.RemoveComment,
                'data':         {'id':id},
                'success':      function(data){
                    if(data.success=="1"){
                        $('#comment_list_'+ id).fadeOut();
                        return __alertTips({'msg' : data.msg})
                    } else {
                        return __alertTips({'msg' : '操作失败！'})
                    }
                },
                'error':        function(){
                    return __alertTips({'msg' : '操作失败！'})
                }
            });
        });

        var pages = 1, limt = 20;
        $(document).on('click','#getcomment',function(){    //加载更多评论
            var $this=$(this);
            $.ajax({
                type:       "POST",
                dataType:   "json",
                url:        ajax_url.GetComment,
                data:       {'limt':limt,'page':pages,'meetid':meetid},
                success:    function(json) {
                    if ( json.code == "1" ) {
                        var data = json.data;
                        if ( data == '' ) {
                            $this.remove();
                            return __alertTips({'msg' : '没有更多内容了！'}),false;
                        }
                        for (var i = data.length - 1; i >= 0; i--) {
                            data[i].uid= json.uid;
                            var html = template('CommentList', data[i] );
                            $('#comment-list').append(html);
                        }
                        pages++;
                    } else {
                        return __alertTips({'msg' : '评论加载失败！'});
                    }
                },
                error : function(){
                    return __alertTips({'msg' : '评论加载失败！'})
                }
            });
        });
    });

    /*
     *      下拉select
     */

    $(function(){
        if ( $('select').length > 0 ) {
            require.async(['selectbox'],function(selectbox){
                new selectbox($('select'))
            })
        }
    })

    /*
     * 报名提交
     */
    $(function(){
        if ($("#Apply_From").length > 0) {
            require.async(['formchecked','ajaxform'],function(Validate,ajaxform){
                new Validate.checked('#Apply_From',{
                    ignore:null,
                    wrapper : 'div',
                    errorElement:'label',
                    errorClass: 'err',
                    errorPlacement: function(error, element) {
                        if ( element.is(":radio") ) {
                            element.parent().parent().append(error)
                        } else if ( element.is(":checkbox")){
                            element.parent().parent().append(error)
                        } else if ( element.is("textarea")) {
                            element.parent().parent().append(error)
                        } else {
                            element.parent().append(error)
                        };
                    },
                    success : function(label){
                    }
                });
            })
        }
    })

    /*
     * 导航高亮
     */

    $(function(){
        var a = window.location.href.split('/')[5];
        a == undefined ? a = 'index.php' : a = a;
        var href = a.substr(0, 4)
        if (href.length > 0) {
            $("#Nav a[href*='" + href + "']:eq(0)").attr("class", "on");
            if ($("#Nav a[href*='" + href + "']").size() == 0) {
                $("#Nav a[href*='index']").attr("class", "on");
            }
        } else {
            $("#Nav a[href*='index']").attr("class", "on");
        }
    })
})

seajs.use('theme');