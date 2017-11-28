var time=Date.parse(new Date())/1000;//1480176000
$('#typelist .demo-radio').on('click',function () {
    var _val=$(this).val(),time=Date.parse(new Date())/1000;
    var weiboUrl='/weibo_xnr_warming/show_speech_warming/?xnr_user_no='+ID_Num+'&show_type='+_val+'&day_time='+time;
    public_ajax.call_request('get',weiboUrl,weibo);
})
var weiboUrl='/weibo_xnr_warming/show_speech_warming/?xnr_user_no='+ID_Num+'&show_type=0&day_time='+time;
public_ajax.call_request('get',weiboUrl,weibo);
function weibo(data) {
    $('#weiboContent').bootstrapTable('load', data);
    $('#weiboContent').bootstrapTable({
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
                    var item=row;
                    var name,text,time;
                    if (item.user_name==''||item.user_name=='null'||item.user_name=='unknown'||!item.user_name){
                        name=item.uid;
                    }else {
                        name=item.user_name;
                    };
                    if (item.text==''||item.text=='null'||item.text=='unknown'||!item.text){
                        text='暂无内容';
                    }else {
                        if (item.sensitive_words_string||!isEmptyObject(item.sensitive_words_string)){
                            var s=item.text;
                            var keywords=item.sensitive_words_string.split('&');
                            for (var f=0;f<keywords.length;f++){
                                s=s.toString().replace(new RegExp(keywords[f],'g'),'<b style="color:#ef3e3e;">'+keywords[f]+'</b>');
                            }
                            text=s;
                        }else {
                            text=item.text;
                        };
                    };
                    if (item.timestamp==''||item.timestamp=='null'||item.timestamp=='unknown'||!item.timestamp){
                        time='未知';
                    }else {
                        time=getLocalTime(item.timestamp);
                    };
                    var rel_str=
                        '<div class="everySpeak" style="margin: 0 auto;width: 950px;">'+
                        '        <div class="speak_center">'+
                        '            <div class="center_rel">'+
                        '                <label class="demo-label">'+
                        '                    <input class="demo-radio" type="checkbox" name="demo-checkbox">'+
                        '                    <span class="demo-checkbox demo-radioInput"></span>'+
                        '                </label>'+
                        '                <img src="/static/images/post-6.png" alt="" class="center_icon">'+
                        '                <a class="center_1" href="###">'+name+'</a>'+
                        '                <a class="mid" style="display: none;">'+item.mid+'</a>'+
                        '                <a class="uid" style="display: none;">'+item.uid+'</a>'+
                        '                <a class="timestamp" style="display: none;">'+item.timestamp+'</a>'+
                        '                <a class="sensitive" style="display: none;">'+item.sensitive+'</a>'+
                        '                <a class="sensitiveWords" style="display: none;">'+item.sensitive_words_string+'</a>'+
                        '                <span class="time" style="font-weight: 900;color:blanchedalmond;"><i class="icon icon-time"></i>&nbsp;&nbsp;'+time+'</span>  '+
                        '                <span class="center_2">'+text+
                        '                </span>'+
                        '                <div class="center_3">'+
                        // '                    <span class="cen3-1"><i class="icon icon-time"></i>&nbsp;&nbsp;'+time+'</span>'+
                        '                    <span class="cen3-2" onclick="retComLike(this)" type="get_weibohistory_retweet"><i class="icon icon-share"></i>&nbsp;&nbsp;转推（<b class="forwarding">'+item.retweeted+'</b>）</span>'+
                        '                    <span class="cen3-3" onclick="retComLike(this)" type="get_weibohistory_comment"><i class="icon icon-comments-alt"></i>&nbsp;&nbsp;回复（<b class="comment">'+item.comment+'</b>）</span>'+
                        '                    <span class="cen3-4" onclick="retComLike(this)" type="get_weibohistory_like"><i class="icon icon-thumbs-up"></i>&nbsp;&nbsp;喜欢</span>'+
                        '                    <span class="cen3-5" onclick="joinPolice(this)"><i class="icon icon-plus-sign"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '                    <span class="cen3-6" onclick="oneUP(this)"><i class="icon icon-upload-alt"></i>&nbsp;&nbsp;上报</span>'+
                        '                </div>'+
                        '               <div class="commentDown" style="width: 100%;display: none;">'+
                        '                   <input type="text" class="comtnt" placeholder="回复内容"/>'+
                        '                   <span class="sureCom" onclick="comMent(this)">回复</span>'+
                        '               </div>'+
                        '            </div>'+
                        '        </div>';
                    return rel_str;
                }
            },
        ],
    });
};

