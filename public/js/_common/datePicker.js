import 'component/modules/datetimepicker/jq'

const util = {
    jsxFun: function (id, val, placeholder, type = '') {
        const cls = type == 'time' ? ' time' : ' '
        return  <label className={"form-datepicker ss-display" + cls}>
                    <input id={id} className="form_control" type="text" placeholder={placeholder || ''} defaultValue={val} readOnly />
                    <span className="fkp-input-error"></span>
                </label>
    },
    single: function($obj, opt){
        let param = {
            type: 'default',
            disabledSelect: opt.disabledSelect, //禁止年月下拉
        }
        if (opt.startDate){
            param.startDate = opt.startDate;
        }
        if (opt.endDate) {
            param.endDate = opt.endDate;
        }
        if (opt.currentMonth) {
            param.currentMonth = opt.currentMonth;
        }
        $obj.datepicker(param).off('changeDate').on('changeDate', function (e, date) {
            opt.cb && opt.cb(date)
        })

        $obj.off('focus').on('focus', function () {
            util.removeError($obj)
        })
    },
    double: function ($obj1, $obj2, opt) {
        let param = {
            type: 'double',
            disabledSelect: opt.disabledSelect, //禁止年月下拉
        }
        if (opt.startDate) {
            param.startDate = opt.startDate;
        }
        if (opt.endDate) {
            param.endDate = opt.endDate;
        }

        $obj1.datepicker(param).on('changeDate', function (e, date) {
            $obj2.click().datepicker(param)
            $obj2.click().datepicker('setStartDate', date)
            $obj2.datepicker('setDateScope', date)
            opt.cb && opt.cb(date)
        })

        $obj1.off('focus').on('focus', function () {
            util.removeError($obj1)
        })

        $obj2.off('focus').on('focus', function () {
            util.removeError($obj2)
        })
    },
    month: function ($obj, opt) {
        $obj.datepicker({
            type: 'month',
        }).on('changeDate', function (e, date) {
            opt.cb && opt.cb(date)
        })

        $obj.off('focus').on('focus', function () {
            util.removeError($obj)
        })
    },
    dayTime: function ($obj, opt) {
        let param = {
            type: 'default',
            timelist: true,
            disabledSelect: true,
        }
        if (opt.startDate) {
            param.startDate = opt.startDate;
        }
        if (opt.endDate) {
            param.endDate = opt.endDate;
        }

        $obj.datepicker(param).on('changeDate', function (e, date) {
            opt.cb && opt.cb(date)
        })
        $obj.off('focus').on('focus', function () {
            util.removeError($obj)
        })
    },
    addError: function ($obj, str, type = 'warning') {
        $obj.addClass('itemError');
        $obj.siblings('.fkp-input-error').text(str).addClass(type)
    },
    removeError($obj) {
        $obj.removeClass('itemError');
        $obj.siblings('.fkp-input-error').text('').removeClass('warning').removeClass('error');
    }
}

export default util