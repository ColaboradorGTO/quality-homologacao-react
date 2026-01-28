import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schamaValidarFuncionario";
import Swal from "sweetalert2";
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
    const [empresa, setEmpresa] = useState('');
    const [cpf, setCpf] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [motivoDesconto, setMotivoDesconto] = useState('');
    const [percentualDesconto, setPercentualDesconto] = useState('');
    const [dataInicioDesconto, setDataInicioDesconto] = useState('');
    const [dataFimDesconto, setDataFimDesconto] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [ipUsuario, setIpUsuario] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataInicioDesconto(dataAtual);
        setDataFimDesconto(dataAtual);
    })


    useEffect(() => {
        if (dadosDescontoFuncionarios) {
            setEmpresa(dadosDescontoFuncionarios[0]?.NOFANTASIA);
            setCpf(dadosDescontoFuncionarios[0]?.NUCPF);
            setFuncionario(dadosDescontoFuncionarios[0]?.NOFUNCIONARIO);
            setPercentualDesconto(dadosDescontoFuncionarios[0]?.PERCDESCUSUAUTORIZADO || "0");

        }

    }, [dadosDescontoFuncionarios]);

    const onSubmit = async (data) => {
        const putData = {
            DTINICIODESC: String(dataInicioDesconto),
            DTFIMDESC: String(dataFimDesconto),
            PERCDESCUSUAUTORIZADO: percentualDesconto ? Number(percentualDesconto) : 0,
            TXTMOTIVODESCONTO: String(motivoDesconto),
            IDFUNCALTERACAO: Number(usuarioLogado?.id),
            ID: Number(dadosDescontoFuncionarios[0]?.ID),

        }

        try {
            const response = await put('/funcionarios-desconto/:id', putData)


            Swal.fire({
                title: 'Atualização',
                text: 'Atualizção Realizada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(putData)
            const textoFuncao = 'RH/ATUALIZAR DESCONTO FUNCIONARIO AUTORIZADO';


            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            handleClick()
            handleClose()
            const responsePost = await post('/log-web', createData)


            return responsePost.data;
        } catch (error) {
            Swal.fire({
                title: 'Erro ao Atualizar',
                text: 'Erro ao Tentar Atualizar',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao parsear o usuário do localStorage:', error);
        }
    }

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                empresaFuncionario: empresaSelecionada,
                funcaoFuncionario: funcaoSelecionada,
                tipoFuncionario: tipoSelecionado,
                dataAdmissaoFuncionario: dataAdmissao,
                cpf: cpfFuncionario,
                nome: nomeFuncionario,
                localizacaoFuncionario: localizacaoSelcionada,
                categoriaContratacao: isChecked,
                salarioFuncionario: valorSalario,
                valorDesconroFuncionario: valorDesconto,
                execaoDescFuncionario: excecao,
                situacaoFuncionario: situacaoSelecionada,
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