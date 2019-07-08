function formatMoney(value) {
    let s = value;
    if (!s) return '0.00';
    if (/[^0-9\.]/.test(s)) return "0.00";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    const re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return s.replace(/^\./, "0.");
}
function formatTimes(value) {
    let nowTime = new Date();
    let timeNum = nowTime.getTime();
    let daysTime = 86400000;
    let leaveTime = timeNum - value;
    if( leaveTime > 5 * daysTime ) {
        const thisTime = new Date(value);
        let year = thisTime.getFullYear();
        let month = change(thisTime.getMonth()+1);
        let day = change(thisTime.getDate());
        return year + '.' + month + '.' + day;
    } else if (leaveTime > 3 * daysTime ) {
        return '3天前';
    } else if (leaveTime > 2 * daysTime) {
        return '2天前';
    } else if (leaveTime >  daysTime) {
        return '昨天';
    } else {
        const hours = Math.round(leaveTime / 3600000);
        if ( hours > 0 ) return hours + '小时前';
        const mins = Math.round(leaveTime / 60000);
        if ( mins > 0 ) return mins + '分钟前';
        return '刚刚';
    }
}
function change(t){
    if(t<10){
        return "0"+t;
    }else{
        return t;
    }
}

function padLeftZero(str){
    return ('00' + str).substr(str.length);
}

function dateFormat(dateValue, fmt){
    let html = '--';
    if(dateValue) {
        let date = new Date(dateValue);
        html = fmt;
        if (/(y+)/.test(html)) {
            html = html.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length));
        }

        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(html)) {
                let str = o[k].toString();
                html = html.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
            }
        }
    }
    return html;
}

export default {
    formatMoney: formatMoney,
    formatTimes: formatTimes,
    formatDate: dateFormat,
    kuaidi:[
        {"id":1,"apiType":0,"mailType":"shunfeng","mailCompany":"顺丰快递"},
        {"id":2,"apiType":0,"mailType":"huitongkuaidi","mailCompany":"百世汇通"},
        {"id":3,"apiType":0,"mailType":"shentong","mailCompany":"申通快递"},
        {"id":4,"apiType":0,"mailType":"yuantong","mailCompany":"圆通速递"},
        {"id":5,"apiType":0,"mailType":"yunda","mailCompany":"韵达快运"},
        {"id":6,"apiType":0,"mailType":"zhongtong","mailCompany":"中通速递"},
        {"id":7,"apiType":0,"mailType":"tiantian","mailCompany":"天天快递"},
        {"id":10,"apiType":0,"mailType":"youshuwuliu","mailCompany":"优速物流"},
        {"id":100,"apiType":0,"mailType":"ems","mailCompany":"EMS"},
        {"id":147,"apiType":0,"mailType":"dhl","mailCompany":"DHL"},
        {"id":148,"apiType":0,"mailType":"dhlen","mailCompany":"DHL(国际件)"},
        {"id":150,"apiType":0,"mailType":"quanfengkuaidi","mailCompany":"全峰快递"},
        {"id":152,"apiType":0,"mailType":"lianbangkuaidi","mailCompany":"联邦快递"},
        {"id":153,"apiType":0,"mailType":"fedex","mailCompany":"联邦快递（国际件）"},
        {"id":154,"apiType":0,"mailType":"guotongkuaidi","mailCompany":"国通快递"},
        {"id":155,"apiType":0,"mailType":"debangwuliu","mailCompany":"德邦物流"},
        {"id":157,"apiType":0,"mailType":"kuaijiesudi","mailCompany":"快捷速递"},
        {"id":158,"apiType":0,"mailType":"zhaijisong","mailCompany":"宅急送"},
        {"id":159,"apiType":0,"mailType":"rufengda","mailCompany":"如风达"},
        {"id":160,"apiType":0,"mailType":"jd","mailCompany":"京东物流"}
    ],
    iconStatus: [
        {name:'已取消',icon:'icon_sa_yiquxiao',newName:'已取消'},
        {name:'审核不通过',icon:'icon_sa_yiquxiao',newName:'已关闭'},
        {name:'待审核',icon:'icon_sa_daishenghe',newName:'待审核'},
        {name:'待支付',icon:'icon_sa_daizhifu',newName:'待支付'},
        {name:'待签约',icon:'icon_sa_daiqianyue',newName:'待审核'},
        {name:"支付成功,正在配货",icon:'icon_sa_daifahuo',newName:'待审核'},
        {name:'已发货，货物正在配送途中',icon:'icon_sa_daifahuo',newName:'待收货'},
        {name:'回收中',icon:'',newName:'回收中'},
        {name:'订单已到期',icon:'icon_sa_daihuishou',newName:'订单已到期'},
        {name:'订单即将到期',icon:'',newName:'订单即将到期'},
        {name:'租赁中',icon:'icon_sa_zulingzhong',newName:'租用中'},
        {name:'已完结',icon:'icon_sa_yiwangjie', newName: '已完结'},
        {name:'审核失败',icon:'', newName: '已关闭'},
        {name:'线下转账待确认',icon:'', newName: '线下转账待确认'},
        {name:'清算完毕，待缴费',icon:'', newName: '清算完毕，待缴费'},
        {name:'待检测',icon:'', newName: '待检测'}
    ]
}