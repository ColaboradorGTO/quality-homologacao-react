import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { get } from "../../../../api/funcRequest"
import { ActionListaVendas } from "./actionListaVendas"
import { getDataAtual } from "../../../../utils/dataAtual"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaVendas = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState("");
  const [dataPesquisaFim, setDataPesquisaFim] = useState("");
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

  const fetchListaVendas = async () => {
    try {
      
      const urlApi = `/vendas-loja-informatica?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&status=False`;
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

  const { data: dadosVendasLoja = [], error: erroCliente, isLoading: isLoadingCliente, refetch: refetchListaVendas } = useQuery(
    'vendas-loja-informatica',
    () => fetchListaVendas(empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  
  const handlChangeEmpresa = (e) => {
    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }

  const handleTabelaVisivel = () => {
    setCurrentPage(+1);
    refetchListaVendas(empresaSelecionada);
    setTabelaVisivel(true);
    
  };


  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Lista de Vendas por Loja"
        subTitle={empresaSelecionadaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione a Empresa' },
          ...optionsEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA

          }))
        ]}
        labelSelectEmpresa={"Empresas"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handlChangeEmpresa}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleTabelaVisivel}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

     
      
      <ActionListaVendas dadosVendasLoja={dadosVendasLoja} />
      

    </Fragment>
  )
}