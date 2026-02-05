import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post } from "../../../../api/funcRequest";
import { mascaraCPF, validarCPF } from "../../../../utils/formatCPF";

export const useCriarVoucher = ({
    usuarioLogado,
    optionsModulos,
    selectedRows,
    dadosVisualizarProdutos, 
    quantidade,
    quantidadesProdutos,
    modalCadastroClienteCPF, 
    setModalCadastroClienteCPF,
    handleClick
}) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usuarioAutorizado, setUsuarioAutorizado] = useState([]);
    const [cpfCliente, setCpfCliente] = useState();
    const [motivoTroca, setMotivoTroca] = useState();
    const [modalCliente, setModalCliente] = useState(false);
    const [optionsCPF, setOptionsCPF] = useState([]);
   

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
              <div class="text-dark fw-900">
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
                    IDEMPRESALOGADA: usuarioLogado?.IDEMPRESA,
                    IDGRUPOEMPRESARIAL: usuarioLogado?.IDGRUPOEMPRESARIAL,
                    IDVENDA: dadosVisualizarProdutos[0]?.venda.IDVENDA,
                    STTIPOTROCA: selectedRows?.STTIPOTROCA
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

        const { value: motivo } = await Swal.fire({
            title: 'Motivo da troca?',
            html: `
              <div>
                <input 
                  type="text" 
                  id="motivo" 
                  class="swal2-input" 
                  placeholder="Digite o Motivo"  
                  style="text-transform: uppercase"
                >
                <small class="fw-700">*Mínimo 10 caracteres</small>
              </div>      
            `,
            width: '25rem',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Sair',
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
            preConfirm: () => {
                const motivo = document.getElementById('motivo').value.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s{2,}/g, ' ');
                if (!motivo || motivo.length < 10) {
                    return Swal.showValidationMessage('O motivo deve ter no mínimo 10 caracteres');
                }

                if (motivo.length > 200) {
                    return Swal.showValidationMessage('Motivo da Troca Está Muito Grande, Abrevie!');
                }
                return motivo;
            },
        });

        if (motivo) {
            setMotivoTroca(motivo);

            const cpf = dadosVisualizarProdutos[0]?.venda.DEST_CPF || dadosVisualizarProdutos[0]?.venda.DEST_CNPJ;
            if (cpf == '') {
                await onCpf(callback, row);
            }
        }

    };

    const onCpf = async (callback, response) => {
        const cpfVenda = optionsCPF?.[0]?.NUCPFCNPJ || '';
        console.log('🔍 onCpf iniciado - cpfVenda:', cpfVenda);
        console.log('🔍 optionsCPF:', optionsCPF);

        const { value: cpfConfirmado } = await Swal.fire({
            title: 'Confirmar CPF do Cliente',
            html: `
              <div>
                <input 
                  type="text" 
                  id="cpf" 
                  class="swal2-input" 
                  placeholder="Digite o CPF para confirmar"  
                  style="text-align: center;"
                  value="${cpfVenda || ''}"
                  maxlength="11"
                >
                <small class="fw-700 text-muted">${cpfVenda ? `CPF da venda: ${mascaraCPF(cpfVenda)}` : 'Digite o CPF do cliente'}</small>
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
                    // Limpar input para apenas números
                    e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 11);
                    
                    const cpfDigitado = e.target.value;
                    console.log('🔍 CPF digitado:', cpfDigitado, 'Tamanho:', cpfDigitado.length);
                    
                    // Quando CPF tiver 11 dígitos, fazer GET automaticamente
                    if (cpfDigitado.length === 11) {
                        try {
                            console.log('🔄 CPF completo! Buscando cliente automaticamente...');
                            const response = await get(`/cliente-todos?numeroCpfCnpj=${cpfDigitado}`);
                            console.log('📡 Resposta automática da API:', response);
                            
                            if (response && response.data && response.data.length > 0) {
                                console.log('✅ Cliente encontrado automaticamente!', response.data[0]);
                                // Cliente existe - pode prosseguir
                                const confirmButton = swalContainer.querySelector('.swal2-confirm');
                                if (confirmButton) {
                                    confirmButton.style.backgroundColor = '#28a745'; // Verde
                                    confirmButton.textContent = 'Cliente Encontrado - Confirmar';
                                }
                            } else {
                                console.log('❌ Cliente NÃO encontrado - será direcionado para cadastro');
                                // Cliente não existe - vai para modal de cadastro
                                const confirmButton = swalContainer.querySelector('.swal2-confirm');
                                if (confirmButton) {
                                    confirmButton.style.backgroundColor = '#ffc107'; // Amarelo
                                    confirmButton.textContent = 'Cliente Não Encontrado - Cadastrar';
                                }
                            }
                        } catch (error) {
                            console.log('❌ Erro na busca automática do cliente:', error);
                            const confirmButton = swalContainer.querySelector('.swal2-confirm');
                            if (confirmButton) {
                                confirmButton.style.backgroundColor = '#dc3545'; // Vermelho
                                confirmButton.textContent = 'Erro na Consulta - Tentar Novamente';
                            }
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
                console.log('🔍 Confirmação final - CPF:', valorOriginal);
                
                const cpf = valorOriginal.replace(/\D/g, '');
                
                if (!cpf || cpf.length === 0) {
                    console.log('❌ Validação falhou: CPF vazio');
                    return Swal.showValidationMessage('CPF é obrigatório');
                }
                
                if (cpf.length !== 11) {
                    console.log('❌ Validação falhou: CPF não tem 11 dígitos');
                    return Swal.showValidationMessage('CPF deve ter 11 dígitos');
                }

                console.log('✅ CPF validado para confirmação:', cpf);
                return cpf;
            },
        });

        console.log('✅ CPF confirmado pelo usuário:', cpfConfirmado);

        if (cpfConfirmado) {
            try {
                console.log('🔄 Buscando cliente na API...');
                const response = await get(`/cliente-todos?numeroCpfCnpj=${cpfConfirmado}`);
                console.log('📡 Resposta da API:', response);
             
                if (response && response.data) {
                    const clienteData = response.data;
                    console.log('👤 Dados do cliente:', clienteData);
                    console.log('📊 Tamanho do array clienteData:', clienteData.length);

                    if (clienteData && clienteData.length > 0) {
                        console.log('✅ Cliente encontrado! Preparando para onSubmit...');
                        setUsuarioAutorizado(prev => ({
                            ...prev,
                            cpf: cpfConfirmado,
                            clienteData: clienteData[0]
                        }));
                        setCpfCliente(cpfConfirmado);
                        setOptionsCPF(clienteData);
                        console.log(cpfConfirmado, 'cpfConfirmado');
                        console.log(clienteData, 'clienteData');
                        
                        console.log('🚀 CHAMANDO onSubmit...');
                        await onSubmit();
                        console.log('✅ onSubmit executado com sucesso!');
                    } else {
                        console.log('❌ Cliente não encontrado (array vazio) - abrindo modal cadastro');
                        setCpfCliente(cpfConfirmado);
                        setModalCadastroClienteCPF(true);
                    }
                } else {
                    console.log('❌ Resposta da API inválida (sem response.data)');
                    throw new Error('Erro ao buscar dados do cliente');
                }
            } catch (error) {
                console.log('❌ Erro na busca do cliente:', error);
                setCpfCliente(cpfConfirmado);
                setModalCadastroClienteCPF(true);
            }
        } else {
            console.log('❌ CPF não confirmado (usuário cancelou ou validação falhou)');
        }

    };

    const onSubmit = async () => {
        console.log('🎯 onSubmit INICIADO!');
        console.log('📋 dadosVisualizarProdutos:', dadosVisualizarProdutos);
        console.log('📋 optionsCPF:', optionsCPF);
        console.log('📋 motivoTroca:', motivoTroca);
        
        // Função para obter quantidade modificada ou original
        const getQuantidadeFinal = (contadorIndex, quantidadeOriginal) => {
            return quantidadesProdutos?.[contadorIndex] || quantidadeOriginal;
        };

        // Calcular VRVOUCHER total baseado nas quantidades modificadas
        let valorTotalVoucher = 0;
        const detVoucherCalculado = dadosVisualizarProdutos[0]?.detalhe.map((item, index) => {
            const contadorIndex = index + 1;
            const quantidadeFinal = getQuantidadeFinal(contadorIndex, item.det.QTD);
            const valorUnitario = Number(parseFloat(item.det.VUNTRIB).toFixed(2));
            const valorTotalItem = valorUnitario * quantidadeFinal;
            
            valorTotalVoucher += valorTotalItem;

            return {
                IDPRODUTO: item.det.CPROD,
                QTD: Number(quantidadeFinal),
                VRUNIT: valorUnitario,
                VRTOTALBRUTO: Number(parseFloat(valorTotalItem).toFixed(2)),
                VRDESCONTO: Number(parseFloat(item.det.VPROD - item.det.VRTOTALLIQUIDO).toFixed(2)),
                VRTOTALLIQUIDO: Number(parseFloat(valorTotalItem).toFixed(2)),
                STATIVO: 'True',
                STCANCELADO: 'False',
            };
        }) || [];

        const produtosVoucherCalculado = dadosVisualizarProdutos[0]?.detalhe.map((item, index) => {
            const contadorIndex = index + 1;
            const quantidadeFinal = getQuantidadeFinal(contadorIndex, item.det.QTD);
            const valorUnitario = Number(parseFloat(item.det.VUNTRIB).toFixed(2));
            const valorTotalItem = valorUnitario * quantidadeFinal;

            return {
                IDVENDADETALHE: item.det.IDVENDADETALHE,
                STTROCA: 'True',
                QTD: Number(quantidadeFinal),
                VRTOTALBRUTO: Number(parseFloat(valorTotalItem).toFixed(2)),
                VDESC: Number(parseFloat(item.det.VPROD - item.det.VRTOTALLIQUIDO).toFixed(2)),
                VRTOTALLIQUIDO: Number(parseFloat(valorTotalItem).toFixed(2)),
            };
        }) || [];

        let putData = {
            IDGRUPOEMPRESARIAL: usuarioLogado?.IDGRUPOEMPRESARIAL,
            IDEMPRESAORIGEM: usuarioLogado?.IDEMPRESA,
            IDCAIXAORIGEM: parseInt(99999),
            IDNFEDEVOLUCAO: 0,
            IDUSRINVOUCHER: usuarioLogado?.id,
            IDVENDEDOR: dadosVisualizarProdutos[0]?.detalhe[0].det.VENDEDOR_MATRICULA,
            IDCLIENTE: optionsCPF[0]?.IDCLIENTE,
            NUCPF: optionsCPF[0]?.NUCPFCNPJ,
            VRVOUCHER: Number(parseFloat(valorTotalVoucher).toFixed(2)),
            IDRESUMOVENDAWEB: dadosVisualizarProdutos[0]?.venda.IDVENDA,
            STTIPOTROCA: '',
            MOTIVOTROCA: motivoTroca,
            IDUSRLIBERACAOCRIACAO: usuarioLogado?.id,
            detVoucher: detVoucherCalculado,
            produtosVoucher: produtosVoucherCalculado

        }
        try {
            console.log('🔍 Verificando dados obrigatórios...');
            console.log('📋 putData completo:', putData);

            if (!putData.IDCLIENTE) {
                console.error('ERRO: IDCLIENTE não encontrado');
                console.error('📋 optionsCPF atual:', optionsCPF);
                throw new Error('ID do cliente não foi encontrado');
            }
            
            if (!putData.NUCPF) {
                console.error('ERRO: NUCPF não encontrado');
                console.error('📋 optionsCPF atual:', optionsCPF);
                throw new Error('CPF do cliente não foi encontrado');
            }
            
            if (!putData.MOTIVOTROCA) {
                console.error('ERRO: MOTIVOTROCA não encontrado');
                console.error('📋 motivoTroca atual:', motivoTroca);
                throw new Error('Motivo da troca não foi informado');
            }

            console.log('✅ Dados obrigatórios verificados! Enviando para API...');
            const response = await post('/todos-web', putData);
            console.log('📡 Resposta da API /todos-web:', response);
                
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'VOUCHER /CADASTRO DE CLIENTE';

                console.log('Preparando log da operação...');
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
            console.error('❌ ERRO DETALHADO no onSubmit:', error);
            console.error('❌ Tipo do erro:', typeof error);
            console.error('❌ Stack trace:', error.stack);
            console.error('❌ putData que foi enviado:', putData);
            console.error('❌ Response error:', error.response?.data);
            console.error('❌ Status error:', error.response?.status);
            
            let textoFuncao = 'VOUCHER /ERRO AO CADASTRAR CLIENTE';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: ipUsuario
            }
            await post('/log-web', postData);

            Swal.fire({
                title: 'Erro',
                text: `Ocorreu um erro ao cadastrar o voucher: ${error.message}. Tente novamente.`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }
    }


    return {
        onSubmit,
        onAuthFuncionario,
        optionsCPF,
        modalCliente,
        setModalCliente,
        cpfCliente,
        setCpfCliente,
        onCpf
    }
}




   /* 
        1. na hora de criar um voucher,
        2. selecionar o tipo de troca,
        3. depois verificar se o cpf do usuario existe na api
        4. senão abrir a modal de editar o cliente cpf ou cnpj
        5. atualizar o cliente
        6. depois de atualizar voltar para o swal do cpf ou cnpj para confirmar a criação do voucher
    
        */