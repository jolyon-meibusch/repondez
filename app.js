const modal = document.querySelector('.modal');
const form = document.querySelector('#registrar');
const input = form.querySelector('.name-input');
const ul = document.querySelector('.inviteList');
const inviteBtn = document.querySelector('.invite-guest');
const closeModalBtn = document.querySelectorAll('.close-modal');
const searchInput = document.querySelector('.search-input');
const mobileSearch = document.querySelector('.search-mobile-icon');
const filterBtn = document.querySelector('.filter-icon');
const closeSearch = document.querySelector('.close-search');
const trashIcon = document.querySelector('.trash-icon');
const alertModal = document.querySelector('.alert-modal');
const alertDiv = document.querySelector('.alert');
const searchDiv = document.getElementById('searchDiv');
const filterUI = document.getElementById('filterUI');
const filterIcon = document.querySelector('.fa-filter');


class Guest {
  constructor(name, title, category, confirmed) {
    this.name = name;
    this.title = title;
    this.category = category;
    this.confirmed = confirmed;
  }
}

class UI {
  openFormModal(){
    modal.style.display = 'block';
    form.style.display = 'block';
  }

  openAlertModal(){
    modal.style.display = 'block';
    alertDiv.style.display = 'block';
  }

  addGuestToList(guest){
    const list = document.querySelector('.inviteList');
    const li = document.createElement('li');
    li.classList.add('attendee');
    li.innerHTML = `
        <div class="invitee">
          <span>${guest.name}</span>
          <i class="icon fas fa-info-circle"></i>
          <i class="icon fas fa-trash-alt"></i>
          <i class="icon fas fa-check-circle ${guest.confirmed}"></i>
        </div>
        <div class="invitee-info">
          <div class="invite-div">
            <h3>Guest Name: ${guest.name}</h3>
          </div>
          <div class="invite-div">
            <h3>Guest Title: ${guest.title}</h3>
          </div>
          <div class="invite-div">
            <h3>Category: ${guest.category}</h3>
          </div>
        </div>
    `;
    li.classList.add(`${guest.category}`);
    list.appendChild(li);
  }

  clearFields(){
    document.getElementById('guestName').value = '';
    document.getElementById('guestTitle').value = '';
    document.getElementById('job').value = 'diplomat';
  }

  removeGuest(guest){
    guest.remove();
  }


  filterGuests(){
    const ui = new UI();
    let confirmedCount = 0;
    const lis = Array.from(ul.children);
    filterIcon.classList.add('active');
    filterBtn.classList.add('active');
    lis.forEach((li) => {
      if (li.firstElementChild.lastElementChild.classList.contains('confirmed')){
        li.style.display = '';
        confirmedCount++;
      } else {
        li.style.display = 'none';
      }
    });
    if(confirmedCount === 0){
    ui.openAlertModal();
    alertDiv.innerHTML = `
    <i class="fas fa-2x fa-times close-modal"></i>
    <span>There are currently no confirmed guests to filter.</span>
    `;
    }
    confirmedCount = 0;
  }

  unFilterGuests(){
    const lis = Array.from(ul.children);
    filterIcon.classList.remove('active');
    filterBtn.classList.remove('active');
    lis.forEach((li) => li.style.display = '');
  }

  clearSearchField(){
    searchFocus();
    searchInput.value = '';
    document.querySelectorAll('.attendee').forEach(function(attendee){
        attendee.style.display = 'block';
    });
  }
}

// add to local storage
class Store {
  static getGuests(){
    let guests;
    if(localStorage.getItem('guests')===null){
      guests = [];
    } else {
      guests = JSON.parse(localStorage.getItem('guests'));
    }
    return guests;
  }

  static displayGuests(){
    const guests = Store.getGuests();

    guests.forEach(function(guest){
      const ui = new UI;
      ui.addGuestToList(guest);
    });
  }

  static addGuest(guest){
    const guests = Store.getGuests();
    guests.push(guest);
    localStorage.setItem('guests', JSON.stringify(guests));
  }

