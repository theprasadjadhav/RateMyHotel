const forms = document.querySelectorAll('.needs-validation')

Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        

        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)
})

const available_photos = document.querySelectorAll('.image-checkbox');
const upload_photos = document.querySelector('#photos');
const available_photo_count =available_photos?available_photos.length:0;

    upload_photos.addEventListener('change', (e) => {

        const files = upload_photos.files;
        if (files.length > 4-available_photo_count) {
            alert(`Only ${4-available_photo_count} files are allowed to upload.`);
            upload_photos.value = ""
        }
    });
