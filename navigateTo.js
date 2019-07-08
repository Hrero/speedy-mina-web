/**
 * Created by air on 2018/7/26.
 */

export function navigateTo(path) {
    const length = getCurrentPages().length;
    const currentRoute = getCurrentPages()[length - 1].route;
    const pathIndex = currentRoute.split('/').length;
    let url = "";
    for (let i = 0; i < pathIndex - 1; i++) {
        url += '../'
    }
    path = url + path;
    wx.navigateTo({
        url: path
    })
}