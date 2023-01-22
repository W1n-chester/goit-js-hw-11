import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.form.addEventListener('submit', submitQuery);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
function submitQuery(evt) {
    evt.preventDefault();
    if (!evt.currentTarget.elements.searchQuery.value) {
      return Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    }
    clearGallery();
    refs.loadMoreBtn.classList.add('is-hidden');
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}

function markup(params) {
  return `<div class="photo-card">
      <img src="" alt="" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
        </p>
        <p class="info-item">
          <b>Views</b>
        </p>
        <p class="info-item">
          <b>Comments</b>
        </p>
        <p class="info-item">
          <b>Downloads</b>
        </p>
      </div>
    </div>`;
}
