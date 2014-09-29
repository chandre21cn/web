define(function(require, exports, module) {
    var $ = require('$');
    var template = require('template');

    //分页辅助方法
    template.helper('GetPages', function(total_page, cur_page) {
        var cur = Number(cur_page),
            total = Number(total_page),
            prev = '',
            next = '',
            a = [];

        if (cur == '1') {
            prev = '<span href=\"javascript:void(0);\" class=\"off\">上一页</span>';
        } else {
            prev = '<a href=\"javascript:void(0);\" data-page=\"' + (cur - 1) + '\">上一页</a>';
        }

        if (total == cur) {
            next = '<span href=\"javascript:void(0);\" class=\"off\">下一页</span>';
        } else {
            next = '<a href=\"javascript:void(0);\" data-page=\"' + (cur + 1) + '\">下一页</a>';
        }

        function setPageList() {
            if (cur == i) {
                a[a.length] = "<a href=\"javascript:void(0);\" class=\"on\">" + i + "</a>";
            } else {
                a[a.length] = "<a href=\"javascript:void(0);\" data-page=\"" + i + "\">" + i + "</a>";
            }
        }
        //总页数小于10
        if (total <= 10) {
            for (var i = 1; i <= total; i++) {
                setPageList();
            }
        } else { // 总页数大于10页
            if (cur <= 4) {
                for (var i = 1; i <= 5; i++) {
                    setPageList();
                }
                a[a.length] = "<span class=\"more\">…</span><a href=\"javascript:void(0);\"   data-page=\"" + total + "\">" + total + "</a>";
            } else if (cur >= total - 3) {
                a[a.length] = "<a href=\"javascript:void(0);\" data-page=\"1\">1</a><span class=\"more\">…</span>";
                for (var i = total - 4; i <= total; i++) {
                    setPageList();
                }
            } else { //当前页在中间部分
                a[a.length] = "<a href=\"javascript:void(0);\" data-page=\"1\">1</a><span class=\"more\">…</span>";
                for (var i = cur - 2; i <= cur + 2; i++) {
                    setPageList();
                }
                a[a.length] = "<span class=\"more\">…</span><a href=\"javascript:void(0);\"  data-page=\"" + total + "\">" + total + "</a>";
            }

        }
        return prev + a + next;
    });

    //转换成json格式编码 辅助方法
    template.helper('json', function(str) {
        var string = '';
        for (i = 0; i < str.length; i++) {
            temp = str.charCodeAt(i).toString(16);
            string += "\\u" + new Array(5 - String(temp).length).join("0") + temp;
        }
        return string
    });

    //数组转字符串 用表报名人员列表


    //URL 辅助方法
    template.helper('isURL', function(str) {
        var string = '';
        var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        if (reg.test(str)) {
            string = str;
        }
        return string;
    });

    var Common = {
        /*取得去除页头的浏览器高度*/
        __GetWindowsHeight: function() {
            var window_height = Number($(window).height());
            var header_height = Number($('#Header').height()) + 1; // +1为页头有添加一条底边线为1px
            return windowHeight = window_height - header_height;
        },
        /*设置窗口大小*/
        __windowSize: function() {
            var ContMenu_height = Number($('#ContMenu').height()) + 1;
            var ContBody_height = Common.__GetWindowsHeight() - ContMenu_height;
            $('#ContBody,#DialogCont').css('height', ContBody_height);
            $('#DialogCont').css('height', ContBody_height);
            $('#DialogLayout').css('height', Common.__GetWindowsHeight());
        },

        /* 设置滚动条 */
        __AddScroll: function(event) {
            require.async('scroll', function() {
                $(event).mCustomScrollbar({
                    scrollInertia: 0,
                    scrollButtons: {
                        enable: false
                    },
                    advanced: {
                        updateOnContentResize: true,
                        autoScrollOnFocus: true
                    }
                });
            });
        },

        /* 加载主体内容模板 */
        __GetTemplate: function(opt) {
            // 加载二级菜单
            var a = eval('__subMenuConfig.' + opt.type);
            var data = {
                'menutitle': a.title,
                'menuname': a.name,
                'menuurl': a.url,
                'icon': a.icon
            };
            var html = template('__ContBox', data);
            $('#ContentBox').html(html);

            //加载内容
            $.ajax({
                url: opt.url,
                type: 'post',
                async: false,
                dataType: 'json',
                beforeSend: function() {
                    $('#EditBody').html('<div class="loading"></div>');
                },
                error: function() {
                    $('#EditBody').html('<div class="err"></div>');
                    return false;
                },
                success: function(json) {
                    var n = Number(json.code);
                    switch (n) {
                        case 1:
                            var data = json.data;
                            var html = template(opt.templateID, data);
                            $('#EditBody').html(html);
                            break;
                        case 2:

                            break;
                        default:
                            $('#EditBody').html('<div class="err"></div>');
                    }
                },
                complete: function() {
                    Common.__windowSize();
                    // 导航高亮


                    $('#NavMenu a').each(function() {
                        var that = $(this);
                        that[that.attr('href') == opt.type ? 'addClass' : 'removeClass']('on');
                    });
                    $('#NavMenu a[href^="#t=' + opt.type + '"]').addClass('on');
                    // 展开当前页菜单
                    var $that = $('#NavMenu a[href^="#t=' + opt.type + '"]').parent().parent();
                    $that.siblings().find('.title i').html('');
                    $that.find('.list').slideDown('fast');
                    $that.find('.title i').html('');

                    $('#ContMenu .tabs_menu a').each(function() {
                        var that = $(this);
                        that[that.attr('href') == opt.oldhash ? 'addClass' : 'removeClass']('on');
                    });
                }
            })
        },

        /*  弹出右侧编辑或查看层 */

        __Dialog: function(opt) {
            // 关闭弹出
            $(document).on('click', '#CloseDialog', function() {
                Common.__CloseDialog();
            })
            var data = {
                'title': opt.title,
                'data': opt.data
            }
            var html = template(opt.tplID, data);

            if ($('#DialogLayout').length > 0) {
                $('#DialogLayout').html(html);
            } else {
                $('#ContentBox').append('<div id="DialogLayout">' + html + '</div>');
                $('#DialogLayout').css({
                    'top': '0px',
                    'display': 'block',
                    'height': Common.__GetWindowsHeight() + 'px',
                    'right': '-' + $('#DialogLayout').width() + 'px',
                    'visibility': 'visible'
                }).animate({
                    'right': '0'
                }, 400);
            }
            Common.__windowSize();
        },

        __CloseDialog: function() {
            $('#DialogLayout').animate({
                'right': '-' + $('#DialogLayout').width() + 'px'
            }, 300, function() {
                $(this).remove();
            });
        },
        // 信息编辑
        __Edit: function(opt) {
            var defaults = {
                'trigger': '#DialogCont',
                'url': '',
                'infoid': '',
                'tpl_id': ''
            }
            options = $.extend(true, {}, defaults, opt);
            var that = $(options.trigger)
            $.ajax({
                url: URL.path + options.url,
                type: 'POST',
                dataType: 'json',
                data: {
                    'id': options.infoid,
                    'meetid': mid
                },
                beforeSend: function() {
                    that.html('<div class="loading"></div>');
                },
                error: function() {
                    that.html('<div class="err"></div>');
                    return false;
                },
                success: function(json) {
                    var data = json;
                    var html = template(options.tpl_id, data);
                    if ($('#DialogLayout').length > 0) {
                        that.html(html);
                    } else {
                        $('#ContentBox').append('<div id="DialogLayout">' + html + '</div>');
                        $('#DialogLayout').css({
                            'top': '0px',
                            'display': 'block',
                            'height': Common.__GetWindowsHeight() + 'px',
                            'right': '-' + $('#DialogLayout').width() + 'px',
                            'visibility': 'visible'
                        }).animate({
                            'right': '0'
                        }, 400);
                        // 关闭弹出
                        $(document).on('click', '#CloseDialog', function() {
                            Common.__CloseDialog();
                        })
                    }
                },
                complete: function() {
                    Common.__windowSize();
                }
            })
        },
        // 上传图片或文件
        __UpFiles: function(options) {
            var defaults = {
                trigger: '',
                title: "上传图片",
                types: "image",
                fileTypeExts: '*.jpg;*.gif;*.png;*.bmp', //文件类型
                fileSizeLimit: '2MB', //文件大小
                multi: false, //多文件上传
                uploadLimit: 5 //同时上传多少文件
            }
            options = $.extend(true, {}, defaults, options);
            var cont = '<div class="dialog_upfiles">' + '<p class="text">最多上传<span class="blue">' + options.uploadLimit + '</span>个附件，单文件最大<span class="blue">' + options.fileSizeLimit + '</span>，类型<span class="blue">' + options.fileTypeExts + '</span></p>' + '<p id="queue"></p>' + '<p><input id="FilesUploads" name="file_upload" type="file" multiple="true"></p>' + '<p id="file_upload-queue" class="uploadify-queue"></p>' + '<p id="upload_show_pics"></p>' + '</div>'
            var __backFiles = function(opt) {
                options.trigger.prev().val(opt.val);
                if (options.types != 'image') {
                    $('#FileSize').val(opt.size);
                    $('#FileType').val(opt.type);
                    $('#FileTitle').val(opt.name);
                }
            }


            var filename = '',
                filesize = '',
                filetype = '',
                fileurl = '',
                upload_dialog = '';

            require.async(['dialog', 'upload'], function(dialog, uploadify) {
                upload_dialog = dialog({
                    'title': options.title,
                    'content': cont,
                    'autofocus': false,
                    'okValue': '确定',
                    'ok': function() {
                        if (!fileurl) {
                            alert('请上传文件！')
                            return false;
                        }
                    },
                    cancelValue: '取消',
                    cancel: function() {
                        this.close().remove();
                    }
                }).showModal();

                $('#FilesUploads').uploadify({
                    'buttonText': '请选择文件',
                    'height': 30,
                    'auto': true,
                    'fileObjName': 'file',
                    'fileTypeExts': options.fileTypeExts,
                    'fileSizeLimit': options.fileSizeLimit,
                    'multi': options.multi,
                    'uploadLimit': options.uploadLimit,
                    'swf': '/source/meet_app/js/sea-modules/lib/upload/uploadify.swf',
                    'folder': URL.Pics_Path,
                    'uploader': URL.UpPics,
                    'width': 120,
                    'onUploadStart': function(file) {},
                    'onUploadSuccess': function(file, data, response) {
                        var data = $.parseJSON(data);
                        fileurl = data.filelink;
                        filename = data.file_name;
                        filesize = (Number(data.size) / 1024).toFixed(2);
                        filetype = data.type;

                        if (options.types == 'file') {
                            $("#upload_show_pics").html('<span class="filetypes file_icon_' + filetype + '"></span><br />文件：' + filename);
                        } else {
                            $("#upload_show_pics").html('<img src="' + fileurl + '" />');
                        }
                        upload_dialog.addEventListener('close', function() {
                            __backFiles({
                                'val': fileurl,
                                'type': filetype,
                                'size': filesize,
                                'name': filename
                            });
                        });
                    },
                    'onSelectError': function(file, errorCode, errorMsg) {}
                });
            });
        },
        // 分页
        __GetPages: function(options) {
            var defaults = {
                page: 1,
                url: '',
                id: mid,
                type: '',
                change: '',
                templateID: ''
            };
            opt = $.extend(true, {}, defaults, options);

            $.ajax({
                url: opt.url,
                type: 'post',
                async: false,
                dataType: 'json',
                timeout: 3000,
                data: {
                    'meetid': opt.id,
                    'page': opt.page,
                    'type': opt.type
                },
                beforeSend: function() {
                    opt.change.html('<div class="loading"></div>');
                },
                error: function() {
                    opt.change.html('<div class="err"></div>');
                    return false;
                },
                success: function(json) {
                    var n = Number(json.code);
                    switch (n) {
                        case 1:
                            var data = json.data;
                            var html = template(opt.templateID, data);
                            opt.change.html(html);
                            break;
                        default:
                            opt.change.html('<div class="err"></div>');
                    }
                },
                complete: function() {
                    Common.__windowSize();
                }
            })
        }
    }
    module.exports = Common;

});