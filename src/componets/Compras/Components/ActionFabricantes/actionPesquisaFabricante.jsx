import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSave, AiOutlineSearch } from "react-icons/ai"
import { MdAdd } from "react-icons/md"
import { ActionListaFabricantes } from "./actionListaFabricantes"
import { ActionCadastroFabricanteModal } from "./ActionCadastrar/actionCadastroFabricanteModal"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData } from "../../../../hooks/useFetchData"
import { useCadastrarVinculoFabricanteFornecedor } from "../ActionVincularFabricanteFornecedor/hooks/useCadastrarViculoFabricanteFornecedor"


export const ActionPesquisaFabricante = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalCadastrarFabricante, setModalCadastrarFabricante] = useState(false);
  const [fornecedor, setFornecedor] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [nomeFabricante, setNomeFabricante] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const  {
    fabricanteSelecionado,
    fornecedorSelecionado,
    setFabricanteSelecionado,
    setFornecedorSelecionado,
    handleCadastrar
} = useCadastrarVinculoFabricanteFornecedor();
    
    
  const fetchListaFabricante = async () => {
    try {
      const urlApi = `/fabricante-fornecedor?idFabricante=${fabricanteSelecionado}&descricaoFabricante=${nomeFabricante}&idFornecedor=${fornecedorSelecionado}`;
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
    
  const { data: dadosFabricantesFornecedor = [], error: errorFabricanteFornecedor, isLoading: isLoadingFabricanteFornecedor, refetch: refetchListaFabricante } = useQuery(
    ['fabricante-fornecedor', fabricanteSelecionado, nomeFabricante, fornecedorSelecionado, currentPage, pageSize],
    () => fetchListaFabricante(fabricanteSelecionado, nomeFabricante, fornecedorSelecionado, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor } = useFetchData('fornecedores', '/fornecedores');
  const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes } = useFetchData('fabricantes', '/fabricantes');

  const handleSelectFornecedor = (e) => {
    setFornecedor(e.value)
    setFornecedorSelecionado(e)
  }
  
  const handleSelectFabricante = (e) => {
    
    setFabricante(e.value)
    setFabricanteSelecionado(e)
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaFabricante();
    setTabelaVisivel(false)
  }

  const handleModal = () => {
    setModalVisivel(true)
    setModalCadastrarFabricante(true)
  }


  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Fabricantes"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Fabricantes"]}


        InputFieldComponent={InputField}
        labelInputField={"Nome Fabricante"}
        valueInputField={nomeFabricante}
        onChangeInputField={(e) => setNomeFabricante(e.target.value)}

        InputSelectFornecedorComponent={InputSelectAction}
        optionsFornecedores={[
          { value: '', label: 'selecione' },
          ...dadosFornecedores.map(item => ({
            value: item.IDFORNECEDOR,
            label: `${item.IDFORNECEDOR} - ${item.NOFANTASIA} - ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}`

          }))
        ]}
        labelSelectFornecedor={"Por Fornecedor"}
        valueSelectFornecedor={fornecedorSelecionado}
        onChangeSelectFornecedor={handleSelectFornecedor}

        InputSelectFabricanteComponent={InputSelectAction}
        optionsFabricantes={[
          { value: '', label: 'selecione' },
          ...dadosFabricantes.map(item => ({
            value: item.IDFABRICANTE,
            label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
          }))
        ]}
        labelSelectFabricantes={"Por Fabricante"}
        valueSelectFabricante={fabricanteSelecionado}
        onChangeSelectFabricante={handleSelectFabricante}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Fabricante"}
        onButtonClickSearch={handlePesquisar}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Fabricante"}
        onButtonClickCadastro={handleModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Vincular Fabricante / Fornecedor"}
        onButtonClickCancelar={handleCadastrar}
        corCancelar={"warning"}
        IconCancelar={AiOutlineSave}
      />

      <ActionListaFabricantes dadosFabricantesFornecedo={dadosFabricantesFornecedor}/>
      <ActionCadastroFabricanteModal
        show={modalCadastrarFabricante}
        handleClose={() => setModalCadastrarFabricante(false)}
     
      />

    </Fragment>
  )
}