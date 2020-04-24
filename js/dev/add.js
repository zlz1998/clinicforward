layui.use(['form', 'upload'], function () {
    var form = layui.form;
    var upload = layui.upload;
    var $ = layui.$;
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
    $("#back").click(function () {
        history.back();
    });
    var upl = up(upload, $);
    form.on('submit(*)', function (data) {
        console.log(data)
        $.ajax({
            url: serverUrl + '/dev/flatform/app/add',
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
                layer.alert('服务异常');
            }
        })
        return false;
    })
    setTimeout(function () {
        form.val('first', {status: 1});
    }, 100);
})

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
var img;
function up(upload, $) {
    return upload.render({
        elem: '#uploadDemo',
        url: serverUrl + '/dev/flatform/app/uploadAppInfo',
        method: 'POST',
        auto: false,
        bindAction: '#commit',
        accept: 'images',
        field: 'logo',
        size: 10240,
        multiple: false,
        choose: function (obj) {
            obj.preview(function (index, file, result) {
                img = parseInt(Math.random() * 10000000000) + "." + file.type.substring(file.type.indexOf("/") + 1);
                obj.resetFile(index, file, img);
                $('#imgPhoto').attr('src', result); //图片链接（base64）
                $("#logoPicPath").val(img);
                $("i").hide();
            });
            return obj;
        }
    })
}
