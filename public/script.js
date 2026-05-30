document.addEventListener("DOMContentLoaded", function () {
  checkLoginStatus();
  fetchExhibitionsData();
  fetchLinksData();
  fetchBooksData();
});

// ── Sidebar mapping: top-level section → sidebar menu id ──
const SIDEBAR_MAP = {
  biography: 'biography-menu',
  'early-life': 'biography-menu',
  career: 'biography-menu',
  legacy: 'biography-menu',
  paintings: 'paintings-menu',
  landscapes: 'paintings-menu',
  portais: 'paintings-menu',
  experimental: 'paintings-menu',
  exhibitions: 'exhibitions-menu',
  links: 'links-menu',
  biblia: 'links-menu',
  sundesmoi: 'links-menu',
  admin: 'admin-menu',
  login: 'admin-menu',
  logout: 'admin-menu',
  'exhibitions-management': 'admin-menu',
  'links-management': 'admin-menu',
};

function showSubsection(sectionId) {
  // Κρύβουμε όλα τα sections
  document.querySelectorAll('main section, main > div').forEach(el => el.classList.add('hidden'));

  const target = document.getElementById(sectionId);
  if (target) target.classList.remove('hidden');

  // Ενημερώνουμε το sidebar
  document.querySelectorAll('aside > div').forEach(el => el.classList.add('hidden'));
  const menuId = SIDEBAR_MAP[sectionId];
  if (menuId) {
    const menu = document.getElementById(menuId);
    if (menu) menu.classList.remove('hidden');
  }

  // Active nav link
  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
  const active = document.querySelector(`nav ul li a[onclick="showSubsection('${sectionId}')"]`);
  if (active) active.classList.add('active');

  // Φόρτωση admin λιστών όταν ανοίγουν τα management panels
  if (sectionId === 'exhibitions-management') loadAdminExhibitions();
  if (sectionId === 'links-management') loadAdminLinks();
}

// ── Login ──
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://127.0.0.1:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then(res => {
      if (res.ok) return res.json();
      return res.json().then(err => { throw new Error(err.message); });
    })
    .then(data => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        alert('Σύνδεση επιτυχής!');
        checkLoginStatus();
        showSubsection('admin');
      }
    })
    .catch(() => alert('Λάθος όνομα χρήστη ή κωδικός'));
});

// ── Logout ──
function logout() {
  localStorage.removeItem('authToken');
  alert('Αποσύνδεση επιτυχής!');
  checkLoginStatus();
  showSubsection('login');
}

document.getElementById('logout-button').addEventListener('click', logout);

// ── Έλεγχος κατάστασης σύνδεσης ──
function checkLoginStatus() {
  const token = localStorage.getItem('authToken');
  const logoutButton = document.getElementById('logout-button');
  const exhibitionsLink = document.getElementById('exhibitions-management-link');
  const linksLink = document.getElementById('links-management-link');
  const logoutSidebarLink = document.getElementById('logout-sidebar-link');

  if (token) {
    logoutButton.classList.remove('hidden');
    exhibitionsLink.classList.remove('hidden');
    linksLink.classList.remove('hidden');
    logoutSidebarLink.classList.remove('hidden');
  } else {
    logoutButton.classList.add('hidden');
    exhibitionsLink.classList.add('hidden');
    linksLink.classList.add('hidden');
    logoutSidebarLink.classList.add('hidden');
  }
}

// ── Fetch εκθέσεων ──
function fetchExhibitionsData() {
  fetch('data/exhibition.json')
    .then(res => res.json())
    .then(data => loadExhibitions(data.exhibition))
    .catch(err => console.error('Error fetching exhibitions:', err));
}

function loadExhibitions(exhibitions) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  exhibitions.forEach(ex => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ex.year}</td>
      <td>${ex.startDate}</td>
      <td>${ex.endDate}</td>
      <td>${ex.venue}</td>
      <td>${ex.city}</td>
      <td>${ex.country}</td>
      <td>${ex.exhibitionName}</td>
      <td><a href="${ex.links}" target="_blank">Σύνδεσμος</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Fetch βιβλίων ──
function fetchBooksData() {
  fetch('data/Books.json')
    .then(res => res.json())
    .then(data => loadBooks(data.Books))
    .catch(err => console.error('Error fetching books:', err));
}

function loadBooks(books) {
  const tbody = document.getElementById('book-table-body');
  tbody.innerHTML = '';
  books.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.description}</td>
      <td><a href="${book.link}" target="_blank">${book.title}</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Fetch internet links ──
function fetchLinksData() {
  fetch('data/internet_links.json')
    .then(res => res.json())
    .then(data => loadLinks(data.links))
    .catch(err => console.error('Error fetching links:', err));
}

