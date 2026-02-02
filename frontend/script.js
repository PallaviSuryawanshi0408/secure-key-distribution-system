const API = "http://localhost:5000";

const senderNode = document.getElementById("senderNode");
const receiverNode = document.getElementById("receiverNode");
const plainMessage = document.getElementById("plainMessage");
const encryptedMessage = document.getElementById("encryptedMessage");
const decryptedMessage = document.getElementById("decryptedMessage");

let pendingEncryptedData = null;

/* ---------------- NODE REGISTRATION ---------------- */

async function registerNode() {
  const name = document.getElementById("nodeName").value.trim();
  if (!name) return alert("Please enter node name");

  const res = await fetch(`${API}/api/nodes/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  if (res.ok) {
    alert(`✅ Node "${name}" registered successfully`);
    document.getElementById("nodeName").value = "";
    loadNodes();
  } else {
    alert("❌ Node already exists");
  }
}

/* ---------------- LOAD NODES ---------------- */

async function loadNodes() {
  const res = await fetch(`${API}/api/nodes`);
  const nodes = await res.json();

  senderNode.innerHTML = "";
  receiverNode.innerHTML = "";

  nodes.forEach((node) => {
    const opt1 = document.createElement("option");
    opt1.value = node.name;
    opt1.textContent = node.name;

    const opt2 = opt1.cloneNode(true);

    senderNode.appendChild(opt1);
    receiverNode.appendChild(opt2);
  });
}

/* ---------------- SEND MESSAGE ---------------- */

async function sendEncryptedMessage() {
  const sender = senderNode.value;
  const receiver = receiverNode.value;
  const message = plainMessage.value;

  if (!message) return alert("Enter message");

  const res = await fetch(`${API}/api/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, receiver, message })
  });

  const data = await res.json();

  pendingEncryptedData = { ...data, sender, receiver };

  document.getElementById("requestText").innerText =
    `🔔 ${sender} wants to send you a message`;

  document.getElementById("incomingRequest").classList.remove("hidden");
}

/* ---------------- ACCEPT / REJECT ---------------- */

function acceptMessage() {
  encryptedMessage.value =
    pendingEncryptedData.encryptedMessage +
    "\nIV: " +
    pendingEncryptedData.iv;

  document.getElementById("incomingRequest").classList.add("hidden");
}

function rejectMessage() {
  pendingEncryptedData = null;
  document.getElementById("incomingRequest").classList.add("hidden");
  alert("❌ Message rejected");
}

/* ---------------- DECRYPT ---------------- */

async function decryptMessage() {
  const encryptedText = encryptedMessage.value.split("\n")[0];
  const iv = encryptedMessage.value.split("IV: ")[1];

  const res = await fetch(`${API}/api/messages/decrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      encryptedMessage: encryptedText,
      iv,
      sender: senderNode.value,
      receiver: receiverNode.value
    })
  });

  const data = await res.json();
  decryptedMessage.value = data.decryptedMessage;
}

/* ---------------- INIT ---------------- */

loadNodes();
