import React, { Fragment, useEffect, useState, Suspense, lazy, } from "react"
import { useNavigate } from "react-router-dom"
import { MenuButton } from "../componets/Buttons/menuButton";
import { FooterMain } from "../componets/Footer";
import { HeaderMain } from "../componets/Header";
import { MenuSidebarAdmin } from "../componets/Sidebar/sidebar";
import { SidebarProvider } from "../componets/Sidebar/SidebarContext";
import { get } from "../api/funcRequest";
import { useQuery } from "react-query";



const ResumoDashBoardAdministrativo = lazy(() => import('../componets/Administrativo/ResumoAdministrativo/ResumoDashBoardAdministrativo').then(module => ({ default: module.ResumoDashBoardAdministrativo })));
const ActionPesquisaExtratoContaCorenteLoja = lazy(() => import("../componets/Administrativo/Components/ActionExtratoDeContaCorrente/actionPesquisaExtratoContaCorrenteLoja").then(module => ({ default: module.ActionPesquisaExtratoContaCorenteLoja })));
const ActionPesquisaRecebimentosLoja = lazy(() => import("../componets/Administrativo/Components/ActionListaRecebimentosLoja/actionPesquisaRecebimentosLoja").then(module => ({ default: module.ActionPesquisaRecebimentosLoja })));
const ActionPesquisaVendasMarca = lazy(() => import("../componets/Administrativo/Components/ActionListaVendasMarca/actionPesquisaVendasMarca").then(module => ({ default: module.ActionPesquisaVendasMarca })));
const ActionPesquisaVendasDigitalMarca = lazy(() => import("../componets/Administrativo/Components/ActionVendasDigitalMarca/actionPesquisaVendasDigitalMarca").then(module => ({ default: module.ActionPesquisaVendasDigitalMarca })));
const ActionPesquisaVendasVendedor = lazy(() => import("../componets/Administrativo/Components/ActionVendasVendedor/actionPesquisaVendasVendedor").then(module => ({ default: module.ActionPesquisaVendasVendedor })));
const ActionPesquisaVendasConvenio = lazy(() => import("../componets/Administrativo/Components/ActionListaVendasConvenio/actionPesquisaVendasConvenio").then(module => ({ default: module.ActionPesquisaVendasConvenio })));
const ActionPesquisaVendasCanceladas = lazy(() => import("../componets/Administrativo/Components/ActionVendasCanceladas/actionPesquisaVendasCanceladas").then(module => ({ default: module.ActionPesquisaVendasCanceladas })));
const ActionPesquisaVendasContigencia = lazy(() => import("../componets/Administrativo/Components/ActionVendasContigencia/actionPesquisaVendasContigencia").then(module => ({ default: module.ActionPesquisaVendasContigencia })));
const ActionPesquisaVendasDescontoFuncionario = lazy(() => import("../componets/Administrativo/Components/ActionDescontoFuncionario/actionPesquisaVendasDescontoFuncionario").then(module => ({ default: module.ActionPesquisaVendasDescontoFuncionario })));

// criar schema no backend cancelar quebra de caixa
const ActionPesquisaQuebraCaixaLoja = lazy(() => import("../componets/Administrativo/Components/ActionQuebraCaixaLoja/actionPesquisaQuebraCaixaLoja").then(module => ({ default: module.ActionPesquisaQuebraCaixaLoja })));
const ActionPesquisaEstoqueLoja = lazy(() => import("../componets/Administrativo/Components/ActionEstoqueLoja/actionPesquisaEstoqueLoja").then(module => ({ default: module.ActionPesquisaEstoqueLoja })));
const ActionPesquisaPrimeiroBalanco = lazy(() => import("../componets/Administrativo/Components/ActionListaPrimeiroBalanco/actionPesquisaPrimeiroBalanco").then(module => ({ default: module.ActionPesquisaPrimeiroBalanco })));
const ActionPesquisaBalancoPorLoja = lazy(() => import("../componets/Administrativo/Components/ActionListaBalancoPorLoja/actionPesquisaBalancoPorLoja").then(module => ({ default: module.ActionPesquisaBalancoPorLoja })));
const ActionPesquisaBalancoAvulso = lazy(() => import("../componets/Administrativo/Components/ActionListaBalancoAvulso/actionPesquisaBalancoAvulso").then(module => ({ default: module.ActionPesquisaBalancoAvulso })));
const ActionPesquisaAlteracaoPreco = lazy(() => import("../componets/Administrativo/Components/ActionAlteracaoPreco/actionPesquisaAlteracaoPreco").then(module => ({ default: module.ActionPesquisaAlteracaoPreco })));
const ActionPesquisaProdutosPreco = lazy(() => import("../componets/Administrativo/Components/ActionProdutoPreco/actionPesquisaProdutosPreco").then(module => ({ default: module.ActionPesquisaProdutosPreco })));
const ActionPesquisaAlterarVendaVendedor = lazy(() => import("../componets/Administrativo/Components/ActionAlterarVendaVendedor/actionPesquisaAlterarVendaVendedor").then(module => ({ default: module.ActionPesquisaAlterarVendaVendedor })));
const ActionPesquisaVendas = lazy(() => import("../componets/Administrativo/Components/ActionVendas/actionPesquisaVendas").then(module => ({ default: module.ActionPesquisaVendas })));
const ActionPesquisaVendasVouchers = lazy(() => import("../componets/Administrativo/Components/ActionVendasVouchers/actionPesquisaVendasVouchers").then(module => ({ default: module.ActionPesquisaVendasVouchers })));
const ActionPesquisaConsultaVouchers = lazy(() => import("../componets/Administrativo/Components/ActionConsultaVoucher/actionPesquisaConsultaVouchers").then(module => ({ default: module.ActionPesquisaConsultaVouchers })));
const ActionPesquisaVoucherResumido = lazy(() => import("../componets/Administrativo/Components/ActionVoucherResumido/actionPesquisaVoucherResumido").then(module => ({ default: module.ActionPesquisaVoucherResumido })));


