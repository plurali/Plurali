import { EditorOptions } from "tinymce";

export const tinyInitConfig: EditorOptions = {
    plugins: [
        'advlist',
        'autolink',
        'link',
        'image',
        'lists',
        'charmap',
        'preview',
        'anchor',
        'pagebreak',
        'searchreplace',
        'wordcount',
        'visualblocks',
        'visualchars',
        'code',
        'insertdatetime',
        'table',
        'emoticons',
        'autosave',
    ],
    content_style: `
      body {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
      }
    `,
    toolbar:
        'undo redo styles fontfamily fontsize | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor | emoticons image link restoredraft',
    menubar: 'edit insert format table',
    paste_data_images: true,
    browser_spellcheck: true,
    images_file_types: 'jpg,png,svg,webp,avif,gif',
    block_unsupported_drop: true,
    object_resizing: 'img',
    removed_menuitems: 'image',
    font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt',
    promotion: false,
    mobile: {
      toolbar_mode: "wrap",
      inline: false,
    },
    image_class_list: [
        { title: 'Default', value: '' },
        { title: 'Inline', value: 'inline' },
    ],
    ...({
        autosave_ask_before_unload: false,
        autosave_prefix: '_plurali_{path}{query}-{id}',
        autosave_restore_when_empty: true,
        autosave_interval: '3s',
    } as any),
};

export type {Editor as TinyEditorType} from "tinymce";
