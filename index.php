<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>首页</title>
    <link rel="stylesheet" href="css/style.css"/>
</head>
<body>
    <?php require_once("header.php"); ?>
    <div class="FormBox">
        <form id="form1">
            <div class="form-item">
                <span class="label"><span class="red">*</span>账号：</span>
                <div>
                    <input type="text" name="username" class="text"  data-rule-required="true" data-rule-mobile_email="true" data-msg-required="请输入邮箱地址或手机号" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>密码：</span>
                <div>
                    <input type="password" name="password" class="text"  data-rule-required="true" data-rule-password="true" data-msg-required="请输入6-20位密码" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>日期与时间：</span>
                <div>
                    <input type="text" name="datetime" class="text"  data-rule-required="true" data-rule-datetime="true" data-msg-required="请输入日期时间，如：2014-10-10 12:00:00" />
                </div>
            </div>
            <div class="form-item">
                <button type="submit">提交</button>
            </div>
        </form>
        <form id="form2">
            <div class="form-item">
                <span class="label"><span class="red">*</span>日期：</span>
                <div>
                    <input type="text" name="date" class="text"  data-rule-required="true" data-rule-date="true" data-msg-required="请输入日期，如：2014-10-10" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>手机号：</span>
                <div>
                    <input type="text" name="mobile" class="text"  data-rule-required="true" data-rule-mobile="true" data-msg-required="请输入日期11位手机号" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>固定电话：</span>
                <div>
                    <input type="text" name="tel" class="text"  data-rule-required="true" data-rule-tel="true" data-msg-required="请输入固定电话号码" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>电话：</span>
                <div>
                    <input type="text" name="phone" class="text"  data-rule-required="true" data-rule-phone="true" data-msg-required="请输入手机号或固定电话号码" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>QQ：</span>
                <div>
                    <input type="text" name="qq" class="text"  data-rule-required="true" data-rule-qq="true" data-msg-required="请输入您的联系QQ号码" />
                </div>
            </div>

            <div class="form-item">
                <span class="label"><span class="red">*</span>E-mail：</span>
                <div>
                    <input type="text" name="email" class="text"  data-rule-required="true" data-rule-email="true" data-msg-required="请输入您的E-mail地址" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>URL：</span>
                <div>
                    <input type="text" name="url" class="text"  data-rule-required="true" data-rule-url="true" data-msg-required="请输入您的URL地址" />
                </div>
            </div>
            <div class="form-item">
                <span class="label"><span class="red">*</span>邮编：</span>
                <div>
                    <input type="text" name="zipcode" class="text"  data-rule-required="true" data-rule-zipcode="true" data-msg-required="请输入邮编" />
                </div>
            </div>
            <div class="form-item">
               <button type="submit">提交</button>
            </div>
        </form>
    </div>

    <?php require_once("footer.php"); ?>
</body>
</html>
