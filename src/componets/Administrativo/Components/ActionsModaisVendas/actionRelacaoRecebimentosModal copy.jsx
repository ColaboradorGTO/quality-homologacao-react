import { Fragment, useState } from "react"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { ButtonSalvar } from "../../../ButtonsTabela/ButtonSalvar";
import { ButtonType } from "../../../Buttons/ButtonType";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";

export const ActionRelacaoRecebimentosModal = ({ dadosPagamentoModal, show, handleClose }) => {
  const [incluirCartao2, setIncluirCartao2] = useState(false);
  const [incluirCartao3, setIncluirCartao3] = useState(false);
  const [incluirPos2, setIncluirPos2] = useState(false);

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"

        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <div className="" role="document">

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Recebimentos da Venda"}
            handleClose={handleClose}
          />

          <Modal.Body>


              <div className="pt-5">
                <hr/>
              </div>
            <form action="">
              <div class="form-group">
                <div class="row">

                  <div class="col-sm-6 col-md-3 col-xl-4">
                    <InputFieldModal
                      className="form-control input"
                      readOnly={true}
                      label="Restante a Distribuir (menos Voucher)"
                      value={''}
                    />
                  </div>
                  
                </div>
                <div class="row mt-4">

                  <div class="col-sm-3 col-md-3 col-xl-4">
                    
                    <InputFieldModal
                      className="form-control input"
                      
                      label="Valor Dinheiro"
                      value={''}
                    />
                  </div>
                </div>
                <hr/>

              </div>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-2 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Valor PIX"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-9">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Nº Chave PIX"
                        value={''}
                      />
                    </div>

                  </div>
                  <hr/>

                </div>

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Descrição Cartão TEF"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="NSU_CTF"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Nº Autorização"
                        value={''}
                      />
                    </div>

                  </div>

                </div>
                <hr/>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Valor Cartão"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Qtd Parcelas"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        label="Data 1ª Parcela"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <ButtonType
                        cor={'success'}
                        textButton={'Incluir Cartão 2'}
                        onClickButtonType={() => console.log('teste')}
                      />
                    </div>

                  </div>

                </div>

                <hr/>
                
                {/* Início Cartão 2 */}
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Descrição Cartão TEF 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="NSU_CTF 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Nº Autorização 2"
                        value={''}
                      />
                    </div>

                  </div>

                </div>
                <hr/>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Valor Cartão 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Qtd Parcelas 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        label="Data 1ª Parcela 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <ButtonType
                        cor={'success'}
                        textButton={'Incluir Cartão 3'}
                        onClickButtonType={() => console.log('teste')}
                      />
                    </div>

                  </div>

                </div> 
                <hr/>
               
                {/* Fim Cartão 2 */}
                
                {/* Início Cartão 3 */}
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Descrição Cartão TEF 3"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="NSU_CTF 3"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Nº Autorização 3"
                        value={''}
                      />
                    </div>

                  </div>

                </div>
                <hr/>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Valor Cartão 3"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Qtd Parcelas 3"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        label="Data 1ª Parcela 3"
                        value={''}
                      />
                    </div>

                  </div>

                </div> 
                <hr/>
               
                {/* Fim Cartão 3 */}

                {/* Início POS  */}

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Descrição POS"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="NSU_CTF "
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Nº Autorização "
                        value={''}
                      />
                    </div>

                  </div>

                </div>

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                    
                        label="Valor POS"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                      
                        label="Qtd Parcelas"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        label="Data 1ª Parcela"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <ButtonType 
                        cor={'success'}
                        textButton={'Incluir + POS'}
                        onClickButtonType={() => console.log('teste')}
                      />
                    </div>

                  </div>

                </div>

                {/* Fim POS  */}
                <hr/>

                {/* Início POS  2*/}

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Descrição POS 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="NSU_CTF 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Nº Autorização 2"
                        value={''}
                      />
                    </div>

                  </div>

                </div>

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                    
                        label="Valor POS 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                      
                        label="Qtd Parcelas 2"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        label="Data 1ª Parcela 2"
                        value={''}
                      />
                    </div>
                  

                  </div>

                </div>

                {/* Fim POS  2*/}
                
                <hr/>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-4 col-xl-4">

                      <InputFieldModal
                        className="form-control input"
                        readOnly={true}
                        label="Valor Voucher"
                        value={''}
                      />
                    </div>
                    <div class="col-sm-6 col-md-4 col-xl-4">

                      <InputFieldModal
                        className="form-control input"
                        readOnly={true}
                        label="Nº Voucher"
                        value={''}
                      />
                    </div>
                 

                  </div>

                </div>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-12">

                      <InputFieldModal
                        className="form-control input"
                        
                        label="Motivo da Alteração"
                        value={''}
                      />
                    </div>
                 
                 

                  </div>

                </div>
             
            </form>
          </Modal.Body>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}
            corFechar={"secondary"}
          
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={''}
            textButtonCadastrar={"Finalizar Alteração de Pagamentos"}
            corCadastrar={"success"}
          />
        </div>
      </Modal>
    </Fragment>
  )
}