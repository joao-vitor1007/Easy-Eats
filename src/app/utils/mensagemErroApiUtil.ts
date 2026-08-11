import { HttpErrorResponse } from '@angular/common/http';

export class MensagemErroApiUtil {
  /**
   * Extrai a mensagem amigável que o GlobalExceptionHandler do backend
   * retorna em `{ mensagem: "..." }`. Cai para um texto genérico quando a
   * resposta não tem esse formato (ex.: erro de rede, servidor fora do ar).
   *
   * @param erro Erro capturado no `error:` de um subscribe de HttpClient.
   * @param fallback Mensagem a usar quando o backend não informar uma.
   */
  static extrair = (erro: unknown, fallback: string): string => {
    if (erro instanceof HttpErrorResponse) {
      const mensagem = erro.error?.mensagem;
      if (typeof mensagem === 'string' && mensagem.trim().length > 0) {
        return mensagem;
      }
    }
    return fallback;
  };
}
