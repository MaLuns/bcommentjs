<h1 align="center">b-comments</h1>
<p align="center">一个简洁、安全的静态网站评论插件 ，基于腾讯云开发。<p>

## 易用
- 支持回复
- 支持插入表情（可禁用）[TODO]
- 支持 Ctrl + Enter 快捷回复
- 评论框内容实时保存草稿，刷新不会丢失
- 支持私密评论（可禁用）
- 隐私信息安全（通过云函数控制敏感字段（邮箱、IP、环境配置等）不会泄露）
- 支持人工审核模式
- 防 XSS 注入
- 支持限制每个 IP 每 10 分钟最多发表多少条评论

## 即时
- 支持邮件提醒（访客和博主）
- 微信、QQ等[TODO]

## 个性
- 支持自定义“博主”标识文字
- 支持自定义通知邮件模板
- 支持自定义【昵称】【邮箱】【网址】必填 / 选填
- 支持自定义代码高亮主题

## 便捷管理
- 通过邮箱登录快捷回复管理
- 内嵌式管理面板，通过邮箱登录，可方便地查看评论、回复评论、删除评论、修改配置、站点统计信息

## 使用
### 服务端
需要将 `server/comment_server` 部署到腾讯云开发里的云函数。在登陆鉴权方式里，选择邮箱登录进行配置。然后再当前云函数里添加环境变量 `ADMIN`，值为你的管理员账户邮箱。

接下来在客户端打开你的管理面板，点击进行注册，使用你环境变量添加的邮箱。注册好后登录面板就可以进行其他个性化配置了。

### 客户端
插件是基于 Vue3 构建的 web components，所以使用方式和普通 HTML 标签使用方法一致。
``` html
<script src="//imgcache.qq.com/qcloud/cloudbase-js-sdk/1.7.1/cloudbase.full.js"></script>
<script src="//unpkg.com/b-comments/dist/index.min.js"></script>

<!-- 管理面板 -->
<com-comment-admin env="云环境env"></com-comment-admin>
<!-- 评论插件 -->
<com-comment env="云环境env" hash="页面id"></com-comment>
```
