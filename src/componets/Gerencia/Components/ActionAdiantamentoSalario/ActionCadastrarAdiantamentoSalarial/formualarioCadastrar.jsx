import { Fragment } from "react"
import { useForm } from "react-hook-form";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import Select from 'react-select';
import { useCadastrarAdiantamentoSalarial } from "./hooks/useCadastrarAdiantamentoSalarial";

export const FormularioCadastrar = ({handleClose, optionsModulos, usuarioLogado}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        textoMotivo,
        setTextoMotivo,
        valorDesconto,
        setValorDesconto,
        status,
        setStatus,
        dataLancamento,
        setDataLancamento,
        usuarioSelecionado,
        setUsuarioSelecionado,
        dadosFuncionarios,
        onSubmit
      } = useCadastrarAdiantamentoSalarial({handleClose, optionsModulos, usuarioLogado})

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div class="modal-body" >

                    <div class="form-group">
                        <div class="row">
                            <div class="col-sm-6 col-xl-10">
                                <InputFieldModal
                                    id="nomeempAdiantamento"
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
                            <div class="col-sm-6 col-xl-8">
                                <label className="form-label" htmlFor={""}>Funcionários</label>


                                <Select
                                    defaultValue={usuarioSelecionado}
                                    options={[
                                        { value: '', label: 'Selecione...' },
                                        ...dadosFuncionarios.map((item) => {
                                            return {
                                                value: item.ID,
                                                label: `${item.ID} - ${item.NOFUNCIONARIO}`
                                            }
                                        })]}
                                    onChange={(e) => setUsuarioSelecionado(e.value)}
                                />

                            </div>
                            <div class="col-sm-6 col-xl-4">
                                <InputFieldModal
                                    id="IDLancamento"
                                    type="date"
                                    className="form-control input"
                                    readOnly={true}
                                    label="Data Lançamento"
                                    value={dataLancamento}
                                    onChangeModal={(e) => setDataLancamento(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row">
                            <div class="col-sm-6 col-xl-12">
                                <InputFieldModal
                                    type="textarea"
                                    className="form-control input"
                                    id="txtMotivo"
                                    label="Descrição - Motivo *"
                                    value={textoMotivo}
                                    onChangeModal={(e) => setTextoMotivo(e.target.value)}
                                    {...register("txtMotivo", { required: "Campo obrigatório Informe Motivo", })}
                                />
                                {errors.txtMotivo && <span className="text-danger">{errors.txtMotivo.message}</span>}
                            </div>
                            <div class="col-sm-6 col-xl-4">
                                <InputFieldModal
                                    id="VrValorDesconto"
                                    type="text"
                                    className="form-control input"

                                    label="Valor *"
                                    placeholder="R$ 0,00"
                                    value={valorDesconto}
                                    onChangeModal={(e) => setValorDesconto(e.target.value)}
                                    {...register("valorDesconto", { required: "Campo obrigatório Informe o Valor", })}
                                />
                                {errors.valorDesconto && <span className="text-danger">{errors.valorDesconto.message}</span>}
                            </div>
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