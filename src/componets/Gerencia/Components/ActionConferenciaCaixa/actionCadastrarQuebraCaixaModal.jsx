import { Fragment, useEffect, useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { get, post } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import axios from "axios";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../utils/dataAtual";
import { dataFormatada } from "../../../../utils/dataFormatada";

export const ActionCadastrarQuebraCaixaModal = ({ show, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos }) => {
  const { register, handleSubmit, errors } = useForm();
  const [empresa, setEmpresa] = useState('')
  const [motivoAjuste, setMotivoAjuste] = useState('')
  const [dataLancamento, setDataLancamento] = useState('')
  const [dataAtualFormatada, setDataAtualFormatada] = useState('')
  const [dinheiroInformado, setDinheiroInformado] = useState('')
  const [dinheiroAjuste, setDinheiroAjuste] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')
  
  const [dadosQuebraCaixasModal, setDadosQuebraCaixasModal] = useState([]);
  const [modalVisivelImprimir, setModalVisivelImprimir] = useState(false);
  const [modalQuebraVisivel, setModalQuebraVisivel] = useState(true);
  const dataTableRef = useRef();


  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataLancamento(dataAtual);
    setDataAtualFormatada(dataFormatada(dataAtual));
  }, [])

  useEffect(() => {
    getIPUsuario();
  }, []);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }



  const dados = dadosDetelheCaixa.map((item) => {
    let VrQuebraSistema = 0;
    if (parseFloat(item.TOTALFECHAMENTOVRQUEBRACAIXA) < 0) {
      VrQuebraSistema = '-' + parseFloat(item.TOTALFECHAMENTOVRQUEBRACAIXA).toFixed(2);
    } else {
      VrQuebraSistema = '+' + parseFloat(item.TOTALFECHAMENTOVRQUEBRACAIXA).toFixed(2);
    }

    return {
      TOTALFECHAMENTOVRQUEBRACAIXA: item.TOTALFECHAMENTOVRQUEBRACAIXA,
      VrQuebraSistema: VrQuebraSistema,
      DTHORAFECHAMENTOCAIXA: item.DTHORAFECHAMENTOCAIXA,
      ID: item.ID,
    }
  })

  
  const onSubmit = async () => {
    if(optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você não tem permissão para alterar este registro.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    const TxTHistorico = 'Quebra de Caixa Automático';
    const postData = {
      IDCAIXAWEB: dadosDetelheCaixa[0].IDCAIXAFECHAMENTO,
      IDMOVIMENTOCAIXA: dadosDetelheCaixa[0].ID,
      IDGERENTE: usuarioLogado.id,
      IDFUNCIONARIO: dadosDetelheCaixa[0].IDOPERADORFECHAMENTO,
      DTLANCAMENTO: dataLancamento,
      VRQUEBRASISTEMA: dadosDetelheCaixa[0].TOTALFECHAMENTOVRQUEBRACAIXA,
      VRQUEBRAEFETIVADO: dadosDetelheCaixa[0].TOTALFECHAMENTOVRQUEBRACAIXA,
      TXTHISTORICO: motivoAjuste == '' ? TxTHistorico : motivoAjuste,
      STATIVO: 'True'

    }

    try {
      const response = await post('/quebra-caixa-todos', postData)

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRAR QUEBRA DE CAIXA';
      
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
      
      await post('/log-web', createData)
      
      await handleImprimir(dadosDetelheCaixa[0].ID);
      Swal.fire({
        title: 'Cadastro',
        text: 'Cadastro Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return response.data;
    } catch (error) {
        const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRAR QUEBRA DE CAIXA';
      
      
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
      
      const responsePost = await post('/log-web', createData)
      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      console.log(error);
      return responsePost.data
    }
  }

  

  const handleImprimir = async (row) => {
    try {
      const response = await get(`/quebra-caixa?idQuebraCaixa=${row.ID}`);
      if (response.data && response.data.length > 0) {
        setDadosQuebraCaixasModal(response.data);
        setModalVisivelImprimir(true);
        setModalQuebraVisivel(false);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        id="CadadiantamentoSalario"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Lançar Quebra de Caixa da Loja"}
          subTitle={"Cadastrar Quebra de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          {modalQuebraVisivel && (
            <form onSubmit={handleSubmit(onSubmit)} >
  
              <div class="form-group">
                <div class="row">
  
                  <div class="col-sm-6 col-xl-16">
                    <InputFieldModal
                      className="form-control input"
                      readOnly={true}
                      label="Empresa"
                      value={usuarioLogado?.NOFANTASIA}
                      onChangeModal={(e) => setEmpresa(e.target.value)}
                      {...register("empresa", { required: true })}
  
                    />
  
                  </div>
                  <div class="col-sm-6 col-xl-16">
                    <InputFieldModal
                      className="form-control input"
                      readOnly={true}
                      label="Operador do Caixa"
                      value={usuarioLogado?.NOFUNCIONARIO}
  
                      {...register("operador", { required: true })}
  
                    />
  
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="text"
                      className="form-control input"
                      label="Histórico"
                      value={motivoAjuste}
                      onChangeModal={(e) => setMotivoAjuste(e.target.value)}
                      {...register("motivoAjuste", { required: true })}
                    />
                  </div>
  
                </div>
              </div>
              <div class="form-group">
                <div class="row">
  
                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="datetime"
                      className="form-control input"
                      readOnly={true}
                      label="Data Lançamento"
                      value={dados[0]?.DTHORAFECHAMENTOCAIXA}
                      onChangeModal={(e) => setDataLancamento(e.target.value)}
                      {...register("dataLancamento", { required: true })}
  
                    />
                  </div>
                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="text"
                      className="form-control input"
                      readOnly={true}
                      label="Valor Quebra Sistema"
                      value={dados[0]?.VrQuebraSistema}
                      onChangeModal={(e) => setDinheiroInformado(e.target.value)}
                      {...register("dinheiroInformado", { required: true })}
                    />
                  </div>
                  <div class="col-sm-6 col-xl-4">
                    <InputFieldModal
                      type="text"
                      className="form-control input"
                      readOnly={true}
                      label="Valor Quebra Ajustado"
                      value={dados[0]?.VrQuebraSistema}
                      onChangeModal={(e) => setDinheiroAjuste(e.target.value)}
                      {...register("dinheiroAjuste", { required: true })}
  
                    />
                  </div>
                </div>
              </div>  
            </form>

          )}

          {modalVisivelImprimir && dadosQuebraCaixasModal.map((item) => {

            if (usuarioLogado.id == item.IDFUNCIONARIO) {
              return (
                <Fragment>

                  <HeaderModal
                    title={"Impressão de Recibos"}
                    subTitle={"Imprimir Quebra de Caixa"}
                    handleClose={handleClose}
                  />



                  <div ref={dataTableRef}>
                    <div style={{ justifyContent: "center", }}>
                      <div className="col-sm-12">
                        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>AUTORIZAÇÃO DE DESCONTO EM FOLHA DE PAGAMENTO POR QUEBRA DE CAIXA</h3>
                      </div>
                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>
                          Valor da Quebra:<b> R$ {item.VRQUEBRASISTEMA} - </b>Referente:<b>   {item.DSCAIXA}   - </b>Movimento:<b>  {item.IDMOVIMENTOCAIXA} </b>
                        </p>
                      </div>

                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>Pelo presente instrumento, Eu  ,<b> {item.NOMEOPERADOR}</b>, brasileiro(a), função {item.DSFUNCAO}, inscrito(a) no CPF sob o nº <p> <b> {item.CPFOPERADOR} </b>,</p>
                          colaborador(a) da empresa GTO COM. ATAC. DE CONFEC. E CALÇ. LTDA., inscrita no CNPJ nº.<b>  {item.NUCNPJ} </b>, com sede na {item.EENDERECO} - {item.EBAIRRO} - {item.ECIDADE} - {item.SGUF},
                          <b>AUTORIZO</b> a empresa a efetuar o desconto até o limite total do meu adicional de quebra de caixa, em meu salário, através da folha de pagamento, dos valores faltantes no meu caixa, seguindo assim os ditames legais do Art. 462, §1º da CLT e CCT vigentes.</p>
                      </div>

                      <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> Motivo: <b style={{ textTransform: 'uppercase' }}>{item.TXTHISTORICO}</b>  </p></div>

                      <div className="col-sm-12"><p style={{ fontSize: "13px" }}> Brasília, <b> {dataAtualFormatada} </b>. </p> </div>
                      <div style={{ textAlign: "center" }} >
                        <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> {item.NOMEOPERADOR} - CPF: {item.CPFOPERADOR}  </p> </div>

                        <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" > <p style={{ fontSize: "13px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                      </div>
                    </div>
                  </div>

                </Fragment>
              )
            } else {
              return (
                <Fragment>

                  <HeaderModal
                    title={"Impressão de Recibos"}
                    subTitle={"Imprimir Desconto em Folha"}
                    handleClose={handleClose}
                  />



                  <div ref={dataTableRef}>
                    <div style={{ justifyContent: "center", }}>
                      <div className="col-sm-12">
                        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>DESCONTO AUTORIZADO EM FOLHA DE PAGAMENTO</h3>
                      </div>
                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>
                          Valor da Quebra:<b> R$ {item.VRQUEBRASISTEMA} - </b>Referente:<b>   {item.DSCAIXA}   - </b>Movimento:<b>  {item.IDMOVIMENTOCAIXA} </b>
                        </p>
                      </div>

                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>Pelo presente instrumento, Eu  ,<b> {item.NOMEOPERADOR}</b>, brasileiro(a), função {item.DSFUNCAO}, inscrito(a) no CPF sob o nº <p> <b> {item.CPFOPERADOR} </b>,</p>
                          colaborador(a) da empresa GTO COM. ATAC. DE CONFEC. E CALÇ. LTDA., inscrita no CNPJ nº.<b>  {item.NUCNPJ} </b>, com sede na {item.EENDERECO} - {item.EBAIRRO} - {item.ECIDADE} - {item.SGUF},
                          <b> AUTORIZO </b> a empresa a efetuar o desconto acima especificado em meu salário, através da folha de pagamento.</p>
                      </div>

                      <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> Motivo: <b style={{ textTransform: 'uppercase' }}>{item.TXTHISTORICO}</b>  </p></div>

                      <div className="col-sm-12"><p style={{ fontSize: "13px" }}> Brasília, <b> {dataAtualFormatada} </b>. </p> </div>
                      <div style={{ textAlign: "center" }} >
                        <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> {item.NOMEOPERADOR} - CPF: {item.CPFOPERADOR}  </p> </div>

                        <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" > <p style={{ fontSize: "13px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                      </div>
                    </div>
                  </div>


                </Fragment>
              )
            }
          })}

          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={onSubmit}
            textButtonCadastrar={"Cadastrar Quebra Caixa"}
            corCadastrar="success"

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}