var xnrUser=ID_Num;
//@用户推荐
// var recommendUrl='/twitter_xnr_operate/daily_recommend_at_user/?xnr_user_no='+xnrUser;
// public_ajax.call_request('get',recommendUrl,recommendlist);
function recommendlist(data) {
    var str1='',str2='',b=0;
    for(var a in data){
        var n=data[a];
        if (n==''){n=a};
        if (b<=3){
            str1+='<li uid="'+a+'" title="'+n+'"><a href="###">'+n+'</a></li>';
        }else {
            if (b==4){
                str1+= '<a class="more" href="###" data-toggle="modal" data-target="#moreThing"' +
                    'style="color:#b0bdd0;font-size: 10px;border: 1px solid silver;float:right;' +
                    'padding: 2px 6px;margin:10px 0;border-radius: 7px;">更多</a>'
            };
            str2+='<li uid="'+a+'" title="'+n+'"><a href="###">'+n+'</a></li>';
        }
        b++;
    }
    $('#user_recommend .user_example_list').html(str1);
    if (str2){
        $('#moreThing .moreCon ul').html(str2);
    }
    $('#user_recommend .user_example_list li a').on('click',function(){
        var t1=$(this).text();
        $('#post-2-content').append('@'+t1+' ');
    });
    $('#moreThing .moreCon ul li a').on('click',function(){
        var t2=$(this).text();
        $('#post-2-content').append('@'+t2+' ');
    });
}
//------
$('#container .type_page #myTabs a').on('click',function () {
    var arrow=$(this).attr('href'),arrowName='';
    if (arrow == '#everyday'){
        // arrowName='@用户推荐';
        // recommendUrl='/twitter_xnr_operate/daily_recommend_at_user/?xnr_user_no='+xnrUser;
        $('#container .post_post .post-2 #post-2-content').width('100%');
        $('#container .post_post .post-2 .add_thing').css({'width':'100%'});
        $('#user_recommend').hide();
    }else if (arrow=='#hot'){
        arrowName='@用户推荐';
        $('#container .post_post .post-2 #post-2-content').width('736px');
        $('#container .post_post .post-2 .add_thing').css({'width':'81%'});
        $('#user_recommend').show();
        public_ajax.call_request('get',hotWeiboUrl,hotWeibo);
        recommendUrl='/twitter_xnr_operate/hot_sensitive_recommend_at_user/?sort_item=share';
    }else if (arrow=='#business'){
        arrowName='@敏感用户推荐';
        $('#container .post_post .post-2 #post-2-content').width('736px');
        $('#container .post_post .post-2 .add_thing').css({'width':'81%'});
        $('#user_recommend').show();
        public_ajax.call_request('get',busWeiboUrl,businessWeibo);
        recommendUrl='/twitter_xnr_operate/hot_sensitive_recommend_at_user/?sort_item=sensitive';
    }else if (arrow=='#reportNote'){
        $('.post_post').hide();
        public_ajax.call_request('get',flow_faw_url,flow_faw);
        public_ajax.call_request('get',focus_main_url,focus_main);
    }else {
        arrowName='@用户推荐';
        operateType='intel_post';
        $('#intell_type').show();
        var intelligent_writing_url='/intelligent_writing/show_writing_task/?task_source='+intelligentType+'&xnr_user_no='+ID_Num;
        // var intelligent_writing_url='/intelligent_writing/show_writing_task/?task_source=facebook&xnr_user_no=FXNR0005';
        public_ajax.call_request('get',intelligent_writing_url,intelligentList);
    }
    if (arrow!='#intelliGence'){
        $('#intell_type').hide();
    }
    if (arrow!='#reportNote'){
        $('.post_post').show();
        $('#user_recommend .tit').text(arrowName);
        public_ajax.call_request('get',recommendUrl,recommendlist);
    }
})
//=========跟踪转发===========
var flow_faw_url='/twitter_xnr_operate/show_retweet_timing_list_future/?xnr_user_no='+ID_Num+'&start_ts='+todayTimetamp()+
    '&end_ts='+(Date.parse(new Date())/1000);