export const DashBoardAdministrativo = () => {
  const [resumoVisivel, setResumoVisivel] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
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
    case "/administrativo/ResumoDashBoardAdministrativo":
      component = <ResumoDashBoardAdministrativo usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/administrativo/ActionPesquisaExtratoContaCorenteLoja":
      component = <ActionPesquisaExtratoContaCorenteLoja />;
      break;
    case "/administrativo/ActionPesquisaRecebimentosLoja":
      component = <ActionPesquisaRecebimentosLoja />;
      break;
    case "/administrativo/ActionPesquisaVendasMarca":
      component = <ActionPesquisaVendasMarca />;
      break;
    case "/administrativo/ActionPesquisaVendasDigitalMarca":
      component = <ActionPesquisaVendasDigitalMarca />;
      break;
    case "/administrativo/ActionPesquisaVendasVendedor":
      component = <ActionPesquisaVendasVendedor />;
      break;
    case "/administrativo/ActionPesquisaVendasConvenio":
      component = <ActionPesquisaVendasConvenio />;
      break;
    case "/administrativo/ActionPesquisaBalancoPorLoja":
      component = <ActionPesquisaBalancoPorLoja usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/administrativo/ActionPesquisaBalancoAvulso":
      component = <ActionPesquisaBalancoAvulso usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/administrativo/ActionPesquisaProdutosPreco":
      component = <ActionPesquisaProdutosPreco />;
      break;
    case "/administrativo/ActionPesquisaAlterarVendaVendedor":
      component = <ActionPesquisaAlterarVendaVendedor usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/administrativo/ActionPesquisaQuebraCaixaLoja":
      component = <ActionPesquisaQuebraCaixaLoja usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/administrativo/ActionPesquisaVendas":
      component = <ActionPesquisaVendas />;
      break;
    case "/administrativo/ActionPesquisaConsultaVouchers":
      component = <ActionPesquisaConsultaVouchers usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
    case "/administrativo/ActionPesquisaVoucherResumido":
      component = <ActionPesquisaVoucherResumido />;
      break;
    case "/administrativo/ActionPesquisaEstoqueLoja":
      component = <ActionPesquisaEstoqueLoja />;
      break;
    case "/administrativo/ActionPesquisaVendasCanceladas":
      component = <ActionPesquisaVendasCanceladas usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
    case "/administrativo/ActionPesquisaVendasContigencia":
      component = <ActionPesquisaVendasContigencia usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/administrativo/ActionPesquisaVendasDescontoFuncionario":
      component = <ActionPesquisaVendasDescontoFuncionario usuarioLogado={usuarioLogado} ID={ID} />
      break;
    case "/administrativo/ActionPesquisaPrimeiroBalanco":
      component = <ActionPesquisaPrimeiroBalanco usuarioLogado={usuarioLogado} ID={ID} />
      break;
    case "/administrativo/ActionPesquisaAlteracaoPreco":
      component = <ActionPesquisaAlteracaoPreco usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
    case "/administrativo/ActionPesquisaVendasVouchers":
      component = <ActionPesquisaVendasVouchers />;
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
                <HeaderMain optionsModulos={optionsModulos} />

                <main id="js-page-content" role="main" className="page-content">
                  <div className="row">
                    <div className="col-xl-12">
                      <div id="panel-1" className="panel">
                        <div className="panel-container show">
                          <div className="panel-content">
                            <Suspense fallback={<div>Loading...</div>}>
                               {resumoVisivel && !componentToShow && (
                                <ResumoDashBoardAdministrativo usuarioLogado={usuarioLogado} ID={ID}/>
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