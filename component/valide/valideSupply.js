const pageStore = SAX('PageStore');
import { tips as msgtips} from '../client'
import checkSpecialCharacter from './valideSpecialCharacter'
const reg = {
    // 联系人
    fullname: /^[\u4e00-\u9fa5\sa-zA-Z]{2,32}$/,
    // 联系电话(支持港澳手机、大陆手机、座机)|大陆手机|香港手机|澳门手机|大陆固话|港澳固话
    mobileAndPhone: /^[1][3456789]\d{9}$|^(00)?852([5|6|9])\d{7}$|^(00)?853[6]\d{7}$|^0\d{2,3}-?\d{7,8}(-\d{1,6})?$|^(00)?85[23]-?\d{8}(-\d{1,6})?$/,
    // QQ
    qq: /^[1-9]([0-9]{4,10})([0-9]{1,4})?$/,
     // 微信
    weixin: /^[a-zA-Z0-9][a-zA-Z0-9_-]{5,19}$/,
    // 飞行小时
    flightHours: /^[1-9]\d*(\.\d)?$/,
    // 机位配额
    seats: /^[1-9]\d*$/,
    // 海报价格
    posterPrice: /^[1-9]\d*$/,
    // 航班号
    flightNumber: /^[^\u4e00-\u9fa5]{1,20}$/,
    // 包房数，配额房
    roomCount: /^([1-9]\d{0,2}|1000)$/,
    // 成团规则
    packageCount: /^[1-9]\d?$/,
    // 同行价
    adultPrice: /^([1-9]\d{0,4}|100000)$/,
    // 车队规模
    busCount: /^([1-9]\d{0,3}|10000)$/,
    //酒店成团规则
    hoterPackageNum: /^([1-9]|[1][0-9]|[2][0])$/,
};

const fn = {
    // 不为空
    noEmpty: function (str) {
        return _.isNumber(str) || !_.isEmpty(str);
    },
    // 产品属性
    productProperty: function (arr, selector, flag) {
        let name = flag ? $(selector).parents('.inputItemGroup').find('>.fkp-title').text().replace('：', '') : $('.for-'+selector).find('>.fkp-title').text().replace('：', '');
        for (let i = 0, len = arr.length; i < len; i++) {
            let obj = arr[i];
            if (obj.productPropertyName == name) {
                return fn.noEmpty(obj.productPropertyValueIds);
            }
        }
        return false;
    },
    // 其他产品属性
    productPropertyOther: function (arr, selector, flag) {
        let name = flag ? $(selector).parents('.inputItemGroup').find('>.fkp-title').text().replace('：', '') : $('.for-' + selector).find('>.fkp-title').text().replace('：', '');
        for (let i = 0, len = arr.length; i < len; i++) {
            let obj = arr[i];
            if (obj.productPropertyName == name) {
                return obj.productPropertyValueIds.split(',').indexOf('0') != -1 ? fn.noEmpty(obj.otherValue) : true;
            }
        }
        return false;
    },
    // 联系电话
    mobileAndPhone: function (str) {
        return reg.mobileAndPhone.test(str);
    },
    fullname: function(str){
        return reg.fullname.test(str);
    },
    // QQ
    qq: function (str) {
        return reg.qq.test(str);
    },
    //微信
    winxin: function (str) {
        return reg.weixin.test(str);
    },
    // 航班排期
    pcCruises: function (arr) {
        return arr.length && fn.noEmpty(arr[0].lineScheduleId)
    },

    hoterPackageNum:function (str) {
        return reg.hoterPackageNum.test(str);
    },

    isNumber:function(str){
        str = 0 | str;
        return _.isNumber(str);
    }
}

/**
 * warnTips     警告提示
 * errorTips    错误提示
 * on           需要监听的事件类型（single, focus, blur, change）
 * type         表单的类型
 * reg          发布时的校验
 * focus、 blur、 change      相应事件的校验
 */
