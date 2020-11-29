// import axios from 'axios';
import imgur from 'imgur';
import { imgurId } from '../../config/imgurConfig';
import imageRepository from '../../data/repositories/imageRepository';

imgur.setClientId(imgurId);
imgur.setAPIUrl('https://api.imgur.com/3/');

const imgurUpload = async file => {
  let result = {};
  const syncUploader = new Promise(resolve => {
    imgur.uploadBase64(file.buffer.toString('base64'))
      .then(json => {
        const { link, deletehash } = json.data;
        result = { link, deleteHash: deletehash };
        resolve();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err.message);
        resolve();
      });
  });
  await syncUploader;
  return result;
};

export const imgurDelete = async hash => {
  let result = false;
  const syncDeleter = new Promise(resolve => {
    imgur.deleteImage(hash)
      .then(status => {
        result = status.data;
        resolve();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err.message);
        resolve();
      });
  });
  await syncDeleter;
  return result;
};

export const upload = async file => {
  // const image = await uploadToImgur(file);
  const image = await imgurUpload(file);
  return image;
};

export const createImage = async image => {
  const result = await imageRepository.create(image);
  return result;
};

export const deleteTmptImage = async data => {
  const { tmptHash } = data;
  const logg = await imgurDelete(tmptHash);
  return { dell: logg };
};

export const deleteImage = async imageId => {
  const { deleteHash } = await imageRepository.getById(imageId);
  const logg = await imgurDelete(deleteHash);
  if (logg) {
    const result = imageRepository.deleteById(imageId);
    return { dell: result };
  }
  return { dell: false };
};
