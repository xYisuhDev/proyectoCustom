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

      const imageUrl = document.createElement("img");
      imageUrl.src = game.imageUrl; // Asegúrate de que la API devuelva esta propiedad
      imageUrl.alt = `${game.title} cover`;
      imageUrl.classList.add(
        "w-full",
        "h-48",
        "object-cover",
        "rounded-md",
        "mt-4"
      );
      gameCard.appendChild(imageUrl);

      const title = document.createElement("h2");
      title.textContent = `${game.title}`;
      title.classList.add("text-lg", "font-semibold", "mt-2");
      gameCard.appendChild(title);

      const genre = document.createElement("p");
      genre.textContent = `Genre: ${game.genre}`;
      gameCard.appendChild(genre);

      const platform = document.createElement("p");
      platform.textContent = `Platforms: ${game.platform}`;
      gameCard.appendChild(platform);

      const recommendedAge = document.createElement("p");
      recommendedAge.textContent = `Recommended Age: ${game.recommendedAge}`;
      if (game.recommendedAge === "18+") {
        recommendedAge.classList.add("text-red-500"); // Red for mature games
      } else if (game.recommendedAge === ("17+" || "16+" || "15+" || "14+")) {
        recommendedAge.classList.add("text-yellow-500"); // Yellow for teen games
      } else {
        recommendedAge.classList.add("text-green-500"); // Green for other ages
      }
      gameCard.appendChild(recommendedAge);

      const releaseDate = document.createElement("p");
      releaseDate.textContent = `Release Date: ${game.releaseDate}`;
      releaseDate.classList.add("bg-gray-700");
      gameCard.appendChild(releaseDate);

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
      gameCard.classList.add(
        "game-card",
        "ring",
        "ring-white",
        "rounded-lg",
        "p-4",
        "shadow-lg",
        "transition-shadow"
      );

      const imageUrl = document.createElement("img");
      imageUrl.src = game.imageUrl; // Asegúrate de que la API devuelva esta propiedad
      imageUrl.alt = `${game.title} cover`;
      imageUrl.classList.add(
        "w-full",
        "h-48",
        "object-cover",
        "rounded-md",
        "mt-4"
      );
      gameCard.appendChild(imageUrl);

      const title = document.createElement("h2");
      title.textContent = `${game.title}`;
      title.classList.add("text-lg", "font-semibold", "mt-2");
      gameCard.appendChild(title);

      const genre = document.createElement("p");
      genre.textContent = `Genre: ${game.genre}`;
      gameCard.appendChild(genre);

      const platform = document.createElement("p");
      platform.textContent = `Platforms: ${game.platform}`;
      gameCard.appendChild(platform);

      const releaseDate = document.createElement("p");
      releaseDate.textContent = `Release Date: ${game.releaseDate}`;
      gameCard.appendChild(releaseDate);

      container.appendChild(gameCard);
    });
  });
