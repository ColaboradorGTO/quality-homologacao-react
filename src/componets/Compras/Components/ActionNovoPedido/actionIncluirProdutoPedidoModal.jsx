import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import Select from 'react-select';
import Swal from 'sweetalert2'
import { useForm } from "react-hook-form"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { get } from "../../../../api/funcRequest";

export const ActionIncluirProdutoPedidoModal = ({show, handleClose}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [nomeMarca, setNomeMarca] = useState('')
  const [referenciaProduto, setReferenciaProduto] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [reposicaoSelecionado, setReposicaoSelecionado] = useState('')
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [vrCusto, setVrCusto] = useState('')
  const [vrVenda, setVrVenda] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [quantidadeCaixa, setQuantidadeCaixa] = useState('')
  const [referencia, setReferencia] = useState('')
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState('')
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('')
  const [corSelecionada, setCorSelecionada] = useState('')
  const [tipoTecidoSelecionado, setTipoTecidoSelecionado] = useState('')
  const [categoriaGradeSelecionada, setCategoriaGradeSelecionada] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [estruturaSelecionada, setEstruturaSelecionada] = useState('')
  const [estiloSelecionado, setEstiloSelecionado] = useState('')
  const [localExposicaoSelecionado, setLocalExposicaoSelecionado] = useState('')
  const [ecommerceSelecionado, setEcommerceSelecionado] = useState('')
  const [redeSocialSelecionada, setRedeSocialSelecionada] = useState('')
  const [vrBruto, setVrBruto] = useState('')
  const [percDescontoI, setPercDescontoI] = useState('')
  const [percDescontoII, setPercDescontoII] = useState('')
  const [percDescontoIII, setPercDescontoIII] = useState('')
  const [vrLiquido, setVrLiquido] = useState('')
  const [vrSugerido, setVrSugerido] = useState('')
  const [vrTotal, setVrTotal] = useState('')
  const [observacao, setObservacao] = useState('')
  const [dadosCores, setDadosCores] = useState([])
  const [dadosUnidadeMedida, setDadosUnidadeMedida] = useState([])
  const [dadosTipoTecidos, setDadosTipoTecidos] = useState([])
  const [dadosCategoriaPedidos, setDadosCategoriaPedidos] = useState([])
  const [dadosCategoriasProdutos, setDadosCategoriasProdutos] = useState([])
  const [dadosSubGrupoProduto, setDadosSubGrupoProduto] = useState([])
  const [dadosFabricantePedido, setDadosFabricantePedido] = useState([])
  const [dadosLocalExposicao, setDadosLocalExposicao] = useState([])

  useEffect(() => {
    getListaCores();
    getListaUnidadeMedida();
    getListaTipoTecidos();
    getListaCategoriaPedidos();
    getListaCategoriasProdutos();
    getListaSubGrupoProduto();
    getListaFabricantePedido();

  }, [])

  const getListaCores = async () => {
    try {
      const response = await get('/listaCores');
      if (response && response.data) {
        setDadosCores(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getListaUnidadeMedida = async () => {
    try {
      const response = await get('/unidadeMedida');
      if (response && response.data) {
        setDadosUnidadeMedida(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getListaTipoTecidos = async () => {
    try {
      const response = await get('/tipoTecidos');
      if (response && response.data) {
        setDadosTipoTecidos(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getListaCategoriaPedidos = async () => {
    try {
      const response = await get('/categoriaPedidos');
      if (response && response.data) {
        setDadosCategoriaPedidos(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getListaCategoriasProdutos = async () => {
    try {
      const response = await get('/categoriasProdutos');
      if (response && response.data) {
        setDadosCategoriasProdutos(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getListaSubGrupoProduto = async () => {
    try {
      const response = await get('/listaSubGrupoProduto');
      if (response && response.data) {
        setDadosSubGrupoProduto(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getListaFabricantePedido = async () => {
    try {
      const response = await get('/vincularFabricanteFornecedor?idFornecedorPedido=1');
      if (response && response.data) {
        setDadosFabricantePedido(response.data);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangeProduto = (e) => {
    setProdutoSelecionado(e.value)
  }

  const handleChangeReposicao = (e) => {
    setReposicaoSelecionado(e.value)
  }

  const handleChangeFabricante = (e) => {
    setFabricanteSelecionado(e.value)
  } 

  const handleChangeUnidade = (e) => {
    setUnidadeSelecionada(e.value)
  }

  const handleChangeCor = (e) => {
    setCorSelecionada(e.value)
  }

  const handleChangeTipoTecido = (e) => {
    setTipoTecidoSelecionado(e.value)
  }

  const handleChangeCategoriaGrade = (e) => {
    setCategoriaGradeSelecionada(e.value)
  }

  const handleChangeCategoria = (e) => {
    setCategoriaSelecionada(e.value)
  }
  
  const handleChangeEstrutura = (e) => {
    setEstruturaSelecionada(e.value)
  }

  const handleChangeEstilo = (e) => {
    setEstiloSelecionado(e.value)
  }

  const handleChangeLocalExposicao = (e) => {
    setLocalExposicaoSelecionado(e.value)
  }

  const handleChangeEcommerce = (e) => {
    setEcommerceSelecionado(e.value)
  }

  const handleChangeRedeSocial = (e) => {
    setRedeSocialSelecionada(e.value)
  }


  const optionsStatus = [
    { value: 'True', label: 'ATIVO' },
    { value: 'False', label: 'INATIVO' }
  ]

  const optionsReposicao = [
    { value: 'True', label: 'SIM' },
    { value: 'False', label: 'NÃO' }
  ]

  return (

    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="lg"
        centered
      >

        <HeaderModal
          title={`Pedido para VESTUARIO Nº`}
          subTitle={"Inclusão de Itens do Pedido"}
          handleClose={handleClose}
        />


        <Modal.Body>

          <div className="form-group">

            <div className="row">
              <div className="col-sm-12 col-xl-12">
    
                <InputFieldModal
                    label={"Pedido para a Marca"}
                    type={"text"}
                    id={"nomeMarcaPedido"}
                    value={nomeMarca}
                    onChangeModal={(e) => setNomeMarca(e.target.value)}

                    {...register("nomeMarcaPedido", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                    required={true}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-6">
                
                <InputFieldModal
                    label={"Pesquisar Referencia/Produto"}
                    type={"text"}
                    id={"pesqRefProdPedido"}
                    value={referenciaProduto}
                    onChangeModal={(e) => setReferenciaProduto(e.target.value)}

                    {...register("pesqRefProdPedido", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                    required={true}
                />
              </div>
              <div className="col-sm-6 col-xl-6">
                <label className="form-label" htmlFor="tpunid">Produtos Cadastrados / Cod Barras - Nome</label>
                <Select
                  id={"listprodpesqped"}
                  defaultValue={produtoSelecionado}
                  options={optionsStatus.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })}
                  onChange={handleChangeProduto}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-2">
                <label className="form-label" htmlFor="strep">Reposição</label>
                <Select
                  id={"stReposicao"}
                  defaultValue={reposicaoSelecionado}
                  options={optionsReposicao.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })}
                  onChange={handleChangeReposicao}
                />
              </div>
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Descrição Produto"}
                  type={"text"}
                  id={"dsProdPedido"}
                  value={descricaoProduto}
                  onChangeModal={(e) => setDescricaoProduto(e.target.value)}

                  {...register("dsProdPedido", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-3 col-xl-2">

                <InputFieldModal
                  label={"VR Custo"}
                  type={"text"}
                  id={"vrHojeCusto"}
                  value={vrCusto}
                  onChangeModal={(e) => setVrCusto(e.target.value)}

                  {...register("vrHojeCusto", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-3 col-xl-2">
                <InputFieldModal
                  label={"VR Venda"}
                  type={"text"}
                  id={"vrVendaHoje"}
                  value={vrVenda}
                  onChangeModal={(e) => setVrVenda(e.target.value)}

                  {...register("vrVendaHoje", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"Quantidade"}
                  type={"text"}
                  id={"qtd"}
                  value={quantidade}
                  onChangeModal={(e) => setQuantidade(e.target.value)}

                  {...register("qtd", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"QTD Caixas"}
                  type={"text"}
                  id={"qtdCaixa"}
                  value={quantidadeCaixa}
                  onChangeModal={(e) => setQuantidadeCaixa(e.target.value)}

                  {...register("qtdCaixa", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"Referência"}
                  type={"text"}
                  id={"refProduto"}
                  value={referencia}
                  onChangeModal={(e) => setReferencia(e.target.value)}

                  {...register("refProduto", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-6 col-xl-6">
                <label className="form-label" htmlFor="nofab">Fabricante</label>
                
                <Select
                  id={"fabricanteProduto"}
                  defaultValue={fabricanteSelecionado}
                  options={dadosFabricantePedido.map((item) => {
                    return {
                      value: item.IDFABRICANTE,
                      label: item.DSFABRICANTE
                    }
                  })}
                  onChange={handleChangeFabricante}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-4">
                <label className="form-label" htmlFor="tpunid">Unidade</label>
                <Select
                  id={"unidadeProduto"}
                  defaultValue={unidadeSelecionada}
                  options={dadosUnidadeMedida.map((item) => {
                    return {
                      value: item.IDUNIDADEMEDIDA,
                      label: item.DSSIGLA
                    }
                  })}
                  onChange={handleChangeUnidade}
                />
              </div>
              <div className="col-sm-4 col-xl-4">
                <label className="form-label" htmlFor="tpcor">Cor</label>
                <Select
                  id={"corProduto"}
                  defaultValue={corSelecionada}
                  options={dadosCores.map((item) => {
                    return {
                      value: item.ID_COR,
                      label: item.DS_COR
                    }
                  })}
                  onChange={handleChangeCor}
                />
              </div>
              <div className="col-sm-4 col-xl-4">
                <label className="form-label" htmlFor="tptecido">Tipo de Tecido</label>
                <Select
                  id={"tpTecidoProduto"}
                  defaultValue={tipoTecidoSelecionado}
                  options={optionsReposicao.map((item) => {
                    return {
                      value: item.IDTPTECIDO,
                      label: item.DSTIPOTECIDO
                    }
                  })}
                  onChange={handleChangeTipoTecido}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-4">
                <label className="form-label" htmlFor="tpcat">Categoria Grade</label>
                <Select
                  id={"categoriaProduto"}
                  defaultValue={categoriaGradeSelecionada}
                  options={optionsReposicao.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })}
                  onChange={handleChangeCategoriaGrade}
                />
              </div>
              <div className="col-sm-4 col-xl-4">
    
                <InputFieldModal
                  label={"Estrutura"}
                  type={"text"}
                  id={"refProduto"}
                  value={estruturaSelecionada}
                  onChangeModal={(e) => setEstruturaSelecionada(e.target.value)}

                  {...register("refProduto", { required: "Campo obrigatório Informe a Estrutura", })}
                  required={true}
                />
              </div>
              <div className="col-sm-4 col-xl-4">
                <label className="form-label" htmlFor="tpestilo">Estilos</label>
                <InputFieldModal
                  label={"Estilos"}
                  type={"text"}
                  id={"refProduto"}
                  value={estiloSelecionado}
                  onChangeModal={(e) => setEstiloSelecionado(e.target.value)}

                  {...register("refProduto", { required: "Campo obrigatório Informe o Estilo", })}
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 col-xl-3">
                <label className="form-label" htmlFor="tpcatprod">Categorias</label>
                <Select
                  id={"CategoriaProduto"}
                  defaultValue={categoriaSelecionada}
                  options={dadosCategoriaPedidos.map((item) => {
                    return {
                      value: item.IDCATEGORIAS,
                      label: `${item.IDCATEGORIAS} - ${item.DSCATEGORIAS} - ${item.TPCATEGORIAS}` 
                    }
                  })}
                  onChange={handleChangeCategoria}
                  />
              </div>
              <div className="col-sm-3 col-xl-3">
                <label className="form-label" htmlFor="locexp">Local Exposição</label>

                <Select
                  id={"localExposicao"}
                  defaultValue={localExposicaoSelecionado}
                  options={dadosLocalExposicao.map((item) => {
                    return {
                      value: item.IDLOCALEXPOSICAO,
                      label: item.DSLOCALEXPOSICAO
                    }
                  })}
                  onChange={handleChangeLocalExposicao}
                  />
              </div>
              <div className="col-sm-3 col-xl-3">
                <label className="form-label" htmlFor="ecommercest">E-commerce</label>
        
                <Select
                  id={"localExposicao"}
                  defaultValue={ecommerceSelecionado}
                  options={optionsReposicao.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })}
                  onChange={handleChangeEcommerce}
                  />
              </div>
              <div className="col-sm-3 col-xl-3">
                <label className="form-label" htmlFor="redesocialst">Rede Social</label>

                <Select
                  id={"localExposicao"}
                  defaultValue={redeSocialSelecionada}
                  options={optionsReposicao.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })}
                  onChange={handleChangeRedeSocial}
                  />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"VR Bruto"}
                  type={"text"}
                  id={"vrUnitBruto"}
                  value={vrBruto}
                  onChangeModal={(e) => setVrBruto(e.target.value)}

                  {...register("refProduto", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"Desconto I (%)"}
                  type={"text"}
                  id={"descProdI"}
                  value={percDescontoI}
                  onChangeModal={(e) => setPercDescontoI(e.target.value)}

                  {...register("descProdI", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"Desconto II (%)"}
                  type={"text"}
                  id={"descProdII"}
                  value={percDescontoII}
                  onChangeModal={(e) => setPercDescontoII(e.target.value)}

                  {...register("descProdII", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"Desconto III (%)"}
                  type={"text"}
                  id={"descProdIII"}
                  value={percDescontoIII}
                  onChangeModal={(e) => setPercDescontoIII(e.target.value)}

                  {...register("descProdIII", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">
                <InputFieldModal
                  label={"VR Líquido"}
                  type={"text"}
                  id={"vrUnitLiquido"}
                  value={vrLiquido}
                  onChangeModal={(e) => setVrLiquido(e.target.value)}

                  {...register("vrUnitLiquido", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-2 col-xl-2">

                <InputFieldModal
                  label={"VR Sugerido"}
                  type={"text"}
                  id={"vrUnitSugerido"}
                  value={vrSugerido}
                  onChangeModal={(e) => setVrSugerido(e.target.value)}

                  {...register("vrUnitSugerido", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />

              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-4">
                <InputFieldModal
                  label={"VR Total"}
                  type={"text"}
                  id={"vrUnitTotal"}
                  value={vrTotal}
                  onChangeModal={(e) => setVrTotal(e.target.value)}

                  {...register("vrUnitTotal", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
              <div className="col-sm-8 col-xl-8">

                <InputFieldModal
                  label={"Observação"}
                  type={"text"}
                  id={"obsProdutoUnit"}
                  value={observacao}
                  onChangeModal={(e) => setObservacao(e.target.value)}

                  {...register("obsProdutoUnit", { required: "Campo obrigatório Informe a Descrição do Tipo de Tecido", })}
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-12 col-xl-12">
                <label className="form-label" htmlFor="vrtotalunit">QTD/TAMANHOS</label>
              </div>
            </div>
            <div className="row" id="resultadoqtdtamanhos">

            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-12 col-xl-12">
                <div id="tudo"></div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </Fragment>
  )
}
