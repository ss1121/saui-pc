class Table extends React.Component {
    constructor(props) {
        super(props);
        if(props.sortable){
            props.columns = props.columns.map(item => {
                item.asc = false;
                item.desc = false;
                return item;
            })
        }
        this.state = {
            data: [
                // {
                //     "bookDescript": "",
                //     "checkIns": 1,
                //     "countries": "NaN",
                //     "createTime": 1516613806000,
                //     "createUserId": 1,
                //     "cruiseLineCategoryId": 9,
                //     "cruiseLineName": "测试",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 193,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 15165504000001,
                //     "departureEndDate": null,
                //     "departurePort": 440100,
                //     "departurePortName": "广州市",
                //     "departureStartDate": null,
                //     "id": 193,
                //     "introList": null,
                //     "lastModifyTime": 1516613806000,
                //     "lastModifyUserId": 1,
                //     "lineScheduleId": 643,
                //     "passportDescript": "",
                //     "poins": "110100",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 2,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 1,
                //     "countries": "1",
                //     "createTime": 1516615006000,
                //     "createUserId": 1,
                //     "cruiseLineCategoryId": 9,
                //     "cruiseLineName": "测试",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 198,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1516550400000,
                //     "departureEndDate": null,
                //     "departurePort": 440100,
                //     "departurePortName": "广州市",
                //     "departureStartDate": null,
                //     "id": 198,
                //     "introList": null,
                //     "lastModifyTime": 1516675605000,
                //     "lastModifyUserId": 1,
                //     "lineScheduleId": 682,
                //     "passportDescript": "",
                //     "poins": "131100,130200,110100,211400",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 2,
                //     "version": 16
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 4,
                //     "countries": "1",
                //     "createTime": 1516333197000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "厦门-海上狂欢-天津 5天4晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 43,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1516896000000,
                //     "departureEndDate": null,
                //     "departurePort": 350200,
                //     "departurePortName": "厦门市",
                //     "departureStartDate": null,
                //     "id": 43,
                //     "introList": null,
                //     "lastModifyTime": 1516333197000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 305,
                //     "passportDescript": "",
                //     "poins": "120100,350200",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 5,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516333703000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-福冈-佐世保 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 44,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1518537600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 44,
                //     "introList": null,
                //     "lastModifyTime": 1516333703000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 306,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334273000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎-佐世保 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 47,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1519833600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 47,
                //     "introList": null,
                //     "lastModifyTime": 1516334273000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 322,
                //     "passportDescript": "",
                //     "poins": "120100,659029341,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342175000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-下关6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 49,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1520265600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 49,
                //     "introList": null,
                //     "lastModifyTime": 1516342175000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 329,
                //     "passportDescript": "",
                //     "poins": "659029366,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1520697600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 310,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342386000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 51,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1521129600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 51,
                //     "introList": null,
                //     "lastModifyTime": 1516342386000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 332,
                //     "passportDescript": "",
                //     "poins": "659029276,120100",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342175000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-下关6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 49,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1521561600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 49,
                //     "introList": null,
                //     "lastModifyTime": 1516342175000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 330,
                //     "passportDescript": "",
                //     "poins": "659029366,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1521993600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 311,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1522425600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 312,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342559000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-福冈-长崎6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 52,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1522857600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 52,
                //     "introList": null,
                //     "lastModifyTime": 1516342559000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 333,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342287000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 50,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1523289600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 50,
                //     "introList": null,
                //     "lastModifyTime": 1516342287000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 331,
                //     "passportDescript": "",
                //     "poins": "120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334487000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎-福冈6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 48,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1523721600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 48,
                //     "introList": null,
                //     "lastModifyTime": 1516334487000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 323,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1524153600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 313,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334487000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎-福冈6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 48,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1524585600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 48,
                //     "introList": null,
                //     "lastModifyTime": 1516334487000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 328,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342806000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎（过夜）6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 53,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1525017600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 53,
                //     "introList": null,
                //     "lastModifyTime": 1516342830000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 338,
                //     "passportDescript": "",
                //     "poins": "120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 2
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516333867000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-长崎6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 45,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1525449600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 45,
                //     "introList": null,
                //     "lastModifyTime": 1516333867000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 307,
                //     "passportDescript": "",
                //     "poins": "120100,659029275,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1525881600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 314,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516343297000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-福冈（过夜）6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 54,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1526313600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 54,
                //     "introList": null,
                //     "lastModifyTime": 1516343297000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 341,
                //     "passportDescript": "",
                //     "poins": "659029276,120100",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1526745600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 315,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516342806000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎（过夜）6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 53,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1527177600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 53,
                //     "introList": null,
                //     "lastModifyTime": 1516342830000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 339,
                //     "passportDescript": "",
                //     "poins": "120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 2
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516343465000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-北九州-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 55,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1527609600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 55,
                //     "introList": null,
                //     "lastModifyTime": 1516343465000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 342,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029318",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334487000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-长崎-福冈6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 48,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1528041600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 48,
                //     "introList": null,
                //     "lastModifyTime": 1516334487000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 324,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029275",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516334139000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-福冈 6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 46,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1528473600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 46,
                //     "introList": null,
                //     "lastModifyTime": 1516334139000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 316,
                //     "passportDescript": "",
                //     "poins": "659029276,120100,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // },
                // {
                //     "bookDescript": "",
                //     "checkIns": 5,
                //     "countries": "1,4",
                //     "createTime": 1516333867000,
                //     "createUserId": 1029,
                //     "cruiseLineCategoryId": 10,
                //     "cruiseLineName": "天津-佐世保-长崎6天5晚",
                //     "cruisesBrandId": 12,
                //     "cruisesId": 45,
                //     "cruisesSeriseId": 27,
                //     "deleteStatus": 1,
                //     "departureDate": 1528905600000,
                //     "departureEndDate": null,
                //     "departurePort": 120100,
                //     "departurePortName": "天津市",
                //     "departureStartDate": null,
                //     "id": 45,
                //     "introList": null,
                //     "lastModifyTime": 1516333867000,
                //     "lastModifyUserId": 1029,
                //     "lineScheduleId": 308,
                //     "passportDescript": "",
                //     "poins": "120100,659029275,659029341",
                //     "priceDescript": "",
                //     "productName": null,
                //     "scheduleList": null,
                //     "seriseBrandName": "歌诗达邮轮",
                //     "seriseName": "幸运号",
                //     "travelDays": 6,
                //     "version": 1
                // }
            ],
            selecteds: [],
            allSelected: false,
            columns: props.columns,
            emptyText: props.emptyText || '暂无数据'
        };
    }

    resetSort(arr){
        return arr.map(item => {
            item.asc = false;
            item.desc = false;
            return item;
        });
    }

    changeSort(field){
        if (!this.state.data.length) {
            return false;
        }
        let sortType = '';
        let columns = this.state.columns.map(item => {
            if (item.field == field){
                if (!item.desc && !item.asc){
                    item.asc = true;
                    item.desc = false;
                    sortType = 'asc';
                }else{
                    item.asc = !item.asc;
                    item.desc = !item.desc;
                    sortType = item.asc ? 'asc' : 'desc';
                }
            }else{
                item.asc = false;
                item.desc = false;
            }
            return item;
        });
        this.setState({
            columns: columns
        });
        this.props.changeSort(field, sortType);
    }

    changeAllSelect(){
        if (!this.state.data.length){
            this.setState({allSelected: false});
        }else{
            if (!this.state.allSelected && this.props.maxLength && this.state.data.length > this.props.maxLength) {
                this.props.maxLengthCb && this.props.maxLengthCb(this.props.maxLength);
                return false;
            }
            let allSelected = !this.state.allSelected;
            let data = this.state.data.map((item, idx) => {
                item.checked = allSelected;
                return item;
            });
    
            this.setState({
                data: data,
                allSelected: allSelected
            });
        }
    }

    changeSelect(index, currentChecked){
        let allSelected = true;
        let selectedCounts = 0;
    
        let data = this.state.data.map((item, idx) => {
            if(index == idx){
                item.checked = !item.checked;
            }
            if(!item.checked){
                allSelected = false;
            }else{
                selectedCounts++
            }
            return item;
        });

        if (!currentChecked && this.props.maxLength && selectedCounts > this.props.maxLength) {
            this.props.maxLengthCb && this.props.maxLengthCb(this.props.maxLength);
            data[index].checked = false;
            return false;
        }
        
        this.setState({
            data: data,
            allSelected: allSelected
        });
    }

    getHead() {
        let sortable = this.props.sortable;
        let _this = this;
        return this.state.columns.map((item, idx) => {
            if (idx == 0 && item.checkbox){
                return <li key={idx} className="check-item" style={{ width: item.width }}><label onClick={() => { _this.changeAllSelect() }} className="c-check"><input type="checkbox" checked={_this.state.allSelected} /><span className="fkp-checkbox-box" ></span><span>{item.title}</span></label></li>
            }else{
                if(sortable){
                    return <li key={idx} className={'sortable' + (item.asc ? ' asc' : '') + (item.desc ? ' desc' : '')} style={{ width: item.width, textAlign: item.align }} onClick={() => { _this.changeSort(item.field)}}>{item.title}</li>
                }else{
                    return <li key={idx} style={{ width: item.width, textAlign: item.align }}>{item.title}</li>
                }
                
            }
        });
    }

    getBody(){
        let _this = this;
        return this.state.data.length ? this.state.data.map((data, index) => {
            if(!data.checked){
                data.checked = false;
            } 
            return  <li key={data.lineScheduleId}>
                        <ul className="table-list">
                            {this.state.columns.map((item, idx) => {
                                if (idx == 0 && item.checkbox) {
                                    return <li key={data.lineScheduleId + '_' + idx} className="check-item" style={{ width: item.width }}><label onClick={() => { _this.changeSelect(index, data.checked) }}  className="c-check"><input type="checkbox" checked={data.checked} /><span className="fkp-checkbox-box"></span></label></li>
                                } else {
                                    return  <li key={data.lineScheduleId + '_' + idx} style={{ width: item.width, textAlign: item.align }}>
                                                {item.formatter ? item.formatter(data[item.field], data, index) : data[item.field]}
                                            </li>
                                }
                            })}
                        </ul>
                    </li>
        }) : <li className="no-data">{this.props.emptyText}</li>;
    }

    render() {
        let state = this.state;

        return <div className="table-normal-box">
                    <ul className="table-head">
                        {this.getHead()}
                    </ul>
                    <ul className="table-body">
                        {this.getBody()}
                    </ul>
                </div>
    }
}