const DICTIONARIES = {
    "baotuandijie": {
        "ckcity": {
            "selector": "#ckcity",
            "warnTips": "请选择目的地",
            "errorTips": "暂不支持该目的地",
            "on": "focus",
            "type": "text",
            "reg": function ({ destination }){                     
                return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
            }
            // "blur": function($obj){
            //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
            // }
        },
        "save-tx-group": {
            "selector": "#save-tx-group input[type='radio']",
            "warnTips": "请选择团型",
            "on": "change",
            "type": "radio",
            "reg": function ({ productProperties }){
                return fn.productProperty(productProperties, 'save-tx-group' , false) ? "clear" : "warn";
            }
        }
    },
    "tourbus": {
        "ckcity": {
            "selector": "#ckcity",
            "warnTips": "请选择所在地",
            "errorTips": "暂不支持该所在地",
            "on": "focus",
            "type": "text",
            "reg": function ({ destination }) {
                return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
            }
        },
        "serviceScope": {
            "selector": "input[name=serviceScope]",
            "warnTips": "请选择服务范围",
            "on": "change",
            "type": "checkbox",
            "reg": function ({ productProperties }) {
                return fn.productProperty(productProperties, this.selector , true) ? "clear" : "warn";
            }
        }
    },
    "ticketgroupbooking":{
        "biz-sport": {
            "selector": "#ckcity",
            "warnTips": "请选择景点",
            "type": "span",
            "reg": function ({ destination }) {
                return fn.noEmpty(destination) ? "clear" : "warn";
            }
        },
        "peerPrice": {
            "selector": "#peerPrice",
            "warnTips": "请填写价格",
            "on": "single",
            "type": "text",
            "reg": function ({destination,lowestMarketPrice,lowestPrice}) {
                //如果是免费景点就不验证价格
                lowestMarketPrice=parseInt(lowestMarketPrice);
                lowestPrice = parseInt(lowestPrice);
                return !lowestMarketPrice && destination ? 'clear' : lowestPrice ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let lowestPrice = $obj.val();
                return !_.isEmpty(lowestPrice) ? "clear" : "warn";
            }
        }
    },
    "visa": {
        "ckcity": {
            "selector": "#ckcity",
            "warnTips": "请选择签证国家",
            "errorTips": "暂不支持该签证国家",
            "on": "focus",
            "type": "text",
            "reg": function ({ destination }) {
                return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
            }
        },
        "visaType": {
            "selector": "input[name=visaType]",
            "warnTips": "请选择签证类型",
            "on": "change",
            "type": "checkbox",
            "reg": function ({ productProperties }) {
                return fn.productProperty(productProperties, this.selector,true) ? "clear" : "warn";
            }
        },
        "passportType": {
            "selector": "input[name=passportType]",
            "warnTips": "请选择护照类型",
            "on": "change",
            "type": "checkbox",
            "reg": function ({ productProperties }) {
                return fn.productProperty(productProperties, this.selector, true) ? "clear" : "warn";
            }
        },
        "consularDistrict": {
            "selector": "input[name=consularDistrict]",
            "warnTips": "请选择送签领区",
            "on": "change",
            "type": "checkbox",
            "reg": function ({ productProperties }) {
                return fn.productProperty(productProperties, this.selector, true) ? "clear" : "warn";
            }
        },
        "visaType-other": {
            "selector": "#visaType-other",
            "warnTips": "请填写护照类型",
            "on": "single",
            "type": "text",
            "reg": function ({ productProperties }) {
                return fn.productPropertyOther(productProperties, 'visaType-other',false) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let type = $obj.val();
                return fn.noEmpty(type) ? "clear" : "warn";
            }
        }
    },
    "cruise": {
        "cruise": {
            "selector": "#cruise",
            "warnTips": "请选择邮轮系列",
            "errorTips": "暂不支持该邮轮系列",
            "on": "focus",
            "type": "text",
            "reg": function ({ cruisesBrandId }) {
                return fn.noEmpty(cruisesBrandId) ? "clear" : fn.noEmpty($('#cruise').val()) ? "error" : "warn";
            }
        },
        "flightScheduling": {
            "selector": "#flightScheduling .c-check input",
            "warnTips": "请选择航班排期",
            "on": "change",
            "type": "checkbox",
            "reg": function ({ pcCruises }) {
                pcCruises = JSON.parse(pcCruises);
                return fn.pcCruises(pcCruises) ? "clear" : "warn";
            }
        }
    },
    "hotelgroupbooking": {
        "biz_hotel": {
            "selector": "#biz-hotel",
            "warnTips": "请选择酒店",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let len = data.productProperties.length;
                return len > 0 ? "clear" : "warn";
            }
        },
        "regimentSpecification":{
            "selector": "#regimentSpecification",
            "warnTips": "请填写成团规则",
            "errorTips": "请输入1-20整数",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let packageNum = data.packageHotel.packageNum
                return data.packageHotel.packageNum ? fn.hoterPackageNum(packageNum) ? "clear" : "error" : "warn";
            },
            "blur": function($obj){
                let packageNum = $('#regimentSpecification').val()
                return packageNum ? fn.hoterPackageNum(packageNum) ? "clear" : "error" : "warn";
            }
        },
        // "save-price": {
        //     "selector": "#save-price",
        //     "warnTips": "请设置酒店价格排期",
        //     "on": "focus",
        //     "type": "text",
        //     "reg": function (data) {
        //         let num = sessionStorage.getItem('price_valid_data');
        //         return num!='0' ? "clear" : "warn";
        //     }
        // },
    },
    "sanpin":{
        "collectionPlace":{
            "selector": "#collectionPlace",
            "warnTips": "请选择集合地点",
            "errorTips": "暂不支持该集合地点",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let collectionPlace = data.gatheringPlacePoiId;
                let productCategoryCode = pageStore.data.productData.productCategoryCode
                //周边游不做验证
                if (productCategoryCode == 'ProvinceTourismForSpellingTour'){
                    return 'clear'
                }
                return fn.noEmpty(collectionPlace) ? "clear" : fn.noEmpty($('#collectionPlace').val()) ? "error" : "warn";
            }
            // "blur": function($obj){
            //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
            // }
        },
        "departurePlace": {
            "selector": "#departurePlace",
            "warnTips": "请选择大交通城市",
            "errorTips": "暂不支持该城市",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let departCityCode = data.departCityCode;
                let productCategoryCode = pageStore.data.productData.productCategoryCode
                //邮轮不验证
                if (productCategoryCode == 'ProvinceTourismForSpellingTour') {
                    DICTIONARIES.sanpin.departurePlace.warnTips = '请选择出发地';
                } else if (productCategoryCode == 'CruiseForSpellingTour') {
                    DICTIONARIES.sanpin.departurePlace.warnTips = '请选择出发港口';
                }else{
                    DICTIONARIES.sanpin.departurePlace.warnTips = '请选择大交通城市';
                }
                return fn.noEmpty(departCityCode) ? "clear" : fn.noEmpty($('#departurePlace').val()) ? "error" : "warn";
            }
            // "blur": function($obj){
            //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
            // }
        },
         "cruise": {
            "selector": "#cruise",
            "warnTips": "请选择邮轮系列",
            "errorTips": "暂不支持该邮轮系列",
            "on": "focus",
            "type": "text",
            "reg": function ({ pcSpellingTour }) {
                let cruisesBrandId = pcSpellingTour.cruisesBrandId
                let productCategoryCode = pageStore.data.productData.productCategoryCode
                //邮轮才验证
                if (productCategoryCode != 'CruiseForSpellingTour') {
                    return 'clear'
                }
                return fn.noEmpty(cruisesBrandId) ? "clear" : fn.noEmpty($('#cruise').val()) ? "error" : "warn";
            }
        },
        "ckcity": {
            "selector": "#ckcity",
            "warnTips": "请选择目的地",
            "errorTips": "暂不支持该目的地",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let destination = data.destination;
                return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
            }
            // "blur": function($obj){
            //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
            // }
        },
         "transportMode": {
             "selector": "#transportMode input[type='radio']",
             "warnTips": "请选择往返大交通",
             "on": "change",
             "type": "radio",
             "reg": function ({productProperties}) {
                 let productCategoryCode = pageStore.data.productData.productCategoryCode
                 //邮轮不验证
                 if (productCategoryCode == 'CruiseForSpellingTour') {
                     return 'clear'
                 }
                 return fn.productProperty(productProperties, 'transportMode' ,false) ? "clear" : "warn";
             }
         },
         "transportMode-other": {
             "selector": "#transportMode-other",
             "warnTips": "请填写往返大交通",
             "on": "single",
             "type": "text",
             "reg": function ({productProperties}) {
                 let productCategoryCode = pageStore.data.productData.productCategoryCode
                 //邮轮不验证
                 if (productCategoryCode == 'CruiseForSpellingTour' || !$('#transportMode-other').length || $('#transportMode-other').hasClass('disN')) {
                     return 'clear'
                 }
                 return fn.productPropertyOther(productProperties, 'transportMode-other', true) ? "clear" : "warn";
             },
             "blur": function ($obj) {
                 let type = $obj.val();
                 return fn.noEmpty(type) ? "clear" : "warn";
             }
         },
        "gazyPosterTitle":{
            "selector": "#gazyPosterTitle",
            "warnTips": "请填写海报标题",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let  productTitle = data.pcSpellingTour.productTitle;
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let productTitle = $('#gazyPosterTitle').val();
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            }
        },
        "ticketStatement": {
            "selector": "#ticketStatement",
            "warnTips": "请填写海报说明",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let ticketDesc = data.pcSpellingTour.ticketDesc;
                return fn.noEmpty(ticketDesc) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let ticketDesc = $('#ticketStatement').val();
                return fn.noEmpty(ticketDesc) ? "clear" : "warn";
            }
        },
        // 'termOfValidityBox': {
        //     "selector": "#termOfValidityBox",
        //     "warnTips": "请选择展示有效期",
        //     "errorTips": "展示有效期已过期,请重新选择",
        //     "on": "focus",
        //     "type": "text",
        //     "reg": function (data) {
        //         let endDate = data.endDate;
        //         let time = endDate ? new Date(endDate).getTime() : 0;
        //         let currTime = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd")).getTime();

        //         return fn.noEmpty(endDate) ? time < currTime ? "error" : "clear" : "warn";
        //     },
        //     "focus": function ($obj) {
        //         let endDate = $('#termOfValidity').val()
        //         return fn.noEmpty(endDate) ? "clear" : "warn";
        //     },
        // }

    },
    "tonghangkc": {
        "gazyPosterTitle": {
            "selector": "#gazyPosterTitle",
            "warnTips": "请填写海报标题",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productTitle = data.peerInvestigation.productTitle;
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let productTitle = $('#gazyPosterTitle').val();
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            }
        },
        "inspectionPrice": {
            "selector": "#inspectionPrice",
            "warnTips": "请填写考察价",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let price = data.peerInvestigation.price;
                return fn.noEmpty(price) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let price = $('#inspectionPrice').val();
                return fn.noEmpty(price) ? "clear" : "warn";
            }
        },
        "quota": {
            "selector": "#quota",
            "warnTips": "请填写名额",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let maxPeople = data.peerInvestigation.maxPeople;
                return fn.noEmpty(maxPeople) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let maxPeople = $('#quota').val();
                return fn.noEmpty(maxPeople) ? "clear" : "warn";
            }
        },
        "ticketStatement": {
            "selector": "#ticketStatement",
            "warnTips": "请填写海报说明",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let ticketDesc = data.peerInvestigation.posterDesc;
                return fn.noEmpty(ticketDesc) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let ticketDesc = $('#ticketStatement').val();
                return fn.noEmpty(ticketDesc) ? "clear" : "warn";
            }
        },
        'termOfValidityBox': {
            "selector": "#termOfValidityBox",
            "warnTips": "请选择展示有效期",
            "errorTips": "展示有效期已过期,请重新选择",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let endDate = data.endDate;
                let time = endDate ? new Date(endDate).getTime() : 0;
                let currTime = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd")).getTime();

                return fn.noEmpty(endDate) ? time < currTime ? "error" : "clear" : "warn";
            },
            "focus": function ($obj) {
                let endDate = $('#termOfValidity').val()
                return fn.noEmpty(endDate) ? "clear" : "warn";
            },
        }

    },
    "gangaoziyou":{
        "HKMacaoFreeTravelCategory": {
            "selector": "#HKMacaoFreeTravelCategory input[type='radio']",
            "warnTips": "请选择分类",
            "on": "change",
            "type": "radio",
            "reg": function ({productProperties}) {
                return fn.productProperty(productProperties, 'HKMacaoFreeTravelCategory',false) ? "clear" : "warn";
            }
        },
        "gazyPosterTitle": {
            "selector": "#gazyPosterTitle",
            "warnTips": "请填写海报标题",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productTitle = data.pcHkMacauFreeTour.productTitle;
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let productTitle = $('#gazyPosterTitle').val();
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            }
        },
        "ticketStatement": {
            "selector": "#ticketStatement",
            "warnTips": "请填写海报说明",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let ticketDesc = data.pcHkMacauFreeTour.ticketDesc;
                return fn.noEmpty(ticketDesc) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let ticketDesc = $('#ticketStatement').val();
                return fn.noEmpty(ticketDesc) ? "clear" : "warn";
            }
        },
        "trialTime": {
            "selector": "#trialTime",
            "warnTips": "请选择海报展示期限",
            "errorTips": "海报展示期限已过期，请重新选择",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let endDate = data.endDate;
                let time = endDate ? new Date(endDate).getTime() : 0;
                let currTime = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd")).getTime();
                return fn.noEmpty(endDate) ? time < currTime ? "error" : "clear" : "clear";
            }
        },
        // "currencyRackRate": {
        //     "selector": "#currencyRackRate",
        //     "warnTips": "请填写直客价",
        //     "errorTips": "直客价只能是正整数",
        //     "on": "single",
        //     "type": "text",
        //     "reg": function (data) {
        //         let price = data.pcHkMacauFreeTour.price;
        //         let tradePrice = data.pcHkMacauFreeTour.tradePrice;
        //         if (tradePrice && parseInt(tradePrice) > 0 && price && parseInt(price) > 0) {
        //             if (parseInt(price) < parseInt(tradePrice)) {
        //                 DICTIONARIES.gangaoziyou.currencyRackRate.errorTips = '直客价不能小于同行价';
        //                 return "error";
        //             }
        //         }
        //         return price ? fn.isNumber(price) && parseInt(price) > 0 ? "clear" : "error" : "warn";
        //     },
        //     "blur": function ($obj) {
        //         let $colorff8400 = $('#currencyRemaidPrice').find('.color-ff8400');
        //         let $color333 = $('#currencyRemaidPrice').find('.color-333');

        //         let price = $('#currencyRackRate').val();
        //         //  let that = CURRENCYOFTHETICKET;
        //         //首先直客价合格 然后验证同行价
        //         if (price && fn.isNumber(price) && parseInt(price) > 0) {
        //             if (DICTIONARIES.gangaoziyou.currencyPeerPrice.PeerReg() == 'clear') {

        //                 let tradePrice = $('#currencyPeerPrice').val();
        //                 let remaidPrice = parseInt(price) - parseInt(tradePrice);
        //                 if (remaidPrice < 0) {
        //                     DICTIONARIES.gangaoziyou.currencyRackRate.errorTips = '直客价不能小于同行价';
        //                     return "error";
        //                 }
        //                 $colorff8400.text(remaidPrice);
        //                 $color333.eq(0).text('￥')
        //                 $color333.eq(1).text('起')
        //             }
        //         }
        //         DICTIONARIES.gangaoziyou.currencyRackRate.errorTips = '同行价只能是正整数';
        //         return price ? fn.isNumber(price) && parseInt(price) > 0 ? "clear" : "error" : "warn";
        //     },
        //     "RackRateReg": function () {
        //         let price = $('#currencyRackRate').val();
        //         let flag = price ? fn.isNumber(price) && parseInt(price) > 0 ? "clear" : "error" : "warn";
        //         remove_msg(flag, 'currencyRackRate')
        //         return flag
        //     }
        // },
        // "currencyPeerPrice": {
        //     "selector": "#currencyPeerPrice",
        //     "warnTips": "请填写同行价",
        //     "errorTips": "同行价只能是正整数",
        //     "on": "single",
        //     "type": "text",
        //     "reg": function (data) {
        //         let tradePrice = data.pcHkMacauFreeTour.tradePrice;
        //         return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
        //     },
        //     "blur": function ($obj) {
        //         let $colorff8400 = $('#currencyRemaidPrice').find('.color-ff8400');
        //         let $color333 = $('#currencyRemaidPrice').find('.color-333');

        //         let tradePrice = $('#currencyPeerPrice').val();

        //         //首先直客价合格 然后验证同行价
        //         if (tradePrice && fn.isNumber(tradePrice) && parseInt(tradePrice) > 0) {
        //             if (DICTIONARIES.gangaoziyou.currencyRackRate.RackRateReg() == 'clear') {
        //                 let price = $('#currencyRackRate').val();
        //                 let remaidPrice = parseInt(price) - parseInt(tradePrice);
        //                 if (remaidPrice < 0) {
        //                     DICTIONARIES.gangaoziyou.currencyPeerPrice.errorTips = '同行价不能大于直客价';
        //                     return "error";
        //                 }
        //                 $colorff8400.text(remaidPrice);
        //                 $color333.eq(0).text('￥')
        //                 $color333.eq(1).text('起')
        //             }
        //         }
        //         DICTIONARIES.gangaoziyou.currencyPeerPrice.errorTips = '同行价只能是正整数';

        //         return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
        //     },
        //     "PeerReg": function () {
        //         let tradePrice = $('#currencyPeerPrice').val();
        //         // return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
        //         // let price = $('#currencyRackRate').val();
        //         let flag = tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
        //         remove_msg(flag, 'currencyPeerPrice')
        //         return flag
        //     }
        // }
    },
    "ziyouxing": {
        "ckcity": {
            "selector": "#ckcity",
            "warnTips": "请选择目的地",
            "errorTips": "暂不支持该目的地",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let destination = data.destination;
                return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
            }
        },
        "ticketTopic": {
            "selector": "#ticketTopic input[type='radio']",
            "warnTips": "请选择酒店套票主题",
            "on": "change",
            "type": "radio",
            "reg": function ({productProperties}) {
                if (!$('#ticketTopic').length){
                    return 'clear';
                }
                return fn.productProperty(productProperties, 'ticketTopic', false) ? "clear" : "warn";
            }
        },
        "topic": {
            "selector": "#topic input[type='radio']",
            "warnTips": "请选择主题",
            "on": "change",
            "type": "radio",
            "reg": function ({productProperties}) {
                if (!$('#topic').length) {
                    return 'clear';
                }
                return fn.productProperty(productProperties, 'topic', false) ? "clear" : "warn";
            }
        },
        // "other-property": {
        //     "selector": "#other-property",
        //     "warnTips": "请填写主题",
        //     "on": "single",
        //     "type": "text",
        //     "reg": function ({ productProperties }) {
        //         return fn.productPropertyOther(productProperties, 'ticketTopic', false) ? "clear" : "warn";
        //     },
        //     "blur": function ($obj) {
        //         let type = $obj.val();
        //         return fn.noEmpty(type) ? "clear" : "warn";
        //     }
        // },
        "gazyPosterTitle": {
            "selector": "#gazyPosterTitle",
            "warnTips": "请填写海报标题",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productTitle = data.pcGdFreeTour.productTitle;
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let productTitle = $('#gazyPosterTitle').val();
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            }
        },
        "ticketStatement": {
            "selector": "#ticketStatement",
            "warnTips": "请填写海报说明",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let posterDescript = data.pcGdFreeTour.posterDescript;
                return fn.noEmpty(posterDescript) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let posterDescript = $('#ticketStatement').val();
                return fn.noEmpty(posterDescript) ? "clear" : "warn";
            }
        },
        // "trialTime": {
        //     "selector": "#trialTime",
        //     "warnTips": "请选择海报展示期限",
        //     "errorTips": "海报展示期限已过期，请重新选择",
        //     "on": "focus",
        //     "type": "text",
        //     "reg": function (data) {
        //         let endDate = data.endDate;
        //         let time = endDate ? new Date(endDate).getTime() : 0;
        //         let currTime = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd")).getTime();
        //         return fn.noEmpty(endDate) ? time < currTime ? "error" : "clear" : "warn";
        //     }
        // },

    },
    // "sanpinyoul":{
    //     "departurePlace": {
    //         "selector": "#departurePlace",
    //         "warnTips": "请选择出发地",
    //         "errorTips": "暂不支持该出发地",
    //         "on": "focus",
    //         "type": "text",
    //         "reg": function (data) {
    //             let departCityCode = data.departCityCode;
    //             return fn.noEmpty(departCityCode) ? "clear" : fn.noEmpty($('#departurePlace').val()) ? "error" : "warn";
    //         }
    //         // "blur": function($obj){
    //         //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
    //         // }
    //     },
    //     "cruise": {
    //         "selector": "#cruise",
    //         "warnTips": "请选择邮轮系列",
    //         "on": "focus",
    //         "type": "text",
    //         "reg": function ({ pcSpellingTour }) {
    //             let cruisesBrandId = pcSpellingTour.cruisesBrandId
    //             return fn.noEmpty(cruisesBrandId) ? "clear" : "warn";
    //         }
    //     },
    //     "ckcity": {
    //         "selector": "#ckcity",
    //         "warnTips": "请选择目的地",
    //         "errorTips": "暂不支持该目的地",
    //         "on": "focus",
    //         "type": "text",
    //         "reg": function (data) {
    //             let destination = data.destination;
    //             return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
    //         }
    //         // "blur": function($obj){
    //         //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
    //         // }
    //     },
    //     "gazyPosterTitle": {
    //         "selector": "#gazyPosterTitle",
    //         "warnTips": "请填写海报标题",
    //         "errorTips": "",
    //         "on": "single",
    //         "type": "text",
    //         "reg": function (data) {
    //             let productTitle = data.pcSpellingTour.productTitle;
    //             return fn.noEmpty(productTitle) ? "clear" : "warn";
    //         },
    //         "blur": function ($obj) {
    //             let productTitle = $('#gazyPosterTitle').val();
    //             return fn.noEmpty(productTitle) ? "clear" : "warn";
    //         }
    //     },
    //     "ticketStatement": {
    //         "selector": "#ticketStatement",
    //         "warnTips": "请填写海报说明",
    //         "on": "single",
    //         "type": "text",
    //         "reg": function (data) {
    //             let ticketDesc = data.pcSpellingTour.ticketDesc;
    //             return fn.noEmpty(ticketDesc) ? "clear" : "warn";
    //         },
    //         "blur": function ($obj) {
    //             let ticketDesc = $('#ticketStatement').val();
    //             return fn.noEmpty(ticketDesc) ? "clear" : "warn";
    //         }
    //     },
        
    // },
    "shuaimaijiudian":{
       "ckcity": {
           "selector": "#ckcity",
           "warnTips": "请选择目的地",
           "errorTips": "暂不支持该目的地",
           "on": "focus",
           "type": "text",
           "reg": function (data) {
               let destination = data.destination;
               return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
           }
       },
       "hotelName":{
           "selector": "#hotelName",
           "warnTips": "请填写酒店名称",
           "errorTips": "",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let hotelName = data.pcClearanceHotel.hotelName;
               return fn.noEmpty(hotelName) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let hotelName = $('#hotelName').val();
               return fn.noEmpty(hotelName) ? "clear" : "warn";
           }
       },
       "hotelRoom": {
           "selector": "#hotelRoom",
           "warnTips": "请填写房型",
           "errorTips": "",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let hotelRoom = data.pcClearanceHotel.hotelRoom;
               return fn.noEmpty(hotelRoom) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let hotelRoom = $('#hotelRoom').val();
               return fn.noEmpty(hotelRoom) ? "clear" : "warn";
           }
       },
    //    "checkin": {
    //        "selector": "#checkin",
    //        "warnTips": "请选择入住日期",
    //        "errorTips": "入住日期已过期，请重新选择",
    //        "on": "focus",
    //        "type": "text",
    //        "reg": function (data) {
    //            let checkin = data.pcClearanceHotel.checkin;
    //            //日期不为空
    //            if (fn.noEmpty(checkin)) {
    //                return useTimeValide(DICTIONARIES.shuaimaijiudian.checkin, checkin, 'hotel'); 
    //            }
    //            return fn.noEmpty(checkin) ? "clear" : "warn";
    //        },
    //        "focus": function ($obj) {
    //            let checkin = $('#checkin').val()
    //            return fn.noEmpty(checkin) ? "clear" : "warn";
    //        },
    //    },
       "originPrice": {
           "selector": "#originPrice",
           "warnTips": "请填写原价",
           "errorTips": "原价应大于甩卖价",
           "on": "single",
           "type": "text",
           "reg": function (data) {
                let originPrice = data.pcClearanceHotel.originPrice;
                let clearancePrice = data.pcClearanceHotel.clearancePrice;
                if (originPrice && clearancePrice) {
                    if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                        return 'error'
                    }
                }
               return fn.noEmpty(originPrice) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let originPrice = $('#originPrice').val();
               let clearancePrice = $('#clearancePrice').val();
               if (originPrice && clearancePrice) {
                   //去除提示
                   remove_msg('clear', 'clearancePrice');
                   if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                       return 'error'
                   }
               }
               return fn.noEmpty(originPrice) ? "clear" : "warn";
           }
       },
       "clearancePrice": {
           "selector": "#clearancePrice",
           "warnTips": "请填写甩卖价",
           "errorTips": "甩卖价应小于原价",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let clearancePrice = data.pcClearanceHotel.clearancePrice;
               let originPrice = data.pcClearanceHotel.originPrice;
               if (originPrice && clearancePrice) {
                   if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                       return 'error'
                   }
               }
               return fn.noEmpty(clearancePrice) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let originPrice = $('#originPrice').val();
               let clearancePrice = $('#clearancePrice').val();
               if (originPrice && clearancePrice) {
                   //去除提示
                   remove_msg('clear', 'originPrice');
                   if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                       return 'error'
                   }
               }
               return fn.noEmpty(clearancePrice) ? "clear" : "warn";
           }
       },
       "commission": {
           "selector": "#commission",
           "warnTips": "请填写返佣",
           "errorTips": "返佣应小于原价和甩卖价",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let commission = data.pcClearanceHotel.commission;
               let clearancePrice = data.pcClearanceHotel.clearancePrice;
               let originPrice = data.pcClearanceHotel.originPrice;
               if (clearancePrice && originPrice && commission) {
                    if (parseInt(commission) >= parseInt(originPrice) || parseInt(commission) >= parseInt(clearancePrice)){
                        return 'error'
                    }
               }
               return fn.noEmpty(commission) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let commission = $('#commission').val();
               let originPrice = $('#originPrice').val();
               let clearancePrice = $('#clearancePrice').val();
               if (commission && originPrice && clearancePrice){
                    if (parseInt(commission) >= parseInt(originPrice) || parseInt(commission) >= parseInt(clearancePrice)) {
                        return 'error'
                    }
               }
               return fn.noEmpty(commission) ? "clear" : "warn";
           }
       },
       "saleIntroduction": {
           "selector": "#saleIntroduction",
           "warnTips": "请填写同业售卖说明",
           "errorTips": "",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let saleIntroduction = data.pcClearanceHotel.saleIntroduction;
               return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let saleIntroduction = $('#saleIntroduction').val();
               return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
           }
       },
    //    "endOfOrderTime": {
    //        "selector": "#endOfOrderTime",
    //        "warnTips": "请选择截止接单时间",
    //        "errorTips": "截止接单时间已过期，请重新选择",
    //        "on": "focus",
    //        "type": "text",
    //        "reg": function (data) {
    //            let endOfOrderTime = data.pcClearanceHotel.endOfOrderTime;
    //            let deadlineTime =0;
    //            if (endOfOrderTime) {
    //                deadlineTime = new Date(endOfOrderTime).getTime();
    //             }
    //            if (deadlineTime && new Date().getTime() + 1 * 60 * 60 * 1000 > deadlineTime) {
    //                 DICTIONARIES.shuaimaijiudian.endOfOrderTime.errorTips = '截止接单时间已过期，请重新选择';
    //                 return 'error'
    //            }
    //            let checkin = data.pcClearanceHotel.checkin;
    //            let checkinDate = checkin ? new Date(checkin).getTime() : '';
    //            if (checkinDate) {
    //                 //判断下架时间是次日还是当天
    //                 let whichDay = pageStore.data.productData.whichDay
    //                 //下架时间
    //                 let shelfTime = new Date(checkinDate + parseInt(whichDay) * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' ' + pageStore.data.productData.shelfTime
    //                 if (deadlineTime && deadlineTime > new Date(shelfTime).getTime()){
    //                     DICTIONARIES.shuaimaijiudian.endOfOrderTime.errorTips = '截止接单时间应小于展示有效期';
    //                     return 'error'
    //                 }
    //             }
    //            return  "clear" ;
    //        },
    //        "focus": function ($obj) {
    //            let endOfOrderTime = $('#endOfOrderTime').val()
    //            return "clear";
    //        },
    //    }
    },
    "aomenzc": {
        "proTitle": {
            "selector": "#proTitle",
            "warnTips": "请填写产品标题",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productTitle = data.productTitle;
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let productTitle = $('#proTitle').val();
                return fn.noEmpty(productTitle) ? "clear" : "warn";
            }
        },
        "productTheme": {
            "selector": "#productTheme",
            "warnTips": "请填写副标题",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productTheme = data.productTheme;
                return fn.noEmpty(productTheme) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let productTheme = $('#productTheme').val();
                return fn.noEmpty(productTheme) ? "clear" : "warn";
            }
        },
        "originSettlementPrice": {
            "selector": "#originSettlementPrice",
            "warnTips": "请填写原来结算价",
            "errorTips": "原来结算价应大于甩卖结算价",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let originSettlementPrice = data.pcClearanceHKAndMO.originSettlementPrice;
                let clearancePrice = data.pcClearanceHKAndMO.clearancePrice;
                if (originSettlementPrice && clearancePrice) {
                    if (parseInt(originSettlementPrice) <= parseInt(clearancePrice)){
                        return 'error'
                    }
                }
                return fn.noEmpty(originSettlementPrice) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let originSettlementPrice = $('#originSettlementPrice').val();
                let clearancePrice = $('#clearancePrice').val();
                if (originSettlementPrice && clearancePrice) {
                     //去除提示
                     remove_msg('clear', 'clearancePrice')
                   if (parseInt(originSettlementPrice) <= parseInt(clearancePrice)) {
                       return 'error'
                   }
                }
                return fn.noEmpty(originSettlementPrice) ? "clear" : "warn";
            }
        },
        "clearancePrice": {
            "selector": "#clearancePrice",
            "warnTips": "请填写甩卖结算价",
            "errorTips": "甩卖结算价应小于原来结算价",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let originSettlementPrice = data.pcClearanceHKAndMO.originSettlementPrice;
                let clearancePrice = data.pcClearanceHKAndMO.clearancePrice;
                if (originSettlementPrice && clearancePrice) {
                    if (parseInt(originSettlementPrice) <= parseInt(clearancePrice)) {
                        return 'error'
                    }
                }
                return fn.noEmpty(clearancePrice) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                 let originSettlementPrice = $('#originSettlementPrice').val();
                 let clearancePrice = $('#clearancePrice').val();
                 if (originSettlementPrice && clearancePrice) {
                      //去除提示
                      remove_msg('clear', 'originSettlementPrice')
                     if (parseInt(originSettlementPrice) <= parseInt(clearancePrice)) {
                         return 'error'
                     }
                 }
                return fn.noEmpty(clearancePrice) ? "clear" : "warn";
            },
        },
        "saleIntroduction": {
            "selector": "#saleIntroduction",
            "warnTips": "请填写同业售卖说明",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let saleIntroduction = data.pcClearanceHKAndMO.saleIntroduction;
                return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let saleIntroduction = $('#saleIntroduction').val();
                return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
            }
        },
    },
    "shuaimaimenpiao": {
       "ckcity": {
           "selector": "#ckcity",
           "warnTips": "请选择目的地",
           "errorTips": "暂不支持该目的地",
           "on": "focus",
           "type": "text",
           "reg": function (data) {
               let destination = data.destination;
               return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
           }
       },
       "ticketName": {
           "selector": "#ticketName",
           "warnTips": "请填写票券名称",
           "errorTips": "",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let ticketName = data.pcClearanceTicket.ticketName;
               return fn.noEmpty(ticketName) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let ticketName = $('#ticketName').val();
               return fn.noEmpty(ticketName) ? "clear" : "warn";
           }
       },
    //    "useTime": {
    //        "selector": "#useTime",
    //        "warnTips": "请选择使用日期",
    //        "errorTips": "使用日期已过期，请重新选择",
    //        "on": "focus",
    //        "type": "text",
    //        "reg": function (data) {
    //            let useTime = data.pcClearanceTicket.useTime;
    //            //日期不为空
    //            if (fn.noEmpty(useTime)) {
    //                 return useTimeValide(DICTIONARIES.shuaimaimenpiao.useTime, useTime, 'ticket');
    //            }
               
    //            return fn.noEmpty(useTime) ? "clear" : "warn";
    //        },
    //        "focus": function ($obj) {
    //            let useTime = $('#useTime').val()
    //            return fn.noEmpty(useTime) ? "clear" : "warn";
    //        },
    //    },
       "originPrice": {
           "selector": "#originPrice",
           "warnTips": "请填写原价",
           "errorTips": "原价应大于甩卖价",
           "on": "single",
           "type": "text",
           "reg": function (data) {
                let originPrice = data.pcClearanceTicket.originPrice;
                let clearancePrice = data.pcClearanceTicket.clearancePrice;
                if (originPrice && clearancePrice) {
                    if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                        return 'error'
                    }
                }
               return fn.noEmpty(originPrice) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let originPrice = $('#originPrice').val();
               let clearancePrice = $('#clearancePrice').val();
               if (originPrice && clearancePrice) {
                   //去除提示
                   remove_msg('clear', 'clearancePrice')
                   if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                       return 'error'
                   }
               }
               return fn.noEmpty(originPrice) ? "clear" : "warn";
           }
       },
       "clearancePrice": {
           "selector": "#clearancePrice",
           "warnTips": "请填写甩卖价",
           "errorTips": "甩卖价应小于原价",
           "on": "single",
           "type": "text",
           "reg": function (data) {
                 let originPrice = data.pcClearanceTicket.originPrice;
                 let clearancePrice = data.pcClearanceTicket.clearancePrice;
                if (originPrice && clearancePrice) {
                    if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                        return 'error'
                    }
                }
               return fn.noEmpty(clearancePrice) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let originPrice = $('#originPrice').val();
               let clearancePrice = $('#clearancePrice').val();
               if (originPrice && clearancePrice) {
                   //去除提示
                   remove_msg('clear', 'originPrice')
                   if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                       return 'error'
                   }
               }
               return fn.noEmpty(clearancePrice) ? "clear" : "warn";
           }
       },
       "commission": {
           "selector": "#commission",
           "warnTips": "请填写返佣",
            "errorTips": "返佣应小于原价和甩卖价",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let commission = data.pcClearanceTicket.commission;
               let clearancePrice = data.pcClearanceTicket.clearancePrice;
               let originPrice = data.pcClearanceTicket.originPrice;
               if (clearancePrice && originPrice && commission) {
                   if (parseInt(commission) >= parseInt(originPrice) || parseInt(commission) >= parseInt(clearancePrice)) {
                       return 'error'
                   }
               }
               return fn.noEmpty(commission) ? "clear" : "warn";
           },
           "blur": function ($obj) {
                let commission = $('#commission').val();
                let originPrice = $('#originPrice').val();
                let clearancePrice = $('#clearancePrice').val();
                if (commission && originPrice && clearancePrice) {
                    if (parseInt(commission) >= parseInt(originPrice) || parseInt(commission) >= parseInt(clearancePrice)) {
                        return 'error'
                    }
                }
                return fn.noEmpty(commission) ? "clear" : "warn";
           }
       },
       "saleIntroduction": {
           "selector": "#saleIntroduction",
           "warnTips": "请填写同业售卖说明",
           "errorTips": "",
           "on": "single",
           "type": "text",
           "reg": function (data) {
               let saleIntroduction = data.pcClearanceTicket.saleIntroduction;
               return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
           },
           "blur": function ($obj) {
               let saleIntroduction = $('#saleIntroduction').val();
               return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
           }
       },
    //    "endOfOrderTime": {
    //        "selector": "#endOfOrderTime",
    //        "warnTips": "请选择截止接单时间",
    //        "errorTips": "截止接单时间已过期，请重新选择",
    //        "on": "focus",
    //        "type": "text",
    //        "reg": function (data) {
    //            let endOfOrderTime = data.pcClearanceTicket.endOfOrderTime;
    //            let deadlineTime = 0 ;
    //            if (endOfOrderTime) {
    //                deadlineTime = new Date(endOfOrderTime).getTime();
    //                let useTime = data.pcClearanceTicket.useTime;
    //                if (new Date().getTime() + 1 * 60 * 60 * 1000 > deadlineTime) {
    //                    DICTIONARIES.shuaimaimenpiao.endOfOrderTime.errorTips = '截止接单时间已过期，请重新选择';
    //                    return 'error'
    //                }

    //                if (useTime) {
    //                    let ticketSessionValue = data.pcClearanceTicket.ticketSession ? useTime + " " + data.pcClearanceTicket.ticketSession + ':00' : useTime + " " + '23:59:59'
    //                         ticketSessionValue = new Date(ticketSessionValue).getTime();
    //                    if (deadlineTime > ticketSessionValue) {
    //                        DICTIONARIES.shuaimaimenpiao.endOfOrderTime.errorTips = data.pcClearanceTicket.ticketSession ? '截止接单时间应小于场次' : '截止接单时间不能大于使用日期';
    //                        return 'error'
    //                    }

    //                     //截止接单时间不能大于下架时间
    //                     let useTimeDate = new Date(useTime).getTime();
    //                     //判断下架时间是次日还是当天
    //                     let whichDay = pageStore.data.productData.whichDay
    //                     //下架时间
    //                     let shelfTime = new Date(useTimeDate + parseInt(whichDay) * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' ' + pageStore.data.productData.shelfTime
    //                     if (deadlineTime > new Date(shelfTime).getTime()) {
    //                         DICTIONARIES.shuaimaimenpiao.endOfOrderTime.errorTips = '截止接单时间应小于展示有效期';
    //                         return 'error'
    //                     }
    //                }
                   
    //             }
                
                

    //            return fn.noEmpty(endOfOrderTime) ? "clear" : "warn";
    //        },
    //        "focus": function ($obj) {
    //            let endOfOrderTime = $('#endOfOrderTime').val()
    //            return fn.noEmpty(endOfOrderTime) ? "clear" : "warn";
    //        },
    //    }
    },
    "shuaimaiyoul": {
        "cruise": {
            "selector": "#cruise",
            "warnTips": "请选择邮轮系列",
            "errorTips": "暂不支持该邮轮系列",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let cruisesBrandId = data.pcClearanceCruises.cruisesBrandId;
                return fn.noEmpty(cruisesBrandId) ? "clear" : fn.noEmpty($('#cruise').val()) ? "error" : "warn";
            }
        },
        "cruisesLineName": {
            "selector": "#cruisesLineName",
            "warnTips": "请填写邮轮航线",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let cruisesLineName = data.pcClearanceCruises.cruisesLineName;
                return fn.noEmpty(cruisesLineName) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let cruisesLineName = $('#cruisesLineName').val();
                return fn.noEmpty(cruisesLineName) ? "clear" : "warn";
            }
        },
        // "departureTime": {
        //     "selector": "#departureTime",
        //     "warnTips": "请选择出发日期",
        //     "errorTips": "已过可发布时间，请重新选择",
        //     "on": "focus",
        //     "type": "text",
        //     "reg": function (data) {
        //         let departureTime = data.pcClearanceCruises.departureTime;
        //         let editReadOnly = pageStore.data.productData.editReadOnly ? pageStore.data.productData.editReadOnly : '';
        //         //日期不为空
        //        if (fn.noEmpty(departureTime)) {
        //             let currTime = new Date();
        //             let currDate = currTime.Format("yyyy-MM-dd")
        //             let departureTimeDate = new Date(departureTime).getTime();
        //             //判断提前几天下架
        //             let whichDay = pageStore.data.productData.whichDay
        //             //下架时间
        //             let shelfTime = new Date(departureTimeDate + parseInt(whichDay) * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' ' + pageStore.data.productData.shelfTime
        //             if (!editReadOnly){
        //                 //  当前日期大于+2入住时间 
        //                 if (new Date(currDate).getTime() + 2 * 24 * 60 * 60 * 1000 > departureTimeDate) {
        //                     return 'error'
        //                 }
        //                 //当前时间大于下架时间
        //                 if (new Date(currDate).getTime() + 2 * 24 * 60 * 60 * 1000 == departureTimeDate && currTime.getTime() > new Date(currTime.Format("yyyy-MM-dd") + ' ' + pageStore.data.productData.shelfTime).getTime()) {
        //                     return 'error'
        //                 }
        //             }else{
        //                 //不可编辑
        //                 if (currTime.getTime() > new Date(shelfTime).getTime()){
        //                     msgtips('抱歉，不受理已过期邮轮产品申请', { type: 'error' })
        //                     return 'error'
        //                 }
                        
        //             }
        //        }
        //         return fn.noEmpty(departureTime) ? "clear" : "warn";
        //     },
        //     "focus": function ($obj) {
        //         let departureTime = $('#departureTime').val()
        //         return fn.noEmpty(departureTime) ? "clear" : "warn";
        //     },
        // },
        "saleIntroduction": {
            "selector": "#saleIntroduction",
            "warnTips": "请填写同业售卖说明",
            "errorTips": "",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let saleIntroduction = data.pcClearanceCruises.saleIntroduction;
                return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
            },
            "blur": function ($obj) {
                let saleIntroduction = $('#saleIntroduction').val();
                return fn.noEmpty(saleIntroduction) ? "clear" : "warn";
            }
        },
        // "endOfOrderTime": {
        //     "selector": "#endOfOrderTime",
        //     "warnTips": "请选择截止接单时间",
        //     "errorTips": "截止接单时间已过期，请重新选择",
        //     "on": "focus",
        //     "type": "text",
        //     "reg": function (data) {
        //         let endOfOrderTime = data.pcClearanceCruises.endOfOrderTime;
        //         let deadlineTime = 0;
        //         if (endOfOrderTime) {
        //             deadlineTime = new Date(endOfOrderTime).getTime();
        //         }
        //         if (deadlineTime && new Date().getTime() + 1 * 60 * 60 * 1000 > deadlineTime) {
        //             DICTIONARIES.shuaimaiyoul.endOfOrderTime.errorTips = '截止接单时间已过期，请重新选择';
        //             return 'error'
        //         }
        //         // 截止接单时间应小于展示有效期
        //         let departureTimeDate = data.pcClearanceCruises.departureTime ? new Date(data.pcClearanceCruises.departureTime).getTime() :'';
               
        //         if (departureTimeDate){
        //             //判断提前几天下架
        //             let whichDay = pageStore.data.productData.whichDay
        //             //下架时间
        //             let shelfTime = new Date(departureTimeDate + parseInt(whichDay) * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' ' + pageStore.data.productData.shelfTime
        //             if (deadlineTime && deadlineTime > new Date(shelfTime).getTime()) {
        //                 DICTIONARIES.shuaimaiyoul.endOfOrderTime.errorTips = '截止接单时间应小于展示有效期';
        //                 return 'error'
        //             }
        //         }
        //         return "clear" 
        //     },
        //     "focus": function ($obj) {
        //         let endOfOrderTime = $('#endOfOrderTime').val()
        //         return "clear" ;
        //     },
        // }

    },
    "zgalianyou": {
        "departurePlace": {
            "selector": "#departurePlace",
            "warnTips": "请选择出发城市",
            "errorTips": "暂不支持该城市",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let departCityCode = data.departCityCode;
                return fn.noEmpty(departCityCode) ? "clear" : fn.noEmpty($('#departurePlace').val()) ? "error" : "warn";
            }
        },
        "ckcity": {
            "selector": "#ckcity",
            "warnTips": "请选择目的地",
            "errorTips": "暂不支持该目的地",
            "on": "focus",
            "type": "text",
            "reg": function (data) {
                let destination = data.destination;
                return fn.noEmpty(destination) ? "clear" : fn.noEmpty($('#ckcity').val()) ? "error" : "warn";
            }
            // "blur": function($obj){
            //     return $('#ckcityValue .fkp-checked-value').length ? "" : "warn";
            // }
        },
        "productProviderCode": {
            "selector": "#productProviderCode",
            "warnTips": "请填写供应商产品编号",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let productProviderCode = data.productProviderCode;
                let arr = checkSpecialCharacter(productProviderCode);
                DICTIONARIES.zgalianyou.productProviderCode.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear" ;
            },
            "blur": function ($obj) {
                let productProviderCode = $('#productProviderCode').val();
                let arr = checkSpecialCharacter(productProviderCode);
                DICTIONARIES.zgalianyou.productProviderCode.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return arr.length ? "error" : "clear" ;
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
                return fn.noEmpty(productSubTitle) ? arr.length ? "error" : "clear" : "warn";
            },
            "blur": function ($obj) {
                let productSubTitle = $('#productSubTitle').val();
                let arr = checkSpecialCharacter(productSubTitle);
                DICTIONARIES.zgalianyou.productSubTitle.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return fn.noEmpty(productSubTitle) ? arr.length ? "error" : "clear" : "warn";
            }
        },
        "b-day": {
            "selector": "#b-day",
            "errorTips": "行程天数与线路行程不符，请先调整线路行程信息",
            "on": "focus",
            "type": "select",
            "reg": function (data) {
                let lineTripsCount = $('#lineTrips .line-trips-li').length;
                return data.gzaTravelLineList[0].days < lineTripsCount ? "error" : "clear";
            },
            "change": function ($obj) {
                console.log(data)
                // return fn.productProperty(productProperties, this.selector , true) ? "clear" : "warn";
            }
        },
        "themeFeatures": {
            "selector": "input[name=themeFeatures]",
            "warnTips": "请选择主题特色",
            "on": "change",
            "type": "checkbox",
            "reg": function ({ productProperties }) {
                return fn.productProperty(productProperties, this.selector , true) ? "clear" : "warn";
            }
        },
        "themeFeatures-other": {
             "selector": "#themeFeatures-other",
             "warnTips": "请填写主题特色",
             "on": "single",
             "type": "text",
             "reg": function ({productProperties}) {
                 return fn.productPropertyOther(productProperties, 'themeFeatures-other', false) ? "clear" : "warn";
             },
             "blur": function ($obj) {
                 let type = $obj.val();
                 return fn.noEmpty(type) ? "clear" : "warn";
             }
         },
        "playLine": {
            "selector": "input[name=playLine]",
            "warnTips": "请选择游玩线路",
            "on": "change",
            "type": "radio",
            "reg": function ({ productProperties }) {
                return fn.productProperty(productProperties, this.selector , true) ? "clear" : "warn";
            },
        },
         "lineType": {
             "selector": "input[name=lineType]",
             "warnTips": "请选择线路类型",
             "on": "change",
             "type": "radio",
             "reg": function ({
                 productProperties
             }) {
                 return fn.productProperty(productProperties, this.selector, true) ? "clear" : "warn";
             }
         },
        "priceUnit": {
            "selector": "input[name=priceUnit]",
            "warnTips": "请选择报价单位",
            "on": "change",
            "type": "radio",
            "reg": function ({
                productProperties
            }) {
                return fn.productProperty(productProperties, this.selector, true) ? "clear" : "warn";
            }
        },
         "transportMode": {
             "selector": "input[name=transportMode]",
             "warnTips": "请选择往返大交通",
             "on": "change",
             "type": "radio",
             "reg": function ({productProperties}) {
                 for (let i = 0, len = productProperties.length; i < len; i++) {
                     let obj = productProperties[i];
                     if (obj.propertyCode == 'lineType' && obj.productPropertyValue == '目的地参团') {
                         return "clear";
                     }
                 }
                 return fn.productProperty(productProperties, this.selector, true) ? "clear" : "warn";
             }
         },
         "transportMode-other": {
             "selector": "#transportMode-other",
             "warnTips": "请填写往返大交通",
             "on": "single",
             "type": "text",
             "reg": function ({productProperties}) {
                 for (let i = 0, len = productProperties.length; i < len; i++) {
                     let obj = productProperties[i];
                     if (obj.propertyCode == 'lineType' && obj.productPropertyValue == '目的地参团') {
                         return "clear";
                     }
                 }
                 return fn.productPropertyOther(productProperties, 'transportMode-other', false) ? "clear" : "warn";
             },
             "blur": function ($obj) {
                 if($('input[name=lineType]:checked').parent().prev().text() == '目的地参团'){
                     return "clear";
                 }
                 let type = $obj.val();
                 return fn.noEmpty(type) ? "clear" : "warn";
             }
         },
    },
    "macaoticket": {
        "HKMacaoFreeTravelCategory": {
            "selector": "#HKMacaoFreeTravelCategory input[type='radio']",
            "warnTips": "请选择分类",
            "on": "change",
            "type": "radio",
            "reg": function ({
                productProperties
            }) {
                return fn.productProperty(productProperties, 'HKMacaoFreeTravelCategory', false) ? "clear" : "warn";
            }
        },
       
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
                return fn.noEmpty(posterTitle) ? arr.length ? "error" : "clear" : "warn";
            },
            "blur": function ($obj) {
                let posterTitle = $('#productTitle').val();
                let arr = checkSpecialCharacter(posterTitle);
                DICTIONARIES.macaoticket.productTitle.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return fn.noEmpty(posterTitle) ? arr.length ? "error" : "clear" : "warn";
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
                return fn.noEmpty(ticketFeatureDesc) ? arr.length ? "error" : "clear" : "warn";
            },
            "blur": function ($obj) {
                let ticketFeatureDesc = $('#characteristic').val();
                let arr = checkSpecialCharacter(ticketFeatureDesc);
                DICTIONARIES.macaoticket.characteristic.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return fn.noEmpty(ticketFeatureDesc) ? arr.length ? "error" : "clear" : "warn";
            }
        },
        "priceUnit": {
            "selector": "input[name=priceUnit]",
            "warnTips": "请选择报价单位",
            "on": "change",
            "type": "radio",
            "reg": function ({
                productProperties
            }) {
                return fn.productProperty(productProperties, this.selector, true) ? "clear" : "warn";
            }
        },
        "ticketStatement": {
            "selector": "#ticketStatement",
            "warnTips": "请填写海报标题",
            "errorTips": "您输入的内容含有非法字符",
            "on": "single",
            "type": "text",
            "reg": function (data) {
                let ticketDesc = data.pcMacaoTicketMapper.ticketDesc;
                let arr = checkSpecialCharacter(ticketDesc);
                DICTIONARIES.macaoticket.ticketStatement.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return fn.noEmpty(ticketDesc) ? arr.length ? "error" : "clear" : "warn";
            },
            "blur": function ($obj) {
                let ticketDesc = $('#ticketStatement').val();
                let arr = checkSpecialCharacter(ticketDesc);
                DICTIONARIES.macaoticket.ticketStatement.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                return fn.noEmpty(ticketDesc) ? arr.length ? "error" : "clear" : "warn";
            }
        },
    },
    // "otherDesc": {
    //     "costDesc": {
    //         "selector": "#costDesc",
    //         "warnTips": "请填写费用说明",
    //         "errorTips": "",
    //         "on": "single",
    //         "type": "text",
    //         "reg": function (data) {
    //             let priceInfo = data.priceInfo;
    //             return fn.noEmpty(priceInfo) ? "clear" : "warn";
    //         },
    //         "blur": function ($obj) {
    //             let priceInfo = $('#costDesc').val();
    //             return fn.noEmpty(priceInfo) ? "clear" : "warn";
    //         }
    //     },
    //     "visaDesc": {
    //         "selector": "#visaDesc",
    //         "warnTips": "请填写签注说明",
    //         "errorTips": "",
    //         "on": "single",
    //         "type": "text",
    //         "reg": function (data) {
    //             let visaInfo = data.visaInfo;
    //             return fn.noEmpty(visaInfo) ? "clear" : "warn";
    //         },
    //         "blur": function ($obj) {
    //             let visaInfo = $('#visaDesc').val();
    //             return fn.noEmpty(visaInfo) ? "clear" : "warn";
    //         }
    //     },
    //     "reservationDesc": {
    //         "selector": "#reservationDesc",
    //         "warnTips": "请填写预订须知",
    //         "errorTips": "",
    //         "on": "single",
    //         "type": "text",
    //         "reg": function (data) {
    //             let bookingInfo = data.bookingInfo;
    //             return fn.noEmpty(bookingInfo) ? "clear" : "warn";
    //         },
    //         "blur": function ($obj) {
    //             let bookingInfo = $('#reservationDesc').val();
    //             return fn.noEmpty(bookingInfo) ? "clear" : "warn";
    //         }
    //     },
    // }
};
//去除提示框
function remove_msg(flag, id) {
     if (flag == 'clear') {
         let inputError = $('#' + id).parents('.for-'+id).find('.fkp-input-error');
         if (inputError.hasClass('waining') || inputError.hasClass('error')) {
             inputError.text('').removeClass('waining').removeClass('error')
             $('#' + id).removeClass('itemError').removeClass(' warning_itemError').removeClass('error_itemError')
         }

     }
}
//门票
function useTimeValide(that,useTime, str ) {
  let currTime = new Date();
  let currDate = currTime.Format("yyyy-MM-dd")
    //    useTime = '2018-08-28'
    //    pageStore.data.productData.shelfTime='10:00:00'
  let useTimeDate = new Date(useTime).getTime();
  //审核可发布时间最迟时间
  let checkWorkTimeEnd = new Date(currDate + ' ' + pageStore.data.productData.checkWorkTimeEnd)
  //判断下架时间是次日还是当天
  let whichDay = pageStore.data.productData.whichDay
  //下架时间
  let shelfTime = new Date(useTimeDate + parseInt(whichDay) * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' ' + pageStore.data.productData.shelfTime
  
  let isCheck = pageStore.data.productData.isCheck;
  let editReadOnly = pageStore.data.productData.editReadOnly ? pageStore.data.productData.editReadOnly : '';
  let msg = str == 'hotel' ? '酒店' : '门票';
  if (!editReadOnly){
      //  当前日期大于入住时间 
      if (new Date(currDate).getTime() > useTimeDate) {
          that.errorTips = str == 'hotel' ? '入住日期已过期，请重新选择' :'使用日期已过期，请重新选择';
          return 'error'
      }
      if (currTime.getTime() > new Date(shelfTime).getTime()) {
          that.errorTips = str == 'hotel' ? '入住日期需大于今天' : '使用日期需大于今天';
          return 'error'
      }
      if (isCheck == '1') {
          //可编辑状态非免审
          // 今天产品 五点之后不让发布
          if (new Date(currDate).getTime() == useTimeDate && currTime.getTime() >= checkWorkTimeEnd.getTime()) {
            that.errorTips = str == 'hotel' ? '入住日期需大于今天' : '使用日期需大于今天'; 
            return 'error'
          }
      }
  }else{
        
         //不可编辑
        if (currTime.getTime() > new Date(shelfTime).getTime()) {
            msgtips('抱歉，不受理已过期'+msg+'产品申请', { type: 'error' })
            return 'error'
        }
       
        if (isCheck == '1') {
                //不可编辑非免审状态
            //  当前日期大于入住时间 
            if (new Date(currDate).getTime() > useTimeDate) {
                msgtips('抱歉，不受理已过期'+msg+'产品申请', { type: 'error' })
                return 'error'
            }
            // 今天产品 checkWorkTimeEnd不让发布
            if (new Date(currDate).getTime() == useTimeDate && currTime.getTime() >= checkWorkTimeEnd.getTime()) {
                msgtips('抱歉，'+pageStore.data.productData.checkWorkTimeEnd+'以后不受理当天'+msg+'产品申请', { type: 'error' })
                return 'error'
            }
        }
    }
    return 'clear'
}

//散拼中的第二层form表单 套票价格部分
const CURRENCYOFTHETICKET={
     "currencyRackRate": {
         "selector": "#currencyRackRate",
         "warnTips": "请填写直客价",
         "errorTips": "直客价只能是正整数",
         "on": "single",
         "type": "text",
         "reg": function (data) {
             let price = data.pcHkMacauFreeTour ? 
                            data.pcHkMacauFreeTour.price :(
                                data.pcSpellingTour ? data.pcSpellingTour.price : data.pcGdFreeTour.price
                            ) 
                            
             let tradePrice = data.pcHkMacauFreeTour ?
                                data.pcHkMacauFreeTour.tradePrice: (
                                    data.pcSpellingTour ? data.pcSpellingTour.tradePrice : data.pcGdFreeTour.tradePrice
                                )
             if (tradePrice && parseInt(tradePrice) > 0 && price && parseInt(price) > 0){
                 if (parseInt(price) < parseInt(tradePrice)) {
                    CURRENCYOFTHETICKET.currencyRackRate.errorTips = '直客价不能小于同行价';
                    return "error";
                 }
             }
             return price ? fn.isNumber(price) && parseInt(price)> 0 ? "clear" : "error" : "warn";
         },
         "blur": function ($obj) {
            let $colorff8400 = $('#currencyRemaidPrice').find('.color-ff8400');
            let $color333 = $('#currencyRemaidPrice').find('.color-333');

             let price = $('#currencyRackRate').val();
            //  let that = CURRENCYOFTHETICKET;
             //首先直客价合格 然后验证同行价
             if (price && fn.isNumber(price) && parseInt(price) > 0) {
                if (CURRENCYOFTHETICKET.currencyPeerPrice.PeerReg() == 'clear') {
                    let tradePrice = $('#currencyPeerPrice').val();
                    let remaidPrice = parseInt(price) - parseInt(tradePrice);
                    if (remaidPrice<0){
                        CURRENCYOFTHETICKET.currencyRackRate.errorTips = '直客价不能小于同行价';
                        return "error";
                    }
                    $colorff8400.text(remaidPrice);
                    
                    if (sessionStorage.getItem("valideTplCode") != 'sanpin') {
                        sessionStorage.getItem("valideTplCode") == 'gangaoziyoutpl' ? $color333.eq(0).text(' ') : $color333.eq(0).text('￥')
                        $color333.eq(1).text('起')
                    } else {
                        $color333.eq(0).text('￥')
                        $color333.eq(1).text('起/人')
                    }
                }
             }
             CURRENCYOFTHETICKET.currencyRackRate.errorTips = '直客价只能是正整数';
             return price ? fn.isNumber(price) && parseInt(price) > 0 ? "clear" : "error" : "warn";
         },
         "RackRateReg": function () {
            //  let price = $('#currencyRackRate').val();
            //  return price ? fn.isNumber(price) && parseInt(price) > 0 ? "clear" : "error" : "warn";
             let price = $('#currencyRackRate').val();
             let flag = price ? fn.isNumber(price) && parseInt(price) > 0 ? "clear" : "error" : "warn";
             remove_msg(flag, 'currencyRackRate')
             return flag
         }
     },
     "currencyPeerPrice": {
         "selector": "#currencyPeerPrice",
         "warnTips": "请填写同行价",
         "errorTips": "同行价只能是正整数",
         "on": "single",
         "type": "text",
         "reg": function (data) {
             let tradePrice = data.pcHkMacauFreeTour ?
                                data.pcHkMacauFreeTour.tradePrice: (
                                    data.pcSpellingTour ? data.pcSpellingTour.tradePrice : data.pcGdFreeTour.tradePrice
                                )
             return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
         },
         "blur": function ($obj) {
             let $colorff8400 = $('#currencyRemaidPrice').find('.color-ff8400');
             let $color333 = $('#currencyRemaidPrice').find('.color-333');
            
             let tradePrice = $('#currencyPeerPrice').val();

             //首先直客价合格 然后验证同行价
             if (tradePrice && fn.isNumber(tradePrice) && parseInt(tradePrice) > 0) {
                 if (CURRENCYOFTHETICKET.currencyRackRate.RackRateReg() == 'clear') {
                     let price = $('#currencyRackRate').val();
                     let remaidPrice = parseInt(price) - parseInt(tradePrice);
                     if (remaidPrice < 0) {
                         CURRENCYOFTHETICKET.currencyPeerPrice.errorTips = '同行价不能大于直客价';
                         return "error";
                     }
                     $colorff8400.text(remaidPrice);
                     if (sessionStorage.getItem("valideTplCode") != 'sanpin') {
                         sessionStorage.getItem("valideTplCode") == 'gangaoziyoutpl' ? $color333.eq(0).text(' ') : $color333.eq(0).text('￥')
                        $color333.eq(1).text('起')
                     }else{
                         $color333.eq(0).text('￥')
                        $color333.eq(1).text('起/人')
                     }
                 }
             }
             CURRENCYOFTHETICKET.currencyPeerPrice.errorTips = '同行价只能是正整数';

             return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
         },
         "PeerReg": function () {

            //  let tradePrice = $('#currencyPeerPrice').val();
            //  return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";

              let tradePrice = $('#currencyPeerPrice').val();
              // return tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
              // let price = $('#currencyRackRate').val();
              let flag = tradePrice ? fn.isNumber(tradePrice) && parseInt(tradePrice) > 0 ? "clear" : "error" : "warn";
              remove_msg(flag, 'currencyPeerPrice')
              return flag
         }
     }
}
//散拼出发排期部分
const TRIALTIME={
    "tt-start": {
        "selector": "#tt-start",
        "warnTips": "请选择出发排期",
        "errorTips": "出发排期已过期,请重新选择",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let useTimeStart = data.pcSpellingTour.useTimeStart;
            return fn.noEmpty(useTimeStart) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let useTimeStart = $('#tt-start').val()
            return fn.noEmpty(useTimeStart) ? "clear" : "warn";
        },

    },
    "tt-end": {
        "selector": "#tt-end",
        "warnTips": "请选择出发排期",
        "errorTips": "出发排期已过期,请重新选择",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let useTimeEnd = data.pcSpellingTour.useTimeEnd;
            //判断结束时间不能比今天小 主要针对已过期产品
            let shelfTime = pageStore.data.productData.shelfTime
            let time = useTimeEnd ? new Date(useTimeEnd).getTime() - shelfTime * 24 * 60 * 60 * 1000 : 0;
            let currTime = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd")).getTime();

            return fn.noEmpty(useTimeEnd) ? time < currTime ? "error" : "clear" : "warn";
        },
        "focus": function ($obj) {
            let useTimeEnd = $('#tt-end').val()
            return fn.noEmpty(useTimeEnd) ? "clear" : "warn";
        },
    }
}

