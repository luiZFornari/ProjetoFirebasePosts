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
  getDoc,
} from "firebase/firestore";
import { deletePostsByComunidade } from "./PostService";

export const getComunidadesFirebase = async (setListaObjetos) => {
  try {
    const q = query(collection(db, "comunidades"));
    onSnapshot(q, (querySnapshot) => {
      setListaObjetos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          descricao: doc.data().descricao,
          tipo: doc.data().tipo,
          usuario: doc.data().usuario,
          uid: doc.data().uid,
        }))
      );
    });
  } catch (err) {
    throw err;
  }
};

export const getComunidadesUIDFirebase = async (uid, setListaObjetos) => {
  try {
    const colRef = collection(db, "comunidades");
    const q = query(colRef, where("uid", "==", uid));
    onSnapshot(q, (querySnapshot) => {
      setListaObjetos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          descricao: doc.data().descricao,
          tipo: doc.data().tipo,
          uid: doc.data().uid,
          usuario: doc.data().usuario,
        }))
      );
    });
  } catch (err) {
    throw err;
  }
};

export const deleteComunidadeFirebase = async (objeto) => {
  try {
    const comunidadeDocRef = doc(db, "comunidades", objeto.id);
    deletePostsByComunidade(objeto.id);
    await deleteDoc(comunidadeDocRef);
  } catch (err) {
    throw err;
  }
};

export const addComunidadeFirebase = async (objeto) => {
  try {
    let ret = await addDoc(collection(db, "comunidades"), {
      nome: objeto.nome,
      descricao: objeto.descricao,
      tipo: objeto.tipo,
      uid: objeto.uid,
      usuario: objeto.usuario,
    }).then(function (docRef) {
      objeto = { ...objeto, id: docRef.id };
      return objeto;
    });
    return ret;
  } catch (err) {
    throw err;
  }
};

export const updateComunidadeFirebase = async (objeto) => {
  try {
    const comunidadeDocRef = doc(db, "comunidades", objeto.id);
    await updateDoc(comunidadeDocRef, {
      nome: objeto.nome,
      descricao: objeto.descricao,
      tipo: objeto.tipo,
      uid: objeto.uid,
      usuario: objeto.usuario,
    });
  } catch (err) {
    throw err;
  }
};

export const getComunidadeId = async (id) => {
  try {
    //recuperar comunidade por docW
    const docRef = doc(db, "comunidades", id);
    const querySnapshot = await getDoc(docRef);
    return querySnapshot.data();
  } catch (err) {
    throw err;
  }
};
