const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelector("#messages");
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const chatContacts = document.querySelector(".chat-contacts");
  const leavechat = document.querySelector("#leave-chat");

  const contactName = prompt("Please enter a contact name:");
  if (contactName) {
    const contactDiv = document.createElement("div");
    contactDiv.classList.add("contact");
    // contactDiv.style.backgroundColor = getRandomColor();
    contactDiv.textContent = contactName;
    chatContacts.appendChild(contactDiv);

    socket.emit("set contact", contactName);
    socket.on("user count", (count) => {
      const contactCount = document.querySelector("#userCount");
      contactCount.textContent = count;
    });
    socket.on("set header", (contactName) => {
      const header = document.querySelector("#header");
      header.textContent = contactName;
      messages.appendChild(header);
    });
  }

  const emojiMapping = new Map([
    ["react" || "React" || "REACT", "⚛️"],
    ["woah" || "Woah" || "WOAH", "😯"],
    ["hey" || "Hey" || "HEY", "👋🏼"],
    ["lol" || "Lol" || "LOL", "😂"],
    ["like" || "Like" || "LIKE", "❤️"],
    ["congratulation" || "Congratulation" || "CONGRATULATION", "🥳"],
    ["react:", "react"],
    ["woah:", "woah"],
    ["hey:", "hey"],
    ["lol:", "lol"],
    ["like:", "like"],
    ["congratulation:", "congratulation"],
  ]);

  function clearContactsSession() {
    localStorage.removeItem("contacts");
    existingContacts.length = 0;
    updateContactDisplay();
  }

  const commandMapping = new Map([
    [
      "/help",
      () => {
        alert(
          "List of Available Commands! \n \n -/clear: Clear the Chat \n -/reload: Reload the Page \n -/random: Generate Random Number \n -/calc: Calculator \n -rem: <key> <word>\n we can revtrive the value by using the key \n -clearcontact: Clear the Contact"
        );
      },
    ],
    [
      "/clearcontact",
      () => {
        while (chatContacts.firstChild) {
          chatContacts.removeChild(chatContacts.firstChild);
          clearContactsSession();
        }
      },
    ],
    [
      "/clear",
      () => {
        while (messages.firstChild) {
          messages.removeChild(messages.firstChild);
        }
      },
    ],
    [
      "/reload",
      () => {
        location.reload();
      },
    ],
    [
      "/random",
      () => {
        const number = "0123456789";
        let result = "";
        for (let i = 0; i < 10; i++) {
          const index = Math.floor(Math.random() * number.length);
          result += number.charAt(index);
        }
        random = `${contactName} : ${result}`;
        socket.emit("chat message", random);
      },
    ],
    [
      "/rem",
      (key, value) => {
        result = "";
        if (key && value) {
          emojiMapping.set(key, value);
          alert("Remembered!!");
        } else if (key) {
          let value = `${contactName} : The remembered word for ${key}  is ${emojiMapping.get(
            key
          )}`;
          socket.emit("chat message", value);
          value = "";
        }
      },
    ],
    [
      "/calc",
      (input) => {
        let output = `${contactName} : ${input} = ${eval(input)}`;
        socket.emit("chat message", output);
        output = "";
      },
    ],
  ]);

  leavechat.addEventListener("click", () => {
    //    commandMapping.get("/reload");
    location.reload();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const sentence = input.value.trim().toLowerCase();
    const words = sentence.split(" ");

    if (words.length > 0) {
      var firstWord = words[0];
      var secondword = words[1];
      var thirdword = words[2];
    }

    let cmd;

    cmd = commandMapping.get(firstWord);

    let msg = `${contactName}: ${words
      .map((word) => emojiMapping.get(word) || word)
      .join(" ")}`;
    if (cmd) {
      if (firstWord === "/calc") {
        cmd(secondword);
      } else cmd(secondword, thirdword);
      input.value = "";
    } else if (msg !== "") {
      socket.emit("chat message", msg);
      input.value = "";
    }
  });

  socket.on("chat message", (msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    messages.appendChild(li);
    const chatContainer = document.querySelector(".chat-main");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
});
