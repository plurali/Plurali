export class StorageFile {
    constructor(
        public path: string,
        public lastModified: Date,
        public url: string,
        public mimeType: string
    ) {}
}