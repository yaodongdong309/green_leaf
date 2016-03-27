'use strict';
// aqi-table
(function () {
    var doc = document,
    // yao 事件委托
    // yao 即时函数,创建事件委托,参数 ele,type,selector,cb
    // yao 委托没有添加相关参数判断,因为是task,暂时先写成这样
    // yao 考虑到有些js插件创建相关bind等方法,此处理解ie8有bind函数
        on = (function () {
            var handle,
                typePrefix = '';
            // yao 兼容ie8
            if (typeof doc.addEventListener === 'function') {
                handle = doc.addEventListener;
            } else if (typeof doc.attachEvent === 'function') {
                typePrefix = 'on';
                handle = doc.attachEvent;
            }
            return function (ele, type, selector, cb) {
                console.log(1);
                handle.call(ele, typePrefix + type, function (e) {
                    var eles,
                        ev = e || window.event,
                        target = ev.target || ev.srcElement,
                        i,
                        len,
                        useMyId = false;
                    if (!ele.id) {
                        useMyId = true;
                        ele.id = '__myId__';
                    }
                    eles = doc.querySelectorAll('#' + ele.id + ' ' + selector);
                    len = eles.length;
                    while (target != null) {
                        for (i = 0; i < len; ++i) {
                            if (target === eles[i]) {
                                cb.call(target, ev);
                                return;
                            }
                        }
                        target = target.parentNode;
                    }
                    if (useMyId) {
                        ele.id = null;
                    }
                });
            };
        }());

    function getEle(id) {
        return doc.getElementById(id);
    }

    function trim(str) {
        return str.replace(/(^\s)|(\s$)/g, '');
    }

    function isNum(str) {
        var reg = /^\d+$/;
        return reg.test(str);
    }

    function isWord(str) {
        var reg = /^[a-zA-Z\u4E00-\uFA29]+$/;
        return reg.test(str);
    }

    function showMsg(str) {
        /* eslint-disable no-alert */
        alert(str);
        /* eslint-enable no-alert */
    }

    function init() {
        var table = getEle('aqi-table');
        getEle('add-btn').onclick = function () {
            var cityText = getEle('aqi-city-input').value,
                numText = getEle('aqi-value-input').value,
                city = trim(cityText),
                num = trim(numText),
                showText = '<td><%city%></td><td><%num%></td><td><button>删除</button></td>',
                tr = doc.createElement('tr');
            if (!isWord(city)) {
                showMsg('城市名称必须为中英文字符且不能为空');
                return;
            }
            if (!isNum(num)) {
                showMsg('空气质量必须为整数且不能为空');
                return;
            }
            tr.innerHTML = showText.replace(/<%(\w*)%>/g, function (m, $1) {
                switch ($1) {
                    case 'city':
                        return city;
                    case 'num':
                        return num;
                    default :
                        return 'unexpected data';
                }
            });
            table.appendChild(tr);
        };
        on(table, 'click', 'button', function () {
            console.log(1);
            var tr = this.parentNode.parentNode;
            table.removeChild(tr);
        });
    }

    init();
}());
