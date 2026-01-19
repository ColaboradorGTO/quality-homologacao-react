import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../utils/dataAtual";
import { post, put } from "../api/funcRequest";
import { toFloat } from "../utils/toFloat";


export const usePagamento = ({dadosDetalheRecebimentos, optionsModulos, usuarioLogado}) => {
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
  const [dataParcela2, setDataParcela2] = useState('');
  const [dsTipoPagamentoTEF2, setDsTipoPagamentoTEF2] = useState('');
  const [nuOperacao2, setNuOperacao2] = useState('');
  const [nuAutorizacao2, setNuAutorizacao2] = useState('');
  const [vrCartao2, setVrCartao2] = useState('');
  const [qtdParcelas, setQtdParcelas] = useState('');
  const [qtdParcelas2, setQtdParcelas2] = useState('');
  const [dataParcela3, setDataParcela3] = useState('');
  const [dsTipoPagamentoTEF3, setDsTipoPagamentoTEF3] = useState('');
  const [nuOperacao3, setNuOperacao3] = useState('');
  const [nuAutorizacao3, setNuAutorizacao3] = useState('');
  const [vrCartao3, setVrCartao3] = useState('');
  const [qtdParcelas3, setQtdParcelas3] = useState('');
  const [dsTipoPagamentoPOS, setDsTipoPagamentoPOS] = useState('');
  const [nuOperacaoPOS, setNuOperacaoPOS] = useState('');
  const [nuAutorizacaoPOS, setNuAutorizacaoPOS] = useState('');
  const [vrPos, setVrPos] = useState('');
  const [qtdParcelasPOS, setQtdParcelasPOS] = useState('');
  const [dataParcelaPOS, setDataParcelaPOS] = useState('');
  const [dsTipoPagamentoPOS2, setDsTipoPagamentoPOS2] = useState('');
  const [nuOperacaoPOS2, setNuOperacaoPOS2] = useState('');
  const [nuAutorizacaoPOS2, setNuAutorizacaoPOS2] = useState('');
  const [vrPos2, setVrPos2] = useState('');
  const [qtdParcelasPOS2, setQtdParcelasPOS2] = useState('');
  const [dataParcelaPOS2, setDataParcelaPOS2] = useState('');
  const [vrVoucher, setVrVoucher] = useState('');
  const [nuVoucher, setNuVoucher] = useState('');
  const [motivoAlteracao, setMotivoAlteracao] = useState('');
  const [dataParcela1, setDataParcela1] = useState('');
  const [pagamentos, setPagamentos] = useState(false);
  const [itemAtual, setItemAtual] = useState(0);

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataParcela1(dataAtual);
    setDataParcela2(dataAtual);
    setDataParcela3(dataAtual);
  }, [])

  useEffect(() => {
    const venda = dadosDetalheRecebimentos?.[0];

    setValorDistribuir(parseFloat(venda?.venda?.VRTOTALVENDA));

    if(venda?.vendaPagamento?.length > 0) {

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
    const vrVoucherVal = 0; 

    const somaValores = vrDin + vrPix + vrCartao1 + vrPos1 + vrCartao2Val + vrCartao3Val + vrPos2Val + vrVoucherVal;
    
    const somaDifere = vrDistribuir2 - somaValores;

    setValorDistribuir(parseFloat(somaDifere).toFixed(2));
 
  }, [valorDinheiro, valorPix, vrCartao, vrCartao2, vrCartao3, vrPos, vrPos2, dadosDetalheRecebimentos]);
  

  const enviarPagamento = async () => {
    if(optionsModulos[0]?.ALTERAR == 'False') {
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

    let valorDinheiroPagamento = 0;
    let valorPixPagamento = 0;
    let valorCartaoPagamento = 0;
    let valorCartaoPagamento2 = 0;
    let valorCartaoPagamento3 = 0;
    let valorPosPagamento = 0;
    let valorPosPagamento2 = 0;
    let valorVoucherPagamento = 0;

 
    if (valorDistribuir > 0) {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Valor a distribuir é menor que o valor da venda!',
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
      let nItemAtualLocal = itemAtual;

      if (valorDinheiro > 0) {
        nItemAtualLocal++; // ✅ INCREMENTA
        const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

        const dadosDinheiro = [{
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: idVenda,
          NITEM: nItemAtualLocal,
          TPAG: '000',
          DSTIPOPAGAMENTO: 'DINHEIRO',
          VALORRECEBIDO: parseFloat(valorDinheiro),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(valorDinheiro),
          DTPROCESSAMENTO: dataParcela1,
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,
          
        }]
        
        await post('/alterar-venda-pagamento', dadosDinheiro)

        valorDinheiroPagamento = parseFloat(valorDinheiro);

        
      } else {
        valorDinheiroPagamento  = 0;
      }

      if (valorPix > 0) {
        nItemAtualLocal++;
        const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`; 
        

        const dadosPix = [{
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: idVenda,
          NITEM: nItemAtualLocal,
          TPAG: '031',
          DSTIPOPAGAMENTO: 'PIX',
          VALORRECEBIDO: parseFloat(valorPix),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(valorPix),
          DTPROCESSAMENTO: dataParcela1,
          NOTEF: 'PIX',
          NUAUTORIZACAO: nuAutorizacao,
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,

        }]
      
        await post('/alterar-venda-pagamento', dadosPix)

        valorPixPagamento = parseFloat(valorPix);
        
      } else {
        valorPixPagamento = 0;
      }

      if (vrCartao > 0) {

        const qtd = parseInt(qtdParcelas) || 0;
        
        if(qtd == 0) {
          nItemAtualLocal++; // ✅ INCREMENTA
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;
    
          const dadosTEF = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoTEF.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoTEF.substring(4),
            VALORRECEBIDO: parseFloat(vrCartao),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrCartao),
            DTPROCESSAMENTO: dataParcela1,
            DTVENCIMENTO: dataParcela1,
            NPARCELAS: 0,
            NOTEF: 'TEF',
            NUAUTORIZADOR: dsTipoPagamentoTEF,
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacao,
            NSUTEF: nuOperacao,
            NSUAUTORIZADORA: nuOperacao,
            NUAOTORIZACAO: nuAutorizacao,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
    
          }]
      
          await post('/alterar-venda-pagamento', dadosTEF)
          valorCartaoPagamento = parseFloat(vrCartao);

        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrCartao / qtd).toFixed(2));

          for(i = 1; i <= qtdParcelas; i++) {
            nItemAtualLocal++; // ✅ INCREMENTA A CADA ITERAÇÃO
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcela1;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

              // Ajusta data se necessário
            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrCartao) {
                valorCredito = parseFloat((valorParcela - vrCartao).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrCartao) {
                valorCredito = parseFloat((vrCartao - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosTEF = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA: idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoTEF.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoTEF.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcela1,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: parseInt(qtdParcelas),
              NOTEF:'TEF',
              NOAUTORIZADOR: dsTipoPagamentoTEF.substring(4),
              NOCARTAO:'NÃO INFORMADO',
              NUOPERACAO: nuOperacao,
              NSUTEF: nuOperacao,
              NSUAUTORIZADORA:nuOperacao,
              NUAUTORIZACAO:nuAutorizacao,
              STCANCELADO:'False',
              IDFUNCIONARIO: usuarioLogado.id
            }]
          
            await post('/alterar-venda-pagamento', dadosTEF)

            valorCartaoPagamento = parseFloat(vrCartao);
          }
        }
      }

      if (vrCartao2 > 0) {
        const qtd = parseInt(qtdParcelas2) || 0;
        
        if(qtd == 0) {
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;
    
          const dadosTEF2 = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoTEF2.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoTEF2.substring(4),
            VALORRECEBIDO: parseFloat(vrCartao2),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrCartao2),
            DTPROCESSAMENTO: dataParcela2,
            DTVENCIMENTO: dataParcela2,
            NPARCELAS: 0,
            NOTEF: 'TEF',
            NUAUTORIZADOR: dsTipoPagamentoTEF2.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacao2,
            NSUTEF: nuOperacao2,
            NSUAUTORIZADORA: nuOperacao2,
            NUAOTORIZACAO: nuAutorizacao2,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
    
          }]

          await post('/alterar-venda-pagamento', dadosTEF2)
          valorCartaoPagamento2 = parseFloat(vrCartao2);

        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrCartao2 / qtd).toFixed(2));

          for(i = 1; i <= qtd; i++) {
            nItemAtualLocal++;
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcela2;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrCartao2) {
                valorCredito = parseFloat((valorParcela - vrCartao2).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrCartao2) {
                valorCredito = parseFloat((vrCartao2 - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosTEF2 = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA:idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoTEF2.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoTEF2.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcela2,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: parseInt(qtd),
              NOTEF:'TEF',
              NOAUTORIZADOR: dsTipoPagamentoTEF2.substring(4),
              NOCARTAO:'NÃO INFORMADO',
              NUOPERACAO: nuOperacao2,
              NSUTEF: nuOperacao2,
              NSUAUTORIZADORA:  nuOperacao2,
              NUAUTORIZACAO:  nuAutorizacao2,
              STCANCELADO:'False',
              IDFUNCIONARIO: usuarioLogado.id
            }]
        
            await post('/alterar-venda-pagamento', dadosTEF2)

            valorCartaoPagamento2 = parseFloat(vrCartao2);

          }
        }

      } else {
        valorCartaoPagamento2 = 0;
      }

      if (vrCartao3 > 0) {

        const qtd = parseInt(qtdParcelas3) || 0;
        if(qtdParcelas3 == 0) {
          nItemAtualLocal++;
          const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;
        
          const dadosTEF3 = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: idVenda,
            NITEM: nItemAtualLocal,
            TPAG: dsTipoPagamentoTEF3.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoTEF3.substring(4),
            VALORRECEBIDO: parseFloat(vrCartao3),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrCartao3),
            DTPROCESSAMENTO: dataParcela3,
            DTVENCIMENTO: dataParcela3,
            NPARCELAS: 0,
            NOTEF: 'TEF',
            NUAUTORIZADOR: dsTipoPagamentoTEF3.substring(4),
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacao3,
            NSUTEF: nuOperacao3,
            NSUAUTORIZADORA: nuOperacao3,
            NUAOTORIZACAO: nuAutorizacao3,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
    
          }]

          await post('/alterar-venda-pagamento', dadosTEF3)
          valorCartaoPagamento3 = parseFloat(vrCartao3);

        } else {
          let valorCredito = 0;
          let valorParcela = 0;
          const valor = parseFloat((vrCartao3 / qtd).toFixed(2));

          for(i = 1; i <= qtdParcelas3; i++) {
            nItemAtualLocal++;
            const idVendaPagamento = `${idVenda}-${nItemAtualLocal}`;

            valorParcela += valor;

            let dataVencimento = dataParcela3;
            if (i > 1) {
              for (let j = 1; j < i; j++) {
                dataVencimento = adicionarMeses(dataVencimento);
              }
            }

            const [ano, mes, dia] = dataVencimento.split('-').map(Number);
            if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataVencimento = `${ano}-${String(mes).padStart(2, '0')}-30`;
            } else if (mes === 2 && dia > 28) {
              const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
              dataVencimento = `${ano}-02-${ehBissexto ? '29' : '28'}`;
            }

            let valorFinal = valor;
            if (i === qtd) {
              if (valorParcela > vrCartao3) {
                valorCredito = parseFloat((valorParcela - vrCartao3).toFixed(2));
                valorFinal = valor - valorCredito;
              } else if (valorParcela < vrCartao3) {
                valorCredito = parseFloat((vrCartao3 - valorParcela).toFixed(2));
                valorFinal = valor + valorCredito;
              }
            }

            const dadosTEF3 = [{
              IDVENDAPAGAMENTO: idVendaPagamento,
              IDVENDA:idVenda,
              NITEM: nItemAtualLocal,
              TPAG: dsTipoPagamentoTEF3.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoTEF3.substring(4),
              VALORRECEBIDO: parseFloat(valorFinal),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorFinal),
              DTPROCESSAMENTO: dataParcela3,
              DTVENCIMENTO: dataVencimento,
              NPARCELAS: parseInt(qtd),
              NOTEF:'TEF',
              NOAUTORIZADOR: dsTipoPagamentoTEF3.substring(4),
              NOCARTAO:'NÃO INFORMADO',
              NUOPERACAO: nuOperacao3,
              NSUTEF: nuOperacao3,
              NSUAUTORIZADORA:  nuOperacao3,
              NUAUTORIZACAO:  nuAutorizacao3,
              STCANCELADO:'False',
              IDFUNCIONARIO: usuarioLogado.id
            }]
        
            await post('/alterar-venda-pagamento', dadosTEF3)

            valorCartaoPagamento3 = parseFloat(vrCartao3);
          }

        }

      }

      if (vrPos > 0) {
        if(qtdParcelasPOS == 0) {
          let nItemAtual = itemAtual + 1
          let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA+'-';
          idVendaPagamento = idVendaPagamento + nItemAtual;
        
          const dadosPOS = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
            NITEM: parseInt(nItemAtual),
            TPAG: dsTipoPagamentoPOS.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoPOS.substring(4),
            VALORRECEBIDO: parseFloat(vrPos),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrPos),
            DTPROCESSAMENTO: dataParcelaPOS,
            DTVENCIMENTO: dataParcelaPOS,
            NPARCELAS: 0,
            NOTEF: 'POS',
            NUAUTORIZADOR: dsTipoPagamentoPOS,
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacaoPOS,
            NSUTEF: nuOperacaoPOS,
            NSUAUTORIZADORA: nuOperacaoPOS,
            NUAOTORIZACAO: nuAutorizacaoPOS,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }]
      
          await post('/alterar-venda-pagamento', dadosPOS)

          valorPosPagamento = parseFloat(vrPos);
          
        } else {

          valorCreditoPos = 0;
          valorResultadoCreditoPos = 0;
          valorParcelaPos = 0;
          valorPos = parseFloat((vrPos/qtdParcelasPOS).toFixed(2));
          
          for(i = 1; i <= qtdParcelasPOS2; i++) {
            let nItemAtual = itemAtual + 1
            let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA;
            idVendaPagamento = idVendaPagamento + nItemAtual;

            valorParcelaPos += valorPos;

            if(i==1) {
              finalParcelaCreditoPos = dataParcelaPOS;
            } else {
              dataParcelaPOS = adicionarMeses(dataParcelaPOS);
            }

            const [ano, mes, dia] = finalParcelaCreditoPos.split('-').map(Number);
            const dataAjustada = new Date(ano, mes - 1, dia);

            if((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataAjustada.setDate(30);
            } else if(mes === 2 && ( dia > 28 || dia === 31)) {
              dataAjustada.setDate(dataAjustada.getDate() - (dia === 31 ? 3 : 2));
            }

            finalParcelaCreditoPos = format(dataAjustada, 'yyyy-MM-dd');
            if(i == qtdParcelasPOS) {
              if(valorParcelaPos > vrPos) {
                valorCreditoPos = parseFloat((valorParcelaPos - vrPos).toFixed(2));
                valorResultadoCreditoPos = valorCreditoPos - valorPos;
              }

              if(valorParcelaPos < vrPos) {
                valorCreditoPos = parseFloat((vrPos - valorParcelaPos).toFixed(2));
                valorResultadoCreditoPos = valorCreditoPos + valorPos;
              }

              if(valorParcelaPos == vrPos) {
                valorResultadoCreditoPos = valorPos; 
              }
            } else {
              valorResultadoCreditoPos = valorPos;
            }

            const dadosPOS = [{
              IDVENDAPAGAMENTO: idvendapag,
              IDVENDA:idresumo,
              NITEM: parseInt(nItemAtual),
              TPAG: dsTipoPagamentoPOS.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoPOS.substring(4),
              VALORRECEBIDO: parseFloat(valorResultadoCreditoPos),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorResultadoCreditoPos),
              DTPROCESSAMENTO: dataParcelaPOS,
              DTVENCIMENTO: finalParcelaCreditoPos,
              NPARCELAS: parseInt(qtdParcelasPOS),
              NOTEF:'POS',
              NOAUTORIZADOR: dsTipoPagamentoPOS,
              NOCARTAO:'NÃO INFORMADO',
              NUOPERACAO: nuOperacaoPOS,
              NSUTEF: nuOperacaoPOS,
              NSUAUTORIZADORA:  nuOperacaoPOS,
              NUAUTORIZACAO:  nuAutorizacaoPOS,
              STCANCELADO:'False',
              IDFUNCIONARIO: usuarioLogado.id
            }];
          
            await post('/alterar-venda-pagamento', dadosPOS)

            valorPosPagamento = parseFloat(vrPos)
          }

          valorPosPagamento = 0
        }
      } 
      
      if (vrPos2 > 0) {

        if(qtdParcelasPOS2 == 0) {
          let nItemAtual = itemAtual + 1
          let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA + '-';
          idVendaPagamento = idVendaPagamento + nItemAtual;
          
          const dadosPOS2 = [{
            IDVENDAPAGAMENTO: idVendaPagamento,
            IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
            NITEM: parseInt(nItemAtual),
            TPAG: dsTipoPagamentoPOS2.substring(0, 3),
            DSTIPOPAGAMENTO: dsTipoPagamentoPOS2.substring(4),
            VALORRECEBIDO: parseFloat(vrPos2),
            VALORDEDUZIDO: 0,
            VALORLIQUIDO: parseFloat(vrPos2),
            DTPROCESSAMENTO: dataParcelaPOS,
            DTVENCIMENTO: dataParcelaPOS2,
            NPARCELAS: 0,
            NOTEF: 'POS',
            NUAUTORIZADOR: dsTipoPagamentoPOS2,
            NOCARTAO: 'NÃO INFORMADO',
            NUOPERACAO: nuOperacaoPOS2,
            NSUTEF: nuOperacaoPOS2,
            NSUAUTORIZADORA: nuOperacaoPOS2,
            NUAOTORIZACAO: nuAutorizacaoPOS2,
            STCANCELADO: 'False',
            IDFUNCIONARIO: usuarioLogado.id,
          }]
      
          await post('/alterar-venda-pagamento', dadosPOS2)

          valorPosPagamento2 = parseFloat(vrPos2);
        
        } else {

          valorCreditoPos2 = 0;
          valorResultadoCreditoPos2 = 0;
          valorParcelaPos2 = 0;
          valorPos2 = parseFloat((vrPos2/qtdParcelasPOS2).toFixed(2));
          
          for(i = 1; i <= qtdParcelasPOS2; i++) {
            let nItemAtual = itemAtual + 1
            let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA;
            idVendaPagamento = idVendaPagamento + nItemAtual;

            valorParcelaPos2 += valorPos2;

            if(i==1) {
              finalParcelaCreditoPos2 = dataParcelaPOS2;
            } else {
              dataParcelaPOS2 = adicionarMeses(dataParcelaPOS2);
            }

            const [ano, mes, dia] = finalParcelaCreditoPos2.split('-').map(Number);
            const dataAjustada = new Date(ano, mes - 1, dia);

            if((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia === 31) {
              dataAjustada.setDate(30);
            } else if(mes === 2 && ( dia > 28 || dia === 31)) {
              dataAjustada.setDate(dataAjustada.getDate() - (dia === 31 ? 3 : 2));
            }

            finalParcelaCreditoPos2 = format(dataAjustada, 'yyyy-MM-dd');
            if(i == qtdParcelasPOS2) {
              if(valorParcelaPos2 > vrPos2) {
                valorCreditoPos2 = parseFloat((valorParcelaPos2 - vrPos2).toFixed(2));
                valorResultadoCreditoPos2 = valorCreditoPos2 - valorPos2;
              }

              if(valorParcelaPos2 < vrPos2) {
                valorCreditoPos2 = parseFloat((vrPos2 - valorParcelaPos2).toFixed(2));
                valorResultadoCreditoPos2 = valorCreditoPos2 + valorPos2;
              }

              if(valorParcelaPos2 == vrPos2) {
                valorResultadoCreditoPos2 = valorPos2; 
              }
            } else {
              valorResultadoCreditoPos2 = valorPos2;
            }

            const dadosPOS2 = [{
              IDVENDAPAGAMENTO: idvendapag,
              IDVENDA: idresumo,
              NITEM: parseInt(nItemAtual),
              TPAG: dsTipoPagamentoPOS2.substring(0, 3),
              DSTIPOPAGAMENTO: dsTipoPagamentoPOS2.substring(4),
              VALORRECEBIDO: parseFloat(valorResultadoCreditoPos2),
              VALORDEDUZIDO: 0,
              VALORLIQUIDO: parseFloat(valorResultadoCreditoPos2),
              DTPROCESSAMENTO: dataParcelaPOS,
              DTVENCIMENTO: finalParcelaCreditoPos2,
              NPARCELAS: parseInt(qtdParcelasPOS2),
              NOTEF:'POS',
              NOAUTORIZADOR: dsTipoPagamentoPOS2,
              NOCARTAO:'NÃO INFORMADO',
              NUOPERACAO: nuOperacaoPOS2,
              NSUTEF: nuOperacaoPOS2,
              NSUAUTORIZADORA:  nuOperacaoPOS2,
              NUAUTORIZACAO:  nuAutorizacaoPOS2,
              STCANCELADO:'False',
              IDFUNCIONARIO: usuarioLogado.id
            }];
          
            await post('/alterar-venda-pagamento', dadosPOS2)

            valorPosPagamento = parseFloat(vrPos2)

          }

          valorPosPagamento = 0
        }
      } 

      if (vrVoucher > 0) {
        let nItemAtual = itemAtual + 1
        let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA + '-';
        idVendaPagamento = idVendaPagamento + nItemAtual;

        const dadosVoucher = [{
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
          NITEM: parseInt(nItemAtual),
          TPAG: '024',
          DSTIPOPAGAMENTO: 'VOUCHER',
          VALORRECEBIDO: parseFloat(vrVoucher),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(vrVoucher),
          DTPROCESSAMENTO: dataParcelaPOS,
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,
        }]
        
        await post('/alterar-venda-pagamento', dadosVoucher)

        valorVoucherPagamento = parseFloat(vrVoucher);
      } else {
        valorVoucherPagamento = 0;
      }

      let vrTotalCartao = valorCartaoPagamento + valorCartaoPagamento2 + valorCartaoPagamento3;
      let vrTotalPos = valorPosPagamento + valorPosPagamento2 + valorPixPagamento;
      let vrConvenioPagamento = dadosDetalheRecebimentos[0].venda.VRRECCONVENIO
      const atualizarVenda = [{
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        VRRECDINHEIRO: parseFloat(valorDinheiroPagamento),
        VRRECCONVENIO: parseFloat(vrConvenioPagamento),
        VRRECCHEQUE: 0,
        VRRECCARTAO: vrTotalCartao,
        VRRECPOS: vrTotalPos,
        VRRECVOUCHER: valorVoucherPagamento,
      }]
      
      const response = await put('/atualiza-recebimento-venda/:id', atualizarVenda)
    
      return response.data;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Erro ao processar pagamento',
        text: error.message,
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'custom-swal' }
      });
      return false;
    }
  }

  const cancelarVendaPagamento = async () => {
    // 387.91

    
    if (valorDistribuir > 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'A soma dos valores é menor que o valor da Venda.',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return false;
    } else {
      const dados = {
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        STCANCELADO: 'True',
        DTULTIMAALTERACAO: getDataAtual(),
        IDFUNCIONARIOCANCELA: usuarioLogado.id,
        TXTMOTIVOCANCELA: motivoAlteracao
      };
      await put('/alterar-venda-pagamento/:id', dados)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Venda Alterada com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      enviarPagamento();
      return true;
    }
  };

  return {
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
    dataParcela2,
    setDataParcela2,
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
    dataParcela3,
    setDataParcela3,
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
    dataParcela1,
    setDataParcela1,
    pagamentos,
    setPagamentos,
    incluirCartao2,
    setIncluirCartao2,
    incluirCartao3,
    setIncluirCartao3,
    incluirPos2,
    setIncluirPos2,
    enviarPagamento,
    cancelarVendaPagamento
  };
};