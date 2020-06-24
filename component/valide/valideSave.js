const pageStore = SAX('PageStore');
import checkSpecialCharacter from './valideSpecialCharacter'
const reg = {};

const fn = {
    // 不为空
    noEmpty: function (str) {
        return _.isNumber(str) || !_.isEmpty(str);
    }
}

const CONTACT = {
    "contactPeople": {
        "selector": ".contact-people input",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({contactName}) {
            let arr = checkSpecialCharacter(contactName);
            CONTACT.contactPeople.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    },
    "contactWinXin": {
        "selector": ".contact-weixin input",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({contactWeChat}) {
            let arr = checkSpecialCharacter(contactWeChat);
            CONTACT.contactWinXin.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    }
};

const DICTIONARIES = {
    "zgalianyou": {
        "productProviderCode": {
            "selector": "#productProviderCode",
            "warnTips": "请填写供应商产品编号",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productProviderCode = data.gzaTravelLineList[0].productProviderCode
                let arr = checkSpecialCharacter(productProviderCode);
                DICTIONARIES.zgalianyou.productProviderCode.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear";
            }
        },
        "productSubTitle": {
            "selector": "#productSubTitle",
            "warnTips": "请填写副标题",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productSubTitle = data.productSubTitle;
                let arr = checkSpecialCharacter(productSubTitle);
                DICTIONARIES.zgalianyou.productSubTitle.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear";
            }
        },
        "themeFeatures-other": {
             "selector": "#themeFeatures-other",
             "warnTips": "请填写主题特色",
             "errorTips": "您输入的内容含有非法字符",
             "on": "single",
             "type": "text",
             "reg": function ({productProperties}) {
                let otherValue = $('#themeFeatures-other').val();
                let $obj = $('input[name=themeFeatures][value=0]:checked');
                let arr = checkSpecialCharacter(otherValue);
                DICTIONARIES.zgalianyou["themeFeatures-other"].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return $obj.length ? arr.length ? "error" : "clear" : "clear";
             }
         },
    },
    "macaoticket": {
        "productTitle": {
            "selector": "#productTitle",
            "warnTips": "请填写海报标题",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let posterTitle = data.pcMacaoTicketMapper.posterTitle;
                let arr = checkSpecialCharacter(posterTitle);
                DICTIONARIES.macaoticket.productTitle.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear";
            }
        },
        "characteristic": {
            "selector": "#characteristic",
            "warnTips": "请填写产品特色",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let ticketFeatureDesc = data.pcMacaoTicketMapper.ticketFeatureDesc;
                let arr = checkSpecialCharacter(ticketFeatureDesc);
                DICTIONARIES.macaoticket.characteristic.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear";
            }
        },
        "ticketStatement": {
            "selector": "#ticketStatement",
            "warnTips": "请填写海报说明",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let ticketDesc = data.pcMacaoTicketMapper.ticketDesc;
                let arr = checkSpecialCharacter(ticketDesc);
                DICTIONARIES.macaoticket.ticketStatement.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear";
            }
        },
        
    },
};

// 行程特色
const TRIPFEATURES = {
    "tripFeaturesDesc": {
        "selector": "#tripFeaturesDesc",
        "warnTips": "请填写行程特色描述",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let featuresDescript = data.featuresDescript;
            let arr = checkSpecialCharacter(featuresDescript);
            TRIPFEATURES.tripFeaturesDesc.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    },
}

