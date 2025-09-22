import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../utils/dataAtual";
import { MdAdd } from "react-icons/md";
import { ActionListaOrdemTransferencia } from "./actionListaOrdemTransferencia";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaOT = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [empresaSelecionadaOrigem, setEmpresaSelecionadaOrigem] = useState('')
  const [empresaSelecionadaDestino, setEmpresaSelecionadaDestino] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const navigate = useNavigate();

  useEffect(() => {
    const dataInicio = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)
    
  
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

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasControleTransferencia`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );



  const fetchListaOT = async () => {
    try {
      
      const urlApi = `/resumo-ordem-transferencia?idEmpresaDestino=${empresaSelecionadaDestino}&idEmpresaOrigem=${usuarioLogado.IDEMPRESA}&idTipoFiltro=2&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  const { data: dadosConferencia = [], error: erroQuality, isLoading: isLoadingQuality, refetch: refetchListaOT } = useQuery(
    'resumo-ordem-transferencia',
    () => fetchListaOT(usuarioLogado.IDEMPRESA, empresaSelecionadaDestino, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: Boolean(usuarioLogado?.IDEMPRESA), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


  // const getListaConferencia = async () => {
  //   if(usuarioLogado && usuarioLogado.IDEMPRESA) {
  //     try {
        
  //       const response = await get(`/resumoOrdemTransferenciaGerencia?idEmpresaDestino=${empresaSelecionadaDestino}&idEmpresaOrigem=${usuarioLogado.IDEMPRESA}&idTipoFiltro=&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`)
  //       if (response.data) {
  //         setDadosConferencia(response.data)
  //         console.log(response.data, 'dados da tabela')
  //       }
  //     } catch (error) {
  //       console.log(error, "não foi possivel pegar os dados da tabela ")
  //     }
  //   }
  // }
  // const getListaConferenciaSelecionada = async () => {
  //   if(usuarioLogado && usuarioLogado.IDEMPRESA) {
  //     try {
  //       const response = await get(`/resumoOrdemTransferenciaGerencia?idTipoFiltro=2&idEmpresaLogin=${usuarioLogado.IDEMPRESA}&idLojaDestino=${empresaSelecionadaDestino}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`)
  //       if (response.data) {
  //         setDadosConferencia(response.data)
  //         console.log(response.data, 'dados da tabela')
  //       }
  //     } catch (error) {
  //       console.log(error, "não foi possivel pegar os dados da tabela ")
  //     }
  //   }
  // }


  const handleSelectEmpresaOrigem = (e) => {
    setEmpresaSelecionadaOrigem(e.value);
  }

  const handleSelectEmpresaDestino = (e) => {
    setEmpresaSelecionadaDestino(e.value);
  }

  const handleClick = () => {
  
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaOT()
      setTabelaVisivel(true);

    
  }

  return (
    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Ordem de Transferência"]}
        title="Controle de Transferência"
        subTitle={usuarioLogado?.NOFANTASIA}
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Loja Destino"}
        optionsGrupos={[
          { value: '0', label: 'Selecione a Loja Destino'},
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
        }))]}

        valueSelectGrupo={empresaSelecionadaDestino}
        onChangeSelectGrupo={handleSelectEmpresaDestino}

        InputSelectEmpresaComponent={InputField}
        labelSelectEmpresa={"Loja Origem"}
        valueSelectEmpresa={usuarioLogado?.NOFANTASIA}
        onChangeSelectEmpresa={handleSelectEmpresaOrigem}

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleClick}
        linkNomeSearch={"Pesquisar"}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={"Nova OT"}
        linkNome={"Nova OT"}
        onButtonClickCadastro={""}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaOrdemTransferencia dadosConferencia={dadosConferencia} usuarioLogado={usuarioLogado} empresaSelecionadaOrigem={empresaSelecionadaOrigem}/>

    </Fragment>
  )
}