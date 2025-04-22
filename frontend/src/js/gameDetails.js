document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("id");

  if (!gameId) {
    window.location.href = "/";
    return;
  }

  try {
    const gameRes = await fetch(`http://localhost:3000/games/${gameId}`);
    if (!gameRes.ok) throw new Error("Game not found");
    const game = await gameRes.json();

    document.title = `${game.title} | Stargames`;

    const gameDetails = document.getElementById("game-details");
    gameDetails.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
          <div class="md:w-1/3">
            <img src="${game.imageUrl}" alt="${game.title}" 
                 class="w-full rounded-lg shadow-lg">
          </div>
          <div class="md:w-2/3">
            <h1 class="text-3xl font-bold mb-2">${game.title}</h1>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-gray-400">Genre</p>
                <p>${game.genre}</p>
              </div>
              <div>
                <p class="text-gray-400">Platform</p>
                <p>${game.platform}</p>
              </div>
              <div>
                <p class="text-gray-400">Release Date</p>
                <p>${game.releaseDate}</p>
              </div>
            </div>
            <div class="mb-4">
              <p class="text-gray-400">Description</p>
              <p>${game.description}</p>
            </div>
          </div>
        </div>
      `;

    await loadReviews(gameId);

    document
      .getElementById("review-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
          author: document.getElementById("author").value,
          rating: document.getElementById("rating").value,
          comment: document.getElementById("comment").value,
        };

        try {
          const res = await fetch(
            `http://localhost:3000/games/${gameId}/reviews`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );

          if (!res.ok) throw new Error("Failed to submit review");

          // Limpiar formulario y recargar reseñas
          document.getElementById("review-form").reset();
          await loadReviews(gameId);
        } catch (error) {
          console.error("Error submitting review:", error);
          alert("Error submitting review. Please try again.");
        }
      });
  } catch (error) {
    console.error("Error loading game details:", error);
    window.location.href = "/";
  }
});

