import {validator, strLen} from 'libs'

// 包团组团校验
function valideGroupGroup(){
    const valide = validator();

    const reg = {
        // 联系人
        fullname: /^[\u4e00-\u9fa5]{2,4}$/,
        // 联系电话(支持港澳手机、大陆手机、座机)|大陆手机|香港手机|澳门手机|大陆固话|港澳固话
        mobileAndPhone: /^[1][3456789]\d{9}$|^(00)?852([5|6|9])\d{7}$|^(00)?853[6]\d{7}$|^0\d{2,3}-?\d{7,8}(-\d{1,6})?$|^0085[23]-?\d{8}(-\d{1,6})?$/,
        // QQ
        qq: /^[1-9]([0-9]{4,10})([0-9]{1,4})?$/,
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
        busCount: /^([1-9]\d{0,3}|10000)$/
    }

    const fn = {
        // 不为空
        noEmpty: function(str){
            return _.isNumber(str) || !_.isEmpty(str);
        },
        // 联系人
        fullname: function(str){
            return fn.noEmpty(str) && reg.fullname.test(str);
        },
        // 联系电话
        mobileAndPhone: function(str){
            return fn.noEmpty(str) && reg.mobileAndPhone.test(str);
        },
        // QQ
        qq: function(str){
            return !fn.noEmpty(str) || reg.qq.test(str);
        },
        // 飞行小时
        flightHours: function(str){
            return fn.noEmpty(str) && reg.flightHours.test(str) && parseFloat(str) <= 72;
        },
        // 机位配额
        seats: function(str){
            return fn.noEmpty(str) && reg.seats.test(str);
        },
        // 海报标题
        productTitle: function(str){
            let type = str.slice(str.length - 1, str.length) == '+' ? false : true;
            return fn.noEmpty(str) && type;
        },
        // 海报价格
        posterPrice: function(str){
            return fn.noEmpty(str) && reg.posterPrice.test(str);
        },
        // 出发机场
        depAirPortName: function(obj){
            return fn.noEmpty(obj.depAirPortName) && obj.depAirPortName != obj.arrAirPortName
        },
        // 到达机场
        arrAirPortName: function(obj){
            return fn.noEmpty(obj.arrAirPortName) && obj.depAirPortName != obj.arrAirPortName
        },
        // 航班号
        flightNumber: function(str){
            return fn.noEmpty(str) && reg.flightNumber.test(str);
        },
        // 机型
        planModelName: function(str){
            return fn.noEmpty(str) && str.length <= 20;
        },
        // 到达时间
        arrDate: function(obj){
            if(fn.noEmpty(obj.arrDate)){
                return false;
            }
            let time = parseFloat(obj.depTime.split(':')[0]) + parseFloat(obj.flightHours);
            if(time < 24 && obj.arrDate == '1'){
                return true;
            }else if(time >= 24 && time < 48 && obj.arrDate == '2'){
                return true;
            }else if(time >= 48 && time < 72 && obj.arrDate == '3'){
                return true;
            }else{
                return false;
            }
        },
        // 包房数
        roomCount: function(str){
            return fn.noEmpty(str) && reg.roomCount.test(str);
        },
        // 配额房
        quotaRoomCount: function(str){
            return fn.noEmpty(str) && reg.roomCount.test(str);
        },
        // 成团规则
        packageCount: function(obj){
            return fn.noEmpty(obj.str) && reg.packageCount.test(obj.str) && parseFloat(obj.str) <= obj.num;
        },
        // 同行价
        adultPrice: function(str){
            return fn.noEmpty(str) && reg.adultPrice.test(str);
        },
        // 车队规模
        busCount: function(str){
            return fn.noEmpty(str) && reg.busCount.test(str);
        },
        // 车队简介
        travelBusDetail: function(obj){
            if(!obj.busModel){
                return false;
            }else if(obj.busModel == '其他' && !obj.otherBusModel){
                return false;
            }else if(!obj.busCount){
                return false;
            }else if(obj.hasHk && !obj.yuegangBusCount && /^\D+$/.test(obj.yuegangBusCount)){
                return false;
            }else if(obj.hasMC && !obj.yueaoBusCount && /^\D+$/.test(obj.yueaoBusCount)){
                return false;
            }

            // 是否选中城际、省际
            for (let item of obj.productProperties){
                if(item.propertyCode == 'serviceScope' && (Number(obj.yuegangBusCount) + Number(obj.yueaoBusCount) > obj.busCount)){
                    return false;
                }
            }

            // 车型不允许重复
            if(obj.busModel == '其他'){
                let otherBusModelArr = _.map(obj.arr, 'otherBusModel');
                return otherBusModelArr.indexOf(obj.otherBusModel) == otherBusModelArr.lastIndexOf(obj.otherBusModel);
            }else{
                let busModelArr = _.map(obj.arr, 'busModel');
                return busModelArr.indexOf(obj.busModel) == busModelArr.lastIndexOf(obj.busModel);
            }
            return true;
        },
        // 产品属性
        productProperty: function(obj){
            if (obj.productPropertyValue.indexOf('其他') != -1){
                return fn.noEmpty(obj.productPropertyValueIds) && obj.otherValue
            }else{
                return fn.noEmpty(obj.productPropertyValueIds)
            }  
        },
        // 发布供应联系人
        contactName: function(str){
            return fn.noEmpty(str) && (str + '').length <= 8 && (str + '').length >= 2;
        },
        // 航班排期
        pcCruises: function(arr){
            return arr.length && fn.noEmpty(arr[0].lineScheduleId)
        }
    }

    let pushErrToArr = (query, errs) => _.map(errs, 'key');

    // 联系方式
    function contactInfo(arr){
        let state = [];
        if (arr){
            arr.forEach((item, idx) => {
                let tempArr = valide(item.contactName, '联系人', fn.contactName)
                    (item.contactTel, '电话', fn.mobileAndPhone)
                    (item.contactQq, 'QQ', fn.qq)
                    (pushErrToArr);
                state.push(tempArr);
            });
        }else{
            state = [['联系人', '电话']];
        }
        return state;
    }

    function workTime(arr){
        let state = [];
        arr.forEach((item, idx) =>{
            let tempArr = valide(item.workTimeStart, '工作时间开始', fn.noEmpty)
                (item.workTimeEnd, '工作时间结束', fn.noEmpty)
                (pushErrToArr);
            state.push(tempArr);
        });
        return state;
    }

    // 车型分布
    function travelBusDetail(arr){
        let data = {};
        let state = [];
        arr.forEach((item, idx) => {
            if (data[item.serviceScope]){
                data[item.serviceScope].push(item);
            }else{
                data[item.serviceScope] = [item];
            }
        });

        for(let p in data){
            let otherBusModelArr = [];
            data[p].forEach((item, idx) => {
                if (item.busModel == '其他' && (!fn.noEmpty(item.otherBusModel) || otherBusModelArr.indexOf(item.otherBusModel) != -1)){
                    state.indexOf((item.otherBusModel || p) + '车型') == -1 && state.push((item.otherBusModel || p) + '车型');
                }else if (!fn.noEmpty(item.busModel) || !fn.noEmpty(item.busCount) || /^\D+$/.test(item.busCount)){
                    state.indexOf((item.otherBusModel || p) + '车型') == -1 && state.push((item.otherBusModel || p) + '车型');
                }
                if(item.busModel == '其他'){
                    otherBusModelArr.push(item.otherBusModel);
                }
            });
        }
        return state;
    }

    function powerShowX(data){
        let state = [];
        // if(fn.noEmpty(data.individualGroupImages)){
        //     let individualGroupImages = data.individualGroupImages.split(',');
        //     let individualGroupImagesIntro = data.individualGroupImagesIntro.split(',');
        //     for (let i = 0, len = individualGroupImages.length; i < len; i++) {
        //         if (!fn.noEmpty(individualGroupImagesIntro[i])) {
        //             state.push('散拼' + '必须填写图片描述');
        //             $('#individualGroup' + ' .upload-pic-desc:eq(' + i + ')').addClass('itemError');
        //             break;
        //         }
        //     }
        // }

        // if(fn.noEmpty(data.trafficImages)){
        //     let trafficImages = data.trafficImages.split(',');
        //     let trafficImagesIntro = data.trafficImagesIntro.split(',');
        //     for (let i = 0, len = trafficImages.length; i < len; i++) {
        //         if (!fn.noEmpty(trafficImagesIntro[i])) {
        //             state.push('大交通' + '必须填写图片描述');
        //             $('#traffic' + ' .upload-pic-desc:eq(' + i + ')').addClass('itemError');
        //             break;
        //         }
        //     }
        // }

        return state;
    }

    // 实力秀
    function powerShow(arr){
        let state = [];
        arr.forEach((item, idx) => {
            if (!fn.noEmpty(item.capableCategoryName)){
                state.push('其他实力秀必须填写标题');
            }else if (item.isPublic == '2' && !fn.noEmpty(item.unpublicizedReason)){
                state.push(item.capableCategoryName + '必须填写不公示理由');
            } else if (item.isPublic == '0' && (fn.noEmpty(item.introduce) || fn.noEmpty(item.fileArr) || fn.noEmpty(item.imageArr) || fn.noEmpty(item.imageArr))){
                state.push(item.capableCategoryName + '必须选择是否公示');
            }
            // if(fn.noEmpty(item.imageArr)){
            //     let imageArr = item.imageArr.split(',');
            //     let imageArrIntro = item.imageArrIntro.split(',');
            //     for(let i = 0, len = imageArr.length; i < len; i++){
            //         if (!fn.noEmpty(imageArrIntro[i])){
            //             state.push(item.capableCategoryName + '必须填写图片描述');
            //             $('#'+ item.capableCategoryCode + ' .upload-pic-desc:eq('+ i +')').addClass('itemError');
            //             break;
            //         }
            //     }
            // }
        });
        return state;
    }
    function packageHotelSchedule() {
        let state = [];
        if (sessionStorage.getItem('price_valid_data')==0){
            state.push('价格排期不能为空！');
          }
        return state; 
    }

    return {
        // 包团组团基本信息
        baotuanzutuan: function(data){
            let state1 = 
                // 出发地
                valide(data.departCityName, '出发地', fn.noEmpty)
                // 目的地
                (data.destination, '目的地', fn.noEmpty)(pushErrToArr);
            
            // 大交通能力
            let state2 = [];
            data.productProperties.forEach((item, idx) => {
                let tempArr = valide(item, item.productPropertyName, fn.productProperty)(pushErrToArr);
                state2.push(...tempArr);
            });

            // 联系方式
            let state3 = contactInfo(data.contactInfo);

            // 工作时间
            let state4 = workTime(data.workTimeInfo);

            // 实力秀
            let state5 = powerShow(data.capableShows);

            return { state1, state2, state3, state4, state5 };
        },
        // 包团地接基本信息
        baotuandijie: function (data) {
            let state1 =
                // 目的地
                valide(data.destination, '目的地', fn.noEmpty)(pushErrToArr);

            // 属性
            let state2 = [];
            data.productProperties.forEach((item, idx) => {
                let tempArr = valide(item, item.productPropertyName, fn.productProperty)(pushErrToArr);
                state2.push(...tempArr);
            });

            // 联系方式
            let state3 = contactInfo(data.contactInfo);

            // 工作时间
            let state4 = workTime(data.workTimeInfo);

            // 类似实力秀（散拼、大交通）
            let state5 = powerShowX(data.packageDomestic);

            // 实力秀
            let state6 = powerShow(data.capableShows);

            return { state1, state2, state3, state4, state5, state6 };
        },
        // 包机切位
        planeCut: function(data){
            let state1 = [];
            data.airLineVoyege.forEach((obj, i) => {
                state1.push(
                    obj.airLineSegment.map((item, idx) => {
                        let tempArr = 
                        valide({depAirPortName: item.depAirPortName, arrAirPortName: item.arrAirPortName}, '出发机场', fn.depAirPortName)
                        ({depAirPortName: item.depAirPortName, arrAirPortName: item.arrAirPortName}, '到达机场', fn.arrAirPortName)
                        (item.flightNumber, '航班号', fn.flightNumber)
                        (item.airCompanyName, '航空公司', fn.noEmpty)
                        (item.planModelName, '机型', fn.planModelName)
                        (item.flightHours, '飞行时间', fn.flightHours)
                        ({depTime: item.depTime, flightHours: item.flightHours, arrDate: item.arrDate+''}, '到达时间', fn.arrDate)(pushErrToArr);
                        return tempArr;
                    })
                )
            });
            
            let state2 = valide(data.schedule, '航班班期', fn.noEmpty)
                        (data.seats + '', '机位配额', fn.seats)
                        (data.expiryDateStart + '', '包切位有效期开始', fn.noEmpty)
                        (data.expiryDateEnd + '', '包切位有效期结束', fn.noEmpty)(pushErrToArr);

            return {state1, state2}
        },
        // 酒店套票
        hotelSet: function(data){
            // 酒店景点
            let state1 = [];
            if (_.map(data.productProperties, { 'productPropertyValueIds': '3'})[0]){
                state1 = 
                    valide(data.microPosterPoi3, '酒店', fn.noEmpty)(pushErrToArr);
            }else{
                state1 = 
                    valide(data.microPosterPoi3, '酒店', fn.noEmpty)
                    (data.microPosterPoi2, '景点', fn.noEmpty)(pushErrToArr);
            }

            let state2 = 
                valide(data.productTitle, '海报标题', fn.productTitle)
                (data.lowestMarketPrice, '门市价', fn.posterPrice)
                (data.lowestPrice, '同行价', fn.posterPrice)
                (data.microPoster.posterImage, '上传海报', fn.noEmpty)
                (data.microPoster.productDescript, '套票说明', fn.noEmpty)
                (data.microPoster.useTimeStart, '适用时间开始', fn.noEmpty)
                (data.microPoster.useTimeEnd, '适用时间结束', fn.noEmpty)
                (data.advertPeriod, '发布有效期', fn.noEmpty)(pushErrToArr);

            // 联系方式
            let state3 = contactInfo(data.contactInfo);

            return {state1, state2, state3};
        },
        // 景点门票
        scenicSet: function(data){
            // 景点
            let state1 = [];
            state1 = 
            valide(data.microPosterPoi, '景点', fn.noEmpty)
            (pushErrToArr);

            let state2 = 
                valide(data.productTitle, '海报标题', fn.productTitle)
                (data.lowestMarketPrice, '门市价', fn.posterPrice)
                (data.lowestPrice, '同行价', fn.posterPrice)
                (data.microPoster.posterImage, '上传海报', fn.noEmpty)
                (data.microPoster.productDescript, '套票说明', fn.noEmpty)
                (data.microPoster.useTimeStart, '适用时间开始', fn.noEmpty)
                (data.microPoster.useTimeEnd, '适用时间结束', fn.noEmpty)
                (data.advertPeriod, '发布有效期', fn.noEmpty)(pushErrToArr);

            // 联系方式
            let state3 = contactInfo(data.contactInfo);

            return {state1, state2, state3};
        },
        classicLine: function(data){
            // 经典线路
            let state = 
                valide(data.lineTitle, 'b-line-name', fn.noEmpty)
                (data.lineSpecial, 'b-title-theme', fn.noEmpty)
                (data.tourDays, 'b-day', fn.noEmpty)
                (data.checkInDays, 'b-night', fn.noEmpty)(pushErrToArr);
            return state;
        },
        hotelGroupBooking: function(data){
            // 酒店团房
            let packageHotel = data.packageHotel;

            let state1 = 
                valide(packageHotel.hotelId, '酒店', fn.noEmpty)
                (pushErrToArr);
            // 成团规格
            let state2=[];
            let res =/^([1-9]|[1][0-9]|[2][0])$/;
            if (!res.test(packageHotel.packageNum)){
                state2.push('成团规则只能是1到20的整数');
            }

            // 联系方式
            let state3 = contactInfo(data.contactInfo);

            // 工作时间
            let state4 = workTime(data.workTimeInfo);

            // 实力秀
            // let state4 = powerShow(data.capableShows);

            //价格排期
            let state5 = packageHotelSchedule();
            // return { state1, state2, state3, state4 state5};
            return { state1, state2, state3,state4,state5 };
        },
        ticketGroupBooking: function(data){
            // 门票团票
            let packageScenicTicket = data.packageScenicTicket;
            //如果门票价为0 那么不验证同行价
            let state1 = [];
                
                if (data.lowestMarketPrice!='0'){
                    state1=valide(packageScenicTicket.scenicId, '景点', fn.noEmpty)
                        (data.lowestPrice, '同行价', fn.adultPrice)
                        (pushErrToArr);
                }else{
                     state1 = valide(packageScenicTicket.scenicId, '景点', fn.noEmpty)
                         (pushErrToArr);
                }
                


            // 联系方式
            let state2 = contactInfo(data.contactInfo);

            // 工作时间
            let state3 = workTime(data.workTimeInfo);

            // 实力秀
            let state4 = powerShow(data.capableShows);

            return { state1, state2, state3, state4 };
        },
        // 旅游车
        tourBus: function(data){
            let state1 = [];
            let travelBus = JSON.parse(data.travelBus);
            data.productProperties.forEach((item, idx) => {
                // 服务范围
                let tempArr = valide(item, item.productPropertyName, fn.productProperty)(pushErrToArr);
                state1.push(...tempArr);
            });

            let state2 = 
                valide(data.destination, '目的地', fn.noEmpty)
                (pushErrToArr);

            // 车型分布
            let state3 = travelBusDetail(travelBus);
            
            // 联系方式
            let state4 = contactInfo(data.contactInfo);

            // 工作时间
            let state5 = workTime(data.workTimeInfo);

            return { state1, state2, state3, state4, state5};
        },
        // 签证
        visa: function (data) {
            let state1 = [];
            let travelBus = data.travelBus;
            data.productProperties.forEach((item, idx) => {
                // 护照类型、签证类型、领区
                let tempArr = valide(item, item.productPropertyName, fn.productProperty)(pushErrToArr);
                state1.push(...tempArr);
            });

            let state2 =
                valide(data.destination, '签证国家', fn.noEmpty)(pushErrToArr);

            // 联系方式
            let state3 = contactInfo(data.contactInfo);

            // 工作时间
            let state4 = workTime(data.workTimeInfo);

            // 实力秀
            let state5 = powerShow(data.capableShows);

            return { state1, state2, state3, state4, state5 };
        },
        // 邮轮
        cruise: function(data){
            let pcCruises = JSON.parse(data.pcCruises)
            let state1 =
                valide(data.cruisesBrandId, '邮轮系列', fn.noEmpty)
                    (pcCruises, '航班排期', fn.pcCruises)
                    (pushErrToArr);

            // 联系方式
            let state2 = contactInfo(data.contactInfo);

            // 工作时间
            let state3 = workTime(data.workTimeInfo);

            // 实力秀
            let state4 = powerShow(data.capableShows);

            return { state1, state2, state3, state4 };
        },
        gangaoziyou:function (data) {
            //海报标题
            let state1 =[]
            if (!fn.noEmpty(data.pcHkMacauFreeTour.productTitle)){
                state1.push('海报标题不能为空');
            }
             
           
           //海报路径
            let state2 = []
            if (!fn.noEmpty(data.pcHkMacauFreeTour.posterImage)){
                state2.push('海报不能为空');
            }
           //门市价
            let state3 = []
            if (!fn.noEmpty(data.pcHkMacauFreeTour.price)){
                state3.push('门市价不能为空');
            }
            
           //同行价
            let state4 = [];
            if (!fn.noEmpty(data.pcHkMacauFreeTour.tradePrice)) {
                state3.push('同行价不能为空');
            } 
           //套票说明
            let state5 =[]; 
            if (!fn.noEmpty(data.pcHkMacauFreeTour.ticketDesc)){
                state5.push('海报说明不能为空');
            }
           //工作时间
            let state6 = contactInfo(data.contactInfo);
           //联系方式
            let state7 = workTime(data.workTimeInfo);
  
            return [ state1, state2, state3, state4, state5, state6, state7 ]
        },
        sanpin: function (data) {
            //出发地
            let state1 = []
            if (!fn.noEmpty(data.departCityCode)) {
                state1.push('出发地不能为空');
            }

            //目的地
            let state2 = []
            if (!fn.noEmpty(data.destination)) {
                state2.push('目的地不能为空');
            }
            //海报标题
            let state3 = []
            if (!fn.noEmpty(data.pcSpellingTour.productTitle)) {
                state3.push('海报标题不能为空');
            }

            //海报路径
            let state4 = []
            if (!fn.noEmpty(data.pcSpellingTour.posterImage)) {
                state4.push('海报不能为空');
            }
            //门市价
            let state5 = []
            if (!fn.noEmpty(data.pcSpellingTour.price)) {
                state5.push('门市价不能为空');
            }

            //同行价
            let state6 = [];
            if (!fn.noEmpty(data.pcSpellingTour.tradePrice)) {
                state6.push('同行价不能为空');
            }
            //套票说明
            let state7 = [];
            if (!fn.noEmpty(data.pcSpellingTour.ticketDesc)) {
                state7.push('海报说明不能为空');
            }
            let state8=[];
             if (!fn.noEmpty(data.pcSpellingTour.useTimeStart)) {
                 state8.push('海报适用日期开始日期不能为空');
             }
             if (!fn.noEmpty(data.pcSpellingTour.useTimeEnd)) {
                 state8.push('海报适用日期结束日期不能为空');
             }
            //工作时间
            let state9 = contactInfo(data.contactInfo);
            //联系方式
            let state10 = workTime(data.workTimeInfo);

            return [state1, state2, state3, state4, state5, state6, state7, state8, state9,state10]
        }
    }
}

export default valideGroupGroup()