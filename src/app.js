const API_KEY = '57813574-c8977c5d3dcf506f235105762';
const BASE_URL = 'https://pixabay.com/api/';


export async function getImages(query, page) {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      image_type: "photo",
      orientation: "horizontal",
      q: query,
      page: page,
      per_page: 12,
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error("Помилка HTTP-запиту");
    }

    return await response.json();
  } catch (error) {
    console.error("Помилка завантаження:", error);
    throw error;
  }
}


export async function renderImages(images, galleryRef) {
  try {
    const markup = images
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `
          <li class="photo-card">
            <a href="${largeImageURL}" target="_blank">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>

            <div class="stats">
              <p class="stats-item">
                <i class="material-icons">thumb_up</i>
                ${likes}
              </p>

              <p class="stats-item">
                <i class="material-icons">visibility</i>
                ${views}
              </p>

              <p class="stats-item">
                <i class="material-icons">comment</i>
                ${comments}
              </p>

              <p class="stats-item">
                <i class="material-icons">cloud_download</i>
                ${downloads}
              </p>
            </div>
          </li>
        `
      )
      .join("");

    galleryRef.insertAdjacentHTML("beforeend", markup);
  } catch (error) {
    console.error("Помилка відображення зображень:", error);
    throw error;
  }
}






const formRef = document.querySelector("#search-form");
const galleryRef = document.querySelector(".gallery");
const btnRef = document.querySelector(".load-more");

let page = 1;
let query = "";
let totalHits = 0;
let total = 0;
let isLoading = false;

btnRef.style.display = "none";

formRef.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  query = evt.currentTarget.elements.query.value.trim();

  if (!query || isLoading) {
    return;
  }

  page = 1;
  total = 0;
  galleryRef.innerHTML = "";
  btnRef.style.display = "none";

  await loadImages();
});

btnRef.addEventListener("click", async () => {
  if (isLoading || total >= totalHits) {
    return;
  }

  page++;
  await loadImages(true);
});

async function loadImages(shouldScroll = false) {
  if (isLoading) {
    return;
  }

  isLoading = true;
  btnRef.disabled = true;

  try {
    const res = await getImages(query, page);

    totalHits = res.totalHits;

    if (res.hits.length === 0) {
      if (total === 0) {
        alert("Зображень не знайдено!");
      }

      btnRef.style.display = "none";
      return;
    }

    await renderImages(res.hits, galleryRef);
    total += res.hits.length;

    btnRef.style.display = total < totalHits ? "block" : "none";

    if (shouldScroll) {
      const cards = galleryRef.querySelectorAll(".photo-card");
      const lastCard = cards[cards.length - res.hits.length];

      lastCard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  } catch (error) {
    console.error(error);
    alert("Не вдалося завантажити зображення. Спробуй ще раз.");
  } finally {
    isLoading = false;
    btnRef.disabled = false;
  }
}