var focus_main_url='/twitter_xnr_operate/show_trace_followers/?xnr_user_no='+ID_Num;
$('.choosetime .demo-label input[name="time1"]').on('click',function () {
    var _val=$(this).val();
    var flow_faw_url;
    if (_val=='no'){
        flow_faw_url='/twitter_xnr_operate/show_retweet_timing_list_future/?xnr_user_no='+ID_Num;
        public_ajax.call_request('get',flow_faw_url,flow_faw);
    }else {
        var end_time=Date.parse(new Date())/1000;
        var startTime='';
        if (_val=='mize'){
            $('#start_1').show();
            $('#end_1').show();
            $('.sureTime').show();
        }else {
            if (_val==0){
                startTime=todayTimetamp();
            }else {
                startTime=getDaysBefore(_val);
            }
            $('#start_1').hide();
            $('#end_1').hide();
            $('.sureTime').hide();
            flow_faw_url='/twitter_xnr_operate/show_retweet_timing_list/?xnr_user_no='+ID_Num+'&start_ts='+startTime+
                '&end_ts='+end_time;
            public_ajax.call_request('get',flow_faw_url,flow_faw);
        }
    }
});
$('.sureTime').on('click',function () {
    var s=$('#start_1').val();
    var d=$('#end_1').val();
    if (s==''||d==''){
        $('#pormpt p').text('时间不能为空。');
        $('#pormpt').modal('show');
    }else {
        var his_timing_task_url='/twitter_xnr_operate/show_retweet_timing_list/?xnr_user_no='+ID_Num+'&start_ts='+(Date.parse(new Date(s))/1000)+
            '&end_ts='+(Date.parse(new Date(d))/1000);
        public_ajax.call_request('get',his_timing_task_url,flow_faw);
    }
});
function flow_faw(data) {
    $('#follow_forward p').show();
    $('#follow_forward').bootstrapTable('load', data);
    $('#follow_forward').bootstrapTable({
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 2,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var name,txt,img,postTime,retweedTime,$_status;
                    if (row.nick_name==''||row.nick_name=='null'||row.nick_name=='unknown'){
                        name=row.uid;
                    }else {
                        name=row.nick_name;
                    };
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'){
                        img='/static/images/unknown.png';
                    }else {
                        img=row.photo_url;
                    };
                    if (row.text==''||row.text=='null'||row.text=='unknown'){
                        txt='暂无内容';
                    }else {
                        txt=row.text;
                    };
                    if (row.timestamp==''||row.timestamp=='null'||row.timestamp=='unknown'){
                        postTime = '未知';
                    }else {
                        postTime = getLocalTime(row.timestamp);
                    };
                    if (row.timestamp_set==''||row.timestamp_set=='null'||row.timestamp_set=='unknown'){
                        retweedTime = '未知';
                    }else {
                        retweedTime = getLocalTime(row.timestamp_set);
                    };
                    if (row.compute_status == 0) {
                        $_status = '未转发'
                    } else if (row.compute_status == 1) {
                        $_status = '已转发'
                    } else {
                        $_status = '未知'
                    };
                    var str=
                        '<div class="post_perfect" style="margin: 10px 0;width: 950px;">'+
                        '   <div class="post_center-hot">'+
                        '       <img src="'+img+'" class="center_icon">'+
                        '       <div class="center_rel">'+
                        '           <a class="center_1" href="###" style="color: #f98077;">'+name+'</a>'+
                        '           <a class="center_1" href="###" style="color: blanchedalmond;"><i class="icon icon-time"></i>&nbsp;微博发布时间：'+postTime+'</a>&nbsp;&nbsp;'+
                        '           <a class="center_1" href="###" style="color: blanchedalmond;"><i class="icon icon-time"></i>&nbsp;微博转发时间：'+retweedTime+'</a>&nbsp;&nbsp;'+
                        '           <a class="center_1" href="###" style="color: blanchedalmond;"><i class="icon icon-time"></i>&nbsp;转发状态：'+$_status+'</a>&nbsp;&nbsp;'+
                        '           <div class="center_2" style="text-align: left;margin: 10px 0;">'+txt+'</div>'+
                        '       </div>'+
                        '   </div>'+
                        '</div>';
                    return str;
                }
            },
        ],
    });
    $('#follow_forward p').slideUp(700);
}
var mainUserUid=[];
function focus_main(data) {
    $('#focus_main p').show();
    $('#focus_main').bootstrapTable('load', data);
    $('#focus_main').bootstrapTable({
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 2,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "",//标题
                field: "select",
                checkbox: true,
                align: "center",//水平
                valign: "middle"//垂直
            },
            {
                title: "头像",//标题
                field: "photo_url",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'){
                        return '<img src="/static/images/unknown.png" style="width: 30px;height: 30px;"/>'
                    }else {
                        return '<img src="'+row.photo_url+'" style="width: 30px;height: 30px;"/>'
                    };
                }
            },
            {
                title: "用户全名",//标题
                field: "nick_name",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.nick_name==''||row.nick_name=='null'||row.nick_name=='unknown'){
                        return row.uid;
                    }else {
                        return row.nick_name;
                    };
                }
            },
            {
                title: "性别",//标题
                field: "sex",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.sex==''||row.sex=='null'||row.sex=='unknown'){
                        return '未知';
                    }else {
                        if (row.sex==1){return '男'}else if (row.sex==2){return '女'}else{return '未知'}
                    };
                }
            },
            {
                title: "年龄",//标题
                field: "sex",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.sex==''||row.sex=='null'||row.sex=='unknown'){
                        return '未知';
                    }else {
                        if (row.sex==1){return '男'}else if (row.sex==2){return '女'}else{return '未知'}
                    };
                }
            },
            {
                title: "注册时间",//标题
                field: "sex",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.sex==''||row.sex=='null'||row.sex=='unknown'){
                        return '未知';
                    }else {
                        if (row.sex==1){return '男'}else if (row.sex==2){return '女'}else{return '未知'}
                    };
                }
            },
            {
                title: "位置",//标题
                field: "user_location",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.user_location==''||row.user_location=='null'||row.user_location=='unknown'){
                        return '未知';
                    }else {
                        return row.user_location;
                    };
                }
            },
            {
                title: "微博数",//标题
                field: "statusnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "粉丝数",//标题
                field: "fansnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "好友数",//标题
                field: "friendsnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            // {
            //     title: "操作",//标题
            //     field: "",//键名
            //     sortable: true,//是否可排序
            //     order: "desc",//默认排序方式
            //     align: "center",//水平
            //     valign: "middle",//垂直
            //     formatter:function (value, row, index) {
            //         return '<span style="display: inline-block;"><i class="icon icon-file-alt" title="查看详情"></i></span>'+
            //             '<span style="margin: 0 10px;"><i class="icon icon-eye-close" title="取消关注"></i></span>'+
            //             '<span style="display: inline-block;"><i class="icon icon-trash" title="删除"></i></span>'
            //     }
            // },
        ],
        onCheck:function (row) {
            mainUserUid.push(row.uid);_judge()
        },
        onUncheck:function (row) {
            mainUserUid.removeByValue(row.uid);_judge()
        },
        onCheckAll:function (row) {
            mainUserUid.push(row.uid);_judge()
        },
        onUncheckAll:function (row) {
            mainUserUid.removeByValue(row.uid);_judge()
        },
    });
    $('#focus_main p').slideUp(700);
}
function _judge() {
    if (mainUserUid.length==0){
        $('.reportNote-2 span.del_user').addClass('disableCss');
    }else {
        $('.reportNote-2 span.del_user').removeClass('disableCss');
    }

}
$('.reportNote-2 span.del_user').on('click',function () {
    var del_url='/twitter_xnr_operate/un_trace_follow/?xnr_user_no='+ID_Num+'&uid_string='+mainUserUid.join('，');
    public_ajax.call_request('get',del_url,postYES)
});
//添加
$('#addHeavyUser .demo-label input').on('click',function () {
    var param=$(this).val();
    if (param=='uid_string'){
        $('#addHeavyUser .heavy-2').text('UID：');
        $('#addHeavyUser .heavy-3').attr('placeholder','请输入人物UID（多个用逗号分隔）');
    }else {
        $('#addHeavyUser .heavy-2').text('人物昵称：');
        $('#addHeavyUser .heavy-3').attr('placeholder','请输入人物昵称（多个用逗号分隔）');
    }
});
function addHeavySure() {
    var uid_name=$('#addHeavyUser .heavy-3').val().toString().replace(/,/g,'，');
    if (!uid_name){
        $('#pormpt p').text('输入内容不能为空。');
        $('#pormpt').modal('show');
    }else {
        var m=$('#addHeavyUser input:radio[name="heavy"]:checked').val();
        var useradd_url;
        if(m=='uid_string'){
            var reg = new RegExp("^[0-9]*$");
            if(reg.test(m)){
                useradd_url='/twitter_xnr_operate/trace_follow/?xnr_user_no='+ID_Num+'&'+m+'='+uid_name;
            }else {
                $('#pormpt p').text('UID为数字。');
                $('#pormpt').modal('show');
            }
        }else {
            useradd_url='/twitter_xnr_operate/trace_follow/?xnr_user_no='+ID_Num+'&'+m+'='+uid_name;
        }
        public_ajax.call_request('get',useradd_url,addSuccess)
    }
}
function addSuccess(data) {
    if (data[0]||data){
        public_ajax.call_request('get',focus_main_url,focus_main);
        $('#pormpt p').text('添加成功。');
        $('#pormpt').modal('show');
    }else {
        $('#pormpt p').text('添加失败，请检查输入的UID或昵称要统一。');
        $('#pormpt').modal('show');
    }
}
//=========跟踪转发==完=========