async function loadReviews(gameId) {
  try {
    const res = await fetch(`http://localhost:3000/games/${gameId}/reviews`);
    if (!res.ok) throw new Error("Failed to load reviews");

    const reviews = await res.json();
    const reviewsList = document.getElementById("reviews-list");

    if (reviews.length === 0) {
      reviewsList.innerHTML =
        '<p class="text-gray-400">No reviews yet. Be the first to review!</p>';
      return;
    }

    reviewsList.innerHTML = reviews
      .map(
        (review) => `
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold">${review.author}</h3>
            <div class="flex items-center">
              ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
              <span class="ml-2 text-sm text-gray-400">
                ${new Date(review.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p>${review.comment}</p>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error loading reviews:", error);
    document.getElementById("reviews-list").innerHTML =
      '<p class="text-red-500">Error loading reviews. Please try again later.</p>';
  }
}

async function loadReviews(gameId) {
  try {
    const res = await fetch(`http://localhost:3000/games/${gameId}/reviews`);
    if (!res.ok) throw new Error("Failed to load reviews");

    const reviews = await res.json();
    const reviewsList = document.getElementById("reviews-list");

    if (reviews.length === 0) {
      reviewsList.innerHTML = '<p class="text-gray-400">No reviews yet.</p>';
      return;
    }

    reviewsList.innerHTML = reviews
      .map(
        (review) => `
        <div class="bg-gray-800 p-4 rounded-lg relative">
          <!-- Botón del menú -->
          <button class="review-menu-btn absolute top-2 right-2 p-1 mt-1 rounded hover:bg-gray-700">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          
          <!-- Menú desplegable (inicialmente oculto) -->
          <div class="review-dropdown hidden absolute right-0 mt-2 w-40 bg-gray-700 rounded shadow-lg z-50 border border-gray-600">
            <button class="edit-review w-full text-left px-4 py-2 hover:bg-gray-600" data-id="${
              review._id
            }">
              <i class="fas fa-edit mr-2"></i> Editar
            </button>
            <button class="delete-review w-full text-left px-4 py-2 hover:bg-gray-600 text-red-400" data-id="${
              review._id
            }">
              <i class="fas fa-trash mr-2"></i> Borrar
            </button>
          </div>
          
          <!-- Contenido de la reseña -->
          <div class="review-content">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold">${review.author}</h3>
              <div class="flex items-center">
                ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
                <span class="ml-2 text-sm text-gray-400 mr-2">
                  ${new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p>${review.comment}</p>
          </div>
        </div>
      `
      )
      .join("");

    setupReviewMenus();
  } catch (error) {
    console.error("Error loading reviews:", error);
    reviewsList.innerHTML =
      '<p class="text-red-500">Error al cargar reseñas</p>';
  }
}

function setupReviewMenus() {
  document.querySelectorAll(".review-menu-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;

      document.querySelectorAll(".review-dropdown").forEach((menu) => {
        if (menu !== dropdown) menu.classList.add("hidden");
      });

      dropdown.classList.toggle("hidden");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".review-dropdown").forEach((menu) => {
      menu.classList.add("hidden");
    });
  });

  document.querySelectorAll(".edit-review").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const reviewId = this.getAttribute("data-id");
      const reviewCard = this.closest(".bg-gray-800");
      showEditForm(reviewCard, reviewId);
    });
  });

  document.querySelectorAll(".delete-review").forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      e.stopPropagation();
      const reviewId = this.getAttribute("data-id");

      if (confirm("¿Seguro que quieres borrar esta reseña?")) {
        try {
          const response = await fetch(
            `http://localhost:3000/reviews/${reviewId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            const gameId = new URLSearchParams(window.location.search).get(
              "id"
            );
            await loadReviews(gameId);
          } else {
            throw new Error("Error al borrar");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("No se pudo borrar la reseña");
        }
      }
    });
  });
}

function showEditForm(reviewCard, reviewId) {
  const author = reviewCard.querySelector(".font-bold").textContent;
  const rating = (
    reviewCard.querySelector(".flex.items-center").textContent.match(/★/g) || []
  ).length;
  const comment = reviewCard.querySelector("p:not(.font-bold)").textContent;

  const editForm = document.createElement("div");
  editForm.className = "bg-gray-700 p-4 rounded-lg mt-2";
  editForm.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">Editar Reseña</h3>
      <form class="edit-review-form" data-id="${reviewId}">
        <div class="mb-3">
          <label class="block mb-1">Gamer ID</label>
          <input type="text" value="${author}" class="w-full p-2 bg-gray-600 rounded" required>
        </div>
        <div class="mb-3">
          <label class="block mb-1">STARS</label>
          <select class="w-full p-2 bg-gray-600 rounded" required>
            <option value="1" ${rating === 1 ? "selected" : ""}>★</option>
            <option value="2" ${rating === 2 ? "selected" : ""}>★★</option>
            <option value="3" ${rating === 3 ? "selected" : ""}>★★★</option>
            <option value="4" ${rating === 4 ? "selected" : ""}>★★★★</option>
            <option value="5" ${rating === 5 ? "selected" : ""}>★★★★★</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block mb-1">Description</label>
          <textarea class="w-full p-2 bg-gray-600 rounded" rows="3" required>${comment}</textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" class="cancel-edit px-3 py-1 bg-gray-500 rounded">Cancel</button>
          <button type="submit" class="px-3 py-1 bg-blue-600 rounded">Save</button>
        </div>
      </form>
    `;

  reviewCard.appendChild(editForm);

  editForm.querySelector(".cancel-edit").addEventListener("click", () => {
    editForm.remove();
  });

  editForm.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const reviewId = form.getAttribute("data-id");
    const author = form.querySelector("input").value;
    const rating = form.querySelector("select").value;
    const comment = form.querySelector("textarea").value;

    try {
      const response = await fetch(`localhost:3000/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author, rating, comment }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la reseña");
      }

      const gameId = new URLSearchParams(window.location.search).get("id");
      await loadReviews(gameId);
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo actualizar la reseña");
    }
  });
}
