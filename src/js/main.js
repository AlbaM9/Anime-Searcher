'use strict';

const seachResultsList = document.querySelector(".searchList")
const FavouritesList = document.querySelector(".favsList")
let searchInput = document.querySelector(".searchInput")
const resetBtn = document.querySelector(".resetBtn")
const searchBtn = document.querySelector(".searchBtn")

const savedAnimes = JSON.parse(localStorage.getItem("favourites"));

let animesToShow;
let imageCard;
let searchTerm;
let selectedElement;

function handleFilter(event) {
    event.preventDefault();
    searchTerm = searchInput.value.toLowerCase();
    const SERVER_URL = `https://api.jikan.moe/v4/anime?q=${searchTerm}"`;

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
            renderCards(animesToShow);

        })
}
searchBtn.addEventListener("click", handleFilter);

function renderCards(animesData) {
    console.log("recarga");
    let content = "";

    animesData.forEach(card => {
        imageCard = card.images.jpg.image_url;

        if (card.myFavourite == true) {
            content += `<div class = "completeAnime selected" > `
        } else {
            content += `<div class = "completeAnime" > `
        }

        if (imageCard !== null) {
            content += `
            <h3 id = "${card.mal_id}">${card.title}</h3>
            <img src="${imageCard}" alt="${card.title}" id = "${card.mal_id}">`;
        } else {
            content += `
            <h3>${card.title}</h3>
            <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${card.title}">`;
        }
        content += `</div>`

    });

    seachResultsList.innerHTML += content;

}
function handleAddFavourites(event) {
    const inputiD = event.target.id;

    console.log(inputiD);
    const animeindex = animesToShow.findIndex((anime) => {

        return anime.mal_id == inputiD;
    })


    if (animesToShow[animeindex].myFavourite) {
        animesToShow[animeindex].myFavourite = false;
    } else {
        animesToShow[animeindex].myFavourite = true;
    }

    seachResultsList.innerHTML = " ";
    renderCards(animesToShow);
    localStorage.setItem("favourites", JSON.stringify(animesToShow)); //guardamos los cambios en la clase favourites; 


}
seachResultsList.addEventListener("click", handleAddFavourites);

function favouritesRender() {



}

