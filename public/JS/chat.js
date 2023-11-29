const socketClient = io();
const h4Name = document.getElementById("name");
const inputMessage = document.getElementById("message");
const divChat = document.getElementById("chat");
const divChats = document.getElementById("chatMessages");
let user;

fetch('/api/sessions/get-user')
  .then(response => response.json())
  .then(userData => {
    user = userData.first_name;
    h4Name.innerText = user;
    socketClient.emit("newUser", user);
  });

document.getElementById("botonEnviar").addEventListener("click", (e) => {
  e.preventDefault();
  const infoMessage = {
    name: user,
    message: inputMessage.value,
  };
  inputMessage.value = "";
  socketClient.emit("message", infoMessage);
});

socketClient.on("chat", (messages) => {
  const chat = messages
    .map((m) => {
      return `<p>${m.name}: ${m.message}</p>`;
    })
    .join(" ");
  divChats.innerHTML = chat; 
  divChats.scrollTop = divChats.scrollHeight;
});

const toggleChatButton = document.getElementById("toggleChat");
const chatContainer = document.getElementById("chatContainer");

let isChatMinimized = false;

toggleChatButton.addEventListener("click", () => {
  

  if (isChatMinimized) {
    chatContainer.classList.remove("minimized");
    toggleChatButton.innerText = "Chat";
  } else {
    chatContainer.classList.add("minimized");
    toggleChatButton.innerText = "Chat";
  }

  isChatMinimized = !isChatMinimized;
});

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");

      try {
        const createCartResponse = await fetch(`/api/carts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        });

        const { cartId } = await createCartResponse.json();

        await fetch(`/api/carts/${cartId}/add-product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ productId, quantity: 1 })
        });

        alert("Product added to cart!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const viewCartButton = document.getElementById("view-cart");

  viewCartButton.addEventListener("click", async () => {
    try {
      const createCartResponse = await fetch(`/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const { cartId } = await createCartResponse.json();
      if (cartId) {
        window.location.href = `/api/carts/populated/${cartId}`;
      } else {
        console.error("Error creating cart: Cart ID not received");
      }
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const adminToggle = document.getElementById('admin-toggle');
  const adminContent = document.querySelector('.admin-content');

  adminToggle.addEventListener('change', function () {
    adminContent.style.display = adminToggle.checked ? 'block' : 'none';
  });
});

