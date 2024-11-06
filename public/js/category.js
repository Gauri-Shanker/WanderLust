const categories = ["Home", "Beach", "Rooms", "Hotel", "Huts", "Camper Vans", "HouseBoat", "Caves", "Others"];
function populateDropdown() {
    const dropdownContent = document.querySelector('.categorybox');
    dropdownContent.innerHTML = ''; // Clear existing options

    for (let category of categories) {
        const option = document.createElement('li');
        const anker = document.createElement('a')
        anker.href = '#';
        anker.className = 'dropdown-item';
        option.appendChild(anker)
        // option.onclick = () => filterCategory(category);
        anker.textContent = category;
        anker.onclick = (event) => {
            event.preventDefault();
            updateButtonText(category);
        }
        dropdownContent.appendChild(option);
    }
}
function updateButtonText(category) {
    const dropdownButton = document.querySelector('.categorybutton');
    
    dropdownButton.textContent = category
    document.getElementById('categorybuttontext').value = document.querySelector('[name="categorybuttontext"]').innerText;
}
document.addEventListener("DOMContentLoaded", populateDropdown);