//散拼同行考察 考察时间验证
const THKCTRIALTIME = {
    "tt-start": {
        "selector": "#tt-start",
        "warnTips": "请选择考察时间",
        "errorTips": "考察时间已过期,请重新选择",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let useTimeStart = data.peerInvestigation.useTimeStart;
            //判断结束时间不能比今天小 主要针对已过期产品
            let shelfTime = pageStore.data.productData.shelfTime
            let time = useTimeStart ? new Date(useTimeStart).getTime() - shelfTime * 24 * 60 * 60 * 1000 : 0;
            let currTime = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd")).getTime();
            return fn.noEmpty(useTimeStart) ? time < currTime ? "error" : "clear" : "warn";
        },
        "focus": function ($obj) {
            let useTimeStart = $('#tt-start').val()
            return fn.noEmpty(useTimeStart) ? "clear" : "warn";
        },

    },
    "tt-end": {
        "selector": "#tt-end",
        "warnTips": "请选择考察时间",
        "errorTips": "考察时间已过期,请重新选择",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let useTimeEnd = data.peerInvestigation.useTimeEnd;
            return fn.noEmpty(useTimeEnd) ?  "clear" : "warn";
        },
        "focus": function ($obj) {
            let useTimeEnd = $('#tt-end').val()
            return fn.noEmpty(useTimeEnd) ? "clear" : "warn";
        },
    }
}
//散拼邮轮板块行程天数
const TRIP = {
    "trip-day": {
        "selector": "#trip-day",
        "warnTips": "请填写航程天数",
        "errorTips": "入住天数不能小于入住晚数",
        "on": "single",
        "type": "text",
        "reg": function ({pcSpellingTour}) {
            let tripDay = pcSpellingTour.travelDays;
            // let tripNight = pcSpellingTour.checkIns;
            // console.log(fn.noEmpty(useTimeStart) ? "clear" : "warn")
            return fn.noEmpty(tripDay) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let trip_day = $('#trip-day').val();
            //航程晚数数据通过时执行
            if (trip_day){
                if (TRIP['trip-night'].nightReg() == 'clear') {
                    $('#trip-night').removeClass('itemError').next().removeClass('warning').removeClass('error').text('');
                    let trip_night = $('#trip-night').val();
                    let num = parseInt(trip_day) - parseInt(trip_night);
                    if (num < 0) {
                        return "error";
                    }
                }
            }
            fn.noEmpty(trip_day) ? "" : $('#trip-night').removeClass('itemError').next().removeClass('warning').removeClass('error').text('');
            return fn.noEmpty(trip_day) ? "clear" : "warn";
        },
        //验证航程天数是否合格
        "dayReg":function () {
            let trip_day = $('#trip-day').val();
            let flag = trip_day ? fn.isNumber(trip_day) && parseInt(trip_day) > 0 ? "clear" : "error" : "warn";
            return flag

        }

    },
    "trip-night": {
        "selector": "#trip-night",
        "warnTips": "请填写航程晚数",
        "errorTips": "入住晚数不能大于入住天数",
        "on": "single",
        "type": "text",
        "reg": function ({pcSpellingTour}) {
            let tripDay = pcSpellingTour.travelDays;
            let tripNight = pcSpellingTour.checkIns;
             if (tripDay && tripNight) {
                 $('#trip-day').removeClass('itemError').next().removeClass('warning').removeClass('error').text('');
                 if (parseInt(tripDay) < parseInt(tripNight)) {
                     return "error";
                 }
             }
            return fn.noEmpty(tripNight) ? "clear" : fn.noEmpty(tripDay) ? "warn" : "clear";
        },
        "blur": function ($obj) {
            let trip_night = $('#trip-night').val()
            let trip_day = $('#trip-day').val();
             //航程晚数数据通过时执行
             if (trip_night) {
                 if (TRIP['trip-day'].dayReg() == 'clear') {
                     $('#trip-day').removeClass('itemError').next().removeClass('warning').removeClass('error').text('');
                     let num = parseInt(trip_day) - parseInt(trip_night);
                     if (num < 0) {
                         return "error";
                     } 
                 }
             }

            return fn.noEmpty(trip_night) ? "clear" : fn.noEmpty(trip_day) ?  "warn" : "clear" ;
        },
        //验证航程晚数是否合格
        "nightReg": function () {
            let trip_night = $('#trip-night').val();
            let flag = trip_night ? fn.isNumber(trip_night) && parseInt(trip_night) > 0 ? "clear" : "error" : "warn";
            return flag

        }

    }
}
const CONTACT = {
    "contactPeople": {
        "selector": ".contact-people input",
        "warnTips": "请填写联系人",
        "errorTips": "格式错误，请输入2-32个字",
        "on": "single",
        "type": "text",
        "reg": function ({contactName}) {
            let arr = checkSpecialCharacter(contactName);
            arr.length ? CONTACT.contactPeople.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入' : CONTACT.contactPeople.errorTips = '格式错误，请输入2-32个字';
            return fn.noEmpty(contactName) ? fn.fullname(contactName) ? arr.length ? "error" : "clear" : "error" : "warn";
        },
        "blur": function($obj){
            let contactName = $obj.val();
            let arr = checkSpecialCharacter(contactName);
            arr.length ? CONTACT.contactPeople.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入' : CONTACT.contactPeople.errorTips = '格式错误，请输入2-32个字';
            return fn.noEmpty(contactName) ? fn.fullname(contactName) ? arr.length ? "error" : "clear" : "error" : "warn";
        }
    },
    "contactPhone": {
        "selector": ".contact-phone input",
        "warnTips": "请填写联系电话",
        "errorTips": "格式错误，仅支持大陆/港澳电话（需加区号）",
        "on": "single",
        "type": "text",
        "reg": function ({contactTel}) {
            return fn.noEmpty(contactTel) ? fn.mobileAndPhone(contactTel) ? "clear" : "error" : "warn";
        },
        "blur": function ($obj) {
            let contactTel = $obj.val();
            return fn.noEmpty(contactTel) ? fn.mobileAndPhone(contactTel) ? "clear" : "error" : "warn";
        }
    },
    "contactQQ": {
        "selector": ".contact-qq input",
        "errorTips": "请填写有效QQ",
        "on": "single",
        "type": "text",
        "reg": function ({contactQq}) {
            return fn.noEmpty(contactQq) ? fn.qq(contactQq) ? "clear" : "error" : "clear";
        },
        "blur": function ($obj) {
            let contactQq = $obj.val();
            return fn.noEmpty(contactQq) ? fn.qq(contactQq) ? "clear" : "error" : "clear";
        }
    },
    "contactWinXin": {
        "selector": ".contact-weixin input",
        "errorTips": "请填写有效微信号",
        "on": "single",
        "type": "text",
        "reg": function ({contactWeChat}) {
            let arr = checkSpecialCharacter(contactWeChat);
            arr.length ? CONTACT.contactWinXin.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入' : CONTACT.contactWinXin.errorTips = '格式错误，请输入2-32个字';
            return fn.noEmpty(contactWeChat) ? fn.winxin(contactWeChat) ? arr.length ? "error" : "clear" : "error" : "clear";
        },
        "blur": function ($obj) {
            let contactWeChat = $obj.val();

            let arr = checkSpecialCharacter(contactWeChat);
            arr.length ? CONTACT.contactWinXin.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入' : CONTACT.contactWinXin.errorTips = '格式错误，请输入2-32个字';
            return fn.noEmpty(contactWeChat) ? fn.winxin(contactWeChat) ? arr.length ? "error" : "clear" : "error" : "clear";
        }
    }
};

