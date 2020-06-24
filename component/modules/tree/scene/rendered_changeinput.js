module.exports = function(dom, intent, ctx, opts){
  let dft = [{
      select: opts[0].select || '.searchicon',
      eventType: opts[0].eventType || 'click',
      eventMethod: opts[0].eventMethod || function (){}
    }]
  if(opts){
    dft = [];
    opts.forEach(function(row) {
      dft.push({
        select: row.select || '.searchicon',
        eventType: row.eventType || 'click',
        eventMethod: row.eventMethod || function (){}
      })
    });
  }
  dft.forEach(function (row){
    $(dom).find(row.select)[row.eventType](function(e){
      e.stopPropagation()
      row.eventMethod($(this));
    })
  })
  
  

}
