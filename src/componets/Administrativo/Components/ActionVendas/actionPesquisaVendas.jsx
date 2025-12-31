import React, { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { ActionListaVendas } from "./actionListaVendas"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"

export const ActionPesquisaVendas = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [idVenda, setIdVenda] = useState('');

  const fetchVendasAtiva = async () => {
    const urlBase = `/lista-venda?idVenda=${idVenda}`;
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
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }

  };

  const { data: dadosVendas = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchVendasAtiva } = useQuery(
    ['lista-venda',],
    () => fetchVendasAtiva(),
    { enabled: false, }
  );


  // const { data: dadosVendas = [], error: erroQuebra, isLoading: isLoadingQuebra, refetch } = useQuery(
  //   'lista-venda',
  //   async () => {
  //     const response = await get(`/lista-venda?idVenda=${idVenda}`);

  //     return response.data;
  //   },
  //   { enabled: false, staleTime: 60 * 60 * 1000 }
  // );


  const handleInputChange = (e) => {
    setIdVenda(e.target.value)
  }

  const handleClick = async () => {
    // if(!idVenda) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Atenção Informe o ID da Venda',
    //     text: 'O campo de pesquisa não pode estar vazio.',
    //     confirmButtonText: 'OK'
    //   })
    //   return
    // }
    setTabelaVisivel(true)

    refetchVendasAtiva();
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vendas"]}
        title="Venda"
        subTitle

        InputFieldComponent={InputField}
        onChangeInputField={handleInputChange}
        valueInputField={idVenda}
        labelInputField={"Venda"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel &&

        <ActionListaVendas dadosVendas={dadosVendas} />
      }

    </Fragment>
  )
}