const WORKTIME = {
    "weekStart": {
        "selector": ".week-start input",
        "warnTips": "请选择工作时间",
        "on": "focus",
        "type": "text",
        "reg": function ({weekStart }) {
            return fn.noEmpty(weekStart) ? "clear" : "warn";
        }
    },
    "weekEnd": {
        "selector": ".week-end input",
        "warnTips": "请选择工作时间",
        "on": "focus",
        "type": "text",
        "reg": function ({weekStart,weekEnd}) {
            return fn.noEmpty(weekStart) ? fn.noEmpty(weekEnd) ? "clear" : "warn" : 'clear';
        }
    },
    // "workTimeStart": {
    //     "selector": ".time-start .time-value",
    //     "warnTips": "请选择工作时间",
    //     "on": "focus",
    //     "type": "text",
    //     "reg": function ({ workTimeStart }) {
    //         return fn.noEmpty(workTimeStart) ? "clear" : "warn";
    //     }
    // },
    // "workTimeEnd": {
    //     "selector": ".time-end .time-value",
    //     "warnTips": "请选择工作时间",
    //     "on": "focus",
    //     "type": "text",
    //     "reg": function ({ workTimeEnd }) {
    //         return fn.noEmpty(workTimeEnd) ? "clear" : "warn";
    //     }
    // }
};

