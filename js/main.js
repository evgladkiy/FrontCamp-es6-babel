// plugin test input:
// console.log('console log from widow');
// const a = 2 ** 5;

console.log('console log from widow');
const a = 2 ** 5;

class ArticlesProvider {
    constructor() {
        this.searchUrl = 'https://newsapi.org/v2/';
        this.apiKey = 'a7ce20d66ed9428483334b6a27210bbc';
    }

    static sortArticlesByDate(articles) {
        return articles.filter(article => article.publishedAt !== null)
            .map((article) => {
                const { source: { name } } = article;
                let { publishedAt, author } = article;

                author = (author === null) ? name : author;
                publishedAt = new Date(publishedAt);

                return Object.assign(article, { publishedAt, author });
            })
            .sort((articleB, articleA) => (
                Number(articleA.publishedAt) - Number(articleB.publishedAt)
            ));
    }


    getFullUrl(searchKey, searchValue) {
        const { searchUrl, apiKey } = this;
        switch (searchKey) {
            case 'categories': {
                return `${searchUrl}top-headlines?category=${searchValue}&apiKey=${apiKey}`;
            }
            case 'sources': {
                return `${searchUrl}top-headlines?sources=${searchValue}&apiKey=${apiKey}`;
            }
            case 'query': {
                return `${searchUrl}everything?q=${searchValue}&apiKey=${apiKey}`;
            }
            default: {
                return new Error('invalid searhKey or searchValue');
            }
        }
    }

    searchArticles(searchKey, searchValue) {
        return fetch(this.getFullUrl(searchKey, searchValue))
            .then((response) => {
                // plugin test input:
                // console.log('console log from fetch data');
                // const a = 2 ** 5;
                const a = 2 ** 5;
                console.log('console log from fetch data');
                return response.json();
            })
            .then(({ articles }) => ArticlesProvider.sortArticlesByDate(articles));
    }
}

class App {
    constructor(defaultSources) {
        this.body = document.body;
        this.articlesContainer = document.querySelector('.articles-container');
        this.form = document.forms['search-form'];
        this.radioButtonsValue = this.form.radio.value;
        this.articles = null;
        this.articlesProvider = new ArticlesProvider();
        this.defaultSources = defaultSources;
    }

    static getTemplate({
        url,
        urlToImage,
        description,
        source: { name },
        title,
        author,
        publishedAt,
    }) {
        const options = {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };

        return `
            <div class="article__img-container">
                <a class="article__img-wrapper" href="${url}">
                    <img class="article__img" src="${urlToImage}" />
                    <p class="article__description">${description}</p>
                </a>
                <span class="article__source">${name}</span>
            </div>
            <div class="article__content-container">
                <h3 class="article__title">
                    <a href="${url}">${title}</a>
                </h3>
                <p class="article__published">${author} - ${publishedAt.toLocaleString('en-US', options)}</p>
            </div>
        `;
    }

    createArticles() {
        const container = document.createDocumentFragment();

        this.articles.forEach((article) => {
            const newArticle = document.createElement('article');

            newArticle.classList.add('article');
            newArticle.innerHTML = App.getTemplate(article);
            container.appendChild(newArticle);
        });

        this.body.classList.toggle('with-spinner');
        this.articlesContainer.appendChild(container);
    }

    showError(errorText) {
        this.body.classList.remove('with-spinner');
        this.articlesContainer.innerHTML = `
            <p class="searchError centred">${errorText}</p>
        `;
    }

    submitFormHandler(e) {
        const searchValue = this.form[this.radioButtonsValue].value;

        if (searchValue !== '') {
            this.articlesContainer.innerHTML = '';
            this.body.classList.toggle('with-spinner');
            this.searchAndRenderArticles(this.radioButtonsValue, searchValue);
        }

        e.preventDefault();
    }

    onChangeRadioHandler(e) {
        const { target } = e;
        const { radioButtonsValue, form } = this;

        if (target.type === 'radio' && target.value !== radioButtonsValue) {
            form[radioButtonsValue].classList.toggle('active');
            this.radioButtonsValue = target.value;
            form[target.value].classList.toggle('active');
        }
    }

    searchAndRenderArticles(searchKey, searchValue) {
        return this.articlesProvider.searchArticles(searchKey, searchValue)
            .then((articles) => {
                this.articles = articles;

                if (this.articles.length > 0) {
                    this.createArticles();
                } else {
                    this.showError('Nothing found... try again');
                }
            })
            .catch(() => this.showError('Something went wrong...</br> check internet connection'));
    }

    init() {
        // plugin test input:
        // console.log('console log from App init method');
        // const a = 2 ** 5;
        const a = 2 ** 5;
        console.log('console log from App init method');
        const radiosContainer = document.querySelector('.radios-container');
        this.form.addEventListener('submit', this.submitFormHandler.bind(this));
        radiosContainer.addEventListener('click', this.onChangeRadioHandler.bind(this));
        this.searchAndRenderArticles('sources', this.defaultSources.toString());
    }
}

const newsApp = new App([
    'bbc-news',
    'independent',
    'the-washington-post',
    'the-new-york-times',
    'al-jazeera-english',
]);


// (async function() {
//   await loadStory();
//   console.log("Yey, story successfully loaded!");
// }());

newsApp.init();
