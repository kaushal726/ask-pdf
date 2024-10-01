import multer from 'multer';

// Set up file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './storage/pdfs'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

export const upload = multer({ storage });

export const uploadPdf = async (req, res) => {
    const { user_id } = req.body;
    const { filename, path, size } = req.file;

    try {
        const pdf = new Pdf({
            user_id,
            file_name: filename,
            file_path: path,
            file_size: size,
            content_hash: 'sha256_hash_placeholder'
        });
        await pdf.save();
        res.status(201).json({ message: 'PDF uploaded', pdf });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
