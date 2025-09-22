import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { getDataAtual } from "../../../../utils/dataAtual"
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaExtratoLoja } from "./actionListaExtratoLoja"
import { get } from "../../../../api/funcRequest"
import { useQuery } from 'react-query';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData } from "../../../../hooks/useFetchData"
import Swal from "sweetalert2"
import { ActionListaExtratoContaCorrenteLoja } from "./actionListaExtratoLojaCopia"

export const ActionPesquisaExtratoLoja = ({usuarioLogado, ID}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [dadosExtratoQuebra, setDadosExtratoQuebra] = useState([])
  const [dadosTotalDepositos, setDadosTotalDepositos] = useState([])
  const [dadosTotalFaturas, setDadosTotalFaturas] = useState([])
  const [dadosTotalDespesas, setDadosTotalDespesas] = useState([])
  const [dadosTotalAdiantamentos, setDadosTotalAdiantamentos] = useState([])
  const [dadosAjusteExtrato, setDadosAjusteExtrato] = useState([])
  const [dadosExtratoLoja, setDadosExtratoLoja] = useState([])
  const [dadosVendas, setDadosVendas] = useState([])
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(500); 
  
  
  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);

  }, [])

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useFetchData('listaEmpresasIformatica', '/listaEmpresasIformatica');
  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const fetchExtratoLoja = async () => {
    try {
      const urlApi = `/lista-extrato?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
      animacaoCarregamento(`Carregando... Página ${currentPage}`, true);
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
        let allData = [...response.data];
  
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
        setDadosExtratoLoja(response.data)
        setDadosVendas(response.data)
        setDadosExtratoQuebra(response.data[0].quebracaixa)
        setDadosTotalDepositos(response.data[0].totalDepositos)
        setDadosTotalFaturas(response.data[0].totalFaturas)
        setDadosTotalDespesas(response.data[0].despesas)
        setDadosTotalAdiantamentos(response.data[0].adiantamentos)
        setDadosAjusteExtrato(response.data[0].ajusteextrato)
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosExtratoLojaPeriodo = [], error: errorExtratoLoja, isLoading: isLoadingExtratoLoja, refetch: refetchExtratoLoja } = useQuery(
    ['lista-extrato', empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchExtratoLoja(empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  const handleSelectEmpresa = (e) => {
    setEmpresaSelecionada(e.value);
  };

  const handleClick = () => {
    if(empresaSelecionada == '') {
      Swal.fire({
        title: "Atenção",
        text: "Selecione uma empresa para continuar.",
        icon: "warning",
        confirmButtonText: "OK"
      })
    } else  {
      setTabelaVisivel(true)
      setIsLoadingPesquisa(true);
      setCurrentPage(+1);
      refetchExtratoLoja()

    }
  }

  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Extrato de Contas Correntes das Lojas"]}
        title="Extrato de Contas Correntes das Lojas"
        subTitle="Nome da Loja"
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
   
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,

          }))
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      {tabelaVisivel && (
        <Fragment>
          <div className="card">
          <ActionListaExtratoContaCorrenteLoja
            dadosExtratoLojaPeriodo={dadosExtratoLojaPeriodo}
            dadosVendas={dadosVendas}
            dadosExtratoQuebra={dadosExtratoQuebra}
            dadosTotalDepositos={dadosTotalDepositos}
            dadosTotalFaturas={dadosTotalFaturas}
            dadosTotalDespesas={dadosTotalDespesas}
            dadosTotalAdiantamentos={dadosTotalAdiantamentos}
            dadosAjusteExtrato={dadosAjusteExtrato}
            dadosExtratoLoja={dadosExtratoLoja}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            empresaSelecionada={empresaSelecionada}
            handleClick={handleClick}
          />
          </div>

        </Fragment>
      )}
    </Fragment>
  )
}