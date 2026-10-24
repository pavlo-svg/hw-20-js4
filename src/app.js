const API_KEY = '57813574-c8977c5d3dcf506f235105762';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';
let totalHits = 0;


const fetchImages = async (query, pageNumber) => {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      page: pageNumber,
      per_page: 12,
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Помилка запиту:', error);
    throw error;
  }
};


const createPhotoCard = async (image) => {
  try {
    const li = document.createElement('li');
    li.classList.add('gallery-item');

    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const stats = document.createElement('div');
    stats.classList.add('stats');

    const items = [
      { icon: 'thumb_up', value: image.likes },
      { icon: 'visibility', value: image.views },
      { icon: 'comment', value: image.comments },
      { icon: 'cloud_download', value: image.downloads },
    ];

    for (const item of items) {
      const paragraph = document.createElement('p');
      paragraph.classList.add('stats-item');

      const icon = document.createElement('i');
      icon.classList.add('material-icons');
      icon.textContent = item.icon;

      paragraph.append(icon, document.createTextNode(item.value));
      stats.append(paragraph);
    }

    card.append(img, stats);
    li.append(card);

    return li;
  } catch (error) {
    console.error('Помилка створення картки:', error);
    throw error;
  }
};


const renderImages = async (images) => {
  try {
    const fragment = document.createDocumentFragment();

    for (const image of images) {
      const card = await createPhotoCard(image);
      fragment.append(card);
    }

    gallery.append(fragment);
  } catch (error) {
    console.error('Помилка відображення зображень:', error);
    throw error;
  }
};


const updateLoadMoreButton = async () => {
  try {
    loadMoreButton.hidden =
      gallery.children.length === 0 ||
      gallery.children.length >= totalHits;
  } catch (error) {
    console.error('Помилка оновлення кнопки:', error);
    throw error;
  }
};


form.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();

    const query = input.value.trim();

    if (!query) {
      return;
    }

    currentQuery = query;
    page = 1;
    totalHits = 0;
    gallery.innerHTML = '';
    loadMoreButton.hidden = true;

    const data = await fetchImages(currentQuery, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      alert('За вашим запитом нічого не знайдено.');
      return;
    }

    await renderImages(data.hits);
    await updateLoadMoreButton();
  } catch (error) {
    console.error('Помилка пошуку:', error);
    alert('Не вдалося завантажити зображення.');
  }
});


loadMoreButton.addEventListener('click', async () => {
  try {
    if (!currentQuery) {
      return;
    }

    loadMoreButton.disabled = true;

    const nextPage = page + 1;
    const data = await fetchImages(currentQuery, nextPage);

    if (data.hits.length === 0) {
      loadMoreButton.hidden = true;
      return;
    }

    const previousCount = gallery.children.length;

    await renderImages(data.hits);

    page = nextPage;

    await updateLoadMoreButton();

    const firstNewImage = gallery.children[previousCount];

    if (firstNewImage) {
      firstNewImage.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  } catch (error) {
    console.error('Помилка завантаження зображень:', error);
    alert('Не вдалося завантажити наступні зображення.');
  } finally {
    loadMoreButton.disabled = false;
  }
});