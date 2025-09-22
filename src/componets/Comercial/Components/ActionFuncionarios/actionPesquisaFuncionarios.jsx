import React, { Fragment, useEffect, useState } from "react"
import { ActionListaFuncionario } from "./actionListaFuncionarios";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaFuncionario = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [cpf, setCpf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);


     const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, }
  );



   const fetchListaFuncionarios = async () => {
    try {

      const urlApi = `/atualizarFuncionario?idEmpresa=${empresaSelecionada}&descricaoNomeFuncao=${cpf}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
  
  const { data: 
      dadosFuncionarios = [],
      error: errorPrdoutos,
      isLoading: isLoadingProdutos,
      refetch: refetchListaFuncionarios
    } = useQuery(
    ['funcionarios-loja', empresaSelecionada, currentPage, pageSize],
    () => fetchListaFuncionarios(empresaSelecionada, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000 }
  );


  const handlChangeEmpresaAction = (e) => {
    const nomeEmpresa = dadosEmpresas.find((item) => item.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(nomeEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value); 
  }

  const handleTabelaVisivel = () => {
    setCurrentPage(prevPage => prevPage + 1);
    setTabelaVisivel(true);
    refetchListaFuncionarios();
   
  };

  return (
    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Funcionários das Lojas"]}
        title="  Lista dos funcionários das Lojas"
        subTitle={empresaSelecionadaNome}

        InputFieldVendaCPFCNPJComponent={InputField}
        labelInputFieldVendaCPFCNPJ={"Nome / CPF"}
        valueInputFieldVendaCPFCNPJ={cpf}
        onChangeInputFieldVendaCPFCNPJ={(e) => setCpf(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione a Empresa' },
          ...dadosEmpresas.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        ]}
        labelSelectEmpresa={"Empresas"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handlChangeEmpresaAction}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleTabelaVisivel}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      {tabelaVisivel &&
        <ActionListaFuncionario dadosFuncionarios={dadosFuncionarios} dadosEmpresas={dadosEmpresas}/>
      }
    </Fragment>
  )
}