import { auth, db } from "../../firebaseConfig";
import {
  doc,
  addDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
} from "firebase/firestore";

export const getPostsFirebase = async (setListaObjetos) => {
  try {
    const q = query(collection(db, "posts"));
    onSnapshot(q, (querySnapshot) => {
      setListaObjetos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          titulo: doc.data().titulo,
          texto: doc.data().texto,
          tipo: doc.data().tipo,
          url: doc.data().url,
          usuario: doc.data().usuario,
          email: doc.data().email,
          uid: doc.data().uid,
          comunidade: doc.data().comunidade,
        }))
      );
    });
  } catch (err) {
    throw err;
  }
};

export const getPostsUIDFirebase = async (uid, setListaObjetos) => {
  try {
    const colRef = collection(db, "posts");
    const q = query(colRef, where("uid", "==", uid));
    onSnapshot(q, (querySnapshot) => {
      setListaObjetos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          titulo: doc.data().titulo,
          texto: doc.data().texto,
          tipo: doc.data().tipo,
          url: doc.data().url,
          usuario: doc.data().usuario,
          email: doc.data().email,
          uid: doc.data().uid,
          comunidade: doc.data().comunidade,
        }))
      );
    });
  } catch (err) {
    throw err;
  }
};

export const deletePostFirebase = async (objeto) => {
  try {
    const postDocRef = doc(db, "posts", objeto.id);
    await deleteDoc(postDocRef);
  } catch (err) {
    throw err;
  }
};

export const addPostFirebase = async (objeto) => {
  try {
    let ret = await addDoc(collection(db, "posts"), {
      titulo: objeto.titulo,
      texto: objeto.texto,
      tipo: objeto.tipo,
      url: objeto.url,
      uid: objeto.uid,
      usuario: objeto.usuario,
      email: objeto.email,
      comunidade: objeto.comunidade,
    }).then(function (docRef) {
      objeto = { ...objeto, id: docRef.id };
      return objeto;
    });
    return ret;
  } catch (err) {
    throw err;
  }
};

export const updatePostFirebase = async (objeto) => {
  try {
    const postDocRef = doc(db, "posts", objeto.id);
    await updateDoc(postDocRef, {
      titulo: objeto.titulo,
      texto: objeto.texto,
      tipo: objeto.tipo,
      url: objeto.url,
      uid: objeto.uid,
      usuario: objeto.usuario,
      email: objeto.email,
      comunidade: objeto.comunidade,
    });
  } catch (err) {
    throw err;
  }
};

//remover todos os posts de uma comunidade
export const deletePostsByComunidade = async (comunidadeId) => {
  try {
    const colRef = collection(db, "posts");
    const q = query(colRef, where("comunidade", "==", comunidadeId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (err) {
    throw err;
  }
};
