import { Fragment } from "react"
import Select from 'react-select'
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useEditarFuncionario } from "../hooks/useEditarFuncionario"
import { useForm } from 'react-hook-form';

export const FormularioEditarFuncionario = ({ dadosAtualizarFuncionarios, handleClose }) => {
    const { register, handleSubmit, errors } = useForm();
    
    const  {
        empresaSelecionada,
        setEmpresaSelecionada,
        optionsEmpresas,
        funcaoSelecionado,
        setFuncaoSelecionado,
        Funcoes,
        tipoSelecionado,
        setTipoSelecionado,
        tipo,
        cpf,
        setCPF,
        nomeFuncionario,
        setNomeFuncionario,
        valorSalario,
        setValorSalario,
        valorDesconto,
        setValorDesconto,
        senha,
        setSenha,
        repitaSenha,
        setRepitaSenha,
        situacao,
        situacaoSelecionada,    
        setSituacaoSelecionada,
        onSubmit

    } = useEditarFuncionario({dadosAtualizarFuncionarios}) 

    return (
        <Fragment>
              <form >
                <div className="form-group">

                  <div className="row">
                    <div className="col-sm-6 col-md-4 col-xl-4">
                      <label className="form-label" htmlFor="empresaFuncionario">Loja </label>
                 

                        <Select

                          closeMenuOnSelect={false}
                          options={optionsEmpresas.map((item) => ({
                            value: item.IDEMPRESA,
                            label: item.NOFANTASIA
                          }))}
                          value={optionsEmpresas.find((option) => option.value === empresaSelecionada)}
                          onChange={(selectedOption) => { setEmpresaSelecionada(selectedOption?.value) }}
                        />
                    
                    </div>
                    <div className="col-sm-6 col-md-4 col-xl-4">
                      <label className="form-label" htmlFor="funcaoFuncionario">Função</label>


                      <Select
                        closeMenuOnSelect={false}
                        options={Funcoes.map((item) => ({
                          value: item.id,
                          label: item.label

                        }))}
                        value={Funcoes.find(option => option.label === funcaoSelecionado)}
                        onChange={(e) => setFuncaoSelecionado(e.value)}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-sm-6 col-md-4 col-xl-4 ">
                      <label className="form-label" htmlFor="tpFuncionario">Tipo</label>
                      <div className="input-group">
                        <Select
                          className="basic-single"
                          classNamePrefix={"select"}
                          options={tipo.map((item) => ({
                            value: item.value,
                            label: item.label

                          }))}
                          defaultValue={tipo.find(option => option.value === tipoSelecionado)}
                          onChange={(e) => setTipoSelecionado(e.value)}
                          isDisabled={true}
                        />

                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-4 col-md-4 col-xl-4">
                      <InputFieldModal
                        type="text"
                        className="form-control input"
                        readOnly={true}
                        label="CPF"
                        value={cpf}
                        onChangeModal={(e) => setCPF(e.target.value)}

                      />
                    </div>
                    <div className="col-sm-8 col-md-8 col-xl-8">
                      <InputFieldModal
                        type="text"
                        className="form-control input"
                        readOnly={true}
                        label="Funcionário"
                        value={nomeFuncionario}
                        onChangeModal={(e) => setNomeFuncionario(e.target.value)}

                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-3 col-md-6 col-xl-6">
                      <InputFieldModal
                        type="text"
                        className="form-control input"
                        label="Valor Salário"
                        value={valorSalario}
                        onChangeModal={(e) => setValorSalario(e.target.value)}
                      />
                    </div>

                    <div className="col-sm-3 col-md-6 col-xl-6">
                      <InputFieldModal
                        type="text"
                        className="form-control input"
                        readOnly={true}
                        label="Valor Desconto"
                        value={valorDesconto}
                        onChangeModal={(e) => setValorDesconto(e.target.value)}

                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-3 col-md-3 col-xl-">
                      <InputFieldModal
                        type="password"
                        className="form-control input"
                        label="Senha"
                        value={senha}
                        onChangeModal={(e) => setSenha(e.target.value)}

                      />
                    </div>
                    <div className="col-sm-4 col-md-4 col-xl-4">
                      <InputFieldModal
                        type="password"
                        className="form-control input"
                        label="Repita Senha"
                        value={repitaSenha}
                        onChangeModal={(e) => setRepitaSenha(e.target.value)}

                      />
                    </div>
                    <div className="col-sm-4 col-md-4 col-xl-4">
                      <label className="form-label" htmlFor="stativofuncionario">Situação</label>

                      <Select
                        className="basic-single"
                        classNamePrefix={"select"}
                        options={situacao.map((item) => ({
                          value: item.value,
                          label: item.label
                        }))}
                        defaultValue={situacao.find(option => option.value === situacaoSelecionada)}
                        onChange={(e) => setSituacaoSelecionada(e.value)}

                      />
                    </div>
                  </div>
                </div>
                <FooterModal
                  ButtonTypeFechar={ButtonTypeModal}
                  textButtonFechar={"Fechar"}
                  onClickButtonFechar={handleClose}
                  corFechar="secondary"

                  ButtonTypeConfirmar={ButtonTypeModal}
                  textButtonConfirmar={"Atualizar"}
                  onClickButtonConfirmar={handleSubmit(onSubmit)}
                  corConfirmar="success"

                />
              </form>
            </Fragment>
    )
}