import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form";
import { useCriarFuncionario } from "../hooks/useCriarFuncionario";
import Select from 'react-select';
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { mascaraCPF, removerMascaraCPF } from "../../../../../utils/formatCPF";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { get } from "../../../../../api/funcRequest";

import { addDays, format, subDays } from "date-fns";
export const FormularioCadastrar = ({ handleClose }) => {
    const { register, handleSubmit, errors } = useForm();
    const {
        empresaSelecionada,
        setEmpresaSelecionada,
        subGrupoEmpresarialSelecionado,
        setSubGrupoEmpresarialSelecionado,
        funcaoSelecionada,
        setFuncaoSelecionada,
        cpfFuncionario,
        setCPFFuncionario,
        nomeFuncionario,
        setNomeFuncionario,
        localizacaoSelcionada,
        setLocalizacaoSelecionada,
        categoriaContratacao,
        setCategoriaContratacao,
        dataAdmissao,
        setDataAdmissao,
        valorSalario,
        setValorSalario,
        valorDesconto,
        setValorDesconto,
        situacaoSelecionada,
        setSituacaoSelecionada,
        tipoSelecionado,
        setTipoSelecionado,
        isChecked,
        setIsChecked,
        senha,
        setSenha,
        cpf,
        setCPF,
        ipUsuario,
        setIpUsuario,
        usuarioLogado,
        setUsuarioLogado,
        excecao,
        setExcecao,
        formularioVisivelLogin,
        setFormularioVisivelLogin,
        formularioVisivel,
        setFormularioVisivel,
        usuario,    
        setUsuario,
        optionsEmpresas,
        optionsCPF,
        handleRadioChange,
        handleChangeEmpresa,
        Funcoes,
        localizacao,
        situacao,
        Parceiro,
        onSubmit,
        loginConfirmacao
    } = useCriarFuncionario({handleClose});


    const maxDataAdmissao = format(new Date(), "yyyy-MM-dd");
    const minDataAdmissao = format(subDays(new Date(), 45), "yyyy-MM-dd");
    return (
        <Fragment>
            {formularioVisivel && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-xl-6">
                            <label className="form-label" htmlFor="empresaFuncionario">Empresa</label>

                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                options={optionsEmpresas.map((item) => ({
                                    value: item.IDEMPRESA,
                                    label: item.NOFANTASIA

                                }))}
                                value={empresaSelecionada}
                                onChange={handleChangeEmpresa}
                            />
                        </div>
                        <div className="col-sm-6 col-md-6 col-xl-6">
                            <label className="form-label" htmlFor="funcaoFuncionario">Função</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                options={Funcoes.map((item) => ({
                                    value: item.value,
                                    label: item.label

                                }))}
                                value={funcaoSelecionada}
                                onChange={(e) => setFuncaoSelecionada(e.value)}
                            />
                        </div>

                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-6 col-md-6 col-xl-6">
                            <label className="form-label">Tipo</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                options={Parceiro.map((item) => ({
                                    value: item.value,
                                    label: item.label

                                }))}
                                value={tipoSelecionado}
                                onChange={(e) => setTipoSelecionado(e.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="date"
                                className="form-control input"
                                label="Data Admissão"
                                value={dataAdmissao}
                                onChangeModal={e => setDataAdmissao(e.target.value)}
                               min={minDataAdmissao}
                               max={maxDataAdmissao}

                            />
                        </div>
                    </div>


                    <div className="row mt-4">
                        <div className="col-sm-4 col-xl-4">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                label="CPF"
                                value={mascaraCPF(cpfFuncionario)}
                                onChangeModal={e => setCPFFuncionario(e.target.value)}

                            />
                        </div>
                        <div className="col-sm-8 col-xl-8">
                            <InputFieldModal
                                type="text"
                                className="form-control input"

                                label="Funcionário"
                                value={nomeFuncionario}
                                onChangeModal={e => setNomeFuncionario(e.target.value)}

                            />
                        </div>
                    </div>



                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-16">
                            <label htmlFor="">Localização</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                options={localizacao.map((item) => ({
                                    value: item.value,
                                    label: item.label

                                }))}
                                value={localizacaoSelcionada}
                                onChange={(e) => setLocalizacaoSelecionada(e.value)}
                            />
                        </div>
                        <div className="col-sm-16 col-xl-16">
                            <label className="form-label">Categoria de Contratação</label>
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="radioCLT">
                                    <input
                                        id="radioCLT"
                                        type="radio"
                                        className="form-check-input"
                                        name="radioCategoria"
                                        isChecked={isChecked}
                                        onChange={handleRadioChange}
                                    /> CLT
                                </label>
                                <label className="form-check-label" htmlFor="radioPJ">
                                    <input
                                        id="radioPJ"
                                        type="radio"
                                        className="form-check-input"
                                        name="radioCategoria"
                                        isChecked={isChecked}
                                        onChange={handleRadioChange}
                                    /> PJ
                                </label>
                            </div>

                        </div>
                    </div>




                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                label="Valor Salário"
                                value={valorSalario}
                                onChangeModal={e => setValorSalario(e.target.value)}

                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={true}
                                label="Valor Desc."
                                value={valorDesconto}
                                onChangeModal={e => setValorDesconto(e.target.value)}

                            />
                        </div>
                       
                    </div>

                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                placeholder={"0,00"}
                                label="% Desc. Conv."
                                value={valorDesconto}
                                onChangeModal={e => setValorDesconto(e.target.value)}

                            />
                        </div>
                        <div className="col-sm-6 col-xl-6" 
                            style={{ 
                                
                                alignItems: 'center' ,
                                display: 'flex',
                                width: '100%',
                            }}
                        >
                            <div className="form-check">

                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="radioExcecao"
                                    onChange={() => { setFormularioVisivelLogin(true), setFormularioVisivel(false) }}
                                
                               />
                                <label className="form-check-label" htmlFor="">Exceção Desconto</label>
                            </div>

                           
                           

                        </div>

                    </div>
                    <div className="row mt-4">

                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="stativofuncionario">Situação</label>

                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                options={situacao.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={situacaoSelecionada}
                                onChange={(e) => setSituacaoSelecionada(e.value)}
                            />
                        </div>
                    </div>
                
                    <FooterModal
                        ButtonTypeFechar={ButtonTypeModal}
                        textButtonFechar={"Fechar"}
                        onClickButtonFechar={handleClose}
                        corFechar="secondary"
    
                        ButtonTypeConfirmar={ButtonTypeModal}
                        textButtonConfirmar={"Atualizar"}
                        onClickButtonConfirmar={handleSubmit(onSubmit)}
                        corConfirmar="success"
    
                    />
                </form>

            )}
            {formularioVisivelLogin && (
                    <Fragment>
        
                        <header style={{ display: 'flex', width: '100%' }}>
        
                        <h1 style={{ textAlign: 'center', width: '100%' }}>Autorização</h1>
                        </header>
                        <div className="form-group" style={{ marginTop: '2rem' }}>
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-xl-4">
        
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                label="Matrícula"
                                value={usuario}
                                onChangeModal={(e) => setUsuario(e.target.value)}
                                placeholder={"Digite sua matrícula"}
                            />
                            </div>
        
                            <div className="col-sm-4 col-md-4 col-xl-4">
        
                            <InputFieldModal
                                type="password"
                                className="form-control input"
                                label="Senha"
                                value={senha}
                                onChangeModal={(e) => setSenha(e.target.value)}
                                placeholder={"Digite sua senha"}
                            />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <FooterModal
                            ButtonTypeFechar={ButtonTypeModal}
                            textButtonFechar={"Voltar"}
                            onClickButtonFechar={() => { setFormularioVisivel(true), setFormularioVisivelLogin(false) }}
                            corFechar="secondary"
        
                            ButtonTypeCadastrar={ButtonTypeModal}
                            textButtonCadastrar={"Confirmar"}
                            onClickButtonCadastrar={loginConfirmacao}
                            corCadastrar="success"
        
                            />
                        </div>
                        </div>
                    </Fragment>
            )}
        </Fragment>
    )
}