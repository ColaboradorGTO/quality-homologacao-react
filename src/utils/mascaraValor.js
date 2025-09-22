export const mascaraValor = (valor) => {
  valor = valor.toString().replace(/\D/g, "");
	valor = valor.toString().replace(/(\d{1})(\d{17})$/, "$1.$2");
	valor = valor.toString().replace(/(\d{1})(\d{14})$/, "$1.$2");
	valor = valor.toString().replace(/(\d{1})(\d{11})$/, "$1.$2");
	valor = valor.toString().replace(/(\d{1})(\d{8})$/, "$1.$2");
	valor = valor.toString().replace(/(\d{1})(\d{5})$/, "$1.$2");
	valor = valor.toString().replace(/(\d{1})(\d{2})$/, "$1,$2");
	return valor;
}

//  export const formatToDecimal = (value, qtdDecimal = 2) => {
//     if (!value) return '';

//     let numericValue = value.replace(/\D/g, '').padStart(3, '0');
//     let firstPart = numericValue.substring(0, numericValue.length - 2);
//     let lastPart = numericValue.substring(numericValue.length - 2);

//     numericValue = Number(`${firstPart}.${lastPart}`);

//     return maskValorEmDecimal(numericValue, qtdDecimal);
//   };

export const formatToDecimal = (value, qtdDecimal = 2) => {
	if (!value) return 0; // Retorna 0 se o valor for vazio
  
	// Remove todos os caracteres não numéricos
	let numericValue = value.replace(/\D/g, '').padStart(3, '0');
  
	// Separa a parte inteira da parte decimal
	let firstPart = numericValue.substring(0, numericValue.length - qtdDecimal);
	let lastPart = numericValue.substring(numericValue.length - qtdDecimal);
  
	// Concatena as partes e converte para número
	numericValue = Number(`${firstPart}.${lastPart}`);
  
	return numericValue; // Retorna um número
  };

export const maskValorEmDecimal = (valor, numMaxCasasDecimais = 2) => {
 return new Intl.NumberFormat('br-BR', {
	 style: 'decimal',
	 minimumFractionDigits: 2,
	 maximumFractionDigits: numMaxCasasDecimais
 }).format(valor)
}