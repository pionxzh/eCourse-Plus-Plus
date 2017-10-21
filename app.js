// ==UserScript==
// @name         eCourse++
// @namespace    https://github.com/pionxzh
// @version      0.1
// @description  Make eCourse great again!
// @author       Pionxzh
// @match        https://ecourse.ccu.edu.tw/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.min.js
// ==/UserScript==

let asset = {
    PoiretOne: "https://fonts.googleapis.com/css?family=Poiret+One",
    materialIcon: "https://fonts.googleapis.com/icon?family=Material+Icons",
    materialCss: "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
    materialJs: "https://code.getmdl.io/1.3.0/material.min.js"
};

let config = {
    setCourseUrl: 'https://ecourse.ccu.edu.tw/php/login_s.php?courseid=',
    newsListUrl: 'https://ecourse.ccu.edu.tw/php/news/news.php?PHPSESSID=',
    newsContentUrl: 'https://ecourse.ccu.edu.tw/php/news/content.php?a_id='
}

let User = {
    name: '',
    stdId: '',
    department: '',
    class: ''
}

let Main = {
    head: null,
    body: null,
    rule: `
    html, body, .mdl-layout-title {
        font-family: "微软雅黑", "Microsoft Yahei", Helvetica, 'Helvetica Neue', Tahoma,Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3, h4 {
        font-family: inherit;
    }
    .f12 {
        font-size: 12px;
    }
    .p20 {
        padding: 20px;
    }
    .clear, .clear:after {
        clear: both;
    }
    .f-left {
        float: left;
    }
    .avatar {
        width: 45px;
        border-radius: 50%;
        margin: 18px 15px 15px 0;
    }
    .username {
        margin-bottom: 0;
        font-size: 18px;
    }
    .footer {
        color: #b7b5b5;
        background-color: #424242;
        position: relative;
        bottom: 0;
        width: 100%;
    }
    .footer ul {
        padding: 8px 20px;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-flow: row nowrap;
        -ms-flex-flow: row nowrap;
        flex-flow: row nowrap;
        list-style: none;
    }
    .footer ul a {
        color: inherit;
        text-decoration: none;
        white-space: nowrap;
    }
    .color-title {
        margin: 0;
        font-size: 23px;
    }
    .mdl-card-holder.mdl-card-holder-first {
        margin-top: -84px;
    }
    .mdl-card {
        width: auto;
        border-radius: 3px;
        overflow: visible;
        z-index: auto;
    }
    .mdl-shadow--1dp {
        box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    }
    .mdl-card__title {
        padding: 16px 20px;
    }
    .mdl-data-table {
        border: 0;
        display: block;
        overflow: auto;
    }
    .mdl-data-table thead {
        background: #FAFAFA;
    }
    .mdl-data-table th {
        padding-bottom: 12px;
    }
    .mdl-data-table td {
        border-top: 1px solid rgba(0,0,0,.04);
        border-bottom: 1px solid rgba(0,0,0,.04);
        height: 60px;
    }
    .mdl-table-striped > tbody > tr:nth-of-type(even) {
        background-color: #f9f9f9;
    }
    .mdl-table-striped > tbody > tr:nth-of-type(even):hover {
        background-color: #eee;
    }
    .mdl-data-table tr.news {
        background-color: #ffc107;
    }
    div.non-announces {
        font-size: 30px;
        width: 100%;
        height: 120px;
    }
    div.non-announces span {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        margin-top: 49px;
    }
    .auto-cell-size {
        white-space: nowrap;
        width: 1%;
        padding-right: 20px;
    }
    .mdl-layout__drawer .mdl-navigation {
        padding-top: 0;
        min-height: calc(100% - 210px);
    }
    .mdl-navigation__link {
        cursor: pointer;
        font-size: 18px;
        transition: .2s;
    }
    .mdl-navigation__link:nth-child(odd) {
        background: #F1F1F1;
    }
    .mdl-navigation__link.warning {
        background: #ffc107;
    }
    .mdl-navigation__link.active {
        background: #ffc107;
    }
    .mdl-navigation__link .professor {
        font-size: 14px;
    }
    .mdl-button--circle {
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .35);
    }
    .mdl-layout__header-row {
        height: 143px;
        background-image: url(https://i.imgur.com/6WD8vm8.png);
        background-position: center;
        background-size: cover;
    }
    .site-logo {
        font-family: "Poiret One", Helvetica, 'Helvetica Neue', Tahoma,Arial,sans-serif;
        font-size: 50px;
        text-shadow: 1px 2px #5f5f5f;
    }
    .mdl-menu__container {
        right: 30px!important;
    }
    .mdl-badge.mdl-badge--overlap:after {
        right: 4px;
    }
    .mdl-badge.mdl-badge-rect:after {
        top: 29px;
        right: 13px;
        width: 32px;
        border-radius: 3px;
        background-color: #1c1321;
    }
    .material-icons {
        line-height: 2;
    }
    :focus {
        outline: none!important;
    }
    `,
    injectJs(name, src) {
        let style = document.createElement('script')
        style.type = 'text/javascript'
        style.id = name
        style.src = src
        this.head.appendChild(style)
    },
    injectCss(name, src) {
        let style = document.createElement('link')
        style.rel = 'stylesheet'
        style.type = 'text/css'
        style.id = name
        style.href = src
        this.head.appendChild(style)
    },
    injectStyle() {
        let style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = this.rule
        this.head.appendChild(style)
    },
    init() {
        this.head = document.getElementsByTagName('head')[0]
        this.body = document.createElement('body')
        this.injectCss('material-css', asset.materialCss)
        this.injectCss('material-icon', asset.materialIcon)
        this.injectCss('material-icon', asset.PoiretOne)
        this.injectStyle()
        this.injectJs('material-js', asset.materialJs)
    },
    append() {
        $('frameset').remove()
        $(this.body).html(`
        <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
            <header class="mdl-layout__header mdl-color--white">
                <div class="mdl-layout__header-row">
                    <span class="mdl-layout-title site-logo">eCourse+</span>
                    <div class="mdl-layout-spacer"></div>
                    <div>
                        <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--circle" id="setting">
                            <i class="material-icons">settings</i>
                        </button>
                        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="setting">
                            <li class="mdl-menu__item">設定</li>
                            <li class="mdl-menu__item">Another Action</li>
                            <a href="./logout.php" style="text-decoration: none;"><li class="mdl-menu__item mdl-color-text--pink-A200">登出</li></a>
                        </ul>
                    </div>
                </div>
            </header>
            <div class="mdl-layout__drawer">
                <header class="mdl-color--blue-grey-900">
                    <div class="brand-logo"></div>
                    <div class="clear">
                        <div class="f-left" style="margin-left: 40px;">
                            <img class="img-responsive avatar" src="https://i.imgur.com/KDLeUaq.jpg">
                        </div>
                        <div class="f-left" id="user">
                            <h5 class="mdl-color-text--white username">${User.name}</h5>
                            <div class="mdl-color-text--blue-grey-400 f12"><i class="material-icons f12">place</i> ${User.department}, ${User.class}</div>
                        </div>
                        <div class="mdl-tooltip" data-mdl-for="user">${User.stdId}</div>
                    </div>
                </header>
                <span class="mdl-layout-title">課程列表</span>
                    <nav class="mdl-navigation"></nav>
                    <footer class="footer">
                        <ul>
                            <li style="margin-right: 64px;"><a href="#">問題回報</a></li>
                            <li><a href="https://github.com/pionxzh">@Pionxzh</a></li>
                        </ul>
                </footer>
                </div>
                <main class="mdl-layout__content mdl-color--grey-100">
                    <div class="page-content">
                        <div class="mdl-color--indigo mdl-header clear">
                            <div class="p20">
                                <h3 class="mdl-color-text--white color-title">公告列表</h3>
                            </div>
                        </div>
                        <div class="mdl-grid mdl-grid--no-spacing">
                            <div class="mdl-cell mdl-cell--3-col"></div>
                            <div class="mdl-cell mdl-cell--6-col">
                                <div class="p20 mdl-card-holder mdl-card-holder-first">
                                    <div class="mdl-card mdl-shadow--1dp style="margin-bottom: 30px;">
                                        <div class="mdl-card__title">
                                            <h2 class="mdl-card__title-text announces-title">OOO課</h2>
                                        </div>
                                        <table class="mdl-data-table mdl-js-data-table mdl-table-striped mdl-shadow--2dp announces-table">
                                            <colgroup>
                                                <col class="auto-cell-size">
                                             </colgroup>
                                            <thead>
                                                <tr>
                                                    <th class="mdl-data-table__cell--non-numeric">標題</th>
                                                    <th>等級</th>
                                                </tr>
                                            </thead>
                                            <tbody class="announces-list"></tbody>
                                      </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
        </div>`);
        $(this.head).after(this.body);
    }
}