//舱房验证
const WAREHOUSE={
    "warehouseName": {
        "selector": ".warehouse-name input",
        "warnTips": "请填写舱房名称",
        "errorTips": "",
        "on": "single",
        "type": "text",
        "reg": function ({roomName}) {
            return fn.noEmpty(roomName) ? "clear" : "warn";
        },
        "blur": function($obj){
            let roomName = $obj.val();
            return fn.noEmpty(roomName) ? "clear" : "warn";
        }
    },
    "originPrice": {
        "selector": ".warehouse-originPrice input",
        "warnTips": "请填写原价",
        "errorTips": "原价应大于甩卖价",
        "on": "single",
        "type": "text",
        "reg": function ({originPrice,clearancePrice}) {
            if (originPrice && clearancePrice){
                if (parseInt(originPrice) <= parseInt(clearancePrice)){
                    return 'error'
                }
            }
            return fn.noEmpty(originPrice) ?  "clear" : "warn";
        },
        "blur": function ($obj) {
            let originPrice = $obj.val();
            let id=$obj.attr('id').split('_')[1];
            let clearancePrice = $('#clearancePrice_' + id).val();
             if (originPrice && clearancePrice) {
                  //去除提示
                  remove_msg('clear', 'clearancePrice_' + id)
                 if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                     return 'error'
                 }
                
             }
            return fn.noEmpty(originPrice) ?  "clear" : "warn";
        }
    },
    "clearancePrice": {
        "selector": ".warehouse-clearancePrice input",
        "warnTips": "请填写甩卖价",
        "errorTips": "甩卖价应小于原价",
        "on": "single",
        "type": "text",
        "reg": function ({originPrice,clearancePrice}) {
            if (originPrice && clearancePrice) {
                if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                    return 'error'
                }
            }
            return fn.noEmpty(clearancePrice) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let clearancePrice = $obj.val();
            let id = $obj.attr('id').split('_')[1];
            let originPrice = $('#originPrice_' + id).val();
            if (originPrice && clearancePrice) {
                //去除提示
                remove_msg('clear', 'originPrice_' + id)
                if (parseInt(originPrice) <= parseInt(clearancePrice)) {
                    return 'error'
                }
            }
            return fn.noEmpty(clearancePrice) ? "clear" : "warn";
        }
    }
}

