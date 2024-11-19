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
  arrayRemove,
  arrayUnion,
  getDoc,
  getDocs,
} from "firebase/firestore";

// Adiciona comunidade na lista de comunidades da tabela usuarios
export const addComunidadeUserFirebase = async (
  comunidadeNome,
  comunidadeId,
  user
) => {
  try {
    const colRef = collection(db, "users");
    const q = query(colRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userDocRef = querySnapshot.docs[0];

    if (userDocRef) {
      await updateDoc(userDocRef.ref, {
        comunidades: arrayUnion({
          nome: comunidadeNome,
          id: comunidadeId,
        }),
      });
    } else {
      console.log("Documento do usuário não encontrado.");
    }
  } catch (error) {
    console.log(error);
  }
};

// Remove comunidade da lista de comunidades da tabela usuarios
export const removeComunidadeUserFirebase = async (
  comunidadeNome,
  comunidadeId,
  user
) => {
  try {
    const colRef = collection(db, "users");
    const q = query(colRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref; // Aqui, acessamos a referência correta

      await updateDoc(userDocRef, {
        comunidades: arrayRemove({ id: comunidadeId, nome: comunidadeNome }),
      });
    } else {
      console.log("Documento do usuário não encontrado.");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getListaComunidadesbyUser = async (user) => {
  try {
    // Executa a query para buscar a lista de comunidades do usuário
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const listaComunidades = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Verifica se o campo comunidades existe e é um array
        if (data.comunidades && Array.isArray(data.comunidades)) {
          listaComunidades.push(...data.comunidades); // Adiciona cada comunidade
        }
      });
    }
    // Retorna a lista de comunidades do usuário
    console.log(listaComunidades);
    return listaComunidades;
  } catch (error) {
    console.error("Erro ao buscar comunidades do usuário:", error);
    return []; // Retorna uma lista vazia em caso de erro
  }
};
