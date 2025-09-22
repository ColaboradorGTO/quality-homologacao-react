import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSearch } from "react-icons/ai"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { MdAdd } from "react-icons/md"
import { ActionMain } from "../../../Actions/actionMain"
import { ActionListaSubGrupoEstrutura } from "./actionListaSubGrupoEstrutura"
import { ActionCadastroEstruturaModal } from "./ActionCadastro/actionCadastroEstruturaModal"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaSubGrupoEstrutura = () => {
  const [descricao, setDescricao] = useState("")
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const fetchListaSubGrupo = async () => {
    try {
      const urlApi = `/subGrupoEstrutura?idSubGrupoEstrutura=${subGrupoSelecionado}&descricao=${descricao}`;
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
    
  const { data: dadosSubGrupo = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaSubGrupo } = useQuery(
    ['subGrupoEstrutura', subGrupoSelecionado, descricao, currentPage, pageSize],
    () => fetchListaSubGrupo(subGrupoSelecionado, descricao,  currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const handleChangeSubGrupo = (e) => {
    setSubGrupoSelecionado(e.value)
  }
  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaSubGrupo()
    setTabelaVisivel(true)
  }


  return (

    <Fragment>
      
      <ActionMain
        title="SubGrupo de Estruturas Mercadológicas"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatórios - SubGrupo Estruturas Mercadológicas"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosSubGrupo.map((item) => {
            return { 
              value: item.IDSUBGRUPOESTRUTURA, 
              label: `${item.DSGRUPOESTRUTURA} - ${item.DSSUBGRUPOESTRUTURA}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Sub Grupo "}
        valueSelectSubGrupo={subGrupoSelecionado}
        onChangeSelectSubGrupo={handleChangeSubGrupo}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar SubGrupo Estruturas"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
        
        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar SubGrupo Estruturas"}
        onButtonClickCadastro={() => setModalVisivel(true)}
        IconCadastro={MdAdd}
        corCadastro={"success"}



      />

      {tabelaVisivel && (
        <ActionListaSubGrupoEstrutura dadosSubGrupo={dadosSubGrupo} />
      )}

      <ActionCadastroEstruturaModal show={modalVisivel} handleClose={handleClose} />
    </Fragment>
  )
}