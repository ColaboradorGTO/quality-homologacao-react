import { Fragment } from "react"
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../../../Formularios/FormField";
//import { schema } from "./schemaCadastrarQuebraCaixa";
import { useCadastrarAlvara } from "../../../hooks/actionCriarAlvara";
import { BsBuilding, BsPerson } from "react-icons/bs";
import Select from "react-select"
import { AiOutlineFileText } from "react-icons/ai";

//import { ActionListaAlvaraPrefeitura } from "./ActionAvaraPrefeituraLista/actionListaAlvaraPrefeitura.jsx";

export const FormularioCadastrarActionAlvara = ({ show, dadosAlvaraEmpresaSelecionada, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos, refetchAlvaraEmpresa }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register } = useForm({
        mode: "onChange"
    });
    const {
        onSubmit,
        empresa,
        setEmpresa,
        motivoAjuste,
        setMotivoAjuste,
        dataLancamento,
        dataAtualFormatada,
        setDataAtualFormatada,
        dinheiroInformado,
        setDinheiroInformado,
        dinheiroAjuste,
        setDinheiroAjuste,
        dadosQuebraCaixasModal,
        setDadosQuebraCaixasModal,
        modalVisivelImprimir,
        setModalVisivelImprimir,
        modalQuebraVisivel,
        setModalQuebraVisivel,
        dados,
        operador,
        setOperador,
        setDataLancamento,
        dataTableRef
    } = useCadastrarAlvara({ show, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos });

    const handleValidatedSubmit = async () => {
        try {

            const dadosParaValidar = {
                Empresa: usuarioLogado?.NOFANTASIA,
                operador: usuarioLogado?.NOFUNCIONARIO,
                historicoDigitado: motivoAjuste,
                dataLancamento: dados?.[0]?.DTHORAFECHAMENTOCAIXA,
                dinheiroInformado: dadosDetelheCaixa?.[0]?.TOTALFECHAMENTOVRQUEBRACAIXA,
                dinheiroAjuste: dinheiroAjuste
            };

            // await schema.validate(dadosParaValidar, { abortEarly: false });
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
            //console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    };

    const options = [
        { value: 'Todos', label: 'Todos' },
        { value: 'Ativo', label: 'Ativo' },
        { value: 'Inativo', label: 'Inativo' },
    ];
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)} >
                <span class="d-flex align-items-center">
                    <AiOutlineFileText size={25} />
                    <h4 class="font-weight-bold" style={{ margin: 0, marginLeft: "10px" }}>
                        PREFEITURA (LICENÇA DE FUNCIONAMENTO)
                    </h4>
                </span>
                <div class="form-group">

                    <div class="row mt-3">

                        <div class="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Status</label>
                            <Select

                                label={"Despesa"}
                                options={options.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={""}
                                onChange={(e) => setTipoIndicacaoIE(e)}
                                isSearchable={true}
                                menuIsOpen={false}
                            />
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Dt. Inicio:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Dt. Inicio:"}
                                        name="Dt. Inicio:"
                                        type="date"
                                        value={""}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Dt. Inicio:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Dt. Fim:"}
                                        name="Dt. Fim:"
                                        type="date"
                                        value={""}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Status</label>
                            <Select

                                label={"Despesa"}
                                options={options.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                defaultInputValue={"Todos"}
                                //onChange={(e) => setTipoIndicacaoIE(e)}
                                isSearchable={true}
                                menuIsOpen={false}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Metragem:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Metragem:"}
                                        name="Metragem:"
                                        type="text"
                                        value={"metragem"}
                                        onChange={(e) => setMetragem(e.target.value).replace(/\D/g, "")}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="DETALHEANDAMENTO"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        {...field}
                                        label="Detalhe Andamento"
                                        type="textarea"
                                        errors={errors}
                                        width="100%"
                                        height="120px"
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Anexar Arquivos:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Anexar Arquivos:"}
                                        name="Anexar Arquivos:"
                                        type="file"
                                        value={""}
                                        errors={errors}
                                        width="100px"
                                        height="100px"
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

            </form>

            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                onClickButtonCadastrar={handleValidatedSubmit}
                tipoBtnCadastrar={"submit"}
                textButtonCadastrar={"Adicionar"}
                corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}