'use strict';

const seachResultsList = document.querySelector(".searchList")
let searchInput = document.querySelector(".searchInput")
const resetBtn = document.querySelector(".resetBtn")
const searchBtn = document.querySelector(".searchBtn")

let animesToShow;
let imageCard;
let searchTerm;

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
            // localStorage.setItem("myAnimes", JSON.stringify(animesToShow));

        })
}
searchBtn.addEventListener("click", handleFilter);

function renderCards(animesData) {

    let content = "";

    animesData.forEach(card => {

        imageCard = card.images.jpg.image_url;
        console.log(imageCard);

        /* if (card.selected === true) {
             content += `<div class = "completeAnime selected" > `
 
 
         } else {
            
         }*/

        content += `<div class = "completeAnime" > `
        card.selected = false;
        content += `
        <h3>${card.title}</h3>
        <img src="${imageCard}" alt="${card.title}">`;


    });
    seachResultsList.innerHTML += content;
    searchTerm = "";
    searchInput = "";



}