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
    materialIcon: "https://fonts.googleapis.com/icon?family=Material+Icons",
    materialCss: "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
    materialJs: "https://code.getmdl.io/1.3.0/material.min.js"
};

let User = {
    name: '',
    stdID: '',
    department: '',
    class: ''
}

let Main = {
    head: null,
    body: null,
    rule: `
    html, body, .mdl-layout-title {
        font-family: "微软雅黑", "Microsoft Yahei", Helvetica, 'Helvetica Neue', Tahoma,Arial,sans-serif;
    }
    body, main {
        background-color: #f5f5f5!important;
    }
    .f12 {
        font-size: 12px;
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
    .mdl-layout__drawer .mdl-navigation {
        padding-top: 0;
    }
    .mdl-navigation__link {
        font-size: 18px;
        transition: .2s;
    }
    .mdl-navigation__link:nth-child(odd) {
        background: #F1F1F1;
    }
    .mdl-navigation__link.warning {
        background: #ffc107;
    }
    .mdl-navigation__link .professor {
        font-size: 14px;
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
        this.injectStyle()
        this.injectJs('material-js', asset.materialJs)
    },
    append() {
        $(this.body).html(`
        <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
            <header class="mdl-layout__header mdl-color--white">
                <div class="mdl-layout__header-row">
                    <span class="mdl-layout-title">eCourse++</span>
                    <div class="mdl-layout-spacer"></div>
                    <div class="mdl-color-text--grey-600">
                        <button class="mdl-button mdl-js-button mdl-button--icon" id="setting">
                            <i class="material-icons">settings</i>
                        </button>
                        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="setting">
                            <li class="mdl-menu__item">Some Action</li>
                            <li class="mdl-menu__item">Another Action</li>
                            <li class="mdl-menu__item"><a href="./logout.php">登出</a></li>
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
                        <div class="mdl-tooltip" data-mdl-for="user">${User.stdID}</div>
                    </div>
                </header>
                <span class="mdl-layout-title">課程列表</span>
                    <nav class="mdl-navigation"></nav>
                </div>
                <main class="mdl-layout__content">
                    <div class="page-content"><!-- Your content goes here --></div>
                </main>
        </div>`);
        $(this.head).after(this.body);
    }
}

let Course = {
    list: null,
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
        console.log('User: ', User)

        temp = $(dom).find('body > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:not(:nth-child(1))').get()
        this.list = temp.map((row) => $(row).find('td').get().map(cell => $(cell).text()))
        temp.forEach((row, index) => {
            this.list[index][0] = $(row).find('td:nth-child(4) a').attr('href')
        })
        console.log(this.list)
    },
    append() {
        let subList = $('.mdl-navigation')
        this.list.forEach((item) => {
            let warning = item[9] !== '--'
            let announce = item[5] !== '0'
            let homework = item[6] !== '0'
            subList.append(`
                <a class="mdl-navigation__link mdl-badge mdl-badge-rect ${warning ? 'warning' : ''}" 
                href="${item[0]}" ${homework ? 'data-badge="' + item[6] + '"' : ''}>
                    <span class="mdl-badge" ${announce ? 'data-badge="' + item[5] + '"' : ''}>${item[3]}</span>
                    <br>
                    <span class="professor">${item[4]}</span>
                </a>
            `)
        })
    }
}

$(function() {
    Main.init()
    $("frame[src*='take_course.php']").on('load', function() {
        console.log('Take_course loaded')
        Course.parse(this.contentDocument)
        Main.append()
        Course.append()
    });
});
