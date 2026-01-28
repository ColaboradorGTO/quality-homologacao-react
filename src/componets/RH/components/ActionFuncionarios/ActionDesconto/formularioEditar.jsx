import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { Controller, useForm } from "react-hook-form";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schamaValidarFuncionario";
import Swal from "sweetalert2";
import { useEditarDescontoFuncionario } from "../hooks/useDescontoFuncionario";
export const FormularioEditar = ({
    handleClose,
    dadosDescontoFuncionarios,
    optionsModulos,
    usuarioLogado,
    handleClick,
    refetch
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        empresa,
        setEmpresa,
        cpf,
        setCpf,
        funcionario,
        setFuncionario,
        motivoDesconto,
        setMotivoDesconto,
        percentualDesconto,
        setPercentualDesconto,
        dataInicioDesconto,
        setDataInicioDesconto,
        dataFimDesconto,
        setDataFimDesconto,
        onSubmit,
    } = useEditarDescontoFuncionario({
        handleClose,
        dadosDescontoFuncionarios,
        optionsModulos,
        usuarioLogado,
        handleClick,
        refetch
    })

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                // empresaFuncionario: empresaSelecionada,

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
            //alert(`Erro de validação:\n${errorMessages.join('\n')}`);
        }

    }


    return (
        <Fragment>

            <Fragment>
                <form onSubmit={onSubmit} >

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-6 col-xl-12">

                                <InputFieldModal
                                    type="text"
                                    className="form-control input"
                                    readOnly={true}
                                    label="Empresa"
                                    value={empresa}
                                    onChangeModal={(e) => setEmpresa(e.target.value)}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-4 col-xl-4">


                                <InputFieldModal
                                    type="text"
                                    className="form-control input"
                                    readOnly={true}
                                    label="CPF"
                                    value={cpf}
                                    onChangeModa={(e) => setCpf(e.target.value)}

                                />
                            </div>
                            <div className="col-sm-8 col-xl-8">
                                <InputFieldModal
                                    type="text"
                                    className="form-control input"
                                    readOnly={true}
                                    label="Funcionário"
                                    value={funcionario}
                                    onChangeModal={(e) => setFuncionario(e.target.value)}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-12 col-xl-12">
                                <InputFieldModal
                                    type="text"
                                    className="form-control input"
                                    label="Motivo do Desconto"
                                    value={motivoDesconto}
                                    onChangeModal={(e) => setMotivoDesconto(e.target.value)}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3 col-md-4 col-xl-4">

                                <InputFieldModal
                                    type="text"
                                    className="form-control input"
                                    label="% Desconto Autorizado"
                                    value={percentualDesconto}
                                    onChangeModal={(e) => {
                                        const valor = e.target.value.replace(".", "").replace(",", ".");
                                        setPercentualDesconto(valor);
                                    }}

                                // onChangeModal={handleChangeValor}


                                />
                            </div>
                            <div className="col-sm-3 col-md-4 col-xl-4">

                                <InputFieldModal
                                    type="date"
                                    className="form-control input"
                                    label="Início Desconto"
                                    value={dataInicioDesconto}
                                    onChangeModal={(e) => setDataInicioDesconto(e.target.value)}

                                />
                            </div>
                            <div className="col-sm-3 col-md-4 col-xl-4">

                                <InputFieldModal
                                    type="date"
                                    className="form-control input"
                                    label="Fim Desconto"
                                    value={dataFimDesconto}
                                    onChangeModal={(e) => setDataFimDesconto(e.target.value)}

                                />
                            </div>
                        </div>
                    </div>

                </form>
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
            </Fragment>



        </Fragment>
    )
}