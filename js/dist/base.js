define("base/common/1/base",["sea-modules/jquery/jquery"],function(a){a("sea-modules/jquery/jquery"),a.async(["./validate_methods"],function(a){new a.checked("#form1",{ErrorClass:"err",SuccessClass:"success",wrapper:"div",SuccessText:"OK!",submit:function(a){return console.log(a),alert("1"),!1}}),new a.checked("#form2",{MsgElements:"span",ErrorClass:"err",SuccessClass:"success",SuccessText:"你真棒！"})})});
