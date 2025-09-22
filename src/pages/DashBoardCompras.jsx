import React, { Fragment, useEffect, useState, Suspense, lazy, } from "react"
import { useNavigate } from "react-router-dom"
import { FooterMain } from "../componets/Footer";
import { MenuButton } from "../componets/Buttons/menuButton";
import { HeaderMain } from "../componets/Header";
import { MenuSidebarAdmin } from "../componets/Sidebar/sidebar";
import { SidebarProvider } from "../componets/Sidebar/SidebarContext";
import { get } from "../api/funcRequest";
import { useQuery } from "react-query";
const ActionPesquisaHome = lazy(() => import("../componets/Compras/Components/ActionHome/actionPesquisaHome").then(module => ({ default: module.ActionPesquisaHome })));
// const ComprasActionListaDistribuicaoMercadoria = lazy(() => import("../componets/Compras/comprasActionListaDistribuicaoMercadoria").then(module => ({ default: module.ComprasActionListaDistribuicaoMercadoria })));
const ActionPDFPedidoResumido = lazy(() => import("../componets/Compras/Components/ActionHome/comprasActionPDFPedidoResumido").then(module => ({ default: module.ActionPDFPedidoResumido })));
const ActionPDFPedidoDetalhado = lazy(() => import("../componets/Compras/Components/ActionHome/comprasActionPDFPedidoDetalhado").then(module => ({ default: module.ActionPDFPedidoDetalhado })));
const ActionPesquisaProduto = lazy(() => import("../componets/Compras/Components/ActionImagemProduto/ActionPesquisaProduto").then(module => ({ default: module.ActionPesquisaProduto })));
// const ActionPesquisaNovoPedido = lazy(() => import("../componets/Compras/Components/ActionNovoPedido/actionPesquisaNovoPedido").then(module => ({ default: module.ActionPesquisaNovoPedido })));
const ActionPesquisaFornecedor = lazy(() => import("../componets/Compras/Components/ActionFonecedores/actionPesquisaFornecedor").then(module => ({ default: module.ActionPesquisaFornecedor })));
const ActionPesquisaFabricante = lazy(() => import("../componets/Compras/Components/ActionFabricantes/actionPesquisaFabricante").then(module => ({ default: module.ActionPesquisaFabricante })));
const ActionPesquisaTransportador = lazy(() => import("../componets/Compras/Components/ActionTransportador/actionPesquisaTransportador").then(module => ({ default: module.ActionPesquisaTransportador })));
const ActionPesquisaCondicaoPagamento = lazy(() => import("../componets/Compras/Components/ActionCondicaoPagamentos/actionPesquisaCondicaoPagamento").then(module => ({ default: module.ActionPesquisaCondicaoPagamento })));
const ActionPesquisaCategoriaPedido = lazy(() => import("../componets/Compras/Components/ActionCategoriaPedido/actionPesquisaCategoriaPedido").then(module => ({ default: module.ActionPesquisaCategoriaPedido })));
const ActionPesquisaGrupoEstrutura = lazy(() => import("../componets/Compras/Components/ActionGrupoEstrutura/actionPesquisaGrupoEstrutura").then(module => ({ default: module.ActionPesquisaGrupoEstrutura })));
const ActionPesquisaSubGrupoEstrutura = lazy(() => import("../componets/Compras/Components/ActionSubGrupoEstrutura/actionPesquisaSubGrupoEstrutura").then(module => ({ default: module.ActionPesquisaSubGrupoEstrutura })));
const ActionPesquisaUnidadeMedida = lazy(() => import("../componets/Compras/Components/ActionUnidadeMedida/actionPesquisaUnidadeMedida").then(module => ({ default: module.ActionPesquisaUnidadeMedida })));
const ActionPesquisaCores = lazy(() => import("../componets/Compras/Components/ActionCores/actionPesquisaCores").then(module => ({ default: module.ActionPesquisaCores })));
const ActionPesquisaEstilos = lazy(() => import("../componets/Compras/Components/ActionEstilos/actionPesquisaEstilos").then(module => ({ default: module.ActionPesquisaEstilos })));
const ActionPesquisaTiposTecidos = lazy(() => import("../componets/Compras/Components/ActionTipoTecidos/actionPesquisaTipoTecidos").then(module => ({ default: module.ActionPesquisaTiposTecidos })));

export const DashBoardCompras = () => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [homeVisivel, setHomeVisivel ] = useState(true);
  const [componentToShow, setComponentToShow] = useState("");
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);

      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {

      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {

  }, [usuarioLogado]);

  function handleShowComponent(componentName) {
    setComponentToShow(componentName);
  }

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario',
    async () => {
      const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}&idModulo=${selectedModule?.ID}`);
      
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 5 * 60 * 1000, }
  );

  let component = null;

  switch (componentToShow) {
    case "/compras/ActionPesquisaHome":
      component = <ActionPesquisaHome />
      break;
    // case "/compras/ActionPesquisaNovoPedido":
    //   component = <ActionPesquisaNovoPedido />;
    //   break;
    case "/compras/ActionPesquisaProduto":
      component = <ActionPesquisaProduto />;
      break;
    // case "/compras/ComprasActionListaDistribuicaoMercadoria":
    //   component = <ComprasActionListaDistribuicaoMercadoria />;
    //   break;
    case "/compras/ActionPesquisaFornecedor":
      component = <ActionPesquisaFornecedor />;
      break;
    case "/compras/ActionPesquisaFabricante":
      component = <ActionPesquisaFabricante />;
      break;

    case "/compras/ActionPesquisaTransportador":
      component = <ActionPesquisaTransportador />;
      break;
    case "/compras/ActionPesquisaCondicaoPagamento":
      component = <ActionPesquisaCondicaoPagamento />;
      break;
    case "/compras/ActionPesquisaCategoriaPedido":
      component = <ActionPesquisaCategoriaPedido />;
      break;
    case "/compras/ActionPesquisaGrupoEstrutura":
      component = <ActionPesquisaGrupoEstrutura />;
      break;
    case "/compras/ActionPesquisaSubGrupoEstrutura":
      component = <ActionPesquisaSubGrupoEstrutura />;
      break;
    case "/compras/ActionPesquisaUnidadeMedida":
      component = <ActionPesquisaUnidadeMedida />;
      break;
    case "/compras/ActionPesquisaCores":
      component = <ActionPesquisaCores />;
      break;
    case "/compras/ActionPesquisaEstilos":
      component = <ActionPesquisaEstilos />;
      break;
    case "/compras/ActionPesquisaTiposTecidos":
      component = <ActionPesquisaTiposTecidos />;
      break;
    case "/compras/ActionPDFPedidoResumido":
      component = <ActionPDFPedidoResumido />
      break;
    case "/compras/ActionPDFPedidoDetalhado":
      component = <ActionPDFPedidoDetalhado />
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
                              {homeVisivel && !componentToShow && (

                                <ActionPesquisaHome />
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
