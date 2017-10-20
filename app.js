// ==UserScript==
// @name         eCourse++
// @namespace    https://github.com/pionxzh
// @version      0.1
// @description  Make eCourse great again!
// @author       Pionxzh
// @match        https://ecourse.ccu.edu.tw/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

let asset = {
    materialIcon: "https://fonts.googleapis.com/icon?family=Material+Icons",
    materialCss: "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
    materialJs: "https://code.getmdl.io/1.3.0/material.min.js"
};

let $head = document.getElementsByTagName('head')[0];

function injectJs(name, src) {
    let style = document.createElement('script');
    style.type = 'text/javascript';
    style.id = name;
    style.src = src;
    $head.appendChild(style);
}

function injectCss(name, src) {
    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.id = name;
    style.href = src;
    $head.appendChild(style);
}

function injectStyle() {
    let rule = `
    .demo-layout-transparent {
        background: url("https://i.imgur.com/zhgtd7S.jpg") center / cover;
    }
    .demo-layout-transparent .mdl-layout__header, .mdl-layout__drawer-button {
        color: white;
    }`;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = rule;
    $head.appendChild(style);
}

function getTable(dom) {
    let table = $(dom).find('body > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:not(:nth-child(0))').get().map(function(row) {
        return $(row).find('td').get().map(function(cell) {
            return $(cell).text();
        });
    });
    table.splice(0, 1);
    return table;
}

$(function() {
    injectCss('material-css', asset.materialCss);
    injectCss('material-icon', asset.materialIcon);
    injectStyle();
    injectJs('material-js', asset.materialJs);
    $("frame[src*='take_course.php']").on('load', function() {
        console.log('Take_course loaded');
        let courseTable = getTable(this.contentDocument);
        console.log(courseTable);
        $('head').after();
        let $body = document.createElement('body');
        $($body).html(`<div class="demo-layout-transparent mdl-layout mdl-js-layout">
                            <header class="mdl-layout__header mdl-layout__header--transparent">
                                <div class="mdl-layout__header-row">
                                <span class="mdl-layout-title">eCourse++</span>
                                <div class="mdl-layout-spacer"></div>
                                <nav class="mdl-navigation">
                                    <a class="mdl-navigation__link" href="">Link</a>
                                    <a class="mdl-navigation__link" href="">Link</a>
                                    <a class="mdl-navigation__link" href="./logout.php">登出</a>
                                </nav>
                                </div>
                            </header>
                            <div class="mdl-layout__drawer">
                                <span class="mdl-layout-title">Title</span>
                                <nav class="mdl-navigation">
                                <a class="mdl-navigation__link" href="">Link</a>
                                <a class="mdl-navigation__link" href="">Link</a>
                                <a class="mdl-navigation__link" href="">Link</a>
                                <a class="mdl-navigation__link" href="">Link</a>
                                </nav>
                            </div>
                            <main class="mdl-layout__content"></main>
                        </div>`);
        $('head').after($body);
    });
});
