export const format = (time, fmt) => {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        'S': time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
}

export const timeAgo = (date) => {
    if (date) {
        try {
            var oldTime = date.getTime();
            var currTime = new Date().getTime();
            var diffValue = currTime - oldTime;

            var days = Math.floor(diffValue / (24 * 3600 * 1000));
            if (days === 0) {
                //计算相差小时数
                var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                if (hours === 0) {
                    //计算相差分钟数
                    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
                    var minutes = Math.floor(leave2 / (60 * 1000));
                    if (minutes === 0) {
                        //计算相差秒数
                        var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
                        var seconds = Math.round(leave3 / 1000);
                        return seconds + `秒前`;
                    }
                    return minutes + `分钟前`;
                }
                return hours + `小时前`;
            }
            if (days < 0) return '刚刚';

            if (days < 8) {
                return days + `天前`;
            } else if (days > 7 && days < 31) {
                return Math.ceil(days / 7) + `周前`
            } else if (days > 30 && days < 365) {
                return Math.ceil(days / 31) + `月前`
            } else {
                return format(date, 'yyyy-MM-dd hh:mm')
            }
        } catch (error) {
            console.log(error)
        }
    }
}