//====================
var operateType;
function obtain(t) {
    if (t == 'o'){
        operateType='daily_post';
    }else if (t=='r'){
        operateType='hot_post';
    }else if (t== 'c'){
        operateType='business_post';
    }
}
//actType=$('#myTabs li.active a').text().toString().trim();
$('#sure_post').on('click',function () {
    obtain('o');
    var txt=$('#post-2-content').text().toString().replace(/\s+/g, ""),middle_timing='submit_tweet';
    // if (flag=='公开'){rank=0}else if (flag=='好友圈'){rank=6}if (flag=='仅自己可见'){rank=1}if (flag=='群可见'){rank=7};
    if ($("input[name='demo']")[0].checked){middle_timing='submit_timing_post_task'};
    //原创
    if (!txt){
        $('#pormpt p').text('请填写发帖内容');
        $('#pormpt').modal('show');
        return false;
    };
    var post_url_1='/twitter_xnr_operate/'+middle_timing+'/?tweet_type='+operateType+
        '&xnr_user_no='+xnrUser+'&text='+Check(txt);
    if (imgRoad.length!=0){post_url_1+='&p_url='+JSON.stringify(imgRoad);}
    if ($("input[name='demo']")[0].checked){
        if ($('.start').val() && $('.end').val()){
            var a=Date.parse(new Date($('.start').val()))/1000;
            var b=Date.parse(new Date($('.end').val()))/1000;
            var c=$('#_timing3').val();
            //var timeMath=Math.random()*(b-a)+a;
            post_url_1+='&post_time_sts='+a+'&post_time_ets='+b+'&remark='+c;
        }else {
            $('#pormpt p').text('因为您是定时发送，所以请填写好您定制的时间。');
            $('#pormpt').modal('show');
        }
    }
    // if (rank==7){post_url_1+='&rankid='+rankidList.join(',')};
    public_ajax.call_request('get',post_url_1,postYES)
});
//群可见的情况
// var rankidList=[];
// function groupSure() {
//     $("#grouplist input:checkbox[name='gg']:checked").each(function (index,item) {
//         rankidList.push('1022:230491'+$(this).val());
//     });
// }

