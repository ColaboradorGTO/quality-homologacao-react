import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { useCadastrarDespesas } from "../hooks/useCadastrarDespesas";

export const FormularioCadastrar = ({ handleClose, optionsModulos, usuarioLogado }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        despesaSelecionada,
        setDespesaSelecionada,
        dsHistorio,
        setDSHistorio,
        dsPagoA,
        setDsPagoA,
        vrDespesa,
        setVrDespesa,
        hora,
        setHora,
        dtDespesa,
        setDtDespesa,
        dadosReceitaDespesa,
        Options,
        setTpNota,
        tpNota,
        setNuNotaFiscal,
        nuNotaFiscal,
        onSubmit

    } = useCadastrarDespesas({ handleClose, optionsModulos, usuarioLogado })

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-10">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Empresa"
                                value={usuarioLogado?.NOFANTASIA}
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
                                label="Data Despesa"
                                value={usuarioLogado?.DATA_HORA_SESSAO}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="datetime"
                                className="form-control input"
                                readOnly={true}
                                label="Hora Despesa"
                                value={hora}
                            />
                        </div>

                        <div class="col-sm-6 col-xl-4 ">
                            <label className="form-label" htmlFor={""}>Despesa</label>
                            <Select

                                label={"Despesa"}
                                options={dadosReceitaDespesa.map((item) => ({
                                    value: item.IDCATEGORIARECDESP,
                                    label: `${item.IDCATEGORIARECDESP} - ${item.DSCATEGORIA}`
                                }))}
                                value={despesaSelecionada}
                                onChange={(e) => setDespesaSelecionada(e.value)}

                            />
                            {/* {errors.despesa && (
        <span className="text-danger">Selecione a Despesa</span>
      )} */}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="text"
                                id={"historico"}
                                label="Histórico"
                                className="form-control input"
                                readOnly={false}
                                value={dsHistorio}
                                onChangeModal={(e) => setDSHistorio(e.target.value)}
                                {...register("historico", { required: "Campo obrigatório Informe o Histórico", })}
                            />
                            {/* {errors.historico && (
        <span className="text-danger">Informe o Histórico</span>
      )} */}
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <InputFieldModal
                                id="pagoa"
                                type="text"
                                className="form-control input"
                                readOnly={false}
                                value={dsPagoA}
                                onChangeModal={(e) => setDsPagoA(e.target.value)}
                                {...register("pagoa", { required: "Campo obrigatório Informe a Quem foi Pago", })}
                                label="Pago á"
                            />
                            {/* {errors.pagoa && (
        <span className="text-danger">Informe a quem foi Pago</span>
      )} */}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-4">
                            <label htmlFor="">Tipo Nota</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={Options[0]}
                                value={tpNota}
                                onChange={(e) => setTpNota(e.value)}
                                name="color"
                                options={Options}
                            />
                            {/* {errors.tipoNota && (
          <span className="text-danger">Selecione o Tipo de Nota</span>
        )} */}
                        </div>
                        <div class="col-sm-6 col-xl-6">

                            <InputFieldModal
                                id="VrValorDesconto"
                                placeholder="R$ 0,00"
                                label="Valor Despesa"
                                type="text"
                                className="form-control input"
                                readOnly={false}
                                value={vrDespesa}
                                onChangeModal={(e) => setVrDespesa(e.target.value)}
                                {...register("vrDespesa", { required: true })}
                            />
                            {/* {errors.vrDespesa && (
        <span className="text-danger">Adicione um valor para despesa</span>
      )} */}

                        </div>
                    </div>
                </div>

                <FooterModal
                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={onSubmit}
                    textButtonCadastrar={"Cadastrar"}
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