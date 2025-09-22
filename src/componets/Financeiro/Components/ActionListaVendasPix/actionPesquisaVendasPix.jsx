import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { MultSelectAction } from "../../../Select/MultSelectAction"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaVendasPIX } from "./actionListaVendasPix"
import { ActionListaFaturasPix } from "./actionListaFaturasPix"
import { ActionListaVendasPixConsolidado } from "./actionListaVendasPixConsolidado"
import { ActionListaFaturasPixConsolidado } from "./actionListaFaturasPixConsolidado"
import { ActionListaVendasPixConsolidadoEmpresa } from "./actionListaVendasPixConsolidadoEmpresa"
import { ActionListaVendasPixConsolidadoLoja,  } from "./actionListaVendasPixConsolidadoLoja"
import { getDataAtual } from "../../../../utils/dataAtual"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData, useFetchEmpresas } from "../../../../hooks/useFetchData"


export const ActionPesquisaVendasPix = () => {
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState([]); 
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState(''); 
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaLivre, setEmpresaLivre] = useState('');
  const [tabelaVendasPixVisivel, setTabelaVendasPixVisivel] = useState(false);
  const [tabelaFaturaPixConsolidadoVisivel, setTabelaFaturaPixConsolidadoVisivel] = useState(false);
  const [tabelaVendasPixConsolidadoVisivel, setTabelaVendasPixConsolidadoVisivel] = useState(false);
  const [tabelaVendasPixConsolidadoEmpresa, setTabelaVendasPixConsolidadoEmpresa] = useState(false);
  const [tabelaFaturaPixConsolidadoLoja, setTabelaFaturaPixConsolidadoLoja] = useState(false);
  const [tabelaVendasFaturaPixVisivel, setTabelaVendasFaturaPixVisivel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(true)


  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
   
  }, [])
  
  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');
  const { data: optionsEmpresas = [],} = useFetchEmpresas(marcaSelecionada);


  const fetchListaVendasPix = async ( ) => {
    const urlBase = `/venda-pix-periodo?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&listaEmpresas=${empresaLivre}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }
  
  
  const { data: dadosVendasPix = [], error: errorVendasPix, isLoading: isLoadingVendasPix, refetch: refetchVendasPix } = useQuery(
    ['venda-pix-periodo', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchListaVendasPix(marcaSelecionada, empresaSelecionada, empresaLivre),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );
  
  
  const fetchListaVendasPixConsolidado = async () => {
    const urlBase = `/venda-pix-consolidado-loja?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&listaEmpresas=${empresaLivre}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }

  const { data: dadosVendasPixConsolidado = [], error: errorVendasPixConsolidado, isLoading: isLoadingVendasPixConsolidado, refetch: refetchVendasPixConsolidado } = useQuery(
    ['venda-pix-consolidado-loja', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchListaVendasPixConsolidado(marcaSelecionada, empresaSelecionada, empresaLivre),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  const fetchVendasFaturaPix = async () => {
    const urlBase = `/fatura-pix-periodo?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&listaEmpresas=${empresaLivre}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }

  const {data: dadosVendasFaturasPix = [], error: errorVendasFaturaPix, isLoading: isLoadingVendasFaturaPix, refetch: refetchVendasFaturaPix} = useQuery(
    ['fatura-pix-periodo', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchVendasFaturaPix(marcaSelecionada, empresaSelecionada, empresaLivre),
    {enabled: false, staleTime: 5 * 60 * 1000}
  );


  const fetchVendasPixConsolidadoMarca = async () => {
    const urlBase = `/venda-pix-consolidado?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }
  const {data: dadosVendasPixConsolidadoMarca = [], error: errorVendasPixConsolidadoMarca, isLoading: isLoadingVendasPixConsolidadoMarca, refetch: refetchVendasPixConsolidadoMarca} = useQuery(
    ['venda-pix-consolidado', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchVendasPixConsolidadoMarca(marcaSelecionada, empresaSelecionada, empresaLivre),
    {enabled: false, staleTime: 5 * 60 * 1000}
  );
  
  const fetchVendasFaturasPixConsolidadoPeriodo = async () => {
    const urlBase = `fatura-pix-periodo-consolidado?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&listaEmpresas=${empresaLivre}`;
    let urlApi = urlApi.includes('?') ? urlBase : urlBase + '?';
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }
  const {data: dadosFaturasPixConsolidadoPeriodo = [], error: errorFaturasPixConsolidadoPeriodo, isLoading: isLoadingFaturasPixConsolidadoPeriodo, refetch: refetchVendasFaturasPixConsolidadoPeriodo} = useQuery(
    ['fatura-pix-periodo-consolidado', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchVendasFaturasPixConsolidadoPeriodo(marcaSelecionada, empresaSelecionada, empresaLivre),
    {enabled: false, staleTime: 5 * 60 * 1000}
  );

  const fetchFaturasPixConsolidadoLoja = async () => {
    const urlBase = `/faturaPixConsolidadoLoja?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&empresa=${empresaLivre}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  }
  const {data: dadosFaturasPixConsolidadoLoja = [], error: errorFaturasPixConsolidadoLoja, isLoading: isLoadingFaturasPixConsolidadoLoja, refetch: refetchFaturasPixConsolidadoLoja} = useQuery(
    ['faturaPixConsolidadoLoja', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchFaturasPixConsolidadoLoja(marcaSelecionada, empresaSelecionada, empresaLivre),
    {enabled: false, staleTime: 5 * 60 * 1000}
  );
  

  const handleSelectMarca = (e) => {
    const selectedId = e.value;
    setMarcaSelecionada(selectedId);
  };

  const handleChangeEmpresa = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setEmpresaSelecionada(selectedValues);
    
  }

  const handleClickVendasPix = () => {
   
    if (marcaSelecionada) {
      setTabelaVendasPixVisivel(true)
      setTabelaVendasFaturaPixVisivel(false)
      setTabelaVendasPixConsolidadoVisivel(false)
      setTabelaVendasPixConsolidadoEmpresa(false)
      setTabelaFaturaPixConsolidadoVisivel(false)
      setTabelaFaturaPixConsolidadoLoja(false)
      
      setIsLoadingPesquisa(true);
      setCurrentPage(prevPage => prevPage + 1); 
      refetchVendasPix()
    }  else {
      Swal.fire('Erro', 'Por favor, selecione uma Marca e datas válidas.', 'error');
    }
  }

  useEffect(() => {
    if (isLoadingPesquisa && isLoadingVendasPix) {
      Swal.fire({
        title: 'Carregando vendas...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (isLoadingPesquisa && !isLoadingVendasPix) {
      Swal.close();
      setIsLoadingPesquisa(false);
    }
  }, [isLoadingVendasPix, isLoadingPesquisa]);

  useEffect(() => {
    if (errorVendasPix) {
      Swal.fire('Erro', `Erro ao carregar vendas por PIX: ${errorVendasPix.message}`, 'error');
      setIsLoadingPesquisa(false);
    }
  }, [errorVendasPix]);


  const handleClickVendasPixConsolidadoMarca = () => { 
    setTabelaVendasPixConsolidadoVisivel(true)
    setTabelaVendasPixVisivel(false)
    setTabelaVendasFaturaPixVisivel(false)
    setTabelaFaturaPixConsolidadoVisivel(false)
    setTabelaVendasPixConsolidadoEmpresa(false)
    setTabelaFaturaPixConsolidadoLoja(false)

    setIsLoadingPesquisa(true);
    setCurrentPage(prevPage => prevPage + 1); 
    refetchVendasPixConsolidadoMarca()    
  }

  useEffect(() => {
    if (isLoadingPesquisa && isLoadingVendasPixConsolidadoMarca) {
      Swal.fire({
        title: 'Carregando vendas...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (isLoadingPesquisa && !isLoadingVendasPixConsolidadoMarca) {
      Swal.close();
      setIsLoadingPesquisa(false);
    }
  }, [isLoadingVendasPixConsolidadoMarca, isLoadingPesquisa]);

  useEffect(() => {
    if (errorVendasPixConsolidadoMarca) {
      Swal.fire('Erro', `Erro ao carregar Vendas PIX Consolidada Marca: ${errorVendasPixConsolidadoMarca.message}`, 'error');
      setIsLoadingPesquisa(false);
    }
  }, [errorVendasPixConsolidadoMarca]);


  const handleClickVendasPixConsolidadoEmpresa = () => {

    setTabelaVendasPixConsolidadoEmpresa(true)
    setTabelaVendasPixVisivel(false)
    setTabelaVendasFaturaPixVisivel(false)
    setTabelaVendasPixConsolidadoVisivel(false)
    setTabelaFaturaPixConsolidadoVisivel(false)
    setTabelaFaturaPixConsolidadoLoja(false)

    setIsLoadingPesquisa(true);
    setCurrentPage(prevPage => prevPage + 1); 
    refetchVendasPixConsolidado()
    
  }

  useEffect(() => {
    if (isLoadingPesquisa && isLoadingVendasPixConsolidado) {
      Swal.fire({
        title: 'Carregando Vendas PIX Consolidada Lojas',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (isLoadingPesquisa && !isLoadingVendasPixConsolidado) {
      Swal.close();
      setIsLoadingPesquisa(false);
    }
  }, [isLoadingVendasPixConsolidado, isLoadingPesquisa]);

  useEffect(() => {
    if (errorVendasPixConsolidado) {
      Swal.fire('Erro', `Erro ao Carregar Vendas PIX Consolidada Lojas: ${errorVendasPixConsolidado.message}`, 'error');
      setIsLoadingPesquisa(false);
    }
  }, [errorVendasPixConsolidado]);


  const handleClickVendasFaturaPix = () => {
    if(marcaSelecionada) {

      setTabelaVendasFaturaPixVisivel(true)
      setTabelaVendasPixVisivel(false)
      setTabelaVendasPixConsolidadoVisivel(false)
      setTabelaFaturaPixConsolidadoVisivel(false)
      setTabelaVendasPixConsolidadoEmpresa(false)
      setTabelaFaturaPixConsolidadoLoja(false)
    
      setIsLoadingPesquisa(true);
      setCurrentPage(prevPage => prevPage + 1);
      refetchVendasFaturaPix()  
    } else {
        Swal.fire('Erro', 'Por favor, selecione uma Marca e datas válidas.', 'error')
    }
  }

  useEffect(() => {
    if (isLoadingPesquisa && isLoadingVendasFaturaPix) {
      Swal.fire({
        title: 'Carregando Faturas PIX...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (isLoadingPesquisa && !isLoadingVendasFaturaPix) {
      Swal.close();
      setIsLoadingPesquisa(false);
    }
  }, [isLoadingVendasFaturaPix, isLoadingPesquisa]);

  useEffect(() => {
    if (errorVendasFaturaPix) {
      Swal.fire('Erro', `Erro ao carregar Faturas PIX: ${errorVendasFaturaPix.message}`, 'error');
      setIsLoadingPesquisa(false);
    }
  }, [errorVendasFaturaPix]);

  const handleClickVendasFaturaPixConsolidado = () => {
    if(marcaSelecionada) {
      setTabelaFaturaPixConsolidadoVisivel(true)
      setTabelaVendasPixVisivel(false)
      setTabelaVendasPixConsolidadoVisivel(false)
      setTabelaVendasPixConsolidadoEmpresa(false)
      setTabelaVendasFaturaPixVisivel(false)
      setTabelaFaturaPixConsolidadoLoja(false)
 
  
      setIsLoadingPesquisa(true);
      setCurrentPage(prevPage => prevPage + 1);
      refetchVendasFaturasPixConsolidadoPeriodo()

    } else {
      Swal.fire('Erro', 'Por favor, selecione uma Marca e datas válidas.', 'error')
    }
    
  }
  useEffect(() => {
    if (isLoadingPesquisa && isLoadingFaturasPixConsolidadoPeriodo) {
      Swal.fire({
        title: 'Carregando Faturas PIX Consolidada Marca',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (isLoadingPesquisa && !isLoadingFaturasPixConsolidadoPeriodo) {
      Swal.close();
      setIsLoadingPesquisa(false);
    }
  }, [isLoadingFaturasPixConsolidadoPeriodo, isLoadingPesquisa]);

  useEffect(() => {
    if (errorFaturasPixConsolidadoPeriodo) {
      Swal.fire('Erro', `Erro ao carregar Faturas PIX Consolidada Marca: ${errorFaturasPixConsolidadoPeriodo.message}`, 'error');
      setIsLoadingPesquisa(false);
    }
  }, [errorFaturasPixConsolidadoPeriodo]);


  const handleClickFaturaPixConsolidadoLoja = () => {
    if(marcaSelecionada) {
      setTabelaFaturaPixConsolidadoLoja(true)
      setTabelaFaturaPixConsolidadoVisivel(false)
      setTabelaVendasPixVisivel(false)
      setTabelaVendasPixConsolidadoVisivel(false)
      setTabelaVendasPixConsolidadoEmpresa(false)
      setTabelaVendasFaturaPixVisivel(false)
  

      setIsLoadingPesquisa(true);
      setCurrentPage(prevPage => prevPage + 1);
      refetchFaturasPixConsolidadoLoja()
      
    } else {
      Swal.fire('Erro', 'Por favor, selecione uma Marca e datas válidas.', 'error')
    }
  }

  useEffect(() => {
    if (isLoadingPesquisa && isLoadingFaturasPixConsolidadoLoja) {
      Swal.fire({
        title: 'Carregando Faturas PIX Consolidada Lojas',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (isLoadingPesquisa && !isLoadingFaturasPixConsolidadoLoja) {
      Swal.close();
      setIsLoadingPesquisa(false);
    }
  }, [isLoadingFaturasPixConsolidadoLoja, isLoadingPesquisa]);

  useEffect(() => {
    if (errorFaturasPixConsolidadoLoja) {
      Swal.fire('Erro', `Erro ao carregar Faturas PIX Consolidada Lojas: ${errorFaturasPixConsolidadoLoja.message}`, 'error');
      setIsLoadingPesquisa(false);
    }
  }, [errorFaturasPixConsolidadoLoja]);
  



  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas e Faturas PIX"]}
        title="Vendas / Faturas PIX por Período"
        subTitle={empresaSelecionadaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Por Marca"}
        optionsMarcas={[
          { value: '0', label: 'Selecione uma Marca' },
          ...optionsMarcas.map((item) => ({
            value: item.IDGRUPOEMPRESARIAL,
            label: item.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}


        MultSelectEmpresaComponent={MultSelectAction}
        optionsMultSelectEmpresa={[
          { value: '0', label: 'Selecione uma loja' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelMultSelectEmpresa={"Empresa"}
        valueMultSelectEmpresa={[empresaSelecionada]}
        onChangeMultSelectEmpresa={handleChangeEmpresa}

        InputFieldComponent={InputField}
        labelInputField={"Empresas  Livre"}
        placeHolderInputFieldComponent={"Empresas Livres"}
        valueInputField={empresaLivre}
        onChangeInputField={(e) => setEmpresaLivre(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Vendas PIX "}
        onButtonClickSearch={handleClickVendasPix}
        IconSearch={AiOutlineSearch}
        corSearch={"info"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Faturas PIX"}
        onButtonClickCadastro={handleClickVendasFaturaPix}
        corCadastro={"success"}
        IconCadastro={AiOutlineSearch}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Vendas PIX Consolidada Marca"}
        onButtonClickCancelar={handleClickVendasPixConsolidadoMarca}
        corCancelar={"danger"}
        IconCancelar={AiOutlineSearch}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Faturas PIX Consolidada Marca"}
        onButtonClickVendasEstrutura={handleClickVendasFaturaPixConsolidado}
        corVendasEstrutura={"warning"}
        iconVendasEstrutura={AiOutlineSearch}

        ButtonTypeVendasVendedor={ButtonType}
        linkNomeVendasVendedor={"Faturas PIX Consolidada Lojas"}
        onButtonClickVendasVendedor={handleClickFaturaPixConsolidadoLoja}
        corVendasVendedor={"info"}
        iconVendasVendedor={AiOutlineSearch}

        ButtonTypeProdutoVendidos={ButtonType}
        linkNomeProdutoVendido={"Vendas PIX Consolidada Lojas"}
        onButtonClickProdutoVendido={handleClickVendasPixConsolidadoEmpresa}
        iconProdutoVendido={AiOutlineSearch}
        corProdutoVendido={"success"}

      />


      {tabelaVendasPixVisivel && (
        <ActionListaVendasPIX dadosVendasPix={dadosVendasPix}/>
      )}

      {tabelaVendasFaturaPixVisivel && (
        <ActionListaFaturasPix dadosVendasFaturasPix={dadosVendasFaturasPix}/>
      )}

      {tabelaVendasPixConsolidadoVisivel && (
        <ActionListaVendasPixConsolidado dadosVendasPixConsolidadoMarca={dadosVendasPixConsolidadoMarca}/>
      )}

      {tabelaFaturaPixConsolidadoVisivel && (

        <ActionListaFaturasPixConsolidado dadosVendasFaturasPixConsolidadoPeriodo={dadosFaturasPixConsolidadoPeriodo}/>
      )}

      {tabelaVendasPixConsolidadoEmpresa && (
        <ActionListaVendasPixConsolidadoEmpresa dadosVendasPixConsolidado={dadosVendasPixConsolidado}/>
      )}

      {tabelaFaturaPixConsolidadoLoja && (
        <ActionListaVendasPixConsolidadoLoja dadosFaturasPixConsolidadoLoja={dadosFaturasPixConsolidadoLoja}/>
      )}
    </Fragment>
  )
}