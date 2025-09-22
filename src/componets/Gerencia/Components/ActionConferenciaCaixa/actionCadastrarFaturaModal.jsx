import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { post } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import Swal from "sweetalert2";
import axios from "axios";
import { getDataHoraAtual } from "../../../../utils/horaAtual";


export const ActionCadastrarFaturaModal = ({ show, handleClose, dadosDetelheFatura, usuarioLogado, optionsModulos }) => {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const [empresa, setEmpresa] = useState('')
  const [codAutorizacao, setCodAutorizacao] = useState('')
  const [valorFatura, setValorFatura] = useState(0)
  const [numeroMovimento, setNumeroMovimento] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')
  const [horaAtual, setHoraAtual] = useState('')

  const navigate = useNavigate();

  useEffect(() => { 
    const data = getDataHoraAtual()
    setHoraAtual(data)
  }, [])

  useEffect(() => {
    getIPUsuario();
  }, []);
 
  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if(response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }


  const onSubmit = async (data) => {
    if(optionsModulos[0]?.CRIAR == 'False') {
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

    if (!codAutorizacao || !valorFatura) {
      Swal.fire({
      title: 'Error',
      text: 'Preencha os campos obrigatórios',
      icon: 'error',
      timer: 3000,
      customClass: {
        container: 'custom-swal',
      }
      });
      return;
    }
    const postData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDFUNCIONARIO: dadosDetelheFatura[0].IDOPERADORFECHAMENTO,
      IDDETALHEFATURALOCAL: null,
      IDCAIXAWEB: dadosDetelheFatura[0].IDCAIXAFECHAMENTO,
      IDCAIXALOCAL: null,
      NUESTABELECIMENTO: '',
      NUCARTAO: '',
      DTPROCESSAMENTO: dadosDetelheFatura[0].DTABERTURAMOVCAIXA,
      HRPROCESSAMENTO: horaAtual,
      NUNSU: '',
      NUNSUHOST: '',
      IDMOVIMENTOCAIXAWEB: dadosDetelheFatura[0].ID,
      NUCODAUTORIZACAO: codAutorizacao,
      VRRECEBIDO: valorFatura,
      DTHRMIGRACAO: '',
      STCANCELADO: 'False',
      IDUSRCACELAMENTO: null,
    }


    
    try {
        const response = await post('/criar-detalhe-fatura', postData)
  
        const textDados = JSON.stringify(postData)
        let textoFuncao = 'GERENCIA/AJUSTE MOVIMENTO CAIXA';
              
        const createData = {
          IDFUNCIONARIO: String(usuarioLogado.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario
        }
        
        await post('/log-web', createData)
        
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
        
        const textDados = JSON.stringify(postData)
        let textoFuncao = 'GERENCIA/ERRO AO AJUSTAR MOVIMENTO CAIXA';
        
        const createData = {
          IDFUNCIONARIO: String(usuarioLogado.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario
        }
        
        const responsePost = await post('/log-web', createData)
        Swal.fire({
          title: 'Cadastro',
          text: 'Erro ao Tentar Confimar Alteração',
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



  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Dados da Fatura da Loja"}
          subTitle={"Recebimento de Faturas da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} >

            <div class="form-group">
              <div class="row">

                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Empresa"
                    value={usuarioLogado?.NOFANTASIA}
                    onChangeModal={(e) => setEmpresa(e.target.value)}
                    {...register("empresa", { required: true })}

                  />

                </div>
                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nº Movimento do Caixa"
                    value={dadosDetelheFatura[0]?.ID}
                    onChangeModal={(e) => setNumeroMovimento(e.target.value)}
                    {...register("numeroMovimento", { required: true })}

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
    
                    label="Código Autorização"
                    value={codAutorizacao}
                    onChangeModal={(e) => setCodAutorizacao(e.target.value)}
                    {...register("codAutorizacao", { required: true })}
                  />
                   {errors.codAutorizacao && (
                      <span className="text-danger">Qual o Código de Autorização</span>
                    )}
                </div>
                <div class="col-sm-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                   
                    label="Valor Fatura"
                    value={valorFatura}
                    onChangeModal={(e) => setValorFatura(e.target.value)}
                    {...register("valorFatura", { required: true })}

                  />
                   {errors.valorFatura && (
                      <span className="text-danger">Qual Valor da Fatura</span>
                    )}
                </div>
              </div>
            </div>

            <FooterModal
              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar={onSubmit}
              textButtonCadastrar={"Receber Fatura"}
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