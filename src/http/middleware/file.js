import busboy from 'busboy';

export const file = async (req, res) => {
  const bb = busboy({ headers: req.headers });

  bb.on('file', async (name, file, info) => {
    req.file = file;
  });

  req.pipe(bb);
}