// 实力秀
const SHOW = {
    "other": {
        "selector": ".other-bg input",
        "warnTips": "请填写标题",
        "on": "single",
        "type": "text",
        "reg": function ({ capableCategoryName }, i) {
            let $parent = $('#'+ i);
            if (!$parent.find('.upitem-desc').length && !fn.noEmpty($parent.find('.showCase').val())) {
                return "clear";
            }
            return fn.noEmpty(capableCategoryName) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let capableCategoryName = $obj.val();
            let $parent = $obj.parents('.save-other');
            if (!$parent.find('.upitem-desc').length && !fn.noEmpty($parent.find('.showCase').val())) {
                return "clear";
            }
            return fn.noEmpty(capableCategoryName) ? "clear" : "warn";
        }
    }
}

// 价格排期
const PRICESCHEDULE = {
    "save-price": {
        "selector": "#save-price",
        "warnTips": "请设置团期",
        "errorTips": "请设置单人补差价",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            if(pageStore.data.productData.allData && pageStore.data.productData.allData.shelveStatus == '2'){
                return "clear";
            }

            //晚数不为空就必须填写单人补差价
            let nights = data.pageOne.gzaTravelLineList[0].nights;
            let num =0;
            let gzaTravelLineScheduleList = data.pageTwo.gzaTravelLineScheduleList;
            let $priceUnit = $('input[name=priceUnit]:checked');

            for (let i = 0, len = gzaTravelLineScheduleList.length; i < len; i++) {
                if (gzaTravelLineScheduleList[i].openStatus == '1') {
                    num++;
                    if (nights != 0 && !gzaTravelLineScheduleList[i].premiumPrice && $priceUnit.length && $priceUnit.val() == '1') {
                        return 'error'
                    }
                }
            }
            if(num){
                return  "clear";
            }

            return "warn";
        }
    }
}

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
            return fn.noEmpty(featuresDescript) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let featuresDescript = $('#tripFeaturesDesc .showCase').val();
            let arr = checkSpecialCharacter(featuresDescript);
            TRIPFEATURES.tripFeaturesDesc.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(featuresDescript) ? arr.length ? "error" : "clear" : "warn";
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
            required:true
        },
        childrenPriceDesc: {
            warnTips: "请填写儿童价标准",
            data: "childrenPriceDesc",
            required: false
        },
        infantPriceDesc: {
            warnTips: "请填写婴儿价标准",
            data: "infantPriceDesc",
            required: false
        },
        visaDesc: {
            warnTips: "请填写签注说明",
            data: "visaInfo",
            required: true
        },
        reservationDesc: {
            warnTips: "请填写预订须知",
            data: "bookingInfo",
            required: true
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
            return !item.required || fn.noEmpty(val)  ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let val = $("#" + key + ' .showCase').val();
            let arr = checkSpecialCharacter(val);
            obj[key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return !item.required || fn.noEmpty(val) ? arr.length ? "error" : "clear" : "warn";
        }
    }
    return obj;
}

// 旅游车
function busModel(key){
    let obj = {}
    obj["busModel"+ key] = {
        "selector": ".bus-model-select input",
        "warnTips": "请选择车型",
        "on": "focus",
        "type": "text",
        "reg": function ({ busModel }) {
            return fn.noEmpty(busModel) ? "clear" : "warn";
        }
    };
    obj["otherBusModel"+ key] = {
        "selector": ".other-bus-model input",
        "warnTips": "请填写车型",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            return (data.busModel == "其他" && !fn.noEmpty(data.otherBusModel)) ? "warn" : "clear";
        },
        "blur": function ($obj) {
            let otherBusModel = $obj.val();
            return fn.noEmpty(otherBusModel) ? "clear" : "warn";
        }
    };
    obj["busCount" + key] = {
        "selector": ".bus-model-count input",
        "warnTips": "请填写数量",
        "on": "single",
        "type": "text",
        "reg": function ({ busCount }) {
            return fn.noEmpty(busCount) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let busCount = $obj.val();
            return fn.noEmpty(busCount) ? "clear" : "warn";
        }
    };
    return obj;
}

