import bcryptjs from "bcryptjs";

const saltRounds = 10;
const baseurl = `http://localhost:3000/users`;

document.getElementById("signUpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let password = document.getElementById("password").value;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const formData = {
      email: document.getElementById("email").value,
      password: hashedPassword,
    };

    const res = await fetch(baseurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to create user");
    } else {
      const hideForm = document.getElementById("divForm");
      const signUpMsg = document.getElementById("main");
      hideForm.classList.add("hidden");
      signUpMsg.innerHTML = `
      <div id="divForm" class="grid gap-8">
        <div id="back-div" class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4 ">
          <div
            class="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 class="pt-8 pb-6 font-bold text-5xl dark:text-white text-center cursor-default">
              Your account has been created successfully!
            </h1>
            <div class="flex flex-col mt-4 items-center justify-center text-sm">
              <h3>
                <span class="cursor-default dark:text-gray-300">Click here to log into your account.</span>
                <a class="group text-blue-400 transition-all duration-100 ease-in-out" href="/web/login">
                  <span
                    class="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Log In
                  </span>
                </a>
              </h3>
            </div>
      `;
    }

    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
      signUpForm.reset();
    }
  } catch (error) {
    console.error("Error creating user:", error);
    alert("Error creating user. Please try again.");
  }
});
