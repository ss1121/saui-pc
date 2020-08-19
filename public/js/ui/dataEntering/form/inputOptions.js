const checkTextareaNum = function (inputForm, inputId, inputnum) {         //限制textarea的字数
  function getLength(str) {//处理输入的内容是文字还是字母的函数
    return String(str).replace(/[^\x00-\xff]/g, 'aa').length;
  };
  setTimeout(() => {
    const explain = '#' + inputForm.allocation[inputId].id
    $(explain).off('keyup').on('keyup', function () {
      let curLenght = Math.ceil(getLength($(explain).val()) / 2)
      if (curLenght > inputnum) {
        let num = $(explain).val().substr(0, inputnum);
        $(explain).val(num);
      } else {
        $(explain).parents('.fkp-content').find(".countName").text($(explain).val().length)
      }
    })
  }, 200)
}

module.exports = {
  checkTextareaNum
}