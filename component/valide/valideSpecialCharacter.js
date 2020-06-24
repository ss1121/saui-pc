export default function (str){
    let arr = [];
    str = str + "";
    if(str.indexOf("\\") != -1){
        arr.push('"\\"');
    }
    if(str.indexOf("<") != -1){
        arr.push('"<"');
    }
    if(str.indexOf(">") != -1){
        arr.push('">"');
    }
    // if(/<(\S*?)[^>]*>/.test(str)){
    //     arr.push('"<>"');
    // }
    return arr;
}