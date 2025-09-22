import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { post, put } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import Swal from "sweetalert2";
import axios from "axios";

export const ActionAjusteMovimentoCaixaModal = ({ show, handleClose, dadosDetalheFechamento, usuarioLogado, optionsModulos }) => {
  const { register, handleSubmit, errors } = useForm();
  const [empresa, setEmpresa] = useState('')
  const [operadorCaixa, setOperadorCaixa] = useState('')
  const [motivoAjuste, setMotivoAjuste] = useState('')
  const [dataLancamento, setDataLancamento] = useState('')
  const [dinheiroInformado, setDinheiroInformado] = useState('')
  const [dinheiroAjuste, setDinheiroAjuste] = useState('')
  const [faturaInformada, setFaturaInformada] = useState('')
  const [faturaAjuste, setFaturaAjuste] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')



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

  const vrTotalAjusteFatura = dadosDetalheFechamento[0]?.TOTALAJUSTEDINHEIRO > 0 ? dadosDetalheFechamento[0]?.TOTALAJUSTEDINHEIRO : dadosDetalheFechamento[0]?.TOTALFECHAMENTODINHEIRO;

  const onSubmit = async (data) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
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

    const txtObservacaoAjuste = motivoAjuste + '-' + 'Justificativa do Ajuste: ' + motivoAjuste + 'Data do Ajuste: ' + dataLancamento + 'Ajustado por: ' + usuarioLogado?.NOFUNCIONARIO
    const vrQuebraNova = dinheiroAjuste - dadosDetalheFechamento[0]?.TOTALFECHAMENTODINHEIROFISICO
    const putData = {
      ID: dadosDetalheFechamento[0]?.ID,
      VRAJUSTDINHEIRO: dinheiroAjuste,
      VRAJUSTTEF: 0,
      VRAJUSTPOS: 0,
      VRAJUSTFATURA: faturaAjuste,
      VRAJUSTVOUCHER: 0,
      VRAJUSTCONVENIO: 0,
      VRAJUSTPIX: 0,
      VRAJUSTPL: 0,
      TXT_OBS: txtObservacaoAjuste,
      VRQUEBRACAIXA: vrQuebraNova,
    }


    try {
      const response = await put('/ajuste-recebimento', putData)

      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/AJUSTE MOVIMENTO CAIXA';

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      await post('/log-web', postData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualização Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      return response.data;
    } catch (error) {

      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/ERRO AO AJUSTAR MOVIMENTO CAIXA';


      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsPost = await post('/log-web', postData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Confimar Alteração',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      return responsPost.data
    }
  }



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
          title={"Movimento de Caixa da Loja"}
          subTitle={"Ajustar Movimento de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
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
                    value={dadosDetalheFechamento[0]?.OPERADORFECHAMENTO}
                    onChangeModal={(e) => setOperadorCaixa(e.target.value)}
                    {...register("operadorCaixa", { required: true })}

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

                    label="Motivo do Ajuste"
                    value={motivoAjuste}
                    onChangeModal={(e) => setMotivoAjuste(e.target.value)}
                    {...register("motivoAjuste", { required: true })}
                  />
                </div>

              </div>
            </div>
            <div className="form-group">
              <div className="row">

                <div class="col-sm-6 col-xl-4">
                  <InputFieldModal
                    type="datetime-local"
                    className="form-control input"

                    label="Data Lançamento"
                    value={dataLancamento}
                    onChangeModal={(e) => setDataLancamento(e.target.value)}
                    {...register("dataLancamento", { required: true })}

                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">

                <div class="col-sm-6 col-xl-4">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Dinheiro Informado"
                    value={vrTotalAjusteFatura}
                    onChangeModal={(e) => setDinheiroInformado(e.target.value)}
                    {...register("dinheiroInformado", { required: true })}
                  />
                </div>
                <div class="col-sm-6 col-xl-4">
                  <InputFieldModal
                    type="text"
                    className="form-control input"

                    label="Dinheiro Ajuste"
                    value={dinheiroAjuste}
                    onChangeModal={(e) => setDinheiroAjuste(e.target.value)}
                    {...register("dinheiroAjuste", { required: true })}

                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row">
                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    value={dadosDetalheFechamento[0]?.TOTALFECHAMENTOFATURA}
                    onChangeModal={(e) => setFaturaInformada(e.target.value)}
                    label="Fatura Infrmada"
                  />

                </div>
                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    value={faturaAjuste}
                    onChangeModal={(e) => setFaturaAjuste(e.target.value)}
                    label="Fatura Ajuste"
                  />

                </div>
              </div>
            </div>


            <FooterModal
              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar={onSubmit}
              textButtonCadastrar={"Ajuste Movimentação do Caixa"}
              corCadastrar="success"

              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar="secondary"
            />


          </form>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}