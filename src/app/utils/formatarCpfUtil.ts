export class FormatarCPFUtil {
  /**
   * Formata um valor para o padrão de CPF (###.###.###-##).
   *
   * Remove qualquer caractere não numérico e limita o valor a 11 dígitos.
   *
   * @param valor String contendo o CPF com ou sem formatação.
   * @returns CPF formatado.
   */
  static formatar = (valor: string) => {
    let numerosCPF = valor.replace(/\D/g, '');

    if (numerosCPF.length > 11) {
      numerosCPF = numerosCPF.substring(0, 11);
    }

    return numerosCPF
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  };
}
