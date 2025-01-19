document.addEventListener("DOMContentLoaded", function() {
  checkLoginStatus();
  fetchExhibitionsData();
  fetchLinksData();
  fetchBooksData(); 
});



document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); 

  const username = document.getElementById('username').value;  
  const password = document.getElementById('password').value;  

  // Αποστολή των δεδομένων στον server μέσω fetch
  fetch('http://127.0.0.1:3000/auth/login', {  // Χρησιμοποιούμε τη σωστή διεύθυνση του server
    method: 'POST',  // Μέθοδος POST για αποστολή των δεδομένων
    headers: {
      'Content-Type': 'application/json',  // Ορίζουμε το περιεχόμενο ως JSON
    },
    body: JSON.stringify({
      username: username,
      password: password
    })  // Μετατροπή των δεδομένων σε JSON
  })
  .then(response => {
    if (response.ok) {
      return response.json();  // Αν η απάντηση είναι επιτυχής, επιστρέφουμε το JSON
    }
    // Διαχείριση σφαλμάτων σε περίπτωση αποτυχίας
    return response.text().then(errorText => { throw new Error(errorText) });
  })
  .then(data => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);  // Αποθήκευση του token στο localStorage
      alert('Σύνδεση επιτυχής!'); 
      checkLoginStatus(); // Ενημέρωση κατάστασης σύνδεσης
    }
  })
  .catch(error => {
    alert('Λάθος όνομα χρήστη ή κωδικός');  // Ειδοποίηση σφάλματος για λανθασμένα στοιχεία
    console.error(error);  // Εμφάνιση του σφάλματος στην κονσόλα
  });
});

// Αποσύνδεση του χρήστη
function logout() {
  // Αφαίρεση του token από το localStorage
  localStorage.removeItem('authToken');  

  // Εμφάνιση μηνύματος αποσύνδεσης
  alert('Αποσύνδεση επιτυχής!');

  // Απόκρυψη του μενού διαχείρισης και εμφάνιση της φόρμας σύνδεσης
  document.getElementById('admin-menu').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('logout-button').classList.add('hidden'); // Κρύβουμε το κουμπί αποσύνδεσης
  
  // Ενημέρωση κατάστασης σύνδεσης
  checkLoginStatus();
}

// Έλεγχος κατάστασης σύνδεσης κατά την φόρτωση της σελίδας
function checkLoginStatus() {
  const token = localStorage.getItem('authToken');
  const exhibitionsLink = document.getElementById('exhibitions-management-link');
  const linksManagementLink = document.getElementById('links-management-link');
  console.log('Token κατά τον έλεγχο:', token); // Debugging

  if (token && token !== "null") {
    // Εμφάνιση για συνδεδεμένο χρήστη
    exhibitionsLink.classList.remove('hidden'); // Εμφάνιση "Διαχείριση Εκθέσεων"
    linksManagementLink.classList.remove('hidden'); // Εμφάνιση "Διαχείριση Συνδέσμων"
    console.log("Ο χρήστης είναι συνδεδεμένος. Εμφανίζονται οι διαχειριστικές επιλογές.");
  } else {
    // Εμφάνιση για μη συνδεδεμένο χρήστη
    exhibitionsLink.classList.add('hidden'); // Απόκρυψη "Διαχείριση Εκθέσεων"
    linksManagementLink.classList.add('hidden'); // Απόκρυψη "Διαχείριση Συνδέσμων"
    console.log("Ο χρήστης δεν είναι συνδεδεμένος. Οι διαχειριστικές επιλογές είναι κρυφές.");
  }
}

// Κλήση της checkLoginStatus όταν φορτώνει η σελίδα
window.addEventListener('load', checkLoginStatus);

// Ενεργοποίηση της αποσύνδεσης όταν γίνεται κλικ στο κουμπί αποσύνδεσης
document.getElementById('logout-button').addEventListener('click', function() {
  logout();  // Κλήση της συνάρτησης αποσύνδεσης
});

// Φόρτωση βιβλίων
function fetchBooksData() {
  fetch('data/books.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      loadBooks(data.Books); // Καλούμε την loadBooks με τα δεδομένα των βιβλίων
    })
    .catch(error => {
      console.error('Error fetching books data:', error);
    });
}