let Course = {
    list: null,
    current: -1,
    getCurrentTitle() {
        return this.list[this.current][3]
    },
    parse(dom) {
        let temp = $(dom).find('body > table:nth-child(1) > tbody > tr:nth-child(1) > th > div').text()
        /* Regex and use Spread operator to convert array to object */
        let result = {...(/.{2}：([\u4e00-\u9fa5/a-zA-Z0-9]+)\s+.{2}：([0-9]+)\s+.{2}：([/a-zA-Z0-9]+)\s+.{2}：([a-zA-Z0-9]+)/g.exec(temp))}
        /* Skip 1st element ann combine into User*/
        /* Any other better solutions...? */
        User = [, ...Object.keys(User)].reduce((obj, item, index) => {
            obj[item] = result[index]
            return obj
        }, {})
        User.cookie = window.location.href.split('=').pop()
        console.log('User: ', User)

        temp = $(dom).find('body > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:not(:nth-child(1))').get()
        this.list = temp.map((row) => $(row).find('td').get().map(cell => $(cell).text()))
        temp.forEach((row, index) => {
            this.list[index][0] = $(row).find('td:nth-child(4) a').attr('href').split('=').pop()
        })
        console.log('CourseList:', this.list)
    },
    switch(id, index) {
        this.current = index
        if(typeof id === undefined) return
        axios.get(config.setCourseUrl + id)
        .then((response) => {
            console.log(`Successfully set CourseID to ${id}`)
        })
    },
    append() {
        let subList = $('.mdl-navigation')
        this.list.forEach((item, index) => {
            let warning = item[9] !== '--'
            let announce = item[5] !== '0'
            let homework = item[6] !== '0'
            subList.append(`
                <div class="mdl-navigation__link mdl-badge mdl-badge-rect ${warning ? 'warning' : ''}" 
                data-link="${item[0]}" data-index="${index}" ${homework ? 'data-badge="' + item[6] + '"' : ''}>
                    <span class="mdl-badge" ${announce ? 'data-badge="' + item[5] + '"' : ''}>${item[3]}</span>
                    <br>
                    <span class="professor">${item[4]}</span>
                </div>
            `)
        })
        $('.mdl-navigation__link').on('click', (event) => {
            let index = $(event.currentTarget).data('index')
            let courseId = $(event.currentTarget).data('link')
            this.switch(courseId, index)
            Announces.getList(courseId)
        })
    }
}

