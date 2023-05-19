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

Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        
        if (document.getElementById('no-rate').checked == true) {
            document.querySelector('#ratingfeedback').classList.remove("visually-hidden")
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated')
    }, false)
})

var radios = document.querySelectorAll('input[type=radio][name="review[rating]"]');
radios.forEach(radio => radio.addEventListener('change', () => {
    if (radio.value != 0){
        document.querySelector('#ratingfeedback').classList.add("visually-hidden")
    }
}));

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

 