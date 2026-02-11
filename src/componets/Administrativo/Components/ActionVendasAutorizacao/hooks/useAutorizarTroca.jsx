import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";


export const useAutorizarTroca = ({
    usuarioLogado,
    optionsModulos,
    selectedRows,
    setSelectedRows,
    handleClick
}) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usuarioAutorizado, setUsuarioAutorizado] = useState([]);
    const [cpfCliente, setCpfCliente] = useState();
    const [motivoTroca, setMotivoTroca] = useState();
    const [modalCliente, setModalCliente] = useState(false);
    const [optionsCPF, setOptionsCPF] = useState([]);
    const [validaDados, setValidaDados] = useState([]);

    const getIPUsuario = async () => {
        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            let usuarioIP = ipWhoisData?.ip;

            if (!usuarioIP) {
                const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
                usuarioIP = ipifyData?.ip;
            }

            setIpUsuario(usuarioIP);
            return usuarioIP;
        } catch (error) {
            console.error("Erro ao buscar IP:", error);
            return null;
        }
    };

    const onAuthFuncionario = async (callback) => {

        const { value: formValues } = await Swal.fire({
            title: 'Autorização',
            html: `
              <div class="d-block m-auto ">
                <label class="form-label" for="matricula">Matrícula</label>
                <div class="input-group">
    
                  <input type="text" id="matricula" class="swal2-input" placeholder="Matrícula" style="text-align: center;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                </div>
    
                <label class="form-label" style="margin-top: 1rem;" for="senha">Senha</label>
                <div class="input-group " >
                  <input type="password" id="senha" class="swal2-input" placeholder="Senha">
                </div>
    
              </div>
    
            
            `,
            width: '25rem',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Voltar',
            confirmButtonColor: '#886ab5',
            cancelButtonColor: '#3085d6',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const swalContainer = Swal.getPopup();
                swalContainer.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                });
            },
            preConfirm: async () => {
                const usuario = document.getElementById('matricula').value;
                const senha = document.getElementById('senha').value;

                const data = {
                    MATRICULA: usuario,
                    SENHA: senha,
                };

                try {
                    const response = await post('/auth-autorizar-excecao-venda', data);

                    if (response.data) {
                        return response.data;
                    } else {
                        Swal.showValidationMessage(`Credenciais inválidas`);
                    }
                } catch (error) {
                    Swal.showValidationMessage(`Erro ao autenticar: ${error.message}`);
                }
            }
        });

        if (formValues) {
            setIsLoggedIn(true);
            setUsuarioAutorizado(formValues);
            await onMotivo(callback, selectedRows);
        }

    }

    const onMotivo = async (callback) => {
        const stCortesia = selectedRows.some(item => item.DIFERENCAEMDIAS < 33);
        const stDefeito = selectedRows.some(item => item.DIFERENCAEMDIAS < 91);

        const resultado = await Swal.fire({
            titleText: 'Tipo da troca e motivo da Exceção?',
            html: `

                <div class="d-block m-auto" style="width: 100%;">
                    <label class="form-label text-dark" for="tipoTroca">Tipo</label>
                    <div class="pb-2">
                        <select id="tipoTroca" class="swal2-select" >
                            <option value=''>Selecione</option>
                            <option value='CORTESIA' ${stCortesia ? "disabled title='ESTA VENDA ESTÁ DENTRO DO PRAZO PARA ESTE TIPO'" : ""}>CORTESIA</option>
                            <option value='DEFEITO' ${stDefeito ? "disabled title='ESTA VENDA ESTÁ DENTRO DO PRAZO PARA ESTE TIPO'" : ""}>DEFEITO</option>
                        </select>
                    </div>
                </div>
                <div class="d-block " style="width: 100%; padding: 1rem;">
                    <label class="form-label text-dark mt-2" for="mtExcecao">Motivo Exceção</label>
                    <div class="input-group">
                        <input type="text" id="mtExcecao" class="swal2-input m-1 " placeholder="Digite o motivo da Exceção" style="text-align: left; text-transform: uppercase; width: 100%;">
                        <small class="form-label font-weight-bold text-dark">*Mínimo 10 caracteres</small>
                    </div>
                </div>
            
            `,
            width: '30rem',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Sair',
            confirmButtonColor: '#886ab5',
            cancelButtonColor: '#3085d6',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            customClass: {
                container: 'custom-swal',
                title: 'custom-swal-title'
            },
            didOpen: () => {
                const tipoSelect = document.getElementById('tipoTroca');
                const motivoInput = document.getElementById('mtExcecao');
                
                // Diminuir tamanho da fonte do título
                const title = Swal.getTitle();
                if (title) {
                    title.style.fontSize = '22px';
                    title.style.fontWeight = '500';
                }

                if (tipoSelect) {
                    tipoSelect.focus();

                    // Adicionar evento para debug
                    tipoSelect.addEventListener('change', (e) => {
                        console.log('Select mudou para:', e.target.value);
                    });
                }
            },
            preConfirm: async () => {
                const tipoTroca = document.getElementById('tipoTroca')?.value;
                const mtExcecao = document.getElementById('mtExcecao')?.value?.replace(/\s+/g, ' ').trim();

                if (!tipoTroca) {
                    Swal.showValidationMessage('Selecione o Tipo da Troca Antes de Prosseguir!');
                    return false;
                }

                if (!mtExcecao) {
                    Swal.showValidationMessage('Campo de motivo vazio, digite o motivo para prosseguir!');
                    return false;
                } else if (mtExcecao.replace(/\s+/g, '').length < 10) {
                    Swal.showValidationMessage(`Campo de motivo menor que 10 caracteres, Faltam: ${10 - mtExcecao.replace(/\s+/g, '').trim().length} caracteres!`);
                    return false;
                }

                return {
                    idFuncionario: usuarioLogado?.id,
                    tipoTroca,
                    mtExcecao
                };
            }
        });

        if (resultado.isConfirmed && resultado.value) {
            setMotivoTroca(resultado.value);
            // Chamar próxima função do callback se existir
            if (callback) {
                await onSubmitVoucher(resultado.value, selectedRows); // Corrigido: era 'row', agora 'selectedRows'
            }
            return resultado.value;
        }

        return false;
    };

    const onSubmitVoucher = async () => {

        const postData = {
            DIASAPOSCOMPRAR: selectedRows[0]?.DIFERENCAEMDIAS,
            IDPRODUTO: selectedRows[0]?.CPROD,
            IDVENDA: selectedRows[0]?.IDVENDA,
            IDVENDADETALHE: selectedRows[0]?.IDVENDADETALHE,
            MOTIVOEXCECAO: motivoTroca?.mtExcecao,
            QTD: selectedRows.reduce((total, item) => total + (item.QTDMODIFICADA || item.QTD), 0),
            TIPOTROCA: motivoTroca?.tipoTroca,
            USERAUTORIZADOR: usuarioAutorizado?.MATRICULA,
            VRPRODUTO: selectedRows[0]?.VPROD,
            VRTOTALLIQUIDO: selectedRows.reduce((total, item) => total + (item.VRTOTALLIQUIDO || 0), 0)

        }
        try {


            const response = await post('/alterar-vendas-prazo-excedido', postData);
            const textDados = JSON.stringify(postData)
            let textoFuncao = 'VOUCHER /CADASTRO DE CLIENTE';
            const ipUsuario = await getIPUsuario();

            const createLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createLogData)
            Swal.fire({
                title: 'Cadastro',
                text: 'Depósito cadastrado com Sucesso',
                icon: 'success',
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick()
            return response.data;

        } catch (error) {

            let textoFuncao = 'VOUCHER /ERRO AO CRIAR VOUCHER';
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(postData)
            const createLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            await post('/log-web', createLogData);

            Swal.fire({
                title: 'Erro',
                text: `Ocorreu um erro ao criar o voucher: ${error.message}. Tente novamente.`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }
    }


    return {
        onAuthFuncionario
    }
}
