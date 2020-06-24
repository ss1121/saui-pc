module.exports = function(dom, intent, ctx, opts){
  const config = ctx.config
  ctx.fold = {}
  let menusBody = $(dom).find('.'+config.listClass)
  if(ctx.data){
    menusBody.find('li').each(function(ii, item){
      const index = $(item).attr('data-treeid')
      const itemData = ctx.data[index]

      if ($(item).hasClass('itemroot')) {
        if (!itemData) return
        const itemFold = ctx.fold[index] ? ctx.fold[index] : config.fold

        item.itemroot = 'true'
        const sonsList = $(item).find('.itemCategory ul')

        if (itemFold == true || itemFold == 'fold') {
          sonsList.addClass('none')
        }
        else if (itemFold == 'unfold') {
          sonsList.removeClass('none')
        }
        else {
          if (config.fold) sonsList.addClass('none')
          else {
            sonsList.removeClass('none')
          }
        }

        $(item).click(function(e){
          e.stopPropagation()
          sonsList.toggleClass('none')
          ctx.fold[index] = sonsList.hasClass('none') ? 'fold' : 'unfold'
        })
      }
      else {
        $(item).click(function(e){
          e.stopPropagation()
        })
      }
    })
  }

}
