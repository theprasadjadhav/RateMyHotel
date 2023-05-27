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
        const no_rating  = document.getElementById('no-rate')
        if (no_rating && no_rating.checked == true) {
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
const available_photo_count = available_photos ? available_photos.length : 0;
const file_validate_feedback = document.querySelector("#file_validate_feedback")

function is_valid_format(filename) {
    let parts = filename.split(".");
    let ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
       case "jpg":
       case "jpeg":
       case "png":
         return true;
     }
     return false;
}

if (upload_photos) {        
    upload_photos.addEventListener('change', (e) => {
        let flag = 0


        const files = upload_photos.files;
        if (files.length > 4-available_photo_count) {
            file_validate_feedback.innerText = `Only ${4-available_photo_count} files are allowed to upload.`;
            upload_photos.value = ""
            file_validate_feedback.classList.remove("visually-hidden");
            flag = 1;
        }
        
        for (let file of files) {

            if (!is_valid_format(file.name)) {
                file_validate_feedback.innerText ="Invalid image, Please select a valid image";
                upload_photos.value = "";
                file_validate_feedback.classList.remove("visually-hidden");
                flag = 1;
                break;
            }

            const fsize = file.size;
            const size = Math.round(fsize / 1024);
             if (size >= 4096) {
                 file_validate_feedback.innerText =  "File too Big, please select a file less than 4MB";
                 upload_photos.value = "";
                 file_validate_feedback.classList.remove("visually-hidden");
                 flag = 1;
                 break;
             }
        }
        if (flag === 0) {
            file_validate_feedback.classList.add("visually-hidden");
        }
    });
}
 
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
       file_validate_feedback.classList.add("visually-hidden");
    })
})