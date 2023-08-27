import {upload} from './upload.js'


upload('#file', {
    // If the key is set to true, then we will load several files.
    multi: true,
    // We are filtering the file extensions that we can upload.
    accept: ['.png', 'jpg', '.jpeg', '.gif'],
    // Function for uploading files to the server.
    onUpload(files, blocks) {
        console.log(files)}
})


console.log('app.js')