// 非实力秀多个其他描述
function otherDesc(key) {
    let obj = {};
    let res = {
        costDesc: {
            warnTips: "请填写费用说明",
            data: "priceInfo",
        },
        childrenPriceDesc: {
            warnTips: "请填写儿童价标准",
            data: "childrenPriceDesc",
        },
        infantPriceDesc: {
            warnTips: "请填写婴儿价标准",
            data: "infantPriceDesc",
        },
        visaDesc: {
            warnTips: "请填写签注说明",
            data: "visaInfo",
        },
        reservationDesc: {
            warnTips: "请填写预订须知",
            data: "bookingInfo",
        },
    };
    let item = res[key];
    obj[key] = {
        "selector": "#" + key + ' .showCase',
        "warnTips": item ? item.warnTips : "请填写描述",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let val = data[item.data];

            let arr = checkSpecialCharacter(val);
            obj[key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    }
    return obj;
}

// 线路行程
function lineTrips(key) {
    let obj = {};

    obj["x-hotel-" + key] = {
        "selector": "#x-hotel-" + key,
        "warnTips": "请填写酒店名称",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let hotelName = data.hotelName;

            let arr = checkSpecialCharacter(hotelName);
            obj["x-hotel-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    }
    obj["x-title-" + key] = {
        "selector": "#x-title-" + key,
        "warnTips": "请填写行程标题",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let title = data.title;
            let arr = checkSpecialCharacter(title);
            obj["x-title-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    }
    obj["x-food-zao-other-" + key] = {
        "selector": "#x-food-zao-other-" + key,
        "warnTips": "请填写早餐自定义描述",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let breakfastMemo = data.breakfastMemo;
            let breakfastType = data.breakfastType;

            let arr = checkSpecialCharacter(breakfastMemo);
            obj["x-food-zao-other-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return breakfastType == 1 ? "clear" : arr.length ? "error" : "clear";
        }
    }
    obj["x-food-zhong-other-" + key] = {
        "selector": "#x-food-zhong-other-" + key,
        "warnTips": "请填写午餐自定义描述",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let lunchMemo = data.lunchMemo;
            let lunchType = data.lunchType;

            let arr = checkSpecialCharacter(lunchMemo);
            obj["x-food-zhong-other-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return lunchType == 1 ? "clear" : arr.length ? "error" : "clear";
        }
    }
    obj["x-food-wan-other-" + key] = {
        "selector": "#x-food-wan-other-" + key,
        "warnTips": "请填写晚餐自定义描述",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let dinnerMemo = data.dinnerMemo;
            let dinnerType = data.dinnerType;

            let arr = checkSpecialCharacter(dinnerMemo);
            obj["x-food-wan-other-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return dinnerType == 1 ? "clear" : arr.length ? "error" : "clear";
        }
    }
    obj["x-desc-" + key] = {
        "selector": "#x-desc-" + key + ' .showCase',
        "warnTips": "请填写行程描述",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let planDescript = data.planDescript;

            let arr = checkSpecialCharacter(planDescript);
            obj["x-desc-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    }

    return obj;
}

export default class Valide {

    constructor(type, key) {
        let obj = DICTIONARIES[type];
        if (type == 'contact') {
            obj = CONTACT;
        } else if (type == 'tripFeatures') {
            obj = TRIPFEATURES;
        } else if (type == 'otherDesc') {
            obj = otherDesc(key);
        } else if (type == 'lineTrips') {
            obj = lineTrips(key);
        }
        this.dictionary = obj;
        this.type = type;
    }

    // 多个列表项获取下标
    getIdx($obj) {
        if (this.type == 'contact') {
            return $obj.attr('id');
        }
        return null;
    }

    onSingle($dom, form,) {
        let obj = this.dictionary;

        _.each(obj, (item, key) => {
            // 添加警告提示触发函数
            if (item.warnTips) {
                item.warn = (id) => {
                    id ? form[id].addWarn(id, item.warnTips, {
                        className: 'warning'
                    }) : form.addWarn(key, item.warnTips, {
                        className: 'warning'
                    });
                }
            }
            // 添加错误提示触发函数
            if (item.errorTips) {
                item.error = (id) => {
                    id ? form[id].addWarn(id, item.errorTips, {
                        className: 'error'
                    }) : form.addWarn(key, item.errorTips, {
                        className: 'error'
                    });
                }
            }
            // 添加清楚提示触发函数
            item.clear = (id) => {
                id ? form[id].removeWarn(id) : form.removeWarn(key);
            }
            // text 类型绑定事件
            // item.on && this[item.on]($dom, item);
        });
        return this;
    }

    all(data, idx) {
        let collection = [];
        _.each(this.dictionary, (item, key) => {
            let id = fn.noEmpty(idx) ? (key + '_' + idx) : null;
            let state = item.reg(data, id);
            collection.push(state);
            if (state) {
                item[state] && item[state](id);
            }
        });
        return collection;
    }
}