// Εμφάνιση των βιβλίων στον πίνακα
function loadBooks(books) {
  const booksTableBody = document.getElementById('book-table-body');
  booksTableBody.innerHTML = "";  // Καθαρίζουμε το tbody πριν την προσθήκη νέων γραμμών

  books.forEach(book => {
    const row = document.createElement("tr");

    // Δημιουργούμε τον σύνδεσμο
    const bookHtml = `<a href="${book.link}" target="_blank">${book.title}</a>`;

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.description}</td>
      <td>${bookHtml}</td>
    `;

    booksTableBody.appendChild(row); // Προσθήκη της γραμμής στον πίνακα
  });
}

// Φόρτωση δεδομένων για συνδέσμους
function fetchLinksData() {
  fetch('data/internet_links.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      loadLinks(data.links);
    })
    .catch(error => {
      console.error('Error fetching internet-links.json:', error);
    });
}

// Εμφάνιση των Internet Links στον πίνακα
function loadLinks(links) {
  const linksTableBody = document.getElementById('sundesmoi-table-body');
  linksTableBody.innerHTML = ""; // Καθαρίζουμε το tbody πριν την προσθήκη νέων γραμμών

  links.forEach(link => {
    const row = document.createElement("tr");

    // Δημιουργούμε τον σύνδεσμο
    const linkHtml = `<a href="${link.link}" target="_blank">${link.title}</a>`;

    row.innerHTML = `
      <td>${link.title}</td>
      <td>${link.description}</td>
      <td>${linkHtml}</td>
    `;

    linksTableBody.appendChild(row); // Προσθήκη της γραμμής στον πίνακα
  });
}

// Φόρτωση εκθέσεων
function fetchExhibitionsData() {
  fetch('data/exhibition.json')
    .then(response => response.json())
    .then(data => {
      loadExhibitions(data.exhibition);
    })
    .catch(error => {
      console.error('Error fetching exhibitions data:', error);
    });
}

// Εμφάνιση των εκθέσεων στον πίνακα
function loadExhibitions(exhibitions) {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";  // Καθαρίζουμε το tbody πριν την προσθήκη νέων γραμμών

  exhibitions.forEach(exhibition => {
    const row = document.createElement("tr");
    
    // Δημιουργούμε τον σύνδεσμο
    let linksHtml = `<a href="${exhibition.links}" target="_blank">Σύνδεσμος</a>`;

    row.innerHTML = `
      <td>${exhibition.year}</td>
      <td>${exhibition.startDate}</td>
      <td>${exhibition.endDate}</td>
      <td>${exhibition.venue}</td>
      <td>${exhibition.city}</td>
      <td>${exhibition.country}</td>
      <td>${exhibition.exhibitionName}</td>      
      <td>${linksHtml}</td>
    `;

    tableBody.appendChild(row); // Προσθήκη της γραμμής στον πίνακα
  });
}








// Εμφάνιση της επιλεγμένης κατηγορίας
function showSection(sectionId) {
  const token = localStorage.getItem('authToken');

  

  const sections = document.querySelectorAll('main section');
  sections.forEach(section => section.classList.add('hidden'));  // Απόκρυψη όλων των sections

  const selectedSection = document.getElementById(sectionId);

  // Αν δεν υπάρχει token και το section είναι το "exhibitions-management", μην κάνεις τίποτα
  if (!token && sectionId === 'exhibitions-management') {
    alert('Πρέπει να συνδεθείτε ως διαχειριστής για να αποκτήσετε πρόσβαση.');
    return;
  }


  if (selectedSection) {
    selectedSection.classList.remove('hidden');  // Εμφάνιση της επιλεγμένης ενότητας
  }

  // Κρύβουμε όλες τις υποκατηγορίες στο sidebar
  const subsections = document.querySelectorAll('aside div');
  subsections.forEach(subsection => subsection.classList.add('hidden'));

  // Εμφάνιση του menu της επιλεγμένης κατηγορίας
  const selectedMenu = document.getElementById(sectionId + '-menu');
  if (selectedMenu) {
    selectedMenu.classList.remove('hidden');
  }

  // Ενεργοποιούμε το σωστό σύνδεσμο στο μενού πλοήγησης
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`nav ul li a[onclick="showSection('${sectionId}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Εμφάνιση της επιλεγμένης υποκατηγορίας
function showSubsection(subsectionId) {
  const sections = document.querySelectorAll('main section');
  sections.forEach(section => section.classList.add('hidden'));  // Απόκρυψη όλων των sections

  const selectedSubsection = document.getElementById(subsectionId);
  if (selectedSubsection) {
    selectedSubsection.classList.remove('hidden');  // Εμφάνιση της επιλεγμένης υποκατηγορίας
  }

  // Ενεργοποίηση του αντίστοιχου συνδέσμου στην πλοήγηση
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`nav ul li a[onclick="showSubsection('${subsectionId}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Καλούμε την showSection για να εμφανίζονται οι υποκατηγορίες όταν επιλέγεται μια κύρια κατηγορία
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', function(event) {
    const sectionId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
    showSection(sectionId);
  });
});


