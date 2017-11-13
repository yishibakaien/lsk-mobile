/*!
 * created by cloud_cb linyunbin on 2017/11/13
 * lsk-mobile v0.0.1
 * Copyright  2017, cloud_cb linyunbin, ISC license
 */
webpackJsonp([19],{44:function(e,t){},78:function(e,t,n){"use strict";var i=n(1),o=n(10);n(0),n(44);var r=(0,i.getQueryString)("searchId");!function(){if(!r)return void(document.querySelector(".noresult-tip").style.display="block");var e={id:r,pageNo:1,pageSize:20};(0,o.getResult)(e,function(t){e.searchId&&(console.log(t),0===t.data.list.length&&Toast.info("未找到相似花型",2e3),document.querySelector("div").innerHTML=JSON.stringify(t.data))})}()}},[78]);