import { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { ActionListaCores } from "./actionListaCores";
import { ActionCadastroCoresModal } from "./ActionCadastrarCores/actionCadastroCoresModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaCores = () => {
  const [descricao, setDescricao] = useState("")
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [corSelecionada, setCorSelecionada] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
    
     
  const fetchListaCores = async () => {
    try {
      const urlApi = `/listaCores?idCor=${corSelecionada}&descricao=${descricao}`;
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
    
  const { data: dadosCores = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaCores } = useQuery(
    ['listaCores', corSelecionada, descricao, currentPage, pageSize],
    () => fetchListaCores(corSelecionada, descricao,  currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaCores()
    setTabelaVisivel(true)
  }

  const handleChangeCor = (e) => {
    setCorSelecionada(e.value)
  }
  const handleModal = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }

  return (

    <Fragment>
       <ActionMain
        title="Relatórios - Cores"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Cores"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}


        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosCores.map((item) => {
            return { 
              value: item.ID_GRUPOCOR, 
              label: `${item.DS_GRUPOCOR} - ${item.DS_COR}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Unidade"}
        valueSelectSubGrupo={corSelecionada}
        onChangeSelectSubGrupo={handleChangeCor}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Cores"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Cores"}
        onButtonClickCadastro={handleModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}

      />

      {tabelaVisivel && (
        <ActionListaCores dadosCores={dadosCores} />
      )}

      <ActionCadastroCoresModal show={modalVisivel} handleClose={handleClose} />
    </Fragment>
  )
}
