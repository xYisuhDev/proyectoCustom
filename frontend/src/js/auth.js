const baseurl = `http://localhost:3000`;

document.getElementById("logInForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const res = await fetch(baseurl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to create user");
    } else {
      const data = await res.json();
      const token = data.token;
      localStorage.setItem("authToken", token);
      const hideForm = document.getElementById("divForm");
      const signUpMsg = document.getElementById("main");
      hideForm.classList.add("hidden");
      signUpMsg.innerHTML = `
      <div id="divForm" class="grid gap-8">
        <div id="back-div" class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4 ">
          <div
            class="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 class="pt-8 pb-6 font-bold text-5xl dark:text-white text-center cursor-default">
              You have logged into your account!
            </h1>
            <div class="flex flex-col mt-4 items-center justify-center text-sm">
              <h3>
                <span class="cursor-default dark:text-gray-300">You'll be redirected in a couple seconds...</span>
              </h3>
            </div>
      `;
    }

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);

    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
      signUpForm.reset();
    }
  } catch {
    console.error("Login failed");
  }
});