//语料推荐
var defalutWeiboUrl='/weibo_xnr_operate/daily_recommend_tweets/?theme=旅游&sort_item=timestamp';
public_ajax.call_request('get',defalutWeiboUrl,defalutWords);
$('.everyday-2 .ed-2-1 input:radio[name="theme"]').on('click',function () {
    //var d=$('.everyday-2 .ed-2-2 .demo-radio');
    // for(var e=0;e<d.length;e++){if(d[e].checked) {d[e].checked=false;}};
    var the=$(this).val();
    var theSort=$('.everyday-2 .ed-2-2 input:radio[name="th"]:checked').val();
    var the_url='/weibo_xnr_operate/daily_recommend_tweets/?theme='+the+'&sort_item='+theSort;
    public_ajax.call_request('get',the_url,defalutWords)
});
$('.everyday-2 .ed-2-2 .demo-radio').on('click',function () {
    var TH=$(this).val();
    var the=$('.everyday-2 .ed-2-1 input:radio[name="theme"]:checked').val();
    var TH_url='/weibo_xnr_operate/daily_recommend_tweets/?theme='+the+'&sort_item='+TH;
    public_ajax.call_request('get',TH_url,defalutWords)
});
function defalutWords(data) {
    $('#defaultWeibo p').show();
    $('#defaultWeibo').bootstrapTable('load', data);
    $('#defaultWeibo').bootstrapTable({
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 2,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var name,txt,img;
                    if (row.nick_name==''||row.nick_name=='null'||row.nick_name=='unknown'){
                        name=row.uid;
                    }else {
                        name=row.nick_name;
                    };
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'){
                        img='/static/images/unknown.png';
                    }else {
                        img=row.photo_url;
                    };
                    if (row.text==''||row.text=='null'||row.text=='unknown'){
                        txt='暂无内容';
                    }else {
                        txt=row.text;
                    };
                    var str=
                        '<div class="post_perfect">'+
                        '   <div class="post_center-hot">'+
                        '       <img src="'+img+'" class="center_icon">'+
                        '       <div class="center_rel">'+
                        '           <a class="center_1" href="###" style="color: #f98077;">'+name+'</a>'+
                        '           <span class="time" style="font-weight: 900;color:blanchedalmond;"><i class="icon icon-time"></i>&nbsp;&nbsp;'+getLocalTime(row.timestamp)+'</span>  '+
                        '           <i class="tid" style="display: none;">'+row.tid+'</i>'+
                        '           <i class="uid" style="display: none;">'+row.uid+'</i>'+
                        '           <i class="timestamp" style="display: none;">'+row.timestamp+'</i>'+
                        '           <span class="center_2">'+txt+
                        '           </span>'+
                        '           <div class="center_3">'+
                        // '               <span class="cen3-4" onclick="joinlab(this)"><i class="icon icon-upload-alt"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '               <span class="cen3-5" onclick="copyPost(this)"><i class="icon icon-copy"></i>&nbsp;&nbsp;复制</span>'+
                        '               <span class="cen3-1" onclick="retweet(this,\'daily_post\')"><i class="icon icon-share"></i>&nbsp;&nbsp;转推（<b class="forwarding">'+row.share+'</b>）</span>'+
                        '               <span class="cen3-2" onclick="showInput(this)"><i class="icon icon-comments-alt"></i>&nbsp;&nbsp;评论（<b class="comment">'+row.comment+'</b>）</span>'+
                        '               <span class="cen3-3" onclick="thumbs(this)"><i class="icon icon-thumbs-up"></i>&nbsp;&nbsp;喜欢</span>'+
                        '               <span class="cen3-5" onclick="emailThis(this)"><i class="icon icon-envelope"></i>&nbsp;&nbsp;私信</span>'+
                        '               <span class="cen3-6" onclick="translateWord(this)"><i class="icon icon-exchange"></i>&nbsp;&nbsp;翻译</span>'+
                        '               <span class="cen3-9" onclick="robot(this)"><i class="icon icon-github-alt"></i>&nbsp;&nbsp;机器人回复</span>'+
                        '               <span class="cen3-7" onclick="joinlab(this)"><i class="icon icon-upload-alt"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '           </div>'+
                        '           <div class="forwardingDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="forwardingIput" placeholder="转推内容"/>'+
                        '               <span class="sureFor" onclick="forwardingBtn()">转推</span>'+
                        '           </div>'+
                        '           <div class="commentDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="comtnt" placeholder="评论内容"/>'+
                        '               <span class="sureCom" onclick="comMent(this,\'daily_post\')">评论</span>'+
                        '           </div>'+
                        '           <div class="emailDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="infor" placeholder="私信内容"/>'+
                        '               <span class="sureEmail" onclick="letter(this)">发送</span>'+
                        '           </div>'+
                        '       </div>'+
                        '   </div>'+
                        '</div>';
                    return str;
                }
            },
        ],
    });
    $('#defaultWeibo p').slideUp(700);
    $('.defaultWeibo .search .form-control').attr('placeholder','输入关键词快速搜索相关微博（回车搜索）');
}
//复制内容
function copyPost(_this) {
    var txt = $(_this).parent().prev().text();
    $('#post-2-content').append(txt);
}

