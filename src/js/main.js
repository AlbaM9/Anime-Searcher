'use strict';

const seachResultsList = document.querySelector(".searchList")
const FavouritesList = document.querySelector(".favsList")
let searchInput = document.querySelector(".searchInput")
const resetBtn = document.querySelector(".resetBtn")
const searchBtn = document.querySelector(".searchBtn")

let savedAnimes = JSON.parse(localStorage.getItem("favourites"));

let animesToShow;
let imageCard;
let searchTerm;
let favArray = [];

if (savedAnimes !== null) {

    FavouritesList.classList.remove("hidden"); //cargan al inicio; evitar que se genere un nuevo array al pulsar nuscar por primera vez
    FavouritesList.innerHTML = " ";
    renderCards(savedAnimes, FavouritesList, "Animes Favoritos", "favsItems");

}

function handleFilter(event) {
    event.preventDefault();
    searchTerm = searchInput.value.toLowerCase();
    const SERVER_URL = `https://api.jikan.moe/v4/anime?q=${searchTerm}"`;

    if (savedAnimes !== null) {
        favArray = savedAnimes;
        FavouritesList.innerHTML = " ";// reasigno para no perder el valor de array de favoritos guardado tras cada adición
        renderCards(favArray, FavouritesList, "Animes Favoritos", "favsItems");

    }
    fetch(SERVER_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            animesToShow = data.data;
            console.log(animesToShow);
            seachResultsList.innerHTML = "";
            renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected");
            renderCards(savedAnimes, FavouritesList, "Animes Favoritos", "favsItems"); // renderiza el nuevo array
            favouritesRender();
        })


}
searchBtn.addEventListener("click", handleFilter);

function renderCards(animesData, list, title, styleClass) {
    console.log("recarga");
    let content = `<h2>${title}</h2>`;

    animesData.forEach(card => {
        imageCard = card.images.jpg.image_url;

        if (card.myFavourite == true) {
            content += `<div class = "completeAnime ${styleClass}" > `

        } else {
            content += `<div class = "completeAnime" > `
        }

        if (imageCard !== null) {
            content += `
           
            <img src="${imageCard}" alt="${card.title}" id = "${card.mal_id}">
            <h3 id = "${card.mal_id}">${card.title}</h3>`;
        } else {
            content += `
            <h3>${card.title}</h3>
            <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${card.title}">`;
        }
        content += `</div>`

    });

    list.innerHTML += content;

}
function handleAddFavourites(event) {
    const inputiD = event.target.id;

    console.log(inputiD);
    const animeindex = animesToShow.findIndex((anime) => {

        return anime.mal_id == inputiD;
    })



    animesToShow[animeindex].myFavourite = true;

    favArray.push(animesToShow[animeindex]);
    seachResultsList.innerHTML = " ";
    renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected");
    favouritesRender();


}
seachResultsList.addEventListener("click", handleAddFavourites);

function favouritesRender() {

    FavouritesList.classList.remove("hidden");
    FavouritesList.innerHTML = " ";

    renderCards(favArray, FavouritesList, "Animes Favoritos", "favsItems"); // renderiza el nuevo array
    console.log(favArray);
    localStorage.setItem("favourites", JSON.stringify(favArray));
}

resetBtn.addEventListener("click", () => {


})