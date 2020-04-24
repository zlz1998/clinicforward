layui.use(['form', 'table', 'upload'], function () {
    var form = layui.form;
    var table = layui.table;
    var upload = layui.upload;
    var $ = layui.$;

    $("#back").click(function () {
        history.back();
    });

    form.on('submit(*)', function (data) {
        if ($(this).attr('id') == "pass") {
            data.field.status = 2;
        } else {
            data.field.status = 3;
        }
        $.ajax({
            url: serverUrl + '/manager/backend/app/doUpdate',
            type: 'post',
            data: data.field,
            dataType: 'json',
            success: function (r) {
                if (r.status == 200) {
                    location.href = 'list.html';
                }
            },
            error: function (xhr) {
                layer.alert('服务异常');
            }
        });
        return false;
    });
    initForm(form, $);
});
var appId = location.search.substring(1);
function initForm(form, $) {
    $.ajax({
        url: serverUrl + "/manager/backend/app/getAppInfoById?id=" + appId,
        dataType: 'json',
        type: 'post',
        success: function (r) {
            r.data.categoryLevel = r.data.categoryLevel1Name + "-->" + r.data.categoryLevel2Name + "-->" + r.data.categoryLevel3Name;
            form.val('AppInfo', r.data);
            $('#imgPhoto').attr('src', imgUrl + r.data.logoPicPath);
            $.ajax({
                url: serverUrl + "/manager/backend/app/getNewVersionByAppId?appId=" + r.data.id,
                dataType: 'json',
                type: 'post',
                success: function (d) {
                    form.val('Version', d.data);
                    $("#downloadLink").html(d.data.apkFileName);
                    $("#downloadLink").attr("href", d.data.downloadLink);
                }
            });
        }
    })
}