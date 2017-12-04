'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = Math.pow(2, 5); // plugin test input:
// console.log('console log from widow');
// const a = 2 ** 5;

var ArticlesProvider = function () {
    function ArticlesProvider() {
        _classCallCheck(this, ArticlesProvider);

        this.searchUrl = 'https://newsapi.org/v2/';
        this.apiKey = 'a7ce20d66ed9428483334b6a27210bbc';
    }

    _createClass(ArticlesProvider, [{
        key: 'getFullUrl',
        value: function getFullUrl(searchKey, searchValue) {
            var searchUrl = this.searchUrl,
                apiKey = this.apiKey;

            switch (searchKey) {
                case 'categories':
                    {
                        return searchUrl + 'top-headlines?category=' + searchValue + '&apiKey=' + apiKey;
                    }
                case 'sources':
                    {
                        return searchUrl + 'top-headlines?sources=' + searchValue + '&apiKey=' + apiKey;
                    }
                case 'query':
                    {
                        return searchUrl + 'everything?q=' + searchValue + '&apiKey=' + apiKey;
                    }
                default:
                    {
                        return new Error('invalid searhKey or searchValue');
                    }
            }
        }
    }, {
        key: 'searchArticles',
        value: function searchArticles(searchKey, searchValue) {
            return fetch(this.getFullUrl(searchKey, searchValue)).then(function (response) {
                // plugin test input:
                // console.log('console log from fetch data');
                // const a = 2 ** 5;
                var a = Math.pow(2, 5);

                return response.json();
            }).then(function (_ref) {
                var articles = _ref.articles;
                return ArticlesProvider.sortArticlesByDate(articles);
            });
        }
    }], [{
        key: 'sortArticlesByDate',
        value: function sortArticlesByDate(articles) {
            return articles.filter(function (article) {
                return article.publishedAt !== null;
            }).map(function (article) {
                var name = article.source.name;
                var publishedAt = article.publishedAt,
                    author = article.author;


                author = author === null ? name : author;
                publishedAt = new Date(publishedAt);

                return Object.assign(article, { publishedAt: publishedAt, author: author });
            }).sort(function (articleB, articleA) {
                return Number(articleA.publishedAt) - Number(articleB.publishedAt);
            });
        }
    }]);

    return ArticlesProvider;
}();

var App = function () {
    function App(defaultSources) {
        _classCallCheck(this, App);

        this.body = document.body;
        this.articlesContainer = document.querySelector('.articles-container');
        this.form = document.forms[0];
        this.radioButtonsValue = this.getValueFromRadioButton('radio');
        this.articles = null;
        this.articlesProvider = new ArticlesProvider();
        this.defaultSources = defaultSources;
    }

    _createClass(App, [{
        key: 'createArticles',
        value: function createArticles() {
            var container = document.createDocumentFragment();

            this.articles.forEach(function (article) {
                var newArticle = document.createElement('article');

                newArticle.className = 'article';
                newArticle.innerHTML = App.getTemplate(article);
                container.appendChild(newArticle);
            });

            this.body.className = '';
            this.articlesContainer.appendChild(container);
        }
    }, {
        key: 'showError',
        value: function showError(errorText) {
            this.body.className = '';
            this.articlesContainer.innerHTML = '\n            <p class="searchError centred">' + errorText + '</p>\n        ';
        }
    }, {
        key: 'submitFormHandler',
        value: function submitFormHandler(e) {
            var searchValue = this.form[this.radioButtonsValue].value;

            if (searchValue !== '') {
                this.articlesContainer.innerHTML = '';
                this.body.className = 'with-spinner';
                this.searchAndRenderArticles(this.radioButtonsValue, searchValue);
            }

            e.preventDefault();
        }
    }, {
        key: 'getValueFromRadioButton',
        value: function getValueFromRadioButton(name) {
            var buttons = document.getElementsByName(name);

            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                if (button.checked) {
                    return button.value;
                }
            }

            return null;
        }
    }, {
        key: 'onChangeRadioHandler',
        value: function onChangeRadioHandler(e) {
            var target = e.target;
            var radioButtonsValue = this.radioButtonsValue,
                form = this.form;


            if (target.type === 'radio' && target.value !== radioButtonsValue) {
                form[radioButtonsValue].className = 'form__input';
                this.radioButtonsValue = target.value;
                form[target.value].className += ' active';
            }
        }
    }, {
        key: 'searchAndRenderArticles',
        value: function searchAndRenderArticles(searchKey, searchValue) {
            var _this = this;

            return this.articlesProvider.searchArticles(searchKey, searchValue).then(function (articles) {
                _this.articles = articles;

                if (_this.articles.length > 0) {
                    _this.createArticles();
                } else {
                    _this.showError('Nothing found... try again');
                }
            }).catch(function () {
                return _this.showError('Something went wrong...</br> check internet connection');
            });
        }
    }, {
        key: 'init',
        value: function init() {
            // plugin test input:
            // console.log('console log from App init method');
            // const a = 2 ** 5;
            var a = Math.pow(2, 5);

            var radiosContainer = document.querySelector('.radios-container');
            this.form.addEventListener('submit', this.submitFormHandler.bind(this));
            radiosContainer.addEventListener('click', this.onChangeRadioHandler.bind(this));
            this.searchAndRenderArticles('sources', this.defaultSources.toString());
        }
    }], [{
        key: 'getTemplate',
        value: function getTemplate(_ref2) {
            var url = _ref2.url,
                urlToImage = _ref2.urlToImage,
                description = _ref2.description,
                name = _ref2.source.name,
                title = _ref2.title,
                author = _ref2.author,
                publishedAt = _ref2.publishedAt;

            var options = {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            };

            return '\n            <div class="article__img-container">\n                <a class="article__img-wrapper" href="' + url + '">\n                    <img class="article__img" src="' + urlToImage + '" />\n                    <p class="article__description">' + description + '</p>\n                </a>\n                <span class="article__source">' + name + '</span>\n            </div>\n            <div class="article__content-container">\n                <h3 class="article__title">\n                    <a href="' + url + '">' + title + '</a>\n                </h3>\n                <p class="article__published">' + author + ' - ' + publishedAt.toLocaleString('en-US', options) + '</p>\n            </div>\n        ';
        }
    }]);

    return App;
}();

var newsApp = new App(['bbc-news', 'independent', 'the-washington-post', 'the-new-york-times', 'al-jazeera-english']);

newsApp.init();
