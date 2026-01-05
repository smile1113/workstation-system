# 项目介绍：基于gitee用户mozinanqiu的工位图项目进行了扩展
原作者地址：https://gitee.com/mozinanqiu/work-station
本项目优化了原作的固定工位，新增了可以拖拉拽的工位模型，新增了组件库，对每个模型可以分配员工与编排工位信息

## **技术栈：Fabric.js、Vue3、Element-Plus**、Node.js

## MySQL版本： 5.7    启动mysql服务： net start mysql57



### 本项目是实现工位管理，可选择楼层查看不同的楼层工位布局，并且可以通过工位编号和人员姓名进行搜索，方便查看员工位置。并且可以整体放大缩小、拖动工位图。


# 目录介绍：

external 是前端项目，使用 npm install 安装依赖，npm run dev 运行项目

shelf-external-api 是后端项目，使用 npm install 安装依赖,，node app 运行项目
