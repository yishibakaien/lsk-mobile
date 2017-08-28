# hack file-loader 
- 解决 extractTextPlugin 提取css 加载本地图片资源url不正确问题

## separate url from emitFile method by replacing with another parameter to that means url() in css would be written with name but the image file will emit to different location to
```js
{ test: /\.png$/, loader: "file-loader?name=../assets/[name].[ext]&to=./assets/[name].[ext]" }
```
## issue 地址
- [https://github.com/webpack/webpack/issues/1370](https://github.com/webpack/webpack/issues/1370)
