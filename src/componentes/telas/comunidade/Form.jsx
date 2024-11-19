import { useContext } from "react";
import Alerta from "../../comuns/Alerta";
import ComunidadeContext from "./ComunidadeContext";
import CampoEntrada from "../../comuns/CampoEntrada";
import CampoSelect from "../../comuns/CampoSelect";
import CampoEntradaTexto from "../../comuns/CampoEntradaTexto";
import Dialogo from "../../comuns/Dialogo";
import { MenuItem } from "@mui/material";

function Form() {
  const {
    objeto,
    handleChange,
    acaoCadastrar,
    alerta,
    abreDialogo,
    setAbreDialogo,
  } = useContext(ComunidadeContext);

  return (
    <>
      <Dialogo
        id="modalEdicao"
        titulo="Organização"
        open={abreDialogo}
        setOpen={setAbreDialogo}
        acaoCadastrar={acaoCadastrar}
        idform="formulario"
        maxWidth="sm"
      >
        <Alerta alerta={alerta} />
        <CampoEntrada
          id="txtID"
          label="ID"
          tipo="text"
          name="id"
          value={objeto.id}
          onchange={handleChange}
          requerido={false}
          readonly={true}
        />
        <CampoEntrada
          id="txtTitulo"
          label="Nome"
          tipo="text"
          name="nome"
          value={objeto.nome}
          onchange={handleChange}
          requerido={true}
          readonly={false}
          maxlength={50}
          msgvalido="Nome OK"
          msginvalido="Informe o Nome"
        />
        <CampoEntradaTexto
          id="txtTexto"
          label="Descrição"
          rows={5}
          tipo="text"
          name="descricao"
          value={objeto.descricao}
          onchange={handleChange}
          requerido={true}
          readonly={false}
          maxlength={100}
          msgvalido="Descricao OK"
          msginvalido="Informe a descrição"
        />
        <CampoSelect
          id="selectTipo"
          label="Tipo"
          idLabel="labelTipo"
          tipo="text"
          name="tipo"
          value={objeto.tipo}
          onchange={handleChange}
          requerido={false}
          msgvalido="Tipo OK"
          msginvalido="Informe o Tipo"
        >
          <MenuItem value="Games">Games</MenuItem>
          <MenuItem value="Filmes">Filmes</MenuItem>
          <MenuItem value="Artigos">Artigos</MenuItem>
          <MenuItem value="Livros">Livros</MenuItem>
          <MenuItem value="Outros">Outros</MenuItem>
        </CampoSelect>
      </Dialogo>
    </>
  );
}

export default Form;
