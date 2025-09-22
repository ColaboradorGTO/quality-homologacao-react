import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { ActionListaUnidadeMedida } from "./actionListaUnidadeMedida";
import { ActionCadastroUnidadeMedidaModal } from "./ActionCadastroMedidas/actionCadastroUnidadeMedidaModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaUnidadeMedida = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState("")
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const fetchListaUnidadesMedidas = async () => {
    try {
      const urlApi = `/unidades-de-medidas?idUnidadeMedida=${unidadeSelecionada}&descricao=${descricao}`;
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
    
  const { data: dadosUnidadeMedidas = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaUnidadesMedidas } = useQuery(
    ['listaCores', unidadeSelecionada, descricao, currentPage, pageSize],
    () => fetchListaUnidadesMedidas(unidadeSelecionada, descricao,  currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )


  const handleChangeUnidade = (e) => {
    setUnidadeSelecionada(e.value)
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaUnidadesMedidas()
    setTabelaVisivel(true)
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
        title="Relatórios - Unidades de Medidas"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Unidades de Medidas"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição / Sigla"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosUnidadeMedidas.map((item) => {
            return { 
              value: item.IDUNIDADEMEDIDA, 
              label: `${item.DSUNIDADE} - ${item.DSSIGLA}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Unidade"}
        valueSelectSubGrupo={unidadeSelecionada}
        onChangeSelectSubGrupo={handleChangeUnidade}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Unidade de Medidas"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Unidade de Medidas"}
        onButtonClickCadastro={handleModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}

      />

      {tabelaVisivel && (
        <ActionListaUnidadeMedida dadosUnidadeMedidas={dadosUnidadeMedidas} />
      )}

      <ActionCadastroUnidadeMedidaModal 
        show={modalVisivel} 
        handleClose={handleClose} 
      />
    </Fragment>
  )
}