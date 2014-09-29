/**
 * Created by Chandre on 14-9-28.
 */
seajs.config({
    base:'/source/meet_app/js/',
    alias: {
        '$': 'sea-modules/jquery/jquery',                           //jquery 1.8.3版
        'placeholder':'sea-modules/lib/placeholder',                //IE6-IE8 支持placeholder属性
        'dialog':'sea-modules/lib/dialog',                          //弹出层
        'popup':'sea-modules/lib/popup',                            //层
        'template':'sea-modules/lib/template',                      //模板加载
        "cityselect":"sea-modules/lib/cityselect",
        "datetimepicker":"sea-modules/lib/datetimepicker",
        'selectbox':'sea-modules/lib/selectbox',                    //下拉选项
        'validate':'sea-modules/lib/jquery_validate',                      //表单验证
        'formchecked':'base/common/1/validate_methods',                      //表单验证
        'ajaxform':'sea-modules/lib/ajaxform',                        //表单提交
        'upload':'sea-modules/lib/upload/uploadify',                        //表单提交
        'switchTab':'sea-modules/lib/switchTab'                    //tab切换
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
var URL = {
    'UpPics'  :  "/source/meet_app/uploadify.php",                     //图片上传地址
}
define('meet',['$','validate'],function(require){
    var $ = require('$');
    $(function(){
        /*
         *   信息提示
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

                if (opt.close) {
                    setTimeout(function () {__alertMsg.remove();}, 2000);
                }
            });
        }

        // 图片上传
        var  __UpFiles = function(options){
            var defaults = {
                trigger     :   '',
                title       :   "上传图片",
                types       :   "image",
                fileTypeExts    :   '*.jpg;*.gif;*.png;*.bmp',          //文件类型
                fileSizeLimit   :   '2MB',                                  //文件大小
                multi       :   false,                                  //多文件上传
                uploadLimit :   5                                       //同时上传多少文件
            }
            options = $.extend(true, {}, defaults, options);
            var cont    = '<div class="dialog_upfiles">'
                + '<p class="text">最多上传<span class="blue">'+ options.uploadLimit +'</span>个附件，单文件最大<span class="blue">'+ options.fileSizeLimit +'</span>，类型<span class="blue">'+ options.fileTypeExts +'</span></p>'
                + '<p id="queue"></p>'
                + '<p><input id="FilesUploads" name="file_upload" type="file" multiple="true"></p>'
                + '<p id="file_upload-queue" class="uploadify-queue"></p>'
                + '<p id="upload_show_pics"></p>'
                + '</div>'
            var __backFiles = function(opt) {
                options.trigger.prev().val(opt.val);
                if (options.types!='image') {
                    $('#FileSize').val(opt.size);
                    $('#FileType').val(opt.type);
                    $('#FileTitle').val(opt.name);
                }
            }


            var filename = '',filesize = '',filetype = '',fileurl='',upload_dialog='';

            require.async(['dialog','upload'],function(dialog,uploadify){
                upload_dialog = dialog({
                    'title': options.title,
                    'content': cont,
                    'autofocus' : false,
                    'okValue': '确定',
                    'ok':function(){
                        if (!fileurl) {
                            alert('请上传文件！')
                            return false;
                        }
                    },
                    cancelValue: '取消',
                    cancel:function(){
                        this.close().remove();
                    }
                }).showModal();

                $('#FilesUploads').uploadify({
                    'buttonText'    : '请选择文件',
                    'height'        : 30,
                    'auto'          : true,
                    'fileObjName'   : 'file',
                    'fileTypeExts'      : options.fileTypeExts,
                    'fileSizeLimit'     : options.fileSizeLimit,
                    'multi'         : options.multi,
                    'uploadLimit'   : options.uploadLimit,
                    'swf'           : '/source/meet_app/js/sea-modules/lib/upload/uploadify.swf',
                    'folder'        : URL.Pics_Path,
                    'uploader'      : URL.UpPics,
                    'width'         : 120,
                    'onUploadStart'   : function(file){
                    },
                    'onUploadSuccess':function(file, data, response){
                        var data = $.parseJSON(data);
                        fileurl = data.filelink;
                        filename = data.file_name;
                        filesize = (Number(data.size)/1024).toFixed(2);
                        filetype = data.type;

                        if (options.types=='file') {
                            $("#upload_show_pics").html('<span class="filetypes file_icon_'+ filetype +'"></span><br />文件：'+ filename);
                        } else {
                            $("#upload_show_pics").html('<img src="'+fileurl +'" />');
                        }
                        upload_dialog.addEventListener('close',function () {
                            __backFiles({
                                'val':fileurl,
                                'type':filetype,
                                'size':filesize,
                                'name':filename
                            });
                        });
                    },
                    'onSelectError' : function(file, errorCode, errorMsg){
                    }
                });
            });
        }

        // 下拉样式
        if ($('select').length > 0 ) {
            require.async(['selectbox'],function(selectbox){
                selectbox($('select'));
            })
        };
        /*
         *  地区联动选择
         */
        if ($('#city').length > 0 ) {
            require.async(['cityselect','selectbox'],function(cityselect,selectbox){
                $('#city').citySelect({prov:"北京",nodata:"none"});
                selectbox($('select'));
            });
        }
        /*
         *  日历
         */
        if ($('[data-provide=datetimepicker]').length > 0 ) {
            require.async(['datetimepicker'],function(){
                $('[data-provide=datetimepicker]').datetimepicker({
                    lang:'ch',
                    format:'Y-m-d H:i:00',
                    step:5
                });
            })

        }


        /*
         *  编辑器
         */
        if ($('[data-editor="true"]').length > 0 ) {
            if(!-[1,]) {
                // IE9以下
                require.async('editor8_2',function(){
                    $('[data-editor="true"]').redactor({
                        buttons: ['bold', 'italic','orderedlist','image', 'video', 'table', 'link', 'alignment'],
                        imageUpload: URL.UpPics,
                        fileUpload: URL.UpPics,
                        minHeight: 200
                    });
                })
            }  else {
                require.async('editor',function(){
                    $('[data-editor="true"]').redactor({
                        lang: 'zh_cn',
                        buttons: ['bold', 'italic', 'orderedlist','image', 'video','table', 'link', 'alignment'],
                        plugins: ['fontsize','fontcolor','fullscreen'],
                        imageUpload: URL.UpPics,
                        fileUpload: URL.UpPics,
                        minHeight: 200
                    });
                })
            }
        }



        // 图片上传
        $(document).on('click','[data-uploads="pics"]',function(){
            var that = $(this);
            __UpFiles({
                trigger     :   that,
                title       :   "上传图片",
                types       :   "image",
                fileTypeExts    :   '*.jpg;*.gif;*.png;*.bmp;*.jpge',
                fileSizeLimit   :   '2MB',
                multi       :   false,
                uploadLimit :   1
            })
        })

        /*
         *  表单验证  与 提交
         */
        // 表单提交
        // 报名表提交
        var validator = null;
        if ($("[data-validate='true']").length > 0) {
            require.async(['formchecked','ajaxform'],function(Validate,ajaxform){
                new Validate.checked($("[data-validate='true']"),{
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
            })
        }
    })
});

seajs.use('meet');