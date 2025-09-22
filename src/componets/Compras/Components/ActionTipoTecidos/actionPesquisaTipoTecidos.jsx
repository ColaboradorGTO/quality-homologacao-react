import { Fragment,  useState } from "react"
import { get } from "../../../../api/funcRequest";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionMain } from "../../../Actions/actionMain";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaTipoTecidos } from "./actionListaTipoTecidos";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionCriarTipoTecidosModal } from "./ActionCadastrar/actionCriarTipoTecidosModal";


export const ActionPesquisaTiposTecidos = () => {
  const [descricao, setDescricao] = useState(''); 
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tecidoSelecionado, setTecidoSelecionado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

 
  const fetchListaTecidos = async () => {
    try {
      const urlApi = `/tipo-tecido?idTecido=${tecidoSelecionado}&descricaoTecido=${descricao}`;
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
  
  const { data: dadosTecidos = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch } = useQuery(
    ['tipo-tecido', tecidoSelecionado, descricao, currentPage, pageSize],
    () => fetchListaTecidos(tecidoSelecionado, descricao,  currentPage, pageSize),
    { enabled: true  }
  )


  const handleChangeTecido = (e) => {
    setTecidoSelecionado(e.value)
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetch()
    setTabelaVisivel(true)
  }

  const handleModal = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }


  const optionsF = [
    { value: '1', label: 'Ativo' },
    { value: '2', label: 'Inativo' }
  ]


  return (

    <Fragment>
      <ActionMain
        title="Relatórios - Tipos de Tecidos"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Tipos de Tecidos"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosTecidos.map((item) => {
            return { 
              value: item.IDTPTECIDO, 
              label: `${item.DSTIPOTECIDO}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Tipo de Tecido"}
        valueSelectSubGrupo={tecidoSelecionado}
        onChangeSelectSubGrupo={handleChangeTecido}
        
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
        <ActionListaTipoTecidos dadosTecidos={dadosTecidos} />
      )}

      <ActionCriarTipoTecidosModal
        show={modalVisivel} 
        handleClose={(e) => setModalVisivel(true)} 
      />
    </Fragment>
  )
}

