<center><font color=#0099ff size=6 face="黑体">微服务</font></center>
==
[TOC]
***

**命令提示**
--------
``` bash
# 安装依赖
npm install

# 开发环境
npm start 或者 npm run dev

# 测试环境
npm run sit

# 生产环境，生成打包文件夹/dist
npm run build
```
**Window变量**
---
Vue : 方便查看全局注册的组件、指令等信息 (开发环境) 
mock : 开启mockjs模拟数据 （开发环境） 
Common ：记录公共函数（所有环境）

**请求结构(发送)**
---
分页用pageNum(页数)，pageSize(每页条数)，total(返回总条数)

**请求结构(返回)**
---
```json
{ status: 200, data: {}, message: '请求成功' }
```

**UEditor**
----
> 
<font color='red'>注意：</font>static下的UEditor轻易别替换，替换了请按下面步骤重新弄

1. 使用了vue-ueditor-wrap，其作者修复了一些官方bug，不是官方版本，所以要去vue-ueditor-wrap的github上拿
2. 修复输入!@#等字符不能触发contentChange的bug, 删除源文件中相应的判断

        7487行：删除“|| evt.shiftKey”条件判断
        14390行：删除me.keydown事件的“&& !evt.shiftKey”条件判断
        14429行：删除me.keydown事件的“&& !evt.shiftKey”条件判断
3. 修改获取config文件的路径
  - 找到getActionUrl方法: 改为
  ``` javascript
  function(action){
    var actionName = this.getOpt(action) || action,
        imageUrl = this.getOpt('imageUrl'),
        serverUrl = this.getOpt('serverUrl'),
        configUrl = this.getOpt('getConfigUrl') || '';

    if(!serverUrl && imageUrl) {
        serverUrl = imageUrl.replace(/^(.*[\/]).+([\.].+)$/, '$1controller$2');
    }

    if(serverUrl) {
        if(action === 'config' && configUrl) serverUrl = configUrl;
        else serverUrl = serverUrl + (serverUrl.indexOf('?') == -1 ? '?':'&') + 'action=' + (actionName || '');
        return utils.formatUrl(serverUrl);
    } else {
        return '';
    }
}
4. *添加cancelZIndex配置项 搜索修改后源文件里的 var zIndex
```
