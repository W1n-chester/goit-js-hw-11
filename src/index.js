import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { serverRequest } from './js/function_server_request';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const simpleLightboxOptions = {
  captionsData: 'alt',
  captionDelay: 250,
};
const gallerySet = new SimpleLightbox('.gallery a', simpleLightboxOptions);
let page = 1;
let customRequest = '';
refs.form.addEventListener('submit', submitQuery);
refs.loadMoreBtn.addEventListener('click', loadMoreQuery);

// ПЕРВЫЙ ЗАПРОС
async function submitQuery(evt) {
  refs.loadMoreBtn.classList.add('is-hidden');
  evt.preventDefault();
  page = 1;
  customRequest = evt.currentTarget.elements.searchQuery.value.trim();
  // проверка на пустой запрос
  if (!customRequest) {
    clearGallery();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  clearGallery();

  await serverRequest(customRequest, page)
    .then(data => {
      // проверка на пустой результат поиска
      if (data.hits.length === 0) {
        Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return;
      }
      appendGalleryMurkup(data);
      gallerySet.refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(_error => console.log('error'));

  return customRequest;
}
// ДОПОЛНИТЕЛЬНЫЙ ЗАПРОС
async function loadMoreQuery(evt) {
  page += 1;
  await serverRequest(customRequest, page)
    .then(data => {
      // проверка на конец колекции
      if (data.hits.length <= 40) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          `"We're sorry, but you've reached the end of search results.`
        );
      }
      appendGalleryMurkup(data);
      gallerySet.refresh();
    })
    .catch(_error => console.log('error'));
}
// ДОП ФУНКЦИИ
// ОЧИСТКА ГАЛЕРЕИ
function clearGallery() {
  refs.gallery.innerHTML = '';
}
// РЕНДЕРИНГ РАЗМЕТКИ
function appendGalleryMurkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', createMurkup(data));
}
// СОЗДАНИЕ РАЗМЕТКИ
function createMurkup(data) {
  const dataForMurcup = data.hits;

  return dataForMurcup
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
<div class="photo-card">
<a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" title="" width="290px" height="190px"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>
`;
      }
    )
    .join('');
}