// 线路行程
function lineTrips(key) {
    let obj = {};
    obj["x-city-" + key] = {
        "selector": "#x-city-" + key,
        "warnTips": "请选择城市",
        "errorTips": "暂不支持该城市",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let customPoiId = data.customPoiId;
            let hotelName = data.hotelName;
            return (!fn.noEmpty(hotelName) || fn.noEmpty(customPoiId)) ? "clear" : fn.noEmpty($("#x-city-" + key).val()) ? "error" : "warn";
        }
    }
    obj["x-hotel-" + key] = {
        "selector": "#x-hotel-" + key,
        "warnTips": "请填写酒店名称",
        "errorTips": "",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let customPoiId = data.customPoiId;
            let hotelName = data.hotelName;

            let arr = checkSpecialCharacter(hotelName);
            obj["x-hotel-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(hotelName) ? arr.length ? "error" : "clear" : fn.noEmpty(customPoiId)
            ? "warn" : "clear";
        },
        "blur": function ($obj) {
            let len = $('#lineTrips .line-trips-li:eq('+ (key - 1) +') .select-city').length;
            let hotelName = $("#x-hotel-" + key).val();

            let arr = checkSpecialCharacter(hotelName);
            obj["x-hotel-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(hotelName) ? arr.length ? "error" : "clear" : len != 0
            ? "warn" : "clear";
        }
    }
    obj["x-day-" + key] = {
        "selector": "#x-day-" + key,
        "errorTips": "不能有相同行程天数",
        "on": "focus",
        "type": "select",
        "reg": function (data) {
            let li = $('#lineTrips .line-trips-li');
            for(let i = 1, len = li.length; i <= len; i++){
                if(i != key && data.datOfSort == $('#x-day-' + i).attr('data-value')){
                    return i > key ? "error" : "clear";
                }
            }
            return "clear";
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
            return fn.noEmpty(title) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let title = $("#x-title-" + key).val();
            let arr = checkSpecialCharacter(title);
            obj["x-title-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(title) ? arr.length ? "error" : "clear" : "warn";
        }
    }
    obj["x-food-zao-" + key] = {
        "selector": "input[name=x-food-zao-"+ key +"]",
        "warnTips": "请选择早餐",
        "on": "change",
        "type": "radio",
        "reg": function (data) {
            let breakfastType = data.breakfastType;
            return fn.noEmpty(breakfastType) ? "clear" : "warn";
        }
    }
    obj["x-food-zhong-" + key] = {
        "selector": "input[name=x-food-zhong-"+ key +"]",
        "warnTips": "请选择午餐",
        "on": "change",
        "type": "radio",
        "reg": function (data) {
            let lunchType = data.lunchType;
            return fn.noEmpty(lunchType) ? "clear" : "warn";
        }
    }
    obj["x-food-wan-" + key] = {
        "selector": "input[name=x-food-wan-"+ key +"]",
        "warnTips": "请选择晚餐",
        "on": "change",
        "type": "radio",
        "reg": function (data) {
            let dinnerType = data.dinnerType;
            return fn.noEmpty(dinnerType) ? "clear" : "warn";
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
            return fn.noEmpty(breakfastMemo) ? arr.length ? "error" : "clear" : breakfastType != 1 ? "warn" : "clear";
        },
        "blur": function ($obj) {
            let breakfastMemo = $("#x-food-zao-other-" + key).val();

            let arr = checkSpecialCharacter(breakfastMemo);
            obj["x-food-zao-other-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(breakfastMemo) ? arr.length ? "error" : "clear" : "warn";
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
            return fn.noEmpty(lunchMemo) ? arr.length ? "error" : "clear" : lunchType != 1 ? "warn" : "clear";
        },
        "blur": function ($obj) {
            let lunchMemo = $("#x-food-zhong-other-" + key).val();

            let arr = checkSpecialCharacter(lunchMemo);
            obj["x-food-zhong-other-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(lunchMemo) ? arr.length ? "error" : "clear" : "warn";
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
            return fn.noEmpty(dinnerMemo) ? arr.length ? "error" : "clear" : dinnerType != 1 ? "warn" : "clear";
        },
        "blur": function ($obj) {
            let dinnerMemo = $("#x-food-wan-other-" + key).val();
            
            let arr = checkSpecialCharacter(dinnerMemo);
            obj["x-food-wan-other-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(dinnerMemo) ? arr.length ? "error" : "clear" : "warn";
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
            return fn.noEmpty(planDescript) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let planDescript = $("#x-desc-" + key + ' .showCase').val();
            
            let arr = checkSpecialCharacter(planDescript);
            obj["x-desc-" + key].errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(planDescript) ? arr.length ? "error" : "clear" : "warn";
        }
    }

    return obj;
}

// 散房添加房型
const HOTELROOMTYPE = {
    "salesRoomName": {
        "selector": "#salesRoomName input",
        "warnTips": "请填写销售房型",
        "errorTips": "已存在重复名称，请更改",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let roomName = data.roomName;
            let arr = checkSpecialCharacter(roomName);
            let type = "clear"
            if (fn.noEmpty(roomName)) {
                if (arr.length){
                    HOTELROOMTYPE.salesRoomName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                    type =  "error"
                }else if($('.shop-child-warp h5').text() != '新增房型'){
                    type =  "clear"
                }else{
                    $.ajax({
                        url: '/api/checkRoomName',
                        type: 'post',
                        async: false, //使用同步的方式,true为异步方式
                        data: {
                            method: 'checkRoomName.do',
                            hotelId: $('.shop-child-warp').data('id'),
                            saleRoomId: $('.shop-child-warp').data('sale'),
                            physicalRoomId: $('#physicalRoom').attr('data-value'),
                            roomName: roomName
                        }, //这里使用json对象
                        success: function (data) {
                            if (data.data.code == '00') {
                                if (data.data.data) {
                                    if (data.data.data.isExist) {
                                        HOTELROOMTYPE.salesRoomName.errorTips = '已存在重复名称，请更改';
                                        type = "error"
                                    } else {
                                        type = "clear"
                                    }
                                }
                            } else {
                                msgtips(data.data.subMsg, {
                                    type: 'error'
                                })
                            }
                        },
                        fail: function () {
                            msgtips('系统异常', {
                                type: 'error'
                            })
                        }
                    });
                }
            }else{
                type = "warn";
            }
            if(type == 'clear'){
                $('#salesRoomName .form-item-input').removeClass('form_control')
            }else{
                $('#salesRoomName .form-item-input').addClass('form_control')
            }
            return type;
        },
        "blur": function ($obj) {
            let roomName = $obj.val();
            let arr = checkSpecialCharacter(roomName);
            let type = "clear"
            if (fn.noEmpty(roomName)) {
                if (arr.length) {
                    HOTELROOMTYPE.salesRoomName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
                    type = "error"
                }else{
                    $.ajax({
                        url: '/api/checkRoomName',
                        type: 'post',
                        async: false, //使用同步的方式,true为异步方式
                        data: {
                            method: 'checkRoomName.do',
                            hotelId: $('.shop-child-warp').data('id'),
                            physicalRoomId: $('#physicalRoom').attr('data-value'),
                            saleRoomId: $('.shop-child-warp').data('sale'),
                            roomName: roomName
                        }, //这里使用json对象
                        success: function (data) {
                            if (data.data.code == '00') {
                                if(data.data.data){
                                    if (data.data.data.isExist){
                                        HOTELROOMTYPE.salesRoomName.errorTips = '已存在重复名称，请更改';
                                        type = "error"
                                    }else{
                                        type = "clear"
                                    }
                                } 
                            } else {
                                msgtips(data.data.subMsg, {
                                    type: 'error'
                                })
                            }
                        },
                        fail: function () {
                            msgtips('系统异常', {
                                type: 'error'
                            })
                        }
                    });
                }
            } else {
                type = "warn";
            }
            if (type == 'clear') {
                $('#salesRoomName .form-item-input').removeClass('form_control')
            } else {
                $('#salesRoomName .form-item-input').addClass('form_control')
            }
            return type;
        }
    },
    "hasBreakfast": {
        "selector": "#hasBreakfast",
        "warnTips": "请选择是否含早",
        // "errorTips": "出发排期已过期,请重新选择",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let includeBreakfast = data.includeBreakfast;
            return fn.noEmpty(includeBreakfast) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let includeBreakfast = $obj.val()
            return fn.noEmpty(includeBreakfast) ? "clear" : "warn";
        },
    },
    "hasPolicy": {
        "selector": "#hasPolicy input",
        "warnTips": "请填写最少连住天数",
        "errorTips": "最少连住天数不能小于2天",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let consecutiveDays = data.consecutiveDays;
            let res = '';
            if (data.isConsecutivePolicy == '1'){
                if (fn.noEmpty(consecutiveDays)){
                    if(consecutiveDays < 2){
                        res = 'error'
                    }else{
                        res = 'clear'
                    }
                }else{
                    res = 'warn';
                }
            }else{  
                res = 'clear';
            }

            if (res != 'clear') {
                $('#policyDay').addClass('itemError')
            }
            return res;
        },
        "blur": function ($obj) {
            let consecutiveDays = $obj.val();
            return fn.noEmpty(consecutiveDays) ? lastBookingDays < 2 ? "error" : "clear" : "warn";
        }
    },
    "scheduledDays": {
        "selector": "#scheduledDays input",
        "warnTips": "请填写天数",
        // "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let lastBookingDays = data.lastBookingDays;
            let type = (data.lastBookingDayType == '2' || fn.noEmpty(lastBookingDays)) ? "clear" : "warn";

            return type;
        },
        "blur": function ($obj) {
            let lastBookingDays = $obj.val();
            let type = fn.noEmpty(lastBookingDays) ? "clear" : "warn";

            return type;
        }
    },
    "addBed": {
        "selector": "#addBed",
        "warnTips": "请选择加床信息",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let isAddBed = data.isAddBed;
            return fn.noEmpty(isAddBed) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let isAddBed = $obj.val()
            return fn.noEmpty(isAddBed) ? "clear" : "warn";
        },
    },
    "addBreakfast": {
        "selector": "#addBreakfast",
        "warnTips": "请选择加早信息",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let isAddBreakfast = data.isAddBreakfast;
            return fn.noEmpty(isAddBreakfast) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let isAddBreakfast = $obj.val()
            return fn.noEmpty(isAddBreakfast) ? "clear" : "warn";
        },
    },
    "bookings": {
        "selector": "#bookings",
        // "warnTips": "请填写销售房型",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let bookingNotice = data.bookingNotice;
            let arr = checkSpecialCharacter(bookingNotice);
            HOTELROOMTYPE.bookings.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(bookingNotice) ? arr.length ? "error" : "clear" : "clear";
        },
        "blur": function ($obj) {
            let bookingNotice = $obj.val();
            let arr = checkSpecialCharacter(bookingNotice);
            HOTELROOMTYPE.bookings.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(bookingNotice) ? arr.length ? "error" : "clear" : "clear";
        }
    },
    "cancelPolicy": {
        "selector": "#cancelPolicy",
        "warnTips": "请选择取消政策",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let cancelPolicy = data.cancelPolicy;
            return fn.noEmpty(cancelPolicy) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let cancelPolicy = $obj.val()
            return fn.noEmpty(cancelPolicy) ? "clear" : "warn";
        },
    },
}

// 散房添加排期
const HOTELROOMLIST = {
    "setUp": {
        "selector": "input[name='setUp']",
        "warnTips": "请选择房态设置",
        "on": "change",
        "type": "radio",
        "reg": function (data){
            let roomStatus = data.roomStatus;
            return fn.noEmpty(roomStatus) ? "clear" : "warn";
        }
    },
    "settlementPrice": {
        "selector": "#settlementPrice",
        "warnTips": "请填写结算价",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let settlementPrice = data.settlementPrice;
            return (data.roomStatus == 2 || fn.noEmpty(settlementPrice)) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let settlementPrice = $obj.val();
            return fn.noEmpty(settlementPrice) ? "clear" : "warn";
        }
    },
    "roomCount": {
        "selector": "#roomCount",
        "warnTips": "请填写房量",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let remainedCount = data.remainedCount;
            return (data.roomStatus == 2 || fn.noEmpty(data.id) || fn.noEmpty(remainedCount)) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let remainedCount = $obj.val();
            return fn.noEmpty(remainedCount) ? "clear" : "warn";
        }
    },
    // "roomCountMulti": {
    //     "selector": "#roomCountMulti .room-counts-add,#roomCountMulti .room-counts-reduce",
    //     "warnTips": "请填写房量",
    //     "on": "single",
    //     "type": "text",
    //     "reg": function (data) {
    //         let remainedCount = data.remainedCount;
    //         let val = $('#roomCountMulti .room-counts-radio:checked').val();
    //         if(!fn.noEmpty(data.id) || val == '0' || fn.noEmpty(data.id) && fn.noEmpty(remainedCount)){
    //             return "clear"
    //         }else{
    //             return "warn"
    //         }

    //         // return (fn.noEmpty(data.id) && fn.noEmpty(remainedCount) && val == '1') ? "clear" : "warn";
    //     },
    //     "blur": function ($obj) {
    //         let remainedCount = $obj.val();
    //         let val = $('#roomCountMulti .room-counts-radio:checked').val();
    //         return (fn.noEmpty(remainedCount) && val != '0') ? "clear" : "warn";
    //     }
    // },
    // "roomCountrReduce": {
    //     "selector": "#roomCountMulti.room-counts-radio-reduce",
    //     "warnTips": "请填写房量",
    //     "on": "single",
    //     "type": "text",
    //     "reg": function (data) {
    //         let remainedCount = data.remainedCount;
    //         let val = $('#roomCountMulti .room-counts-radio:checked').val();
    //         return (fn.noEmpty(data.id) && fn.noEmpty(remainedCount) && val == '2') ? "clear" : "warn";
    //     },
    //     "blur": function ($obj) {
    //         let remainedCount = $obj.val();
    //         let val = $('#roomCountMulti .room-counts-radio:checked').val();
    //         return (fn.noEmpty(remainedCount) && val == '2') ? "clear" : "warn";
    //     }
    // }
}

