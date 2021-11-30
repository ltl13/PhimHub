import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import storage from 'firebase';

export default async function upload(files) {
  const url = {};
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const fileName = new Date().getTime() + files[i].name;
      const storageRef = ref(storage, `/images/${fileName}`);
      await uploadBytesResumable(storageRef, files[i]);
      url[files[i].name] = await getDownloadURL(storageRef);
    }
    return url;
  }
}
