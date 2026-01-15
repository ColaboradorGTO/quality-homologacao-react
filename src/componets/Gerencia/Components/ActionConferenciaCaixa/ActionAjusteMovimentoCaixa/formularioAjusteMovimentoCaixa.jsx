import { Fragment, useEffect, useState } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { useAjusteMovimentoCaixa } from "../hook/actionAjusteMovimentoCaixa";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./schemaAjusteMovimentoCaixa";

export const FormularioAjusteMovimentoCaixa = ({ handleClose, dadosDetalheFechamento, usuarioLogado, optionsModulos }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register } = useForm({
        mode: "onChange"
    });
    const {
        empresa,
        setEmpresa,
        operadorCaixa,
        setOperadorCaixa,
        motivoAjuste,
        setMotivoAjuste,
        dataLancamento,
        setDataLancamento,
        dinheiroAjuste,
        setDinheiroAjuste,
        faturaInformada,
        setFaturaInformada,
        faturaAjuste,
        setFaturaAjuste,
        onSubmit
    } = useAjusteMovimentoCaixa({ handleClose, dadosDetalheFechamento, usuarioLogado, optionsModulos });

    const vrTotalAjusteFatura = dadosDetalheFechamento[0]?.TOTALAJUSTEDINHEIRO > 0 ? dadosDetalheFechamento[0]?.TOTALAJUSTEDINHEIRO : dadosDetalheFechamento[0]?.TOTALFECHAMENTODINHEIRO;

    const handleValidatedSubmit = async () => {
        try {

            const dadosParaValidar = {
                empresa: usuarioLogado?.NOFANTASIA ?? "",
                operadorCaixa: dadosDetalheFechamento[0]?.OPERADORFECHAMENTO ?? "",
                motivoAjusteSelecionado: motivoAjuste,
                dataLancamento: dataLancamento,
                dinheiroInformado: vrTotalAjusteFatura,
                dinheiroAjuste: dinheiroAjuste,
                faturaInformada: dadosDetalheFechamento[0]?.TOTALFECHAMENTOFATURA,
                faturaAjuste: faturaAjuste,
        };

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
};

return (
    <Fragment>
        <form onSubmit={handleSubmit(handleValidatedSubmit)} >

            <div class="form-group">
                <div class="row">

                    <div class="col-sm-6 col-xl-16">

                        <InputFieldModal
                            className="form-control input"
                            readOnly={true}
                            label="Empresa"
                            value={usuarioLogado?.NOFANTASIA}
                            onChangeModal={(e) => setEmpresa(e.target.value)}
                        />
                        {errors.empresa && (
                            <AlertError
                                error={errors.empresa}
                                onClose={clearErrors}
                                fieldName="empresa"
                            />
                        )}

                    </div>
                    <div class="col-sm-6 col-xl-16">

                        <InputFieldModal
                            className="form-control input"
                            readOnly={true}
                            label="Operador do Caixa"
                            value={dadosDetalheFechamento[0]?.OPERADORFECHAMENTO}
                            onChangeModal={(e) => setOperadorCaixa(e.target.value)}
                        />
                        {errors.operadorCaixa && (
                            <AlertError
                                error={errors.operadorCaixa}
                                onClose={clearErrors}
                                fieldName="operadorCaixa"
                            />
                        )}

                    </div>
                </div>
            </div>
            <div className="form-group">
                <div className="row">
                    <div class="col-sm-6 col-xl-4">

                        <Controller
                            name="motivoAjusteSelecionado"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Motivo do Ajuste"}
                                    name="motivoAjusteSelecionado"
                                    type="text"
                                    readOnly={false}
                                    value={motivoAjuste}
                                    onChange={(e) => setMotivoAjuste(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                        {/*    <InputFieldModal
                                type="text"
                                className="form-control input"

                                label="Motivo do Ajuste"
                                value={motivoAjuste}
                                onChangeModal={(e) => setMotivoAjuste(e.target.value)}
                                {...register("motivoAjuste", { required: true })}
                            /> */}
                    </div>

                </div>
            </div>
            <div className="form-group">
                <div className="row">

                    <div class="col-sm-6 col-xl-4">

                        <Controller
                            name="dataLancamento"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data Lançamento"}
                                    name="dataLancamento"
                                    type="datetime-local"
                                    readOnly={false}
                                    value={dataLancamento}
                                    onChange={(e) => setDataLancamento(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />

                        {/*    <InputFieldModal
                                type="datetime-local"
                                className="form-control input"

                                label="Data Lançamento"
                                value={dataLancamento}
                                onChangeModal={(e) => setDataLancamento(e.target.value)}
                                {...register("dataLancamento", { required: true })}

                            /> */}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="row">

                    <div class="col-sm-6 col-xl-4">

                        <Controller
                            name="dinheiroInformado"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Dinheiro Informado"}
                                    name="dinheiroInformado"
                                    type="text"
                                    readOnly={false}
                                    value={vrTotalAjusteFatura}
                                    onChange={(e) => setDinheiroInformado(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />

                        {/*       <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={true}
                                label="Dinheiro Informado"
                                value={vrTotalAjusteFatura}
                                onChangeModal={(e) => setDinheiroInformado(e.target.value)}
                                {...register("dinheiroInformado", { required: true })}
                            /> */}
                    </div>
                    <div class="col-sm-6 col-xl-4">


                        <Controller
                            name="dinheiroAjuste"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Dinheiro Ajuste"}
                                    name="dinheiroAjuste"
                                    type="text"
                                    readOnly={false}
                                    value={dinheiroAjuste}
                                    onChange={(e) => setDinheiroAjuste(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                        {/*     <InputFieldModal
                                type="text"
                                className="form-control input"

                                label="Dinheiro Ajuste"
                                value={dinheiroAjuste}
                                onChangeModal={(e) => setDinheiroAjuste(e.target.value)}
                                {...register("dinheiroAjuste", { required: true })}

                            /> */}
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="row">
                    <div class="col-sm-6 col-xl-6">


                        <Controller
                            name="faturaInformada"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Valor Depósito"}
                                    name="faturaInformada"
                                    type="text"
                                    readOnly={false}
                                    value={dadosDetalheFechamento[0]?.TOTALFECHAMENTOFATURA}
                                    onChange={(e) => setFaturaInformada(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                        {/*   <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={true}
                                value={dadosDetalheFechamento[0]?.TOTALFECHAMENTOFATURA}
                                onChangeModal={(e) => setFaturaInformada(e.target.value)}
                                label="Fatura Infrmada"
                            /> */}

                    </div>
                    <div class="col-sm-6 col-xl-6">

                        <Controller
                            name="faturaAjuste"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Fatura Ajuste"}
                                    name="faturaAjuste"
                                    type="text"
                                    readOnly={false}
                                    value={faturaAjuste}
                                    onChange={(e) => setFaturaAjuste(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                        {/*      <InputFieldModal
                                type="text"
                                className="form-control input"
                                value={faturaAjuste}
                                onChangeModal={(e) => setFaturaAjuste(e.target.value)}
                                label="Fatura Ajuste"
                            /> */}

                    </div>
                </div>
            </div>

            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                //onClickButtonCadastrar={handleValidatedSubmit}
                tipoBtnCadastrar={"submit"}
                textButtonCadastrar={"Ajuste Movimentação do Caixa"}
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

