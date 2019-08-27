const app = getApp();
class Person{
    constructor(name, age){
        this.socketOpen = false;
        this.heartBeatFailCount = 0;
        this.socketMsgQueue = [];
        this.heartBeatTimeOut = 10;
    }
    onConnect(callback){
        wx.connectSocket({ // socket连接穿件
            url: app.socketUrl,
            header: {
                'Content-Type': 'application/json',
                'authorization': app.userToken || '',
                'cookie': 'school=' + app.school,
                'X-Request-Version':'v2'
            },
            success: (socketRes) => {
                callback(socketRes)
                wx.hideToast()
                this.socketOpen = true;
                console.log('connect success: ', socketRes);
            },
            fail(err) {
                wx.hideToast()
                console.log('connect error: ', err)
            }
        })
        wx.onSocketError((res) => {
            this.socketOpen = false;
            console.log('WebSocket连接打开失败，请检查！')
            wx.hideToast()
        })
        wx.onSocketOpen((res) => {
            console.log('WebSocket连接已打开！')
            wx.hideToast()
            this.socketOpen = true;
            for (var i = 0; i < this.socketMsgQueue.length; i++) {
                this.sendSocketMessage(this.socketMsgQueue[i])
            }
            this.socketMsgQueue = [];
            this.startHeartBeat();
        })
        wx.onSocketClose((res) => {
            this.socketOpen = false
            console.log('WebSocket 已关闭！')
            wx.hideToast()
        })
    }
    startHeartBeat() {
        console.log('socket开始心跳')
        this.heartBeat();
    }
    heartBeat() {
        wx.sendSocketMessage({
            data: 'HEART',
            success: res => {
                this.heartBeatTimeOut = setTimeout(() => {
                    this.heartBeat();
                }, 7000);
            },
            fail: res => {
                if (this.heartBeatFailCount > 2) {
                    this.onConnect();
                }
                this.heartBeatTimeOut = setTimeout(() => {
                    this.heartBeat();
                }, 7000);
                this.heartBeatFailCount++;
            },
        });
    }
    closeSocket() { // 关闭socket
        wx.closeSocket()
    }
    sendSocketMessage(msg) { // 发送消息
        if (this.socketOpen) {
            wx.sendSocketMessage({
                data: msg
            })
        } else {
            this.socketMsgQueue.push(msg)
        }
    }
}
export default Person