const Actions = {
    UPDATE: function (ostate, props) {
        // 全更新，排序也重置，选中也重置
        let curState = $.extend({}, this.curState, props)
        curState.columns = curState.columns.map(item => {
            item.asc = false;
            item.desc = false;
            return item;
        });
        return curState;
    },
    CHANGESORT: function (ostate, props) {
        // 只更新body
        let data = this.curState.data;
        props.data = props.data.map(item => {
            for(let i = 0, len = data.length; i < len; i++){
                if (item.lineScheduleId == data[i].lineScheduleId){
                    item.checked = data[i].checked;
                }
            }
            return item;
        });
        let curState = $.extend({}, this.curState, props)
        return curState;
    },
    SETSELECTED: function(ostate, selecteds){
        // 设置选中项
        let data = this.curState.data;
        for (let i = 0, len = data.length; i < len; i++) {
            if (selecteds.indexOf(data[i].lineScheduleId) != -1) {
                data[i].checked = true;
            }
        }
        let curState = $.extend({}, this.curState, {data});
        return curState;
    }
}


export default function table(opt) {
    const instance = Aotoo(Table, Actions)

    instance.setProps(opt)
    instance.$update = function (props) {
        this.dispatch('UPDATE', props)
    }
    instance.$changeSort = function (props) {
        this.dispatch('CHANGESORT', props)
    }

    instance.$getSelected = function () {
        let data = instance.getState().data;
        let selecteds = [];
        for(let i = 0, len = data.length; i < len; i++){
            data[i].checked && selecteds.push(data[i]);
        }
        return selecteds;
    }

    instance.$setSelected = function (selecteds){
        this.dispatch('SETSELECTED', selecteds)
    }

    return instance
}