  static removeGuest(name){
    const guests = Store.getGuests();
    guests.forEach(function(guest, index){
      if(guest.name === name){
        guests.splice(index, 1);
      }
    });

    localStorage.setItem('guests', JSON.stringify(guests));
  }

  static clearGuests(){
    const guests = [];
    localStorage.setItem('guests', JSON.stringify(guests));
  }
}

const closeModal = () => {
  modal.style.display = 'none';
  form.style.display = 'none';
  alertDiv.style.display = 'none';
};

const clearAll = () => {
  document.querySelectorAll('.attendee').forEach(function(attendee){
      attendee.remove();
  });
  Store.clearGuests();
  closeModal();
}

const clearSingularAttendee = (target) => {
  console.log(target);
  closeModal();
};



// event listeners

document.addEventListener('DOMContentLoaded', Store.displayGuests);

inviteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const ui = new UI();
  ui.openFormModal();
});
//
// close modal event
modal.addEventListener('click', (e) => {
  if(e.target.classList.contains('close-modal')){
    closeModal();
  }
});

// Search for guests
const searchGuests = (e) => {
  e.preventDefault();
  filterIcon.classList.remove('active');
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.attendee').forEach(function(attendee){
    const guest = attendee.firstElementChild.firstElementChild.textContent;
    if(guest.toLowerCase().indexOf(text) != -1){
      attendee.style.display = 'block';
    } else {attendee.style.display = 'none';}
  });
};

const searchFocus = () => {
  searchInput.focus();
};

searchInput.addEventListener('keyup', searchGuests);

// show mobile search field
mobileSearch.addEventListener('click', (e) => {
  const ui = new UI();
  ui.clearSearchField();
  searchFocus();
});

// filter guests
filterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const ui = new UI();
  ui.clearSearchField();
  filterIcon.classList.toggle('active');
  filterBtn.classList.toggle('active');
  if(e.target.classList.contains('active')){
    ui.filterGuests();
  } else {
    ui.unFilterGuests();
  }

});

// add guest to list
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('guestName').value,
        title = document.getElementById('guestTitle').value,
        category = document.getElementById('job').value;
        confirmed = '';
  // instantiate book
  const guest = new Guest(name, title, category, confirmed);
  // instantiate UI
  const ui = new UI();

  if(name === '' || title === '' || category === '') {
    console.log('please fill in all fields')
  } else {
    ui.addGuestToList(guest);
    Store.addGuest(guest);
    ui.clearFields();
    closeModal();
  }
});


// event listener for trash icon click
trashIcon.addEventListener('click', (e) => {
  const ui = new UI();
  ui.openAlertModal();
  alertDiv.innerHTML = `
  <i class="fas fa-2x fa-times close-modal"></i>
  <span>Are you sure you want to delete all attendees?</span>
  <div>
    <button class="no-btn" onClick="closeModal();">No</button>
    <button class="yes-btn" onClick="clearAll();">Yes</button>
  </div>
  `;
});

// clear search field on close button event
closeSearch.addEventListener('click', (e) => {
  const ui = new UI();
  ui.clearSearchField();
  filterIcon.classList.remove('active');
});

ul.addEventListener('click', (e) => {
  const ui = new UI();
  if(e.target.classList.contains('fa-info-circle') || e.target.classList.contains('fa-undo-alt')){
    ui.openAlertModal();
    const attendeeInfo = e.target.parentElement.nextElementSibling.innerHTML;
    alertDiv.innerHTML = `
    <i class="fas fa-2x fa-times close-modal"></i>
    ${attendeeInfo}
    `;
  }  else if(e.target.classList.contains('fa-trash-alt')){
    e.target.parentElement.parentElement.remove();
    Store.removeGuest(e.target.parentElement.firstElementChild.textContent);

  } else if (e.target.classList.contains('fa-check-circle')){
    if(e.target.classList.contains('confirmed')){
      e.target.classList.remove('confirmed')
    } else {
      e.target.classList.add('confirmed');
    }
  }

});
