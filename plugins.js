
/**
 * 动态样式表
*/
define("mysoft/plugins/workload/styles", ["jquery"], function($) {
    // 统计面板样式
    var statistics = `
    .my-workload-statistics{
      position: fixed;
      left: 199px;
      bottom: 0;
      right: 0;
      height: 130px;
      background: #fff;
      z-index: 100;
      border: 1px solid #dddddd;
      border-right: 0;
      padding: 10px 20px;
      box-sizing: border-box;
    }
    .my-workload-statistics__title{
      margin-bottom: 9px;
    }
    .my-workload-statistics__detail{
      margin: 0;
      list-style: none;
      padding: 0;
      display: table;
      border-collapse: collapse;
    }
    .my-workload-statistics__item{
      display: table-cell;
      border: 1px solid #ddd;
      padding: 6px 15px;
      text-align: center;
      min-width: 70px;
      position: relative;
    }
    .my-workload-statistics__item-label{
      display: block;
      color: #999;
      position: relative;
      z-index: 3;
    }
    .my-workload-statistics__item-target{
      display: block;
      font-size: 20px;
      position: relative;
      z-index: 3;
    }
    .my-workload-statistics__item-percentage{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #f5f9bc;
      opacity: .5;
    }
  `
  var arrange = `.my-workload-arrange{
      word-break: break-all;
    }
    .my-workload-arrage__filter{
      padding: 20px;
    }
    .my-worklaod-arrage__result table{
      border-collapse: collapse;
      table-layout: fixed;
    }
    .my-worklaod-arrage__result th.is-first,
    .my-worklaod-arrage__result td.is-first{
      white-space: nowrap;
      min-width: 100px;
      width: 100px;
    }
    .my-workload-arrange__table-head th{
      border-right: 1px solid #ddd;
    }
    .my-workload-arrange__table-head{
      overflow: hidden;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
    }
    .my-workload-arrange__table-head-inner{
      width: 99999999px;
    }
    .my-workload-arrange__table-head th{
      white-space: nowrap;
      height: 27px;
      line-height: 27px;
      color: #707070;
      padding: 0 12px;
      text-align: left;
      width: 180px;
      min-width: 180px;
    }
    .my-workload-arrange__table-body{
      height: 480px;
      overflow: auto;
    }
    .my-workload-arrange__table-body tr:hover{
      background-color: #f5f5f5;
    }
    .my-worklaod-arrage__result tbody td{
      padding: 6px 12px;
      vertical-align: top;
      width: 180px;
      min-width: 180px;
      border: 1px solid #ddd;
    }
    .my-workload-arrange-filter__item{
      display: inline-block;
      vertical-align: top;
      line-height: 30px;
      margin-right: 15px;
    }
    .my-workload-arrange-filter__item-target{
      display: inline-block;
      vertical-align: top;
    }
    .my-workload-arrange-filter__story,
    .my-workload-arrange-filter__people{
      border: 1px solid #ddd;
      border-radius: 3px;
      padding-left: 6px;
      padding-right: 6px;
      height: 30px;
      box-sizing: border-box;
      width: 220px;
    }
    .my-workload-arrange-issue:before{
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: #666;
      vertical-align: middle;
      margin-right: 4px;
    }
    .my-workload-arrange-issue__total{
      text-align: right;
      margin-right: 9px;
      color: #999;
    }
    .myosft-statistics-subtask__total{
      background: #f9f9f9;
      padding: 6px 12px;
      border-bottom: 1px solid #ddd;
    }
    .myosft-statistics-subtask__total:after{
      content: '';
      display: block;
      clear: both;
    }
    .myosft-statistics-subtask__total span{
      float: right;
    }
  `
  var commentTemplate = `
    .comment-btn-template {
        margin-left:10px
    }
  `
  var updateState = `
    .aui-style-plugin{
      background-color: #f7f3c5!important;
    }
  `
  var subTaskStatistics = `
    #view-subtasks td.takeuptime{
      white-space: nowrap;
    }
    #view-subtasks td.takeuptime span{
      display: block;
    }
    #issuetable td.progress, .issue-table td.progress, #issuetable td.aggregateprogress, .issue-table td.aggregateprogress{
      width: 100px;
      max-width: 100px;
      min-width: 100px;
    }
    #issuetable td.progress>table, .issue-table td.progress>table, #issuetable td.aggregateprogress>table, .issue-table td.aggregateprogress>table{
      width: 120px;
    }
    #view-subtasks{
      position: relative;
    }
    .myosft-statistics-subtask{
      position: absolute;
      left: 100%;
      top: 0;
      padding: 40px 0 0 12px;
    }
    .myosft-statistics-subtask__inner{
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 3px;
      white-space: nowrap;
    }
    .myosft-statistics-subtask__item{
      padding: 6px 12px;
      border-bottom: 1px solid #ddd;
    }
    .myosft-statistics-subtask__item:last-child{
      border-bottom: 0;
    }
    .myosft-statistics-subtask__item:hover{
      background-color: #f3f3f3;
    }
  `
  return {
    statistics,
    arrange,
    commentTemplate,
    updateState,
    subTaskStatistics
  }
})

