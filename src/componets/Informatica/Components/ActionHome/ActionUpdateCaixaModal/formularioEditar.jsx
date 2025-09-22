import React, { Fragment } from "react"
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { useAtualizaCaixa } from "../hooks/useAtualizaCaixa";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";


export const FormularioEditar = ({show, handleClose, dadosListaCaixa}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        empresa,
        setEmpresa,
        dsCaixa,
        setDSCaixa,
        tipoEmissao,
        setTipoEmissao,
        modeloImpressora,
        setModeloImpressora,
        portaComunicacao,
        setPortaComunicacao,
        numeroSerieProducao,
        setNumeroSerieProducao,
        numeroUltimaNFCeProducao,
        setNumeroUltimaNFCeProducao,
        tef,
        setTef,
        statusSelecionado,
        setStatusSelecionado,
        statusLimpar,
        setStatusLimpar,
        dataAlteracao,
        setDataAlteracao,
        usuarioLogado,
        atualizacaoDiario,
        optionsNota,
        optionsImpressoras,
        onSubmit
    } = useAtualizaCaixa({dadosListaCaixa})

  return (

    <Fragment>
       
        <form  onSubmit={handleSubmit(onSubmit)}>

            <div className="form-group">

              <div className="row">
                <div className="col-sm-6 col-md-6 col-xl-6">
                
                  <InputFieldModal 
                    type="text"
                    className="form-control input"
                    label="Empresa"
                    readOnly={false}
                    value={empresa}
                    onChangeModal={(e) => setEmpresa(e.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-6 col-xl-6">
                  <InputFieldModal 
                    type="text"
                    className="form-control input"
                    label="Nº - Descrição do Caixa"
                    readOnly={false}
                    value={dsCaixa}
                    onChangeModal={(e) => setDSCaixa(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-md-12 col-xl-12">
                  <div className="alert alert-primary" role="alert"><strong>Controles Fiscais</strong></div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-3 col-xl-3">
                  <label className="form-label" htmlFor="tipemissao">Tipo de Emissão da Nota</label>

                  <Select
                    closeMenuOnSelect={false}
                    options={optionsNota.map((item) => {
                      return {
                        value: item.value, 
                        label: item.label
                      };
                    })}
                    value={optionsNota.find(option => option.value === tipoEmissao)}
                    onChange={(selectedOption) => setTipoEmissao(selectedOption?.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-4 col-xl-4">
                  <label className="form-label" htmlFor="modimpressao">Modelos de Impressoras</label>
                
                  <Select
                      closeMenuOnSelect={false}
                      options={optionsImpressoras.map((item) => {
                        return {
                          value: item.value, 
                          label: item.label
                        };
                      })}
                      value={optionsImpressoras.find(option => option.value === modeloImpressora)}
                      onChange={(selectedOption) => setModeloImpressora(selectedOption?.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal 
                    type="text"
                    className="form-control input"
                    label="Porta Comunicação"
                    readOnly={false}
                    value={portaComunicacao}
                    onChangeModal={(e) => setPortaComunicacao(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal 
                    type="text"
                    className="form-control input"
                    readOnly={false}
                    label="Nº Série Produção"
                    value={numeroSerieProducao}
                    onChangeModal={(e) => setNumeroSerieProducao(e.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal 
                    type="text"
                    className="form-control input"
                    readOnly={false}
                    value={numeroUltimaNFCeProducao}
                    onChangeModal={(e) => setNumeroUltimaNFCeProducao(e.target.value)}
                    label="Nº Última NFCe Produção"
                  />
                </div>
                <div className="col-sm-6 col-md-2 col-xl-2">
                  <label className="form-label" htmlFor="sttef">TEF</label>
      
                  <Select
                     closeMenuOnSelect={false}
                     options={atualizacaoDiario.map((item) => {
                       return {
                         value: item.value, 
                         label: item.label
                       };
                     })}
                     value={atualizacaoDiario.find(option => option.value === tef)}
                     onChange={(selectedOption) => setTef(selectedOption?.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-2 col-xl-2">
                  <label className="form-label" htmlFor="statualiza">Atualizar</label>
                  <Select
                     closeMenuOnSelect={false}
                     options={atualizacaoDiario.map((item) => {
                       return {
                         value: item.value, 
                         label: item.label
                       };
                     })}
                     value={atualizacaoDiario.find(option => option.value === statusSelecionado)}
                     onChange={(selectedOption) => setStatusSelecionado(selectedOption?.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-2 col-xl-2">
                  <label className="form-label" htmlFor="stlimpa">Limpar</label>
              
                  <Select
                     closeMenuOnSelect={false}
                     options={atualizacaoDiario.map((item) => {
                       return {
                         value: item.value, 
                         label: item.label
                       };
                     })}
                     value={atualizacaoDiario.find(option => option.value === statusLimpar)}
                     onChange={(selectedOption) => setStatusLimpar(selectedOption?.value)}
                  />
                </div>
              </div>
            </div>
      
            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                textButtonCadastrar={"Atualizar"}
                onClickButtonCadastrar={onSubmit}
                corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </form>
    </Fragment>
  )
}                      