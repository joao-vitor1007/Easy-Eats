export class FormatarTelefoneUtil {
  /**
   * Formata um valor para o padrão de telefone brasileiro.
   *
   * Remove qualquer caractere não numérico e limita o valor a 11 dígitos.
   * - 10 dígitos (fixo): (XX) XXXX-XXXX
   * - 11 dígitos (celular): (XX) 9XXXX-XXXX
   *
   * @param valor String contendo o telefone com ou sem formatação.
   * @returns Telefone formatado.
   *
   * @example
   * formatar("11999998888");
   * // "(11) 99999-8888"
   *
   * @example
   * formatar("1133334444");
   * // "(11) 3333-4444"
   */
  static formatar = (valor: string): string => {
    let numeros = valor.replace(/\D/g, '');

    if (numeros.length > 11) {
      numeros = numeros.substring(0, 11);
    }

    return numeros
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
      .replace(/^(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3')
      .replace(/^(\d{2})(\d{1,4})$/, '($1) $2')
      .replace(/^(\d{1,2})$/, (_, digitos) => (digitos ? `(${digitos}` : ''));
  };
}
