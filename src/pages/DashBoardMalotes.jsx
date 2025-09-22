import React, { Fragment, useEffect, useState, Suspense, lazy } from "react"
import { useNavigate } from "react-router-dom"
import { MenuSidebarAdmin } from "../componets/Sidebar/sidebar";
import { HeaderMain } from "../componets/Header";
import { MenuButton } from "../componets/Buttons/menuButton";
import { FooterMain } from "../componets/Footer";
import { SidebarProvider } from "../componets/Sidebar/SidebarContext";
import { get } from "../api/funcRequest";
import { useQuery } from "react-query";

const ActionPesquisaRecebimentoMalote = lazy(() => import("../componets/Malotes/ActionConferenciaMalote/actionPesquisaRecebimentoMalote").then(module => ({ default: module.ActionPesquisaRecebimentoMalote })));


export const DashBoardMalotes = ({ }) => {
  const [resumoVisivel, setResumoVisivel] = useState(true);
  const [actionVisivel, setActionVisivel] = useState(true);
  const [clickContador, setClickContador] = useState(0);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [componentToShow, setComponentToShow] = useState("");
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  const navigate = useNavigate();

  function handleShowComponent(componentName) {
    setComponentToShow(componentName);
  }

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {


  }, [usuarioLogado]);

  const { data: optionsModulos = [], error: errorFuncionarios, isLoading: isLoadingFuncionarios, refetch: refetchFuncionarios } = useQuery(
    'menus-usuario',
    async () => {
      const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}&idModulo=${selectedModule?.ID}`);
      
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 5 * 60 * 1000, }
  );

  const permissaoUsuario = selectedModule.menuPai.menuFilho;
  const {   
    ID, 
  } = permissaoUsuario.map(item => ({
    ID: item.ID,
  })).reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});


  let component = null;

  switch (componentToShow) {
   
    case "/malotes/ActionPesquisaRecebimentoMalote":
        component = <ActionPesquisaRecebimentoMalote usuarioLogado={usuarioLogado} ID={ID} />
        break;
    default:
      component = null;
      break;
  }

  return (


    <Fragment>
      {usuarioLogado && (
        <SidebarProvider>

          <div className="page-wrapper">
            <div className="page-inner">
              <MenuSidebarAdmin
                componentToShow={componentToShow}
                handleShowComponent={handleShowComponent}
              />
              <div className="page-content-wrapper">
                <HeaderMain optionsModulos={optionsModulos}/>

                <main id="js-page-content" role="main" className="page-content">
                  <div className="row">
                    <div className="col-xl-12">
                      <div id="panel-1" className="panel">
                        <div className="panel-container show">
                          <div className="panel-content">
                            <Suspense fallback={<div>Loading...</div>}>
                              {resumoVisivel && !componentToShow && (
                           
                               <ActionPesquisaRecebimentoMalote />         
                              )} 
                              {componentToShow && component}
                            </Suspense>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>

                <Fragment>
                  <MenuButton />
                  <FooterMain />
                </Fragment>
              </div>
            </div>
          </div>
        </SidebarProvider>
      )}
    </Fragment>
  )
}
