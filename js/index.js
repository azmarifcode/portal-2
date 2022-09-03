// call category api
const loadCategory = async () => {
    const url = 'https://openapi.programming-hero.com/api/news/categories'
    try {
        const response = await fetch(url)
        const data = await response.json();
        return data.data.news_category;
    } catch (error) {
        console.log(error)
    }
}
// display category 
const categoryDisplay = async () => {
    const data = await loadCategory();
    data.forEach(category => {
        let categorySection = document.getElementById('category-area');
        const createCategory = document.createElement('div')
        createCategory.innerHTML = `
        <div class="d-grid gap-2 mb-1">
            <button onClick="loadNews(${category.category_id})" class="btn btn-outline-dark" type="button">${category.category_name}</button>
        </div>
        `
        categorySection.appendChild(createCategory);
    })
}

// load data after click category button

// call news api 
const loadNews = async(category_id) => {
    // Spinner start
    toggleSpinner(true);

    const response = await fetch(`https://openapi.programming-hero.com/api/news/category/0${category_id}`)
    const newses = await response.json();
    const newsesData = newses.data;

    const newsFound = document.getElementById('news-found');
    newsFound.innerHTML = ''
    const newsFoundText = document.createElement('div');
    if (newsesData.length > 0) {
        newsFoundText.innerHTML = `<h5 id="news-found" class="text-center border border-dark p-1 mb-2">News Found: ${newsesData.length}</h5>`;
        newsFound.appendChild(newsFoundText);
    } else {
        newsFoundText.innerHTML = `<h5 id="news-found" class="text-center border border-dark p-1">Sorry No News Found</h5>`;
        newsFound.appendChild(newsFoundText);
    }
    return displayNews(newsesData);
}

// display news after click a category.
const displayNews = async(newsesData) => {
    
    // sort array by total_view
    let x = newsesData.sort((a, b) => (b.total_view > a.total_view ? 1 : -1));

    const newsSection = document.getElementById('news-area');
    newsSection.innerHTML = "";

    newsesData.forEach(news => {
        const {
            title,
            _id,
            details,
            image_url,
            author,
            total_view, 
            rating
        } = news;

        const createSingleNews = document.createElement('div');
        createSingleNews.innerHTML = `
        <div class="card mb-3">
            <div class="row g-0 align-items-center">
                <div class="col-md-4">
                    <img src="${image_url}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title text-center text-md-start">${title}</h5>
                        <p>${details.length > 300 ? details.slice(0, 300) + '...' : details}</p>
                        <div class="m-1 border p-2 align-items-center row">
                            <div class="col-9 col-md-6 d-flex align-items-center">
                                <img src="${author.img}" class="news-author-img rounded-circle"/>
                                <p class="ms-3">Name: ${author.name ? news.author.name : 'Name not found'} <br />
                                    <span class="text-success news-author-published">Published: ${author.published_date ? author.published_date : 'Not Found'}</span>
                                </p>
                            </div>
                            <div class="col-3 col-md-3">
                                <span><i class="fa-regular fa-eye"></i> ${total_view ? total_view : '00'}</span>
                                <br />
                                <span><i class="fa-sharp fa-solid fa-star"></i> ${rating.number ? rating.number : '00'}</span>
                            </div>
                            <div class="col-12 col-md-3">
                                <button type="button" class="btn btn-outline-dark w-100" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick='newsDetailsLoad("${_id}")'>Details<i class="fa-solid fa-play ms-1"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        newsSection.appendChild(createSingleNews);

    })
    // Spinner start
    toggleSpinner(false)

}

// Spinner 
const toggleSpinner = isLoading => {
    const spinner = document.getElementById('spinner')
    if (isLoading) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// load newsDetails api
const newsDetailsLoad = async (id) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/news/${id}`)
    const newsData = await response.json();
    displayNewsDetails(newsData.data)
}

// display news details using a modal
const displayNewsDetails = (newsData) => {
    console.log(newsData)
    const modalContainer = document.getElementById('news-details-modal');
    modalContainer.innerHTML = ""
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = `
    <div class="modal-header bg-success text-white text-justify">
        <p class="modal-title" id="exampleModalLabel">${newsData[0].title}</p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <span>${newsData[0].details}</span>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">Close</button>
    </div>
    `
    modalContainer.appendChild(modalDiv)
}

categoryDisplay()