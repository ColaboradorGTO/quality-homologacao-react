import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { getDataAtual } from "../../../../utils/dataAtual"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaAdiantamentoSalarioLoja } from "./actionListaAdiantamentoSalarioLoja"
import { useQuery } from 'react-query';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData, useFetchEmpresas } from "../../../../hooks/useFetchData"

export const ActionPesquisaAdiantamentoSalarioLoja = ({usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('0');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ufSelecionado, setUfSelecionado] = useState('0')
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [isQueryData, setIsQueryData] = useState(false);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');
  const { data: optionsEmpresas = [],} = useFetchEmpresas(marcaSelecionada);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );
  

  const fetchListaVendasPCJ = async () => {
    const urlBase = `/adiantamento-loja?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${marcaSelecionada}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
      animacaoCarregamento('Carregando dados...', true);
        
      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosAdiantamentoFuncionarios = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch } = useQuery(
    ['adiantamento-loja'],
    () => fetchListaVendasPCJ(),
    { enabled: false, staleTime: 60 * 60 * 1000,}
  )

  const handleChangeEmpresa = (e) => {
    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }

  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value)  
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    setIsQueryData(true);
    refetch()
    setTabelaVisivel(true)
    setIsLoadingPesquisa(true);
  }



  const optionsUF = [
    {
      value: "0",
      label: 'Todos'
    },
    {
      value: "DF",
      label: 'DF'
    },
    {
      value: "GO",
      label: 'GO'
    },
  ]

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Adiantamento Salarial"]}
        title="Adiantamento Salarial das Lojas"
        subTitle={empresaSelecionadaNome}
        
        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        
        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={handleChangeEmpresa}
        valueSelectEmpresa={empresaSelecionada}
        optionsEmpresas={[
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}
        

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          { value: 0, label: 'Selecione uma loja' },
          ...optionsMarcas.map((marca) => ({
            value: marca.IDGRUPOEMPRESARIAL,
            label: marca.DSGRUPOEMPRESARIAL
          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}

        InputSelectUFComponent={InputSelectAction}
        labelSelectUF={"UF"}
        optionsSelectUF={optionsUF.map((item) => ({
          value: item.value,
          label: item.label,
        }))}   
        valueSelectUF={ufSelecionado}
        onChangeSelectUF={(e) => setUfSelecionado(e.value)}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      {tabelaVisivel && (
        <ActionListaAdiantamentoSalarioLoja 
          dadosAdiantamentoFuncionarios={dadosAdiantamentoFuncionarios} 
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          handleClick={handleClick}
        />
      )}

    </Fragment>
  )
}