/**
 * Created by chandre on 14-9-20.
 */
define(function (require) {
    var $ = require('$');
    //表单验证
    require.async(['./validate_methods'], function(Formvalidate) {
        new Formvalidate();
    });
});
