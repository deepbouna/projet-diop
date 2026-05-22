var contacts = [];
var editingId = null;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  loadContacts();
  renderContacts();
}

function loadContacts() {
  var data = localStorage.getItem("contacts");
  if (data) {
    contacts = JSON.parse(data);
  } else {
    contacts = [
      { id: 1, prenom: "Fatou", nom: "Diallo", tel: "77 123 45 67", email: "fatou@email.com" },
      { id: 2, prenom: "Moussa", nom: "Sow", tel: "78 234 56 78", email: "moussa@email.com" },
      { id: 3, prenom: "Aminata", nom: "Ba", tel: "76 345 67 89", email: "aminata@email.com" }
    ];
    saveContacts();
  }
}

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts(list) {
  var toShow = list || contacts;
  var container = document.getElementById("contact-list");
  container.innerHTML = "";

  if (toShow.length === 0) {
    container.innerHTML = '<div id="empty-message">Aucun contact trouvé.</div>';
    return;
  }

  toShow.forEach(function(contact) {
    var initiale = contact.prenom.charAt(0).toUpperCase();
    var card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML =
      '<div class="contact-info">' +
        '<div class="contact-avatar">' + initiale + '</div>' +
        '<div>' +
          '<div class="contact-name">' + contact.prenom + ' ' + contact.nom + '</div>' +
          '<div class="contact-tel">' + contact.tel + '</div>' +
          '<div class="contact-email">' + contact.email + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="contact-actions">' +
        '<button class="btn-edit" onclick="editContact(' + contact.id + ')">Modifier</button>' +
        '<button class="btn-delete" onclick="deleteContact(' + contact.id + ')">Supprimer</button>' +
      '</div>';
    container.appendChild(card);
  });
}

function searchContacts() {
  var query = document.getElementById("search-input").value.toLowerCase();
  var filtered = contacts.filter(function(c) {
    return (
      c.prenom.toLowerCase().includes(query) ||
      c.nom.toLowerCase().includes(query) ||
      c.tel.includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  });
  renderContacts(filtered);
}

function showForm(contact) {
  document.getElementById("form-overlay").classList.remove("hidden");
  if (contact) {
    document.getElementById("form-title").textContent = "Modifier le contact";
    document.getElementById("contact-id").value = contact.id;
    document.getElementById("input-prenom").value = contact.prenom;
    document.getElementById("input-nom").value = contact.nom;
    document.getElementById("input-tel").value = contact.tel;
    document.getElementById("input-email").value = contact.email;
    editingId = contact.id;
  } else {
    document.getElementById("form-title").textContent = "Nouveau contact";
    document.getElementById("contact-id").value = "";
    document.getElementById("input-prenom").value = "";
    document.getElementById("input-nom").value = "";
    document.getElementById("input-tel").value = "";
    document.getElementById("input-email").value = "";
    editingId = null;
  }
}

function hideForm() {
  document.getElementById("form-overlay").classList.add("hidden");
  editingId = null;
}

function saveContact() {
  var prenom = document.getElementById("input-prenom").value.trim();
  var nom    = document.getElementById("input-nom").value.trim();
  var tel    = document.getElementById("input-tel").value.trim();
  var email  = document.getElementById("input-email").value.trim();

  if (!prenom || !nom) {
    alert("Le prénom et le nom sont obligatoires.");
    return;
  }

  if (editingId !== null) {
    contacts = contacts.map(function(c) {
      if (c.id === editingId) {
        return { id: c.id, prenom: prenom, nom: nom, tel: tel, email: email };
      }
      return c;
    });
  } else {
    var newId = Date.now();
    contacts.push({ id: newId, prenom: prenom, nom: nom, tel: tel, email: email });
  }

  saveContacts();
  renderContacts();
  hideForm();
}

function editContact(id) {
  var contact = contacts.find(function(c) { return c.id === id; });
  if (contact) showForm(contact);
}

function deleteContact(id) {
  if (confirm("Supprimer ce contact ?")) {
    contacts = contacts.filter(function(c) { return c.id !== id; });
    saveContacts();
    renderContacts();
  }
}

function syncContacts() {
  var statusEl = document.getElementById("sync-status");
  statusEl.className = "";
  statusEl.textContent = "Synchronisation en cours...";
  statusEl.classList.remove("hidden");

  setTimeout(function() {
    var online = navigator.onLine;
    if (online) {
      statusEl.classList.add("success");
      statusEl.textContent = "Contacts synchronisés avec succès !";
    } else {
      statusEl.classList.add("error");
      statusEl.textContent = "Hors ligne — synchronisation impossible.";
    }
    setTimeout(function() {
      statusEl.classList.add("hidden");
    }, 3000);
  }, 2000);
}