//操作返回结果
function postYES(data) {
    var f='';
    if (data[0]||data){
        f='操作成功';
    }else {
        f='操作失败';
    }
    $('#pormpt p').text(f);
    $('#pormpt').modal('show');
}

//=========热点跟随===========
$('#theme-2 .demo-label input').on('click',function () {
    var the=$(this).val();
    var theSort=$('#theme-3 .demo-label input:radio[name="theme3"]:checked').val();
    var the_url='/twitter_xnr_operate/hot_recommend_tweets/?topic_field='+the+'&sort_item='+theSort;
    public_ajax.call_request('get',the_url,hotWeibo)
});
$('#theme-3 .demo-label input').on('click',function () {
    var the=$(this).val();
    var theSort=$('#theme-2 .demo-label input:radio[name="theme2h"]:checked').val();
    var the_url='/twitter_xnr_operate/hot_recommend_tweets/?topic_field='+theSort+'&sort_item='+the;
    public_ajax.call_request('get',the_url,hotWeibo)
});
var hotWeiboUrl='/twitter_xnr_operate/hot_recommend_tweets/?topic_field=民生类_法律&sort_item=timestamp';
// public_ajax.call_request('get',hotWeiboUrl,hotWeibo);
function hotWeibo(data) {
    $('#defaultWeibo2 p').show();
    $('#defaultWeibo2').bootstrapTable('load', data);
    $('#defaultWeibo2').bootstrapTable({
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 2,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var name,txt,img;
                    if (row.nick_name==''||row.nick_name=='null'||row.nick_name=='unknown'){
                        name=row.uid;
                    }else {
                        name=row.nick_name;
                    };
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'){
                        img='/static/images/unknown.png';
                    }else {
                        img=row.photo_url;
                    };
                    if (row.text==''||row.text=='null'||row.text=='unknown'){
                        txt='暂无内容';
                    }else {
                        txt=row.text;
                    };
                    var str=
                        '<div class="post_perfect">'+
                        '   <div id="post_center-hot">'+
                        '       <img src="'+img+'" alt="" class="center_icon">'+
                        '       <div class="center_rel">'+
                        '           <a class="center_1" href="###" style="color: #f98077;">'+name+'</a>'+
                        '           <span class="time" style="font-weight: 900;color: blanchedalmond;"><i class="icon icon-time"></i>&nbsp;&nbsp;'+getLocalTime(row.timestamp)+'</span>  '+
                        '           <i class="tid" style="display: none;">'+row.tid+'</i>'+
                        '           <i class="uid" style="display: none;">'+row.uid+'</i>'+
                        '           <i class="timestamp" style="display: none;">'+row.timestamp+'</i>'+
                        '           <span class="center_2">'+txt+
                        '           </span>'+
                        // '           <div class="center_3_top" >' +
                        // '               <span onclick="retweet(this)"><i class="icon icon-share"></i>&nbsp;&nbsp;转发数<b class="forwarding">（'+row.retweeted+'）</b></span>'+
                        // '               <span onclick="showInput(this)"><i class="icon icon-comments-alt"></i>&nbsp;&nbsp;评论数<b class="comment">（'+row.comment+'）</b></span>'+
                        // '               <span onclick="thumbs(this)"><i class="icon icon-thumbs-up"></i>&nbsp;&nbsp;赞</span>'+
                        // '           </div>'+
                        '           <div class="center_3">'+
                        // '               <span onclick="joinlab(this)"><i class="icon icon-upload-alt" title="加入语料库"></i>&nbsp;&nbsp;加入语料库</span>'+
                        // '               <span onclick="simliar(this)"><i class="icon icon-check" title="相似推文"></i>&nbsp;&nbsp;相似推文</span>'+
                        // '               <span onclick="contantREM(this)"><i class="icon icon-reorder" title="内容推荐"></i>&nbsp;&nbsp;内容推荐</span>'+
                        '               <span onclick="related(this)" title="事件子观点及相关微博"><i class="icon icon-stethoscope"></i>&nbsp;&nbsp;事件子观点及相关微博</span>'+
                        '               <span onclick="copyPost(this)" title="复制"><i class="icon icon-copy"></i>&nbsp;&nbsp;复制</span>'+
                        '               <span onclick="retweet(this,\'hot_post\')" title="转推数"><i class="icon icon-share"></i>&nbsp;&nbsp;转推&nbsp;（<b class="forwarding">'+row.share+'</b>）</span>'+
                        '               <span onclick="showInput(this)" title="评论数"><i class="icon icon-comments-alt"></i>&nbsp;&nbsp;评论&nbsp;（<b class="comment">'+row.comment+'</b>）</span>'+
                        '               <span onclick="thumbs(this)" title="喜欢"><i class="icon icon-thumbs-up"></i>&nbsp;&nbsp;喜欢</span>'+
                        '               <span class="cen3-5" title="私信" onclick="emailThis(this)"><i class="icon icon-envelope"></i>&nbsp;&nbsp;私信</span>'+
                        '               <span class="cen3-6" title="翻译" onclick="translateWord(this)"><i class="icon icon-exchange"></i>&nbsp;&nbsp;翻译</span>'+
                        '               <span class="cen3-7" title="加入语料库" onclick="joinlab(this)"><i class="icon icon-upload-alt"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '           </div>'+
                        '           <div class="forwardingDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="forwardingIput" placeholder="转推内容"/>'+
                        '               <span class="sureFor" onclick="forwardingBtn()">转推</span>'+
                        '           </div>'+
                        '           <div class="commentDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="comtnt" placeholder="评论内容"/>'+
                        '               <span class="sureCom" onclick="comMent(this,\'hot_post\')">评论</span>'+
                        '           </div>'+
                        '           <div class="emailDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="infor" placeholder="私信内容"/>'+
                        '               <span class="sureEmail" onclick="letter(this)">发送</span>'+
                        '           </div>'+
                        '        </div>'+
                        '        <div style="margin: 10px 0;">'+
                        '           <input type="text" class="point-view-1" placeholder="多个关键词请用逗号分开"/>'+
                        '           <button type="button" onclick="submitViews(this)" class="btn btn-primary btn-xs point-view-2" ' +
                        'style="height: 26px;position: relative;top: -1px;">提交子观点任务</button>'+
                        '        </div>'+
                        '   </div>'+
                        '</div>';
                    return str;
                }
            },
        ],
    });
    $('#defaultWeibo2 p').slideUp(700);
    $('.defaultWeibo2 .search .form-control').attr('placeholder','输入关键词快速搜索相关微博（回车搜索）');
}

