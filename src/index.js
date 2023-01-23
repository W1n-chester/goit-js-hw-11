import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {serverRequest} from './js/function_server_request'

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
refs.form.addEventListener('submit', submitQuery);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
function submitQuery(evt) {
  evt.preventDefault();
  let page = 1;
    if (!evt.currentTarget.elements.searchQuery.value) {
      return Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
  }
  const customRequest = evt.currentTarget.elements.searchQuery.value;
  console.log(customRequest)
  clearGallery();
  serverRequest(customRequest, page)
    .then(data => {
      appendGalleryMurkup(data);
      gallerySet.refresh();
    })
 
 
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function appendGalleryMurkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', createMurkup(data));
  
  
}
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
