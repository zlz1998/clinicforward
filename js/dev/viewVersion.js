layui.use(['form', 'table', 'upload'], function () {
    var form = layui.form;
    var table = layui.table;
    var upload = layui.upload;
    var $ = layui.$;

    $("#back").click(function () {
        history.back();
    });

    queryStatus($, form);
    queryflatform($, form);
    querycategoryLevel($, form, 'categoryLevel1', {value: ''});
    form.on('select(categoryLevel1)', function (data) {
        if (data.value != "") {
            querycategoryLevel($, form, 'categoryLevel2', data);
        } else {
            $("#categoryLevel2").html(new Option());
            $("#categoryLevel3").html(new Option());
            form.render('select');
        }
    });
    form.on('select(categoryLevel2)', function (data) {
        if (data.value != "") {
            querycategoryLevel($, form, 'categoryLevel3', data);
        } else {
            $("#categoryLevel3").html(new Option());
            form.render('select');
        }
    });


    form.on('submit(*)', function (data) {
        $("#uploadfile").trigger("click");
        if ($(this).attr('id') == "commitAndS") {
            data.field.status = 1;
        }
        $.ajax({
            url: serverUrl + '/dev/flatform/app/doUpdate',
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
    })

    function initForm() {
        $.ajax({
            url: serverUrl + "/dev/flatform/app/toUpdate?id=" + $("[name=id]").val(),
            dataType: 'json',
            type: 'post',
            success: function (r) {
                initData(table, $, r.data.id);
                if (r.data.status != 3) $("#commitAndS").css("display", "none");
                layui.event.call('categoryLevel2', 'form', 'select(categoryLevel1)', {value: r.data.categoryLevel1});
                layui.event.call('categoryLevel3', 'form', 'select(categoryLevel2)', {value: r.data.categoryLevel2});
                setTimeout(function () {
                    form.val('update', r.data);
                    if(r.data.logoPicPath!='' && r.data.logoPicPath != undefined)
                    $('#imgPhoto').attr('src', imgUrl + r.data.logoPicPath);
                }, 100)
            }
        });
    }

    setTimeout(initForm, 100);
});


function queryStatus($, form) {
    $.ajax({
        url: serverUrl + "/dev/flatform/app/dicList?typeCode=APP_STATUS",
        dataType: 'json',
        type: 'post',
        success: function (data) {
            $.each(data, function (index, item) {
                $('#status').append(new Option(item.valueName, item.valueId));
            });
            form.render('select');
        }
    });
}
function queryflatform($, form) {
    $.ajax({
        url: serverUrl + "/dev/flatform/app/dicList?typeCode=APP_FLATFORM",
        dataType: 'json',
        type: 'post',
        success: function (data) {
            $.each(data, function (index, item) {
                $('#flatformId').append(new Option(item.valueName, item.valueId));
            });
            form.render('select');
        }
    });
}
function querycategoryLevel($, form, name, data) {
    $.ajax({
        url: serverUrl + '/dev/flatform/app/cateList',
        dataType: 'json',
        data: {parentId: data.value},
        success: function (r) {
            $("#" + name).html(new Option());
            $.each(r, function (index, item) {
                $("#" + name).append(new Option(item.categoryName, item.id));
            });
            form.render('select');
        }
    });
};

function initData(table, $, appId) {
    //渲染(填充表格的数据)
    return table.render({
        id: 'versionList'
        , elem: '#versionList'
        , title: 'APP数据表'
        , url: serverUrl + '/dev/flatform/app/versionList?appId=' + appId
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


