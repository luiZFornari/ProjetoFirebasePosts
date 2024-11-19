import { useState, useEffect } from "react";
import PostsContext from "./PostsContext";
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../comuns/Carregando";
import { auth } from "../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  deletePostFirebase,
  addPostFirebase,
  updatePostFirebase,
  getPostsUIDFirebase,
} from "../../services/PostService";
import { Navigate } from "react-router-dom";
import Comunidade from "../comunidade/Comunidade";
import { getComunidadesFirebase } from "../../services/ComunidadeService";

function Posts() {
  const [user, loading, error] = useAuthState(auth);

  const [alerta, setAlerta] = useState({ status: "", message: "" });
  const [listaObjetos, setListaObjetos] = useState([]);
  const [editar, setEditar] = useState(false);
  const [objeto, setObjeto] = useState({
    id: "",
    titulo: "",
    texto: "",
    tipo: "",
    url: "",
    comunidade: "",
    uid: user?.uid,
    usuario: user?.displayName,
    email: user?.email,
  });
  const [carregando, setCarregando] = useState(true);
  const [abreDialogo, setAbreDialogo] = useState(false);
  const [comunidades, setComunidades] = useState([]);

  useEffect(() => {
    getComunidadesFirebase(setComunidades);
  }, []);

  const novoObjeto = () => {
    setEditar(false);
    setAlerta({ status: "", message: "" });
    setObjeto({
      id: "",
      titulo: "",
      texto: "",
      tipo: "",
      url: "",
      comunidade: "",
      uid: user?.uid,
      usuario: user?.displayName,
      email: user?.email,
    });
    setAbreDialogo(true);
  };

  const editarObjeto = async (objeto) => {
    setObjeto(objeto);
    setAbreDialogo(true);
    setEditar(true);
    setAlerta({ status: "", message: "" });
  };

  const acaoCadastrar = async (e) => {
    e.preventDefault();
    if (editar) {
      try {
        await updatePostFirebase(objeto);
        setAlerta({
          status: "success",
          message: "Post atualizado com sucesso",
        });
      } catch (err) {
        setAlerta({
          status: "error",
          message: "Erro ao atualizar o POST:" + err,
        });
      }
    } else {
      // novo
      try {
        setObjeto(await addPostFirebase(objeto));
        setEditar(true);
        setAlerta({ status: "success", message: "Post criado com sucesso" });
      } catch (err) {
        setAlerta({ status: "error", message: "Erro ao criar o POST:" + err });
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setObjeto({ ...objeto, [name]: value });
  };

  const remover = async (objeto) => {
    if (window.confirm("Remover este objeto?")) {
      try {
        deletePostFirebase(objeto);
        setAlerta({ status: "success", message: "Post removido com sucesso!" });
      } catch (err) {
        setAlerta({ status: "error", message: "Erro ao  remover: " + err });
      }
    }
  };

  useEffect(() => {
    setCarregando(true);
    if (user?.uid != null) {
      const uid = user?.uid;
      getPostsUIDFirebase(uid, setListaObjetos);
      getComunidadesFirebase(setComunidades);
    }
    setCarregando(false);
  }, [user]);

  if (user) {
    return (
      <PostsContext.Provider
        value={{
          alerta,
          setAlerta,
          listaObjetos,
          setListaObjetos,
          remover,
          objeto,
          setObjeto,
          editarObjeto,
          novoObjeto,
          acaoCadastrar,
          handleChange,
          abreDialogo,
          setAbreDialogo,
          comunidades,
        }}
      >
        <Carregando carregando={carregando}>
          <Tabela />
        </Carregando>
        <Form />
      </PostsContext.Provider>
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default Posts;
