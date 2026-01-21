import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from "react-select"
import { useAjusteDespesa } from "../hooks/useAjusteDespesa"
import { useForm } from "react-hook-form"

export const FormularioEditar = ({dadosDespesasLojaDetalhe, handleClose, usuarioLogado, optionsModulos}) => {
    const { register, handleSubmit, errors } = useForm();
    const {
        despesaSelecionada,
        dsHistorio,
        dsPagoA,
        vrDespesa,
        tpNota,
        nuNotaFiscal,
        isSubmitting,
        horarioAtual,
        onSubmit,
        handleChangeDespesa,
        handleChangeTpNota,
        setVrDespesa,
        setDespesaSelecionada,
        setDsHistorio,
        setDsPagoA,
        setTpNota,
        Options,
        dadosReceitaDespesa
    } = useAjusteDespesa({dadosDespesasLojaDetalhe, usuarioLogado, optionsModulos});

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


                        <div class="col-sm-6 col-xl-3">

                            <InputFieldModal
                                type="datetime"
                                className="form-control input"
                                readOnly={true}
                                label="Data Despesa"
                                value={usuarioLogado?.DATA_HORA_SESSAO}
                            />
                        </div>

                        <div class="col-sm-6 col-xl-3">
                            <InputFieldModal
                                type="datetime"
                                className="form-control input"
                                readOnly={true}
                                label="Hora Despesa"
                                value={horarioAtual}
                            />
                        </div>

                        <div class="col-sm-6 col-xl-6">
                            <label htmlFor="">Despesa</label>

                            <Select
                                label={"Despesa"}
                                options={dadosReceitaDespesa.map((item) => {
                                    return {
                                        value: item.IDCATEGORIARECDESP,
                                        label: `${item.IDCATEGORIARECDESP} - ${item.DSCATEGORIA}`
                                    }
                                })}
                                value={
                                    dadosReceitaDespesa
                                        .map(item => ({
                                            value: item.IDCATEGORIARECDESP,
                                            label: `${item.IDCATEGORIARECDESP} - ${item.DSCATEGORIA}`
                                        }))
                                        .find(option => option.value === despesaSelecionada?.value)
                                }
                                onChange={option => setDespesaSelecionada(option)}

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
                                readOnly={false}
                                value={dsHistorio}
                                onChangeModal={(e) => setDsHistorio(e.target.value)}
                                label="Histórico"
                            />

                        </div>

                        <div class="col-sm-6 col-xl-6">
                            <InputFieldModal
                                id="TXTMotivo"
                                type="text"
                                className="form-control input"
                                readOnly={false}
                                value={dsPagoA}
                                onChangeModal={(e) => setDsPagoA(e.target.value)}
                                label="Pago á"
                            />

                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-sm-6 col-xl-4">
                            <label htmlFor="">Tipo Nota</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                options={Options.map((item) => {
                                    return { value: item.value, label: item.label }
                                })}
                                value={Options.find(option => option.value === tpNota?.value)}
                                onChange={(e) => setTpNota(e.value)}
                                name="color"
                            />

                        </div>
                        <InputFieldModal
                            id="vrValorDesconto"
                            type="text"
                            className="form-control input"
                            value={vrDespesa}
                            onChangeModal={(e) => setVrDespesa(e.target.value)}
                            label="Valor Despesa"
                            placeholder="R$ 0,00"
                        />
                    </div>
                </div>

                <FooterModal


                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={() => { }}
                    textButtonCadastrar={"Editar Despesa"}
                    corCadastrar={"success"}
                    disabled={isSubmitting}
                />
            </form>


        </Fragment>
    )
}