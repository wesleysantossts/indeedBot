# Indeed Bot

Bot de listagem em JSON de vagas cadastradas no Indeed por requisito.

## Como usar

- Clone esta aplicação no seu pc. 
- Entre na pasta ```script``` e instale as dependências.
- Dentro da mesma pasta, crie uma pasta chamada ```data```.
- No arquivo ```src/constants.js```, faça o seguinte nas constantes abaixo:
  - ```JOB_SEARCH```: insira as palavras-chave que realizarão a consulta no Indeed. 
  - ```JOB_KEYWORDS```: insira as palavras-chave que a descrição da vaga **deve conter** para você aplicar. 
  - ```JOB_KEYWORDS_EXCLUDE```: insira as palavras-chave que se tiver na descrição da vaga, a vaga será descartada.
  - ```WEIRD_SITES```: insira sites que publicam vagas no Indeed que você **não deseja** se candidatar.

## Tecnologias utilizadas

- [x] Javascript 
- [x] Node.js 
- [x] Puppeteer 
- [x] Git 

## Desenvolvimento

<table>
  <tr>
    <td style='border=1px solid #ddd; align="center'>
      <a href="https://github.com/wesleysantossts">
        <img src="https://avatars.githubusercontent.com/u/56703526?v=4" width="100px" alt="Wesley Santos"/>
        <br/>
        <sub>Wesley Santos</sub>
      </a>
    </td>
  </tr>
</table>