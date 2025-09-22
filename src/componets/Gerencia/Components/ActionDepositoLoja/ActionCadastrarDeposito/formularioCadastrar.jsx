import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { useCadastroDeposito } from "../hooks/useCadastrarDeposito";

export const FormularioCadastrar = ({ handleClose, optionsModulos, usuarioLogado }) => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const {
        dsHistorio,
        setDSHistorio,
        numeroDocDeposito,
        setNumeroDocDeposito,
        valorDeposito,
        setValorDeposito,
        contaBancoSelecionada,
        setContaBancoSelecionada,
        horarioAtual,
        setHorarioAtual,
        hora,
        setHora,
        data,
        setData,
        dataMovCaixa,
        setDataMovCaixa,
        dadosContaBanco,
        onSubmit,
    } = useCadastroDeposito({ handleClose,optionsModulos, usuarioLogado });
    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-xl-10">

                            <InputFieldModal
                                label={"Empresa"}
                                type="text"
                                readOnly={true}
                                value={usuarioLogado?.NOFANTASIA}
                                onChangeModal={(e) => setEmpresa(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">

                            <InputFieldModal

                                type="date"
                                label={"Data Depósito"}
                                value={data}
                                onChangeModal={(e) => setData(e.target.value)}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <InputFieldModal
                                label={"Hora Depósito"}
                                type="datetime-local"
                                value={hora}
                                onChangeModal={(e) => setHora(e.target.value)}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6 ">
                            <label className="form-label" htmlFor={""}>Conta</label>
                            <Select
                                options={[
                                    // { value: '', label: 'Selecione uma conta' },
                                    ...dadosContaBanco.map((item) => {
                                        return {
                                            value: item.IDBANCO,
                                            label: item.DSCONTABANCO
                                        }

                                    })
                                ]}
                                defaultValue={contaBancoSelecionada}
                                onChange={(e) => setContaBancoSelecionada(e.value)}
                            />

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-8">

                            <InputFieldModal
                                label={"Histórico"}
                                type="text"
                                readOnly={false}
                                value={dsHistorio}
                                onChangeModal={(e) => setDSHistorio(e.target.value)}
                                {...register("historico", { required: "Campo obrigatório Informe o Histórico", })}
                            />
                            {errors.historico && <span className="text-danger">{errors.historico.message}</span>}
                        </div>
                        <div className="col-sm-6 col-xl-4">

                            <InputFieldModal
                                label={"Nº Doc Depósito"}
                                type="text"
                                readOnly={false}
                                onChangeModal={(e) => setNumeroDocDeposito(e.target.value)}
                                value={numeroDocDeposito}
                                {...register("docDeposito", { required: "Campo obrigatório Informe o Nº Doc Depósito", })}
                            />
                            {errors.docDeposito && <span className="text-danger">{errors.docDeposito.message}</span>}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-4">

                            <InputFieldModal
                                label={"Valor Depósito"}
                                type="number"
                                value={valorDeposito}
                                onChangeModal={(e) => {
                                    const valor = e.target.value.replace(".", "").replace(",", ".");
                                    setValorDeposito(valor)
                                }}
                                {...register("vrDeposito", { required: "Campo obrigatório Informe o Valor do Depósito" })}
                                readOnly={false}
                            />
                            {errors.vrDeposito && <span className="text-danger">{errors.vrDeposito.message}</span>}
                        </div>
                        <div className="col-sm-6 col-xl-4">

                            <InputFieldModal
                                label={"Data Movimento de Caixa"}
                                type="date"
                                value={dataMovCaixa}
                                onChangeModal={(e) => setDataMovCaixa(e.target.value)}
                                {...register("dtMovimentoCaixa", { required: "Campo obrigatório Informe a Data Movimento", })}
                                readOnly={false}
                            />
                            {errors.dtMovimentoCaixa && <span className="text-danger">{errors.dtMovimentoCaixa.message}</span>}
                        </div>
                        <div className="col-sm-6 col-xl-4 ">

                            <InputFieldModal
                                label={"Hora Movimento de Caixa"}
                                type="time"
                                value={horarioAtual}
                                onChangeModal={(e) => setHorarioAtual(e.target.value)}
                                {...register("hrMovimentoCaixa", { required: "Campo obrigatório Informe a Hora Movimento", })}
                                readOnly={false}
                            />

                            {errors.hrMovimentoCaixa && <span className="text-danger">{errors.hrMovimentoCaixa.message}</span>}

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