//新建内容推荐  和  提交子观点
function submitViews(_this) {
    var taskID=$(_this).parents('.post_perfect').find('.tid').text();
    var vale=$(_this).prev().val();
    if (vale==''){
        $('#pormpt p').text('观点不能为空。');
        $('#pormpt').modal('show');
    }else {
        var conViewsUrl='/twitter_xnr_operate/submit_hot_keyword_task/?xnr_user_no='+xnrUser+'&task_id='+taskID+'&keywords_string='+vale.toString().replace(/,/g,'，')+
            '&submit_user='+admin;
        public_ajax.call_request('get',conViewsUrl,conViews);
    }
}
function conViews(data) {
    var x='';
    if (data){
        x='提交成功';
    }else {
        x='提交失败';
    }
    $('#pormpt p').text(x);
    $('#pormpt').modal('show');
}
//内容推荐
function contantREM(_this) {
    var taskID=$(_this).parents('.post_perfect').find('.tid').text();
    var calNot_url='/twitter_xnr_operate/hot_content_recommend/?xnr_user_no='+xnrUser+'&task_id='+taskID;
    public_ajax.call_request('get',calNot_url,calNot);
}
//内容推荐中的微博直接发布还是定时发布
function sureTiming(_this) {
    var a=$(_this).parents('.post_perfect').find('input:radio[class=_timing_recommend]:checked').val();
    var t=$(_this).parent().prev().text();
    var CNpost_url='';
    if (a=='zhi'){
        CNpost_url='/twitter_xnr_operate/submit_tweet/?tweet_type='+operateType+'&xnr_user_no='+xnrUser+'&text='+t;
    }else {
        var m =$('#recommend-2 .START').val();
        var n =$('#recommend-2 .ENDING').val();
        if (m&&n&&(m<n)){
            var a=Date.parse(new Date($('.START').val()))/1000;
            var b=Date.parse(new Date($('.ENDING').val()))/1000;
            CNpost_url+='&post_time_sts='+a+'&post_time_ets='+b;
        }else {
            $('#pormpt p').text('因为您是定时发送，所以请填写好您定制的时间,并保证开始时间小于结束时间。');
            $('#pormpt').modal('show');
        }
    }
    public_ajax.call_request('get',CNpost_url,conViews);
}
var calI=0;
function calNot(data) {
    if (data=='正在计算'||data=='尚未计算'){
        $('#pormpt p').text('正在计算...');
        $('#pormpt').modal('show');
    }else {
        $('#recommend-2 p').show();
        $('#recommend-2').bootstrapTable('load', data);
        $('#recommend-2').bootstrapTable({
            data:data,
            search: true,//是否搜索
            pagination: true,//是否分页
            pageSize: 2,//单页记录数
            pageList: [15,20,25],//分页步进值
            sidePagination: "client",//服务端分页
            searchAlign: "left",
            searchOnEnterKey: false,//回车搜索
            showRefresh: false,//刷新按钮
            showColumns: false,//列选择按钮
            buttonsAlign: "right",//按钮对齐方式
            locale: "zh-CN",//中文支持
            detailView: false,
            showToggle:false,
            sortName:'bci',
            sortOrder:"desc",
            columns: [
                {
                    title: "",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        var txt;
                        if (row==''||row=='null'||row=='unknown'){
                            txt='暂无内容';
                        }else {
                            txt=row;
                        };
                        var str=
                            '<div class="post_perfect">'+
                            '   <div id="post_center-recommend">'+
                            '       <img src="/static/images/post-6.png" alt="" class="center_icon">'+
                            '       <div class="center_rel">'+
                            '           <span class="center_2">'+txt+ '</span>'+
                            '           <div class="center_3" style="margin: 10px 0;padding-top: 10px;border-top:1px solid silver;">'+
                            '               <label class="demo-label">'+
                            '                   <input class="demo-radio" type="radio" name="gh'+calI+'" value="zhi" checked>'+
                            '                   <span class="demo-checkbox demo-radioInput"></span> 直接发布'+
                            '               </label>'+
                            '               <label class="demo-label">'+
                            '                   <input class="demo-radio" type="radio" value="time" name="gh'+calI+'">'+
                            '                   <span class="demo-checkbox demo-radioInput"></span> 定时发布'+
                            '               </label>'+
                            '               <input type="text" size="16" class="form_datetime _timing_recommend START" placeholder="选择开始时间" style="line-height:13px;font-size: 10px;'+
                            '                       padding:3px 4px;border: 1px solid silver;background: transparent;text-align: center;">'+
                            '               <input type="text" size="16" class="form_datetime _timing_recommend ENDING" placeholder="选择截止时间" style="line-height:13px;font-size: 10px;'+
                            '                       padding:3px 4px;border: 1px solid silver;background: transparent;text-align: center;">'+
                            '               <button type="button" class="btn btn-info btn-xs" class="sure_not_timing" onclick="sureTiming(_this)">发布</button>'+
                            '           </div>'+
                            '       </div>'+
                            '   </div>'+
                            '</div>';
                        return str;
                        calI++;
                    }
                },
            ],
        });
        $('#recommend-2 p').slideUp(700);
        $('.recommend-2 .search .form-control').attr('placeholder','输入关键词快速搜索相关微博（回车搜索）');
        $(".form_datetime._timing_recommend").datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            pickerPosition: "bottom-left"
        });
        // $('.START').on('changeDate', function(ev){
        //     $('.ENDING').datetimepicker('setStartDate',ev.date);
        // });
        // $('.ENDING').on('changeDate', function(ev){
        //     $('.START').datetimepicker('setEndDate',ev.date);
        // });
        $('#content_recommend').modal('show');
    }
}
//相似微博
function simliar(_this) {
    var str='';
    str+=
        '<label class="demo-label">'+
        '   <input class="demo-radio" type="checkbox" name="mem" value="">'+
        '   <span class="demo-checkbox demo-radioInput"></span> '+
        '</label>'
}
//事件子观点及相关微博
function related(_this) {
    var taskID=$(_this).parents('.post_perfect').find('.tid').text();
    var relatedUrl='/twitter_xnr_operate/hot_subopinion/?xnr_user_no='+xnrUser+'&task_id='+taskID;
    public_ajax.call_request('get',relatedUrl,relatedWEIbo);
}
function relatedWEIbo(data) {
    if (isEmptyObject(data)){
        $('#pormpt p').text('当前输入关键词暂无分析结果，请尝试输入新的关键词。');
        $('#pormpt').modal('show');
        return false;
    }
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    if (reg.test(data)){
        $('#pormpt p').text(data);
        $('#pormpt').modal('show');
    }else {
        $('#thWeibo p').show();
        var dataNew=[];
        for (var key in data){
            var ls={};
            ls['name']=key;
            ls['weibo']=data[key];
            dataNew.push(ls);
        };
        $('#thWeibo').bootstrapTable('load', dataNew);
        $('#thWeibo').bootstrapTable({
            data:dataNew,
            search: true,//是否搜索
            pagination: true,//是否分页
            pageSize: 1,//单页记录数
            pageList: [5,10],//分页步进值
            sidePagination: "client",//服务端分页
            searchAlign: "left",
            searchOnEnterKey: false,//回车搜索
            showRefresh: false,//刷新按钮
            showColumns: false,//列选择按钮
            buttonsAlign: "right",//按钮对齐方式
            locale: "zh-CN",//中文支持
            detailView: false,
            showToggle:false,
            sortName:'bci',
            sortOrder:"desc",
            columns: [
                {
                    title: "子观点",//标题
                    field: "name",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                },
                {
                    title: "子观点代表微博",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        var str='';
                        for (var r=0;r<row.weibo.length;r++){
                            str+=
                                '<div class="post_perfect" style="text-align: left;">'+
                                '   <div class="post_center-hot">'+
                                '       <img src="/static/images/post-6.png" class="center_icon">'+
                                '       <div class="center_rel">'+
                                '           <span class="center_2">'+row.weibo[r]+'</span>'+
                                '       </div>'+
                                '   </div>'+
                                '</div>';
                        }
                        return str;
                    }

                },
            ],
        });
        $('#thWeibo p').slideUp(700);
        $('#thingsweibo').modal('show');
    }
}

