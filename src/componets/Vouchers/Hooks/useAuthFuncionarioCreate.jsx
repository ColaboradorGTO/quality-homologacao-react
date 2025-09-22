import { useState } from 'react';
import Swal from 'sweetalert2';
import { get, post } from '../../../api/funcRequest';
import { validarCPF, mascaraCPF } from '../../../utils/formatCPF';
import { mascaraCNPJ, validarCNPJ } from '../../../utils/mascaraCNPJ';
import { useEffect } from 'react';
import { ActionCadastroClienteVoucherCPF } from '../ActionCreateVoucher/ActionCadastroCliente/ActionCadastroCPF/actionCadastroClienteVoucheCPF';

export const useAuthFuncionarioCreate = ({
  dadosVoucherLogin,
  usuarioLogado,
  selectedRows,
  dadosVisualizarProdutos,
  optionsModulos,
  modalCadastroClienteCPF,
  setModalCadastroClienteCPF
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioAutorizado, setUsuarioAutorizado] = useState([]);
  const [cpfCliente, setCpfCliente] = useState();
  const [motivoTroca, setMotivoTroca] = useState();
  const [modalCliente, setModalCliente] = useState(false);
  const [optionsCPF, setOptionsCPF] = useState([]);


  const onAuthFuncionario = async (callback, selectedRows) => {
    if (dadosVoucherLogin) {

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

        // Chama o onMotivo após login bem-sucedido
        await onMotivo(callback, selectedRows);
      }
    };
  }

  const onMotivo = async (callback, row) => {
    if (dadosVoucherLogin) {
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

        // Usa o CPF já presente em dadosVisualizarProdutos
        const cpf = dadosVisualizarProdutos[0]?.venda.DEST_CPF || dadosVisualizarProdutos[0]?.venda.DEST_CNPJ;

        if (!cpf) {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'CPF do cliente não encontrado nos dados do produto.',
          });
        }

        if (cpf) {
          try {

            const response = await get(`/cliente-todos?numeroCpfCnpj=${cpf}`);

            const clienteData = await response.data;
            console.log(clienteData, 'clientData')

            // Combina os dados do login com motivo, cpf e clienteData
            setUsuarioAutorizado(prev => ({ ...prev, motivo, cpf, clienteData }));
            setIsLoggedIn(true);

            await onCpf(clienteData);

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
    }
  };

  const onCpf = async (callback) => {
    if (dadosVoucherLogin) {
      // Pega o CPF da venda se disponível
      const cpfVenda = optionsCPF?.[0]?.NUCPFCNPJ || '';

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
          // Busca dados do cliente pelo CPF
          const response = await get(`/cliente-todos?numeroCpfCnpj=${cpfConfirmado}`);

          if (response.ok) {
            const clienteData = await response.data;

            if (clienteData && clienteData.length > 0) {
              // Cliente existe - apenas confirma e prossegue
              setUsuarioAutorizado(prev => ({
                ...prev,
                cpf: cpfConfirmado,
                clienteData: clienteData[0]
              }));
              setCpfCliente(cpfConfirmado);
              setOptionsCPF(clienteData);

              // Executa callback para prosseguir
              callback();
            } else {
              // Cliente não existe - abre modal de cadastro
              setCpfCliente(cpfConfirmado);
              setModalCadastroClienteCPF(true);
            }
          } else {
            throw new Error('Erro ao buscar dados do cliente');
          }
        } catch (error) {
          // Em caso de erro, abre modal de cadastro
          setCpfCliente(cpfConfirmado);
          setModalCadastroClienteCPF(true);
        }
      }
    }
  };

  return { onAuthFuncionario, onMotivo, onCpf, isLoggedIn, usuarioAutorizado, optionsCPF, modalCliente, setModalCliente, cpfCliente };
};