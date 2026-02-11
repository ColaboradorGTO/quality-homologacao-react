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

    const onAuthFuncionario = async (callback, selectedRows) => {

        const { value: formValues } = await Swal.fire({
            title: 'Autorização',
            html: `
              <div class="d-block m-auto w-75">
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
            confirmButtonText: 'Entrar',
            cancelButtonText: 'Cancelar',
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
                    const response = await post('/auth-funcionario-create-voucher', data);

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

    const onMotivo = async (callback, row) => {
        // Calcular stCortesia e stDefeito baseado nos dias passados
        const stCortesia = row.some(item => item.DIFERENCAEMDIAS < 33);
        const stDefeito = row.some(item => item.DIFERENCAEMDIAS < 91);
        
        const resultado = await Swal.fire({
            title: 'Tipo da troca e motivo da Exceção?',
            html: `
                <div class="d-block m-auto" style="width: 50%;">
                    <label class="form-label text-dark" for="tipoTroca">Tipo</label>
                    <div class="pb-2">
                        <select id="tipoTroca" class="form-control">
                            <option value=''>Selecione</option>
                            <option value='CORTESIA' ${stCortesia ? "disabled title='ESTA VENDA ESTÁ DENTRO DO PRAZO PARA ESTE TIPO'" : ""}>CORTESIA</option>
                            <option value='DEFEITO' ${stDefeito ? "disabled title='ESTA VENDA ESTÁ DENTRO DO PRAZO PARA ESTE TIPO'" : ""}>DEFEITO</option>
                        </select>
                    </div>
                </div>
                <div class="d-block m-auto" style="width: 100%;">
                    <label class="form-label text-dark mt-2" for="mtExcecao">Motivo Exceção</label>
                    <div class="input-group">
                        <input type="text" id="mtExcecao" class="swal2-input m-1" placeholder="Digite o motivo da Exceção" style="text-align: left; text-transform: uppercase;">
                        <small class="form-label font-weight-bold text-dark">*Mínimo 10 caracteres</small>
                    </div>
                </div>
            `,
            width: '25rem',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Sair',
            cancelButtonColor: '#3085d6',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            customClass: {
                container: 'custom-swal',
            },
            didOpen: () => {
                const tipoSelect = document.getElementById('tipoTroca');
                const motivoInput = document.getElementById('mtExcecao');
                
                if (tipoSelect) {
                    tipoSelect.focus();
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
                await callback(resultado.value, row);
            }
            return resultado.value;
        }

        return false;
    };

    const onCpf = async (callback, response) => {
        const cpfVenda = optionsCPF?.[0]?.NUCPFCNPJ || '';
        const { value: cpfConfirmado } = await Swal.fire({
            title: 'Insira o CPF  ou CNPJ do Cliente',
            html: `          
                <div>
                    <input 
                        type="text" 
                        id="cpf" 
                        class="swal2-input " 
                        placeholder="Digite o CPF/CNPJ"  
                        style="text-align: center;"
                        value="${cpfVenda || ''}"
                        maxlength="18"
                    >
                    <small class="fw-700 text-muted">${cpfVenda ? `CPF da venda: ${cpfVenda}` : 'Digite o CPF do cliente'}</small>
                </div>    
            `,
            width: '25rem',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'custom-swal',
            },
            didOpen: () => {
                const swalContainer = Swal.getPopup();
                const cpfInput = document.getElementById('cpf');
                
                // Se CPF estiver vazio, focar no input para facilitar digitação
                if (!cpfVenda || cpfVenda === '') {
                    cpfInput.focus();
                }
                
                // Aplicar máscara de CPF em tempo real E verificar cliente automaticamente
                cpfInput.addEventListener('input', async (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 18);
                    
                    const cpfDigitado = e.target.value;
                    if (cpfDigitado.length == 11 || cpfDigitado.length == 14) {
                        try {
                            const response = await get(`/cliente-todos?numeroCpfCnpj=${cpfDigitado}`)
                            
                            if (response && response.data && response.data.length > 0) {
                                // Cliente existe - pode prosseguir
                                const confirmButton = swalContainer.querySelector('.swal2-confirm');
                                if (confirmButton) {
                                    confirmButton.style.backgroundColor = '#28a745'; // Verde
                                    confirmButton.textContent = 'Cliente Encontrado - Confirmar';
                                }
                            } else {
                                // Cliente não existe - fechar SweetAlert e abrir modal automaticamente
                                Swal.close();
                                
                                // Mostrar mensagem de cliente não encontrado
                                await Swal.fire({
                                    title: 'Cliente não encontrado',
                                    text: `O ${cpfDigitado.length === 11 ? 'CPF' : 'CNPJ'} digitado não está cadastrado. Redirecionando para cadastro...`,
                                    icon: 'info',
                                    timer: 2000,
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    customClass: {
                                        container: 'custom-swal',
                                    }
                                });
                                
                                setCpfCliente(cpfDigitado);
                                
                                return;
                            }
                        } catch (error) {
                            // Em caso de erro, também redirecionar automaticamente
                            Swal.close();
                            
                            // Mostrar mensagem de cliente não encontrado
                            await Swal.fire({
                                title: 'Cliente não encontrado',
                                text: `O ${cpfDigitado.length === 11 ? 'CPF' : 'CNPJ'} digitado não está cadastrado. Redirecionando para cadastro...`,
                                icon: 'info',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                customClass: {
                                    container: 'custom-swal',
                                }
                            });
                            
                            setCpfCliente(cpfDigitado);
                         
                            return;
                        }
                    } else {
                        // CPF incompleto - resetar botão
                        const confirmButton = swalContainer.querySelector('.swal2-confirm');
                        if (confirmButton) {
                            confirmButton.style.backgroundColor = '';
                            confirmButton.textContent = 'Confirmar';
                        }
                    }
                });
                
                swalContainer.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                });
            },
            preConfirm: () => {
                const valorOriginal = document.getElementById('cpf').value;

                const cpf = valorOriginal.replace(/\D/g, '');
                
                if (!cpf || cpf.length === 0) {
                    return Swal.showValidationMessage('CPF/CNPJ é obrigatório');
                }
                
                if (cpf.length !== 11 && cpf.length !== 14) {
                    return Swal.showValidationMessage('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos');
                }

                return cpf;
            },
        });

        if (cpfConfirmado) {
            try {
                const response = await get(`/cliente-todos?numeroCpfCnpj=${cpfConfirmado}`);

                if (response && response.data) {
                    const clienteData = response.data;
                    if (clienteData && clienteData.length > 0) {
                        // Unificar dados do cliente em uma única fonte
                        const dadosCliente = clienteData[0];
                        
                        setUsuarioAutorizado(prev => ({
                            ...prev,
                            cpf: cpfConfirmado,
                            clienteData: dadosCliente
                        }));
                        setCpfCliente(cpfConfirmado);
                        setOptionsCPF(clienteData); // Atualiza optionsCPF com os dados da API
                        await onSubmitVoucher(dadosCliente); // Passa os dados diretamente
                 
                    } else {                        
                        // Mostrar mensagem de cliente não encontrado
                        await Swal.fire({
                            title: 'Cliente não encontrado',
                            text: `O ${cpfConfirmado.length === 11 ? 'CPF' : 'CNPJ'} digitado não está cadastrado. Redirecionando para cadastro...`,
                            icon: 'info',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            customClass: {
                                container: 'custom-swal',
                            }
                        });
                        
                    
                    }
                } else {
                    console.log('❌ Resposta da API inválida (sem response.data)');
                    throw new Error('Erro ao buscar dados do cliente');
                }
            } catch (error) {                
                // Mostrar mensagem de cliente não encontrado
                await Swal.fire({
                    title: 'Cliente não encontrado',
                    text: `O ${cpfConfirmado.length === 11 ? 'CPF' : 'CNPJ'} digitado não está cadastrado. Redirecionando para cadastro...`,
                    icon: 'info',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        container: 'custom-swal',
                    }
                });

            }
        } else {
            console.log('❌ CPF não confirmado (usuário cancelou ou validação falhou)');
        }

    };

    const onSubmitVoucher = async (dadosClienteParam = null) => {
        // Determinar fonte dos dados do cliente (priorizar parâmetro, depois optionsCPF)
        const dadosCliente = dadosClienteParam || optionsCPF?.[0];
        setValidaDados(dadosCliente);
        if (!dadosCliente) {
            throw new Error('Dados do cliente não encontrados');
        }
        
        // Função para obter quantidade modificada ou original
  
        // Calcular VRVOUCHER total baseado nas quantidades modificadas
        let valorTotalVoucher = 0;
     

        let putData = {
            IDGRUPOEMPRESARIAL: usuarioLogado?.IDGRUPOEMPRESARIAL,
            IDEMPRESAORIGEM: usuarioLogado?.IDEMPRESA,
            IDCAIXAORIGEM: parseInt(99999),
            IDNFEDEVOLUCAO: 0,
            IDUSRINVOUCHER: usuarioLogado?.id,
            IDCLIENTE: dadosCliente?.IDCLIENTE,
            NUCPF: dadosCliente?.NUCPFCNPJ,
            VRVOUCHER: Number(parseFloat(valorTotalVoucher).toFixed(2)),
            STTIPOTROCA: '',
            MOTIVOTROCA: motivoTroca,
            IDUSRLIBERACAOCRIACAO: usuarioLogado?.id,
            detVoucher: detVoucherCalculado,
            produtosVoucher: produtosVoucherCalculado

        }
        try {
            if (!putData.IDCLIENTE) {
                throw new Error('ID do cliente não foi encontrado');
            }
            
            if (!putData.NUCPF) {
                throw new Error('CPF do cliente não foi encontrado');
            }
            
            if (!putData.MOTIVOTROCA) {
                throw new Error('Motivo da troca não foi informado');
            }


            const response = await post('/todos-web', putData);
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'VOUCHER /CADASTRO DE CLIENTE';
            const ipUsuario = await getIPUsuario();
            
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)
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
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: ipUsuario
            }
            await post('/log-web', postData);

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
        onSubmitVoucher,
        onAuthFuncionario,
        optionsCPF,
        modalCliente,
        setModalCliente,
        cpfCliente,
        setCpfCliente,
        onCpf
    }
}
