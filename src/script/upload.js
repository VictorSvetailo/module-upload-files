// helper
import { formatBytes } from './helper/formatBytes'

const element = (tag, classes = [], content) => {
   const node = document.createElement(tag)

   if (classes.length) {
      node.classList.add(...classes)
   }

   if (content) {
      node.textContent = content
   }

   return node
}

// noop() is a utility empty function placeholder. Not error
function noop() {}

export function upload(selector, options = {}) {
   let files = []
   const onUpload = options.onUpload ?? noop
   const input = document.querySelector(selector)
   const preview = element('div', ['preview'])
   const open = element('button', ['button'], 'Open')
   const upload = element('button', ['button', 'primary'], 'Upload')
   preview.style.display = 'none'
   upload.style.display = 'none'

   if (options.multi) {
      input.setAttribute('multiple', true)
   }

   if (options.accept && Array.isArray(options.accept)) {
      input.setAttribute('accept', options.accept.join(','))
   }
   input.insertAdjacentElement('afterend', preview)
   input.insertAdjacentElement('afterend', upload)
   input.insertAdjacentElement('afterend', open)

   const triggerInput = () => input.click()
   const changeHandler = event => {
      if (!event.target.files.length) return

      // Converting 'files' to an array.
      files = Array.from(event.target.files)
      preview.innerHTML = ''
      preview.style.display = 'grid'
      upload.style.display = 'inline'

      // The goal of this iteration is to display image previews for the user.
      files.forEach(file => {
         // Checking if the file is an 'image'.
         if (!file.type.match('image')) {
            return
         }

         // The FileReader is needed for asynchronous reading of the
         // content of files selected by the user through file input elements.
         const reader = new FileReader()

         // Since we are working with an asynchronous operation, we need the onload event handler.
         reader.onload = ev => {
            // input.insertAdjacentHTML('afterend', `<img src='${ev.target.result}' />`)
            const src = ev.target.result
            preview.insertAdjacentHTML(
               'afterbegin',
               `
                <div class="preview-image">
                    <div class="preview-remove" data-name="${
   file.name
}">&times;</div>
                    <img src='${src}'  alt="${file.name}"/>
                    <div class="preview-info">
                <span>${file.name}</span>
                  <span>${formatBytes(file.size)}</span>
                 </div>
                </div>
                `
            )
         }

         // readAsDataURL() in FileReader reads files into the Data URL format,
         // convenient for embedding file previews, like images, into web pages.
         reader.readAsDataURL(file)
      })
   }

   const removeHandler = event => {
      if (!event.target.dataset.name) {
         return
      }

      const { name } = event.target.dataset

      files = files.filter(file => file.name !== name)

      if (!files.length) {
         preview.style.display = 'none'
         upload.style.display = 'none'
      }

      const block = preview
         .querySelector(`[data-name='${name}']`)
         .closest('.preview-image')
      console.log(block)
      block.classList.add('removing')
      setTimeout(() => {
         block.remove()
      }, 300)
   }

   // Displaying file upload progress to the server.
   const clearPreview = el => {
      el.style.bottom = '0px'
      el.innerHTML = '<div class="preview-info-progress-line"></div>'
   }

   const uploadHandler = () => {
      preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
      const previewInfo = preview.querySelectorAll('.preview-info')
      previewInfo.forEach(clearPreview)
      onUpload(files, previewInfo)
   }

   open.addEventListener('click', triggerInput)
   input.addEventListener('change', changeHandler)
   preview.addEventListener('click', removeHandler)
   upload.addEventListener('click', uploadHandler)
}

console.log('upload.js')
