> Node.js Web开发中封装的一些公共方法和一些demo。


#### 替换字符串中的img标签的路径
```javascript
var imgHtml="<p>&nbsp;<img src='/images/upload/Image/59b860a6N27a4b1fc.jpg' width='100%'><img src='/images/upload/Image/59b860b4N53f06414.jpg' width='100%'></p>";
var rege=/<img [^>]*src=['"]([^'"]+)[^>]*>/gi;                      
var dasda=imgHtml.replace(rege,function(arg1,arg2,arg3){
   return "<img src='http://127.0.0.1:8080/"+arg2+"' width='100%'>"
 });
console.log(dasda)
 //<p>&nbsp;<img src='http://127.0.0.1:8080/images/upload/Image/59b860a6N27a4b1fc.jpg' width='100%'><img src='http://127.0.0.1:8080/images/upload/Image/59b860b4N53f06414.jpg' width='100%'></p>
```