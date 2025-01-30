const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');
if (error) {
  Swal.fire({
    title: 'Authentication Error',
    text: error,
    icon: 'error',
    confirmButtonText: 'OK',
  });
}

// Function to handle repository selection
const repoDropdown = document.getElementById('repoDropdown');
const branchContainer = document.getElementById('branchContainer');

repoDropdown.addEventListener('change', function() {
    if (this.value) {
        branchContainer.style.display = 'block';
        // Here you can populate the branch dropdown based on the selected repository
    } else {
        branchContainer.style.display = 'none';
    }
});
