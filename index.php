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
                <span class="label"><span class="red">*</span>联系人姓名：</span>
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
