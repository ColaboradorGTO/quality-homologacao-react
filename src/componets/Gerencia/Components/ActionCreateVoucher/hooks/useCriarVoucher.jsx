import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { mascaraCPF, validarCPF } from "../../../../../utils/formatCPF";

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
            didOpen: () => {
                   const input = document.getElementById('motivo');

            // Remove caracteres especiais enquanto digita
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value
                    .normalize("NFD") // remove acentos e cedilha
                    .replace(/[\u0300-\u036f]/g, '') // remove marcas diacríticas
                    .replace(/[^A-Z0-9 ]/gi, '') // remove qualquer outro caractere especial
                    .replace(/\s{2,}/g, ' ') // evita múltiplos espaços
                    .toUpperCase(); // mantém maiúsculo
            });

            // Pressionar Enter confirma
            const swalContainer = Swal.getPopup();
            swalContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') Swal.clickConfirm();
            });
            },
            preConfirm: () => {
                const motivo = document.getElementById('motivo').value.replace(/[^a-zA-Z0-9 ]/g, '')?.replace(/\s{2,}/g, ' ');
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

            if (!cpf) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    html: `
                        <div>
                            CPF do cliente não encontrado nos dados do produto.<br/><br/>
                            <button id="btnCadastrarCliente" class="swal2-confirm swal2-styled" style="display:inline-block;">
                                Cadastrar Cliente
                            </button>
                        </div>
                    `,
                    showConfirmButton: false,
                    didOpen: () => {
                        const btn = document.getElementById('btnCadastrarCliente');
                        if (btn) {
                            btn.addEventListener('click', () => {
                                setModalCadastroClienteCPF(true);
                                Swal.close();
                            });
                        }
                    }
                });
            }

            if (cpf) {
                try {
                    const response = await get(`/clientes?cpfoucnpj=${cpf}`);

                    setUsuarioAutorizado(prev => ({ ...prev, motivo, cpf }));
                    setIsLoggedIn(true);
                    setOptionsCPF(response.data);
                    await onCpf();

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `Erro ao buscar os dados do cliente: ${error.message}`,
                    });
                    // setModalCadastroClienteCPF(true);
                }
            }
        }

    };

    const onCpf = async (callback, response) => {
        const cpfVenda = optionsCPF?.[0]?.NUCPFCNPJ || '';

        const { value: cpfConfirmado } = await Swal.fire({
            text: 'Confirmar CPF do Cliente',
            html: `
              <div>
                <input 
                  type="text" 
                  id="cpf" 
                  class="swal2-input" 
                  placeholder="Digite o CPF para confirmar"  
                  style="text-align: center;"
                  value="${mascaraCPF(cpfVenda)}"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 11)"
                >
                <small class="fw-700 text-muted">CPF da venda: ${mascaraCPF(cpfVenda)}</small>
              </div>      
              `,
              width: '25rem',
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonText: 'Confirmar',
              cancelButtonText: 'Cancelar',
              customClass: {
                  container: 'custom-swal',
                },
                didOpen: () => {
                const swalContainer = Swal.getPopup();
                swalContainer.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                });
            },
            preConfirm: () => {
                const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
                if (!cpf || cpf.length === 0) {
                    return Swal.showValidationMessage('CPF é obrigatório');
                }

                if (!validarCPF(cpf)) {
                    return Swal.showValidationMessage('CPF inválido, verifique e tente novamente');
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
                        setUsuarioAutorizado(prev => ({
                            ...prev,
                            cpf: cpfConfirmado,
                            clienteData: clienteData[0]
                        }));
                        setCpfCliente(cpfConfirmado);
                        setOptionsCPF(clienteData);

                        await onSubmit();
                    } else {
                        setCpfCliente(cpfConfirmado);
                        setModalCadastroClienteCPF(true);
                    }
                } else {
                    throw new Error('Erro ao buscar dados do cliente');
                }
            } catch (error) {
                console.log('Erro na busca do cliente:', error);
                setCpfCliente(cpfConfirmado);
                setModalCadastroClienteCPF(true);
            }
        }

    };

    const onSubmit = async () => {
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

            if (!putData.IDCLIENTE) {
                console.error('ERRO: IDCLIENTE não encontrado');
                throw new Error('ID do cliente não foi encontrado');
            }
            
            if (!putData.NUCPF) {
                console.error('ERRO: NUCPF não encontrado');
                throw new Error('CPF do cliente não foi encontrado');
            }
            
            if (!putData.MOTIVOTROCA) {
                console.error('ERRO: MOTIVOTROCA não encontrado');
                throw new Error('Motivo da troca não foi informado');
            }
        
                const response = await post('/todos-web', putData)
                
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'VOUCHER /CADASTRO DE CLIENTE';
                await getIPUsuario();
                
                const postData = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario
                }

                const responsePost = await post('/log-web', postData)
                Swal.fire({
                    title: 'Cadastro',
                    text: 'Voucher criado com Sucesso',
                    icon: 'success',
                    customClass: {
                        container: 'custom-swal',
                    }
                })
                handleClick()
                return responsePost.data;

        } catch (error) {
            let textoFuncao = 'VOUCHER /ERRO AO CADASTRAR CLIENTE';
            await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: ipUsuario
            }
            await post('/log-web', postData);

            Swal.fire({
                title: 'Erro',
                text: `Ocorreu um erro ao cadastrar o cliente: ${error.message}. Tente novamente.`,
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