//======业务发帖=======
$('#theme-4 .demo-label input').on('click',function () {
    var the=$(this).val();
    var the_url='/twitter_xnr_operate/bussiness_recomment_tweets/?xnr_user_no='+xnrUser+'&sort_item='+the;
    public_ajax.call_request('get',the_url,businessWeibo)
});
var busWeiboUrl='/twitter_xnr_operate/bussiness_recomment_tweets/?xnr_user_no='+xnrUser+'&sort_item=timestamp';
// public_ajax.call_request('get',busWeiboUrl,businessWeibo);
function businessWeibo(data) {
    $('#defaultWeibo3 p').show();
    $('#defaultWeibo3').bootstrapTable('load', data);
    $('#defaultWeibo3').bootstrapTable({
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 2,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var name,txt,img;
                    if (row.nick_name==''||row.nick_name=='null'||row.nick_name=='unknown'){
                        name=row.uid;
                    }else {
                        name=row.nick_name;
                    };
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'){
                        img='/static/images/unknown.png';
                    }else {
                        img=row.photo_url;
                    };
                    if (row.text==''||row.text=='null'||row.text=='unknown'){
                        txt='暂无内容';
                    }else {
                        txt=row.text;
                    };
                    var str=
                        '<div class="post_perfect">'+
                        '   <div class="post_center-business">'+
                        '       <img src="'+img+'" class="center_icon">'+
                        '       <div class="center_rel">'+
                        '           <a class="center_1" href="###" style="color: #f98077;">'+name+'</a>：'+
                        '           <span class="time" style="font-weight: 900;color:blanchedalmond;"><i class="icon icon-time"></i>&nbsp;&nbsp;'+getLocalTime(row.timestamp)+'</span>  '+
                        '           <i class="tid" style="display: none;">'+row.tid+'</i>'+
                        '           <i class="uid" style="display: none;">'+row.uid+'</i>'+
                        '           <i class="timestamp" style="display: none;">'+row.timestamp+'</i>'+
                        '           <span class="center_2">'+txt+
                        '           </span>'+
                        '           <div class="center_3">'+
                        // '               <span class="cen3-4" onclick="joinlab(this)"><i class="icon icon-upload-alt"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '               <span class="cen3-5" onclick="copyPost(this)"><i class="icon icon-copy"></i>&nbsp;&nbsp;复制</span>'+
                        '               <span class="cen3-1" onclick="retweet(this,\'business_post\')"><i class="icon icon-share"></i>&nbsp;&nbsp;转推（<b class="forwarding">'+row.share+'</b>）</span>'+
                        '               <span class="cen3-2" onclick="showInput(this)"><i class="icon icon-comments-alt"></i>&nbsp;&nbsp;评论（<b class="comment">'+row.comment+'</b>）</span>'+
                        '               <span class="cen3-3" onclick="thumbs(this)"><i class="icon icon-thumbs-up"></i>&nbsp;&nbsp;喜欢</span>'+
                        '               <span class="cen3-5" onclick="emailThis(this)"><i class="icon icon-envelope"></i>&nbsp;&nbsp;私信</span>'+
                        '               <span class="cen3-6" onclick="translateWord(this)"><i class="icon icon-exchange"></i>&nbsp;&nbsp;翻译</span>'+
                        '               <span class="cen3-9" onclick="robot(this)"><i class="icon icon-github-alt"></i>&nbsp;&nbsp;机器人回复</span>'+
                        '               <span class="cen3-7" onclick="joinlab(this)"><i class="icon icon-upload-alt"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '           </div>'+
                        '           <div class="forwardingDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="forwardingIput" placeholder="转推内容"/>'+
                        '               <span class="sureFor" onclick="forwardingBtn()">转推</span>'+
                        '           </div>'+
                        '           <div class="commentDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="comtnt" placeholder="评论内容"/>'+
                        '               <span class="sureCom" onclick="comMent(this,\'business_post\')">评论</span>'+
                        '           </div>'+
                        '           <div class="emailDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="infor" placeholder="私信内容"/>'+
                        '               <span class="sureEmail" onclick="letter(this)">发送</span>'+
                        '           </div>'+
                        '       </div>'+
                        '   </div>'+
                        '</div>';
                    return str;
                }
            },
        ],
    });
    $('#defaultWeibo3 p').slideUp(700);
    $('.defaultWeibo3 .search .form-control').attr('placeholder','搜索关键词或子观点相关的微博（回车搜索）');
}
