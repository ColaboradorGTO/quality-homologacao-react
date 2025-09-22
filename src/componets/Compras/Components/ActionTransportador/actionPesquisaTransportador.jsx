import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaTransportador } from "./actionListaTransportador";
import { MdAdd } from "react-icons/md";
import { ActionCadastroTrasnportadorModal } from "./ActionCadastrar/actionCadastroTransportadorModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaTransportador = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [transportadorSelecionado, setTransportadorSelecionado] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  
  
  const fetchListaTransporte = async () => {
    try {
      const urlApi = `/transportador?idTransportador=${transportadorSelecionado}&descricaoTransportador=${razaoSocial}&cnpjTransportador=${cnpj}`;
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
    
  const { data: dadosTransportador = [], error: errorCondicoes, isLoading: isLoadingCondicoes, refetch: refetchListaTransporte } = useQuery(
    ['transportador', transportadorSelecionado, razaoSocial, cnpj, currentPage, pageSize],
    () => fetchListaTransporte(transportadorSelecionado, razaoSocial, cnpj, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )


  const handleChangeSelectTransportador = (e) => {
    setTransportadorSelecionado(e.value)
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaTransporte();
    setTabelaVisivel(true)
  }


  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Transportadores"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Transportadores"]}


        InputFieldComponent={InputField}
        labelInputField={"Razão Social / Nome Fantasia"}
        valueInputField={razaoSocial}
        onChangeInputField={(e) => setRazaoSocial(e.target.value)}
        placeHolderInputFieldComponent={"Informe a razão social ou nome fantasia do transportador"}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'selecione' },
          ...dadosTransportador.map((item) => {
            return { 
              value: item.IDTRANSPORTADORA, 
              label: ` ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}` 
            }
          
          })
        ]}
        labelSelectEmpresa={"Por Transportadora"}
        valueSelectEmpresa={transportadorSelecionado}
        onChangeSelectEmpresa={handleChangeSelectTransportador}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"CNPJ"}
        valueInputFieldDescricao={cnpj}
        onChangeInputFieldDescricao={(e) => setCnpj(e.target.value)}
        placeHolderInputFieldDescricao={"Informe o CNPJ do transportador"}
        

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Transportador"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Transportador"}
        onButtonClickCadastro={() => setModalVisivel(true)}
        IconCadastro={MdAdd}
        corCadastro={"success"}

       
      />

      {tabelaVisivel && (
        <ActionListaTransportador dadosTransportador={dadosTransportador}/>
      )}

      <ActionCadastroTrasnportadorModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
      />

    </Fragment>
  )
}