// 转发===评论===点赞
function retComLike(_this) {
    var mid=$(_this).parents('.everySpeak').find('.mid').text();
    var middle=$(_this).attr('type');
    var opreat_url;
    if (middle=='get_weibohistory_like'){
        var uid=$(_this).parents('.center_rel').find('.uid').text();
        var timestamp=$(_this).parents('.center_rel').find('.timestamp').text();
        var text=$(_this).parents('.center_rel').find('.center_2').text();
        opreat_url='/weibo_xnr_report_manage/'+middle+'/?xnr_user_no='+ID_Num+'&r_mid='+mid+'&uid='+uid+'&text='+text+
            '&timestamp='+timestamp+'&nick_name='+REL_name;
        public_ajax.call_request('get',opreat_url,postYES);
    }else if (middle=='get_weibohistory_comment'){
        $(_this).parents('.everySpeak').find('.commentDown').show();
    }else {
        var txt=$(_this).parents('.everySpeak').find('.center_2').text();
        if (txt=='暂无内容'){txt=''};
        opreat_url='/weibo_xnr_report_manage/'+middle+'/?xnr_user_no='+ID_Num+'&r_mid='+mid+'&text='+txt;
        public_ajax.call_request('get',opreat_url,postYES);
    }
}
function comMent(_this){
    var txt = $(_this).prev().val();
    var mid = $(_this).parents('.everySpeak').find('.mid').text();
    if (txt!=''){
        var post_url='/weibo_xnr_report_manage/get_weibohistory_comment/?text='+txt+'&xnr_user_no='+ID_Num+'&mid='+mid;
        public_ajax.call_request('get',post_url,postYES)
    }else {
        $('#pormpt p').text('评论内容不能为空。');
        $('#pormpt').modal('show');
    }
}
//获取信息
function getInfo(_this) {
    var alldata=[];
    var uid = $(_this).parents('.everySpeak').find('.uid').text();alldata.push(uid);
    var mid = $(_this).parents('.everySpeak').find('.mid').text();alldata.push(mid);
    var txt=$(_this).parents('.everySpeak').find('.center_2').text().toString().replace(/#/g,'%23').replace(/&/g,'%26');alldata.push(txt);
    var timestamp = $(_this).parents('.everySpeak').find('.timestamp').text();alldata.push(timestamp);
    var forwarding = $(_this).parents('.everySpeak').find('.forwarding').text();alldata.push(forwarding);
    var comment = $(_this).parents('.everySpeak').find('.comment').text();alldata.push(comment);
    var sensitive = $(_this).parents('.everySpeak').find('.sensitive').text();alldata.push(sensitive);
    var sensitiveWords = $(_this).parents('.everySpeak').find('.sensitiveWords').text().toString().replace(/&/g,'%26');alldata.push(sensitiveWords);
    return alldata;
}
//加入预警
function joinPolice(_this) {
    var info=getInfo(_this);
    var police_url='/weibo_xnr_warming/addto_speech_warming/?xnr_user_no='+ID_Num+'&uid='+info[0]+'&text='+info[2]+
        '&mid='+info[1]+'&timestamp='+info[3]+'&retweeted='+info[4]+'&comment='+info[5]+'&like=0';
    public_ajax.call_request('get',police_url,postYES)
}
//一键上报
function oneUP(_this) {
    var info=getInfo(_this);
    console.log(info)
    var allMent=[];
    allMent.push(info[1]);
    var txt=info[2].toString().replace(/#/g,'%23');allMent.push(txt);
    allMent.push(info[3]);allMent.push(info[4]);allMent.push(0);allMent.push(info[5]);
    allMent.push(info[6]);allMent.push(info[7]);

//[mid,text,timestamp,retweeted,like,comment
    var once_url='/weibo_xnr_warming/report_warming_content/?report_type=言论&xnr_user_no='+ID_Num+
        '&uid='+info[0]+'&weibo_info='+allMent.join(',');
    public_ajax.call_request('get',once_url,postYES)
}
//操作返回结果
function postYES(data) {
    var f='操作成功';
    if (!data){f='操作失败'}
    $('#pormpt p').text(f);
    $('#pormpt').modal('show');
}