let Announces = {
    list: [],
    getList(id) {
        if(this.list[id]) return this.appendList(id)
        axios.get(config.newsListUrl + config.cookie)
        .then((response) => {
            this.list[id] = []
            let temp = $($.parseHTML(response.data)).find('td > div > font > a').get()
            if(!temp.length) return this.appendList()
            temp.forEach((item, index) => {
                let newsId = $(item).attr('onclick').split('=')[1].split('&')[0]
                this.list[id].push({
                    title: $(item).text(),
                    id: newsId,
                    new: !!$(item).find('img').length
                })
            })
            this.appendList(id)
        })
    },
    getItem(id) {
        axios.get(config.newsContentUrl + id)
        .then((response) => {
            let temp = $($.parseHTML(response.data)).find('table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) font').get()
            console.log(temp)
        })
    },
    appendList(id) {
        $('.announces-title').text(Course.getCurrentTitle())
        let announcesList = $('.announces-list')
        announcesList.find('tr').remove()
        if (id === undefined) {
            return $('.announces-table').after(`<div class="non-announces"><span>目前沒有公告</span></div>`)
        }
        $('div.non-announces').remove()
        this.list[id].forEach((item) => {
            announcesList.append(`
                <tr class="show-announces ${item.new ? 'new' : ''}" data-link="${item.id}">
                    <td class="mdl-data-table__cell--non-numeric">${item.title}</td>
                    <td>一般等級</td>
                </tr>
            `)
        })
        $('.show-announces').on('click', (event) => {
            let announcesId = $(event.currentTarget).data('link')
            this.getItem(announcesId)
        })
    }
}

$(function() {
    Main.init()
    $("frame[src*='take_course.php']").on('load', function() {
        Course.parse(this.contentDocument)
        Main.append()
        Course.append()
    });
});
