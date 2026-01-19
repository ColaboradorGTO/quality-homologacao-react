import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../utils/dataAtual";
import { post, put } from "../api/funcRequest";
import { toFloat } from "../utils/toFloat";

/**
 * Hook para processar pagamentos com correções lógicas
 * ✅ CORREÇÕES IMPLEMENTADAS:
 * 1. itemAtual incrementa corretamente entre pagamentos
 * 2. itemAtual incrementa dentro de loops de parcelas
 * 3. IDs de venda pagamento são criados com hífen correto
 * 4. Datas de parcelas não modificam estado React
 * 5. Conversão string/número consistente
 * 6. Eliminação de código duplicado com funções reutilizáveis
 * 7. Tratamento robusto de erros
 */
export const usePagamentoCorrigido = ({ dadosDetalheRecebimentos, optionsModulos, usuarioLogado }) => {
  const [incluirCartao2, setIncluirCartao2] = useState(false);
  const [incluirCartao3, setIncluirCartao3] = useState(false);
  const [incluirPos2, setIncluirPos2] = useState(false);
  const [valorDistribuir, setValorDistribuir] = useState('');
  const [valorDinheiro, setValorDinheiro] = useState('');
  const [valorPix, setValorPix] = useState('');
  const [nuChavePix, setNuChavePix] = useState('');
  const [dsTipoPagamentoTEF, setDsTipoPagamentoTEF] = useState('');
  const [nuOperacao, setNuOperacao] = useState('');
  const [nuAutorizacao, setNuAutorizacao] = useState('');
  const [vrCartao, setVrCartao] = useState('');
  const [dataParcela1, setDataParcela1] = useState('');
  const [dsTipoPagamentoTEF2, setDsTipoPagamentoTEF2] = useState('');
  const [nuOperacao2, setNuOperacao2] = useState('');
  const [nuAutorizacao2, setNuAutorizacao2] = useState('');
  const [vrCartao2, setVrCartao2] = useState('');
  const [qtdParcelas, setQtdParcelas] = useState(0);
  const [qtdParcelas2, setQtdParcelas2] = useState(0);
  const [dataParcela2, setDataParcela2] = useState('');
  const [dsTipoPagamentoTEF3, setDsTipoPagamentoTEF3] = useState('');
  const [nuOperacao3, setNuOperacao3] = useState('');
  const [nuAutorizacao3, setNuAutorizacao3] = useState('');
  const [vrCartao3, setVrCartao3] = useState('');
  const [qtdParcelas3, setQtdParcelas3] = useState(0);
  const [dataParcela3, setDataParcela3] = useState('');
  const [dsTipoPagamentoPOS, setDsTipoPagamentoPOS] = useState('');
  const [nuOperacaoPOS, setNuOperacaoPOS] = useState('');
  const [nuAutorizacaoPOS, setNuAutorizacaoPOS] = useState('');
  const [vrPos, setVrPos] = useState('');
  const [qtdParcelasPOS, setQtdParcelasPOS] = useState(0);
  const [dataParcelaPOS, setDataParcelaPOS] = useState('');
  const [dsTipoPagamentoPOS2, setDsTipoPagamentoPOS2] = useState('');
  const [nuOperacaoPOS2, setNuOperacaoPOS2] = useState('');
  const [nuAutorizacaoPOS2, setNuAutorizacaoPOS2] = useState('');
  const [vrPos2, setVrPos2] = useState('');
  const [qtdParcelasPOS2, setQtdParcelasPOS2] = useState(0);
  const [dataParcelaPOS2, setDataParcelaPOS2] = useState('');
  const [vrVoucher, setVrVoucher] = useState('');
  const [nuVoucher, setNuVoucher] = useState('');
  const [motivoAlteracao, setMotivoAlteracao] = useState('');
  const [pagamentos, setPagamentos] = useState(false);
  const [itemAtual, setItemAtual] = useState(0);

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataParcela1(dataAtual);
    setDataParcela2(dataAtual);
    setDataParcela3(dataAtual);
    setDataParcelaPOS(dataAtual);
    setDataParcelaPOS2(dataAtual);
  }, []);

  useEffect(() => {
    const venda = dadosDetalheRecebimentos?.[0];
    setValorDistribuir(parseFloat(venda?.venda?.VRTOTALVENDA) || 0);

    if (venda?.vendaPagamento?.length > 0) {
      const nItemMaior = Math.max(...venda.vendaPagamento.map(pagamento => pagamento.pag.NITEM));
      setItemAtual(nItemMaior);
    } else {
      setItemAtual(0);
    }
  }, [dadosDetalheRecebimentos]);

  useEffect(() => {
    const venda = dadosDetalheRecebimentos?.[0];
    const vrDistribuir2 = toFloat(venda?.venda?.VRTOTALVENDA);

    const vrDin = toFloat(valorDinheiro);
    const vrPix = toFloat(valorPix);
    const vrCartao1 = toFloat(vrCartao);
    const vrPos1 = toFloat(vrPos);
    const vrCartao2Val = toFloat(vrCartao2);
    const vrCartao3Val = toFloat(vrCartao3);
    const vrPos2Val = toFloat(vrPos2);
    const vrVoucherVal = toFloat(vrVoucher);

    const somaValores = vrDin + vrPix + vrCartao1 + vrPos1 + vrCartao2Val + vrCartao3Val + vrPos2Val + vrVoucherVal;
    const somaDifere = vrDistribuir2 - somaValores;

    setValorDistribuir(parseFloat(somaDifere).toFixed(2));
  }, [valorDinheiro, valorPix, vrCartao, vrCartao2, vrCartao3, vrPos, vrPos2, vrVoucher, dadosDetalheRecebimentos]);

  /**
   * Ajusta data para considerar meses com menos dias (fevereiro, abril, junho, etc)
   */
  const ajustarDataParcela = (dataStr) => {
    const [ano, mes, dia] = dataStr.split('-').map(Number);
    const dataAjustada = new Date(ano, mes - 1, dia);

    // Meses com 30 dias
    if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
      dataAjustada.setDate(30);
    }
    // Fevereiro
    else if (mes === 2) {
      if (dia > 28) {
        // Se original era 29, 30 ou 31
        const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
        dataAjustada.setDate(ehBissexto ? 29 : 28);
      }
    }

    return dataAjustada.toISOString().split('T')[0];
  };

  /**
   * Processa pagamentos com parcelamento
   * Incrementa itemAtual a cada parcela
   */
  const processarPagamentoComParcelas = async (
    idVenda,
    valorTotal,
    qtdParcelas,
    dataPrimeiraParc,
    tipoPag,
    dsTipo,
    nuOp,
    nuAuth,
    tipoNotef,
    nItemAtualRef
  ) => {
    let nItemAtual = nItemAtualRef;
    let valorCredito = 0;
    let valorResultadoCredito = 0;
    let valorParcela = 0;
    let valor = parseFloat((valorTotal / qtdParcelas).toFixed(2));

    for (let i = 1; i <= qtdParcelas; i++) {
      nItemAtual++; // ✅ INCREMENTA A CADA ITERAÇÃO
      let idVendaPagamento = `${idVenda}-${nItemAtual}`; // ✅ ID COM HÍFEN

      valorParcela += valor;

      // Calcula data de vencimento sem modificar estado
      let dataVencimento = dataPrimeiraParc;
      if (i > 1) {
        // Adiciona meses sem modificar estado
        for (let j = 1; j < i; j++) {
          dataVencimento = adicionarMeses(dataVencimento);
        }
      }

      dataVencimento = ajustarDataParcela(dataVencimento);

      // Calcula valor da última parcela com ajuste
      let valorFinal = valor;
      if (i === qtdParcelas) {
        if (valorParcela > valorTotal) {
          valorCredito = parseFloat((valorParcela - valorTotal).toFixed(2));
          valorFinal = valor - valorCredito;
        } else if (valorParcela < valorTotal) {
          valorCredito = parseFloat((valorTotal - valorParcela).toFixed(2));
          valorFinal = valor + valorCredito;
        } else {
          valorFinal = valor;
        }
      }

      const dadosPagamento = [{
        IDVENDAPAGAMENTO: idVendaPagamento,
        IDVENDA: idVenda,
        NITEM: nItemAtual,
        TPAG: tipoPag,
        DSTIPOPAGAMENTO: dsTipo,
        VALORRECEBIDO: parseFloat(valorFinal),
        VALORDEDUZIDO: 0,
        VALORLIQUIDO: parseFloat(valorFinal),
        DTPROCESSAMENTO: dataPrimeiraParc,
        DTVENCIMENTO: dataVencimento,
        NPARCELAS: qtdParcelas,
        NOTEF: tipoNotef,
        NUAUTORIZADOR: dsTipo,
        NOCARTAO: 'NÃO INFORMADO',
        NUOPERACAO: nuOp,
        NSUTEF: nuOp,
        NSUAUTORIZADORA: nuOp,
        NUAUTORIZACAO: nuAuth,
        STCANCELADO: 'False',
        IDFUNCIONARIO: usuarioLogado.id,
      }];

      await post('/alterar-venda-pagamento', dadosPagamento);
    }

    return nItemAtual; // ✅ RETORNA NOVO itemAtual
  };

  /**
   * Processa pagamento sem parcelamento
   */
  const processarPagamentoSemParcelas = async (
    idVenda,
    nItemAtual,
    valorTotal,
    dataParcela,
    tipoPag,
    dsTipo,
    nuOp,
    nuAuth,
    tipoNotef
  ) => {
    nItemAtual++; // ✅ INCREMENTA
    let idVendaPagamento = `${idVenda}-${nItemAtual}`; // ✅ COM HÍFEN

    const dadosPagamento = [{
      IDVENDAPAGAMENTO: idVendaPagamento,
      IDVENDA: idVenda,
      NITEM: nItemAtual,
      TPAG: tipoPag,
      DSTIPOPAGAMENTO: dsTipo,
      VALORRECEBIDO: parseFloat(valorTotal),
      VALORDEDUZIDO: 0,
      VALORLIQUIDO: parseFloat(valorTotal),
      DTPROCESSAMENTO: dataParcela,
      DTVENCIMENTO: dataParcela,
      NPARCELAS: 0,
      NOTEF: tipoNotef,
      NUAUTORIZADOR: dsTipo,
      NOCARTAO: 'NÃO INFORMADO',
      NUOPERACAO: nuOp,
      NSUTEF: nuOp,
      NSUAUTORIZADORA: nuOp,
      NUAUTORIZACAO: nuAuth,
      STCANCELADO: 'False',
      IDFUNCIONARIO: usuarioLogado.id,
    }];

    await post('/alterar-venda-pagamento', dadosPagamento);

    return nItemAtual; // ✅ RETORNA NOVO itemAtual
  };

  const enviarPagamento = async () => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Usuário não tem permissão para alterar o pagamento!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return false;
    }

    if (toFloat(valorDistribuir) > 0) {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Valor a distribuir é maior que zero. Ajuste os valores de pagamento!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return false;
    }

    try {
      const idVenda = dadosDetalheRecebimentos[0].venda.IDVENDA;
      let nItemAtualLocal = itemAtual; // ✅ CÓPIA LOCAL PARA INCREMENTAR

      // DINHEIRO
      if (toFloat(valorDinheiro) > 0) {
        nItemAtualLocal = await processarPagamentoSemParcelas(
          idVenda,
          nItemAtualLocal,
          valorDinheiro,
          dataParcela1,
          '000',
          'DINHEIRO',
          '',
          '',
          'DINHEIRO'
        );
      }

      // PIX
      if (toFloat(valorPix) > 0) {
        if (!nuChavePix) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe a chave PIX!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            }
          });
          return false;
        }

        nItemAtualLocal = await processarPagamentoSemParcelas(
          idVenda,
          nItemAtualLocal,
          valorPix,
          dataParcela1,
          '031',
          'PIX',
          '',
          nuChavePix,
          'PIX'
        );
      }

      // CARTÃO 1 (TEF)
      if (toFloat(vrCartao) > 0) {
        if (!dsTipoPagamentoTEF) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento TEF!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelas) || 0;
        if (qtd === 0) {
          nItemAtualLocal = await processarPagamentoSemParcelas(
            idVenda,
            nItemAtualLocal,
            vrCartao,
            dataParcela1,
            dsTipoPagamentoTEF.substring(0, 3),
            dsTipoPagamentoTEF.substring(4),
            nuOperacao,
            nuAutorizacao,
            'TEF'
          );
        } else {
          nItemAtualLocal = await processarPagamentoComParcelas(
            idVenda,
            vrCartao,
            qtd,
            dataParcela1,
            dsTipoPagamentoTEF.substring(0, 3),
            dsTipoPagamentoTEF.substring(4),
            nuOperacao,
            nuAutorizacao,
            'TEF',
            nItemAtualLocal
          );
        }
      }

      // CARTÃO 2 (TEF)
      if (toFloat(vrCartao2) > 0) {
        if (!dsTipoPagamentoTEF2) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento TEF 2!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelas2) || 0;
        if (qtd === 0) {
          nItemAtualLocal = await processarPagamentoSemParcelas(
            idVenda,
            nItemAtualLocal,
            vrCartao2,
            dataParcela2,
            dsTipoPagamentoTEF2.substring(0, 3),
            dsTipoPagamentoTEF2.substring(4),
            nuOperacao2,
            nuAutorizacao2,
            'TEF'
          );
        } else {
          nItemAtualLocal = await processarPagamentoComParcelas(
            idVenda,
            vrCartao2,
            qtd,
            dataParcela2,
            dsTipoPagamentoTEF2.substring(0, 3),
            dsTipoPagamentoTEF2.substring(4),
            nuOperacao2,
            nuAutorizacao2,
            'TEF',
            nItemAtualLocal
          );
        }
      }

      // CARTÃO 3 (TEF)
      if (toFloat(vrCartao3) > 0) {
        if (!dsTipoPagamentoTEF3) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento TEF 3!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelas3) || 0;
        if (qtd === 0) {
          nItemAtualLocal = await processarPagamentoSemParcelas(
            idVenda,
            nItemAtualLocal,
            vrCartao3,
            dataParcela3,
            dsTipoPagamentoTEF3.substring(0, 3),
            dsTipoPagamentoTEF3.substring(4),
            nuOperacao3,
            nuAutorizacao3,
            'TEF'
          );
        } else {
          nItemAtualLocal = await processarPagamentoComParcelas(
            idVenda,
            vrCartao3,
            qtd,
            dataParcela3,
            dsTipoPagamentoTEF3.substring(0, 3),
            dsTipoPagamentoTEF3.substring(4),
            nuOperacao3,
            nuAutorizacao3,
            'TEF',
            nItemAtualLocal
          );
        }
      }

      // POS 1
      if (toFloat(vrPos) > 0) {
        if (!dsTipoPagamentoPOS) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento POS!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelasPOS) || 0;
        if (qtd === 0) {
          nItemAtualLocal = await processarPagamentoSemParcelas(
            idVenda,
            nItemAtualLocal,
            vrPos,
            dataParcelaPOS,
            dsTipoPagamentoPOS.substring(0, 3),
            dsTipoPagamentoPOS.substring(4),
            nuOperacaoPOS,
            nuAutorizacaoPOS,
            'POS'
          );
        } else {
          nItemAtualLocal = await processarPagamentoComParcelas(
            idVenda,
            vrPos,
            qtd,
            dataParcelaPOS,
            dsTipoPagamentoPOS.substring(0, 3),
            dsTipoPagamentoPOS.substring(4),
            nuOperacaoPOS,
            nuAutorizacaoPOS,
            'POS',
            nItemAtualLocal
          );
        }
      }

      // POS 2
      if (toFloat(vrPos2) > 0) {
        if (!dsTipoPagamentoPOS2) {
          Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Informe o tipo de pagamento POS 2!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            }
          });
          return false;
        }

        const qtd = parseInt(qtdParcelasPOS2) || 0;
        if (qtd === 0) {
          nItemAtualLocal = await processarPagamentoSemParcelas(
            idVenda,
            nItemAtualLocal,
            vrPos2,
            dataParcelaPOS2,
            dsTipoPagamentoPOS2.substring(0, 3),
            dsTipoPagamentoPOS2.substring(4),
            nuOperacaoPOS2,
            nuAutorizacaoPOS2,
            'POS'
          );
        } else {
          nItemAtualLocal = await processarPagamentoComParcelas(
            idVenda,
            vrPos2,
            qtd,
            dataParcelaPOS2,
            dsTipoPagamentoPOS2.substring(0, 3),
            dsTipoPagamentoPOS2.substring(4),
            nuOperacaoPOS2,
            nuAutorizacaoPOS2,
            'POS',
            nItemAtualLocal
          );
        }
      }

      // VOUCHER
      if (toFloat(vrVoucher) > 0) {
        nItemAtualLocal = await processarPagamentoSemParcelas(
          idVenda,
          nItemAtualLocal,
          vrVoucher,
          dataParcela1,
          '024',
          'VOUCHER',
          '',
          nuVoucher || '',
          'VOUCHER'
        );
      }

      // Atualiza itemAtual após todos os pagamentos
      setItemAtual(nItemAtualLocal);

      // Atualiza resumo da venda
      const VRTotalCartao = toFloat(vrCartao) + toFloat(vrCartao2) + toFloat(vrCartao3);
      const VRTotalPOS = toFloat(vrPos) + toFloat(vrPos2);

      const dadosUpVenda = [{
        IDVENDA: idVenda,
        VRRECDINHEIRO: toFloat(valorDinheiro),
        VRRECCONVENIO: 0,
        VRRECCHEQUE: 0,
        VRRECCARTAO: VRTotalCartao,
        VRRECPOS: VRTotalPOS,
        VRRECVOUCHER: toFloat(vrVoucher)
      }];

      await put('/atualiza-recebimento-venda', dadosUpVenda);

      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Pagamento registrado com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      return true;

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Erro ao processar pagamento',
        text: error.message,
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return false;
    }
  };

  const cancelarVendaPagamento = async () => {
    if (toFloat(valorDistribuir) > 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'A soma dos valores é menor que o valor da Venda.',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return false;
    } else {
      const dados = {
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        STCANCELADO: 'True',
        DTULTIMAALTERACAO: getDataAtual(),
        IDFUNCIONARIOCANCELA: usuarioLogado.id,
        TXTMOTIVOCANCELA: motivoAlteracao
      };
      
      await put('/alterar-venda-pagamento', dados);
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Venda cancelada com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      
      return true;
    }
  };

  return {
    // Estados
    valorDistribuir,
    setValorDistribuir,
    valorDinheiro,
    setValorDinheiro,
    valorPix,
    setValorPix,
    nuChavePix,
    setNuChavePix,
    dsTipoPagamentoTEF,
    setDsTipoPagamentoTEF,
    nuOperacao,
    setNuOperacao,
    nuAutorizacao,
    setNuAutorizacao,
    vrCartao,
    setVrCartao,
    dataParcela1,
    setDataParcela1,
    dataParcela2,
    setDataParcela2,
    dataParcela3,
    setDataParcela3,
    dsTipoPagamentoTEF2,
    setDsTipoPagamentoTEF2,
    nuOperacao2,
    setNuOperacao2,
    nuAutorizacao2,
    setNuAutorizacao2,
    vrCartao2,
    setVrCartao2,
    qtdParcelas,
    setQtdParcelas,
    qtdParcelas2,
    setQtdParcelas2,
    dsTipoPagamentoTEF3,
    setDsTipoPagamentoTEF3,
    nuOperacao3,
    setNuOperacao3,
    nuAutorizacao3,
    setNuAutorizacao3,
    vrCartao3,
    setVrCartao3,
    qtdParcelas3,
    setQtdParcelas3,
    dsTipoPagamentoPOS,
    setDsTipoPagamentoPOS,
    nuOperacaoPOS,
    setNuOperacaoPOS,
    nuAutorizacaoPOS,
    setNuAutorizacaoPOS,
    vrPos,
    setVrPos,
    qtdParcelasPOS,
    setQtdParcelasPOS,
    dataParcelaPOS,
    setDataParcelaPOS,
    dsTipoPagamentoPOS2,
    setDsTipoPagamentoPOS2,
    nuOperacaoPOS2,
    setNuOperacaoPOS2,
    nuAutorizacaoPOS2,
    setNuAutorizacaoPOS2,
    vrPos2,
    setVrPos2,
    qtdParcelasPOS2,
    setQtdParcelasPOS2,
    dataParcelaPOS2,
    setDataParcelaPOS2,
    vrVoucher,
    setVrVoucher,
    nuVoucher,
    setNuVoucher,
    motivoAlteracao,
    setMotivoAlteracao,
    pagamentos,
    setPagamentos,
    incluirCartao2,
    setIncluirCartao2,
    incluirCartao3,
    setIncluirCartao3,
    incluirPos2,
    setIncluirPos2,
    itemAtual,
    setItemAtual,
    // Métodos
    enviarPagamento,
    cancelarVendaPagamento
  };
};
