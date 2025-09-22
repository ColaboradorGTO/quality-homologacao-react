import { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain"
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaFornecedores } from "./actionListaFornecedores";
import { ActionCadastrarFornecedorModal } from "./ActionCadastrar/actionCadastrarFornecedorModal";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useCadastrarVinculoFabricanteFornecedor } from "../ActionVincularFabricanteFornecedor/hooks/useCadastrarViculoFabricanteFornecedor";


export const ActionPesquisaFornecedor = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [fornecedor, setFornecedor] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [descricaoFornecedor, setDescricaoFornecedor] = useState('');
  const [cnpjFornecedor, setCnpjFornecedor] = useState('');
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
      const urlApi = `/fornecedorFabricante?idFabricante=${fabricante}&descFornecedor=${descricaoFornecedor}&idFornecedor=${fornecedor}&cnpjFornecedor=${cnpjFornecedor}`;
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
    
  const { data: dadosFornecedoresFabricantes = [], error: errorFornecedorFabricante, isLoading: isLoadingFornecedorFabricante, refetch: refetchListaFabricante } = useQuery(
    ['fornecedorFabricante', fabricante, descricaoFornecedor, fornecedor, currentPage, pageSize],
    () => fetchListaFabricante(fabricante, descricaoFornecedor, fornecedor, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor } = useFetchData('fornecedores', '/fornecedores');
  const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes } = useFetchData('fabricantes', '/fabricantes');
 
  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaFabricante()
    setTabelaVisivel(true)
  }

  const handleSelectFornecedor = (e) => {
    setFornecedor(e.target.value)
    setFornecedorSelecionado(e)
  }

  const handleSelectFabricante = (e) => {
    setFabricante(e.target.value)
    setFabricanteSelecionado(e)
  }

  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Fornecedores"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Fornecedores"]}

        InputFieldVendaCPFCNPJComponent={InputField}
        labelInputFieldVendaCPFCNPJ={"CNPJ"}
        valueInputFieldVendaCPFCNPJ={cnpjFornecedor}
        onChangeInputFieldVendaCPFCNPJ={(e) => setCnpjFornecedor(e.target.value)}

        InputFieldComponent={InputField}
        labelInputField={"Razão Social / Nome Fantasia"}
        valueInputField={descricaoFornecedor}
        onChangeInputField={(e) => setDescricaoFornecedor(e.target.value)}

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
        linkNomeSearch={"Pesquisar Fornecedor"}
        onButtonClickSearch={handlePesquisar}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Fornecedor"}
        onButtonClickCadastro={() => setModalVisivel(true)}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Vincular Fornecedor / Fabricante"}
        onButtonClickCancelar={handleCadastrar}
        corCancelar={"info"}
        IconCancelar={MdAdd}
      />


      <ActionListaFornecedores dadosFornecedoresFabricantes={dadosFornecedoresFabricantes}/>

      <ActionCadastrarFornecedorModal 
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
      />      
    </Fragment>
  )
}

