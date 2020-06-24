module.exports = function(data){
  let rtn = []
  const _data = _.cloneDeep(data||[])

  _data.map(function(item, i){
   rtn.push(
     {
       title: (
         <div className='rowlist'>
           <div className='s-edit disN'>
             <input type='text' defaultValue={item.title} data-oldValue={item.title} maxLength='10' className='delborder' />
               <a herf='javascript:;' className='btn-c2585cf submitbtn icon-check'></a>
             </div>
           <div className='searchicon'>
             <span>{item.title}（{item.attr.num}）</span>
             <p className='disN'>
               <a href='javascript:;' className='s-edit-btn icon-qianbi'></a>
               <a href='javascript:;' className='s-del-btn icon-close'></a>
             </p>
           </div>
         </div>
       )
     }
   )
 })
  return rtn
}