/**
 * api集合
*/
define("mysoft/plugins/workload/apis", ["jquery", "mysoft/plugins/workload/utils"], function($, utils) {
    return {
        /**
     * 根据过滤ID获取问题列表数据
    */
        getIssuesByFilter: function(filterId) {
            var me = this
            return new Promise(function(resolve, reject) {
                if (!filterId) {
                    return reject()
                }
                $.ajax({
                    url: 'https://jira.mingyuanyun.com/rest/api/2/filter/' + filterId
                }).then(function(data) {
                    me.getIssuesByJql(data.jql).then(resolve, reject)
                }, reject)
            }
            )
        },
        /**
     * 根据查询语句获取问题列表数据
    */
        getIssuesByJql: function(jql) {
            return $.ajax({
                url: 'https://jira.mingyuanyun.com/rest/api/2/search',
                data: {
                    jql: jql,
                    startAt: 0,
                    maxResults: 400 // 最多返回200条数据
                }
            })
        },
        /**
         * 获取问题数据
        */
        findIssueData: function (issueId) {
          return $.ajax({
            url: 'https://jira.mingyuanyun.com/rest/api/2/issue/' + issueId
          })
        },
        /**
         * 根据问题数据找到所有关联的父级以及相关问题
        */
        findParentAndIssuelinks: function (issuesData) {
          var me = this
          return new Promise(function(resolve, reject){
            var findParentKeys = [] // 需要查找的父级
            var findParentRequests = []
            var findIssueLinks = [] // 关联的问题
            var issuesMap = {}
            _.each((issuesData || {}).issues, function (issue) {
              issuesMap[issue.key] = issue
            })
            _.each((issuesData || {}).issues, function (issue) {
              var fields = issue.fields
              if (fields.parent && !issuesMap[fields.parent.key] && _.indexOf(findParentKeys, fields.parent.key) < 0) {
                findParentKeys.push(fields.parent.key)
              }
            })
            findParentRequests = _.map(findParentKeys, function (key) {
              return me.findIssueData(key)
            })
            Promise.all(findParentRequests).then(function(parents) {
              issuesData.issues = [].concat(issuesData.issues, parents || [])
              _.each(parents, function (issue) {
                _.each(issue.fields.issuelinks, function (link) {
                  if (_.indexOf(findIssueLinks, link.outwardIssue.key) < 0 && !issuesMap[link.outwardIssue.key]) {
                    findIssueLinks.push(link.outwardIssue.key)
                  }
                })
              })
              Promise.all(_.map(findIssueLinks, function (key) {
                return me.findIssueData(key)
              })).then(function(issueLinks) {
                issuesData.issues = [].concat(issuesData.issues, issueLinks || [])
                resolve(issuesData)
              }, function () {
                resolve(issuesData)
              })
            }, function () {
              resolve(issuesData)
            })
            // console.log(findParentKeys)
          })
        },
        /**
         * 根据url参数搜索列表数据
        */
        getIssuesByUrl: function(url) {
            var me = this
            return new Promise(function(resolve, reject) {
                var urlParams = utils.getUrlParams(url)
                if (!urlParams) {
                    return reject()
                }
                if (!urlParams.filter && !urlParams.jql) {
                    return reject('必须指定过滤条件')
                }
                if (urlParams.jql) {
                    me.getIssuesByJql(urlParams.jql).then(function(data){
                      me.findParentAndIssuelinks(data).then(resolve, reject)
                    }, reject)
                } else {
                    me.getIssuesByFilter(urlParams.filter).then(function(data){
                      me.findParentAndIssuelinks(data).then(resolve, reject)
                    }, reject)
                }
            })
        }
    }
});