function loadLinks(links) {
  const tbody = document.getElementById('sundesmoi-table-body');
  tbody.innerHTML = '';
  links.forEach(link => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${link.title}</td>
      <td>${link.description}</td>
      <td><a href="${link.link}" target="_blank">${link.title}</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Προσθήκη έκθεσης (admin) ──
function addExhibition(event) {
  event.preventDefault();
  const token = localStorage.getItem('authToken');
  if (!token) { alert('Πρέπει να συνδεθείτε πρώτα.'); return; }

  const newEx = {
    year: document.getElementById('year').value,
    startDate: document.getElementById('start-date').value,
    endDate: document.getElementById('end-date').value,
    venue: document.getElementById('venue').value,
    city: document.getElementById('city').value,
    country: document.getElementById('country').value,
    exhibitionName: document.getElementById('exhibition-name').value,
    links: document.getElementById('links').value,
  };

  fetch('http://127.0.0.1:3000/exhibition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(newEx),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById('exhibition-form').reset();
      fetchExhibitionsData();
      loadAdminExhibitions();
    })
    .catch(() => alert('Σφάλμα κατά την προσθήκη.'));
}

// ── Φόρτωση εκθέσεων στο admin panel (με delete) ──
function loadAdminExhibitions() {
  fetch('data/exhibition.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('exhibitions-list');
      const exhibitions = data.exhibition;

      let html = '<h4>Λίστα Εκθέσεων</h4>';
      if (exhibitions.length === 0) {
        html += '<p>Δεν υπάρχουν εκθέσεις.</p>';
      } else {
        html += '<table><thead><tr><th>Έτος</th><th>Όνομα Έκθεσης</th><th>Πόλη</th><th></th></tr></thead><tbody>';
        exhibitions.forEach((ex, idx) => {
          html += `<tr>
            <td>${ex.year}</td>
            <td>${ex.exhibitionName}</td>
            <td>${ex.city}, ${ex.country}</td>
            <td><button class="delete-btn" onclick="deleteExhibition(${idx})">Διαγραφή</button></td>
          </tr>`;
        });
        html += '</tbody></table>';
      }
      container.innerHTML = html;
    });
}

function deleteExhibition(idx) {
  const token = localStorage.getItem('authToken');
  if (!token) { alert('Πρέπει να συνδεθείτε πρώτα.'); return; }
  if (!confirm('Να διαγραφεί η έκθεση;')) return;

  fetch(`http://127.0.0.1:3000/exhibition/${idx}`, {
    method: 'DELETE',
    headers: { 'Authorization': token },
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetchExhibitionsData();
      loadAdminExhibitions();
    })
    .catch(() => alert('Σφάλμα κατά τη διαγραφή.'));
}

// ── Προσθήκη συνδέσμου (admin) ──
function addLink(event) {
  event.preventDefault();
  const token = localStorage.getItem('authToken');
  if (!token) { alert('Πρέπει να συνδεθείτε πρώτα.'); return; }

  const newLink = {
    title: document.getElementById('link-title').value,
    link: document.getElementById('link-url').value,
    description: document.getElementById('link-description').value,
  };

  fetch('http://127.0.0.1:3000/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(newLink),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById('link-form').reset();
      fetchLinksData();
      loadAdminLinks();
    })
    .catch(() => alert('Σφάλμα κατά την προσθήκη.'));
}

// ── Φόρτωση συνδέσμων στο admin panel (με delete) ──
function loadAdminLinks() {
  fetch('data/internet_links.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('links-list');
      const links = data.links;

      let html = '<h4>Λίστα Συνδέσμων</h4>';
      if (links.length === 0) {
        html += '<p>Δεν υπάρχουν σύνδεσμοι.</p>';
      } else {
        html += '<table><thead><tr><th>Τίτλος</th><th>Περιγραφή</th><th></th></tr></thead><tbody>';
        links.forEach((lnk, idx) => {
          html += `<tr>
            <td><a href="${lnk.link}" target="_blank">${lnk.title}</a></td>
            <td>${lnk.description}</td>
            <td><button class="delete-btn" onclick="deleteLink(${idx})">Διαγραφή</button></td>
          </tr>`;
        });
        html += '</tbody></table>';
      }
      container.innerHTML = html;
    });
}

function deleteLink(idx) {
  const token = localStorage.getItem('authToken');
  if (!token) { alert('Πρέπει να συνδεθείτε πρώτα.'); return; }
  if (!confirm('Να διαγραφεί ο σύνδεσμος;')) return;

  fetch(`http://127.0.0.1:3000/links/${idx}`, {
    method: 'DELETE',
    headers: { 'Authorization': token },
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetchLinksData();
      loadAdminLinks();
    })
    .catch(() => alert('Σφάλμα κατά τη διαγραφή.'));
}
