import { Fragment, useState } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { useEditarFuncionario } from "../hooks/useEditarFuncionario";
import { mascaraCPF } from "../../../../../utils/formatCPF";
import { addDays, format, subDays } from "date-fns";

export const FormularioEditar = ({ handleClose, dadosAtualizarFuncionarios }) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    empresaSelecionada,
    setEmpresaSelecionada,
    subGrupoEmpresarialSelecionado,
    setSubGrupoEmpresarialSelecionado,
    funcaoSelecionada,
    setFuncaoSelecionada,
    cpfFuncionario,
    setCPFFuncionario,
    nomeFuncionario,
    setNomeFuncionario,
    localizacaoSelcionada,
    setLocalizacaoSelecionada,
    categoriaContratacao,
    setCategoriaContratacao,
    dataAdmissao,
    setDataAdmissao,
    valorSalario,
    setValorSalario,
    valorDesconto,
    setValorDesconto,
    situacaoSelecionada,
    setSituacaoSelecionada,
    tipoSelecionado,
    setTipoSelecionado,
    isChecked,
    setIsChecked,
    senha,
    setSenha,
    repitaSenha,
    setRepitaSenha,
    cpf,
    setCPF,
    excecao,
    setExcecao,
    formularioVisivelLogin,
    setFormularioVisivelLogin,
    formularioVisivel,
    setFormularioVisivel,
    usuario,
    setUsuario,
    optionsEmpresas,
    handleRadioChange,
    handleChangeEmpresa,
    Funcoes,
    localizacao,
    situacao,
    Parceiro,
    onSubmit,
    loginConfirmacao
  } = useEditarFuncionario({ handleClose, dadosAtualizarFuncionarios });

  const maxDataAdmissao = format(new Date(), "yyyy-MM-dd");
      const minDataAdmissao = format(subDays(new Date(), 45), "yyyy-MM-dd");
  return (
    <Fragment>
      {formularioVisivel && (
        <Fragment>
          <form onSubmit={onSubmit} >

            <div className="row form-group">
              <div className="col-sm-6 col-md-6 col-xl-6">
                <label className="form-label" htmlFor="empresaFuncionario">Loja </label>


                <Select

                  closeMenuOnSelect={false}
                  options={optionsEmpresas.map((item) => ({
                    value: item.IDEMPRESA,
                    label: item.NOFANTASIA
                  }))}
                  value={optionsEmpresas.find(option => option.value == empresaSelecionada)}
                  onChange={(selectedOption) => { setEmpresaSelecionada(selectedOption?.value) }}
                />

              </div>
              <div className="col-sm-6 col-md-6 col-xl-6">
                <label className="form-label" htmlFor="funcaoFuncionario">Função</label>


                <Select
                  closeMenuOnSelect={false}
                  options={Funcoes.map((item) => ({
                    value: item.id,
                    label: item.label

                  }))}
                  value={Funcoes.find(option => option.value == funcaoSelecionada)}
                  onChange={(e) => setFuncaoSelecionada(e.value)}
                />
              </div>
            </div>

            <div className="row form-group">

              <div className="col-sm-6 col-md-6 col-xl-6 ">
                <label className="form-label" htmlFor="tpFuncionario">Tipo</label>

                <Select
                  className="basic-single"
                  classNamePrefix={"select"}
                  options={Parceiro.map((item) => ({
                    value: item.value,
                    label: item.label

                  }))}
                  value={Parceiro.find(option => option.value == tipoSelecionado)}
                  onChange={(e) => setTipoSelecionado(e.value)}
                />


              </div>

              <div className="col-sm-6 col-md-6 col-xl-6 " >

                <InputFieldModal
                  type="date"
                  className="form-control input"
                  placeholder={"0,00"}
                  label="Data Admissão"
                  value={dataAdmissao}
                  onChangeModal={(e) => setDataAdmissao(e.target.value)}
                  min={minDataAdmissao}
                  max={maxDataAdmissao}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-sm-4 col-md-4 col-xl-4">
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  label="CPF"
                  value={mascaraCPF(cpf)}
                  onChangeModal={(e) => setCPF(e.target.value)}

                />
              </div>
              <div className="col-sm-8 col-md-8 col-xl-8">
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  label="Funcionário"
                  value={nomeFuncionario}
                  onChangeModal={(e) => setNomeFuncionario(e.target.value)}

                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-sm-6 col-md-6 col-xl-6">
                <label htmlFor="">Localização</label>
                <Select
                  className="basic-single"
                  classNamePrefix={"select"}
                  options={localizacao.map((item) => ({
                    value: item.value,
                    label: item.label

                  }))}
                  value={localizacao.find(option => option.value == localizacaoSelcionada)}
                  onChange={(e) => setLocalizacaoSelecionada(e.value)}
                />
              </div>

              <div className="col-sm-6 col-md-6 col-xl-6">
                <label className="form-label">Categoria de Contratação</label>
                <div className="form-check">
                  <label className="form-check-label" htmlFor="radioCLT">
                    <input
                      id="radioCLT"
                      type="radio"
                      checked={categoriaContratacao === "CLT"}
                      className="form-check-input"
                      name="radioCategoria"
                      onChange={handleRadioChange}
                    /> CLT
                  </label>
                  <label className="form-check-label" htmlFor="radioPJ">
                    <input
                      id="radioPJ"
                      type="radio"
                      checked={categoriaContratacao === "PJ"}
                      className="form-check-input"
                      name="radioCategoria"
                      onChange={handleRadioChange}
                    /> PJ
                  </label>
                </div>

              </div>
            </div>


            <div className="row form-group" >
              <div className="col-sm-3 col-md-4 col-xl-4 " >
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  placeholder={"0,00"}
                  label="% Desc. Conv."
                  value={valorDesconto}

                  onChangeModal={(e) => setValorDesconto(e.target.value)}

                />
              </div>
              <div className="col-sm-3 col-md-4 col-lg-4 mb-2"  >
                <label className="form-label" >Execeção de Desconto</label>
                <div className="form-check" style={{}}>

                  <input
                    id="excecaoDesconto"
                    type="checkbox"
                    className="form-check-input"
                    name="radioDesconto"
                    checked={isChecked}
                    onChange={() => { setFormularioVisivelLogin(true), setFormularioVisivel(false) }}
                  />


                </div>

              </div>
            </div>

            <div className="row form-group">


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
                  label="Valor Desc."
                  value={valorDesconto}
                  onChangeModal={(e) => setValorDesconto(e.target.value)}

                />
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-3 col-md-3 col-xl-2">


                  <InputFieldModal
                    type={"password"}
                    className="form-control input"
                    label="Senha"
                    value={senha}
                    onChangeModal={(e) => setSenha(e.target.value)}

                  />
                </div>
                <div className="col-sm-4 col-md-4 col-xl-4">

                  <InputFieldModal
                    type={"password"}
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
                    value={situacaoSelecionada}
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
      )}

      {formularioVisivelLogin && (
        <Fragment>

          <header style={{ display: 'flex', width: '100%' }}>

            <h1 style={{ textAlign: 'center', width: '100%' }}>Autorização</h1>
          </header>
          <div className="form-group" style={{ marginTop: '2rem' }}>
            <div className="row">
              <div className="col-sm-4 col-md-4 col-xl-4">

                <InputFieldModal
                  type="text"
                  className="form-control input"
                  label="Matrícula"
                  value={usuario}
                  onChangeModal={(e) => setUsuario(e.target.value)}
                  placeholder={"Digite sua matrícula"}
                />
              </div>

              <div className="col-sm-4 col-md-4 col-xl-4">

                <InputFieldModal
                  type="password"
                  className="form-control input"
                  label="Senha"
                  value={senha}
                  onChangeModal={(e) => setSenha(e.target.value)}
                  placeholder={"Digite sua senha"}
                />
              </div>
            </div>
            <div className="row mt-4">
              <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Voltar"}
                onClickButtonFechar={() => { setFormularioVisivel(true), setFormularioVisivelLogin(false) }}
                corFechar="secondary"

                ButtonTypeCadastrar={ButtonTypeModal}
                textButtonCadastrar={"Confirmar"}
                onClickButtonCadastrar={loginConfirmacao}
                corCadastrar="success"

              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}