import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { useCadastrarValeTransporte } from "../hooks/useCadastrarValeTransporte";


export const FormularioCadastrar = ({ handleClose, usuarioLogado, optionsModulos }) => {
    const { register, handleSubmit, errors } = useForm();
    const {
        onSubmit,
        dsHistorio,
        setDSHistorio,
        dsPagoA,
        setDsPagoA,
        vrDespesa,
        setVrDespesa,
        horarioAtual,
        dtDespesa,
        setDtDespesa,
        usuarioSelecionado,
        setUsuarioSelecionado,
        dadosFuncionarios
    } = useCadastrarValeTransporte({ handleClose, usuarioLogado, optionsModulos });
    return (


        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)} >

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
                                label="Data do Vale"
                                value={usuarioLogado?.DATA_HORA_SESSAO}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="time"
                                className="form-control input"
                                readOnly={true}
                                label="Hora do Vale"
                                value={horarioAtual}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={true}
                                label="Despesa"
                                onChangeModal={(e) => setDsPagoA(e.target.value)}
                                value={"248 - Pgto Vale Transporte"}
                            // value={`${dadosFuncionarios[0].IDCATEGORIARECDESP} - ${dadosReceitaDespesas[2].DSCATEGORIA}`}
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
                                onChangeModal={(e) => setDSHistorio(e.target.value)}
                                label="Histórico"
                            />

                        </div>

                        <div class="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Funcionário</label>
                            <Select
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosFuncionarios.map((item) => {
                                        return {
                                            value: item.ID,
                                            label: `${item.ID} - ${item.NOFUNCIONARIO}`
                                        }
                                    })]}
                                value={usuarioSelecionado}
                                onChange={(e) => setUsuarioSelecionado(e.value)}
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
                                label="Valor do Vale Transporte"
                                value={vrDespesa}
                                onChangeModal={(e) => setVrDespesa(e.target.value)}
                                placeholder="R$ 0,00"
                            />

                        </div>
                    </div>
                </div>

                <FooterModal
                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={""}
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