// 散房添加服务
const HOTELROOMSERVICE = {
    "serviceName": {
        "selector": "#serviceName",
        "warnTips": "请填写服务名称",
        "errorTips": "-",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let serviceName = data.serviceName;
            let arr = checkSpecialCharacter(serviceName);
            HOTELROOMSERVICE.serviceName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(serviceName) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let serviceName = $obj.val();
            let arr = checkSpecialCharacter(serviceName);
            HOTELROOMSERVICE.serviceName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(serviceName) ? arr.length ? "error" : "clear" : "warn";
        }
    },
    "serviceType": {
        "selector": "#serviceType",
        "warnTips": "请选择类型",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let serviceType = data.serviceType;
            return fn.noEmpty(serviceType) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let serviceType = $obj.val()
            return fn.noEmpty(serviceType) ? "clear" : "warn";
        },
    },
    "servicePrice": {
        "selector": "#servicePrice",
        "warnTips": "请填写结算价",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let settlementPrice = data.settlementPrice;
            return fn.noEmpty(settlementPrice) ? "clear" : "warn";
        },
        "blur": function ($obj) {
            let settlementPrice = $obj.val();
            return fn.noEmpty(settlementPrice) ? "clear" : "warn";
        }
    },
    "maxCount": {
        "selector": "#maxCount",
        "warnTips": "请选择最大预定数",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let maxBooking = data.maxBooking;
            return fn.noEmpty(maxBooking) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let maxBooking = $obj.val()
            return fn.noEmpty(maxBooking) ? "clear" : "warn";
        },
    },
    "serviceDesc": {
        "selector": "#serviceDesc",
        // "warnTips": "请填写销售房型",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let serviceDescript = data.serviceDescript;
            let arr = checkSpecialCharacter(serviceDescript);
            HOTELROOMSERVICE.serviceDesc.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(serviceDescript) ? arr.length ? "error" : "clear" : "clear";
        },
        "blur": function ($obj) {
            let serviceDescript = $obj.val();
            let arr = checkSpecialCharacter(serviceDescript);
            HOTELROOMSERVICE.serviceDesc.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(serviceDescript) ? arr.length ? "error" : "clear" : "clear";
        }
    },
}

// 共享库存
const SHAREINVENTORY = {
    "product-type": {
        "selector": "input[name='product-type']",
        "warnTips": "请选择产品类型",
        "on": "change",
        "type": "radio",
        "reg": function ({productTypeCode}) {
            return fn.noEmpty(productTypeCode) ? "clear" : "warn";
        }
    },
    "productName": {
        "selector": "#productName",
        "warnTips": "请填写产品名称",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({productName}) {
            let arr = checkSpecialCharacter(productName);
            SHAREINVENTORY.productName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(productName) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let productName = $obj.val();
            let arr = checkSpecialCharacter(productName);
            SHAREINVENTORY.productName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(productName) ? arr.length ? "error" : "clear" : "warn";
        }
    },
    "productFeatures": {
        "selector": "#productFeatures",
        "warnTips": "请填写产品特色",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({productFeatures}) {
            let arr = checkSpecialCharacter(productFeatures);
            SHAREINVENTORY.productFeatures.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(productFeatures) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let productFeatures = $obj.val();
            let arr = checkSpecialCharacter(productFeatures);
            SHAREINVENTORY.productFeatures.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(productFeatures) ? arr.length ? "error" : "clear" : "warn";
        }
    },
    // "productDescript": {
    //     "selector": "#productDescript",
    //     "warnTips": "请填写产品信息",
    //     "errorTips": "您输入的内容含有非法字符",
    //     "on": "single",
    //     "type": "text",
    //     "reg": function ({productDescript}) {
    //         // let arr = checkSpecialCharacter(productDescript);
    //         // SHAREINVENTORY.productDescript.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
    //         return fn.noEmpty(productDescript) ? "clear" : "warn";
    //     },
    //     "blur": function ($obj) {
    //         let productDescript = $obj.val();
    //         // let arr = checkSpecialCharacter(productDescript);
    //         // SHAREINVENTORY.productDescript.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
    //         return fn.noEmpty(productDescript) ?  "clear" : "warn";
    //     }
    // },
    "priceExplain": {
        "selector": "#priceExplain",
        "warnTips": "请填写费用说明",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({priceExplain}) {
            let arr = checkSpecialCharacter(priceExplain);
            SHAREINVENTORY.priceExplain.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(priceExplain) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let priceExplain = $obj.val();
            let arr = checkSpecialCharacter(priceExplain);
            SHAREINVENTORY.priceExplain.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(priceExplain) ? arr.length ? "error" : "clear" : "warn";
        }
    },
    "otherExplain": {
        "selector": "#otherExplain",
        // "warnTips": "请填写其他说明",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({otherExplain}) {
            let arr = checkSpecialCharacter(otherExplain);
            SHAREINVENTORY.otherExplain.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        },
        "blur": function ($obj) {
            let otherExplain = $obj.val();
            let arr = checkSpecialCharacter(otherExplain);
            SHAREINVENTORY.otherExplain.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return arr.length ? "error" : "clear";
        }
    },
    // "distributorLimit": {
    //     "selector": "input[name='distributorLimit']",
    //     "warnTips": "请选择产品类型",
    //     "on": "change",
    //     "type": "radio",
    //     "reg": function ({productTypeCode}) {
    //         return fn.noEmpty(productTypeCode) ? "clear" : "warn";
    //     }
    // },
    "contactName": {
        "selector": "#contactName",
        "warnTips": "请填写联系人",
        "errorTips": "您输入的内容含有非法字符",
        "on": "single",
        "type": "text",
        "reg": function ({contactName}) {
            let arr = checkSpecialCharacter(contactName);
            SHAREINVENTORY.contactName.errorTips = arr.length ? '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入' : '格式错误，请输入2-32个字';
            return fn.noEmpty(contactName) ? fn.fullname(contactName) ? arr.length ? "error" : "clear" : "error" : "warn";
        },
        "blur": function ($obj) {
            let contactName = $obj.val();
            let arr = checkSpecialCharacter(contactName);
            SHAREINVENTORY.contactName.errorTips = arr.length ? '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入' : '格式错误，请输入2-32个字';
            return fn.noEmpty(contactName) ? fn.fullname(contactName) ? arr.length ? "error" : "clear" : "error" : "warn";
        }
    },
    "contactTel": {
        "selector": "#contactTel",
        "warnTips": "请填写联系电话",
        "errorTips": "格式错误，仅支持大陆/港澳电话（需加区号）",
        "on": "single",
        "type": "text",
        "reg": function ({contactTel}) {
            return fn.noEmpty(contactTel) ? fn.mobileAndPhone(contactTel) ? "clear" : "error" : "warn";
        },
        "blur": function ($obj) {
            let contactTel = $obj.val();
            return fn.noEmpty(contactTel) ? fn.mobileAndPhone(contactTel) ? "clear" : "error" : "warn";
        }
    },
}

// 套票
const TICKETSET = {
    "biz_hotel": {
        "selector": "#biz_hotel",
        "warnTips": "请选择酒店",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let hotelName = data.hotelName;
            return fn.noEmpty(hotelName) ? "clear" : "warn";
        }
    },
    "productName": {
        "selector": "#productName",
        "warnTips": "请填写套票名称",
        "errorTips": "-",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let ticketName = data.ticketName;
            let arr = checkSpecialCharacter(ticketName);
            TICKETSET.productName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(ticketName) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let ticketName = $obj.val();
            let arr = checkSpecialCharacter(ticketName);
            TICKETSET.productName.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(ticketName) ? arr.length ? "error" : "clear" : "warn";
        }
    },
    "days": {
        "selector": "#days",
        "warnTips": "请选择晚数",
        "on": "focus",
        "type": "text",
        "reg": function (data) {
            let roomNights = data.roomNights;
            return fn.noEmpty(roomNights) ? "clear" : "warn";
        },
        "focus": function ($obj) {
            let roomNights = $obj.val()
            return fn.noEmpty(roomNights) ? "clear" : "warn";
        },
    },
    "productFeatures": {
        "selector": "#productFeatures",
        "warnTips": "请填写套票说明",
        "errorTips": "-",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let ticketDescript = data.ticketDescript;
            let arr = checkSpecialCharacter(ticketDescript);
            TICKETSET.productFeatures.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(ticketDescript) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let ticketDescript = $obj.val();
            let arr = checkSpecialCharacter(ticketDescript);
            TICKETSET.productFeatures.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(ticketDescript) ? arr.length ? "error" : "clear" : "warn";
        }
    },
    "priceExplain": {
        "selector": "#priceExplain",
        "warnTips": "请填写费用",
        "errorTips": "-",
        "on": "single",
        "type": "text",
        "reg": function (data) {
            let priceDescript = data.priceDescript;
            let arr = checkSpecialCharacter(priceDescript);
            TICKETSET.priceExplain.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(priceDescript) ? arr.length ? "error" : "clear" : "warn";
        },
        "blur": function ($obj) {
            let priceDescript = $obj.val();
            let arr = checkSpecialCharacter(priceDescript);
            TICKETSET.priceExplain.errorTips = '您输入的内容含有非法字符' + arr.join('、') + '，请重新输入';
            return fn.noEmpty(priceDescript) ? arr.length ? "error" : "clear" : "warn";
        }
    },
}

export default class Valide{
    
    constructor(type, key) {
        let obj = DICTIONARIES[type];
        if (type == 'contact') {
            obj = CONTACT;
        } else if (type == 'workTime') {
            obj = WORKTIME;
        } else if (type == 'show') {
            obj = SHOW;
        } else if (type == 'busModel'){
            obj = busModel(key);
        } else if (type == 'currencyOfTheTicket') {
            obj = CURRENCYOFTHETICKET;
        } else if (type == "trialTime"){
            obj = TRIALTIME;
        } else if (type == "THKCTrialTime") {
            obj = THKCTRIALTIME;
        } else if (type == "trip") {
            obj = TRIP;
        } else if (type == 'warehouse') {
            obj = WAREHOUSE;
        } else if (type == 'priceSchedule') {
            obj = PRICESCHEDULE;
        } else if (type == 'tripFeatures') {
            obj = TRIPFEATURES;
        } else if (type == 'otherDesc') {
            obj = otherDesc(key);
        } else if (type == 'lineTrips') {
            obj = lineTrips(key);
        } else if (type == 'hotelRoomType') {
            obj = HOTELROOMTYPE;
        } else if (type == 'hotelRoomList') {
            obj = HOTELROOMLIST;
        } else if (type == 'hotelRoomService') {
            obj = HOTELROOMSERVICE;
        } else if (type == 'ticketSet') {
            obj = TICKETSET;
        } else if (type == 'shareInventory') {
            obj = SHAREINVENTORY;
        }
        this.dictionary = obj;
        this.type = type;
    }

    // 多个列表项获取下标
    getIdx($obj){
        if(this.type == 'contact'){
            return $obj.attr('id');
        }else if(this.type == 'workTime'){
            return $obj.parents('.register-select').find('input').attr('id');
        }else if(this.type == 'show'){
            let id = 0 | $obj.parents('.save-other').find('>.fkp-content >.form-span').attr('id').split('_')[1];
            return 'other_' + id;
        }else if(this.type == 'busModel'){
            return $obj.attr('id');
        } else if (this.type == 'warehouse') {
            return $obj.attr('id');
        }
        return null;
    }

    onSingle($dom, form, isMultiple){
        let obj = this.dictionary;
        // this.dictionary.$dom = $dom;
        // this.dictionary.form = form;
        _.each(obj, (item, key) => {
            // 添加警告提示触发函数
            if(item.warnTips){
                item.warn = (id) => {
                    id ? form[id].addWarn(id, item.warnTips, { className: 'warning' }) : form.addWarn(key, item.warnTips, { className: 'warning' });
                }
            }
            // 添加错误提示触发函数
            if(item.errorTips){
                item.error = (id) => {
                    id ? form[id].addWarn(id, item.errorTips, { className: 'error' }) : form.addWarn(key, item.errorTips, { className: 'error' });
                }
            }
            // 添加清楚提示触发函数
            item.clear = (id) => {
                id ? form[id].removeWarn(id) : form.removeWarn(key);
            }
            // text 类型绑定事件
            item.on && this[item.on]($dom, item);
        });
        return this;
    }

    all(data, idx){
        let collection = [];
        _.each(this.dictionary, (item, key) => {
            let id = fn.noEmpty(idx) ? (key + '_' + idx) : null;
            let state = item.reg(data, id);
            collection.push(state);
            if(state){
                item[state] && item[state](id);
            }
        });
        return collection;
    }

    single($dom, obj){
        return this.blur($dom, obj).focus($dom, obj);
    }
    
    blur($dom, obj){
        let that = this;
        $dom.off('blur.valide', obj.selector).on('blur.valide', obj.selector, function () {
            let $this = $(this);
            let state = obj.blur($this);
            let idx = that.getIdx($this);
            if(state){
                obj[state] && obj[state](idx);
            }
        });
        return this;
    }

    focus($dom, obj) {
        let that = this;
        $dom.off('focus.valide', obj.selector).on('focus.valide', obj.selector, function () {
            let $this = $(this);
            let idx = that.getIdx($this);
            obj.clear(idx);
        })
        return this;
    }

    change($dom, obj) {
        let that = this;
        $dom.off('change.valide', obj.selector).on('change.valide', obj.selector, function () {
            let $this = $(this);
            let idx = that.getIdx($this);
            $(obj.selector + ':checked').val() && obj.clear(idx);
        })
        return this;
    }
}