/**
 * 工具库
*/
define("mysoft/plugins/workload/utils", ["jquery"], function($) {
    var re = /(?:\\?|#|&)([^&#?=]*)=([^&#?=]*)(?:$|&|#)/gi
    return {
        /**
     * 获取URL参数
    */
        getUrlParams: function(url) {
            var temp
            var result = {}
            while ((temp = re.exec(url)) != null) {
                result[temp[1]] = decodeURIComponent(temp[2])
            }
            return result
        },
        /**
     * 对比两个对象是否相等
    */
        isEqual: function(obj1, obj2) {
            if (!obj1 && !obj2) {
                return true
            }
            if (obj1 === obj2) {
                return true
            }
            if ((obj1 && !obj2) || (!obj1 && obj2)) {
                return false
            }
            return JSON.stringify(obj1) === JSON.stringify(obj2)
        },
        /**
     * 轮询执行函数
    */
        pollRunFn: function(fn, time) {
            var me = this
            setTimeout(function() {
                if (fn() !== false) {
                    me.pollRunFn(fn, time)
                }
            }, time)
        },
        /**
     * 设置样式
    */
        setStyle: function(styles) {
            var $style = $('<style></style>')
            $style.html(styles)
            $('head').append($style)
        },
        /**
     * 从数据中找到指定项的位置
    */
        indexOf: function(data, fn) {
            var index = -1
            if (data && data.length) {
                data.some(function(v, i) {
                    if (fn(v)) {
                        index = i
                        return true
                    }
                })
            }
            return index
        },
        /**
           * 格式化日期
          */
        formatterDateToDay: function(second) {
            if (!second || typeof second !== 'number') {
                return 0
            }
            return Number((second / 60 / 60 / 8).toFixed(1))
        }
    }
});

/**
 * 工作编排面板
*/
define('mysoft/plugins/workload/arrange', [
  'jquery',
  'underscore',
  "mysoft/plugins/workload/apis",
  "quick-edit/util/loading-indicator",
  "jira/ajs/keyboardshortcut/keyboard-shortcut-toggle",
  "jira/dialog/form-dialog",
  "wrm/require",
  "mysoft/plugins/workload/styles",
  "mysoft/plugins/workload/utils"
], function($, _, apis, loading, keyboardshortcut, dialog, request, styles, utils) {
    // var g
    // var a = function(l) {
    //   var k = "wr!com.atlassian.jira.jira-quick-edit-plugin:quick-edit-issue";
    //   var j = request([k]);
    //   j.then(function() {
    //       var n = require("quick-edit/init/edit");
    //       if (!g) {
    //           g = n.initDialog()
    //       }
    //       g._events.trigger.simpleClick.call(g, l, $(l.target));
    //   })
    // };
    // $(document).delegate(".my-workload-arrange-issue", "click", a)

    return {
        issuesData: null,
        filters: {
          peopleId: null,
          storyId: null
        },
        init: function() {
            utils.setStyle(styles.arrange)
            this.render()
            this.bindEvent()
        },
        render: function() {
            this.$arrangeBtn = $(`
              <a class="lnk issuenav-share no-icon" title="任务编排">
                <span class="aui-icon aui-icon-small aui-iconfont-appswitcher"></span>
                任务编排
              </a>
          `)
            $('.operations').prepend($('<li></li>').append(this.$arrangeBtn))
        },
        bindEvent: function() {
            this.$arrangeBtn.click(this.onArrangeBtnClick.bind(this))
        },
        bindPanelEvent: function ($panel) {
            this.bindTaskEvent($panel)
            this.bindFilterEvent($panel)
        },
        bindFilterEvent: function ($panel) {
            var me = this
            var $storySelect = $panel.find('.my-workload-arrange-filter__story')
            $storySelect.on('change', function (evt) {
                me.refreshPanelByFilter({
                    storyId: evt.target.value,
                    peopleId: null
                })
            })
            var $peopleSelect = $panel.find('.my-workload-arrange-filter__people')
            $peopleSelect.on('change', function (evt) {
                me.refreshPanelByFilter({
                    peopleId: evt.target.value
                })
            })
        },
        bindTaskEvent: function($panel){
            var $head = $panel.find('.my-workload-arrange__table-head')
            var $body = $panel.find('.my-workload-arrange__table-body')
            $body.on('scroll', function() {
                $head.scrollLeft($body.scrollLeft())
            })
        },
        refreshPanelByFilter(filters) {
            var me = this
            me.filters = Object.assign({}, me.filters, filters)
            const issuesData = _.clone(this.issuesData)
            issuesData.issues = _.clone(issuesData.issues)
            issuesData.issues = _.filter(issuesData.issues, v => {
                let fields = v.fields
                let isValid = true
                // 按故事过滤
                if (me.filters.storyId) {
                    if (!fields.parent || (fields.parent && fields.parent.id !== me.filters.storyId)) {
                      isValid = false
                    }
                }
                // 按人过滤
                if (me.filters.peopleId) {
                  if (!fields.assignee || (fields.assignee && fields.assignee.name !== me.filters.peopleId)) {
                    isValid = false
                  }
                }
                return isValid
            })
            var $html = this.renderPanel(issuesData, false)
            $('.my-workload-arrange').before($html).remove()
            this.bindPanelEvent($html)
        },
        getStoryOptions: function (issuesData) {
            return _.reduce(issuesData.issues, function(rs, v) {
                if (v.fields && v.fields.parent) {
                    if (!_.some(rs, function (v1) {
                        return v1.id === v.fields.parent.id
                    })) {
                        rs.push(v.fields.parent)
                    }

                }
                return rs
            }, [])
        },
        getPeopleOptions: function (issuesData) {
          var me = this
          return _.reduce(issuesData.issues, function(rs, v) {
              if (v.fields && v.fields.assignee) {
                  if (!_.some(rs, function (v1) {
                      return v1.value === v.fields.assignee.name
                  })) {
                    // 根据故事联动
                    if (!me.filters.storyId || (v.fields.parent && v.fields.parent.id === me.filters.storyId)) {
                      rs.push({
                        value: v.fields.assignee.name,
                        text: v.fields.assignee.displayName
                      })
                    }
                  }
              }
              return rs
          }, [])
        },
        getPeopleTotalAmount: function (peopleTaksData) {
          return _.reduce(peopleTaksData, function(rs, v){
            rs[v.assignee] = {
              total: 0
            }
            _.each(v.data, function (v1) {
              var dateTotal = 0
              if (v1.taskList) {
                _.each(v1.taskList, function (v2) {
                  dateTotal += (v2.fields.aggregatetimeoriginalestimate || 0)
                })
              }
              rs[v.assignee].total += dateTotal
              rs[v.assignee][v1.duedate] = dateTotal
            })
            return rs
          }, {})
        },
        renderPanel: function (issuesData, syncIssuesData) {
            const nextIssuesData = _.clone(issuesData)
            // nextIssuesData.issues = _.filter(nextIssuesData.issues, function(item) {
            //   // 排除没有分配的任务
            //   if (item.fields && (!item.fields.assignee || !item.fields.duedate)) {
            //     return false
            //   }
            //   return true
            // })
            if (syncIssuesData !== false) {
              this.issuesData = nextIssuesData
            }
            var $filter = this.renderFilterPanel(this.issuesData)
            var $result = this.renderTaskPanel(nextIssuesData)
            var $html = $(`
              <div class="my-workload-arrange">
                <div class="my-workload-arrage__filter"></div>
                <div class="my-worklaod-arrage__result"></div>
              </div>
            `)
            $html.find('.my-workload-arrage__filter').append($filter)
            $html.find('.my-worklaod-arrage__result').append($result)
            return $html
        },
        renderFilterPanel: function (issuesData) {
            var me = this
            var storyOptions = this.getStoryOptions(issuesData)
            var storyFilter = ''
            storyFilter += '<select class="my-workload-arrange-filter__story">'
            storyFilter += '<option value="">全部</option>'
            _.each(storyOptions, function (v) {
                storyFilter += '<option value="'+ v.id +'"' + (v.id === me.filters.storyId ? ' selected="selected"' : '') +'">'+ v.fields.summary +'</option>'
            })
            storyFilter += '</select>'
            var peopleOptions = this.getPeopleOptions(issuesData)
            var peopleFilter = ''
            peopleFilter += '<select class="my-workload-arrange-filter__people">'
            peopleFilter += '<option value="">全部</option>'
            _.each(peopleOptions, function (v) {
                peopleFilter += '<option value="'+ v.value +'"'+ (v.value === me.filters.peopleId ? ' selected="selected"' : '') +'>'+ v.text +'</option>'
            })
            peopleFilter += '</select>'
            return `
            <div class="my-workload-arrange-filter__item">
              <span class="my-workload-arrange-filter__item-label">故事：</span>
              <div class="my-workload-arrange-filter__item-target">
                ${storyFilter}
              </div>
            </div>
            <div class="my-workload-arrange-filter__item">
              <span class="my-workload-arrange-filter__item-label">人员：</span>
              <div class="my-workload-arrange-filter__item-target">
                ${peopleFilter}
              </div>
            </div>
            `
        },
        renderTaskPanel: function (issuesData) {
            var allDate = []
            var peopleData = this.getPeopleTaskData(issuesData)
            _.each((issuesData.issues || []), function(v) {
                var fields = v.fields
                // 排除故事类的任务
                if (fields.issuetype && fields.issuetype.name === '故事') {
                  return
                }
                var duedate = fields.duedate || '未分配'
                if (duedate && allDate.indexOf(duedate) < 0) {
                    allDate.push(duedate)
                }
            })
            allDate = allDate.sort()
            var peopleTotalAmount = this.getPeopleTotalAmount(peopleData)
            var peopleHtml = '<div class="my-workload-arrange__table-head">'
            peopleHtml += '<div class="my-workload-arrange__table-head-inner">'
            peopleHtml += '<table>'
            peopleHtml += '<tr>'
            var peopleHtml1 = ''
            var peopleHtml2 = ''
            var totalTime = 0
            _.each(peopleData, function(v) {
                peopleHtml2 += '<th>'
                peopleHtml2 += '<span class="my-workload-arrange__table-people">'+ v.assignee +'</span>'
                if (typeof peopleTotalAmount[v.assignee] !== 'undefined') {
                  var total = peopleTotalAmount[v.assignee].total
                  var day = utils.formatterDateToDay(total) + '日'
                  totalTime += total
                  peopleHtml2 += '<span class="my-workload-arrange__table-day">（'+ day +'）</span>'
                }
                peopleHtml2 += '</th>'
            })
            peopleHtml1 += '<th class="is-first">'
              peopleHtml1 += '合计：'
              peopleHtml1 += utils.formatterDateToDay(totalTime) + '日'
            peopleHtml1 += '</th>'
            peopleHtml += peopleHtml1
            peopleHtml += peopleHtml2
            peopleHtml += '</tr>'
            peopleHtml += '</table>'
            peopleHtml += '</div>'
            peopleHtml += '</div>'
            var taskHtml = '<div class="my-workload-arrange__table-body">'
            taskHtml += '<table>'
            $.each(allDate, function(i, v) {
                taskHtml += '<tr>'
                taskHtml += '<td class="is-first">' + v + '</td>'
                $.each(peopleData, function(ii, vv) {
                    var taskList = []
                    var dateTotal
                    if (vv && vv.data) {
                        vv.data.some(function(vvv) {
                            if (vvv.duedate === v) {
                                if (typeof peopleTotalAmount[vv.assignee] !== 'undefined') {
                                  if (typeof peopleTotalAmount[vv.assignee][vvv.duedate] !== 'undefined') {
                                    dateTotal = peopleTotalAmount[vv.assignee][vvv.duedate]
                                  }
                                }
                                taskList = vvv.taskList
                                return true
                            }
                        })
                    }
                    taskHtml += '<td>'
                    if (taskList && taskList.length) {
                        $.each(taskList, function(iiii, vvvv) {
                            var fields = vvvv.fields
                            var link = 'https://jira.mingyuanyun.com/browse/' + vvvv.key
                            taskHtml += '<p class="my-workload-arrange-issue">'
                            taskHtml += '<a href="'+ link +'" target="_blank">'+ fields.summary +'</a>'
                            if (typeof fields.aggregatetimeoriginalestimate !== 'undefined') {
                              taskHtml += '（' + utils.formatterDateToDay(fields.aggregatetimeoriginalestimate) + '日）'
                            }
                            taskHtml += '</p>'
                        })
                        if (typeof dateTotal !== 'undefined') {
                          taskHtml += '<p class="my-workload-arrange-issue__total">'
                            taskHtml += '合计：' + utils.formatterDateToDay(dateTotal) + '日'
                          taskHtml += '</p>'
                        }
                    } else {
                        taskHtml += '--'
                    }
                    taskHtml += '</td>'
                })
                taskHtml += '</tr>'
            })
            taskHtml += '</table>'
            taskHtml += '</div>'
            var $html = $(`
              ${peopleHtml}
              ${taskHtml}
            `)
            return $html
        },
        onArrangeBtnClick: function() {
            var me = this
            this.pageLoading()
            apis.getIssuesByUrl(window.location.href).then(function(data) {
                console.log(data)
                me.unPageLoading()
                me.openTaskArrangeDialog(data)
            }, function(err) {
              me.unPageLoading()
              if (typeof err === 'string') {
                alert(err)
              } else if (err.responseText) {
                try {
                  err = JSON.parse(err.responseText)
                  if (err.errorMessages) {
                    alert(err.errorMessages.join('\r\n'))
                  }
                } catch (e) {}
              }
            })
        },
        /**
         * 开打任务编排对话框
        */
        openTaskArrangeDialog: function(issuesData) {
            var me = this
            var arrangeDialog = new dialog({
                width: 1024,
                content: function(setContent) {
                    var $content = $(`
                        <div>
                          <h2>任务编排</h2>
                        </div>
                  `)
                  $content.append(me.renderPanel(issuesData))
                  setContent($content)
                  me.bindPanelEvent(arrangeDialog.$content)
                },
                stacked: true,
                modeless: false
            })
            arrangeDialog.show()
        },
        /**
     * 页面等待
    */
        pageLoading: function() {
            keyboardshortcut.disable();
            loading.showLoadingIndicator()
        },
        /**
     * 解锁页面等待
    */
        unPageLoading: function() {
            loading.hideLoadingIndicator();
            keyboardshortcut.enable()
        },
        /**
         * 获取用户的任务列表数据
        */
        getPeopleTaskData: function(taskListData) {
            var taskMap = {}
            var sortNumber = 0
            _.each((taskListData.issues || []), function(item) {
                var fields = item.fields
                // 排除故事类的任务
                if (fields.issuetype && fields.issuetype.name === '故事') {
                  return
                }
                var assignee = fields.assignee ? fields.assignee.displayName : '未分配'
                var userGroup = taskMap[assignee]
                var duedate = fields.duedate || '未分配'
                if (!userGroup) {
                    userGroup = taskMap[assignee] = {
                        assignee: assignee,
                        sortNumber: assignee === '未分配' ? 99999 : sortNumber,
                        data: []
                    }
                    ++sortNumber
                }
                var index = utils.indexOf(userGroup.data, function(v) {
                    return v.duedate === duedate
                })
                var dateGroup
                if (index < 0) {
                    dateGroup = {
                        duedate: duedate,
                        taskList: []
                    }
                    userGroup.data.push(dateGroup)
                } else {
                    dateGroup = userGroup.data[index]
                }
                dateGroup.taskList.push(item)
            })
            const data = Object.keys(taskMap).map(function(k) {
                return taskMap[k]
            })
            return data.sort(function(v1, v2) {
              return v1.sortNumber - v2.sortNumber
            })
        }
    }
})

/**
 * 备注模版
 */
define('mysoft/plugins/workload/commentTemplate', [
  'jquery',
  "mysoft/plugins/workload/utils",
  "mysoft/plugins/workload/styles"
], function ($, utils, styles) {

  var ns = {
    match: /^\/browse\/?/i,
    copyCommentBtn: function (text, className) {
      var parent = $('#addcomment .mod-footer .ops')
      var cloneEl = parent.find('li:first-child').clone()
      cloneEl.addClass(className)
      cloneEl.find('a')
        .removeAttr('href')
        .removeAttr('id')
        .text(text)
      cloneEl.appendTo(parent)
      return cloneEl
    },
    addclickFn: function (text) {
      var textAreaIsVisible = $('#comment-wiki-edit textarea').is(":visible")
      var footBtn = $('#footer-comment-button');
      if (!textAreaIsVisible && footBtn && footBtn.length) {
        footBtn.click()
        setTimeout(function () {
          $('#comment-wiki-edit textarea').val(text)
        }, 10)
      }
    },
    fixertBtn: function () {
      var fixerText = `*问题原因：*

*修复方案：*

*影响范围：*

*修复分支：*

*修复版本：*

*待迁移版本：*

*变更集：* `;
      var fixerBtn = this.copyCommentBtn('修复备注', 'comment-btn-template')
      var me = this
      fixerBtn.on('click', function (e) {
        me.addclickFn(fixerText)
      })
    },
    testerBtn: function () {
      var testerText = `*测试环境：*
* 分支：
* 版本：

*测试场景：*
#
#
#

*测试结果：* `;
      var testerBtn = this.copyCommentBtn('测试备注', 'comment-btn-template')
      var me = this
      testerBtn.on('click', function (e) {
        me.addclickFn(testerText)
      })
    },
    debuggerBtn: function () {
      var debuggerText = `*问题现象：*

*问题原因：*

*结论：*

*平台版本：*

*临时方案：*

*建议方案：* `;
      var debuggerBtn = this.copyCommentBtn('排查备注', 'comment-btn-template')
      var me = this
      debuggerBtn.on('click', function (e) {
        me.addclickFn(debuggerText)
      })
    }
  }
  return {
    init: function () {
      // 如果不是jira-browse则不执行
      if (!ns.match.test(window.location.pathname)) {
        return
      }
      // 设置样式
      utils.setStyle(styles.commentTemplate)
      ns.fixertBtn()
      ns.testerBtn()
      ns.debuggerBtn()
    }
  }
})

/**
 * 一键更改状态
*/
define("mysoft/plugins/fastUpdateState", [
  "mysoft/plugins/workload/utils",
  "mysoft/plugins/workload/styles"
], function (utils, styles) {
  return {
    match: /^\/browse\/?/i,
    menuItems: ['待审查', '已审查', '|', '待迁移', '待发包','已发包', '|', '需要处理','不需处理', '持续观察'],
    stateItems: [],
    init: function () {
      // 如果不是jira-browse则不执行
      if (!this.match.test(window.location.pathname)) {
        return
      }
      this.stateItems = this.menuItems.filter(v => v !== '|')
      utils.setStyle(styles.updateState)
      this.render()
      this.bindEvent()
    },
    bindEvent: function () {
      var me = this
      $('body').on('click', '.update-state-item', function (evt) {
        me.updateIssueState(evt.target.innerText)
      })
      setInterval(function(){
        me.render()
      }, 500)
    },
    updateIssueState: function (stateText) {
      var me = this
      var $title = $('#summary-val')
      var $input = $title.find('.text long-field')
      if (!$input.length) {
        $title.click()
      }
      clearTimeout(this._timer)
      this._timer = setTimeout(function(){
        $title = $('#summary-val')
        $input = $title.find('.long-field')
        if (!$input.length) {
          return
        }
        var value = $input.val()
        var nextValue = value
        if (value) {
          me.stateItems.some(function(text){
            var allText = `【${text}】`
            if (value.indexOf(allText) === 0) {
              nextValue = nextValue.substr(allText.length)
              return true
            }
          })
          if (stateText !== '清除') {
            nextValue = `【${stateText}】${nextValue}`
          }
          $input.val(nextValue).blur()
        }
      }, 500)
    },
    render: function () {
      if ($('#opsbar-opsbar-state').length) {
        return
      }
      var groups = []
      var lastGroup = []
      this.menuItems.forEach(function(v){
        if (v === '|') {
          if (groups) {
            groups.push(lastGroup)
          }
          lastGroup = []
        } else {
          lastGroup.push(v)
        }
      })
      if (groups[groups.length - 1] !== lastGroup) {
        groups.push(lastGroup)
      }
      var list = ''
      groups.forEach(function(group){
        list += `<div class="aui-dropdown2-section">`
        list += `<ul>`
        group.forEach(function(text){
          list += `<li class="aui-list-item">
            <a>
              <span class="update-state-item">${text}</span>
            </a>
          </li>`
        })
        list += `</ul>`
        list += `</div>`

      })
      var html = `
        <ul id="opsbar-opsbar-state" class="toolbar-group pluggable-ops">
          <li class="toolbar-item">
            <div>
              <a href="#" id="opsbar-state_more" aria-haspopup="true" class="toolbar-trigger aui-button aui-style-default aui-style-plugin aui-dropdown2-trigger" resolved="" aria-controls="opsbar-state_more_drop" aria-expanded="false"><span class="dropdown-text">状态</span></a>
              <div id="opsbar-state_more_drop" class="aui-style-default aui-dropdown2 aui-layer" resolved="" aria-hidden="true" style="min-width: auto;">
                ${list}
                <div class="aui-dropdown2-section">
                  <ul>
                    <li class="aui-list-item">
                      <a>
                        <span class="update-state-item">清除</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      `
      $(html).appendTo('#stalker .aui-toolbar .toolbar-split-left')
    }
  }
})

/**
 * 一键更改状态
*/
define("mysoft/plugins/subTaskStatistics", [
  "jquery",
  "underscore",
  "mysoft/plugins/workload/utils",
  "mysoft/plugins/workload/styles",
  "mysoft/plugins/workload/apis"
], function ($, _, utils, styles, apis) {
  return {
    match: /^\/browse\/?/i,
    subTaskListData: [],
    peopleSumTaskData: [],
    init: function () {
      // 如果不是jira-browse则不执行
      if (!this.match.test(window.location.pathname)) {
        return
      }
      this.bindEvent()
      utils.setStyle(styles.subTaskStatistics)
      this.refresh()
    },
    bindEvent: function () {
      var me = this
      $('#view-subtasks').on('click', '.myosft-statistics-subtask input', function (e) {
        var $item = $(e.target).closest('.myosft-statistics-subtask__item')
        var people = $item.data('people')
        var index = $item.index()
        if (me.peopleSumTaskData[index]) {
          me.peopleSumTaskData[index].checked = e.target.checked
          _.each(me.subTaskListData, function(item){
            if (item.people === people) {
              item.visible = e.target.checked
            }
          })
          me.refresh(false)
        }
      })
      $('#view-subtasks').on('click', '.mysoft-statistics-subtask__checkall', function (e) {
        var checked = e.target.checked
        _.each(me.peopleSumTaskData, function(item){
          item.checked = checked
        })
        _.each(me.subTaskListData, function(item){
          item.visible = checked
        })
        me.refresh(false)
      })
    },
    refresh: function (syncData) {
      if (syncData !== false) {
        this.refreshSubTaskListData(function(){
          this.renderTaskListDuedate()
        })
        this.refreshPeopleSumTaskData()
      }
      this.renderTaskListWorkday()
      this.renderStatisticsPanel()
      this.refreshSubTaskItemVisible()
      this.renderTaskListDuedate()
    },
    refreshSubTaskItemVisible: function () {
      _.each(this.subTaskListData, function(item) {
        var $row = $('#issuerow' + item.id)
        if (!$row.length) {
          return
        }
        if (item.visible) {
          $row.show()
        } else {
          $row.hide()
        }
      })
    },
    refreshSubTaskListData: function (callback) {
      var me = this
      var $taskTable = $('.subtask-table-container table')
      var data = []
      var map = {}
      $taskTable.find('.issuerow').each(function(index, row) {
        var $row = $(row)
        var time = 0
        var $progress = $(row).find('.progress')
        var people = $row.find('.tinylink').text().trim()
        var id = $row.attr('rel')
        $progress.find('.hideOnPrint').toArray().some(function(img) {
          var title = $(img).attr('title')
          if (title && title.indexOf('剩余的估算') >= 0) {
            var t = title.match(/[\.\d]+/)
            if (t) {
              time = Number(t)
              return true
            }
          }
        })
        item = {
          id: id,
          visible: true,
          time: time,
          people: people
        }
        data.push(item)
        map[id] = item
      })
      var allPs = _.map(data, function (item) {
        return apis.findIssueData(item.id)
      })
      $.when.apply(null, allPs).then(function(){
        if (typeof callback === 'function') {
          callback.call(me, _.map(arguments, function (response) {
            var issue = response[0]
            if (issue && map[issue.id]) {
              map[issue.id].issue = issue
            }
            return issue
          }))
        }
      })
      this.subTaskListData = data
    },
    refreshPeopleSumTaskData: function () {
      var data = this.subTaskListData
      var map = {}
      var arr = []
      _.each(data, function (item) {
        if (!item.people) {
          return
        }
        if (!map[item.people]) {
          map[item.people] = {
            time: 0,
            checked: true
          }
        }
        map[item.people].time += item.time
      })
      arr = Object.keys(map).map(function(k){
        return Object.assign({
          people: k
        }, map[k])
      }).sort(function(v1, v2) {
        return v2.time - v1.time
      })
      this.peopleSumTaskData = arr
    },
    renderTaskListWorkday: function () {
      $('#view-subtasks .takeuptime').remove()
      _.each(this.subTaskListData, function(item){
        var $row = $('#issuerow' + item.id)
        if (!$row.length) {
          return
        }
        var $progress = $row.find('.progress')
        $progress.after('<td class="takeuptime"><span>'+ item.time +'日</span></td>')
      })
    },
    renderTaskListDuedate: function () {
      _.each(this.subTaskListData, function(item){
        var $row = $('#issuerow' + item.id)
        if (!$row.length) {
          return
        }
        if (!item.issue || !item.issue.fields || !item.issue.fields.duedate) {
          return
        }
        var $takeuptime = $row.find('.takeuptime')
        var dates = item.issue.fields.duedate.split('-').slice(1)
        var date = dates.join('-')
        $takeuptime.append('<span>'+ date +'</span>')
      })
    },
    renderStatisticsPanel: function () {
      var data = this.peopleSumTaskData
      var total = 0
      var checkedState = null
      var checkedNum = []
      _.each(data, function (item) {
        total += item.time
        if (item.checked) {
          checkedNum.push(checkedNum)
        }
      })
      if (checkedNum.length === data.length) {
        checkedState = 'all'
      } else if (checkedNum.length) {
        checkedState = 'indeterminate'
      } else {
        checkedState = 'none'
      }
      var panelHtml = '<div class="myosft-statistics-subtask">'
      panelHtml += '<div class="myosft-statistics-subtask__inner">'
      panelHtml += '<div class="myosft-statistics-subtask__total">'
      panelHtml += '<input class="mysoft-statistics-subtask__checkall" type="checkbox"'
      panelHtml += '/> 全选'
      panelHtml += '<span>总计：'+ total.toFixed(1) +'日</span>'
      panelHtml += '</div>'
      panelHtml += '<div class="mysoft-statistics-subtask__list">'
      _.each(data, function(item){
        panelHtml += '<div class="myosft-statistics-subtask__item" data-people="'+ item.people +'">'
        panelHtml += '<span><input type="checkbox"'
        if (item.checked) {
          panelHtml += 'checked="'+ item.checked +'"'
        }
        panelHtml += '/> '+ item.people +'：</span>'
        panelHtml += '<span>'+ item.time.toFixed(1) +'日</span>'
        panelHtml += '</div>'
      })
      panelHtml += '</div>'
      panelHtml += '</div>'
      panelHtml += '</div>'
      $('.myosft-statistics-subtask').remove()
      $('#view-subtasks').append($(panelHtml))
      var $checkall = $('.mysoft-statistics-subtask__checkall')
      if (checkedState === 'all') {
        $checkall[0].checked = true
      } else if (checkedState === 'indeterminate') {
        $checkall[0].indeterminate = true
      } else {
        $checkall[0].checked = false
      }
    }
  }
})

/**
 * 主模块
*/
define("mysoft/plugins/main", [
  "jquery",
  'mysoft/plugins/workload/arrange',
  'mysoft/plugins/workload/commentTemplate',
  'mysoft/plugins/fastUpdateState',
  'mysoft/plugins/subTaskStatistics'
], function ($, workloadArrange, commentTemplate, fastUpdateState, subTaskStatistics) {
  $(function(){
    try {
      workloadArrange.init()
      commentTemplate.init()
      fastUpdateState.init()
      subTaskStatistics.init()
    } catch (e) {
      console.error(e)
    }
  })
});

requirejs('mysoft/plugins/main')
