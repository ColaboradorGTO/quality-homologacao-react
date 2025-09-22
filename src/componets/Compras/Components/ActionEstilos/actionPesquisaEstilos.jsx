import { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaEstilos } from "./actionListaEstilos";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { MdAdd } from "react-icons/md";
import { ActionCadastrarEstilosModal } from "./ActionCadastrarEstilos/actionCadastrarEstilosModal";


export const ActionPesquisaEstilos = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState("")
  const [estiloSelecionado, setEstiloSelecionado] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  
   
  const fetchListaEstilos = async () => {
    try {
      const urlApi = `/listaEstilos?idEstilo=${estiloSelecionado}&descricao=${descricao}`;
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
  
  const { data: dadosEstilos = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaEstilos } = useQuery(
    ['tipo-tecido', estiloSelecionado, descricao, currentPage, pageSize],
    () => fetchListaEstilos(estiloSelecionado, descricao,  currentPage, pageSize),
    { enabled: true  }
  )

  const handleChangeEstilo = (e) => {
    setEstiloSelecionado(e.value)
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaEstilos()
    setTabelaVisivel(true)
  }

  return (

    <Fragment>
      <ActionMain
        title="Relatórios - Estilos do Grupo da Estrutura Mercadológica"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Estilos"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosEstilos.map((item) => {
            return {
              value: item.ID_ESTILOS,
              label: `${item.DS_GRUPOESTILOS} - ${item.DS_ESTILOS}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Estilos (Grupo Estrutura - Estilos)"}
        valueSelectSubGrupo={estiloSelecionado}
        onChangeSelectSubGrupo={handleChangeEstilo}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Estilos"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={() => setModalVisivel(true)}
        linkNome={"Cadastrar Estilos"}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      {tabelaVisivel && (
        <ActionListaEstilos dadosEstilos={dadosEstilos} />
      )}

      <ActionCadastrarEstilosModal 
        show={modalVisivel} 
        handleClose={(e) => setModalVisivel(false)} 
      />
    </Fragment>
  )
}

