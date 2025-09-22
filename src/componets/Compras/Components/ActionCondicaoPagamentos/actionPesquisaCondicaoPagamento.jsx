import { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionMain } from "../../../Actions/actionMain"
import { AiOutlineSearch } from "react-icons/ai"
import { get } from "../../../../api/funcRequest"
import { ActionListaCondicoesPagamentos } from "./actionListaCondicoesPagamentos"
import { ActionCadastroCondicaoPagamentoModal } from "./ActionCadastrar/cadastroCondicaoPagamentoModal"
import { MdAdd } from "react-icons/md"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useQuery } from "react-query"


export const ActionPesquisaCondicaoPagamento = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState('')
  const [condicaoSelecionada, setCondicaoSelecionada] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);


  const fetchListaCondicoes = async () => {
    try {
      const urlApi = `/condicaoPagamento?idCondPagamento=${condicaoSelecionada}&dsCondPagamento=${descricao}`;
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
    
  const { data: dadosCondicoesPagamentos = [], error: errorCondicoes, isLoading: isLoadingCondicoes, refetch: refetchListaCondicoes } = useQuery(
    ['condicaoPagamento', condicaoSelecionada, descricao, currentPage, pageSize],
    () => fetchListaCondicoes(condicaoSelecionada, descricao,  currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )


  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaCondicoes();
    setTabelaVisivel(true);
  }


  const handleSelectPagamento = (e) => {
    setCondicaoSelecionada(e.value)
  }

  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Condições de Pagamento"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Condições de Pagamento"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}
        placeHolderInputFieldComponent={"Informe a descrição da condição de pagamento"}

        InputSelectPagamentoComponent={InputSelectAction}
        optionsPagamento={[
          { value: '', label: 'Selecione...' },
          ...dadosCondicoesPagamentos.map((item) => {
            return {
              value: item.IDCONDICAOPAGAMENTO,
              label: item.DSCONDICAOPAG
            }
          })
        ]}
        labelSelectPagamento={"Por Condição Pagamento"}
        valueSelectPagamento={condicaoSelecionada}
        onChangeSelectPagamento={handleSelectPagamento}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Condição Pagamento"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
        
        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Condição Pagamento"}
        onButtonClickCadastro={() => setModalVisivel(true)}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaCondicoesPagamentos dadosCondicoesPagamentos={dadosCondicoesPagamentos}/>

      <ActionCadastroCondicaoPagamentoModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
      />

    </Fragment>
  )
}

