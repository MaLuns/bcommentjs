# commentjs
一个简洁、安全的静态网站评论系统，基于腾讯云开发。

## 易用
- 支持回复
- 支持插入表情（可禁用）
- 支持 Ctrl + Enter 快捷回复
- 评论框内容实时保存草稿，刷新不会丢失
- 支持私密评论（可禁用）
- 隐私信息安全（通过云函数控制敏感字段（邮箱、IP、环境配置等）不会泄露）
- 支持人工审核模式
- 防 XSS 注入
- 支持限制每个 IP 每 10 分钟最多发表多少条评论

## 即时
- 支持邮件提醒（访客和博主）

## 个性
- 支持自定义“博主”标识文字
- 支持自定义通知邮件模板
- 支持自定义【昵称】【邮箱】【网址】必填 / 选填
- 支持自定义代码高亮主题

## 便捷管理
- 通过邮箱登录快捷回复管理
- 内嵌式管理面板，通过邮箱登录，可方便地查看评论、回复评论、删除评论、修改配置、站点统计信息

## 使用
``` html
<script src="//unpkg.com/vue@3.2.26/dist/vue.runtime.global.prod.js"></script>
<script src="//imgcache.qq.com/qcloud/cloudbase-js-sdk/1.7.1/cloudbase.full.js"></script>
<script src="//unpkg.com/b-comments/dist/index.min.js"></script>

<!-- 管理面板 -->
<com-comment-admin env="云环境env"></com-comment-admin>
<!-- 评论插件 -->
<com-comment env="云环境env" hash="页面id"></com-comment>
```