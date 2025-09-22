import React, { Fragment, useEffect, useState, Suspense, lazy, } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider } from "../componets/Sidebar/SidebarContext";
import { MenuSidebarAdmin } from "../componets/Sidebar/sidebar";
import { HeaderMain } from "../componets/Header";
import { MenuButton } from "../componets/Buttons/menuButton";
import { FooterMain } from "../componets/Footer";
import { useQuery } from "react-query";
import { get } from "../api/funcRequest";
const ResumoDashBoardComercial = lazy(() => import("../componets/Comercial/Components/ResumoComercial/ResumoDashBoardComercial").then(module => ({ default: module.ResumoDashBoardComercial })));
const ActionPesquisaMetas = lazy(() => import("../componets/Comercial/Components/ActionMetas/actionPesquisaMetas").then(module => ({ default: module.ActionPesquisaMetas })));
const ActionPesquisaPremiacoes = lazy(() => import("../componets/Comercial/Components/ActionPremiacoes/ActionPesquisaPremiacao").then(module => ({ default: module.ActionPesquisaPremiacoes })));
const ActionPesquisaVendasPeriodo = lazy(() => import("../componets/Comercial/Components/ActionVendasPeriodo/actionPesquisaVendasPeriodo").then(module => ({ default: module.ActionPesquisaVendasPeriodo })));
const ActionPesquisaVendasMarca = lazy(() => import("../componets/Comercial/Components/ActionVendasMarca/actionPesquisaVendasMarca").then(module => ({ default: module.ActionPesquisaVendasMarca })));
const ActionPesquisaVendasDigitalMarca = lazy(() => import("../componets/Comercial/Components/ActionVendasDigitalMarca/actionPesquisaVendasDigitalMarca").then(module => ({ default: module.ActionPesquisaVendasDigitalMarca })));
const ActionPesquisaRotatividade = lazy(() => import("../componets/Comercial/Components/ActionRotatividade/actionPesquisaRotatividade").then(module => ({ default: module.ActionPesquisaRotatividade })));
const ActionPesquisaVendasEstoque = lazy(() => import("../componets/Comercial/Components/ActionVendasEstoque/actionPesquisaVendasEstoque").then(module => ({ default: module.ActionPesquisaVendasEstoque })));
const ActionPesquisaProductoPreco = lazy(() => import("../componets/Comercial/Components/ActionProdutoPreco/actionPesquisaProdutosPreco").then(module => ({ default: module.ActionPesquisaProductoPreco })));
const ActionPesquisaFuncionario = lazy(() => import("../componets/Comercial/Components/ActionFuncionarios/actionPesquisaFuncionarios").then(module => ({ default: module.ActionPesquisaFuncionario })));
const ActionPesquisaVendasRelatorio = lazy(() => import("../componets/Comercial/Components/ActionVendasRelatorio/actionPesquisaVendasRelatorio").then(module => ({ default: module.ActionPesquisaVendasRelatorio })));
const ActionPesquisaEstoqueProdutos = lazy(() => import("../componets/Comercial/Components/ActionEstoqueProdutos/actionPesquisaEstoqueProdutos").then(module => ({ default: module.ActionPesquisaEstoqueProdutos })));
const ActionPesquisaEstoqueVendaGrupoSubGrupo = lazy(() => import("../componets/Comercial/Components/ActionVendaEstoqueGrupoSubGrupo/actionPesquisaEstoqueGrupoSubGrupo").then(module => ({ default: module.ActionPesquisaEstoqueVendaGrupoSubGrupo })));
const ActionPesquisaPrecoProdutoGrupoSubGrupo = lazy(() => import("../componets/Comercial/Components/ActionEstoquePrecoProdutoGrupoSubGrupo/actionPesquisaPrecoProdutoGrupoSubGrupo").then(module => ({ default: module.ActionPesquisaPrecoProdutoGrupoSubGrupo })));

export const DashBoardComercial = () => {
  const [resumoVisivel, setResumoVisivel] = useState(true);
  const [actionVisivel, setActionVisivel] = useState(true);
  const [clickContador, setClickContador] = useState(0);
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [componentToShow, setComponentToShow] = useState("");
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  const navigate = useNavigate();

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

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
      'menus-usuario',
      async () => {
        const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}&idModulo=${selectedModule?.ID}`);
        
        return response.data;
      },
      { enabled: Boolean(usuarioLogado?.id), staleTime: 5 * 60 * 1000, }
    );

  function handleShowComponent(componentName) {
    setComponentToShow(componentName);
  }

  let component = null;

  switch (componentToShow) {
    case "/comercial/ResumoDashBoardComercial":
      component = <ResumoDashBoardComercial />;
      break;
    case "/comercial/ActionPesquisaVendasPeriodo":
      component = <ActionPesquisaVendasPeriodo />;
      break;
    case "/comercial/ActionPesquisaVendasMarca":
      component = <ActionPesquisaVendasMarca />
      break;
    case "/comercial/ActionPesquisaVendasDigitalMarca":
      component = <ActionPesquisaVendasDigitalMarca />
      break;
    case "/comercial/ActionPesquisaRotatividade":
      component = <ActionPesquisaRotatividade />
      break;
    case "/comercial/ActionPesquisaVendasEstoque":
      component = <ActionPesquisaVendasEstoque />
      break;
    case "/comercial/ActionPesquisaProductoPreco":
      component = <ActionPesquisaProductoPreco />
      break;
    case "/comercial/ActionPesquisaFuncionario":
      component = <ActionPesquisaFuncionario />
      break;
    case "/comercial/ActionPesquisaVendasRelatorio":
      // component = <ActionPesquisaVendasRelatorioGeral />
      component = <ActionPesquisaVendasRelatorio />
      break;
    case "/comercial/ActionPesquisaEstoqueProdutos":
      component = <ActionPesquisaEstoqueProdutos />
      break;
    case "/comercial/ActionPesquisaEstoqueVendaGrupoSubGrupo":
      component = <ActionPesquisaEstoqueVendaGrupoSubGrupo />
      break;
    case "/comercial/ActionPesquisaPrecoProdutoGrupoSubGrupo":
      component = <ActionPesquisaPrecoProdutoGrupoSubGrupo />
      break;
    case "/comercial/ActionPesquisaMetas":
      component = <ActionPesquisaMetas />
      break;
    case "/comercial/ActionPesquisaPremiacoes":
      component = <ActionPesquisaPremiacoes />
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
                                <ResumoDashBoardComercial />
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
