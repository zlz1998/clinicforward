layui.use(['table', 'upload', 'form'], function () {
    var table = layui.table;
    var upload = layui.upload;
    var form = layui.form;
    var $ = layui.$;
    var myVersion = initData(table, $);
    uploadFile(upload, $);
    initForm(form, $);
    submitForm(form, $);
    $("#back").click(function () {
        history.back();
    });

    $('#del').click(function () {
        $.ajax({
            url: serverUrl + '/dev/flatform/app/delFile?fileType=apk&id=' + $('[name=id]').val(),
            dataType: 'json',
            success: function (r) {
                if (r.status == 200) {
                    $('[name=apkFileName]').val('');
                    $('#download').hide();
                    $('#del').hide();
                }
            }
        });
        return false;
    });

    $('#download').click(function () {
        location.href=$("[name=downloadLink]").val();
        return false;
    });
});

function initData(table, $) {
    //渲染(填充表格的数据)
    return table.render({
        id: 'versionList'
        , elem: '#versionList'
        , title: 'APP数据表'
        , url: serverUrl + '/dev/flatform/app/versionList?appId=' + $('[name=appId]').val()
        , method: 'post'
        , cols: [[
            {type: 'checkbox', fixed: 'left'}
            , {
                field: 'appName',
                title: '软件名称',
                width: 190,
                fixed: 'left',
                unresize: true,
                sort: true,
                totalRowText: '合计：'
            }
            , {field: 'versionNo', title: '版本号', width: 120, edit: 'text'}
            , {
                field: 'versionSize', title: '版本大小(单位:M)', hide: 0, width: 150, edit: 'text', templet: function (d) {
                    return d.versionSize.toFixed(2);
                }
            }
            ,
            {field: 'publishStatusName', title: '发布状态', width: 80, edit: 'text'},
            {
                field: '#', title: 'APK文件下载', width: 380, edit: 'text', templet: function (d) {
                return d.apkFileName;
            }
            },
            {field: 'modifyDate', title: '最近更新时间', width: 150, edit: 'text'}
        ]]
    });
}

function uploadFile(upload, $) {
    upload.render({
            elem: '#uploadAPK',
            url: serverUrl + '/dev/flatform/app/uploadAPK',
            method: 'POST',
            auto: false,
            bindAction: '#commit',
            accept: 'file',
            field: 'apkFile',
            size: 10240,
            multiple: false,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $("#apkFileName").val(file.name);
                })
            }
        }
    )
}

function initForm(form, $) {
    $.ajax({
        url: serverUrl + "/dev/flatform/app/getVersionByAppId?appId=" + $("[name=appId]").val(),
        dataType: 'json',
        type: 'post',
        success: function (r) {
            setTimeout(function () {
                form.val('updVersion', r.data);
            }, 100)
        }
    });
}

function submitForm(form, $) {
    form.on('submit(*)', function (data) {
        console.log(data.field)
        $.ajax({
            url: serverUrl + '/dev/flatform/app/updVersion',
            type: 'post',
            data: data.field,
            dataType: 'json',
            success: function (r) {
                if (r.status == 200) {
                    console.log(data.field)
                    location.href = 'list.html';
                }
            },
            error: function (xhr) {
                alert('服务异常');
            }
        });
        return false;
    })
}
