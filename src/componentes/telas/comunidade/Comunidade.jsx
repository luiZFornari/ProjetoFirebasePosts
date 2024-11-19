import { useState, useEffect } from "react";
import ComunidadeContext from "./ComunidadeContext";
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../comuns/Carregando";
import { auth } from "../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addComunidadeFirebase,
  getComunidadesFirebase,
  deleteComunidadeFirebase,
  updateComunidadeFirebase,
  getComunidadesUIDFirebase,
} from "../../services/ComunidadeService";
import { Navigate } from "react-router-dom";

function Comunidade() {
  const [user, loading, error] = useAuthState(auth);

  const [alerta, setAlerta] = useState({ status: "", message: "" });
  const [listaObjetos, setListaObjetos] = useState([]);
  const [editar, setEditar] = useState(false);
  const [objeto, setObjeto] = useState({
    id: "",
    nome: "",
    descricao: "",
    tipo: "",
    uid: user?.uid,
    usuario: user?.displayName,
  });
  const [carregando, setCarregando] = useState(true);
  const [abreDialogo, setAbreDialogo] = useState(false);

  const novoObjeto = () => {
    setEditar(false);
    setAlerta({ status: "", message: "" });
    setObjeto({
      id: "",
      nome: "",
      descricao: "",
      tipo: "",
      uid: user?.uid,
      usuario: user?.displayName,
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
    console.log(objeto);
    e.preventDefault();
    if (editar) {
      try {
        await updateComunidadeFirebase(objeto);
        setAlerta({
          status: "success",
          message: "Comunidade atualizado com sucesso",
        });
      } catch (err) {
        setAlerta({
          status: "error",
          message: "Erro ao atualizar a Comunidade:" + err,
        });
      }
    } else {
      // novo
      try {
        setObjeto(await addComunidadeFirebase(objeto));
        setEditar(true);
        setAlerta({
          status: "success",
          message: "Comunidade criado com sucesso",
        });
      } catch (err) {
        setAlerta({
          status: "error",
          message: "Erro ao criar a Comunidade:" + err,
        });
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setObjeto({ ...objeto, [name]: value });
  };

  const remover = async (objeto) => {
    if (window.confirm("Remover este objeto? Todos os posts serão deletados")) {
      try {
        deleteComunidadeFirebase(objeto);
        setAlerta({
          status: "success",
          message: "Comunidade removida com sucesso!",
        });
      } catch (err) {
        setAlerta({ status: "error", message: "Erro ao  remover: " + err });
      }
    }
  };

  useEffect(() => {
    setCarregando(true);
    if (user?.uid != null) {
      const uid = user?.uid;
      getComunidadesUIDFirebase(uid, setListaObjetos);
    }
    setCarregando(false);
  }, [user]);

  if (user) {
    return (
      <ComunidadeContext.Provider
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
        }}
      >
        <Carregando carregando={carregando}>
          <Tabela />
        </Carregando>
        <Form />
      </ComunidadeContext.Provider>
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default Comunidade;
