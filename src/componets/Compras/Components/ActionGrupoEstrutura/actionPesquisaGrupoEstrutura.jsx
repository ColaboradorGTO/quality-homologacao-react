import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaGrupoEstrutura } from "./actionListaGrupoEstrutura";
import { ActionCadastroGrupoEstruturaModal } from "./ActionCadastrar/actionCadastroGrupoEstruturaModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaGrupoEstrutura = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [descricao, setDescricao] = useState("")
  const [grupoSelecionado, setGrupoSelecionado] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const fetchListaGrupo = async () => {
    try {
      const urlApi = `/grupoEstrutura?idGrupoEstrutura=${grupoSelecionado}&descricaoGrupoEstrutura=${descricao}`;
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

  const { data: dadosGrupoEstrutura = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaGrupo } = useQuery(
    ['grupoEstrutura', grupoSelecionado, descricao, currentPage, pageSize],
    () => fetchListaGrupo(grupoSelecionado, descricao, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )



  const handleChangeGrupo = (e) => {
    setGrupoSelecionado(e.value)
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaGrupo()
    setTabelaVisivel(true)
      
  }


  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Grupos Estruturas Mercadológicas"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Grupo Estrutura"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Grupo"}
        optionsGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosGrupoEstrutura.map((item) => {
            return {
              value: item.IDGRUPOESTRUTURA,
              label: item.DSGRUPOESTRUTURA
            }
          })
        ]}
        valueSelectGrupo={grupoSelecionado}
        onChangeSelectGrupo={handleChangeGrupo}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Grupo Estrutura"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Grupo Estrutura"}
        onButtonClickCadastro={() => setModalVisivel(true)}
        IconCadastro={MdAdd}
        corCadastro={"success"}
        corSearch={"primary"}

      />

      {tabelaVisivel && (

        <ActionListaGrupoEstrutura dadosGrupoEstrutura={dadosGrupoEstrutura}  />
      )}
      <ActionCadastroGrupoEstruturaModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
      />
    </Fragment>
  )
}
