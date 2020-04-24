layui.use(['table', 'element', 'form'], function () {
    var table = layui.table;
    var form = layui.form;
    var $ = layui.$;
    /*  element.on('nav(demo)', function(elem){
     console.log(elem)
     layer.msg(elem.text());
     });*/
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

    var mytable = initData(table);
    //工具栏事件
    initToolBar(table);
    //监听行工具事件
    initTool(table, $, mytable);
    //查询
    search(mytable, $);

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


function search(mytable, $) {
    $('.search-btn').on('click', function () {
        mytable.reload({
            page: {curr: 1},
            method: 'post',
            where: {
                querySoftwareName: $('[name=querySoftwareName]').val(),
                queryStatus: $('[name=queryStatus]').val(),
                queryFlatformId: $('[name=queryFlatformId]').val(),
                queryCategoryLevel1: $('[name=queryCategoryLevel1]').val(),
                queryCategoryLevel2: $('[name=queryCategoryLevel2]').val(),
                queryCategoryLevel3: $('[name=queryCategoryLevel3]').val()
            }
        });
        return false;
    })
}
function initTool(table, $, mytable) {
    table.on('tool(dataList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('你确定删除APP应用【'+data.softwareName+'】及其所有的版本吗？', function (index) {
                obj.del();
                layer.close(index);
                $.ajax({
                    url: serverUrl + "/dev/flatform/app/del?id=" + data.id,
                    dataType: 'json',
                    type: 'post',
                    success: function (r) {
                        if (r.status == 200) {
                            layer.alert("删除成功");
                        }
                    }
                });
            });
        } else if (obj.event === 'update') {
            if (data.status == 1 || data.status == 3)
                location.href = "update.html?" + data.id;
            else
                layui.layer.alert("该APP应用的状态为：【" + data.statusName + "】，不能修改！");
        } else if (obj.event === 'addVersion') {
            location.href = "addVersion.html?" + data.id;
        } else if (obj.event === 'updVersion') {
            if (data.status == 2 || data.status == 4 || data.status == 5)
                layui.layer.alert("该APP应用的状态为：【" + data.statusName + "】，不能修改其版本信息，只可进行【新增版本】操作！");
            else if (data.versionId != undefined)
                location.href = "updVersion.html?" + data.id;
            else
                layui.layer.alert("该APP应用无版本信息，请先增加版本信息！");
        } else if (obj.event === 'view') {
            location.href = "viewVersion.html?" + data.id;
        } else if (obj.event === 'onSale') {
            if (data.status == 2 || data.status == 5)
                modifySale(data.id, $, mytable);
        } else if (obj.event === 'offSale') {
            if (data.status == 4)
                modifySale(data.id, $, mytable);
        }
    });
}

function modifySale(id, $, mytable) {
    $.ajax({
        url: serverUrl + "/dev/flatform/app/modifySale?id=" + id,
        dataType: 'json',
        type: 'post',
        success: function (r) {
            if (r.status == 200) {
                layer.alert("操作成功");
                mytable.reload();
            }
        }
    });
}

function initToolBar(table) {

    table.on('toolbar(dataList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'add':
                location.href = "add.html";
                break;
        }
    });
}


function initData(table) {
    //渲染(填充表格的数据)
    return table.render({
        id: 'dataList'
        , elem: '#appList'
        , title: 'APP数据表'
        , url: serverUrl + '/dev/flatform/app/list'
        , method: 'post'
        , toolbar: '#toolbarDemo'
        , page: true  //开启分页
        , limits: [5, 10, 20]  //每页条数的选择项，默认：[10,20,30,40,50,60,70,80,90]。
        , limit: 5 //每页默认显示的数量
        , cols: [[
            {type: 'checkbox', fixed: 'left'}
            , {
                field: 'softwareName',
                title: '软件名称',
                width: 100,
                fixed: 'left',
                unresize: true,
                sort: true,
                totalRowText: '合计：'
            }
            , {field: 'aPKName', title: 'APK名称', width: 100, edit: 'text'}
            , {
                field: 'softwareSize', title: '软件大小(单位:M)', hide: 0, width: 60, edit: 'text', templet: function (d) {
                    return d.softwareSize.toFixed(2);
                }
            }
            ,
            {field: 'flatformName', title: '所属平台', width: 80, edit: 'text'},
            {
                field: '#', title: '所属分类', width: 240, edit: 'text', templet: function (d) {
                return d.categoryLevel1Name + ">>" + d.categoryLevel2Name + ">>" + d.categoryLevel3Name
            }
            },
            {field: 'statusName', title: '状态', width: 110, edit: 'text'},
            {field: 'downloads', title: '下载次数', width: 100, edit: 'text'},
            {field: 'versionNo', title: '最新版本号', width: 80, edit: 'text'},
            /* {
             field: 'userRole', title: '所属分类', hide: 0, width: 150, edit: 'text', templet: function (d) {
             if (d.userRole == 1) return '管理员';
             else if (d.userRole == 2) return '经理';
             else return '用户';
             }
             }
             , */
            {fixed: 'right', title: '操作', toolbar: '#barDemo', width: 400}
        ]]
    });
}

