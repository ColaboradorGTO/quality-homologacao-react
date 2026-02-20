import { Fragment } from "react"
import Select from 'react-select'
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useEditarFuncionario } from "../hooks/useEditarFuncionario"
import { Controller, useForm } from 'react-hook-form';
import { AlertError } from "../../../../Inputs/alertError"
import { mascaraCPF } from "../../../../../utils/formatCPF"
import FormField from "../../../../Formularios/FormField"
import { schema } from './schamaValidarFuncionario'

export const FormularioEditarFuncionario = ({ 
  dadosAtualizarFuncionarios, 
  handleClose,
  dadosEmpresas,
  refetchListaFuncionarios, 
  usuarioLogado, 
  optionsModulos 
}) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
    mode: "onChange"
  });

  const {
    empresaSelecionada,
    setEmpresaSelecionada,
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

  } = useEditarFuncionario({ dadosAtualizarFuncionarios, dadosEmpresas, refetchListaFuncionarios,  usuarioLogado, optionsModulos })

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        empresaFuncionario: empresaSelecionada,
      }
      await schema.validate(dadosParaValidar, { abortEarly: false });
      onSubmit();
    } catch (validationError) {
      console.error('❌ Erro de validação:', validationError);

      clearErrors();

      if (validationError.inner && validationError.inner.length > 0) {
        validationError.inner.forEach(error => {
          if (error.path) {
            setError(error.path, {
              type: 'manual',
              message: error.message
            });
          }
        });
      }

      const errorMessages = validationError.errors || [validationError.message];
      console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
    }
  }
  return (
    <Fragment>
      <form className="modal-form" onSubmit={handleSubmit(handleValidatedSubmit)}>
        <div className="form-group">

          <div className="row">
            <div className="col-sm-6 col-md-4 col-xl-4">
              <label className="form-label" htmlFor="empresaFuncionario">Loja </label>

              <Select
                closeMenuOnSelect={false}
                options={dadosEmpresas?.map((item) => ({
                  value: item.IDEMPRESA,
                  label: item.NOFANTASIA
                }))}
                value={empresaSelecionada}
                onChange={(e) => setEmpresaSelecionada(e)}
              />
              {errors.empresaFuncionario && (
                <AlertError
                  error={errors.empresaFuncionario}
                  onClose={clearErrors}
                  fieldName="empresaFuncionario"
                />
              )}
            </div>
            <div className="col-sm-6 col-md-4 col-xl-4">
              <label className="form-label" htmlFor="funcaoFuncionario">Função</label>


              <Select
                closeMenuOnSelect={false}
                options={Funcoes.map((item) => ({
                  value: item.id,
                  label: item.label

                }))}
                value={funcaoSelecionado}
                onChange={(e) => setFuncaoSelecionado(e)}
                isDisabled={true}
              />

            </div>
            <div className="col-sm-6 col-md-4 col-xl-4">
              <label className="form-label" htmlFor="tpFuncionario">Tipo</label>
              <div className="input-group">
                <Select
                  className="basic-single"
                  classNamePrefix={"select"}
                  options={tipo.map((item) => ({
                    value: item.value,
                    label: item.label

                  }))}
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e)}
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
                value={mascaraCPF(cpf)}
                onChangeModal={(e) => setCPF(e.target.value)}

              />
            </div>
            <div className="col-sm-8 col-md-8 col-xl-8">

              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="nome"
                    label={"Funcionário"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={nomeFuncionario}
                    onChangeModal={e => setNomeFuncionario(e.target.value)}
                    readOnly={true}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 col-md-6 col-xl-6">
              <Controller
                name="salarioFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="salarioFuncionario"
                    label={"Valor Salário"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={valorSalario}
                    onChangeModal={e => setValorSalario(formatarMoeda(e.target.value))}
                    readOnly={true}
                  />
                )}
              />
            </div>

            <div className="col-sm-3 col-md-6 col-xl-6">
              <Controller
                  name="valorDescontoFuncionario"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      name="valorDescontoFuncionario"
                      label={"Valor Desc."}
                      type="text"
                      errors={errors}
                      clearErrors={clearErrors}
                      value={valorDesconto}
                      readOnly={true}
                      onChangeModal={e => setValorDesconto(e.target.value)}
                    />
                  )}
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
                value={situacaoSelecionada}
                onChange={(e) => setSituacaoSelecionada(e)}
                isDisabled={true}
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
          onClickButtonConfirmar={handleValidatedSubmit}
          corConfirmar="success"

        />
      </form>
    </Fragment>
  )
}