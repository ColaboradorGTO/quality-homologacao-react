import React, { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";;
import { get } from "../../../../api/funcRequest";
import { ActionListaVendasContigencia } from "./actionListaVendasContigencia";
import { getDataAtual } from "../../../../utils/dataAtual";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaVendasContigencia = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicio = getDataAtual();
    const dataFim = getDataAtual();
    setDataPesquisaInicio(dataInicio);
    setDataPesquisaFim(dataFim);
    
  }, []);


  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);

      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );

  const fetchVendasContigencia  = async () => {
    try {
                                                                                                                                                                       
      const urlApi = `/vendas-contigencia?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.page === pageSize) {
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

  const { data: dadosVendasContigencia = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchVendasContigencia} = useQuery(
    ['venda-contigencia',  empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchVendasContigencia( empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: false, 
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleChangeEmpresa = (e) => {
    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }

  const handleClick = () => {
    setCurrentPage(+1)
    refetchVendasContigencia(empresaSelecionada)
    setTabelaVisivel(false)
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vendas em Contingência"]}
        title="Vendas / Contingência -"
        subTitle={empresaSelecionadaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma Empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          })
          )]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />


      
      <ActionListaVendasContigencia  dadosVendasContigencia={dadosVendasContigencia} />
     
    </Fragment>
  )
}
