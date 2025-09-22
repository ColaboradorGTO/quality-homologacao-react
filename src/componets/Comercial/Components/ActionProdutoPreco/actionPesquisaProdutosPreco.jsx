import React, { Fragment, useEffect, useState } from "react"
import { ActionListaProductoPreco } from "./actionListaProdutosPreco";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useQuery } from "react-query";
import { get } from "../../../../api/funcRequest";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaProductoPreco = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, }
  );

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, }
  );

  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas])

  const fetchListaProdutos = async () => {
    try {

      const urlApi = `/lista-produtos?idEmpresa=${empresaSelecionada}`;
      const response = await get(urlApi);

      if (response.data && response.data.length === pageSize) {
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosProdutos = [], error: errorPrdoutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['produtos', empresaSelecionada, currentPage, pageSize],
    () => fetchListaProdutos(empresaSelecionada, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );
 

  const handleSelectEmpresa = (e) => {
    const selectedId = e.value;
    
    if (selectedId) {
      setEmpresaSelecionada(selectedId);
    }
  };

  const handleSelectMarcas = (e) => {
    const selectedId = e.value

    if (!isNaN(selectedId)) {
      setMarcaSelecionada(selectedId);
    }
  }

  const handleClick = () => {
    if(empresaSelecionada) {

      refetchListaProdutos();
      setTabelaVisivel(true);
    } else {
      alert('Selecione uma empresa para pesquisar');
    }
  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Produtos - Preços"]}
        title="Produtos - Preços"
        subTitle

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma loja' },
          ...dadosEmpresas.map((empresa) => ({
            value: String(empresa.IDEMPRESA),
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marcas"}
        optionsMarcas={[
          { value: null, label: 'Selecione uma Marca' },
          ...dadosMarcas.map((empresa) => ({
            value: empresa.IDGRUPOEMPRESARIAL,
            label: empresa.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarcas={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarcas}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel && (
        <ActionListaProductoPreco dadosProdutos={dadosProdutos} />
      )}

    </Fragment>
  )
}