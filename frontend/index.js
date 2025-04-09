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
        "transition-shadow"
      );

      const title = document.createElement("h2");
      title.textContent = `Title: ${game.title}`;
      gameCard.appendChild(title);

      const genre = document.createElement("p");
      genre.textContent = `Genre: ${game.genre}`;
      gameCard.appendChild(genre);

      const platform = document.createElement("p");
      platform.textContent = `Platform: ${game.platform}`;
      gameCard.appendChild(platform);

      container.appendChild(gameCard);
    });
  } catch (error) {
    console.error("Error rendering games:", error);
  }
}

renderGames();

//evento:
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
    container.innerHTML = ""; // Clear previous results

    games.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.classList.add("game-card");

      const title = document.createElement("h2");
      title.textContent = `Title: ${game.title}`;
      gameCard.appendChild(title);

      const genre = document.createElement("p");
      genre.textContent = `Genre: ${game.genre}`;
      gameCard.appendChild(genre);

      const platform = document.createElement("p");
      platform.textContent = `Platform: ${game.platform}`;
      gameCard.appendChild(platform);

      const releaseDate = document.createElement("p");
      releaseDate.textContent = `Release Date: ${game.releaseDate}`;
      gameCard.appendChild(releaseDate);

      container.appendChild(gameCard);
    });
  });
