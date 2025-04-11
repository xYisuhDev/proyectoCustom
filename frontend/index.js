import "./src/css/styles.css";

const url = "http://localhost:3000/games";

async function getGames() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }
  return res.json();
}

async function renderGames() {
  try {
    const games = await getGames();
    const container = document.querySelector("#games-container");

    games.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.classList.add(
        "game-card",
        "ring",
        "ring-white",
        "rounded-lg",
        "p-4",
        "shadow-lg",
        "transition-shadow",
        "cursor-pointer",
        "w-1/5"
      );
      gameCard.addEventListener("click", () => {
        window.location.href = `game.html?id=${game.id}`;
      });

      const imageUrl = document.createElement("img");
      imageUrl.src = game.imageUrl;
      imageUrl.alt = `${game.title} cover`;
      imageUrl.classList.add(
        "w-full",
        "h-40",
        "object-cover",
        "rounded-md",
        "mt-4",
        "mb-4"
      );
      gameCard.appendChild(imageUrl);

      const title = document.createElement("h2");
      title.textContent = `${game.title}`;
      title.classList.add("text-lg", "font-bold", "mt-2");
      gameCard.appendChild(title);

      const genre = document.createElement("p");
      genre.textContent = `Type: ${game.genre}`;
      if (game.genre === "DLC") {
        genre.classList.add("text-purple-400", "font-semibold");
      } else {
        genre.classList.add("text-yellow-400", "font-semibold");
      }
      gameCard.appendChild(genre);

      const platform = document.createElement("p");
      platform.textContent = `Platforms: ${game.platform}`;
      platform.classList.add("gtext");
      gameCard.appendChild(platform);

      const releaseDate = document.createElement("p");
      releaseDate.textContent = `Release Date: ${game.releaseDate}`;
      releaseDate.classList.add("gtext");
      gameCard.appendChild(releaseDate);

      container.appendChild(gameCard);
    });
  } catch (error) {
    console.error("Error rendering games:", error);
  }
}

renderGames();

document
  .querySelector("#search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.querySelector("#search").value;
    const url = `http://localhost:3000/games?title=${title}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch games");
    }
    const games = await res.json();
    const container = document.querySelector("#games-container");
    container.innerHTML = "";

    games.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.classList.add(
        "game-card",
        "ring",
        "ring-white",
        "rounded-lg",
        "p-4",
        "shadow-lg",
        "transition-shadow",
        "cursor-pointer",
        "w-1/5",
        "justify-around"
      );

      gameCard.addEventListener("click", () => {
        window.location.href = `game.html?id=${game.id}`;
      });

      const imageUrl = document.createElement("img");
      imageUrl.src = game.imageUrl;
      imageUrl.alt = `${game.title} cover`;
      imageUrl.classList.add(
        "w-full",
        "h-40",
        "object-cover",
        "rounded-md",
        "mt-4",
        "mb-4"
      );
      gameCard.appendChild(imageUrl);

      const title = document.createElement("h2");
      title.textContent = `${game.title}`;
      title.classList.add("text-lg", "font-bold", "mt-2");
      gameCard.appendChild(title);

      const genre = document.createElement("p");
      genre.textContent = `Type: ${game.genre}`;
      if (game.genre === "DLC") {
        genre.classList.add("text-purple-400", "font-semibold");
      } else {
        genre.classList.add("text-yellow-400", "font-semibold");
      }
      gameCard.appendChild(genre);

      const platform = document.createElement("p");
      platform.textContent = `Platforms: ${game.platform}`;
      platform.classList.add("gtext");
      gameCard.appendChild(platform);

      const releaseDate = document.createElement("p");
      releaseDate.textContent = `Release Date: ${game.releaseDate}`;
      releaseDate.classList.add("gtext");

      gameCard.appendChild(releaseDate);

      container.appendChild(gameCard);
    });
  });

function adjustLayout() {
  const container = document.querySelector("#games-container");
  const games = document.querySelectorAll(".game-card");

  if (games.length < 4) {
    container.classList.add("few-results");
  } else {
    container.classList.remove("few-results");
  }
}
adjustLayout();
window.addEventListener("load", adjustLayout);
