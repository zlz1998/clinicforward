layui.use(['form', 'layedit', 'laydate'], function(){
    var form = layui.form
        ,layer = layui.layer
        ,layedit = layui.layedit
        ,laydate = layui.laydate;
    var $ = layui.$;
    //自定义验证规则
    form.verify({
        userCode: function(value){
            if(value.length < 5){
                return '标题也太短了吧';
            }
        }
        ,userPassword: [/(.+){6,12}$/, '密码必须6到12位']

    });
    //监听提交
    form.on('submit(*)', function(data){
//            console.log(data)
//            alert(JSON.stringify(data.field));
        $.ajax({
            url:serverUrl + '/manager/dologin',
            type:'post',
            data:data.field,
            dataType:'json',
            success:function (r) {
                if(r.status==200) {
                    sessionStorage.setItem('loginName',r.data.userName);
                    location.href='index.html';
                } else {
                    layer.alert('用户名或密码错误');
                }
            },
            error:function (xhr) {
                layer.alert('服务异常');
            }
        })
        //location.href='view/dev/index.html';
        return false;
    });

});