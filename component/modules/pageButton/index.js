/**
* 父组件调用时需要传4个props
* pageSize : 分页大小
* pageNumber  :　当前页码
* totalRow : 总记录数
* pageIndexChange : 页码改变的回调，目录回传的是起始记录位置
* buttonSize : 显示按钮数量 默认值为5, 最好为奇数，否则有可能会出bug
* 
*
* 调用方法：<PageButton pageIndexChange={this.pageChangeHandle} {...this.state} />
*
*/
//分页组件
export default class PageButton extends React.Component {
    constructor(props) {
        super(props);
        this._buttonSize = props.buttonSize || 5;
    }

    render() {
        let props = this.props;
        let totalPage = Math.ceil(props.totalRow / props.pageSize) || 1;
        let list = [];
        if(props.pageNumber == 1){
            list.push(<a key="page-prev-disabled" href="javascript:;" className="page-disabled page-prev">上一页</a>);
        }else{
            list.push(<a key="page-prev" href="javascript:;" className="page-prev" onClick={() => { props.pageIndexChange(props.pageNumber - 1) }}>上一页</a>);
        }
        if(totalPage <= this._buttonSize){
            // 总页数小于this._buttonSize页，则加载所有页
            for (let i = 1; i <= totalPage; i++){
                if (i == props.pageNumber){
                    list.push(<a key={"active-" + i} href="javascript:;" className="page-active">{i}</a>);
                }else{
                    list.push(<a key={i} href="javascript:;" onClick={() => { props.pageIndexChange(i)}}>{i}</a>);
                }
            }
        }else if(totalPage > this._buttonSize){
            // 总页数大于this._buttonSize页，则加载this._buttonSize页
            if (props.pageNumber < this._buttonSize){
                // 当前页小于this._buttonSize，加载1-this._buttonSize页
                for (let i = 1; i < this._buttonSize; i++) {
                    if (i == props.pageNumber) {
                        list.push(<a key={"active-" + i} href="javascript:;" className="page-active">{i}</a>);
                    } else {
                        list.push(<a key={i} href="javascript:;" onClick={() => { props.pageIndexChange(i)}}>{i}</a>);
                    }
                }
                if (props.pageNumber + 1 == this._buttonSize){
                    list.push(<a key={this._buttonSize} href="javascript:;" onClick={() => { props.pageIndexChange(this._buttonSize) }}>{this._buttonSize}</a>);
                }
                if (props.pageNumber <= totalPage - 1){
                    list.push(<span key="omit-next">...</span>);
                    //最后一页码始终显示
                    list.push(<a key={totalPage} href="javascript:;" onClick={() => { props.pageIndexChange(totalPage) }}>{totalPage}</a>);
                }
            } else if (props.pageNumber >= this._buttonSize){
                // 当前页大于等于this._buttonSize

                //1页码始终显示
                list.push(<a key={1} href="javascript:;" onClick={() => { props.pageIndexChange(1)}}>{1}</a>);
                //2页码后面用...代替部分未显示的页码
                list.push(<span key="omit-prev">...</span>);
                let temp = Math.ceil((this._buttonSize - 3) / 2);
                if (props.pageNumber == totalPage){
                    //当前页数等于总页数则是最后一页页码显示在最后
                    for (let i = props.pageNumber - (this._buttonSize - 2); i <= totalPage; i++) {
                        //“...”后面跟三个页码当前页居中显示
                        if (i == props.pageNumber) {
                            list.push(<a key={"active-" + i} href="javascript:;" className="page-active">{i}</a>);
                        } else {
                            list.push(<a key={i} href="javascript:;" onClick={() => { props.pageIndexChange(i)}}>{i}</a>);
                        }
                    }
                }else if (props.pageNumber + temp >= totalPage) {
                    //当前页+1等于总页码
                    
                    for (let i = totalPage - this._buttonSize + 2; i <= totalPage; i++) {
                        //“...”后面跟三个页码当前页居中显示
                        if (i == props.pageNumber) {
                            list.push(<a key={"active-" + i} href="javascript:;" className="page-active">{i}</a>);
                        } else {
                            list.push(<a key={i} href="javascript:;" onClick={() => { props.pageIndexChange(i) }}>{i}</a>);
                        }
                    }
                }else{
                    //当前页小于总页数，则最后一页后面跟...
                    
                    for (let i = props.pageNumber - temp; i <= props.pageNumber + temp; i++) {
                        //“...”后面跟三个页码当前页居中显示
                        if (i == props.pageNumber) {
                            list.push(<a key={"active-" + i} href="javascript:;" className="page-active">{i}</a>);
                        } else {
                            list.push(<a key={i} href="javascript:;" onClick={() => { props.pageIndexChange(i)}}>{i}</a>);
                        }
                    }
                    list.push(<span key="omit-next">...</span>);
                    //最后一页码始终显示
                    list.push(<a key={totalPage} href="javascript:;" onClick={() => { props.pageIndexChange(totalPage) }}>{totalPage}</a>);
                }
            }
        }
        if (props.pageNumber == totalPage) {
            list.push(<a key="page-next-disabled" href="javascript:;" className="page-disabled page-next">下一页</a>);
        } else {
            list.push(<a key="page-next" href="javascript:;" className="page-next" onClick={() => { props.pageIndexChange(props.pageNumber + 1) }}>下一页</a>);
        }

        return <div className="page-button-box">
                    {list}
                </div>
    }
}

PageButton.propTypes = {
    pageIndexChange: React.PropTypes.func.isRequired,
    pageSize: React.PropTypes.number.isRequired,
    totalRow: React.PropTypes.number.isRequired,
    pageNumber: React.PropTypes.number.isRequired
}