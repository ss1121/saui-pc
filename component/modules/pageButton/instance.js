/**
* 父组件调用时需要传4个props
* pageSize : 分页大小
* pageNumber  :　当前页码
* totalRow : 总记录数
* pageIndexChange : 页码改变的回调，目录回传的是起始记录位置
* buttonSize : 显示按钮数量 默认值为5, 最好为奇数，否则有可能会出bug
* 
*
* 调用方法：let pageButton = PageButton({pageIndexChange: Function, {...this.state}})
*             pageButton.render()
* 更新方法：pageButton.$update({...this.state})
*/
//分页组件
class PageButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: props.pageNumber,
            totalRow: props.totalRow,
            pageSize: props.pageSize
        };
        this._buttonSize = props.buttonSize || 5;
    }

    pageIndexChange(num) {
        this.setState({
            pageNumber: num
        })
        this.props.pageIndexChange(num)
    }

    render() {
        let state = this.state;
        let totalPage = Math.ceil(state.totalRow / state.pageSize) || 1;
        let list = [];

        let prevPage = state.pageNumber - 1;
        list.push(<li key={"page-pre"} className="page-pre" onClick={() => { this.pageIndexChange(prevPage || totalPage) }}><a href="javascript:;">‹</a></li>);

        if (totalPage <= this._buttonSize) {
            // 总页数小于this._buttonSize页，则加载所有页
            for (let i = 1; i <= totalPage; i++) {
                if (i == state.pageNumber) {
                    list.push(<li key={"active-" + i} className="page-number active"><a href="javascript:;">{i}</a></li>);
                } else {
                    list.push(<li key={i} className="page-number"  onClick={() => { this.pageIndexChange(i) }}><a href="javascript:;">{i}</a></li>);
                } 
            }
        } else if (totalPage > this._buttonSize) {
            // 总页数大于this._buttonSize页，则加载this._buttonSize页
            if (state.pageNumber < this._buttonSize) {
                // 当前页小于this._buttonSize，加载1-this._buttonSize页
                for (let i = 1; i < this._buttonSize; i++) {
                    if (i == state.pageNumber) {
                        list.push(<li key={"active-" + i} className="page-number active"><a href="javascript:;" className="page-active">{i}</a></li>);
                    } else {
                        list.push(<li key={i} className="page-number"  onClick={() => { this.pageIndexChange(i) }}><a href="javascript:;">{i}</a></li>);
                    }
                }
                if (state.pageNumber + 1 == this._buttonSize) {
                    list.push(<li key={this._buttonSize} className="page-number"  onClick={() => { this.pageIndexChange(this._buttonSize) }}><a href="javascript:;">{this._buttonSize}</a></li>);
                }
                if (state.pageNumber <= totalPage - 1) {
                    list.push(<li key="omit-next" className="page-last-separator disabled"><a href="javascript:;">...</a></li>);
                    //最后一页码始终显示
                    list.push(<li key={totalPage} className="page-number"  onClick={() => { this.pageIndexChange(totalPage) }}><a href="javascript:;">{totalPage}</a></li>);
                }
            } else if (state.pageNumber >= this._buttonSize) {
                // 当前页大于等于this._buttonSize

                //1页码始终显示
                list.push(<li key={1} className="page-number"  onClick={() => { this.pageIndexChange(1) }}><a href="javascript:;">{1}</a></li>);
                //2页码后面用...代替部分未显示的页码
                list.push(<li key="omit-prev" className="page-last-separator disabled"><a href="javascript:;">...</a></li>);
                let temp = Math.ceil((this._buttonSize - 3) / 2);
                if (state.pageNumber == totalPage) {
                    //当前页数等于总页数则是最后一页页码显示在最后
                    for (let i = state.pageNumber - (this._buttonSize - 2); i <= totalPage; i++) {
                        //“...”后面跟三个页码当前页居中显示
                        if (i == state.pageNumber) {
                            list.push(<li key={"active-" + i} className="page-number active"><a href="javascript:;" className="page-active">{i}</a></li>);
                        } else {
                            list.push(<li key={i} className="page-number"  onClick={() => { this.pageIndexChange(i) }}><a href="javascript:;">{i}</a></li>);
                        }
                    }
                } else if (state.pageNumber + temp >= totalPage) {
                    //当前页+1等于总页码

                    for (let i = totalPage - this._buttonSize + 2; i <= totalPage; i++) {
                        //“...”后面跟三个页码当前页居中显示
                        if (i == state.pageNumber) {
                            list.push(<li key={"active-" + i} className="page-number active"><a href="javascript:;" className="page-active">{i}</a></li>);
                        } else {
                            list.push(<li key={i} className="page-number"  onClick={() => { this.pageIndexChange(i) }}><a href="javascript:;">{i}</a></li>);
                        }
                    }
                } else {
                    //当前页小于总页数，则最后一页后面跟...

                    for (let i = state.pageNumber - temp; i <= state.pageNumber + temp; i++) {
                        //“...”后面跟三个页码当前页居中显示
                        if (i == state.pageNumber) {
                            list.push(<li key={"active-" + i} className="page-number active"><a href="javascript:;" className="page-active">{i}</a></li>);
                        } else {
                            list.push(<li key={i} className="page-number"  onClick={() => { this.pageIndexChange(i) }}><a href="javascript:;">{i}</a></li>);
                        }
                    }
                    list.push(<li key="omit-next" className="page-last-separator disabled"><a href="javascript:;">...</a></li>);
                    //最后一页码始终显示
                    list.push(<li key={totalPage} className="page-number"  onClick={() => { this.pageIndexChange(totalPage) }}><a href="javascript:;">{totalPage}</a></li>);
                }
            }
        }
        let nextPage = state.pageNumber + 1;

        list.push(<li key={"page-next"} className="page-next" onClick={() => { this.pageIndexChange(nextPage > totalPage ? 1 : nextPage) }}><a href="javascript:;">›</a></li>)

        let cCounts = state.pageSize * (state.pageNumber - 1);

        let cTotal = cCounts + state.pageSize;

        cTotal = state.totalRow < cTotal ? state.totalRow : cTotal;

        return  <div className='row-flex-justify-between-center'>
                    {state.totalRow ? <p className="color-999 mtb20">显示第 {cCounts + 1} 到第 {cTotal} 条记录，总共 {state.totalRow} 条记录</p> : null}
                    {totalPage > 1 ? <ul className="pagination">
                        {list}
                    </ul> : null}
                </div>
    }
}

PageButton.propTypes = {
    pageIndexChange: React.PropTypes.func.isRequired,
    pageSize: React.PropTypes.number.isRequired,
    totalRow: React.PropTypes.number.isRequired,
    pageNumber: React.PropTypes.number.isRequired
}

const Actions = {
    UPDATE: function (ostate, props) {
        let curState = $.extend({}, this.curState, props)
        return curState
    }
}


export default function pageButton(opt) {
    const instance = Aotoo(PageButton, Actions)

    instance.setProps(opt)
    instance.$update = function (props) {
        this.dispatch('UPDATE', props)
    }

    return instance
}