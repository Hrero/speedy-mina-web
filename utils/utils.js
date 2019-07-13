const zero = (time) => {
    return Number(time) < 10? '0' + time: time;
}
export default  {
    isObjNull: (data) => {
        return (JSON.stringify(data) == "{}")
    },
    getDateHm: () => {
        let date = new Date(); // 实例一个时间对象；
        let hour = date.getHours(); // 获取系统时间
        let minute = date.getMinutes(); // 分
        hour = hour < 10? '0' + hour: hour;
        minute = minute < 10? '0' + minute: minute;
        return hour + ':' + minute
    },
    getTimeDay: (params) => {
        let date = new Date(params);
        let time = null;
        let getMonth = date.getMonth() + 1;
        let getDate = date.getDate() // 天
        let getHours = date.getHours() // 小时
        let getMinutes = date.getMinutes() // 分
        let nowDate = new Date();
        let nowDategetMonth = nowDate.getMonth() + 1;
        let nowDategetDate = nowDate.getDate() // 天
        console.log(getMonth == nowDategetMonth, getDate == nowDategetDate)
        console.log(getMonth, nowDategetMonth, getDate, nowDategetDate)
        if (getMonth == nowDategetMonth && getDate == nowDategetDate) {
            time = `${zero(getHours)}:${zero(getMinutes)}`
        } else {
            time = `${zero(getMonth)}-${zero(getDate)}`
        }
        return time
    },
};