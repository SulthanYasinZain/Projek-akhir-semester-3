import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVBVEPHwYI9IF-PynsTzez8o49g3JUnFo",
  authDomain: "to-do-list-multimedia.firebaseapp.com",
  projectId: "to-do-list-multimedia",
  storageBucket: "to-do-list-multimedia.firebasestorage.app",
  messagingSenderId: "1066012445044",
  appId: "1:1066012445044:web:9ea02e57936f3797680421",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("todoForm").style.display = "block";
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
}

async function handleAddTodo() {
  const todoInput = document.getElementById("todoInput");
  const todo = todoInput.value;
  if (todo.trim() === "") return;
  try {
    await addDoc(collection(db, "todos"), { text: todo });
    const todoList = document.getElementById("todoList");
    const listItem = document.createElement("li");
    listItem.textContent = todo;
    todoList.appendChild(listItem);
    todoInput.value = "";
  } catch (error) {
    console.error("Error adding todo:", error.message);
  }
}

async function loadTodos() {
  try {
    const querySnapshot = await getDocs(collection(db, "todos"));
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const listItem = document.createElement("li");
      listItem.textContent = doc.data().text;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("ml-2", "text-red-500", "hover:underline");
      deleteButton.onclick = () => handleDeleteTodo(doc.id, listItem);

      listItem.appendChild(deleteButton);
      todoList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading todos:", error.message);
  }
}

async function handleDeleteTodo(id, listItem) {
  try {
    await deleteDoc(doc(db, "todos", id));
    listItem.remove();
    console.log(`Todo with ID ${id} deleted`);
  } catch (error) {
    console.error("Error deleting todo:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginButton").addEventListener("click", handleLogin);
  document
    .getElementById("signupButton")
    .addEventListener("click", handleSignUp);
  document
    .getElementById("addTodoButton")
    .addEventListener("click", handleAddTodo);
  loadTodos();
});

async function handleSignUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    alert("Account created successfully. You can now log in.");
    console.log("User created:", userCredential.user);
  } catch (error) {
    console.error("Sign-up failed:", error.message);
    alert("Sign-up failed: " + error.message);
  }
}
