import { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { getPostsFirebase } from "../../services/PostService";
import {
  getComunidadeId,
  getUserComunidades,
} from "../../services/ComunidadeService";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  addComunidadeUserFirebase,
  removeComunidadeUserFirebase,
  getListaComunidadesbyUser,
} from "../../services/UserService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Home() {
  const [listaObjetos, setListaObjetos] = useState([]);
  const [comunidades, setComunidades] = useState({});
  const [userComunidades, setUserComunidades] = useState([]);
  const [filtroComunidade, setFiltroComunidade] = useState(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    getPostsFirebase(setListaObjetos);
  }, []);

  useEffect(() => {
    const fetchComunidades = async () => {
      const comunidadesMap = {};
      for (const objeto of listaObjetos) {
        if (objeto.comunidade && !comunidades[objeto.comunidade]) {
          const comunidadeData = await getComunidadeId(objeto.comunidade);
          comunidadesMap[objeto.comunidade] = comunidadeData.nome;
        }
      }
      setComunidades((prev) => ({ ...prev, ...comunidadesMap }));
    };

    if (listaObjetos.length > 0) fetchComunidades();
  }, [listaObjetos]);

  useEffect(() => {
    const fetchUserComunidades = async () => {
      if (user) {
        const userComs = await getListaComunidadesbyUser(user);
        //salva somente o id da comunidade
        setUserComunidades(userComs.map((comunidade) => comunidade.id));
      }
    };
    fetchUserComunidades();
  }, [user]);

  const listaFiltrada = filtroComunidade
    ? listaObjetos.filter((objeto) => objeto.comunidade === filtroComunidade)
    : listaObjetos;

  const handleFollow = async (comunidadeId) => {
    if (user) {
      try {
        await addComunidadeUserFirebase(
          comunidades[comunidadeId],
          comunidadeId,
          user
        );
        setUserComunidades((prev) => [...prev, comunidadeId]);
      } catch (error) {
        console.error("Erro ao seguir comunidade:", error);
      }
    }
  };

  const handleUnfollow = async (comunidadeId) => {
    if (user) {
      try {
        await removeComunidadeUserFirebase(
          comunidades[comunidadeId],
          comunidadeId,
          user
        );
        setUserComunidades((prev) => prev.filter((id) => id !== comunidadeId));
      } catch (error) {
        console.error("Erro ao deixar de seguir comunidade:", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" component="div" gutterBottom>
        Firebase com Firestore - Posts - PWA
      </Typography>

      {/* Botões para filtro de comunidade */}
      <div style={{ marginBottom: "20px" }}>
        <Button
          variant={filtroComunidade === null ? "contained" : "outlined"}
          onClick={() => setFiltroComunidade(null)}
          sx={{ marginRight: "10px" }}
        >
          Todos
        </Button>
        {userComunidades != null &&
          userComunidades.length > 0 &&
          userComunidades.map((comunidadeId) => (
            <>
              {comunidades[comunidadeId] && (
                <Button
                  key={comunidadeId}
                  variant={
                    filtroComunidade === comunidadeId ? "contained" : "outlined"
                  }
                  onClick={() => setFiltroComunidade(comunidadeId)}
                  sx={{ marginRight: "10px" }}
                >
                  {comunidades[comunidadeId]}
                </Button>
              )}
            </>
          ))}
      </div>

      {/* Exibição de posts */}
      <Grid container spacing={3}>
        {listaFiltrada.map((objeto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={objeto.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {objeto.usuario?.charAt(0)}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      {objeto.usuario}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {objeto.email}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  {objeto.titulo}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {objeto.tipo}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 1.5 }}
                  color="text.primary"
                >
                  {objeto.texto}
                </Typography>

                {objeto.comunidade && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Comunidade:{" "}
                      {comunidades[objeto.comunidade] || "Carregando..."}
                    </Typography>

                    {userComunidades.includes(objeto.comunidade) ? (
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          mt: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          transform: "scale(1)",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onClick={() => handleUnfollow(objeto.comunidade)}
                      >
                        <FavoriteIcon /> Deixar de Seguir
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          mt: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          background:
                            "linear-gradient(to right, #1e90ff, #4169e1)",
                          transform: "scale(1)",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onClick={() => handleFollow(objeto.comunidade)}
                      >
                        <FavoriteBorderIcon /> Seguir
                      </Button>
                    )}
                  </>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end" }}>
                <IconButton
                  href={objeto.url}
                  target="_blank"
                  rel="noreferrer"
                  color="primary"
                  aria-label="Abrir link"
                >
                  <OpenInNewIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
