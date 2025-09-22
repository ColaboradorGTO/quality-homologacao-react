import React, { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionMain } from "../../../Actions/actionMain";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { ActionListaLinkRelatorioBi } from "./actionListaLinkRelatorioBI";
import { ActionCadastrarRelatorioBIModal } from "./actionCadastrarRelatorioBIModal";
import { ActionImportarRelatorioBIModal } from "./actionImportarRelatorioBIModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";


export const ActionPesquisaLinkRelatorioBi = ({usuarioLogado, ID}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalImportarRelatorio, setModalImportarRelatorio] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);


  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );
  

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresa } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );


  const fetchListaRelatorio = async () => {
    try {
      
      const urlApi = `/linkRelatorioBI?idRelatorio=${relatorioSelecionado}&idEmpresa=${empresaSelecionada}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }
  
        await fetchNextPage(currentPage);
        return allData;
      } else {
       
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosBI = [], error: erroCliente, isLoading: isLoadingCliente, refetch: refetchListaRelatorio } = useQuery(
    'lista-cliente',
    () => fetchListaRelatorio(relatorioSelecionado, empresaSelecionada, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );


  
  const { data: dadosRelatorios = [], error: errorrRelatorio, isLoading: isLoadingRelatorio, refetch } = useQuery(
    'relatorioInformaticaBI',
    async () => {
      const response = await get(`/relatorioInformaticaBI`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );



  const handlChangeEmpresa = (e) => {
    const selectedEmpresa = dadosEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }


  const handleChangeRelatorio = (e) => {
    setRelatorioSelecionado(e.value);
  }

  const handleCadastrarRelatorio = () => {
    if (optionsModulos[0]?.CRIAR === 'True') {
      setModalCadastro(true)
    } else {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar Relatório BI.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }  
}

  const handleImportarRelatorio = () => {
    setModalImportarRelatorio(true)
  }

  const handleTabelaVisivel = () => {
    setCurrentPage(+1)
    refetchListaRelatorio(empresaSelecionada)
    setTabelaVisivel(true)
 
  }


  return (

    <Fragment>


      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatório BI"]}
        title="Listagem dos Relatórios do BI"
        subTitle={empresaSelecionadaNome}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Filial"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma Empresa' },
          ...dadosEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          })
        )]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handlChangeEmpresa}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Relatório"}
        optionsGrupos={[
          { value: '', label: 'Selecione um Relatório' },
          ...dadosRelatorios.map((item) => ({
            value: item.IDRELATORIOBI,
            label: item.DSRELATORIOBI
          })
        )]}
        valueSelectGrupo={relatorioSelecionado}
        onChangeSelectGrupo={handleChangeRelatorio}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleTabelaVisivel}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Link Relatório "}
        onButtonClickCadastro={handleCadastrarRelatorio}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Importar Arquivo CSV"}
        onButtonClickCancelar={handleImportarRelatorio}
        corCancelar={"danger"}
        IconCancelar={GoUpload}

      />

      <ActionListaLinkRelatorioBi dadosBI={dadosBI} />
     
      <ActionCadastrarRelatorioBIModal 
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
      />

      <ActionImportarRelatorioBIModal
        show={modalImportarRelatorio}
        handleClose={() => setModalImportarRelatorio(false)}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}
