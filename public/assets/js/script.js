const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');
if (error) {
    Swal.fire({
        title: 'Authentication Error',
        text: error,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
