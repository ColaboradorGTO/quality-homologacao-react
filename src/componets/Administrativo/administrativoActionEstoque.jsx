import React, { Fragment, useState, useEffect } from "react"
import axios from "axios"
import { MultSelectAction } from "../Select/MultSelectAction"
import TabelaPrincipal from "../Tables/TabelaMain"
import { AdministrativoActionEstoqueRotatividade } from "./administrativoActionEstoqueRotatividade"
import { InputField } from "../Buttons/Input"
import { ActionMain } from "../Actions/actionMain"
import { ButtonType } from "../Buttons/ButtonType"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const options = [
  { value: 'utilidades', nome: 'Utilidades' },
  { value: 'cosmeticos', nome: 'Cosméticos' },
  { value: 'verao', nome: 'Verão' }
]

export const AdministrativoActionEstoque = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [actionVisivel, setActionVisivel] = useState(false);
  const [contadorClickTabela, setContadorClickTabela] = useState(0);
  const [contadorClickAction, setContadorClickAction] = useState(0);

  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [codBarra, setCodBarra] = useState('');
  const [multiSelectGrupo, setMultiSelectGrupo] = useState('');
  const [multiSelectSubGrupo, setMultiSelectSubGrupo] = useState('');
  const [multiSelectMarca, setMultiSelectMarca] = useState('');
  const [multiSelectFornecedor, setMultiSelectFornecedor] = useState('');

  const [multiSelectGrupoSelecionado, setMultiSelectGrupoSelecionado] = useState(null);
  const [multiSelectSubGrupoSelecionado, setMultiSelectSubGrupoSelecionado] = useState(null);
  const [multiSelectMarcaSelecionado, setMultiSelectMarcaSelecionado] = useState(null);
  const [multiSelectFornecedorSelecionado, setMultiSelectFornecedorSelecionado] = useState(null);

  const handleTabelaVisivel = () => {
    setContadorClickTabela((prevClickCount) => prevClickCount + 1);
    if (contadorClickTabela % 2 === 0) {
      setTabelaVisivel(false);

    } else {
      setTabelaVisivel(true);
      setActionVisivel(false);
    }
  };

  const handleActionVisivel = () => {
    setContadorClickAction((prevClickCount) => prevClickCount + 1);
    if (contadorClickAction % 2 === 0) {
      setActionVisivel(false);

    } else {
      setActionVisivel(true);
      setTabelaVisivel(false);
    }
  };

  useEffect(() => {
    getTabelas()
  }, [])

  const getTabelas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/ListaVendas")
      if (response.data) {
        setDadosExemplos(response.data)
        // console.log(response.data, 'get tabelas')
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  
  return (

    <Fragment>


      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatório"]}
        title="Estoque"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        
        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        valueInputFieldCodBarra={codBarra}
        onChangeInputFieldCodBarra={e => setCodBarra(e.target.value)}

        MultSelectGrupoComponent={MultSelectAction}
        labelMultSelectGrupo={"Grupo"}
        valueMultSelectGrupo={multiSelectGrupoSelecionado}
        onChangeMultSelectGrupo={e => setMultiSelectGrupo(e.target.value)}
        optionsMultSelectGrupo={options}

        
        MultSelectSubGrupoComponent={MultSelectAction}
        labelMultSelectSubGrupo={"Subgrupo"}
        valueMultSelectSubGrupo={multiSelectSubGrupoSelecionado}
        onChangeMultSelectSubGrupo={e => setMultiSelectSubGrupo(e.target.value)}
        optionsMultSelectSubGrupo={options}
        
        MultSelectMarcaComponent={MultSelectAction}
        labelMultSelectMarca={"Marca"}
        valueMultSelectMarca={multiSelectMarcaSelecionado}
        onChangeMultSelectMarca={e => setMultiSelectMarca(e.target.value)}
        optionsMultSelectMarca={options}
        
        MultSelectFornecedorComponent={MultSelectAction}
        labelMultSelectFornecedor={"Fornecedor"}
        valueMultSelectFornecedor={multiSelectFornecedorSelecionado}
        onChangeMultSelectFornecedor={e => setMultiSelectFornecedor(e.target.value)}
        optionsMultSelectFornecedor={options}

        ButtonTypeVendasEstrutura={ButtonType}
        onButtonClickVendasEstrutura={handleTabelaVisivel}
        linkNomeVendasEstrutura={"Estoque Atual"}

        ButtonTypeVendasVendedor={ButtonType}
        onButtonClickVendasVendedor={handleActionVisivel}
        linkNomeVendasVendedor={"Rotatividade Estoque"}

        onButtonClickSearch={handleTabelaVisivel}



      />
      
      <div id="resultado">
        {/* AdministrativoActionEstoqueAtual ele chama este component */}
        {tabelaVisivel ? (
          <div className="row">
            <h2>
              Relatório Estoque Atual
            </h2>

            <DataTable
              title="Vendas por Loja"
              value={dadosConvenioVendasDescontoFuncionario}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunaVendasConvenioDescontoFuncionario.map(coluna => (
                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc',fontSize: '0.8rem' }}
                  bodyStyle={{ fontSize: '0.8rem' }}

                />
              ))}
            </DataTable>
          </div>
        ) : null}
        {actionVisivel ? (

          <AdministrativoActionEstoqueRotatividade />
        ) : null}


      </div>

    </Fragment>
  )
}

